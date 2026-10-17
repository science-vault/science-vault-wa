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

export function calculationFromMultipleChoice(question){
 if(!question||typeof question.prompt!=='string'||!Array.isArray(question.options)||!Number.isInteger(question.correct))return null;
 const selected=question.options[question.correct];
 if(typeof selected!=='string')return null;
 const match=selected.trim().match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)(?:\s+(.+))?$/i);
 if(!match||!Number.isFinite(Number(match[1])))return null;
 if(!/(?:calculate|determine|work out|how (?:many|much|fast|far|long)|what is the (?:speed|velocity|acceleration|distance|time|mass|force|energy|power|frequency|wavelength|voltage|current|resistance|density|pressure))/i.test(question.prompt))return null;
 return {prompt:question.prompt,expected:Number(match[1]),unit:match[2]||'',explanation:String(question.explanation||'')};
}
