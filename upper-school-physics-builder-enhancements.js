// Physics ATAR enhancements for Upper School Builder.
(function(){
function ready(){
 if(!window.UpperSchoolQuestionBank||!document.getElementById('assessmentType')){setTimeout(ready,80);return;}
 const $=id=>document.getElementById(id), isPhysics=()=>{const c=window.courseObj&&courseObj();return c&&c.name==='Physics'&&$('pathway')?.value==='ATAR'};
 // Insert Physics question-type filter.
 if(!$('questionType')){
  const f=document.createElement('div');f.className='field';f.id='questionTypeField';f.innerHTML='<label>Question type</label><select id="questionType"><option value="all">All question types</option><option>Short Response</option><option>Problem Solving</option><option>Comprehension</option></select>';
  $('assessmentType').closest('.field').after(f);$('questionType').onchange=()=>{if(window.renderBank)renderBank()};
 }
 // Styles for exam layout, diagrams and per-part spaces.
 const st=document.createElement('style');st.textContent='.physics-diagram{max-width:650px;margin:18px auto;border:1px solid #d5dce2;padding:12px;background:#fff}.physics-diagram svg{display:block;width:100%;height:auto}.question-part{margin:20px 0 28px;break-inside:avoid}.part-head{display:flex;justify-content:space-between;gap:18px}.part-text{flex:1}.part-marks{white-space:nowrap;font-weight:700}.physics-working{min-height:145px;margin-top:12px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 27px,#b7c0c8 28px)}.physics-working.large{min-height:270px}.physics-graph{height:300px;border-left:2px solid #333;border-bottom:2px solid #333;margin:22px 25px 35px;background-image:linear-gradient(#e3e8ec 1px,transparent 1px),linear-gradient(90deg,#e3e8ec 1px,transparent 1px);background-size:25px 25px}.physics-key-answer{background:#f3f7f7;padding:12px;border-radius:8px;margin-top:12px}@media print{.panel,.bankpanel,.topbar,.page-hero,.actions{display:none!important}.builder{display:block!important}.paper{border:0!important}.q{break-inside:avoid}}';document.head.appendChild(st);
 const oldCurrent=window.currentBank;
 window.currentBank=function(){let b=oldCurrent();if(isPhysics()&&$('questionType')&&$('questionType').value!=='all')b=b.filter(q=>q.type===$('questionType').value);return b};
 const lineHtml=n=>Array.from({length:n},()=>'<div class="response-line"></div>').join('');
 const partSpace=p=>p.graph?'<div class="physics-graph"></div>':p.space==='large'?'<div class="physics-working large"></div>':p.space==='working'?'<div class="physics-working"></div>':lineHtml(p.lines||Math.max(2,Math.ceil((p.marks||1)*1.5)));
 window.response=function(q){if(isPhysics()&&q.parts)return q.parts.map(p=>`<section class="question-part"><div class="part-head"><div class="part-text"><b>${p.label||''}</b> ${p.text}</div><div class="part-marks">(${p.marks} mark${p.marks===1?'':'s'})</div></div>${p.diagram||''}${partSpace(p)}</section>`).join('');if(q.response==='working')return'<div class="physics-working"></div>';return lineHtml(q.responseLines||Math.max(2,Math.ceil((q.marks||1)*1.3)))};
 window.render=function(){
  if(!built.length){$('output').className='empty';$('output').innerHTML='<h2>Upper School Assessment Builder</h2><p>No questions selected yet.</p>';return}
  $('output').className='';const c=courseObj(),total=built.reduce((s,q)=>s+q.marks,0),v=$('syllabusVersion').selectedOptions[0]?.textContent||'';
  $('output').innerHTML=`<h2>${c?.name||''} ${$('pathway').value} Year ${$('year').value} ${$('assessmentType').value}</h2><div class="meta">Syllabus: ${v}</div><div class="actions"><button onclick="render()">Assessment</button><button onclick="showKey()">Show Marking Key</button><button onclick="window.print()">Download / Print Assessment</button><button onclick="showKey();setTimeout(()=>window.print(),80)">Download / Print Marking Key</button><button onclick="built=[];render()">Clear</button></div><p><b>${built.length} questions • ${total} marks</b></p><div id="questions">${built.map((q,i)=>`<article class="q"><div class="qhead"><strong>Question ${i+1}</strong><strong>[${q.marks} mark${q.marks===1?'':'s'}]</strong></div><div class="meta">${q.unit} • ${q.topic} • ${q.type}</div><div class="question-stem">${q.stem||q.question}</div>${q.diagram||''}${response(q)}</article>`).join('')}</div>`;
 };
 window.showKey=function(){if(!$('questions'))return;$('questions').innerHTML=built.map((q,i)=>`<article class="q"><div class="qhead"><strong>Question ${i+1}</strong><strong>[${q.marks} marks]</strong></div><div class="meta">${q.unit} • ${q.topic} • ${q.type}</div><div class="question-stem">${q.stem||q.question}</div>${q.keyDiagram||q.diagram||''}${q.parts?q.parts.map(p=>`<div class="question-part"><b>${p.label||''}</b> ${p.text} <span class="part-marks">(${p.marks})</span></div>`).join(''):''}<div class="physics-key-answer"><b>Marking key:</b> ${q.answer}</div></article>`).join('')};
 // Physics uses only the three SCSA exam question categories in the question-bank filter.
 const sync=()=>{const field=$('questionTypeField');if(field)field.style.display=isPhysics()?'':'none';if(isPhysics()){$('questionType').value=$('questionType').value||'all'} };
 ['area','course','pathway','year'].forEach(id=>$(id)?.addEventListener('change',()=>setTimeout(sync,0)));sync();
 if(window.renderBank)renderBank();
}
ready();
})();