"""Reviewable, individually downloaded Physics paper/key pairs from WACE Vault.

Preserves diagrams and original working space in lossless WebP panels. Sources,
heading matches, mark totals, text fingerprints and reviewed corrections are audited.
Usage: python scripts/import-wace-vault-physics.py WORK_DIRECTORY
"""
import base64, hashlib, html, io, json, re, sys
from pathlib import Path
import fitz
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
WORK = Path(sys.argv[1])
def lines(p):
    return [(''.join(s['text'] for s in l['spans']).strip(), fitz.Rect(l['bbox']))
            for b in p.get_text('dict')['blocks'] for l in b.get('lines', [])]

def headings(doc):
    out=[]
    for pi,p in enumerate(doc):
        for t,b in lines(p):
            m=re.fullmatch(r'Question\s+(\d+)\s*(?:\((\d+)\s*marks?\))?',t)
            if not m or b.y0<20 or b.y0>p.rect.height-35:continue
            marks=int(m[2]) if m[2] else None
            for tt,bb in lines(p):
                mm=re.fullmatch(r'\((\d+)\s*marks?\)',tt)
                if mm and abs(bb.y0-b.y0)<12:marks=int(mm[1])
            if marks:
                n=int(m[1]);previous=next((q for q in out if q['n']==n),None)
                if previous and previous['marks']==marks:continue
                original=n
                if previous:n=max(q['n'] for q in out)+1
                out.append(dict(n=n,originalN=original,page=pi,top=b.y0-3,marks=marks))
    return out

def regions(doc,heads,i):
    q=heads[i];nxt=heads[i+1] if i+1<len(heads) else None;out=[]
    for pi in range(q['page'],(nxt['page'] if nxt else len(doc)-1)+1):
        p=doc[pi]
        if pi>q['page'] and len(re.sub('[^A-Za-z]','',p.get_text()))<8 and len(p.get_drawings())<10:continue
        top=q['top'] if pi==q['page'] else (48 if len(doc)>15 else 25)
        bottom=nxt['top']-3 if nxt and pi==nxt['page'] else p.rect.height-40
        stops=[b.y0-3 for t,b in lines(p) if b.y0>top+4 and re.match(r'^(?:END OF TEST|End of (?:Questions|Examination)|Section (?:One|Two|Three)|Supplementary page|ACKNOWLEDGEMENTS)',t,re.I)]
        if stops:bottom=min(bottom,min(stops))
        if bottom>top+8 and not (nxt and pi==nxt['page'] and bottom<100 and pi!=q['page']):out.append((pi,fitz.Rect(30,top,p.rect.width-30,bottom)))
        if stops:break
    return out

def norm(t):return re.sub(r'[^a-z0-9]','',t.lower())

def panels(doc,regions,prefix,images,review):
    ids=[];text=[];pages=[]
    for j,(pi,rect) in enumerate(regions):
        pix=doc[pi].get_pixmap(matrix=fitz.Matrix(1.8,1.8),clip=rect,alpha=False)
        im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
        stream=io.BytesIO();im.save(stream,format='WEBP',lossless=True,method=4)
        pid=f'{prefix}-{j+1}';images[pid]=base64.b64encode(stream.getvalue()).decode();ids.append(pid)
        text.append(doc[pi].get_text(clip=rect));pages.append(pi+1)
        small=im.copy();small.thumbnail((300,440));review.append((pid,small))
    return ids,'\n'.join(text),pages

def figure(ids,label,packid):return ''.join('<figure class="scsa-source-figure"><img data-scsa-pack="'+packid+'" data-scsa-image="'+x+'" alt="'+html.escape(label)+'" style="width:100%;height:auto" loading="lazy"></figure>' for x in ids)

