// Senior pages use the same live index as the rest of Learning Vault WA.
(function(){
 const OUT=window.SENIOR_RESOURCES||(window.SENIOR_RESOURCES=[]);
 function sync(){
  const src=window.SCIENCE_VAULT_RESOURCES||[];
  OUT.splice(0,OUT.length,...src.filter(r=>r.pathway&&r.course));
  window.dispatchEvent(new CustomEvent('senior-resources-ready',{detail:{count:OUT.length}}));
 }
 if(window.SCIENCE_VAULT_REPO_INDEX_READY)sync();
 else window.addEventListener('science-vault-resources-ready',sync,{once:true});
})();