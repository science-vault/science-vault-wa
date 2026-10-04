// Lazy bank loader for the modular Assessment Builder.
// IMPORTANT: legacy assessment-question-bank.js uses document.write(), which is unsafe
// after the page has loaded. Load its component files sequentially instead.
(function(){
  const loaded = new Set();
  const pending = new Map();

  function script(src){
    if(loaded.has(src)) return Promise.resolve(src);
    if(pending.has(src)) return pending.get(src);
    const p = new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src;
      s.async=false;
      s.onload=()=>{loaded.add(src);pending.delete(src);resolve(src)};
      s.onerror=()=>{pending.delete(src);reject(new Error('Could not load question bank file: '+src))};
      document.head.appendChild(s);
    });
    pending.set(src,p);
    return p;
  }

  async function scriptsSequentially(files){
    for(const file of files) await script(file);
  }

  function subject(id){
    return (window.AssessmentBuilderSubjects||[]).find(x=>x.id===id);
  }

  const legacyScienceFiles=[
    'assessment-question-bank-core.js',
    'assessment-question-bank-year7-extra.js',
    'assessment-question-bank-year7-2026-correction.js',
    'assessment-question-bank-year8-extra.js',
    'assessment-question-bank-year8-2026-correction.js',
    'assessment-question-bank-year9-extra.js',
    'assessment-question-bank-year9-2026-fix.js',
    'assessment-question-bank-year9-2026-correction.js',
    'assessment-question-bank-year10-extra.js',
    'assessment-question-bank-year10-2026-fix.js',
    'assessment-image-upgrade.js'
  ];

  async function load(subjectId,year){
    const cfg=window.AssessmentBuilderConfig||{};
    const s=subject(subjectId);
    if(!s) throw new Error('Unknown subject: '+subjectId);
    const y=s.years&&s.years[String(year)];
    if(!y) throw new Error('No question bank is available yet for '+s.label+' Year '+year+'.');

    if(y.legacy){
      await scriptsSequentially(legacyScienceFiles);
      const bank=window.AssessmentQuestionBank||[];
      return bank.filter(q=>String(q.year)===String(year));
    }

    const src=y.src||`${cfg.bankRoot}/${subjectId}/year${year}.js`;
    await script(src);
    return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&(q.subject===subjectId||!q.subject));
  }

  window.AssessmentBankLoader={load,loaded};
})();