from pathlib import Path
from collections import Counter
import json,re,hashlib,base64,io
from PIL import Image,ImageDraw
from lxml import html
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'human-biology-year11-work';OUT=WORK/'output'
OVERRIDES={}
records=[];unique_images={}
report_path=OUT/'practice-studio-human-biology-year11-report.json'
pre_report=json.loads(report_path.read_text())
mismatched={2,9,11,15,16,21,25}

for f in sorted(OUT.glob('practice-studio-human-biology-*-u*.json')):
 batch=json.loads(f.read_text())
 if f.name=='practice-studio-human-biology-2020-u1.json':
  for q in batch:
   if q['number'] in mismatched and not any(h['source']==q['sourceFile'] and h['number']==q['number'] for h in pre_report['held']):
    pre_report['held'].append({'source':q['sourceFile'],'number':q['number'],'reason':'Supplied marking guide has a different question at this number; no matching answer key'})
  batch=[q for q in batch if q['number'] not in mismatched]
  # Source guide reverses these two otherwise identical questions.
  bynum={q['number']:q for q in batch}
  for n,keynum,answer in [(22,23,1),(23,22,1)]:
   q=bynum[n]
   # Guide Q23 marks B (left ventricle); guide Q22 marks C (6.25).
   q['correctAnswer']=1 if n==22 else 2
   letter=chr(65+q['correctAnswer'])
   import html as escaping
   q['answerHtml']='<p>Correct answer: <strong>'+letter+'</strong> — '+escaping.escape(q['options'][q['correctAnswer']])+'</p><p>Matched to question '+str(keynum)+' in the supplied guide by question text; source numbering differs.</p>'
  pre_report['corrections']=[x for x in pre_report['corrections'] if x.get('reason')!='Marking guide reverses Q22/Q23; answers matched by identical question and choices.']
  pre_report['corrections'].append({'source':'2020_hum_biol_unit_1_solutions(1).docx','reason':'Marking guide reverses Q22/Q23; answers matched by identical question and choices.'})
 slug=re.search(r'biology-(.*)\.json',f.name)[1]
 for q in batch:
  override=OVERRIDES.get(slug,{}).get(str(q['number']))
  if override:q['topics']=[override[0]];q['subtopics']=[override[1]];q['mixed']=False
  q['bankFile']=f.name
  dom=html.fragment_fromstring(q['html'],create_parent='div',parser=html.HTMLParser(huge_tree=True))
  # Strip source highlighting from practice prompts, retaining meaningful bold text.
  for node in dom.xpath('.//mark'):node.drop_tag()
  for im in dom.xpath('.//img'):
   src=im.get('src','');digest=hashlib.sha256(src.encode()).hexdigest()
   if src.startswith('data:image/'):unique_images.setdefault(digest,(q['id'],src))
  q['html']=''.join(html.tostring(n,encoding='unicode') for n in dom)
 f.write_text(json.dumps(batch,ensure_ascii=False,separators=(',',':')));records+=batch
assert len(records)==len({q['id'] for q in records})==len({q['hash'] for q in records})
index=[{k:v for k,v in q.items() if k not in ['html','answerHtml','options','correctAnswer']} for q in records]
(OUT/'practice-studio-human-biology-year11-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':')))
report=pre_report;
for exam in report['exams']:exam['imported']=sum(q['sourceFile']==exam['source'] for q in records)
report['totalImported']=len(records);report['types']=dict(Counter(q['types'][0] for q in records));report['uniqueQuestionDiagrams']=len(unique_images);report['topicReview']='Fallback topic tags reviewed against the question text';report['marking']='MCQs use the supplied answer keys; short and extended answers are self-reviewed.'
(OUT/'practice-studio-human-biology-year11-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
figures=list(unique_images.values())
for k in range((len(figures)+29)//30):
 sheet=Image.new('RGB',(1200,1200),'#eeeeee');draw=ImageDraw.Draw(sheet)
 for i,(label,src) in enumerate(figures[k*30:(k+1)*30]):
  x=i%5*240;y=i//5*200;pic=Image.open(io.BytesIO(base64.b64decode(src.split(',')[1])));pic.thumbnail((230,170));sheet.paste(pic,(x,y+24));draw.text((x+1,y+2),label,fill='black')
 sheet.save(WORK/f'final-diagrams-{k}.jpg')
print(json.dumps({'imported':len(records),'types':report['types'],'uniqueQuestionDiagrams':len(unique_images),'held':report['held'],'contactSheets':(len(figures)+29)//30}))
