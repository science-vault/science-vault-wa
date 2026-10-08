/* Structural, source-integrity and exam-model checks; standard Node only. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),root=__dirname;
const ctx={window:{}};vm.createContext(ctx);
for(const f of ['english-visuals.js','english-texts.js','english-atar-course.js'])vm.runInContext(fs.readFileSync(root+'/'+f,'utf8'),ctx,{filename:f});
const {EnglishATAR:ms,EnglishVisuals:vs,EnglishTexts:ts}=ctx.window;
assert.equal(ms.length,48);assert.equal(Object.keys(vs).length,14);assert.equal(Object.keys(ts.texts).length,18);
assert.equal(new Set(ms.map(m=>m.id)).size,48);
let screens=0,tasks=0,worked=0,extended=0;const qids=new Set();
for(const m of ms){
 assert.ok(m.year==='11'||m.year==='12');assert.ok(m.unit.startsWith('Unit '));assert.ok(m.title&&m.scope&&m.outcomes.length);
 assert.equal(m.screens.filter(s=>s.kind==='learn').length,4);assert.equal(m.bank.length,2);
 assert.equal(m.questions.filter(q=>!q.practice).length,2);
 for(const b of m.bank){assert.equal(b.o.length,4);assert.ok(b.a>=0&&b.a<b.o.length);assert.ok(b.why.length>30)}
 for(const s of m.screens){screens++;assert.ok(s.title);if(s.diagram)assert.ok(vs[s.diagram]);if(s.q!==undefined)assert.ok((s.kind==='check'?m.bank:m.questions)[s.q]);if(s.kind==='learn')assert.ok(s.text.split(/\s+/).length>=27);if(s.kind==='interactive'){assert.equal(s.model,'workbench');assert.equal(s.sources.length,2);for(const id of s.sources)assert.ok(ts.texts[id])}}
 for(const q of m.questions){tasks++;worked+=!q.practice;extended+=!!q.extended;assert.ok(!qids.has(q.id));qids.add(q.id);assert.ok(q.prompt.length>30);assert.equal(q.steps.length,q.allocations.length);assert.equal(q.marks,q.allocations.reduce((a,b)=>a+b,0));assert.ok(q.steps[0].length>100);assert.ok(q.promptHtml.includes('eng-task-prompt'));assert.ok(!/<script|\son[a-z]+=/i.test(q.promptHtml));assert.ok(q.stepsHtml[0].includes('One model or guided approach'));}
}
assert.equal(screens,824);assert.equal(tasks,248);assert.equal(worked,96);assert.equal(extended,8);
for(const y of ['11','12'])assert.equal(ms.filter(m=>m.year===y).length,24);
for(let u=1;u<=4;u++)assert.equal(ms.filter(m=>m.unit.startsWith('Unit '+u+' ')).length,12);
for(const [id,notes]of Object.entries(ts.annotations))for(const [quote,why]of notes){assert.ok(ts.texts[id].body.includes(quote),'Annotation not in source '+id+': '+quote);assert.ok(why.length>30)}
for(const [id,v]of Object.entries(vs)){assert.ok(v.svg.includes('viewBox="0 0 640 400"'));assert.ok(v.svg.includes('<title>'));assert.ok(v.explain&&v.limit);assert.ok(!/<script|\son[a-z]+=/i.test(v.svg));}
const comprehension=ms.flatMap(m=>m.questions).filter(q=>q.extended&&q.mode.startsWith('Comprehending'));
assert.equal(comprehension.length,4);
for(const q of comprehension){const n=q.steps[0].trim().split(/\s+/).length;assert.ok(n>=200&&n<=300,'Full comprehension model length '+n);assert.ok(!q.promptHtml.includes('ORIGINAL POEM')&&!q.promptHtml.includes('ORIGINAL DRAMA'));}
const extendedWriting=ms.flatMap(m=>m.questions).filter(q=>q.extended&&!q.mode.startsWith('Comprehending'));
for(const q of extendedWriting)assert.ok(q.steps[0].split(/\s+/).length>=550);
const hub=fs.readFileSync(root+'/topic-hub.html','utf8');
for(const s of ['EnglishATARPlayer','EnglishATAR','english-atar-course.js','English ATAR','ApplicationsATARPlayer','MethodsATARPlayer','SpecialistATARPlayer'])assert.ok(hub.includes(s));
for(const f of ['english-interactives.js','english-atar-player.js'])new vm.Script(fs.readFileSync(root+'/'+f,'utf8'),{filename:f});
const player=fs.readFileSync(root+'/english-atar-player.js','utf8');assert.ok(!/mathematical|engter|graphs, domains|solution and marks/.test(player));
console.log({lessons:ms.length,screens,tasks,worked,extended,originalTexts:18,visuals:14,verifiedAnnotations:Object.values(ts.annotations).reduce((n,a)=>n+a.length,0),allChecksPassed:true});
