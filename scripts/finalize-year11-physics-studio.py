from pathlib import Path
from urllib.parse import quote
import json,re,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'physics-year11-work/output'
TAGS={
 'K':('Thermal physics','Kinetic particle model'),'H':('Thermal physics','Heating and phase changes'),'T':('Thermal physics','Heat transfer'),'Z':('Thermal physics','Temperature scales'),'X':('Thermal physics','Thermal expansion'),
 'N':('Nuclear physics','Nuclear reactions and binding energy'),'R':('Nuclear physics','Radioactivity and half-life'),'D':('Nuclear physics','Radiation dose and safety'),
 'E':('Electricity','Circuits and electrical measurements'),'P':('Electricity','Electrical energy and power'),'C':('Electricity','Electric charge and forces'),'S':('Electricity','Electrical safety'),
 'M':('Motion and forces','Kinematics and motion graphs'),'F':('Motion and forces','Forces and Newton’s laws'),'I':('Motion and forces','Momentum and impulse'),'W':('Motion and forces','Work energy and power'),
 'V':('Waves','Wave properties and behaviour'),'A':('Waves','Sound and intensity'),'O':('Waves','Standing waves and resonance'),'U':('Mixed topics','Units and conversions')}
MAP={
 '2020-u1':'KH N T H E RD R H P E HP E N T E H ND TP R',
 '2021-u1':'H D E H E D H N E T HP H RD E N S N TH',
 '2021-u12':'K D P W A V F S CP O T E R H N E IW N V O FM',
 '2022-u1':'K D P H D S H N E T R E H N E R TP ZK C',
 '2022-u12':'S I WF V O H C R W F A H H H E N M M RD R AV',
 '2023-u1':'C N PS T E S N H H E N E H E RN X CR D HT',
 '2023-u12':'V O H E O T W F D R E M R H O E FM E M O TP N',
 '2024-u1':'H E N U E PC T H E TH C N SP N R E T HP HP XTP',
 '2024-u12':'R V H M T V E I H W I M O HT M N EP CF TZ RD'}
allq=[];total_figures=0
for f in sorted(OUT.glob('practice-studio-physics-*-u*.json')):
 batch=json.loads(f.read_text());slug=re.search(r'physics-(.*)\.json',f.name)[1];mapping=MAP[slug].split()
 for q in batch:
  codes=mapping[q['number']-1];pairs=[TAGS[c] for c in codes];q['topics']=list(dict.fromkeys(p[0] for p in pairs));q['subtopics']=list(dict.fromkeys(p[1] for p in pairs));q['mixed']=len(q['subtopics'])>1
  if re.search(r'circle (?:your|the|one)|multiple.choice|which.*below',q['text'],re.I) and 'Multiple choice' not in q['types']:q['types'].append('Multiple choice')
  # The full source remains available when a Word-only annotation is needed.
  rel='exams/ATAR/Physics/11/'+str(q['examYear'])+'/'+q['sourceKeyFile'];url='https://github.com/science-vault/science-vault-wa/raw/refs/heads/main/'+quote(rel,safe='/')
  q['answerHtml']='<p><a href="'+url+'" target="_blank" rel="noopener">Download original Word marking guide, including diagram layouts ↗</a></p>'+q['answerHtml']
  q['sourceKeyUrl']=url
  q['text']=re.sub(r'\s+',' ',q['text']).strip()
  total_figures+=q['figures']
 f.write_text(json.dumps(batch,ensure_ascii=False,separators=(',',':')));allq+=batch
index=[{k:v for k,v in q.items() if k not in ['html','answerHtml']} for q in allq]
(OUT/'practice-studio-physics-year11-index.json').write_text(json.dumps(index,ensure_ascii=False,separators=(',',':')))
report=json.loads((OUT/'practice-studio-year11-report.json').read_text());report['topicMapping']='Reviewed question-by-question';report['questionFigures']=total_figures;report['markingMode']='Written answers and grouped questions are self-reviewed against the marking guide.';report['sourceDiagramFallback']='Full original Word marking guides are linked for source diagrams and annotations.'
(OUT/'practice-studio-year11-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
assert len(allq)==len({q['id'] for q in allq})==len({q['hash'] for q in allq})
print(json.dumps({'questions':len(allq),'examFiles':len(MAP),'figures':total_figures,'held':report['held'],'topics':sorted({t for q in allq for t in q['topics']})}))
