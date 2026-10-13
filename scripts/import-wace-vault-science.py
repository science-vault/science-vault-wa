"""Reviewed WACE Vault science PDF pairs. Requires sources.json and existing.json.

Source panels retain original equations, diagrams, handwriting and writing space.
OCR is used for navigation only; displayed answers remain the original scan.
"""
import base64, hashlib, html, io, json, re, sys
from pathlib import Path
import fitz
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[1]
WORK=Path(sys.argv[1])
# Reuse tested layout readers, source panel renderer and HTML image contract.
helper=(ROOT/'scripts/import-wace-vault-physics.py').read_text()
exec(helper[:helper.index('records=[];audits=')])

def written(doc,slug):
    out=[]
    for pi,p in enumerate(doc):
        if pi==0:continue
        ls=lines(p)
        for t,b in ls:
            m=re.fullmatch(r'Question\s+(\d+)\s*(?:\((\d+)\s*marks?\))?',t)
            if not m or not 20<b.y0<p.rect.height-30:continue
            n=int(m[1]);marks=int(m[2]) if m[2] else None
            for tt,bb in ls:
                mm=re.fullmatch(r'\(?(\d+)\s*marks?\)?',tt,re.I)
                if mm and abs(bb.y0-b.y0)<12:marks=int(mm[1])
            if slug=='biology-helena' and n in [33,34,35]:marks=20
            if not marks:continue
            previous=next((q for q in out if q['n']==n),None)
            if previous:
                if marks==previous['marks']:continue
                n=max(q['n'] for q in out)+1
            out.append(dict(n=n,originalN=int(m[1]),page=pi,top=b.y0-3,marks=marks,type='Written Response'))
    return out

def mc_heads(doc,wh,slug):
    out=[];limit=30 if slug in ['biology-helena','human-biology-mdc'] else 10
    minimum=2 if limit==30 else 1;first=wh[0]['page'] if wh else len(doc)
    for pi in range(minimum,first):
        for t,b in lines(doc[pi]):
            m=re.match(r'^(\d+)\.\s*',t)
            if m and b.x0<110 and 30<b.y0<doc[pi].rect.height-30:
                n=int(m[1])
                if 1<=n<=limit and not any(q['n']==n for q in out):out.append(dict(n=n,originalN=n,page=pi,top=b.y0-3,marks=1,type='Multiple Choice'))
    assert [q['n'] for q in out]==list(range(1,limit+1)),(slug,'MC sequence',out)
    return out

def context_regions(doc,heads):
    contexts={};barriers={}
    for pi,p in enumerate(doc):
        for t,b in lines(p):
            m=re.match(r'^Questions?\s+(\d+)\s*(?:(?:and|to|[-–])\s*(\d+)\s*)?(?:refers?|relates?)',t,re.I)
            if not m:m=re.match(r'^Use the (?:diagram|table) below to answer Questions?\s+(\d+)\s*(?:(?:and|to|[-–])\s*(\d+))?',t,re.I)
            if not m:continue
            nums=list(range(int(m[1]),int(m[2] or m[1])+1));first=next((q for q in heads if q['type']=='Multiple Choice' and q['n']==nums[0] and (q['page']>pi or q['page']==pi and q['top']>b.y0)),None)
            if not first:continue
            rr=[]
            for page in range(pi,first['page']+1):
                top=b.y0-3 if page==pi else 35;bottom=first['top']+2 if page==first['page'] else doc[page].rect.height-40
                if bottom>top+5:rr.append((page,fitz.Rect(30,top,doc[page].rect.width-30,bottom)))
            for n in nums:contexts[n]=rr
            barriers.setdefault(pi,[]).append(b.y0-3)
    return contexts,barriers

