"""Idempotent PE course navigation, landing page and authored coverage index."""
from pathlib import Path
import json,re
from html import escape
R=Path(__file__).parent;s=R.joinpath('pe-atar-course.js').read_text();ms=json.loads(s.split(' = ',1)[1].rstrip(';\n'));course='Physical Education Studies ATAR'
config={'years':['11','12'],'units':{y:list(dict.fromkeys(m['unit']for m in ms if m['year']==y))for y in ['11','12']}}
hub=R.joinpath('topic-hub.html').read_text()
if "'Physical Education Studies ATAR':"not in hub:
 hub=hub.replace('const CONFIG={',"const CONFIG={'Physical Education Studies ATAR':"+json.dumps(config,ensure_ascii=False)+',',1)
 hub=hub.replace("if(['English ATAR'","if(['Physical Education Studies ATAR','English ATAR'",1)
 hub=hub.replace("{'English ATAR':'EnglishATARPlayer'","{'Physical Education Studies ATAR':'PEATARPlayer','English ATAR':'EnglishATARPlayer'")
 hub=hub.replace("if(c==='English ATAR'){","if(c==='Physical Education Studies ATAR'){const list=(window.PEATAR||[]).filter(m=>m.year===y&&m.unit===u);seniorRender(list,openPETopic,u);return}if(c==='English ATAR'){",1)
 start=hub.index('function openApplicationsTopic(t)');end=hub.index('function openMethodsTopic(t)',start)
 hub=hub[:start]+hub[start:end].replace('openApplicationsTopic','openPETopic').replace('ApplicationsATARPlayer','PEATARPlayer')+hub[start:]
 tags='<link rel="stylesheet" href="pe-atar.css?v=2026.125">'+''.join(f'<script src="{f}?v=2026.125"></script>'for f in ['pe-visuals.js','pe-interactives.js','pe-atar-course.js','pe-atar-player.js'])
 hub=hub.replace('<link rel="stylesheet" href="english-atar.css',tags+'<link rel="stylesheet" href="english-atar.css',1)
R.joinpath('topic-hub.html').write_text(hub)
s=R.joinpath('topic-hubs.html').read_text()
if 'physical-education-studies.html'not in s:
 marker='<section class="hub"><span class="eyebrow">ATAR ENGLISH</span>'
 assert marker in s
 s=s.replace(marker,'<section class="hub"><span class="eyebrow">ATAR PHYSICAL EDUCATION</span><h2>Physical Education Studies ATAR</h2><p>Explain movement, analyse performance and connect sport science with coaching and tactics. Explore labelled models, worked cases and original written practice.</p><div class="actions"><a class="action primary" href="physical-education-studies.html"><strong>Open PE Studies ATAR</strong><small>32 Year 11 lessons · 34 Year 12 lessons</small></a></div></section>'+marker,1)
R.joinpath('topic-hubs.html').write_text(s)
base=R.joinpath('english-atar.html').read_text();style=base[base.index('<style>'):base.index('</style>')+8].replace('#684491','#21644d').replace('#302447','#183d35')
landing='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PE Studies ATAR | Learning Vault WA</title><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="home.css">'+style+'</head><body><header class="topbar"><a class="brand" href="index.html"><span class="brand-mark">LV</span><span><strong>Learning Vault WA</strong><small>Physical Education Studies ATAR</small></span></a><nav><a href="index.html">Home</a><a href="topic-hubs.html">Topic Hubs</a><a href="exams.html">Exam Vault</a></nav></header><main class="wrap"><section class="hero"><span class="eyebrow">YEARS 11 &amp; 12 · ATAR</span><h1>Understand movement.<br>Explain performance.</h1><p>66 focused lessons · 888 screens · 210 written tasks · 45 labelled vector models.</p><p>Build connections across anatomy, exercise physiology, biomechanics, motor learning, sport psychology and tactics. Explore ideal calculations, study worked cases and develop evidence-based sporting explanations.</p></section><section class="grid">'
for y in ['11','12']:
 n=sum(m['year']==y for m in ms)
 landing+=f'<article class="card"><h2>Year {y}</h2><p>{n} focused lessons</p><ul>'+''.join('<li>'+escape(u)+'</li>'for u in config['units'][y])+f'</ul><a class="button" href="topic-hub.html?course=Physical+Education+Studies+ATAR&amp;year={y}">Choose Year {y} lessons →</a></article>'
