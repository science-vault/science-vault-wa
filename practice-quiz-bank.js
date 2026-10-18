/* Dedicated digital Practice Quiz Bank. Assessment Builder and source banks are untouched.
   Converts only reliably structured questions; incomplete scans are held for review. */
(function(){
'use strict';
const registry=new Map();
const strip=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&(?:nbsp|#160);/gi,' ').trim();
const clean=s=>String(s||'').trim();
const isImage=s=>/<(?:img|svg)\b/i.test(String(s||''));
function optionsFromText(raw){
 const lines=clean(raw).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 const choices=[];let first=-1;
 for(let i=0;i<lines.length;i++){
  const m=lines[i].match(/^\(?([a-d])\)\s*(.*)$/i)||lines[i].match(/^([a-d])[.)]\s*(.*)$/i);
  if(!m||m[1].toUpperCase()!=='ABCD'[choices.length])continue;
  if(first<0)first=i;
  let value=m[2].trim();
  if(!value&&lines[i+1]&&!/^\(?[a-d]\)/i.test(lines[i+1]))value=lines[++i];
  if(!value)return null;
  choices.push(value);
  if(choices.length===4)break;
 }
 if(choices.length!==4)return null;
 const stem=lines.slice(0,first).join(' ').replace(/^(?:SCSA WACE official\s*)+/i,'').trim();
 return stem.length>=20?{stem,options:choices}:null;
}
function convert(source){
 const q={...source};
 const id=String(q.id||'').trim();
 const raw=clean(q.question);
 const text=clean(q.questionText||q.transcription||q.plainText||q.searchText);
 const scan=isImage(raw);
 const mc=/multiple\s*choice/i.test(String(q.type||''));
 const partTexts=Array.isArray(q.parts)&&q.parts.length&&q.parts.every(p=>strip(p.text).length>=8);
 const providedOptions=Array.isArray(q.mcOptions)&&q.mcOptions.length>=2?q.mcOptions:
  Array.isArray(q.options)&&q.options.length>=2&&q.options.some(o=>clean(o).length>2)?q.options:null;
 const parsed=mc?optionsFromText(text):null;
 const options=providedOptions||parsed?.options;
 const stem=clean(q.stem||q.questionText||q.transcription||parsed?.stem);
 const written=clean(q.questionText||q.transcription||q.plainText||q.searchText);
 const diagram=clean(q.diagram);
 const structuredMC=mc&&options&&options.length>=2&&stem.length>=20&&!isImage(stem);
 const structuredWritten=!mc&&(partTexts||written.length>=70&&!isImage(written)||!scan&&strip(raw).length>=30);
 const ready=!!(structuredMC||structuredWritten);
 const status=ready?'ready':scan?'needs-transcription':'needs-review';
 const answerKey=clean(q.correctLetter||q.correctAnswer||q.answer);
 const keyMatch=answerKey.match(/^(?:option\s*|answer\s*[:=]?\s*)?([A-E])(?:[.)\s]|$)/i);
 const result={...q,practiceBankStatus:status,practiceBankSourceId:id,practiceBankVersion:1};
 if(structuredMC){
  result.stem=stem;
  result.mcOptions=options;
  result.questionText=stem;
  if(keyMatch)result.correctLetter=keyMatch[1].toUpperCase();
 }else if(structuredWritten){
  if(written.length>=70&&!isImage(written))result.questionText=written;
 }
 // A scan can include useful diagrams, but its writing spaces must never be presented
 // as the default digital question. The original remains accessible in source data.
 if(ready)result.practiceOriginalQuestion=raw;
 if(ready&&scan&&diagram)result.practiceDiagram=diagram;
 return result;
}
function ingest(items){
 const all=[];const stats={ready:0,'needs-transcription':0,'needs-review':0};
 for(const q of items||[]){
  const item=convert(q);
  if(item.id)registry.set(String(item.id),item);
  stats[item.practiceBankStatus]++;
  all.push(item);
 }
 window.PracticeQuizBank.stats=stats;
 return all;
}
window.PracticeQuizBank={convert,ingest,lookup:id=>registry.get(String(id)),stats:{}};
})();