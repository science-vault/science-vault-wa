from pathlib import Path
from lxml import html
import json,re,subprocess,hashlib,base64,io,unicodedata
from PIL import Image
import fitz
import fields,solutions as S,waep
R=Path(__file__).resolve().parent;O=R/'output';O.mkdir(exist_ok=True)
def md(s):return subprocess.run(['pandoc','-f','markdown','-t','html5','--mathml'],input=s,text=True,capture_output=True,check=True).stdout
def keyhtml(rows,origin):return '<p>'+origin+'</p><table><thead><tr><th>Part</th><th>Worked solution and marking criteria</th><th>Marks</th></tr></thead><tbody>'+''.join('<tr><td>'+part+'</td><td>'+md(body)+'</td><td>'+str(marks)+'</td></tr>' for part,marks,body in rows)+'</tbody></table><p>Accept equivalent correct methods. Automatic checks assess final results. Review method, explanation and graph marks against these criteria.</p>'
def image_data(pic):
 pic=pic.convert('RGB');pic.thumbnail((1500,1500));buf=io.BytesIO();pic.save(buf,format='WEBP',quality=94);return 'data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
def figure(src,alt):return '<figure><img src="'+src+'" alt="'+alt+'" style="max-width:100%;height:auto" loading="lazy"></figure>'
EQ={'d915cc5173611148':r'$[f(x+h)-f(x)]/h$','a1e9ce2b12012cea':r'$\lim_{h\to0}[f(x+h)-f(x)]/h$','f12d6ff90ff51ce5':r'$\angle BAC=100^\circ$','7f48d80984dada92':r'$f(x)=5-x$','02ed5b7242a2ef4e':r'$f(x)=-x^2+1$','c2460c6efec20bcc':r'$f(x)=\sqrt{x-1}$','17dbc9437469d3c5':r'$f(x)=1/(x+2)+3$','24b6d864769084a1':r'$\sin(3x)=\sqrt3/2,\quad0\le x\le2\pi$','44ed5115e1a04733':r'$y=3\cos(x-\pi/2),\quad0\le x\le2\pi$','3d0755dda3426d80':r'$4^x-6(2^x)-16=0$'}
BLANK={'b9b4b89858351810','fd8eed2c94bbf806','4c80ad9e075279c9'}
def tidy(value,key=False):
 host=html.fragment_fromstring(value,create_parent='div')
 for im in list(host.xpath('.//img')):
  ident=im.get('data-source-image')
  if not key and ident in EQ:
   rep=html.fragment_fromstring(md(EQ[ident]),create_parent='span');rep.tail=im.tail;im.getparent().replace(im,rep)
  elif not key and ident in BLANK:im.getparent().remove(im)
  else:
   im.set('alt','Supplied worked solution or diagram' if key else 'Original graph or diagram')
   if ident=='183b01866cdb95ea':im.set('src',image_data(Image.open(R/'images'/f'{ident}.png').crop((240,105,490,365))))
   im.attrib.pop('data-source-image',None)
 for n in list(host.xpath('.//p|.//li')):
  t=' '.join(n.itertext()).strip()
  if not n.xpath('.//img|.//math') and re.fullmatch(r'[_\s.·…]+',t):n.getparent().remove(n)
 for n in host.xpath('.//script|.//style|.//iframe|.//object'):n.getparent().remove(n)
 return ''.join(html.tostring(n,encoding='unicode') for n in host)
