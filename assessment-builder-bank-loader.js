// Lazy bank loader for the modular Assessment Builder.
(function(){
  const loaded = new Set();
  const pending = new Map();
  function script(src){
    if(loaded.has(src)) return Promise.resolve(src);
    if(pending.has(src)) return pending.get(src);
    const p = new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src=src+(src.includes('?')?'&':'?')+'v=2026.16';
      s.async=false;
      s.onload=()=>{loaded.add(src);pending.delete(src);resolve(src)};
      s.onerror=()=>{pending.delete(src);reject(new Error('Could not load question bank file: '+src))};
      document.head.appendChild(s);
    });
    pending.set(src,p);return p;
  }
  async function scriptsSequentially(files){for(const file of files) await script(file)}
  function subject(id){return (window.AssessmentBuilderSubjects||[]).find(x=>x.id===id)}
  const legacyScienceFiles=['assessment-question-bank-core.js','assessment-question-bank-year7-extra.js','assessment-question-bank-year7-2026-correction.js','assessment-question-bank-year8-extra.js','assessment-question-bank-year8-2026-correction.js','assessment-question-bank-year9-extra.js','assessment-question-bank-year9-2026-fix.js','assessment-question-bank-year9-2026-correction.js','assessment-question-bank-year10-extra.js','assessment-question-bank-year10-2026-fix.js','assessment-image-upgrade.js','assessment-question-bank-science-expansion-1.js','assessment-question-bank-science-repository-expansion-1.js','assessment-question-bank-science-expansion-2.js'];
  async function load(subjectId,year){
    const s=subject(subjectId);
    if(!s) throw new Error('Unknown subject: '+subjectId);
    const y=s.years&&s.years[String(year)];
    if(!y) throw new Error('No question bank is available yet for '+s.label+' Year '+year+'.');
    if(y.legacy){
      await scriptsSequentially(legacyScienceFiles);
      return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&(q.subject==='science'||!q.subject));
    }
    if(subjectId==='mathematics'){
      await scriptsSequentially(['assessment-question-bank-mathematics.js','assessment-question-bank-mathematics-expansion-1.js','assessment-question-bank-mathematics-expansion-2.js','assessment-question-bank-mathematics-expansion-3.js']);
      return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject==='mathematics'&&q.type!=='Multiple choice');
    }
    const cfg=window.AssessmentBuilderConfig||{};
    const src=y.src||`${cfg.bankRoot}/${subjectId}/year${year}.js`;
    await script(src);
    return (window.AssessmentQuestionBank||[]).filter(q=>String(q.year)===String(year)&&q.subject===subjectId);
  }
  window.AssessmentBankLoader={load,loaded};
})();

// Science-specific hierarchy enhancement: Strand -> Topic.
// Added here so older builder markup remains compatible.
window.addEventListener('DOMContentLoaded',()=>{
  const subject=document.getElementById('subject'), topic=document.getElementById('topic');
  if(!subject||!topic)return;
  const topicField=topic.closest('.field');
  const strandField=document.createElement('div');
  strandField.className='field';
  strandField.id='scienceStrandField';
  strandField.innerHTML='<label>Science strand</label><select id="strand"><option value="all">All strands</option></select>';
  topicField.parentNode.insertBefore(strandField,topicField);
  const strand=document.getElementById('strand');
  function science(){return subject.value==='science'}
  function normaliseLegacy(q){
    if(!q.strand && ['Biological Sciences','Chemical Sciences','Earth and Space Sciences','Physical Sciences'].includes(q.topic)) q.strand=q.topic;
    return q;
  }
  function refresh(){
    strandField.style.display=science()?'':'none';
    if(!science())return;
    (window.activeBank||[]).forEach(normaliseLegacy);
    const strands=[...new Set((window.activeBank||[]).map(q=>q.strand).filter(Boolean))].sort();
    const old=strand.value;
    strand.innerHTML='<option value="all">All strands</option>'+strands.map(x=>`<option value="${x}">${x}</option>`).join('');
    if(strands.includes(old))strand.value=old;
    refreshTopics();
  }
  function refreshTopics(){
    if(!science())return;
    const sv=strand.value;
    const qs=(window.activeBank||[]).filter(q=>sv==='all'||q.strand===sv);
    const actual=[...new Set(qs.filter(q=>q.strand&&q.topic&&q.topic!==q.strand).map(q=>q.topic))].sort();
    topic.innerHTML='<option value="all">All topics</option>'+actual.map(x=>`<option value="${x}">${x}</option>`).join('');
    if(typeof window.renderBank==='function')window.renderBank();
  }
  const oldTopics=window.topics;
  window.topics=function(){if(science()){refresh();}else oldTopics();};
  const oldBuild=window.build;
  window.build=function(){
    if(!science())return oldBuild();
    const sv=strand.value,t=topic.value,d=document.getElementById('difficulty').value;
    const original=window.activeBank;
    window.activeBank=original.filter(q=>(sv==='all'||q.strand===sv)&&(t==='all'||q.topic===t));
    try{return oldBuild();}finally{window.activeBank=original;}
  };
  const oldRenderBank=window.renderBank;
  window.renderBank=function(){
    if(!science())return oldRenderBank();
    const sv=strand.value,original=window.activeBank;
    window.activeBank=original.filter(q=>sv==='all'||q.strand===sv);
    try{return oldRenderBank();}finally{window.activeBank=original;}
  };
  strand.addEventListener('change',refreshTopics);
  subject.addEventListener('change',()=>setTimeout(refresh,0));
  document.getElementById('year')?.addEventListener('change',()=>setTimeout(refresh,250));
  setTimeout(refresh,250);
});