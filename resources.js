// Science Vault WA live repository resource index.
// Every supported file uploaded under /resources is automatically added to the website.
window.SCIENCE_VAULT_RESOURCES = window.SCIENCE_VAULT_RESOURCES || [];

(async function () {
  const OUT = window.SCIENCE_VAULT_RESOURCES;
  const API = 'https://api.github.com/repos/science-vault/science-vault-wa/git/trees/main?recursive=1';
  const OK = /\.(pptx?|docx?|pdf|xlsx?|csv)$/i;
  const strands = ['Biological Sciences','Chemical Sciences','Earth and Space Sciences','Physical Sciences','Science Inquiry'];
  const clean = s => { try { return decodeURIComponent(String(s || '')); } catch(e) { return String(s || ''); } };
  const titleFrom = path => clean(path.split('/').pop() || '').replace(/\.[^.]+$/, '');
  const lower = s => String(s || '').toLowerCase();
  function resourceType(parts, name) { const folders=parts.map(lower),n=lower(name); if(folders.some(x=>x.includes('powerpoint'))||/\.pptx?$/i.test(name))return'PowerPoints'; if(folders.some(x=>x.includes('worksheet'))||/worksheet|activity sheet/.test(n))return'Worksheets'; if(folders.some(x=>x.includes('practical'))||/practical|experiment|investigation|dissection|fieldwork/.test(n))return'Practicals'; if(folders.some(x=>x.includes('revision'))||/revision|review/.test(n))return'Revision'; if(folders.some(x=>x.includes('test')||x.includes('assessment')||x.includes('exam'))||/test|assessment|quiz|exam/.test(n))return'Assessments'; if(folders.some(x=>x.includes('note'))||/notes?|summary/.test(n))return'Notes'; return'Other Resources'; }
  function schoolFrom(parts,type){ if(type!=='Assessments')return''; const i=parts.findIndex(x=>/^(assessments?|tests?|exams?)$/i.test(x.trim())); return i>=0&&parts[i+1]&&i+1<parts.length-1?parts[i+1].trim():''; }
  try {
    const res=await fetch(API,{cache:'no-store'}); if(!res.ok)throw new Error('GitHub '+res.status); const data=await res.json(),rows=[];
    for(const item of(data.tree||[])){
      if(item.type!=='blob'||!item.path.startsWith('resources/')||!OK.test(item.path))continue;
      const parts=clean(item.path).split('/'),name=parts[parts.length-1],type=resourceType(parts,name); let year='',course='Science',strand='',unit='',pathway='';
      const sy=parts.find(x=>/^Year (7|8|9|10)$/i.test(x)); if(sy){year='Year '+sy.match(/\d+/)[0]; strand=strands.find(s=>parts.some(x=>lower(x)===lower(s)))||'';}
      if(lower(parts[1])==='atar'){
        course=parts[2]||'ATAR'; pathway=/general/i.test(course)?'General':'ATAR'; course=course.replace(/\s+General$/i,'').trim();
        const y=parts.find(x=>/^Year (11|12)$/i.test(x)); if(y)year=y;
        const u=parts.find(x=>/^Unit\s*[1-4]$/i.test(x)); if(u){unit='Unit '+u.match(/[1-4]/)[0]; if(!year)year=['Unit 1','Unit 2'].includes(unit)?'Year 11':'Year 12';}
      }
      rows.push({id:'repo-'+item.sha.slice(0,12),title:titleFrom(item.path),year,course,strand,unit,pathway,topic:'',subtopic:'',school:schoolFrom(parts,type),type,format:(name.split('.').pop()||'').toUpperCase(),answers:/answer|marking key|\bmk\b/i.test(name),file:item.path,preview:/\.pdf$/i.test(name)?item.path:'',description:'Repository resource. Original file: '+name,keywords:parts.concat(titleFrom(item.path).split(/[^A-Za-z0-9]+/)).filter(Boolean),size:item.size||0});
    }
    OUT.splice(0,OUT.length,...rows); window.SCIENCE_VAULT_REPO_INDEX_READY=true; window.dispatchEvent(new CustomEvent('science-vault-resources-ready',{detail:{count:rows.length}}));
    if(typeof window.renderResources==='function')window.renderResources(); const search=document.getElementById('searchInput');if(search)search.dispatchEvent(new Event('input',{bubbles:true})); const ss=document.getElementById('syllabusSearch');if(ss)ss.dispatchEvent(new Event('input',{bubbles:true}));
  } catch(e){console.error('Science Vault repository index could not be loaded',e);}
})();
