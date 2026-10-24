import {observeAccess,getAccessState} from './access-client.mjs?v=2026.10.9-classes';
import {createQuestStore,questKey} from './learning-quest-store.mjs';
import {journeyAchievement,lessonActivityId} from './learning-quest-core.mjs';
let active=null,stopStore;const listeners=new Set();let timer;
const normal=s=>String(s||'').replace(/\s+ATAR$/i,'').trim().toLowerCase();
const allowed=a=>!!a?.user&&!a.error&&(a.admin||a.member?.status==='active'&&a.member.registrationVersion===2);
export function currentQuest(){return active;}
export function watchQuest(fn){listeners.add(fn);fn(active);return()=>listeners.delete(fn);}
function announce(){listeners.forEach(fn=>fn(active));window.dispatchEvent(new CustomEvent('vault-quest-updated',{detail:{uid:active?.uid||null}}));}
function record(event){if(active&&getAccessState().user?.uid===active.uid){const xp=active.record(event);if(xp>0)window.dispatchEvent(new CustomEvent('vault-quest-earned',{detail:{uid:active.uid,xp,kind:event.kind,manual:event.manual===true}}));return xp;}return 0;}
function importHistory(){if(!active||getAccessState().user?.uid!==active.uid)return;const uid=active.uid,events=[];
 try{
  const league=JSON.parse(localStorage.getItem('vault-learning-league-v1:'+uid));
  for(const [key,e] of Object.entries(league?.entries||{})){
   if(e.kind==='question')events.push({kind:'question',id:key.replace(/^question\|/,''),subject:e.course,correct:e.correct===true,manual:e.correct!==true});
  }
  const prefix='vault-lesson-journey-v1:'+uid+':';
  for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(!key?.startsWith(prefix))continue;const event=journeyAchievement(JSON.parse(key.slice(prefix.length)),JSON.parse(localStorage.getItem(key)));if(event)events.push(event);}
  if(events.length)active.batch(events);
 }catch{/* Corrupt or unavailable browser history does not prevent new achievements. */}
}
const scanSoon=()=>{clearTimeout(timer);timer=setTimeout(importHistory,120);};
observeAccess(access=>{
 if(!allowed(access)){stopStore?.();stopStore=null;active=null;announce();return;}
 if(active?.uid===access.user.uid)return;
 stopStore?.();try{active=createQuestStore(localStorage,access.user.uid);}catch{const memory=new Map();active=createQuestStore({getItem:k=>memory.get(k)||null,setItem(){throw Error('Storage unavailable');}},access.user.uid);}
 stopStore=active.subscribe(announce);importHistory();
 if(location.pathname.endsWith('learning-quest.html'))import('./lesson-journey-store.mjs?v=2026.10.15-journey1').then(s=>s.list(access.user.uid)).then(()=>{if(active?.uid===access.user.uid)importHistory();}).catch(()=>{});
});
window.addEventListener('storage',e=>{if(active&&e.key===questKey(active.uid))active.refresh();if(active&&e.key==='vault-learning-league-v1:'+active.uid)scanSoon();});
window.addEventListener('vault-journey-updated',scanSoon);window.addEventListener('vault-league-updated',scanSoon);
window.addEventListener('vault-studio-answer',e=>{const a=e.detail;if(!a?.questionId)return;record({kind:'question',id:a.questionId,subject:a.subject,correct:a.correct===true,manual:a.manual===true});});
window.addEventListener('vault-learning-activity',e=>{const a=e.detail;if(!a)return;if(a.kind==='lesson'&&a.completed&&window.vaultCurrentTopic?.id)record({kind:'lesson',id:lessonActivityId(a.course,a.yearGroup,document.getElementById('unit')?.value,window.vaultCurrentTopic.id),subject:a.course,complete:true});
 if(a.kind==='quiz')for(const r of a.responses||[]){if(!r.questionId||!Array.isArray(r.answers)||!r.answers.some(x=>String(x).trim()))continue;record({kind:'question',id:r.questionId,subject:a.course,manual:r.manual===true,correct:!r.manual&&Number(r.max)>0&&Number(r.earned)===Number(r.max)});}
});
