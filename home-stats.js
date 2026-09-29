(()=>{
const $=id=>document.getElementById(id),fmt=n=>Number(n||0).toLocaleString('en-AU');
async function json(name){try{const r=await fetch(name+'?ts='+Date.now(),{cache:'no-store'});return r.ok?await r.json():[]}catch(e){return[]}}
function show(id,n){const el=$(id);if(el)el.textContent=fmt(n)}
async function draw(){
 const resources=await json('resource-manifest.json');
 const exams=await json('exam-manifest.json');
 const assessments=await json('assessment-manifest.json');
 const separateTextbooks=await json('textbook-manifest.json');
 const isAssessment=r=>/^resources\/Assessments\//i.test(r.path||'');
 const isTextbook=r=>/(^|\/)Textbooks?\//i.test(r.path||'');
 const ordinary=resources.filter(r=>!isAssessment(r)&&!isTextbook(r));
 const textbookPaths=new Set([...resources.filter(isTextbook).map(r=>r.path),...separateTextbooks.map(r=>r.path)]);
 const classify=r=>{const p=(r.path||'').toLowerCase(),n=(p.split('/').pop()||'');if(/\.pptx?$/.test(n)||p.includes('powerpoint')||p.includes('/ppts/'))return'PowerPoints';if(/worksheet|activity sheet|guided notes/.test(p))return'Worksheets';if(/practical|experiment|investigation|dissection|fieldwork/.test(p))return'Practicals';if(/revision|review/.test(p))return'Revision';if(/test|assessment|quiz|exam|task/.test(p))return'Tests';if(/note|summary/.test(p))return'Notes';return'Other Resources'};
 const counts={};ordinary.forEach(r=>{const t=classify(r);counts[t]=(counts[t]||0)+1});
 show('statPowerPoints',counts.PowerPoints);show('statWorksheets',counts.Worksheets);show('statNotes',counts.Notes);show('statPracticals',counts.Practicals);show('statRevision',counts.Revision);show('statTests',counts.Tests);show('statOther',counts['Other Resources']);show('statAssessments',assessments.length);show('statExams',exams.length);show('statTextbooks',textbookPaths.size);
 const total=ordinary.length+assessments.length+exams.length+textbookPaths.size;show('statTotal',total);
 const stamp=$('statsUpdated');if(stamp)stamp.textContent='Running totals from the current website library';
}
draw();
})();
