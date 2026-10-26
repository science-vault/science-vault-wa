from pathlib import Path
import json,re,hashlib,base64,io,subprocess,unicodedata,copy
from lxml import html,etree
from PIL import Image
import fitz
import pdf_questions as PQ,solutions as S
import fields
R=Path(__file__).resolve().parent;O=R/'output';O.mkdir(exist_ok=True)
D={d['source']:d['questions'] for d in json.loads((R/'extracted.json').read_text())}
def md(s):return subprocess.run(['pandoc','-f','markdown','-t','html5','--mathml'],input=s,text=True,capture_output=True,check=True).stdout
def img(pic):
 pic=pic.convert('RGB');pic.thumbnail((1150,1700));b=io.BytesIO();pic.save(b,format='WEBP',quality=88);return 'data:image/webp;base64,'+base64.b64encode(b.getvalue()).decode()
def figure(src,alt='Original graph or diagram'):return '<figure><img loading="lazy" src="'+src+'" alt="'+alt+'" style="max-width:100%;height:auto"></figure>'
def tidy(s):
 h=html.fragment_fromstring(s,create_parent='div')
 for im in h.xpath('.//img'):
  raw=base64.b64decode(im.get('src').split(',')[1]);im.set('src',img(Image.open(io.BytesIO(raw))));im.set('alt','Original graph or diagram');im.attrib.pop('data-source-image',None)
 for n in h.xpath('.//script|.//iframe|.//object'):n.getparent().remove(n)
 for n in list(h.xpath('.//p')):
  t=''.join(n.itertext()).strip()
  if not n.xpath('.//img|.//math') and (not t or re.fullmatch(r'[_ .·…]+',t)):n.getparent().remove(n)
 return ''.join(html.tostring(n,encoding='unicode') for n in h)
def text(s):return ' '.join(html.fromstring('<div>'+s+'</div>').itertext()).strip()
def key(rows):return '<p>Learning Vault worked solution · newly authored for this version</p><table><thead><tr><th>Part</th><th>Worked solution and marking criteria</th><th>Marks</th></tr></thead><tbody>'+''.join('<tr><td>'+p+'</td><td>'+md(b)+'</td><td>'+str(m)+'</td></tr>' for p,m,b in rows)+'</tbody></table><p>Accept equivalent correct methods. Review method, explanation and graph marks against these criteria.</p>'
# Subject topics are reviewed per question, including mixed-topic questions.
DI='Differential calculus';IN='Integral calculus';EL='Exponential and logarithmic functions';DR='Discrete random variables';CN='Continuous and normal distributions';SP='Sampling and proportions'
TOP={
 'local21-u3':{1:[DI],2:[IN],3:[IN],4:[EL],5:[EL],6:[DI,IN],7:[IN,EL],8:[DI],9:[EL,DI],10:[DI],11:[DI],12:[EL],13:[IN],14:[DI],15:[EL],16:[IN],17:[IN],18:[DI],19:[DI],20:[IN,DI],21:[IN]},
 'local21-u34':{1:[IN,EL],2:[CN],3:[DI],4:[IN],5:[DI,EL],6:[IN],7:[DR],8:[DI],9:[IN],10:[SP],11:[SP],12:[CN],13:[IN,DI],14:[EL],15:[DR],16:[EL],17:[SP],18:[DR],19:[CN,IN],20:[DI],21:[IN,DI]},
 'local24-u3':{1:[DI,IN],2:[DR],3:[DR],4:[DI,IN],5:[IN],6:[DI,IN],7:[IN,EL],8:[DR],9:[IN],10:[DI,IN],11:[DI],12:[DR],13:[DI,IN],14:[DR]},
 'local24-u34':{1:[DR],2:[DI,IN],3:[EL,IN],4:[IN],5:[CN,IN],6:[SP],7:[DI],8:[DI,IN],9:[EL],10:[IN,DI],11:[DI,EL],12:[EL],13:[IN,DI],14:[DR],15:[CN],16:[SP],17:[SP,DR],18:[IN],19:[DI]},
 'waep20-u34':{1:[DI],2:[CN],3:[IN,EL],4:[DR],5:[DI,IN],6:[EL],7:[IN],8:[IN],9:[EL],10:[DR],11:[SP],12:[CN],13:[IN],14:[CN,IN],15:[DI],16:[DR,SP],17:[EL],18:[DI],19:[IN],20:[SP],21:[DR]},
 'waep22-u3':{1:[DI],2:[DI,IN],3:[DI],4:[IN],5:[DR],6:[DI,IN],7:[DI],8:[IN,DI],9:[DI],10:[DR],11:[DI],12:[DR],13:[DR],14:[IN],15:[EL,DI],16:[IN],17:[DR],18:[IN,DI],19:[IN]},
 'waep23-u3':{1:[DR],2:[IN],3:[DI],4:[DI,IN],5:[DI],6:[DI],7:[IN],8:[DR],9:[IN],10:[IN],11:[DR],12:[DI,IN],13:[DR],14:[EL,DI],15:[DI,IN],16:[IN,DI],17:[DR],18:[DI,EL],19:[DI]},
 'waep21-u3':{1:[DI],2:[IN],3:[DR],4:[IN],6:[DR],7:[DI],8:[DR],9:[DI],10:[DI],11:[DR],12:[EL,DI],14:[DI],15:[DR],17:[IN],18:[DI],19:[DR],20:[IN],21:[IN,DI]}}
