/* Previous-question review. Navigation never submits or grades an answer. */
(function(){'use strict';
 const lowerOpen=window.studioOpenReviewQuestion,previousCheck=check;
 let visits=[],cursor=-1,reviewing=false,pending=null,ticket=0,settling=false;
 const key=id=>questions[id]?.[7]?.id||'studio-sample-'+id;
 const bar=document.createElement('nav');bar.className='studio-review-nav';bar.setAttribute('aria-label','Question history');
 const back=document.createElement('button'),forward=document.createElement('button'),saved=document.createElement('button'),position=document.createElement('span');
 back.type=forward.type=saved.type='button';back.className=forward.className=saved.className='tab';back.textContent='← Back';forward.textContent='Forward →';saved.textContent='Review saved answer';position.setAttribute('role','status');bar.append(back,position,forward,saved);$('modal').querySelector('.player-bottom').before(bar);
 const note=document.createElement('p');note.className='review-note studio-review-note';note.hidden=true;$('qtext').before(note);
 const css=document.createElement('style');css.textContent='.studio-review-nav{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:22px 0 12px}.studio-review-nav span{font-size:12px;color:#6e6380}.studio-review-nav button:disabled{opacity:.45;cursor:default}.studio-review-nav button:last-child{margin-left:auto}.studio-review-note{border-left:3px solid #8066c5}.studio-review-nav .tab{white-space:nowrap}@media(max-width:550px){.studio-review-nav{gap:8px}.studio-review-nav button:last-child{margin-left:0}}';document.head.append(css);
 state.answerReview=state.answerReview&&typeof state.answerReview==='object'?state.answerReview:{};
 function snapshot(){
  if(cursor<0||!visits[cursor]||visits[cursor].id!==current||$('modal').hidden)return null;
  return {id:current,key:key(current),chosen,checked,written:$('written-answer')?.value??null,typed:[...document.querySelectorAll('.maths-typed-results input')].map(n=>n.value),typedFeedback:document.querySelector('.maths-result-feedback')?.textContent||'',typedHTML:document.querySelector('.maths-result-feedback')?.innerHTML||'',feedback:$('feedback').innerHTML,feedbackNodes:[...$('feedback').childNodes],feedbackVisible:!$('feedback').hidden,writtenFeedback:document.querySelector('.written-check-summary')?.textContent||'',checkLabel:$('check').textContent};
 }
 function remember(){
  if(reviewing||pending)return;
  const value=snapshot();if(!value)return;visits[cursor].response=value;
  if(value.checked||value.typedFeedback){
   const record={...value,time:Date.now()};delete record.feedback;delete record.feedbackNodes;delete record.typedHTML;
   state.answerReview[value.key]=record;
   const keys=Object.keys(state.answerReview).sort((a,b)=>(state.answerReview[b].time||0)-(state.answerReview[a].time||0));keys.slice(80).forEach(k=>delete state.answerReview[k]);persist();
  }
  paint();
 }
 function allowed(id){
  const q=questions[id];if(!q||!window.studioCanStudy?.(q[0],q[1]))return false;
  const route=new URLSearchParams(location.search);return !(route.get('class')&&route.get('task'))||eligible().some(x=>x.i===id);
 }
 function paint(){
  $('check').disabled=!!pending||settling;back.disabled=!!pending||settling||cursor<=0;forward.hidden=cursor>=visits.length-1;forward.disabled=!!pending;
  position.textContent=cursor<0?'':(reviewing?'Reviewing question ':'Question ')+(cursor+1)+' of '+visits.length;
  saved.hidden=reviewing||!state.answerReview[key(current)];saved.disabled=!!pending;
  note.hidden=!reviewing;if(reviewing){note.textContent='Your previous response · Review only. Your current question and draft are kept, and no extra attempt or XP is recorded.';$('check').textContent='Return to current question →';}
 }
 function feedbackFromRecord(value){
  const q=questions[current],m=q[7];const fragment=document.createElement('div');
  if(value.chosen!==null&&value.chosen!==undefined){const correct=value.chosen===(m?.correctAnswer??q[5]);const p=document.createElement('p');p.textContent=correct?'Your submitted answer was correct.':'Your submitted answer needs more practice.';fragment.append(p);}
  if(value.writtenFeedback){const summary=document.createElement('p');summary.className='review-note';summary.textContent=value.writtenFeedback;fragment.append(summary);}
  const answer=document.createElement('div');if(m?.answerHtml)answer.innerHTML=m.answerHtml;else answer.textContent=q[6]||'';fragment.append(answer);return fragment.innerHTML;
 }
 function restore(value,readOnly){
  chosen=value.chosen??null;checked=!!value.checked;
  document.querySelectorAll('#answers .answer').forEach((b,i)=>{b.classList.toggle('chosen',i===chosen);b.classList.toggle('right',checked&&i===(questions[current][7]?.correctAnswer??questions[current][5]));b.classList.toggle('wrong',checked&&i===chosen&&i!==(questions[current][7]?.correctAnswer??questions[current][5]));b.disabled=readOnly;});
  if($('written-answer')){$('written-answer').value=value.written??'';$('written-answer').readOnly=readOnly;}
  document.querySelectorAll('.maths-typed-results input').forEach((n,i)=>{n.value=value.typed?.[i]??'';n.readOnly=readOnly;});
  const typed=document.querySelector('.maths-result-feedback');if(typed){if(value.typedHTML)typed.innerHTML=value.typedHTML;else typed.textContent=value.typedFeedback||'';}
  document.querySelectorAll('.maths-typed-results button').forEach(b=>b.disabled=readOnly);
  $('feedback').hidden=!value.feedbackVisible;if(value.feedbackNodes)$('feedback').replaceChildren(...value.feedbackNodes.map(n=>readOnly?n.cloneNode(true):n));else $('feedback').innerHTML=value.feedback??(value.feedbackVisible?feedbackFromRecord(value):'');
  // Historical self-review/retry controls must never submit another attempt.
  if(readOnly)$('feedback').querySelectorAll('button').forEach(b=>b.disabled=true);
  $('check').textContent=value.checkLabel||'Check answer';reviewing=readOnly;paint();
 }
 async function go(index,override){
  if(pending||!visits[index]||!allowed(visits[index].id))return;
  remember();const target=visits[index];pending={index,override};paint();
  try{await lowerOpen(target.id);if(current!==target.id||$('modal').hidden){pending=null;paint();}}
  catch{pending=null;paint();}
 }
 window.addEventListener('vault-studio-before-question',()=>{if(!pending)remember();settling=true;$('check').disabled=true;});
 window.addEventListener('vault-studio-question-opened',event=>{
  const id=event.detail.id,version=++ticket;settling=true;$('check').disabled=true;
  requestAnimationFrame(()=>{
   if(version!==ticket||current!==id||$('modal').hidden)return;
   settling=false;if(pending){const target=pending;pending=null;cursor=target.index;restore(target.override||visits[cursor].response||{chosen:null,checked:false},!!target.override||cursor<visits.length-1);}
   else{reviewing=false;visits.push({id});cursor=visits.length-1;note.hidden=true;remember();paint();}
  });
 });
 back.onclick=()=>go(cursor-1);forward.onclick=()=>go(cursor+1);saved.onclick=()=>go(cursor,state.answerReview[key(current)]);
 check=function(){if(pending||settling)return;if(reviewing){go(visits.length-1);return;}const result=previousCheck();queueMicrotask(remember);return result;};
 $('modal').addEventListener('input',()=>queueMicrotask(remember));$('modal').addEventListener('click',()=>queueMicrotask(remember));
 window.addEventListener('vault-studio-answer',()=>queueMicrotask(remember));
 const previousClose=closePlayer;closePlayer=function(){remember();ticket++;pending=null;settling=false;const result=previousClose();reviewing=false;return result;};
 paint();if(!$('modal').hidden)window.dispatchEvent(new CustomEvent('vault-studio-question-opened',{detail:{id:current}}));
})();

