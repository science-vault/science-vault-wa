/* Shared navigation and accessibility; no student-result collection. */
(function(){
 'use strict';
 function setup(){
  const bar=document.querySelector('.topbar'),nav=bar?.querySelector('nav');if(!bar||!nav)return;
  let role='';try{role=sessionStorage.getItem('lv-role')||'';sessionStorage.removeItem('lv-tracking-session');for(let i=sessionStorage.length-1;i>=0;i--){const key=sessionStorage.key(i);if(key?.startsWith('lv-pending:'))sessionStorage.removeItem(key)}}catch{}
  const page=location.pathname.split('/').pop()||'index.html';
  const link=(href,label)=>`<a href="${href}"${page===href?' aria-current="page" class="active"':''}>${label}</a>`;
  const group=(name,links)=>`<details class="site-nav-menu"><summary>${name}</summary><div class="site-nav-dropdown">${links.map(([href,label])=>link(href,label)).join('')}</div></details>`;
  nav.id='siteNavigation';nav.setAttribute('aria-label','Main navigation');
  nav.innerHTML=link('index.html','Home')+link('topic-hub.html','Lessons')+link('student-quiz.html','Practice')+group('Resources',[
   ['library.html','All resources'],['powerpoints.html','PowerPoints'],['worksheets.html','Worksheets'],['practicals.html','Practicals'],['notes.html','Notes'],['revision.html','Revision'],['videos.html','Videos'],['assessments.html','Assessments'],['exams.html','Exam papers'],['textbooks.html','Textbooks']
  ])+(role==='student'?'':group('Teacher tools',[
   ['assessment-builders.html','Assessment builders'],['assessment-builder.html','Years 7–10 builder'],['upper-school-assessment-builder.html','Years 11–12 builder'],['assessment-question-browser.html','Question bank']
  ]))+link(role==='teacher'?'teacher-area.html':'student-area.html',role==='teacher'?'Teacher area':'Student area');
  const toggle=document.createElement('button');toggle.type='button';toggle.className='site-nav-toggle';toggle.textContent='Menu';toggle.setAttribute('aria-controls',nav.id);toggle.setAttribute('aria-expanded','false');bar.insertBefore(toggle,nav);
  const close=()=>{bar.classList.remove('site-nav-open');toggle.setAttribute('aria-expanded','false');nav.querySelectorAll('details').forEach(el=>el.open=false)};
  toggle.addEventListener('click',()=>{const open=bar.classList.toggle('site-nav-open');toggle.setAttribute('aria-expanded',String(open))});
  nav.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)nav.querySelectorAll('details').forEach(other=>{if(other!==el)other.open=false})}));
  document.addEventListener('click',e=>{if(!bar.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=bar.classList.contains('site-nav-open');close();if(wasOpen)toggle.focus()}});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  const main=document.querySelector('main')||document.querySelector('.section.content');if(main){if(!main.id)main.id='main-content';const skip=document.createElement('a');skip.className='site-skip';skip.href='#'+main.id;skip.textContent='Skip to content';document.body.prepend(skip)}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
