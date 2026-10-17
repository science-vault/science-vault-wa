/* Full-screen focus mode for existing Science Vault lesson players.
   Presentation-only: preserves lesson journey navigation and progress logic. */
(()=>{'use strict';
const lesson=document.getElementById('lesson'),back=document.getElementById('backTopics');
if(!lesson||!back)return;
const toggle=document.createElement('button');toggle.type='button';toggle.id='vaultFocusToggle';toggle.textContent='⛶ Focus mode';toggle.setAttribute('aria-pressed','false');back.insertAdjacentElement('afterend',toggle);
function setFocus(on){document.body.classList.toggle('vault-focus-mode',on);toggle.setAttribute('aria-pressed',String(on));toggle.textContent=on?'↙ Exit focus mode':'⛶ Focus mode';if(on)lesson.scrollTop=0}
toggle.addEventListener('click',()=>setFocus(!document.body.classList.contains('vault-focus-mode')));
back.addEventListener('click',()=>setFocus(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('vault-focus-mode'))setFocus(false)});
})();