GROUPS={
'legacy20-u12':{'F':[3,7,10,11,12],'D':[9,13,14,15,16,17,18,19],'T':[4,20,21],'P':[8,22,23],'S':[1,2],'E':[5,6]},
'wshs21-u12':{'F':[1,3,8,20],'D':[2,4,11,13,17,18],'S':[5,15,16],'E':[6,9],'T':[7,10,21],'P':[12,14,19]},
'wshs21-u1':{'F':[1,3,4,7,9,10,11,12,14,18,21,23],'T':[2,6,8,13,15,16,19,20,22],'P':[5,17]},
'willo22-u1':{'F':[1,2,3,4,8,9,12,13,15,16,19],'T':[5,6,10,11,14,17],'P':[7,18]},
'willo22-u12':{'D':[1,5,6,7,10,17],'F':[2,8,16],'T':[3,14],'E':[4,15],'P':[9,11,18],'S':[12,13,19]},
'waep20-u1':{'F':[1,3,4,6,7,10,13,15,17],'P':[2,11,14,16,18,21],'T':[5,8,9,12,19,20]}}
CATS={'F':('Functions and graphs','Algebra, coordinate geometry and transformations'),'D':('Differential calculus','Rates of change, differentiation and applications'),'T':('Trigonometric functions','Trigonometric graphs, equations and triangle geometry'),'P':('Counting and probability','Conditional probability, independence and combinations'),'S':('Sequences and series','Arithmetic and geometric sequences'),'E':('Exponential functions','Exponential equations, graphs and models')}
DECKS=[('2020 Methods U1_2 Sem2 Exam CF','2020 Methods U1_2 Sem2 Exam CF Solutions','legacy20-u12',2020,'1 & 2','free','2020 Methods Semester 2'),('2020 Methods U1_2 Sem2 Exam CA','2020 Methods U1_2 Sem2 Exam CA Solutions','legacy20-u12',2020,'1 & 2','allowed','2020 Methods Semester 2'),('WSHS 2021 Sem 1 Methods 11 Section 1','WSHS 2021 Sem 1 Methods 11 Section 1 SOLNS','wshs21-u1',2021,'1','free','WSHS 2021 Semester 1'),('WSHS 2021 Sem 1 Methods 11 Section 2','WSHS 2021 Sem 1 Methods 11 Section 2 SOLNS','wshs21-u1',2021,'1','allowed','WSHS 2021 Semester 1'),('WSHS 2021 Methods 11 Sem 2 Section 1','WSHS 2021 Methods 11 Sem 2 Section 1 SOLNS','wshs21-u12',2021,'1 & 2','free','WSHS 2021 Semester 2'),('WSHS 2021 Methods 11 Sem 2 Section 2','WSHS 2021 Methods 11 Sem 2 Section 2 SOLNS','wshs21-u12',2021,'1 & 2','allowed','WSHS 2021 Semester 2'),('Willo 2022 YR11 METH U1 S1','Willo 2022 YR11 METH U1 S1 SOLNS','willo22-u1',2022,'1','free','Willo 2022 Unit 1'),('Willo 2022 YR11 METH U1 S2','Willo 2022 YR11 METH U1 S2 SOLNS','willo22-u1',2022,'1','allowed','Willo 2022 Unit 1'),('Willo 2022 YR11 METH U12 S1',None,'willo22-u12',2022,'1 & 2','free','Willo 2022 Units 1 & 2'),('Willo 2022 YR11 METH U12 S2',None,'willo22-u12',2022,'1 & 2','allowed','Willo 2022 Units 1 & 2')]
data={d['source']:d['questions'] for d in json.load(open(R/'extracted.json'))};records=[];report={'sources':[],'duplicates':[],'held':[],'newlyAuthored':[]}
def record(code,q,year,units,mode,source,srcfile,keyfile,body,answer,origin):
 kind=next(k for k,nums in GROUPS[code].items() if q['number'] in nums);topic,sub=CATS[kind];topics=[topic];subs=[sub]
 if code=='willo22-u12' and q['number']==13:topics.append('Differential calculus');subs.append('Optimisation')
 if code=='willo22-u12' and q['number']==4:topics.append('Functions and graphs');subs.append('Indices and scientific notation')
 plain=' '.join(' '.join(html.fragment_fromstring(body,create_parent='div').itertext()).split());ims=re.findall(r'<img[^>]+src="([^"]+)"',body);sig=re.sub(r'\W','',unicodedata.normalize('NFKC',plain).lower())+'|'+'|'.join(hashlib.sha256(s.encode()).hexdigest() for s in ims);digest=hashlib.sha256(sig.encode()).hexdigest()
 if any(r['hash']==digest for r in records):report['duplicates'].append({'source':srcfile,'number':q['number']});return
 category='Calculator-free' if mode=='free' else 'Calculator-assumed';key=code+'-'+str(q['number']);item=dict(id='methods11-'+code+'-q'+str(q['number']),subject='Mathematics Methods',area='Mathematics',year=11,examYear=year,units=units,number=q['number'],source=source+' · '+category,section=category,types=[category],calculatorMode=mode,marks=q['marks'],topics=topics,subtopics=subs,mixed=len(topics)>1,text=plain,hash=digest,html='<div class="source-text-question">'+body+'</div>',answerHtml=answer,sourceFile=srcfile,sourceKeyFile=keyfile,markingMode='manual',solutionOrigin=origin,figures=len(ims))
 if key in S.AUTO:item['typedAnswers']={'version':1,'fields':S.AUTO[key],'scope':'Final results only. Review method, explanation and graph marks against the guide.'}
 records.append(item)
