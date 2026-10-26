/* Shared navigation and accessibility; no student-result collection. */
(function(){
 'use strict';
 function setup(){
  const studio=location.pathname.endsWith('/student-quiz.html');
  let bar=document.querySelector('.topbar');
  if(!bar&&studio){bar=document.createElement('header');bar.className='topbar';document.body.prepend(bar)}
  if(!bar)return;
  document.body.classList.add('lv-shell');if(studio)document.body.classList.add('lv-studio');
  let brand=bar.querySelector('.brand');if(!brand){brand=document.createElement('a');brand.className='brand';bar.prepend(brand)}
  brand.href='index.html';brand.setAttribute('aria-label','Learning Vault WA home');
  brand.innerHTML='<span class="brand-mark">LV</span><span><strong>Learning Vault<span class="lv-brand-dot">.</span></strong><small>YOUR LEARNING SPACE</small></span>';
  let nav=bar.querySelector('nav');if(!nav){nav=document.createElement('nav');bar.appendChild(nav)}
  let role='';try{role=sessionStorage.getItem('lv-role')||'';sessionStorage.removeItem('lv-tracking-session');for(let i=sessionStorage.length-1;i>=0;i--){const key=sessionStorage.key(i);if(key?.startsWith('lv-pending:'))sessionStorage.removeItem(key)}}catch{}
  const page=location.pathname.split('/').pop()||'index.html';
  const link=(href,label)=>`<a href="${href}"${page===href?' aria-current="page" class="active"':''}>${label}</a>`;
  const group=(name,links)=>`<details class="site-nav-menu"><summary>${name}</summary><div class="site-nav-dropdown">${links.map(([href,label])=>link(href,label)).join('')}</div></details>`;
  nav.id='siteNavigation';nav.setAttribute('aria-label','Main navigation');
  nav.innerHTML=link('index.html','Home')+link('topic-hub.html','Lessons')+link('student-quiz.html','Practice Studio')+link('interactive-lab.html','Interactive Lab')+group('Progress', [['leaderboard.html','Leaderboard'],['avatar.html','My avatar'],['learning-quest.html','Learning Quest'],['student-results.html','My results']])+link('quiz-battle.html','Quiz Battle')+group('Resources',[
   ['library.html','All resources'],['powerpoints.html','PowerPoints'],['worksheets.html','Worksheets'],['practicals.html','Practicals'],['notes.html','Notes'],['revision.html','Revision'],['videos.html','Videos'],['assessments.html','Assessments'],['exams.html','Exam papers'],['textbooks.html','Textbooks']
  ])+group('Teacher tools',[
   ['teacher-classes.html','Classes and progress'],['assessment-builders.html','Assessment builders'],['assessment-builder.html','Years 7–10 builder'],['upper-school-assessment-builder.html','Years 11–12 builder']
  ])+link(role==='teacher'?'teacher-area.html':'student-area.html',role==='teacher'?'Teacher area':'Student area')+link('student-classes.html','My tasks')+'<a href="account.html" data-account-link>Log in / Sign up</a>';
  if(studio){
   const local=document.createElement('div');local.className='studio-views';local.setAttribute('role','group');local.setAttribute('aria-label','Practice Studio views');
   const label=document.createElement('span');label.className='lv-nav-label';label.textContent='PRACTICE STUDIO';local.append(label);
   document.querySelectorAll('aside .nav [data-view]').forEach(button=>local.append(button));
   const practiceLink=nav.querySelector('a[href="student-quiz.html"]');practiceLink?.after(local);
   document.querySelector('body>aside')?.remove();
  }
  Promise.all([import('./access-client.mjs?v=2026.10.9-classes'),import('./access-policy.mjs?v=2026.10.26-community1'),import('./page-catalog.mjs?v=2026.10.26-community1')]).then(([client,policy,catalog])=>client.observeAccess(state=>{
   const accountLink=nav.querySelector('[data-account-link]');if(accountLink)accountLink.textContent=state.user?'My account':'Log in / Sign up';
   if(!state.ready)return;
   nav.querySelectorAll('a:not([data-account-link])').forEach(a=>{const file=new URL(a.href,location.href).pathname.split('/').pop();const page=catalog.PAGES.find(p=>p.id===file);a.hidden=!!page&&!policy.canOpenPage(state,page)});
   nav.querySelectorAll('details').forEach(menu=>menu.hidden=![...menu.querySelectorAll('a')].some(a=>!a.hidden));fitNavigation();
   let adminLink=nav.querySelector('[data-admin-link]');if(state.admin&&!adminLink){adminLink=document.createElement('a');adminLink.href='admin-access.html';adminLink.dataset.adminLink='';adminLink.textContent='Admin';nav.insertBefore(adminLink,accountLink)}if(adminLink)adminLink.hidden=!state.admin;let directoryLink=nav.querySelector('[data-directory-link]');if(state.admin&&!directoryLink){directoryLink=document.createElement('a');directoryLink.href='file-directory.html';directoryLink.dataset.directoryLink='';directoryLink.textContent='File Directory';nav.insertBefore(directoryLink,accountLink)}if(directoryLink)directoryLink.hidden=!state.admin;
   let reportsLink=nav.querySelector('[data-reports-link]');if(state.admin&&!reportsLink){reportsLink=document.createElement('a');reportsLink.href='admin-reports.html';reportsLink.dataset.reportsLink='';reportsLink.textContent='Error reports';nav.insertBefore(reportsLink,accountLink)}if(reportsLink)reportsLink.hidden=!state.admin;
   let activityLink=nav.querySelector('[data-activity-link]');if(state.admin&&!activityLink){activityLink=document.createElement('a');activityLink.href='admin-activity.html';activityLink.dataset.activityLink='';activityLink.textContent='Activity & traffic';nav.insertBefore(activityLink,accountLink)}if(activityLink)activityLink.hidden=!state.admin;
   const teacherTools=catalog.PAGES.some(p=>p.group==='Teacher tools'&&policy.canOpenPage(state,p));document.querySelectorAll('[data-teacher-only]').forEach(el=>el.hidden=!teacherTools);
  })).catch(()=>{});
  function fitNavigation(){
   if(window.innerWidth>1000){bar.classList.remove('site-nav-open');const button=bar.querySelector('.site-nav-toggle');button?.setAttribute('aria-expanded','false')}
  }
  window.addEventListener('resize',fitNavigation,{passive:true});
  const toggle=document.createElement('button');toggle.type='button';toggle.className='site-nav-toggle';toggle.textContent='Browse pages';toggle.setAttribute('aria-controls',nav.id);toggle.setAttribute('aria-expanded','false');bar.insertBefore(toggle,nav);fitNavigation();
  const close=()=>{bar.classList.remove('site-nav-open');toggle.setAttribute('aria-expanded','false');nav.querySelectorAll('details').forEach(el=>el.open=false)};
  toggle.addEventListener('click',()=>{const open=bar.classList.toggle('site-nav-open');toggle.setAttribute('aria-expanded',String(open))});
  nav.querySelectorAll('details').forEach(el=>el.addEventListener('toggle',()=>{if(el.open)nav.querySelectorAll('details').forEach(other=>{if(other!==el)other.open=false})}));
  document.addEventListener('click',e=>{if(!bar.contains(e.target))close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=bar.classList.contains('site-nav-open');close();if(wasOpen)toggle.focus()}});
  nav.querySelectorAll('a,[data-view]').forEach(a=>a.addEventListener('click',close));
  import('./content-reports.mjs?v=2026.10.26-community1').catch(()=>{});import('./leaderboard-progress.mjs?v=2026.10.26-community1').catch(()=>{});
  const main=document.querySelector('main')||document.querySelector('.section.content');if(main){if(!main.id)main.id='main-content';const skip=document.createElement('a');skip.className='site-skip';skip.href='#'+main.id;skip.textContent='Skip to content';document.body.prepend(skip)}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();





