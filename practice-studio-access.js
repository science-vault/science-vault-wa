// Use the same approved membership subjects and year as the lesson hub.
(function(){
 const previousRender=render;
 render=function(){
  previousRender();
  if(view==='progress') [...$('content').children].forEach((el,i)=>{
   const subject=subjects[i]?.[0];
   el.hidden=!!subject&&!['7','8','9','10','11','12'].some(y=>window.studioCanStudy?.(subject,Number(y)));
  });
 };
 const notice=document.createElement('p');notice.setAttribute('role','status');
 notice.style='font-size:13px;line-height:1.6';$('content').before(notice);
 Promise.all([
  import('./access-client.mjs?v=2026.10.9-classes'),
  import('./registration-options.mjs?v=2026.10.11-geography'),
  import('./access-policy.mjs?v=2026.10.9-classes'),
  import('./page-catalog.mjs?v=2026.10.24-discover')
 ]).then(([client,registration,policy,catalog])=>{
  client.observeAccess(access=>{
   const allowed=access.ready&&policy.canOpenPage(access,catalog.PAGES.find(p=>p.id==='student-quiz.html'));
   window.studioCanStudy=(subject,year)=>allowed&&registration.canStudy(access.member,subject,Number(year),access.admin);
   const available=subjects.filter(s=>[7,8,9,10,11,12].some(y=>window.studioCanStudy(s[0],y)));
   document.querySelectorAll('[data-filter]').forEach(b=>{
    b.hidden=b.dataset.filter!=='all'&&!available.some(s=>s[0]===b.dataset.filter);
   });
   if(filter!=='all'&&!available.some(s=>s[0]===filter))filter='all';
   if(available.length===1)filter=available[0][0];
   document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('selected',b.dataset.filter===filter));
   const student=access.member?.role==='student'&&!access.admin;
   [...$('year').options].forEach(o=>{o.hidden=student&&o.value!=='all'&&Number(o.value)!==Number(access.member.yearGroup);o.disabled=o.hidden;});
   if(student)$('year').value=String(access.member.yearGroup);
   else if($('year').selectedOptions[0]?.disabled)$('year').value='all';
   notice.replaceChildren();
   notice.textContent=!access.ready?'Loading your subjects…':!allowed?'Your approved account is required to practise.':available.length?'Your Practice Studio follows the subjects and year in your approved account.':'No Practice Studio subjects are available for your account.';
   if(available.length===1&&available[0][0]!=='Mathematics'){
    const link=document.createElement('a');
    const params=new URLSearchParams({course:available[0][0]+' ATAR'});
    if(student)params.set('year',String(access.member.yearGroup));
    link.href='topic-hub.html?'+params;link.textContent=' Open '+available[0][0]+' lessons →';notice.append(link);
   }
   if(!$('modal').hidden&&!window.studioCanStudy(questions[current]?.[0],questions[current]?.[1]))closePlayer();
   render();
  });
 }).catch(()=>{window.studioCanStudy=()=>false;notice.textContent='Subject access could not load. Refresh to try again.';render();});
})();
