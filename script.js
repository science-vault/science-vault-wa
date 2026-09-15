
const R=window.SCIENCE_VAULT_RESOURCES||[], $=id=>document.getElementById(id);
function esc(s){return String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function uniq(k,arr=R){return [...new Set(arr.map(r=>r[k]).filter(Boolean))].sort()}
function setOpts(id,k,label,arr=R){let e=$(id);if(!e)return;let v=e.value;e.innerHTML=`<option value="">${label}</option>`+uniq(k,arr).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");if([...e.options].some(o=>o.value===v))e.value=v}
function refreshDependent(){
 let a=R;
 ["year","course","unit","topic","subtopic","school","type","format"].forEach(k=>{setOpts("f_"+k,k,"All "+(k==="unit"?"strands/units":k+"s"),a);let v=$("f_"+k)?.value;if(v)a=a.filter(r=>r[k]===v)})
}
function render(){
 if(!$("resourceGrid"))return;
 let q=$("q").value.toLowerCase();
 let rows=R.filter(r=>(!q||Object.values(r).join(" ").toLowerCase().includes(q))&&["year","course","unit","topic","subtopic","school","type","format"].every(k=>!$("f_"+k).value||r[k]===$("f_"+k).value));
 $("count").textContent=`${rows.length} resource${rows.length===1?"":"s"}`;
 $("resourceGrid").innerHTML=rows.map(r=>{let file=encodeURI(r.file),prev=r.preview?`<a class="btn alt" target="_blank" href="${encodeURI(r.preview)}">Preview</a>`:"";return `<article class="resource-card"><div><span class="pill">${esc(r.type)}</span><span class="pill">${esc(r.format)}</span></div><h3>${esc(r.title)}</h3><div class="crumb">${esc(r.year)} · ${esc(r.course)}<br><strong>${esc(r.unit)}</strong><br>${esc(r.topic)} → ${esc(r.subtopic)}</div><div class="actions">${prev}<a class="btn" href="${file}" download>Download</a></div></article>`}).join("");
}
document.addEventListener("DOMContentLoaded",()=>{if($("resourceGrid")){refreshDependent();render();$("q").oninput=render;["year","course","unit","topic","subtopic","school","type","format"].forEach(k=>$("f_"+k).onchange=()=>{refreshDependent();render()});$("reset").onclick=()=>{$("q").value="";document.querySelectorAll(".filters select").forEach(x=>x.value="");refreshDependent();render()}}});
