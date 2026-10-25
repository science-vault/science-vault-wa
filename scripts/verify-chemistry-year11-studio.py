from pathlib import Path
from lxml import html
from PIL import Image,ImageDraw
import json,hashlib,base64,io,re
W=Path(__file__).resolve().parents[1]/'chemistry-year11-work';OUT=W/'output';records=[];images={}
for f in sorted(OUT.glob('*-u*.json')):
 batch=json.loads(f.read_text())
 for q in batch:
  assert q['subject']=='Chemistry' and q['year']==11 and q['bankFile']==f.name
  assert q['types']==[q['section']] and q['section'] in ['Multiple choice','Short answer','Extended answer']
  assert q['html'] and q['answerHtml'] and q['topics'] and q['subtopics']
  if q['markingMode']=='automatic':
   assert len(q['options'])==len(q['optionsHtml'])==4 and q['correctAnswer'] in range(4)
  for field in ['html','answerHtml','choiceFigures']:
   q['choiceFigures']=''.join(q['optionsHtml'])
   dom=html.fragment_fromstring(q[field],create_parent='div',parser=html.HTMLParser(huge_tree=True))
   assert not dom.xpath('.//script|.//iframe|.//object|.//embed'),(q['id'],'unsafe markup')
   for im in dom.xpath('.//img'):
    src=im.get('src','');assert src.startswith('data:image/'),q['id']
    digest=hashlib.sha256(src.encode()).hexdigest();images.setdefault(digest,(q['id']+(' KEY' if field=='answerHtml' else ''),src))
  assert not any(x in q['html'] for x in ['LVQUESTION','LVCONTEXT','LVSECTION']),q['id']
 records+=batch
assert len(records)==353
assert len({q['id'] for q in records})==len(records)==len({q['hash'] for q in records})
q=next(x for x in records if x['id']=='chemistry-2020-u1-q4')
assert all('→' in x and '<sub>' in x for x in q['optionsHtml']),q['optionsHtml']
q9=next(x for x in records if x['id']=='chemistry-2020-u12-q9')
assert all('data:image/webp' in x for x in q9['optionsHtml'])
q=next(x for x in records if x['id']=='chemistry-2020-u1-q2')
assert any('<sup>' in x for x in q['optionsHtml'])
entries=list(images.values())
for k in range((len(entries)+24)//25):
 sheet=Image.new('RGB',(1500,1500),'#eee');draw=ImageDraw.Draw(sheet)
 for i,(label,src) in enumerate(entries[k*25:(k+1)*25]):
  x=i%5*300;y=i//5*300;pic=Image.open(io.BytesIO(base64.b64decode(src.split(',')[1])));pic.thumbnail((290,265));sheet.paste(pic,(x,y+28));draw.text((x+3,y+3),label,fill='black')
 sheet.save(W/('diagrams-'+str(k)+'.jpg'))
report=json.loads((OUT/'practice-studio-chemistry-year11-report.json').read_text());report['uniqueDiagrams']=len(images);report['formatting']='Chemical subscripts, superscripts, Symbol-font glyphs and MathML preserved; MCQ choices use formatted HTML.';(OUT/'practice-studio-chemistry-year11-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({'imported':len(records),'images':len(images),'sheets':(len(entries)+24)//25,'types':report['types'],'held':report['held'],'duplicates':report['duplicates']}))
