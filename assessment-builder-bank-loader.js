// Lazy bank loader for the modular Assessment Builder.
(function(){
  const loaded = new Set();
  const pending = new Map();
  function script(src){
    if(loaded.has(src)) return Promise.resolve(src);
    if(pending.has(src)) return pending.get(src);
    const p = new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src+(src.includes('?')?'&':'?')+'v=2026.19';
      s.async=false;
      s.onload=()=>{loaded.add(src);pending.delete(src);resolve(src)};
      s.onerror=()=>{pending.delete(src);reject(new Error('Could not load question bank file: '+src))};
      document.head.appendChild(s);
    });
    pending.set(src,p);return p;
  }
  async function scriptsSequentially(files){for(const file of files) await script(file)}
  function subject(id){return (window.AssessmentBuilderSubjects||[]).find(x=>x.id===id)}
  const legacyScienceFiles=['assessment-question-bank-core.js','assessment-question-bank-year7-extra.js','assessment-question-bank-year7-2026-correction.js','assessment-question-bank-year8-extra.js','assessment-question-bank-year8-2026-correction.js','assessment-question-bank-year9-extra.js','assessment-question-bank-year9-2026-fix.js','assessment-question-bank-year9-2026-correction.js','assessment-question-bank-year10-extra.js','assessment-question-bank-year10-2026-fix.js','assessment-image-upgrade.js','assessment-question-bank-science-expansion-1.js','assessment-question-bank-science-repository-expansion-1.js','assessment-question-bank-science-expansion-2.js','assessment-question-bank-science-expansion-3.js','assessment-question-bank-science-expansion-4.js'];
  async function load(subjectId,year){
    const s=subject(subjectId); if(!s) throw new Error('Unknown subject: '+subjectId);
    const y=s.years&&s.years[String(year)]; if(!y) throw new Error('No question bank is available yet for '+s.label+' Year '+year+'.');
    if(y.legacy){await scriptsSequentially(legacyScienceFiles);return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&(q.subject==='science'||!q.subject));}
    if(subjectId==='mathematics'){await scriptsSequentially(['assessment-question-bank-mathematics.js','assessment-question-bank-mathematics-expansion-1.js','assessment-question-bank-mathematics-expansion-2.js','assessment-question-bank-mathematics-expansion-3.js']);return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject==='mathematics'&&q.type!=='Multiple choice');}
    const cfg=window.AssessmentBuilderConfig||{},src=y.src||`${cfg.bankRoot}/${subjectId}/year${year}.js`;await script(src);return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject===subjectId);
  }
  window.AssessmentBankLoader={load,loaded};
})();
// Science strand UI. The assessment page keeps activeBank as a lexical `let`, not window.activeBank,
// so this layer deliberately never reads or replaces window.activeBank.
window.addEventListener('DOMContentLoaded',()=>{
 const subject=document.getElementById('subject'),topic=document.getElementById('topic');if(!subject||!topic)return;
 const topicField=topic.closest('.field'),strandField=document.createElement('div');strandField.className='field';strandField.id='scienceStrandField';strandField.innerHTML='<label>Science strand</label><select id="strand"><option value="all">All strands</option></select>';topicField.parentNode.insertBefore(strandField,topicField);const strand=document.getElementById('strand');
 const science=()=>subject.value==='science';
 const strandForTopic=t=>{
   const map={
    'Classification and diversity':'Biological Sciences','Food chains and food webs':'Biological Sciences','Ecosystems and interactions':'Biological Sciences','Cells and microscopes':'Biological Sciences','Plant and animal cells':'Biological Sciences','Body systems':'Biological Sciences','Body systems and coordination':'Biological Sciences','Nervous and endocrine systems':'Biological Sciences','Disease and homeostasis':'Biological Sciences','DNA and genes':'Biological Sciences','Inheritance':'Biological Sciences','Natural selection and evolution':'Biological Sciences',
    'Mixtures and separation':'Chemical Sciences','Solutions and solubility':'Chemical Sciences','Properties of substances':'Chemical Sciences','Elements, compounds and mixtures':'Chemical Sciences','Particle model of matter':'Chemical Sciences','Physical and chemical change':'Chemical Sciences','Atomic structure':'Chemical Sciences','Chemical reactions':'Chemical Sciences','Acids and bases':'Chemical Sciences','Rates of reaction':'Chemical Sciences','Precipitation reactions':'Chemical Sciences',
    'Earth-Sun-Moon system':'Earth and Space Sciences','Seasons and eclipses':'Earth and Space Sciences','Renewable and non-renewable resources':'Earth and Space Sciences','Rocks and minerals':'Earth and Space Sciences','Rock cycle':'Earth and Space Sciences','Weathering and erosion':'Earth and Space Sciences','Plate tectonics':'Earth and Space Sciences','Earthquakes and volcanoes':'Earth and Space Sciences','Carbon cycle':'Earth and Space Sciences','The universe and galaxies':'Earth and Space Sciences','Life cycle of stars':'Earth and Space Sciences','Big Bang theory':'Earth and Space Sciences',
    'Forces and motion':'Physical Sciences','Balanced and unbalanced forces':'Physical Sciences','Simple machines':'Physical Sciences','Forms of energy':'Physical Sciences','Energy transfer and transformation':'Physical Sciences','Heat, light and sound':'Physical Sciences','Electric circuits':'Physical Sciences','Voltage, current and resistance':'Physical Sciences','Electrical energy':'Physical Sciences','Motion and acceleration':'Physical Sciences','Newton’s laws':'Physical Sciences','Force and momentum':'Physical Sciences'};return map[t]||null;
 };
 function refreshStrands(){strandField.style.display=science()?'':'none';if(!science())return;strand.innerHTML='<option value="all">All strands</option><option>Biological Sciences</option><option>Chemical Sciences</option><option>Earth and Space Sciences</option><option>Physical Sciences</option>';filterTopicOptions()}
 function filterTopicOptions(){if(!science())return;const sv=strand.value;[...topic.options].forEach(o=>{if(o.value==='all')return;o.hidden=sv!=='all'&&strandForTopic(o.value)!==sv});if(topic.selectedOptions[0]?.hidden)topic.value='all';if(typeof window.renderBank==='function')window.renderBank()}
 // Filter rendered question-bank cards by strand without touching the page's lexical activeBank.
 const originalRender=window.renderBank;
 if(typeof originalRender==='function')window.renderBank=function(){originalRender();if(!science()||strand.value==='all')return;document.querySelectorAll('#bankList .bankitem').forEach(card=>{const title=card.querySelector('p b')?.textContent||'';if(strandForTopic(title)!==strand.value)card.style.display='none'});const visible=[...document.querySelectorAll('#bankList .bankitem')].filter(x=>x.style.display!=='none').length;const count=document.getElementById('bankCount');if(count)count.textContent=visible+' available'};
 strand.addEventListener('change',filterTopicOptions);subject.addEventListener('change',()=>setTimeout(refreshStrands,0));document.getElementById('year')?.addEventListener('change',()=>setTimeout(refreshStrands,350));setTimeout(refreshStrands,350);
});