/* Year → subject → topic browsing, using only the existing approved question pool. */
(function(root){'use strict';
 const unique=values=>[...new Set(values)];
 function approved(rows,canStudy){return typeof canStudy==='function'?rows.filter(q=>canStudy(q[0],Number(q[1]))):[];}
 function years(rows){return unique(rows.map(q=>Number(q[1])).filter(y=>Number.isInteger(y)&&y>=7&&y<=12)).sort((a,b)=>a-b);}
 function subjects(rows,year){return unique(rows.filter(q=>Number(q[1])===Number(year)).map(q=>q[0])).sort();}
 function topics(rows,year,subject){const selected=rows.filter(q=>Number(q[1])===Number(year)&&q[0]===subject),counts=new Map();for(const q of selected)for(const t of unique(q[7]?.topics?.length?q[7].topics:[q[2]]))if(t)counts.set(t,(counts.get(t)||0)+1);return [...counts].map(([name,count])=>({name,count})).sort((a,b)=>a.name.localeCompare(b.name));}
 function stage(year,subject){return !years([['',Number(year)]]).length?'year':!subject||subject==='all'?'subject':'topic';}
 const model={approved,years,subjects,topics,stage};root.PracticeStudioHierarchy=model;
 if(typeof document==='undefined'||typeof questions==='undefined')return;
 const assigned=()=>{const p=new URLSearchParams(location.search);return !!(p.get('class')&&p.get('task'));};
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const nav=el('section',undefined,'studio-hierarchy');nav.setAttribute('aria-label','Choose year, subject and topic');nav.id='studio-hierarchy';
 const title=el('h2','Find your practice questions'),help=el('p','Choose your year, then a subject, then a topic.');const fields=el('div',undefined,'studio-hierarchy-fields');
 const yearLabel=el('label','1. Year'),year=$('year');yearLabel.htmlFor='year';year.setAttribute('aria-label','Year level');yearLabel.append(year);
 const subjectLabel=el('label','2. Subject'),subject=el('select');subject.id='hierarchy-subject';subject.setAttribute('aria-label','Subject');subjectLabel.htmlFor=subject.id;subjectLabel.append(subject);
 const topicLabel=$('topic-filter').parentElement;topicLabel.firstChild.textContent='3. Topic';topicLabel.htmlFor='topic-filter';fields.append(yearLabel,subjectLabel,topicLabel);
 const path=el('nav',undefined,'studio-hierarchy-path');path.setAttribute('aria-label','Practice selection');nav.append(title,help,fields,path);controls.before(nav);
 const cards=el('section',undefined,'studio-hierarchy-cards');cards.setAttribute('aria-label','Browse practice choices');nav.after(cards);
 document.querySelector('.tabs')?.setAttribute('hidden','');
 let pendingYear=new URLSearchParams(location.search).get('year')||'';
 let pendingSubject=new URLSearchParams(location.search).get('subject')||new URLSearchParams(location.search).get('course')||'';
 const beforeEligible=eligible,beforeRender=render;
 const pool=()=>approved(questions,window.studioCanStudy);
 function clearDownstream(){for(const id of ['topic-filter','subtopic-filter','type-filter','exam-filter'])if($(id))$(id).value='';$('search').value='';if($('mixed-filter'))$('mixed-filter').checked=false;}
 function route(){const u=new URL(location.href);u.searchParams.delete('course');for(const [key,value] of [['year',year.value],['subject',filter],['topic',$('topic-filter').value],['subtopic',$('subtopic-filter').value]]){if(!value||value==='all')u.searchParams.delete(key);else u.searchParams.set(key,value);}history.replaceState(null,'',u);}
 function chooseYear(value){pendingYear='';year.value=String(value);clearDownstream();const names=subjects(pool(),year.value);filter=names.find(s=>s.toLowerCase()===pendingSubject.toLowerCase())||'all';pendingSubject='';route();render();subject.focus();}
 function chooseSubject(value){filter=value;clearDownstream();if(view==='dashboard')document.querySelector('[data-view=practice]').click();route();render();$('topic-filter').focus();}
 year.onchange=()=>chooseYear(year.value);subject.onchange=()=>chooseSubject(subject.value);
 const topicChange=$('topic-filter').onchange;$('topic-filter').onchange=event=>{if(topicChange)topicChange.call($('topic-filter'),event);route();};
 const beforeStart=start;start=function(...args){if(!assigned()&&stage(year.value,filter)!=='topic'){nav.scrollIntoView({block:'start'});(year.value==='all'?year:subject).focus();return;}return beforeStart(...args);};
 eligible=function(){if(assigned())return beforeEligible();if(stage(year.value,filter)!=='topic')return [];return beforeEligible();};
 function option(value,label){const n=el('option',label);n.value=String(value);return n;}
 function choice(label,count,fn){const b=el('button',undefined,'studio-hierarchy-choice');b.type='button';b.append(el('strong',label),el('small',count+' available questions'),el('span','Explore →'));b.onclick=fn;return b;}
 function validate(rows){const restoreYear=year.value==='all'&&pendingYear,value=restoreYear||year.value,ys=years(rows);year.replaceChildren(option('all','Choose a year'),...ys.map(y=>option(y,'Year '+y)));year.value=ys.includes(Number(value))?String(value):'all';if(year.value==='all'){if(filter!=='all')pendingSubject=filter;filter='all';}
 const names=subjects(rows,year.value);if(restoreYear&&year.value!=='all'){filter=names.find(s=>s.toLowerCase()===pendingSubject.toLowerCase())||filter;pendingYear='';pendingSubject='';}if(filter!=='all'&&!names.includes(filter))filter='all';subject.replaceChildren(option('all','Choose a subject'),...names.map(s=>option(s,s)));subject.value=filter;subject.disabled=year.value==='all';$('topic-filter').disabled=stage(year.value,filter)!=='topic';}
 function breadcrumb(text,fn){const b=el('button',text);b.type='button';b.onclick=fn;return b;}
 render=function(){
  if(assigned()){beforeRender();nav.hidden=cards.hidden=true;return;}
  const rows=pool();validate(rows);beforeRender();
  if(view==='progress'){nav.hidden=cards.hidden=true;return;}
  nav.hidden=false;const current=stage(year.value,filter),ready=current==='topic',database=document.body.classList.contains('studio-database-mode');
  title.textContent=current==='year'?'Choose your year':current==='subject'?'Choose a subject':'Choose a topic';help.textContent=current==='year'?'Only years and subjects available to your approved account are shown.':current==='subject'?'Choose a subject for Year '+year.value+'.':'Your questions and practice sequence stay within Year '+year.value+' · '+filter+'.';
  path.replaceChildren(breadcrumb('Years',()=>chooseYear('all')));if(year.value!=='all')path.append(el('span','›'),breadcrumb('Year '+year.value,()=>{filter='all';clearDownstream();route();render();}));if(ready)path.append(el('span','›'),el('strong',filter));if($('topic-filter').value)path.append(el('span','›'),el('span',$('subtopic-filter').value||$('topic-filter').value));
  controls.hidden=!ready;topicPicker.hidden=!ready||view!=='practice'||database;$('content').hidden=!ready||view==='dashboard'||database;const db=document.querySelector('.studio-database');if(db)db.hidden=!database||!ready;
  cards.replaceChildren();cards.hidden=ready&&view!=='dashboard';
  const display=current==='year'?'year':view==='dashboard'?'subject':current;
  if(!cards.hidden){if(!rows.length)cards.append(el('p',physicsLoaded?'No practice questions are available for your approved subjects yet.':'Loading your approved question bank…'));else if(display==='year'){for(const y of years(rows))cards.append(choice('Year '+y,rows.filter(q=>Number(q[1])===y).length,()=>chooseYear(y)));}else for(const s of subjects(rows,year.value))cards.append(choice(s,rows.filter(q=>Number(q[1])===Number(year.value)&&q[0]===s).length,()=>chooseSubject(s)));}
  if(!ready){$('section-title').textContent=current==='year'?'Year levels':'Year '+year.value+' subjects';$('section-sub').textContent='Year → Subject → Topic';}
  $('search').disabled=!ready;$('search').placeholder=ready?'Search within '+filter+' · Year '+year.value:'Choose a year and subject to search';
 };
 const style=el('style');style.textContent='.studio-hierarchy{padding:22px;background:#fff;border:1px solid #ded6ea;border-radius:14px;margin:18px 0}.studio-hierarchy h2{font-size:21px;color:#38274b;margin:0 0 8px}.studio-hierarchy>p{color:#594c68;font-size:13px}.studio-hierarchy-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:18px 0}.studio-hierarchy label{display:grid;gap:7px;font-size:12px;font-weight:700;color:#49375c}.studio-hierarchy select{width:100%;min-width:0;border:1px solid #d5c9e3;border-radius:8px;padding:11px;background:#fff;color:#32243f}.studio-hierarchy select:disabled{background:#f5f2f8;color:#74677f}.studio-hierarchy-path{display:flex;gap:9px;align-items:center;flex-wrap:wrap;color:#59436f;font-size:12px}.studio-hierarchy-path button{background:transparent;padding:4px 0;color:#6541a0;text-decoration:underline}.studio-hierarchy-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin:0 0 24px}.studio-hierarchy-choice{text-align:left;display:grid;gap:12px;border:1px solid #ded3eb;border-radius:12px;padding:24px;background:#fff;color:#39234e}.studio-hierarchy-choice strong{font-size:21px}.studio-hierarchy-choice small{color:#62516f}.studio-hierarchy-choice>span{font-size:12px;color:#674297}.studio-hierarchy-choice:hover{border-color:#9166ba;background:#faf7fd}.studio-hierarchy[hidden],.studio-hierarchy-cards[hidden],.tabs[hidden],#bank-controls[hidden],.studio-topic-picker[hidden]{display:none!important}.studio-topic-picker>p{color:#594c68}.studio-topic-choice small{color:#675674}@media(max-width:650px){.studio-hierarchy-fields{grid-template-columns:1fr}.studio-hierarchy{padding:18px}}';document.head.append(style);render();
})(typeof window==='undefined'?globalThis:window);
