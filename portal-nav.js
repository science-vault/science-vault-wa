/* Learning Vault WA portal-aware navigation. Authentication can set lv-role later. */
(function(){
  const params=new URLSearchParams(location.search);
  const requested=params.get('role');
  if(requested==='student'||requested==='teacher') sessionStorage.setItem('lv-role',requested);
  let role=sessionStorage.getItem('lv-role');
  if(!role){
    if(location.pathname.endsWith('/student-area.html')||location.pathname.endsWith('student-area.html')) role='student';
    if(location.pathname.endsWith('/teacher-area.html')||location.pathname.endsWith('teacher-area.html')) role='teacher';
  }
  const student=[['student-area.html','Student Area'],['topic-hub.html','Topic Hub'],['student-quiz.html','Student Quiz'],['powerpoints.html','PowerPoints'],['worksheets.html','Worksheets'],['revision.html','Revision'],['notes.html','Notes'],['videos.html','Videos'],['assessments.html','Assessments'],['exams.html','Exams'],['textbooks.html','Textbooks']];
  const teacher=[['teacher-area.html','Teacher Area'],['topic-hub.html','Topic Hub'],['assessment-builders.html','Assessment Builder'],['assessment-question-browser.html','Question Bank'],['student-quiz.html','Student Quiz'],['powerpoints.html','PowerPoints'],['worksheets.html','Worksheets'],['practicals.html','Practicals'],['revision.html','Revision'],['notes.html','Notes'],['videos.html','Videos'],['assessments.html','Assessments'],['exams.html','Exams'],['textbooks.html','Textbooks']];
  window.LearningVaultPortal={
    role,
    links:role==='teacher'?teacher:student,
    enter(r){sessionStorage.setItem('lv-role',r);location.href=r==='teacher'?'teacher-area.html':'student-area.html';},
    clear(){sessionStorage.removeItem('lv-role');location.href='index.html';}
  };
  document.addEventListener('DOMContentLoaded',()=>{
    if(!role)return;
    document.documentElement.dataset.portalRole=role;
    document.querySelectorAll('[data-teacher-only]').forEach(el=>{if(role!=='teacher')el.hidden=true});
    document.querySelectorAll('[data-student-only]').forEach(el=>{if(role!=='student')el.hidden=true});
    const nav=document.querySelector('.topbar nav');
    if(nav&&nav.dataset.portalNav!=='off'&&!document.querySelector('script[src*="site-shell.js"]')){
      const keepHome='<a href="index.html">Home</a>';
      const primary=(role==='teacher'?teacher:student).slice(0,6).map(([href,label])=>`<a href="${href}">${label}</a>`).join('');
      nav.innerHTML=keepHome+primary+`<a href="${role==='teacher'?'teacher-area.html':'student-area.html'}" aria-label="Return to portal">Portal</a>`;
    }
  });
})();