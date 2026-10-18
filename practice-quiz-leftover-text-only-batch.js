/* Single-pass import of remaining text-only multiple-choice questions.
   Uses existing source banks; never fabricates questions or changes Assessment Builder. */
(function(){
'use strict';
const hasImage=q=>/<(?:img|svg|canvas|figure)\b/i.test(String(q.question||'')+' '+String(q.diagram||'')+' '+String(q.stem||''))||Array.isArray(q.practiceImages)&&q.practiceImages.length>0||/\b(?:diagram|figure|picture|photograph|illustration|image (?:above|below)|shown (?:above|below))\b/i.test(String(q.stem||q.questionText||q.question||''));
window.PracticeQuizLeftoverTextOnly={
 async load(existing){
  const raw=await window.StudentQuizBankLoader.loadRaw();
  const seen=new Set((existing||[]).map(q=>String(q.id)));
  const converted=window.PracticeQuizBank.ingestMultipleChoice(raw);
  const accepted=[];
  let imageHeld=0,duplicates=0;
  for(const q of converted){
   if(hasImage(q)){imageHeld++;continue}
   if(seen.has(String(q.id))){duplicates++;continue}
   seen.add(String(q.id));accepted.push(q);
  }
  return {questions:accepted,stats:{scanned:raw.length,converted:converted.length,added:accepted.length,duplicates,imageHeld}};
 }
};
})();