"""Rebuild original English ATAR lessons, models, and the adapted course player."""
from pathlib import Path
from html import escape
import json,runpy,re
ROOT=Path(__file__).parent
DATA=ROOT/'english-authoring'
texts=runpy.run_path(str(DATA/'texts.py'))['TEXTS']
visuals=runpy.run_path(str(DATA/'visuals.py'))['VISUALS']
exams=runpy.run_path(str(DATA/'exams.py'))
lessons=runpy.run_path(str(DATA/'lessons.py'))['LESSONS']
assert len(lessons)==48
for key,title,body in [
 ('posterA','A place for your next chapter','A PLACE FOR YOUR NEXT CHAPTER\nTown Library · A shared public space\nThursday late session · 5–8 pm · Free entry\nVisual description: a large bright doorway in a dark field casts light towards a small figure. The hours appear in a contrasting lower strip.'),
 ('posterB','Measure what moves','MEASURE WHAT MOVES\nTown Library · Annual loan transactions\n24,000\nThursday late session · 5–8 pm · Free entry\nVisual description: the large invented total and five identical book icons dominate. A small doorway and the lower hours line receive less emphasis.')]:
 texts[key]=dict(id=key,title=title,kind='visual poster',context='Original fictional visual stimulus. All service details and figures are invented.',body=body,diagram=key)
def para(s):return ''.join('<p>'+escape(p).replace('\n','<br>')+'</p>' for p in s.split('\n\n'))
def figure(key):
 v=visuals[key]
 return '<figure class="eng-source-figure"><div class="eng-svg">'+v['svg']+'</div><figcaption>'+escape(v['limit'])+'</figcaption></figure>'
def source(key):
 t=texts[key]
 return '<section class="eng-stimulus"><span class="eng-kicker">ORIGINAL '+escape(t['kind'].upper())+'</span><h3>'+escape(t['title'])+'</h3><p class="eng-source-context">'+escape(t['context'])+'</p>'+(figure(t['diagram']) if t.get('diagram') else '')+'<details'+('' if t.get('diagram') else ' open')+'><summary>'+('Text alternative' if t.get('diagram') else 'Read the supplied text')+'</summary><div class="eng-source-body">'+para(t['body'])+'</div></details></section>'
RUBRIC=[
 'Answer the prompt directly, keeping its audience, purpose, focus and form in view.',
 'Use accurate, relevant textual detail or purposeful concrete detail in composition; do not invent attributed quotations.',
 'Explain the relationship between choices and meaning, or develop the composed idea through deliberate choices.',
 'Organise a coherent response and preserve any important qualification instead of forcing a universal conclusion.',
 'Control expression, attribution, sentence boundaries and punctuation; review a specific change after drafting.'
]
def task(id,prompt,sources,model,practice,section='Skill drill',extra=False):
 html=''.join(source(k)for k in sources)+'<div class="eng-task-prompt">'+para(prompt)+'</div>'
 steps=[model]+RUBRIC
 return dict(id=id,prompt=prompt,promptHtml=html,steps=steps,stepsHtml=[ '<div class="eng-model-answer"><h4>One model or guided approach</h4>'+para(model)+'</div>']+[escape(s)for s in RUBRIC],allocations=[0]+[1]*5,marks=5,practice=practice,mode=section,extended=extra)