SKILLS={DI:'Derivatives, curve analysis and optimisation',IN:'Antiderivatives, area and motion',EL:'Logarithms, exponential models and rates',DR:'Probability distributions, expectation and binomial models',CN:'Density functions, normal distributions and transformations',SP:'Sample proportions, confidence intervals and sampling bias'}
records=[];seen={};report={'sources':[],'duplicates':[],'held':[{'file':'WAEP 2020 YR12 METH U3 S1 SOLNS.docx','reason':'Solution-only upload; matching question paper not supplied.'},{'file':'WAEP 2020 YR12 METH U3 S2 SOLNS.docx','reason':'Solution-only upload; matching question paper not supplied.'}],'newlyAuthored':[]}
def fingerprint(body):
 h=html.fragment_fromstring(body,create_parent='div')
 # Canonical math layout plus text, and perceptual image content independent of compression.
 parts=[]
 for im in h.xpath('.//img'):
  raw=base64.b64decode(im.get('src').split(',')[1]);pic=Image.open(io.BytesIO(raw)).convert('L').resize((16,16));pixels=list(pic.get_flattened_data());mean=sum(pixels)/len(pixels);parts.append(''.join('1' if x>mean else '0' for x in pixels));im.getparent().remove(im)
 s=unicodedata.normalize('NFKC',' '.join(h.itertext())).lower();s=re.sub(r'\(\s*\d+\s*marks?\s*\)','',s);s=re.sub(r'[^a-z0-9+*/^=<>π−.-]','',s)
 return hashlib.sha256((s+'|'+str(parts)).encode()).hexdigest()
def add(code,q,year,units,mode,source,sourceFile,keyFile,body,answer,origin):
 id=f'methods12-{code}-q{q["number"]}';hash=fingerprint(body)
 if hash in seen:report['duplicates'].append({'file':sourceFile,'number':q['number'],'kept':seen[hash]});return
 seen[hash]=id;topics=TOP[code][q['number']]
 item={'id':id,'subject':'Mathematics Methods','area':'Mathematics','year':12,'units':units,'examYear':year,'number':q['number'],'marks':q['marks'],'source':source+' · '+('Calculator-free' if mode=='free' else 'Calculator-assumed'),'sourceFile':sourceFile,'solutionFile':keyFile,'section':'Calculator-free' if mode=='free' else 'Calculator-assumed','calculatorMode':mode,'topics':topics,'subtopics':[SKILLS[t] for t in topics],'mixed':len(topics)>1,'types':['Calculator-free' if mode=='free' else 'Calculator-assumed'],'markingMode':'manual','html':'<div class="source-text-question">'+body+'</div>','answerHtml':answer,'text':re.sub(r'\s+',' ',text(body)),'hash':hash,'solutionOrigin':origin}
 if q.get('pages'):item['sourcePages']=q['pages']
 if S.AUTO.get(code+'-'+str(q['number'])):item['typedAnswers']={'version':1,'fields':S.AUTO[code+'-'+str(q['number'])],'scope':'Final results only. Review method, explanation and graph marks using the guide.'}
 if id=='methods12-local24-u34-q5':
  item['sourceCorrection']='The supplied cumulative distribution omitted the leading 1. It has been restored so F(0)=0 and F approaches 1.'
 if id=='methods12-local24-u34-q11':
  item['sourceReviewRequired']=True;item['sourceReviewNote']='The model domain is 0≤t≤15. Profit does not fall below its initial value within this domain; extrapolating beyond 15 years is outside the stated model.';item['answerHtml']='<p class="review-note">Source clarification: '+item['sourceReviewNote']+'</p>'+item['answerHtml']
 if origin=='authored':report['newlyAuthored'].append(id)
 records.append(item)
