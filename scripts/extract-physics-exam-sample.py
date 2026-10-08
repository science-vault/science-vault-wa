from pathlib import Path
import fitz,re,json,html
from PIL import Image,ImageOps,ImageDraw,ImageChops
ROOT=Path(__file__).resolve().parents[1]
ASSET=ROOT/'assets/physics-exam-import/sample-2024'
ASSET.mkdir(parents=True,exist_ok=True)
import argparse
parser=argparse.ArgumentParser(description='Extract the audited 2024 Physics pilot from rendered source PDFs.')
parser.add_argument('sample_directory',type=Path,help='Directory containing rendered/year11-paper.pdf, year11-key.pdf, year12-paper.pdf, year12-key.pdf')
SAMPLE=parser.parse_args().sample_directory.resolve()

def lines(page):
 return [( ''.join(s['text'] for s in l['spans']).strip(),fitz.Rect(l['bbox'])) for b in page.get_text('dict')['blocks'] for l in b.get('lines',[])]
def split(stem,count):
 doc=fitz.open(SAMPLE/'rendered'/f'{stem}.pdf'); starts=[]; expected=1;stop=None
 for pi,p in enumerate(doc):
  ls=lines(p)
  for t,box in ls:
   m=re.fullmatch(r'Question\s+(\d+)',t)
   if m and int(m[1])==expected and expected<=count:
    marks=[re.search(r'\((\d+)\s*marks?\)',t2) for t2,b in ls if abs(b.y0-box.y0)<8]
    marks=[int(m[1]) for m in marks if m]
    if not marks:continue
    starts.append((pi,box.y0-3,expected,marks[0]));expected+=1
   if len(starts)==count and t.lower() in ['end of questions','end of examination'] and stop is None:stop=(pi,box.y0)
 assert len(starts)==count,(stem,len(starts))
 if stop is None: stop=(len(doc)-1,doc[-1].rect.height-48)
 out=[]
 for idx,(sp,sy,num,marks) in enumerate(starts):
  ep,ey=starts[idx+1][:2] if idx+1<len(starts) else stop
  paths=[];text=[];coords=[]
  for pi in range(sp,ep+1):
   p=doc[pi];top=sy if pi==sp else 54;bottom=ey-4 if pi==ep else p.rect.height-48
   # Do not assign the following section instructions to the previous question.
   for t,b in lines(p):
    if top<b.y0<bottom and re.match(r'^Section\s+(?:Two|Three|2|3)\b',t,re.I):bottom=b.y0-5
   if bottom<=top+5:continue
   rect=fitz.Rect(34,top,p.rect.width-34,bottom)
   txt=p.get_text(clip=rect)
   if not txt.strip() and not p.get_images():continue
   name=f'{stem}-q{num:02d}-{len(paths)+1:02d}.webp';path=ASSET/name
   pix=p.get_pixmap(matrix=fitz.Matrix(2,2),clip=rect,alpha=False)
   im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
   mask=ImageChops.difference(im,Image.new('RGB',im.size,'white')).convert('L').point(lambda v:255 if v>35 else 0)
   ink=mask.getbbox()
   if ink is None or ink[3]-ink[1]<8:continue
   im=im.crop((0,max(0,ink[1]-8),im.width,min(im.height,ink[3]+8)));im.save(path,'WEBP',lossless=True,method=6)
   paths.append(str(path.relative_to(ROOT)));text.append(txt);coords.append({'page':pi+1,'rect':list(rect)})
  out.append({'number':num,'marks':marks,'images':paths,'text':'\n'.join(text),'sourcePages':coords})
 return out

def images(q,label):
 return ''.join(f'<img src="{p}" alt="{html.escape(label)} section {i+1}" loading="lazy" style="display:block;max-width:100%;height:auto;margin:12px auto;page-break-inside:avoid">' for i,p in enumerate(q['images']))
