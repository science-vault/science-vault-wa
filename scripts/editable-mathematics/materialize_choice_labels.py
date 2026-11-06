import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
from collections import defaultdict
root=Path(sys.argv[1]);W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}';ns={'w':W[1:-1]};total=0
for p in (root/'prepared').glob('*.docx'):
 z=ZipFile(p)
 if 'word/numbering.xml' not in z.namelist():continue
 numbering=etree.fromstring(z.read('word/numbering.xml'));abstract={a.get(W+'abstractNumId'):a for a in numbering.findall(W+'abstractNum')};nums={a.get(W+'numId'):a for a in numbering.findall(W+'num')};doc=etree.fromstring(z.read('word/document.xml'));counters={};changed=False
 for para in doc.xpath('//w:p[w:pPr/w:numPr]',namespaces=ns):
  props=para.find(W+'pPr').find(W+'numPr');nid=props.find(W+'numId');level=props.find(W+'ilvl');level=level.get(W+'val','0') if level is not None else '0'
  if nid is None or nid.get(W+'val') not in nums:continue
  num=nums[nid.get(W+'val')];aid=num.find(W+'abstractNumId');definition=abstract.get(aid.get(W+'val')) if aid is not None else None
  if definition is None:continue
  levels=definition.xpath('./w:lvl[@w:ilvl="'+level+'"]',namespaces=ns)
  if not levels:continue
  definition=levels[0];fmt=definition.find(W+'numFmt')
  if fmt is None or fmt.get(W+'val')!='upperLetter':continue
  key=(nid.get(W+'val'),level);start=definition.find(W+'start');start=int(start.get(W+'val','1')) if start is not None else 1
  override=num.xpath('./w:lvlOverride[@w:ilvl="'+level+'"]/w:startOverride',namespaces=ns)
  if override:start=int(override[0].get(W+'val'))
  value=counters.get(key,start);counters[key]=value+1
  if not 1<=value<=26:continue
  label=chr(64+value)+'. ';visible=''.join(para.xpath('.//w:t/text()',namespaces=ns)).lstrip()
  if visible.startswith(label.strip()):continue
  run=etree.Element(W+'r');text=etree.SubElement(run,W+'t');text.set('{http://www.w3.org/XML/1998/namespace}space','preserve');text.text=label;para.insert(1,run);changed=True;total+=1
 if changed:
  data={n:z.read(n) for n in z.namelist()};data['word/document.xml']=etree.tostring(doc)
  with ZipFile(p,'w',ZIP_DEFLATED) as out:
   for n,b in data.items():out.writestr(n,b)
print('Recovered automatic choice labels:',total)
