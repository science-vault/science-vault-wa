// Device-local learning achievements. Pure functions: no school marks or server claims.
export const freshQuest=()=>({version:1,entries:{},goals:{},chapters:[],avatar:'explorer'});
export function cleanQuest(raw){
 const s=freshQuest();if(raw?.version!==1)return s;
 for(const [id,e] of Object.entries(raw.entries||{}))if(typeof id==='string'&&id.length<500&&e&&['lesson','question','lab'].includes(e.kind))s.entries[id]={kind:e.kind,subject:String(e.subject||'').slice(0,80),correct:e.correct===true,manual:e.manual===true,complete:e.complete===true};
 s.goals=Object.fromEntries(Object.entries(raw.goals||{}).filter(([k,v])=>/^\d-\d$/.test(k)&&v===true));s.chapters=[...new Set((raw.chapters||[]).filter(n=>Number.isInteger(n)&&n>=0&&n<6))].sort();s.avatar=String(raw.avatar||'explorer');return s;
}
export const subjectName=s=>String(s||'').replace(/\s+ATAR$/i,'').trim();
export const lessonActivityId=(subject,year,unit,topic)=>JSON.stringify([subjectName(subject).toLowerCase(),Number(year),String(unit||''),String(topic||'')]);
export function journeyAchievement(identity,journey){
 if(!Array.isArray(identity)||identity.length<4||!identity[0]||!identity[3]||journey?.version!==1||!(journey.total>0))return null;
 if(!(journey.completedOnce===true||journey.masterPassed===true&&journey.completed?.length===journey.total))return null;
 const [subject,year,unit,topic]=identity;return{kind:'lesson',id:lessonActivityId(subject,year,unit,topic),subject,complete:true};
}
export function recordActivity(state,event){
 if(!event||!['lesson','question','lab'].includes(event.kind)||!event.id)return 0;
 const id=event.kind+'|'+String(event.id).slice(0,450),before=questStats(state).xp,old=state.entries[id];
 if(event.kind==='lesson'&&event.complete!==true)return 0;
 if(event.kind==='lab'&&event.complete!==true)return 0;
 const manual=event.manual===true,correct=event.kind==='question'&&!manual&&event.correct===true;
 state.entries[id]={kind:event.kind,subject:subjectName(event.subject),complete:event.complete===true||old?.complete===true,correct:correct||old?.correct===true,manual:manual&&!old?.correct};
 return questStats(state).xp-before;
}
export function questStats(s){const es=Object.values(s.entries||{}),questions=es.filter(e=>e.kind==='question'),lessons=es.filter(e=>e.kind==='lesson'&&e.complete),labs=es.filter(e=>e.kind==='lab'&&e.complete),correct=questions.filter(e=>e.correct&&!e.manual).length,xp=questions.length*4+correct*10+lessons.length*50+labs.length*40+Object.keys(s.goals||{}).length*25+(s.chapters||[]).length*100;return{questions:questions.length,correct,lessons:lessons.length,labs:labs.length,subjects:new Set(es.map(e=>e.subject.toLowerCase()).filter(Boolean)).size,xp,level:1+Math.floor(xp/150),next:150-xp%150,progress:Math.round(xp%150/150*100),chapters:(s.chapters||[]).length};}
const goal=(title,needs,href,action)=>({title,needs,href,action});
export const CHAPTERS=[
 {id:'harbour',name:'First Light Harbour',subtitle:'Bring the lighthouse back to life.',icon:'☀',color:'#e4ac4c',story:'The atlas has lost its light. Run your first investigation and gather enough knowledge to restore the harbour beacon.',goals:[goal('Test an idea',[['labs',1]],'interactive-lab.html','Enter the lab'),goal('Find your footing',[['questions',3],['correct',1]],'student-quiz.html','Answer questions'),goal('Connect two subjects',[['subjects',2]],'interactive-lab.html','Explore another subject')],reward:'Beacon Keeper'},
 {id:'grove',name:'Clockwork Grove',subtitle:'Wake the sleeping mechanisms.',icon:'⚙',color:'#52bfa4',story:'The grove’s machines have stopped. Learn a new idea, experiment with the controls and use what you discover to restart the clockwork forest.',goals:[goal('Learn the mechanism',[['lessons',1]],'topic-hub.html','Complete a lesson'),goal('Investigate twice',[['labs',2]],'interactive-lab.html','Try another lab'),goal('Build your toolkit',[['questions',8],['correct',2]],'student-quiz.html','Keep practising')],reward:'Grove Engineer'},
 {id:'library',name:'Inkspire Library',subtitle:'Recover the missing pages.',icon:'✒',color:'#ac92d7',story:'The library’s pages are scattered across disciplines. Gather ideas from different subjects and rebuild a story supported by evidence.',goals:[goal('Recover two lessons',[['lessons',2]],'topic-hub.html','Explore lessons'),goal('Investigate broadly',[['labs',3],['subjects',3]],'interactive-lab.html','Explore the collection'),goal('Read between the lines',[['questions',15],['correct',3]],'student-quiz.html','Practise carefully')],reward:'Inkspire Scholar'},
 {id:'river',name:'The Riverlands',subtitle:'Restore balance to the valley.',icon:'≈',color:'#70b7d3',story:'The riverlands need a plan that balances people, costs and the environment. Test your assumptions before choosing a route through the valley.',goals:[goal('Map the ideas',[['lessons',3]],'topic-hub.html','Complete another lesson'),goal('Find new perspectives',[['labs',4],['subjects',4]],'interactive-lab.html','Investigate another subject'),goal('Strengthen your reasoning',[['questions',25],['correct',4]],'student-quiz.html','Build understanding')],reward:'Riverland Guardian'},
 {id:'exchange',name:'Skyward Exchange',subtitle:'Power a city above the clouds.',icon:'◇',color:'#ed9975',story:'An airborne city needs energy, a workable budget and clear communication. Bring your learning together to keep the skyward exchange moving.',goals:[goal('Plan your next move',[['lessons',4]],'topic-hub.html','Follow a lesson'),goal('Build six discoveries',[['labs',6]],'interactive-lab.html','Complete lab challenges'),goal('Make it count',[['questions',40],['correct',6]],'student-quiz.html','Practise with purpose')],reward:'Skyward Navigator'},
 {id:'citadel',name:'Citadel of Connections',subtitle:'Restore the atlas.',icon:'✦',color:'#d6b758',story:'Every realm holds part of the answer. Show what you have learnt across subjects, then face the final challenge to restore the atlas.',goals:[goal('Bring your lessons together',[['lessons',5]],'topic-hub.html','Complete five lessons'),goal('Explore every workshop',[['labs',8],['subjects',5]],'interactive-lab.html','Finish the lab collection'),goal('Show steady mastery',[['questions',60],['correct',8]],'student-quiz.html','Reach the practice milestone')],reward:'Atlas Champion'}
];
export function chapterOpen(s,n){return n===0||s.chapters.includes(n-1);}
export function goalProgress(s,n,g){const x=questStats(s),item=CHAPTERS[n]?.goals[g];if(!item)return{ready:false,ratio:0,lines:[]};return{ready:item.needs.every(([k,v])=>x[k]>=v),ratio:Math.min(...item.needs.map(([k,v])=>Math.min(1,x[k]/v))),lines:item.needs.map(([k,v])=>({kind:k,value:Math.min(x[k],v),target:v}))};}
export function claimGoal(s,n,g){const key=n+'-'+g;if(!chapterOpen(s,n)||s.goals[key]||!goalProgress(s,n,g).ready)return false;s.goals[key]=true;return true;}
export const bossOpen=(s,n)=>chapterOpen(s,n)&&CHAPTERS[n]?.goals.every((_,g)=>s.goals[n+'-'+g]);
export const BOSSES=[
 [
  {q:'The beacon flashes every 6 seconds. How many flashes occur in 1 minute, starting after the first 6 seconds?',options:['6','10','12'],answer:1,why:'60 ÷ 6 = 10 flashes.'},
  {q:'Which sentence gives evidence for a claim that the harbour is busy?',options:['The harbour is wonderful.','I like the harbour.','Eighty boats arrived yesterday.'],answer:2,why:'A recorded number of arrivals provides specific evidence.'},
  {q:'A fair six-sided die has three even numbers. What is the probability of rolling an even number?',options:['1/2','1/3','1/6'],answer:0,why:'Three of the six equally likely outcomes are even: 3/6 = 1/2.'}
 ],
 [
  {q:'A machine uses the rule y = 3x + 2. What output does x = 4 produce?',options:['9','14','20'],answer:1,why:'3 × 4 + 2 = 14.'},
  {q:'A circuit has a potential difference of 12 V and resistance of 6 Ω. What is the current?',options:['2 A','6 A','72 A'],answer:0,why:'I = V/R = 12/6 = 2 A.'},
  {q:'An AND gate receives TRUE and FALSE. What is its output?',options:['TRUE','It alternates','FALSE'],answer:2,why:'AND is true only when both inputs are true.'}
 ],
 [
  {q:'Which connective best shows a contrast?',options:['Therefore','However','Furthermore'],answer:1,why:'“However” signals a contrast between ideas.'},
  {q:'A library lends 24 books on Monday and 36 on Tuesday. What is the mean number per day?',options:['12','30','60'],answer:1,why:'The mean is (24 + 36)/2 = 30.'},
  {q:'Two sources disagree about an event. What is the strongest next step?',options:['Choose the longer source','Ignore both sources','Compare their evidence, purpose and origin'],answer:2,why:'Evaluating origin, purpose and supporting evidence helps assess conflicting accounts.'}
 ],
 [
  {q:'A rectangular reserve measures 8 m by 5 m. What is its area?',options:['26 m²','40 m²','13 m²'],answer:1,why:'Area = length × width = 8 × 5 = 40 m².'},
  {q:'Why might more forest cover reduce surface runoff in a simplified catchment model?',options:['Roots and soil can help water infiltrate','Trees stop all rainfall','Forests remove gravity'],answer:0,why:'Vegetation and soil structure can help more water enter the ground. The amount depends on local conditions.'},
  {q:'A council has $600 and spends $175, then $225. What remains?',options:['$250','$200','$400'],answer:1,why:'600 − 175 − 225 = 200.'}
 ],
 [
  {q:'A stall has fixed costs of $120 and contributes $6 per sale after variable costs. How many sales cover fixed costs?',options:['6','20','120'],answer:1,why:'Break-even quantity = 120/6 = 20.'},
  {q:'Which sentence is most suitable for a formal proposal?',options:['This plan could reduce costs by 15%.','This is, like, a cool idea.','Trust me, everyone loves it.'],answer:0,why:'The sentence uses formal language and a specific, testable claim.'},
  {q:'Which action makes a test of a new model more useful?',options:['Change everything at once','Choose only results you like','Change one input while keeping the others fixed'],answer:2,why:'Controlling other variables makes it easier to identify the effect of the changed input.'}
 ],
 [
  {q:'An object travels 150 m in 10 s at a steady speed. What is its speed?',options:['15 m/s','1.5 m/s','1500 m/s'],answer:0,why:'Speed = distance/time = 150/10 = 15 m/s.'},
  {q:'Why should a conclusion acknowledge the limits of a simulation?',options:['Models are always wrong','A model uses assumptions and represents only part of reality','It makes the conclusion longer'],answer:1,why:'A model simplifies a situation. Stating its assumptions helps explain what the result can support.'},
  {q:'A town needs both more housing and green space. What is the best first step?',options:['Build as much housing as possible','Remove every park','Compare several plans against both needs and the available budget'],answer:2,why:'A good decision compares alternatives and recognises constraints and competing needs.'}
 ]
];
export function finishBoss(s,n,answers){if(!bossOpen(s,n)||s.chapters.includes(n)||!Array.isArray(answers)||answers.length!==BOSSES[n].length)return false;if(!BOSSES[n].every((q,i)=>answers[i]===q.answer))return false;s.chapters.push(n);s.chapters.sort();return true;}
export const AVATARS=[
 {id:'explorer',name:'Trail Explorer',color:'#d5ac6b',hat:'cap',rule:()=>true,label:'Your starting companion'},
 {id:'maker',name:'Curious Maker',color:'#58b7ad',hat:'goggles',rule:()=>true,label:'Your starting companion'},
 {id:'scribe',name:'Story Weaver',color:'#aa8bc6',hat:'beret',rule:x=>x.subjects>=2,label:'Explore two subjects'},
 {id:'keeper',name:'Beacon Keeper',color:'#eac765',hat:'crown',rule:x=>x.chapters>=1,label:'Restore First Light Harbour'},
 {id:'engineer',name:'Grove Engineer',color:'#70b68b',hat:'goggles',rule:x=>x.chapters>=2,label:'Restore Clockwork Grove'},
 {id:'scholar',name:'Inkspire Scholar',color:'#b39ce3',hat:'wizard',rule:x=>x.chapters>=3,label:'Restore Inkspire Library'},
 {id:'guardian',name:'River Guardian',color:'#78bedc',hat:'hood',rule:x=>x.chapters>=4,label:'Restore the Riverlands'},
 {id:'navigator',name:'Sky Navigator',color:'#e5a68a',hat:'cap',rule:x=>x.chapters>=5,label:'Restore Skyward Exchange'},
 {id:'champion',name:'Atlas Champion',color:'#e7cb77',hat:'crown',rule:x=>x.chapters>=6,label:'Complete the full story'}
];
export const RIBBONS=[
 {id:'first-lab',name:'First Discovery',icon:'⌁',rule:x=>x.labs>=1,desc:'Complete your first lab challenge'},
 {id:'lesson-five',name:'Lesson Trailblazer',icon:'▤',rule:x=>x.lessons>=5,desc:'Complete five different lessons'},
 {id:'question-ten',name:'Practice Pathfinder',icon:'✎',rule:x=>x.questions>=10,desc:'Answer ten different questions'},
 {id:'mastery-ten',name:'Careful Thinker',icon:'✓',rule:x=>x.correct>=10,desc:'Get ten different automatically checked questions correct'},
 {id:'subjects-four',name:'Bridge Builder',icon:'⌘',rule:x=>x.subjects>=4,desc:'Explore four different subjects'},
 {id:'lab-eight',name:'Lab Adventurer',icon:'⚙',rule:x=>x.labs>=8,desc:'Complete all eight launch labs'},
 {id:'question-hundred',name:'Century Explorer',icon:'100',rule:x=>x.questions>=100,desc:'Answer one hundred different questions'},
 {id:'atlas',name:'Keeper of the Atlas',icon:'✦',rule:x=>x.chapters>=6,desc:'Restore all six realms'}
];
export function equipAvatar(s,id){const avatar=AVATARS.find(a=>a.id===id);if(!avatar?.rule(questStats(s)))return false;s.avatar=id;return true;}
export function avatarSVG(id,size=120){const a=AVATARS.find(a=>a.id===id)||AVATARS[0];const hat=a.hat==='crown'?'<path d="M32 43L27 22L44 32L60 15L76 32L93 22L87 43Z" fill="#ffe09b" stroke="#b88939" stroke-width="3"/>':a.hat==='wizard'?'<path d="M26 43L59 8L84 43Z" fill="'+a.color+'"/><path d="M23 43H93" stroke="#e9d5a6" stroke-width="9"/>':a.hat==='beret'?'<ellipse cx="61" cy="32" rx="35" ry="17" fill="'+a.color+'"/><path d="M62 14l3-9" stroke="#213747" stroke-width="4"/>':a.hat==='hood'?'<path d="M26 72V47Q27 12 60 12Q94 12 94 47V72" fill="'+a.color+'"/>':a.hat==='cap'?'<path d="M27 42Q30 10 65 15Q86 16 88 42Z" fill="'+a.color+'"/><path d="M28 42H96" stroke="#233e4d" stroke-width="8"/>':'';return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 120 120" role="img" aria-label="'+a.name+'"><circle cx="60" cy="60" r="58" fill="'+a.color+'" opacity=".18"/><path d="M20 116Q23 83 60 83Q98 83 101 116" fill="'+a.color+'"/><path d="M49 83V97L60 106L72 97V83" fill="#e5bb96"/>'+hat+'<ellipse cx="60" cy="59" rx="28" ry="32" fill="#f4d4b5"/><path d="M33 52Q28 24 59 25Q88 24 88 52Q79 46 76 36Q53 48 33 46" fill="#35404a"/>'+(a.hat==='goggles'?'<path d="M28 46H93" stroke="'+a.color+'" stroke-width="9"/><circle cx="45" cy="45" r="10" fill="#d9f4ee" stroke="#314b56" stroke-width="4"/><circle cx="76" cy="45" r="10" fill="#d9f4ee" stroke="#314b56" stroke-width="4"/>':'')+'<circle cx="49" cy="61" r="2.5" fill="#273c48"/><circle cx="72" cy="61" r="2.5" fill="#273c48"/><path d="M51 77Q60 83 69 77" fill="none" stroke="#9a624d" stroke-width="3" stroke-linecap="round"/><path d="M60 64l-2 8h5" fill="none" stroke="#cd9c79" stroke-width="2"/></svg>';}
