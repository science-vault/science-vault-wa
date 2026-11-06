import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from lxml import etree
from zipfile import ZipFile,ZIP_DEFLATED
import json,urllib.request,urllib.parse,concurrent.futures,re,io,sys,html
import olefile
root=Path(sys.argv[1]);src=root/'sources';src.mkdir(exist_ok=True);prepared=root/'prepared';prepared.mkdir(exist_ok=True)
x=json.loads((root/'resource-manifest.json').read_text());entries=[]
def walk(v):
 if isinstance(v,dict):
  if isinstance(v.get('path'),str):entries.append(v['path'])
  for a in v.values():walk(a)
 elif isinstance(v,list):
  for a in v:walk(a)
walk(x)
files=json.loads((root/'audit.json').read_text())['files'];sources={}
for f in files:
 a=json.loads((root/f).read_text());name=a[0]['sourceFile'];candidates=[p for p in entries if p.endswith('/'+name)]
 if 'sourcePath' in a[0]:candidates=[a[0]['sourcePath']]
 else:candidates.sort(key=lambda p:(0 if '2011 Assessment' in p else 1,len(p)))
 if candidates:sources[f]=candidates[0]
 else:print('NO SOURCE',f,name,flush=True)
(root/'source-map.json').write_text(json.dumps(sources,indent=2))
def fetch(item):
 f,p=item;out=src/(f.replace('.json','.docx'))
 if not out.exists():out.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/science-vault/science-vault-wa/4efbe76e50bbf4b49886f97074328563412a3ef5/'+urllib.parse.quote(p),timeout=45).read())
 return f,out
for f,p in concurrent.futures.ThreadPoolExecutor(8).map(fetch,sources.items()):print('Downloaded',p.name,flush=True)
