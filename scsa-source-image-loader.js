/* Load exact-source image packs only when a displayed question needs them. */
(function(){
 const packs=window.ScsaSourceImagePacks=window.ScsaSourceImagePacks||{},pending=new Map(),urls=new Map();
 function load(id){
  if(packs[id])return Promise.resolve(packs[id]);
  if(pending.has(id))return pending.get(id);
  if(!/^[a-z0-9-]+$/.test(id))return Promise.reject(new Error('Invalid source image pack'));
  const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='scsa-source-pack-'+id+'.js?v='+encodeURIComponent(window.ScsaSourceImagePackVersions?.[id]||'2026.10.13');s.onload=()=>packs[id]?resolve(packs[id]):reject(new Error('Empty source image pack'));s.onerror=()=>{pending.delete(id);reject(new Error('Could not load examination images'))};document.head.appendChild(s)});
  pending.set(id,p);return p;
 }
 async function fill(img){
  if(img.dataset.scsaLoaded)return;
  const id=img.dataset.scsaPack,key=img.dataset.scsaImage;
  try{const pack=await load(id);if(!pack[key])throw new Error('Missing source question image');const cacheKey=id+':'+key;let url=urls.get(cacheKey);if(!url){const raw=atob(pack[key]),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));url=URL.createObjectURL(new Blob([bytes],{type:'image/jpeg'}));urls.set(cacheKey,url);}img.src=url;img.dataset.scsaLoaded='true';const link=img.closest('a[data-scsa-image-link]');if(link)link.href=url;img.removeAttribute('data-scsa-error');}
  catch(e){img.dataset.scsaError=e.message;img.alt='Examination image could not load. Open the original paper link or retry.';}
 }
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){observer.unobserve(e.target);fill(e.target)}},{rootMargin:'400px'}):null;
 function watch(root){for(const img of root.querySelectorAll?.('img[data-scsa-pack]:not([data-scsa-watched])')||[]){img.dataset.scsaWatched='true';if(observer)observer.observe(img);else fill(img)}}
 async function hydrate(root){await Promise.all([...root.querySelectorAll('img[data-scsa-pack]')].map(fill));const bad=[...root.querySelectorAll('img[data-scsa-error]')];if(bad.length)throw new Error('Some examination images did not load. Retry before printing.');}
 async function preparePrint(root){
  const seen=new Set(),restore=[];
  for(const book of root.querySelectorAll('details[data-scsa-support]')){restore.push([book,book.open,book.style.display]);if(seen.has(book.dataset.scsaSupport))book.style.display='none';else{seen.add(book.dataset.scsaSupport);book.open=true;}}
  const reset=()=>{for(const [book,open,display]of restore){book.open=open;book.style.display=display;}};
  try{await hydrate(root);return reset;}catch(e){reset();throw e;}
 }
 new MutationObserver(records=>{for(const r of records)for(const node of r.addedNodes)if(node.nodeType===1){if(node.matches?.('img[data-scsa-pack]'))watch(node.parentElement);else watch(node)}}).observe(document.documentElement,{childList:true,subtree:true});
 watch(document);
 window.ScsaSourceImages={load,hydrate,preparePrint};
})();
