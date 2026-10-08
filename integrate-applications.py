"""Add Applications without changing existing course content."""
from pathlib import Path
import json
ROOT=Path(__file__).parent
course=ROOT.joinpath('applications-atar-course.js').read_text()
modules=json.loads(course[course.index('= ')+2:].rstrip(';\n'))
n=len(modules);counts={y:sum(m['year']==y for m in modules)for y in ['11','12']};screens=sum(len(m['screens'])for m in modules);tasks=sum(len(m['questions'])for m in modules)
config={'years':['11','12'],'units':{y:list(dict.fromkeys(m['unit']for m in modules if m['year']==y))for y in ['11','12']}}
hub=ROOT.joinpath('topic-hub.html').read_text()
if "'Mathematics Applications ATAR':" not in hub:
    hub=hub.replace('const CONFIG={',"const CONFIG={'Mathematics Applications ATAR':"+json.dumps(config,ensure_ascii=False)+',',1)
    hub=hub.replace("if(['Mathematics Methods ATAR'","if(['Mathematics Applications ATAR','Mathematics Methods ATAR'",1)
    hub=hub.replace("{'Mathematics Methods ATAR':'MethodsATARPlayer'","{'Mathematics Applications ATAR':'ApplicationsATARPlayer','Mathematics Methods ATAR':'MethodsATARPlayer'")
    branch="if(c==='Mathematics Applications ATAR'){const list=(window.ApplicationsATAR||[]).filter(m=>m.year===y&&m.unit===u);seniorRender(list,openApplicationsTopic,u);return}"
    hub=hub.replace("if(c==='Mathematics Methods ATAR'){",branch+"if(c==='Mathematics Methods ATAR'){",1)
    start=hub.index('function openMethodsTopic(t)');end=hub.index('function openSpecialistTopic(t)',start)
    fn=hub[start:end].replace('openMethodsTopic','openApplicationsTopic').replace('MethodsATARPlayer','ApplicationsATARPlayer')
    hub=hub[:start]+fn+hub[start:]
    tags='<link rel="stylesheet" href="applications-atar.css?v=2026.123">'+''.join(f'<script src="{f}?v=2026.123"></script>'for f in ['applications-visuals.js','applications-interactives.js','applications-atar-course.js','applications-atar-player.js'])
    hub=hub.replace('<link rel="stylesheet" href="methods-atar.css',tags+'<link rel="stylesheet" href="methods-atar.css',1)
ROOT.joinpath('topic-hub.html').write_text(hub)
landing=ROOT.joinpath('mathematics-methods.html').read_text()
landing=landing.replace('Methods','Applications').replace('methods','applications')
landing=landing.replace('81 focused lessons · 41 explained models and graphs · 509 written tasks, including 162 worked examples and 23 longer exam tasks.',f'{n} focused lessons · 30 explained models and diagrams · {tasks} written tasks, including {2*n} worked examples and 11 additional mixed tasks.')
landing=landing.replace('39 focused lessons',f'{counts["11"]} focused lessons').replace('42 focused lessons',f'{counts["12"]} focused lessons')
landing=landing.replace('Read the theory, study the diagrams, then attempt the questions before revealing their step-by-step solutions. Explore repeated samples, confidence intervals and rectangle area approximations.','Read the theory, study the diagrams, then attempt written questions before revealing step-by-step solutions. Explore normal intervals, regression, recurrences, repayment timing and complete assignments.')
oldunits=['Unit 1 – Functions, probability and trigonometry','Unit 2 – Exponentials, sequences and calculus','Unit 3 – Calculus and discrete probability','Unit 4 – Logarithms, continuous probability and inference']
for old,new in zip(oldunits,config['units']['11']+config['units']['12']):landing=landing.replace(old,new)
landing=landing.replace('Applications develops algebra, functions, calculus, probability and statistical inference.','Applications develops consumer arithmetic, measurement, trigonometry, statistics, finance and network decisions.')
landing=landing.replace('Year 12 syllabus for teaching from 2026','Year 12 syllabus for teaching from 2025 (current for 2026)')
landing=landing.replace('METHODS-ATAR-LESSONS.md','APPLICATIONS-ATAR-LESSONS.md')
ROOT.joinpath('mathematics-applications.html').write_text(landing)
path=ROOT.joinpath('topic-hubs.html');s=path.read_text()
if 'mathematics-applications.html' not in s:
    tile=f'<section class="hub"><span class="eyebrow">ATAR MATHEMATICS</span><h2>Mathematics Applications</h2><p>Build practical mathematical reasoning with detailed theory, explained diagrams, step-by-step examples and written practice.</p><div class="actions"><a class="action primary" href="mathematics-applications.html"><strong>Open Mathematics Applications</strong><small>{counts["11"]} Year 11 lessons · {counts["12"]} Year 12 lessons</small></a></div></section>'
    marker='<section class="hub"><span class="eyebrow">ATAR MATHEMATICS</span>'
    assert marker in s;s=s.replace(marker,tile+marker,1);path.write_text(s)
