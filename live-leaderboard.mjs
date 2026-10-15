import {db,waitForAccess,getAccessState} from './access-client.mjs?v=2026.10.9-classes';
import {myClasses} from './class-client.mjs?v=2026.10.14-league1';
import {league} from './learning-league-core.mjs?v=2026.10.14-league1';
import {collection,doc,onSnapshot,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

// Learning League is a participation score, separate from assessed school marks.
let pending,timer,roomsPromise,shownError=false;
const roomsFor=state=>roomsPromise||(roomsPromise=myClasses(state).catch(e=>{roomsPromise=null;throw e}));
export function publishLeague(summary){
 pending=summary;clearTimeout(timer);timer=setTimeout(flush,700);
}
async function flush(){
 const state=getAccessState(),value=pending;
 if(!state.user||state.member?.role!=='student'||state.member.status!=='active'||!value)return;
 const uid=state.user.uid,xp=Math.max(0,Math.min(10000000,Math.floor(value.xp)));
 try{const rooms=await roomsFor(state);if(getAccessState().user?.uid!==uid)return;
 await Promise.all(rooms.map(room=>runTransaction(db,async tx=>{const ref=doc(db,'classes',room.code,'leaderboard',uid),old=await tx.get(ref);if(old.exists()&&old.data().xp>=xp)return;tx.set(ref,{
 displayName:state.member.displayName,xp,level:league(xp).level,updatedAt:serverTimestamp()
 })})));window.dispatchEvent(new Event('vault-leaderboard-synced'));
 }catch(error){if(!shownError){shownError=true;console.warn('Leaderboard sync unavailable',error)}window.dispatchEvent(new CustomEvent('vault-leaderboard-error',{detail:error.code||'unavailable'}));}
}
const el=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node};
async function mount(){
 const state=await waitForAccess();if(state.member?.status!=='active'||!['student','teacher'].includes(state.member.role))return;
 const host=el('section');host.className='live-leaderboard';host.setAttribute('aria-label','Live class leaderboard');
 const title=el('h2','Live leaderboard'),intro=el('p','Earn Learning League points to climb the levels. Class participation rankings are separate from school marks.'),controls=el('div'),classes=el('select'),sort=el('select'),status=el('p','Loading your classes…'),table=el('table'),body=el('tbody'),scroll=el('div');
 classes.setAttribute('aria-label','Leaderboard class');sort.setAttribute('aria-label','Rank by');for(const [value,label]of [['xp','Points'],['level','Level']]){const option=el('option',label);option.value=value;sort.append(option)}
 controls.className='leaderboard-controls';controls.append(classes,sort);status.setAttribute('role','status');const head=el('thead'),tr=el('tr');for(const label of ['Rank','Student','Points','Level','League']){const th=el('th',label);th.scope='col';tr.append(th)}head.append(tr);table.append(head,body);scroll.className='leaderboard-scroll';scroll.append(table);host.append(title,intro,controls,status,scroll);
 const target=document.getElementById('leagueMount');if(target)target.after(host);else document.querySelector('main')?.append(host);
 let stop=()=>{},rows=[];
 function render(){body.replaceChildren();const sorted=[...rows].sort((a,b)=>(sort.value==='level'?b.level-a.level:0)||b.xp-a.xp||a.displayName.localeCompare(b.displayName)||a.uid.localeCompare(b.uid));let rank=0;
 sorted.forEach((row,i)=>{if(!i||row.xp!==sorted[i-1].xp)rank=i+1;const tr=el('tr');if(row.uid===state.user.uid)tr.className='leaderboard-self';for(const text of [rank,row.displayName+(row.uid===state.user.uid?' (you)':''),row.xp.toLocaleString(),row.level,league(row.xp).label])tr.append(el('td',text));body.append(tr)});
 status.textContent=rows.length?'Live · '+rows.length+' students · Updates automatically':'No points recorded yet. Complete a lesson or practise questions to join the leaderboard.';
 }
 function watch(){stop();rows=[];body.replaceChildren();status.textContent='Connecting to live standings…';stop=onSnapshot(collection(db,'classes',classes.value,'leaderboard'),snapshot=>{rows=snapshot.docs.map(d=>{const x=d.data(),xp=Number.isFinite(x.xp)?Math.max(0,x.xp):0;return{uid:d.id,displayName:String(x.displayName||'Student'),xp,level:league(xp).level}});render()},error=>{body.replaceChildren();status.textContent=error.code==='permission-denied'?'Live leaderboard needs the latest Firestore rules published by the site owner.':'Live standings could not connect. Change class to reconnect.'})}
 try{const rooms=await roomsFor(state);for(const room of rooms){const option=el('option',room.name+' · '+room.code);option.value=room.code;classes.append(option)}if(!rooms.length){classes.disabled=true;sort.disabled=true;status.textContent=state.member.role==='student'?'Join a class to see its live leaderboard.':'Create a class to see its live leaderboard.';return}classes.onchange=watch;sort.onchange=render;watch();window.addEventListener('pagehide',()=>stop(),{once:true})}catch{status.textContent='Classes could not load. Refresh to try again.'}
}
if(/(?:student-area|teacher-classes)\.html$/.test(location.pathname))mount().catch(error=>console.warn('Leaderboard unavailable',error));
