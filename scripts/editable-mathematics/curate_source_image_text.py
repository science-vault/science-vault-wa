from pathlib import Path
from lxml import etree,html as LH
import json,html
root=Path(__file__).parent;images=json.load(open(root/'image-text-candidates.json'));equations=json.load(open(root/'physics-native-equations.json'));records={}
def key(src):
 a=2166136261;b=2246822519
 for c in src:a=((a^ord(c))*16777619)&0xffffffff;b=((b^ord(c))*3266489917)&0xffffffff
 return f'{a:08x}-{b:08x}-{len(src)}'
def clean_math(value):
 node=etree.fromstring(value.encode())
 for a in node.xpath('//*[local-name()="annotation"]'):a.getparent().remove(a)
 # Some source equations use separate underscore tokens for a response blank.
 for parent in node.iter():
  run=[]
  for e in list(parent)+[None]:
   if e is not None and (e.text or '')=='_':run.append(e);continue
   if len(run)>=3:
    replacement=etree.Element('{http://www.w3.org/1998/Math/MathML}mtext');replacement.text='□';parent.insert(list(parent).index(run[0]),replacement)
    for token in run:parent.remove(token)
   run=[]
 return etree.tostring(node,encoding='unicode')
def put(index,value,origin='Reviewed original source figure'):
 item=images[index];records[key(item['src'])]={'html':value,'sourceSHA256':item['sha256'],'questions':item['questions'],'origin':origin}
def source(index,equation,label=''):
 e=equations[equation];put(index,clean_math(e['mathml'])+(' '+html.escape(label) if label else ''),e['source']+' · question '+str(e['q']))
