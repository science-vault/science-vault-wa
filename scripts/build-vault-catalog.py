"""One content-hash catalogue for every resource tab. Keep original file URLs intact."""
import json,re,sys,subprocess,collections,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
EMPTY='e69de29bb2d1d6434b8b29ae775ad8c2e48c5391'
EXT=re.compile(r'\.(pdf|docx?|pptx?|xlsx?|csv|mp4|mov|webm|m4v|ogv|jpe?g|png|svg|gif|tiff?|zip|rtf|txt|odt|ods|odp)$',re.I)
JUNK=re.compile(r'(^|/)(__MACOSX|~\$[^/]*|\.\_[^/]*|\.~lock\.[^/]*|Thumbs\.db|desktop\.ini|\.DS_Store)(/|$)',re.I)
ALIASES={'accounting':'Accounting and Finance','accounting and finance':'Accounting and Finance','business management':'Business Management and Enterprise','business management and enterprise':'Business Management and Enterprise','human biology':'Human Biology','hbio':'Human Biology','biology':'Biology','chemistry':'Chemistry','physics':'Physics','psychology':'Psychology','geography':'Geography','maths':'Mathematics','mathematics':'Mathematics','mathematics methods':'Mathematics Methods','mathematics specialist':'Mathematics Specialist','mathematics applications':'Mathematics Applications','english':'English','literature':'Literature','science':'Science','hass':'HASS','humanities and social sciences':'HASS','digital technologies':'Digital Technologies','digital technology':'Digital Technologies','physical education studies':'Physical Education Studies','health and physical education':'Health and Physical Education','economics':'Economics','ancient history':'Ancient History','modern history':'Modern History','integrated science':'Integrated Science','outdoor education':'Outdoor Education','applied information technology':'Applied Information Technology','engineering studies':'Engineering Studies','marine and maritime studies':'Marine and Maritime Studies','earth and environmental science':'Earth and Environmental Science','food science and technology':'Food Science and Technology','forensics':'Forensics','stem':'STEM'}
ALIASES.update({'mathematics essentials':'Mathematics Essential','mathematics essential':'Mathematics Essential','english lit':'Literature','english literature':'Literature','pe studies':'Physical Education Studies','physical education':'Physical Education Studies','hospitality':'Hospitality','business':'Business','visual arts':'Visual Arts','music':'Music','design':'Design','drama':'Drama','health studies':'Health Studies','mathematics foundation':'Mathematics Foundation'})
ROLE=re.compile(r'\b(answer\s*key|answers?|marking\s*(key|guide|scheme)|mark\s*(key|scheme)|worked\s*solutions?|solutions?|teacher\s*(copy|answers?)|student\s*copy|rubric|criteria\s*sheet)\b',re.I)
SCHOOL=re.compile(r'school|college|academy|grammar|\bshs\b|\bwatp\b|\bstawa\b|shenton|willetton|churchlands|narrogin|safety bay|aranmore|applecross|rossmoyne|kennedy|eastern goldfields|southern river',re.I)
def normalize(s):return re.sub(r'[^a-z0-9]+',' ',s.lower()).strip()
def metadata(e):
 p=e['path'];parts=p.split('/');folders=parts[:-1];name=parts[-1];stem=Path(name).stem;ext=Path(name).suffix.lower();low=p.lower();
 year=next(('Year '+re.search(r'\d+',x).group() for x in folders if re.fullmatch(r'(?:year\s*)?(7|8|9|10|11|12)',x,re.I)),'')
 if not year:
  m=re.search(r'\b(?:year|yr)\s*(7|8|9|10|11|12)\b',stem,re.I);year='Year '+m[1] if m else ''
 pathway='Years 7–10' if year and int(year.split()[-1])<=10 else 'General' if any(re.search(r'\bgeneral$',x,re.I) for x in folders) else 'ATAR' if any(x.lower()=='atar' for x in folders) else ''
 subject='';candidates=[ALIASES.get(normalize(re.sub(r'\s+(atar|general)$','',x,flags=re.I))) for x in folders]
 if year and int(year.split()[-1])<=10 and ('Science' in candidates or any(x in folders for x in ['Biological Sciences','Chemical Sciences','Earth and Space Sciences','Physical Sciences','Science Inquiry'])):subject='Science'
 else:subject=next((x for x in candidates if x),'Other / subject not specified')
 if subject=='Other / subject not specified':
  raw=parts[2] if p.startswith('exams/') or len(parts)>2 and parts[1].lower() in ['atar','general','textbooks'] else parts[4] if len(parts)>5 and parts[1].lower()=='assessments' and parts[2].lower()=='lowerschool' else parts[2] if len(parts)>3 and parts[1].lower()=='assessments' else ''
  if raw and not re.fullmatch(r'(?:year\s*)?\d+|resources?|general',raw,re.I):subject=ALIASES.get(normalize(re.sub(r'\s+(atar|general)$','',raw,flags=re.I)),raw.strip())
 unit=next((x for x in folders if re.match(r'^unit\s*[1-4](?:\b|\s)',x,re.I)),'') or next((x for x in folders if x in ['Biological Sciences','Chemical Sciences','Earth and Space Sciences','Physical Sciences','Science Inquiry']),'')
 school=next((x for x in folders if SCHOOL.search(x) and not re.match(r'lowerschool|years?\b',x,re.I)),'')
 schoolyear=next((x for x in reversed(folders) if re.fullmatch(r'(19|20)\d{2}',x)), '')
 if not schoolyear:
  m=re.search(r'\b((?:19|20)\d{2})\b',stem);schoolyear=m[1] if m else ''
 assessment_positions=[i for i,x in enumerate(folders) if re.fullmatch(r'assessments?',x,re.I)]
 teaching_positions=[i for i,x in enumerate(folders) if i>0 and re.fullmatch(r'resources?|powerpoints?|worksheets?|notes?|revision|practicals?|teaching.*resources',x,re.I)]
 assessment_folder=bool(assessment_positions) and max(assessment_positions)>max(teaching_positions,default=-1)
 role='Rubric' if re.search(r'rubric|criteria sheet|marking criteria',stem,re.I) else 'Answers / marking key' if re.search(r'answers?|solutions?|marking|mark scheme|\bmk\b|teacher copy',stem,re.I) else 'Resource'
 # Extension identifies presentations/videos; protected assessment folders outrank ordinary teaching types.
 if ext in ['.mp4','.mov','.webm','.m4v','.ogv']:kind='Videos'
 elif '/textbooks/' in '/'+low or p.startswith('textbooks/'):kind='Textbooks'
 elif p.startswith('exams/'):kind='Exams'
 elif assessment_folder:kind='Assessments'
 elif ext in ['.ppt','.pptx','.odp']:kind='PowerPoints'
 elif re.search(r'\bexam(?:ination)?\b|semester.*paper',normalize(stem)):kind='Exams'
 elif re.search(r'\b(test|quiz|assessment)\b',normalize(stem)):kind='Assessments'
 elif re.search(r'practical|experiment|investigation|dissection|fieldwork',low):kind='Practicals'
 elif re.search(r'revision|review',low):kind='Revision'
 elif re.search(r'worksheet|work sheet|activity sheet|student sheet|question sheet|questions|booklet|handout|guided notes|workbook|activity|help sheet',low):kind='Worksheets'
 elif re.search(r'\bnotes?\b|summary|reference|primary sources|biography',normalize(low)):kind='Notes'
 elif ext=='.pdf' and any(re.fullmatch(r'powerpoints?|ppts?',x,re.I) for x in folders):kind='PowerPoints'
 else:kind='Other Resources'
 title=re.sub(r'[_]+',' ',stem);title=re.sub(r'\s+',' ',title).strip()
 clean=ROLE.sub(' ',title);clean=re.sub(r'\bmk\b',' ',clean,flags=re.I);clean=re.sub(r'\s*\((?:copy|\d+)\)\s*$','',clean,flags=re.I);clean=re.sub(r'[_–—-]+',' ',clean);clean=re.sub(r'\s+',' ',clean).strip() or title
 topic=next((x for x in reversed(folders) if x not in [school,year,unit,schoolyear] and normalize(x) not in ALIASES and not re.fullmatch(r'atar|general|resources?|assessments?|exams?|textbooks?|powerpoints?|worksheets?|notes?|revision|practicals?|videos?|lowerschool|year\s*\d+|\d+|by syllabus point',x,re.I)),'')
 # Only group exact lesson/exam names within the same curriculum/source folder; do not merge different years or schools.
 group=hashlib.sha256(('/'.join(folders)+'|'+normalize(clean)).encode()).hexdigest()[:20]
 return {'path':p,'title':title,'type':kind,'subject':subject,'year':year,'pathway':pathway,'unit':unit,'topic':topic,'school':school,'examYear':schoolyear,'role':role,'group':group,'groupTitle':clean,'format':ext[1:].upper()}
