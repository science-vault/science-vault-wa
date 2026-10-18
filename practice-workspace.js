/* Focused practice, per-account browser drafts and reviewed weak-topic history. */
(()=>{'use strict';
const el=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let uid='',index=0,weak=false,active=false,saving=false;const prefix='vault-practice-v1:';
function read(kind,fallback){try{return JSON.parse(localStorage.getItem(prefix+uid+':'+kind))||fallback}catch{return fallback}}
function write(kind,data){try{localStorage.setItem(prefix+uid+':'+kind,JSON.stringify(data));return true}catch{return false}}
function remove(kind){try{localStorage.removeItem(prefix+uid+':'+kind)}catch{}}
function keyKind(q){const origin=String(q.markingKeyOrigin||'');if(/learning vault created/i.test(origin))return q.sourceKeyFile?'Learning Vault supplement · supplied key available':'Learning Vault guidance';if(q.sourceKeyUrl&&/scsa\.wa\.edu\.au/.test(q.sourceKeyUrl))return'Official SCSA marking key';if(q.sourceKeyFile)return'School-supplied marking key';return'Marking guidance · check source'}
function sourceFigures(q){const used=q.diagram||'';return (String(q.question||'').match(/<img\b[^>]*>|<svg\b[\s\S]*?<\/svg>/gi)||[]).filter(tag=>{const id=tag.match(/data-scsa-image="([^"]+)"/);return !id||!used.includes('data-scsa-image="'+id[1]+'"')}).join('')}
function structuredChoice(q){
 if(!/multiple\\s*choice/i.test(String(q.type||'')))return null;
 const raw=String(q.searchText||q.questionText||q.transcription||q.plainText||'').trim();
 if(!raw)return null;
 const lines=raw.split(/\\r?\\n/).map(x=>x.trim()).filter(Boolean);
 let start=-1;const options=[];
 for(let i=0;i<lines.length;i++){
  const match=lines[i].match(/^\\(?([a-dA-D])\\)?[.)]?\\s*(.*)$/);
  if(!match||match[1].toUpperCase()!=='ABCD'[options.length])continue;
  if(start<0)start=i;
  const inline=match[2].trim();
  let value=inline;
  if(!value){let j=i+1;while(j<lines.length&&!/^\\(?[a-dA-D]\\)?[.)]?\\s/.test(lines[j])&&j<i+4){value+=(value?' ':'')+lines[j];j++}i=j-1}
  if(!value)break;
  options.push(value);
  if(options.length===4)break;
 }
 if(start<0||options.length!==4)return null;
 const before=lines.slice(0,start).join(' ').replace(/^(?:SCSA WACE official\\s+){1,3}/i,'').trim();
 const pos=before.search(/(?:\\d+[.)]\\s*)?[A-Z][^.!?]{15,}/);
 const stem=pos>=0?before.slice(pos).replace(/^\\d+[.)]\\s*/,''):before;
 if(stem.length<18)return null;
 return {stem,options};
}
function writtenTranscription(q){
 if(/multiple\s*choice/i.test(String(q.type||'')))return '';
 const raw=String(q.questionText||q.transcription||q.plainText||q.searchText||'').trim();
 if(raw.length<90||/<(?:img|svg)\b/i.test(raw))return '';
 const withoutHeader=raw.replace(/^(?:SCSA WACE official[^\n]*\n?){1,2}/i,'').trim();
 return withoutHeader.length>70?withoutHeader:'';
}
const originalRender=renderQuestion;
renderQuestion=function(q,i){
 const m=window.PracticeQuestionModel?.model(q);
 if(!m)return originalRender(q,i);
 const choice=lowerScienceChoice(q);
 const mc=m.isMC;
 const options=choice?.options||m.structured?.options||null;
 const stem=choice?.stem||m.structured?.stem||'';
 const original=m.original;
 const originalView=m.scan?'<details class="practice-scanned"><summary>View original examination page</summary>'+original+'</details>':'';
 let question='';
 if(m.known){
  const k=m.known;
  q.parts=k.parts;
  q.marks=7;
  const table='<table class="practice-data-table"><thead><tr>'+k.table[0].map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'+k.table.slice(1).map(row=>'<tr>'+row.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
  question='<p class="practice-readable">'+esc(k.intro)+'</p>'+table;
 }else if(mc&&stem){
  question='<div class="practice-readable">'+esc(stem)+'</div>'+originalView;
 }else if(m.written){
  question='<div class="practice-readable practice-written-text">'+esc(m.written).replace(/\r?\n/g,'<br>')+'</div>'+originalView;
 }else if(m.scan){
  question='<div class="practice-scan-fallback"><p>Original examination question (text conversion not yet verified).</p>'+original+'</div>';
 }else question=original;
 const diagram=m.known?'':m.diagrams||'';
 let response='';
 const parts=m.known?.parts||m.parts;
 if(parts.length){
  response=parts.map((p,j)=>'<div class="response-part"><label for="a-'+i+'-'+j+'">'+esc(p.label||'')+' '+esc(p.text||'')+' ('+Number(p.marks||0)+' marks)</label>'+answerBox('a-'+i+'-'+j)+'</div>').join('');
 }else if(mc){
  const opts=options?.length>=2?options:['A','B','C','D'];
  response='<fieldset class="practice-mc-options"><legend>Select one answer</legend>'+opts.map((o,n)=>'<label class="practice-mc-option"><input type="radio" name="practice-choice-'+i+'" value="'+ 'ABCDE'[n]+'" data-target="a-'+i+'"><span>'+('ABCDE'[n])+(options?'. '+esc(o):'')+'</span></label>').join('')+'<select class="answer practice-mc-value" id="a-'+i+'" aria-label="Selected answer"><option value="">Not answered</option>'+opts.map((o,n)=>'<option value="'+ 'ABCDE'[n]+'">'+ 'ABCDE'[n]+'</option>').join('')+'</select></fieldset>';
 }else response=answerBox('a-'+i);
 return '<article class="q focus-question '+(mc?'practice-multiple-choice':'')+'" data-question-index="'+i+'"><div class="question-pane"><div class="question-heading"><h3>Question '+(i+1)+'</h3><span class="marks-tag">'+Number(q.marks||1)+' marks</span></div><div class="meta">'+esc(q.course)+' · '+esc(QuestionBankCategories.label(q))+' · '+esc(q.type)+'</div><div class="question-content">'+question+diagram+'</div></div><div class="answer-pane">'+(mc?'':'<h3>Your response</h3>')+response+'<p class="draft-status" aria-live="polite">Answers save on this device.</p></div></article>';
};
document.getElementById('questions').addEventListener('change',event=>{const radio=event.target.closest('input[data-target]');if(!radio)return;const select=document.getElementById(radio.dataset.target);if(select){select.value=radio.value;select.dispatchEvent(new Event('input',{bubbles:true}));}});
const originalReview=reviewCard;
reviewCard=function(r,i){return originalReview(r,i).replace('<h2>Question ',`<p class="key-origin">${esc(keyKind(r.q))}</p><h2>Question `)};
const baseFilter=filtered;
filtered=function(useTopic=true){const pool=baseFilter(useTopic);if(!weak||assignedTask)return pool;const records=read('history',{}),topics=new Set(Object.values(records).filter(r=>r.max>0&&r.earned/r.max<0.6).map(r=>r.topic));return pool.filter(q=>topics.has(topicKey(q)))};
function topicKey(q){return [q.course,q.year,QuestionBankCategories.classify(q).topic].join('|')}
function answers(){return [...el('questions').querySelectorAll('.answer')].map(a=>({id:a.id,value:a.value}))}
function save(){if(!uid||!active||saving||!selected.length)return false;const filters={};for(const id of ['course','year','unit','topic','subtopic','difficulty','minutes','calculatorMode'])filters[id]=el(id)?.value;const ok=write('draft',{version:1,ids:selected.map(q=>String(q.id)),answers:answers(),startedAt,duration,index,filters,assignment:assignedTask?location.search:'',savedAt:Date.now()});document.querySelectorAll('.draft-status').forEach(p=>p.textContent=ok?'Draft saved on this device.':'Draft could not save. Keep this page open to retain your answers.');if(!ok)el('workspaceStatus').textContent='Browser storage is unavailable. Your current answers remain on this page.';return ok}
function show(i){index=Math.max(0,Math.min(i,selected.length-1));document.querySelectorAll('.focus-question').forEach((q,j)=>q.hidden=j!==index);el('questionPosition').textContent=`Question ${index+1} of ${selected.length}`;el('previousQuestion').disabled=index===0;el('nextQuestion').disabled=index===selected.length-1;el('questionJump').replaceChildren(...selected.map((q,j)=>new Option(`Question ${j+1}`,String(j))));el('questionJump').value=String(index);save()}
function workspace(){active=true;index=0;el('results').classList.add('hidden');el('workspaceNav').hidden=false;show(0);el('quiz').scrollIntoView?.({block:'start',behavior:'smooth'})}
const baseStart=start;start=function(){baseStart();if(!el('quiz').classList.contains('hidden'))workspace()};el('start').onclick=start;
const baseRetry=retry;retry=function(){baseRetry();if(!el('quiz').classList.contains('hidden'))workspace()};el('retry').onclick=retry;
const baseSubmit=submitQuiz;submitQuiz=function(){if(!active)return;active=false;remove('draft');baseSubmit();const history=read('history',{});for(const r of results){if(!r.manual&&r.max>0)history[String(r.q.id)]={topic:topicKey(r.q),earned:r.earned,max:r.max,at:Date.now()}}write('history',Object.fromEntries(Object.entries(history).sort((a,b)=>b[1].at-a[1].at).slice(0,1000)));el('draftBanner').hidden=true;el('results').scrollIntoView?.({block:'start',behavior:'smooth'})};el('submit').onclick=submitQuiz;
const nav=document.createElement('div');nav.id='workspaceNav';nav.className='workspace-nav';nav.hidden=true;nav.innerHTML='<div><span class="eyebrow">PRACTICE SESSION</span><p id="questionPosition" aria-live="polite"></p></div><div class="workspace-controls"><button type="button" class="secondary" id="previousQuestion">Previous</button><label class="sr-only" for="questionJump">Jump to question</label><select id="questionJump"></select><button type="button" class="secondary" id="nextQuestion">Next</button><button type="button" class="secondary" id="saveExit">Save &amp; exit</button></div><p id="workspaceStatus" role="status"></p>';el('questions').before(nav);
el('previousQuestion').onclick=()=>show(index-1);el('nextQuestion').onclick=()=>show(index+1);el('questionJump').onchange=e=>show(Number(e.target.value));el('saveExit').onclick=()=>{if(!save())return;if(timerId)clearInterval(timerId);active=false;el('quiz').classList.add('hidden');el('setup').classList.remove('hidden');banner();el('setup').scrollIntoView?.({block:'start'})};
const draft=document.createElement('section');draft.id='draftBanner';draft.className='draft-banner';draft.hidden=true;draft.innerHTML='<div><strong>Continue your practice</strong><p id="draftInfo"></p></div><div><button type="button" class="primary" id="resumeDraft">Resume session</button> <button type="button" class="secondary" id="discardDraft">Discard draft</button></div>';el('setup').prepend(draft);
const focus=document.createElement('div');focus.className='practice-focus';focus.innerHTML='<span>Practice focus</span><button type="button" class="secondary" id="allPractice" aria-pressed="true">All selected topics</button><button type="button" class="secondary" id="weakPractice" aria-pressed="false">My weak topics</button><p id="weakHelp">Weak topics use automatically checked responses from this browser. Self-review answers are not treated as incorrect.</p>';el('questionTypeMix').before(focus);
function setWeak(value){weak=value;el('weakPractice').setAttribute('aria-pressed',String(value));el('allPractice').setAttribute('aria-pressed',String(!value));showAvailability();if(value&&!filtered().length)el('availability').textContent='No weak-topic questions match these filters yet. Complete a checked practice session, broaden your filters, or choose All selected topics.'}
el('weakPractice').onclick=()=>setWeak(true);el('allPractice').onclick=()=>setWeak(false);
function validDraft(d){return d?.version===1&&Array.isArray(d.ids)&&d.ids.length>0&&d.ids.length<=100&&Array.isArray(d.answers)&&Number.isFinite(d.startedAt)&&Number.isFinite(d.duration)&&d.duration>=0}
function banner(){const candidate=read('draft',null);const d=validDraft(candidate)?candidate:null;draft.hidden=!d||d.assignment!==(assignedTask?location.search:'');if(!draft.hidden)el('draftInfo').textContent=`${d.ids.length} questions · saved ${new Date(d.savedAt).toLocaleString()} · ${d.duration?'the timer continues while away':'untimed'}`}
el('discardDraft').onclick=()=>{remove('draft');draft.hidden=true};
el('resumeDraft').onclick=()=>{const d=read('draft',null);if(!validDraft(d)||d.assignment!==(assignedTask?location.search:''))return;const allowed=new Map(bank().map(q=>[String(q.id),q]));const qs=d.ids.map(id=>allowed.get(id));if(qs.some(q=>!q)){el('draftInfo').textContent='Some draft questions are no longer available. Discard this draft and start a new session.';return}if(assignedTask?.kind==='assessment'&&JSON.stringify(qs.map(q=>String(q.id)))!==JSON.stringify(bank().map(q=>String(q.id)))){el('draftInfo').textContent='The assigned assessment changed. Discard this draft and reopen the assignment.';return}if(!assignedTask){weak=false;el('allPractice').setAttribute('aria-pressed','true');el('weakPractice').setAttribute('aria-pressed','false');const f=d.filters||{};el('course').value=f.course||qs[0].course;refreshYears();el('year').value=f.year||String(qs[0].year);refreshUnits();el('unit').value=f.unit||'all';el('difficulty').value=f.difficulty||'all';el('calculatorMode').value=f.calculatorMode||'all';refreshTopics();el('topic').value=f.topic||'all';refreshSubtopics();el('subtopic').value=f.subtopic||'all';el('minutes').value=f.minutes||'0';showAvailability()}selected=qs;startedAt=d.startedAt;duration=d.duration;el('setup').classList.add('hidden');el('results').classList.add('hidden');el('quiz').classList.remove('hidden');el('questions').innerHTML=selected.map(renderQuestion).join('');for(const a of d.answers){const input=el(a.id);if(input){input.value=a.value;if(input.matches('select.practice-mc-value')){const radio=el('questions').querySelector('input[data-target="'+a.id+'"][value="'+a.value+'"]');if(radio)radio.checked=true}}}el('progress').textContent=`${selected.length} questions · ${selected.reduce((s,q)=>s+Number(q.marks||0),0)} marks`;active=true;el('workspaceNav').hidden=false;show(d.index);if(timerId)clearInterval(timerId);if(duration){tick();if(active)timerId=setInterval(tick,1000)}else el('timer').textContent='Untimed'};
el('questions').addEventListener('input',save);el('questions').addEventListener('change',save);window.addEventListener('beforeunload',save);setInterval(save,5000);
window.PracticeWorkspace={ready(userId){uid=userId;el('weakPractice').disabled=!!assignedTask;el('allPractice').disabled=!!assignedTask;focus.hidden=!!assignedTask;banner()}};
if(window.VaultPracticeUserId)window.PracticeWorkspace.ready(window.VaultPracticeUserId);
})();
