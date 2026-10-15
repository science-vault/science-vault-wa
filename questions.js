window.LEARNING_VAULT_QUESTIONS = window.LEARNING_VAULT_QUESTIONS || [];
/*
Add questions using this structure:
{
 id:"sci-y10-chem-001",
 year:"10",
 subject:"Science",
 course:"Science",
 topic:"Chemistry",
 subtopic:"Rates of Reaction",
 difficulty:"Medium",
 type:"Explain",
 marks:3,
 question:"Explain how increasing temperature affects the rate of a chemical reaction.",
 answer:"Particles have greater kinetic energy, collide more frequently and a greater proportion of collisions have sufficient energy to react.",
 source:"Teacher Created",
 tags:["collision theory","reaction rates"]
}
*/

(function(){const rows=window.LEARNING_VAULT_QUESTIONS||[],ids=new Set(rows.map(q=>q.id));const text=v=>{if(!/<[a-z][^>]*>/i.test(String(v||'')))return String(v||'');const t=document.createElement('div');t.innerHTML=v;return t.textContent||''};for(const q of window.AssessmentQuestionBank||[])if((!q.subject||q.subject==='science')&&Number(q.year)>=7&&Number(q.year)<=10&&!ids.has(q.id)){rows.push({...q,subject:'Science',course:'Science',question:text(q.question),questionHTML:q.sourceAssessment?q.question:undefined,answer:text(q.answer),source:q.source||'Learning Vault Science assessment bank'});ids.add(q.id)}window.LEARNING_VAULT_QUESTIONS=rows})();

