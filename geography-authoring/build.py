from pathlib import Path
import json,re,html
ROOT=Path(__file__).resolve().parent.parent
UNITS={1:'Natural and ecological hazards',2:'Global networks and interconnections',3:'Global environmental change',4:'Planning sustainable places'}
SOURCES={
'scsa':['SCSA Geography course page and 2026 syllabuses','https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/humanities-and-social-sciences/geography'],
'yasi':['Bureau of Meteorology: Yasi, 2011','https://www.bom.gov.au/cyclone/history/yasi.shtml'],
'dengue':['WHO: Bangladesh outbreak snapshot, 11 August 2023','https://www.who.int/emergencies/disease-outbreak-news/item/2023-DON481'],
'coffee':['FAO: coffee markets and trade','https://www.fao.org/markets-and-trade/commodities-overview/beverages/coffee'],
'football':['FIFA: women’s football professionalisation','https://football-technology.fifa.com/womens-football/professionalisation'],
'climate':['IPCC: AR6 Synthesis Report','https://www.ipcc.ch/report/ar6/syr/'],
'country':['NIAA: Stories from Country, 2022','https://www.niaa.gov.au/resource-centre/stories-country-2022'],
'brazil':['INPE: TerraBrasilis monitoring data','https://terrabrasilis.dpi.inpe.br/en/download-files/'],
'indonesia':['Indonesia Ministry of Environment and Forestry: forest report','https://statistik.menlhk.go.id/sisklhkX/assets/publikasi/file/3.pdf'],
'perth':['WA Government: Perth and Peel planning framework','https://www.wa.gov.au/organisation/department-of-planning-lands-and-heritage/perth-and-peel35million'],
'water':['Water Corporation: Perth water context','https://www.watercorporation.com.au/our-water/our-water-future/our-water-and-perth'],
'mumbai':['MMRDA: metropolitan regional plan','https://mmrda.maharashtra.gov.in/en/planning/regional-plan/final-rp-for-mmr'],
'metro':['MMRDA: Metro planning and projects','https://mmrda.maharashtra.gov.in/en/division/metro-piu/overview'],
'census':['ABS: Census data tools','https://www.abs.gov.au/census/find-census-data']}

def colour(s,words):
 # Colour terms once per paragraph, preserving all text as escaped HTML.
 tokens=re.split('('+'|'.join(re.escape(w) for w in sorted(words,key=len,reverse=True))+')',s,flags=re.I)
 return ''.join('<strong class="geo-term term-'+str(i%3)+'">'+html.escape(t)+'</strong>' if any(t.lower()==w.lower() for w in words) else html.escape(t) for i,t in enumerate(tokens))

def rows_file(name):
 rows=[]
 for line in (ROOT/'geography-authoring'/name).read_text().splitlines():
  if not line.strip():continue
  v=line.split('|');assert len(v)==8,(name,v[0],len(v));rows.append(v)
 return rows

