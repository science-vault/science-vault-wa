(function(){
 'use strict';
 const api=window.PracticeStudioSources,$=id=>document.getElementById(id),number=n=>n.toLocaleString(),el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 let documents=[],subject=new URLSearchParams(location.search).get('subject')||'',complete=false,loading=false,selected=[];
 const query=new URLSearchParams(location.search).get('q')||'';$('search').value=query;$('fileCheck').disabled=true;
 function sourceLink(file,path){file=file.replace(/\.openai-download-[a-f0-9]+$/,'');const href=api.sourceURL(path);if(!href)return el('strong',file);const a=el('a',file);a.href=href;a.target='_blank';a.rel='noopener';return a;}
 function renderChecks(){const out=$('fileResults');out.replaceChildren();if(!selected.length){out.append(el('li','Your filename results will appear here.','muted'));return;}for(const result of api.matchFiles(documents,selected)){const li=el('li');li.append(el('strong',result.name));li.append(el('span',result.matches.length?'Already listed · '+result.matches.map(d=>d.subject+' · '+number(d.questions)+' questions').join('; '):complete?'No filename match. Search the register if this document has been renamed.':'The register is incomplete. Refresh before checking this file.'));out.append(li);}}
 function renderSubjects(){const box=$('subjects');box.replaceChildren();const names=[...new Set(documents.map(d=>d.subject))].sort();if(!names.includes(subject))subject='';for(const name of ['',...names]){const count=name?documents.filter(d=>d.subject===name).length:documents.length,b=el('button',(name||'All subjects')+' · '+count);b.type='button';b.setAttribute('aria-pressed',String(name===subject));b.onclick=()=>{subject=name;renderSubjects();render();};box.append(b);}}
 function render(){
  const rows=api.filter(documents,subject,$('search').value),container=$('results');container.replaceChildren();
  $('status').className='status'+(complete?'':' error');$('status').textContent=(complete?'':'Some subject records could not load. Refresh for a complete register. ')+number(rows.length)+' of '+number(documents.length)+' documents shown · '+number(rows.reduce((n,d)=>n+d.questions,0))+' question entries.';
  const params=new URLSearchParams();if(subject)params.set('subject',subject);if($('search').value.trim())params.set('q',$('search').value.trim());history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
  if(!rows.length){container.append(el('div','No documents match. Try a different subject, filename or year.','empty'));return;}
  for(const name of [...new Set(rows.map(d=>d.subject))]){
   const group=rows.filter(d=>d.subject===name),section=el('section',undefined,'subject-section'),heading=el('div',undefined,'subject-heading');heading.append(el('h3',name),el('span',group.length+' documents · '+number(group.reduce((n,d)=>n+d.questions,0))+' questions'));section.append(heading);
   const wrap=el('div',undefined,'table-wrap'),table=el('table');table.setAttribute('aria-label',name+' imported source documents');const head=el('thead'),hr=el('tr');for(const title of ['Document','Questions','Marking key','First recorded']){const th=el('th',title);th.scope='col';hr.append(th);}head.append(hr);table.append(head);const body=el('tbody');
   for(const d of group){const tr=el('tr'),file=el('td',undefined,'document');file.append(sourceLink(d.file,d.path));const details=['Questions: Year '+d.years.join(', '),...(d.examYears.length?['Paper '+d.examYears.join(', ')]:[]),...d.units.map(u=>u==='Lower school'?u:'Unit '+u)];file.append(el('div',details.join(' · '),'details'));if(!d.filenameRecorded)file.append(el('div','Original filename not recorded','details'));tr.append(file,el('td',number(d.questions),'count'));const key=el('td',undefined,'key');
    if(d.keys.length===1&&d.keys[0].file===d.file)key.append(el('span','Included in source document'));
    else if(d.keys.length){const details=el('details'),summary=el('summary',d.keys.length===1?'View marking key':d.keys.length+' marking keys');details.append(summary);for(const k of d.keys)details.append(sourceLink(k.file,k.path));key.append(details);}
    else key.append(el('span','Not recorded','muted'));
    tr.append(key,el('td',d.addedAt[0]?new Date(d.addedAt[0]).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}):'Not recorded','recorded'));body.append(tr);
   }table.append(body);wrap.append(table);section.append(wrap);container.append(section);
  }
 }
 async function load(){if(loading)return;loading=true;complete=false;$('refresh').disabled=true;$('download').disabled=true;$('fileCheck').disabled=true;$('status').className='status';$('status').textContent='Loading the current Practice Studio register…';
  try{
   const response=await fetch('practice-studio-source-files.json',{cache:'no-store'});if(!response.ok)throw Error('Source register unavailable');const registry=await response.json();const results=await Promise.allSettled(window.PracticeStudioCatalog.indices.map(async file=>{const res=await fetch(file,{cache:'no-store'});if(!res.ok)throw Error(file);const rows=await res.json();if(!Array.isArray(rows))throw Error(file);return rows;}));
   complete=results.every(r=>r.status==='fulfilled');documents=api.aggregate(results.filter(r=>r.status==='fulfilled').flatMap(r=>r.value),registry);$('docCount').textContent=number(documents.length);$('questionCount').textContent=number(documents.reduce((n,d)=>n+d.questions,0));$('subjectCount').textContent=number(new Set(documents.map(d=>d.subject)).size);$('checkedAt').textContent='Register checked '+new Date().toLocaleString('en-AU',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});$('download').disabled=!complete;$('fileCheck').disabled=!complete;renderSubjects();render();renderChecks();
  }catch(error){$('status').className='status error';$('status').textContent='The register could not load. Please refresh to try again.';$('results').replaceChildren();$('checkedAt').textContent='';}finally{loading=false;$('refresh').disabled=false;}
 }
 $('search').addEventListener('input',()=>{if(!loading&&documents.length)render();});$('refresh').onclick=load;$('fileCheck').onchange=e=>{selected=[...e.target.files].map(f=>f.name);renderChecks();};
 $('download').onclick=()=>{if(!complete)return;const blob=new Blob([api.csv(api.filter(documents,subject,$('search').value))],{type:'text/csv;charset=utf-8'}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='Practice-Studio-Upload-Register.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 load();
})();
