import assert from 'node:assert/strict';
import * as C from '../learning-pathway-core.mjs';
const now=1000000000,questions=[];
for(const subject of ['Chemistry','Human Biology'])for(const year of [11,12])for(const topic of ['Atomic structure','Bonding','Moles'])for(let n=0;n<9;n++)questions.push([subject,year,topic,'Question '+n,['a','b'],0,'',{id:subject+year+topic+n,markingMode:'automatic',topics:[topic],types:['Multiple choice']}]);
questions.push(['Chemistry',11,'Written','Explain',[],null,'',{id:'written',markingMode:'manual',topics:['Written']}]);
const allowed=(s,y)=>s==='Chemistry'&&y===11;
const pool=C.candidates(questions,allowed);
assert.equal(pool.length,27);assert(pool.every(x=>x.subject==='Chemistry'&&x.year===11));
const model=C.fresh();model.session=C.diagnostic(pool,now);
assert.equal(model.session.entries.length,3);assert.equal(new Set(model.session.entries.map(x=>x.question)).size,3);
for(const [i,entry]of model.session.entries.entries()){C.record(model,entry,'diagnostic',i!==0,now);model.session.answers[entry.question]=i!==0}
const first=model.session.entries[0].skill;C.finish(model,now);
assert.equal(C.status(model.skills[first],now),'Needs review');assert.equal(model.session,null);
const training=C.targeted(pool,model.skills[first],'practice',now+1);assert(training);assert(!training.entries.some(e=>model.skills[first].evidence.some(a=>a.question===e.question)));
model.session=training;
for(const e of training.entries){C.record(model,e,'practice',true,now+2);training.answers[e.question]=true}
C.finish(model,now+2);assert.equal(model.skills[first].secure,false);assert.equal(C.status(model.skills[first],now+2),'Developing');
assert.equal(C.targeted(pool,model.skills[first],'recheck',now+3),null);
const review=C.targeted(pool,model.skills[first],'recheck',now+2+C.DAY);assert.equal(review.entries.length,2);
assert(review.entries.every(e=>!model.skills[first].evidence.some(a=>a.question===e.question)));
model.session=review;
for(const e of review.entries){C.record(model,e,'recheck',true,now+2+C.DAY);review.answers[e.question]=true}
C.finish(model,now+2+C.DAY);assert.equal(C.status(model.skills[first],now+2+C.DAY),'Secure');assert.equal(model.skills[first].due,now+2+8*C.DAY);
assert.equal(C.status(model.skills[first],now+2+8*C.DAY),'Follow-up due');
const small=pool.filter(x=>x.topics.includes(model.skills[first].topic)).slice(0,2);
assert.equal(C.targeted(small,model.skills[first],'recheck',now+20*C.DAY),null);
assert.equal(C.lessonScore('Chemical bonding and structure','Ionic and covalent bonding'),3);
assert.equal(Object.keys(C.clean({version:1,skills:{bad:{subject:'X',year:1,topic:'y',evidence:[]}}}).skills).length,0);
const {read,save}=await import('../learning-pathway-store.mjs');
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};globalThis.window={dispatchEvent(){}};
assert(save('alice',model));assert.equal(Object.keys(read('bob').skills).length,0);assert.equal(Object.keys(read('alice').skills).length,3);
assert.equal(save(null,model),false);assert.equal(Object.keys(read(null).skills).length,0);
localStorage.setItem=()=>{throw Error('full')};assert.equal(save('alice',model),false);
console.log('PASS: balanced diagnostics, subject/year restrictions, written exclusion, fresh targeted questions, delayed two-question follow-up, secure/review schedule, sparse banks, lesson matching, account isolation and save failures.');
