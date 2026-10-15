/* Admin-only repository directory viewer. Read-only; no GitHub credentials in browser. */
(()=>{'use strict';
const root=document.getElementById('adminFileDirectory');if(!root)return;
const status=root.querySelector('#directoryStatus'),list=root.querySelector('#directoryList'),crumb=root.querySelector('#directoryBreadcrumb'),search=root.querySelector('#directorySearch'),tabs=root.querySelector('#directoryType');
const endpoint='https://api.github.com/repos/science-vault/science-vault-wa/git/trees/HEAD?recursive=1';
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
async function load(){status.textContent='Loading repository directory…';try{const response=await fetch(endpoint,{headers:{Accept:'application/vnd.github+json'}});if(!response.ok)throw Error('GitHub returned '+response.status);const data=await response.json();if(data.truncated)status.textContent='Warning: GitHub returned a truncated directory index.';all=(data.tree||[]).filter(x=>x.type==='blob'&&x.path);view();if(data.truncated)status.textContent+=' Some files may not appear.';}catch(err){status.textContent='Unable to load directory: '+err.message;}}
const observer=new MutationObserver(()=>{const panel=document.getElementById('adminPanel');if(panel&&!panel.hidden&&!all.length){observer.disconnect();load();}});observer.observe(document.getElementById('adminPanel'),{attributes:true,attributeFilter:['hidden']});if(!document.getElementById('adminPanel').hidden)load();
})();