(async function(){
  const target=window.SCIENCE_VAULT_RESOURCES||(window.SCIENCE_VAULT_RESOURCES=[]);
  const api='https://api.github.com/repos/science-vault/science-vault-wa/git/trees/main?recursive=1';
  const extOK=/\.(pptx?|docx?|pdf|xlsx?|csv)$/i;
  const clean=s=>decodeURIComponent(String(s||''));
  const titleFrom=p=>clean(p.split('/').pop()||'').replace(/\.[^.]+$/,'');
  const typeFrom=(parts,name)=>{
    const folders=parts.map(x=>x.toLowerCase());
    const n=name.toLowerCase();
    if(folders.some(x=>x.includes('powerpoint'))||/\.pptx?$/i.test(name))return 'PowerPoints';
    if(folders.some(x=>x.includes('worksheet'))||/worksheet|activity sheet/i.test(n))return 'Worksheets';
    if(folders.some(x=>x.includes('practical'))||/practical|experiment|investigation|dissection/i.test(n))return 'Practicals';
    if(folders.some(x=>x.includes('revision'))||/revision|review/i.test(n))return 'Revision';
    if(folders.some(x=>x.includes('test')||x.includes('assessment'))||/test|assessment|quiz|exam/i.test(n))return 'Assessments';
    if(folders.some(x=>x.includes('note'))||/notes?|summary/i.test(n))return 'Notes';
    return 'Other Resources';
  };
  const strandNames=['Biological Sciences','Chemical Sciences','Earth and Space Sciences','Physical Sciences','Science Inquiry'];
  try{
    const res=await fetch(api,{cache:'no-store'}); if(!res.ok)throw new Error('GitHub '+res.status);
    const data=await res.json();
    const rows=[];
    for(const item of (data.tree||[])){
      if(item.type!=='blob'||!item.path.startsWith('resources/')||!extOK.test(item.path)||/\/\.keep$/i.test(item.path))continue;
      const parts=clean(item.path).split('/'); const name=parts[parts.length-1];
      let year='',course='Science',strand='',unit='';
      const y=parts.find(x=>/^Year (7|8|9|10)$/i.test(x));
      if(y)year='Year '+y.match(/\d+/)[0];
      if(parts[1]==='ATAR'){
        course=parts[2]||'ATAR'; year=parts.find(x=>/^Year (11|12)$/i.test(x))||''; unit=parts.find(x=>/^Unit\s*[1-4]$/i.test(x))||'';
      }else strand=strandNames.find(s=>parts.some(x=>x.toLowerCase()===s.toLowerCase()))||'';
      rows.push({id:'repo-'+item.sha.slice(0,12),title:titleFrom(item.path),year,course,strand,unit,topic:'',subtopic:'',school:'',type:typeFrom(parts,name),format:(name.split('.').pop()||'').toUpperCase(),answers:/answer|marking key|\bmk\b/i.test(name),file:item.path,preview:/\.pdf$/i.test(name)?item.path:'',description:'Repository resource. Original file: '+name,keywords:parts.concat(titleFrom(item.path).split(/[^A-Za-z0-9]+/)).filter(Boolean),size:item.size||0});
    }
    target.splice(0,target.length,...rows);
    window.SCIENCE_VAULT_REPO_INDEX_READY=true;
    window.dispatchEvent(new CustomEvent('science-vault-resources-ready',{detail:{count:rows.length}}));
    const box=document.getElementById('syllabusSearch'); if(box)box.dispatchEvent(new Event('input',{bubbles:true}));
  }catch(e){console.error('Science Vault repository index could not be loaded',e);}
})();