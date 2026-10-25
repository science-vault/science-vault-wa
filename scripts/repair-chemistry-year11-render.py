from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree as E
import subprocess,concurrent.futures
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'chemistry-year11-work';DEST=WORK/'render-copy';DEST.mkdir(exist_ok=True)
A='http://schemas.openxmlformats.org/drawingml/2006/main';M='http://schemas.openxmlformats.org/markup-compatibility/2006';S='http://schemas.microsoft.com/office/word/2010/wordprocessingShape'
def preserve_symbols(root):
 from reportlab.pdfbase import _fontdata
 from fontTools.agl import toUnicode
 encoding=_fontdata.encodings['SymbolEncoding'];ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
 # Convert Symbol-font text before materialising standalone w:sym elements.
 for run in root.findall('.//{'+ns+'}r'):
  fonts=run.find('{'+ns+'}rPr/{'+ns+'}rFonts')
  if fonts is not None and any(fonts.get('{'+ns+'}'+name)=='Symbol' for name in ['ascii','hAnsi']):
   for t in run.findall('{'+ns+'}t'):
    t.text=''.join((toUnicode(encoding[ord(c)]) if ord(c)<256 and encoding[ord(c)] else c) for c in (t.text or ''))
   for k in list(fonts.attrib):fonts.set(k,'Arial')
 for sym in root.findall('.//{'+ns+'}sym'):
  if sym.get('{'+ns+'}font')=='Symbol':
   code=int(sym.get('{'+ns+'}char'),16)&255;name=encoding[code]
   sym.tag='{'+ns+'}t';sym.attrib.clear();sym.text=toUnicode(name)

def job(f):
 target=DEST/f.name
 with ZipFile(f) as z:
  r=E.fromstring(z.read('word/document.xml'));preserve_symbols(r)
  for alt in r.findall('.//{'+M+'}AlternateContent'):
   choice=alt.find('{'+M+'}Choice')
   if choice is not None:
    par=alt.getparent();ix=par.index(alt)
    for ch in list(choice):par.insert(ix,ch);ix+=1
    par.remove(alt)
  for shape in r.findall('.//{'+S+'}wsp'):
   geom=shape.find('.//{'+A+'}prstGeom')
   if geom is not None and geom.get('prst')=='rect' and shape.find('{'+S+'}txbx') is None:
    geom.set('prst','roundRect');av=geom.find('{'+A+'}avLst')
    if av is None:av=E.SubElement(geom,'{'+A+'}avLst')
    av.clear();E.SubElement(av,'{'+A+'}gd',name='adj',fmla='val 0')
  cols={'bg1':'FFFFFF','tx1':'000000','bg2':'D9D9D9','lt1':'FFFFFF','dk1':'000000','lt2':'D9D9D9','dk2':'000000'}
  for col in r.findall('.//{'+A+'}schemeClr'):
   if col.get('val') in cols:col.tag='{'+A+'}srgbClr';col.set('val',cols[col.get('val')])
  with ZipFile(target,'w',ZIP_DEFLATED) as out:
   for n in z.namelist():out.writestr(n,E.tostring(r) if n=='word/document.xml' else z.read(n))
 cmd=['/opt/codex/runtimes/codex-primary-runtime/dependencies/bin/override/soffice','-env:UserInstallation=file:///tmp/lv-shape-'+str(abs(hash(f.name))),'--headless','--convert-to','pdf','--outdir',str(WORK/'repaired-pdf'),str(target)]
 result=subprocess.run(cmd,capture_output=True,text=True,timeout=90)
 return f.name,result.returncode,result.stderr[-100:]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for result in pool.map(job,sorted((ROOT/'upload').glob('*chemistry*.docx'))):print(result,flush=True)
