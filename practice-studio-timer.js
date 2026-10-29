/* Suggested question time: one minute per mark. No automatic submission. */
(function(){'use strict';
 const modal=$('modal'),host=document.createElement('div'),label=document.createElement('span'),clock=document.createElement('span'),pause=document.createElement('button'),notice=document.createElement('span');
 host.className='studio-question-timer';host.setAttribute('aria-label','Question timer');clock.setAttribute('role','timer');clock.setAttribute('aria-live','off');pause.type='button';pause.className='textbtn';notice.className='studio-timer-notice';notice.setAttribute('role','status');host.append(label,clock,pause,notice);document.querySelector('.studio-question-tools').after(host);
 const sessions=new Map();let active=null,stamp=0,sequence=0;
 const now=()=>performance.now();
 const key=id=>questions[id]?.[7]?.id||'studio-sample-'+id;
 const isReview=()=>document.querySelector('.studio-review-note')?.hidden===false;
 function settle(){if(!active)return;const t=now();if(stamp)active.remaining=Math.max(0,active.remaining-(t-stamp));stamp=0;if(checked)active.done=true;}
 function paint(){if(!active){host.hidden=true;return;}host.hidden=false;const review=isReview(),seconds=Math.ceil(active.remaining/1000);clock.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');label.textContent=active.marks+' '+(active.marks===1?'mark':'marks')+' · '+active.marks+' min';host.classList.toggle('time-up',seconds===0);pause.disabled=review||active.done||seconds===0;pause.textContent=active.paused?'Resume':'Pause';pause.setAttribute('aria-label',active.paused?'Resume question timer':'Pause question timer');const text=review?'Review · timer paused':active.done?'Answer reviewed · timer stopped':seconds===0?'Time’s up — you can keep answering.':active.paused?'Paused':'';if(notice.textContent!==text)notice.textContent=text;}
 function tick(){settle();if(active&&!modal.hidden&&!isReview()&&!active.done&&!active.paused&&active.remaining>0)stamp=now();paint();}
 pause.onclick=()=>{settle();active.paused=!active.paused;tick();};
 window.addEventListener('vault-studio-before-question',()=>{settle();active=null;sequence++;});
 window.addEventListener('vault-studio-question-opened',()=>{const ticket=++sequence,id=current;requestAnimationFrame(()=>requestAnimationFrame(()=>{if(ticket!==sequence||modal.hidden||id!==current)return;const k=key(id),raw=Number(questions[id]?.[7]?.marks),marks=Number.isFinite(raw)&&raw>0?raw:1;let s=sessions.get(k);if(!s||(!isReview()&&!checked&&s.done)){s={marks,remaining:marks*60000,paused:false,done:false};sessions.set(k,s);}active=s;stamp=0;tick();}));});
 window.addEventListener('vault-studio-answer',()=>{queueMicrotask(()=>{settle();if(active)active.done=true;paint();});});
 new MutationObserver(()=>{if(modal.hidden){settle();paint();}}).observe(modal,{attributes:true,attributeFilter:['hidden']});
 setInterval(tick,500);
 const css=document.createElement('style');css.textContent='.studio-question-timer{display:flex;align-items:center;flex-wrap:wrap;gap:12px;padding:10px 14px;background:#f5f2fd;border:1px solid #e4dcf6;border-radius:9px;margin:0 0 18px;color:#65537e;font-size:12px}.studio-question-timer [role=timer]{font-size:20px;font-weight:750;font-variant-numeric:tabular-nums;color:#6848c2}.studio-timer-notice{font-size:11px}.studio-question-timer.time-up{background:#fff5e9;border-color:#f0d0a5}.studio-question-timer.time-up [role=timer]{color:#9a601f}.studio-question-timer [disabled]{opacity:.5;cursor:default}.studio-question-timer[hidden]{display:none}';document.head.append(css);host.hidden=true;
})();
