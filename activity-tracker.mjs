import {db,observeAccess,getAccessState} from './access-client.mjs?v=2026.10.9-classes';
import {doc,collection,writeBatch,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
let uid='',sessionId=crypto.randomUUID(),lastInteraction=Date.now(),lastLesson='',lastHeartbeat=0;
const page=()=>location.pathname.split('/').pop()||'index.html';
const allowed=state=>state.ready&&state.user&&!state.error;
function userData(state){return{displayName:String(state.member?.displayName||'User').slice(0,60),role:state.member?.role||'user',lastSignInMs:Math.max(0,Date.parse(state.user.metadata?.lastSignInTime)||0),lastSeenAt:serverTimestamp(),page:page().slice(0,160)}}
async function record(kind,lesson={}){
 const state=getAccessState();if(!allowed(state))return;
 const batch=writeBatch(db);batch.set(doc(db,'activityUsers',state.user.uid),userData(state));batch.set(doc(collection(db,'activityEvents')),{
 uid:state.user.uid,sessionId,kind,page:page().slice(0,160),title:document.title.slice(0,180),lessonId:String(lesson.id||'').slice(0,160),lessonTitle:String(lesson.title||'').slice(0,180),course:String(document.getElementById('course')?.value||'').slice(0,120),yearGroup:String(document.getElementById('year')?.value||'').slice(0,2),createdAt:serverTimestamp()
 });try{await batch.commit()}catch(error){console.debug('Activity tracking unavailable',error.code||'offline')}
}
function lessonViewed(){const lesson=window.vaultCurrentTopic;if(!lesson?.id||document.visibilityState!=='visible')return;const key=[document.getElementById('course')?.value,document.getElementById('year')?.value,lesson.id].join('|');if(key===lastLesson)return;lastLesson=key;record('lesson_view',lesson)}
observeAccess(state=>{if(!allowed(state)){uid='';lastLesson='';return}if(uid===state.user.uid)return;uid=state.user.uid;sessionId=crypto.randomUUID();record('page_view');lessonViewed()});
for(const event of ['vault-lesson-opened','vault-hub-ready'])window.addEventListener(event,lessonViewed);
for(const event of ['pointerdown','keydown','scroll'])document.addEventListener(event,()=>{lastInteraction=Date.now()},{passive:true});
setInterval(()=>{const state=getAccessState(),now=Date.now();if(!allowed(state)||document.visibilityState!=='visible'||!document.hasFocus()||now-lastInteraction>120000||now-lastHeartbeat<60000)return;lastHeartbeat=now;setDoc(doc(db,'activityUsers',state.user.uid),userData(state)).catch(()=>{})},60000);