lessons=[]
def add(u,row,skill=False):
 title,concept,mechanism,case,reasoning,misconception,visual,terms=row
 keywords=terms.split(';');year='11' if u<3 else '12';slug=re.sub('[^a-z0-9]+','-',title.lower()).strip('-');id=f'geo-{u}-{slug}'
 if skill:
  context={1:'hazard exposure and safe preparedness planning',2:'commodity and cultural networks',3:'land-cover change and environmental evidence',4:'urban access and liveability'}[u]
  case+=' Transfer: apply this skill to '+context+', identifying what map, date and unit you need.'
  reasoning+=' For this unit, connect the result to '+context+' and state one inference the calculation cannot establish.'
 intentions=[f'Explain {keywords[0]} using accurate geographical language','Apply the lesson method to mapped or case evidence','Support a conclusion and explain its evidence limits']
 sources=['scsa']+({1:['yasi','dengue'],2:['coffee','football'],3:['climate','country','brazil','indonesia'],4:['perth','water','mumbai','metro','census']}[u])
 qs=[]
 def q(prompt,steps,alloc,practice,mode,rows=16,diagram=False):
  qs.append(dict(id=id+'-q'+str(len(qs)+1),prompt=prompt,steps=steps,allocations=alloc,marks=sum(alloc),practice=practice,mode=mode,rows=rows,diagram=diagram))
 q(case+' Analyse this stimulus: explain the relevant concept, trace the process or method, and support a conclusion. Show any calculation with units and identify an evidence limitation.',
   ['Identify the relevant concept: '+concept,'Trace the process / method: '+mechanism,'Apply the evidence and show reasoning: '+reasoning,'Qualify the conclusion: distinguish the supplied evidence from assumptions; identify a relevant limitation such as scale, date, sampling, model conditions or missing information.'],[2,2,2,2],False,'I do · annotated model',20)
 q(case+' Explain two geographical relationships or methodological steps that matter in this case. Use specific evidence and units where relevant; for each relationship explain why it matters.',
   ['First valid relationship or step: '+concept,'First supported application: '+reasoning,'Second distinct relationship or step: '+mechanism,'Second supported application: connect a different aspect of the supplied evidence to the mechanism; do not award the same point twice. Accept an accurate map/data interpretation where relevant.'],[1,2,1,2],True,'You do · short response',18)
 q('A student writes: “'+misconception+'” Explain why this statement is inaccurate or incomplete. Correct it and support your answer using this lesson’s case or worked method.',
   ['Identify the flaw without simply saying it is wrong: '+concept,'Explain the correction: '+mechanism,'Support the correction with a precise example or calculation: '+reasoning],[1,1,1],True,'You do · misconception repair',10)
 q(case+' Evaluate what conclusion or planning decision can reasonably be made from this evidence. Use one strength, one limitation, one alternative explanation or response, and a justified judgement. Propose evidence that would improve the decision.',
   ['Evidence-supported conclusion / method: '+reasoning,'Strength: explain what the supplied evidence or method can establish. Use the case, not an unrelated generic benefit. '+concept,'Limitation: explain a relevant uncertainty, trade-off or competing process. '+mechanism,'Alternative and judgement: give a defensible alternative explanation, method or response, compare it with the first and reach a conditional judgement consistent with the evidence. Accept supported alternative conclusions.','Further evidence: specify a measurable, dated and geographically relevant indicator, comparable observation or source; explain how it could confirm or change the judgement.'],[2,2,2,2,2],True,'You do · extended judgement',26,True)
 # Practical skills include a genuinely new numerical/location task.
 numeric={
 'Eastings, northings':('A point is 0.6 across from easting 24 toward 25 and 0.2 up from northing 60 toward 61. Write its four-figure and six-figure references.',['Read eastings first: 24, with sixth-tenth interpolation giving 246.','Read northings: 60, with second-tenth interpolation giving 602.','Area reference 2460; six-figure reference 246602.'],[1,1,1]),
 'Scale conversion':('On an original 1:25,000 map a route measures 8 cm. Calculate distance in km and travel time at an assumed constant 5 km/h.',['Distance = 8 × 25,000 cm = 200,000 cm.','Convert = 2 km.','Time = 2 ÷ 5 = 0.4 hours = 24 minutes.','Actual time may be longer due to slope, stops or surface; resizing invalidates the ratio scale unless compensated.'],[1,1,1,1]),
 'Area from':('A rectangle is 5 cm by 2 cm on an original 1:20,000 map. Calculate its area in km² and hectares.',['1 cm represents 0.2 km.','Dimensions are 1 km and 0.4 km.','Area is 0.4 km² = 40 hectares.'],[1,1,2]),
 'Gradient ratios':('A slope rises 75 m over 1.5 km horizontally. Calculate average gradient as 1:n. A profile uses horizontal 1:20,000 and vertical 1:2,000: calculate exaggeration.',['Convert horizontal distance: 1.5 km = 1,500 m.','Gradient = 1:(1,500/75) = 1:20.','Vertical exaggeration = 20,000/2,000 = 10.'],[1,1,1]),
 'Compass directions':('The outward whole-degree bearing is 135°. Give its compass direction, return bearing and return direction.',['135° is southeast (SE).','Reverse bearing = 135 + 180 = 315°.','315° is northwest (NW).'],[1,1,1]),
 'Change statistics':('Journey minutes are 8, 10, 10, 12, 25. Find mean, median, mode and range; explain which statistic is pulled upward by the longest journey.',['Sum = 65; mean = 65/5 = 13 minutes.','Median = 10; mode = 10.','Range = 25 − 8 = 17 minutes.','The mean is pulled upward by the 25-minute journey; the median is more resistant to this extreme.'],[1,2,1,1]),
 'Latitude, longitude':('Convert 32°15′S and 116°30′E to signed decimal degrees. Show the conversion.',['Latitude = −(32 + 15/60) = −32.25°.','Longitude = 116 + 30/60 = 116.5°.','Use 60 minutes per degree; state south negative, east positive.'],[1,1,1]),
 'Statistical maps':('Districts report 120 cases among 20,000 people and 150 cases among 50,000. Calculate each rate per 1,000 and choose the higher rate.',['First rate = 120/20,000 × 1,000 = 6 per 1,000.','Second rate = 150/50,000 × 1,000 = 3 per 1,000.','The first district has higher per-person reported incidence despite fewer cases.'],[1,1,1])}
 for prefix,(prompt,steps,alloc) in numeric.items():
  if title.startswith(prefix):q(prompt,steps,alloc,True,'You do · new practical task',12);break
 bank=[{'q':'Which statement accurately explains '+title.lower()+'?','o':[concept,misconception,'A place’s name alone establishes its processes and outcomes.'],'a':0,'why':mechanism},
 {'q':'Which interpretation follows from the supplied evidence?','o':[reasoning,'The evidence proves the same conclusion for every place and period.','No units, dates or geographical boundaries are needed.'],'a':0,'why':'Use this lesson’s evidence and method; do not generalise beyond them. '+reasoning},
 {'q':'Which statement is a misconception to correct?','o':[misconception,'A supported conclusion should identify its evidence and scope.','Methods should be appropriate to the question and data.'],'a':0,'why':concept+' '+mechanism},
 {'q':'What would make a geographical conclusion stronger?','o':['Comparable dated evidence, an explained mechanism and a stated limitation.','A single undated image and an unsupported opinion.','Only the most favourable evidence, with all conflicting results removed.'],'a':0,'why':'Reasoning needs appropriate geographical scale, comparable definitions and acknowledgement of uncertainty. In this lesson: '+keywords[0]+'.'}]
 # Numeric mastery uses unseen task and discriminates a common conversion error.
 if len(qs)>4:
  bank[-1]={'q':qs[-1]['prompt'],'o':[' · '.join(qs[-1]['steps']),'Use the map length directly as kilometres; omit unit conversion.','Reverse the numerator and denominator and omit the stated map scale.'],'a':0,'why':' · '.join(qs[-1]['steps'])}
 p=lambda s:'<p>'+colour(s,keywords)+'</p>'
 screens=[
 {'kind':'reference','title':'Do Now · retrieval and intentions','html':'<h3>Do Now · 3 minutes</h3><p>Without notes: define '+html.escape(keywords[0])+'. What evidence could help you recognise it in a place? Write a tentative explanation, then revise it after the lesson.</p><details><summary>Check your retrieval</summary>'+p(concept)+'</details><h3>Learning intentions</h3><ul>'+''.join('<li>'+html.escape(t)+'</li>' for t in intentions)+'</ul><p>35–50 minutes plus independent writing. Draw maps and diagrams on paper where needed.</p>'},
 {'kind':'learn','title':'I do · precise concept and vocabulary','html':p(concept)+'<h3>Keywords in context</h3><p>'+', '.join(colour(w,keywords) for w in keywords)+'. Use these terms to explain relationships, rather than inserting them as isolated labels.</p>'},
 {'kind':'learn','title':'I do · trace the process or method','html':p(mechanism)+'<p>Pause and annotate the chain or steps: what changes, what follows, and why? If the method uses numbers, keep the units and denominator visible.</p>'},
 {'kind':'learn','title':'Read the map or diagram','html':'<p>Read title, labels, arrows, scale and evidence note. Describe the pattern before explaining it. Which part supports this lesson’s reasoning, and which information is not shown?</p>','model':True},
 {'kind':'learn','title':'Case evidence · what is given and inferred','html':p(case)+'<p>Separate observations, classroom assumptions and inferences. Any scenario explicitly marked classroom or hypothetical is original teaching material, not a reported measurement of the named place.</p>'},
 {'kind':'check','title':'Check for understanding · concept','q':0},
 {'kind':'question','title':'I do · attempt the model question','q':0},
 {'kind':'solution','title':'I do · step-by-step model and marks','q':0},
 {'kind':'learn','title':'We do · interpret and qualify together','html':p(reasoning)+'<h3>Complete the reasoning aloud</h3><p>“The evidence shows ___; the process or method is ___; therefore ___; however ___.” Compare with a partner or the worked model, and identify a specific evidence limit.</p>'},
 {'kind':'activity','title':'We do · interactive evidence pathway'},
 {'kind':'check','title':'Check for understanding · evidence','q':1},
 {'kind':'learn','title':'We do · repair the misconception','html':'<blockquote>'+html.escape(misconception)+'</blockquote><p>Underline the claim that goes beyond the evidence. Replace it with a precise geographical explanation.</p><details><summary>Reveal the supported correction</summary>'+p(concept)+p(mechanism)+'</details>'}]
 for n in range(1,len(qs)):screens.append({'kind':'question','title':qs[n]['mode']+' · '+str(qs[n]['marks'])+' marks','q':n})
 screens +=[
 {'kind':'learn','title':'You do · retrieval and transfer','html':'<h3>Exit ticket</h3><ol><li>Explain '+html.escape(keywords[0])+' without notes.</li><li>State one precise observation or calculation from this lesson.</li><li>Explain what further evidence would change your conclusion.</li></ol><h3>Extension</h3><p>Apply the lesson to a different place or period. Identify one condition that differs and explain why the original conclusion might need revision. Use a dated source or clearly state hypothetical assumptions.</p>'},
 {'kind':'sources','title':'Sources, depth pathway and evidence notes','html':'<h3>Evidence and further inquiry</h3><ul>'+''.join('<li><a target="_blank" rel="noopener" href="'+SOURCES[k][1]+'">'+html.escape(SOURCES[k][0])+'</a></li>' for k in sources)+'</ul><p>Checked 11 October 2026. Use the 2026 syllabuses, not the separately listed 2027 Year 12 version. These are original practice lessons and suggested keys. Choose your teacher’s depth study: Unit 3 climate change or biodiversity; the optional lessons are labelled.</p><p>Diagrams are original educational models. Locator maps and schematic layouts are labelled and do not replace official maps, image products or fieldwork. Review source date, author, measurement and limitations before quoting statistics.</p>'}]
 lessons.append(dict(id=id,year=year,unit='Unit '+str(u)+' – '+UNITS[u],title=title,subtitle=' · '.join(keywords),scope='Explain → interpret evidence → justify a conclusion',outcomes=intentions,paragraphs=[concept,mechanism,case,reasoning],questions=qs,bank=bank,screens=screens,visual=visual,keywords=keywords,skill=skill,optional='Biodiversity option' in title,icon='🧭' if skill else ['','🌪️','🌐','🌿','🏙️'][u],model={'title':title+' · evidence and reasoning','rows':[['Concept',concept],['Mechanism / method',mechanism],['Evidence',case],['Interpretation',reasoning]]}))

