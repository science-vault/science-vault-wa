import test from 'node:test';import assert from 'node:assert/strict';
import {percent,lessonRows,lessonStats,filterLessons} from '../lesson-analytics-core.mjs';
test('completion is bounded and safe for missing totals',()=>{assert.equal(percent(2,4),50);assert.equal(percent(9,4),100);assert.equal(percent(1,0),0)});
test('student lessons are sorted and filtered without modifying inputs',()=>{
 const input=[{title:'Cells',course:'Science',completed:[0,1],total:4,completedOnce:false,updatedAt:{toMillis:()=>10}},{title:'Space',course:'Physics',completed:[0,1,2],total:3,completedOnce:true,updatedAt:{toMillis:()=>20}}];
 const rows=lessonRows(input);assert.equal(rows[0].title,'Space');assert.equal(rows[1].percentage,50);assert.equal(lessonStats(rows).completed,1);assert.equal(filterLessons(rows,{status:'incomplete',search:'cell'}).length,1);assert.equal(input[0].title,'Cells');
});
