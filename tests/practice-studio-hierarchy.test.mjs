import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
const source=readFileSync(new URL('../practice-studio-hierarchy.js',import.meta.url),'utf8');const c=vm.createContext({});vm.runInContext(source,c);const H=c.PracticeStudioHierarchy;
const q=(subject,year,topics)=>[subject,year,'Fallback skill','',[],null,'',{topics}];
const all=[q('Physics',11,['Electricity','Motion']),q('Physics',12,['Electromagnetism']),q('Chemistry',11,['Bonding']),q('Mathematics',7,['Number','Probability']),q('Mathematics',7,['Probability']),q('Mathematics',8,['Algebra']),q('Mathematics',10,['Algebra']),q('Human Biology',12,['Homeostasis'])];
test('approved membership is applied before year and subject choices and defaults to no access',()=>{
 assert.equal(H.approved(all).length,0);const rows=H.approved(all,(subject,year)=>subject==='Mathematics'&&year===7);assert.deepEqual(Array.from(H.years(rows)),[7]);assert.deepEqual(Array.from(H.subjects(rows,7)),['Mathematics']);assert.equal(H.subjects(rows,8).length,0);assert.equal(H.topics(rows,7,'Physics').length,0);
});
test('browsing moves through year then subject then topic with explicit choices',()=>{
 assert.equal(H.stage('all','all'),'year');assert.equal(H.stage('all','Physics'),'year');assert.equal(H.stage(8,'all'),'subject');assert.equal(H.stage(8,'Mathematics'),'topic');assert.equal(H.stage(6,'Mathematics'),'year');assert.equal(H.stage(13,'Physics'),'year');
});
test('subjects and topic counts are restricted to the selected year and subject',()=>{
 assert.deepEqual(Array.from(H.years(all)),[7,8,10,11,12]);assert.deepEqual(Array.from(H.subjects(all,11)),['Chemistry','Physics']);assert.deepEqual(Array.from(H.subjects(all,7)),['Mathematics']);
 assert.deepEqual(JSON.parse(JSON.stringify(H.topics(all,7,'Mathematics'))),[{name:'Number',count:1},{name:'Probability',count:2}]);assert.deepEqual(JSON.parse(JSON.stringify(H.topics(all,12,'Physics'))),[{name:'Electromagnetism',count:1}]);assert.equal(H.topics(all,11,'Human Biology').length,0);
});
test('duplicate topic tags are counted once per question and source order is unchanged',()=>{
 const rows=[q('Mathematics',9,['Algebra','Algebra']),q('Mathematics',9,[])],before=JSON.stringify(rows);assert.deepEqual(JSON.parse(JSON.stringify(H.topics(rows,9,'Mathematics'))),[{name:'Algebra',count:1},{name:'Fallback skill',count:1}]);assert.equal(JSON.stringify(rows),before);
});
// Small DOM fixture exercises navigation event handlers without changing account access.
function fixture(search=''){
 const nodes=new Map();class E{
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.style={};this.hidden=false;this.disabled=false;this.value='';this.attributes={};this.parentElement=null;this._text='';}
  set id(v){this._id=v;nodes.set(v,this)}get id(){return this._id}set textContent(v){this._text=v;this.children=[];}get textContent(){return this._text}get firstChild(){if(!this.children.length)this.children.push({textContent:this._text});return this.children[0]}
  append(...ns){for(let n of ns){if(typeof n==='string')n={textContent:n};n.parentElement=this;this.children.push(n)}}replaceChildren(...ns){this.children=[];this.append(...ns)}
  setAttribute(k,v){this.attributes[k]=v;if(k==='hidden')this.hidden=true}before(){}after(){}focus(){this.focused=true}scrollIntoView(){}
 }
 const make=(tag,id)=>{const x=new E(tag);if(id)x.id=id;return x};const ids=['year','topic-filter','subtopic-filter','type-filter','exam-filter','search','content','section-title','section-sub','mixed-filter','auto-filter'];ids.forEach(id=>make(id.includes('filter')||id==='year'?'select':'div',id));nodes.get('year').value='all';const topicLabel=make('label');topicLabel.textContent='Topic';topicLabel.append(nodes.get('topic-filter'));
 const tabs=make('div'),db=make('section'),practice=make('button');let database=false;
 const location={href:'https://example.test/student-quiz.html'+search,search};const ctx={questions:all,filter:'all',view:'dashboard',physicsLoaded:true,URL,URLSearchParams,location,history:{replaceState(a,b,url){location.href=String(url);location.search=new URL(String(url)).search}},document:{createElement:t=>make(t),querySelector:s=>s==='.tabs'?tabs:s==='.studio-database'?db:s==='[data-view=practice]'?practice:null,body:{classList:{contains:()=>database}},head:make('head')},controls:make('div'),topicPicker:make('section'),$:id=>nodes.get(id),window:{studioCanStudy:(s,y)=>s==='Mathematics'&&[7,8].includes(y)},startCalls:0};
 ctx.eligible=()=>ctx.questions.map((q,i)=>({q,i})).filter(({q})=>ctx.window.studioCanStudy(q[0],q[1])&&(ctx.filter==='all'||ctx.filter===q[0])&&(nodes.get('year').value==='all'||Number(nodes.get('year').value)===q[1]));ctx.start=()=>ctx.startCalls++;ctx.render=()=>{nodes.get('content').hidden=false;db.hidden=false;ctx.controls.hidden=false};practice.click=()=>{ctx.view='practice';ctx.render()};vm.createContext(ctx);vm.runInContext(source,ctx);return{ctx,nodes,db,setDatabase:v=>{database=v}};
}
test('year change resets subject and topics; practice cannot start before the subject is chosen',()=>{
 const {ctx,nodes}=fixture();assert.equal(nodes.get('hierarchy-subject').disabled,true);assert.equal(ctx.eligible().length,0);ctx.start();assert.equal(ctx.startCalls,0);
 nodes.get('year').value='7';nodes.get('year').onchange();assert.equal(ctx.filter,'all');assert.equal(nodes.get('hierarchy-subject').disabled,false);assert.equal(nodes.get('topic-filter').disabled,true);
 nodes.get('hierarchy-subject').value='Mathematics';nodes.get('hierarchy-subject').onchange();assert.equal(ctx.view,'practice');assert.equal(ctx.eligible().length,2);assert.equal(nodes.get('topic-filter').disabled,false);ctx.start();assert.equal(ctx.startCalls,1);
 nodes.get('topic-filter').value='Probability';nodes.get('year').value='8';nodes.get('year').onchange();assert.equal(ctx.filter,'all');assert.equal(nodes.get('topic-filter').value,'');assert.equal(ctx.eligible().length,0);
});
test('database table is hidden until year and subject are selected, and deep links restore an approved selection',()=>{
 const f=fixture();f.setDatabase(true);f.ctx.view='practice';f.ctx.render();assert.equal(f.db.hidden,true);
 f.nodes.get('year').value='7';f.nodes.get('year').onchange();f.nodes.get('hierarchy-subject').value='Mathematics';f.nodes.get('hierarchy-subject').onchange();assert.equal(f.db.hidden,false);
 const g=fixture('?year=8&subject=Mathematics');assert.equal(g.nodes.get('year').value,'8');assert.equal(g.ctx.filter,'Mathematics');assert.equal(g.ctx.eligible().length,1);
});
test('teacher-assigned assessment routes retain their existing sequence and do not enter the browse gate',()=>{
 const {ctx,nodes}=fixture('?class=class-id&task=task-id');assert.equal(nodes.get('studio-hierarchy').hidden,true);assert.equal(ctx.eligible().length,3);ctx.start();assert.equal(ctx.startCalls,1);
});
