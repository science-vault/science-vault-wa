/* Rebuild after lesson authoring: NODE_PATH=<jsdom node_modules> node scripts/build-lesson-task-catalog.cjs */
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..');
const dom=new JSDOM(fs.readFileSync(path.join(root,'topic-hub.html'),'utf8'),{url:'https://science-vault.github.io/science-vault-wa/topic-hub.html',runScripts:'outside-only',pretendToBeVisual:true});
dom.window.requestAnimationFrame=()=>0;
dom.window.document.write=html=>{const source=html.match(/src=["']([^"']+)/)?.[1]?.split('?')[0];if(source)dom.window.eval(fs.readFileSync(path.join(root,source),'utf8'))};
for(const tag of dom.window.document.querySelectorAll('script[src]:not([type="module"])')){
 const file=tag.getAttribute('src').split('?')[0];
 if(/access-bootstrap|site-shell|lesson-task/.test(file))continue;
 dom.window.eval(fs.readFileSync(path.join(root,file),'utf8'));
}
const tasks=[],seen=new Set();
function add(m,course,year,unit){
 year=Number(year);const id=JSON.stringify([course,year,unit,m.id]);if(seen.has(id))throw Error('Duplicate lesson '+id);seen.add(id);
 const focus=String(m.scope||m.subtitle||m.description||m.aim||m.title).replace(/<[^>]*>/g,'').trim();
 const instructions=`Focus: ${focus}\n1. Learn: complete the opening retrieval / Do Now where available, then study the explanations, models and worked examples.\n2. Practise: attempt the guided and independent questions before revealing solutions. Show your reasoning and use the marking points to correct your work.\n3. Check: complete the lesson mastery review, use feedback and retry. Record one improvement in your notes. Completion is student-reported; a concept check is not a complete exam grade.`.slice(0,2000);
 const params=new URLSearchParams({course,year:String(year),unit,topic:m.id});
 tasks.push({id,topic:m.id,title:m.title,course,yearGroup:year,unit,focus,instructions,url:'topic-hub.html?'+params,minutes:0});
}
for(const [key,course] of Object.entries({GeographyATAR:'Geography ATAR',BusinessATAR:'Business Management and Enterprise ATAR',AccountingATAR:'Accounting and Finance ATAR',PEATAR:'Physical Education Studies ATAR',EnglishATAR:'English ATAR',ApplicationsATAR:'Mathematics Applications ATAR',MethodsATAR:'Mathematics Methods ATAR',SpecialistATAR:'Mathematics Specialist ATAR',ChemistryATAR:'Chemistry ATAR',PsychologyATAR:'Psychology ATAR',BiologyATAR:'Biology ATAR',HumanBiologyATAR:'Human Biology ATAR'})){
 if(!Array.isArray(dom.window[key]))throw Error('Missing lessons '+key);
 for(const m of dom.window[key])add(m,course,m.year,m.unit);
}
for(const year of [11,12])for(const [unit,cat]of Object.entries(dom.window['Year'+year+'PhysicsTopics']||{}))for(const m of Array.isArray(cat)?cat:cat.topics||[])add(m,'Physics ATAR',year,unit);
for(const year of [7,8,9,10])for(const [unit,list]of Object.entries(dom.window['Year'+year+'ScienceTopics']||{}))for(const m of list)add(m,'Science',year,unit);
// Roll out one subject at a time, after teacher review.
const published=tasks.filter(t=>['Geography ATAR'].includes(t.course));
fs.writeFileSync(path.join(root,'lesson-task-catalog.json'),JSON.stringify({version:1,tasks:published},null,2)+'\n');
console.log('Prebuilt lesson tasks:',published.length,'Courses:',new Set(published.map(t=>t.course)).size);dom.window.close();