for f,k,code,year,units,mode,source in DECKS:
 ks={q['number']:q for q in data[k]} if k else {}
 for q in data[f]:
  key=code+'-'+str(q['number']);body=tidy(q['html']);origin='supplied'
  if k:assert q['marks']==ks[q['number']]['marks'],key
  if key in S.SOL:
   assert sum(r[1] for r in S.SOL[key])==q['marks'],key
   origin='authored' if not k else 'adapted-supplied';answer=keyhtml(S.SOL[key],'Learning Vault worked solution · newly authored' if not k else 'Supplied solution · reformatted and checked')
  else:answer=tidy(ks[q['number']]['html'],True)
  assert len(body)>20 and len(answer)>20,key
  if not k:report['newlyAuthored'].append(key)
  if code=='legacy20-u12' and q['number']==3:body=md('Determine the natural domain and corresponding range for each function. (1 mark each)\n\n(a) $f(x)=5-x$.\n\n(b) $f(x)=-x^2+1$.\n\n(c) $f(x)=\\sqrt{x-1}$.\n\n(d) $f(x)=1/(x+2)+3$.')
  if code=='legacy20-u12' and q['number']==4:body=md(r'(a) Solve $\sin(3x)=\sqrt3/2$ for $0\le x\le2\pi$. (3 marks)'+'\n\n'+r'(b) Sketch $y=3\cos(x-\pi/2)$ on $0\le x\le2\pi$. (3 marks)')
  if code=='legacy20-u12' and q['number']==6:body=md(r'Solve $4^x-6(2^x)-16=0$. (3 marks)')
  if code=='legacy20-u12' and q['number']==20:body=body.replace('Find the length','Find the exact length')
  if code=='legacy20-u12' and q['number']==10:
   graphs=html.fragment_fromstring(body,create_parent='div').xpath('.//img');body='<p>Apply the vertical line test to each graph and state whether y is a function of x. (1 mark each)</p>'+''.join('<p><b>('+chr(97+i)+')</b></p>'+figure(im.get('src'),'Graph '+chr(97+i)) for i,im in enumerate(graphs))
  if code=='willo22-u1' and q['number']==6:
   host=html.fragment_fromstring(body,create_parent='div')
   for p in list(host.xpath('.//p')):
    if 'Use triangle ACD' in p.text_content():p.getparent().replace(p,html.fragment_fromstring(md(r'(b) Use triangle ACD to explain why $\sin\alpha=\frac{\sin(\alpha+\beta)}{\sin\beta\cos\alpha/\sin\alpha+\cos\beta}$. (1 mark)'),create_parent='div'))
   body=''.join(html.tostring(n,encoding='unicode') for n in host)
  record(code,q,year,units,mode,source,f+'.docx',k+'.docx' if k else None,body,answer,origin)
 report['sources'].append({'file':f+'.docx','key':k+'.docx' if k else 'Newly authored','questions':len(data[f])})
cf=fitz.open(next((R.parent/'upload').glob('WAEP_2020_YR11_METH_U1_S1.pdf*')));ca=fitz.open(next((R.parent/'upload').glob('WAEP_2020_YR11_METH_U1_S2.pdf*')))
figs={6:(cf,7,(170,343,435,579)),9:(ca,3,(222,230,386,308)),17:(ca,12,(90,106,510,324)),19:(ca,16,(90,108,510,360)),20:(ca,17,(175,421,440,508))}
for n,q in waep.Q.items():
 mode='free' if n<=8 else 'allowed';stem='WAEP_2020_YR11_METH_U1_'+('S1' if n<=8 else 'S2');body=md(q['markdown']);pic=''
 if n in figs:
  doc,pi,rect=figs[n];pix=doc[pi].get_pixmap(matrix=fitz.Matrix(2.2,2.2),clip=fitz.Rect(rect),alpha=False);pic=figure(image_data(Image.frombytes('RGB',(pix.width,pix.height),pix.samples)),'Original diagram for question '+str(n))
 body=body.replace('<p>[FIGURE]</p>',pic);rows=S.SOL['waep20-u1-'+str(n)];assert sum(r[1] for r in rows)==q['marks']
 record('waep20-u1',q,2020,'1',mode,'WAEP 2020 Unit 1',next((R.parent/'upload').glob(stem+'.pdf*')).name,next((R.parent/'upload').glob(stem+'_SOLNS.pdf*')).name,body,keyhtml(rows,'Supplied solution · transcribed and checked'),'adapted-supplied')
report['sources'] += [{'file':'WAEP 2020 Unit 1 Calculator-free','questions':8},{'file':'WAEP 2020 Unit 1 Calculator-assumed','questions':13}]
chunks=[];chunk=[];size=0
for q in records:
 cost=len(json.dumps(q,ensure_ascii=False).encode())
 if chunk and size+cost>650000:chunks.append(chunk);chunk=[];size=0
 chunk.append(q);size+=cost
if chunk:chunks.append(chunk)
for i,chunk in enumerate(chunks,1):
 name=f'practice-studio-methods-year11-{i}.json'
 for q in chunk:q['bankFile']=name
 (O/name).write_text(json.dumps(chunk,ensure_ascii=False,separators=(',',':'))+'\n')
index=[{k:v for k,v in q.items() if k not in ['html','answerHtml']} for q in records];(O/'practice-studio-methods-year11-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':'))+'\n')
report.update(totalImported=len(records),typedQuestions=sum('typedAnswers' in q for q in records),typedFields=sum(len(q.get('typedAnswers',{}).get('fields',[])) for q in records),calculatorFree=sum(q['calculatorMode']=='free' for q in records),calculatorAssumed=sum(q['calculatorMode']=='allowed' for q in records),banks=len(chunks))
(O/'practice-studio-methods-year11-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');(R/'records.json').write_text(json.dumps(records,ensure_ascii=False));print({k:v for k,v in report.items() if k not in ['sources','newlyAuthored']})
