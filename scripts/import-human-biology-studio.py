from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree as E,html
from docx import Document
import re,json,copy,subprocess,hashlib,importlib.util,html as escaping
import fitz
import io,base64
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'human-biology-work';OUT=WORK/'output';OUT.mkdir(exist_ok=True)
helper_path=ROOT/'physics-year11-work/import_year11.py'
if not helper_path.exists():helper_path=ROOT/'scripts/import-year11-physics-studio.py'
spec=importlib.util.spec_from_file_location('physics_tools',helper_path);helpers=importlib.util.module_from_spec(spec);spec.loader.exec_module(helpers);helpers.WORK=WORK
original_content=helpers.question_html
def biology_content(q,doc,pieces,is_key=False):
 if doc is None:return original_content(q,None,[],is_key)
 nodes=copy.deepcopy(q['nodes']);figures=[]
 for node in nodes:
  for image in node.xpath('.//img'):image.getparent().remove(image)
 for pi,clip in pieces:
  page=doc[pi]
  for rect in helpers.figure_regions(page,clip):
   graphics=[d for d in page.get_drawings() if rect.contains(d['rect']) and not(d.get('color') is None and (d.get('fill') is None or min(d['fill'])>.97))]
   if graphics:
    bounds=fitz.Rect(graphics[0]['rect'])
    for g in graphics[1:]:bounds|=g['rect']
    if bounds.width<30 and bounds.height<30:continue
   coloured=any(d.get('fill') and min(d['fill'])<.9 for d in graphics) or any(any(item[0]=='c' for item in d['items']) for d in graphics)
   words=set(re.findall(r'\w+',clean(page.get_text(clip=rect)).lower()))
   if not coloured and len(words)>=4 and any(len(words&set(re.findall(r'\w+',text(n).lower())))/len(words)>.8 for n in nodes if n.tag=='table'):continue
   fig=html.Element('figure');E.SubElement(fig,'img',src=helpers.image_data(page,rect),alt=('Marking guide' if is_key else 'Exam')+' diagram for question '+str(q['number']),loading='lazy',style='max-width:100%;height:auto');figures.append((pi,rect,fig))
 for pi,rect,fig in reversed(figures):
  previous=[(t,b) for t,b in helpers.lines(doc[pi]) if b.y1<rect.y0+4 and len(t)>20 and not re.match(r'Question|See [Nn]ext|Human Biology',t,re.I)];anchor=previous[-1][0].lower() if previous else '';position=0
  for i,node in enumerate(nodes):
   if anchor and(anchor in text(node).lower() or anchor[:45] in text(node).lower()):position=i+1
  nodes.insert(position,fig)
 div=html.Element('div',{'class':'source-text-question'})
 for node in nodes:div.append(node)
 return html.tostring(div,encoding='unicode'),len(figures)
helpers.question_html=biology_content
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';NS={'w':W}
PAIRS=[
('2020','3','2020_hum_biol__unit_3(1).docx','2020_hum_biol__unit_3_2020_marking_guide.docx'),
('2020','34','2020_hum_biol_unit_3_and_4 (2).docx','2020_hum_biol_unit_3_and_4_marking_guide (2)(1).docx'),
('2021','3','Exam Sem1 Corrected 2021_hum_biol__unit_3 NSHS.docx','Corrected 2021_hum_biol__unit_3_mark_key.docx'),
('2021','34','2021_human_biology_units_34_exam(1).docx','2021_human_biology_units_34_marking_guide(1).docx'),
('2022','3','2022 Human Biology Unit 3 Exam[63](1).docx','2022 Human Biology Unit 3 Marking Guide[63](1).docx'),
('2022','34','2022_human_biology_units_3_4(1).docx','2022_human_biology_units_3_4_marking_guide(1).docx'),
('2023','3','2023_human_biology_unit_3_exam(1).docx','2023_human_biology_unit_3_exam_marking_key(1).docx'),
('2023','34','2023_human_biology_units_34_exam version 2(1).docx','2023_human_biology_units_34_marking_guide(1).docx'),
('2024','3','2024_human_biology_unit_3_exam (1)(1).docx','2024_human_biology_unit_3_marking_key (1)(1).docx'),
('2024','34','2024_human_biology_units_3_4_exam (1)(1).docx','2024_human_biology_units_3_4_marking_guide(1).docx')]
def clean(s):return ' '.join(s.split())
def text(n):
 clone=copy.deepcopy(n)
 for a in clone.xpath('.//annotation'):a.getparent().remove(a)
 return clean(' '.join(clone.itertext()))
