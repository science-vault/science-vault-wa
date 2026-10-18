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

/* Multiple-choice migration: source questions remain untouched. */
function mcConvert(source){
 const q={...source},raw=clean(q.question),text=clean(q.questionText||q.transcription||q.plainText||q.searchText||strip(raw));
 if(!/multiple[\s-]*choice/i.test(String(q.type||'')))return null;
 const matches=[...text.matchAll(/(?:^|\s|\n)(?:\(?([A-Da-d])\)|([A-Da-d])[.)])\s+/g)];
 let parsed=null;
 for(let i=0;i<=matches.length-4;i++){
  const four=matches.slice(i,i+4);
  if(four.map(m=>(m[1]||m[2]).toUpperCase()).join('')!=='ABCD')continue;
  const stem=text.slice(0,four[0].index).replace(/^(?:SCSA WACE official\s*)+/i,'').trim();
  const options=four.map((m,j)=>text.slice(m.index+m[0].length, matches[i+j+1]?.index??text.length).trim());
  if(stem.length>=15&&options.every(x=>x.length>0&&x.length<800)){parsed={stem,options};break}
 }
 const options=Array.isArray(q.mcOptions)&&q.mcOptions.length===4?q.mcOptions:
  Array.isArray(q.options)&&q.options.length===4?q.options:parsed?.options;
 const stem=clean(q.stem||parsed?.stem||(!/<img\b/i.test(raw)?strip(raw):''));
 if(!options||options.length!==4||stem.length<15)return null;
 const answer=strip(q.correctLetter||q.correctAnswer||q.answer);
 const m=answer.match(/(?:^|correct\s*answer\s*[:\-]?\s*|answer\s*[:\-]?\s*)([A-D])(?=[.)\s<]|$)/i);
 const correctLetter=m?.[1]?.toUpperCase()||(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4?'ABCD'[q.correctIndex]:null);
 if(!correctLetter)return null;
 const diagram=clean(q.diagram||q.practiceDiagram);
 // A source-page screenshot is not a clean diagram: keep it out of the digital view.
 const sourcePage=/source-page-images/i.test(String(q.questionFormat||''))||/source-(?:image|layout)/i.test(raw);
 const embedded=[...raw.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
 const images=diagram?[diagram]:!sourcePage&&embedded.length&&strip(raw).length>=15?embedded:[];
 return {...q,id:q.id||'imported-'+Math.abs(hash(stem+options.join('|'))),stem,questionText:stem,mcOptions:options.map(strip),correctLetter,practiceImages:images,practiceBankStatus:'ready',practiceBankSourceId:q.id||'',practiceBankVersion:2};
}
function hash(s){let n=0;for(let i=0;i<s.length;i++)n=(Math.imul(31,n)+s.charCodeAt(i))|0;return n}
function ingestMultipleChoice(items){
 const ready=[],held={unparsed:0,missingKey:0};
 for(const q of items||[]){
  if(!/multiple[\s-]*choice/i.test(String(q.type||'')))continue;
  const v=mcConvert(q);
  if(v){ready.push(v);if(v.id)registry.set(String(v.id),v)}
  else held.unparsed++;
 }
 window.PracticeQuizBank.mcStats={ready:ready.length,...held};
 return ready;
}

window.PracticeQuizBank={convert,ingest,ingestMultipleChoice,lookup:id=>registry.get(String(id)),stats:{},mcStats:{}};
})();