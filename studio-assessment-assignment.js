/* Resolve builder assignments against stable IDs in the shared Studio bank. */
(function(){
 const route=new URLSearchParams(location.search),code=route.get('class'),taskId=route.get('task');
 if(!code||!taskId)return;
 let task,allowed=new Set(),client,ready=false,results=new Map(),saving=Promise.resolve(),submitted=false;
 const notice=document.createElement('p');notice.className='review-note';notice.setAttribute('role','status');notice.textContent='Loading your assigned assessment…';$('content').before(notice);
 const previousEligible=eligible,previousOpen=openQuestion;
 eligible=function(){return ready?previousEligible().filter(({q})=>allowed.has('studio:'+q[7]?.id)).sort((a,b)=>task.questionIds.indexOf('studio:'+a.q[7].id)-task.questionIds.indexOf('studio:'+b.q[7].id)):[];};
 openQuestion=function(id){if(!ready||!allowed.has('studio:'+questions[id]?.[7]?.id))return;return previousOpen(id);};
 function message(){notice.textContent=task.title+' · '+results.size+' / '+allowed.size+' questions reviewed'+(submitted?' · Submitted to your teacher.':'. Written responses require teacher marking.');}
 async function initialise(){try{
  client=await import('./class-client.mjs?v=2026.10.25-studio');task=await client.loadTask(code,taskId);
  if(!Array.isArray(task.questionIds)||!task.questionIds.length||task.questionIds.some(id=>!String(id).startsWith('studio:')))throw Error('This assessment uses the retired question bank. Ask your teacher to rebuild it using Practice Studio.');
  if(!physicsLoaded)await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('The question bank could not load. Refresh to retry.')),20000);window.addEventListener('vault-studio-bank-ready',()=>{clearTimeout(timer);resolve()},{once:true});});
  allowed=new Set(task.questionIds);const available=new Set(questions.filter(q=>q[7]&&q[0].toLowerCase()===String(task.course).replace(/ ATAR$/,'').toLowerCase()&&Number(q[1])===Number(task.yearGroup)).map(q=>'studio:'+q[7].id));
  if([...allowed].some(id=>!available.has(id)))throw Error('Some assigned questions are unavailable for your approved subjects. Ask your teacher to check the assessment.');
  ready=true;filter='all';$('year').value='all';$('search').value='';document.querySelector('[data-view=practice]').click();message();render();
 }catch(e){ready=false;notice.textContent=e.message;render();}}
 window.addEventListener('vault-studio-answer',event=>{
  const d=event.detail,id='studio:'+d.questionId;if(!ready||submitted||!allowed.has(id))return;
  const meta=questions.find(q=>q[7]?.id===d.questionId)?.[7];if(!meta)return;
  results.set(id,{questionId:id,correct:!d.manual&&!!d.correct,manual:!!d.manual,marks:Number(meta.marks),response:d.manual?(state.drafts?.[d.questionId]||''):String(chosen)});message();
  if(results.size!==allowed.size)return;
  submitted=true;notice.textContent='Submitting assessment…';const responses=[...results.values()],automatic=responses.filter(r=>!r.manual);
  saving=saving.then(()=>client.saveProgress({title:task.title,course:meta.subject,yearGroup:Number(meta.year),kind:'assessment',earned:automatic.reduce((n,r)=>n+(r.correct?r.marks:0),0),max:automatic.reduce((n,r)=>n+r.marks,0),manualCount:responses.filter(r=>r.manual).length,completed:true,selfReported:responses.some(r=>r.manual),responses})).then(ok=>{if(!ok)throw Error('Your class submission was not saved.');message();}).catch(e=>{submitted=false;notice.textContent=e.message+' Review the final question again to retry submission.';});
 });
 initialise();
})();