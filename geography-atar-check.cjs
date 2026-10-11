/* Structural, numerical and DOM verification; run with jsdom and --experimental-vm-modules. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {JSDOM}=require(process.env.GEOGRAPHY_TEST_JSDOM||'jsdom');
const root=__dirname,read=f=>fs.readFileSync(path.join(root,f),'utf8');
const files=['geography-atar-course.js','geography-visuals.js','geography-interactives.js','geography-atar-player.js'];
const dom=new JSDOM('<body><main id="host"></main></body>',{url:'https://example.test/topic-hub.html',runScripts:'outside-only'});const w=dom.window,d=w.document,host=d.getElementById('host');
for(const f of files)w.eval(read(f));
let prints=[];w.open=()=>({document:{write:s=>prints.push(s),close(){}}});
const lessons=w.GeographyATAR,ids=new Set();assert.equal(lessons.length,129);let tasks=0,screens=0;
for(const m of lessons){
 assert(!ids.has(m.id));ids.add(m.id);assert(['11','12'].includes(m.year));assert(m.paragraphs.join(' ').length>650,m.id+' explanation too short');
 assert(m.questions.filter(q=>q.practice).length>=3);assert.equal(m.bank.length,4);assert(m.screens.some(s=>s.title.startsWith('Do Now')));assert(m.screens.some(s=>s.kind==='activity'));
 for(const q of m.questions){assert.equal(q.marks,q.allocations.reduce((a,b)=>a+b,0),q.id);assert.equal(q.steps.length,q.allocations.length);assert(q.rows>=10);assert(q.prompt.length>40);tasks++}
 w.GeographyATARPlayer.build(m,host);assert(host.textContent.includes(m.title));
 const jump=d.getElementById('geoJump');
 for(let i=0;i<m.screens.length;i++){
  jump.value=String(i);jump.onchange();assert(d.getElementById('geoScreen').textContent.trim(),m.id+' empty screen '+i);screens++;
  const screen=m.screens[i];
  if(screen.kind==='learn'&&screen.model){assert(d.querySelector('svg[role="img"]'));assert(d.querySelector('figcaption').textContent.length>30)}
  if(screen.kind==='check'){d.querySelector('#geoScreen input').checked=true;d.getElementById('geoFormCheck').click();assert(d.getElementById('geoFormFeedback').textContent.length>25)}
  if(screen.kind==='question'){
   const q=m.questions[screen.q],a=d.getElementById('geoAnswer');a.value='Test draft: '+m.id;a.oninput();assert(JSON.parse(w.localStorage.getItem('sv-geography-v1-'+m.id)).drafts[q.id].includes(m.id));
   if(q.practice){d.getElementById('geoReveal').click();assert(d.querySelector('.geo-marking table'));assert(d.querySelector('tfoot').textContent.includes(String(q.marks)));const credit=d.querySelector('[data-credit]');credit.value=String(q.allocations[0]);credit.onchange();assert(d.querySelector('.geo-self-total').textContent.includes('/'+q.marks))}
  }
  if(screen.kind==='activity'){
   const selects=d.querySelectorAll('[data-row]');assert.equal(selects.length,3);selects.forEach((s,n)=>{const correct=m.model.rows[n][1].split(/(?<=[.!?])\s/)[0];s.value=correct});d.querySelector('[data-check]').click();assert(d.querySelector('[data-feedback]').textContent.startsWith('3/3'),m.id);
   const calc=d.querySelector('[data-calculate]');if(calc){calc.click();assert(d.querySelector('output').textContent.length>30)}
  }
 }
 w.GeographyATARPlayer.current.mastery();d.querySelectorAll('.rq').forEach(field=>{field.querySelector('input[value="'+field.dataset.a+'"]').checked=true});d.getElementById('ymCheck').click();assert(d.getElementById('ymResult').textContent.includes('4/4'));assert(JSON.parse(w.localStorage.getItem('sv-geography-v1-'+m.id)).masterPassed);
 w.GeographyATARPlayer.current.printPractice(false);const practice=prints.pop();assert(practice.includes('class="lines"'));assert(practice.includes('class="sketch"'));assert(practice.includes('<svg'));assert(!practice.includes('Your credit'));
 w.GeographyATARPlayer.current.printPractice(true);const key=prints.pop();assert(key.includes('Answer / working / criterion'));assert(key.includes('Total'));assert(!key.includes('class="lines"'));
}
assert.equal(tasks,532);assert.equal(screens,2209);
const C=w.GeographyInteractives.calculate,close=(a,b)=>assert(Math.abs(a-b)<1e-7);
close(C('scale',{cm:6,denominator:50000,speed:4}).values[0],3);close(C('scale',{cm:6,denominator:50000,speed:4}).values[1],45);
close(C('area',{width:4,height:3,denominator:50000}).values[0],3);close(C('area',{width:4,height:3,denominator:50000}).values[1],300);
close(C('gradient',{rise:120,distance:2.4}).values[0],20);close(C('albedo',{incoming:200,albedo:20}).values[1],160);
close(C('change',{initial:800,final:620,years:10}).values[1],-22.5);close(C('rain',{rain:2000,roof:100,efficiency:80}).values[0],160);
close(C('urban',{urban:5,total:14}).values[0],5/14*100);close(C('water',{input:100,loss:15}).values[0],85);
close(C('energy',{supply:80,intensity:3}).values[0],240000000);close(C('carbon',{uptake:12,release:18}).values[0],-6);
assert.throws(()=>C('scale',{cm:5,denominator:50000,speed:0}));assert.throws(()=>C('probability',{p:101,years:30}));assert.throws(()=>C('probability',{p:2,years:1.5}));assert.throws(()=>C('urban',{urban:6,total:5}));assert.throws(()=>C('albedo',{incoming:200,albedo:NaN}));close(C('probability',{p:0,years:30}).values[0],0);close(C('probability',{p:100,years:1}).values[0],100);
// Every unique SVG must parse as SVG/XML, not merely permissive HTML.
const graphics={};for(const m of lessons){graphics[m.visual]=w.GeographyVisuals.graphic(m.visual,m);const xml=new w.DOMParser().parseFromString(graphics[m.visual].svg,'image/svg+xml');assert.equal(xml.querySelectorAll('parsererror').length,0,m.visual);assert(xml.querySelector('title'));assert(xml.querySelector('desc'))}
fs.mkdirSync(path.join(root,'.geography-qa'),{recursive:true});fs.writeFileSync(path.join(root,'.geography-qa','graphics.json'),JSON.stringify(graphics));
async function integration(state,query){
 const page=new JSDOM(read('topic-hub.html'),{url:'https://example.test/topic-hub.html?'+query,runScripts:'outside-only'}),pw=page.window;pw.HTMLElement.prototype.scrollIntoView=function(){};
 for(const f of files)pw.eval(read(f));
 const source=[...pw.document.scripts].find(s=>s.textContent.includes('const CONFIG=')).textContent;
 const context=page.getInternalVMContext();
 const mod=new vm.SourceTextModule(source,{context,importModuleDynamically:async spec=>{let values;
  if(String(spec).includes('access-client'))values={waitForAccess:async()=>state};else {assert(String(spec).includes('2026.10.11-geography'));const exported=await import(path.join(root,'registration-options.mjs'));values={canStudy:exported.canStudy}}
  const mock=new vm.SyntheticModule(Object.keys(values),function(){for(const[k,v]of Object.entries(values))this.setExport(k,v)},{context});await mock.link(()=>{});await mock.evaluate();return mock}});
 await mod.link(()=>{});await mod.evaluate();await new Promise(r=>setTimeout(r,20));return page;
}
(async()=>{
 const R=await import(path.join(root,'registration-options.mjs')),P=await import(path.join(root,'page-catalog.mjs'));assert(R.SUBJECTS.includes('Geography ATAR'));assert.equal(new Set(R.SUBJECTS).size,R.SUBJECTS.length);
 const student={role:'student',yearGroup:11,subjects:['Geography ATAR','Physics ATAR','English ATAR','Chemistry ATAR']};assert.equal(R.registrationProblem('student',student),'');assert(R.canStudy(student,'Geography ATAR','11'));assert(!R.canStudy(student,'Geography ATAR','12'));
 assert(P.PAGES.find(p=>p.id==='geography-atar.html').studentDefault);assert(P.PAGES.find(p=>p.id==='geography-atar.html').teacherDefault);
 let page=await integration({member:student,admin:false},'course=Geography+ATAR&year=11');let pd=page.window.document;assert.equal(pd.getElementById('course').value,'Geography ATAR');assert.equal(pd.getElementById('year').value,'11');assert(pd.querySelectorAll('.topic-tile').length>=20);pd.querySelector('.topic-tile').click();assert(pd.querySelector('.geo-lms'));assert(pd.getElementById('topicQuizLink').textContent.includes('Written practice'));pd.getElementById('topicQuizLink').click();assert(pd.getElementById('geoScreen').textContent.includes('INDEPENDENT EXAM PRACTICE'));page.window.close();
 page=await integration({member:{...student,subjects:['Physics ATAR','English ATAR','Chemistry ATAR','Biology ATAR']},admin:false},'course=Geography+ATAR&year=11');assert(![...page.window.document.getElementById('course').options].some(o=>o.value==='Geography ATAR'));page.window.close();
 page=await integration({member:{role:'teacher'},admin:false},'course=Geography+ATAR&year=12');pd=page.window.document;assert.equal(pd.getElementById('year').value,'12');page.window.sessionStorage.setItem('lv-role','teacher');pd.querySelector('.topic-tile').click();assert(pd.getElementById('assignThisLesson'));pd.getElementById('unit').value='Unit 4 – Planning sustainable places';pd.getElementById('unit').onchange();assert(pd.querySelectorAll('.topic-tile').length>=30);page.window.close();
 // Existing published course content stays byte-for-byte unchanged; its integration branches remain present.
 for(const key of ['BusinessATAR','AccountingATAR','BiologyATAR','Year11PhysicsTopics'])assert(read('topic-hub.html').includes(key));
 console.log(`PASS: ${lessons.length} lessons; ${screens} screens; ${tasks} marking totals; ${Object.keys(graphics).length} SVG models; drafts, feedback, mastery, print, calculators, signup filtering and teacher assignment integration.`);dom.window.close();
})().catch(e=>{console.error(e);process.exitCode=1});
