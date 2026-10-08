"""Rebuild original PE Studies content and the adapted lesson player."""
from pathlib import Path
from html import escape
import json,runpy,re
R=Path(__file__).parent
lessons=runpy.run_path(str(R/'pe-lessons.py'))['LESSONS'];visuals=runpy.run_path(str(R/'pe-visuals.py'))['V'];exam=runpy.run_path(str(R/'pe-exam.py'))
UNITS=['Unit 1 – Anatomy, physiology and foundations','Unit 2 – Learning, biomechanics and psychology','Unit 3 – Muscle function, performance and planning','Unit 4 – Coaching, advanced mechanics and application']
SOURCE='https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/health-and-physical-education/physical-education-studies'
def para(s):return ''.join('<p>'+escape(p)+'</p>'for p in s.split('\n\n'))
def task(id,prompt,steps,practice,mode='Short-answer skill practice'):
 return dict(id=id,prompt=prompt,steps=steps,allocations=[1]*len(steps),marks=len(steps),practice=practice,mode=mode)
modules=[]
for l in lessons:
 u=l['unit'];year='11'if u<3 else'12';id='pes'+year+'-'+l['slug']
 qs=[task(id+'-w1',l['question'],l['answer'],False),task(id+'-p1',l['practice'],l['solution'],True)]
 transfer='Apply '+l['title'].lower()+' to your school’s selected sport. Use one specific teacher-approved observation or clearly labelled fictional scenario. Explain the principle through a labelled diagram or causal sequence, propose a relevant performance or coaching implication, and identify one limitation. This task requires your chosen context; it does not assess actual skill execution.'
 qs.append(task(id+'-p2',transfer,['Identify the sport, action, phase and specific observation; distinguish actual evidence from an invented case.','Explain the relevant mechanism accurately. Useful lesson principles: '+l['theory'][0], 'Connect the principle to a justified implication. Use the worked model as a reasoning example, not as evidence of your own performance.','Label a relevant diagram or causal sequence, with directions and units where appropriate.','State a meaningful limit: '+l['limit'],'Identify what comparable observation or appropriate teacher feedback could test the explanation. A plan is not a practical assessment grade.'],True,'Sport-context transfer · needs chosen context'))
 if l['slug']=='written-exam':
  qs += [task(id+'-short'+str(i+1),prompt,steps,True,'Original rehearsal · Section Two')for i,(_,prompt,steps)in enumerate(exam['SHORT'])]
  qs += [task(id+'-extended'+str(i+1),prompt,steps,True,'Original rehearsal · Section Three · choose two')for i,(_,prompt,steps)in enumerate(exam['EXTENDED'])]
 ss=[dict(kind='reference',title='Learning goals and practice route',html='<h3>'+escape(l['title'])+'</h3><p>'+escape(l['area'])+' · Understand the mechanism, explain its sporting application and qualify your conclusion.</p><p>Read four focused explanations, explore the labelled model, attempt the worked case before its steps, then complete independent and sport-context practice. Allow about 25–40 minutes, with extra time for extended cases. All numerical data are fictional.</p><p>Written work is self-reviewed against suggested points. Concept mastery, screen visits and plans are not a practical assessment or predicted ATAR.</p>')]
 for n,t in enumerate(l['theory']):
  html=escape(t)
  for key in ['force','movement','feedback','oxygen','recovery','attention','velocity','calcium','ATP','transfer','evidence','pressure','muscle','tension']:
   html=re.sub(r'\b'+key+r'\b','<mark class="pes-key">'+key+'</mark>',html,count=1,flags=re.I)
  ss.append(dict(kind='learn',title=['Define the concept','Explain the mechanism','Apply to sport','Qualify and evaluate'][n],text=t,html=html,diagram=l['diagram']if n==1 else ('force-velocity' if l['slug']=='force-relations' and n==2 else None)))
 models={'acute':'cardiac','chronic':'cardiac','breathing':'cardiac','impulse':'impulse','torque':'torque','levers':'torque','projectiles':'projectile','optimal-flight':'projectile'}
 # The breathing lesson uses the explanation planner rather than unrelated cardiac inputs.
 models.pop('breathing',None)
 ss.append(dict(kind='interactive',title='Explore the model and explain the evidence',model=models.get(l['slug'],'analysis')))
 ss += [dict(kind='question',title='Worked case · attempt first',q=0),dict(kind='solution',title='Worked case · step-by-step model',q=0),dict(kind='question',title='Independent short-answer practice',q=1),dict(kind='question',title='Transfer to your selected sport',q=2)]
 for n in range(3,len(qs)):ss.append(dict(kind='question',title=('Section Two · '+exam['SHORT'][n-3][0])if n<11 else('Section Three option · '+exam['EXTENDED'][n-11][0]),q=n))
 bank=[dict(q='Which statement is supported by this lesson on '+l['title'].lower()+'?',o=[l['answer'][0],'The same conclusion applies without considering the task, phase or conditions.','One successful result proves the cause and excludes every alternative explanation.','A browser concept score certifies practical skill and an official exam grade.'],a=0,why='The relevant principle is: '+l['answer'][0]+' '+l['limit']),dict(q='Which qualification matters when applying this lesson?',o=[l['limit'],'No model assumptions or measurement limits need to be stated.','A single image supplies every force, mental state and physiological cause.','A fictional classroom dataset is an individual training or treatment prescription.'],a=0,why=l['limit']+' Connect evidence with mechanism and identify what the model cannot establish.')]
 if l['slug']=='written-exam':
  bank=[dict(q=q,o=o,a=a,why=w)for q,o,a,w in exam['MCQ']]
 for n in range(len(bank)):ss.append(dict(kind='check',title=('Original Section One question 'if l['slug']=='written-exam'else'Concept check ')+str(n+1),q=n))
 ss.append(dict(kind='sources',title='Official resources and practical transfer',html='<h3>Continue with school practice</h3><p>Apply the concepts through your teacher’s selected sport and supervised programme. This site does not record or grade competitive performance. Year 12 uses a school-based practical (performance) external assessment; complete the actual school requirements.</p><p><a href="'+SOURCE+'" target="_blank" rel="noopener">Official SCSA PE Studies syllabuses and assessments</a> · <a href="PE-STUDIES-ATAR-LESSONS.md">Coverage, sources and practice guide</a></p><p>All scenarios, numerical data and questions are original teaching material. Suggested points are not official SCSA keys. Actual paper and school instructions take priority.</p>'))
 modules.append(dict(id=id,year=year,unit=UNITS[u-1],area=l['area'],title=l['title'],subtitle=l['area']+' · Mechanism, evidence and sport application',scope=l['area']+' · Explain · Apply · Evaluate',outcomes=[l['area']],icon='🏃',screens=ss,questions=qs,bank=bank))
