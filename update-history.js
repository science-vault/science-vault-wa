'use strict';
const el=id=>document.getElementById(id), zone='Australia/Perth';
let entries=[],filtered=[],limit=40;
const dateKey=iso=>new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
const dateLabel=iso=>new Intl.DateTimeFormat('en-AU',{timeZone:zone,day:'numeric',month:'long',year:'numeric'}).format(new Date(iso));
const timeLabel=iso=>new Intl.DateTimeFormat('en-AU',{timeZone:zone,hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true}).format(new Date(iso));
function render(){
 const term=el('search').value.trim().toLowerCase(),from=el('from').value,to=el('to').value;
 filtered=entries.filter(e=>{const d=dateKey(e.recordedAt);return (!term||(e.title+' '+e.details).toLowerCase().includes(term))&&(!from||d>=from)&&(!to||d<=to)});
 el('results').replaceChildren();
 for(const e of filtered.slice(0,limit)){
  const article=document.createElement('article');article.className='entry';
  const time=document.createElement('time');time.dateTime=e.recordedAt;time.textContent=dateLabel(e.recordedAt);const clock=document.createElement('span');clock.textContent=timeLabel(e.recordedAt)+' AWST';time.append(clock);
  const content=document.createElement('div'),h=document.createElement('h2');h.textContent=e.title;content.append(h);
  if(e.details){const p=document.createElement('p');p.textContent=e.details;content.append(p)}
  const link=document.createElement('a');link.textContent='View change record ↗';link.href=e.url;link.target='_blank';link.rel='noopener noreferrer';content.append(link);article.append(time,content);el('results').append(article);
 }
 el('status').textContent=from&&to&&from>to?'Choose a start date before the end date.':filtered.length?`Showing ${Math.min(limit,filtered.length)} of ${filtered.length} matching updates · newest first`:'No updates match these filters.';
 el('more').hidden=limit>=filtered.length;el('csv').disabled=!filtered.length;
}
for(const id of ['search','from','to'])el(id).addEventListener('input',()=>{limit=40;render()});
el('reset').onclick=()=>{for(const id of ['search','from','to'])el(id).value='';limit=40;render()};el('more').onclick=()=>{limit+=40;render()};
el('csv').onclick=()=>{const cell=s=>'"'+String(s).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';const rows=[['Date (Perth)','Time (AWST)','Update','Details','Change record'],...filtered.map(e=>[dateKey(e.recordedAt),timeLabel(e.recordedAt),e.title,e.details,e.url])];const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='learning-vault-update-history.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
fetch('update-history.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('History unavailable');return r.json()}).then(data=>{entries=data.entries.sort((a,b)=>Date.parse(b.recordedAt)-Date.parse(a.recordedAt));el('total').textContent=entries.length.toLocaleString();el('generated').textContent='Register refreshed '+dateLabel(data.generatedAt)+' at '+timeLabel(data.generatedAt)+' AWST';render()}).catch(()=>{el('status').textContent='Update history could not be loaded. Please refresh the page to try again.'});