PAPERS=[
('local21-u3','12 Methods Units 3 and 4 Calc Free Exam Sem1 2021',None,2021,'3','free','2021 Semester 1 · Word version'),
('local21-u3','12 Methods Units 3 and 4 Calc Ass Exam Sem 1 2021',None,2021,'3','allowed','2021 Semester 1 · Word version'),
('local21-u34','12 Methods Units 3 and 4 Calc Free Exam Sem 2 2021',None,2021,'3 & 4','free','2021 Semester 2'),
('local21-u34','12 Methods Units 3 and 4 Calc Ass Exam Sem 2 2021',None,2021,'3 & 4','allowed','2021 Semester 2'),
('local24-u3','2024 Year 12 Mathematics Methods Semester 1 Exam (CF)','2024 Year 12 Mathematics Methods Semester 1 Exam (CF)_Solutions',2024,'3','free','2024 Semester 1'),
('local24-u3','2024 Year 12 Mathematics Methods Semester 1 Exam (CA)','2024 Year 12 Mathematics Methods Semester 1 Exam (CA)_Solutions',2024,'3','allowed','2024 Semester 1'),
('local24-u34','2024 Year 12 Methods Semester 2 Exam_CALC FREE','2024 Year 12 Methods Semester 2 Exam_CALC FREE_Solutions',2024,'3 & 4','free','2024 Semester 2'),
('local24-u34','2024 Year 12 Mathematics Methods Semester 2 Exam_CALC ASSUMED','2024 Year 12 Mathematics Methods Semester 2 Exam_CALC ASSUMED_Solutions',2024,'3 & 4','allowed','2024 Semester 2'),
('waep20-u34','WAEP 2020 YR12 METH U34 S1','WAEP 2020 YR12 METH U34 S1 SOLNS',2020,'3 & 4','free','WAEP 2020 Units 3 & 4'),
('waep20-u34','WAEP 2020 YR12 METH U34 S2','WAEP 2020 YR12 METH U34 S2 SOLNS',2020,'3 & 4','allowed','WAEP 2020 Units 3 & 4')]
OVERRIDE={
'local24-u34-5':r'''The time spent waiting for a self-service checkout, $X$ minutes, is a continuous random variable with cumulative distribution $F(x)=1-(2x+1)e^{-2x}$ for $x\ge0$ (and $F(x)=0$ for $x<0$).

(a) Determine the exact probability of waiting between two and three minutes. (2 marks)

(b) Show that the density is $f(x)=4xe^{-2x}$. (3 marks)

(c) Illustrate part (a) on the graph below. (1 mark)

[ORIGINAL_GRAPH]''',
'local21-u3-12':r'''(a) If $x=\log_b4$ and $y=\log_b9$, determine in terms of $x,y$: (i) $\log_b36$ (1 mark); (ii) $\log_b(2/3)$ (2 marks); (iii) $\log_b(144b^3)$ (3 marks).

(b) Loudness $L$, in decibels, is given by $L=10\log_{10}(I/I_0)$, where $I$ is sound intensity and $I_0$ the intensity just audible to the human ear. (i) Find the loudness when sound is 140 times as intense as $I_0$. (2 marks) (ii) If loudness is 28 dB, find $I$ in terms of $I_0$. (2 marks)''',
'local21-u34-1':r'''(a) Determine $\int\frac{4x+1}{2x^2+x-5}\,dx$, $x>1$. (2 marks)

(b) The line $y=12-2x$ intersects $y=10/x$ at $(1,10)$ and $(5,2)$. Determine the area trapped between the line and the curve. (3 marks)''',
'local21-u34-3':r'''The curve $y=8x-4/x^2$ has one stationary point.

(a) Obtain expressions for $dy/dx$ and $d^2y/dx^2$. (2 marks)

(b) Determine the coordinates and nature of the stationary point. (4 marks)

(c) Explain why the curve has no point of inflection. (1 mark)''',
'local21-u34-4':r'''(a) Let $F(x)=\int_0^x\sin2\theta\,d\theta$. Express $F(x)$ as a function of $x$ and hence evaluate $F(\pi/6)$. (3 marks)

(b) Let $g(x)=e^{2x-1}/(2x+1)$. (i) Show that $g'(x)=4xe^{2x-1}/(2x+1)^2$. (2 marks) (ii) Hence, or otherwise, evaluate $\int_0^1 xe^{2x-1}/(2x+1)^2\,dx$. (2 marks)'''}
for code,f,k,yr,units,mode,source in PAPERS:
 keys={q['number']:q for q in D[k]} if k else {}
 for q in D[f]:
  codeq=code+'-'+str(q['number']);body=md(OVERRIDE[codeq]) if codeq in OVERRIDE else tidy(q['html'])
  if '[ORIGINAL_GRAPH]' in body:
   graphhost=html.fragment_fromstring(tidy(q['html']),create_parent='div');graph=''.join(html.tostring(im,encoding='unicode') for im in graphhost.xpath('.//img'));body=body.replace('[ORIGINAL_GRAPH]',graph)
  if codeq in S.SOL:
   assert sum(v[1] for v in S.SOL[codeq])==q['marks'],codeq
   answer=key(S.SOL[codeq]);origin='authored'
  else:
   assert q['number'] in keys,(f,q['number']);answer='<p>Supplied worked solution and marking criteria</p>'+tidy(keys[q['number']]['html']);origin='supplied'
  add(code,q,yr,units,mode,source,f+'.docx',k+'.docx' if k else None,body,answer,origin)
 report['sources'].append({'file':f+'.docx','questions':len(D[f]),'solution':k+'.docx' if k else 'Newly authored for altered question values'})
