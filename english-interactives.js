/* Original annotation, comparison and writing-planning workbench. No automatic essay grading. */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function mount(model,host,{module:m,screen:s}){
 if(model!=='workbench')throw Error('Unknown English workbench '+model);
 const key='sv-english-workbench-v1-'+m.id,ids=s.sources,data=window.EnglishTexts;
 let saved={};try{saved=JSON.parse(localStorage.getItem(key))||{}}catch{}
 const state={tab:['annotate','compare','plan'].includes(saved.tab)?saved.tab:'annotate',source:ids.includes(saved.source)?saved.source:ids[0],annotation:Number.isInteger(saved.annotation)?saved.annotation:-1,fields:saved.fields&&typeof saved.fields==='object'?saved.fields:{},review:Array.isArray(saved.review)?saved.review:[]};
 const persist=()=>{try{localStorage.setItem(key,JSON.stringify(state));return true}catch{return false}};
 const labels={annotate:'Read and annotate',compare:'Build a comparison',plan:'Plan and review writing'};
 host.innerHTML='<div class="eng-workbench"><p>Explore the original text, build your own relationship between evidence, or plan a piece of writing. These activities save on this browser and do not automatically assess an interpretation.</p><div class="eng-tabs" role="group" aria-label="English workbench activities">'+Object.entries(labels).map(([id,label])=>'<button type="button" class="btn" data-tab="'+id+'" aria-pressed="false">'+label+'</button>').join('')+'</div><div id="engWorkbenchStage"></div><p id="engWorkbenchStatus" role="status"></p></div>';
 const stage=host.querySelector('#engWorkbenchStage'),status=host.querySelector('#engWorkbenchStatus');
 function save(){status.textContent=persist()?'Workbench notes saved on this browser.':'Saving unavailable. Copy your notes before leaving.'}
 function field(id,label,placeholder=''){
  return '<label for="engField-'+id+'">'+esc(label)+'</label><textarea id="engField-'+id+'" data-field="'+id+'" placeholder="'+esc(placeholder)+'">'+esc(state.fields[id]||'')+'</textarea>';
 }
 function bindFields(preview){stage.querySelectorAll('[data-field]').forEach(el=>el.oninput=()=>{state.fields[el.dataset.field]=el.value;save();preview?.()})}
 function render(){
  host.querySelectorAll('[data-tab]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.tab===state.tab));b.classList.toggle('eng-selected',b.dataset.tab===state.tab)});
  if(state.tab==='annotate'){
   const t=data.texts[state.source],notes=data.annotations[state.source]||[],n=notes[state.annotation];let body=esc(t.body);
   if(n){const quote=esc(n[0]),at=body.indexOf(quote);if(at>=0)body=body.slice(0,at)+'<mark>'+quote+'</mark>'+body.slice(at+quote.length)}
   const figure=t.diagram?window.EnglishATARPlayer.figure(t.diagram):'';
   stage.innerHTML='<label for="engSourceChoice">Choose a supplied text</label><select id="engSourceChoice">'+ids.map(id=>'<option value="'+id+'" '+(id===state.source?'selected':'')+'>'+esc(data.texts[id].title)+'</option>').join('')+'</select>'+figure+'<div class="eng-stimulus"><h3>'+esc(t.title)+'</h3><p class="eng-source-context">'+esc(t.context)+'</p><div class="eng-source-body">'+body.replace(/\n/g,'<br>')+'</div></div><h3>Select a verified detail</h3><div class="eng-annotations">'+notes.map((note,i)=>'<button type="button" class="eng-annotation '+(i===state.annotation?'eng-selected':'')+'" data-note="'+i+'">'+esc(note[0])+'</button>').join('')+'</div><p class="eng-note" id="engAnnotationNote" role="status">'+(n?esc(n[1]):'Select a detail to see a model connection. Develop or challenge it with accurate evidence.')+'</p>'+field('annotationNote','Your own interpretation or competing reading','What does this detail suggest here? Which surrounding evidence supports or qualifies that reading?');
   stage.querySelector('#engSourceChoice').onchange=e=>{state.source=e.target.value;state.annotation=-1;render();save()};stage.querySelectorAll('[data-note]').forEach(b=>b.onclick=()=>{state.annotation=+b.dataset.note;render();save()});bindFields();
  }else if(state.tab==='compare'){
   stage.innerHTML='<h3>Compare through '+esc(s.focus)+'</h3><p>Text A: '+esc(data.texts[ids[0]].title)+'. Text B: '+esc(data.texts[ids[1]].title)+'. Use a shared question and verify evidence from both texts.</p>'+field('basis','Common question or conceptual basis')+field('claimA','Text A: choice, evidence and meaning')+field('claimB','Text B: choice, evidence and meaning')+field('relationship','Significant relationship: why the similarity or difference matters')+'<h3>Your comparison notes</h3><div class="eng-note" id="engComparisonPreview"></div><p>This preview joins your notes. It does not generate evidence or judge their quality.</p>';
   function preview(){stage.querySelector('#engComparisonPreview').textContent=['basis','claimA','claimB','relationship'].map(id=>state.fields[id]||'['+({basis:'shared basis',claimA:'Text A reasoning',claimB:'Text B reasoning',relationship:'relationship'}[id])+']').join('\n\n');stage.querySelector('#engComparisonPreview').style.whiteSpace='pre-wrap'}bindFields(preview);preview();
  }else{
   const forms=['Imaginative','Interpretive','Persuasive','Analytical'];if(!forms.includes(state.fields.form))state.fields.form='Imaginative';
   stage.innerHTML='<h3>Plan a sustained piece</h3><label for="engFormChoice">Writing form</label><select id="engFormChoice">'+forms.map(f=>'<option '+(f===state.fields.form?'selected':'')+'>'+f+'</option>').join('')+'</select><p id="engFormGuidance" class="eng-note"></p>'+field('prompt','Prompt and its constraints')+field('audience','Audience, context and purpose')+field('position','Central question, conflict or position')+field('development','Development: two or three meaningful stages')+field('ending','Ending: what changes, resolves or remains qualified')+'<fieldset><legend>Review the plan yourself</legend>'+['The plan meets the actual prompt.','Evidence or scene detail is accurate and purposeful.','Each stage develops the central idea.','The ending follows from the development.','I have allowed time for revision and proofreading.'].map((label,i)=>'<label><input type="checkbox" data-review="'+i+'" '+(state.review.includes(i)?'checked':'')+'>'+label+'</label>').join('')+'</fieldset><p id="engReviewCount"></p><p>Ticking a box records your review; it does not prove that a criterion has been met.</p>';
   const guidance={Imaginative:'Plan a focused scene with pressure, a meaningful change and consistent point of view.',Interpretive:'Explore a question through concrete experience and reflection. A qualified ending can preserve uncertainty.',Persuasive:'State a defensible position, relevant support, a fair counterargument and an achievable next step.',Analytical:'Develop a thesis through accurate evidence, explanation and relevant qualification.'};
   const update=()=>{stage.querySelector('#engFormGuidance').textContent=guidance[state.fields.form];stage.querySelector('#engReviewCount').textContent=state.review.length+'/5 review checks recorded; no automatic writing grade.'};stage.querySelector('#engFormChoice').onchange=e=>{state.fields.form=e.target.value;update();save()};stage.querySelectorAll('[data-review]').forEach(el=>el.onchange=()=>{const n=+el.dataset.review;state.review=state.review.filter(x=>x!==n);if(el.checked)state.review.push(n);update();save()});bindFields();update();
  }
 }
 host.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;render();save()});render();
}
window.EnglishInteractives={mount};
})();
