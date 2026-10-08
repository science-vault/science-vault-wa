"""Integrate English course navigation without replacing existing subjects."""
from pathlib import Path
import json
ROOT=Path(__file__).parent
s=ROOT.joinpath('english-atar-course.js').read_text();modules=json.loads(s[s.index('= ')+2:].rstrip(';\n'))
config={'years':['11','12'],'units':{y:list(dict.fromkeys(m['unit']for m in modules if m['year']==y))for y in ['11','12']}}
hub=ROOT.joinpath('topic-hub.html').read_text()
if "'English ATAR':" not in hub:
 hub=hub.replace('const CONFIG={',"const CONFIG={'English ATAR':"+json.dumps(config,ensure_ascii=False)+',',1)
 hub=hub.replace("if(['Mathematics Applications ATAR'","if(['English ATAR','Mathematics Applications ATAR'",1)
 hub=hub.replace("{'Mathematics Applications ATAR':'ApplicationsATARPlayer'","{'English ATAR':'EnglishATARPlayer','Mathematics Applications ATAR':'ApplicationsATARPlayer'")
 hub=hub.replace("if(c==='Mathematics Applications ATAR'){","if(c==='English ATAR'){const list=(window.EnglishATAR||[]).filter(m=>m.year===y&&m.unit===u);seniorRender(list,openEnglishTopic,u);return}if(c==='Mathematics Applications ATAR'){",1)
 start=hub.index('function openApplicationsTopic(t)');end=hub.index('function openMethodsTopic(t)',start)
 hub=hub[:start]+hub[start:end].replace('openApplicationsTopic','openEnglishTopic').replace('ApplicationsATARPlayer','EnglishATARPlayer')+hub[start:]
 tags='<link rel="stylesheet" href="english-atar.css?v=2026.124">'+''.join(f'<script src="{f}?v=2026.124"></script>'for f in ['english-visuals.js','english-texts.js','english-interactives.js','english-atar-course.js','english-atar-player.js'])
 hub=hub.replace('<link rel="stylesheet" href="applications-atar.css',tags+'<link rel="stylesheet" href="applications-atar.css',1)
 hub=hub.replace("quiz.parentElement.querySelector('h3').textContent='Written Exam Practice';","quiz.parentElement.querySelector('h3').textContent=course.value==='English ATAR'?'Reading and Writing Practice':'Written Exam Practice';",1)
 hub=hub.replace("quiz.parentElement.querySelector('p').textContent='Attempt structured questions and compare your reasoning with the suggested marking points.';","quiz.parentElement.querySelector('p').textContent=course.value==='English ATAR'?'Read, interpret and compose; compare reasoning and craft with models and review criteria.':'Attempt structured questions and compare your reasoning with the suggested marking points.';",1)
ROOT.joinpath('topic-hub.html').write_text(hub)
path=ROOT/'topic-hubs.html';s=path.read_text()
if 'english-atar.html'not in s:
 marker='<section class="hub"><span class="eyebrow">ATAR MATHEMATICS</span>'
 assert marker in s
 tile='<section class="hub"><span class="eyebrow">ATAR ENGLISH</span><h2>English ATAR</h2><p>Read closely, defend an interpretation and compose with purpose. Explore original texts, annotated models, visual analysis and sustained writing practice.</p><div class="actions"><a class="action primary" href="english-atar.html"><strong>Open English ATAR</strong><small>24 Year 11 lessons · 24 Year 12 lessons</small></a></div></section>'
 s=s.replace(marker,tile+marker,1);path.write_text(s)
base=ROOT.joinpath('mathematics-applications.html').read_text()
style=base[base.index('<style>'):base.index('</style>')+8].replace('#087f87','#684491').replace('#123a55','#302447')
units=config['units']
landing='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>English ATAR | Learning Vault WA</title><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="home.css">'''+style+'''</head><body><header class="topbar"><a class="brand" href="index.html"><span class="brand-mark">LV</span><span><strong>Learning Vault WA</strong><small>English ATAR</small></span></a><nav><a href="index.html">Home</a><a href="topic-hubs.html">Topic Hubs</a><a href="exams.html">Exam Vault</a></nav></header><main class="wrap"><section class="hero"><span class="eyebrow">YEARS 11 &amp; 12 · ATAR</span><h1>Read closely.<br>Write with purpose.</h1><p>48 focused lessons · 824 screens · 248 reading and writing tasks · 18 original practice texts · 14 visual stimuli and teaching models.</p><p>Develop interpretations, compare texts, analyse visual choices and craft imaginative, interpretive and persuasive writing. Study worked models, then practise with annotation, comparison and planning tools.</p></section><section class="grid">'''
for y in ['11','12']:
 landing+=f'<article class="card"><h2>Year {y}</h2><p>24 focused lessons</p><ul>'+''.join('<li>'+u+'</li>'for u in units[y])+f'</ul><a class="button" href="topic-hub.html?course=English+ATAR&amp;year={y}">Choose Year {y} lessons →</a></article>'