def sections(doc,heads,i,barriers=None,key=False,stop=None):
    q=heads[i];nxt=heads[i+1] if i+1<len(heads) else None;out=[]
    end=nxt['page'] if nxt else (stop if stop is not None else len(doc)-1)
    for pi in range(q['page'],end+1):
        p=doc[pi]
        if re.search(r'This page.*blank intentionally',p.get_text(),re.I):continue
        top=q['top'] if pi==q['page'] else (25 if len(doc)<15 else 35)
        bottom=nxt['top']+2 if nxt and pi==nxt['page'] else p.rect.height-(20 if key else 40)
        ls=lines(p)
        stops=[b.y0-3 for t,b in ls if b.y0>top+4 and re.match(r'^(?:END OF TEST|End of (?:Questions|Examination|Section)|Section (?:One|Two|Three)|Section\s*\d|SECTION\s*\d|Supplementary page|ACKNOWLEDGEMENTS)',t,re.I)]
        if key:stops=[y for y in stops if not any(abs(b.y0-3-y)<1 and re.match(r'^End of (?:Questions|Examination)',t,re.I) for t,b in ls)]
        stops += [y for y in (barriers or {}).get(pi,[]) if y>top+5]
        if stops:bottom=min(bottom,min(stops))
        if not nxt and pi>q['page'] and re.search(r'Question number\(s\):|Question number:|Copyright|Acknowledgements',p.get_text(),re.I):break
        if bottom>top+8 and not (nxt and pi==nxt['page'] and bottom<100 and pi!=q['page']):
            meaningful=[t for t,b in ls if top<=b.y0<bottom and len(re.sub('[^A-Za-z]','',t))>5]
            if meaningful or len(p.get_drawings())>10:out.append((pi,fitz.Rect(30,top,p.rect.width-30,bottom)))
        if stops:break
    return out

def answer_table(doc):
    out={}
    for p in doc:
        ls=lines(p)
        for t,b in ls:
            if not re.fullmatch(r'\d+',t):continue
            choices=[tt.upper() for tt,bb in ls if re.fullmatch('[a-dA-D]',tt) and abs(bb.y0-b.y0)<6 and bb.x0>b.x1]
            if len(choices)==1:out[int(t)]=choices[0]
    return out

