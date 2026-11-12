from pathlib import Path
from html import escape
import re,json,hashlib,sys
from solutions import MC,SOL,OV,NOTES
import overrides
OUT=Path('output');ASSET='assets/chemistry/practice-science-year10/'
FIG={
'bio-A1':['bio-mitosis'],'bio-A7':['bio-embryos'],'bio-A8':['bio-crosses'],**{f'bio-A{i}':['bio-lice'] for i in (11,12,13)},'bio-A17':['bio-finches'],'bio-A18':['bio-fossil'],'bio-B21':['bio-stages'],'bio-B22':['bio-pedigree'],'bio-B23':['bio-mice'],
'earth-A5':['earth-galaxies'],'earth-B19':['earth-solar'],**{f'earth-ExtA{i}':['earth-hr'] for i in (5,6)},'earth-ExtA8':['earth-comet'],'earth-ExtB12':['earth-spectrum'],
'chem-A8':['chem-sugar'],'chem-A10':['chem-table'],'phys-A2':['phys-swing'],'phys-A3':['phys-displacement'],'phys-A5':['phys-speed'],'phys-A9':['phys-toboggan'],'mid-A4x':['mid-map'],'mid-A6':['mid-tape','mid-tape2'],'mid-A10':['mid-swimmer'],'sem1-B8':['sem1-forces'],'sem1-C5':['sem1-velocity','sem1-bike'],**{f'sem2-A{i}':['sem2-position'] for i in (3,4,5)},**{f'sem2-A{i}':['sem2-mice'] for i in (30,31,32)},'sem2-A38':['sem2-limbs'],'sem2-B12':['sem2-dimples']}
KEYS={'chem':'Y10ChemEndTopicTestSolns2017.pdf','bio':'Yr 10 Topic test 2017 marking key.docx','earth':'Earth test solns.pdf','phys':'Y10PhysUnitTestSolns2017.pdf','mid':'Y10MidTopicTest2017Soln.pdf','sem1':'Y10ExamSem1,2017_Solns.pdf','sem2':'Y10Exam2017,Sem2,Solns.pdf'}
FILES={'chem':'Year 10 Chemistry End of Topic Test (Draft 2).docx','bio':'Yr 10 Topic test 2017 Questions sheet.docx','earth':'Earth topic test 2015.docx','phys':'Y10 PhysicsTest2017.docx','mid':'Year 10 Physical Sciences Mid Topic Test 2017.doc','sem1':'Yr 10 Exam, Sem 1, 2017.docx','sem2':'Y10P1Exam2017Sem2.doc'}
LABEL={'chem':'Chemistry end-of-topic test','bio':'Biological Science topic test','earth':'Earth and Space topic test','phys':'Physical Sciences topic test','mid':'Physical Sciences mid-topic test','sem1':'Science Semester 1 exam','sem2':'Science Semester 2 exam'}
def clean(t):
 t=t.replace('\f','\n').replace('\uf0ae',' → ').replace('\uf0b4',' × ').replace('\uf0a0',' ').replace('\uf06c','')
 t=re.sub(r'\n\s*\d{1,2}\s*\n','\n',t)
 for marker in ['SECTION B:','SECTION A:','Part B Short Answer','Section B –','Section B Short','Section C –','End of Test','End of Section','End Of Exam','Applecross SHS','Applecross Senior','Question 11, 12 and 13 refer','The following photo refers to question 18','The next 3 questions refer','The position vs. time graph of a moving object is']:
  if marker in t:t=t.split(marker)[0]
 t=re.sub(r'_{3,}',' □ ',t);t=re.sub(r'\bShow all working\.?','Show working.',t)
 lines=[]
 for line in t.splitlines():
  line=line.strip()
  if not line or re.fullmatch(r'[\s□._]+',line) or re.fullmatch(r'\d{1,2}',line) or re.match(r'^(See questions on|Answer the Questions|Question \d+\. Continued|Write your answers in)',line):continue
  lines.append(re.sub(r'\s+',' ',line))
 return '\n'.join(lines).strip()
