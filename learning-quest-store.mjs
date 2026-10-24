import {freshQuest,cleanQuest,recordActivity,claimGoal,finishBoss,equipAvatar} from './learning-quest-core.mjs';
export const questKey=uid=>'vault-learning-quest-v1:'+uid;
export function createQuestStore(storage,uid){
 if(!uid)throw Error('An account identifier is required.');
 let value=freshQuest(),saved=true;const listeners=new Set();
 function read(){try{value=cleanQuest(JSON.parse(storage.getItem(questKey(uid))));}catch{saved=false;}return value;}
 function emit(){listeners.forEach(fn=>fn(value,saved));}
 function update(fn){if(saved)read();const result=fn(value);try{storage.setItem(questKey(uid),JSON.stringify(value));saved=true;}catch{saved=false;}emit();return result;}
 read();return{uid,get value(){return value;},get saved(){return saved;},refresh(){read();emit();},subscribe(fn){listeners.add(fn);fn(value,saved);return()=>listeners.delete(fn);},record:event=>update(s=>recordActivity(s,event)),batch:events=>update(s=>events.reduce((n,e)=>n+recordActivity(s,e),0)),claim:(n,g)=>update(s=>claimGoal(s,n,g)),boss:(n,a)=>update(s=>finishBoss(s,n,a)),equip:id=>update(s=>equipAvatar(s,id))};
}
