/* Keep native Years 7–10 banks alongside uploaded Practice Studio papers. */
(function(){
 const native=window.AssessmentQuestionBank||[],cache=new Map();let queue=Promise.resolve();
 const script=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(Error('Could not load '+src+'. Reload to retry.'));document.head.appendChild(s)});
 window.AssessmentBankLoader={loaded:new Set(),load(subject,year){
 const key=subject+'|'+year;if(cache.has(key))return cache.get(key);
 const task=queue.then(async()=>{
 let local=[];
 if(subject==='science')local=native.filter(q=>Number(q.year)===Number(year));
 else if(subject==='mathematics'){
 const def=AssessmentBuilderSubjects.find(s=>s.id===subject)?.years[year];
 if(def?.src){window.AssessmentQuestionBank=[];try{await script(def.src);local=window.AssessmentQuestionBank.filter(q=>Number(q.year)===Number(year));}finally{window.AssessmentQuestionBank=native;}}
 }
 let uploaded=[];
 try{
 const metadata=await StudioAssessmentBank.index();
 const subjects=[...new Set(metadata.filter(q=>Number(q.year)===Number(year)&&(subject==='mathematics'?/^Mathematics/.test(q.subject):subject==='science'&&['Science','Physics','Chemistry','Biology','Human Biology'].includes(q.subject))).map(q=>q.subject))];
 uploaded=(await Promise.all(subjects.map(s=>StudioAssessmentBank.load(s,year)))).flat().map(q=>({...q,type:q.type||'Written response',options:null,difficulty:q.difficulty||'Source question',strand:q.strand||q.topic}));
 }catch(e){if(!local.length)throw e;console.warn('Uploaded bank unavailable; native bank remains available.',e);}
 const rows=[...new Map([...local,...uploaded].filter(q=>subject!=='mathematics'||q.type!=='Multiple choice').map(q=>[String(q.id),q])).values()];
 this.loaded.add(key);return rows;
 });queue=task.catch(()=>{});cache.set(key,task);task.catch(()=>cache.delete(key));return task;
 }};
})();