units=['Unit 1 – Meaning, choices and communication','Unit 2 – Voices, representation and composing','Unit 3 – Comparing texts, genres and contexts','Unit 4 – Interpretation, evaluation and exam application']
concepts={
 'reading':'An inference needs connected textual evidence and must not invent an unseen event.',
 'audience':'An implied audience is constructed by address, assumptions and offered actions; actual readers may differ.',
 'context':'Creation and reception contexts may differ; a contextual claim still needs textual evidence.',
 'diction':'Connotation and lexical patterns matter in their particular context, not as universal word codes.',
 'imagery':'An object can gather significance through repeated attention and changed function within the text.',
 'syntax':'Sentence pattern and placement must be connected to a specific meaning, not a fixed effect of length.',
 'structure':'An ending should develop or qualify the text’s central relationship through its sequence.',
 'visual':'Salience, composition and wording interact; colour does not have a universal emotional meaning.',
 'film':'A shot’s meaning depends on its sequence and sound; withheld content must not be invented.',
 'rhetoric':'A concession acknowledges a serious constraint and can narrow or strengthen a defensible request.',
 'paragraph':'A paragraph connects a clear claim, selected evidence and an explained relationship.',
 'editing':'Verify quoted wording and revise unsupported claims before the final proofreading pass.',
 'voice':'Voice is constructed through a pattern of choices and should not be confused with narrative person.',
 'perspective':'A partial first-person account is not automatically wholly unreliable.',
 'representation':'Selection and emphasis construct a version of a subject; partial does not automatically mean wholly false.',
 'values':'A value should be inferred through priorities and contrasts, with its evidence stated.',
 'mood':'Mood concerns atmosphere; tone concerns a speaker’s attitude towards subject or audience.',
 'hybrid':'Hybrid elements need an explained relationship rather than simply appearing in the same text.',
 'digital':'Engagement counts show interaction; they do not establish truth or representative agreement.',
 'interpretive':'Interpretive writing develops a question through scene and reflection rather than requiring a policy conclusion.',
 'imaginative':'A controlled scene needs pressure and a meaningful development consistent with its point of view.',
 'persuasive-writing':'A proposal should address real constraints and specify an assessable next step.',
 'speaking':'A delivery plan should serve meaning; a transcript does not prove actual pace or gesture.',
 'listening':'Paraphrase the strongest actual claim before challenging it; do not invent a motive.',
 'genre':'Conventions create expectations which a text can follow or challenge for a particular effect.',
 'challenge-genre':'A departure from convention needs evidence and a relevant criterion for evaluation.',
 'changing-contexts':'Hypothetical reception is a supported possibility, not a documented history.',
 'comparison':'A comparison needs a shared basis and an explained relationship between the texts.',
 'comparative-thesis':'A comparative thesis states a relationship while accounting for relevant similarities and differences.',
 'essay':'Each paragraph should contribute a distinct claim to the developing answer.',
 'evidence':'Attribution and the relationship among details matter as much as quotation selection.',
 'poetry':'Poetry can be used for studied-text responding, but the current Section One stimulus excludes it.',
 'drama':'Stage direction and dialogue can work together; the current Section One stimulus excludes drama.',
 'adaptation':'Adaptation selects what to retain, change and omit for a new form and audience.',
 'multimodal':'Resources must interact to serve audience and purpose; a decorative layout alone is insufficient.',
 'reflection':'Reflection tests intention against evidence of the result and identifies a specific revision.',
 'readings':'Alternative readings must account for evidence and can differ in how strongly the text supports them.',
 'assumptions':'An assumption is a premise treated as accepted; test the criterion it makes seem obvious.',
 'omission':'An omission can limit an account without proving malicious intent or wrongdoing.',
 'empathy':'Empathy is an invitation to understand a position, not guaranteed agreement or access to hidden thoughts.',
 'controversy':'A fair disagreement distinguishes shared aims from different methods and priorities.',
 'personal-voice':'A personal voice can change understanding while retaining a coherent pattern of attention.',
 'nuance':'Qualification should sharpen a clear judgement through a criterion and evidence.',
 'counterargument':'A counterargument needs a fair, evidence-based alternative rather than a token however.',
 'comprehending':'Section One currently has two equally weighted responses of approximately 200–300 words each.',
 'responding':'Choose a question you can answer with relevant, accurate studied-text evidence, adapting your argument.',
 'composing':'A sustained composition must meet the prompt’s audience, context and purpose rather than force a memorised piece.',
 'exam-review':'Screen visits, concept checks and self-review are not an English grade or an ATAR prediction.'
}
modules=[]
for i,l in enumerate(lessons):
 u=i//12;year='11'if u<2 else'12';id='eng'+year+'-'+l['slug'];a,b=l['a'],l['b']
 assert a in texts and b in texts and l['diagram']in visuals
 scope=l['focus'].capitalize()+' · Read closely · Explain choices · Practise and revise'
 qs=[task(id+'-w1',l['qa'],[a],l['ma'],False),task(id+'-w2',l['qb'],[b],l['mb'],False)]
 comparison=f'Compare how {texts[a]["title"]} and {texts[b]["title"]} use their different resources to develop {l["focus"]}. Write 150–200 words, select a common basis, and explain one significant similarity or difference. For a poem or drama pairing, this is studied-text skills practice, not Section One stimulus practice.'
 guide='Begin by deciding a defensible relationship instead of forcing a contrast. The following individual models provide evidence and reasoning to test in your comparison. Text A: '+l['ma']+' Text B: '+l['mb']+' Synthesize the relationship through the question; two separate summaries do not complete the comparison.'
 qs+=[task(id+'-p1',comparison,[a,b],guide,True,'Comparative skill drill'),task(id+'-p2',l['create'],[],l['example'],True,'Creating or revision drill')]
 transfer=f'Apply {l["focus"]} to a genuinely studied class text or to your own composition. Identify the text, choose two verified details, write a 200-word response or revision commentary, and explain one relevant limit. This transfer task needs your class text or draft; the page does not supply or verify its quotations.'
 qs.append(task(id+'-p3',transfer,[], 'Guided approach: answer the task with a claim specific to your chosen text. Select evidence which performs two distinct functions, explain how each develops '+l['focus']+', and test the claim against another detail. For composing, compare a before-and-after choice and justify the revision. The models above demonstrate this skill in original teaching texts; they cannot supply evidence for an unseen class text.',True,'Class-text or own-writing transfer'))
 extras=exams['EXTRAS'].get(l['slug'],[])
 for n,x in enumerate(extras):qs.append(task(id+'-extended'+str(n+1),x['prompt'],x['sources'],x['model'],True,x['section']+' · extended practice',True))
 ss=[dict(kind='reference',title='Learning goals and how to practise',html='<h3>'+escape(l['title'])+'</h3><p>Understand '+escape(l['focus'])+', connect accurate evidence with a defensible interpretation, and practise adapting the skill in your own writing.</p><p>Read the two original texts, study the explanations, and attempt each task before its model. Allow 30–50 minutes for the core lesson; extended pieces and speaking rehearsal need additional time.</p><p>Model interpretations are examples, not the only acceptable answers. Short skill drills are separate from full exam responses. Three independent tasks include comparison, creation or revision, and transfer to a class text or your own draft.</p>'),dict(kind='reference',title='Read the two original practice texts',html=source(a)+source(b))]
 for n,p in enumerate(l['theory']):
  html=escape(p)
  for word in ['evidence','context','voice','perspective','audience','purpose','interpretation','convention','claim','meaning','structure','revision']:
   html=re.sub(r'\b'+word+r'\b','<mark class="eng-key">'+word+'</mark>',html,count=1,flags=re.I)
  ss.append(dict(kind='learn',title=['Define and locate the skill','Connect choices with meaning','Test and qualify the judgement','Apply and revise the skill'][n],text=p,html=html,diagram=l['diagram']if n==1 else None))
 ss.append(dict(kind='interactive',title='Annotate and plan your response',model='workbench',sources=[a,b],focus=l['focus']))
 for n in range(2):ss.extend([dict(kind='question',title=f'Worked response {n+1} · attempt first',q=n),dict(kind='solution',title=f'Worked response {n+1} · model and review',q=n)])
 for n in range(2,len(qs)):ss.append(dict(kind='question',title=['Independent comparison','Independent creation or revision','Class-text or own-writing transfer'][n-2]if n<5 else extras[n-5]['title'],q=n))
 correct=concepts[l['slug']]
 bank=[dict(q='Which principle best applies to '+l['focus']+'?',o=[correct,'Naming a technique alone establishes the meaning and the audience’s response.','An interpretation can invent missing events if they make its argument persuasive.','A self-review score proves how a teacher will assess the response.'],a=0,why=correct+' Test it through the supplied models and your own evidence.'),dict(q='Which review approach is sound for this English practice?',o=['Compare reasoning with the model and review criteria, accepting other well-supported interpretations.','Match the model’s exact wording; all different interpretations are incorrect.','Treat the review-point total as an official English exam mark.','Assume screen visits demonstrate sustained writing ability.'],a=0,why='The tasks are interpretive or creative. Review evidence, reasoning and craft; concept checks and self-review points do not certify an English grade.')]
 for n in range(2):ss.append(dict(kind='check',title='Concept check '+str(n+1),q=n))
 ss.append(dict(kind='sources',title='Continue with class texts and official practice',html='<h3>Transfer the skill</h3><p>Short original passages develop particular skills; they do not replace your school’s full-length studied texts or assessment programme. Speaking practice requires rehearsal with a listener; this page does not record audio.</p><p><a href="https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/english/english2" target="_blank" rel="noopener">Official SCSA English ATAR syllabuses and examination materials</a> · <a href="ENGLISH-ATAR-LESSONS.md">Coverage and practice guide</a></p><p>All teaching stimuli and model responses here are original fictional material. Reviews are suggested, not official SCSA marking keys. A concept check cannot establish exam readiness.</p>'))
 modules.append(dict(id=id,year=year,unit=units[u],area=l['title'],title=l['title'],subtitle=l['focus'].capitalize()+' · Evidence, interpretation and craft',scope=scope,outcomes=l['strands'],icon='✍️',screens=ss,questions=qs,bank=bank))
