/* One calculator-use classification shared by the bank, builder and practice quiz. */
(function(){
 function isMath(q){return q.area==='Mathematics'||/^mathematics\b/i.test(q.course||q.subject||'')}
 function classify(value){
  let text=String(value||'');try{text=decodeURIComponent(text)}catch(e){}text=text.toLowerCase().replace(/[_–—-]/g,' ');
  const free=/^(free|no|non calculator|not allowed)$/.test(text)||/calculator\s*(free|not permitted|not allowed)|(?:non|no)\s*calc(?:ulator)?\b|without\s*(a\s*)?calculator|calc\s*free/.test(text);
  const allowed=/^(allowed|assumed|permitted)$/.test(text)||/calculator\s*(assumed|allowed|permitted)|calc\s*ass(?:umed)?\b/.test(text);
  return free===allowed?'unknown':free?'free':'allowed';
 }
 function mode(q){
  if(!isMath(q))return '';
  for(const value of [q.calculatorMode,q.calculatorSection,q.calculatorPolicy]){const result=classify(value);if(result!=='unknown')return result}
  return classify([q.sourceUrl,q.sourceFile,q.unit,q.topic,q.id].filter(Boolean).join(' '));
 }
 function label(q){const value=mode(q);return value==='free'?'Calculator-free':value==='allowed'?'Calculator-allowed':value==='unknown'?'Calculator use not recorded':''}
 function matches(q,selection){return !selection||selection==='all'||mode(q)===selection}
 function updateControl(course,locked=false){const field=document.getElementById('calculatorModeField'),select=document.getElementById('calculatorMode');if(!field||!select)return;const visible=course==='all'||isMath({course});field.hidden=!visible;select.disabled=!visible||locked;if(!visible)select.value='all'}
 window.MathsCalculatorMode={isMath,mode,label,matches,updateControl};
})();
