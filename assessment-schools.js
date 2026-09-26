// Adds a second grouping level under Assessments using school folders indexed by repo-resources.js.
(function(){
  function schoolName(r){
    if(r.school && String(r.school).trim()) return String(r.school).trim();
    const parts=String(r.file||'').split('/').map(x=>{try{return decodeURIComponent(x)}catch(e){return x}});
    const idx=parts.findIndex(x=>/^(assessments?|tests?)$/i.test(String(x).trim()));
    if(idx>=0 && parts[idx+1] && idx+1<parts.length-1) return parts[idx+1].trim();
    return 'Other / School not specified';
  }
  function assessmentSchools(items,year,strand){
    const schools={};
    items.forEach(r=>{const s=schoolName(r);(schools[s]??=[]).push(r)});
    return Object.entries(schools).sort((a,b)=>a[0].localeCompare(b[0])).map(([school,files])=>
      `<details class="assessment-school-group"><summary><b>${school}</b><span>${files.length}</span></summary><div class="compact-resource-list">${files.map(r=>card(r,year,strand)).join('')}</div></details>`
    ).join('');
  }
  grouped=function(rows,year,strand){
    const order=['PowerPoints','Worksheets','Practicals','Notes','Revision','Assessments','Other Resources'];
    const groups={};
    rows.forEach(r=>{const k=displayType(r.type||'Other Resources');(groups[k]??=[]).push(r)});
    return Object.entries(groups).sort((a,b)=>{
      const ai=order.indexOf(a[0]),bi=order.indexOf(b[0]);
      return (ai<0?99:ai)-(bi<0?99:bi)||a[0].localeCompare(b[0]);
    }).map(([type,items])=>{
      const inside=type==='Assessments'?assessmentSchools(items,year,strand):`<div class="compact-resource-list">${items.map(r=>card(r,year,strand)).join('')}</div>`;
      return `<details class="resource-type-group"><summary><b>${type}</b><span>${items.length}</span></summary>${inside}</details>`;
    }).join('');
  };
  if(typeof render==='function') render();
  window.addEventListener('science-vault-resources-ready',()=>{if(typeof render==='function')render();});
})();