ROOT.joinpath('english-atar-course.js').write_text('/* Original English ATAR lessons; generated by build-english.py. */\nwindow.EnglishATAR = '+json.dumps(modules,ensure_ascii=False,separators=(',',':'))+';\n')
ROOT.joinpath('english-visuals.js').write_text('/* Original vector models and fictional visual stimuli. */\nwindow.EnglishVisuals = '+json.dumps(visuals,ensure_ascii=False,separators=(',',':'))+';\n')
ROOT.joinpath('english-texts.js').write_text('/* Original fictional corpus and verified teaching annotations. */\nwindow.EnglishTexts = '+json.dumps(dict(texts=texts,annotations=exams['ANNOTATIONS']),ensure_ascii=False,separators=(',',':'))+';\n')
p=ROOT.joinpath('applications-atar-player.js').read_text().replace('Applications','English').replace('applications','english').replace('MATHEMATICS APPLICATIONS ATAR','ENGLISH ATAR')
p=p.replace('mas','eng').replace('engter','master').replace('MATHEMATICS ENGLISH ATAR','ENGLISH ATAR')
p=p.replace('written exam tasks','reading and writing tasks').replace('Written practice','Writing practice').replace('Your answer and working','Your response and planning').replace('Show every mathematical step, state domains and give a clear conclusion. Draw labelled models or graphs on paper when requested.','Develop a clear interpretation or composition. Use accurate evidence, explain your choices and check audience, purpose and form. Speaking activities need rehearsal with a listener.')
p=p.replace('Written work is self-assessed against the suggested marking points. It is not automatically graded.','Writing is reviewed against suggested criteria. Review points are practice indicators, not official English marks or automatic grades.')
p=p.replace('Suggested answer and marking points','Model and review criteria').replace('Reveal answer and marking points','Reveal model and review criteria').replace('Your credit for this point','Your review of this criterion').replace('Self-assessed credit for marking point','Self-reviewed criterion').replace('Accept accurate equivalent mathematical reasoning and valid english.','Accept other interpretations supported by accurate evidence and purposeful creative choices.')
p=p.replace('not an official SCSA key','not an official SCSA marking key').replace('suggested marking points','suggested review criteria').replace('marks</p>','review points</p>').replace("+' marks'","+' review points'").replace(' MARKS',' REVIEW POINTS')
p=p.replace('INDEPENDENT EXAM PRACTICE','INDEPENDENT WRITING PRACTICE').replace('WORKED EXAMPLE · TRY FIRST','WORKED RESPONSE · TRY FIRST').replace('WORKED SOLUTION','MODEL RESPONSE').replace('Written Exam Practice','Reading and Writing Practice').replace('maths','writing')
p=p.replace('reasoning, graphs, domains and explanations','close reading, sustained analysis, composing and oral practice').replace('Drawings on paper are not saved.','Paper drafts and oral rehearsal are not saved.').replace('Drawings','Paper drafts')
p=p.replace('window.EnglishInteractives.mount(s.model,screen.querySelector(\'#engInteractive\'))','window.EnglishInteractives.mount(s.model,screen.querySelector(\'#engInteractive\'),{module:m,screen:s})')
p=p.replace('every step','model and review').replace('Compare your actual working','Review the reasoning and craft of your actual response').replace('your paper working','your paper response')
p=p.replace('Jump to a english lesson screen','Jump to an English lesson screen').replace('The next screen explains the solution and marks.','The next screen gives a model response and review criteria.')
p=p.replace('<p>${q.promptHtml||esc(q.prompt)}</p>', '${q.promptHtml||"<p>"+esc(q.prompt)+"</p>"}')
ROOT.joinpath('english-atar-player.js').write_text(p)
css=ROOT.joinpath('applications-atar.css').read_text().replace('.mas','.eng').replace('#mas','#eng')
css+='\n.eng-lms .sv-course{background:#f3eef9}.eng-lms .sv-course-title,.eng-kicker{color:#684491}.eng-lms .sv-progress i,.eng-lms .btn:not(.dark){background:#684491}.eng-key{background:#eee2fb;color:#4c2c6d;padding:1px 3px;border-radius:3px}.eng-stimulus{padding:22px;border:1px solid #ddd2e9;border-radius:14px;margin:16px 0;background:#fcfaff}.eng-source-body{line-height:1.85}.eng-source-context{font-size:14px;color:#596273}.eng-stimulus summary{font-weight:bold;cursor:pointer;padding:10px 0}.eng-model-answer{background:#f5f0fb;border-left:4px solid #7957a3;padding:16px;margin:14px 0}.eng-model-answer p{line-height:1.85}.eng-task-prompt{padding:14px 0;font-weight:600}.eng-workbench{display:grid;gap:18px}.eng-workbench label{display:block;font-weight:600;margin:10px 0}.eng-workbench textarea{width:100%;box-sizing:border-box;min-height:90px;font:inherit;padding:12px;border:1px solid #b5a4ca;border-radius:8px}.eng-workbench select{max-width:100%;font:inherit;padding:10px;border:1px solid #b5a4ca;border-radius:8px}.eng-tabs{display:flex;flex-wrap:wrap;gap:10px}.eng-note{padding:18px;background:#ede8f7;border-radius:12px;line-height:1.75}.eng-annotation{padding:12px;border:1px solid #cbbbde;border-radius:8px;background:white;color:#4c2c6d;cursor:pointer;text-align:left;font:inherit;line-height:1.5}.eng-annotations{display:grid;gap:10px}.eng-source-figure{margin:16px 0}.eng-svg{overflow-x:auto}.eng-svg svg{width:100%;min-width:520px;max-width:740px;height:auto;display:block;margin:auto}.eng-source-figure figcaption{font-size:14px;margin-top:10px}.eng-workbench input[type=checkbox]{width:18px;height:18px;margin-right:10px}.eng-workbench .eng-selected{background:#e3d3f3;border-color:#684491}.eng-workbench .eng-source-body mark{background:#ffe7a6}.eng-lms .eng-small{line-height:1.7}@media(max-width:650px){.eng-stimulus{padding:14px}.eng-workbench .eng-tabs .btn{flex:1}.eng-task-prompt{font-weight:600}}\n'
ROOT.joinpath('english-atar.css').write_text(css)
print(dict(lessons=len(modules),screens=sum(len(m['screens'])for m in modules),tasks=sum(len(m['questions'])for m in modules),texts=len(texts),visuals=len(visuals)))
