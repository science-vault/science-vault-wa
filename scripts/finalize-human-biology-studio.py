from pathlib import Path
from collections import Counter
import json,re,hashlib,base64,io
from PIL import Image,ImageDraw
from lxml import html
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'human-biology-work';OUT=WORK/'output'
OVERRIDES={
 '2020-u3':{'5':('Science inquiry','Experimental design'),'28':('Nervous coordination','Neurons and nerve impulses'),'30':('Science inquiry','Experimental design'),'31':('Science inquiry','Experimental design')},
 '2020-u34':{'7':('Nervous coordination','Reflexes and sensory pathways'),'9':('Nervous coordination','Reflexes and sensory pathways'),'19':('Human evolution','Cultural evolution and migration'),'23':('Evolution','Fossils and dating'),'29':('Human evolution','Cultural evolution and migration')},
 '2021-u3':{'5':('Science inquiry','Data interpretation'),'6':('Science inquiry','Data interpretation'),'15':('Nervous coordination','Brain and spinal cord'),'21':('Disease and immunity','Adaptive immunity'),'22':('Nervous coordination','Brain and spinal cord'),'26':('Science inquiry','Reliability validity and accuracy'),'30':('Science inquiry','Experimental design'),'41':('Homeostasis','Water and salt balance')},
 '2021-u34':{'25':('Evolution','Natural selection and genetic change'),'26':('Evolution','Natural selection and genetic change')},
 '2022-u3':{'10':('Science inquiry','Scientific evidence and hypotheses'),'26':('Science inquiry','Reliability validity and accuracy'),'29':('Science inquiry','Experimental design'),'30':('Science inquiry','Experimental design')},
 '2022-u34':{'8':('Science inquiry','Ethics in research'),'13':('Science inquiry','Data interpretation')},
 '2023-u3':{'8':('Endocrine coordination','Hormones and endocrine glands'),'12':('Science inquiry','Data interpretation'),'13':('Science inquiry','Data interpretation'),'14':('Science inquiry','Data interpretation'),'20':('Endocrine coordination','Hormones and endocrine glands')},
 '2023-u34':{'14':('Evolution','Fossils and dating'),'31':('Science inquiry','Experimental design'),'38':('Disease and immunity','Innate immunity')},
 '2024-u3':{'21':('Homeostasis','Water and salt balance')},
 '2024-u34':{'8':('Evolution','Fossils and dating'),'9':('Evolution','Fossils and dating')}}
records=[];unique_images={}
for f in sorted(OUT.glob('practice-studio-human-biology-*-u*.json')):
 batch=json.loads(f.read_text());slug=re.search(r'biology-(.*)\.json',f.name)[1]
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
(OUT/'practice-studio-human-biology-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':')))
report=json.loads((OUT/'practice-studio-human-biology-report.json').read_text());report['types']=dict(Counter(q['types'][0] for q in records));report['uniqueQuestionDiagrams']=len(unique_images);report['topicReview']='Fallback topic tags reviewed against the question text';report['marking']='MCQs use the supplied answer keys; short and extended answers are self-reviewed.'
(OUT/'practice-studio-human-biology-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
figures=list(unique_images.values())
for k in range((len(figures)+29)//30):
 sheet=Image.new('RGB',(1200,1200),'#eeeeee');draw=ImageDraw.Draw(sheet)
 for i,(label,src) in enumerate(figures[k*30:(k+1)*30]):
  x=i%5*240;y=i//5*200;pic=Image.open(io.BytesIO(base64.b64decode(src.split(',')[1])));pic.thumbnail((230,170));sheet.paste(pic,(x,y+24));draw.text((x+1,y+2),label,fill='black')
 sheet.save(WORK/f'final-diagrams-{k}.jpg')
print(json.dumps({'imported':len(records),'types':report['types'],'uniqueQuestionDiagrams':len(unique_images),'held':report['held'],'contactSheets':(len(figures)+29)//30}))
