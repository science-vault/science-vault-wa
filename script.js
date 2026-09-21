
const ALL_RESOURCES = window.SCIENCE_VAULT_RESOURCES || [];
let activeType = "All";
let activeTopic = "";
let activeSubtopic = "";

function norm(v){ return String(v||"").toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g," ").trim(); }
function searchable(r){ return [r.title,r.year,r.course,r.strand,r.unit,r.topic,r.subtopic,r.type,r.format,r.description,...(r.keywords||[])].map(norm).join(" "); }
function termsForQuery(q){
  const map={
    "diversity of life":["diversity of life","classification","kingdoms","animal classification","adaptations"],
    "classification hierarchy: kingdom to species":["classification hierarchy","kingdom to species","kingdoms","scientific naming","animal classification"],
    "characteristics used for classification":["characteristics used for classification","characteristics and classification of living things","classification"],
    "dichotomous keys":["dichotomous keys","classification keys","branched keys","tabular keys"],
    "developing classification keys":["developing classification keys","classification keys","branched keys","tabular keys"],
    "producers, consumers and decomposers":["producers consumers and decomposers","producer","consumer","decomposer","food chains","food webs"],
    "energy flow in ecosystems":["energy flow in ecosystems","food chains","food webs","feeding relationships"],
    "impacts of human activity on feeding relationships":["impacts of human activity on feeding relationships","human impacts","human activity","ecosystem impacts"]
  };
  const nq=norm(q); return map[nq]||nq.split(/\s+/).filter(Boolean);
}
function courseForPage(){
  return document.body.dataset.course || "";
}
function yearForPage(){
  return document.body.dataset.year || "";
}
function filteredResources(){
  const q = norm(document.getElementById("searchInput")?.value);
  const pageCourse = courseForPage();
  return ALL_RESOURCES.filter(r=>{
    const pageYear = yearForPage();
    const courseOK = !pageCourse || r.course===pageCourse;
    const yearOK = !pageYear || r.year===pageYear;
    const typeAliases={worksheet:["worksheet","worksheets"],powerpoint:["powerpoint","powerpoints"],practical:["practical","practicals"],test:["test","tests"],exam:["exam","exams"],note:["note","notes"],revision:["revision"],"other resources":["other resources"]}; const wanted=typeAliases[norm(activeType)]||typeAliases[norm(activeType).replace(/s$/,"")]||[norm(activeType)]; const typeOK=activeType==="All"||wanted.includes(norm(r.type));
    const topicOK = !activeTopic || norm(r.topic)===norm(activeTopic);
    const subtopicOK = !activeSubtopic || termsForQuery(activeSubtopic).some(term=>searchable(r).includes(term));
    const qTerms=termsForQuery(q); const qOK = !q || qTerms.every(term=>searchable(r).includes(term));
    return courseOK && yearOK && typeOK && topicOK && subtopicOK && qOK;
  });
}
function badge(text){ return text ? `<span class="meta-badge">${text}</span>` : ""; }
function render(){
  const grid=document.getElementById("resourceGrid");
  if(!grid)return;
  const data=filteredResources();
  const empty=document.getElementById("emptyState");
  const count=document.getElementById("resultCount");
  if(count) count.textContent=`${data.length} resource${data.length===1?"":"s"}`;
  if(empty) empty.classList.toggle("hidden",data.length>0);
  grid.innerHTML=data.map(r=>`
    <article class="resource-card">
      <div class="resource-top">
        <div>${badge(r.type)} ${badge(r.format)} ${r.answers?badge("Answers / Key"):""}</div>
        <span class="resource-year">${r.year||""}</span>
      </div>
      <h3>${r.title}</h3>
      <p>${r.description||""}</p>
      <div class="resource-path">${[r.course,r.unit,r.topic,r.subtopic].filter(Boolean).join(" › ")}</div>
      <div class="resource-actions">
        ${r.file?`<button class="preview-btn" data-preview="${r.file}" data-title="${r.title}">Preview</button>`:""}
        ${r.file?`<a class="download-btn" href="${r.file}" download>Download</a>`:""}
      </div>
    </article>`).join("");
  bindPreviewButtons();
}
function setupFilters(){
  document.querySelectorAll(".filters [data-filter]").forEach(b=>{
    b.addEventListener("click",()=>{
      activeType=b.dataset.filter;
      document.querySelectorAll(".filters [data-filter]").forEach(x=>x.classList.toggle("active",x===b));
      render();
    });
  });
  document.getElementById("searchInput")?.addEventListener("input",render);
}
function setupSubtopics(){
  document.querySelectorAll("[data-topic]").forEach(b=>b.addEventListener("click",()=>{
    activeTopic=b.dataset.topic||"";
    activeSubtopic="";
    document.querySelectorAll("[data-topic],[data-subtopic]").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    const q=document.getElementById("searchInput"); if(q)q.value="";
    render();
    document.getElementById("resources")?.scrollIntoView({behavior:"smooth"});
  }));
  document.querySelectorAll("[data-subtopic]").forEach(b=>b.addEventListener("click",()=>{
    activeTopic="";
    activeSubtopic=b.dataset.subtopic||"";
    document.querySelectorAll("[data-topic],[data-subtopic]").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    const q=document.getElementById("searchInput"); if(q)q.value="";
    render();
    document.getElementById("resources")?.scrollIntoView({behavior:"smooth"});
  }));
}
function setupExamSearch(){
  document.querySelectorAll("[data-examsearch]").forEach(b=>b.addEventListener("click",()=>{
    const q=document.getElementById("searchInput");
    if(q){q.value=b.dataset.examsearch;render();}
    document.getElementById("resources")?.scrollIntoView({behavior:"smooth"});
  }));
}
let modal;
function ensureModal(){
  if(modal)return;
  modal=document.createElement("div"); modal.className="preview-modal hidden";
  modal.innerHTML=`<div class="preview-shell"><div class="preview-head"><div><small>RESOURCE PREVIEW</small><h3 id="previewTitle">Preview</h3></div><div class="preview-actions"><a id="previewDownload" class="download-btn" href="#" download>Download</a><button id="previewClose" class="preview-close">×</button></div></div><div id="previewBody" class="preview-body"></div></div>`;
  document.body.appendChild(modal);
  modal.querySelector("#previewClose").onclick=closePreview;
  modal.onclick=e=>{if(e.target===modal)closePreview()};
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closePreview()});
}
function openPreview(url,name){
  ensureModal();
  const safeUrl=encodeURI(url);
  modal.querySelector("#previewTitle").textContent=name||"Preview";
  modal.querySelector("#previewDownload").href=safeUrl;
  const body=modal.querySelector("#previewBody");
  const ext=(url.split("?")[0].split(".").pop()||"").toLowerCase();
  if(ext==="pdf"||ext==="txt"||ext==="md") body.innerHTML=`<iframe src="${safeUrl}" title="Resource preview"></iframe>`;
  else if(["png","jpg","jpeg","gif","webp","svg"].includes(ext)) body.innerHTML=`<div class="image-preview"><img src="${safeUrl}" alt=""></div>`;
  else if(["doc","docx","ppt","pptx","xls","xlsx"].includes(ext)){
    const absolute=new URL(safeUrl,window.location.href).href;
    const office="https://view.officeapps.live.com/op/embed.aspx?src="+encodeURIComponent(absolute);
    body.innerHTML=`<iframe src="${office}" title="Office document preview" style="width:100%;height:75vh;border:0"></iframe>`;
  } else if(["mp4","webm"].includes(ext)) body.innerHTML=`<video controls style="max-width:100%;max-height:75vh"><source src="${safeUrl}"></video>`;
  else body.innerHTML=`<div class="preview-message"><h3>Preview not available for this file type</h3><p>You can still download the original resource.</p></div>`;
  modal.classList.remove("hidden"); document.body.style.overflow="hidden";
}
function closePreview(){ if(modal){modal.classList.add("hidden");modal.querySelector("#previewBody").innerHTML="";document.body.style.overflow="";}}
function bindPreviewButtons(){ document.querySelectorAll("[data-preview]").forEach(b=>b.onclick=()=>openPreview(b.dataset.preview,b.dataset.title)); }
document.addEventListener("DOMContentLoaded",()=>{setupFilters();setupSubtopics();setupExamSearch();render();});

