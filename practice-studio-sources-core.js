/* Source documents are counted from the active Practice Studio catalogue. */
(function(root){
 'use strict';
 const normaliseFile=name=>String(name||'').split(/[\\/]/).pop().toLowerCase().replace(/(?:\s*\(\d+\))+(?=\.[^.]+$)/,'').trim();
 function aggregate(rows,registry){
  const known=new Map(registry.documents.map(d=>[d.subject+'|'+d.file.toLowerCase(),d])),groups=new Map(),seen=new Set();
  for(const raw of rows){
   if(seen.has(raw.id))continue;seen.add(raw.id);
   const fallback=registry.bankSources[raw.bankFile]||Object.entries(registry.bankSources).find(([bank])=>raw.id.startsWith(bank.replace('practice-studio-','').replace('.json','')+'-q'))?.[1]||{};
   const q={...fallback,...raw},file=q.sourceFile||'',id=q.subject+'|'+(file||q.source||q.bankFile||q.id).toLowerCase(),original=known.get(id)||{};
   if(!groups.has(id))groups.set(id,{id,subject:q.subject,file:file||q.source||'Source filename not recorded',filenameRecorded:!!file,path:q.sourcePath||original.path||'',years:new Set(),examYears:new Set(),units:new Set(),keys:new Map(),addedAt:new Set(),questions:0});
   const d=groups.get(id);d.questions++;if(q.year)d.years.add(q.year);if(q.examYear)d.examYears.add(q.examYear);if(q.units)d.units.add(q.units);if(q.addedAt)d.addedAt.add(q.addedAt);
   if(q.sourceKeyFile){const key=(original.keys||[]).find(k=>k.file===q.sourceKeyFile);d.keys.set(q.sourceKeyFile,{file:q.sourceKeyFile,path:q.sourceKeyPath||key?.path||(q.sourceKeyFile===file?d.path:'')});}
  }
  return [...groups.values()].map(d=>({...d,years:[...d.years].sort((a,b)=>a-b),examYears:[...d.examYears].sort((a,b)=>a-b),units:[...d.units].sort(),keys:[...d.keys.values()],addedAt:[...d.addedAt].sort()})).sort((a,b)=>a.subject.localeCompare(b.subject)||a.file.localeCompare(b.file,undefined,{numeric:true}));
 }
 function filter(documents,subject,query){const terms=String(query||'').toLowerCase().trim().split(/\s+/).filter(Boolean);return documents.filter(d=>(!subject||d.subject===subject)&&terms.every(t=>[d.file,d.subject,...d.years,...d.examYears,...d.units,...d.keys.map(k=>k.file)].join(' ').toLowerCase().includes(t)));}
 function matchFiles(documents,names){return names.map(name=>({name,matches:documents.filter(d=>d.filenameRecorded&&normaliseFile(d.file)===normaliseFile(name))}));}
 function csv(documents){const cell=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';return '\ufeff'+[['Subject','Source document','Question years','Paper year','Units','Imported questions','Marking key documents','First recorded import'],...documents.map(d=>[d.subject,d.file,d.years.join('; '),d.examYears.join('; '),d.units.join('; '),d.questions,d.keys.map(k=>k.file).join('; '),d.addedAt[0]?.slice(0,10)||'Not recorded'])].map(row=>row.map(cell).join(',')).join('\r\n');}
 function sourceURL(path){return path?'https://raw.githubusercontent.com/science-vault/science-vault-wa/main/'+path.split('/').map(encodeURIComponent).join('/'):'';}
 root.PracticeStudioSources={aggregate,filter,matchFiles,csv,normaliseFile,sourceURL};
})(typeof window==='undefined'?globalThis:window);
