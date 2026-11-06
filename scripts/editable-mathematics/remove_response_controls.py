import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
import json,hashlib,re
root=Path(sys.argv[1])
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
# Audited numeric-response questions: the only VML graphics here are empty
# answer rectangles or blank numerator/denominator templates, never diagrams.
approved={
 'area':{4,5,7,8,9,12,15,16,18,24,25},
 'volume-and-surface-area':{3,5,9,12,15,16,18,19},
 'integers':{5,24},
 'number-systems':{7,13,16,17,18,21,29},
 'ratio-and-rates':{11,13,15,17},
 'rational-numbers':{4,6,8,11,24,32},
 'percentages':{6,11},
 'decimals':{3,7,9,10,12,13,16,22,25,26,27,28,31,32,33,34},
 'fractions':{8,11,15,17,18,19,20,24,25,27,28,29,30,31,32},
 'metric-system':{4,9,12,14,17,24,28,29},
}
audit=[]
for slug,numbers in approved.items():
 path=root/'prepared'/('practice-studio-mathematics-'+slug+'.docx')
 with ZipFile(path) as z:data={n:z.read(n) for n in z.namelist()}
 doc=etree.fromstring(data['word/document.xml'])
 for row in doc.xpath('//w:tr',namespaces=ns):
  first=''.join(row.xpath('./w:tc[1]//w:t/text()',namespaces=ns)).strip()
  if not re.fullmatch(r'\d+\.',first) or int(first[:-1]) not in numbers:continue
  for graphic in row.xpath('.//w:pict',namespaces=ns):
   # No image/OLE payload, labelled text, arrow head or nonblank equation.
   if graphic.xpath('.//*[local-name()="imagedata" or local-name()="OLEObject"]'):continue
   words=''.join(graphic.xpath('.//w:t/text()',namespaces=ns))
   if re.sub(r'[\s.]','',words):continue
   if any(e.get('startarrow') or e.get('endarrow') for e in graphic.iter()):continue
   audit.append({'source':path.name,'question':int(first[:-1]),'shapeIds':graphic.xpath('.//*[@id]/@id'),'sha256':hashlib.sha256(etree.tostring(graphic)).hexdigest()})
   graphic.getparent().remove(graphic)
 data['word/document.xml']=etree.tostring(doc)
 with ZipFile(path,'w',ZIP_DEFLATED) as z:
  for name,content in data.items():z.writestr(name,content)
(root/'response-control-recovery.json').write_text(json.dumps(audit,indent=2))
print('Removed',len(audit),'audited blank answer graphics')