(function(){
 const R=window.SCIENCE_VAULT_RESOURCES||[], $=id=>document.getElementById(id);
 if(!$("libraryGrid")) return;
 const keys=["year","course","unit","topic","subtopic","school","type","format"];
 const esc=x=>String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
 function fill(k){
   const el=$(k+"Filter"); if(!el)return;
   const old=el.value||"All";
   const vals=[...new Set(R.map(r=>r[k]).filter(Boolean))].sort();
   el.innerHTML=`<option value="All">All ${k==="unit"?"units":k+"s"}</option>`+vals.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("");
   if([...el.options].some(o=>o.value===old))el.value=old;
 }
 keys.forEach(fill);
 function draw(){
   const q=$("librarySearch").value.toLowerCase();
   const rows=R.filter(r=>(!q||Object.values(r).join(" ").toLowerCase().includes(q))&&keys.every(k=>$(k+"Filter").value==="All"||r[k]===$(k+"Filter").value));
   $("libraryCount").textContent=`${rows.length} resource${rows.length===1?"":"s"}`;
   $("libraryEmpty").classList.toggle("hidden",rows.length>0);
   $("libraryGrid").innerHTML=rows.map(r=>{
     const file=encodeURI(r.file), preview=r.file?`<button class="preview-btn" data-preview="${file}" data-download="${file}" data-title="${esc(r.title)}">Preview</button>`:"";
     return `<article class="resource-card"><div class="resource-top"><span class="resource-type">${esc(r.type)}</span><span class="resource-format">${esc(r.format)}</span>${r.answers?'<span class="answer-badge">Answers</span>':''}</div><h3>${esc(r.title)}</h3><p>${esc(r.description||"")}</p><small>${esc(r.year)} · ${esc(r.course)} · ${esc(r.unit)} · ${esc(r.topic)} · ${esc(r.subtopic)}</small><div class="resource-actions">${preview}<a class="download-btn" href="${file}" download>Download</a></div></article>`;
   }).join("");
 }
 $("librarySearch").addEventListener("input",draw);
 keys.forEach(k=>$(k+"Filter").addEventListener("change",draw));
 draw();
})();
