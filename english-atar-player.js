/* English ATAR: explicit teaching, original written exam practice and concept checks. */
(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function figure(id){const v=window.EnglishVisuals[id];if(!v)throw new Error('Missing english diagram '+id);return `<figure class="eng-figure"><h3>${esc(v.title)}</h3><p class="eng-diagram-hint">Swipe across the diagram to read all labels.</p><div class="eng-svg" tabindex="0" aria-label="Scrollable teaching diagram">${v.svg}</div><figcaption><p><strong>Reading the model:</strong> ${esc(v.explain)}</p><p><strong>Model limit:</strong> ${esc(v.limit)}</p></figcaption></figure>`}
function build(topic,host){
 document.body.classList.add('senior-lms-open');
 const m=window.EnglishATAR.find(m=>m.id===topic.id);if(!m)throw new Error('Missing english module '+topic.id);
 const ss=m.screens,key='sv-english-v1-'+m.id;let saved=read(key,null);if(!saved){const parent=read('sv-english-v1-'+m.parent,{});saved={drafts:parent.drafts||{},self:parent.self||{}}}let i=Number.isInteger(saved.index)&&saved.index>=0&&saved.index<ss.length?saved.index:0,master=false;const visited=new Set((saved.visited||[]).filter(n=>Number.isInteger(n)&&n>=0&&n<ss.length));let drafts=saved.drafts||{},self=saved.self||{},masterPassed=!!saved.masterPassed;
 function persist(){return write(key,{index:i,visited:[...visited],drafts,self,masterPassed})}
 host.innerHTML=`<div class="sv-lms eng-lms"><aside class="sv-course"><div class="sv-course-title">YEAR ${m.year} ENGLISH ATAR</div><h3>${esc(m.title)}</h3><p class="eng-scope">${esc(m.scope)}</p><p class="eng-small">${ss.length} screens · ${m.questions.length} reading and writing tasks</p><div class="eng-quick"><button class="btn" id="engPractice">Writing practice</button><button class="btn dark" id="engMasterQuick">Mastery check</button></div><label class="eng-small" for="engJump">Jump to a screen</label><select id="engJump" aria-label="Jump to an English lesson screen">${ss.map((s,n)=>`<option value="${n}">${n+1}. ${esc(s.title)}</option>`).join('')}</select><details class="eng-outline"><summary>Full lesson outline</summary><div id="engList"></div></details></aside><section class="sv-stage"><div class="sv-top"><div><span id="y12Step"></span><h2 id="y12Title"></h2></div><span id="engVisited"></span></div><div class="sv-progress" aria-label="Screens visited"><i id="engBar"></i></div><article id="engScreen" class="sv-screen"></article><div class="sv-actions"><button id="engPrev" class="btn dark">← Previous</button><button id="engNext" class="btn">Next →</button></div><p class="eng-save" id="engSave"></p></section></div>`;
 const $=s=>host.querySelector(s),screen=$('#engScreen');
 function nav(){
  $('#engList').innerHTML=ss.map((s,n)=>`<button class="sv-lesson-item ${!master&&n===i?'active':''}" data-i="${n}" ${!master&&n===i?'aria-current="step"':''}><b>${visited.has(n)?'✓':n+1}</b><span>${esc(s.title)}</span></button>`).join('')+`<button class="sv-lesson-item ${master?'active':''}" id="engMaster"><b>★</b><span>Mastery concept check${masterPassed?' · passed':''}</span></button>`;
  $('#engList').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{i=+b.dataset.i;render()});$('#engMaster').onclick=showMaster;$('#engJump').value=String(i);
  $('#engVisited').textContent=visited.size+'/'+ss.length+' screens visited';$('#engBar').style.width=(visited.size/ss.length*100)+'%';
 }
 function textarea(q){return `<label class="eng-answer-label" for="engAnswer">Your response and planning</label><textarea id="engAnswer" rows="7" placeholder="Develop a clear interpretation or composition. Use accurate evidence, explain your choices and check audience, purpose and form. Speaking activities need rehearsal with a listener.">${esc(drafts[q.id]||'')}</textarea><p class="eng-small">Writing is reviewed against suggested criteria. Review points are practice indicators, not official English marks or automatic grades.</p>`}
 function markHtml(q){return `<div class="eng-marking"><h3>Model and review criteria</h3><ol>${q.steps.map((s,n)=>`<li>${q.stepsHtml?.[n]||esc(s)}${q.allocations[n]?`<label class="eng-credit">Your review of this criterion: <select data-credit="${n}" aria-label="Self-reviewed criterion ${n+1}">${Array.from({length:q.allocations[n]+1},(_,v)=>`<option value="${v}" ${+(self[q.id]?.[n]||0)===v?'selected':''}>${v}/${q.allocations[n]}</option>`).join('')}</select></label>`:''}</li>`).join('')}</ol><p class="eng-self-total"></p><p class="eng-small">Accept other interpretations supported by accurate evidence and purposeful creative choices. These are original suggested review criteria, not an official SCSA marking key. Review the reasoning and craft of your actual response; a self-score is not a teacher-verified result.</p></div>`}
 function bindMark(q){screen.querySelectorAll('[data-credit]').forEach(el=>el.onchange=()=>{self[q.id]??={};self[q.id][el.dataset.credit]=+el.value;persist();update()});function update(){const el=screen.querySelector('.eng-self-total');if(el)el.textContent='Self-assessed: '+Object.values(self[q.id]||{}).reduce((a,b)=>a+(+b||0),0)+'/'+q.marks+' review points'}update()}
 function saveDraft(q){const a=screen.querySelector('#engAnswer');if(a)a.oninput=()=>{drafts[q.id]=a.value;$('#engSave').textContent=persist()?'Draft saved on this browser. Paper drafts and oral rehearsal are not saved.':'Browser saving is unavailable. Copy your answer before leaving.'}}
 function render(){
  master=false;const s=ss[i];visited.add(i);$('#y12Title').textContent=s.title;$('#y12Step').textContent=`Screen ${i+1} of ${ss.length}`;
  if(s.kind==='interactive'){screen.innerHTML='<div id="engInteractive"></div>';window.EnglishInteractives.mount(s.model,screen.querySelector('#engInteractive'),{module:m,screen:s})}
  if(s.kind==='learn')screen.innerHTML=`<span class="eng-kicker">LEARN · APPLY · EXPLAIN</span><div class="eng-text"><p>${s.html||esc(s.text)}</p></div>${s.diagram?figure(s.diagram):''}`;
  if(s.kind==='check'){
   const q=m.bank[s.q],opts=shuffle(q.o.map((text,n)=>({text,html:q.oHtml?.[n]||esc(text),correct:n===q.a})));
   screen.innerHTML=`<span class="eng-kicker">FORMATIVE CONCEPT CHECK</span><fieldset class="rq"><legend>${q.qHtml||esc(q.q)}</legend>${opts.map((o,n)=>`<label><input type="radio" name="engForm" value="${n}"> ${o.html}</label>`).join('')}</fieldset><button class="btn" id="engFormCheck">Check and explain</button><p id="engFormFeedback" aria-live="polite"></p>`;
   screen.querySelector('#engFormCheck').onclick=()=>{const a=screen.querySelector('input:checked');screen.querySelector('#engFormFeedback').innerHTML=a?(opts[+a.value].correct?'Correct. ':'Review. ')+(q.whyHtml||esc(q.why))+' Correct answer: '+(q.oHtml?.[q.a]||esc(q.o[q.a])):'Choose an answer first.'};
  }
  if(s.kind==='question'){
   const q=m.questions[s.q];screen.innerHTML=`<span class="eng-kicker">${q.practice?'INDEPENDENT WRITING PRACTICE':'WORKED RESPONSE · TRY FIRST'} · ${q.marks} REVIEW POINTS · ${esc(q.mode||'')}</span><div class="eng-prompt">${q.promptHtml||"<p>"+esc(q.prompt)+"</p>"}</div>${textarea(q)}${q.practice?'<button class="btn" id="engReveal">Reveal model and review criteria</button><div id="engRevealed"></div>':'<p>Attempt the question first. The next screen gives a model response and review criteria.</p>'}`;saveDraft(q);
   if(q.practice)screen.querySelector('#engReveal').onclick=()=>{screen.querySelector('#engRevealed').innerHTML=markHtml(q);bindMark(q);screen.querySelector('#engReveal').disabled=true};
  }
  if(s.kind==='solution'){
   const q=m.questions[s.q];screen.innerHTML=`<span class="eng-kicker">MODEL RESPONSE · ${q.marks} REVIEW POINTS · ${esc(q.mode||'')}</span>${q.promptHtml||"<p>"+esc(q.prompt)+"</p>"}<details class="eng-draft-view"><summary>Review your attempt</summary><pre>${esc(drafts[q.id]||'No typed attempt yet. Review your paper response or go back to attempt the question.')}</pre></details>${markHtml(q)}`;bindMark(q);
  }
  if(s.kind==='sources'||s.kind==='reference')screen.innerHTML=s.html;
  
  $('#engPrev').disabled=i===0;$('#engNext').style.display='';$('#engNext').textContent=i===ss.length-1?'Start mastery concept check →':'Next →';nav();$('#engSave').textContent=persist()?'Progress and typed drafts are saved on this browser. Screen visits do not prove understanding.':'Browser saving is unavailable; keep a copy of your working.';
 }
 function showMaster(){
  master=true;$('#y12Title').textContent='Mastery concept check';$('#y12Step').textContent='Separate concept check';$('#engNext').style.display='none';$('#engPrev').disabled=false;
  const qs=shuffle(m.bank).map(q=>{const opts=shuffle(q.o.map((text,n)=>({text,html:q.oHtml?.[n]||esc(text),correct:n===q.a})));return {...q,opts,correct:opts.findIndex(o=>o.correct)}});
  screen.innerHTML=`<span class="eng-kicker">CONCEPT CHECK · 100% TO PASS</span><p>These ${qs.length} questions check key ideas. ATAR preparation also requires the reading and writing tasks, close reading, sustained analysis, composing and oral practice. Passing this check alone does not establish exam readiness.</p><div id="ymq">${qs.map((q,n)=>`<fieldset class="rq" data-a="${q.correct}"><legend>${n+1}. ${q.qHtml||esc(q.q)}</legend>${q.opts.map((o,j)=>`<label><input type="radio" name="ym${n}" value="${j}"> ${o.html}</label>`).join('')}<div class="eng-mc-feedback" data-feedback="${n}"></div></fieldset>`).join('')}</div><button class="btn" id="ymCheck">Check mastery</button> <button class="btn dark" id="ymRetry">New attempt</button><div id="ymResult" aria-live="polite"></div>`;
  $('#ymCheck').onclick=()=>{let score=0;screen.querySelectorAll('.rq').forEach((el,n)=>{const choice=el.querySelector('input:checked'),ok=choice&&+choice.value===qs[n].correct;if(ok)score++;el.querySelector('.eng-mc-feedback').innerHTML=(ok?'Correct. ':'Review: ')+(qs[n].whyHtml||esc(qs[n].why))+' Correct answer: '+(qs[n].oHtml?.[qs[n].a]||esc(qs[n].o[qs[n].a]))});const pass=score===qs.length;masterPassed=masterPassed||pass;persist();$('#ymResult').innerHTML=`<p class="${pass?'master-pass':'master-retry'}">${score}/${qs.length}. ${pass?'100% concept check passed. Continue developing your written answers.':'Review the explanations, then retry.'}</p>`;nav()};$('#ymRetry').onclick=showMaster;nav();
 }
 $('#engJump').onchange=()=>{i=+$('#engJump').value;render()};$('#engPrev').onclick=()=>{if(master){i=ss.length-1}else if(i>0)i--;render()};$('#engNext').onclick=()=>{if(i<ss.length-1){i++;render()}else showMaster()};
 function practice(){i=ss.findIndex(s=>s.kind==='question'&&m.questions[s.q].practice);render()}
 $('#engPractice').onclick=practice;$('#engMasterQuick').onclick=showMaster;
 window.EnglishATARPlayer.current={practice,mastery:showMaster};render();
}
window.EnglishATARPlayer={build,current:null,figure};
})();
