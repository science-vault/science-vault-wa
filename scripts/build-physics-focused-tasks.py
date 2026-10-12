"""Compile standalone tasks for the focused course while retaining assigned legacy tasks."""
import json,hashlib
from pathlib import Path
from urllib.parse import urlencode
ROOT=Path(__file__).resolve().parent.parent
VERSION='2026.10.12-focused-tasks'
content=json.loads((ROOT/'physics-focused-content.js').read_text().split('window.PhysicsFocusedContent=',1)[1].rstrip(';\n'))
legacy=json.loads((ROOT/'physics-legacy-standalone-tasks.json').read_text())['tasks']
parents={t['topic']:t for t in legacy}
extras={e['id']:e for e in content['extras']}
figures=json.loads((ROOT/'physics-focused-task-figures.json').read_text())
expected={id+'-focus-'+str(i+1) for id,parts in content['specs'].items() for i in range(len(parts))}|set(extras)
authored={};parent=None
for line in (ROOT/'physics-task-authoring/focused-tasks.txt').read_text().splitlines():
 if not line or line.startswith('#'):continue
 if line.startswith('@'):parent=line[1:];continue
 suffix,prompt1,key1,prompt2,key2,false=line.split('|')
 id=parent if suffix=='extra' else parent+'-focus-'+suffix
 assert id not in authored,id
 authored[id]=dict(prompts=[prompt1,prompt2],keys=[key1.split('~'),key2.split('~')],false=false)
assert set(authored)==expected,'Each focused lesson must have exactly one independently authored task.'
def link(parent,id,standalone=False):
 args=dict(course='Physics ATAR',year=parent['yearGroup'],unit=parent['unit'],topic=id)
 if standalone:args['activity']='standalone'
 return 'topic-hub.html?'+urlencode(args)
tasks=[]
for parent in legacy:
 entries=[(parent['topic']+'-focus-'+str(i+1),s) for i,s in enumerate(content['specs'][parent['topic']])]
 entries += [(e['id'],dict(title=e['title'],claim=e['claim'])) for e in content['extras'] if e['parent']==parent['topic']]
 for id,spec in entries:
  authored_task=authored[id];questions=[];mastery=[]
  for i,(prompt,points) in enumerate(zip(authored_task['prompts'],authored_task['keys']),1):
   assert len(points)==3
   questions.append(dict(id=id+'-standalone-q'+str(i),prompt=prompt,marks=3,lines=8,marking=[dict(point=p,marks=1) for p in points]))
   # Checks refer to the new standalone scenario and never reuse a lesson question.
   options=list(dict.fromkeys([points[-1],authored_task['false'],spec['claim']]))
   if len(options)<3:options.append('All the model quantities in this question are identically zero.')
   assert len(options)==3
   shift=int(hashlib.sha256((id+':'+str(i)).encode()).hexdigest()[:4],16)%3
   options=options[shift:]+options[:shift]
   mastery.append(dict(id=id+'-standalone-m'+str(i),prompt='For written Question '+str(i)+', which conclusion is consistent with its stated scenario and model?',options=options,answer=options.index(points[-1]),why=' '.join(points),marks=1))
  title=spec['title'];focus=title+'. Work within this focused lesson’s model and assumptions.'
  instructions='Focus: '+focus+'\nComplete two new structured written questions and two scenario concept checks independently. Show reasoning, equations, substitutions and units. Attempt both written questions before revealing the step-by-step marking tables, then correct your work and record one improvement. Written marks are self-reviewed; only the concept checks are automatically checked. Revise the linked focused lesson when needed.'
  task=dict(id=json.dumps(['Physics ATAR',parent['yearGroup'],parent['unit'],id],ensure_ascii=False,separators=(',',':')),topic=id,parentTopic=parent['topic'],title=title+' — standalone task',lessonTitle=title,course='Physics ATAR',yearGroup=parent['yearGroup'],unit=parent['unit'],focus=focus,instructions=instructions,url=link(parent,id,True),lessonUrl=link(parent,id),minutes=0,format='standalone',taskVersion=VERSION,totalMarks=8,writtenQuestions=2,conceptChecks=2,suggestedMinutes=20,constants='Use g = 9.80 m s⁻² unless stated otherwise. Use the constants and idealisations given in each question. Show units and direction where relevant. Extension-model tasks are identified by their lesson titles or question statements.',questions=questions,mastery=mastery,visual='focused',figure=figures[id])
  tasks.append(task)
assert len(tasks)==142 and sum(t['yearGroup']==11 for t in tasks)==72
prompts=[q['prompt'] for t in tasks for q in t['questions']]
assert len(set(prompts))==len(prompts)==284,'Written prompts must be unique.'
lesson_prompts={s['question'] for parts in content['specs'].values() for s in parts}|{e['exam']['q'] for e in content['extras']}
assert not set(prompts)&lesson_prompts,'Standalone tasks must not copy lesson independent questions.'
# Legacy content and identifiers remain unchanged; its assignments are still playable.
all_tasks=tasks+[{**t,'legacy':True} for t in legacy]
(ROOT/'physics-standalone-tasks.json').write_text(json.dumps(dict(version=VERSION,tasks=all_tasks),ensure_ascii=False,indent=2)+'\n')
catalog=json.loads((ROOT/'lesson-task-catalog.json').read_text())
other=[t for t in catalog['tasks'] if t['course']!='Physics ATAR']
public=[{k:v for k,v in t.items() if k not in ['questions','mastery','constants','visual','figure']} for t in tasks]
(ROOT/'lesson-task-catalog.json').write_text(json.dumps(dict(version=VERSION,tasks=other+public),ensure_ascii=False,indent=2)+'\n')
print('Built 142 focused Physics tasks: 284 new written questions and 284 scenario checks; 44 legacy assignments retained.')
