/* Diagnostic -> lessons -> targeted practice -> delayed checks, using existing Studio questions. */
(async()=>{
 'use strict';
 const [core,store,client]=await Promise.all([import('./learning-pathway-core.mjs?v=1'),import('./learning-pathway-store.mjs?v=1'),import('./access-client.mjs?v=2026.10.9-classes')]);
 const host=document.createElement('section');host.className='learning-pathway';host.id='learning-pathway';
 const el=(tag,text,className)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n};
 host.append(el('span','YOUR LEARNING PATHWAY','pathway-kicker'),el('h2','Find your gaps. Build your next step.'),el('p','Take a short diagnostic, revisit a relevant lesson, practise the skill and check it again later.'));
 const toolbar=el('div',undefined,'pathway-toolbar'),subject=el('select'),year=el('select'),start=el('button','Start diagnostic','pathway-action main'),resume=el('button','Resume session','pathway-action'),end=el('button','End session','pathway-action');
 subject.setAttribute('aria-label','Diagnostic subject');year.setAttribute('aria-label','Diagnostic year');
 for(const [name,input]of [['Subject',subject],['Year',year]]){const label=el('label',name);label.append(input);toolbar.append(label)}
 toolbar.append(start,resume,end);const message=el('p');message.setAttribute('role','status');
 const map=el('div',undefined,'pathway-map');host.append(toolbar,message,map,el('p','Mastery uses automatically checked questions, not written self-reviews. Pathway progress is saved for your account in this browser.','pathway-note'));
 document.querySelector('.stats').after(host);
 let access=null,uid=null,model=core.fresh(),running=false,opening=false,saveError=false,notice='',subjectTouched=false;
 const allowed=(s,y)=>!!uid&&!!window.studioCanStudy?.(s,y);
 const pool=()=>physicsLoaded?core.candidates(questions,allowed):[];
 const find=id=>pool().find(x=>x.id===id);
 function commit(){saveError=!store.save(uid,model);return !saveError}
 function options(input,values,defaultValue){
  const chosen=input.value;input.replaceChildren(...values.map(v=>{const o=el('option',String(v));o.value=String(v);return o}));
  input.value=values.map(String).includes(chosen)?chosen:values.map(String).includes(String(defaultValue))?String(defaultValue):String(values[0]??'');
 }
 function launch(mode,skill){
  if(!uid||running)return;
  if(model.session){notice='Resume or end your current session before starting another.';paint();return}
  const available=core.candidates(questions,allowed,subject.value,Number(year.value));
  const session=mode==='diagnostic'?core.diagnostic(available,Date.now(),model.skills):core.targeted(pool(),skill,mode);
  if(!session){notice=mode==='recheck'?'A follow-up needs two fresh automatically marked questions and a full day since the learning session.':'No automatically marked questions match this subject and year yet.';paint();return}
  model.session=session;notice='';if(!commit()){paint();return}running=true;showEntry();
 }
 async function showEntry(){
  const session=model.session;if(!session)return;
  const entry=session.entries[session.cursor],item=find(entry.question);
  if(!item){running=false;notice='This question is no longer available for your account. End this session and start a new one.';paint();return}
  opening=true;
  try{await previousOpen(item.index)}finally{opening=false}
  if(model.session!==session||!running||!allowed(item.subject,item.year)){if(!$('modal').hidden)closePlayer();return}
  if($('modal').hidden||current!==item.index){running=false;notice='The question could not open. Resume the session to retry.';paint();return}
  const old=document.getElementById('pathway-session-context');old?.remove();
  const context=el('div',(session.mode==='diagnostic'?'Diagnostic':session.mode==='recheck'?'Follow-up check':'Targeted practice')+' · Question '+(session.cursor+1)+' of '+session.entries.length+' · '+entry.topic,'pathway-session');
  context.id='pathway-session-context';$('qtext').before(context);paint();
 }
 function paint(){
  const available=pool(),subjects=[...new Set(available.map(x=>x.subject))];
  options(subject,subjects,typeof filter==='string'&&filter!=='all'?filter:subjects[0]);
  if(!subjectTouched&&subjects.includes(filter))subject.value=filter;
  options(year,[...new Set(available.filter(x=>x.subject===subject.value).map(x=>x.year))].sort(),$('year').value);
  start.disabled=!uid||!available.length||!!model.session;resume.hidden=!model.session;resume.disabled=running;end.hidden=!model.session;
  const session=model.session;
  message.textContent=saveError?'Progress could not be saved in this browser. Keep this page open and try again.':notice||(!uid?'Log in with an approved account to build your pathway.':session?(running?'Session in progress. Close the question to pause.':'Paused session: '+Object.keys(session.answers).length+' of '+session.entries.length+' answered.'):'Diagnostics use up to eight questions across available topics. Follow-up checks become available after one day.');
  map.replaceChildren();
  const skills=Object.entries(model.skills).filter(([,s])=>allowed(s.subject,s.year));
  for(const [id,s]of skills){
   const stage=core.status(s),card=el('article',undefined,'pathway-skill');card.dataset.stage=stage==='Secure'?'secure':stage==='Needs review'?'review':'developing';
   card.append(el('span',stage,'pathway-stage'),el('h3',s.topic),el('small',s.subject+' · Year '+s.year));
   const baseline=s.baseline===true?'correct':s.baseline===false?'needs work':'not checked';
   const practice=s.evidence.filter(e=>e.mode==='practice'&&e.correct).length;
   card.append(el('p','Diagnostic: '+baseline+' · '+practice+' correct practice response'+(practice===1?'':'s')+'.'));
   if(s.lesson)card.append(el('small','✓ Related lesson completed'));
   card.append(el('small','Follow-up: '+new Date(s.due).toLocaleString('en-AU',{dateStyle:'medium',timeStyle:'short'})));
   const actions=el('div',undefined,'pathway-actions'),learn=el('a','Find a lesson','pathway-action');
   learn.href='topic-hub.html?'+new URLSearchParams({course:s.subject+' ATAR',year:String(s.year),pathwaySkill:id,pathwayTopic:s.topic});
   const practiceButton=el('button','Targeted practice','pathway-action');practiceButton.disabled=!!session;practiceButton.onclick=()=>launch('practice',s);
   const check=el('button','Follow-up check','pathway-action');check.disabled=!!session||Date.now()<s.due;check.onclick=()=>launch('recheck',s);
   actions.append(learn,practiceButton,check);card.append(actions);map.append(card);
  }
  if(!skills.length)map.append(el('p',available.length?'Your topic mastery map will appear after the diagnostic.':'Diagnostics become available as automatically marked questions are added to your approved subjects.'));
 }
 const previousOpen=openQuestion,previousCheck=check,previousRender=render,previousClose=closePlayer;
 openQuestion=async function(id){
  if(!opening){running=false;document.getElementById('pathway-session-context')?.remove()}
  return previousOpen(id);
 };
 closePlayer=function(){running=false;document.getElementById('pathway-session-context')?.remove();const result=previousClose();paint();return result};
 render=function(){previousRender();paint();maybeRoute()};
 check=function(){
  const session=model.session;
  if(running&&session&&checked){
   const entry=session.entries[session.cursor];
   if(!Object.hasOwn(session.answers,entry.question))return;
   if(session.cursor+1<session.entries.length){session.cursor++;commit();showEntry()}
   else{
    const correct=Object.values(session.answers).filter(Boolean).length,total=session.entries.length,mode=session.mode;
    core.finish(model);commit();running=false;
    notice=(mode==='diagnostic'?'Diagnostic complete':mode==='recheck'?'Follow-up complete':'Targeted practice complete')+': '+correct+' / '+total+' correct. '+(mode==='practice'?'Check this skill again after one day.':'Your next steps are shown below.');
    closePlayer();host.scrollIntoView({behavior:'smooth',block:'start'});
   }
   return;
  }
  const before=state.attempts.length,wasChecked=checked;
  previousCheck();
  const attempt=state.attempts.at(-1);
  if(wasChecked||!uid||state.attempts.length<=before||attempt.selfAssessed)return;
  const item=pool().find(x=>x.index===current);if(!item)return;
  if(running&&session){
   const entry=session.entries[session.cursor];
   if(entry.question!==item.id||Object.hasOwn(session.answers,item.id))return;
   core.record(model,entry,session.mode,attempt.correct);session.answers[item.id]=attempt.correct===true;commit();
   document.getElementById('targeted-offer')?.remove();
   $('check').textContent=session.cursor+1===session.entries.length?'Finish session →':'Next session question →';
  }else{
   // Subsequent normal practice contributes only to already diagnosed topics.
   for(const [id,s]of Object.entries(model.skills)){
    if(s.subject===item.subject&&s.year===item.year&&item.topics.includes(s.topic)){
     core.record(model,{skill:id,question:item.id,subject:s.subject,year:s.year,topic:s.topic},'practice',attempt.correct);
    }
   }
   commit();
  }
  paint();
 };
 start.onclick=()=>launch('diagnostic');
 resume.onclick=()=>{if(model.session){const entry=model.session.entries[model.session.cursor];if(Object.hasOwn(model.session.answers,entry.question)){if(model.session.cursor+1<model.session.entries.length)model.session.cursor++;else{core.finish(model);commit();notice='Session complete. Your pathway is up to date.';paint();return}}running=true;commit();showEntry()}};
 end.onclick=()=>{model.session=null;running=false;commit();closePlayer();notice='Session ended. Answered questions remain in your pathway.';paint()};
 subject.onchange=()=>{subjectTouched=true;year.value='';paint()};year.onchange=paint;
 window.addEventListener('vault-studio-bank-ready',()=>{paint();maybeRoute()});
 const route=new URLSearchParams(location.search);
 function maybeRoute(){
  const requested=route.get('skill'),mode=route.get('pathway');
  if(uid&&physicsLoaded&&['practice','recheck'].includes(mode)&&requested&&model.skills[requested]&&!model.session&&allowed(model.skills[requested].subject,model.skills[requested].year)){
   route.delete('pathway');launch(mode,model.skills[requested]);
  }
 }
 client.observeAccess(next=>{
  access=next;const nextUid=next.ready&&!next.error&&next.user&&(next.admin||next.member?.status==='active')?next.user.uid:null;
  if(nextUid!==uid){
   const wasRunning=running;uid=nextUid;running=false;model=store.read(uid);if(wasRunning)closePlayer();
   notice='';saveError=false;
  }
  paint();
  maybeRoute();
 });
 paint();
})().catch(error=>{console.error('Learning pathway unavailable',error)});
