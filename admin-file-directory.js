/* Admin-only repository directory viewer. Read-only; no GitHub credentials in browser. */
(()=>{'use strict';
const root=document.getElementById('adminFileDirectory');if(!root)return;
const status=root.querySelector('#directoryStatus'),list=root.querySelector('#directoryList'),crumb=root.querySelector('#directoryBreadcrumb'),search=root.querySelector('#directorySearch'),tabs=root.querySelector('#directoryType');
const base='https://api.github.com/repos/science-vault/science-vault-wa';
let all=[],type='PowerPoints',path=[];
const ext=/\.(pptx?|ppsx?|pdf|docx?|xlsx?)$/i;
const folderNames={PowerPoints:/^powerpoints?$/i,Assessments:/^assessments?$/i};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function directoryPath(f){
const parts=f.path.split('/'),folders=parts.slice(0,-1);
if(!ext.test(f.path)||!folders.some(name=>folderNames[type].test(name)))return null;
// Open the main assessment archive directly; other matching folders retain their year/subject context.
if(type==='Assessments'&&parts[0]==='resources'&&folderNames.Assessments.test(parts[1]))return parts.slice(2).join('/');
return (parts[0]==='resources'?parts.slice(1):parts).join('/');
}
function view(){const q=search.value.trim().toLowerCase();const subset=all.map(f=>({...f,directoryPath:directoryPath(f)})).filter(f=>f.directoryPath!==null);const prefix=path.length?path.join('/')+'/':'';const dirs=new Map(),files=[];
for(const f of subset){if(!f.directoryPath.startsWith(prefix))continue;const rest=f.directoryPath.slice(prefix.length);if(q){if(!f.path.toLowerCase().includes(q))continue;files.push(f);continue;}const seg=rest.split('/');if(seg.length>1){dirs.set(seg[0],(dirs.get(seg[0])||0)+1);}else files.push(f);}
crumb.innerHTML='<button type="button" data-depth="0">'+escape(type)+'</button>'+path.map((p,i)=>' / <button type="button" data-depth="'+(i+1)+'">'+escape(p)+'</button>').join('');
list.replaceChildren();
if(!q)for(const [name,count] of [...dirs].sort((a,b)=>a[0].localeCompare(b[0]))){const b=document.createElement('button');b.type='button';b.className='directory-folder';b.textContent='📁  '+name+'  ('+count+')';b.onclick=()=>{path.push(name);view();};list.append(b);}
for(const f of files.sort((a,b)=>a.path.localeCompare(b.path)).slice(0,350)){const row=document.createElement('div');row.className='directory-file';const title=document.createElement('span');title.textContent='📄  '+(q?f.path:f.path.split('/').pop());const a=document.createElement('a');a.textContent='View / Download ↗';a.target='_blank';a.rel='noopener noreferrer';a.href='https://github.com/science-vault/science-vault-wa/blob/HEAD/'+f.path.split('/').map(encodeURIComponent).join('/');row.append(title,a);list.append(row);}
status.textContent=(q?'Search results':'Folder contents')+': '+files.length+' files'+(files.length>350?' (showing first 350)':'')+' · '+dirs.size+' folders. Repository index: '+subset.length+' matching files.';
if(!files.length&&!dirs.size){const p=document.createElement('p');p.textContent='No matching files found.';list.append(p);}
}
crumb.addEventListener('click',e=>{const b=e.target.closest('button[data-depth]');if(b){path=path.slice(0,Number(b.dataset.depth));view();}});
tabs.addEventListener('change',()=>{type=tabs.value;path=[];search.value='';view();});search.addEventListener('input',view);
async function load(){
status.textContent='Loading file directory index…';
try{
const response=await fetch('file-directory-index.json?v=20261015',{cache:'no-store'});
if(!response.ok)throw Error('Directory index not published yet (HTTP '+response.status+')');
const data=await response.json();
if(!Array.isArray(data.files))throw Error('Directory index format is invalid');
all=data.files.filter(x=>x.type==='blob'&&typeof x.path==='string');
view();
}catch(error){
status.textContent='Directory index unavailable: '+error.message+'. The GitHub Actions index workflow may still be running.';
}
}

import('./access-client.mjs').then(api=>api.observeAccess(state=>{const gate=document.getElementById('directoryGate');if(!state.ready)return;root.hidden=!state.admin;gate.hidden=state.admin;if(state.admin&&!all.length)load();})).catch(()=>{status.textContent='Unable to verify administrator access.';});
})();