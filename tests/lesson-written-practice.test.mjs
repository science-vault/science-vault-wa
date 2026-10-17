import test from 'node:test';
import assert from 'node:assert/strict';
import {checkShortAnswer,checkCalculation,makeWrittenReview,calculationFromMultipleChoice} from '../lesson-written-practice.mjs';
test('short answers ignore case and repeated spaces',()=>{
 assert.equal(checkShortAnswer('  THE   SUN  ',['the sun','sol']),true);
 assert.equal(checkShortAnswer('moon','sun'),false);
});
test('numeric calculations accept tolerance but reject units or expressions',()=>{
 assert.equal(checkCalculation('9.81',9.8,0.02),true);
 assert.equal(checkCalculation('9.9',9.8,0.02),false);
 assert.equal(checkCalculation('9.8 m/s',9.8),false);
 assert.equal(checkCalculation('1+2',3),false);
});
test('written review uses the validated answer key',()=>{
 assert.deepEqual(makeWrittenReview({prompt:'A star?',options:['Sun','Moon'],correct:0,explanation:'A star emits light.'}),{prompt:'A star?',expected:'Sun',explanation:'A star emits light.'});
});

test('calculation extraction requires a numerical keyed answer',()=>{
 const q={prompt:'Calculate the speed.',options:['6 m/s','7 m/s'],correct:0};
 assert.equal(calculationFromMultipleChoice(q)?.expected,6);
 assert.equal(calculationFromMultipleChoice({...q,prompt:'Name a star.'}),null);
});
