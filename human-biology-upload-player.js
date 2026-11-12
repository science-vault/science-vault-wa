/* Load only the selected presentation, then use the existing lesson and progress player. */
(function(root){'use strict';
const previous=root.HumanBiologyATARPlayer.build,cache=new Map();let request=0;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(path){
 if(!/^hb-upload-[a-z0-9-]+\.json$/.test(path))return Promise.reject(Error('Invalid lesson path.'));
 if(!cache.has(path))cache.set(path,fetch(path+'?v=2026.11.12').then(r=>{if(!r.ok)throw Error('The lesson could not load.');return r.json();}).then(data=>{
  const m=data.lesson;
  if(!m||!Array.isArray(m.screens)||m.screens.length!==data.source.slides+1||!m.bank?.length)throw Error('The lesson is incomplete.');
  for(const screen of m.screens){
   if(screen.kind!=='reference')continue;
   const template=document.createElement('template');template.innerHTML=screen.html;
   for(const img of template.content.querySelectorAll('[data-lesson-image]')){
    const src=data.images[img.dataset.lessonImage];
    if(!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(src||''))throw Error('A lesson illustration is unavailable.');
    img.src=src;img.removeAttribute('data-lesson-image');
   }
   screen.html=template.innerHTML;
  }
  m.screens[0].html='<p class="hb-scope"><strong>Learning goal:</strong> '+esc(m.scope)+'</p>'+m.screens[0].html;
  return m;
 }).catch(e=>{cache.delete(path);throw e;}));
 return cache.get(path);
}
root.HumanBiologyATARPlayer.build=async function(topic,host,...args){
 const token=++request;
 if(!topic.uploadLesson)return previous.call(this,topic,host,...args);
 host.innerHTML='<p role="status">Loading '+esc(topic.title)+'…</p>';
 try{
  const lesson=await load(topic.uploadLesson);
  if(token!==request||root.vaultCurrentTopic?.id!==topic.id)return;
  if(lesson.id!==topic.id)throw Error('The lesson record does not match this topic.');
  const entry=root.HumanBiologyATAR.find(m=>m.id===topic.id);Object.assign(entry,lesson);
  return await previous.call(this,entry,host,...args);
 }catch(error){
  if(token!==request||root.vaultCurrentTopic?.id!==topic.id)return;
  host.innerHTML='<section role="alert"><p>'+esc(error.message)+'</p><button class="btn" type="button">Retry lesson</button></section>';
  host.querySelector('button').onclick=()=>root.HumanBiologyATARPlayer.build(topic,host,...args);
 }
};
root.HBUploadedLessons={load};
})(window);
