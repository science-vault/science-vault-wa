from pathlib import Path
from lxml import html,etree
from PIL import Image,ImageDraw
import fitz,json,re,subprocess
import argparse
parser=argparse.ArgumentParser(description='Convert the audited 2024 pilot; requires Pandoc HTML/media and sibling physics-sample/rendered PDFs.')
parser.add_argument('work_directory',type=Path)
ROOT=Path(__file__).resolve().parents[1];WORK=parser.parse_args().work_directory.resolve()
ASSET=ROOT/'assets/physics/exam-import/sample-2024/text-figures';ASSET.mkdir(parents=True,exist_ok=True)
# Reviewed figure positions in the source rendering: year, source page, bounding box.
CROPS={
 '11-q02-hotplates':(11,3,(135,443,456,570)),
 '11-q03-fusion':(11,4,(77,167,438,272)),
 '11-q05-circuit':(11,5,(48,106,545,341)),
 '11-q09-circuit':(11,9,(48,116,545,337)),
 '11-q10-seabreeze':(11,10,(48,160,537,329)),
 '11-q11-charges':(11,11,(135,117,433,286)),
 '11-q13-toaster':(11,14,(48,134,545,374)),
 '11-q14-rods':(11,17,(48,559,545,741)),
 '11-q14-axes':(11,18,(97,119,453,321)),
 '11-q15-containers':(11,19,(48,350,545,534)),
 '11-q16-circuit':(11,22,(48,126,545,494)),
 '11-q17-shield':(11,24,(56,495,493,709)),
 '11-q19-apparatus':(11,29,(48,273,545,483)),
 '11-q20-iron':(11,33,(124,161,478,369)),
 '11-q20-strip':(11,33,(129,697,511,768)),
 '11-q20-switch':(11,34,(34,130,520,275)),
 '12-q11-banked':(12,11,(72,173,483,399)),
 '12-q20-nautilus':(12,26,(48,594,551,772)),
}
assets={}
for name,(year,page,box) in CROPS.items():
 doc=fitz.open(WORK.parent/'physics-sample'/'rendered'/f'year{year}-paper.pdf');p=doc[page-1]
 pix=p.get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(box),alpha=False)
 im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);path=ASSET/f'{name}.webp';im.save(path,'WEBP',lossless=True,method=6)
 assets[name]=str(path.relative_to(ROOT))

def figure(name):
 return html.fragment_fromstring(f'<figure class="source-figure"><img src="{assets[name]}" alt="Original exam diagram {name}" loading="lazy"></figure>')
def insert_after(nodes,needle,name):
 for i,n in enumerate(nodes):
  if needle.lower() in ' '.join(' '.join(n.itertext()).split()).lower():
   fig=figure(name)
   captions={'11-q02-hotplates':'Source labels: HOT PATE 1 — Thinner conductor; HOT PATE 2 — Thicker conductor.', '11-q14-rods':'Source captions (left to right): Position A: Partially inserted; Position B: Fully inserted; Position C: Partially inserted.'}
   if name in captions:
    caption=html.Element('figcaption');caption.text=captions[name];fig.append(caption)
   nodes.insert(i+1,fig);return
 raise ValueError(('Missing insertion anchor',needle,name))

def split(year):
 body=html.fragment_fromstring((WORK/f'year{year}.html').read_text(),create_parent='div');out={};current=None
 for n in body:
  t=' '.join(' '.join(n.itertext()).split())
  m=re.fullmatch(r'Question\s+(\d+)\s*\((\d+)\s*marks?\)',t)
  if m:
   current=int(m[1]);out[current]=[];continue
  if re.match(r'^(End of Questions|Section (Two|Three)|Acknowledgements)',t,re.I):current=None;continue
  if current is None:continue
  if not t and not n.xpath('.//img|.//math'):continue
  if re.fullmatch(r'Question\s+\d+\s+continued.*',t,re.I):continue
  if re.fullmatch(r'[_\s]+',t):continue
  if re.fullmatch(r'\(\d+\s*(marks?)?\)',t):n.set('class','source-part-marks')
  if re.match(r'^\([a-z]\)',t):n.set('class','source-part')
  out[current].append(n)
 return out