landing+='</section><section class="note"><h2>From principles to sporting explanations</h2><p>Every lesson includes four focused explanations, a labelled model, an attempt-first worked case, independent practice and transfer to your school’s selected sport. Calculation tools explore cardiac output, impulse, torque and ideal projectile flight; an evidence planner helps structure applied answers.</p><p>Year 12 includes an original rehearsal with 20 multiple-choice questions, eight short-answer cases and four extended options. Models and suggested points are teaching examples, not an official paper or marking key. Short lesson checks are separate from the rehearsal.</p><p>Practical performance requires your teacher-managed programme and actual school-based practical external assessment. Browser progress and written self-review do not assess competitive skill execution. Plans and typed drafts save on this browser.</p><p>Checked against the Year 11 syllabus for teaching from 2026 and the current Year 12 syllabus for teaching from 2025. Topic headings are authored teaching labels. Use the version and actual instructions for your cohort.</p><p><a href="https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/health-and-physical-education/physical-education-studies" target="_blank" rel="noopener">Official SCSA PE Studies resources</a> · <a href="PE-STUDIES-ATAR-LESSONS.md">Coverage, sources and practice guide</a></p></section></main><script src="portal-nav.js"></script></body></html>'
R.joinpath('physical-education-studies.html').write_text(landing)
doc='''# Physical Education Studies ATAR: coverage and practice guide

Checked 8 October 2026. Original explanations, diagrams, invented cases and suggested answers; not an official SCSA course endorsement, paper or marking key.

66 lessons: 32 Year 11 and 34 Year 12. 888 screens and 210 written tasks: 66 worked cases, 66 independent short-answer tasks, 66 sport-context transfer tasks, eight rehearsal short-answer cases and four extended rehearsal options. Each lesson has four focused explanations. 45 accessible original SVG models include scientific schematics and labelled concept maps. Four ideal calculation workbenches and an evidence planner support exploration.

## Source scope

[Official SCSA course page](https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/health-and-physical-education/physical-education-studies)

- [Year 11 syllabus for 2026](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0010/1231786/Physical-Education-Studies-ATAR-Year-11-Syllabus-for-teaching-from-2026.PDF)
- [Current Year 12 syllabus for 2025](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0007/1089214/Physical-Education-Studies-ATAR-Year-12-Syllabus-for-teaching-from-January-2025pdf.PDF)
- The course page also provides the published 2027 syllabus and current practical assessment support; check the applicable cohort version.
- [AIS nutrition and supplement framework](https://www.ausport.gov.au/ais/nutrition/supplements), [hydration education](https://www.ausport.gov.au/ais/nutrition/education-modules/modules/hydration) and [recovery resources](https://www.ausport.gov.au/ais/rest-hub/recovery) inform educational mechanism and risk discussion.
- [Sport Integrity Australia: current prohibited list and explanation](https://www.sportintegrity.gov.au/what-we-do/anti-doping/substance-education/prohibited-list-explained) and [2026 update](https://www.sportintegrity.gov.au/what-we-do/anti-doping/substance-education/2026-prohibited-list). Rules are versioned; check current resources for actual decisions.
- [Muscle contraction and relaxation](https://openstax.org/books/anatomy-and-physiology-2e/pages/10-3-muscle-fiber-contraction-and-relaxation) supports the distinction between calcium regulation and ATP roles; prose and diagrams here are original.
- [Primary human myosin research](https://pubmed.ncbi.nlm.nih.gov/7751403/) supports the distinction between the syllabus IIb label and modern human IIx terminology.

## Curriculum coverage

Teaching unit headings and lesson tags are authored, not official numbered content codes. The six interrelated areas are covered across all units; skill and tactical principles transfer to the school’s selected sport.

| Unit | Coverage | Lessons |
|---|---|---|
| 1 | Listed bones and muscle groups; muscle properties and antagonists; joint actions and attachments; circulation, ventilation and acute/chronic responses; nutrients, overlapping energy systems, fitness components and training methods/principles; space and positioning | 16 |
| 2 | Skill classification, Fitts–Posner stages, cues, processing and feedback; motion, speed/velocity/acceleration, projectile factors, balance, Newton laws and lever classes; motivation, confidence, stress, concentration, arousal and SMARTER goals; integrated skill application | 16 |
| 3 | Muscle/connective-tissue hierarchy, sarcomere and ATP/calcium cycle, force relationships; neuron structure, motor units, recruitment and fibre tendencies; competition nutrition and hydration; heat/cold/altitude, acclimatisation; supplement/doping effects and risks; cycles, season phases, peaking/tapering/recovery/maintenance and overtraining evidence; advanced tactics | 16 |
| 4 | Transfer, qualitative analysis, practice progressions, leadership and evidence tools; impulse, restitution, inertia/angular momentum, third-class torque, balance/segment timing/optimal flight; fluid flow, drag, Bernoulli and Magnus; mental strategies, task/social cohesion and social loafing; exam application | 18 |

## Practice and limits

One worked case per lesson has explicit steps; an independent task supplies its own suggested solution. Sport-context transfer requires a teacher-approved observation or a clearly labelled invented scenario; its guided points cannot verify unseen student performance. An evidence planner saves five reasoning fields locally, with no recordings, backend uploads or automatic assessment.

The rehearsal offers 20 original MCQ, eight short-answer cases and four extended options (choose two). It follows the current section counts but is an authored rehearsal with suggested points, not an exact official-mark total or calibrated paper. Current Year 12 written design: 10 minutes reading, 150 minutes working; sections 20%, 50%, 30% with suggested 30/70/50-minute allocations. The combined written/practical weighting is separate, 70%/30%. School written assessment-type weights are a further separate set; actual instructions take priority.

Year 12 practical is school-based practical (performance) external assessment, with skill execution and tactical application in competitive performance. The current prescribed sports are Australian football, badminton, basketball, cricket, hockey, netball, soccer, tennis, touch football and volleyball. The resource supports principles and written preparation rather than replacing school sport-specific rubrics, coaching, participation or external assessment. The current practical design weights skill execution 35% and tactical application 65%. No competitive performance grade is generated.

Concept banks normally have two checks per lesson; the exam lesson has 20 MCQ. Mastery repeats the bank. Self-awarded practice points are not teacher-verified marks or ATAR predictions. Local storage can be unavailable or cleared; no cross-device sync is claimed.

Numerical inputs are fictional. Tools use ideal conditions: cardiac output cancels units; impulse uses signed momentum and net average force; torque assumes static balance and perpendicular arms, omitting limb weight; flight uses g = 9.81, no drag/spin and a fixed landing level, with axes rescaled per input. Rebound calculations require the stated fixed-surface vertical-flight assumptions. Scientific schematics are not anatomical scale images or measured curves.

Calcium regulates exposed binding sites; ATP supports detachment, cycling and calcium pumping. Sarcomere filaments do not shrink and A-band length stays approximately constant. Energy systems overlap rather than switch on fixed timers. Lactate is not the sole fatigue cause or retained explanation of delayed soreness. Altitude reduces oxygen partial pressure, not oxygen fraction to zero. Arteries are defined by direction. Modern human IIx terminology is acknowledged alongside the syllabus IIb label. These distinctions preserve scientific accuracy within syllabus vocabulary.

Health and nutrition content is general education, not diagnosis, treatment, personal diet/training prescriptions or supplement recommendations. No doses, drug acquisition/administration, deliberate environmental-exposure schedules or unsupervised maximal lifting/aerial/contact instructions are provided. Real activity follows the school’s appropriate programme and support.

## Rebuild

Run `python build-pe.py`, `python integrate-pe.py` and `node pe-atar-check.cjs`. Authored source is in `pe-lessons.py`, `pe-visuals.py` and `pe-exam.py`. Existing English, Applications, Methods and Specialist checks should pass. Integrated DOM checks traverse every screen and exercise task reveals, mastery, all workbenches, invalid inputs and stored/escaped writing. Live rendering is checked separately.

## Lesson index

| Year | Unit | Area | Lesson | Screens | Tasks |
|---|---|---|---|---:|---:|
'''
for m in ms:doc+=f'| {m["year"]} | {m["unit"].split(" – ")[0]} | {m["area"]} | {m["title"]} | {len(m["screens"])} | {len(m["questions"])} |\n'
R.joinpath('PE-STUDIES-ATAR-LESSONS.md').write_text(doc)
print('PE course navigation and landing integrated')