def m(body):return '<math xmlns="http://www.w3.org/1998/Math/MathML">'+body+'</math>'
def t(s):return '<mtext>'+html.escape(str(s))+'</mtext>'
def mi(s):return '<mi>'+html.escape(str(s))+'</mi>'
def mn(s):return '<mn>'+str(s)+'</mn>'
def frac(a,b):return '<mfrac><mrow>'+a+'</mrow><mrow>'+b+'</mrow></mfrac>'
def sub(a,b):return '<msub><mrow>'+a+'</mrow><mrow>'+b+'</mrow></msub>'
def sup(a,b):return '<msup><mrow>'+a+'</mrow><mrow>'+b+'</mrow></msup>'
def iso(s,A,Z):return '<mmultiscripts>'+mi(s)+'<mprescripts/><mrow>'+mn(Z)+'</mrow><mrow>'+t(A)+'</mrow></mmultiscripts>'
for index,eq,label in [(26,0,''),(28,2,'(2)'),(29,3,'(3)'),(30,4,'(4)'),(31,5,'(5)'),(32,6,'(6)'),(69,22,''),(71,24,''),(72,25,''),(73,27,''),(88,29,''),(89,30,''),(90,31,''),(105,20,''),(112,21,''),(135,35,''),(136,37,''),(137,41,''),(138,45,''),(139,48,''),(140,49,''),(141,51,''),(142,8,''),(148,9,''),(151,10,''),(172,13,''),(176,32,''),(177,33,''),(179,34,'')]:source(index,eq,label)
put(19,m(mi('P')+t(' = ')+frac(mi('Q'),mi('t'))+t(' = ')+frac(mi('kA')+t('(')+sub(mi('T'),mn(2))+t(' − ')+sub(mi('T'),mn(1))+t(')'),mi('d'))))
put(21,m(sub(mi('V'),mi('L'))+t(' = 4.5 − 100 ')+sub(mi('I'),mi('T'))))
records[key(images[90]['src'])]['removeFollowingText']='2 V peak I peak'
put(33,m(frac(mn(1),mn(2))+mi('a')+sup(mi('t'),mn(2))))
put(49,m(sub(mi('N'),mi('p'))+t(' : ')+sub(mi('N'),mi('s'))))
put(50,m(sub(mi('N'),mi('p'))+t(' : ')+sub(mi('N'),mi('s'))+t(' = □ : □')))
put(54,m(sub(mi('F'),mi('f'))+t(' = μN'))+' (1)')
put(55,m(sub(mi('v'),t('max'))+t(' = ' )+'<msqrt>'+mi('μrg')+'</msqrt>')+' (4)')
put(56,m(sub(mi('τ'),t('spring'))+t(' = kθ'))+' (1)')
put(57,m(sub(mi('τ'),t('coil'))+t(' = NBIA'))+' (2)')
put(58,m(sub(mi('τ'),t('coil'))+t(' = ')+sub(mi('τ'),t('spring')))+' (3)')
put(59,m(t('θ = CI'))+', where C is some constant.')
put(91,m(mi('d')+'<mover>'+mi('s')+'<mo accent="true">¯</mo></mover>'))
put(150,m(frac(mi('q'),mi('m'))))
put(171,'given by '+clean_math(equations[12]['mathml'])+'.',equations[12]['source']+' · question 12')
put(180,m(mi('u')+'<mover>'+mi('s')+'<mo accent="true">¯</mo></mover><mo>→</mo>'+sup(mi('μ'),t('+'))+t(' + □')))
for index,label in {46:'Efficiency: □ %',48:'□ km s⁻¹',51:'Height: □ m',53:'□ m s⁻¹',60:'Angle: □ °',61:'□ A',65:'□ m s⁻¹',68:'□ kg',97:'□ N',109:'□ Wb',110:'□ N',111:'□ m s⁻¹',113:'□ W'}.items():put(index,html.escape(label),'Reviewed response line and supplied unit')
put(23,'<strong>Transmission Line</strong>')
put(27,'','Removed conversion artefact; no question information')
put(40,'<table style="width:100%"><tr><th>Circuit A</th><th>Circuit B</th></tr></table>')
put(44,'<p>□ Acceleration from rest　 □ Acceleration while moving　 □ Zero acceleration</p>')
put(87,'<p>□ &gt; □ &gt; □</p>')
put(11,'(a) '+m(iso('n',1,0)+t(' → ')+iso('e',0,-1)+t(' + V')))
put(12,'(b) '+m(iso('p',1,1)+t(' → ')+iso('n',1,0)+t(' + W')))
put(13,'(c) '+m(iso('Ra',226,88)+t(' → X + ')+iso('He',4,2)))
put(14,'(d) '+m(iso('Hg',200,80)+t(' + ')+iso('n',1,0)+t(' → ')+iso('Hg',201,80)+t(' + Y')))
put(15,'(e) '+m(iso('Co','60m',27)+t(' → Z + ')+iso('γ',0,0)))
chain=[('Po',218,84,'Pb',214,82,'α','3.0 min'),('Pb',214,82,'Bi',214,83,'β','27 min'),('Bi',214,83,'Tl',210,81,'α','20 min'),('Tl',210,81,'Pb',210,82,'β','1.3 min')]
put(22,'<table><tr><th>Decay</th><th>Radiation</th><th>Half-life</th></tr>'+''.join('<tr><td>'+m(iso(a,A,Z)+t(' → ')+iso(b,B,Y))+'</td><td>'+radiation+'</td><td>'+half+'</td></tr>' for a,A,Z,b,B,Y,radiation,half in chain)+'</table>')
# Methods question 13: recover its original plain-text instructions as well as equations.
integral=m(mi('D')+t('(t) = ')+'<msubsup><mo>∫</mo>'+mn(0)+'<mrow>'+t('2πt')+'</mrow></msubsup><msqrt><mrow>'+mn(5)+t(' + ')+sup(mi('cos'),mn(2))+t('(x)')+'</mrow></msqrt>'+t(' dx'))
put(3,m(mi('D')));put(4,integral);put(5,m(mi('t')));put(6,m(t('t = 1')));put(7,m(t('t = 1')));put(8,m(t('t = 1.03'))+'.')
speed=m(mi('s')+t(' = ')+frac(t('dD'),t('dt')))
for path in (root/'all-banks').glob('practice-studio-methods-*.json'):
 for q in json.load(open(path)):
  if q['id']=='methods12-local24-u3-q13':
   import hashlib
   src=LH.fromstring('<div>'+q['html']+'</div>').xpath('.//img')[5].get('src');records[key(src)]={'html':speed,'sourceSHA256':hashlib.sha256(src.encode()).hexdigest(),'questions':[q['id']],'origin':'Original Word equation image11.png'}
tail='<p>The distance, '+m(mi('D'))+', travelled along the zipline is given by</p><p>'+integral+'</p><p>where '+m(mi('D'))+' is measured in metres and '+m(mi('t'))+' is measured in seconds.</p><p>(d) Determine the speed '+speed+' of the person on the zipline when '+m(t('t = 1'))+'. (3 marks)</p><p>(e) Use the increments formula to estimate the distance travelled by the object between '+m(t('t = 1'))+' and '+m(t('t = 1.03'))+'. (2 marks)</p>'
payload={'images':records,'tails':{'methods12-local24-u3-q13':{'anchor':'The distance,','html':tail,'origin':'2024 Year 12 Mathematics Methods Semester 1 Exam (CA).docx, question 13'}}}
(root/'source-image-text.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2))
script='/* Reviewed source-equation and response-line transcriptions. Original source hashes are retained for verification. */\n(function(root){\n const data='+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n function key(src){let a=2166136261,b=2246822519;for(let i=0;i<src.length;i++){const c=src.charCodeAt(i);a=Math.imul(a^c,16777619)>>>0;b=Math.imul(b^c,3266489917)>>>0;}return a.toString(16).padStart(8,"0")+"-"+b.toString(16).padStart(8,"0")+"-"+src.length;}\n root.StudioSourceImageText={...data,key,resolve:src=>data.images[key(src)]};\n})(typeof window==="undefined"?globalThis:window);\n'
(root/'current/studio-source-image-text.js').write_text(script);print('Reviewed image-to-text mappings:',len(records))
