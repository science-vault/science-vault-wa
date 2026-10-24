/* Shared navigation and accessibility; no student-result collection. */
(function(){
 'use strict';
 function setup(){
  const bar=document.querySelector('.topbar');if(!bar)return;let nav=bar.querySelector('nav');if(!nav){nav=document.createElement('nav');bar.appendChild(nav)}
  let role='';try{role=sessionStorage.getItem('lv-role')||'';sessionStorage.removeItem('lv-tracking-session');for(let i=sessionStorage.length-1;i>=0;i--){const key=sessionStorage.key(i);if(key?.startsWith('lv-pending:'))sessionStorage.removeItem(key)}}catch{}
  const page=location.pathname.split('/').pop()||'index.html';
  const link=(href,label)=>`<a href="${href}"${page===href?' aria-current="page" class="active"':''}>${label}</a>`;
  const group=(name,links)=>`<details class="site-nav-menu"><summary>${name}</summary><div class="site-nav-dropdown">${links.map(([href,label])=>link(href,label)).join('')}</div></details>`;
  nav.id='siteNavigation';nav.setAttribute('aria-label','Main navigation');
  nav.innerHTML=link('index.html','Home')+link('topic-hub.html','Lessons')+link('student-quiz.html','Practice Studio')+link('interactive-lab.html','Interactive Lab')+link('learning-quest.html','Learning Quest')+link('quiz-battle.html','Quiz Battle')+group('Resources',[
   ['library.html','All resources'],['powerpoints.html','PowerPoints'],['worksheets.html','Worksheets'],['practicals.html','Practicals'],['notes.html','Notes'],['revision.html','Revision'],['videos.html','Videos'],['assessments.html','Assessments'],['exams.html','Exam papers'],['textbooks.html','Textbooks']
  ])+group('Teacher tools',[
   ['teacher-classes.html','Classes and progress'],['assessment-builders.html','Assessment builders'],['assessment-builder.html','Years 7–10 builder'],['upper-school-assessment-builder.html','Years 11–12 builder']
  ])+link(role==='teacher'?'teacher-area.html':'student-area.html',role==='teacher'?'Teacher area':'Student area')+link('student-classes.html','My tasks')+'<a href="account.html" data-account-link>Log in / Sign up</a>';
  Promise.all([import('./access-client.mjs?v=2026.10.9-classes'),import('./access-policy.mjs?v=2026.10.9-classes'),import('./page-catalog.mjs?v=2026.10.24-discover')]).then(([client,policy,catalog])=>client.observeAccess(state=>{
   const accountLink=nav.querySelector('[data-account-link]');if(accountLink)accountLink.textContent=state.user?'My account':'Log in / Sign up';
   if(!state.ready)return;
   nav.querySelectorAll('a:not([data-account-link])').forEach(a=>{const file=new URL(a.href,location.href).pathname.split('/').pop();const page=catalog.PAGES.find(p=>p.id===file);a.hidden=!!page&&!policy.canOpenPage(state,page)});
   nav.querySelectorAll('details').forEach(menu=>menu.hidden=![...menu.querySelectorAll('a')].some(a=>!a.hidden));fitNavigation();
   let adminLink=nav.querySelector('[data-admin-link]');if(state.admin&&!adminLink){adminLink=document.createElement('a');adminLink.href='admin-access.html';adminLink.dataset.adminLink='';adminLink.textContent='Admin';nav.insertBefore(adminLink,accountLink)}if(adminLink)adminLink.hidden=!state.admin;let directoryLink=nav.querySelector('[data-directory-link]');if(state.admin&&!directoryLink){directoryLink=document.createElement('a');directoryLink.href='file-directory.html';directoryLink.dataset.directoryLink='';directoryLink.textContent='File Directory';nav.insertBefore(directoryLink,accountLink)}if(directoryLink)directoryLink.hidden=!state.admin;
   let activityLink=nav.querySelector('[data-activity-link]');if(state.admin&&!activityLink){activityLink=document.createElement('a');activityLink.href='admin-activity.html';activityLink.dataset.activityLink='';activityLink.textContent='Activity & traffic';nav.insertBefore(activityLink,accountLink)}if(activityLink)activityLink.hidden=!state.admin;
   const teacherTools=catalog.PAGES.some(p=>p.group==='Teacher tools'&&policy.canOpenPage(state,p));document.querySelectorAll('[data-teacher-only]').forEach(el=>el.hidden=!teacherTools);
  })).catch(()=>{});
  const compactStyle=document.createElement('style');compactStyle.textContent='.topbar.site-nav-compact{flex-wrap:wrap;gap:8px}.topbar.site-nav-compact .brand{margin-right:auto}.topbar.site-nav-compact .site-nav-toggle{display:block}.topbar.site-nav-compact nav{display:none;width:100%;align-items:stretch;flex-direction:column;padding:8px 0;max-height:75vh;overflow:auto}.topbar.site-nav-compact.site-nav-open nav{display:flex}.topbar.site-nav-compact .site-nav-dropdown{position:static;width:100%;box-shadow:none;border:0;background:#f1f6f5;margin-top:5px}';document.head.append(compactStyle);
  function fitNavigation(){bar.classList.remove('site-nav-compact');if(window.innerWidth>1000&&nav.scrollWidth>bar.clientWidth-(bar.querySelector('.brand')?.offsetWidth||0)-100)bar.classList.add('site-nav-compact');}
  window.addEventListener('resize',fitNavigation,{passive:true});
  const toggle=document.createElement('button');toggle.type='button';toggle.className='site-nav-toggle';toggle.textContent='Menu';toggle.setAttribute('aria-controls',nav.id);toggle.setAttribute('aria-expanded','false');bar.insertBefore(toggle,nav);fitNavigation();
  const close=()=>{bar.classList.remove('site-nav-open');toggle.setAttribute('aria-expanded','false');nav.querySelectorAll('details').forEach(el=>el.open=false)};
  toggle.addEventListener('click',()=>{const open=bar.classList.toggle('site-nav-open');toggle.setAttribute('aria-expanded',String(open))});
  nav.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)nav.querySelectorAll('details').forEach(other=>{if(other!==el)other.open=false})}));
  document.addEventListener('click',e=>{if(!bar.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=bar.classList.contains('site-nav-open');close();if(wasOpen)toggle.focus()}});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  const main=document.querySelector('main')||document.querySelector('.section.content');if(main){if(!main.id)main.id='main-content';const skip=document.createElement('a');skip.className='site-skip';skip.href='#'+main.id;skip.textContent='Skip to content';document.body.prepend(skip)}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();



