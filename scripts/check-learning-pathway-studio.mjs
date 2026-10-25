import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import * as core from '../learning-pathway-core.mjs';
const all=[],ids={};class E{
 constructor(tag='div'){this.tag=tag;this.children=[];this.value='';this.hidden=false;this.dataset={};this.className='';this.textContent='';all.push(this)}
 append(...nodes){for(const n of nodes){this.children.push(n);n.parent=this}}replaceChildren(...nodes){this.children=[];this.append(...nodes)}
 setAttribute(k,v){this[k]=v}after(n){n.parent=this.parent}before(n){n.parent=this.parent}remove(){this.removed=true}scrollIntoView(){}get options(){return this.children.filter(x=>x.tag==='option')}
}
for(const name of ['year','modal','qtext','feedback','check']){ids[name]=new E();ids[name].id=name}ids.year.value='11';ids.modal.hidden=true;
const stats=new E(),memory=new Map();let accessFn;
const questions=[];for(const topic of ['Atomic structure','Bonding','Moles'])for(let n=0;n<9;n++)questions.push(['Chemistry',11,topic,'Q'+n,['a','b'],0,'',{id:topic+n,topics:[topic],markingMode:'automatic'}]);
const client={observeAccess(fn){accessFn=fn;fn({ready:true,user:{uid:'alice'},member:{status:'active'}})}};
const store={read(uid){return core.clean(memory.get(uid))},save(uid,m){memory.set(uid,JSON.parse(JSON.stringify(m)));return true}};
const win={__modules:[core,store,client],studioCanStudy:(s,y)=>s==='Chemistry'&&y===11,events:{},addEventListener(k,fn){this.events[k]=fn}};
const ctx={console,Date,URLSearchParams,location:{search:''},window:win,document:{createElement:tag=>new E(tag),querySelector:s=>s==='.stats'?stats:null,getElementById:id=>all.findLast(x=>x.id===id&&!x.removed)||null},questions,state:{attempts:[]},filter:'Chemistry',physicsLoaded:true,current:0,checked:false,chosen:null,$:id=>ids[id],render(){},closePlayer(){ids.modal.hidden=true},openQuestion:async function(i){ctx.current=i;ctx.checked=false;ctx.chosen=null;ids.modal.hidden=false},check(){if(ctx.checked)return;ctx.checked=true;ctx.state.attempts.push({id:ctx.current,correct:ctx.chosen===0,time:Date.now()})}};
vm.createContext(ctx);
const src=fs.readFileSync(new URL('../learning-pathway-studio.js',import.meta.url),'utf8').replace(/const \[core,store,client\]=await Promise.all\(\[.*?\]\);/,'const [core,store,client]=window.__modules;');
await vm.runInContext(src,ctx);
const flush=async()=>{for(let i=0;i<15;i++)await Promise.resolve()};
const button=text=>all.findLast(x=>x.tag==='button'&&x.textContent===text);
button('Start diagnostic').onclick();await flush();assert.equal(ids.modal.hidden,false);
for(let i=0;i<3;i++){ctx.chosen=i===0?1:0;ctx.check();assert.match(ids.check.textContent,/session/);ctx.check();await flush()}
assert.equal(ids.modal.hidden,true);assert.equal(memory.get('alice').session,null);assert.equal(Object.keys(memory.get('alice').skills).length,3);
assert(all.some(x=>x.textContent==='Needs review'));
const link=all.findLast(x=>x.tag==='a'&&x.textContent==='Find a lesson');assert(link.href.includes('pathwaySkill=')&&link.href.includes('year=11'));
button('Targeted practice').onclick();await flush();const baselineIDs=Object.values(memory.get('alice').skills).flatMap(s=>s.evidence).map(e=>e.question);
assert(!baselineIDs.includes(questions[ctx.current][7].id));
ctx.chosen=0;ctx.check();ctx.closePlayer();assert.equal(button('Resume session').hidden,false);
button('Resume session').onclick();await flush();assert.equal(ids.modal.hidden,false);assert.equal(memory.get('alice').session.cursor,1);
button('End session').onclick();assert.equal(memory.get('alice').session,null);
accessFn({ready:true,user:{uid:'bob'},member:{status:'active'}});assert.equal(button('Resume session').hidden,true);
assert.equal(memory.get('alice').skills[JSON.stringify(['Chemistry',11,'Atomic structure'])].baseline,false);
console.log('PASS: Studio diagnostic modal queue, score recording, lesson links, new targeted question, pause/resume, explicit end, and account switching.');
