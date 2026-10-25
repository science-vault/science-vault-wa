from pathlib import Path
from zipfile import ZipFile
from lxml import etree as E,html
import json,re,html as escaping
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT/'physics-year11-work';OUT=WORK/'output'
def labels(filename):
 ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'};out={};current=None
 with ZipFile(WORK/'normalized'/filename) as z:r=E.fromstring(z.read('word/document.xml'))
 for p in r.findall('w:body/w:p',ns):
  plain=' '.join(p.xpath('./w:r/w:t/text()',namespaces=ns));match=re.match(r'Question\s+(\d+)\s*\(',plain.strip())
  if match:current=int(match[1])
  if current is None:continue
  for node in p.xpath('.//w:txbxContent/w:p',namespaces=ns):
   text=' '.join(node.xpath('.//w:t/text()',namespaces=ns)).strip()
   if text and text not in out.setdefault(current,[]):out[current].append(text)
 return out
cache={};records=[]
for f in OUT.glob('practice-studio-physics-*-u*.json'):
 batch=json.loads(f.read_text());by_num={q['number']:q for q in batch}
 for q in batch:
  filename=q['sourceFile']
  if filename not in cache:cache[filename]=labels(filename)
  source=cache[filename].get(q['number'],[])
  if source:q['html']+='<p class="source-line"><strong>Original diagram labels:</strong> '+escaping.escape(' · '.join(source))+'</p>'
  refs=[int(x) for x in re.findall(r'\bQuestion\s+(\d+)',q['text']) if int(x)!=q['number']]
  for ref in sorted(set(refs)):
   if ref in by_num:q['html']+='<details><summary>Context from Question '+str(ref)+'</summary>'+by_num[ref]['html']+'</details>'
 f.write_text(json.dumps(batch,ensure_ascii=False,separators=(',',':')));records+=batch
print('Preserved original drawing labels and cross-question context for',len(records),'questions')
