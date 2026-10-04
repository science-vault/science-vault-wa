// Converts legacy Science/Mathematics answer strings into the structured
// marking-key format used by the Physics builder, without changing the
// original question or answer content.
(function(){
 function clean(s){return String(s??'').trim()}
 function markNumber(v){const m=String(v??'').match(/\d+(?:\.\d+)?/);return m?Number(m[0]):null}
 function extractRows(answer,total){
   if(Array.isArray(answer)) return answer.map(x=>typeof x==='string'?{work:x,marks:1}:x);
   const s=clean(answer); if(!s)return [];
   // Legacy banks commonly store points as "statement [1]; statement [1]".
   const re=/(.*?)(?:\s*\[(\d+(?:\.\d+)?)\])(?=\s*(?:;|\.|<br\s*\/?>|$))/gi;
   const rows=[];let m;
   while((m=re.exec(s))!==null){let text=clean(m[1]).replace(/^[;,.\s]+|[;,.\s]+$/g,'');if(text)rows.push({work:text,marks:Number(m[2])})}
   if(rows.length)return rows;
   // Also recognise explicit mark wording.
   const parts=s.split(/\s*;\s*/).filter(Boolean),wordRows=[];
   for(const p of parts){const mm=p.match(/^(.*?)(?:\s*\(?\s*(\d+)\s*marks?\s*\)?\s*)$/i);if(mm)wordRows.push({work:clean(mm[1]),marks:Number(mm[2])})}
   if(wordRows.length===parts.length&&wordRows.length)return wordRows;
   // Do not invent separate marking points where the bank contains only a broad answer.
   return [{work:s,marks:markNumber(total)||1}];
 }
 function normaliseQuestion(q){
   if(!q||q._physicsStyleKeyNormalised)return q;
   if(!q.keyRows?.length&&!q.partKeys?.length){const rows=extractRows(q.answer,q.marks);if(rows.length)q.keyRows=rows}
   q._physicsStyleKeyNormalised=true;return q;
 }
 function normalise(bank){(bank||[]).forEach(normaliseQuestion);return bank||[]}
 window.AssessmentMarkingKeyNormalizer={normalise,normaliseQuestion,extractRows};
 if(window.AssessmentQuestionBank)normalise(window.AssessmentQuestionBank);
})();