from pathlib import Path
from lxml import html,etree as E
import importlib.util,re,json,copy,hashlib,shutil,html as escaping
import fitz
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'human-biology-year11-work';OUT=WORK/'output'
spec=importlib.util.spec_from_file_location('hb11',(WORK/'import_docx.py' if (WORK/'import_docx.py').exists() else ROOT/'scripts'/'import-human-biology-year11-studio.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
PAPER='2021_AEHBY_Semester_Two_Exam(1).pdf';KEY='2021_AEHBY_Semester_Two_Exam_KEY(1).pdf'
for name in [PAPER,KEY]:shutil.copyfile(ROOT/'upload'/name,WORK/'repaired-pdf'/name)
def headers(filename,mcq=True):
 doc=fitz.open(WORK/'repaired-pdf'/filename);records={};kind=None;last=0
 for pi,p in enumerate(doc):
  ls=m.helpers.lines(p)
  for t,b in ls:
   sec=m.section_of(t)
   if sec:kind=sec
   if kind=='Multiple choice' and mcq:
    match=re.match(r'^(\d+)\.(?:\s*(.*))?$',t)
    if match and int(match[1])==last+1 and last<30:
     last+=1;records[last]={'number':last,'type':'Multiple choice','marks':1,'prefix':[],'nodes':[],'choices':[]}
   match=re.match(r'^Question\s+(\d+)\b(?!\s*\(?continued)',t,re.I)
   if match and int(match[1])>=31 and int(match[1]) not in records:
    labels=[x for x,bb in ls if abs(bb.y0-b.y0)<12 and re.search(r'\(\d+\s*marks?\)',x,re.I)]
    if labels:
     n=int(match[1]);mark=int(re.search(r'\((\d+)\s*marks?\)',labels[0],re.I)[1]);records[n]={'number':n,'type':kind or 'Short answer','marks':mark,'prefix':[],'nodes':[],'choices':[]}
 return records
def content(doc,pieces,q,is_key=False):
 nodes=[];choices={};active=None
 for pi,clip in pieces:
  page=doc[pi];tables=[]
  try:
   for table in page.find_tables().tables:
    rect=fitz.Rect(table.bbox)
    if clip.contains(rect) and rect.width>80 and rect.height>20:
     rows=table.extract()
     if len(rows)>=2 and max(map(len,rows))>=2:tables.append((rect,rows))
  except Exception:pass
  events=[]
  for rect,rows in tables:
   table=html.Element('table')
   for row in rows:
    tr=E.SubElement(table,'tr')
    for cell in row:E.SubElement(tr,'td').text=m.clean(cell or '')
   events.append((rect.y0,rect.x0,table))
  for t,b in m.helpers.lines(page):
   if not t or not clip.contains(b) or any(rect.contains(b) for rect,rows in tables):continue
   if re.match(r'^(?:SEE NEXT|HUMAN BIOLOGY|©|Section |This section|Suggested working|Supplementary page|This page.*blank|End of |Question\s+\d+)',t,re.I):continue
   if re.fullmatch(r'[_\s]+|\d+\.?',t):continue
   if q['type']=='Multiple choice':
    match=re.match(r'^\(([a-d])\)\s*(.*)',t,re.I)
    if match:active=match[1].upper();choices[active]=[match[2]] if match[2] else [];continue
    if active:choices[active].append(t);continue
   p=html.Element('p');p.text=t;events.append((b.y0,b.x0,p))
  nodes.extend(n for y,x,n in sorted(events,key=lambda v:(round(v[0]/3)*3,v[1])))
 # Keep tables that contain the answer alternatives as visible source data.
 for n in nodes:
  if n.tag=='table':
   for row in n:
    match=re.match(r'^\(([a-d])\)\s*(.*)',m.text(row),re.I)
    if match:choices[match[1].upper()]=[match[2]]
 q={**q,'nodes':nodes,'choices':[{'letter':letter,'text':m.clean(' '.join(value)),'node':html.Element('p')} for letter,value in sorted(choices.items())]}
 return q
def main():
 paperq=headers(PAPER);keyq=headers(KEY,False)
 assert sorted(paperq)==list(range(1,max(paperq)+1)),sorted(paperq)
 doc,ranges,_=m.pdf_ranges(Path(PAPER),paperq);kd,kranges,_=m.pdf_ranges(Path(KEY),keyq)
 assert set(paperq)==set(ranges)
 keytext='\n'.join(p.get_text() for p in kd[:3]);answers={int(n):letter for n,letter in re.findall(r'(?m)^\s*(\d+)\s*\n\s*([A-D])\s*$',keytext)}
 assert set(answers)==set(range(1,31)),answers
 records=[];held=[];audits=[]
 for n,info in sorted(paperq.items()):
  q=content(doc,ranges[n],info);options=[];correct=None
  if info['type']=='Multiple choice':
   if [x['letter'] for x in q['choices']]!=['A','B','C','D']:held.append({'source':PAPER,'number':n,'reason':'Four choices could not be extracted'});continue
   options=[x['text'] for x in q['choices']];correct=ord(answers[n])-65;answer='<p>Correct answer: <strong>'+answers[n]+'</strong> — '+escaping.escape(options[correct])+'</p><p>Answer from the supplied exam marking guide.</p>'
  else:
   if n not in keyq or keyq[n]['marks']!=info['marks']:held.append({'source':PAPER,'number':n,'reason':'Paper and key total marks disagree','paperMarks':info['marks'],'keyMarks':keyq.get(n,{}).get('marks')});continue
   guide=content(kd,kranges[n],keyq[n],True);answer,_=m.biology_content(guide,kd,kranges[n],True)
  body,figures=m.biology_content(q,doc,ranges[n]);plain=' '.join(m.text(node) for node in q['nodes']);topics,subtopics=m.classify(q)
  # Figure pixels distinguish otherwise identical diagram prompts.
  photos=''.join(image.get('src','') for image in html.fragment_fromstring(body,create_parent='div').xpath('.//img'))
  digest=hashlib.sha256((re.sub(r'\W+','',plain.lower()+' '.join(options))+photos).encode()).hexdigest()
  item={'id':'human-biology-2021-u12-q'+str(n),'subject':'Human Biology','year':11,'examYear':2021,'units':'1 & 2','number':n,'source':'2021 Human Biology Units 1 & 2','section':info['type'],'types':[info['type']],'marks':info['marks'],'topics':topics,'subtopics':subtopics,'mixed':len(subtopics)>1,'text':plain,'figures':figures,'hash':digest,'html':body,'answerHtml':answer,'options':options,'correctAnswer':correct,'markingMode':'automatic' if options else 'manual','sourceFile':PAPER,'sourceKeyFile':KEY,'bankFile':'practice-studio-human-biology-2021-u12.json'}
  records.append(item);audits.append({'id':item['id'],'topics':topics,'subtopics':subtopics,'text':plain[:350]})
 (OUT/'practice-studio-human-biology-2021-u12.json').write_text(json.dumps(records,ensure_ascii=False,separators=(',',':')))
 report=json.loads((OUT/'practice-studio-human-biology-year11-report.json').read_text());report['exams'].append({'source':PAPER,'key':KEY,'questionsDetected':len(paperq),'imported':len(records),'mcqKeysVerified':30,'file':'practice-studio-human-biology-2021-u12.json'});report['held']+=held;report['totalImported']+=len(records)
 (OUT/'practice-studio-human-biology-year11-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));(WORK/'pdf-audit.json').write_text(json.dumps(audits,ensure_ascii=False,indent=2))
 print(json.dumps({'pdfQuestions':len(records),'held':held}))
if __name__=='__main__':main()
