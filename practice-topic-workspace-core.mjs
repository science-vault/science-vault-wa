export function questionStatus(answered,flagged,current){return current?'current':flagged?'flagged':answered?'answered':'unanswered'}
export function summary(answers,flags,total){let answered=0,flagged=0;for(let i=0;i<total;i++){if(answers[i])answered++;if(flags.includes(i))flagged++}return{answered,unanswered:total-answered,flagged,total}}
export function safeSessionKey(ids,assignment){return JSON.stringify([ids.map(String),assignment||''])}
