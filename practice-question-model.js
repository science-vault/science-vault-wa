/* Structured question display model for Practice Tests only. */
(function(){
'use strict';
const plain=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').trim();
function optionsFromText(raw){
 const lines=String(raw||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 let start=-1;const choices=[];
 for(let i=0;i<lines.length;i++){
  const m=lines[i].match(/^\(?([A-Da-d])\)[\s]*(.*)$|^([A-Da-d])[.)]\s*(.*)$/);
  if(!m||String(m[1]||m[3]).toUpperCase()!=='ABCD'[choices.length])continue;
  if(start<0)start=i;
  let answer=(m[2]||m[4]||'').trim();
  if(!answer&&i+1<lines.length){answer=lines[++i];}
  if(!answer)return null;
  choices.push(answer);
  if(choices.length===4)break;
 }
 if(choices.length!==4)return null;
 let stem=lines.slice(0,start).join(' ').replace(/^(SCSA WACE official\s*)+/i,'').trim();
 const numbered=stem.match(/(?:^|\s)\d{1,2}[.)]\s+(.{18,})$/);
 if(numbered)stem=numbered[1];
 return stem.length>20?{stem,options:choices}:null;
}
function model(q){
 const isMC=/multiple\s*choice/i.test(String(q.type||''));
 const original=String(q.question||'');
 const scan=/<img\b/i.test(original);
 const text=String(q.questionText||q.transcription||q.plainText||q.searchText||'').trim();
 const structured=isMC?(Array.isArray(q.mcOptions)&&q.mcOptions.length>=2&&q.stem?{stem:q.stem,options:q.mcOptions}:optionsFromText(text)):null;
 const written=!isMC&&text.length>=60&&!/<(?:img|svg)\b/i.test(text)?text.replace(/^(SCSA WACE official[^\n]*\n?){1,2}/i,'').trim():'';
 const diagrams=String(q.diagram||'');
 const parts=Array.isArray(q.parts)?q.parts:[];
 return {isMC,original,scan,structured,written,diagrams,parts,hasDigital:!!structured||!!written||(!scan&&plain(original).length>25)};
}
window.PracticeQuestionModel={model,optionsFromText};
})();