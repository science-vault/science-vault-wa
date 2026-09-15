
const ALL_RESOURCES = window.SCIENCE_VAULT_RESOURCES || [];
let activeType = "All";

function norm(v){ return String(v||"").toLowerCase(); }
function searchable(r){ return [r.title,r.year,r.course,r.strand,r.unit,r.topic,r.subtopic,r.type,r.format,r.description].map(norm).join(" "); }
function courseForPage(){
  return document.body.dataset.course || "";
}
function filteredResources(){
  const q = norm(document.getElementById("searchInput")?.value);
  const pageCourse = courseForPage();
  return ALL_RESOURCES.filter(r=>{
    const courseOK = !pageCourse || r.course===pageCourse;
    const typeOK = activeType==="All" || r.type===activeType;
    const qOK = !q || searchable(r).includes(q);
    return courseOK && typeOK && qOK;
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
        ${r.preview?`<button class="preview-btn" data-preview="${r.preview}" data-title="${r.title}">Preview</button>`:""}
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
  document.querySelectorAll("[data-subtopic]").forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll("[data-subtopic]").forEach(x=>x.classList.remove("selected"));
    b.classList.add("selected");
    const q=document.getElementById("searchInput");
    if(q){q.value=b.dataset.subtopic;render();}
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
  modal.querySelector("#previewTitle").textContent=name||"Preview";
  modal.querySelector("#previewDownload").href=url;
  const body=modal.querySelector("#previewBody");
  const ext=(url.split("?")[0].split(".").pop()||"").toLowerCase();
  if(ext==="pdf"||ext==="txt"||ext==="md") body.innerHTML=`<iframe src="${url}" title="Resource preview"></iframe>`;
  else if(["png","jpg","jpeg","gif","webp","svg"].includes(ext)) body.innerHTML=`<div class="image-preview"><img src="${url}" alt=""></div>`;
  else body.innerHTML=`<div class="preview-message"><h3>Preview not available for this file type</h3><p>Download the original resource to open it on your device.</p></div>`;
  modal.classList.remove("hidden"); document.body.style.overflow="hidden";
}
function closePreview(){ if(modal){modal.classList.add("hidden");modal.querySelector("#previewBody").innerHTML="";document.body.style.overflow="";}}
function bindPreviewButtons(){ document.querySelectorAll("[data-preview]").forEach(b=>b.onclick=()=>openPreview(b.dataset.preview,b.dataset.title)); }
document.addEventListener("DOMContentLoaded",()=>{setupFilters();setupSubtopics();setupExamSearch();render();});
