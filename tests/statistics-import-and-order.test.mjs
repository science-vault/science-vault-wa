import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const index=JSON.parse(read('../practice-studio-mathematics-data-index.json'));
const rows=[...new Set(index.map(q=>q.bankFile))].flatMap(f=>JSON.parse(read('../'+f)));
const c=vm.createContext({});
for(const file of ['practice-studio-database-order.js','maths-answer-checker.js','written-answer-checker.js'])vm.runInContext(read('../'+file),c);
const O=c.PracticeStudioDatabaseOrder,W=c.WrittenAnswerChecker,M=c.MathsAnswerChecker;
const get=(s,n)=>rows.find(q=>q.id===`maths-lower-data-${s}-q${n}`);
test('all 82 source questions are complete, unique and separate from the previous algebra upload',()=>{
 assert.equal(index.length,82);assert.equal(rows.length,82);
 const old=JSON.parse(read('../practice-studio-mathematics-lower-index.json'));
 assert.equal(new Set([...index,...old].map(x=>x.id)).size,204);
 assert.equal(new Set([...index,...old].map(x=>x.hash)).size,204);
 for(const [slug,total] of [['graphs-plots',25],['graphs-tables-charts',32],['statistical-measures',25]]){
  const group=rows.filter(x=>x.id.startsWith('maths-lower-data-'+slug+'-'));
  assert.deepEqual(group.map(x=>x.number),Array.from({length:total},(_,i)=>i+1));
 }
 for(const q of rows){
  assert.ok(q.html&&q.answerHtml&&q.addedAt);assert.equal(q.examYear,0);
  const listing=index.find(x=>x.id===q.id);assert.equal(listing.addedAt,q.addedAt);assert.equal(listing.year,q.year);
  assert.ok(q.scsa.url.includes('For-implementation-in-2026'));
  for(const path of [...q.html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]))assert.ok(existsSync(new URL('../'+path,import.meta.url)),q.id+' '+path);
 }
});
test('typed result checks work with fractions, rounding and ordered responses',()=>{
 for(const q of rows)for(const f of q.typedAnswers?.fields||[]){
  const input=['tuple','set'].includes(f.kind)?f.expected.join(','):Array.isArray(f.expected)?f.expected[0]:f.expected;
  assert.equal(W.checkField(f,input,M).correct,true,q.id+' '+f.label);
  assert.equal(W.checkField(f,'999999',M).correct,false,q.id+' rejects incorrect value');
 }
 assert.equal(W.checkField(get('graphs-plots',25).typedAnswers.fields[0],'8/32',M).correct,true);
 assert.equal(W.checkField(get('graphs-tables-charts',7).typedAnswers.fields[0],'16.7',M).correct,false);
});
test('statistical keys agree with independently computed source datasets',()=>{
 const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
 const median=a=>{a=[...a].sort((x,y)=>x-y);return(a[Math.floor((a.length-1)/2)]+a[Math.ceil((a.length-1)/2)])/2};
 const flatten=q=>Object.entries(q.sourceData).flatMap(([x,f])=>Array(f).fill(Number(x)));
 assert.equal(mean(get('statistical-measures',2).sourceData),25);
 assert.equal(median(get('statistical-measures',3).sourceData),3.5);
 const fibre=Object.entries(get('statistical-measures',16).sourceData).flatMap(([stem,leaves])=>leaves.map(x=>10*Number(stem)+x));
 assert.equal(mean(fibre),41.75);assert.equal(Math.round(mean(fibre)),42);assert.equal(median(fibre),41);
 const tries=flatten(get('statistical-measures',20));assert.equal(tries.length,25);assert.equal(mean(tries),3.6);assert.equal(median(tries),3);
 const histogram=flatten(get('statistical-measures',25));assert.equal(histogram.length,40);assert.equal(mean(histogram),5.2);assert.equal(Math.max(...histogram)-Math.min(...histogram),8);
});
test('graph totals, endpoint conventions and corrected currency conversion are consistent',()=>{
 assert.equal(Object.values(get('graphs-plots',4).sourceData).reduce((a,b)=>a+b,0)*50,2400);
 assert.equal(Object.values(get('graphs-plots',8).sourceData).reduce((a,b)=>a+b,0),800);
 const convert=get('graphs-tables-charts',15);assert.equal(Number(convert.typedAnswers.fields[0].expected),45*2.4);assert.match(convert.html,/corrected answer/);assert.match(convert.answerHtml,/108/);
 assert.equal(Number(get('graphs-tables-charts',18).typedAnswers.fields[0].expected),40);
 assert.equal(Number(get('graphs-tables-charts',20).typedAnswers.fields[0].expected),30+15-30);
 assert.equal(Number(get('graphs-tables-charts',22).typedAnswers.fields[0].expected),13.5-6);
});
test('three- and four-option questions have valid distinct answer keys; drawings stay teacher reviewed',()=>{
 for(const q of rows){
  if(q.markingMode==='automatic'){assert.ok([3,4].includes(q.options.length));assert.equal(new Set(q.options).size,q.options.length);assert.ok(Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<q.options.length);}
  if(['Drawing graphs','Frequency polygons'].includes(q.subtopics[0]))assert.equal(W.plan(q).resultOnly,true,q.id);
 }
});
const row=(id,date,examYear=2020)=>({i:id,q:['Mathematics',8,'','','','','',{id,addedAt:date,examYear}]});
test('recently added orders upload dates, never examination years, and leaves the input order untouched',()=>{
 const a=[row(1,'2025-01-01',2099),row(2,'2026-10-30T12:10:23Z',1990),row(3,'2024-01-01',2026)],ids=xs=>Array.from(xs,x=>x.i);
 assert.deepEqual(ids(O.sort(a,'recent')),[2,1,3]);assert.deepEqual(ids(O.sort(a,'oldest')),[3,1,2]);assert.deepEqual(ids(a),[1,2,3]);assert.deepEqual(ids(O.sort(a,'default')),[1,2,3]);
});
test('unknown dates remain last in both date sorts, ties remain stable, and recorded legacy imports work',()=>{
 const a=[row(0),row(1,'not-a-date'),row(2,'2026-01-01'),row(3,'2026-01-01')],ids=xs=>Array.from(xs,x=>x.i);
 assert.deepEqual(ids(O.sort(a,'recent')),[2,3,0,1]);assert.deepEqual(ids(O.sort(a,'oldest')),[2,3,0,1]);
 assert.equal(O.addedAt({bankFile:'legacy.json'}, {'legacy.json':'2026-10-30T11:53:15Z'}),Date.parse('2026-10-30T11:53:15Z'));
 assert.equal(O.addedAt({examYear:2099}),0);
 assert.equal(O.addedAt({addedAt:'malformed',examYear:2099}),0);
});
