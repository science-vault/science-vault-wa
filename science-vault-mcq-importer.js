/* Science Vault MCQ importer: 500 questions per transaction.
   Call ScienceVaultMCQImporter.importBatch(questions) after loading source records. */
(function(root){
'use strict';
const SIZE=500;
const bank=root.AssessmentQuestionBank||(root.AssessmentQuestionBank=[]);
const norm=v=>String(v??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
const signature=q=>[q.year,q.subject||'science',q.questionHTML||q.question,JSON.stringify(q.options||q.choices||[])].map(norm).join('|');
function importBatch(items){
 if(!Array.isArray(items))throw new TypeError('Expected an array of questions');
 const report={batchSize:SIZE,received:items.length,imported:0,duplicates:0,invalid:0,imagesPreserved:0,errors:[]};
 const ids=new Set(bank.map(q=>String(q.id||'')).filter(Boolean));
 const signatures=new Set(bank.map(signature));
 for(let offset=0;offset<items.length;offset+=SIZE){
  const chunk=items.slice(offset,offset+SIZE);
  for(let j=0;j<chunk.length;j++){
   const q=chunk[j],index=offset+j;
   try{
    if(!q||typeof q!=='object'||!String(q.question||q.questionHTML||'').trim()||!String(q.id||'').trim()||!/^multiple[ -]?choice$/i.test(String(q.type||''))){report.invalid++;report.errors.push({index,reason:'Missing ID/question or not multiple choice'});continue}
    const key=signature(q);
    if(ids.has(String(q.id))||signatures.has(key)){report.duplicates++;continue}
    // Preserve all original fields, including diagram, image, imageUrl, questionHTML and options.
    const saved={...q};
    bank.push(saved);ids.add(String(q.id));signatures.add(key);report.imported++;
    if(['image','imageUrl','diagram','questionHTML','options'].some(k=>typeof q[k]==='string'&&/<img\b|\.(?:png|jpg|jpeg|webp|svg)(?:\?|$)/i.test(q[k]))||q.image||q.imageUrl||q.diagram)report.imagesPreserved++;
   }catch(err){report.invalid++;report.errors.push({index,reason:String(err.message||err)})}
  }
 }
 report.totalInBank=bank.length;
 root.ScienceVaultLastImportReport=report;
 return report;
}
root.ScienceVaultMCQImporter={batchSize:SIZE,importBatch};
})(window);
