// Lazy bank loader for the modular Assessment Builder.
(function(){
  const loaded = new Set();
  const pending = new Map();
  function script(src){
    if(loaded.has(src)) return Promise.resolve(src);
    if(pending.has(src)) return pending.get(src);
    const p = new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src+(src.includes('?')?'&':'?')+'v=2026.26';
      s.async=false;
      s.onload=()=>{loaded.add(src);pending.delete(src);resolve(src)};
      s.onerror=()=>{pending.delete(src);reject(new Error('Could not load question bank file: '+src))};
      document.head.appendChild(s);
    });
    pending.set(src,p);return p;
  }
  async function scriptsSequentially(files){for(const file of files) await script(file)}
  function subject(id){return (window.AssessmentBuilderSubjects||[]).find(x=>x.id===id)}
  const legacyScienceFiles=['assessment-question-bank-core.js','assessment-question-bank-year7-extra.js','assessment-question-bank-year7-2026-correction.js','assessment-question-bank-year8-extra.js','assessment-question-bank-year8-2026-correction.js','assessment-question-bank-year9-extra.js','assessment-question-bank-year9-2026-fix.js','assessment-question-bank-year9-2026-correction.js','assessment-question-bank-year10-extra.js','assessment-question-bank-year10-2026-fix.js','assessment-image-upgrade.js','assessment-question-bank-science-expansion-1.js','assessment-question-bank-science-repository-expansion-1.js','assessment-question-bank-science-expansion-2.js','assessment-question-bank-science-expansion-3.js','assessment-question-bank-science-expansion-4.js','assessment-question-bank-science-expansion-5.js','assessment-question-bank-science-expansion-6.js','assessment-question-bank-science-expansion-7.js','assessment-question-bank-science-expansion-8.js','assessment-science-strand-normalizer.js'];
  const mathsFiles=['assessment-question-bank-mathematics.js','assessment-question-bank-mathematics-expansion-1.js','assessment-question-bank-mathematics-expansion-2.js','assessment-question-bank-mathematics-expansion-3.js'];
  async function applyKeyFormat(bank){await script('assessment-marking-key-normalizer.js');return window.AssessmentMarkingKeyNormalizer?window.AssessmentMarkingKeyNormalizer.normalise(bank):bank}
  async function load(subjectId,year){
    const s=subject(subjectId); if(!s) throw new Error('Unknown subject: '+subjectId);
    const y=s.years&&s.years[String(year)]; if(!y) throw new Error('No question bank is available yet for '+s.label+' Year '+year+'.');
    if(y.legacy){await scriptsSequentially(legacyScienceFiles);const bank=(window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&(q.subject==='science'||!q.subject));return applyKeyFormat(bank);}
    if(subjectId==='mathematics'){await scriptsSequentially(mathsFiles);const bank=(window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject==='mathematics'&&q.type!=='Multiple choice');return applyKeyFormat(bank);}
    const cfg=window.AssessmentBuilderConfig||{},src=y.src||`${cfg.bankRoot}/${subjectId}/year${year}.js`;await script(src);const bank=(window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject===subjectId);return applyKeyFormat(bank);
  }
  window.AssessmentBankLoader={load,loaded};
})();
window.addEventListener('DOMContentLoaded',()=>{
 const subject=document.getElementById('subject'),topic=document.getElementById('topic');if(!subject||!topic)return;
 const topicField=topic.closest('.field'),strandField=document.createElement('div');strandField.className='field';strandField.id='scienceStrandField';strandField.innerHTML='<label>Science strand</label><select id="strand"><option value="all">All strands</option></select>';topicField.parentNode.insertBefore(strandField,topicField);const strand=document.getElementById('strand');
 const science=()=>subject.value==='science';
 const strandForTopic=t=>{const q=(window.AssessmentQuestionBank||[]).find(x=>x.topic===t&&x.strand);if(q)return q.strand;return null};
 function refreshStrands(){strandField.style.display=science()?'':'none';if(!science())return;strand.innerHTML='<option value="all">All strands</option><option>Biological Sciences</option><option>Chemical Sciences</option><option>Earth and Space Sciences</option><option>Physical Sciences</option>';filterTopicOptions()}
 function filterTopicOptions(){if(!science())return;const sv=strand.value;[...topic.options].forEach(o=>{if(o.value==='all')return;o.hidden=sv!=='all'&&strandForTopic(o.value)!==sv});if(topic.selectedOptions[0]?.hidden)topic.value='all';if(typeof window.renderBank==='function')window.renderBank()}
 const originalRender=window.renderBank;if(typeof originalRender==='function')window.renderBank=function(){originalRender();if(!science()||strand.value==='all')return;document.querySelectorAll('#bankList .bankitem').forEach(card=>{const title=card.querySelector('p b')?.textContent||'';if(strandForTopic(title)!==strand.value)card.style.display='none'});const visible=[...document.querySelectorAll('#bankList .bankitem')].filter(x=>x.style.display!=='none').length,count=document.getElementById('bankCount');if(count)count.textContent=visible+' available'};
 strand.addEventListener('change',filterTopicOptions);subject.addEventListener('change',()=>setTimeout(refreshStrands,0));document.getElementById('year')?.addEventListener('change',()=>setTimeout(refreshStrands,350));setTimeout(refreshStrands,350);
});