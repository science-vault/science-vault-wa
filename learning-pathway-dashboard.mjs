import {observeAccess} from './access-client.mjs?v=2026.10.9-classes';
import {canStudy} from './registration-options.mjs?v=2026.10.11-geography';
import {read} from './learning-pathway-store.mjs?v=1';
import {status} from './learning-pathway-core.mjs?v=1';
const host=document.createElement('section');host.className='learning-pathway';
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n};
document.querySelector('main .welcome')?.after(host);
let access=null;
function paint(){
 host.replaceChildren(el('span','YOUR LEARNING PATHWAY','pathway-kicker'),el('h2','Your next learning steps'));
 if(!access?.user||access.error||!access.ready||access.member?.status!=='active'){host.append(el('p','Your approved account opens your personalised learning pathway.'));return}
 const model=read(access.user.uid),skills=Object.entries(model.skills).filter(([,s])=>canStudy(access.member,s.subject,s.year,access.admin)).sort((a,b)=>a[1].due-b[1].due);
 const due=skills.filter(([,s])=>s.due<=Date.now()).length,secure=skills.filter(([,s])=>status(s)==='Secure').length;
 host.append(el('p',skills.length?secure+' secure topics · '+due+' follow-up checks due.':'Start with a short diagnostic in Practice Studio to find useful lessons and targeted practice.'));
 const map=el('div',undefined,'pathway-map');
 for(const [id,s]of skills.slice(0,4)){
  const card=el('article',undefined,'pathway-skill');card.append(el('span',status(s),'pathway-stage'),el('h3',s.topic),el('small',s.subject+' · Year '+s.year));
  const a=el('a',s.due<=Date.now()?'Open follow-up check →':'Continue pathway →','pathway-action');a.href='student-quiz.html?'+new URLSearchParams({subject:s.subject,year:String(s.year),...(s.due<=Date.now()?{pathway:'recheck',skill:id}:{})});card.append(a);map.append(card);
 }
 host.append(map);
 const link=el('a',skills.length?'View mastery map →':'Start a diagnostic →','pathway-action main');link.href='student-quiz.html#learning-pathway';host.append(link,el('p','Progress is saved for this account in this browser. Topic mastery reflects checked practice evidence, not school assessment grades.','pathway-note'));
}
observeAccess(next=>{access=next;paint()});window.addEventListener('storage',paint);window.addEventListener('pageshow',paint);window.addEventListener('vault-pathway-updated',paint);
