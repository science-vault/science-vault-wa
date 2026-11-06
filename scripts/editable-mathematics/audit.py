import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
import urllib.request,json,re,concurrent.futures,collections,pathlib
root=pathlib.Path(sys.argv[1]);base='https://raw.githubusercontent.com/science-vault/science-vault-wa/4efbe76e50bbf4b49886f97074328563412a3ef5/'
def fetch(p):
 b=urllib.request.urlopen(base+p,timeout=40).read();(root/p).write_bytes(b);return p,json.loads(b)
s=urllib.request.urlopen(base+'practice-studio-catalog.js',timeout=30).read().decode();paths=re.findall(r"'([^']+index.json)'",s)
fetch('resource-manifest.json')
indices=dict(concurrent.futures.ThreadPoolExecutor(8).map(fetch,paths));allrows=sum(indices.values(),[])
print('Subjects',collections.Counter(q['subject'] for q in allrows),flush=True)
files=sorted({q['bankFile'] for q in allrows if q['subject']=='Mathematics'});banks=dict(concurrent.futures.ThreadPoolExecutor(8).map(fetch,files))
for f,rows in banks.items():
 images=sum(bool(re.search(r'<img',q.get('html',''))) for q in rows)
 htmltext=sum(len(re.sub('<[^>]+>','',q.get('html','')).strip())>30 for q in rows)
 print(f,len(rows),'image questions',images,'readable html',htmltext,flush=True)
(root/'audit.json').write_text(json.dumps({'subjects':dict(collections.Counter(q['subject'] for q in allrows)),'files':files}))
