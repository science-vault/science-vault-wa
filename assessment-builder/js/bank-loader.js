// Lazy bank loader for the modular Assessment Builder.
(function(){
  const loaded = new Set();
  const pending = new Map();

  function script(src){
    if(loaded.has(src)) return Promise.resolve(src);
    if(pending.has(src)) return pending.get(src);
    const p = new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src;
      s.async=true;
      s.onload=()=>{loaded.add(src);pending.delete(src);resolve(src)};
      s.onerror=()=>{pending.delete(src);reject(new Error('Could not load question bank: '+src))};
      document.head.appendChild(s);
    });
    pending.set(src,p); return p;
  }

  function subject(id){return (window.AssessmentBuilderSubjects||[]).find(x=>x.id===id)}

  async function load(subjectId,year){
    const cfg=window.AssessmentBuilderConfig||{};
    const s=subject(subjectId);
    if(!s) throw new Error('Unknown subject: '+subjectId);
    const y=s.years&&s.years[String(year)];
    if(!y) throw new Error('No question bank is available yet for '+s.label+' Year '+year+'.');
    if(y.legacy){
      await script(cfg.legacyScienceLoader||'assessment-question-bank.js');
      return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year));
    }
    const src=y.src||`${cfg.bankRoot}/${subjectId}/year${year}.js`;
    await script(src);
    return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&(q.subject===subjectId||!q.subject));
  }

  window.AssessmentBankLoader={load,loaded};
})();