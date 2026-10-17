// Pilot bridge to the existing authenticated lesson-journey storage.
// Uses the same identity, merge and Firestore rules as the production players.
import {access,load,saveLocal,saveCloud,fresh} from './lesson-journey-store.mjs?v=2026.10.15-journey1';
const meta={course:'Science',year:10,unit:'Earth and Space Sciences',topic:'pilot-features-universe-v1',title:'Features of the Universe'};
const total=5;
const status=document.getElementById('cloudStatus');
let uid=null,ready=false,queue=Promise.resolve(),lastSaved='';
function announce(message){if(status)status.textContent=message}
function toJourney(p){
 const s=fresh(total),unlocked=Math.max(0,Math.min(total-1,Number(p.unlocked)||0));
 s.completed=Array.from({length:unlocked},(_,i)=>i);
 if(p.answered===true&&!s.completed.includes(3))s.completed.push(3);
 s.index=Math.max(0,Math.min(unlocked,Number(p.index)||0));
 s.started=true;s.updatedMs=Date.now();
 if(p.finished===true&&p.answered===true){s.completed=Array.from({length:total},(_,i)=>i);s.masterPassed=true;s.completedOnce=true;s.index=total}
 return s;
}
function toPreview(s){return{index:Math.min(total-1,s.index),unlocked:Math.min(total-1,s.completed.length),answered:s.completed.includes(3)||s.masterPassed,finished:s.masterPassed}}
try{
 const state=await access;
 if(state.user&&state.member?.status==='active'&&state.member?.role==='student'){
 uid=state.user.uid;
 const remote=await load(uid,meta,total);
 // Cloud/account progress takes precedence; anonymous device progress must not leak between users.
 const combined=remote.state;
 window.ScienceVaultPilot?.restore?.(toPreview(combined));
 window.__pilotJourneyState=combined;
 ready=true;announce(remote.cloud?'Account progress connected.':'Signed in; offline progress is available. Cloud sync will retry.');
 }else announce('Preview progress stays on this device. Sign in with an approved student account to sync.');
}catch(error){announce('Cloud progress unavailable. Local preview still works.');console.warn('Pilot sync unavailable',error)}
window.addEventListener('sv-pilot-progress',event=>{
 if(!uid||!ready)return;
 const next=toJourney(event.detail||{});
 // Preserve attempt history and prior completion when restarting a lesson.
 const prior=window.__pilotJourneyState;
 if(prior){next.attempt=prior.attempt+(event.detail?.reset===true?1:0);next.completedOnce=prior.completedOnce||next.completedOnce;}
 window.__pilotJourneyState=next;
 const signature=JSON.stringify([next.attempt,next.index,next.completed,next.masterPassed]);
 if(signature===lastSaved)return;
 lastSaved=signature;saveLocal(uid,meta,next);
 queue=queue.then(async()=>{try{await saveCloud(uid,meta,next);announce('Progress synced to your account.')}catch(error){announce('Saved on this device. Cloud sync could not complete.');console.warn('Pilot sync failed',error)}})
});
