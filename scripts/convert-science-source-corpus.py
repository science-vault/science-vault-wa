#!/usr/bin/env python3
"""Convert legacy Science documents and stage OCR without asserting verification."""
import argparse,concurrent.futures,importlib.util,json,subprocess,time,os
from pathlib import Path
def write(path,obj):
 temp=path.with_suffix('.tmp');temp.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':'))+'\n');temp.replace(path)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--corpus',required=True);ap.add_argument('--mode',choices=['office','ocr'],required=True);ap.add_argument('--workers',type=int,default=2);a=ap.parse_args();root=Path(a.corpus).resolve();status=json.loads((root/'preparation-status.json').read_text());out=root/'converted';out.mkdir(exist_ok=True)
 spec=importlib.util.spec_from_file_location('source_prepare',Path(__file__).with_name('prepare-science-source-corpus.py'));mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);tasks=[]
 for record in status['records']:
  ext=record['extension'];source=root/'sources'/(record['sha']+ext)
  if a.mode=='office' and (record.get('needsConversion') or record['preparation']=='error') and ext in {'.doc','.docx','.ppt','.pptx','.pps'}:tasks.append(record)
  if a.mode=='ocr' and record.get('needsOCR'):tasks.append(record)
 results=[];started=time.time();last=0
 def office(record):
  sha=record['sha'];ext=record['extension'];target='pptx' if ext in {'.ppt','.pptx','.pps'} else 'docx';source=root/'sources'/(sha+ext);dest=out/(sha+'.'+target);profile=root/'profiles'/sha;profile.mkdir(parents=True,exist_ok=True)
  try:
   if not dest.exists():
    r=subprocess.run(['soffice','-env:UserInstallation='+profile.as_uri(),'--headless','--convert-to',target,'--outdir',str(out),str(source)],capture_output=True,text=True,timeout=90)
    if r.returncode or not dest.exists():raise RuntimeError((r.stderr or r.stdout or 'No converted document')[:500])
   data=mod.openxml(dest,'.'+target);data.update(sha=sha,originalPaths=record['paths'],convertedFrom=str(source),convertedFile=str(dest),conversionNotice='Machine conversion. Original numbering, images and layout still require visual verification.');write(root/'corpus'/(sha+'.json'),data);return dict(sha=sha,status='converted',file=str(dest),characters=len(data.get('text','')))
  except Exception as e:return dict(sha=sha,status='error',error=str(e))
 def ocr(record):
  sha=record['sha'];ext=record['extension'];source=root/'sources'/(sha+ext);corpus=root/'corpus'/(sha+'.json');data=json.loads(corpus.read_text());pages=[]
  try:
   import fitz
   if ext=='.pdf':
    doc=fitz.open(source)
    for i,p in enumerate(doc):
     if len(p.get_text().strip())>=30:continue
     png=p.get_pixmap(matrix=fitz.Matrix(2,2)).tobytes('png');r=subprocess.run(['tesseract','stdin','stdout','--psm','3'],input=png,capture_output=True,timeout=60);pages.append(dict(page=i+1,text=r.stdout.decode(errors='replace'),verification='unverified OCR'))
   else:
    r=subprocess.run(['tesseract',str(source),'stdout','--psm','3'],capture_output=True,timeout=60);pages.append(dict(page=1,text=r.stdout.decode(errors='replace'),verification='unverified OCR'))
   data.update(ocrPages=pages,ocrVerification='unverified; compare original diagrams and handwriting',ocrText='\n'.join(p['text'] for p in pages));write(corpus,data);return dict(sha=sha,status='ocr_staged',pages=len(pages),characters=sum(len(p['text']) for p in pages))
  except Exception as e:return dict(sha=sha,status='error',error=str(e))
 # Separate processes avoid sharing the PDF parser or office instances between threads.
 # Office tasks each use an isolated profile; PDF OCR below runs in this single worker.
 if a.mode=='ocr':
  iterator=map(ocr,tasks)
  for result in iterator:
   results.append(result)
   if time.time()-last>20 or len(results)==len(tasks):last=time.time();report=dict(mode=a.mode,total=len(tasks),processed=len(results),elapsedSeconds=round(time.time()-started),results=results);write(root/(a.mode+'-status.json'),report);print(json.dumps({k:v for k,v in report.items() if k!='results'}),flush=True)
 else:
  with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as pool:
   for result in pool.map(office,tasks):
    results.append(result)
    if time.time()-last>20 or len(results)==len(tasks):last=time.time();report=dict(mode=a.mode,total=len(tasks),processed=len(results),elapsedSeconds=round(time.time()-started),results=results);write(root/(a.mode+'-status.json'),report);print(json.dumps({k:v for k,v in report.items() if k!='results'}),flush=True)
if __name__=='__main__':main()
