from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree as E,html
from PIL import Image,ImageChops
import fitz,re,json,hashlib,base64,subprocess,copy,io
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'physics-year11-work';OUT=WORK/'output';OUT.mkdir(exist_ok=True)
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';NS={'w':W}
def clean(t):return ' '.join(t.split())
def text(n):return clean(' '.join(n.itertext()))
def normalized(f):
 target=WORK/'normalized'/f.name;target.parent.mkdir(exist_ok=True)
 with ZipFile(f) as z:
  r=E.fromstring(z.read('word/document.xml'));nums=E.fromstring(z.read('word/numbering.xml')) if 'word/numbering.xml' in z.namelist() else None
  ids=set()
  if nums is not None:
   for num in nums.findall('w:num',NS):
    a=num.find('w:abstractNumId',NS).get('{'+W+'}val');abstract=nums.find('w:abstractNum[@w:abstractNumId="'+a+'"]',NS)
    if abstract is not None and any('Question' in x.get('{'+W+'}val','') for x in abstract.findall('.//w:lvlText',NS)):ids.add(num.get('{'+W+'}numId'))
  count=0
  for p in r.findall('w:body/w:p',NS):
   num=p.find('w:pPr/w:numPr/w:numId',NS)
   if num is not None and num.get('{'+W+'}val') in ids:
    count+=1;pr=p.find('w:pPr/w:numPr',NS);pr.getparent().remove(pr)
    run=E.Element('{'+W+'}r');t=E.SubElement(run,'{'+W+'}t');t.text='Question '+str(count)+' ';p.insert(1,run)
  with ZipFile(target,'w',ZIP_DEFLATED) as out:
   for n in z.namelist():out.writestr(n,E.tostring(r) if n=='word/document.xml' else z.read(n))
 dst=target.with_suffix('.html');subprocess.run(['pandoc',str(target),'-t','html5','--mathml','--embed-resources','-s','--metadata','title=Physics','-o',str(dst)],check=True,capture_output=True)
 return dst
def split_doc(f):
 body=html.parse(str(normalized(f)),parser=html.HTMLParser(huge_tree=True)).find('body');records=[];current=None;section='Short response';fixes=[]
 for node in body:
  t=text(node);m=re.fullmatch(r'Question\s+(\d+)\s*\((\d+)\s*marks?\)',t,re.I)
  if re.match(r'Section\s+(?:Two|2)',t,re.I):section='Problem solving';current=None
  if re.match(r'Section\s+(?:Three|3)',t,re.I):section='Extended response';current=None
  if re.match(r'^(End of (?:Questions|Examination)|Acknowledg|Supplementary)',t,re.I):current=None
  if m:
   number=int(m[1]);expected=len(records)+1
   if number!=expected:
    if f.name=='2022_physics_unit_1_marking_guide_.docx' and number==1 and expected==18:fixes.append('Source heading Question 1 corrected to Question 18 by position and paired paper.');number=18
    else:raise ValueError((f.name,number,expected))
   current={'number':number,'marks':int(m[2]),'section':section,'nodes':[]};records.append(current);continue
  if current is None:continue
  if re.match(r'^Question\s+\d+\s+continued',t,re.I) or re.fullmatch(r'[_\s.]+',t):continue
  if not t and not node.xpath('.//img|.//math'):continue
  # Remove standalone response lines, but retain the supplied data and tables.
  if re.fullmatch(r'(?:Answer|Energy|Power|Distance|Direction|Net Force|Voltage|Current|Resistance|Temperature|Time|Speed|Mass|Wavelength|Frequency|Force|Acceleration)\s*:?\s*_{3,}.*',t,re.I):continue
  current['nodes'].append(copy.deepcopy(node))
 return records,fixes
def lines(page):
 return [(clean(''.join(s['text'] for s in l['spans'])),fitz.Rect(l['bbox'])) for b in page.get_text('dict')['blocks'] for l in b.get('lines',[])]
