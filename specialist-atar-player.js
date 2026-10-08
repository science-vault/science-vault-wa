/* Specialist ATAR: explicit teaching, original written exam practice and concept checks. */
(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function figure(id){const v=window.SpecialistVisuals[id];if(!v)throw new Error('Missing specialist diagram '+id);return `<figure class="mas-figure"><h3>${esc(v.title)}</h3><p class="mas-diagram-hint">Swipe across the diagram to read all labels.</p><div class="mas-svg" tabindex="0" aria-label="Scrollable teaching diagram">${v.svg}</div><figcaption><p><strong>Reading the model:</strong> ${esc(v.explain)}</p><p><strong>Model limit:</strong> ${esc(v.limit)}</p></figcaption></figure>`}
function build(topic,host){
 document.body.classList.add('senior-lms-open');
 const m=window.SpecialistATAR.find(m=>m.id===topic.id);if(!m)throw new Error('Missing specialist module '+topic.id);
 const ss=m.screens,key='sv-specialist-v1-'+m.id;let saved=read(key,null);if(!saved){const parent=read('sv-specialist-v1-'+m.parent,{});saved={drafts:parent.drafts||{},self:parent.self||{}}}let i=Number.isInteger(saved.index)&&saved.index>=0&&saved.index<ss.length?saved.index:0,master=false;const visited=new Set((saved.visited||[]).filter(n=>Number.isInteger(n)&&n>=0&&n<ss.length));let drafts=saved.drafts||{},self=saved.self||{},masterPassed=!!saved.masterPassed;
 function persist(){return write(key,{index:i,visited:[...visited],drafts,self,masterPassed})}
 host.innerHTML=`<div class="sv-lms mas-lms"><aside class="sv-course"><div class="sv-course-title">YEAR ${m.year} MATHEMATICS SPECIALIST ATAR</div><h3>${esc(m.title)}</h3><p class="mas-scope">${esc(m.scope)}</p><p class="mas-small">${ss.length} screens · ${m.questions.length} written exam tasks</p><div class="mas-quick"><button class="btn" id="masPractice">Written practice</button><button class="btn dark" id="masMasterQuick">Mastery check</button></div><label class="mas-small" for="masJump">Jump to a screen</label><select id="masJump" aria-label="Jump to a specialist lesson screen">${ss.map((s,n)=>`<option value="${n}">${n+1}. ${esc(s.title)}</option>`).join('')}</select><details class="mas-outline"><summary>Full lesson outline</summary><div id="masList"></div></details></aside><section class="sv-stage"><div class="sv-top"><div><span id="y12Step"></span><h2 id="y12Title"></h2></div><span id="masVisited"></span></div><div class="sv-progress" aria-label="Screens visited"><i id="masBar"></i></div><article id="masScreen" class="sv-screen"></article><div class="sv-actions"><button id="masPrev" class="btn dark">← Previous</button><button id="masNext" class="btn">Next →</button></div><p class="mas-save" id="masSave"></p></section></div>`;
 const $=s=>host.querySelector(s),screen=$('#masScreen');
 function nav(){
  $('#masList').innerHTML=ss.map((s,n)=>`<button class="sv-lesson-item ${!master&&n===i?'active':''}" data-i="${n}" ${!master&&n===i?'aria-current="step"':''}><b>${visited.has(n)?'✓':n+1}</b><span>${esc(s.title)}</span></button>`).join('')+`<button class="sv-lesson-item ${master?'active':''}" id="masMaster"><b>★</b><span>Mastery concept check${masterPassed?' · passed':''}</span></button>`;
  $('#masList').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{i=+b.dataset.i;render()});$('#masMaster').onclick=showMaster;$('#masJump').value=String(i);
  $('#masVisited').textContent=visited.size+'/'+ss.length+' screens visited';$('#masBar').style.width=(visited.size/ss.length*100)+'%';
 }
 function textarea(q){return `<label class="mas-answer-label" for="masAnswer">Your answer and working</label><textarea id="masAnswer" rows="7" placeholder="Show every mathematical step, state domains and give a clear conclusion. Draw labelled models or graphs on paper when requested.">${esc(drafts[q.id]||'')}</textarea><p class="mas-small">Written work is self-assessed against the suggested marking points. It is not automatically graded.</p>`}
 function markHtml(q){return `<div class="mas-marking"><h3>Suggested answer and marking points</h3><ol>${q.steps.map((s,n)=>`<li>${q.stepsHtml?.[n]||esc(s)}${q.allocations[n]?`<label class="mas-credit">Your credit for this point: <select data-credit="${n}" aria-label="Self-assessed credit for marking point ${n+1}">${Array.from({length:q.allocations[n]+1},(_,v)=>`<option value="${v}" ${+(self[q.id]?.[n]||0)===v?'selected':''}>${v}/${q.allocations[n]}</option>`).join('')}</select></label>`:''}</li>`).join('')}</ol><p class="mas-self-total"></p><p class="mas-small">Accept accurate equivalent mathematical reasoning and valid methods. These are original suggested marking points, not an official SCSA key. Compare your actual working; a self-score is not a teacher-verified result.</p></div>`}
 function bindMark(q){screen.querySelectorAll('[data-credit]').forEach(el=>el.onchange=()=>{self[q.id]??={};self[q.id][el.dataset.credit]=+el.value;persist();update()});function update(){const el=screen.querySelector('.mas-self-total');if(el)el.textContent='Self-assessed: '+Object.values(self[q.id]||{}).reduce((a,b)=>a+(+b||0),0)+'/'+q.marks+' marks'}update()}
 function saveDraft(q){const a=screen.querySelector('#masAnswer');if(a)a.oninput=()=>{drafts[q.id]=a.value;$('#masSave').textContent=persist()?'Draft saved on this browser. Drawings on paper are not saved.':'Browser saving is unavailable. Copy your answer before leaving.'}}
 function render(){
  master=false;const s=ss[i];visited.add(i);$('#y12Title').textContent=s.title;$('#y12Step').textContent=`Screen ${i+1} of ${ss.length}`;
  if(s.kind==='interactive'){screen.innerHTML='<div id="masInteractive"></div>';window.SpecialistInteractives.mount(s.model,screen.querySelector('#masInteractive'))}
  if(s.kind==='learn')screen.innerHTML=`<span class="mas-kicker">LEARN · APPLY · EXPLAIN</span><div class="mas-text"><p>${s.html||esc(s.text)}</p></div>${s.diagram?figure(s.diagram):''}`;
  if(s.kind==='check'){
   const q=m.bank[s.q],opts=shuffle(q.o.map((text,n)=>({text,html:q.oHtml?.[n]||esc(text),correct:n===q.a})));
   screen.innerHTML=`<span class="mas-kicker">FORMATIVE CONCEPT CHECK</span><fieldset class="rq"><legend>${q.qHtml||esc(q.q)}</legend>${opts.map((o,n)=>`<label><input type="radio" name="masForm" value="${n}"> ${o.html}</label>`).join('')}</fieldset><button class="btn" id="masFormCheck">Check and explain</button><p id="masFormFeedback" aria-live="polite"></p>`;
   screen.querySelector('#masFormCheck').onclick=()=>{const a=screen.querySelector('input:checked');screen.querySelector('#masFormFeedback').innerHTML=a?(opts[+a.value].correct?'Correct. ':'Review. ')+(q.whyHtml||esc(q.why))+' Correct answer: '+(q.oHtml?.[q.a]||esc(q.o[q.a])):'Choose an answer first.'};
  }
  if(s.kind==='question'){
   const q=m.questions[s.q];screen.innerHTML=`<span class="mas-kicker">${q.practice?'INDEPENDENT EXAM PRACTICE':'WORKED EXAMPLE · TRY FIRST'} · ${q.marks} MARKS · ${esc(q.mode||'')}</span><div class="mas-prompt"><p>${q.promptHtml||esc(q.prompt)}</p></div>${textarea(q)}${q.practice?'<button class="btn" id="masReveal">Reveal answer and marking points</button><div id="masRevealed"></div>':'<p>Attempt the question first. The next screen explains the solution and marks.</p>'}`;saveDraft(q);
   if(q.practice)screen.querySelector('#masReveal').onclick=()=>{screen.querySelector('#masRevealed').innerHTML=markHtml(q);bindMark(q);screen.querySelector('#masReveal').disabled=true};
  }
  if(s.kind==='solution'){
   const q=m.questions[s.q];screen.innerHTML=`<span class="mas-kicker">WORKED SOLUTION · ${q.marks} MARKS · ${esc(q.mode||'')}</span><p>${q.promptHtml||esc(q.prompt)}</p><details class="mas-draft-view"><summary>Review your attempt</summary><pre>${esc(drafts[q.id]||'No typed attempt yet. Review your paper working or go back to attempt the question.')}</pre></details>${markHtml(q)}`;bindMark(q);
  }
  if(s.kind==='sources'||s.kind==='reference')screen.innerHTML=s.html;
  
  $('#masPrev').disabled=i===0;$('#masNext').style.display='';$('#masNext').textContent=i===ss.length-1?'Start mastery concept check →':'Next →';nav();$('#masSave').textContent=persist()?'Progress and typed drafts are saved on this browser. Screen visits do not prove understanding.':'Browser saving is unavailable; keep a copy of your working.';
 }
 function showMaster(){
  master=true;$('#y12Title').textContent='Mastery concept check';$('#y12Step').textContent='Separate concept check';$('#masNext').style.display='none';$('#masPrev').disabled=false;
  const qs=shuffle(m.bank).map(q=>{const opts=shuffle(q.o.map((text,n)=>({text,html:q.oHtml?.[n]||esc(text),correct:n===q.a})));return {...q,opts,correct:opts.findIndex(o=>o.correct)}});
  screen.innerHTML=`<span class="mas-kicker">CONCEPT CHECK · 100% TO PASS</span><p>These ${qs.length} questions check key ideas. ATAR preparation also requires the written exam tasks, reasoning, graphs, domains and explanations. Passing this check alone does not establish exam readiness.</p><div id="ymq">${qs.map((q,n)=>`<fieldset class="rq" data-a="${q.correct}"><legend>${n+1}. ${q.qHtml||esc(q.q)}</legend>${q.opts.map((o,j)=>`<label><input type="radio" name="ym${n}" value="${j}"> ${o.html}</label>`).join('')}<div class="mas-mc-feedback" data-feedback="${n}"></div></fieldset>`).join('')}</div><button class="btn" id="ymCheck">Check mastery</button> <button class="btn dark" id="ymRetry">New attempt</button><div id="ymResult" aria-live="polite"></div>`;
  $('#ymCheck').onclick=()=>{let score=0;screen.querySelectorAll('.rq').forEach((el,n)=>{const choice=el.querySelector('input:checked'),ok=choice&&+choice.value===qs[n].correct;if(ok)score++;el.querySelector('.mas-mc-feedback').innerHTML=(ok?'Correct. ':'Review: ')+(qs[n].whyHtml||esc(qs[n].why))+' Correct answer: '+(qs[n].oHtml?.[qs[n].a]||esc(qs[n].o[qs[n].a]))});const pass=score===qs.length;masterPassed=masterPassed||pass;persist();$('#ymResult').innerHTML=`<p class="${pass?'master-pass':'master-retry'}">${score}/${qs.length}. ${pass?'100% concept check passed. Continue developing your written answers.':'Review the explanations, then retry.'}</p>`;nav()};$('#ymRetry').onclick=showMaster;nav();
 }
 $('#masJump').onchange=()=>{i=+$('#masJump').value;render()};$('#masPrev').onclick=()=>{if(master){i=ss.length-1}else if(i>0)i--;render()};$('#masNext').onclick=()=>{if(i<ss.length-1){i++;render()}else showMaster()};
 function practice(){i=ss.findIndex(s=>s.kind==='question'&&m.questions[s.q].practice);render()}
 $('#masPractice').onclick=practice;$('#masMasterQuick').onclick=showMaster;
 window.SpecialistATARPlayer.current={practice,mastery:showMaster};render();
}
window.SpecialistATARPlayer={build,current:null,figure};
})();
