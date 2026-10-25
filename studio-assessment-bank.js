/* Assessment records are derived from the same JSON banks used by Practice Studio. */
(function(root){
 'use strict';
 const catalog=root.PracticeStudioCatalog,files=new Map(),courses=new Map();let indexPromise;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const covered=course=>Object.hasOwn(catalog.types,course);
 function json(file){
  if(!/^practice-studio-[a-z0-9-]+\.json$/.test(file))return Promise.reject(Error('Invalid Studio bank file'));
  if(!files.has(file))files.set(file,fetch(file).then(r=>{if(!r.ok)throw Error('Could not load '+file);return r.json()}).catch(e=>{files.delete(file);throw e}));
  return files.get(file);
 }
 function index(){
  if(!indexPromise)indexPromise=Promise.all(catalog.indices.map(json)).then(lists=>{
   const ids=new Set(),hashes=new Set();return lists.flat().map(catalog.normalise).filter(m=>{
    if(ids.has(m.id)||(m.hash&&hashes.has(m.hash)))return false;ids.add(m.id);if(m.hash)hashes.add(m.hash);return true;
   });
  }).catch(e=>{indexPromise=null;throw e});
  return indexPromise;
 }
 const bankFile=m=>m.bankFile||'practice-studio-'+(m.subject==='Human Biology'?'human-biology':m.subject.toLowerCase())+'-'+m.examYear+'-u'+String(m.units).replace(/\D/g,'')+'.json';
 function convert(raw){
  const m=catalog.normalise(raw);if(!m.id||!m.html||!m.answerHtml||!Number.isFinite(Number(m.marks))||Number(m.marks)<=0)throw Error('Incomplete Studio question '+(m.id||''));
  let choices='';
  if(m.markingMode==='automatic'){
   if(m.options?.length!==4||!Number.isInteger(m.correctAnswer)||m.correctAnswer<0||m.correctAnswer>3)throw Error('Incomplete answer choices for '+m.id);
   choices='<div class="studio-assessment-choices">'+m.options.map((o,i)=>'<div class="studio-assessment-option"><strong>'+String.fromCharCode(65+i)+'. </strong>'+(m.optionsHtml?.[i]||esc(o))+'</div>').join('')+'</div>';
  }
  return{id:'studio:'+m.id,studioSourceId:m.id,studioHash:m.hash,area:'Science',course:m.subject,pathway:'ATAR',year:Number(m.year),unit:(String(m.units).includes('&')?'Units ':'Unit ')+m.units,topic:m.topics?.[0]||'General',subtopic:m.subtopics?.[0]||m.topics?.[0]||'General',topics:m.topics||[],subtopics:m.subtopics||[],mixed:!!m.mixed,type:m.types[0],marks:Number(m.marks),question:m.html+choices,answer:m.answerHtml,parts:[],responseLines:m.markingMode==='automatic'?0:Math.min(30,Math.max(3,Math.ceil(m.marks*1.3))),examYear:m.examYear,sourceYear:m.examYear,sourceQuestionNumber:m.number,sourceSection:m.sourceSection||m.section,sourceAssessment:m.source,sourceFile:m.sourceFile,syllabusVersion:'source-'+m.examYear,importBatch:'practice-studio-shared',markingMode:m.markingMode,correctAnswer:m.correctAnswer,options:m.options,optionsHtml:m.optionsHtml,searchText:m.text};
 }
 function register(rows){
  root.UpperSchoolQuestionBank=root.UpperSchoolQuestionBank||[];const existing=new Set(root.UpperSchoolQuestionBank.map(q=>q.id));
  for(const q of rows)if(!existing.has(q.id)){root.UpperSchoolQuestionBank.push(q);existing.add(q.id)}
  return rows;
 }
 function load(course,year){
  const key=course+'|'+year;if(!covered(course))return Promise.resolve([]);
  if(!courses.has(key))courses.set(key,index().then(async data=>{
   const metadata=data.filter(m=>m.subject===course&&Number(m.year)===Number(year)),selected=new Set(metadata.map(m=>m.id));
   const lists=await Promise.all([...new Set(metadata.map(bankFile))].map(json)),rows=[],seen=new Set();
   for(const raw of lists.flat())if(selected.has(raw.id)&&!seen.has(raw.id)){seen.add(raw.id);rows.push(convert(raw))}
   if(rows.length!==selected.size)throw Error('Some Studio questions are missing from the exam files. Please retry.');
   return register(rows);
  }).catch(e=>{courses.delete(key);throw e}));
  return courses.get(key);
 }
 async function ensureIds(ids){const wanted=new Set(ids.map(id=>String(id).replace(/^studio:/,''))),meta=(await index()).filter(q=>wanted.has(q.id));await Promise.all([...new Map(meta.map(q=>[q.subject+'|'+q.year,q])).values()].map(q=>load(q.subject,q.year)));}
 root.StudioAssessmentBank={index,load,covered,convert,bankFile,ensureIds};
})(typeof window==='undefined'?globalThis:window);