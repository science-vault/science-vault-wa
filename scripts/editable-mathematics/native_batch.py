import sys
if len(sys.argv)!=2:raise SystemExit('Usage: python '+sys.argv[0]+' STAGING_DIRECTORY')
from pathlib import Path as _StagePath
_StagePath(sys.argv[1]).mkdir(parents=True,exist_ok=True)
from pathlib import Path
from zipfile import ZipFile
from lxml import etree,html as LH
import json,re,html,collections
root=Path(sys.argv[1]);out=root/'output';out.mkdir(exist_ok=True);NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'};W='{'+NS['w']+'}'
def native_plain(node):
 tag=etree.QName(node).localname
 children=list(node)
 if tag=='mfrac' and len(children)>=2:return '('+native_plain(children[0])+')/('+native_plain(children[1])+')'
 if tag=='msup' and len(children)>=2:return native_plain(children[0])+'^('+native_plain(children[1])+')'
 if tag=='msqrt':return '√('+''.join(native_plain(c) for c in children)+')'
 if tag=='mroot' and len(children)>=2:return native_plain(children[1])+'root('+native_plain(children[0])+')'
 if tag=='msub' and len(children)>=2:return native_plain(children[0])+'_'+native_plain(children[1])
 value=(node.text or '')+''.join(native_plain(c)+(c.tail or '') for c in children)
 return value+(' ' if tag in ['p','td','tr'] else '')