def marker(s):
 p=E.Element('{'+W+'}p');r=E.SubElement(p,'{'+W+'}r');E.SubElement(r,'{'+W+'}t').text=s;return p
def section_of(t):
 if len(t)>160:return None
 if re.match(r'Section\s+(One|1)\s*:\s*Multiple',t,re.I):return 'Multiple choice'
 if re.match(r'Section\s+(Two|2)\s*:\s*Short',t,re.I):return 'Short answer'
 if re.match(r'Section\s+(Three|3)\s*:\s*Extended',t,re.I):return 'Extended answer'
def context_numbers(t):
 m=re.search(r'\bQuestions?\s+([\d\s,–—\-&andto]+)',t,re.I)
 if not m or not re.search(r'refer|answer|use|below|above|following',t,re.I):return []
 part=m[1];nums=[int(n) for n in re.findall(r'\d+',part)];
 if len(nums)==2 and re.search(r'–|—|-|\bto\b',part):nums=list(range(nums[0],nums[1]+1))
 return [n for n in nums if 1<=n<=30]
def normalise(f):
 folder=WORK/'normalized';folder.mkdir(exist_ok=True);target=folder/f.name;headings=[];highlight={};labels={}
 with ZipFile(f) as z:
  root=E.fromstring(z.read('word/document.xml'));body=root.find('w:body',NS);kind=None;mcq=0;current=None;option_count=0;formats={}
  if 'word/numbering.xml' in z.namelist():
   numbering=E.fromstring(z.read('word/numbering.xml'))
   for num in numbering.findall('w:num',NS):
    ident=num.get('{'+W+'}numId');ref=num.find('w:abstractNumId',NS).get('{'+W+'}val');abstract=numbering.find('w:abstractNum[@w:abstractNumId="'+ref+'"]',NS)
    if abstract is not None:
     for lvl in abstract.findall('w:lvl',NS):
      fmt=lvl.find('w:numFmt',NS)
      if fmt is not None:formats[(ident,lvl.get('{'+W+'}ilvl'))]=fmt.get('{'+W+'}val')
  for node in list(body):
   if node.tag!='{'+W+'}p':continue
   raw=clean(''.join((c.text or '') if c.tag=='{'+W+'}t' else ' ' if c.tag in ['{'+W+'}tab','{'+W+'}br'] else '' for c in node.xpath('./w:r/*',namespaces=NS)));sec=section_of(raw)
   if sec:kind=sec;body.insert(body.index(node),marker('LVSECTION '+sec));continue
   if kind is None:continue
   if re.match(r'End of (Questions|Examination)|Acknowledg',raw,re.I):body.insert(body.index(node),marker('LVSTOP'));kind=None;continue
   if re.match(r'End of Section|Question\s+\d+\s*\(?continued',raw,re.I):continue
   if kind=='Multiple choice':
    context=context_numbers(raw)
    if context:body.insert(body.index(node),marker('LVCONTEXT '+','.join(map(str,context))))
    num=node.find('w:pPr/w:numPr',NS);level=num.find('w:ilvl',NS).get('{'+W+'}val') if num is not None and num.find('w:ilvl',NS) is not None else None
    number_id=num.find('w:numId',NS).get('{'+W+'}val') if num is not None and num.find('w:numId',NS) is not None else None;fmt=formats.get((number_id,level))
    explicit=re.match(r'^(\d+)(?:\.\s*|\s+)(.*)',raw)
    is_question=(explicit and int(explicit[1])==mcq+1) or (num is not None and level=='0' and fmt in ['decimal','decimalZero'] and mcq<30 and not context)
    if is_question:
     mcq+=1;current=mcq;option_count=0;body.insert(body.index(node),marker('LVQUESTION '+str(mcq)+'|Multiple choice|1'));headings.append(mcq)
     if num is not None:num.getparent().remove(num)
     if explicit:
      # Remove the printed number from its first text run(s), leaving the stem.
      rem=re.match(r'^\s*\d+(?:\.\s*|\s+)',raw)[0];remaining=len(rem)
      ts=node.xpath('./w:r/w:t',namespaces=NS)
      if ts:
       whole=''.join(t.text or '' for t in ts);whole=re.sub(r'^\s*\d+\.\s*','',whole)
       # Tabs are independent OOXML nodes; stripping only the number avoids text loss.
       ts[0].text=re.sub(r'^\s*\d+\.\s*','',ts[0].text or '')
     continue
    choice=re.match(r'^\(?([a-d])\)\s*',raw,re.I)
    if num is not None and level=='1' and fmt in ['lowerLetter','upperLetter']:
     letter=chr(97+option_count);choice_letter=letter;option_count+=1;num.getparent().remove(num)
     r=E.Element('{'+W+'}r');E.SubElement(r,'{'+W+'}t').text='('+letter+') ';node.insert(1,r)
    else:choice_letter=choice[1].lower() if choice else None
    if choice_letter and current:
     marked=node.xpath('.//w:r[w:rPr/w:highlight[@w:val="yellow"]]/w:t/text()',namespaces=NS)
     if any(s.strip() for s in marked):highlight.setdefault(current,[]).append(choice_letter.upper())
   else:
    match=re.fullmatch(r'Question\s+(\d+)\s*\((\d+)\s*marks?\)',raw,re.I)
    if match:
     current=int(match[1]);body.insert(body.index(node),marker('LVQUESTION '+match[1]+'|'+kind+'|'+match[2]));headings.append(current)
     # Heading is replaced by the metadata marker.
     body.remove(node);continue
   if current:
    for box in node.xpath('.//w:txbxContent/w:p',namespaces=NS):
     t=clean(' '.join(box.xpath('.//w:t/text()',namespaces=NS)))
     if t and t not in labels.setdefault(current,[]):labels[current].append(t)
  with ZipFile(target,'w',ZIP_DEFLATED) as dest:
   for n in z.namelist():dest.writestr(n,E.tostring(root) if n=='word/document.xml' else z.read(n))
 dst=target.with_suffix('.html');subprocess.run(['pandoc',str(target),'-t','html5','--mathml','--embed-resources','-s','--metadata','title=Human Biology','-o',str(dst)],check=True,capture_output=True)
 return dst,highlight,labels,headings