for file,globalname,data in [('pe-atar-course.js','PEATAR',modules),('pe-visuals.js','PEVisuals',visuals)]:R.joinpath(file).write_text('/* Generated original PE Studies material. */\nwindow.'+globalname+' = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
p=R.joinpath('applications-atar-player.js').read_text().replace('Applications','PE').replace('applications','pe').replace('MATHEMATICS APPLICATIONS ATAR','PHYSICAL EDUCATION STUDIES ATAR').replace('mas','pes').replace('pester','master')
p=p.replace('MATHEMATICS PE ATAR','PHYSICAL EDUCATION STUDIES ATAR').replace('Maths','PE Studies').replace('maths','sport science')
p=p.replace('Show every mathematical step, state domains and give a clear conclusion. Draw labelled models or graphs on paper when requested.','Explain the mechanism, connect it to the sporting context and state model assumptions. Show formulas, units and directions for calculations; label diagrams.')
p=p.replace('Accept accurate equivalent mathematical reasoning and valid pe.','Accept accurate equivalent reasoning and relevant sporting applications.')
p=p.replace("window.PEInteractives.mount(s.model,screen.querySelector('#pesInteractive'))","window.PEInteractives.mount(s.model,screen.querySelector('#pesInteractive'),{module:m,screen:s})")
p=p.replace('Jump to a pe lesson screen','Jump to a PE Studies lesson screen')
p=p.replace('reasoning, graphs, domains and explanations','mechanisms, units, labelled diagrams and sporting explanations')
R.joinpath('pe-atar-player.js').write_text(p)
css=R.joinpath('applications-atar.css').read_text().replace('.mas','.pes').replace('#mas','#pes')
css+='\n.pes-lms .sv-course{background:#edf6ef}.pes-lms .sv-course-title{color:#21644d}.pes-key{padding:1px 3px;border-radius:3px;background:#def0dc;color:#184e35}.pes-tool{display:grid;gap:14px}.pes-tool label{display:block;font-weight:600}.pes-tool input,.pes-tool textarea{display:block;width:100%;box-sizing:border-box;font:inherit;padding:12px;border:1px solid #9ab8a7;border-radius:8px;margin-top:7px}.pes-tool textarea{min-height:100px}.pes-output{background:#edf6ef;border-left:4px solid #21644d;padding:18px;line-height:1.8}.pes-plot svg{width:100%;min-width:320px}.pes-plot{overflow:auto}.pes-tool .btn{justify-self:start}.pes-save{color:#21644d}\n'
R.joinpath('pe-atar.css').write_text(css)
print({'lessons':len(modules),'screens':sum(len(m['screens'])for m in modules),'tasks':sum(len(m['questions'])for m in modules),'diagrams':len(visuals)})
