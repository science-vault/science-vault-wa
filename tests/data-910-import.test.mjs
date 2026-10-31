import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),idx=JSON.parse(read('practice-studio-mathematics-data-910-index.json')),rows=[...new Set(idx.map(q=>q.bankFile))].flatMap(f=>JSON.parse(read(f))),report=JSON.parse(read('practice-studio-mathematics-data-910-report.json'));
const c=vm.createContext({});for(const f of ['maths-answer-checker.js','written-answer-checker.js','practice-studio-database-order.js','practice-studio-catalog.js'])vm.runInContext(read(f),c);const W=c.WrittenAnswerChecker,M=c.MathsAnswerChecker;
const get=(s,sec,n)=>rows.find(q=>q.id===`maths-lower-data-910-${s}-${sec}-q${n}`),field=(q,i=0)=>q.typedAnswers.fields[i],flat=d=>Object.entries(d).flatMap(([x,f])=>Array(f).fill(Number(x))),mean=a=>a.reduce((s,x)=>s+x,0)/a.length,median=a=>{a=[...a].sort((x,y)=>x-y);return (a[Math.floor((a.length-1)/2)]+a[Math.ceil((a.length-1)/2)])/2},quart=a=>{a=[...a].sort((x,y)=>x-y);let h=Math.floor(a.length/2);return [a[0],median(a.slice(0,h)),median(a),median(a.slice(-h)),a.at(-1)]};
test('104 source items map to 103 unique questions with the repeated median merged and both source references retained',()=>{
 assert.equal(rows.length,103);assert.equal(idx.length,103);assert.equal(report.sourceQuestions,104);assert.equal(report.duplicatesMerged.length,1);
 for(const k of ['id','hash'])assert.equal(new Set(rows.map(q=>q[k])).size,103);
 assert.equal(get('data-interpretation','short',1),undefined);const refs=get('basic-statistics','short',5).sourceReferences;assert.equal(refs.length,2);assert.equal(new Set(refs.map(r=>r.sourceFile)).size,2);
 for(const q of rows)assert.deepEqual(idx.find(i=>i.id===q.id),Object.fromEntries(Object.entries(q).filter(([k])=>!['html','answerHtml','optionsHtml'].includes(k))));
 const sources={'basic-statistics':20,'data-interpretation':20,'data-comparison':21,'bivariate-data':22,'data-interpretation-comparison':20};for(const [s,n] of Object.entries(sources))assert.equal(rows.filter(q=>q.bankFile===`practice-studio-mathematics-${s}-data910.json`).length,n);
 const old=c.PracticeStudioCatalog.indices.filter(f=>f.includes('mathematics-')&&!f.includes('data-910')).flatMap(f=>JSON.parse(read(f)));assert.equal(old.length,902);assert.equal(new Set([...old,...idx].map(q=>q.id)).size,1005);assert.equal(new Set([...old,...idx].map(q=>q.hash)).size,1005);
 const oldFiles=new Set(old.map(q=>q.sourceFile));for(const q of rows)assert.ok(!oldFiles.has(q.sourceFile));
 assert.ok(get('data-interpretation','short','6-stem'));assert.ok(get('data-interpretation','short',6));
});
test('actual answer checker accepts configured results, rejects incorrect answers, and preserves drawing and explanation review',()=>{
 assert.equal(rows.filter(q=>q.options).length,49);assert.equal(rows.filter(q=>q.typedAnswers).length,42);
 for(const q of rows){assert.equal(q.topics[0],'Statistics and data');assert.equal(q.scsa.year,q.year);assert.ok(q.html&&q.answerHtml&&q.addedAt);assert.match(q.scsa.url,/For-implementation-in-2026/);
  if(q.options){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<4);}
  for(const f of q.typedAnswers?.fields||[]){let v=['set','tuple'].includes(f.kind)?f.expected.join(','):Array.isArray(f.expected)?f.expected[0]:f.expected;assert.equal(W.checkField(f,String(v),M).correct,true,q.id+' '+f.label);assert.equal(W.checkField(f,'999999',M).correct,false,q.id+' wrong answer');}
 }
 for(const q of [get('basic-statistics','short',4),get('bivariate-data','short',12),get('data-interpretation','short',8),get('data-interpretation-comparison','short',1),get('data-interpretation-comparison','short',6)])assert.equal(W.plan(q).resultOnly,true,q.id);
});
test('means, medians and ranges are independently calculated from the actual data',()=>{
 for(const [n,fn]of [[1,mean],[2,median],[3,a=>Math.max(...a)-Math.min(...a)]]){let q=get('basic-statistics','short',n);assert.equal(Number(field(q).expected),fn(q.sourceData));}
 const d=get('basic-statistics','short',5);assert.equal(median(flat(d.sourceData)),7.5);assert.equal(mean(flat(d.sourceData)),7.375);
 const f=get('basic-statistics','short',9);assert.equal(mean(flat(f.sourceData)),7.64);
 const fam=get('basic-statistics','choice',9),fs=flat(fam.sourceData);assert.equal(mean(fs),Number(fam.options[fam.correctAnswer]));assert.equal(median(fs),4);
 const masses=get('basic-statistics','choice',4),a=Object.entries(masses.sourceData).flatMap(([s,vs])=>vs.map(v=>10*Number(s)+v));assert.equal(mean(a),60);assert.equal(median(a),63);
 const b=get('data-interpretation','choice',10),heights=Object.entries(b.sourceData).flatMap(([s,vs])=>vs.map(v=>Number(s)+v/10));assert.equal(heights.length,24);assert.equal(Math.round(mean(heights)*10)/10,Number(b.options[b.correctAnswer]));assert.equal(median(heights),12.8);
});
test('frequency tables and cumulative totals produce correct medians and weighted means',()=>{
 for(const [s,sec,n,result]of [['data-interpretation','short',7,110/26],['data-interpretation','choice',4,14.9],['data-interpretation','choice',7,3.1]])assert.ok(Math.abs(mean(flat(get(s,sec,n).sourceData))-result)<1e-10);
 const cf=get('data-interpretation','short',9),frequencies=Object.values(cf.sourceData);let sum=0;assert.deepEqual(field(cf).expected.map(Number),frequencies.map(f=>sum+=f));assert.equal(median(flat(cf.sourceData)),5.5);
 assert.equal(W.checkField(field(get('data-interpretation','short',3)),'7.38',M).correct,true);assert.equal(W.checkField(field(get('data-interpretation','short',3)),'7.3',M).correct,false);
});
test('quartiles and summaries use an explicit median-of-halves convention and explanations agree with computed spending',()=>{
 for(const n of [4,5]){const q=get('data-interpretation-comparison','short',n);assert.deepEqual(field(q).expected.map(Number),quart(q.sourceData));}
 const q=get('data-interpretation-comparison','short',9);for(const [i,name]of ['Adam','Josie'].entries())assert.deepEqual(field(q,i).expected.map(Number),quart(q.sourceData[name]));
 assert.equal(mean(q.sourceData.Adam),39);assert.equal(mean(q.sourceData.Josie),39);
 const r=get('data-comparison','short',2);assert.ok(Math.abs(mean(r.sourceData.Damien)-mean(r.sourceData.Brett)-.5)<1e-10);
 const teams=get('data-comparison','short',6).sourceData;assert.ok(Math.abs(mean(flat(teams.Army))-98/12)<1e-10);assert.ok(Math.abs(mean(flat(teams.Navy))-91/12)<1e-10);assert.equal(Number(field(get('data-comparison','short',6),1).expected),8.17);
 const sport=get('data-comparison','short',9).sourceData;assert.equal(sport.Bulls.length,sport.Giants.length);assert.equal(median(sport.Bulls),18);assert.equal(median(sport.Giants),19.5);
});
test('source key corrections, representative sampling and visible-point convention remain explicit',()=>{
 const vote=get('basic-statistics','choice',7);assert.equal(vote.options[vote.correctAnswer],'Greens');assert.match(vote.editorialNote,/correct choice is C/);assert.deepEqual(Object.entries(vote.sourceData).sort((a,b)=>a[1]-b[1])[1],['Greens',10]);
 const pair=get('basic-statistics','choice',8).sourceData;assert.ok(pair.Labour+pair.Greens>Object.values(pair).reduce((s,x)=>s+x,0)/2);
 assert.match(get('bivariate-data','choice',5).text,/representative/);assert.match(get('bivariate-data','choice',6).text,/distinct/);assert.match(get('data-comparison','short',5).answerHtml,/not a formal/);
});
test('question diagrams are PNG files with visible content, no answers leak into questions and all source graph context is repeated',()=>{
 const images=new Set();for(const q of rows){for(const match of q.html.matchAll(/src="([^"]+)"/g)){images.add(match[1]);assert.ok(existsSync(new URL('../'+match[1],import.meta.url)));const b=readFileSync(new URL('../'+match[1],import.meta.url));assert.equal(b.subarray(1,4).toString(),'PNG');assert.ok(b.readUInt32BE(16)>150);assert.ok(b.readUInt32BE(20)>70);}assert.ok(!q.html.includes('Worked solution'));}
 assert.equal(images.size,18);
 for(const [s,sec,ns]of [['bivariate-data','short',[9,10,11,12]],['data-comparison','short',[6,7,8]],['data-interpretation-comparison','choice',[6,7,8]]])for(const n of ns)assert.match(get(s,sec,n).html,/<img/);
 assert.match(get('data-interpretation-comparison','short',6).html,/57, 26/);assert.match(get('data-interpretation','choice',10).html,/11.2 metres/);
});
test('algebra now uses its three specific curriculum topics and keeps existing IDs and catalogue order',()=>{
 const algebra=JSON.parse(read('practice-studio-mathematics-algebra-910-index.json')),counts={};for(const q of algebra){assert.equal(q.topics[0],q.scsa.subStrand);counts[q.topics[0]]=(counts[q.topics[0]]||0)+1;}
 assert.deepEqual(counts,{'Linear and non-linear patterns and relationships':45,'Linear and non-linear equations and inequalities':56,'Algebraic techniques':94});
 assert.equal(c.PracticeStudioCatalog.indices.at(-1),'practice-studio-mathematics-data-910-index.json');
 const old=JSON.parse(read('practice-studio-mathematics-algebra-910-index.json')),sorted=c.PracticeStudioDatabaseOrder.sort([...old,...idx].map(m=>({q:[null,null,null,null,null,null,null,m]})),'recent');assert.equal(sorted[0].q[7].id,idx[0].id);
});
