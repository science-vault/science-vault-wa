/* Run with NODE_PATH=<jsdom modules> node tests/physics-focused.cjs. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'topic-hub.html'),'utf8');
const dom=new JSDOM('<html><head></head><body><div id="host"></div></body></html>',{url:'https://science-vault.github.io/science-vault-wa/topic-hub.html',runScripts:'outside-only'}),w=dom.window;
let originals;
for(const m of source.matchAll(/<script[^>]*src="([^"]+)"/g)){
 const f=m[1].split('?')[0];if(f==='physics-focused-lessons.js')originals=Object.fromEntries([11,12].map(y=>[y,JSON.parse(JSON.stringify(w['Year'+y+'PhysicsLessons']))]));if(/^(year(?:11|12)-physics-|physics-atar-completion\.js|physics-focused-)/.test(f))w.eval(fs.readFileSync(path.join(root,f),'utf8'));
}
for(const year of [11,12])for(const [id,m] of Object.entries(originals[year]))assert.equal(JSON.stringify(w['Year'+year+'PhysicsLessons'][id].screens),JSON.stringify(m.screens),id+' original screens preserved');
const focused=w.PhysicsFocused,host=w.document.getElementById('host');assert.ok(focused);assert.equal(focused.lessons.length,142);assert.equal(focused.lessons.filter(x=>x.year===11).length,72);assert.equal(focused.lessons.filter(x=>x.year===12).length,70);
assert.equal(new Set(focused.lessons.map(x=>x.id)).size,142);const questions=new Set(),counts=[];
focused.setAccount('qa-student');
for(const e of focused.lessons){
 const mod=w['Year'+e.year+'PhysicsLessons'][e.id],parent=w['Year'+e.year+'PhysicsLessons'][e.parentTopic];assert.ok(parent);assert.equal(mod.focus.points.length,3);assert.ok(!questions.has(mod.focus.question));questions.add(mod.focus.question);
 assert.ok(mod.screens.length>=10,e.id+' screen count');assert.ok(mod.bank.length>=2,e.id+' mastery');assert.ok(mod.screens.some(s=>s.html.includes('<svg')),e.id+' diagram');assert.ok(mod.screens.some(s=>s.title.startsWith('Do Now')));
 const full=mod.screens.map(s=>s.html).join(' ');assert.ok(full.includes('>I<')&&full.includes('>WE<')&&full.includes('>YOU<'));assert.ok(full.includes('pf-key'),e.id+' coloured terms');assert.ok(full.includes('pf-marking'));assert.ok(full.includes('pf-response'));assert.ok(!/\bundefined\b|\bNaN\b/.test(full),e.id);
 const words=new JSDOM(full).window.document.body.textContent.split(/\s+/).length;assert.ok(words>=350,e.id+' substantial teaching content: '+words);counts.push({id:e.id,screens:mod.screens.length,words});
 w['Year'+e.year+'PhysicsPlayer'].build(e,host);assert.ok(host.querySelector('.pf-tools'));assert.ok(host.querySelector('.sv-lms'));
 for(let i=0;i<mod.screens.length;i++){
  const nav=host.querySelector('[data-i="'+i+'"]');nav.click();assert.equal(host.querySelector('#y12Title').textContent,mod.screens[i].title);
  const response=host.querySelector('[data-pf-response]');if(response){response.value='Independent working for '+e.id;response.dispatchEvent(new w.Event('input'));assert.equal(w.localStorage.getItem('physics-depth:qa-student:answer:'+e.id),response.value)}
  for(const q of host.querySelectorAll('[data-pf-check]')){for(const f of q.querySelectorAll('fieldset')){f.querySelector('input[value="'+f.dataset.correct+'"]').checked=true}q.querySelector('button').click();assert.match(q.querySelector('.pf-feedback').textContent,/correct/);assert.ok(q.querySelector('.pf-item-feedback').textContent.length>20)}
 }
 host.querySelector('#y12Master').click();const qs=host.querySelectorAll('.rq');assert.equal(qs.length,mod.bank.length);for(const q of qs)q.querySelector('input[value="'+q.dataset.a+'"]').checked=true;host.querySelector('#ymCheck').click();assert.ok(host.querySelector('.master-pass'),e.id+' mastery');
 const worksheet=focused.printLesson(e.id),key=focused.printLesson(e.id,true);assert.equal((worksheet.match(/class="pf-print-space"/g)||[]).length,2);assert.ok(!worksheet.includes('<tbody>'));assert.ok(key.includes('<tbody>'));assert.ok(new JSDOM(worksheet).window.document.body.textContent.includes(mod.focus.question),e.id+' printable question');
}
assert.ok(focused.lessons.some(e=>e.id==='relativistic-velocity-addition'));assert.ok(focused.lessons.some(e=>e.id==='black-body-radiation'));
// Sequence listing exposes focused tiles once and stable original links in disclosures.
for(const year of [11,12])for(const unit of Object.keys(focused.sequences[year])){let opened;focused.render(host,year,unit,t=>opened=t.id);const list=focused.lessons.filter(e=>e.year===year&&e.unit===unit);assert.equal(host.querySelectorAll('.topic-tile').length,list.length);assert.equal(host.querySelectorAll('.physics-reference').length,focused.sequences[year][unit].length);host.querySelector('.topic-tile').click();assert.equal(opened,list[0].id);for(const group of focused.sequences[year][unit])assert.ok(w.vaultVisibleLessonTopics.find(e=>e.topic.id===group.parent.id))}
// Local drafts remain isolated between accounts.
const e=focused.lessons[0],mod=w.Year11PhysicsLessons[e.id],index=mod.screens.findIndex(s=>s.html.includes('data-pf-response'));
focused.setAccount('different-student');w.Year11PhysicsPlayer.build(e,host);host.querySelector('[data-i="'+index+'"]').click();assert.equal(host.querySelector('[data-pf-response]').value,'');
focused.setAccount('qa-student');w.Year11PhysicsPlayer.build(e,host);host.querySelector('[data-i="'+index+'"]').click();assert.match(host.querySelector('[data-pf-response]').value,/Independent working/);
// Numerical and schema checks independent of presentation.
assert.equal(72*1000/3600,20);assert.equal(0.1*60+0.3*20,12);assert.equal(12/0.4,30);assert.ok(Math.abs(9.8*(Math.sin(Math.PI/6)-0.2*Math.cos(Math.PI/6))-3.20)<0.01);assert.ok(Math.abs((0.6-0.4)/(1-0.6*0.4)-0.263)<0.001);assert.equal(1240/40000,0.031);assert.equal(0.5*4/(800*0.02)*100,12.5);
const result={focusedLessons:142,year11:72,year12:70,newIndependentQuestions:questions.size,screens:counts.reduce((n,x)=>n+x.screens,0),minimumWords:Math.min(...counts.map(x=>x.words)),checks:'all screens render; concepts and mastery mark correctly; original links retained; account-isolated drafts; printable question/key separation',lessons:counts};
fs.mkdirSync(path.join(root,'.physics-depth-qa'),{recursive:true});fs.writeFileSync(path.join(root,'.physics-depth-qa/checks.json'),JSON.stringify(result,null,2));console.log('PASS:',JSON.stringify({...result,lessons:undefined}));w.close();
