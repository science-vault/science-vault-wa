const R=window.SCIENCE_VAULT_RESOURCES||[];
const $=id=>document.getElementById(id);
function unique(k){return [...new Set(R.map(r=>r[k]).filter(Boolean))].sort()}
function fill(id,k,label){$(id).innerHTML=`<option value="">${label}</option>`+unique(k).map(x=>`<option>${x}</option>`).join("")}
["year","course","unit","topic","subtopic","school","type","format"].forEach(k=>fill("f_"+k,k,"All "+k.replace("_"," ")));
function render(){let q=$("q").value.toLowerCase();let rows=R.filter(r=>(!q||Object.values(r).join(" ").toLowerCase().includes(q))&&["year","course","unit","topic","subtopic","school","type","format"].every(k=>!$("f_"+k).value||r[k]===$("f_"+k).value));
$("count").textContent=`${rows.length} resource${rows.length===1?"":"s"}`;
$("grid").innerHTML=rows.map(r=>{let path=encodeURI(r.file);let preview=(r.format==="PDF")?`<a class="btn secondary" target="_blank" href="${path}">Preview</a>`:"";return `<article class="card"><div class="meta">${r.year} · ${r.course}</div><span class="badge">${r.type}</span><span class="badge">${r.format}</span><h3>${r.title}</h3><p><strong>${r.unit}</strong><br>${r.topic} → ${r.subtopic}</p><div class="actions">${preview}<a class="btn" href="${path}" download>Download</a></div></article>`}).join("")}
$("q").oninput=render;document.querySelectorAll("select").forEach(x=>x.onchange=render);$("reset").onclick=()=>{$("q").value="";document.querySelectorAll("select").forEach(x=>x.value="");render()};render();