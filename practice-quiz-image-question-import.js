/* Image-aware MCQ import: only verified image URLs or resolvable SCSA image packs. */
(function(){
'use strict';
const clean=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/\s+/g,' ').trim();
const imagePattern=/\b(?:diagram|figure|picture|photograph|illustration|shown (?:above|below)|image (?:above|below))\b/i;
function imageData(q){
 const raw=String(q.diagram||'')+' '+String(q.question||'');
 const src=[...raw.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m=>m[1]).filter(s=>/^(?:assets\/|images\/|assessment-builder\/|https:\/\/)/i.test(s));
 const refs=[...raw.matchAll(/<img\b[^>]*data-scsa-pack=["']([^"']+)["'][^>]*data-scsa-image=["']([^"']+)["']/gi)].map(m=>({pack:m[1],image:m[2]}));
 return {src,refs};
}
function prepare(q){
 const img=imageData(q);
 if(!img.src.length&&!img.refs.length)return null;
 const opts=Array.isArray(q.mcOptions)&&q.mcOptions.length===4?q.mcOptions:null;
 const correct=Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4?'ABCD'[q.correctIndex]:null;
 const stem=clean(q.stem||String(q.question||'').split(/<p>\s*A[.)]/i)[0]);
 if(!opts||!correct||stem.length<12)return null;
 return {id:q.id,course:q.course||'Science',subject:q.subject||'science',year:q.year,unit:q.strand||q.unit||'Science',topic:q.topic||'Science',type:'Multiple Choice',difficulty:q.difficulty||'Mixed',marks:1,stem,questionText:stem,mcOptions:opts,correctLetter:correct,source:q.source,sourceFile:q.sourceFile,practiceImages:img.src,practiceImageRefs:img.refs};
}
function collect(existing){
 const seen=new Set((existing||[]).map(q=>String(q.id))),ready=[];let unresolved=0,skipped=0;
 for(const q of window.AssessmentQuestionBank||[]){
  if(!/multiple[\s-]*choice/i.test(String(q.type||''))||seen.has(String(q.id)))continue;
  const item=prepare(q);
  if(!item){skipped++;continue}
  if(item.practiceImageRefs.length&&!window.ScsaSourceImagePacks&&!window.ScsaSourceImagePackResolver){unresolved++;continue}
  ready.push(item);seen.add(String(q.id));
 }
 return {questions:ready,stats:{ready:ready.length,unresolved,skipped}};
}
window.PracticeQuizImageImporter={collect};
})();