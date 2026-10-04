// Physics ATAR detailed marking keys — current and future standard.
// Every calculation must show formula -> substitution -> working -> final answer, with marks beside each line.
// Every drawing/graph response must show the completed marking-key diagram/graph.
(function(){
const B=window.UpperSchoolQuestionBank||[],Q=id=>B.find(q=>q.id===id),R=(work,marks='1 mark')=>({work,marks});
const table=rows=>`<table style="width:100%;border-collapse:collapse;margin-top:8px">${rows.map(r=>`<tr><td style="border:1px solid #b8c2ca;padding:8px">${r.work}</td><td style="border:1px solid #b8c2ca;padding:8px;width:82px;text-align:center;font-weight:700">${r.marks}</td></tr>`).join('')}</table>`;
const set=(id,keys,keyDiagram)=>{const q=Q(id);if(!q)return;keys.forEach(k=>k.key=table(k.rows));q.partKeys=keys;q.markingKeyStandard='worked-line-by-line';if(keyDiagram)q.keyDiagram=keyDiagram;};
const hall=`<div class="diagram-wrap"><svg class="physics-diagram" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg"><defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L0 6L6 3z"/></marker></defs><polygon points="150,100 545,100 620,160 225,160" fill="#eef2f4" stroke="#222" stroke-width="2"/><text x="165" y="132" font-size="20">− − − −</text><text x="475" y="150" font-size="20">+ + + +</text><line x1="340" y1="225" x2="340" y2="65" stroke="#111" stroke-width="3" marker-end="url(#a)"/><text x="350" y="78" font-size="18">B</text><line x1="270" y1="130" x2="455" y2="130" stroke="#111" stroke-width="3" marker-end="url(#a)"/><text x="290" y="116" font-size="17">carrier drift</text><line x1="455" y1="180" x2="520" y2="180" stroke="#b00020" stroke-width="3" marker-end="url(#a)"/><text x="525" y="185" font-size="17">E</text></svg></div>`;
const escape=`<div class="diagram-wrap"><svg class="physics-diagram" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg"><line x1="80" y1="145" x2="660" y2="145" stroke="#222" stroke-width="2"/><line x1="80" y1="245" x2="80" y2="45" stroke="#222" stroke-width="2"/><path d="M100 65 C135 125 190 165 260 190 C360 218 490 230 635 235" fill="none" stroke="#111" stroke-width="3"/><path d="M100 225 C145 195 205 175 275 163 C390 150 515 147 640 146" fill="none" stroke="#b00020" stroke-width="3"/><text x="450" y="168" font-size="17">U = −GMm/r</text><text x="585" y="137" font-size="16">E total = 0</text><text x="520" y="142" font-size="15">U → 0 from below</text></svg></div>`;
const crt=`<div class="diagram-wrap"><svg class="physics-diagram" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg"><rect x="70" y="70" width="580" height="170" rx="75" fill="#fafcfd" stroke="#222" stroke-width="2"/><line x1="135" y1="155" x2="570" y2="155" stroke="#111" stroke-width="2"/><rect x="280" y="95" width="190" height="12" fill="#ddd" stroke="#111"/><rect x="280" y="203" width="190" height="12" fill="#ddd" stroke="#111"/><text x="350" y="88" font-size="22">A: +</text><text x="350" y="238" font-size="22">B: −</text><text x="490" y="145" font-size="17">F(e⁻) upward</text><text x="490" y="180" font-size="17">E downward</text></svg></div>`;
const motor=`<div class="diagram-wrap"><svg class="physics-diagram" viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg"><rect x="80" y="85" width="120" height="140" fill="#eef2f4" stroke="#222"/><rect x="520" y="85" width="120" height="140" fill="#eef2f4" stroke="#222"/><text x="125" y="165" font-size="42">N</text><text x="565" y="165" font-size="42">S</text><rect x="295" y="105" width="130" height="100" fill="none" stroke="#111" stroke-width="4"/><text x="240" y="90" font-size="17">↑ magnetic force</text><text x="430" y="225" font-size="17">↓ magnetic force</text><text x="270" y="270" font-size="17">opposite forces form a couple → torque</text></svg></div>`;
set('PHY12-26-O2-001',[
{rows:[R('Moving charge carriers experience magnetic force: F = qvB.'),R('Carriers move toward one side, producing charge separation.'),R('The resulting transverse electric field grows until electric and magnetic forces balance.')]},
{rows:[R('F_E = F_B; qE = qvB.'),R('Cancel q: E = vB.'),R('Therefore E is proportional to vB.')]},
{rows:[R('Axes labelled: I (A) on x-axis; V_H (mV) on y-axis.'),R('Sensible linear scales.'),R('Points: (40,0.82), (60,1.21), (80,1.63), (100,2.04), (120,2.43).'),R('Straight line of best fit close to origin.')]},
{rows:[R('Choose well-separated best-fit points, e.g. (40,0.82) and (120,2.43).'),R('gradient = (2.43−0.82)/(120−40) = 1.61/80 = 0.0201 mV A⁻¹.'),R('gradient = 2.01 × 10⁻² mV A⁻¹ = 2.01 × 10⁻⁵ V A⁻¹.')]},
{rows:[R('I = V_H/gradient = 1.80/(2.01 × 10⁻²).'),R('I = 89.6 A ≈ 90 A.')]},
{rows:[R('Advantage: electrically isolated current measurement; sensor need not be inserted in series.'),R('Valid uncertainty: temperature/carrier density/geometry/position/external field.'),R('Explains how the factor changes Hall voltage/calibration and inferred current.')]}
],hall);
set('PHY12-26-O2-002',[
{rows:[R('g decreases significantly as distance r increases.'),R('mgh assumes approximately constant g; use U = −GMm/r for escape.')]},
{rows:[R('U = 0 is defined at infinite separation.'),R('Positive work is required to move a mass against gravity to infinity.'),R('Thus a bound object at finite r has U < 0.')]},
{rows:[R('U = −GMm/r.'),R('U = −[(6.67×10⁻¹¹)(9.39×10²⁰)(420)]/(4.73×10⁵).'),R('U = −5.56 × 10⁷ J.')]},
{rows:[R('E_total = 0: ½mv² − GMm/R = 0.'),R('½v² = GM/R; v = √(2GM/R).'),R('v = √{[2(6.67×10⁻¹¹)(9.39×10²⁰)]/(4.73×10⁵)}.'),R('v = 5.15 × 10² m s⁻¹ = 515 m s⁻¹.')]},
{rows:[R('U curve below zero for every finite r.'),R('U approaches zero asymptotically as r increases.'),R('At escape speed U = −K; completed curve shown on marking-key diagram.')]},
{rows:[R('½mv² = GMm/R.'),R('Cancel m: ½v² = GM/R.'),R('v_escape = √(2GM/R), independent of probe mass.')]}
],escape);
set('PHY12-26-O2-003',[
{rows:[R('Top plate A: +.'),R('Bottom plate B: −; E downward gives an upward electric force on e⁻.')]},
{rows:[R('F_E = F_B: Eq = Bvq.'),R('E = Bv.'),R('v = E/B.')]},
{rows:[R('v = (2.40×10⁴)/(1.60×10⁻³).'),R('v = 1.50 × 10⁷ m s⁻¹.')]},
{rows:[R('F_B = F_c: qvB = mv²/r.'),R('qB = mv/r.'),R('q/m = v/(Br).')]},
{rows:[R('q/m = v/(Br).'),R('r = 5.35 cm = 5.35×10⁻² m.'),R('q/m = (1.50×10⁷)/[(1.60×10⁻³)(5.35×10⁻²)].'),R('q/m = 1.75 × 10¹¹ C kg⁻¹.')]},
{rows:[R('Different cathodes contain different materials/atoms.'),R('Same q/m shows the emitted particles have the same intrinsic property.'),R('Therefore they are common constituents of matter.'),R('Supports electrons being subatomic particles.')]}
],crt);
set('PHY12-26-O2-004',[
{rows:[R('F = NBIL sinθ; θ = 90°, so F = NBIL.'),R('F = 80(0.450)(2.20)(0.120).'),R('F = 9.50 N.')]},
{rows:[R('Opposite active sides experience equal magnetic forces.'),R('Forces are opposite, so resultant translational force is zero.'),R('Separated lines of action form a couple and produce torque.')]},
{rows:[R('τ_max = NIAB.'),R('A = (0.120)(0.080) = 9.60×10⁻³ m².'),R('τ_max = 80(2.20)(9.60×10⁻³)(0.450).'),R('τ_max = 0.760 N m.')]},
{rows:[R('Increase N, I or coil area A.'),R('τ_max = NIAB, so increasing that factor increases torque.')]}
],motor);
})();