records=[];audit=[];held=[];versions={};review=[]
existing=json.loads((WORK/'existing.json').read_text());seen=set()
for source in json.loads((WORK/'sources.json').read_text()):
    slug=source['slug'];paper=fitz.open(source['paper']['local']);key=fitz.open(source['key']['local'])
    if slug=='psychology-2021':
        # An answer was left in blue in the question paper. Retain the prompt and
        # response lines; use the actual marking guide for the removed definition.
        page=paper[12]
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines',[]):
                if any(span.get('color',0)!=0 for span in line['spans']):
                    page.add_redact_annot(fitz.Rect(line['bbox']),fill=(1,1,1))
        page.apply_redactions()
    wh=written(paper,slug)
    mh=mc_heads(paper,wh,slug) if slug!='psychology-2021' else [];heads=mh+wh;context,barriers=context_regions(paper,heads)
    if slug=='biology-helena':
        for n,pi,top in [(3,2,395),(12,5,226)]:
            target=next(q for q in mh if q['n']==n)
            context[n]=[(pi,fitz.Rect(30,top,paper[pi].rect.width-30,target['top']+2))]
            barriers.setdefault(pi,[]).append(top)
    ocrpath=WORK/(slug+'-key-ocr.pdf');nav=fitz.open(ocrpath) if ocrpath.exists() else key;kh=written(nav,slug)
    if slug=='chem-acids':kh=[dict(n=i+1,originalN=i+1,page=i+4,top=95 if i==0 else 70,marks=marks,type='Written Response') for i,marks in enumerate([4,7,8,6,7])]
    # Biology key's handwritten headings omit total marks; manually bounded,
    # separately reviewed question sections are recorded below.
    biology_bounds={31:(1,35,3,510),32:(3,510,5,548),33:(5,548,7,85),34:(7,85,8,699),35:(8,699,11,791),36:(11,791,13,657),37:(13,657,16,81),38:(16,81,17,617),39:(17,617,19,key[19].rect.height-20)} if slug=='biology-helena' else {}
    letters=answer_table(list(key)[:1 if slug=='biology-helena' else 2])
    extra=WORK/'human-biology-mdc-mc.pdf'
    if slug=='human-biology-mdc':letters={int(n):a for n,a in source['mcAnswers'].items()}
    images={};count=0;corrections=[];packid='wace-science-'+slug
    for i,q in enumerate(heads):
        original=q['n'];label=('MC' if q['type']=='Multiple Choice' else 'WR')+str(original)
        rr=sections(paper,heads,i,barriers,stop=25 if slug=='human-biology-mdc' else 32 if slug=='biology-helena' else None)
        if q['type']=='Multiple Choice' and original in context:rr=context[original]+rr
        text='\n'.join(paper[pi].get_text(clip=r) for pi,r in rr)
        if not rr or re.search('copyright reasons|content.*omitted',text,re.I):held.append(dict(source=source['paper']['url'],question=label,reason='Incomplete source context'));continue
        prompts=[norm(t) for pi,r in rr for t,b in lines(paper[pi]) if r.y0<=b.y0<r.y1 and len(norm(t))>65 and not t.startswith('_')]
        prompt=next((t for t in prompts if not re.match(r'^(suggested|supplementary|when|questions)',t)),None)
        fingerprint=source['course']+norm(text)
        old=[norm(x.get('searchText','') or re.sub('<[^>]+>',' ',x.get('question',''))) for x in existing if x['course']==source['course']]
        if fingerprint in seen or prompt and any(prompt in t for t in old):held.append(dict(source=source['paper']['url'],question=label,reason='Existing question text duplicate'));continue
        seen.add(fingerprint);kr=[];letter=letters.get(original) if q['type']=='Multiple Choice' else None;note=''
        if q['type']=='Multiple Choice':
            if not letter and slug in ['chem-acids','chem-equilibrium']:
                pi=q['page'];kr=[(pi,fitz.Rect(30,50,key[pi].rect.width-30,key[pi].rect.height-30))]
            elif not letter:held.append(dict(source=source['paper']['url'],question=label,reason='No verified MC answer'));continue
        elif slug=='biology-helena':
            # Some extended response rubric prompts differ from the paper. Hold
            # them until an exact source/rubric pairing is verified.
            if original>=36:held.append(dict(source=source['paper']['url'],question=label,reason='Extended-response paper/key prompt mismatch; manual review required'));continue
            sp,sy,ep,ey=biology_bounds[original]
            kr=[(pi,fitz.Rect(30,sy if pi==sp else 25,key[pi].rect.width-30,ey if pi==ep else key[pi].rect.height-20)) for pi in range(sp,ep+1)]
            kr=[(pi,r) for pi,r in kr if len(norm(key[pi].get_text(clip=r)))>10]
        else:
            matches=[j for j,k in enumerate(kh) if k['n']==original]
            if len(matches)!=1:held.append(dict(source=source['paper']['url'],question=label,reason='No unique marking-guide question'));continue
            ki=matches[0];k=kh[ki]
            if q['marks']!=k['marks']:held.append(dict(source=source['paper']['url'],question=label,reason='Declared marks disagree',paperMarks=q['marks'],keyMarks=k['marks']));continue
            # OCR coordinates select the source page region; display native scan.
            navrr=sections(nav,kh,ki,key=True,stop=30 if slug=='human-biology-mdc' else 8 if slug=='chem-acids' else None)
            kr=[(pi,fitz.Rect(r.x0*key[pi].rect.width/nav[pi].rect.width,r.y0*key[pi].rect.height/nav[pi].rect.height,r.x1*key[pi].rect.width/nav[pi].rect.width,r.y1*key[pi].rect.height/nav[pi].rect.height)) for pi,r in navrr]
        if q.get('originalN')!=q['n']:note=f'The source repeats Question {q["originalN"]}; this separate task is catalogued as Question {q["n"]} and matched to the corresponding marking guide.';corrections.append(note)
        ident=f'WV-{source["course"].upper().replace(" ","-")}-{source["examYear"]}-{slug.upper()}-{label}'
        a,txt,pg=panels(paper,rr,ident+'-q',images,review);b,_,kg=panels(key,kr,ident+'-k',images,review)
        extended=q['marks']>=20 and len(txt)<1800
        caption=f'{source["school"]} {source["examYear"]} — {"Multiple choice" if q["type"]=="Multiple Choice" else "Question"} {original}'
        answer=('<p><strong>Source answer: '+letter+'</strong></p>' if letter else '')+('<p>'+html.escape(note)+'</p>' if note else '')+figure(b,'Original source marking guide',packid)+'<p><a href="'+source['key']['url']+'" target="_blank" rel="noopener">Original marking guide</a></p>'
        if slug=='human-biology-mdc' and letter:answer+='<p><a href="https://wacevault.com/human_bio/y12/sem1%20exams/MDC%202022/Multi%20Choice%20Exam%20Answer%20Sheet%202022%20-%20MK.pdf" target="_blank" rel="noopener">Source multiple-choice key</a></p>'
        records.append(dict(id=ident,area='Science',course=source['course'],pathway='ATAR',year=12,unit=('Units 3 & 4' if source['units']=='34' else 'Unit '+source['units'])+' ('+str(source['examYear'])+' source)',syllabusVersion='source-'+str(source['examYear']),topic=source['topic'],type=q['type'],difficulty='Source assessment',marks=q['marks'],question='<p><strong>'+html.escape(caption)+'</strong></p>'+figure(a,'Original question, diagrams and writing space',packid),answer=answer,searchText=txt,sourceFile=source['paper']['url'],sourceKeyFile=source['key']['url'],sourcePublisher=source['school'],sourceQuestionNumber=label,sourcePrintedQuestionNumber=q.get('originalN',original),sourcePages=pg,sourceKeyPages=kg,examYear=source['examYear'],sourceSyllabusYear=source['examYear'],importBatch='wace-vault-science-2026-10-13',addedAt='2026-10-13T13:30:00Z',markingMode='manual',responseLines=q['marks']*2 if extended else 0,parts=[],questionImageIds=a,keyImageIds=b,reviewStatus='Source layout retained; matching source marking guide; historical syllabus'))
        count+=1
    pack=ROOT/f'scsa-source-pack-{packid}.js';pack.write_text('window.ScsaSourceImagePacks=Object.assign(window.ScsaSourceImagePacks||{},'+json.dumps({packid:images},separators=(',',':'))+');window.ScsaSourceImagePackMimeTypes=Object.assign(window.ScsaSourceImagePackMimeTypes||{},'+json.dumps({packid:'image/webp'},separators=(',',':'))+');\n');versions[packid]=hashlib.sha256(pack.read_bytes()).hexdigest()[:16]
    audit.append(dict(course=source['course'],source=source['paper']['url'],key=source['key']['url'],questions=count,corrections=corrections,paperSha256=hashlib.sha256(Path(source['paper']['local']).read_bytes()).hexdigest(),keySha256=hashlib.sha256(Path(source['key']['local']).read_bytes()).hexdigest()))
