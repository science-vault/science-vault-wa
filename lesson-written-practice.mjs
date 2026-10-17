// Self-check practice: not a graded assessment and does not write to Firebase.
export function normaliseAnswer(value){
 return String(value??'').trim().toLowerCase().replace(/\s+/g,' ');
}
export function checkShortAnswer(response,accepted){
 const answers=Array.isArray(accepted)?accepted:[accepted];
 const actual=normaliseAnswer(response);
 return actual.length>0&&answers.some(a=>normaliseAnswer(a)===actual);
}
export function checkCalculation(response,expected,tolerance=0.01){
 const raw=String(response??'').trim();
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw))return false;
 const value=Number(raw),target=Number(expected);
 return Number.isFinite(value)&&Number.isFinite(target)&&Number.isFinite(tolerance)&&tolerance>=0&&Math.abs(value-target)<=tolerance;
}
export function makeWrittenReview(question){
 if(!question||typeof question.prompt!=='string'||!Array.isArray(question.options)||!Number.isInteger(question.correct))return null;
 const answer=question.options[question.correct];
 if(typeof answer!=='string')return null;
 return {prompt:question.prompt,expected:answer,explanation:String(question.explanation||'')};
}
