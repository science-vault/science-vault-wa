import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'),index=JSON.parse(read('practice-studio-mathematics-algebra-910-index.json')),rows=[...new Set(index.map(q=>q.bankFile))].flatMap(f=>JSON.parse(read(f)));const c=vm.createContext({});for(const f of ['maths-answer-checker.js','written-answer-checker.js','practice-studio-database-order.js'])vm.runInContext(read(f),c);const W=c.WrittenAnswerChecker,M=c.MathsAnswerChecker,get=(s,sec,n)=>rows.find(q=>q.id===`maths-lower-algebra-910-${s}-${sec}-q${n}`);
test('195 source questions retain unique identities, exact lazy metadata and section numbering',()=>{
 assert.equal(index.length,195);assert.equal(rows.length,195);for(const k of ['id','hash'])assert.equal(new Set(rows.map(q=>q[k])).size,195);
 const expected={'coordinate-geometry':[13,12,2],'simultaneous-equations':[7,5,2],'non-linear-equations':[10,14,0],'linear-equations':[8,10,0],'functions-and-graphs':[6,10,2],factorisation:[15,15,0],'basic-algebra-skills':[20,20,0],'algebraic-expansions':[12,12,0]};
 for(const [s,counts]of Object.entries(expected))for(const [i,sec]of ['short','choice','long'].entries())assert.deepEqual(rows.filter(q=>q.id.startsWith(`maths-lower-algebra-910-${s}-${sec}-`)).map(q=>q.sourceNumber),Array.from({length:counts[i]},(_,n)=>n+1));
 for(const q of rows){assert.ok(q.html&&q.answerHtml);assert.deepEqual(index.find(x=>x.id===q.id),Object.fromEntries(Object.entries(q).filter(([k])=>!['html','answerHtml','optionsHtml'].includes(k))));assert.equal(q.sourceKeyFile,'Answers 9 10 Algebra.pdf');}
});
test('80 typed-result questions pass actual marking while incorrect results fail; form and drawing retain review',()=>{
 assert.equal(rows.filter(q=>q.typedAnswers).length,80);assert.equal(rows.filter(q=>q.markingMode==='automatic'||q.typedAnswers?.fullQuestion).length,140);assert.equal(rows.filter(q=>q.markingMode!=='automatic'&&!q.typedAnswers).length,17);
 for(const q of rows)for(const f of q.typedAnswers?.fields||[]){const value=['set','tuple'].includes(f.kind)?f.expected.join(','):Array.isArray(f.expected)?f.expected[0]:f.expected;assert.equal(W.checkField(f,String(value),M).correct,true,q.id+' '+f.label);assert.equal(W.checkField(f,'999999',M).correct,false,q.id+' wrong result');}
 assert.equal(get('factorisation','short',2).typedAnswers?.fullQuestion||false,false);assert.deepEqual(get('functions-and-graphs','short',1).typedAnswers.fields[0].expected,['4','2']);
});
test('98 MCQ keys and corrected or missing source solutions are retained explicitly',()=>{
 const mc=rows.filter(q=>q.options);assert.equal(mc.length,98);for(const q of mc){assert.deepEqual(q.options,['A','B','C','D']);assert.ok(Number.isInteger(q.correctAnswer)&&q.correctAnswer>=0&&q.correctAnswer<4);}
 for(const [s,n,letter]of [['coordinate-geometry',10,'C'],['algebraic-expansions',7,'A'],['algebraic-expansions',12,'B']]){const q=get(s,'choice',n);assert.equal(q.options[q.correctAnswer],letter);assert.ok(q.editorialNote||q.solutionOrigin.includes('independently'));}
 assert.match(get('factorisation','short',1).answerHtml,/4x\s*\+\s*5/);assert.match(get('simultaneous-equations','choice',3).html,/equations printed at the top of the box/);assert.match(get('algebraic-expansions','choice',12).solutionOrigin,/no supplied key/);
 assert.equal(W.checkField(get('non-linear-equations','short',9).typedAnswers.fields[0],'6.03',M).correct,true);
});
function jpegSize(b){let i=2;while(i<b.length){if(b[i++]!==255)continue;let marker=b[i++];if(marker===216||marker===217)continue;let n=b.readUInt16BE(i);if([192,193,194].includes(marker))return[b.readUInt16BE(i+5),b.readUInt16BE(i+3)];i+=n;}throw Error('No JPEG dimensions');}
test('every question and solution crop lies inside its JPEG sprite; random questions retain shared graphs',()=>{
 const sizes=new Map();for(const q of rows)for(const h of [q.html,q.answerHtml])for(const m of h.matchAll(/src="([^"]+)" data-studio-crop="([\d,]+)"/g)){if(!sizes.has(m[1]))sizes.set(m[1],jpegSize(readFileSync(new URL('../'+m[1],import.meta.url))));const [x,y,w,height]=m[2].split(',').map(Number),[sw,sh]=sizes.get(m[1]);assert.ok(w>0&&height>0&&x>=0&&y>=0&&x+w<=sw&&y+height<=sh,q.id);}
 assert.equal(sizes.size,38);for(const [s,sec,ns]of [['simultaneous-equations','short',[1,2,3,6,7]],['simultaneous-equations','choice',[4,5]],['functions-and-graphs','short',[2,3]]])for(const n of ns)assert.equal([...get(s,sec,n).html.matchAll(/<img/g)].length,2);
});
test('SCSA skill years are separate from source year and longer questions keep printed marks',()=>{
 assert.deepEqual(Object.fromEntries([7,8,9,10].map(y=>[y,rows.filter(q=>q.year===y).length])),{7:20,8:41,9:65,10:69});for(const q of rows){assert.equal(q.scsa.year,q.year);assert.match(q.scsa.url,/For-implementation-in-2026/);assert.equal(q.topics[0],q.scsa.subStrand);assert.ok(!q.topics.includes('Algebra'));}
 assert.equal(get('coordinate-geometry','short',4).year,9);assert.equal(get('simultaneous-equations','choice',1).year,10);assert.equal(get('simultaneous-equations','choice',1).scsa.optional,true);assert.equal(get('simultaneous-equations','long',2).marks,9);assert.equal(get('functions-and-graphs','long',1).marks,6);
});
test('new algebra sorts recently added without changing persistent catalogue positions',()=>{
 const old=JSON.parse(read('practice-studio-mathematics-probability-index.json'));const sorted=c.PracticeStudioDatabaseOrder.sort([...old,...index].map(meta=>({q:[null,null,null,null,null,null,null,meta]})),'recent');assert.equal(sorted[0].q[7].id,index[0].id);assert.ok(Date.parse(index[0].addedAt)>Date.parse(old[0].addedAt));assert.ok(read('practice-studio-catalog.js').indexOf('practice-studio-mathematics-algebra-910-index.json')>read('practice-studio-catalog.js').indexOf('practice-studio-mathematics-probability-index.json'));
});

