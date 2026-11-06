import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree
import re,collections
root=Path(sys.argv[1]);counts=collections.Counter()
for p in (root/'prepared').glob('*.docx'):
 z=ZipFile(p);doc=etree.fromstring(z.read('word/document.xml'));changed=False
 for group in list(doc.xpath('//*[local-name()="group"]')):
  children=list(group)
  # The source bank uses the same four empty roundrects as multiple-choice response ovals.
  if len(children)==4 and all(etree.QName(c).localname=='roundrect' and c.get('arcsize')=='10923f' and not list(c) for c in children):
   sizes=[re.search(r'width:([\d.]+);height:([\d.]+)',c.get('style','')) for c in children]
   if all(s and s[1]=='270' and s[2]=='180' for s in sizes):group.getparent().remove(group);counts['four-option-oval-groups']+=1;changed=True
 for rect in list(doc.xpath('//*[local-name()="roundrect" and @arcsize="10923f"]')):
  if list(rect):continue
  st=rect.get('style','');w=re.search(r'width:([\d.]+)pt',st);h=re.search(r'height:([\d.]+)pt',st)
  if w and h and 10<=float(w[1])<=16 and 6<=float(h[1])<=12:rect.getparent().remove(rect);counts['individual-option-ovals']+=1;changed=True
 for pict in list(doc.xpath('//*[local-name()="pict"]')):
  children=[e for e in pict if etree.QName(e).localname!='shapetype']
  if not children:pict.getparent().remove(pict);changed=True
 if changed:
  data={n:z.read(n) for n in z.namelist()};data['word/document.xml']=etree.tostring(doc)
  with ZipFile(p,'w',ZIP_DEFLATED) as out:
   for n,b in data.items():out.writestr(n,b)
print(dict(counts))
