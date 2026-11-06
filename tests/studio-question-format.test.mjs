import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('source answer lines disappear while meaningful blanks and text remain',()=>{
 const c=vm.createContext({});vm.runInContext(read('studio-question-format.js'),c);const text=c.StudioQuestionFormat.text;
 assert.equal(text('____________________________').trim(),'');
 assert.equal(text('_\u00ad_\u00ad_\u00ad_\u00ad_').trim(),'');
 assert.equal(text('Complete AC = ______ (given)').trim(),'Complete AC = □ (given)');
 assert.equal(text('Find graph _____. (1 mark)').trim(),'Find graph □ . (1 mark)');
 assert.equal(text('BC = ____ (given)').trim(),'BC = □ (given)');
 assert.equal(text('π = 3.14; x ≤ 4; y ≥ −2; 0.28'),'π = 3.14; x ≤ 4; y ≥ −2; 0.28');
 assert.equal(text('Explain. ............................').replace(/\s+/g,' ').trim(),'Explain. □');
 assert.equal(text('_'.repeat(100000)).trim(),'');
});
test('graph choices are complete and keep their original reading order',()=>{
 const readQ=(slug,n)=>JSON.parse(read('practice-studio-mathematics-'+slug+'-910.json')).find(q=>q.id.endsWith('choice-q'+n));
 for(const [slug,n,keys] of [
  ['coordinate-geometry',4,['8897ccbd','eed96cb6','eeca2d3e','30db7b3d']],
  ['functions-and-graphs',2,['a6f2538a','c5e4992e','033931f5','048327e9']],
  ['functions-and-graphs',7,['9449af32','773b08dc','f52454f1','0f9ec211']],
  ['functions-and-graphs',10,['d1fcd42d','e636eba2','780fbed0','34259d97']],
 ]){
  const q=readQ(slug,n);assert.equal(q.optionsHtml.length,4);q.optionsHtml.forEach((option,i)=>{assert.equal([...option.matchAll(/<img\b/g)].length,1);assert.ok(option.includes(keys[i]),q.id+' '+i);});
 }
});
test('all former Mathematics scans have native editable text and no automatic response lines',()=>{
 const p=JSON.parse(read('practice-studio-editable-progress.json'));assert.equal(p.converted.length,628);assert.equal(p.pending.length,0);assert.equal(p.nativeExisting.length,500);
 for(const id of p.converted)assert.ok(id.startsWith('maths-'));
 const adapter=read('studio-assessment-word.js');assert.match(adapter,/querySelectorAll\('img,svg'\)/);
});
test('the builder retains a genuine three-option source question',()=>{
 const c=vm.createContext({});vm.runInContext(read('practice-studio-catalog.js'),c);vm.runInContext(read('studio-assessment-bank.js'),c);
 const raw=JSON.parse(read('practice-studio-mathematics-graphs-tables-charts.json')).find(q=>q.number===25),q=c.StudioAssessmentBank.convert(raw);
 assert.equal(raw.options.length,3);assert.equal(q.correctAnswer,1);assert.equal(q.marks,raw.marks);
 assert.match(q.question,/A\. /);assert.match(q.question,/B\. /);assert.match(q.question,/C\. /);assert.doesNotMatch(q.question,/D\. /);
});
test('reviewed equation images preserve clipped source formulas and isotope notation',()=>{
 const c=vm.createContext({});vm.runInContext(read('studio-source-image-text.js'),c);const entries=Object.values(c.StudioSourceImageText.images);
 assert.equal(entries.length,75);
 const nuclear=entries.find(x=>x.questions.includes('physics-2020-u1-q2')&&x.html.includes('mmultiscripts'));
 assert.ok(nuclear);assert.match(nuclear.html,/mprescripts/);
 const power=entries.find(x=>x.html.replace(/<[^>]+>/g,'').includes('peak')&&x.html.includes('mfrac'));
 assert.ok(power,'The original average-power equation retains its peak quantities');
 const tail=c.StudioSourceImageText.tails['methods12-local24-u3-q13'].html;
 assert.match(tail,/1.03/);assert.match(tail,/increments formula/);assert.match(tail,/dD/);assert.match(tail,/3 marks/);assert.match(tail,/2 marks/);
 assert.ok(entries.every(x=>/^[a-f0-9]{64}$/.test(x.sourceSHA256)));
});
