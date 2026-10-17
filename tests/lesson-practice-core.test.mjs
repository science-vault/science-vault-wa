import test from 'node:test';
import assert from 'node:assert/strict';
import {eligiblePracticeQuestions,scorePractice} from '../lesson-practice-core.mjs';
const sample={prompt:'Which is a star?',options:['Sun','Moon','Earth'],correct:0};
test('selects valid multiple-choice items',()=>{
 assert.deepEqual(eligiblePracticeQuestions([sample]),[sample]);
});
test('rejects malformed and markup-based items',()=>{
 assert.deepEqual(eligiblePracticeQuestions([
  {...sample,prompt:'<img src=x>'},
  {...sample,correct:5},
  {...sample,options:['Only one']},
  sample
 ]),[sample]);
});
test('limits practice length and scores responses',()=>{
 assert.equal(eligiblePracticeQuestions([sample,sample,sample],2).length,2);
 assert.equal(scorePractice([sample,sample],[0,2]),1);
});