def split_source(f):
 converted,highlight,labels,headings=normalise(f);body=html.parse(str(converted),parser=html.HTMLParser(huge_tree=True)).find('body');qs={};current=None;context=None;contexts=[];kind=None
 for node in body:
  t=text(node)
  if t.startswith('LVSECTION '):kind=t[10:];current=None;context=None;continue
  if t=='LVSTOP':current=None;context=None;kind=None;continue
  if kind is None:continue
  if t.startswith('LVCONTEXT '):context={'numbers':[int(x) for x in t[10:].split(',')],'nodes':[]};contexts.append(context);current=None;continue
  if t.startswith('LVQUESTION '):
   num,category,marks=t[11:].split('|');num=int(num);current={'number':num,'type':category,'marks':int(marks),'nodes':[],'choices':[],'prefix':[]};qs[num]=current;context=None;continue
  if not t and not node.xpath('.//img|.//math'):continue
  if re.match(r'End of Section|Section\s|This section|Suggested working|Question\s+\d+\s*\(?continued|This page.*blank',t,re.I) or re.fullmatch(r'[_\s.]+',t):continue
  if context is not None:context['nodes'].append(copy.deepcopy(node));continue
  if current is None:continue
  if current['type']=='Multiple choice':
   m=re.match(r'^\(([a-d])\)\s*(.*)',t,re.I)
   if m:
    current['choices'].append({'letter':m[1].upper(),'text':m[2],'node':copy.deepcopy(node)});continue
   if node.tag=='table':
    rows=node.xpath('.//tr');options=[]
    for row in rows:
     m=re.match(r'^\(([a-d])\)\s*(.*)',text(row),re.I)
     if m:options.append({'letter':m[1].upper(),'text':m[2],'node':copy.deepcopy(row)})
    if len(options)==4:current['choices']+=options;current['nodes'].append(copy.deepcopy(node));continue
   if len(current['choices'])==4:
    # Material after option (d) introduces the following question or question group.
    context={'numbers':[],'after':current['number'],'nodes':[copy.deepcopy(node)]};contexts.append(context);current=None;continue
  current['nodes'].append(copy.deepcopy(node))
 for c in contexts:
  nums=c['numbers'] or [c['after']+1]
  if not c['numbers']:
   words=lambda s:{w.rstrip('s') for w in re.findall(r'[a-z]{5,}',s.lower()) if w not in {'question','following','below','above','would','which','these','their','shown','information'}}
   source_words=words(' '.join(text(n) for n in c['nodes']))
   next_explicit=min([min(other['numbers']) for other in contexts if other['numbers'] and min(other['numbers'])>nums[0]] or [31])
   for following in range(nums[0]+1,min(nums[0]+4,next_explicit)):
    if following not in qs:continue
    stem=' '.join(text(n) for n in qs[following]['nodes']);overlap=source_words&words(stem)
    if len(overlap)>=2 or (overlap and re.search('graph|diagram|image|experiment|participant|structure|shown',stem,re.I)):nums.append(following)
  for n in nums:
   if n in qs:qs[n]['prefix']+=copy.deepcopy(c['nodes'])
 return qs,highlight,labels,contexts
