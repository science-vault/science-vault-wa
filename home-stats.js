(()=>{
const $=id=>document.getElementById(id),fmt=n=>Number(n||0).toLocaleString('en-AU');
async function json(name){try{const r=await fetch(name+'?ts='+Date.now(),{cache:'no-store'});return r.ok?await r.json():[]}catch(e){return[]}}
function show(id,n){const el=$(id);if(el)el.textContent=fmt(n)}
function clean(path){return (path.split('/').pop()||'').replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').replace(/^\d{13}\s*/,'').replace(/\s+/g,' ').trim()}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
async function draw(){
 const [resources,exams,assessments,textbooks]=await Promise.all([json('resource-manifest.json'),json('exam-manifest.json'),json('assessment-manifest.json'),json('textbook-manifest.json')]);
 const isAssessment=r=>/^resources\/Assessments\//i.test(r.path||''),isTextbook=r=>/(^|\/)Textbooks?\//i.test(r.path||'');
 const ordinary=resources.filter(r=>!isAssessment(r)&&!isTextbook(r));
 const textbookPaths=new Set([...resources.filter(isTextbook).map(r=>r.path),...textbooks.map(r=>r.path)]);
 const classify=r=>{const p=(r.path||'').toLowerCase(),n=p.split('/').pop()||'';if(/\.pptx?$/.test(n)||p.includes('powerpoint')||p.includes('/ppts/'))return'PowerPoints';if(/worksheet|activity sheet|guided notes/.test(p))return'Worksheets';if(/practical|experiment|investigation|dissection|fieldwork/.test(p))return'Practicals';if(/revision|review/.test(p))return'Revision';if(/test|assessment|quiz|exam|task/.test(p))return'Tests';if(/note|summary/.test(p))return'Notes';return'Other Resources'};
 const counts={};ordinary.forEach(r=>{const t=classify(r);counts[t]=(counts[t]||0)+1});
 show('statPowerPoints',counts.PowerPoints);show('statWorksheets',counts.Worksheets);show('statNotes',counts.Notes);show('statPracticals',counts.Practicals);show('statRevision',counts.Revision);show('statTests',counts.Tests);show('statOther',counts['Other Resources']);show('statAssessments',assessments.length);show('statExams',exams.length);show('statTextbooks',textbookPaths.size);show('statTotal',ordinary.length+assessments.length+exams.length+textbookPaths.size);
 const stamp=$('statsUpdated');if(stamp)stamp.textContent='Running totals from the current website library';
 const all=[...ordinary.map(x=>({...x,type:classify(x),href:'library.html'})),...assessments.map(x=>({...x,type:'Assessment',href:'assessments.html'})),...exams.map(x=>({...x,type:'Exam',href:'exams.html'})),...textbooks.filter(x=>/\.pdf$/i.test(x.path||'')).map(x=>({...x,type:'Textbook',href:'textbooks.html'}))];
 all.sort((a,b)=>String(b.modified||'').localeCompare(String(a.modified||'')));
 const recent=all.slice(0,8),stats=document.querySelector('.resource-stats-section');
 if(stats&&recent.length){const sec=document.createElement('section');sec.className='home-section';sec.innerHTML='<div class="home-section-head"><div><span class="eyebrow">RECENTLY ADDED</span><h2>New in the vault</h2></div><p>The latest resources added to Learning Vault WA.</p></div><div class="feature-grid">'+recent.map(r=>'<a class="feature-card" href="'+r.href+'" style="text-decoration:none;color:inherit"><strong>'+esc(clean(r.path))+'</strong><p>'+esc(r.type)+' · '+esc((r.path||'').split('/').slice(1,-1).slice(-2).join(' · '))+'</p></a>').join('')+'</div>';stats.after(sec)}
 const footer=document.querySelector('footer');if(footer){const links=footer.querySelector('.footer-links');if(links&&!links.querySelector('[href="about.html"]'))links.insertAdjacentHTML('beforeend','<a href="about.html">About</a><a href="contact.html">Contact</a><a href="copyright.html">Copyright</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a>')}
}
draw();
})();
