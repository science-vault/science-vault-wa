// Lazy bank loader for the modular Assessment Builder.
(function(){
  const loaded = new Set();
  const pending = new Map();
  function script(src){
    if(loaded.has(src)) return Promise.resolve(src);
    if(pending.has(src)) return pending.get(src);
    const p = new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src+(src.includes('?')?'&':'?')+'v=2026.9';
      s.async=false;
      s.onload=()=>{loaded.add(src);pending.delete(src);resolve(src)};
      s.onerror=()=>{pending.delete(src);reject(new Error('Could not load question bank file: '+src))};
      document.head.appendChild(s);
    });
    pending.set(src,p);return p;
  }
  async function scriptsSequentially(files){for(const file of files) await script(file)}
  function subject(id){return (window.AssessmentBuilderSubjects||[]).find(x=>x.id===id)}
  const legacyScienceFiles=['assessment-question-bank-core.js','assessment-question-bank-year7-extra.js','assessment-question-bank-year7-2026-correction.js','assessment-question-bank-year8-extra.js','assessment-question-bank-year8-2026-correction.js','assessment-question-bank-year9-extra.js','assessment-question-bank-year9-2026-fix.js','assessment-question-bank-year9-2026-correction.js','assessment-question-bank-year10-extra.js','assessment-question-bank-year10-2026-fix.js','assessment-image-upgrade.js'];
  async function load(subjectId,year){
    const s=subject(subjectId);
    if(!s) throw new Error('Unknown subject: '+subjectId);
    const y=s.years&&s.years[String(year)];
    if(!y) throw new Error('No question bank is available yet for '+s.label+' Year '+year+'.');
    if(y.legacy){
      await scriptsSequentially(legacyScienceFiles);
      return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&(q.subject==='science'||!q.subject));
    }
    // Mathematics uses a root-level combined bank. GitHub Pages was returning a
    // load error for the nested mathematics/year*.js paths on the live site.
    if(subjectId==='mathematics'){
      await script('assessment-question-bank-mathematics.js');
      return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject==='mathematics');
    }
    const cfg=window.AssessmentBuilderConfig||{};
    const src=y.src||`${cfg.bankRoot}/${subjectId}/year${year}.js`;
    await script(src);
    return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject===subjectId);
  }
  window.AssessmentBankLoader={load,loaded};
})();