def key_answers(f,highlights):
 answers={}
 for table in Document(f).tables:
  for row in table.rows:
   cells=[c.text.strip() for c in row.cells]
   for i in range(len(cells)-1):
    if re.fullmatch(r'\d+',cells[i]) and re.fullmatch('[A-Da-d]',cells[i+1]) and 1<=int(cells[i])<=30:answers[int(cells[i])]=cells[i+1].upper()
 for n,letters in highlights.items():
  letters=set(letters)
  if len(letters)==1:
   value=next(iter(letters))
   if n in answers and answers[n]!=value:raise ValueError((f.name,n,'conflicting answer key'))
   answers[n]=value
 return answers
def pdf_ranges(f,qs):
 doc=fitz.open(WORK/'repaired-pdf'/(f.stem+'.pdf'));starts={};kind=None;last=0;stop=None;contexts=[];section_start=None
 prefix_groups={}
 for n,q in qs.items():
  first=next((text(node) for node in q['prefix'] if len(text(node))>30),'')
  if first and not context_numbers(first):prefix_groups.setdefault(first.lower()[:35],[]).append(n)
 for pi,p in enumerate(doc):
  ls=helpers.lines(p)
  for t,b in ls:
   sec=section_of(t)
   if sec and re.match(r'Section\s+(?:One|Two|Three|1|2|3)\s*:',t,re.I):
    kind=sec
    if sec=='Multiple choice':section_start=(pi,b.y1+3)
   nums=context_numbers(t)
   if nums and kind=='Multiple choice':contexts.append({'numbers':nums,'start':(pi,b.y0)})
   if kind=='Multiple choice':
    for prefix,numbers in prefix_groups.items():
     if t.lower().startswith(prefix):contexts.append({'numbers':numbers,'start':(pi,b.y0)})
   m=re.match(r'^(\d+)(?:\.\s*|\s+|$)(.*)',t) if kind=='Multiple choice' else re.match(r'Question\s+(\d+)\b(?!\s*\(?continued)',t,re.I)
   if kind=='Multiple choice' and t.isdigit() and (b.y0<65 or b.x0>150):m=None
   if kind=='Multiple choice' and m and int(m[1])>30:m=None
   if kind=='Multiple choice' and m and int(m[1])!=last+1:m=None
   if m and int(m[1]) in qs and int(m[1]) not in starts and int(m[1])>last:
    n=int(m[1]);starts[n]=(pi,b.y0,b.y1+3);last=n
   if last>=max(qs) and re.match(r'^(End of Questions|End of Examination|Acknowledg|Supplementary page$)',t,re.I):stop=(pi,b.y0);break
  if stop:break
 if not stop:stop=(len(doc)-1,doc[-1].rect.height-52)
 result={};numbers=sorted(starts)
 for ix,n in enumerate(numbers):
  pi,top,bodytop=starts[n];ep,ey=starts[numbers[ix+1]][:2] if ix+1<len(numbers) else stop
  if qs[n]['type']!='Multiple choice':top=bodytop
  chunks=[]
  for p in range(pi,ep+1):
   y=top if p==pi else 62;bottom=ey-4 if p==ep else doc[p].rect.height-50
   if bottom>y:chunks.append((p,fitz.Rect(30,y,doc[p].rect.width-30,bottom)))
  result[n]=chunks
 for n,chunks in result.items():
  if qs[n]['type']!='Multiple choice':continue
  cropped=[]
  for pi,rect in chunks:
   boundaries=[c['start'][1]-4 for c in contexts if c['start'][0]==pi and n not in c['numbers'] and min(c['numbers'])>n]
   if boundaries:rect.y1=min(rect.y1,min(boundaries))
   if rect.height>0:cropped.append((pi,rect))
  result[n]=cropped
 # Add shared diagrams placed before the first question in their group.
 for c in contexts:
  first=min(c['numbers']);target=next((starts[n] for n in sorted(starts) if n>=first),None)
  if target is None:continue
  sp,sy=c['start'];ep,ey=target[:2]
  chunks=[]
  for p in range(sp,ep+1):
   top=sy if p==sp else 62;bottom=ey-4 if p==ep else doc[p].rect.height-50
   if bottom>top:chunks.append((p,fitz.Rect(30,top,doc[p].rect.width-30,bottom)))
  for n in c['numbers']:
   if n in result:result[n]=chunks+result[n]
 return doc,result,starts
