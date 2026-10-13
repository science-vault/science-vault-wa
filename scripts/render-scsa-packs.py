"""Render reviewed source regions as lossless image packs without JPEG artefacts.

Requires final-records.json, final-audit.json and downloaded source manifests in
the work directory. Independent papers are rendered in separate processes.
"""
import concurrent.futures, hashlib, json, re, sys
from pathlib import Path

def render_job(job):
    work, helper, audit, questions, sources = job
    r=Path(work);sys.argv=['render',work];ns={};exec(helper,ns)
    fitz=ns['fitz'];crop=ns['crop'];starts=ns['starts'];pieces=ns['pieces'];lines=ns['lines']
    urlmap={l['url']:r/l['local'] for s in sources for l in s['links'] if l.get('local')}
    docs={};headcache={}
    def doc(url):
        url=url.split('#')[0]
        if url not in docs:docs[url]=fitz.open(urlmap[url])
        return docs[url]
    def heads(url,key):
        identity=(url.split('#')[0],key)
        if identity not in headcache:headcache[identity]=starts(doc(url),key)
        return headcache[identity]
    images={};sizes={}
    for q in questions:
        for field,urlfield in [('imageIds','sourceUrl'),('keyImageIds','sourceKeyUrl')]:
            if not q[field]:continue
            d=doc(q[urlfield]);hs=heads(q[urlfield],field=='keyImageIds')
            idx=next(i for i,h in enumerate(hs) if h['n']==q['sourceQuestionNumber'])
            ps=pieces(d,hs,idx,field=='keyImageIds')
            for pid in q[field]:
                if pid in images:continue
                if pid in q.get('sourceCropRegions',{}):
                    region=q['sourceCropRegions'][pid];pi=region['page']-1;rect=fitz.Rect(region['rect'])
                elif pid=='shared-text5':
                    p=d[11];top=next(b.y0 for t,b in lines(p) if t=='Question 20');pi=11
                    rect=fitz.Rect(38,48,p.rect.width-38,top-3)
                elif pid.startswith('shared-'):
                    first,last=map(int,pid.split('-')[1:]);h=next(h for h in hs if h['n']==first)
                    pi=h['page'];p=d[pi]
                    top=next(b.y0 for t,b in lines(p) if re.match(r'^Questions '+str(first)+r' (?:and|to) '+str(last)+r' refer',t))
                    rect=fitz.Rect(38,top-3,p.rect.width-38,h['top']-3)
                else:
                    j=int(pid.rsplit('-',1)[1])-1
                    if j>=len(ps):raise ValueError((q['id'],pid,len(ps)))
                    pi,rect=ps[j]
                size,_=crop(d,pi,rect,images,pid);sizes[pid]=size
        if q['supportImageIds']:
            sl=next(l for s in sources for l in s['links'] if l['url'] in q.get('supportUrls',[]))
            sd=doc(sl['url'])
            for pid in q['supportImageIds']:
                if pid in images:continue
                pi=int(pid.split('-')[1])-1;p=sd[pi];is_map='Broadsheet' in sl['label']
                rect=p.rect if is_map else fitz.Rect(38,67,p.rect.width-38,p.rect.height-45)
                size,_=crop(sd,pi,rect,images,pid,2400 if is_map else 1300);sizes[pid]=size
        q['panels']={pid:sizes[pid] for f in ['imageIds','keyImageIds','supportImageIds'] for pid in q[f]}
    packid=json.dumps(audit['pack'])
    prefix='/* Lossless original SCSA layouts, loaded on demand. */\nwindow.ScsaSourceImagePacks=window.ScsaSourceImagePacks||{};window.ScsaSourceImagePackMimeTypes=window.ScsaSourceImagePackMimeTypes||{};window.ScsaSourceImagePackMimeTypes['+packid+']='+'"image/webp";window.ScsaSourceImagePacks['+packid+']='
    path=r/'draft'/('scsa-source-pack-'+audit['pack']+'.js')
    path.write_text(prefix+json.dumps(images,separators=(',',':'))+';\n')
    audit['packVersion']=hashlib.sha256(path.read_bytes()).hexdigest()[:16]
    audit['imageFormat']='Lossless WebP'
    return questions,audit,path.stat().st_size

def main():
    r=Path(sys.argv[1]);records=json.loads((r/'final-records.json').read_text());audits=json.loads((r/'final-audit.json').read_text())
    helper=Path(__file__).with_name('import-scsa-atar.py').read_text().split('allrecords=[];audits=[]')[0]
    helper=helper.replace("im.save(stream,format='JPEG',quality=84,optimize=True)","im.save(stream,format='WEBP',lossless=True,method=3)")
    helper=helper.replace("if re.match(r'^(?:See next page|End of (?:Section|questions)|Question \\d+ \\(continued\\)|DO NOT WRITE)',t,re.I):", "if re.match(r'^(?:See next page|End of (?:Section|questions)|Question \\d+ \\(continued\\)|DO NOT WRITE)',t,re.I) or b.y0<75 and len(t)>4 and t.isupper():")
    sources=sum([json.loads((r/f).read_text()) for f in ['sources.json','remaining-sources.json','extra-sources.json']],[])
    jobs=[(str(r),helper,a,[q for q in records if q['imagePack']==a['pack']],sources) for a in audits]
    rendered=[];review=[]
    with concurrent.futures.ProcessPoolExecutor(max_workers=4) as pool:
        for qs,a,size in pool.map(render_job,jobs):
            rendered.extend(qs);review.append(a);print(a['course'],a['section'],size,flush=True)
    (r/'final-records.json').write_text(json.dumps(rendered,separators=(',',':'),ensure_ascii=False))
    (r/'final-audit.json').write_text(json.dumps(review,indent=2))

if __name__=='__main__':main()
