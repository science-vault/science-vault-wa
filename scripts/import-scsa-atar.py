"""Import exact SCSA source layouts after reviewing generated contact sheets.

Usage: python scripts/import-scsa-atar.py /absolute/work-directory
Input sources.json lists course, slug, page and downloaded links (label/url/local).
Draft output remains outside the live bank until explicitly reviewed.
"""
import base64, hashlib, html, io, json, re, sys
from pathlib import Path
import fitz
from PIL import Image, ImageDraw, ImageChops

WORK = Path(sys.argv[1])
OUT = WORK / 'draft'
OUT.mkdir(exist_ok=True)
OMITTED = re.compile(r'(?:copyright reasons|content.*?omitted|image.*?removed)', re.I|re.S)

def lines(page):
    return [(''.join(s['text'] for s in l['spans']).strip(),fitz.Rect(l['bbox']))
            for b in page.get_text('dict')['blocks'] for l in b.get('lines',[])]

def content_lines(page):
    return [(t,b) for t,b in lines(page) if 48 < b.y0 < page.rect.height-45
            and t and not re.match(r'^(?:See next page|DO NOT WRITE|Question \d+ \(continued\)|End of|This page|Supplementary page|Question number:)',t,re.I)]

def starts(doc, key=False):
    out=[]; section='Written Response';topic='Source examination'; mc=False
    for pi,p in enumerate(doc):
        if not key and pi<2:continue
        ls=lines(p)
        if pi>1 and (re.search(r'^ACKNOWLEDGEMENTS',p.get_text(),re.M) or 'Published by the School Curriculum' in p.get_text() or re.search(r'This document.{0,30}apart from',p.get_text(),re.S)):break
        for t,b in ls:
            if b.y0<48 or b.y0>p.rect.height-45:continue
            if re.match(r'^Section (?:One|Two|Three|Four|Five)',t):
                topic=t;mc=bool(re.search('Multiple.choice',t,re.I))
                section='Multiple Choice' if mc else 'Written Response'
            m=re.fullmatch(r'Question\s+(\d+)(?::[^()]*)?\s*(?:\((\d+)\s*marks?\))?',t)
            if m:
                mark=int(m[2]) if m[2] else None
                for tx,bx in ls:
                    mm=re.fullmatch(r'\((\d+)\s*marks?\)',tx)
                    if mm and abs(bx.y0-b.y0)<10:mark=int(mm[1])
                if mark is not None and not any(q['n']==int(m[1]) for q in out):
                    top=b.y0-3
                    # Instructions naming a source belong to the following question.
                    for tx,bx in reversed(ls):
                        if 0<b.y0-bx.y0<60 and re.match(r'^Refer to (?:Source|the)',tx):top=min(top,bx.y0-3)
                    out.append(dict(n=int(m[1]),page=pi,top=top,marks=mark,type=section,topic=topic))
            elif mc and not key:
                m=re.match(r'^(\d+)\.\s*(.*)$',t)
                if m and b.x0<80 and not any(q['n']==int(m[1]) for q in out):
                    top=b.y0-3
                    for tx,bx in reversed(ls):
                        if 0<b.y0-bx.y0<65 and re.match(r'^Refer to Source',tx):top=min(top,bx.y0-3)
                    out.append(dict(n=int(m[1]),page=pi,top=top,marks=1,type='Multiple Choice',topic=topic))
    return out

