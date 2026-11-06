/* Lower school uses the same catalogue and question records as Practice Studio. */
(function(){
 window.AssessmentQuestionBank=[];
 window.AssessmentBankLoader={loaded:new Set(),async load(subject,year){
  const metadata=await StudioAssessmentBank.index();
  const subjects=[...new Set(metadata.filter(q=>Number(q.year)===Number(year)&&(subject==='mathematics'?q.subject==='Mathematics':subject==='science'&&!/^Mathematics/.test(q.subject))).map(q=>q.subject))];
  const lists=await Promise.all(subjects.map(s=>StudioAssessmentBank.load(s,year)));
  const byId=new Map(metadata.map(q=>[q.id,q]));
  const rows=lists.flat().map(q=>({...q,type:byId.get(q.studioSourceId)?.responseTypes?.[0]||'Short answer',options:null,difficulty:'Source question',strand:q.topic}));
  window.AssessmentQuestionBank=rows;this.loaded.add(subject+'|'+year);return rows;
 }};
})();