# PDF page crops only for figures; question statements and equations remain native.
PDFS={('waep22-u3','free'):'WSHS 2022 YR12 METH U3 S1.pdf',('waep22-u3','allowed'):'WSHS 2022 YR12 METH U3 S2.pdf',('waep23-u3','free'):'WAEP 2023 YR12 METH U3 S1.pdf',('waep23-u3','allowed'):'WSHS 2023 YR12 METH U3 S2.pdf'}
key23={1:[(1,1)],2:[(1,2)],3:[(1,3)],4:[(1,4)],5:[(2,1)],6:[(2,2)],7:[(2,3)],8:[(2,4)],9:[(3,1)],10:[(3,2)],11:[(3,3),(3,4)],12:[(4,1),(4,2)],13:[(4,3)],14:[(4,4)],15:[(5,1),(5,2)],16:[(5,3),(5,4)],17:[(6,1)],18:[(6,2)],19:[(6,3)]}
def crop_pdf(name,page,rect):
 d=fitz.open(R.parent/'upload'/name);p=d[page-1];pix=p.get_pixmap(matrix=fitz.Matrix(2.2,2.2),clip=fitz.Rect(rect),alpha=False);return img(Image.frombytes('RGB',(pix.width,pix.height),pix.samples))
def key_page(name,n):
 d=fitz.open(R.parent/'upload'/name);p=d[n-1];return crop_pdf(name,n,(45,55,p.rect.width-40,p.rect.height-40))
