import {waitForAccess,getAccessState} from './access-client.mjs?v=2026.10.9-classes';
import {canStudy} from './registration-options.mjs?v=2026.10.11-geography';
import {read,save} from './learning-pathway-store.mjs?v=1';
import {lessonScore,DAY} from './learning-pathway-core.mjs?v=1';
const route=new URLSearchParams(location.search),skillKey=route.get('pathwaySkill');
if(skillKey){
 const access=await waitForAccess(),uid=access.user?.uid;
 if(uid&&!access.error&&(access.admin||access.member?.status==='active')){
  const model=read(uid),skill=model.skills[skillKey];
  if(skill&&canStudy(access.member,skill.subject,skill.year,access.admin)){
   const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n};
   const box=el('section',undefined,'learning-pathway');box.setAttribute('aria-label','Your recommended learning step');
   box.append(el('span','YOUR NEXT LEARNING STEP','pathway-kicker'),el('h2',skill.topic),el('p','Choose a related lesson below, then return to targeted practice. Your usual lesson progress and completion requirements apply.'));
   const back=el('a','Return to targeted practice →','pathway-action main');
   back.href='student-quiz.html?'+new URLSearchParams({subject:skill.subject,year:String(skill.year),pathway:'practice',skill:skillKey});
   box.append(back);document.querySelector('main').prepend(box);
   let recommendationsBuilt=false;
   function ready(){
    const course=document.getElementById('course'),year=document.getElementById('year'),unit=document.getElementById('unit');
    if(!course?.options.length||!unit?.options.length||!window.vaultVisibleLessonTopics)return;
    if(course.value!==skill.subject+' ATAR'||Number(year.value)!==skill.year)return;
    if(!route.get('topic')&&!recommendationsBuilt){
     recommendationsBuilt=true;const original=unit.value,all=[];
     for(const option of [...unit.options]){
      unit.value=option.value;unit.dispatchEvent(new Event('change'));
      for(const item of window.vaultVisibleLessonTopics||[]){
       const t=item.topic;if(!t?.id&&!t?.title)continue;
       all.push({topic:String(t.id||t.title),title:String(t.title||t.id),unit:option.value,score:lessonScore(skill.topic,(t.title||t.id)+' '+(t.description||''))});
      }
     }
     unit.value=original;unit.dispatchEvent(new Event('change'));
     const best=all.filter(x=>x.score>=2).sort((a,b)=>b.score-a.score).slice(0,3),list=el('div',undefined,'pathway-recommendations');
     for(const item of best){
      const a=el('a',item.title,'pathway-action');
      a.href='topic-hub.html?'+new URLSearchParams({course:course.value,year:year.value,unit:item.unit,topic:item.topic,pathwaySkill:skillKey,pathwayTopic:skill.topic});
      a.append(el('small',item.unit));list.append(a);
     }
     if(!best.length)list.append(el('p','Choose the closest lesson from the subject topics below. No exact lesson match has been confirmed for this diagnostic topic.'));
     box.append(list);
    }
   }
   window.addEventListener('vault-hub-ready',ready);ready();
   window.addEventListener('vault-journey-updated',()=>{
    if(getAccessState().user?.uid!==uid)return;
    const topic=window.vaultCurrentTopic,course=document.getElementById('course')?.value,year=Number(document.getElementById('year')?.value),unit=document.getElementById('unit')?.value;
    if(!topic||course!==skill.subject+' ATAR'||year!==skill.year)return;
    const identity=JSON.stringify([course,year,unit,String(topic.id||topic.title)]);
    let journey;try{journey=JSON.parse(localStorage.getItem('vault-lesson-journey-v1:'+uid+':'+identity))}catch{return}
    if(!journey?.masterPassed)return;
    const current=read(uid),s=current.skills[skillKey];if(!s)return;
    if(s.lesson?.topic===topic.id&&s.lesson?.attempt===journey.attempt)return;
    s.lesson={topic:String(topic.id||topic.title),title:String(topic.title||topic.id),attempt:journey.attempt,time:Date.now()};
    if(!s.secure)s.due=Date.now()+DAY;
    if(save(uid,current))box.querySelector('p').textContent='✓ Related lesson completed. Return to targeted practice, then check this skill again after one day.';
   });
  }
 }
}
