// Physics ATAR 2026 bank cleanup + detailed marking keys for Expansion 1.
// Removes legacy/demo Physics questions with invalid question types and short pseudo-comprehensions.
(function(){
const B=window.UpperSchoolQuestionBank||[];
const removeIds=new Set(['PHY12-26-001','PHY12-26-002','PHY12-26-003','PHY12-26-004','PHY12-26-005','PHY12-26-006','PHY12-26-007','PHY12-26-008','PHY12-26-009','PHY12-26-010','PHY12-26-O1-011','PHY12-26-O1-012']);
for(let i=B.length-1;i>=0;i--) if(removeIds.has(B[i].id)) B.splice(i,1);
const q=id=>B.find(x=>x.id===id),R=(work,marks='1 mark')=>({work,marks});
const set=(id,rows)=>{const x=q(id);if(x){x.markingKeyStandard='worked-line-by-line';x.partKeys=rows;}};
set('PHY12-26-O1-001',[
{rows:[R('v_x = v cosθ = 18.0 cos38° = 14.2 m s⁻¹.'),R('v_y = v sinθ = 18.0 sin38° = 11.1 m s⁻¹.'),R('Horizontal component = 14.2 m s⁻¹; vertical component = 11.1 m s⁻¹ upward.')]},
{rows:[R('At maximum height v_y = 0. Use v_y² = u_y² + 2aΔy.'),R('0 = (11.1)² + 2(−9.8)Δy; Δy = 6.29 m above launch point.'),R('Maximum height above ground = 6.0 + 6.29 = 12.3 m.')]},
{rows:[R('For vertical motion to ground: Δy = −6.0 m; −6.0 = (11.1)t + ½(−9.8)t².'),R('4.9t² − 11.1t − 6.0 = 0.'),R('t = [11.1 + √((11.1)² + 4(4.9)(6.0))]/(9.8) = 2.72 s (positive root).')]},
{rows:[R('Horizontal motion has constant velocity: Δx = v_x t.'),R('Δx = (14.2)(2.72).'),R('Δx = 38.6 m (approximately 39 m).')]}
]);
set('PHY12-26-O1-002',[
{rows:[R('For perpendicular entry: F_B = qvB.'),R('F_B = (3.2 × 10⁻⁹)(4.5 × 10⁶)(0.280).'),R('F_B = 4.03 × 10⁻³ N.'),R('Right-hand rule for a positive charge: force is upward on the page.')]},
{rows:[R('Magnetic force supplies centripetal force: qvB = mv²/r.'),R('r = mv/(qB).'),R('r = [(6.6 × 10⁻²⁷)(4.5 × 10⁶)]/[(3.2 × 10⁻⁹)(0.280)].'),R('r = 3.31 × 10⁻¹¹ m.')]},
{rows:[R('r = mv/(qB), so r ∝ v when m, q and B are constant.'),R('Doubling v doubles the radius.')]}
]);
set('PHY12-26-O1-003',[
{rows:[R('g = GM/r².'),R('g = [(6.67 × 10⁻¹¹)(5.97 × 10²⁴)]/(4.22 × 10⁷)².'),R('g = 0.224 N kg⁻¹.')]},
{rows:[R('For circular orbit: GMm/r² = mv²/r.'),R('v = √(GM/r).'),R('v = √[(6.67 × 10⁻¹¹)(5.97 × 10²⁴)/(4.22 × 10⁷)].'),R('v = 3.07 × 10³ m s⁻¹.')]},
{rows:[R('T = 2πr/v.'),R('T = 2π(4.22 × 10⁷)/(3.07 × 10³).'),R('T = 8.64 × 10⁴ s.'),R('T = (8.64 × 10⁴)/3600 = 24.0 h.')]}
]);
set('PHY12-26-O1-004',[
{rows:[R('Faraday’s law: |ε| = N|ΔΦ/Δt|.'),R('ΔΦ = 6.2 × 10⁻⁵ − 1.8 × 10⁻⁵ = 4.4 × 10⁻⁵ Wb.'),R('|ε| = 600(4.4 × 10⁻⁵)/(0.040).'),R('|ε| = 0.660 V.')]},
{rows:[R('As the magnet approaches, magnetic flux through the coil increases.'),R('By Lenz’s law, the induced current produces a magnetic field that opposes the increase in flux.'),R('The face of the coil nearest the approaching pole therefore becomes the same magnetic polarity as the approaching pole.'),R('The current direction is then obtained using the right-hand grip rule for the required coil field.')]},
{rows:[R('With the magnet withdrawn twice as quickly, |ΔΦ/Δt| doubles for the same flux change.'),R('Therefore the magnitude of the induced emf doubles.'),R('Withdrawal reverses the sign of ΔΦ/Δt.'),R('Therefore the induced emf/current direction reverses, consistent with Lenz’s law.')]}
]);
set('PHY12-26-O1-005',[
{rows:[R('Threshold frequency f₀ is the minimum light frequency that can eject electrons from the metal.'),R('At f₀, photon energy equals the work function: hf₀ = φ.'),R('Hence K_max = 0 at the x-intercept.')]},
{rows:[R('Photon energy is E = hf.'),R('If f < f₀, each photon has energy less than the work function φ.'),R('Increasing intensity supplies more low-energy photons, not more energy per photon, so no photoelectrons are emitted.')]},
{rows:[R('Use K_max = hf − φ.'),R('The gradient of a K_max versus f graph is h.'),R('Determine the gradient ΔK_max/Δf from two well-separated points on the best-fit line.'),R('The y-intercept is −φ, so the magnitude of the y-intercept gives the work function.'),R('Equivalently, φ = hf₀ using the x-intercept f₀.')]}
]);
set('PHY12-26-O1-006',[
{rows:[R('In the Earth frame, the flashes are emitted simultaneously.'),R('Observer M moves to the right, toward the light from B and away from the light from A.'),R('Because light travels at c in every inertial frame, M receives the flash from B before the flash from A.'),R('Therefore the two flashes are not received simultaneously by M.')]},
{rows:[R('Simultaneity of spatially separated events is frame-dependent.'),R('The spacecraft and Earth observers are in relative motion.'),R('Both measure light travelling at c.'),R('The Lorentz transformation therefore gives different time coordinates for the two emission events in the spacecraft frame, so events simultaneous in Earth’s frame need not be simultaneous in the spacecraft frame.')]},
{rows:[R('The speed of light in vacuum has the same value c for all inertial observers.'),R('This is independent of the motion of the source or observer.')]}
]);
const short={
'PHY12-26-O1-007':[R('Although speed is constant, velocity changes because its direction changes continuously.','2 marks'),R('The acceleration is centripetal and directed toward the centre of the circle.'),R('The resultant force is also directed toward the centre and provides the centripetal acceleration.','2 marks')],
'PHY12-26-O1-008':[R('The astronaut and orbiting laboratory are both acted on by Earth’s gravity and accelerate together toward Earth.','2 marks'),R('They are in continuous free fall while their tangential motion carries them around Earth.'),R('There is negligible normal/support force on the astronaut, so apparent weight is approximately zero.','3 marks')],
'PHY12-26-O1-009':[R('Pulling the loop out changes the magnetic flux through the loop.','2 marks'),R('By Faraday’s law, changing magnetic flux induces an emf/current.'),R('By Lenz’s law, the induced current produces a magnetic field that opposes the decrease/change in flux.','2 marks'),R('Use the right-hand grip rule to determine the current direction required to produce that opposing field.')],
'PHY12-26-O1-010':[R('Electron: fundamental particle in the lepton family; it has no quark composition.','2 marks'),R('Proton: hadron/baryon composed of uud quarks.','2 marks'),R('Neutron: hadron/baryon composed of udd quarks.','2 marks'),R('Protons and neutrons are composite hadrons; the electron is fundamental.')]
};
for(const [id,rows] of Object.entries(short)){const x=q(id);if(x){x.markingKeyStandard='worked-line-by-line';x.keyRows=rows;}}
})();