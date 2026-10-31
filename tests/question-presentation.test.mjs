import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
const root=new URL('../',import.meta.url),c=vm.createContext({});
for(const file of ['practice-studio-presentation.js','practice-studio-catalog.js','studio-assessment-bank.js'])vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),c);
const catalog=c.PracticeStudioCatalog;
const indices=catalog.indices.flatMap(file=>JSON.parse(fs.readFileSync(new URL(file,root),'utf8')));
const files=[...new Set(indices.map(q=>q.bankFile||'practice-studio-'+(q.subject==='Human Biology'?'human-biology':q.subject.toLowerCase())+'-'+q.examYear+'-u'+String(q.units).replace(/\D/g,'')+'.json'))];
const questions=files.flatMap(file=>JSON.parse(fs.readFileSync(new URL(file,root),'utf8'))),byId=new Map(questions.map(q=>[q.id,q]));
const htmlText=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
test('all bank questions keep IDs, keys, marks, marking modes and saved-answer metadata',()=>{
 assert.equal(questions.length,2589);
 for(const raw of questions){const before=JSON.stringify(raw),q=catalog.normalise(raw);
  for(const key of ['id','hash','number','marks','correctAnswer','markingMode','answerHtml','options','typedAnswers','bankFile'])assert.equal(JSON.stringify(q[key]),JSON.stringify(raw[key]),raw.id+' '+key);
  assert.equal(JSON.stringify(raw),before,'source mutation '+raw.id);
  assert.doesNotMatch(q.html,/<!--studio-(?:option-)?image/,'unresolved image '+raw.id);
  assert.doesNotMatch(q.html,/\bEND\s+OF\s+(?:SECTION|PART)\s+(?:ONE|TWO|THREE|FOUR|[1-4])\b/i,raw.id);
  const text=htmlText(q.html);assert.doesNotMatch(text,/_{3,}|(?:\.\s*){7,}/,raw.id);
 }
});
test('all 628 formerly scanned maths questions render typed prompts and complete choices',()=>{
 const old=questions.filter(q=>q.subject==='Mathematics'&&q.html.includes('data-studio-crop'));
 assert.equal(old.length,628);
 for(const raw of old){const q=catalog.normalise(raw);assert.match(q.html,/studio-question-content/,raw.id);assert.ok(htmlText(q.html).length>3,raw.id);
  assert.doesNotMatch(q.html,/alt="(?:Question \d|Original question)\b/i,raw.id);
  if(q.markingMode==='automatic'){assert.equal(q.optionsHtml.length,4,raw.id);for(const option of q.optionsHtml)assert.ok(htmlText(option)||/<img|<svg/.test(option),'empty choice '+raw.id);}
 }
});
test('index metadata stays lazy so question text and marking keys load together',()=>{
 for(const raw of indices){const q=catalog.normalise(raw);assert.equal(q.html,undefined,raw.id);assert.equal(q.answerHtml,undefined,raw.id);}
});
test('native science diagrams survive cleanup byte for byte',()=>{
 for(const raw of questions.filter(q=>q.subject!=='Mathematics')){const q=catalog.normalise(raw),images=s=>s.match(/<img\b[^>]*>/gi)||[];assert.deepEqual(images(q.html),images(raw.html),raw.id);}
});
test('assessment conversion and practice use the same cleaned question and choices',()=>{
 for(const id of ['maths-lower-batch-shapes-q25','physics-2024-u34-q10','maths-lower-algebra-910-simultaneous-equations-choice-q3']){const raw=byId.get(id),q=catalog.normalise(raw),out=c.StudioAssessmentBank.convert(raw);assert.ok(out.question.startsWith(q.html),id);assert.equal(out.answer,raw.answerHtml);assert.equal(out.correctAnswer,raw.correctAnswer);}
});
test('shared contexts, typed data tables and diagram choices remain self-contained',()=>{
 const get=id=>catalog.normalise(byId.get(id));
 for(let n=2;n<=4;n++){const q=get('maths-lower-batch-ratio-and-rates-q'+n);assert.match(q.html,/Group of nine men and eight women/);}
 for(let n=1;n<=5;n++)assert.match(get('maths-lower-batch-integers-q'+n).html,/Thermometer/);
 for(const id of ['maths-lower-algebra-910-algebraic-expansions-short-q1','maths-lower-algebra-910-algebraic-expansions-short-q3'])assert.match(get(id).html,/[234]x|2\(x/);
 assert.match(get('maths-lower-batch-metric-system-q23').html,/<table>.*210 g.*0.15 kg.*180 g.*0.2 kg/s);
 const q=get('maths-lower-batch-shapes-q25');assert.equal(q.optionsHtml.length,4);assert.ok(q.optionsHtml.every(x=>x.includes('data:image/svg+xml;base64,')));
 for(const n of [3,6]){const id=n===3?'maths-lower-algebra-910-simultaneous-equations-choice-q3':'maths-lower-algebra-910-linear-equations-choice-q6';assert.match(get(id).html,/<table>/);assert.equal(get(id).optionsHtml.length,4);}
});
test('all new diagram crops exist and fit their atlas at export resolution',()=>{
 const seen=new Set();
 for(const raw of questions){const q=catalog.normalise(raw);for(const h of [q.html,...(q.optionsHtml||[])])for(const m of h.matchAll(/<img\b[^>]*>/gi)){
  const src=m[0].match(/src="([^"]+)"/)?.[1];if(!src?.includes('uniform-diagrams-'))continue;
  assert.ok(fs.existsSync(new URL(src,root)),src);const crop=m[0].match(/data-studio-crop="([^"]+)"/)?.[1].split(',').map(Number);assert.equal(crop.length,4);assert.ok(crop.every(Number.isSafeInteger));assert.ok(crop[0]>=0&&crop[1]>=0&&crop[2]>0&&crop[3]>0);const png=fs.readFileSync(new URL(src,root));assert.ok(crop[0]+crop[2]<=png.readUInt32BE(16)&&crop[1]+crop[3]<=png.readUInt32BE(20),src+' '+crop);seen.add(src);
 }}assert.equal(seen.size,3);
});
test('active Studio entry pages load presentation before catalogue and bank',()=>{
 for(const name of ['student-quiz.html','assessment-builders.html','upper-school-assessment-builder.html']){const s=fs.readFileSync(new URL(name,root),'utf8');assert.ok(s.indexOf('practice-studio-presentation.js')<s.indexOf('practice-studio-catalog.js'),name);assert.match(s,/practice-studio-presentation.js\?v=2026.10.31-uniform1/);}
});