def pieces(doc,heads,index,key=False):
    q=heads[index]; nxt=heads[index+1] if index+1<len(heads) else None
    ep=nxt['page'] if nxt else len(doc)-1
    result=[]
    for pi in range(q['page'],ep+1):
        p=doc[pi];top=q['top'] if pi==q['page'] else 48
        if pi>q['page'] and (re.search(r'^ACKNOWLEDGEMENTS',p.get_text(),re.M) or 'Published by the School Curriculum' in p.get_text() or re.search(r'This document.{0,30}apart from',p.get_text(),re.S)):break
        bot=nxt['top']-3 if nxt and pi==ep else p.rect.height-46
        ls=lines(p)
        # Stop before the next section or the administrative end matter.
        barriers=[b.y0-3 for t,b in ls if b.y0>top+3 and re.match(r'^(?:Section (?:One|Two|Three|Four|Five)|End of (?:Section|questions|examination)|Supplementary page|ACKNOWLEDGEMENTS|Questions \d+ (?:and|to) \d+ refer)',t,re.I)]
        barriers += [b.y0-3 for t,b in ls if b.y0>top+3 and re.fullmatch(r'Part [AB]',t) and any('%' in tt and abs(bb.y0-b.y0)<10 for tt,bb in ls)]
        if barriers:bot=min(bot,min(barriers))
        # End-of-questions may sit above the last question on its page.
        if bot<=top+5:continue
        usable=[(t,b) for t,b in content_lines(p) if top<=b.y0<bot]
        if not usable:
            if pi>q['page']:break
            continue
        if re.search(r'^Copyright ©',p.get_text(),re.M) and pi>q['page']:break
        # Preserve existing answer lines, but do not absorb blank section answer pages.
        rect=fitz.Rect(38,top,p.rect.width-38,bot)
        result.append((pi,rect))
        if barriers:break
    return result

def crop(doc,pi,rect,images,panelid,max_width=1100):
    p=doc[pi];scale=max_width/rect.width
    pix=p.get_pixmap(matrix=fitz.Matrix(scale,scale),clip=rect,alpha=False)
    im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
    # Erase recurring continuation labels, leaving prompts and writing spaces.
    draw=ImageDraw.Draw(im)
    for t,b in lines(p):
        if re.match(r'^(?:See next page|End of (?:Section|questions)|Question \d+ \(continued\)|DO NOT WRITE)',t,re.I):
            draw.rectangle(((b.x0-rect.x0-2)*scale,(b.y0-rect.y0-2)*scale,(b.x1-rect.x0+2)*scale,(b.y1-rect.y0+2)*scale),fill='white')
    # Trim empty trailing pixels only for compact prompts / marking tables.
    diff=ImageChops.difference(im,Image.new('RGB',im.size,'white')).convert('L').point(lambda v:255 if v>40 else 0)
    ink=diff.getbbox()
    if ink:im=im.crop((0,0,im.width,min(im.height,ink[3]+18)))
    stream=io.BytesIO();im.save(stream,format='JPEG',quality=84,optimize=True)
    images[panelid]=base64.b64encode(stream.getvalue()).decode()
    return im.size,im

def mc_answers(doc):
    answers={}
    for pi,p in enumerate(doc):
        t=p.get_text()
        if 'Multiple-choice' not in t and pi>2:continue
        ls=lines(p)
        for tx,b in ls:
            if re.fullmatch(r'\d+',tx) and 70<b.y0<p.rect.height-45:
                letters=[tt.upper() for tt,bb in ls if abs(bb.y0-b.y0)<5 and bb.x0>b.x1 and re.fullmatch(r'[a-d](?:\s+(?:and|or)\s+[a-d])?',tt)]
                if len(letters)==1:answers[int(tx)]=letters[0]
    return answers

def area(course):
    if course.startswith('Mathematics'):return 'Mathematics'
    if course in ['Psychology','Biology','Chemistry','Human Biology','Earth and Environmental Science','Marine and Maritime Studies']:return 'Science'
    if course in ['English','Literature','English as an Additional Language or Dialect']:return 'English'
    if course in ['Physical Education Studies','Health Studies','Outdoor Education']:return 'Health and Physical Education'
    if course in ['Computer Science','Applied Information Technology','Aviation','Engineering Studies','Food Science and Technology','Materials Design and Technology']:return 'Technologies'
    if course in ['Dance','Design','Drama','Media Production and Analysis','Music','Visual Arts']:return 'The Arts'
    return 'Humanities and Social Sciences'

