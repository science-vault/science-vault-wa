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
 for(const q of a){assert.deepEqual(q.options,['A','B','C','D']);assert.ok(Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<4);if(q.editableText){assert.equal(q.optionsHtml.length,4);for(const option of q.optionsHtml)assert.ok(option.trim());}else assert.match(q.html,/matching letter/);}
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
 for(let n=1;n<=22;n++)assert.ok((get('location',n).html.match(/<figure>/g)||[]).length>=(get('location',n).editableText?1:2));
 for(let n=1;n<=8;n++)assert.ok((get('integers',n).html.match(/<figure>/g)||[]).length>=(get('integers',n).editableText?1:2));
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

test('native statement and radical questions retain their complete meaning',()=>{
 const statements=get('integers',25);assert.equal(statements.editableText,true);
 assert.match(statements.html,/Statement 1/);assert.match(statements.html,/Statement 2/);assert.match(statements.html,/□/);
 const decimal=get('decimals',20);assert.match(decimal.html,/assume the original number is positive/);assert.match(decimal.html,/A\. When/);assert.match(decimal.html,/B\. When/);
 assert.equal(decimal.correctAnswer,2);
 const roots=get('number-systems',11);assert.equal(roots.correctAnswer,2);
 const correct=roots.optionsHtml[roots.correctAnswer];assert.match(correct,/<msqrt>.*169/s);assert.match(correct,/<mroot>.*125.*3/s);
 for(const [slug,number] of [['angles',13],['number-systems',22]]){
  const q=get(slug,number);assert.match(q.html,/<(?:img|svg)\b/);
 }
 for(const q of rows.filter(q=>q.editableText)){assert.equal(q.fontFamily,'Arial');assert.equal(q.fontSizePt,12);assert.equal(q.responseLines,0);}
});
test('Pythagoras native questions retain isolated original diagrams and original sizing',()=>{
 for(const n of [1,2,6,7,9,10,11,13,15,16,17,18,19,20]){
  const q=get('pythagoras',n);assert.equal(q.editableText,true);assert.equal(q.nativeDiagramSources.length,1);
  const d=q.nativeDiagramSources[0];assert.match(d.sourceMediaSHA256,/^[0-9a-f]{64}$/);assert.match(q.html,new RegExp(d.assetFile));
  assert.ok(d.displayWidthPx>100&&d.displayWidthPx<650);assert.match(q.html,/data-word-width-px=/);
  const svg=read(d.assetFile);assert.match(svg,/<svg/);assert.doesNotMatch(svg,/<script|<foreignObject|onload=/i);assert.ok(svg.includes('viewBox="'+d.assetViewBox.join(' ')+'"'));
 }
 assert.deepEqual(get('pythagoras',1).optionsHtml,['<span>Triangle I only</span>','<span>Triangle II only</span>','<span>Both Triangles.</span>','<span>Neither Triangle.</span>']);
 assert.equal(get('pythagoras',1).correctAnswer,2);assert.match(get('pythagoras',2).optionsHtml[0],/<msup>/);
 // These two diagrams cross a Word row boundary; retain their scans until mapped explicitly.
 assert.ok(!get('pythagoras',3).editableText);assert.ok(!get('pythagoras',4).editableText);
});
test('numeric response templates become editable without losing fractions or supplied data',()=>{
 const fraction=get('fractions',17);assert.equal(fraction.editableText,true);assert.match(fraction.html,/<mfrac><mn>3<\/mn><mn>8<\/mn><\/mfrac>/);assert.match(fraction.html,/<mfrac><mn>1<\/mn><mn>4<\/mn><\/mfrac>/);
 const decimal=get('decimals',31);assert.equal(decimal.editableText,true);for(const n of ['7.5','8.2','9.4','8.6','7.3'])assert.ok(decimal.html.includes(n));
 const time=get('metric-system',12);assert.equal(time.editableText,true);assert.match(time.html,/550 seconds/);assert.match(time.html,/minutes and/);
 for(const [slug,n] of [['fractions',1],['decimals',1],['decimals',35],['metric-system',11]])assert.match(get(slug,n).html,/<(?:img|svg)\b/,'Keep genuine diagram '+slug+' '+n);
});
test('measurement diagrams preserve source dimensions, pi and complete question context',()=>{
 for(const [slug,n] of [['area',4],['area',25],['metric-system',30],['volume-and-surface-area',16]]){
  const q=get(slug,n);assert.equal(q.editableText,true);assert.ok(q.nativeDiagramSources.length);
  for(const d of q.nativeDiagramSources){const svg=read(d.assetFile);assert.match(svg,/<svg/);assert.doesNotMatch(svg,/<script|<foreignObject|onload=/i);assert.match(d.sourceMediaSHA256,/^[0-9a-f]{64}$/);}
 }
 assert.match(get('metric-system',30).html,/Use π = 3\.14/);assert.match(get('metric-system',29).html,/Use π = 3\.1/);
 assert.match(get('area',4).html,/8\.5 cm by 4 cm/);assert.match(get('area',25).html,/diameter 6 m/);
 // Recover the original tent diagram from the preceding tank row in Word.
 const tank=get('volume-and-surface-area',12),tent=get('volume-and-surface-area',13);
 assert.equal(tank.editableText,true);assert.equal(tent.editableText,true);
 assert.deepEqual(tank.nativeDiagramSources.map(d=>d.shapeId),['_x0000_s1138']);
 assert.deepEqual(tent.nativeDiagramSources.map(d=>d.shapeId),['_x0000_s1140']);
 assert.match(tank.html,/depth of 1\.2 m/);assert.equal(tent.optionsHtml.length,4);
});