landing+='''</section><section class="note"><h2>Practise interpretation and craft</h2><p>Read both supplied texts before the models. Every lesson includes focused explanations, two worked responses, independent comparison and creating or revision, and a transfer task using a class text or your own draft. Extended exam lessons include full models and an original three-section rehearsal.</p><p>Short fictional practice texts develop skills alongside your school’s full-length text study. Models show defensible approaches; different well-supported interpretations and purposeful compositions are welcome. Review points and concept checks are practice indicators, not official English marks.</p><p>Drafts, workbench notes and progress save on this browser. Speaking and listening lessons include rehearsal plans; use a listener for actual delivery practice.</p><p>Checked against the SCSA Year 11 syllabus for teaching from 2026 and the current Year 12 syllabus for teaching from 2025. Check official materials for the paper and cohort you are preparing for.</p><p><a href="https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/english/english2" target="_blank" rel="noopener">Official SCSA English ATAR syllabuses and examination resources</a> · <a href="ENGLISH-ATAR-LESSONS.md">Lesson coverage and practice guide</a></p></section></main><script src="portal-nav.js"></script></body></html>'''
ROOT.joinpath('english-atar.html').write_text(landing)
doc='''# English ATAR: lesson coverage and practice guide

Checked 8 October 2026. Original fictional stimuli and teaching responses, not an official paper or SCSA key.

- 24 Year 11 and 24 Year 12 focused lessons, across all four units.
- 824 screens, 248 tasks: 96 worked responses, 144 independent core tasks and eight extended tasks.
- 18 original practice texts, including two vector visual posters; 12 additional explanatory vector models.
- Four substantial theory screens per lesson. Three workbench activities: annotation, comparison notes, writing planning and self-review.
- Two concept questions per lesson; the mastery view repeats them. Written answers are not automatically graded.

## Scope and sources

[Official SCSA English page](https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/english/english2)

[Year 11 for teaching from 2026](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0011/1231769/English-ATAR-Year-11-Syllabus-for-teaching-from-2026.PDF) and [current Year 12 for teaching from 2025](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0017/1122119/English-ATAR-Year-12-Syllabus-for-teaching-from-January-2025.PDF) were checked for the unit emphases and examination design. Descriptive unit titles here are teaching labels. The lesson strand tags below are an authored skills index, not official numbered content codes or external accreditation. The official page also links the published 2027 syllabus; students should check the version for their cohort.

The resource develops contextual reading, language analysis, responding, creating, reflection and oral communication. The unit progression moves from evidence and communication through voices, comparison and evaluated interpretation. Short original texts support transferable skills; they do not replace a school’s required full-length text selections or assessment programme. Class-text transfer tasks explicitly need the student’s own studied text or composition; guidance does not invent or verify quotations from unseen works. No culturally specific testimony is attributed to a real author or community.

## English review conventions

Two core worked responses are usually concise skill models, not full exam-length answers. Independent comparisons offer individual models and a synthesis guide rather than one compulsory interpretation. Creative examples sometimes illustrate an opening or a plan; task and model scope are stated. The extended exam screens supply complete models: three prose/visual comprehension models of around 200–300 words, a sustained analytical essay and a sustained imaginative piece. The rehearsal reuses relevant models and clearly identifies which optional responding or composing question each answers.

Five binary review points track the student’s consideration of task, evidence/detail, reasoning/craft, coherence and expression. They are not a translated SCSA rubric, examination mark, teacher-verified grade or ATAR prediction. A score, concept pass or screen visit cannot establish writing quality. Models welcome defensible alternatives. Speaking/listening tasks require actual rehearsal with a listener; this site does not record or assess audio.

All passages, figures, imagined services, attributed speakers and figures in stimuli are fictional. Visual alternatives describe their arrangements. Fictional memoir-style prose is not presented as real testimony. Poetry and drama develop studied-text skills and are excluded from our Section One exam pairing. Current examination practice distinguishes Section One (30%), Section Two (40%), and Section Three (30%) from school assessment weightings. The examination design suggests 60 minutes per section, after ten minutes reading and within three hours working. Actual paper instructions take priority.

## Rebuild and validation

Run `python build-english.py` and `python integrate-english.py`. Authored source material is in `english-authoring/`. Run `node english-atar-check.cjs`; existing Applications, Methods and Specialist checks should also pass. Integrated DOM traversal verifies every screen, reveal, concept check and the workbench controls, including persisted drafts and escaped typed notes. DOM checks do not substitute for a live rendered layout check.

## Lesson index

| Year | Unit | Lesson | Skills index | Screens | Tasks |
|---|---|---|---|---:|---:|
'''
for m in modules:doc+=f'| {m["year"]} | {m["unit"].split(" – ")[0]} | {m["title"]} | {", ".join(m["outcomes"])} | {len(m["screens"])} | {len(m["questions"])} |\n'
ROOT.joinpath('ENGLISH-ATAR-LESSONS.md').write_text(doc)
print({'EnglishIntegrated':True,'lessons':len(modules)})