# The bank stores JSON between the const records declaration and the insertion loop.
p=ROOT/'upper-school-assessment-bank-physics-repository-sample.js';s=p.read_text();begin=s.index('const records=')+len('const records=');end=s.index(';\nfor(const q of records)',begin)
records=json.loads(s[begin:end]);byyear={y:split(y) for y in [11,12]};mediaassets=[]
for q in records:
 year=q['year'];num=q['sourceQuestionNumber'];nodes=byyear[year][num]
 # Copy raster source figures; replace metafile figures with crops from the faithful rendering.
 for n in nodes:
  for img in n.xpath('.//img'):
   src=Path(img.get('src'));name=src.name
   if year==11 and name=='image2.emf': replacement=assets['11-q17-shield']
   elif year==11 and name=='image3.emf': replacement='assets/physics/exam-import/sample-2024/year11-paper-q19-03.webp'
   elif year==11 and name=='image4.jpeg':replacement=assets['11-q20-iron']
   elif year==12 and num==20 and name=='image18.png':replacement=assets['12-q20-nautilus']
   elif src.suffix.lower() in ['.emf','.wmf']:raise ValueError(('Unconverted metafile',year,num,name))
   else:
    native=WORK.parent/src;raw=Image.open(native).convert('RGBA');background=Image.new('RGBA',raw.size,'white');background.alpha_composite(raw);im=background.convert('RGB');dest=ASSET/f'{year}-{src.stem}.webp';im.save(dest,'WEBP',lossless=True,method=6);replacement=str(dest.relative_to(ROOT));mediaassets.append(replacement)
   img.set('src',replacement);img.attrib.pop('style',None);img.set('loading','lazy');img.set('alt',img.get('alt') or f'Original diagram for Year {year} question {num}')
 if year==11:
  config={2:[('made of the same material.','11-q02-hotplates')],3:[('reaction is illustrated below.','11-q03-fusion')],5:[('unknown resistor','11-q05-circuit')],9:[('three globes.','11-q09-circuit')],10:[('See the diagram below.','11-q10-seabreeze')],11:[('are arranged as shown below.','11-q11-charges')],13:[('wiring for a typical toaster.','11-q13-toaster')],14:[('different modes of insertion','11-q14-rods'),('On the set of axes below','11-q14-axes')],15:[('long transportation times','11-q15-containers')],16:[('connecting wires','11-q16-circuit')],19:[('The equipment is shown below:','11-q19-apparatus')],20:[('structure of the bimetallic strip','11-q20-strip'),('diagram below shows this scenario','11-q20-switch')]}
  for anchor,name in config.get(num,[]):insert_after(nodes,anchor,name)
 if year==12 and num==11:insert_after(nodes,'ignoring friction','12-q11-banked')
 if year==11 and num==14:
  # Repair Pandoc's misplaced isotope prescripts against the source equation.
  isot=lambda a,z,s: f'<mmultiscripts><mi>{s}</mi><mprescripts/><mn>{z}</mn><mn>{a}</mn></mmultiscripts>'
  equation='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow>'+isot(235,92,'U')+'<mo>+</mo>'+isot(1,0,'n')+'<mo>→</mo><mi>X</mi><mo>+</mo>'+isot(143,55,'Cs')+'<mo>+</mo><mn>3</mn>'+isot(1,0,'n')+'</mrow></math>'
  maths=[m for n in nodes for m in n.xpath('.//math')]
  assert maths
  old=maths[0];old.getparent().replace(old,html.fragment_fromstring(equation))
 div=html.Element('div',{'class':'source-text-question'})
 for n in nodes:div.append(n)
 # The original rendering remains available for checking source layout and figure placement.
 q['originalQuestionHtml']=q.get('originalQuestionHtml',q['question'])
 plain=' '.join(' '.join(div.itertext()).split())
 q['question']=html.tostring(div,encoding='unicode')+'<details class="source-original"><summary>View original question layout</summary>'+q['originalQuestionHtml']+'</details>'
 q['stem']=q['question'];q['searchText']=plain;q['questionFormat']='selectable-html-with-source-figures'
 q['reviewStatus']='Text, figures and total marks checked; structured subpart marking rules pending'
style=""".source-text-question{font-size:16px;line-height:1.65;overflow-wrap:break-word}.source-text-question p{margin:12px 0}.source-text-question .source-part{margin-top:24px}.source-text-question .source-part-marks{font-weight:700;text-align:right;margin:2px 0 12px}.source-text-question table{border-collapse:collapse;width:100%;margin:18px 0;display:block;overflow-x:auto}.source-text-question td,.source-text-question th{border:1px solid #c4cdd6;padding:10px;text-align:left;min-width:70px}.source-text-question th{background:#f2f6fa}.source-text-question img{display:block;max-width:100%;height:auto;margin:18px auto}.source-text-question figure{margin:20px 0}.source-text-question math{max-width:100%;overflow-x:auto;vertical-align:middle}.source-original{margin:22px 0;font-size:14px}.source-original summary{cursor:pointer;font-weight:600}@media print{.source-original{display:none}.source-text-question table{display:table}.source-text-question figure,.source-text-question img{break-inside:avoid}}"""
s='\n'.join(line for line in s.split('\n') if not (line.startswith("if(typeof document") and 'physics-source-text-style' in line))
s=s[:begin]+json.dumps(records,ensure_ascii=False,separators=(',',':'))+s[end:]
insert="\nif(typeof document!=='undefined'&&!document.getElementById('physics-source-text-style')){const style=document.createElement('style');style.id='physics-source-text-style';style.textContent="+json.dumps(style)+";document.head.appendChild(style);}\n"
s=s.replace('\n})();',insert+'})();');p.write_text(s)
(WORK/'records.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
print(json.dumps({'converted':len(records),'native_images':len(set(mediaassets)),'diagram_crops':len(CROPS),'figures_total':len(list(ASSET.glob('*.webp')))}))
