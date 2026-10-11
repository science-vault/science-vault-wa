// Curriculum resource suggestions. Filename/path matches are candidates, not verified alignment.
const stop=new Set('the and for with from into using based including between their these those within about science year unit resources resource lesson lessons activity worksheet worksheets revised final copy student teacher task assessment'.split(' '));
const words=s=>[...new Set(String(s||'').toLowerCase().replace(/([a-z])([A-Z])/g,'$1 $2').match(/[a-z]{4,}/g)||[])].filter(w=>!stop.has(w));
const stem=w=>w.replace(/(ies)$/,'y').replace(/(ing|ed|es|s)$/,'');
const basename=p=>decodeURIComponent(String(p||'').split('/').pop()||'').replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ');
const typeOf=p=>/\.pptx?$/i.test(p)?'PowerPoint':/\.(pdf|docx?)$/i.test(p)?'Document':'Resource';
let records=[];
export async function loadResourceCandidates(){
 const manifests=['powerpoint-manifest.json','resource-manifest.json'];
 const results=await Promise.allSettled(manifests.map(async name=>{const r=await fetch(name);if(!r.ok)throw Error(name+' unavailable');return r.json()}));
 const seen=new Set();records=[];
 for(const result of results){if(result.status!=='fulfilled'||!Array.isArray(result.value))continue;
  for(const item of result.value){const p=item?.path;if(typeof p!=='string'||!p.startsWith('resources/')||seen.has(p))continue;seen.add(p);records.push({path:p,title:basename(p),type:typeOf(p)})}
 }
 return records.length;
}
export function candidateResources(entry,limit=8){
 const year=String(entry.year);
 const subject=/science/i;
 const terms=words(entry.statement+' '+entry.strand).map(stem);
 const filtered=records.filter(r=>new RegExp('(?:^|/)(?:year[ _-]*)?'+year+'(?:/|$)','i').test(r.path)&&(/science/i.test(r.path)||/\/(biological|chemical|physical|earth and space) sciences\//i.test(r.path)));
 return filtered.map(r=>{const target=words(r.path).map(stem);const shared=terms.filter(t=>target.includes(t));const strand=String(entry.strand||'').toLowerCase().replace(/\s+/g,' ');const path=r.path.toLowerCase();const strandMatch=Boolean(strand)&&path.includes('/'+strand+'/');return {...r,score:shared.length+(strandMatch?1:0),shared,strandMatch}}).filter(r=>r.score>=2&&r.shared.length>=1).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title)).slice(0,limit);
}
export function resourceUrl(path){return 'https://raw.githubusercontent.com/science-vault/science-vault-wa/main/'+path.split('/').map(encodeURIComponent).join('/')}
