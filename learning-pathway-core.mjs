export const DAY=86400000;
export const fresh=()=>({version:1,skills:{},session:null});
export const key=q=>q[7]?.id||'studio-sample-'+q.index;
export const skillId=(subject,year,topic)=>JSON.stringify([subject,Number(year),topic]);
export const automatic=q=>q[7]?q[7].markingMode==='automatic':Array.isArray(q[4])&&q[4].length>1&&Number.isInteger(q[5]);
export function candidates(questions,allowed,subject,year){
 return questions.map((q,index)=>({q,index,id:q[7]?.id||'studio-sample-'+index,subject:q[0],year:Number(q[1]),topics:q[7]?.topics?.length?q[7].topics:[q[2]]}))
 .filter(x=>allowed(x.subject,x.year)&&automatic(x.q)&&(!subject||x.subject===subject)&&(!year||x.year===Number(year)));
}
export function clean(raw){
 const out=fresh();if(raw?.version!==1)return out;
 for(const [id,s]of Object.entries(raw.skills||{})){
  if(!s||skillId(s.subject,s.year,s.topic)!==id||!Array.isArray(s.evidence))continue;
  out.skills[id]={...s,evidence:s.evidence.filter(e=>e&&typeof e.question==='string'&&typeof e.correct==='boolean'&&Number.isFinite(e.time)).slice(-80)};
 }
 const r=raw.session;
 if(r&&['diagnostic','recheck','practice'].includes(r.mode)&&Array.isArray(r.entries)&&r.entries.length&&r.entries.length<=12&&Number.isInteger(r.cursor)&&r.cursor>=0&&r.cursor<r.entries.length){
  out.session={...r,answers:r.answers&&typeof r.answers==='object'?r.answers:{}};
 }
 return out;
}
export function diagnostic(pool,now=Date.now(),history={}){
 const used=new Set(),entries=[],topics=[...new Set(pool.flatMap(q=>q.topics))];
 const seen=new Set(Object.values(history).flatMap(s=>(s.evidence||[]).map(e=>e.question)));
 const checked=topic=>Object.values(history).filter(s=>s.topic===topic).reduce((n,s)=>n+(s.evidence?.length||0),0);
 topics.sort((a,b)=>checked(a)-checked(b));
 for(const topic of topics){
  const available=pool.filter(x=>x.topics.includes(topic)&&!used.has(x.id));
  const item=available.find(x=>!seen.has(x.id))||available[0];
  if(!item)continue;
  used.add(item.id);entries.push({question:item.id,subject:item.subject,year:item.year,topic,skill:skillId(item.subject,item.year,topic)});
  if(entries.length===8)break;
 }
 return entries.length?{mode:'diagnostic',entries,cursor:0,answers:{},started:now}:null;
}
export function targeted(pool,skill,mode,now=Date.now()){
 const seen=new Set(skill.evidence.map(e=>e.question));
 const items=pool.filter(x=>x.subject===skill.subject&&x.year===skill.year&&x.topics.includes(skill.topic));
 // Follow-up checks require two different, previously unseen questions.
 const available=mode==='recheck'?items.filter(x=>!seen.has(x.id)):items.filter(x=>!seen.has(x.id)).concat(items.filter(x=>seen.has(x.id)));
 const selected=available.slice(0,mode==='recheck'?2:3);
 if(mode==='recheck'&&(now<skill.due||selected.length<2))return null;
 return selected.length?{mode,entries:selected.map(x=>({question:x.id,subject:x.subject,year:x.year,topic:skill.topic,skill:skillId(skill.subject,skill.year,skill.topic)})),cursor:0,answers:{},started:now}:null;
}
export function record(model,entry,mode,correct,now=Date.now()){
 const s=model.skills[entry.skill]||{subject:entry.subject,year:entry.year,topic:entry.topic,evidence:[],lesson:null,due:now+DAY,secure:false};
 s.evidence.push({question:entry.question,mode,correct:correct===true,time:now});s.evidence=s.evidence.slice(-80);
 if(mode==='diagnostic'){s.baseline=correct===true;s.secure=false;s.due=now+DAY}
 if(!correct){s.secure=false;s.needsReview=true;s.due=now+DAY}
 else if(mode==='practice'){s.needsReview=false;if(!s.secure)s.due=now+DAY}
 model.skills[entry.skill]=s;return s;
}
export function finish(model,now=Date.now()){
 const session=model.session;if(!session)return;
 if(session.mode==='practice'){
  for(const id of new Set(session.entries.map(e=>e.skill))){const s=model.skills[id];if(s&&!s.secure)s.due=now+DAY}
 }
 if(session.mode==='recheck'){
  const ids=[...new Set(session.entries.map(e=>e.skill))];
  for(const id of ids){
   const entries=session.entries.filter(e=>e.skill===id),s=model.skills[id];
   if(!s)continue;
   const correct=entries.length>=2&&entries.every(e=>session.answers[e.question]===true);
   s.secure=correct;s.needsReview=!correct;s.lastCheck=now;s.due=now+(correct?7:1)*DAY;
  }
 }
 model.session=null;
}
export function status(s,now=Date.now()){
 if(s.secure&&s.due>now)return'Secure';
 if(s.due<=now)return'Follow-up due';
 if(s.needsReview||s.baseline===false&&!s.evidence.some(e=>e.mode==='practice'&&e.correct))return'Needs review';
 return'Developing';
}
export function lessonScore(topic,title){
 const text=(topic+'').toLowerCase(),target=String(title).toLowerCase();
 const aliases=[
 [/bond|structure|allotrop|material/,'bonding structure ionic covalent metallic molecular materials'],
 [/atomic|periodic|isotop|electron/,'atomic atom periodic electron isotope'],
 [/calculation|mole|stoichiom/,'mole moles stoichiometry quantities calculations chemical'],
 [/organic|hydrocarbon|fuel/,'organic hydrocarbon fuels carbon alkane alkene'],
 [/energy|enthalpy|rate/,'energy enthalpy reaction rates thermochemistry'],
 [/solution|acid/,'solution solubility acid base concentration'],
 [/cell|metabolis/,'cell cells membrane enzymes metabolism respiration'],
 [/reproduc/,'reproduction reproductive pregnancy fertility'],
 [/genetic|inherit/,'genetic inheritance dna meiosis'],
 [/transport|gas exchange/,'transport circulation blood breathing gas exchange'],
 [/excretion/,'excretion kidney kidneys homeostasis'],
 [/musculo|skeletal/,'muscle skeletal musculoskeletal bones joints'],
 [/motion|force|mechanic/,'motion mechanics force forces momentum'],
 [/electric/,'electricity electrical circuits electrostatic'],
 [/wave/,'wave waves sound light'],
 [/nuclear|radioact/,'nuclear radiation radioactive'],
 [/thermal/,'thermal heat temperature'],
 [/inquiry/,'inquiry investigation scientific experiment measurement']
 ];
 const words=new Set(text.match(/[a-z]{4,}/g)||[]);
 for(const [pattern,terms]of aliases)if(pattern.test(text))terms.split(' ').forEach(w=>words.add(w));
 return [...words].filter(w=>target.includes(w)).length;
}
