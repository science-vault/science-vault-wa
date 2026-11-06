import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
import re,io,sys,json
import olefile
root=Path(sys.argv[1]);ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'};W='{'+ns['w']+'}'
supermap=str.maketrans('0123456789-+','⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺')
def fxetext(b):
 assert b[1:4]==b'FXE'
 offset=8;cells=[]
 for _ in range(100):
  n=b[offset];start=offset+1
  if n==255:n=int.from_bytes(b[offset+1:offset+3],'little');start=offset+3
  value=b[start:start+n].decode('cp1252');assert '\x00' not in value
  if value=='FXEOptions':break
  if value.strip():cells.append(value)
  offset=start+n+8
 else:raise ValueError('No FX Equation options marker')
 rendered=[]
 for value in cells:
  pieces=[]
  for token in re.finditer(r'"([^"]*)(?:"|$)|([^"]+)',value):
   if token[1] is not None:
    pieces.append(re.sub(r'\.{3,}|_{8,}',' ',token[1]));continue
   part=token[2]
   # Convert commands before suffix powers, so sr169 cannot become sr¹⁶⁹.
   part=re.sub(r'sr(?=[(\d])','√',part)
   part=re.sub(r'(\d+)root',lambda m:m[1].translate(supermap)+'√',part)
   part=part.replace('ang','∠').replace('tri','△').replace('box','□')
   part=re.sub(r'\btf\b','∴',part)
   part=re.sub(r'\b(th|al|be|ga|pi)\b',lambda m:{'th':'θ','al':'α','be':'β','ga':'γ','pi':'π'}[m[1]],part)
   part=re.sub(r'(?<=\d)o\b','°',part)
   part=re.sub(r'(?<=[A-Za-z)])([0-9]+)',lambda m:m[1].translate(supermap),part)
   part=re.sub(r'\^(-?\d+(?:\.\d+)?|[A-Za-z]+)',lambda m:'^('+m[1]+')',part)
   part=part.replace('+-','±').replace('*','×').replace('<>','≠').replace('>=','≥').replace('<=','≤').replace('-=','≅')
   pieces.append(part)
  rendered.append(''.join(pieces))
 return '\n'.join(rendered)
reports=[]
for source in (root/'sources').glob('*.docx'):
 z=ZipFile(source);r=etree.fromstring(z.read('word/document.xml'));rels={a.get('Id'):a.get('Target') for a in etree.fromstring(z.read('word/_rels/document.xml.rels'))};report={'file':source.name,'recovered':0,'failed':[]}
 for obj in r.xpath('//w:object',namespaces=ns):
  ole=obj.xpath('.//*[local-name()="OLEObject"]')
  if not ole:continue
  target=rels.get(ole[0].get('{'+ns['r']+'}id'))
  try:
   o=olefile.OleFileIO(io.BytesIO(z.read('word/'+target)));s=fxetext(o.openstream('Contents').read())
   t=etree.Element(W+'t');t.text=s;t.set('{urn:learning-vault:conversion}fxe',s);t.set('{http://www.w3.org/XML/1998/namespace}space','preserve');obj.getparent().replace(obj,t);report['recovered']+=1
  except Exception as e:report['failed'].append(str(target))
 if any('-'+slug+'.docx' in source.name for slug in ['rational-numbers','number-systems','integers','decimals','fractions','percentages','metric-system','ratio-and-rates']):
  for pict in r.xpath('//w:pict',namespaces=ns):
   shapes=[e for e in pict if etree.QName(e).localname not in ['shapetype']]
   if len(shapes)==1 and etree.QName(shapes[0]).localname=='rect' and not list(shapes[0]):
    style=shapes[0].get('style','');width=re.search(r'width:([\d.]+)pt',style);height=re.search(r'height:([\d.]+)pt',style)
    if width and height and 70<=float(width[1])<=150 and float(height[1])<=45:pict.getparent().remove(pict)
 for t in r.xpath('//w:t',namespaces=ns):t.text=re.sub(r'(?:\.\s*){8,}|_{8,}','',t.text or '')
 for f in r.xpath('//w:rFonts',namespaces=ns):
  for a in ['ascii','hAnsi','cs','eastAsia']:f.set(W+a,'Arial')
 for s in r.xpath('//w:sz|//w:szCs',namespaces=ns):s.set(W+'val','24')
 out=root/'prepared'/source.name
 with ZipFile(out,'w',ZIP_DEFLATED) as zz:
  for n in z.namelist():zz.writestr(n,etree.tostring(r) if n=='word/document.xml' else z.read(n))
 reports.append(report)
(root/'source-recovery.json').write_text(json.dumps(reports,indent=2));print('Recovered',sum(x['recovered'] for x in reports),'equations; unresolved',sum(len(x['failed']) for x in reports))