def pdf_questions(path,expected):
 if not path.exists():return None,[]
 doc=fitz.open(path);starts=[];stop=None
 for pi,page in enumerate(doc):
  ls=lines(page)
  for t,b in ls:
   m=re.fullmatch(r'Question\s+(\d+)',t)
   if m and int(m[1])==len(starts)+1:
    marks=[x for x,bb in ls if abs(bb.y0-b.y0)<9 and re.fullmatch(r'\(\d+\s*marks?\)',x,re.I)]
    if marks:starts.append((pi,b.y1+4,int(re.search(r'\d+',marks[0])[0])))
   if len(starts)==expected and re.match(r'^(End of Questions|End of Examination|Acknowledgements|Supplementary page$)',t,re.I):stop=(pi,b.y0);break
  if stop:break
 if len(starts)!=expected:raise ValueError((path.name,'PDF question count',len(starts),expected))
 if not stop:
  if 'guide' in path.name:stop=(len(doc)-1,doc[-1].rect.height-52)
  else:raise ValueError((path.name,'No end marker'))
 result=[]
 for i,(pi,y,marks) in enumerate(starts):
  ep,ey=starts[i+1][:2] if i+1<len(starts) else stop
  # Next header's top is above its baseline.
  if i+1<len(starts):ey-=22
  pieces=[]
  for p in range(pi,ep+1):
   top=y if p==pi else 64;bottom=ey if p==ep else doc[p].rect.height-52
   if bottom>top:pieces.append((p,fitz.Rect(32,top,doc[p].rect.width-32,bottom)))
  result.append(pieces)
 return doc,result
def figure_regions(page,clip):
 drawings=[]
 for d in page.get_drawings():
  r=d['rect']
  if r.y0<clip.y0 or r.y1>clip.y1 or r.x0<25 or r.x1>page.rect.width-25:continue
  if d.get('color') is None and (d.get('fill') is None or min(d.get('fill'))>.97):continue
  # Student writing rules and decorative borders are not figures.
  if r.height<2 and r.width>350:continue
  if r.width<2 and r.height>500:continue
  drawings.append(d)
 boxes=list(page.cluster_drawings(drawings=drawings,x_tolerance=18,y_tolerance=18,final_filter=False)) if drawings else []
 for info in page.get_image_info():
  r=fitz.Rect(info['bbox'])
  if r.width>15 and r.height>15 and clip.contains(r):boxes.append(r)
 # Merge nearby parts of an illustration, including disconnected labels/arrows.
 merged=True
 while merged:
  merged=False
  for i,a in enumerate(boxes):
   for j in range(i+1,len(boxes)):
    b=boxes[j];expanded=fitz.Rect(a.x0-45,a.y0-20,a.x1+45,a.y1+20)
    if expanded.intersects(b) or (a.y0-22<=b.y1 and b.y0-22<=a.y1):boxes[i]=a|b;boxes.pop(j);merged=True;break
   if merged:break
 out=[]
 for r in boxes:
  if r.width<22 or r.height<16:continue
  if r.width>500 and r.height<22:continue
  # Include nearby diagram labels while keeping surrounding prose out of the crop.
  rect=fitz.Rect(clip.x0,r.y0-8,clip.x1,r.y1+8)&clip
  for t,b in lines(page):
   if len(t)<95 and re.search('[A-Za-z0-9]',t) and b.y0>=r.y0-18 and b.y1<=r.y1+26:rect|=b
  out.append(rect&clip)
 return sorted(out,key=lambda r:r.y0)
def image_data(page,rect):
 pix=page.get_pixmap(matrix=fitz.Matrix(1.7,1.7),clip=rect,alpha=False)
 im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);buf=io.BytesIO();im.save(buf,format='WEBP',quality=88,method=6)
 return 'data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
