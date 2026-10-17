// Pure helpers for lesson practice. No Firebase writes or mastery changes.
export function eligiblePracticeQuestions(questions, count=3){
 if(!Array.isArray(questions))return [];
 return questions.filter(q=>q&&typeof q.prompt==='string'&&q.prompt.trim()&&
  Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=4&&
  Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.options.length&&
  q.options.every(o=>typeof o==='string'&&o.trim())&&
  !/<[^>]+>/.test(q.prompt)&&q.options.every(o=>!/<[^>]+>/.test(o)))
  .slice(0,Math.max(0,Math.min(10,count)));
}
export function scorePractice(questions,choices){
 return questions.reduce((score,q,i)=>score+(choices[i]===q.correct?1:0),0);
}