def paras(t):
 # Keep parts visibly separate and ordinary wrapped lines joined.
 lines=[];current=''
 for line in t.splitlines():
  if re.match(r'^\(?[a-l]\)|^\([iv]+\)|^\[\d+\]|^\(\d+ marks?\)',line) or len(line)>170:
   if current:lines.append(current);current=''
   lines.append(line)
  elif current:current+=' '+line
  else:current=line
 if current:lines.append(current)
 return ''.join('<p>'+escape(x)+'</p>' for x in lines)
def table(headers,rows):return '<table><thead><tr>'+''.join('<th>'+escape(x)+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+escape(x)+'</td>' for x in row)+'</tr>' for row in rows)+'</tbody></table>'
def square(a,b):return table(['Gametes',*a],[[b[0],b[0]+a[0],b[0]+a[1]],[b[1],b[1]+a[0],b[1]+a[1]]])
def svg(content,w=600,h=210):return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="Worked diagram" style="max-width:100%;font:16px Arial">{content}</svg>'
EXTRA={
'bio-B22':square(['B','b'],['B','b']),
'bio-B23':square(['W','W'],['w','w']),
'sem2-B10':square(['D','d'],['d','d']),
'sem2-B11':table(['Gametes','Xᴮ','Y'],[['Xᴮ','XᴮXᴮ','XᴮY'],['Xᵇ','XᴮXᵇ','XᵇY']]),
'bio-B25':svg('<circle cx="80" cy="95" r="32" fill="#dcecf6" stroke="#235"/><path d="M112 95H185M265 95H345" stroke="#235" stroke-width="3"/><path d="M185 75L225 45L265 75L250 125H200Z" fill="#fff1c9" stroke="#235"/><rect x="345" y="65" width="140" height="60" fill="#e4f1df" stroke="#235"/><text x="45" y="165">Phosphate</text><text x="170" y="165">Deoxyribose sugar</text><text x="350" y="100">Base (A, T, C, G)</text>'),
'chem-A18':svg('<text x="30" y="50">Mg → Mg²⁺ + 2e⁻</text><text x="300" y="50">O + 2e⁻ → O²⁻</text><text x="110" y="135" font-size="32">Mg²⁺    [ O ]²⁻</text><text x="350" y="135" font-size="32">O = C = O</text><text x="80" y="185">Ionic attraction</text><text x="330" y="185">Two covalent double bonds</text>'),
'earth-B17':svg('<circle cx="95" cy="75" r="45" fill="#ffe3a2" stroke="#235"/><circle cx="210" cy="75" r="11" fill="#235"/><path d="M230 75H390" stroke="#235"/><text x="65" y="155">Star</text><text x="170" y="155">Planet</text><text x="395" y="80">Observer</text><text x="80" y="195">Transit blocks a small fraction of the starlight</text>'),
'earth-ExtB12':svg('<path d="M55 20V175H570" fill="none" stroke="#235" stroke-width="2"/><path d="M55 175C105 175 115 24 155 32S240 160 560 172" fill="none" stroke="#3275ae" stroke-width="3"/><path d="M55 175C140 175 160 95 205 110S330 170 560 174" fill="none" stroke="#bb8821" stroke-width="3"/><text x="300" y="50" fill="#3275ae">Hotter: higher and peak further left</text><text x="285" y="200">Wavelength →</text>'),
}
# Source equations and compressed parts whose visual layout cannot be inferred from extracted lines.
OV.update({
'chem-A6':'Zinc reacts with dilute hydrochloric acid: Zn(s) + HCl(aq) → ZnCl₂(aq) + H₂(g). Which listed coefficients balance this equation, left to right?',
'chem-A11':'Given Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g) + heat, which listed substance is a reactant?',
'chem-A14':'Balance uAl + vH₂SO₄ → wAl₂(SO₄)₃ + xH₂. What are u, v, w and x?',
'chem-A17':'One mole always contains approximately:',
'chem-B10':'Lead nitrate reacts with sodium iodide to form a yellow lead iodide precipitate: Pb(NO₃)₂( ) + 2NaI( ) → PbI₂( ) + 2NaNO₃( ). (a) Add state symbols. [2] (b) Why use coefficients to balance the equation? [2] (c) If 2 mol lead nitrate reacts completely, how much lead iodide forms in moles? [1] (d) Calculate its mass. [2]',
'chem-B11':'For each substance C₂H₆ and CaCl₂, state the bonding type, draw its structure and explain why one forms discrete molecules while the other forms a lattice. [6]',
'sem2-A13':'Which statement correctly describes molecules?',
'sem1-A5':'For sodium written ²³₁₁Na, which statement is correct?',
'sem1-A7':'Which chemical equation is correctly balanced?',
'sem1-B2':'Write electron configurations for (a) Na, (b) S²⁻, (c) Li⁺ and (d) Ar. [4]',
'sem1-B3':'Balance: (a) Na + H₂O → NaOH + H₂; (b) CuS + O₂ → CuO + SO₂; (c) KClO₃ → KCl + O₂. [3]',
'sem1-C4':'A car travels on a level road. (a)(i) At constant velocity, how does friction compare with driving force? [1] (ii) For acceleration 12 m/s² over 4.0 s, find the velocity increase. [2] (c) A 1400 kg family car reaches 30 m/s from rest in 10 s; a 600 kg sports car does so in 5 s. Use calculations to explain how the sports car has greater acceleration but smaller net force. [3] (d) An unrestrained shopping bag rests on a passenger seat while the driver wears a seat belt. Explain what happens to both when the car brakes suddenly. [2]',
'sem2-A18':'For sodium written ²³₁₁Na, which statement is correct?',
'sem2-B7':'Balance: (a) Al + F₂ → AlF₃; (b) NaOH + H₂SO₄ → Na₂SO₄ + H₂O; (c) SO₂ + O₂ → SO₃. [3]',
'sem2-B11':'Cross a normal-vision male XᴮY with a carrier female XᴮXᵇ. B represents normal vision and b colour-blindness in this X-linked recessive model. Complete a Punnett square and give genotype and phenotype probabilities. [3]',
})
FIX_OPTIONS={
'earth-ExtA4':['mostly neutrons','atoms','electrons and atomic nuclei','solar wind'],
'earth-ExtA5':['Red giants/supergiants','Blue giants','Main sequence stars','White dwarfs and black holes'],
'bio-A6':['AA','Aa','aa','AA and aa'],
'bio-A1':['Diagram A','Diagram B','Diagram C','Diagram D'],
'bio-A8':['Cross A','Cross B','Cross C','Cross D'],
'chem-A6':['1, 1, 2, 2','1, 2, 1, 1','2, 4, 2, 2','Both B and C'],
'chem-A17':['6.02 × 10²³ atoms','6.02 × 10²³ molecules','6.02 × 10²³ ions','6.02 × 10²³ specified particles'],
'sem1-A7':['CuO + 2C → Cu + 4CO₂','SO₂ + O₂ → SO₃','P₄O₁₀ + 10C → P₄ + 10CO','H₂S + O₂ → H₂O + SO₂'],
'sem2-A12':['CuO + 2C → Cu + 4CO₂','SO₂ + O₂ → SO₃','P₄O₁₀ + 10C → P₄ + 10CO','H₂S + O₂ → H₂O + SO₂'],
'sem2-A7':['5 km/h/s','5 m/s²','18 km/s²','−5 m/s²'],
'sem2-A30':['1, 6 and 7','6 and 7','1, 3, 6 and 7','1 and 3'],
'sem2-A31':['BB, Bb and bb respectively','bb, Bb and BB respectively','All three are bb','All three are BB'],
'sem2-A32':['BB or Bb','Bb','BB','bb'],
'sem2-A43':['red giant → yellow dwarf → red dwarf → white dwarf → nebula','white dwarf → red giant → nebula → red dwarf → yellow dwarf','red dwarf → white dwarf → yellow dwarf → nebula → red giant','nebula → Sun-like main sequence → red giant → planetary nebula → white dwarf'],
}
def strand(key,text):
 slug=key.split('-')[0];num=int(re.search(r'(\d+)',key).group(1));sec=key.split('-')[1]
 if slug in ['chem','bio','earth','phys','mid']:return {'chem':'Chemical sciences','bio':'Biological sciences','earth':'Earth and space sciences','phys':'Physical sciences','mid':'Physical sciences'}[slug]
 if slug=='sem1':return 'Chemical sciences' if sec[0]=='A' or (sec[0]=='B' and num<=6) else 'Physical sciences'
 if sec[0]=='A':return 'Physical sciences' if num<=8 else 'Chemical sciences' if num<=22 else 'Biological sciences' if num<=38 else 'Earth and space sciences'
 return 'Physical sciences' if num<=2 else 'Chemical sciences' if num<=7 else 'Biological sciences' if num<=13 else 'Earth and space sciences'
