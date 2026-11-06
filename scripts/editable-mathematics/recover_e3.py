import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
import json,re
root=Path(sys.argv[1]);ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'};W='{'+ns['w']+'}';R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}';results=[]
for source in (root/'sources').glob('*.docx'):
 odt=root/'converted'/source.with_suffix('.odt').name
 if not odt.exists():continue
 oz=ZipFile(source);dr=etree.fromstring(oz.read('word/document.xml'));rels={x.get('Id'):x.get('Target') for x in etree.fromstring(oz.read('word/_rels/document.xml.rels'))};original=dr.xpath('//*[local-name()="OLEObject"]');dz=ZipFile(odt);odr=etree.fromstring(dz.read('content.xml'));objects=odr.xpath('//*[local-name()="object" or local-name()="object-ole"]')
 if len(original)!=len(objects):results.append({'source':source.name,'status':'order-count-mismatch','original':len(original),'converted':len(objects)});continue
 equations={}
 for a,b in zip(original,objects):
  if etree.QName(b).localname!='object':continue
  href=b.get('{http://www.w3.org/1999/xlink}href').lstrip('./');math=etree.fromstring(dz.read(href+'/content.xml'))
  for annotation in math.xpath('//*[local-name()="annotation"]'):annotation.getparent().remove(annotation)
  for e in math.iter():
   for attr in ['mathsize','mathvariant','displaystyle']:e.attrib.pop(attr,None)
  math.attrib.pop('display',None);math.set('display','inline');equations[rels[a.get(R+'id')]]=etree.tostring(math,encoding='unicode')
 prepared=root/'prepared'/source.name;z=ZipFile(prepared);r=etree.fromstring(z.read('word/document.xml'));count=0
 for obj in r.xpath('//w:object',namespaces=ns):
  ole=obj.xpath('.//*[local-name()="OLEObject"]');target=rels.get(ole[0].get(R+'id')) if ole else None
  if target in equations:
   t=etree.Element(W+'t');t.text='';t.set('{urn:learning-vault:conversion}mathml',equations[target]);obj.getparent().replace(obj,t);count+=1
 data={n:z.read(n) for n in z.namelist()};data['word/document.xml']=etree.tostring(r)
 with ZipFile(prepared,'w',ZIP_DEFLATED) as out:
  for n,b in data.items():out.writestr(n,b)
 results.append({'source':source.name,'recovered':count})
(root/'equation3-recovery.json').write_text(json.dumps(results,indent=2));print(results)
