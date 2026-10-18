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
function knownDigitalQuestion(q){
 const source=String(q.searchText||q.questionText||q.transcription||q.plainText||'');
 const html=String(q.question||'');
 const evidence=[source,html,String(q.topic||''),String(q.id||'')].join(' ').toLowerCase();
 if(!/amoxycillin|amoxicillin/.test(evidence)||!/cefalexin|cephalexin/.test(evidence))return null;
 return {
  intro:'Amoxycillin and cefalexin are antibiotics that can be used to treat bacterial infections. Information regarding these two compounds is provided in the table below.',
  table:[['Antibiotic','Molecular formula','Molecular mass (g mol⁻¹)'],['Amoxycillin','C₁₆H₁₉N₃O₅S','365.402'],['Cefalexin','C₁₆H₁₇N₃O₄S','371.406']],
  parts:[
   {label:'(a)',text:'Which antibiotic contains a higher percentage by mass of oxygen? Support your answer with appropriate calculations.',marks:3},
   {label:'(b)',text:'A sample of amoxycillin was taken for analysis. It was treated so that all the nitrogen was converted to nitrogen dioxide, NO₂(g). The mass of NO₂(g) was determined to be 0.364 g. Calculate the initial mass of amoxycillin that had been analysed.',marks:4}
  ]
 };
}
function model(q){
 const isMC=/multiple\s*choice/i.test(String(q.type||''));
 const known=knownDigitalQuestion(q);
 const original=String(q.question||'');
 const scan=/<img\b/i.test(original);
 const text=String(q.questionText||q.transcription||q.plainText||q.searchText||'').trim();
 const structured=isMC?(Array.isArray(q.mcOptions)&&q.mcOptions.length>=2&&q.stem?{stem:q.stem,options:q.mcOptions}:optionsFromText(text)):null;
 const written=!isMC&&text.length>=60&&!/<(?:img|svg)\b/i.test(text)?text.replace(/^(SCSA WACE official[^\n]*\n?){1,2}/i,'').trim():'';
 const diagrams=String(q.diagram||'');
 const parts=Array.isArray(q.parts)?q.parts:[];
 return {isMC,original,scan,structured,written,diagrams,parts,known,hasDigital:!!structured||!!written||(!scan&&plain(original).length>25)};
}
window.PracticeQuestionModel={model,optionsFromText};
})();