for old in ASSET.glob('*.webp'):old.unlink()
TOPICS={11:['Thermal energy and phase changes','Resistance and resistivity','Nuclear fusion and mass defect','Units and conversions','DC circuits','Charge and electrical energy','Heat transfer','Specific heat capacity and latent heat','DC circuits','Convection and sea breezes','Electrostatics','Binding energy and radioactive decay','Electrical safety','Nuclear fission','Radioactive decay and radiation dose','DC circuits','Heat transfer and temperature','Thermal energy and efficiency','Specific heat capacity investigation','Electrical heating and thermal expansion'],12:['Projectile motion','Inclined planes and friction','Motional EMF','Projectile motion','Torque and equilibrium','Circular motion','Electromagnetic induction','Power transmission','DC motors','Electric fields and Coulomb law','Banked circular motion','Circular motion and energy','Transformers','Charged particles in magnetic fields','Gravitation and orbital motion','Projectile motion','Torque and equilibrium','Magnetic fields of current-carrying wires','AC generators','Artificial gravity and circular motion','Millikan oil drop experiment']}
records=[];manifest=[]
for year,count in [(11,20),(12,21)]:
 paper=split(f'year{year}-paper',count);keys=split(f'year{year}-key',count)
 source=f'exams/ATAR/Physics/11/2024/2024_physics_unit_1_exam.docx' if year==11 else 'exams/ATAR/Physics/12/WACE/2024/2024_physics_units_3_exam.docx'
 keysource='exams/ATAR/Physics/11/2024/2024_physics_unit_1_marking_guide.docx' if year==11 else 'exams/ATAR/Physics/12/WACE/2024/2024_physics_units_3_marking_guide (1).docx'
 for q,k in zip(paper,keys):
  assert (q['number'],q['marks'])==(k['number'],k['marks'])
  label=f'2024 Physics Year {year} Unit {1 if year==11 else 3} Question {q["number"]}'
  records.append({'id':f'PHY-REPO-2024-Y{year}-U{1 if year==11 else 3}-Q{q["number"]:02d}','area':'Science','course':'Physics','pathway':'ATAR','year':year,'unit':f'Unit {1 if year==11 else 3} (2024 source)','syllabusVersion':'source-2024','topic':TOPICS[year][q['number']-1],'type':('Short Response' if q['number']<=11 else 'Comprehension' if q['number']>=(19 if year==11 else 20) else 'Problem Solving'),'difficulty':'Unclassified','marks':q['marks'],'question':f'<p><strong>{label}</strong></p>'+images(q,label),'answer':images(k,label+' marking guide'),'searchText':q['text'],'sourceFile':source,'sourceKeyFile':keysource,'sourceQuestionNumber':q['number'],'examYear':2024,'sourcePublisher':'West Australian Test Papers','importBatch':'physics-sample-2024','markingMode':'manual','responseLines':0,'parts':[],'reviewStatus':'Source question and total marks checked; structured subpart extraction pending','sourceSyllabusYear':2024})
  manifest.append({'id':records[-1]['id'],'paper':q,'markingGuide':k})
script="""// Source exam sample: rendered question and marking-guide sections.
// Permission to publish supplied by repository owner; manual marking only.
(function(){
const bank=window.UpperSchoolQuestionBank=window.UpperSchoolQuestionBank||[];
const seen=new Set(bank.map(q=>q.id));
const records="""+json.dumps(records,ensure_ascii=False,separators=(',',':'))+""";
for(const q of records)if(!seen.has(q.id)){bank.push(q);seen.add(q.id)}
if(window.UpperSchoolSyllabusVersions){for(const year of [11,12]){const k='Science|Physics|ATAR|'+year;const versions=window.UpperSchoolSyllabusVersions[k]||(window.UpperSchoolSyllabusVersions[k]=[{id:'current',label:'Current SCSA syllabus',applicable2026:true}]);if(!versions.some(v=>v.id==='source-2024'))versions.push({id:'source-2024',label:'2024 source exams (historical syllabus)'});}}
})();
"""
(ROOT/'upper-school-assessment-bank-physics-repository-sample.js').write_text(script)
(SAMPLE/'extraction-manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
paths=sorted(ASSET.glob('*.webp'));qa=SAMPLE/'qa';qa.mkdir(exist_ok=True)
for old in qa.glob('*.png'):old.unlink()
for offset in range(0,len(paths),12):
 sheet=Image.new('RGB',(1600,1530),'#dbe2e8');draw=ImageDraw.Draw(sheet)
 for j,p in enumerate(paths[offset:offset+12]):
  im=Image.open(p);im.thumbnail((390,470));x=(j%4)*400+5;y=(j//4)*510+30
  sheet.paste(im,(x,y));draw.text((x,y-20),p.stem,fill='black')
 sheet.save(qa/f'contact-{offset//12+1:02d}.png')
print(json.dumps({'questions':len(records),'image_sections':len(paths),'total_asset_bytes':sum(p.stat().st_size for p in paths),'qa_sheets':len(list(qa.glob('*.png')))}))