records=[];audits=[];packs={};review=[];existing=json.loads((WORK/'existing-physics.json').read_text())
existing_text=[norm(q.get('searchText','') or re.sub('<[^>]+>',' ',q.get('question',''))) for q in existing]
seen=set();held=[]
topics={'motion':'Motion and forces','motion2':'Motion and forces','electricity':'Electrical physics','thermal':'Heating and cooling','nuclear':'Nuclear physics','waves':'Waves','modern':'Relativity and modern physics'}
for s in json.loads((WORK/'sources.json').read_text()):
    paper=fitz.open(s['paper']['local']);key=fitz.open(s['key']['local']);qs=headings(paper);ks=headings(key)
    assert sorted(q['n'] for q in qs)==list(range(1,len(qs)+1)) and qs,s['slug']
    images={};corrections=[];count=0;packid='wace-physics-'+s['slug']
    for i,q in enumerate(qs):
        kn=q['n']
        if s['slug']=='electricity':kn={4:5,5:6,6:7,7:4}.get(kn,kn)
        matches=[j for j,k in enumerate(ks) if k['n']==kn]
        assert len(matches)==1,(s['slug'],q['n'],ks)
        ki=matches[0];k=ks[ki]
        if q['marks']!=k['marks']:
            held.append(dict(source=s['paper']['url'],question=q['n'],reason='Paper/key declared mark totals disagree',paperMarks=q['marks'],keyMarks=k['marks']));continue
        rr=regions(paper,qs,i);kr=regions(key,ks,ki)
        raw='\n'.join(paper[pi].get_text(clip=r) for pi,r in rr)
        fingerprint=norm(raw)
        # The first substantive prompt is sufficient to flag copies across books.
        prompts=[norm(t) for pi,r in rr for t,b in lines(paper[pi]) if r.y0<=b.y0<r.y1 and len(norm(t))>65 and not t.startswith('_')]
        candidate=next((t for t in prompts if not re.match(r'^(when|suggested|supplementary)',t)),None)
        if fingerprint in seen or (candidate and any(candidate in old for old in existing_text)):
            held.append(dict(source=s['paper']['url'],question=q['n'],reason='Existing question text duplicate'));continue
        seen.add(fingerprint)
        ident=f"WV-PHY-{s['examYear']}-Y{s['year']}-{s['slug'].upper()}-Q{q['n']:02d}"
        a,txt,pg=panels(paper,rr,ident+'-q',images,review);b,_,kg=panels(key,kr,ident+'-k',images,review)
        note=''
        if q['originalN']!=q['n']:
            note=f'Source booklet repeats Question {q["originalN"]} for a separate {q["marks"]}-mark task; catalogued as Question {q["n"]} to keep both tasks separate.'
            corrections.append(dict(question=q['n'],originalQuestion=q['originalN'],note=note))
        if kn!=q['n']:
            note=f'Source marking guide labels this answer Question {kn}; matched to paper Question {q["n"]} by its prompt and mark total.'
            corrections.append(dict(question=q['n'],keyQuestion=kn,note=note))
        topic=topics.get(s['slug'],'Source semester examination')
        if s['slug']=='exam-unit3':
            topic={1:'Electromagnetic induction',2:'Electromagnetic induction',3:'Equilibrium and torque',4:'Circular motion',5:'Forces and motion',6:'Gravitation and orbits',7:'Electromagnetic induction',8:'Magnetic fields',9:'Electric fields',10:'Equilibrium and torque',11:'Projectile motion',12:'Magnetic fields',13:'Gravitation and orbits',14:'Projectile motion',15:'Electric motors',16:'Equilibrium and torque',17:'Transformers',18:'Electric fields',19:'Renewable energy',20:'Equilibrium and torque'}[q['n']]
        unit={'motion':'2','motion2':'2','electricity':'1','thermal':'1','nuclear':'1','waves':'2','modern':'4','exam-unit3':'3'}[s['slug']]
        records.append(dict(id=ident,area='Science',course='Physics',pathway='ATAR',year=s['year'],unit='Unit '+unit+' ('+str(s['examYear'])+' source)',syllabusVersion='source-'+str(s['examYear']),topic=topic,type='Problem Solving' if q['marks']>=10 else 'Short Response',difficulty='Source assessment',marks=q['marks'],question='<p><strong>'+html.escape(s['school'])+' '+str(s['examYear'])+' — Question '+str(q['n'])+'</strong></p>'+figure(a,'Physics question with original response spaces',packid),answer=('<p>'+html.escape(note)+'</p>' if note else '')+figure(b,'Original source marking guide',packid)+'<p><a href="'+s['key']['url']+'" target="_blank" rel="noopener">Original marking guide</a></p>',searchText=txt,sourceFile=s['paper']['url'],sourceKeyFile=s['key']['url'],sourcePublisher=s['school'],sourceQuestionNumber=q['n'],sourceKeyQuestionNumber=kn,sourcePages=pg,sourceKeyPages=kg,examYear=s['examYear'],sourceSyllabusYear=s['examYear'],importBatch='wace-vault-physics-2026-10-13',addedAt='2026-10-13T12:45:00Z',markingMode='manual',responseLines=0,parts=[],questionImageIds=a,keyImageIds=b,reviewStatus='Source question and marking guide matched; original writing spaces and diagrams retained; historical syllabus'))
        count+=1
    pack=f'scsa-source-pack-{packid}.js'
    (ROOT/pack).write_text('window.ScsaSourceImagePacks=Object.assign(window.ScsaSourceImagePacks||{},'+json.dumps({packid:images},separators=(',',':'))+');window.ScsaSourceImagePackMimeTypes=Object.assign(window.ScsaSourceImagePackMimeTypes||{},'+json.dumps({packid:'image/webp'},separators=(',',':'))+');\n')
    packs[packid]=hashlib.sha256((ROOT/pack).read_bytes()).hexdigest()[:16];audits.append(dict(source=s['paper']['url'],key=s['key']['url'],questions=count,corrections=corrections,paperSha256=hashlib.sha256(Path(s['paper']['local']).read_bytes()).hexdigest(),keySha256=hashlib.sha256(Path(s['key']['local']).read_bytes()).hexdigest()))

