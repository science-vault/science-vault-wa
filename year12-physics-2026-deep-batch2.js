/* Physics ATAR Year 12 — 2026 SCSA deep-learning pass, Batch 2.
   Lessons 11–17. Clean student-facing presentation: no slide narration or diagram-analysis prompts. */
(function(){
const ids=['motors','induction','generators','transformers','quantum','particle-physics','cosmology'];
const cfg={
'motors':{tag:'ELECTROMAGNETISM',eq:['F = IlB sin θ','τ = NIAB sin θ'],imgs:['2021-electromagnetism-1-044.jpeg','2021-electromagnetism-1-046.png','2021-electromagnetism-1-048.png']},
'induction':{tag:'ELECTROMAGNETISM',eq:['ε = ℓvB sin θ','Φ = BA⊥','ε = −NΔΦ/Δt'],imgs:['2021-electromagnetism-1-052.png','2021-electromagnetism-1-055.png','2021-electromagnetism-1-057.png']},
'generators':{tag:'ELECTROMAGNETISM',eq:['εmax = 2NℓvB','εmax = 2πNBAf','εrms = εmax/√2'],imgs:['2021-electromagnetism-1-061.png','2021-electromagnetism-1-063.png','2021-electromagnetism-1-066.png']},
'transformers':{tag:'ELECTROMAGNETISM',eq:['Vp/Vs = Np/Ns','P = VI','Ploss = I²R'],imgs:['2021-electromagnetism-1-071.png','2021-electromagnetism-1-074.png','2021-electromagnetism-1-077.png']},
'quantum':{tag:'MODERN PHYSICS',eq:['c = fλ','E = hf = hc/λ','Ek,max = hf − φ','λ = h/p'],imgs:['2021-wave-particle-duality-and-the-quantum-theory-010.jpeg','2021-wave-particle-duality-and-the-quantum-theory-026.png','2021-wave-particle-duality-and-the-quantum-theory-052.png']},
'particle-physics':{tag:'MODERN PHYSICS',eq:['W = qΔV','r = p/(qB)','E² = p²c² + m²c⁴'],imgs:['2021-the-standard-model-1-004.png','2021-the-standard-model-1-011.png','2021-the-standard-model-1-018.png']},
'cosmology':{tag:'MODERN PHYSICS',eq:['v = H₀d','z = Δλ/λ₀'],imgs:['2021-the-standard-model-1-025.gif','2021-the-standard-model-1-029.png','2021-the-standard-model-1-033.png']}
};
const S=(title,html,type='learn')=>({title,html,type});
const E=x=>'<div class="math-display"><div class="eq-row">'+x+'</div></div>';
const I=(src)=>'<figure class="senior-source-visual"><img loading="lazy" src="assets/physics/'+src+'" alt="Physics teaching diagram"></figure>';
function clean(h){return String(h||'')
.replace(/supplied PowerPoints?/gi,'lesson')
.replace(/supplied Electromagnetism PPT/gi,'lesson')
.replace(/supplied Standard Model PowerPoint/gi,'lesson')
.replace(/original teaching visual[^.<]*[.]?/gi,'')
.replace(/from your supplied[^.<]*[.]?/gi,'')
.replace(/from the supplied[^.<]*[.]?/gi,'')
.replace(/in (this|the) (slide|screen)[^.<]*[.]?/gi,'')
.replace(/on (this|the) (slide|screen)[^.<]*[.]?/gi,'')
.replace(/now (we|you) (will|can|are going to)[^.<]*[.]?/gi,'')
.replace(/we (begin|build|start)[^.<]*[.]?/gi,'');}
function enrich(id){const m=window.Year12PhysicsLessons&&window.Year12PhysicsLessons[id],c=cfg[id];if(!m||!c)return;
m.screens=(m.screens||[]).map(s=>({...s,html:clean(s.html)}));
const additions=[
S('Required equations','<span class="y12-kicker">SCSA 2026 · '+c.tag+'</span><h2>Required relationships</h2>'+c.eq.map(E).join('')),
S('Calculation format','<h2>Calculation format</h2><ol><li>List known values in SI units.</li><li>State the required quantity.</li><li>Write the equation.</li><li>Rearrange before substitution where needed.</li><li>Substitute values with units.</li><li>Give the answer with unit, significant figures and direction where required.</li></ol>','practice'),
S('Units and signs','<h2>Units and signs</h2><ul><li>Convert prefixes before substitution.</li><li>Keep one direction/sign convention throughout.</li><li>Use vector direction when the quantity requires it.</li><li>Check the final magnitude is physically reasonable.</li></ul>','practice'),
...c.imgs.map((x,n)=>S('Key diagram '+(n+1),I(x))),
S('Equation practice','<h2>Equation practice</h2>'+c.eq.map(E).join('')+'<ol><li>Define each symbol.</li><li>Give the SI unit for each measurable quantity.</li><li>Identify which variables are vectors.</li><li>State one proportional relationship shown by the equations.</li></ol>','practice'),
S('ATAR calculation check','<h2>Check the working</h2><ul><li>Correct equation?</li><li>Correct SI units?</li><li>Correct rearrangement?</li><li>Correct substitution?</li><li>Correct unit and direction?</li></ul>','practice')];
const at=Math.max(2,m.screens.length-1);m.screens.splice(at,0,...additions);
let n=1;while(m.screens.length<24){const q=c.eq[(n-1)%c.eq.length];m.screens.splice(m.screens.length-1,0,S('Calculation practice '+n,'<h2>Calculation practice</h2>'+E(q)+'<p><b>Task:</b> rearrange for each variable in turn, then state the SI unit of the quantity isolated.</p>','practice'));n++;}
m.syllabus='SCSA Physics ATAR Year 12 — for teaching from 2026';}
ids.forEach(enrich);
})();