def contacts(slug,thumbs):
    paths=[]
    for part in range(0,len(thumbs),16):
        sheet=Image.new('RGB',(1400,1600),'#ddd');draw=ImageDraw.Draw(sheet)
        for k,(label,im) in enumerate(thumbs[part:part+16]):
            x=(k%4)*350;y=(k//4)*400
            draw.text((x+6,y+5),label,fill='black');small=im.copy();small.thumbnail((338,370));sheet.paste(small,(x+6,y+24))
        path=OUT/f'{slug}-review-{part//16+1:02}.jpg';sheet.save(path,quality=85);paths.append(str(path))
    return paths

allrecords=[];audits=[]
for source in json.loads((WORK/(sys.argv[2] if len(sys.argv)>2 else 'sources.json')).read_text()):
    for link in source.get('links',[]):
        if 'Examination' not in link['label'] or 'Broadsheet' in link['label'] or 'report' in link['label'].lower():continue
        section=link['label'].replace('2025 ','')
        qualifier='Calculator Assumed' if 'Assumed' in section else 'Calculator Free' if 'Free' in section else ''
        keys=[l for l in source['links'] if 'Marking Key' in l['label'] and (not qualifier or qualifier in l['label'])]
        if len(keys)!=1:continue
        keylink=keys[0];doc=fitz.open(WORK/link['local']);key=fitz.open(WORK/keylink['local'])
        slug=re.sub('[^a-z0-9]+','-',source['course'].lower()).strip('-')+'-2025-'+re.sub('[^a-z0-9]+','-',section.lower()).strip('-')
        heads=starts(doc);keyheads=starts(key,True);keymap={h['n']:i for i,h in enumerate(keyheads)};answers=mc_answers(key)
        images={};panels={};thumbs=[];records=[];held=[]
        shared={}
        for pi,p in enumerate(doc):
            for tx,bx in lines(p):
                sm=re.match(r'^Questions (\d+) (and|to) (\d+) refer',tx)
                if not sm:continue
                first,last=int(sm[1]),int(sm[3]);following=[q for q in heads if q['page']==pi and q['n']==first and q['top']>bx.y0]
                if not following:raise ValueError('Shared stimulus cannot be bounded')
                sid=f'shared-{first:02}-{last:02}';rect=fitz.Rect(38,bx.y0-3,p.rect.width-38,following[0]['top']-3)
                size,im=crop(doc,pi,rect,images,sid);panels[sid]=size;thumbs.append((sid,im))
                for n in range(first,last+1):shared[n]=[sid]
        support=[];support_text='';support_urls=[]
        for sl in source['links']:
            if not any(x in sl['label'] for x in ['Source Booklet','Text Booklet','Broadsheet A3']):continue
            support_urls.append(sl['url']);sd=fitz.open(WORK/sl['local'])
            for pi,p in enumerate(sd):
                st=p.get_text()
                if re.search('Copyright ©|ACKNOWLEDGEMENTS|blank intentionally',st) and not 'Broadsheet' in sl['label']:continue
                sid=f'support-{pi+1:02}';rect=p.rect if 'Broadsheet' in sl['label'] else fitz.Rect(38,67,p.rect.width-38,p.rect.height-45)
                size,im=crop(sd,pi,rect,images,sid,2400 if 'Broadsheet' in sl['label'] else 1300)
                panels[sid]=size;support.append(sid);support_text+=st;thumbs.append((sid,im))
        for i,h in enumerate(heads):
            if source.get('questionNumbers') and h['n'] not in source['questionNumbers']:continue
            ps=pieces(doc,heads,i);text='\n'.join(doc[pi].get_text(clip=rect) for pi,rect in ps)
            reason=None
            if not ps:reason='No complete source region found'
            elif OMITTED.search(text):reason='Required third-party content omitted in official web source'
            elif source['course']=='English' and h['n'] in [1,2]:reason='Required Text 1 omitted from official web source'
            elif source['course']=='Modern History' and h['n'] in [1,11]:reason='Elective-specific source-analysis task requires separately reviewed complete source set'
            if reason:held.append({'question':h['n'],'reason':reason});continue
            qids=[];kids=[];qpanels={};keypages=[]
            for j,(pi,rect) in enumerate(ps):
                pid=f'q{h["n"]:02}-{j+1:02}';size,im=crop(doc,pi,rect,images,pid);qids.append(pid);qpanels[pid]=size;thumbs.append((pid,im))
            for sid in shared.get(h['n'],[]):qids.insert(0,sid);qpanels[sid]=panels[sid]
            if h['n'] in keymap:
                ki=keymap[h['n']];kh=keyheads[ki]
                if kh['marks']!=h['marks']:
                    held.append({'question':h['n'],'reason':'Paper/key total marks disagree; review required'});continue
                for j,(pi,rect) in enumerate(pieces(key,keyheads,ki,True)):
                    pid=f'key{h["n"]:02}-{j+1:02}';size,im=crop(key,pi,rect,images,pid);kids.append(pid);qpanels[pid]=size;keypages.append(pi+1);thumbs.append((pid,im))
            kpage=keypages[0] if keypages else 2
            sourceurl=link['url']+'#page='+str(h['page']+1);keyurl=keylink['url']+'#page='+str(kpage)
            needs_support=bool(support) and (source['course'] in ['Geography','Dance'] or source['course']=='Visual Arts' and h['n']<=3 or source['course']=='Computer Science' and h['n']>=21 or source['course']=='Drama' and h['n']<=2 or source['course']=='Literature' and h['n']==1 or source['course']=='Religion and Life' and h['n']<=3)
            if needs_support and OMITTED.search(support_text):
                held.append({'question':h['n'],'reason':'Required supporting booklet has omitted material; manual source selection needed'});continue
            qpanels.update({pid:panels[pid] for pid in support} if needs_support else {})
            identifier='SCSA-'+slug.upper()+'-Q'+f'{h["n"]:02}'
            letter=answers.get(h['n']) if h['type']=='Multiple Choice' else None
            answer=('<p><strong>Official answer: '+html.escape(letter)+'.</strong></p>' if letter else '')+f'<p><a href="{html.escape(keyurl)}" target="_blank" rel="noopener">Official SCSA marking guide — Question {h["n"]}</a></p>'
            extra=0 if h['type']=='Multiple Choice' else 2*h['marks'] if source['course'].startswith('Mathematics') or len(ps)==1 and ps[0][1].height<430 else 0
            record=dict(id=identifier,course=source['course'],area=area(source['course']),pathway='ATAR',year=12,examYear=2025,sourceQuestionNumber=h['n'],sourceSection=section,sourcePublisher='SCSA',sourceUrl=sourceurl,sourceKeyUrl=keyurl,sourcePageUrl=source['page'],sourcePages=[pi+1 for pi,r in ps],sourceKeyPages=keypages,marks=h['marks'],type=h['type'],topic=h['topic'],unit='Units 3 and 4 (2025 SCSA source)',syllabusVersion='source-2025',sourceSyllabusYear=2025,currentSyllabusStatus='historical-source',questionFormat='source-image',searchText=f'2025 SCSA {source["course"]} Question {h["n"]} '+text,difficulty='Exam standard',addedAt='2026-10-13T10:00:00Z',importBatch='scsa-all-atar-2026-10-13-continuation',sourceComplete=True,markingMode='manual',responseLines=0,imagePack=slug,imageIds=qids,keyImageIds=kids,supportImageIds=support if needs_support else [],supportUrls=support_urls if needs_support else [],answer=answer,panels=qpanels,extraLines=extra,questionFingerprint=hashlib.sha256(re.sub(r'\s+',' ',text).strip().encode()).hexdigest())
            if letter:record.update(correctAnswer=letter,correctLetter=letter)
            if h['type']=='Multiple Choice' and not letter:raise ValueError(f'{slug} Q{h["n"]}: official answer not found')
            records.append(record)
        used={pid for q in records for pid in q['imageIds']+q['keyImageIds']+q['supportImageIds']};images={k:v for k,v in images.items() if k in used}
        pack='/* Original SCSA question and marking-guide images, loaded on demand. */\nwindow.ScsaSourceImagePacks=window.ScsaSourceImagePacks||{};window.ScsaSourceImagePacks['+json.dumps(slug)+']='+json.dumps(images,separators=(',',':'))+';\n'
        (OUT/('scsa-source-pack-'+slug+'.js')).write_text(pack)
        review=contacts(slug,[(l,im) for l,im in thumbs if l in used])
        audit=dict(course=source['course'],year=2025,section=section,source=link['url'],key=keylink['url'],detected=len(heads),importable=len(records),withheld=held,images=len(images),reviewed=False,reviewSheets=review,pack=slug,packVersion=hashlib.sha256(pack.encode()).hexdigest()[:16])
        print(json.dumps({k:audit[k] for k in ['course','section','detected','importable','withheld','images']}),flush=True)
        audits.append(audit);allrecords.extend(records)
(OUT/'records.json').write_text(json.dumps(allrecords,ensure_ascii=False,separators=(',',':')))
(OUT/'audit.json').write_text(json.dumps(audits,indent=2))