for codeq,q in PQ.Q.items():
 code,n=codeq.rsplit('-',1);n=int(n);mode='free' if n<=(8 if code=='waep21-u3' else 7) else 'allowed';yr=int('20'+code[4:6]);origin='supplied'
 if code=='waep21-u3':
  sourceFile='2021 Methods 12 Sem 1 Exam.pdf';source='WAEP 2021 Semester 1 · original version'
  logical=q['pages'][0];physical=(logical+1)//2;panel=(logical-1)%2;d=fitz.open(R.parent/'upload'/sourceFile);w=d[physical-1].rect.width/2
  figures=[crop_pdf(sourceFile,physical,(r[0]+panel*w,r[1],r[2]+panel*w,r[3])) for _,r in q['figs']]
  keyFile='Calc Free Soln 12 Meth 2021.pdf' if mode=='free' else 'Calc Assumed Soln 12 Meth 2021.pdf'
  pn=n+2 if mode=='free' else {9:3,10:4,11:6,12:5,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15}[n]
  answer='<p>Supplied marking guide · original 2021 question version</p>'+figure(key_page(keyFile,pn),'Supplied worked solution and marking criteria')
 elif code=='waep22-u3':
  sourceFile=PDFS[code,mode];keyFile=sourceFile.replace('.pdf',' SOLNS.pdf');source='WAEP 2022 Unit 3'
  figures=[crop_pdf(sourceFile,p,r) for p,r in q['figs']];answer='<p>Supplied worked solution and marking criteria</p>'+''.join(figure(key_page(keyFile,p),'Supplied marking guide, page '+str(p)) for p in q['pages'])
 else:
  sourceFile=PDFS[code,mode];source='WAEP 2023 Unit 3';keyFile='Soln Exam Sem 1 Methods.pdf';figures=[crop_pdf(sourceFile,p,r) for p,r in q['figs']]
  answer='<p>Supplied worked solution and marking criteria</p>'
  for p,j in key23[n]:
   pic=Image.open(R/'ocr'/f'Soln Exam Sem 1 Methods-p{p:02}-{j}.png');answer+=figure(img(pic),'Supplied marking guide for question '+str(n))
 body=md(q['markdown']);assert body.count('[FIGURE]')==len(figures),(codeq,len(figures),body.count('[FIGURE]'))
 for pic in figures:body=body.replace('<p>[FIGURE]</p>',figure(pic),1)
 add(code,q,yr,'3',mode,source,sourceFile,keyFile,body,answer,origin)
# Known cross-format duplicates use canonical Word records, with source aliases retained.
for n,keep in [(5,'local21-u3-q6'),(13,'local21-u3-q13'),(16,'local21-u3-q16')]:
 target='methods12-'+keep;report['duplicates'].append({'file':'2021 Methods 12 Sem 1 Exam.pdf','number':n,'kept':target,'reason':'Same question and values already included from Word version.'})
 next(q for q in records if q['id']==target).setdefault('sourceAliases',[]).append({'file':'2021 Methods 12 Sem 1 Exam.pdf','number':n})
for (code,mode),f in PDFS.items():report['sources'].append({'file':f,'questions':sum(q['sourceFile']==f for q in records)})
report['sources'].append({'file':'2021 Methods 12 Sem 1 Exam.pdf','questions':18,'duplicatesRemoved':3,'appendedSolutionPagesExcluded':True})
# Exact duplicates are rejected across both formats, and each question belongs to one bank file.
chunks=[];chunk=[];size=0
for q in records:
 cost=len(json.dumps(q,ensure_ascii=False).encode())+80
 if cost>850000:raise ValueError('Question too large '+q['id'])
 if chunk and size+cost>700000:chunks.append(chunk);chunk=[];size=0
 chunk.append(q);size+=cost
if chunk:chunks.append(chunk)
for i,chunk in enumerate(chunks,1):
 name=f'practice-studio-methods-year12-{i}.json'
 for q in chunk:q['bankFile']=name
 (O/name).write_text(json.dumps(chunk,ensure_ascii=False,separators=(',',':'))+'\n')
index=[{k:v for k,v in q.items() if k not in ['html','answerHtml']} for q in records]
(O/'practice-studio-methods-year12-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':'))+'\n')
report.update(totalImported=len(records),calculatorFree=sum(q['calculatorMode']=='free' for q in records),calculatorAssumed=sum(q['calculatorMode']=='allowed' for q in records),typedQuestions=sum(bool(q.get('typedAnswers')) for q in records),typedFields=sum(len(q.get('typedAnswers',{}).get('fields',[])) for q in records),banks=len(chunks))
(O/'practice-studio-methods-year12-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(R/'records.json').write_text(json.dumps(records,ensure_ascii=False));print({k:v for k,v in report.items() if k not in ['sources','duplicates','held','newlyAuthored']})