for u in range(1,5):
 for row in rows_file(f'unit{u}.txt'):add(u,row)
 # Core skills start with hazards/networks and are revisited through senior contexts.
 skills=rows_file('skills.txt')
 for row in (skills[:8] if u in (1,3) else skills[8:]):add(u,row,True)
(ROOT/'geography-atar-course.js').write_text('/* Original 2026 Geography ATAR lessons; generated from geography-authoring. */\nwindow.GeographyATAR='+json.dumps(lessons,ensure_ascii=False,separators=(',',':'))+';\n')
counts={y:sum(m['year']==y for m in lessons) for y in ['11','12']}
text='# Geography ATAR — 2026 lesson coverage\n\n'+f"{counts['11']} Year 11 lessons; {counts['12']} Year 12 lessons; {sum(len(m['questions']) for m in lessons)} written tasks including worked models.\n\n"
text+='Each lesson: Do Now; explicit concept and method; relevant diagram; source-aware case; formative checks; attempted I do model and step-by-step marking table; guided We do interpretation and interactive practice; three or more You do tasks; printable writing space and separate key; retrieval, transfer and a four-question mastery concept check.\n\n'
text+='Units 1 and 2 use Yasi/dengue and coffee/football as teaching depth-study sequences. Unit 3 provides climate change with a separately labelled optional biodiversity sequence. Unit 4 covers Perth and Mumbai with two challenges each (transport and water), two strategies for each challenge and sustainability/liveability evaluation. Real context is linked to dated official sources; numerical scenarios are labelled classroom assumptions. Country comparisons and local demographic inquiries include source-led research tasks, not invented national statistics. Teachers should select and contextualise inquiry/fieldwork evidence.\n\n'
text+='Core mapping, remote sensing, statistics, GIS and ethical fieldwork skills are taught in Year 11 and revisited in Year 12. Reference Geography 2026 syllabus mapping/inquiry lists when scheduling repeated practice in every unit; skills are also embedded in content lessons. Unit 4 uses the descriptive navigation title “Planning sustainable places” for SCSA’s Places and their challenges.\n\n'
for u in range(1,5):
 text+='## Unit '+str(u)+' — '+UNITS[u]+'\n\n| Lesson | Focus |\n|---|---|\n'
 for m in lessons:
  if m['unit'].startswith('Unit '+str(u)+' '):text+='| '+m['title']+' | '+', '.join(m['keywords'])+' |\n'
 text+='\n'
text+='## Validation and boundaries\n\nOriginal suggested marking points accept equivalent justified answers. Marks are self-assessed; concept mastery and screen visits do not establish written exam mastery. Typed drafts save locally. Existing class completion remains student-reported through the site’s class workflow. Printable map sources remain visible; blank sketch boxes accompany relevant tasks.\n\n'
text+='## Signup / Firebase\n\nGeography ATAR is added to the same subject list used by signup, class tasks and course filtering. In Firebase Console → Firestore Database → Rules, replace the existing d.subjects.hasOnly(...) line with this exact line, then Publish. Preserve all surrounding rules.\n\n```text\n'+next(l.strip() for l in (ROOT/'firestore.rules').read_text().splitlines() if 'd.subjects.hasOnly' in l)+'\n```\n'
(ROOT/'GEOGRAPHY-ATAR-LESSONS.md').write_text(text)
print(json.dumps({'lessons':len(lessons),'years':counts,'tasks':sum(len(m['questions']) for m in lessons),'screens':sum(len(m['screens']) for m in lessons)},indent=2))
