const R=window.SCIENCE_VAULT_RESOURCES||[];
const $=id=>document.getElementById(id), uniq=a=>[...new Set(a)].sort();
function isAssessment(r){
 const s=[r.type,r.title,r.description,r.file].join(" ").toLowerCase();
 return /test|assessment|exam|quiz/.test(s) && !r.answers;
}
const A=R.filter(r=>r.year==="Year 7"&&isAssessment(r));
function fill(){
 const strands=uniq(A.map(r=>r.strand).filter(Boolean));
 $("strand").innerHTML='<option value="All">All strands</option>'+strands.map(x=>'<option>'+x+'</option>').join("");
 updateTopics();
}
function updateTopics(){
 const s=$("strand").value;
 const ts=uniq(A.filter(r=>s==="All"||r.strand===s).map(r=>r.topic).filter(Boolean));
 $("topic").innerHTML='<option value="All">All topics</option>'+ts.map(x=>'<option>'+x+'</option>').join("");
}
let current=[];
function eligible(){
 const s=$("strand").value,t=$("topic").value;
 return A.filter(r=>(s==="All"||r.strand===s)&&(t==="All"||r.topic===t));
}
function draw(){
 $("paperTitle").textContent=$("title").value||"Science Test";
 if(!current.length){
   $("questions").innerHTML='<div class="notice"><strong>No indexed assessment questions yet.</strong><br>Upload tests, quizzes, assessments or exams and they will become the source material for this maker after they are indexed.</div>';
   $("totalMarks").textContent="Assessment-source questions only";
   return;
 }
 $("questions").innerHTML=current.map((r,i)=>'<div class="question"><div class="question-head"><strong>'+(i+1)+'. '+r.title+'</strong></div><div class="source">'+[r.strand,r.topic,r.subtopic].filter(Boolean).join(" › ")+'</div><div class="actions"><a class="download-btn" href="'+encodeURI(r.file)+'" target="_blank">Open source assessment</a></div></div>').join("");
 $("totalMarks").textContent=current.length+" source assessment"+(current.length===1?"":"s");
}
function generate(){
 const pool=eligible(), n=Math.max(1,Math.min(50,+$("count").value||10));
 current=[...pool].sort(()=>Math.random()-.5).slice(0,n);
 draw();
}
$("strand").addEventListener("change",updateTopics);
$("generate").onclick=generate;$("shuffle").onclick=generate;
$("toggleAnswers").style.display="none";
fill();draw();