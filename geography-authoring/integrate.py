from pathlib import Path
import json,re
R=Path(__file__).resolve().parent.parent
stamp='2026.10.11-geography'
# All registration consumers share one versioned subject definition.
for f in ['registration-options.mjs','firestore.rules']:
 p=R/f;s=p.read_text();assert "['Business Management and Enterprise ATAR'" in s;s=s.replace("['Business Management and Enterprise ATAR'","['Geography ATAR','Business Management and Enterprise ATAR'");p.write_text(s)
for p in R.glob('*'):
 if p.suffix not in ['.mjs','.html','.js']:continue
 s=p.read_text()
 if "./registration-options.mjs'" in s or './registration-options.mjs"' in s:
  s=s.replace('./registration-options.mjs\'', './registration-options.mjs?v='+stamp+'\'').replace('./registration-options.mjs"','./registration-options.mjs?v='+stamp+'"');p.write_text(s)
# Geography lessons use the same course/subject gating and assign-to-class workflow.
p=R/'topic-hub.html';s=p.read_text()
links='<link rel="stylesheet" href="geography-atar.css?v='+stamp+'">'+''.join('<script src="'+f+'?v='+stamp+'"></script>' for f in ['geography-visuals.js','geography-interactives.js','geography-atar-course.js','geography-atar-player.js'])
s=s.replace('</head>',links+'</head>',1)
config={'years':['11','12'],'units':{'11':['Unit 1 – Natural and ecological hazards','Unit 2 – Global networks and interconnections'],'12':['Unit 3 – Global environmental change','Unit 4 – Planning sustainable places']}}
s=s.replace('const CONFIG={','const CONFIG={\'Geography ATAR\':'+json.dumps(config,ensure_ascii=False)+',',1)
s=s.replace("if(['Business Management", "if(['Geography ATAR','Business Management",1)
s=s.replace("{'Business Management and Enterprise ATAR':'BusinessATARPlayer'", "{'Geography ATAR':'GeographyATARPlayer','Business Management and Enterprise ATAR':'BusinessATARPlayer'")
anchor="if(c==='Business Management and Enterprise ATAR')"
s=s.replace(anchor,"if(c==='Geography ATAR'){const list=(window.GeographyATAR||[]).filter(m=>m.year===y&&m.unit===u);seniorRender(list,openGeographyTopic,u);return}"+anchor,1)
func="function openGeographyTopic(t){syncTopicLinks(t.id);window.vaultCurrentTopic={id:t.id,title:t.title};document.body.classList.add('senior-lms-open');topics.classList.add('hidden');topics.style.display='none';lesson.classList.remove('hidden');lesson.style.display='block';GeographyATARPlayer.build(t,lessonContent);lesson.scrollIntoView({behavior:'smooth'});offerTeacherAssignment(t)}"
s=s.replace('function openBusinessTopic(t)',func+'function openBusinessTopic(t)',1)
s=s.replace('access-bootstrap.js?v=2026.10.11-business','access-bootstrap.js?v='+stamp)
p.write_text(s)
# Landing page is an accessible course overview. Actual year/subject lesson access remains gated in topic-hub.
s=(R/'business-atar.html').read_text()
s=s.replace('Business Management and Enterprise ATAR','Geography ATAR').replace('Business ATAR','Geography ATAR').replace('business-atar','geography-atar').replace('BUSINESS','GEOGRAPHY').replace('Business+Management+and+Enterprise+ATAR','Geography+ATAR')
s=s.replace('Understand business.<br>Decide with evidence.','Read places.<br>Explain change with evidence.')
s=s.replace('102 focused lessons · 372 written tasks','129 focused lessons · 532 written tasks').replace('51 focused lessons','56 focused lessons',1).replace('51 focused lessons','73 focused lessons',1)
s=s.replace('National business success','Natural and ecological hazards').replace('National business growth','Global networks and interconnections').replace('Strategic international growth','Global environmental change').replace('Global business operations','Planning sustainable places')
s=re.sub(r'<p>Move from national.*?</p>','<p>Explore hazards, global networks, environmental change and sustainable urban places. Read relevant maps and diagrams, trace processes, practise calculations and defend conclusions with place-specific evidence.</p>',s)
s=re.sub(r'<p>Each lesson begins.*?</p>','<p>Each focused lesson begins with a Do Now and intentions, then I do explanations, a map or diagram, formative checks and an attempted worked model with a marking table. We do evidence interpretation and interactive practice prepare you for You do written tasks, retrieval and a mastery concept check.</p>',s)
s=re.sub(r'<p>Use case evidence.*?</p>','<p>Use geographical language, units, mapped evidence and justified conclusions. Typed answers save on this browser. Print practice includes lined writing space and a map/diagram; Print marking guide gives a separate step-by-step table. Concept mastery and self-assessed marks are practice evidence, not a teacher-verified exam grade.</p>',s)
s=re.sub(r'<p>Aligned to the 2026.*?</p>','<p>Year 11 depth sequences cover Yasi and dengue, coffee and football. Year 12 covers climate change plus a separately labelled biodiversity option, and Perth/Mumbai transport and water challenges. Follow your teacher’s chosen depth study. Core mapping, statistics, remote sensing, GIS and ethical fieldwork are taught and revisited.</p><p>Original classroom values are labelled; official sources supply real case context. Schematic locator maps are teaching aids, with their limits stated. Use official maps, image products and local fieldwork for full inquiries.</p>',s)
s=s.replace('humanities-and-social-sciences/business-management-and-enterprise','humanities-and-social-sciences/geography').replace('BUSINESS-ATAR-LESSONS.md','GEOGRAPHY-ATAR-LESSONS.md').replace('specification booklet and past papers','support materials and past papers').replace('access-bootstrap.js?v=2026.10.11-business','access-bootstrap.js?v='+stamp)
(R/'geography-atar.html').write_text(s)
p=R/'topic-hubs.html';s=p.read_text();card='<section class="hub"><span class="eyebrow">ATAR GEOGRAPHY</span><h2>Geography ATAR</h2><p>Read maps, explain hazards and global change, and evaluate sustainable urban planning. Detailed I–We–You lessons, interactive models, original exam practice and printable marking guides.</p><div class="actions"><a class="action primary" href="geography-atar.html"><strong>Open Geography ATAR</strong><small>56 Year 11 lessons · 73 Year 12 lessons · Maps and writing space</small></a></div></section>'
s=s.replace('<section class="hub"><span class="eyebrow">ATAR BUSINESS',card+'<section class="hub"><span class="eyebrow">ATAR BUSINESS',1);s=s.replace('access-bootstrap.js?v=2026.10.9-classes','access-bootstrap.js?v='+stamp);p.write_text(s)
p=R/'page-catalog.mjs';s=p.read_text().replace('export const PAGES=[','export const PAGES=['+json.dumps({'id':'geography-atar.html','label':'Geography ATAR','group':'Learning and general pages','studentDefault':True,'teacherDefault':True})+',',1);p.write_text(s)
p=R/'page-catalog-builder.py';s=p.read_text().replace("student={'index.html'", "student={'geography-atar.html','index.html'").replace("name in {'teacher-area.html','topic-hub.html'", "name in {'geography-atar.html','teacher-area.html','topic-hub.html'");p.write_text(s)
p=R/'access-bootstrap.js';p.write_text(p.read_text().replace('page-catalog.mjs?v=2026.10.11-business','page-catalog.mjs?v='+stamp))
# Explicit cache refresh for account/teacher module consumers.
for f in ['account.html','teacher-classes.html','student-area.html','topic-hub.html']:
 p=R/f;s=p.read_text()
 for module in ['account.mjs','teacher-classes.mjs','student-dashboard.mjs','learning-progress.mjs']:
  s=re.sub(re.escape(module)+r'(?:\?v=[^"\']+)?',module+'?v='+stamp,s)
 p.write_text(s)
# Existing HASS senior resource page gets a route to lessons without changing its resource catalogue.
p=R/'senior.html';s=p.read_text();needle="function render()";print('senior integration deferred to explicit link if no course route', 'Geography' in s)
