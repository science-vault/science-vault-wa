// Physics ATAR Expansion 2 loader + three-type filter for Upper School Builder.
(function(){
  const src='upper-school-assessment-bank-physics-2026-expansion-2.js?v=2026.10.4.2';
  if(!document.querySelector(`script[src^="upper-school-assessment-bank-physics-2026-expansion-2.js"]`)){
    const s=document.createElement('script'); s.src=src; s.async=false;
    s.onload=()=>{window.dispatchEvent(new Event('physics-bank-updated'));};
    document.head.appendChild(s);
  }
  window.addEventListener('DOMContentLoaded',()=>{
    const topic=document.getElementById('topic'); if(!topic)return;
    const field=document.createElement('div'); field.className='field'; field.id='physicsTypeField';
    field.innerHTML='<label>Question type</label><select id="physicsQuestionType"><option value="all">All question types</option><option>Short Response</option><option>Problem Solving</option><option>Comprehension</option></select>';
    topic.closest('.field').insertAdjacentElement('afterend',field);
    const sel=document.getElementById('physicsQuestionType');
    const isPhysics=()=>{const c=(window.UpperSchoolCourses?.[document.getElementById('area')?.value]||[])[+(document.getElementById('course')?.value||0)];return c?.name==='Physics'&&document.getElementById('pathway')?.value==='ATAR'};
    function visibility(){field.style.display=isPhysics()?'':'none'}
    function filterCards(){visibility(); if(!isPhysics())return; const type=sel.value; document.querySelectorAll('#bankList .bankitem').forEach(card=>{const meta=card.querySelector('.meta')?.textContent||'';card.style.display=type==='all'||meta.includes('• '+type+' •')?'':'none'}); const visible=[...document.querySelectorAll('#bankList .bankitem')].filter(x=>x.style.display!=='none').length; const count=document.getElementById('bankCount'); if(count)count.textContent=visible+' questions currently available';}
    sel.addEventListener('change',filterCards);
    ['area','course','pathway','year','syllabusVersion','unit','topic'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>setTimeout(filterCards,50)));
    const observer=new MutationObserver(()=>filterCards()); const bank=document.getElementById('bankList'); if(bank)observer.observe(bank,{childList:true});
    window.addEventListener('physics-bank-updated',()=>{try{window.renderBank?.()}catch(e){} setTimeout(filterCards,100)});
    visibility();
  });
})();