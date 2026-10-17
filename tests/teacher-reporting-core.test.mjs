import test from 'node:test';
import assert from 'node:assert/strict';
import {studentSummary,classSummary,reportCsv,csvCell} from '../teacher-reporting-core.mjs';
const students=[{studentUid:'a',displayName:'Alex',yearGroup:10},{studentUid:'b',displayName:'Bailey',yearGroup:10}];
const results=[{studentUid:'a',taskId:'x',earned:8,max:10,selfReported:false,createdAt:{toMillis:()=>1700000000000}},{studentUid:'a',taskId:'x',earned:10,max:10,selfReported:true},{studentUid:'other',earned:10,max:10}];
test('summaries only include results belonging to the student',()=>{
 const s=studentSummary(students[0],results,[{id:'x'}]);
 assert.equal(s.attempts,2);assert.equal(s.earned,18);assert.equal(s.possible,20);assert.equal(s.percentage,90);assert.equal(s.completed,1);
});
test('class averages exclude students with no graded submissions',()=>{
 const s=classSummary(students,results);
 assert.equal(s.students,2);assert.equal(s.activeStudents,1);assert.equal(s.meanPercent,90);
 assert.equal(s.rows[1].percentage,null);
});
test('CSV quotes values and neutralises spreadsheet formula input',()=>{
 assert.equal(csvCell('A "quoted", name'),'"A ""quoted"", name"');
 assert.equal(csvCell('=HYPERLINK("x")'),'"\'=HYPERLINK(""x"")"');
 const csv=reportCsv(classSummary([{studentUid:'a',displayName:'=1+1',yearGroup:10}],results));
 assert.match(csv,/"'=1\+1"/);
});
