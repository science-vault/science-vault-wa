import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
root=Path(sys.argv[1])
path=root/'prepared/practice-studio-mathematics-volume-and-surface-area.docx'
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'};W='{'+ns['w']+'}'
with ZipFile(path) as z:data={n:z.read(n) for n in z.namelist()}
doc=etree.fromstring(data['word/document.xml'])
rows={''.join(row.xpath('./w:tc[1]//w:t/text()',namespaces=ns)).strip():row for row in doc.xpath('//w:tr',namespaces=ns)}
tank,tent=rows['12.'],rows['13.']
assert 'tank shown is a square prism' in ''.join(tank.xpath('.//w:t/text()',namespaces=ns))
assert 'two man tent' in ''.join(tent.xpath('.//w:t/text()',namespaces=ns))
picture=doc.xpath('//w:pict[.//*[@id="_x0000_s1140"]]',namespaces=ns)
assert len(picture)==1
picture=picture[0]
if tank in picture.iterancestors():
 assert picture.xpath('.//*[local-name()="imagedata"]/@r:id',namespaces={'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'})==['rId28']
 picture.getparent().remove(picture)
 para=etree.Element(W+'p');run=etree.SubElement(para,W+'r');run.append(picture);tent.xpath('./w:tc',namespaces=ns)[1].insert(1,para)
 print('Assigned original tent diagram to its question 13')
else:assert tent in picture.iterancestors()
data['word/document.xml']=etree.tostring(doc)
with ZipFile(path,'w',ZIP_DEFLATED) as z:
 for name,content in data.items():z.writestr(name,content)
