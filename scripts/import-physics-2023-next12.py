"""Reviewed first twelve questions only; run from repository with working files.

Work folder requires rendered/paper.pdf (from repaired temporary copy) and
key.html (Pandoc --mathml). Prepare the copy with repair-physics-2023-render-copy.py.
Original source key DOCX fails direct LibreOffice rendering; use HTML mark tables.
"""
import importlib.util, json, re, sys
from pathlib import Path
from lxml import html
import fitz

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('source_import', ROOT/'scripts/import-physics-source-pairs.py')
imp = importlib.util.module_from_spec(spec); spec.loader.exec_module(imp)
work = Path(sys.argv[1]); batch = 'batch-2023-u1-next12'
assets = ROOT/'assets/physics/exam-import'/batch; assets.mkdir(parents=True,exist_ok=True)
paper = fitz.open(work/'rendered/paper.pdf'); questions = imp.boundaries(paper,19)
key = html.fromstring((work/'key.html').read_text(encoding='utf8'))
headings = {}
for node in key.xpath('//p'):
    match = re.fullmatch(r'Question\s+(\d+)\s*\((\d+) marks?\)', ' '.join(''.join(node.itertext()).split()))
    if match: headings[int(match[1])] = (node,int(match[2]))
assert sorted(headings) == list(range(1,20))
topics = ['Electrostatic charges','Nuclear fission and mass defect','Electrical power and circuit protection','Thermal insulation','Series and parallel resistance','Residual current devices','Nuclear reactor control','Specific heat capacity','Condensation','Variable resistance and fuel gauges','Nuclear fusion and energy','Non-ohmic conductors and electrical energy']
records=[]; images=set(); report=[]
for q in questions[:12]:
    number=q['number']; heading,marks=headings[number]; assert marks==q['marks']
    identifier=f'PHY-REPO-2023-Y11-U1-Q{number:02d}'
    body,searchable,pages=imp.content(paper,q,identifier+'-q',assets,images)
    if number==3:
        body='<div class="source-text-question"><p><strong>Source circuit supply:</strong> 240 V DC; safety switch rated 15 A.</p></div>'+body
    parts=[]; node=heading.getnext(); next_heading=headings[number+1][0]
    while node is not None and node is not next_heading:
        text=' '.join(''.join(node.itertext()).split())
        if not text.startswith(('Section Two:', 'This section has')):
            parts.append(html.tostring(node,encoding='unicode'))
        node=node.getnext()
    answer='<div class="source-text-question">'+''.join(parts)+'</div>'
    assert '<table' in answer
    if number in [2,3,5,8,11,12]: assert '<math' in answer
    assert '<img' not in answer # the first twelve source key sections have no raster figures
    rubric=[]
    for table in html.fromstring(answer).xpath('//table'):
        total=0
        for row in table.xpath('.//tr'):
            cells=row.xpath('./td|./th')
            if len(cells)>1:
                label=' '.join(''.join(cells[-1].itertext()).split())
                match=re.fullmatch(r'(\d+)(?:[-–](\d+))? marks?',label)
                if match:total+=int(match[2] or match[1])
                elif number==12 and label=='mark':total+=1
        rubric.append(total)
    assert (rubric[0] if number==1 else sum(rubric))==marks
    if number==12:
        note='The source guide labels the final step in part (d) as “mark” without a number. It is interpreted as 1 mark, consistent with the three steps and the stated 3-mark part total.'
        answer='<p class="source-marking-note"><strong>Marking note:</strong> '+note+'</p>'+answer
    if number==9:
        stimulus='An ice cube at −1.30 °C was placed into a 155 g glass containing 105 g of water at 45.0 °C. After one minute the ice had melted; the final water mass was 125 g and its temperature was 31.3 °C.'
        body='<div class="source-text-question"><p><strong>Shared setup from source Question 8:</strong> '+stimulus+'</p></div>'+body
        searchable=stimulus+'\n'+searchable
    records.append(dict(id=identifier,area='Science',course='Physics',pathway='ATAR',year=11,unit='Unit 1 (2023 source)',syllabusVersion='source-2023',topic=topics[number-1],type=q['type'],difficulty='Unclassified',marks=marks,question=body,answer=answer,searchText=searchable,sourceFile='exams/ATAR/Physics/11/2023/2023_physics_unit_1_exam.docx',sourceKeyFile='exams/ATAR/Physics/11/2023/2023_physics_unit_1_marking_guide.docx',sourceQuestionNumber=number,sourcePages=pages,examYear=2023,sourceSyllabusYear=2023,sourcePublisher='West Australian Test Papers',importBatch=batch,addedAt='2026-10-09T02:36:00Z',markingMode='manual',responseLines=0,parts=[],questionFormat='selectable-source-svg',reviewStatus='Paper/key totals checked; source figures retained; marking tables and MathML from source DOCX; current syllabus alignment pending'))
    if number==9:records[-1]['sharedStimulusSourceQuestionNumber']=8
    if number==3:records[-1]['renderingNote']='Circuit voltage repeated in selectable text because restored Word shapes obscure part of its original label.'
    if number==12:records[-1]['markingNote']=note
    report.append(dict(id=identifier,marks=marks,pages=pages,keyText=' '.join(''.join(html.fromstring(answer).itertext()).split())))
script='''// Twelve reviewed 2023 source questions; manual marking and historical syllabus.
(function(){const bank=window.UpperSchoolQuestionBank=window.UpperSchoolQuestionBank||[];
const seen=new Set(bank.map(q=>q.id));const records='''+json.dumps(records,ensure_ascii=False,separators=(',',':'))+''';
for(const q of records)if(!seen.has(q.id)){bank.push(q);seen.add(q.id)}
if(window.UpperSchoolSyllabusVersions){const key='Science|Physics|ATAR|11';const versions=window.UpperSchoolSyllabusVersions[key]||(window.UpperSchoolSyllabusVersions[key]=[{id:'current',label:'Current SCSA syllabus',applicable2026:true}]);if(!versions.some(v=>v.id==='source-2023'))versions.push({id:'source-2023',label:'2023 source exams (historical syllabus)'})}
})();
'''
(ROOT/'upper-school-assessment-bank-physics-repository-2023-next12.js').write_text(script)
(work/'next12-report.json').write_text(json.dumps(dict(records=report,images=sorted(images)),indent=2))
print(json.dumps(dict(questions=len(records),marks=sum(q['marks'] for q in records),images=len(images))))
