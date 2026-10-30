/* Conservative local answer checks. Key wording coverage is feedback, never a mark. */
(function(root){'use strict';
const normal=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const stop=new Set('a an and are as at be been being by can description do does each for from has have in into is it its marks of on or per s that the their them then there these they this to total was were when which with would'.split(' '));
const words=s=>new Set(normal(s).match(/[a-z]+(?:'[a-z]+)?/g)?.filter(w=>w.length>2&&!stop.has(w))||[]);
const verified={
 'physics-2020-u3-q1':{fields:[{kind:'expression',variable:'f',expected:'24*f',label:'Final force in terms of F (use f)',tolerance:0}],resultOnly:true}
};
function plan(meta){const spec=meta.typedAnswers||verified[meta.id]||{},fields=Array.isArray(spec.fields)?spec.fields.filter(f=>f&&['number','expression','tuple','set','text'].includes(f.kind)&&f.expected!==undefined).slice(0,40):[];return {fields,resultOnly:spec.fullQuestion!==true,hasRubric:fields.length>0};}
function checkField(spec,input,math){if(!String(input??'').trim())return{correct:false,empty:true,message:'Enter an answer.'};if(spec.kind==='text'){const expected=Array.isArray(spec.expected)?spec.expected:[spec.expected];return{correct:expected.some(x=>normal(x)===normal(input)),message:'Use a complete answer; meaning and negation must be preserved.'};}return math.check(spec,input);}
function compareKey(response,points,prompt=''){
 const input=words(response),question=normal(prompt),seen=new Set(),out=[];
 for(const raw of points||[]){const text=String(raw||'').replace(/\s+/g,' ').trim(),n=normal(text),tokens=words(text);if(text.length<12||text.length>650||tokens.size<3||seen.has(n)||question.includes(n)||/^(description|total|subtotal|marks|any \w+ of the following|correct answer|answer taken)/i.test(text))continue;seen.add(n);
  const matches=[...tokens].filter(w=>input.has(w)),negation=/\b(?:not|never|no|cannot|can't|doesn't|isn't|without)\b/i.test(response),coverage=matches.length/tokens.size;
  out.push({text,related:coverage>=.75&&!negation,matchedTerms:matches.length,totalTerms:tokens.size});if(out.length>=12)break;
 }return out;
}
function check(meta,{written='',typed=[]},math,points=[]){const p=plan(meta),fields=p.fields.map((f,i)=>({...checkField(f,typed[i],math),label:f.label||'Answer '+(i+1)})),hasWritten=!!written.trim(),empty=fields.length?fields.some(f=>f.empty):!hasWritten;if(empty)return{empty:true,fields,reviewRequired:true,correct:null,keyPoints:[],summary:fields.length?'Complete each answer field before checking.':'Write your answer before checking.'};const matched=fields.filter(f=>f.correct).length,reviewRequired=p.resultOnly||!fields.length;return{empty:false,fields,matched,total:fields.length,reviewRequired,correct:fields.length?matched===fields.length:null,keyPoints:compareKey(written,points,meta.text),summary:fields.length?`${matched} of ${fields.length} answer checks matched. ${reviewRequired?'Working, explanations and diagrams still need teacher review.':'All configured answer checks completed.'}`:'Response saved. Key wording feedback is shown below; a teacher must confirm the explanation and marks.'};}
root.WrittenAnswerChecker={plan,check,checkField,compareKey,normal};
})(typeof window==='undefined'?globalThis:window);
