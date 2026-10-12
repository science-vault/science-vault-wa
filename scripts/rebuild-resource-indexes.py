"""Rebuild legacy indexes from Git metadata without downloading the resource archive."""
import json,re,subprocess,importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('vault_builder',ROOT/'scripts/build-vault-catalog.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
previous={x['path']:x for f in ['resource-manifest.json','exam-manifest.json','textbook-manifest.json'] if (ROOT/f).exists() for x in json.loads((ROOT/f).read_text())}
entries=[]
for raw in subprocess.check_output(['git','ls-tree','-r','-z','HEAD'],cwd=ROOT).split(b'\0'):
 if not raw:continue
 meta,p=raw.split(b'\t',1);mode,kind,sha=meta.decode().split();p=p.decode()
 if kind=='blob' and p.startswith(('resources/','exams/','textbooks/')) and m.EXT.search(p) and sha!=m.EMPTY and not m.JUNK.search(p):entries.append({'path':p,'sha':sha,'size':previous.get(p,{}).get('size'),'modified':previous.get(p,{}).get('modified','')})
def save(name,data):(ROOT/name).write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n')
resources=[e for e in entries if e['path'].startswith('resources/')];save('resource-manifest.json',resources)
classified=[{**e,**m.metadata(e)} for e in entries]
save('powerpoint-manifest.json',[e for e in classified if e['type']=='PowerPoints']);save('video-manifest.json',[e for e in classified if e['type']=='Videos']);save('textbook-manifest.json',[e for e in classified if e['type']=='Textbooks']);save('exam-manifest.json',[e for e in classified if e['type']=='Exams'])
a=[{**e,'subject':e['subject'],'topic':e['topic'] or 'All Assessments'} for e in classified if e['type']=='Assessments'];save('assessment-manifest.json',a)
for y in range(7,13):save('assessment-year'+str(y)+'.json',[e for e in a if e['year']=='Year '+str(y)])
print('Rebuilt resource indexes from',len(entries),'valid source files.')
