const avatarStyles=document.createElement('link');avatarStyles.rel='stylesheet';avatarStyles.href='avatar-customizer.css?v=2026.11.07-crates1';document.head.append(avatarStyles);
import {watchQuest} from './vault-quest-progress.mjs?v=2026.11.07-crates1';
import {questStats,avatarSVG,pendingCrates,profileRibbon,profileStyle} from './learning-quest-core.mjs?v=2026.11.07-crates1';
const host=document.getElementById('questDashboard');
watchQuest(adapter=>{let chip=document.getElementById('studioAvatarChip');if(location.pathname.endsWith('student-quiz.html')){if(!chip){chip=document.createElement('a');chip.id='studioAvatarChip';chip.className='studio-avatar-chip';chip.href='avatar.html';document.querySelector('main>header')?.append(chip);}chip.hidden=!adapter;if(adapter){const stats=questStats(adapter.value);chip.style.background=profileStyle(adapter.value);chip.title=profileRibbon(adapter.value)?.name||'Rewards and collection';chip.innerHTML=avatarSVG(adapter.value.avatar,38,adapter.value.costume)+'<span>My collection · Level '+stats.level+' · '+pendingCrates(adapter.value).length+' crates</span>';}}if(!host)return;if(!adapter){host.replaceChildren();return;}const x=questStats(adapter.value);host.innerHTML='<section class="mini-quest" style="background:'+profileStyle(adapter.value)+'" aria-label="Learning Quest progress"><div class="mini-quest-current">'+avatarSVG(adapter.value.avatar,96,adapter.value.costume)+'<div><span class="feature-kicker">YOUR LEARNING QUEST</span><h2>Your next chapter is waiting.</h2><p>Level '+x.level+' · '+x.xp+' Quest XP · '+x.chapters+' / 6 realms restored</p><p>Lessons, questions and lab discoveries all move your adventure forward.</p><a href="avatar.html">Rewards &amp; crates ('+pendingCrates(adapter.value).length+') →</a></div></div><a class="quest-btn" href="learning-quest.html">Continue the story →</a></section>';});

if(location.pathname.endsWith('student-quiz.html')){
 const toast=document.createElement('div');toast.setAttribute('role','status');toast.style.cssText='position:fixed;bottom:64px;right:22px;max-width:320px;background:#173e35;color:#f3dfac;padding:15px 20px;border-radius:12px;z-index:100;box-shadow:0 8px 30px #102e3533;font:13px/1.6 system-ui,sans-serif;display:none';document.body.append(toast);let timer;
 window.addEventListener('vault-quest-earned',e=>{clearTimeout(timer);toast.textContent='+'+e.detail.xp+' Quest XP · '+(e.detail.manual?'Written response reviewed':'Learning progress recorded');toast.style.display='block';timer=setTimeout(()=>toast.style.display='none',4500);});
}


// Level-up crates are surfaced wherever the shared Quest tracker is loaded.
let knownUid=null,knownLevel=0;
watchQuest(adapter=>{
 if(!adapter){knownUid=null;knownLevel=0;return;}
 const x=questStats(adapter.value);if(knownUid!==adapter.uid){knownUid=adapter.uid;knownLevel=x.level;return;}
 if(x.level<=knownLevel)return;const gained=x.level-knownLevel;knownLevel=x.level;
 let note=document.getElementById('rewardLevelNotice');if(!note){note=document.createElement('div');note.id='rewardLevelNotice';note.className='reward-notice';note.setAttribute('role','status');note.setAttribute('aria-live','polite');document.body.append(note);}
 note.replaceChildren();const close=document.createElement('button');close.type='button';close.setAttribute('aria-label','Dismiss level-up notification');close.textContent='×';close.onclick=()=>note.hidden=true;const text=document.createElement('strong');text.textContent='Level '+x.level+' reached · '+gained+' reward '+(gained===1?'crate':'crates')+' earned!';const link=document.createElement('a');link.href='avatar.html';link.textContent='Open your reward crates →';note.append(close,text,link);note.hidden=false;
});
