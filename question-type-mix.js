/* Subject-aware question counts shared by assessment builders and practice. */
(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function classify(q){
 const type=plain(q.type||q.questionType||'Written response').toLowerCase().replace(/[-_]/g,' ').replace(/\s+/g,' ');
 const section=plain(q.sourceSection||q.section||'').toLowerCase();
 if(/multiple\s*choice|^mcq$/.test(type))return'Multiple choice';
 if(/comprehension/.test(type+' '+section))return'Comprehension';
 if(/problem\s*solving/.test(type))return'Problem solving';
 if(/calculat|numerical/.test(type))return'Calculations';
 if(/data\s*(analysis|interpretation)|source\s*analysis/.test(type+' '+section))return'Data / source analysis';
 if(/case\s*study/.test(type+' '+section))return'Case study';
 if(/essay/.test(type)||/\b(?:write|compose|plan)\b[^.]{0,50}\bessay\b/i.test(plain(q.question||q.searchText||'')))return'Essay';
 if(/practical|investigation|experimental/.test(type))return'Practical / investigation';
 if(/labell?ing/.test(type))return'Labelling';
 if(/fill\s*in\s*the\s*blanks|cloze/.test(type))return'Fill in the blanks';
 if(/multi\s*step/.test(type))return'Multi-step';
 const course=plain(q.course||q.subject||([7,8,9,10].includes(Number(q.year))?'science':'')).toLowerCase();
 const stem=plain(q.searchText||q.question||'');
 if(/physics|chemistry|mathematics|maths|accounting|science|physical education/.test(course)&&/\bcalculat(?:e|ing|ion)\b/i.test(stem)&&!/extended|essay/.test(type))return'Calculations';
 if(/short\s*(answer|response)/.test(type)||(/^(written\s*response|response)$/.test(type)&&/short\s*(answer|response)/.test(section)))return'Short answer';
 if(/extended\s*(answer|response)/.test(type))return'Extended response';
 if(/application/.test(type))return'Application';
 if(/^(written\s*response|written|response|structured\s*response)$/.test(type))return'Written response';
 return plain(q.type||q.questionType||'Written response');
}
function unique(pool){const seen=new Set();return pool.filter((q,i)=>{const id=q.id==null?q:q.id;if(seen.has(id))return false;seen.add(id);return true})}
function groups(pool){const out=new Map();for(const q of unique(pool)){const label=classify(q);if(!out.has(label))out.set(label,[]);out.get(label).push(q)}return out}
function select(pool,counts,limit=50,random=Math.random){
 const by=groups(pool),requested=Object.entries(counts);let total=0;
 for(const[label,n]of requested){if(!Number.isSafeInteger(n)||n<0||n>50)throw Error(label+': enter a whole number from 0 to 50.');total+=n;if(n>(by.get(label)?.length||0))throw Error(label+': requested '+n+', but only '+(by.get(label)?.length||0)+' available with these filters.');}
 if(!total)throw Error('Choose at least one question.');
 if(total>limit)throw Error('Choose no more than '+limit+' questions in total.');
 const out=[];for(const[label,n]of requested){const a=[...(by.get(label)||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}out.push(...a.slice(0,n))}return out;
}
function mount({host,getPool,limit=50,totalControl,locked=()=>false,context=()=>'',timed=false,onChange=()=>{}}){
 const root=typeof host==='string'?document.getElementById(host):host;
 root.innerHTML='<fieldset style="border:1px solid #d8e2ea;border-radius:10px;padding:12px;margin:12px 0"><legend>Choose your question mix</legend><label style="display:block;margin-bottom:10px"><input data-mix-mode type="checkbox" style="width:auto"> Choose how many of each question type</label><p data-mix-help style="font-size:12px;line-height:1.5">Automatic selection is on. Tick the box to set exact counts by type. Availability follows the selected subject, year and filters. Imported questions without a specific type appear under Written response.</p><div data-mix-fields hidden></div><p data-mix-status role="status" aria-live="polite" style="font-size:13px;line-height:1.5"></p></fieldset>';
 const mode=root.querySelector('[data-mix-mode]'),fields=root.querySelector('[data-mix-fields]'),status=root.querySelector('[data-mix-status]');let key='',saved=new Map(),lastLabels=[],lastContext;
 function remember(){for(const input of fields.querySelectorAll('input'))saved.set(input.dataset.type,input.value)}
 function refresh(){
  const currentContext=context();if(currentContext!==lastContext){saved.clear();fields.innerHTML='';key='';lastLabels=[];lastContext=currentContext}else remember();const isLocked=locked(),by=groups(getPool()),labels=[...new Set([...by.keys(),...[...saved].filter(([,n])=>Number(n)>0).map(([label])=>label)])].sort((a,b)=>a.localeCompare(b)),next=labels.join('|');
  if(next!==key){key=next;fields.innerHTML=labels.map((label,i)=>'<label style="display:block;margin:9px 0" for="mix-count-'+i+'">'+esc(label)+' <small data-available="'+i+'"></small><input id="mix-count-'+i+'" data-type="'+esc(label)+'" type="number" min="0" max="50" step="1" value="'+esc(saved.get(label)??'0')+'" style="display:block;width:100%;box-sizing:border-box;padding:9px;margin-top:4px;border:1px solid #cfd9e1;border-radius:8px"></label>').join('');lastLabels=labels;fields.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{remember();report();onChange()}));}
  fields.querySelectorAll('input').forEach((input,i)=>{const n=by.get(lastLabels[i])?.length||0;input.max=String(Math.min(50,n));input.disabled=isLocked;fields.querySelector('[data-available="'+i+'"]').textContent='('+n+' available)';});
  mode.disabled=isLocked;fields.hidden=!mode.checked||isLocked;if(totalControl){totalControl.disabled=isLocked||mode.checked;const field=totalControl.closest?.('.field');if(field)field.hidden=mode.checked;}
  report();
 }
 function counts(){const out={};for(const input of fields.querySelectorAll('input'))out[input.dataset.type]=input.value.trim()===''?0:Number(input.value);return out}
 function report(){
  if(locked()){status.textContent='Your teacher chose this practice task. Its question selection cannot be changed.';return}
  if(!mode.checked){status.textContent='Automatic mix · '+unique(getPool()).length+' questions available.';return}
  const values=counts(),total=Object.values(values).reduce((a,b)=>a+b,0);
  try{select(getPool(),values,limit,()=>0.5);status.textContent=total+' questions selected by type.'+(timed?' The selected practice time is a time limit.':'');}
  catch(e){status.textContent=e.message}
 }
 mode.addEventListener('change',()=>{refresh();onChange()});refresh();
 return{refresh,get custom(){return mode.checked&&!locked()},choose(pool=getPool()){return select(pool,counts(),limit)},get counts(){return counts()}};
}
window.QuestionTypeMix={classify,groups,select,mount};
})();