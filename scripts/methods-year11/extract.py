from pathlib import Path
from lxml import html,etree as E
import subprocess,concurrent.futures,json,re,copy,hashlib,base64,io
from PIL import Image,ImageChops
import fitz
R=Path(__file__).resolve().parent
for n in ['converted','images','output']:(R/n).mkdir(exist_ok=True)
def plain(n):
 c=copy.deepcopy(n)
 for a in c.xpath('.//annotation'):a.getparent().remove(a)
 return ' '.join(' '.join(c.itertext()).split())
def fix(n):
 for tab in reversed(list(n.xpath('.//mtable'))):
  rows=tab.findall('mtr')
  if len(rows)!=2 or any(len(r)!=1 for r in rows):continue
  bars=rows[1][0].xpath('.//mover[mo="¯"]')
  if len(bars)!=1:continue
  frac=E.Element('mfrac');num=E.SubElement(frac,'mrow');den=E.SubElement(frac,'mrow')
  for c in rows[0][0]:num.append(copy.deepcopy(c))
  d=bars[0][0]
  if len(d):
   for c in d:den.append(copy.deepcopy(c))
  else:den.append(copy.deepcopy(d))
  frac.tail=tab.tail;tab.getparent().replace(tab,frac)
 for a in n.xpath('.//annotation'):a.getparent().remove(a)
 return n

def image_convert(im):
 src=im.get('src','');raw=base64.b64decode(src.split(',')[1]);h=hashlib.sha256(raw).hexdigest()[:16];p=R/'images'/(h+'.png')
 if not p.exists():
  if 'emf' in src.split(',')[0] or 'wmf' in src.split(',')[0]:
   target=R/'images'/(h+('.wmf' if 'wmf' in src.split(',')[0] else '.emf'));target.write_bytes(raw);pdf=target.with_suffix('.pdf');start=raw.find(b'%PDF-');end=raw.rfind(b'%%EOF')
   if start>=0:doc=fitz.open(stream=raw[start:end+5],filetype='pdf')
   else:
    subprocess.run(['soffice','-env:UserInstallation=file:///tmp/methods-mathimage','--headless','--convert-to','pdf','--outdir',str(R/'images'),str(target)],capture_output=True,check=True,timeout=35);doc=fitz.open(pdf)
   page=doc[0];boxes=[fitz.Rect(b[:4]) for b in page.get_text('blocks')]+[d['rect'] for d in page.get_drawings() if d.get('color') is not None or d.get('fill') and min(d['fill'])<.98];rect=page.rect
   if boxes:
    rect=fitz.Rect(boxes[0])
    for b in boxes[1:]:rect|=b
    rect=fitz.Rect(rect.x0-3,rect.y0-3,rect.x1+3,rect.y1+3)&page.rect
   pix=page.get_pixmap(matrix=fitz.Matrix(3,3),clip=rect,alpha=False);pic=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
  else:
   rgba=Image.open(io.BytesIO(raw)).convert('RGBA');pic=Image.alpha_composite(Image.new('RGBA',rgba.size,'white'),rgba).convert('RGB')
  bbox=ImageChops.difference(pic,Image.new('RGB',pic.size,'white')).getbbox()
  if bbox:pic=pic.crop((max(0,bbox[0]-3),max(0,bbox[1]-3),min(pic.width,bbox[2]+3),min(pic.height,bbox[3]+3)))
  pic.thumbnail((1700,1700));pic.save(p)
 pic=Image.open(p).convert('RGB');pic.thumbnail((1500,1500));buf=io.BytesIO();pic.save(buf,format='WEBP',quality=94);im.set('src','data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode());im.set('data-source-image',h);im.set('alt','Original mathematical figure');im.set('style','max-width:100%;height:auto');return h

def convert(f):
 out=R/'converted'/(f.stem+'.html')
 if not out.exists():subprocess.run(['pandoc',str(f),'-t','html5','--mathml','--embed-resources','-s','--metadata','title=Mathematics Methods','-o',str(out)],capture_output=True,check=True)
 return out
if __name__=='__main__':
 files=[f for f in (R.parent/'upload').glob('*.docx') if ('METH' in f.name or 'Methods' in f.name) and not f.name.startswith('.')]
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:paths=list(pool.map(convert,files))
 records=[]
 for f in sorted(paths):
  body=html.parse(str(f),parser=html.HTMLParser(huge_tree=True)).find('body');qs=[];cur=None
  for node in body:
   t=plain(node);m=re.fullmatch(r'Question\s+(\d+)\b.*?\(([^()]*marks?)\)',t,re.I)
   if m:cur={'number':int(m[1]),'marks':int(re.findall(r'\d+',m[2])[-1]),'nodes':[]};qs.append(cur);continue
   if re.match(r'^(Question number|End of (?:Section|Questions|Examination)|Supplementary page|Acknowledg)',t,re.I):cur=None;continue
   if cur is None:continue
   if re.fullmatch(r'Question\s+\d+\s*\(?continued\)?',t,re.I) or re.fullmatch(r'[_\s.·…]+',t):continue
   if len(t)<150 and re.search(r'DO NOT WRITE|See next page|This page has been left blank|^MATHEMATICS METHODS$',t,re.I):continue
   if not t and not node.xpath('.//img|.//math'):continue
   if node.tag=='table' and not re.search('[A-Za-z0-9]',t):continue
   cur['nodes'].append(copy.deepcopy(node))
  for q in qs:
   imgs=[]
   for node in q['nodes']:
    fix(node)
    for im in node.xpath('.//img'):imgs.append(image_convert(im))
   q['text']=' '.join(plain(n) for n in q['nodes']);q['html']=''.join(html.tostring(n,encoding='unicode') for n in q['nodes']);q['images']=imgs;del q['nodes']
  records.append({'source':f.stem,'questions':qs});print(f.stem,len(qs),flush=True)
 (R/'extracted.json').write_text(json.dumps(records,ensure_ascii=False))
 print('Completed',len(records),'documents')