def clean(s):return re.sub(r'(?:\.\s*){8,}|_{8,}','',s)
def text(e):return ''.join(e.xpath('.//w:t/text()',namespaces=NS))
def fxhtml(s):
 def close(i):
  depth=0
  for j in range(i,len(s)):
   if s[j]=='(':depth+=1
   if s[j]==')':
    depth-=1
    if depth==0:return j
  return None
 nodes=[];buffer='';i=0
 def flush():
  nonlocal buffer
  if buffer:nodes.append('<mtext>'+html.escape(buffer)+'</mtext>');buffer=''
 while i<len(s):
  power=re.match(r'(\d+(?:\.\d+)?|[A-Za-z])\^\(([^()]*)\)',s[i:])
  if power:
   flush();tag='mn' if power[1][0].isdigit() else 'mi';nodes.append('<msup><'+tag+'>'+power[1]+'</'+tag+'><mrow>'+fxhtml(power[2])+'</mrow></msup>');i+=power.end();continue
  raised=re.match(r'([A-Za-z])([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)',s[i:])
  if raised:
   flush();exponent=raised[2].translate(str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺','0123456789-+'));nodes.append('<msup><mi>'+raised[1]+'</mi><mn>'+exponent+'</mn></msup>');i+=raised.end();continue
  root=re.match(r'([⁰¹²³⁴⁵⁶⁷⁸⁹]+)?√',s[i:])
  if root:
   start=i+root.end();end=None;value=None
   if start<len(s) and s[start]=='(':
    end=close(start)
    if end is not None:value=fxhtml(s[start+1:end]);end+=1
   else:
    number=re.match(r'\d+(?:\.\d+)?',s[start:])
    if number:value='<mn>'+number[0]+'</mn>';end=start+number.end()
   if value is not None:
    flush()
    if root[1]:nodes.append('<mroot><mrow>'+value+'</mrow><mn>'+root[1].translate(str.maketrans('⁰¹²³⁴⁵⁶⁷⁸⁹','0123456789'))+'</mn></mroot>')
    else:nodes.append('<msqrt><mrow>'+value+'</mrow></msqrt>')
    i=end;continue
  if s[i]=='(':
   end=close(i)
   if end is not None and s[end+1:end+3]=='/(':
    denend=close(end+2)
    if denend is not None:
     flush();nodes.append('<mfrac><mrow>'+fxhtml(s[i+1:end])+'</mrow><mrow>'+fxhtml(s[end+3:denend])+'</mrow></mfrac>');i=denend+1;continue
  numeric=re.match(r'(\d+)/(\d+)',s[i:])
  if numeric:
   flush();nodes.append('<mfrac><mn>'+numeric[1]+'</mn><mn>'+numeric[2]+'</mn></mfrac>');i+=numeric.end();continue
  buffer+=('÷' if s[i]=='/' else s[i]);i+=1
 flush();return ''.join(nodes)
diagram_maps=json.loads((root/'diagram-mapping.json').read_text()) if (root/'diagram-mapping.json').exists() else {}
current_diagrams={}
# Audited empty answer boxes in this source; never remove diagram rectangles.
answer_box_ids={'_x0000_s1215','_x0000_s1309','_x0000_s1274','_x0000_s1344','_x0000_s1322','_x0000_s1330','_x0000_s1332','_x0000_s1334','_x0000_s1342','_x0000_s1346'}
def answer_box(e):
 if prepared.name!='practice-studio-mathematics-pythagoras.docx' or etree.QName(e).localname!='pict' or len(e)!=1:return False
 rect=e[0]
 return etree.QName(rect).localname=='rect' and rect.get('id') in answer_box_ids and len(rect)==0 and set(rect.attrib)<=set(['id','style'])
def diagram(e):
 images=e.xpath('.//*[local-name()="imagedata"]')
 if len(images)!=1:return None
 shape=images[0].getparent()
 item=current_diagrams.get(shape.get('id'))
 if item and images[0].get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')==item['relationshipId']:return item
 return None
def markup(e):
 tag=etree.QName(e).localname
 if tag in ['pict','object','drawing']:
  if answer_box(e):return ''
  item=diagram(e)
  if item:return '<figure><img src="'+item['assetFile']+'" alt="Original Pythagoras diagram" width="'+str(round(item['displayWidthPx'],3))+'" data-word-width-px="'+str(round(item['displayWidthPx'],3))+'" data-word-max-height="7"></figure>'
 if tag=='t':
  native=e.get('{urn:learning-vault:conversion}mathml')
  if native is not None:return native if ''.join(etree.fromstring(native.encode()).itertext()).strip() else ''
  fx=e.get('{urn:learning-vault:conversion}fxe')
  if fx is not None:
   inner='<mtable>'+''.join('<mtr><mtd><mrow>'+fxhtml(line)+'</mrow></mtd></mtr>' for line in fx.split('\n'))+'</mtable>' if '\n' in fx else '<mrow>'+fxhtml(fx)+'</mrow>'
   return '<math xmlns="http://www.w3.org/1998/Math/MathML">'+inner+'</math>'
  return html.escape(clean(e.text or ''))
 if tag=='tab':return '\t'
 if tag=='br':return '<br>'
 if tag in ['pPr','rPr','tblPr','trPr','tcPr','proofErr','bookmarkStart','bookmarkEnd']:return ''
 s=''.join(markup(c) for c in e)
 if tag=='r':
  if e.xpath('./w:rPr/w:vertAlign[@w:val="superscript"]',namespaces=NS):s='<sup>'+s+'</sup>'
  if e.xpath('./w:rPr/w:vertAlign[@w:val="subscript"]',namespaces=NS):s='<sub>'+s+'</sub>'
 if tag=='p':return re.sub(r'<p>\s*</p>','', '<p>'+s.strip().replace('<figure>','</p><figure>').replace('</figure>','</figure><p>')+'</p>') if s.strip() else ''
 if tag=='tbl':return '<table>'+s+'</table>'
 if tag=='tr':return '<tr>'+s+'</tr>'
 if tag=='tc':return '<td>'+s+'</td>'
 return s
report={'subject':'Mathematics','total':1128,'converted':[],'pending':[],'nativeExisting':[]}
for path in root.glob('practice-studio-mathematics-*.json'):
 if '-index' in path.name or path.name=='practice-studio-mathematics-lower-report.json':continue
 rows=json.loads(path.read_text())
 if not isinstance(rows,list):continue
 prepared=root/'prepared'/path.name.replace('.json','.docx')
 if not prepared.exists():continue
 current_diagrams=diagram_maps.get(prepared.name,{})
 z=ZipFile(prepared);doc=etree.fromstring(z.read('word/document.xml'));mapping={};section='all'
 for table in doc.xpath('//w:tbl[not(ancestor::w:tbl)]',namespaces=NS):
  active=None
  for row in table.xpath('./w:tr',namespaces=NS):
   cells=row.xpath('./w:tc',namespaces=NS)
   if not cells:continue
   t=text(row)
   header=re.search(r'(Short Answer|Multiple Choice|Long(?:er)? (?:Answer|Response)) Section',t,re.I)
   if header:
    section='short' if header[1].lower().startswith('short') else 'choice' if header[1].lower().startswith('multiple') else 'long';active=None;continue
   number=re.fullmatch(r'\s*(\d+)\s*[.)]?\s*',text(cells[0]))
   if number and len(cells)>=2:
    key=(section,int(number[1]))
    if key in mapping:active=None;continue
    active=key;mapping[key]=('',False);bodies=cells[1:]
   else:
    if re.search(r'Questions?\s+\d+.*?(?:refer|use|information)',t,re.I):active=None
    if active is None:continue
    bodies=cells
   content=''.join(markup(child) for body in bodies for child in body)
   graphics=any(diagram(g) is None and not answer_box(g) for body in bodies for g in body.xpath('.//w:pict|.//w:drawing|.//w:object',namespaces=NS))
   previous=mapping[active];mapping[active]=(previous[0]+content,previous[1] or graphics)
 changed=False
 for q in rows:
  # Already authored native banks are retained. Whole-question scan classes require conversion.
  scan=bool(re.search(r'(batch-[a-z-]+-questions\.jpg|algebra-[a-z-]+-questions\.jpg)',q['html']))
  if not scan:report['nativeExisting'].append(q['id']);continue
  sectionMatch=re.search(r'-(short|choice|long)-q',q['id']);section=sectionMatch[1] if sectionMatch else ('choice' if q.get('markingMode')=='automatic' else 'short');num=int(q.get('sourceNumber',q['number']));candidate=mapping.get((section,num)) or mapping.get(('all',num))
  if not candidate or candidate[1]:report['pending'].append({'id':q['id'],'reason':'source diagram or embedded object requires separate conversion' if candidate else 'source structure needs manual mapping'});continue
  h=candidate[0];plain=' '.join(LH.fromstring('<div>'+h+'</div>').itertext()).strip()
  if len(plain)<3:report['pending'].append({'id':q['id'],'reason':'missing source text'});continue
  if section=='choice':
   # Recover genuine answer choices, replacing placeholder A/B/C/D metadata.
   match=list(re.finditer(r'(?<![A-Za-z])([ABCD])(?:\s*[.)]\s*|[ \t]{2,})',h))
   seq=None
   for i in range(len(match)-3):
    if ''.join(m[1] for m in match[i:i+4])=='ABCD':seq=match[i:i+4];break
   if seq is None:
    math_fragments=[]
    def protect_math(match):
     math_fragments.append(match[0]);return 'MATHFRAGMENT'+str(len(math_fragments)-1)+'END'
    protected=re.sub(r'<math\b[^>]*>.*?</math>',protect_math,h,flags=re.S)
    paragraphs=list(re.finditer(r'<p>(.*?)</p>',protected,re.S));chunks=[];start=None
    for para in reversed(paragraphs):
     pieces=[c.strip() for c in re.split(r'(?: {3,}|\t+)',para[1]) if c.strip()]
     if len(chunks)+len(pieces)>4:break
     chunks=pieces+chunks;start=para.start()
     if len(chunks)==4:break
    if len(chunks)==4 and start is not None:
     def restore_math(value):
      return re.sub(r'MATHFRAGMENT(\d+)END',lambda m:math_fragments[int(m[1])],value)
     h=restore_math(protected[:start]);q['optionsHtml']=['<span>'+restore_math(v)+'</span>' for v in chunks];q['options']=['A','B','C','D']
    else:report['pending'].append({'id':q['id'],'reason':'choice layout needs manual mapping'});continue
   if seq is not None:
    opts=[]
    for i,m in enumerate(seq):
     value=h[m.end():seq[i+1].start() if i<3 else len(h)];value=re.sub(r'^\s*</?p>|</?p>\s*$','',value).strip();value=re.sub(r'</p>\s*<p>','<br>',value);opts.append('<span>'+value+'</span>')
    stem=h[:seq[0].start()];stem=re.sub(r'<p>\s*$','',stem).strip();
    if stem.count('<p>')>stem.count('</p>'):stem+='</p>'
    # Parse/re-serialize to guarantee well-formed fragments after paragraph splitting.
    opts=[LH.tostring(LH.fromstring(v),encoding='unicode') for v in opts];q['optionsHtml']=opts;q['options']=['A','B','C','D'];h=stem
  source_text=' '.join(LH.fromstring('<div>'+h+'</div>').itertext())
  has_shared=len(LH.fromstring('<div>'+q['html']+'</div>').xpath('.//figure[.//img]'))>1
  needs_figure=bool(re.search(r'\b(?:diagram|figure|thermometer|map|grid)\b|pattern (?:below|above)|(?:table|graph|triangle|rectangle|square|shape|line|circle|solid|prism|cylinder|cone|pyramid) (?:below|above|shown)|\bshown\b|(?:shaded|marked) (?:angle|shape|region)',source_text,re.I))
  if '-batch-angles-' in q['id'] and re.search(r'parallel|perpendicular|value of x|angle marked|size of',source_text,re.I):needs_figure=True
  if needs_figure and not has_shared and '<table>' not in h and '<figure>' not in h:
   report['pending'].append({'id':q['id'],'reason':'Referenced source diagram requires separate mapping'});continue
  used_images=LH.fromstring('<div>'+h+''.join(q.get('optionsHtml',[]))+'</div>').xpath('.//img/@src')
  if used_images:q['nativeDiagramSources']=[item for item in current_diagrams.values() if item['assetFile'] in used_images]
  original=LH.fromstring('<div>'+q['html']+'</div>');shared=''.join(LH.tostring(f,encoding='unicode') for f in original.xpath('.//figure[.//img]')[:-1]);notes=''.join(LH.tostring(p,encoding='unicode') for p in original.xpath('./p') if p.text_content().strip() and not p.text_content().strip().startswith('Choose the matching letter'));q['html']='<div class="studio-native-question">'+notes+shared+h+'</div>';q['editableText']=True;q['questionFormat']='native-text';q['responseLines']=0;q['fontFamily']='Arial';q['fontSizePt']=12;q['conversionOrigin']='original-docx-text-and-equation-source';q['figures']=q['html'].count('<img');q['text']=re.sub(r'\s+',' ',native_plain(LH.fromstring('<div>'+h+'</div>'))).strip();report['converted'].append(q['id']);changed=True
 if changed or (out/path.name).exists():(out/path.name).write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')))
(root/'native-conversion-progress.json').write_text(json.dumps(report,indent=2));print({k:len(v) if isinstance(v,list) else v for k,v in report.items()});print('changed files',len(list(out.glob('*.json'))))
