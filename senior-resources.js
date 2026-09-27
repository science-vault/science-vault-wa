// Senior pages use the same manifest index as the rest of Learning Vault WA.
// Broad Year 11/12 uploads are assigned to the most likely unit from their path/title.
(function(){
 const OUT=window.SENIOR_RESOURCES||(window.SENIOR_RESOURCES=[]);
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 function inferUnit(r){
  if(r.unit)return r.unit;
  const allowed=r.year==='Year 11'?[1,2]:r.year==='Year 12'?[3,4]:[];
  if(!allowed.length)return'';
  const content=(window.SENIOR_CONTENT&&window.SENIOR_CONTENT[r.course+'|'+r.pathway])||{};
  const hay=norm([r.title,r.description,...(r.keywords||[])].join(' '));
  let best=allowed[0],bestScore=0;
  for(const u of allowed){
   const phrases=content[u]||[];let score=0;
   for(const phrase of phrases){
    const words=norm(phrase).split(' ').filter(w=>w.length>4);
    for(const w of words)if(hay.includes(w))score++;
   }
   if(score>bestScore){bestScore=score;best=u}
  }
  return'Unit '+best;
 }
 function inferTopic(r){
  const u=Number(String(r.unit||'').replace(/\D/g,''));
  const topics=((window.SENIOR_CONTENT&&window.SENIOR_CONTENT[r.course+'|'+r.pathway])||{})[u]||[];
  const hay=norm([r.title,r.description,...(r.keywords||[])].join(' '));let best='',score=0;
  for(const t of topics){const words=norm(t).split(' ').filter(w=>w.length>4);const s=words.reduce((n,w)=>n+(hay.includes(w)?1:0),0);if(s>score){score=s;best=t}}
  return score?best:'';
 }
 function sync(){
  const src=window.SCIENCE_VAULT_RESOURCES||[];
  const rows=src.filter(r=>r.pathway&&r.course).map(r=>{const x={...r};x.unit=inferUnit(x);x.topic=inferTopic(x);return x});
  OUT.splice(0,OUT.length,...rows);
  window.dispatchEvent(new CustomEvent('senior-resources-ready',{detail:{count:OUT.length}}));
 }
 if(window.SCIENCE_VAULT_REPO_INDEX_READY)sync();
 else window.addEventListener('science-vault-resources-ready',sync,{once:true});
})();