def subtopic(st,t):
 t=t.lower()
 patterns={'Biological sciences':[(r'mitosis|meiosis|chromosome.*replicat|cell division','Cell division'),(r'punnett|genotyp|allele|pedigree|fur|eye.*colour|wings|radish|tongue|sex chromosom|mouse|mice|dimples','Inheritance'),(r'nucleotide|dna|helix','DNA structure'),(r'lice|antibiotic|mutation|evolution|selection|finch|ancestor|snake|fossil|forelimb','Evolution and natural selection')],
 'Chemical sciences':[(r'mole|formula mass|molar|36.03|6.02','Moles and chemical calculations'),(r'rate|tablet|powder|sugar','Rates of reaction'),(r'pentane|propene|propane|butane','Hydrocarbons'),(r'precipitate|soluble|iodide','Solubility and precipitation'),(r'balanc|equation|combustion','Chemical equations'),(r'bond|conduct|lattice|c₂h₆|cacl₂|magnesium oxide','Chemical bonding'),(r'configuration|proton|neutron|period|atomic|isotope|noble|sodium written','Atomic structure and the periodic table')],
 'Physical sciences':[(r'newton|force|seat.?belt|swimmer|dragster|inertia','Forces and Newton’s laws'),(r'graph|tape|speed|velocity|displacement|acceleration|vector|map|triathlon|freeman|light year','Motion and measurement'),(r'energy|work|power|swing|toboggan|barbell|javelin|bungee','Work energy and power')],
 'Earth and space sciences':[(r'red.?shift|blue.?shift|big bang|universe|galax','Universe and galaxies'),(r'comet|oort|asteroid|solar system|nebula theory|exoplanet','Solar System and exoplanets'),(r'star|sun|fusion|h–r|h-r|spectrum|plasma','Stars and stellar evolution')]}
 for pat,label in patterns[st]:
  if re.search(pat,t):return label
 return st
