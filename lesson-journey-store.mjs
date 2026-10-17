import {db,waitForAccess} from './access-client.mjs?v=2026.10.9-classes';
import {doc,collection,getDoc,getDocs,runTransaction,serverTimestamp,setDoc} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import {fresh,clean,merge} from './lesson-journey-core.mjs';
export {fresh,clean,merge};
export const access=waitForAccess();
export const identity=meta=>JSON.stringify([meta.course,meta.year,meta.unit,meta.topic]);
const localKey=(uid,meta)=>'vault-lesson-journey-v1:'+uid+':'+identity(meta);
const hash=async value=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))].map(n=>n.toString(16).padStart(2,'0')).join('');
export function readLocal(uid,meta,total){try{return clean(JSON.parse(localStorage.getItem(localKey(uid,meta))),total)}catch{return fresh(total)}}
export function tileState(uid,meta){try{const raw=JSON.parse(localStorage.getItem(localKey(uid,meta)));return raw?.total?clean(raw,raw.total):null}catch{return null}}
export function saveLocal(uid,meta,state){try{localStorage.setItem(localKey(uid,meta),JSON.stringify(state));return true}catch{return false}}
export async function load(uid,meta,total){const local=readLocal(uid,meta,total);try{const ref=doc(db,'members',uid,'lessonJourneys',await hash(identity(meta))),snap=await getDoc(ref);if(!snap.exists())return{state:local,cloud:true};const combined=merge(local,clean(snap.data(),total));saveLocal(uid,meta,combined);return{state:combined,cloud:true}}catch{return{state:local,cloud:false}}}
export async function saveCloud(uid,meta,state){const ref=doc(db,'members',uid,'lessonJourneys',await hash(identity(meta)));await runTransaction(db,async tx=>{const snap=await tx.get(ref),combined=snap.exists()?merge(state,clean(snap.data(),state.total)):state;tx.set(ref,{...combined,course:meta.course,year:meta.year,unit:meta.unit,topic:meta.topic,title:meta.title,updatedAt:serverTimestamp()})})}
export async function list(uid){try{const snap=await getDocs(collection(db,'members',uid,'lessonJourneys'));for(const d of snap.docs){const x=d.data();if(x.topic&&x.total)saveLocal(uid,x,merge(readLocal(uid,x,x.total),clean(x,x.total)))}return true}catch{return false}}

export async function shareClassSummary(uid,meta,state){
 const access=await waitForAccess();
 if(!access.user||access.user.uid!==uid||access.member?.role!=='student'||access.member?.status!=='active'||access.member.yearGroup!==meta.year)return false;
 const memberships=await getDocs(collection(db,'members',uid,'enrollments'));
 if(memberships.empty)return false;
 const id=await hash(uid+':'+identity(meta));
 const summary={studentUid:uid,title:String(meta.title||meta.topic).slice(0,180),course:meta.course,year:meta.year,unit:meta.unit,topic:meta.topic,completed:state.completed.length,total:state.total,completedOnce:!!state.completedOnce,updatedAt:serverTimestamp()};
 const outcomes=await Promise.allSettled(memberships.docs.map(m=>setDoc(doc(db,'classes',m.id,'lessonSummaries',id),summary)));
 return outcomes.some(o=>o.status==='fulfilled');
}
