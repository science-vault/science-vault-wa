/* Targeted retry matching; shared by the Studio UI and focused checks. */
(function(root){
 const tags=q=>({sub:(q[7]?.subtopics||[]).map(String),topic:(q[7]?.topics||[q[2]]).map(String)});
 const key=(q,i)=>q[7]?.id||'studio-sample-'+i;
 function latest(attempts){const out=new Map();for(const a of attempts)out.set(a.sourceId||'studio-sample-'+a.id,a);return out;}
 function recommend(sourceId,questions,attempts,allowed){
  const source=questions[sourceId];if(!source||!allowed(source[0],source[1]))return null;
  const a=tags(source),history=latest(attempts);
  const candidates=questions.map((q,i)=>{
   if(i===sourceId||q[0]!==source[0]||Number(q[1])!==Number(source[1])||!allowed(q[0],q[1]))return null;
   if((source[7]?.hash&&source[7].hash===q[7]?.hash)||key(q,i)===key(source,sourceId)||q[3]===source[3])return null;
   const b=tags(q),sub=b.sub.filter(t=>a.sub.includes(t)),topic=b.topic.filter(t=>a.topic.includes(t));
   const score=sub.length?100+sub.length:topic.length?10+topic.length:0;if(!score)return null;
   const last=history.get(key(q,i));return {id:i,score,seen:last?last.correct?2:1:0,time:last?.time||0,match:sub.length?'subtopic':'topic',label:(sub.length?sub:topic).join(' · ')};
  }).filter(Boolean).sort((a,b)=>b.score-a.score||a.seen-b.seen||a.time-b.time||a.id-b.id);
  return candidates[0]||null;
 }
 function weaknesses(questions,attempts,allowed){
  const last=latest(attempts);
  return [...last.values()].filter(a=>{
   const q=questions[a.id];if(a.correct||!q||!allowed(q[0],q[1]))return false;
   return !attempts.some(b=>b.correct&&b.retryOf===key(q,a.id)&&b.time>=a.time);
  }).sort((a,b)=>b.time-a.time);
 }
 root.StudioRetries={recommend,weaknesses,key};
})(typeof window==='undefined'?globalThis:window);
