import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const groups=['geometry','measurement','number'];
const index=groups.flatMap(g=>JSON.parse(read(`practice-studio-mathematics-${g}-index.json`)));
const banks=[...new Set(index.map(q=>q.bankFile))];
const rows=banks.flatMap(f=>JSON.parse(read(f)));
const report=JSON.parse(read('practice-studio-mathematics-number-geometry-report.json'));
const c=vm.createContext({});vm.runInContext(read('maths-answer-checker.js'),c);vm.runInContext(read('written-answer-checker.js'),c);
const W=c.WrittenAnswerChecker,M=c.MathsAnswerChecker;
const get=(s,n)=>rows.find(q=>q.id===`maths-lower-batch-${s}-q${n}`);
test('all 433 original questions have unique stable IDs, complete keys and exact lazy metadata',()=>{
 assert.equal(rows.length,433);assert.equal(index.length,433);assert.equal(new Set(rows.map(q=>q.id)).size,433);
 assert.equal(new Set(rows.map(q=>q.hash)).size,433);
 for(const [title,count] of Object.entries(report.sourceQuestionCounts)){
  const a=rows.filter(q=>q.sourceFile===title+' Test.docx');assert.deepEqual(a.map(q=>q.number),Array.from({length:count},(_,i)=>i+1));
 }
 for(const q of rows){
  assert.ok(q.html&&q.answerHtml&&q.addedAt&&q.sourceKeyPage);
  assert.deepEqual(index.find(i=>i.id===q.id),Object.fromEntries(Object.entries(q).filter(([k])=>!['html','answerHtml','optionsHtml'].includes(k))));
  for(const match of (q.html+q.answerHtml).matchAll(/src="([^"]+)"/g))assert.ok(existsSync(new URL('../'+match[1],import.meta.url)),q.id+' '+match[1]);
 }
});
test('every configured typed answer passes the real checker and wrong answers fail',()=>{
 for(const q of rows)for(const f of q.typedAnswers?.fields||[]){
  const value=['tuple','set'].includes(f.kind)?f.expected.join(','):Array.isArray(f.expected)?f.expected[0]:f.expected;
  assert.equal(W.checkField(f,value,M).correct,true,q.id+' '+f.label);
  assert.equal(W.checkField(f,'999999',M).correct,false,q.id+' rejects wrong answer');
 }
});
test('multiple-choice letters and marked image choices stay aligned',()=>{
 const a=rows.filter(q=>q.markingMode==='automatic');assert.equal(a.length,223);
 for(const q of a){assert.deepEqual(q.options,['A','B','C','D']);assert.ok(Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<4);assert.match(q.html,/matching letter/);}
 assert.equal(get('shapes',4).correctAnswer,2);assert.equal(get('pythagoras',1).correctAnswer,2);
});
test('incorrect supplied answers are corrected before automatic grading',()=>{
 assert.equal(get('area',8).typedAnswers.fields[0].expected,'15000');
 assert.equal(get('pythagoras',10).typedAnswers.fields[0].expected,'40.31');
 assert.equal(get('percentages',13).correctAnswer,0);assert.equal(get('ratio-and-rates',12).correctAnswer,2);
 assert.match(get('metric-system',29).answerHtml,/24.8 cm/);
 assert.equal(W.plan(get('integers',8)).fields.length,0);assert.match(get('integers',8).answerHtml,/below −220/);
});
test('shared maps and context survive random practice, and print measurements work on screen',()=>{
 for(let n=1;n<=22;n++)assert.ok((get('location',n).html.match(/<figure>/g)||[]).length>=2);
 for(let n=1;n<=8;n++)assert.ok((get('integers',n).html.match(/<figure>/g)||[]).length>=2);
 assert.match(get('location',20).html,/40 m/);assert.match(get('area',4).html,/8.5 cm by 4 cm/);
 assert.match(get('decimals',20).html,/positive/);
 assert.match(get('transformations-and-congruence',9).answerHtml,/Either a correct clockwise or a correct anticlockwise/);
});
test('2026 SCSA skill years distinguish foundation work, increase/decrease, surface area and cylinders',()=>{
 assert.equal(get('percentages',25).year,7);assert.equal(get('percentages',26).year,8);
 assert.equal(get('integers',9).year,7);assert.equal(get('integers',11).year,8);
 assert.equal(get('volume-and-surface-area',3).year,9);assert.equal(get('volume-and-surface-area',11).year,7);assert.equal(get('volume-and-surface-area',18).year,9);assert.equal(get('volume-and-surface-area',20).year,10);
 assert.equal(get('metric-system',1).originalYear,8);assert.equal(get('metric-system',1).scsa.foundation,true);
 for(const q of rows){assert.equal(q.scsa.year,q.year);assert.match(q.scsa.url,/For-implementation-in-2026/);assert.ok(q.year>=7&&q.year<=10);}
});
test('automatic checking leaves drawing, proof and open alternatives for teacher review',()=>{
 assert.equal(rows.filter(q=>q.typedAnswers).length,183);
 const manual=rows.filter(q=>q.markingMode!=='automatic'&&!q.typedAnswers);assert.equal(manual.length,27);
 for(const q of manual){assert.match(q.answerHtml,/Teacher review/);assert.equal(W.plan(q).fields.length,0);}
 assert.equal(W.plan(get('number-systems',18)).fields.length,0);
});
test('Word rasterisation crops the selected question instead of embedding the full shared sheet',async()=>{
 const source=read('assessment-word-export.js');const actual=source.slice(source.indexOf('async function png('),source.indexOf(' const crcTable='));
 const calls=[],canvas={width:0,height:0,getContext:()=>({drawImage:(...args)=>calls.push(args.slice(1))}),toDataURL:()=> 'data:image/png;base64,AA=='};
 const ctx=vm.createContext({Image:class{naturalWidth=960;naturalHeight=4000;async decode(){}},document:{createElement:()=>canvas},atob:()=> '\0',Uint8Array});vm.runInContext(actual+';globalThis.raster=png;',ctx);
 const cropped=await ctx.raster('sheet.jpg','0,1300,960,240');assert.equal(cropped.width,960);assert.equal(cropped.height,240);assert.deepEqual(Array.from(calls.at(-1)),[0,1300,960,240,0,0,960,240]);
 await assert.rejects(()=>ctx.raster('sheet.jpg','0,3900,960,240'),/Invalid source question image crop/);
 const full=await ctx.raster('ordinary.png','');assert.equal(full.height,4000);assert.deepEqual(Array.from(calls.at(-1)),[0,0]);
 assert.match(source,/imageKey=src\+'\|'\+crop/);
 for(const q of rows)for(const m of q.html.matchAll(/data-studio-crop="([^"]+)"/g))assert.equal(m[1].split(',').length,4);
});