PATTERNS=[
('Nervous coordination','Neurons and nerve impulses',r'neuron|nerve impulse|axon|myelin|action potential|dendrit|synap|neurotransmitter'),
('Nervous coordination','Brain and spinal cord',r'brain|cerebr|cerebell|medulla|spinal cord|central nervous'),
('Nervous coordination','Reflexes and sensory pathways',r'reflex|receptor|stimulus|effector|sensory|motor neuron'),
('Nervous coordination','Autonomic nervous system',r'sympathetic|parasympathetic|autonomic'),
('Endocrine coordination','Hormones and endocrine glands',r'hormone|endocrine|pituitary|thyroid|adrenal|pineal|parathyroid'),
('Endocrine coordination','Hormone action and feedback',r'target cell|feedback|hormone cascade|steroid|peptide hormone|hypothalam'),
('Homeostasis','Blood glucose regulation',r'glucose|insulin|glucagon|diabet|glycogen'),
('Homeostasis','Thermoregulation',r'temperatur|thermoregulat|sweat|vasodil|vasoconstr|hypotherm'),
('Homeostasis','Water and salt balance',r'osmoregulat|antidiuretic|\badh\b|aldosterone|water balance|dehydrat|osmoreceptor'),
('Homeostasis','Gas regulation and breathing',r'carbon dioxide|ventilat|blood ph|chemoreceptor|breathing'),
('Disease and immunity','Pathogens and transmission',r'pathogen|bacteri|virus|viral|fung|protozo|infect|transmission|disease'),
('Disease and immunity','Innate immunity',r'innate|phagocyt|inflamm|first line|second line|nonspecific|non-specific|barrier|cerumen'),
('Disease and immunity','Adaptive immunity',r'antibod|antigen|lymphocyt|\bb cell|\bt cell|humoral|cell-mediated|specific immunity|adaptive'),
('Disease and immunity','Vaccination and immunity',r'vaccin|immunis|immuniz|passive immunity|active immunity|herd immunity'),
('Disease and immunity','Immune disorders and treatments',r'autoimmun|allerg|immunodefic|antibiotic|antiviral|anaphyl'),
('Biotechnology','DNA tools and analysis',r'\bpcr\b|polymerase chain|restriction enzyme|gel electroph|dna sequenc|dna profil|recombinant|plasmid|genetic engineer'),
('Biotechnology','Gene and cell therapies',r'gene therap|stem cell|cell replacement|pluripotent|germline|somatic gene|crispr'),
('Evolution','Evidence for evolution',r'evolution|cytochrome|haemoglobin|comparative|homolog|vestigial|molecular clock|dna hybrid'),
('Evolution','Fossils and dating',r'fossil|dating|carbon.?14|uranium.?238|potassium.?argon|stratigraph|radiometric'),
('Evolution','Natural selection and genetic change',r'natural selection|genetic drift|gene pool|allele|founder effect|bottleneck|mutation|speciat|gene flow'),
('Human evolution','Primate characteristics',r'primate|prognath|brachiat|arboreal|prehensile|opposable|ape|chimpanzee|orangutan|gorilla'),
('Human evolution','Hominin anatomy and bipedalism',r'hominin|hominid|biped|foramen magnum|sagittal crest|pelvis|femur|cranial capacity|homo|australopithec'),
('Human evolution','Cultural evolution and migration',r'cultural|stone tool|tool.*industr|migration|out of africa|neanderthal|denisova|fire|burial|mousterian|oldowan|acheul')]
def classify(q):
 t=' '.join(text(n) for n in q['prefix']+q['nodes']).lower();matches=[(a,b) for a,b,p in PATTERNS if re.search(r'\b(?:'+p+r')',t)]
 if not matches:
  t+=' '+' '.join(c['text'] for c in q['choices']).lower();matches=[(a,b) for a,b,p in PATTERNS if re.search(r'\b(?:'+p+r')',t)]
 if not matches:matches=[('Mixed topics','Human biology concepts')]
 return list(dict.fromkeys(a for a,b in matches)),list(dict.fromkeys(b for a,b in matches))
