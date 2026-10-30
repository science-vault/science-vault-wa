/* Similar-question retries for MCQ mistakes and written self-review. */
(function(){
 const matcher=window.StudioRetries,previousOpen=openQuestion,previousCheck=check,previousRender=render;
 let origin=null,openTicket=0;
 const panel=document.createElement('section');panel.className='card sidecard';
 const heading=document.createElement('h2');heading.textContent='Targeted retries';
 const summary=document.createElement('p');summary.style.fontSize='12px';summary.setAttribute('role','status');
 const launch=document.createElement('button');launch.className='textbtn';launch.style.marginTop='14px';
 panel.append(heading,summary,launch);document.querySelector('.rail').prepend(panel);
 const allowed=(subject,year)=>!!window.studioCanStudy?.(subject,year);
 function updatePanel(){
  const weak=matcher.weaknesses(questions,state.attempts,allowed);
  summary.textContent=weak.length?weak.length+' question'+(weak.length===1?' needs':'s need')+' another look. Practise the same skill with a different question.':'Automatically marked mistakes will appear here. Responses awaiting teacher review are kept out of this list.';
  launch.hidden=!weak.length;launch.textContent='Practise a weak area →';
  launch.onclick=()=>launchRetry(weak[0].id);
 }
 function launchRetry(sourceId){
  const ticket=++openTicket;origin=null;removeContext();
  const q=questions[sourceId];if(!q||!allowed(q[0],q[1]))return;
  const next=matcher.recommend(sourceId,questions,state.attempts,allowed);
  const target=next?.id??sourceId;
  const attempt=previousOpen(target);
  Promise.resolve(attempt).then(()=>{
   if(ticket!==openTicket||current!==target||$('modal').hidden||!allowed(q[0],q[1]))return;
   origin=matcher.key(q,sourceId);
   if(!next&&document.getElementById('written-answer'))$('written-answer').value='';
   const note=document.createElement('p');note.id='targeted-context';note.className='review-note';
   note.textContent=next?'Targeted retry · Same '+next.match+': '+next.label+'. Try recalling the method before checking the solution.':'No different question matches this topic yet. Retry this question from memory.';
   $('qtext').before(note);
  });
 }
 function removeContext(){document.getElementById('targeted-context')?.remove();document.getElementById('targeted-offer')?.remove();}
 openQuestion=async function(id){openTicket++;origin=null;removeContext();return previousOpen(id);};
 function offer(id){
  document.getElementById('targeted-offer')?.remove();
  if(!allowed(questions[id]?.[0],questions[id]?.[1]))return;
  const next=matcher.recommend(id,questions,state.attempts,allowed);
  const host=document.createElement('div');host.id='targeted-offer';host.className='review-note';
  const text=document.createElement('p');text.textContent=next?'Keep building this skill. A different question on the same '+next.match+' is available.':'There isn’t another matching question yet. You can retry this one from memory.';
  const button=document.createElement('button');button.className='primary';button.textContent=next?'Try a similar question →':'Retry this question →';
  button.onclick=()=>{origin=null;removeContext();launchRetry(id);};host.append(text,button);$('feedback').append(host);
 }
 function recorded(before,id){
  if(state.attempts.length<=before)return;
  const attempt=state.attempts.at(-1);
  if(attempt.reviewRequired)return;
  if(origin){attempt.retryOf=origin;persist();}
  updatePanel();
  if(!attempt.correct)offer(id);
  else if(origin){
   const note=document.createElement('p');note.className='review-note';
   note.textContent=attempt.selfAssessed?'Targeted retry completed · You marked this response as meeting the criteria.':'Targeted retry completed · You answered the related question correctly.';
   $('feedback').append(note);
  }
 }
 check=function(){
  const before=state.attempts.length,id=current,wasChecked=checked;
  previousCheck();
  if(wasChecked)return;
  recorded(before,id);
  // Written questions are recorded only after the learner chooses a self-review.
  for(const name of ['self-correct','self-practice']){
   const button=document.getElementById(name);if(!button)continue;
   const record=button.onclick;
   button.onclick=()=>{const count=state.attempts.length;record();recorded(count,id);};
  }
 };
 render=function(){previousRender();updatePanel();};
 updatePanel();
})();