doc=f'''# Mathematics Applications ATAR: lessons and coverage

Checked 8 October 2026. Original student learning material with suggested self-review marking points, not official examination questions or keys.

- {counts['11']} Year 11 lessons and {counts['12']} Year 12 lessons.
- {screens} screens, {tasks} written tasks: {2*n} worked examples and {tasks-2*n} independent tasks.
- Four focused theory screens in each lesson; 30 named SVG teaching examples with explanatory captions.
- Interactive normal intervals, regression and residuals, recurrence timing, loan/withdrawal timing and exhaustive small assignments.
- One formative concept question per lesson. The mastery view repeats that question; it does not replace written assessment.

## Syllabus sources and scope

[Official SCSA Applications page](https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/mathematics/mathematics-applications)

[Year 11, teaching from 2026](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0007/1232188/Mathematics-Applications-ATAR-Year-11-Syllabus-for-teaching-from-2026.PDF) and [current Year 12, teaching from 2025](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0009/1121310/Mathematics-Applications-ATAR-Year-12-Syllabus-for-teaching-from-January-2025_pdf.PDF) were checked for the numbered content map below. [Published Year 12 for 2027](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0018/1262133/Mathematics-Applications-ATAR-Year-12-Syllabus-for-teaching-from-2027.PDF) has the same 65 numbered content IDs and topic structure. All 49 Year 11 and 65 Year 12 IDs have mapped lessons. This mapping is a content index, not external accreditation of the resources.

## Learning and marking conventions

Questions are original and use supplied fictional financial data. Exact expressions in π are retained in geometry where useful. Histograms distinguish frequency from density with unequal bin widths. Small-data quartiles use median-of-halves, excluding the centre for odd samples; population and sample SD are distinguished. Normal displays use SD inputs and label standardisation. Regression predicts the stated response and uses residual = observed − predicted.

Sequences state initial indexing and keep discrete thresholds. Finance specifies nominal or effective rate, payment timing, and final partial payments. Interest is calculated at full precision unless a task explicitly specifies posted rounding. Loan and withdrawal models stop at exhaustion rather than continue into negative balances. Activity-on-node diagrams label durations at nodes; forward scanning uses maxima, backward scanning minima. Shared float is not treated as independent spare time. Maximum-flow solutions show a feasible flow and matching cut; Hungarian totals are recovered from original costs.

Written drafts and self-assessed marks save on the current browser. They are not teacher-verified grades. Existing tracking hooks remain; no central account or class-report system is added. Study diagrams use their own named example data; task data are authoritative for each calculation. Students draw requested graphs and models on paper.

## Rebuild and checks

Run `python build-applications.py`, `python build-applications-visuals.py`, then `python integrate-applications.py`. Run `node applications-atar-check.cjs` for structural and numeric-model checks. The build files are retained so content can be edited and regenerated. Verification details are recorded with the implementation commit.

## Lesson map

| Year | Unit | Lesson | SCSA IDs | Screens | Tasks |
|---|---|---|---|---:|---:|
'''
for m in modules:doc+=f'| {m["year"]} | {m["unit"].split(" – ")[0]} | {m["title"]} | {", ".join(m["outcomes"])} | {len(m["screens"])} | {len(m["questions"])} |\n'
ROOT.joinpath('APPLICATIONS-ATAR-LESSONS.md').write_text(doc)
print({'course':n,'screens':screens,'tasks':tasks,'hubIntegrated':True})