exec(Path('work/answer_diagrams.py').read_text().replace('from build import svg,EXTRA',''),globals())
rows=json.loads(Path('work/parsed.json').read_text());banks={};index=[];audit=[]
for raw in rows:
 key=raw['key'];slug=key.split('-')[0];text=clean(re.sub(r'^Section C.*?Comprehension[^\n]*\n', '', raw['text']) if key=='sem1-D1' else raw['text']);mcq=key in MC
 if not mcq and key not in SOL:raise ValueError('Missing solution '+key)
 options=[]
 if mcq:
  parts=list(re.finditer(r'(?<![A-Za-z])\(?([a-e])\)\s*',text))
  if parts:
   stem=text[:parts[0].start()].strip()
   found={m.group(1):text[m.end():(parts[i+1].start() if i+1<len(parts) else len(text))].strip() for i,m in enumerate(parts)}
   options=[re.sub(r'\s+',' ',found.get(c,'')) for c in 'abcde' if c in found]
  else:stem=text
  options=FIX_OPTIONS.get(key,options)
  if len(options) not in range(2,9):raise ValueError((key,'bad choices',options))
  text=OV.get(key,stem);letter,ex=MC[key];marks=1;kind='Multiple choice';correct=ord(letter)-65
  if not 0<=correct<len(options):raise ValueError((key,'answer out of range'))
 else:marks,ex,kind=SOL[key];text=OV.get(key,text)
 text=text.replace('1000 N accelerates','1000 kg accelerates')
 if key=='sem2-B12':ex=ex.replace('He lacks','Person 6 lacks').replace('he must','this person must')
 body=paras(text)
 for fig in FIG.get(key,[]):body+=f'<figure><img src="{ASSET+fig}.png" alt="{escape(fig.replace("-"," "))}" loading="lazy"></figure>'
 section=raw['section'];number=str(raw['number'])+(' (map)' if key.endswith('x') else '')
 if slug=='earth' and section.startswith('Ext'):number='Extension '+number
 source=f'Applecross Year 10 {LABEL[slug]} '+('2015' if slug=='earth' else '2017')
 st=strand(key,text);sub=subtopic(st,text)
 bank=f'practice-studio-science-year10-{slug}.json'
 answer='<h3>Worked solution</h3>'+paras(ex)+EXTRA.get(key,'')
 answer+='<h3>Marking guidance</h3><p>'+('Award 1 mark for '+letter+'. Use the explanation above to check the reasoning.' if mcq else 'Maximum '+str(marks)+' marks. The part allocations are shown with the worked steps above. Accept scientifically equivalent explanations and valid alternative methods; retain units and appropriate directions in calculations.')+'</p>'
 meta={'id':'science-y10-applecross-'+key,'subject':'Science','area':'Science','year':10,'originalYear':10,'examYear':2015 if slug=='earth' else 2017,'units':'Lower school','number':raw['number'],'sourceQuestionLabel':number,'sourceSection':section,'source':source,'section':('Extension ' if section.startswith('Ext') else '')+('Multiple choice' if mcq else kind),'types':[kind],'responseTypes':[kind],'marks':marks,'marksOrigin':'Question part allocations in supplied assessment','topics':[st],'subtopics':[sub],'strand':st,'difficulty':'Hard' if marks>=6 or section.startswith('Ext') else 'Medium' if marks>=2 else 'Easy','mixed':False,'text':re.sub(r'\s+',' ',text),'hash':hashlib.sha256((re.sub(r'\s+',' ',text).lower()+'|'+ '|'.join(options)).encode()).hexdigest(),'sourceFile':FILES[slug],'sourceKeyFile':KEYS[slug],'solutionOrigin':'supplied-key-checked-and-expanded-with-independent-working','figures':len(FIG.get(key,[])),'bankFile':bank,'addedAt':'2026-11-12T00:00:00Z','markingMode':'automatic' if mcq else 'manual','fontFamily':'Arial','fontSizePt':12,'responseLines':0,'html':body,'answerHtml':answer,'markingKeyPoints':[]}
 if mcq:meta.update(options=options,optionsHtml=['<p>'+escape(o)+'</p>' for o in options],correctAnswer=correct)
 if key in NOTES:meta['editorialNote']=NOTES[key]
 banks.setdefault(bank,[]).append(meta);index.append({k:v for k,v in meta.items() if k not in ['html','answerHtml','optionsHtml','markingKeyPoints']});audit.append({'id':meta['id'],'sourceLabel':key,'marks':marks,'type':kind,'sourceFile':FILES[slug],'correction':NOTES.get(key,'')})
for path,items in banks.items():(OUT/path).write_text(json.dumps(items,ensure_ascii=False,indent=2))
(OUT/'practice-studio-science-year10-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=2))
report={'importDate':'2026-11-12','assessmentDocuments':7,'markingKeyDocuments':7,'questionEntries':len(index),'questionsByPaper':{k:len(v) for k,v in banks.items()},'totalMarksByPaper':{k:sum(q['marks'] for q in v) for k,v in banks.items()},'corrections':[x for x in audit if x['correction']],'questions':audit}
(OUT/'practice-studio-science-year10-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in report.items() if k not in ['questions','corrections']},indent=2))
