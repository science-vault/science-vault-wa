/* Full-working upgrade for Year 12 Physics. Adds four textbook-style worked examples to Gravity Fields. */
(function(){
const m=(lhs,rhs)=>`<div class="math-line"><span class="lhs">${lhs}</span><span class="equals">=</span><span class="rhs">${rhs}</span></div>`;
const frac=(n,d)=>`<span class="math-frac"><span class="num">${n}</span><span class="den">${d}</span></span>`;
const box=(title,problem,steps,answer)=>`<div class="worked-solution"><h2>${title}</h2><p><b>Problem:</b> ${problem}</p><h3>Full working</h3><div class="math-display">${steps}</div><p><b>Answer:</b> ${answer}</p></div>`;
function apply(){const mod=window.Year12PhysicsLessons&&window.Year12PhysicsLessons['grav-fields'];if(!mod)return;
const replacements={
'Worked example 1':box('Worked example 1 — gravitational force','Two objects, each of mass 5.0 × 10³ kg, are separated by 8.0 m centre-to-centre. Calculate the gravitational force between them.',
 m('F',frac('Gm₁m₂','r²'))+m('F',frac('(6.67 × 10⁻¹¹)(5.0 × 10³)(5.0 × 10³)','(8.0)²'))+m('F',frac('1.6675 × 10⁻³','64'))+m('F','2.605 × 10⁻⁵ N'),'<b>2.6 × 10⁻⁵ N</b>, directed toward the other mass. The two objects experience equal-magnitude, opposite-direction forces.'),
'Worked example 2':box('Worked example 2 — surface field strength','A planet has mass 6.0 × 10²⁴ kg and radius 6.4 × 10⁶ m. Calculate its gravitational field strength at the surface.',
 m('g',frac('GM','r²'))+m('g',frac('(6.67 × 10⁻¹¹)(6.0 × 10²⁴)','(6.4 × 10⁶)²'))+m('g',frac('4.002 × 10¹⁴','4.096 × 10¹³'))+m('g','9.7705 N kg⁻¹'),'<b>9.8 N kg⁻¹</b>, directed toward the centre of the planet.'),
'Worked example 3':box('Worked example 3 — field strength at altitude','A satellite is 400 km above Earth. Take Earth’s radius as 6.37 × 10⁶ m and mass as 5.97 × 10²⁴ kg. Calculate g at the satellite.',
 m('h','400 km = 4.00 × 10⁵ m')+m('r','R + h')+m('r','6.37 × 10⁶ + 4.00 × 10⁵ = 6.77 × 10⁶ m')+m('g',frac('GM','r²'))+m('g',frac('(6.67 × 10⁻¹¹)(5.97 × 10²⁴)','(6.77 × 10⁶)²'))+m('g','8.69 N kg⁻¹'),'<b>8.69 N kg⁻¹</b> toward Earth’s centre. Notice that the altitude was not used directly as r.'),
'Worked example 4':box('Worked example 4 — determine planetary mass','At a distance of 7.0 × 10⁶ m from a planet’s centre, the gravitational field strength is 6.5 N kg⁻¹. Determine the mass of the planet.',
 m('g',frac('GM','r²'))+m('gr²','GM')+m('M',frac('gr²','G'))+m('M',frac('(6.5)(7.0 × 10⁶)²','6.67 × 10⁻¹¹'))+m('M',frac('(6.5)(4.9 × 10¹³)','6.67 × 10⁻¹¹'))+m('M','4.78 × 10²⁴ kg'),'<b>4.8 × 10²⁴ kg</b> to two significant figures.')};
mod.screens.forEach(s=>{if(replacements[s.title])s.html=replacements[s.title]});
}
apply();
window.addEventListener('load',apply);
})();