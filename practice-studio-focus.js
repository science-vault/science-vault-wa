/* Fullscreen practice, with a viewport fallback when browser fullscreen is unavailable. */
(function(){
 'use strict';
 const modal=document.getElementById('modal'),toggle=document.getElementById('studioFocusToggle'),hint=document.getElementById('studioFocusHint');
 if(!modal||!toggle)return;
 let focused=false,ownsFullscreen=false,exitedAt=0;
 const previousInert=new Map();
 function sync(){
  document.body.classList.toggle('lv-practice-focus',focused);
  toggle.textContent=focused?'⤡ Exit focus':'⛶ Focus mode';
  toggle.setAttribute('aria-pressed',String(focused));
  toggle.title=focused?'Return to the question window':'Hide distractions and use the full screen';
  hint.hidden=!focused;
 }
 async function enter(){
  if(modal.hidden)return;
  focused=true;sync();
  // Fullscreen must be requested directly from the user's button click.
  if(!document.fullscreenElement&&modal.requestFullscreen){
   try{await modal.requestFullscreen();ownsFullscreen=true}
   catch{/* The full-viewport layout remains available on mobile and embedded browsers. */}
  }
  if(modal.hidden){await leave();return}
  toggle.focus({preventScroll:true});
 }
 async function leave(){
  focused=false;sync();
  if(document.fullscreenElement===modal){try{await document.exitFullscreen()}catch{}}
  ownsFullscreen=false;
  if(!modal.hidden)toggle.focus({preventScroll:true});
 }
 toggle.addEventListener('click',()=>focused?leave():enter());
 document.addEventListener('fullscreenchange',()=>{
  if(document.fullscreenElement===modal){ownsFullscreen=true;focused=true;sync()}
  else if(ownsFullscreen){ownsFullscreen=false;focused=false;exitedAt=Date.now();sync()}
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&(focused||Date.now()-exitedAt<250)&&!modal.hidden){event.preventDefault();event.stopImmediatePropagation();leave()}
 },true);
 function restoreBackground(){
  for(const [element,value] of previousInert)element.inert=value;
  previousInert.clear();
 }
 const previousClose=window.closePlayer;
 if(previousClose)window.closePlayer=function(){
  restoreBackground();
  if(focused||document.fullscreenElement===modal)leave();
  return previousClose.apply(this,arguments);
 };
 function updateDialog(){
  if(modal.hidden){
   if(focused||document.fullscreenElement===modal)leave();
   restoreBackground();
  }else{
   for(const element of document.body.children){
    if(element===modal||['SCRIPT','STYLE','LINK'].includes(element.tagName))continue;
    if(!previousInert.has(element))previousInert.set(element,element.inert);
    element.inert=true;
   }
  }
 }
 new MutationObserver(updateDialog).observe(modal,{attributes:true,attributeFilter:['hidden']});
 // The shared sidebar is created after this script; apply dialog isolation if it is added while open.
 new MutationObserver(()=>{if(!modal.hidden)updateDialog()}).observe(document.body,{childList:true});
 sync();updateDialog();
})();