def render_question(q,doc,ranges):
 nodes=copy.deepcopy(q['prefix']+q['nodes'])
 for c in q['choices']:
  if c['node'].xpath('.//img'):nodes.append(copy.deepcopy(c['node']))
 count=sum(len(n.xpath('.//img')) for n in nodes)
 if count:
  # Biology source diagrams already contain the labels; retain them directly.
  for node in nodes:
   for image in node.xpath('.//img'):
    source=image.get('src','')
    if source.startswith('data:image/') and not re.search('emf|wmf',source[:60]):
     im=Image.open(io.BytesIO(base64.b64decode(source.split(',')[1])));im.thumbnail((1800,1800));buffer=io.BytesIO();im.save(buffer,format='WEBP',quality=92,method=6);image.set('src','data:image/webp;base64,'+base64.b64encode(buffer.getvalue()).decode());image.set('style','max-width:100%;height:auto');image.set('alt','Source diagram for question '+str(q['number']))
  result,_=helpers.question_html({**q,'nodes':nodes},None,[])
  return result,count
 return helpers.question_html({**q,'nodes':nodes},doc,ranges)
def main():
 report={'exams':[],'held':[],'duplicates':[],'corrections':[]};records=[];seen={};audits=[]
 for year,units,paper,key in PAIRS:
  f=ROOT/'upload'/paper;kf=ROOT/'upload'/key;qs,_,labels,contexts=split_source(f);ks,highlight,_,_=split_source(kf);answers=key_answers(kf,highlight)
  if set(answers)!=set(range(1,31)):raise ValueError((key,'MCQ answers missing',sorted(set(range(1,31))-set(answers))))
  if sorted(qs)!=list(range(1,max(qs)+1)):raise ValueError((paper,'Question numbering not continuous',sorted(qs)))
  pdf,ranges,starts=pdf_ranges(f,qs);kpdf,kranges,_=pdf_ranges(kf,ks) if ks else (None,{},None)
  if set(qs)-set(ranges):raise ValueError((paper,'PDF boundaries missing',set(qs)-set(ranges)))
  batch=[]
  for n,q in sorted(qs.items()):
   if q['type']=='Multiple choice':
    if sorted(c['letter'] for c in q['choices'])!=['A','B','C','D']:report['held'].append({'source':paper,'number':n,'reason':'Four answer choices could not be extracted','choices':[c['text'] for c in q['choices']]});continue
    options=[c['text'] or 'Option '+c['letter']+' (see diagram)' for c in sorted(q['choices'],key=lambda c:c['letter'])];correct=ord(answers[n])-65
    answer='<p>Correct answer: <strong>'+answers[n]+'</strong> — '+escaping.escape(options[correct])+'</p><p>Answer taken from the matching exam marking guide.</p>'
   else:
    if n not in ks:report['held'].append({'source':paper,'number':n,'reason':'Matching marking-guide question missing'});continue
    if q['marks']!=ks[n]['marks']:report['held'].append({'source':paper,'number':n,'reason':'Question/key marks disagree','paperMarks':q['marks'],'keyMarks':ks[n]['marks']});continue
    try:answer,_=helpers.question_html(ks[n],kpdf,kranges.get(n,[]),True)
    except Exception as e:report['held'].append({'source':paper,'number':n,'reason':str(e)});continue
    options=[];correct=None
   topics,subtopics=classify(q);plain=' '.join(text(node) for node in q['prefix']+q['nodes']);canonical=plain+' '+' '.join(options)
   # Include image bytes to distinguish different diagrams with identical prompts.
   images=''.join(node.get('src','') for parent in q['prefix']+q['nodes'] for node in parent.xpath('.//img'))
   digest=hashlib.sha256((re.sub(r'\W+','',canonical.lower())+images).encode()).hexdigest()
   if digest in seen:report['duplicates'].append({'source':paper,'number':n,'sameAs':seen[digest]});continue
   identifier='human-biology-'+year+'-u'+units+'-q'+str(n);seen[digest]=identifier
   body,figs=render_question(q,pdf,ranges[n]);
   if labels.get(n):body+='<p class="source-line"><strong>Original diagram labels:</strong> '+escaping.escape(' · '.join(labels[n]))+'</p>'
   item={'id':identifier,'subject':'Human Biology','year':12,'examYear':int(year),'units':'3' if units=='3' else '3 & 4','number':n,'source':year+' Human Biology '+('Unit 3' if units=='3' else 'Units 3 & 4'),'section':q['type'],'types':[q['type']],'marks':q['marks'],'topics':topics,'subtopics':subtopics,'mixed':len(subtopics)>1,'text':plain,'figures':figs,'hash':digest,'html':body,'answerHtml':answer,'options':options,'correctAnswer':correct,'markingMode':'automatic' if options else 'manual','sourceFile':paper,'sourceKeyFile':key}
   batch.append(item);audits.append({'id':identifier,'type':q['type'],'topics':topics,'subtopics':subtopics,'text':plain[:350]})
  filename='practice-studio-human-biology-'+year+'-u'+units+'.json';(OUT/filename).write_text(json.dumps(batch,ensure_ascii=False,separators=(',',':')));records+=batch
  report['exams'].append({'source':paper,'key':key,'questionsDetected':len(qs),'imported':len(batch),'mcqKeysVerified':len(answers),'file':filename});print(paper,len(batch),'/',len(qs),flush=True)
 index=[{k:v for k,v in q.items() if k not in ['html','answerHtml','options','correctAnswer']} for q in records]
 (OUT/'practice-studio-human-biology-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':')))
 report['totalImported']=len(records);report['types']={t:sum(t in q['types'] for q in records) for t in ['Multiple choice','Short answer','Extended answer']};(OUT/'practice-studio-human-biology-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));(WORK/'audit.json').write_text(json.dumps(audits,ensure_ascii=False,indent=2))
 print(json.dumps({k:v for k,v in report.items() if k!='exams'},indent=2))
if __name__=='__main__':main()
