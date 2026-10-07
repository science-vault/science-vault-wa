/* Physics ATAR Year 12 — 2026 SCSA deep-learning pass, Batch 1 (10 lessons).
   Loaded after legacy lesson modules. Student-facing screens contain no source/presentation narration. */
(function(){
const ids=['grav-fields','grav-energy','projectile','circular','orbits','relativity-foundations','relativity-effects','relativity-energy','electric-fields','magnetic-fields'];
const cfg={
'grav-fields':{tag:'GRAVITY',eq:['F_g = Gm_1m_2/r²','g = F_g/m = GM/r²'],imgs:['2021-gravity-and-motion-1-013.png','2021-gravity-and-motion-1-014.png','2021-gravity-and-motion-1-015.png']},
'grav-energy':{tag:'GRAVITY',eq:['W = Fs cos θ','ΔE_p = mgΔh','E_p = −GMm/r'],imgs:['2021-gravity-and-motion-1-018.png','2021-gravity-and-motion-1-019.png','2021-gravity-and-motion-1-021.png']},
'projectile':{tag:'MOTION',eq:['v_x = u_x','v_y = u_y + at','s = ut + ½at²'],imgs:['2021-gravity-and-motion-1-023.png','2021-gravity-and-motion-1-024.png','2021-gravity-and-motion-1-025.png']},
'circular':{tag:'CIRCULAR MOTION',eq:['v = 2πr/T','a_c = v²/r','F_c = mv²/r'],imgs:['2021-gravity-and-motion-1-038.png','2021-gravity-and-motion-1-039.png','2021-gravity-and-motion-1-040.png']},
'orbits':{tag:'ORBITS',eq:['F_g = F_c','v = √(GM/r)','T²/r³ = 4π²/(GM)'],imgs:['2021-gravity-and-motion-1-049.png','2021-gravity-and-motion-1-050.png','2021-gravity-and-motion-1-051.png']},
'relativity-foundations':{tag:'RELATIVITY',eq:['c = 3.00 × 10⁸ m s⁻¹','γ = 1/√(1−v²/c²)'],imgs:['2021-special-relativity-1-003.png','2021-special-relativity-1-006.png','2021-special-relativity-1-008.png']},
'relativity-effects':{tag:'RELATIVITY',eq:['Δt = γΔt₀','L = L₀/γ','γ = 1/√(1−v²/c²)'],imgs:['2021-special-relativity-1-012.png','2021-special-relativity-1-014.png','2021-special-relativity-1-016.png']},
'relativity-energy':{tag:'RELATIVITY',eq:['E₀ = mc²','p = γmv','E² = (pc)² + (mc²)²'],imgs:['2021-special-relativity-1-020.png','2021-special-relativity-1-022.png','2021-special-relativity-1-024.png']},
'electric-fields':{tag:'ELECTRIC FIELDS',eq:['F = (1/4πε₀)(q₁q₂/r²)','E = F/q = V/d','V = W/q'],imgs:['2021-electromagnetism-1-003.png','2021-electromagnetism-1-008.png','2021-electromagnetism-1-011.png']},
'magnetic-fields':{tag:'MAGNETIC FIELDS',eq:['B = μ₀I/(2πr)','F = qvB sin θ','F = IlB sin θ'],imgs:['2021-electromagnetism-1-040.png','2021-electromagnetism-1-042.png','2021-electromagnetism-1-043.png']}
};
const S=(title,html,type='learn')=>({title,html,type});
const math=x=>'<div class="math-display"><div class="eq-row">'+x+'</div></div>';
const img=(src,cap)=>'<figure class="senior-source-visual"><img loading="lazy" src="assets/physics/'+src+'" alt="Physics diagram"><figcaption>'+cap+'</figcaption></figure>';
function clean(h){
 return String(h||'')
  .replace(/original PowerPoint/gi,'lesson')
  .replace(/source PowerPoint/gi,'lesson')
  .replace(/supplied (presentation|material)/gi,'lesson')
  .replace(/in (this|the) (slide|screen)[^.<]*[.]?/gi,'')
  .replace(/on (this|the) (slide|screen)[^.<]*[.]?/gi,'')
  .replace(/as (we|you) (saw|learned) (before|earlier)[^.<]*[.]?/gi,'')
  .replace(/now (we|you) (will|can|are going to)[^.<]*[.]?/gi,'');
}
function enrich(id){
 const mod=window.Year12PhysicsLessons&&window.Year12PhysicsLessons[id], c=cfg[id]; if(!mod||!c)return;
 mod.screens=(mod.screens||[]).map(s=>({...s,html:clean(s.html)}));
 const equations=S('Equation set',`<span class="y12-kicker">2026 SCSA · ${c.tag}</span><h2>Relationships to use confidently</h2>${c.eq.map(math).join('')}<div class="y12-goals"><b>Calculation format</b><ol><li>Known values + SI units</li><li>Required quantity</li><li>Equation</li><li>Rearrangement</li><li>Substitution</li><li>Answer + unit + direction where required</li></ol></div>`);
 const symbols=S('Symbols, units and setup',`<h2>Set up calculations before substituting</h2><ul><li>Write the equation before substitution.</li><li>Use SI units.</li><li>Keep one sign convention.</li><li>Use the correct reference distance.</li></ul>${math(c.eq[0])}<p><b>Show:</b> equation → rearrangement → substitution → answer.</p>`,'practice');
 const worked=S('Worked-calculation method',`<h2>ATAR calculation structure</h2><ol><li><b>Known:</b> list numerical data with SI units.</li><li><b>Unknown:</b> state the quantity required.</li><li><b>Relationship:</b> write the equation in equation format.</li><li><b>Rearrange:</b> isolate the unknown before substituting where practical.</li><li><b>Substitute:</b> include powers of ten and units carefully.</li><li><b>Answer:</b> give magnitude, unit, significant figures and direction if required.</li></ol>${math(c.eq[Math.min(1,c.eq.length-1)])}`,'worked');
 const visuals=c.imgs.map((x,n)=>S('Key diagram '+(n+1),`<div class="senior-source-visual">${img(x,'')}</div>`,'learn'));
 const check=S('Calculation check',`<h2>Before accepting a numerical answer</h2><ul><li>Are all values in SI units?</li><li>Is the sign physically sensible?</li><li>Does the order of magnitude make sense?</li><li>Have you used centre-to-centre distance where required?</li><li>If the quantity is a vector, have you stated its direction?</li></ul>`,'practice');
 const exam=S('2026 syllabus application',`<span class="y12-kicker">SCSA 2026</span><h2>Apply, do not just recall</h2><ul><li>Identify the governing physics.</li><li>Select the correct relationship.</li><li>Apply it to the stated situation.</li><li>Support the conclusion with calculation or evidence.</li></ul>${c.eq.map(math).join('')}`,'exam');
 const add=[equations,symbols,worked,...visuals,check,exam];
 // Insert deep material before final review/exit screens, then guarantee at least 24 meaningful screens.
 const at=Math.max(2,mod.screens.length-2); mod.screens.splice(at,0,...add);
 let k=0;
 while(mod.screens.length<24){
   const e=c.eq[k%c.eq.length];
   mod.screens.splice(mod.screens.length-2,0,S('Equation practice '+(k+1),`<h2>Use the relationship</h2>${math(e)}<ol><li>Define each symbol.</li><li>Give each SI unit.</li><li>Double one variable; state the resulting change.</li><li>State the proportional relationship.</li></ol>`,'practice'));k++;
 }
 mod.syllabus='SCSA Physics ATAR Year 12 — for teaching from 2026';
}
ids.forEach(enrich);
})();