import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');const index=JSON.parse(read('practice-studio-mathematics-probability-index.json'));const files=[...new Set(index.map(q=>q.bankFile))];const rows=files.flatMap(f=>JSON.parse(read(f)));const get=(s,n)=>rows.find(q=>q.id===`maths-lower-probability-${s}-q${n}`);const c=vm.createContext({});vm.runInContext(read('maths-answer-checker.js'),c);vm.runInContext(read('written-answer-checker.js'),c);vm.runInContext(read('practice-studio-database-order.js'),c);const W=c.WrittenAnswerChecker,M=c.MathsAnswerChecker;
const sample=n=>get('sample-space-relative-frequency',n),further=n=>get('further-probability',n);
const check=(q,v,i=0)=>W.checkField(q.typedAnswers.fields[i],String(v),M).correct;
const chosen=q=>q.options[q.correctAnswer];
const equivalent=(value,expected)=>M.check({kind:'number',expected:String(expected),tolerance:1e-9},value).correct;
test('all 70 original questions have stable unique identities, complete solutions and exact lazy metadata',()=>{
 assert.equal(rows.length,70);assert.equal(index.length,70);assert.equal(new Set(rows.map(q=>q.id)).size,70);assert.equal(new Set(rows.map(q=>q.hash)).size,70);
 for(const [s,n] of [['sample-space-relative-frequency',30],['further-probability',40]])assert.deepEqual(rows.filter(q=>q.id.includes('-'+s+'-')).map(q=>q.number),Array.from({length:n},(_,i)=>i+1));
 for(const q of rows){assert.ok(q.html&&q.answerHtml);assert.match(q.sourceKeyFile,/Probability/);assert.deepEqual(index.find(x=>x.id===q.id),Object.fromEntries(Object.entries(q).filter(([k])=>!['html','answerHtml','optionsHtml','sourceData'].includes(k))));for(const m of q.html.matchAll(/src="([^"]+)"/g))assert.ok(existsSync(new URL('../'+m[1],import.meta.url)));}
});
test('every typed result passes the actual checker while an incorrect response is rejected',()=>{
 assert.equal(rows.filter(q=>q.typedAnswers).length,36);assert.equal(rows.filter(q=>q.markingMode==='automatic').length,34);
 for(const q of rows)for(const f of q.typedAnswers?.fields||[]){const v=['set','tuple'].includes(f.kind)?f.expected.join(','):Array.isArray(f.expected)?f.expected[0]:f.expected;assert.equal(W.checkField(f,v,M).correct,true,q.id+' '+f.label);assert.equal(W.checkField(f,'999999',M).correct,false,q.id+' incorrect');assert.equal(q.typedAnswers.fullQuestion,true);}
 assert.equal(check(sample(6),'6,5,4,3,2,1'),true);assert.equal(check(sample(6),'1,2,3,4,5,5'),false);
});
test('colour and state survey answers are independently calculated from the source counts',()=>{
 const fav=sample(22).sourceData,total=Object.values(fav).reduce((a,b)=>a+b,0);assert.equal(total,25);
 Object.entries(fav).forEach(([k,v],i)=>assert.equal(check(sample(22),v/total,i),true,k));
 assert.equal(equivalent(chosen(sample(23)),fav.Blue/total),true);assert.equal(chosen(sample(23)),'2/25');assert.equal(chosen(sample(24)),'2/5');
 const states=sample(27).sourceData,n=Object.values(states).reduce((a,b)=>a+b,0);assert.equal(n,80);Object.entries(states).forEach(([k,v],i)=>assert.equal(check(sample(27),v/n,i),true,k));
 assert.equal(check(sample(27),.26,4),false);assert.equal(check(sample(27),.22,5),false);assert.equal(check(sample(30),(states.WA+states.SA)/n),true);
});
test('physical letter multiplicities and complementary event answers are correct',()=>{
 const tiles=further(6).sourceData;assert.equal(tiles.length,10);const es=tiles.filter(x=>x==='E').length;assert.equal(es,4);assert.equal(check(further(8),(10-es)/10),true);assert.equal(check(further(9),tiles.filter(x=>['X','C'].includes(x)).length/10),true);
 assert.equal(check(further(6),'C C E E E E L L N X'),true);assert.equal(check(further(6),'C E L N X'),false);
 assert.equal(equivalent(chosen(further(12)),1-5/500),true);assert.equal(equivalent(chosen(further(26)),1-4/52),true);
 assert.equal(check(further(25),5/(3+4+5)),true);
});
test('Venn and two-way table calculations use the correct unions, intersections and conditional denominators',()=>{
 const a=further(27).sourceData,total=Object.values(a).reduce((s,v)=>s+v,0);assert.equal(total,30);
 for(const [n,v] of [[27,(a.sportOnly+a.both)/total],[28,a.both/total],[29,1-a.neither/total],[30,a.both/(a.sportOnly+a.both)],[31,(a.sportOnly+a.neither)/total]])assert.equal(equivalent(chosen(further(n)),v),true,'class '+n);
 const b=further(32).sourceData,t=Object.values(b).reduce((s,v)=>s+v,0);assert.equal(t,40);const silver=b.silverOnly+b.glassSilverOnly+b.allThree+b.silverVenusOnly,venus=b.venusOnly+b.glassVenusOnly+b.allThree+b.silverVenusOnly,both=b.allThree+b.silverVenusOnly;
 for(const [n,v] of [[32,silver/t],[33,both/t],[34,(t-b.venusOnly-b.none)/t],[35,both/venus],[36,1-venus/t]])assert.equal(equivalent(chosen(further(n)),v),true,'beads '+n);
 const [[,sm,sf,s],[,jm,jf,j],[,m,f,t2]]=further(37).sourceData;assert.equal(sm+jm,m);assert.equal(sf+jf,f);assert.equal(s+j,t2);
 for(const [n,v] of [[37,m/t2],[38,jm/t2],[39,(s+jf)/t2],[40,jm/m]])assert.equal(equivalent(chosen(further(n)),v),true,'club '+n);
});
test('all context survives randomised single-question practice and conditional items are placed in Year 10',()=>{
 for(const [from,to] of [[12,16],[17,21]])for(let n=from;n<=to;n++)assert.match(sample(n).html,/<img/);
 for(let n=22;n<=30;n++)assert.match(sample(n).html,/<table/);
 for(let n=27;n<=36;n++)assert.match(further(n).html,/<img/);for(let n=37;n<=40;n++)assert.match(further(n).html,/<table/);
 for(const n of [30,35,40]){assert.equal(further(n).year,10);assert.equal(further(n).originalYear,8);assert.deepEqual(further(n).subtopics,['Conditional probability']);}
 assert.equal(further(1).year,7);assert.equal(further(4).year,8);assert.equal(sample(9).year,8);
 for(const q of rows){assert.equal(q.scsa.year,q.year);assert.match(q.scsa.url,/For-implementation-in-2026/);assert.equal(q.scsa.strand,'Probability and statistics');}
});
test('new questions sort ahead of the previous batch without changing the catalogue sequence',()=>{
 const old=JSON.parse(read('practice-studio-mathematics-number-index.json'));const ordered=c.PracticeStudioDatabaseOrder.sort([...old,...index].map(meta=>({q:[null,null,null,null,null,null,null,meta]})),'recent');assert.equal(ordered[0].q[7].id,index[0].id);assert.equal(index[0].number,1);assert.ok(Date.parse(index[0].addedAt)>Date.parse(old[0].addedAt));
 for(const q of rows.filter(q=>q.options)){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<4);}
});
