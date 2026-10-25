/* Presentation only: retain the existing builder controls and permissions. */
(function(){
 const builder=document.querySelector('.builder');if(!builder)return;
 const panel=builder.querySelector(':scope > .panel'),paper=builder.querySelector(':scope > .paper'),bank=builder.querySelector(':scope > .bankpanel');if(!panel||!paper||!bank)return;
 const heading=document.createElement('h2');heading.className='panel-title';heading.textContent='Assessment setup';
 const intro=document.createElement('p');intro.className='panel-intro';intro.textContent='Choose your course and question mix.';panel.prepend(heading,intro);
 for(const field of panel.querySelectorAll('.field')){const control=field.querySelector('input,select');if(control?.id)field.querySelector('label')?.setAttribute('for',control.id);}
 const advanced=document.createElement('details');advanced.className='advanced-filters';advanced.innerHTML='<summary>Source & export settings</summary>';
 for(const id of ['syllabusVersion','assessmentVersion','editableFilter','calculatorMode']){const field=document.getElementById(id)?.closest('.field');if(field)advanced.append(field);if(id==='syllabusVersion'&&document.getElementById('versionNotice'))advanced.append(document.getElementById('versionNotice'));}
 panel.querySelector('#build')?.before(advanced);
 const workspace=document.createElement('div');workspace.className='builder-workspace';builder.append(workspace);
 const bar=document.createElement('div');bar.className='workspace-bar';bar.innerHTML='<div class="workspace-tabs" role="tablist" aria-label="Assessment workspace"><button id="bankTab" type="button" role="tab">Question bank</button><button id="previewTab" type="button" role="tab">Assessment preview</button></div><span class="draft-counter" role="status" aria-live="polite"></span>';
 workspace.append(bar,bank,paper);bank.id='builderBankPanel';paper.id='builderPreviewPanel';
 const bankTab=bar.querySelector('#bankTab'),previewTab=bar.querySelector('#previewTab');
 for(const [tab,target] of [[bankTab,bank],[previewTab,paper]]){tab.setAttribute('aria-controls',target.id);target.setAttribute('role','tabpanel');target.setAttribute('aria-labelledby',tab.id);}
 let selected='bank';
 function show(value){selected=value;for(const [tab,target,name] of [[bankTab,bank,'bank'],[previewTab,paper,'preview']]){const active=name===value;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;target.classList.toggle('workspace-inactive',!active);}}
 bankTab.onclick=()=>show('bank');previewTab.onclick=()=>show('preview');
 bar.querySelector('[role=tablist]').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?'bank':e.key==='End'?'preview':selected==='bank'?'preview':'bank';if(bankTab.hidden&&next==='bank')return;show(next);(next==='bank'?bankTab:previewTab).focus();};
 function update(){const questions=typeof built==='undefined'?[]:built;bar.querySelector('.draft-counter').textContent=questions.length+' selected · '+questions.reduce((n,q)=>n+Number(q.marks||0),0)+' marks';bank.querySelectorAll('.bankitem').forEach(card=>{const b=card.querySelector('button[data-id]');if(b){const selected=questions.some(q=>String(q.id)===b.dataset.id);card.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}});}
 const observer=new MutationObserver(update);observer.observe(paper,{childList:true,subtree:true});observer.observe(document.getElementById('bankList'),{childList:true});
 function permissions(){bankTab.hidden=document.body.classList.contains('teacher-limited-builder');if(bankTab.hidden)show('preview');}
 new MutationObserver(permissions).observe(document.body,{attributes:true,attributeFilter:['class']});
 document.getElementById('build')?.addEventListener('click',()=>{if(typeof built!=='undefined'&&built.length)show('preview');});
 show('bank');permissions();update();
})();