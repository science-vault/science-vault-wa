import assert from 'node:assert/strict';
import {freshQuest,recordActivity,questStats,claimGoal,finishBoss,chapterOpen,bossOpen,equipAvatar,BOSSES,CHAPTERS,journeyAchievement,lessonActivityId} from './learning-quest-core.mjs';
import {createQuestStore,questKey} from './learning-quest-store.mjs';
import {LABS,initialValues,assessLab,projectile,logic,catchment} from './interactive-lab-core.mjs';

const s=freshQuest();
assert.equal(recordActivity(s,{kind:'lesson',id:'opened-only',subject:'English',complete:false}),0);
assert.equal(questStats(s).lessons,0,'Opening a lesson is not completion');
assert.equal(recordActivity(s,{kind:'question',id:'one',subject:'Maths',correct:true,manual:true}),4);
assert.equal(questStats(s).correct,0,'A self-reviewed answer must not count as checked accuracy');
assert.equal(recordActivity(s,{kind:'question',id:'one',subject:'Maths',correct:true,manual:true}),0,'Repeats must not farm XP');
assert.equal(recordActivity(s,{kind:'question',id:'one',subject:'Maths',correct:true,manual:false}),10,'Improvement earns only the accuracy bonus');
assert.equal(recordActivity(s,{kind:'question',id:'one',subject:'Maths',correct:false,manual:false}),0);
assert.equal(questStats(s).correct,1,'A later error does not erase previously demonstrated mastery');
assert.equal(claimGoal(s,0,0),false,'Unmet milestones cannot be claimed');
assert.equal(equipAvatar(s,'champion'),false,'Locked rewards cannot be equipped');
assert.equal(chapterOpen(s,1),false);
assert.equal(finishBoss(s,0,BOSSES[0].map(q=>q.answer)),false,'Boss challenge needs earned milestones');

const complete=freshQuest();
for(let n=0;n<60;n++)recordActivity(complete,{kind:'question',id:'q'+n,subject:'Maths',correct:n<8});
for(let n=0;n<5;n++)recordActivity(complete,{kind:'lesson',id:'l'+n,subject:'English',complete:true});
for(let n=0;n<8;n++)recordActivity(complete,{kind:'lab',id:'lab'+n,subject:['Maths','English','Science','Humanities','Business','Computing'][n%6],complete:true});
for(let n=0;n<6;n++){
 assert.equal(chapterOpen(complete,n),true);
 for(let g=0;g<3;g++){assert.equal(claimGoal(complete,n,g),true);assert.equal(claimGoal(complete,n,g),false);}
 assert.equal(bossOpen(complete,n),true);
 assert.equal(finishBoss(complete,n,[-1,-1,-1]),false,'Wrong answers cannot restore a realm');
 assert.equal(finishBoss(complete,n,BOSSES[n].map(q=>q.answer)),true);
 assert.equal(finishBoss(complete,n,BOSSES[n].map(q=>q.answer)),false,'Boss rewards are one-off');
}
assert.equal(questStats(complete).xp,1940);
assert.equal(equipAvatar(complete,'champion'),true);
assert.equal(complete.chapters.length,CHAPTERS.length);
const savedLesson=journeyAchievement(['Physics ATAR',12,'Unit 3','projectiles'],{version:1,total:2,completed:[0,1],masterPassed:true});
assert.equal(savedLesson.id,lessonActivityId('Physics',12,'Unit 3','projectiles'),'Saved journey keys must match live lesson events');
assert.equal(journeyAchievement(['Physics ATAR',12,'Unit 3','projectiles'],{version:1,total:2,completed:[0],masterPassed:false}),null);
assert(journeyAchievement(['English ATAR',11,'Unit 1','evidence'],{version:1,total:5,completed:[],completedOnce:true}),'Retaking a previously completed lesson must retain its achievement');
const history=freshQuest();recordActivity(history,savedLesson);recordActivity(history,{...savedLesson,id:lessonActivityId('Physics',12,'Unit 3','projectiles')});recordActivity(history,journeyAchievement(['English',11,'Unit 1','evidence'],{version:1,total:1,completed:[0],masterPassed:true}));assert.equal(questStats(history).lessons,2);

const map=new Map(),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
const alice=createQuestStore(storage,'alice'),bob=createQuestStore(storage,'bob');alice.record({kind:'lab',id:'linear',subject:'Maths',complete:true});
assert.equal(questStats(bob.value).labs,0,'Different accounts must not share achievements');
assert.equal(questStats(createQuestStore(storage,'alice').value).labs,1,'Progress survives reload');
const secondTab=createQuestStore(storage,'alice');secondTab.record({kind:'question',id:'different',subject:'Science',correct:true});alice.refresh();assert.equal(questStats(alice.value).questions,1);
assert.equal(storage.getItem(questKey('bob')),null);
const unavailable=createQuestStore({getItem:()=>null,setItem:()=>{throw Error('Quota exceeded');}},'offline');unavailable.record({kind:'lab',id:'logic',subject:'Computing',complete:true});assert.equal(unavailable.saved,false);assert.equal(questStats(unavailable.value).labs,1);

const fixtures={linear:{m:2,c:3},area:{length:6,width:5},projectile:{speed:20,angle:30},circuit:{voltage:12,resistance:6},paragraph:{claim:0,evidence:1,reasoning:2},catchment:{rain:60,forest:80},business:{fixed:120,cost:4,price:10},logic:{gate:'XOR',a:true,b:false}};
for(const lab of LABS){
 const values=fixtures[lab.id],answer=lab.fields.length?lab.expected(values):'';
 assert(assessLab(lab,values,answer,lab.reason[2],2).passed,lab.id+' needs a solvable challenge');
 assert.equal(assessLab(lab,values,answer,lab.reason[2],1).passed,false,lab.id+' requires recorded evidence');
 assert.equal(assessLab(lab,values,answer,null,2).passed,false,'An explanation must be selected');
 if(lab.fields.length)assert.equal(assessLab(lab,values,'',lab.reason[2],2).passed,false,'Blank numeric answers must not count as zero');
 assert.equal(Object.keys(initialValues(lab)).length>0,true);
}
assert(Math.abs(projectile({angle:45,speed:20}).range-400/9.8)<1e-8);
assert.equal(logic({gate:'AND',a:true,b:false}),false);assert.equal(logic({gate:'XOR',a:true,b:true}),false);
assert(catchment({rain:60,forest:80}).runoff<catchment({rain:60,forest:20}).runoff);
console.log('Passed: reward deduplication, manual/automatic scoring, all six chapter locks and boss rewards, account isolation, reloads, storage failures and all eight lab challenges.');