def build(tree):
 # Publish the directory with the site artifact, without a second workflow.
 directory_files=[{'path':e['path'],'type':'blob'} for e in tree if e.get('type')=='blob' and re.search(r'\.(pptx?|ppsx?|pdf|docx?|xlsx?)$',e['path'],re.I) and e.get('sha')!=EMPTY and not JUNK.search(e['path'])]
 directory_files.sort(key=lambda e:e['path'].casefold())
 (ROOT/'file-directory-index.json').write_text(json.dumps({'version':1,'files':directory_files},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 roots=[e for e in tree if e.get('type')=='blob' and e['path'].startswith(('resources/','exams/','textbooks/'))]
 empty=[e['path'] for e in roots if e['sha']==EMPTY];junk=[e['path'] for e in roots if JUNK.search(e['path'])]
 valid=[e for e in roots if EXT.search(e['path']) and e['sha']!=EMPTY and not JUNK.search(e['path'])]
 groups=collections.defaultdict(list)
 for e in valid:groups[e['sha']].append(e)
 rows=[];duplicates=[];misplaced=[]
 for sha,entries in groups.items():
  entries.sort(key=lambda e:(bool(re.search(r'\bcopy\b|\(\d+\)',e['path'],re.I)),bool(JUNK.search(e['path'])),len(e['path']),e['path'].lower()))
  canonical=entries[0];row=metadata(canonical);row['sha']=sha;row['size']=canonical.get('size');row['modified']=canonical.get('modified','')
  if len(entries)>1:
   row['aliases']=[{k:v for k,v in metadata(e).items() if k not in ['title','group','groupTitle','format']} for e in entries[1:]];duplicates.append({'canonical':canonical['path'],'copies':[e['path'] for e in entries[1:]],'sha':sha})
  if row['type']=='PowerPoints' and re.search(r'/worksheets?/',row['path'],re.I):misplaced.append({'path':row['path'],'shownIn':'PowerPoints','reason':'Presentation file inside worksheet folder'})
  if row['type'] not in ['Assessments','Exams'] and '/Assessments/' in row['path']:misplaced.append({'path':row['path'],'shownIn':row['type'],'reason':'Teaching resource or video inside an assessment archive'})
  if row['type']=='Textbooks' and '/Assessments/' in row['path']:misplaced.append({'path':row['path'],'shownIn':'Textbooks','reason':'Textbook file inside assessment folder'})
  rows.append(row)
 rows.sort(key=lambda r:(r['type'],r['subject'],r['year'],r['title'].lower()))
 for old in ROOT.glob('vault-index-*.json'):old.unlink()
 parts=[];counts=collections.Counter()
 for kind in sorted(set(r['type'] for r in rows)):
  subset=[r for r in rows if r['type']==kind];counts[kind]=len(subset)
  for n in range(0,len(subset),700):
   filename='vault-index-'+kind.lower().replace(' ','-')+'-'+str(n//700+1)+'.json';(ROOT/filename).write_text(json.dumps(subset[n:n+700],ensure_ascii=False,separators=(',',':'))+'\n');parts.append({'type':kind,'file':filename,'count':len(subset[n:n+700])})
 report={'trackedResourceFiles':len(roots),'supportedFiles':len(valid),'uniqueContentFiles':len(rows),'duplicateCopies':sum(len(e['copies']) for e in duplicates),'emptyFiles':empty,'junkFiles':junk,'duplicates':duplicates,'correctedLocations':misplaced,'categories':dict(counts),'preservation':'Usable source paths are preserved. Exact duplicates display once; alternate contexts remain searchable. Zero-byte and temporary files are excluded. Original files are not renamed, so existing question-bank and download URLs continue working.'}
 (ROOT/'RESOURCE-AUDIT.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 (ROOT/'vault-catalog.json').write_text(json.dumps({'version':1,'parts':parts,'counts':dict(counts),'uniqueFiles':len(rows),'excludedEmpty':len(empty),'excludedJunk':len(junk),'duplicateCopies':report['duplicateCopies']},indent=2)+'\n')
 print({k:report[k] for k in ['trackedResourceFiles','supportedFiles','uniqueContentFiles','duplicateCopies']});print(dict(counts));return report
if __name__=='__main__':
 if len(sys.argv)>1:tree=json.loads(Path(sys.argv[1]).read_text())['tree']
 else:
  sizes={x['path']:x for f in ['resource-manifest.json','exam-manifest.json','textbook-manifest.json'] if (ROOT/f).exists() for x in json.loads((ROOT/f).read_text())}
  tree=[]
  for raw in subprocess.check_output(['git','ls-tree','-r','-z','HEAD'],cwd=ROOT).split(b'\0'):
   if not raw:continue
   meta,p=raw.split(b'\t',1);mode,kind,sha=meta.decode().split();p=p.decode();tree.append({**sizes.get(p,{}),'path':p,'type':kind,'sha':sha})
 build(tree)
