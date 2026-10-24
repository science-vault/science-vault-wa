import {watchQuest} from './vault-quest-progress.mjs';
import {questStats} from './learning-quest-core.mjs';
const host=document.getElementById('questDashboard');
watchQuest(adapter=>{if(!host)return;if(!adapter){host.replaceChildren();return;}const x=questStats(adapter.value);host.innerHTML='<section class="mini-quest" aria-label="Learning Quest progress"><div><span class="feature-kicker">YOUR LEARNING QUEST</span><h2>Your next chapter is waiting.</h2><p>Level '+x.level+' · '+x.xp+' Quest XP · '+x.chapters+' / 6 realms restored</p><p>Lessons, questions and lab discoveries all move your adventure forward.</p></div><a class="quest-btn" href="learning-quest.html">Continue the story →</a></section>';});

if(location.pathname.endsWith('student-quiz.html')){
 const toast=document.createElement('div');toast.setAttribute('role','status');toast.style.cssText='position:fixed;bottom:22px;right:22px;max-width:320px;background:#173e35;color:#f3dfac;padding:15px 20px;border-radius:12px;z-index:100;box-shadow:0 8px 30px #102e3533;font:13px/1.6 system-ui,sans-serif;display:none';document.body.append(toast);let timer;
 window.addEventListener('vault-quest-earned',e=>{clearTimeout(timer);toast.textContent='+'+e.detail.xp+' Quest XP · '+(e.detail.manual?'Written response reviewed':'Learning progress recorded');toast.style.display='block';timer=setTimeout(()=>toast.style.display='none',4500);});
}
