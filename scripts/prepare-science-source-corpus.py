#!/usr/bin/env python3
"""Prepare an auditable, resumable Science source corpus; never mark questions imported.

Usage: python scripts/prepare-science-source-corpus.py --output /path/to/work
Reads science-assessment-import-status.json from the repository by default.
Original files are cached by verified Git blob SHA. Extracted text is a staging
aid only: diagrams, numbering, question boundaries and marking still need review.
"""
import argparse,concurrent.futures,hashlib,json,re,time,urllib.request,urllib.parse,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

BASE='https://raw.githubusercontent.com/science-vault/science-vault-wa/main/'
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
SUPPORT={'.db','.ds_store','.lnk','.url','.mp4','.mov','.part','.tmp'}
def jsonwrite(path,obj):
 tmp=path.with_suffix(path.suffix+'.tmp');tmp.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'\n');tmp.replace(path)
def xmlread(z,name):
 if z.getinfo(name).file_size>30_000_000:raise ValueError('XML part too large for staging parser')
 return ET.fromstring(z.read(name))
def text(node):return ''.join(node.itertext())
def openxml(path,ext):
 with zipfile.ZipFile(path) as z:
  if ext=='.docx':
   doc=xmlread(z,'word/document.xml');body=doc.find('w:body',NS);blocks=[]
   for el in body:
    if el.tag.endswith('}p'):
     t=''.join(n.text or '' for n in el.findall('.//w:t',NS));num=el.find('w:pPr/w:numPr',NS);images=[n.attrib.get('{'+NS['r']+'}embed') for n in el.iter() if n.tag.endswith('}blip')];blocks.append(dict(kind='paragraph',text=t,numbering=ET.tostring(num,encoding='unicode') if num is not None else None,imageRelations=images))
    elif el.tag.endswith('}tbl'):
     rows=[['\n'.join(''.join(n.text or '' for n in p.findall('.//w:t',NS)) for p in cell.findall('w:p',NS)) for cell in row.findall('w:tc',NS)] for row in el.findall('w:tr',NS)];blocks.append(dict(kind='table',rows=rows))
   return dict(kind='docx',blocks=blocks,numberingXml=z.read('word/numbering.xml').decode() if 'word/numbering.xml' in z.namelist() else None,relationshipsXml=z.read('word/_rels/document.xml.rels').decode() if 'word/_rels/document.xml.rels' in z.namelist() else None,media=[dict(name=n,size=z.getinfo(n).file_size) for n in z.namelist() if n.startswith('word/media/')],text='\n'.join(b.get('text','') if b['kind']=='paragraph' else '\n'.join(' | '.join(row) for row in b['rows']) for b in blocks))
  if ext=='.pptx':
   slides=[]
   for name in sorted(n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)):
    el=xmlread(z,name);slides.append(dict(part=name,text='\n'.join(n.text or '' for n in el.findall('.//a:t',NS))))
   return dict(kind='pptx',slides=slides,text='\n'.join(s['text'] for s in slides),media=[n for n in z.namelist() if n.startswith('ppt/media/')])
  if ext=='.xlsx':
   strings=[]
   if 'xl/sharedStrings.xml' in z.namelist():strings=[''.join(e.itertext()) for e in xmlread(z,'xl/sharedStrings.xml')]
   sheets=[]
   for name in z.namelist():
    if re.fullmatch(r'xl/worksheets/sheet\d+\.xml',name):sheets.append(dict(part=name,xml=ET.tostring(xmlread(z,name),encoding='unicode')))
   return dict(kind='xlsx',sharedStrings=strings,sheets=sheets,text='\n'.join(strings))
  return dict(kind='archive',members=[dict(name=n,size=z.getinfo(n).file_size) for n in z.namelist()],text='')
def extract(path,ext):
 if ext in {'.docx','.pptx','.xlsx','.zip','.pages'}:return openxml(path,ext)
 if ext=='.pdf':
  import fitz
  doc=fitz.open(path);pages=[dict(page=i+1,text=p.get_text(),images=len(p.get_images()),needsOCR=len(p.get_text().strip())<30) for i,p in enumerate(doc)];return dict(kind='pdf',pages=pages,text='\n'.join(p['text'] for p in pages),needsOCR=any(p['needsOCR'] for p in pages))
 if ext in {'.jpg','.jpeg','.png','.tif','.tiff','.gif'}:return dict(kind='scan',needsOCR=True,text='')
 if ext in {'.txt','.htm','.html'}:return dict(kind='text',text=path.read_text(errors='replace'))
 return dict(kind='legacy_or_other',needsConversion=True,text='')