script='''(function(){const bank=window.UpperSchoolQuestionBank=window.UpperSchoolQuestionBank||[];const records=RECORDS;
window.ScsaSourceImagePackVersions=Object.assign(window.ScsaSourceImagePackVersions||{},VERSIONS);
const seen=new Set(bank.map(q=>q.id));const sources=new Set(bank.map(q=>[q.sourceFile,q.sourceQuestionNumber].join('|')));
for(const q of records){const source=[q.sourceFile,q.sourceQuestionNumber].join('|');if(!seen.has(q.id)&&!sources.has(source)){bank.push(q);seen.add(q.id);sources.add(source)}}
if(window.UpperSchoolSyllabusVersions)for(const q of records){const key='Science|'+q.course+'|ATAR|12';const v=window.UpperSchoolSyllabusVersions[key]||(window.UpperSchoolSyllabusVersions[key]=[{id:'current',label:'Current SCSA syllabus',applicable2026:true}]);if(!v.some(x=>x.id===q.syllabusVersion))v.push({id:q.syllabusVersion,label:q.examYear+' source assessments (historical syllabus)'})}
})();\n'''.replace('RECORDS',json.dumps(records,ensure_ascii=False,separators=(',',':'))).replace('VERSIONS',json.dumps(versions,separators=(',',':')))
(ROOT/'upper-school-assessment-bank-wace-vault-science.js').write_text(script)
(WORK/'records.json').write_text(json.dumps(records,ensure_ascii=False))
(ROOT/'wace-science-import-audit.json').write_text(json.dumps(dict(questions=len(records),subjects={course:sum(q['course']==course for q in records) for course in sorted(set(q['course'] for q in records))},papers=audit,held=held,reviewStatus='Contact sheet review pending'),indent=2))
for start in range(0,len(review),20):
    group=review[start:start+20];sheet=Image.new('RGB',(1200,480*((len(group)+3)//4)),'#ddd');draw=ImageDraw.Draw(sheet)
    for i,(label,im) in enumerate(group):x=(i%4)*300;y=(i//4)*480;draw.text((x+4,y+2),label[-42:],fill='black');sheet.paste(im,(x,y+25))
    sheet.save(WORK/f'review-{start//20:02d}.jpg')
print(json.dumps(dict(questions=len(records),panels=len(review),papers=audit,held=held)))
