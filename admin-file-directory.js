/* Admin-only repository directory viewer. Read-only; no GitHub credentials in browser. */
(()=>{'use strict';
const root=document.getElementById('adminFileDirectory');if(!root)return;
const status=root.querySelector('#directoryStatus'),list=root.querySelector('#directoryList'),crumb=root.querySelector('#directoryBreadcrumb'),search=root.querySelector('#directorySearch'),tabs=root.querySelector('#directoryType');
const base='https://api.github.com/repos/science-vault/science-vault-wa';
let all=[],type='PowerPoints',path=[];
const ext=/\.(pptx?|ppsx?|pdf|docx?|xlsx?)$/i;
const power=/\.(pptx?|ppsx?)$/i;
const assessment=/assessment|exam|test|quiz|marking.?key|rubric/i;
const presentations=/powerpoint|presentation|slides|ppt/i;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function relevant(f){const p=f.path;return type==='PowerPoints'?(power.test(p)||presentations.test(p)&&ext.test(p)):(ext.test(p)&&assessment.test(p));}
function view(){const q=search.value.trim().toLowerCase();const subset=all.filter(relevant);const prefix=path.length?path.join('/')+'/':'';const dirs=new Map(),files=[];
for(const f of subset){if(!f.path.startsWith(prefix))continue;const rest=f.path.slice(prefix.length);if(q){if(!f.path.toLowerCase().includes(q))continue;files.push(f);continue;}const seg=rest.split('/');if(seg.length>1){dirs.set(seg[0],(dirs.get(seg[0])||0)+1);}else files.push(f);}
crumb.innerHTML='<button type="button" data-depth="0">Home</button>'+path.map((p,i)=>' / <button type="button" data-depth="'+(i+1)+'">'+escape(p)+'</button>').join('');
list.replaceChildren();
if(!q)for(const [name,count] of [...dirs].sort((a,b)=>a[0].localeCompare(b[0]))){const b=document.createElement('button');b.type='button';b.className='directory-folder';b.textContent='📁  '+name+'  ('+count+')';b.onclick=()=>{path.push(name);view();};list.append(b);}
for(const f of files.sort((a,b)=>a.path.localeCompare(b.path)).slice(0,350)){const row=document.createElement('div');row.className='directory-file';const title=document.createElement('span');title.textContent='📄  '+(q?f.path:f.path.split('/').pop());const a=document.createElement('a');a.textContent='View / Download ↗';a.target='_blank';a.rel='noopener noreferrer';a.href='https://github.com/science-vault/science-vault-wa/blob/HEAD/'+f.path.split('/').map(encodeURIComponent).join('/');row.append(title,a);list.append(row);}
status.textContent=(q?'Search results':'Folder contents')+': '+files.length+' files'+(files.length>350?' (showing first 350)':'')+' · '+dirs.size+' folders. Repository index: '+subset.length+' matching files.';
if(!files.length&&!dirs.size){const p=document.createElement('p');p.textContent='No matching files found.';list.append(p);}
}
crumb.addEventListener('click',e=>{const b=e.target.closest('button[data-depth]');if(b){path=path.slice(0,Number(b.dataset.depth));view();}});
tabs.addEventListener('change',()=>{type=tabs.value;path=[];search.value='';view();});search.addEventListener('input',view);
async function load(){status.textContent='Loading repository directory…';try{
const response=await fetch(base+'/git/trees/main?recursive=1');if(!response.ok)throw Error('GitHub returned '+response.status);
const data=await response.json();if(data.truncated)throw Error('Repository index was truncated');
all=(data.tree||[]).filter(x=>x.type==='blob'&&x.path);view();
}catch(err){status.textContent='Full index unavailable. Loading folders individually…';try{
const seen=new Set(),files=[];let queue=[''];let requests=0;
while(queue.length&&requests<180){const batch=queue.splice(0,5);const results=await Promise.all(batch.map(async dir=>{const url=base+'/contents/'+dir.split('/').map(encodeURIComponent).join('/');const response=await fetch(url);if(!response.ok)throw Error('GitHub returned '+response.status+' for '+(dir||'root'));return {dir,entries:await response.json()};}));requests+=batch.length;
for(const {dir,entries} of results){for(const e of entries){if(e.type==='dir'&&!seen.has(e.path)){seen.add(e.path);queue.push(e.path)}else if(e.type==='file')files.push({path:e.path,type:'blob'});}}
status.textContent='Scanning folders… '+requests+' checked';}
all=files;view();if(queue.length)status.textContent+=' · Scan limit reached; some folders may not appear.';
}catch(failure){status.textContent='Unable to load directory: '+failure.message;}}
}

import('./access-client.mjs').then(api=>api.observeAccess(state=>{const gate=document.getElementById('directoryGate');if(!state.ready)return;root.hidden=!state.admin;gate.hidden=state.admin;if(state.admin&&!all.length)load();})).catch(()=>{status.textContent='Unable to verify administrator access.';});
})();