def hints(name,content):
 t=content.lower();n=name.lower();return dict(filenameSuggestsKey=bool(re.search(r'answer|solution|marking|rubric|\bkey\b',n)),filenameSuggestsAssessment=bool(re.search(r'test|exam|assessment|quiz|task|validation|investigation|assign|revision|question|worksheet',n)),filenameSuggestsSupporting=bool(re.search(r'word.?search|answer.?sheet|\bnotes?\b|periodic.table|formulae|powerpoint|revision',n)),questionIndicators=len(re.findall(r'\?|\b(?:explain|calculate|describe|identify|determine|state|label|compare|complete)\b',t)),characters=len(content))
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--output',required=True);ap.add_argument('--inventory',default='science-assessment-import-status.json');ap.add_argument('--workers',type=int,default=8);ap.add_argument('--repository',help='Optional local sparse Git checkout, avoiding per-file HTTP downloads');args=ap.parse_args();out=Path(args.output);cache=out/'sources';corpus=out/'corpus';cache.mkdir(parents=True,exist_ok=True);corpus.mkdir(exist_ok=True)
 inventory=json.loads(Path(args.inventory).read_text());groups={}
 for f in inventory['files']:groups.setdefault(f['sha'],[]).append(f)
 def process(item):
  sha,aliases=item;f=aliases[0];name=Path(f['path']).name;ext=Path(name).suffix.lower();record=dict(sha=sha,paths=[a['path'] for a in aliases],year=f['year'],bytes=f['size'],extension=ext,importState='imported_source' if any(a['status'] in {'imported','duplicate_of_imported_source'} for a in aliases) else 'pending_review')
  if ext in SUPPORT or name.startswith(('~$','~WR','~wr')) or '.tmp' in name.lower():record.update(preparation='support_or_temporary',reason='Video, system metadata, shortcut, partial download or temporary office file; not an assessment question document.');return record
  path=cache/(sha+ext);prepared=corpus/(sha+'.json')
  try:
   if not path.exists():
    for attempt in range(3):
     try:
      data=(Path(args.repository)/f['path']).read_bytes() if args.repository else urllib.request.urlopen(BASE+urllib.parse.quote(f['path']),timeout=45).read();actual=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
      if actual!=sha:raise ValueError('Git blob hash mismatch')
      tmp=path.with_suffix(path.suffix+'.download');tmp.write_bytes(data);tmp.replace(path);break
     except Exception:
      if attempt==2:raise
   if prepared.exists():data=json.loads(prepared.read_text())
   else:
    data=extract(path,ext);data.update(sha=sha,originalPaths=record['paths']);jsonwrite(prepared,data)
   record.update(preparation='prepared',localSource=str(path),corpus=str(prepared),hints=hints(name,data.get('text','')),needsOCR=data.get('needsOCR',False),needsConversion=data.get('needsConversion',False))
  except Exception as e:record.update(preparation='error',error=str(e))
  return record
 results=[];started=time.time();last=0
 with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
  futures={pool.submit(process,item):item[0] for item in groups.items()}
  for future in concurrent.futures.as_completed(futures):
   results.append(future.result());elapsed=time.time()-started
   if elapsed-last>20 or len(results)==len(groups):
    report=dict(scope='Years 7–10 Science repository source preparation only; prepared does not mean imported or verified.',inventoryFiles=len(inventory['files']),distinctBlobs=len(groups),processed=len(results),prepared=sum(r['preparation']=='prepared' for r in results),supportOrTemporary=sum(r['preparation']=='support_or_temporary' for r in results),errors=sum(r['preparation']=='error' for r in results),elapsedSeconds=round(elapsed),records=results);jsonwrite(out/'preparation-status.json',report);print(json.dumps({k:v for k,v in report.items() if k!='records'}),flush=True);last=elapsed
if __name__=='__main__':main()
