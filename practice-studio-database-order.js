/* Upload chronology is independent of the examination year and practice sequence. */
(function(root){'use strict';
 function addedAt(meta,imports={}){
  const value=meta?.addedAt||meta?.importedAt||imports[meta?.bankFile];
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value))return 0;
  const stamp=Date.parse(value);return Number.isFinite(stamp)&&stamp>0?stamp:0;
 }
 function sort(rows,mode='default',imports={}){
  if(!['recent','oldest'].includes(mode))return rows.slice();
  return rows.map((row,position)=>({row,position,date:addedAt(row.q?.[7],imports)})).sort((a,b)=>{
   if(!a.date||!b.date)return Number(!a.date)-Number(!b.date)||a.position-b.position;
   return (mode==='recent'?b.date-a.date:a.date-b.date)||a.position-b.position;
  }).map(x=>x.row);
 }
 root.PracticeStudioDatabaseOrder={addedAt,sort};
})(typeof window==='undefined'?globalThis:window);
