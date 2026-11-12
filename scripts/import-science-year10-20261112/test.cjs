const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const index=JSON.parse(fs.readFileSync('output/practice-studio-science-year10-index.json'));
assert.equal(index.length,207);assert.equal(new Set(index.map(q=>q.id)).size,207);
assert.equal(new Set(index.map(q=>q.sourceFile)).size,7);
const rows=index.map(q=>JSON.parse(fs.readFileSync('output/'+q.bankFile)).find(r=>r.id===q.id));
for(const q of rows){assert(q.html.length>20,q.id);assert(q.answerHtml.includes('Worked solution'),q.id);assert(q.answerHtml.includes('Marking guidance'),q.id);assert(q.marks>0);assert(q.topics.length&&q.subtopics.length);for(const src of [...q.html.matchAll(/src="([^"]+)"/g)].map(m=>m[1]))assert(fs.existsSync('output/'+src),src);if(q.markingMode==='automatic'){assert(q.options.length>=4);assert(q.correctAnswer>=0&&q.correctAnswer<q.options.length);assert(q.options.every(o=>o.trim().length));}}
const context={console,fetch:async file=>({ok:true,json:async()=>fs.existsSync('output/'+file)?JSON.parse(fs.readFileSync('output/'+file)):[]})};context.window=context;context.globalThis=context;vm.createContext(context);
for(const file of ['practice-studio-catalog.js','studio-assessment-bank.js','assessment-builder-bank-loader.js','question-type-mix.js'])vm.runInContext(fs.readFileSync('output/'+file,'utf8'),context);
(async()=>{const studio=await context.StudioAssessmentBank.load('Science',10);assert.equal(studio.length,207);assert(studio.every(q=>q.pathway==='Lower school'));assert(studio.every(q=>q.difficulty));
const lower=await context.AssessmentBankLoader.load('science',10);assert.equal(lower.length,207);assert.equal(lower.filter(q=>q.type==='Multiple choice').length,122);assert(lower.some(q=>q.question.includes('E. ')));
const selected=context.QuestionTypeMix.select(lower,{'Multiple choice':10,'Calculations':5},300);assert.equal(selected.length,15);assert.equal(new Set(selected.map(q=>q.id)).size,15);
const html=fs.readFileSync('output/assessment-builder.html','utf8');const fn=html.slice(html.indexOf('function selectByMarks'),html.indexOf('function build(){'));vm.runInContext(fn,context);const exact=context.selectByMarks(lower,{'Multiple choice':10,'Calculations':5},25);assert.equal(exact.length,15);assert.equal(exact.reduce((s,q)=>s+q.marks,0),25);
assert.throws(()=>context.selectByMarks(lower,{'Multiple choice':10},11),/No exact match/);
console.log('PASS: 207 records, 7 assessments, 122 MCQs, all solutions and assets, Studio and lower-school loading, per-type selection and exact total marks.');
})().catch(e=>{console.error(e);process.exit(1)});