def question_html(q,doc,pieces,is_key=False):
 nodes=q['nodes'];figures=[]
 # Raster/metafile figures are re-rendered together with any Word drawing shapes.
 if doc:
  for n in nodes:
   for im in n.xpath('.//img'):im.getparent().remove(im)
  for pi,clip in pieces:
   page=doc[pi]
   for rect in figure_regions(page,clip):
    words=set(re.findall(r'\w+',clean(page.get_text(clip=rect)).lower()))
    if len(words)>=4 and any(len(words & set(re.findall(r'\w+',text(n).lower())))/len(words)>.8 for n in nodes if n.tag=='table'):continue
    fig=html.Element('figure');im=E.SubElement(fig,'img',src=image_data(page,rect),alt=('Marking guide' if is_key else 'Exam')+' diagram for question '+str(q['number']),loading='lazy');im.set('style','max-width:100%;height:auto');figures.append((pi,rect,fig))
  # Keep diagrams close to the preceding prompt, using its text as an anchor.
  for pi,rect,fig in reversed(figures):
   preceding=[(t,b) for t,b in lines(doc[pi]) if b.y1<rect.y0+4 and len(t)>20 and not re.match('Question|See [Nn]ext|Physics',t)]
   anchor=preceding[-1][0].lower() if preceding else ''
   pos=0
   for i,n in enumerate(nodes):
    if anchor and (anchor in text(n).lower() or anchor[:45] in text(n).lower()):pos=i+1
   nodes.insert(pos,fig)
 div=html.Element('div',{'class':'source-text-question'})
 for n in nodes:
  for img in n.xpath('.//img'):
   if re.match(r'data:image/(?:x-)?(?:emf|wmf)',img.get('src','')):
    raw=base64.b64decode(img.get('src').split(',')[1]);folder=WORK/'metafiles';folder.mkdir(exist_ok=True);stem=hashlib.sha256(raw).hexdigest()[:20];native=folder/(stem+'.emf');native.write_bytes(raw);pdf=native.with_suffix('.pdf')
    if not pdf.exists():subprocess.run(['/opt/codex/runtimes/codex-primary-runtime/dependencies/bin/override/soffice','-env:UserInstallation=file:///tmp/lv-metafile-import','--headless','--convert-to','pdf','--outdir',str(folder),str(native)],check=True,capture_output=True,timeout=45)
    with fitz.open(pdf) as converted:
     pix=converted[0].get_pixmap(matrix=fitz.Matrix(1.7,1.7),alpha=False);im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);bbox=ImageChops.difference(im,Image.new('RGB',im.size,'white')).getbbox()
     if bbox:im=im.crop(bbox)
     buf=io.BytesIO();im.save(buf,format='WEBP',quality=90);img.set('src','data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode());img.set('alt','Original marking-guide graph');img.set('style','max-width:100%;height:auto')
  div.append(n)
 return html.tostring(div,encoding='unicode'),len(figures)
def classify(t):
 t=t.lower();matches=[]
 patterns=[('Thermal physics','Kinetic particle model',r'kinetic (?:particle|theory)|helium.*xenon|balloon.*helium'),('Thermal physics','Temperature and thermal equilibrium',r'thermal equilibrium|temperature scale|absolute zero|thermometer'),('Thermal physics','Heating and phase changes',r'specific heat|latent heat|heat capacity|boil|melt|water heater|calorimet|ice|steam'),('Thermal physics','Heat transfer',r'convection|conduction|radiation.*heat|thermal conduct|insulat|heat transfer|sea breeze|bimetal|hot plates|space shuttle'),('Nuclear physics','Nuclear reactions and binding energy',r'nucle(?:ar|osynth)|fission|fusion|binding energy|mass defect|isotope|proton.*neutron'),('Nuclear physics','Radioactivity and half-life',r'half.life|radioactiv|decay|alpha|gamma|beta|radiation|becquerel'),('Electricity','Electric charge and forces',r'coulomb|point charges|electrostatic|electric charge|charged.*sphere|charged.*ball|lightning'),('Electricity','Circuits and electrical measurements',r'circuit|resistor|resistance|ammeter|voltmeter|ohm|potential difference|cell|battery'),('Electricity','Electrical energy and power',r'electric.*power|electric.*energy|kilowatt|kwh|toaster|electric iron|solar panel|heating element'),('Electricity','Electrical safety',r'rcd|circuit.breaker|electrocution|earthing|earth wire|household.*fire'),('Motion and forces','Kinematics and motion graphs',r'accelerat|velocity|displacement|speed|motion|distance.time'),('Motion and forces','Forces and Newton’s laws',r'newton|net force|friction|free.body|terminal velocity|tension|drag force'),('Motion and forces','Momentum and impulse',r'momentum|impulse|collision'),('Motion and forces','Work energy and power',r'kinetic energy|potential energy|work done|gravitational energy|trolley|energy.*conserv'),('Waves','Wave properties and behaviour',r'wave|wavelength|refraction|reflection|frequency|diffraction|transverse|longitudinal'),('Waves','Sound and intensity',r'sound|decibel|intensity|hearing|bat|echo'),('Waves','Standing waves and resonance',r'standing wave|resonan|harmonic|overtone|vibrat|string|organ pipe')]
 for topic,sub,pat in patterns:
  if re.search(pat,t):matches.append((topic,sub))
 if not matches:matches=[('Mixed topics','General physics')]
 return list(dict.fromkeys(a for a,b in matches)),list(dict.fromkeys(b for a,b in matches))
def main():
 exams=sorted((ROOT/'upload').glob('*exam*.docx'));allq=[];report={'exams':[],'held':[],'duplicates':[],'corrections':[]}
 seen=set()
 for f in exams:
  year=int(f.name[:4]);units='1 & 2' if re.search('units_',f.name) else '1'
  key=next(k for k in (ROOT/'upload').glob(str(year)+'*guide*.docx') if ('units_' in k.name)==('units_' in f.name))
  qs,fix=split_doc(f);ks,kfix=split_doc(key);report['corrections']+=kfix
  if len(qs)!=len(ks):raise ValueError((f.name,len(qs),len(ks)))
  doc,pieces=pdf_questions(WORK/'pdf'/(f.stem+'.pdf'),len(qs));kd,kpieces=pdf_questions(WORK/'pdf'/(key.stem+'.pdf'),len(ks))
  batch=[]
  for i,(q,k) in enumerate(zip(qs,ks)):
   mark_note=''
   if q['marks']!=k['marks']:
    if f.name=='2024_physics_units_12_exam.docx' and q['number']==12 and (q['marks'],k['marks'])==(7,6):
     mark_note='Marking correction: the source guide labels part (b) as 5 marks and the question as 6. Its six one-mark criteria for part (b), plus 1 mark for part (a), total 7 marks, matching the exam paper.'
     report['corrections'].append(mark_note)
    else:report['held'].append({'exam':f.name,'question':q['number'],'reason':'Paper/key total marks disagree','paperMarks':q['marks'],'keyMarks':k['marks']});continue
   plain=' '.join(text(n) for n in q['nodes']);topics,subs=classify(plain)
   digest=hashlib.sha256(re.sub(r'\W+','',plain.lower()).encode()).hexdigest()
   if digest in seen:report['duplicates'].append({'exam':f.name,'question':q['number']});continue
   seen.add(digest)
   try:
    body,figs=question_html(q,doc,pieces[i]);answer,kfigs=question_html(k,kd,kpieces[i] if kd else [],True)
    if mark_note:answer='<p class="review-note">'+mark_note+'</p>'+answer
   except ValueError as e:report['held'].append({'exam':f.name,'question':q['number'],'reason':str(e)});continue
   types=[]
   if re.search(r'calculat|determine|estimate',plain,re.I):types.append('Calculation')
   if re.search(r'explain|describe|state|identify|sketch|draw|compare|justify',plain,re.I):types.append('Short answer')
   if q['section']=='Extended response':types.append('Extended response')
   if not types:types=['Short answer']
   item={'id':f'physics-{year}-u'+('12' if units=='1 & 2' else '1')+'-q'+str(q['number']),'subject':'Physics','year':11,'examYear':year,'units':units,'number':q['number'],'source':f'{year} Physics '+('Units 1 & 2' if units=='1 & 2' else 'Unit 1'),'section':q['section'],'types':types,'marks':q['marks'],'topics':topics,'subtopics':subs,'mixed':len(topics)>1,'text':plain,'figures':figs,'hash':digest,'html':body,'answerHtml':answer,'sourceFile':f.name,'sourceKeyFile':key.name,'markingMode':'manual'}
   batch.append(item)
  slug=f'practice-studio-physics-{year}-u'+('12' if units=='1 & 2' else '1')+'.json';(OUT/slug).write_text(json.dumps(batch,ensure_ascii=False,separators=(',',':')))
  allq+=batch;report['exams'].append({'source':f.name,'key':key.name,'questionsDetected':len(qs),'imported':len(batch),'file':slug,'keyFiguresRendered':bool(kd)})
  print(f.name,len(batch),'/',len(qs),flush=True)
 index=[{k:v for k,v in q.items() if k not in ['html','answerHtml']} for q in allq]
 (OUT/'practice-studio-physics-year11-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':')))
 report['totalImported']=len(allq);(OUT/'practice-studio-year11-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 (WORK/'topics-audit.txt').write_text('\n'.join(f"{q['id']} | {','.join(q['subtopics'])} | {q['text'][:220]}" for q in allq))
 print(json.dumps({k:v for k,v in report.items() if k!='exams'},indent=2))
if __name__=='__main__':main()
