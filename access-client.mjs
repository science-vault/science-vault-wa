import {auth,app,onIdTokenChanged} from './firebase-client.mjs?v=2026.10.9-permissions';
import {getFirestore,doc,getDoc,runTransaction,onSnapshot,serverTimestamp,collection,query,orderBy,limit,startAfter,getDocs} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
export const db=getFirestore(app);
export const getAccessState=()=>current;
export function waitForAccess(){return new Promise(resolve=>{let stop;stop=observeAccess(state=>{if(state.ready){resolve(state);queueMicrotask(()=>stop?.())}})})}
const listeners=new Set();let current={ready:false,user:null,member:null,admin:false,error:null},started=false,stopMember,generation=0;
const emit=next=>{current=next;listeners.forEach(fn=>fn(current))};
export function observeAccess(fn){listeners.add(fn);fn(current);if(!started){started=true;onIdTokenChanged(auth,async user=>{
 const ticket=++generation;stopMember?.();stopMember=null;
 emit({ready:!user,user,member:null,admin:false,error:null});if(!user)return;
 try{
  const owner=await getDoc(doc(db,'admins',user.uid));if(ticket!==generation)return;
  const admin=owner.exists()&&owner.data().enabled===true&&user.emailVerified;
  stopMember=onSnapshot(doc(db,'members',user.uid),snapshot=>{if(ticket===generation)emit({ready:true,user,member:snapshot.exists()?snapshot.data():null,admin,error:null})},error=>{if(ticket===generation)emit({ready:true,user,member:null,admin:false,error})});
 }catch(error){if(ticket===generation)emit({ready:true,user,member:null,admin:false,error})}
 },error=>emit({ready:true,user:null,member:null,admin:false,error}))}return()=>listeners.delete(fn)}
export async function registerMember(user,role,options={}){
 const {registrationProblem}=await import('./registration-options.mjs');const problem=registrationProblem(role,options);if(problem)throw Error(problem);
 const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const bytes=crypto.getRandomValues(new Uint8Array(8));const generated=[...bytes].map(x=>alphabet[x%alphabet.length]).join('');
 const target=doc(db,'members',user.uid);
 await runTransaction(db,async tx=>{const existing=await tx.get(target);if(existing.exists()&&existing.data().registrationVersion===2)return;
 const previous=existing.exists()?existing.data():null;const chosenRole=previous?.role||role;
 const classCode=chosenRole==='teacher'?generated:options.classCode||'';
 if(chosenRole==='teacher'){const codeDoc=await tx.get(doc(db,'classes',classCode));if(codeDoc.exists())throw Error('Class code collision. Please try registration again.');}
 tx.set(target,{email:user.email||'',displayName:String(user.displayName||'').slice(0,60),role:chosenRole,status:'pending',permissions:{},registrationVersion:2,yearGroup:chosenRole==='student'?options.yearGroup:0,subjects:chosenRole==='student'?options.subjects:[],classCode,createdAt:previous?.createdAt||serverTimestamp(),updatedAt:serverTimestamp()});
 if(chosenRole==='teacher')tx.set(doc(db,'classes',classCode),{ownerUid:user.uid,name:'My class',code:classCode,createdAt:serverTimestamp()});
 });
}
export async function loadMembers(cursor){const constraints=[orderBy('createdAt','desc'),limit(25)];if(cursor)constraints.splice(1,0,startAfter(cursor));const snapshot=await getDocs(query(collection(db,'members'),...constraints));return{members:snapshot.docs.map(d=>({uid:d.id,...d.data()})),cursor:snapshot.docs.at(-1),more:snapshot.size===25}}
export async function saveMember(uid,changes,expectedUpdatedAt){
 await runTransaction(db,async tx=>{const target=doc(db,'members',uid),snapshot=await tx.get(target);if(!snapshot.exists())throw Error('This account no longer exists. Refresh the list.');
 const actual=snapshot.data().updatedAt;
 if((actual?.toMillis?.()??null)!==(expectedUpdatedAt?.toMillis?.()??null))throw Error('This account was changed elsewhere. Reload the account before saving.');
 tx.update(target,{...changes,updatedAt:serverTimestamp()});});
 return{uid,...(await getDoc(doc(db,'members',uid))).data()};
}
export function permissionError(error){if(error?.message?.includes('changed elsewhere')||error?.message?.includes('no longer exists'))return error.message;if(error?.code==='permission-denied')return'Access was denied. The site owner needs to publish the Firestore rules, and only the configured admin account can manage approvals.';if(error?.code==='unavailable')return'Could not reach the account database. Check your connection and try again.';return'Account access could not be saved. Check Firebase setup and try again.'}
