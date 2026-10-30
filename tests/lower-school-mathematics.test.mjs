import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {canStudy} from '../registration-options.mjs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const index=JSON.parse(read('../practice-studio-mathematics-lower-index.json'));
const files=[...new Set(index.map(q=>q.bankFile))];
const rows=files.flatMap(f=>JSON.parse(read('../'+f)));
const context=vm.createContext({});
vm.runInContext(read('../maths-answer-checker.js'),context);
vm.runInContext(read('../written-answer-checker.js'),context);
const W=context.WrittenAnswerChecker,M=context.MathsAnswerChecker;
const get=(s,n)=>rows.find(q=>q.id===`maths-lower-${s}-q${n}`);
test('build coverage counts lower-school and senior questions and rejects invalid years',()=>{
 const dir=mkdtempSync(join(tmpdir(),'studio-coverage-'));
 try{
  writeFileSync(join(dir,'practice-studio-catalog.js'),"window.PracticeStudioCatalog={indices:['practice-studio-fixture.json'],normalise:q=>q};");
  const file=join(dir,'practice-studio-fixture.json');
  writeFileSync(file,JSON.stringify([...index,{...index[0]},{id:'senior-fixture',subject:'Physics',year:12,hash:'senior-fixture'}]));
  const script=new URL('../scripts/build-assessment-counts.cjs',import.meta.url);
  execFileSync(process.execPath,[script.pathname,dir]);
  const counts=JSON.parse(readFileSync(join(dir,'assessment-bank-counts.json'),'utf8'));
  assert.equal(counts.total,123);assert.equal(counts.byCourse.Mathematics,122);assert.equal(counts.byYear[12],1);
  for(const y of [7,8,9,10])assert.equal(counts.byYear[y],index.filter(q=>q.year===y).length);
  writeFileSync(file,JSON.stringify([{id:'invalid',subject:'Mathematics',year:6}]));
  assert.throws(()=>execFileSync(process.execPath,[script.pathname,dir],{stdio:'pipe'}),/Command failed/);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('new catalogue index appends after all existing indexes to preserve saved question positions',()=>{
 const c=vm.createContext({window:{}});vm.runInContext(read('../practice-studio-catalog.js'),c);
 assert.deepEqual(Array.from(c.window.PracticeStudioCatalog.indices),['practice-studio-physics-index.json','practice-studio-physics-year11-index.json','practice-studio-human-biology-index.json','practice-studio-human-biology-year11-index.json','practice-studio-chemistry-year11-index.json','practice-studio-methods-year11-index.json','practice-studio-methods-year12-index.json','practice-studio-mathematics-lower-index.json','practice-studio-mathematics-data-index.json','practice-studio-mathematics-geometry-index.json','practice-studio-mathematics-measurement-index.json','practice-studio-mathematics-number-index.json']);
});
test('all 122 source questions appear once in both lazy banks and catalogue',()=>{
 assert.equal(rows.length,122);assert.equal(index.length,122);
 assert.equal(new Set(rows.map(q=>q.id)).size,122);
 assert.equal(new Set(rows.map(q=>q.hash)).size,122);
 for(const [slug,n] of [['basic-algebra',35],['further-algebra',32],['equations-formulae',25],['linear-relations',30]]){
  const a=rows.filter(q=>q.id.startsWith('maths-lower-'+slug+'-'));
  assert.deepEqual(a.map(q=>q.number),Array.from({length:n},(_,i)=>i+1));
 }
 for(const q of rows){assert.ok(q.html&&q.answerHtml);assert.deepEqual(index.find(i=>i.id===q.id),Object.fromEntries(Object.entries(q).filter(([k])=>!['html','answerHtml','optionsHtml'].includes(k))));}
});
test('actual checker accepts every configured result and rejects an incorrect result',()=>{
 for(const q of rows)for(const f of q.typedAnswers?.fields||[]){
  const input=['tuple','set'].includes(f.kind)?f.expected.join(','):Array.isArray(f.expected)?f.expected[0]:f.expected;
  assert.equal(W.checkField(f,input,M).correct,true,q.id+' '+f.label);
  assert.equal(W.checkField(f,'999999',M).correct,false,q.id+' wrong answer');
 }
});
test('fraction, tuple and algebraic-equivalence checks work on imported questions',()=>{
 assert.equal(W.checkField(get('equations-formulae',9).typedAnswers.fields[0],'12/14',M).correct,true);
 assert.equal(W.checkField(get('linear-relations',8).typedAnswers.fields[0],'(-7,-3,5)',M).correct,true);
 assert.equal(W.checkField(get('linear-relations',8).typedAnswers.fields[0],'5,-3,-7',M).correct,false);
 assert.equal(W.checkField(get('basic-algebra',14).typedAnswers.fields[0],'x+x+x',M).correct,true);
});
test('graphs, factorisation and open inequality examples never receive a false complete automatic grade',()=>{
 for(const q of rows.filter(q=>['Drawing linear graphs','Plotting coordinates','Expansion and factorisation'].includes(q.subtopics[0])&&q.markingMode!=='automatic'))assert.equal(W.plan(q).resultOnly,true,q.id);
 assert.equal(W.plan(get('equations-formulae',21)).fields.length,0);
});
test('2026 curriculum placement separates lower-school algebra from optional extension',()=>{
 assert.equal(get('basic-algebra',1).year,7);assert.equal(get('further-algebra',1).year,8);
 assert.equal(get('further-algebra',7).year,9);assert.equal(get('further-algebra',13).year,10);
 assert.equal(get('further-algebra',13).scsa.optional,true);
 assert.equal(get('equations-formulae',22).year,10);assert.equal(get('linear-relations',25).year,10);
 for(const q of rows){assert.ok(q.year>=7&&q.year<=10);assert.ok(q.scsa.url.includes('For-implementation-in-2026'));assert.ok(q.marksOrigin.includes('no mark'));}
});
test('source defects are explicitly explained and worked values corrected',()=>{
 const typo=get('basic-algebra',29);assert.match(typo.html,/Source correction/);assert.equal(typo.typedAnswers.fields[0].expected,'13');
 const model=get('linear-relations',15);assert.match(model.html,/not a physically possible/);assert.deepEqual(model.typedAnswers.fields[0].expected,['7','2','-3']);
 assert.equal(get('equations-formulae',17).correctAnswer,2);
 assert.equal(get('further-algebra',27).options[get('further-algebra',27).correctAnswer],'−36');
});
test('all choice keys reference four valid distinct options',()=>{
 for(const q of rows.filter(q=>q.markingMode==='automatic')){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.correctAnswer>=0&&q.correctAnswer<4);assert.equal(q.optionsHtml.length,4);}
});
test('membership still enforces approved years and senior subject selection',()=>{
 assert.equal(canStudy({role:'student',yearGroup:8},'Mathematics',8),true);
 assert.equal(canStudy({role:'student',yearGroup:8},'Mathematics',9),false);
 assert.equal(canStudy({role:'student',yearGroup:11,subjects:['Physics ATAR']},'Mathematics',11),false);
 assert.equal(canStudy({role:'student',yearGroup:11,subjects:['Physics ATAR']},'Physics',11),true);
 const html=read('../student-quiz.html');assert.match(html,/access-bootstrap/);assert.doesNotMatch(html,/studioCanStudy=\(\)=>true/);
 const access=read('../practice-studio-access.js');assert.match(access,/policy.canOpenPage/);assert.match(access,/allowed&&registration.canStudy/);
});
