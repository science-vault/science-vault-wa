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
    img.src=src;img.alt=img.alt.replace(/^Original presentation illustration for /,'Diagram for ');img.removeAttribute('data-lesson-image');
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
  const entry=root.HumanBiologyATAR.find(m=>m.id===topic.id);
  Object.assign(entry,lesson,{screens:paginate(lesson.screens),questions:lesson.questions.map(q=>({...q,practice:false})),autoAdvance:true});
  const result=await previous.call(this,entry,host,...args);
  const frame=host.querySelector('.hb-lms');
  if(frame){
   frame.classList.add('hb-viewport');
   const exit=document.createElement('button');exit.type='button';exit.className='btn';exit.textContent='← Lessons';
   exit.onclick=()=>document.getElementById('backTopics')?.click();frame.querySelector('.sv-course').prepend(exit);
   const observer=new MutationObserver(()=>masterPages(frame));observer.observe(frame.querySelector('.sv-screen'),{childList:true});
   masterPages(frame);
  }
  return result;
 }catch(error){
  if(token!==request||root.vaultCurrentTopic?.id!==topic.id)return;
  host.innerHTML='<section role="alert"><p>'+esc(error.message)+'</p><button class="btn" type="button">Retry lesson</button></section>';
  host.querySelector('button').onclick=()=>root.HumanBiologyATARPlayer.build(topic,host,...args);
 }
};
root.HBUploadedLessons={load};

// Short reading pages keep every paragraph and illustration visible without scrolling.
function paginate(screens){
 const width=Math.max(260,Math.min(1000,innerWidth-(innerWidth>700?300:40)));
 const height=Math.max(170,innerHeight-(innerWidth>700?200:250));
 const measure=document.createElement('article');measure.className='hb-fit-measure';
 measure.style.cssText='position:fixed;visibility:hidden;left:0;top:0;width:'+width+'px;font:18px/1.5 Arial;pointer-events:none;';document.body.append(measure);
 const output=[],wordLimit=Math.max(8,Math.min(45,Math.floor(width/70)*Math.max(1,Math.floor(height/32)-1)));
 for(const screen of screens){
  if(screen.kind!=='reference'){output.push({...screen});if(screen.kind==='question')output.push({kind:'solution',title:'Suggested answer',q:screen.q});continue;}
  const template=document.createElement('template');template.innerHTML=screen.html;
  const blocks=[];
  function collect(node){
   if(node.nodeType!==1)return;
   if(node.matches('p')){
    const words=node.textContent.trim().split(/\s+/);
    if(words.length<=wordLimit){blocks.push(node.cloneNode(true));return;}
    // DOM ranges retain bold, italic, subscript and superscript while splitting long paragraphs.
    const textNodes=[];const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let leaf;
    while((leaf=walker.nextNode()))textNodes.push(leaf);
    const text=node.textContent;const matches=[...text.matchAll(/\S+\s*/g)];
    for(let i=0;i<matches.length;i+=wordLimit){
     const start=matches[i].index,end=i+wordLimit<matches.length?matches[i+wordLimit].index:text.length;
     const range=document.createRange();let offset=0,started=false;
     for(const leaf of textNodes){const next=offset+leaf.length;
      if(!started&&start<next){range.setStart(leaf,start-offset);started=true;}
      if(started&&end<=next){range.setEnd(leaf,end-offset);break;}offset=next;
     }
     const p=node.cloneNode(false);p.append(range.cloneContents());blocks.push(p);
    }
   }else if(node.matches('figure')){
    const figure=node.cloneNode(true),img=figure.querySelector('img');
    figure.querySelector('figcaption')?.remove();
    if(img){img.loading='eager';img.style.cssText='display:block;max-width:100%;width:auto;height:auto;max-height:'+Math.floor(height*.78)+'px;object-fit:contain;margin:auto';}
    blocks.push(figure);
   }else for(const child of node.children)collect(child);
  }
  for(const node of template.content.children)collect(node);
  let page=[];const pages=[];
  const flush=()=>{if(page.length){pages.push(page);page=[];measure.replaceChildren();}};
  for(const block of blocks){
   measure.append(block.cloneNode(true));
   // Images reserve their full allowed height before loading, so network timing cannot change pagination.
   const figure=block.matches('figure');
   if((measure.scrollHeight>height||figure&&page.length)&&page.length){flush();measure.append(block.cloneNode(true));}
   page.push(block);if(figure)flush();
  }
  flush();
  pages.forEach((blocks,i)=>{const div=document.createElement('div');div.className='hb-upload-reading';div.append(...blocks);output.push({...screen,title:screen.title+(pages.length>1?' · '+(i+1)+'/'+pages.length:''),html:div.outerHTML});});
 }
 measure.remove();return output;
}
function masterPages(frame){
 const form=frame.querySelector('#ymq');if(!form||form.dataset.paged)return;form.dataset.paged='true';
 const groups=[...form.querySelectorAll('.rq')];let index=0;
 const nav=document.createElement('div');nav.className='hb-concept-pages';
 const prev=document.createElement('button'),next=document.createElement('button'),label=document.createElement('span');
 for(const b of [prev,next]){b.type='button';b.className='btn';}
 prev.textContent='← Previous question';next.textContent='Next question →';nav.append(prev,label,next);form.after(nav);
 const paint=()=>{groups.forEach((g,i)=>g.hidden=i!==index);prev.disabled=index===0;next.hidden=index===groups.length-1;label.textContent='Question '+(index+1)+' of '+groups.length;frame.querySelector('#ymCheck').hidden=index!==groups.length-1;};
 prev.onclick=()=>{index--;paint();};next.onclick=()=>{index++;paint();};paint();
}
})(window);