script='''(function(){const bank=window.UpperSchoolQuestionBank=window.UpperSchoolQuestionBank||[];const records=RECORDS;const packs=PACKS;
window.ScsaSourceImagePackVersions=Object.assign(window.ScsaSourceImagePackVersions||{},packs);
const seen=new Set(bank.map(q=>q.id));const sources=new Set(bank.map(q=>[q.sourceFile,q.sourceQuestionNumber].join('|')));
for(const q of records){const source=[q.sourceFile,q.sourceQuestionNumber].join('|');if(!seen.has(q.id)&&!sources.has(source)){bank.push(q);seen.add(q.id);sources.add(source)}}
if(window.UpperSchoolSyllabusVersions)for(const q of records){const key='Science|Physics|ATAR|'+q.year;const v=window.UpperSchoolSyllabusVersions[key]||(window.UpperSchoolSyllabusVersions[key]=[{id:'current',label:'Current SCSA syllabus',applicable2026:true}]);if(!v.some(x=>x.id===q.syllabusVersion))v.push({id:q.syllabusVersion,label:q.examYear+' source assessments (historical syllabus)'})}
})();
'''.replace('RECORDS',json.dumps(records,ensure_ascii=False,separators=(',',':'))).replace('PACKS',json.dumps(packs,separators=(',',':')))
(ROOT/'upper-school-assessment-bank-physics-wace-vault.js').write_text(script)
(ROOT/'wace-physics-import-audit.json').write_text(json.dumps(dict(questions=len(records),papers=audits,held=held,duplicateCheck='Source URL/question identity plus normalized first substantive prompt against existing imported Physics records',reviewStatus='Contact sheet review pending'),indent=2))
(WORK/'records.json').write_text(json.dumps(records,ensure_ascii=False))
for start in range(0,len(review),24):
    group=review[start:start+24];sheet=Image.new('RGB',(1200,480*((len(group)+3)//4)),'#ddd');draw=ImageDraw.Draw(sheet)
    for i,(label,im) in enumerate(group):x=(i%4)*300;y=(i//4)*480;draw.text((x+4,y+2),label,fill='black');sheet.paste(im,(x,y+25))
    sheet.save(WORK/f'review-{start//24:02d}.jpg')
print(json.dumps(dict(questions=len(records),papers=len(audits),panels=len(review),held=held)))
