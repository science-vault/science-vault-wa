// Physics quiz-ready rules: calculation tolerances, formula/working concepts and feedback.
(function(){const B=window.UpperSchoolQuestionBank||[],q=id=>B.find(x=>x.id===id),set=(id,parts)=>{let x=q(id);if(x)x.quizRules={parts}},G=(all,feedback,extra={})=>({all,feedback,...extra}),N=(value,tolerance,feedback)=>({value,tolerance,feedback});
set('PHY12-26-O1-001',[
 [N(14.18,.15,'Horizontal component: vx = 18.0 cos 38° ≈ 14.2 m s⁻¹.'),N(11.08,.15,'Vertical component: vy = 18.0 sin 38° ≈ 11.1 m s⁻¹.'),G([['sin','cos','component']], 'Show correct resolution of the launch velocity into horizontal and vertical components.')],
 [G([['vy','vertical'],['0']], 'At maximum height the vertical velocity is zero.'),G([['v2','u2','2as','kinematic','11.1']], 'Use a vertical-motion equation with a = −9.8 m s⁻².'),N(12.27,.35,'Rise ≈ 6.27 m, so maximum height above ground ≈ 12.3 m.')],
 [G([['6.0','6'],['11.1','11.08'],['9.8','9.81']], 'Use vertical displacement from 6.0 m above ground with the initial vertical velocity.'),G([['quadratic','time','t']], 'Solve the vertical displacement equation for the positive time.'),N(2.70,.08,'Time of flight ≈ 2.70 s.')],
 [G([['horizontal','constant'],['14.2','14.18']], 'Horizontal velocity remains constant.'),G([['distance','range','x'],['time','2.70']], 'Use x = vx t.'),N(38.3,1.0,'Horizontal distance ≈ 38.3 m.')]
]);
set('PHY12-26-O1-002',[
 [G([['f=qvb','qvb','magnetic force']], 'Use F = qvB because velocity is perpendicular to the field.'),N(0.004032,.00015,'F = (3.2×10⁻⁹)(4.5×10⁶)(0.280) ≈ 4.03×10⁻³ N.'),G([['right hand','right-hand'],['positive']], 'Use the right-hand rule for a positive charge.'),G([['up','upward']], 'The initial magnetic-force direction is upward on the diagram.')],
 [G([['mv/qb','mv'],['qb']], 'Use qvB = mv²/r, giving r = mv/(qB).'),G([['6.6'],['4.5'],['3.2'],['0.280']], 'Substitute the stated mass, speed, charge and magnetic field.'),N(3.314e-11,3e-12,'Radius ≈ 3.31×10⁻¹¹ m.'),G([['metre','m']], 'Include the correct unit for radius.')],
 [G([['double','twice'],['radius']], 'Since r ∝ v, doubling speed doubles the radius.'),G([['r proportional v','proportional']], 'State the proportional relationship r ∝ v when q, m and B are unchanged.')]
]);
set('PHY12-26-O1-003',[
 [G([['g=gm/r2','gm/r','gravitational field']], 'Use g = GM/r².'),G([['6.67','5.97','4.22']], 'Substitute G, Earth mass and orbital radius.'),N(0.224,.008,'Gravitational field strength ≈ 0.224 N kg⁻¹.')],
 [G([['v=sqrt','gm/r','centripetal']], 'Equate gravitational and centripetal effects, giving v = √(GM/r).'),G([['6.67','5.97','4.22']], 'Use the orbital radius measured from Earth’s centre.'),N(3072,80,'Orbital speed ≈ 3.07×10³ m s⁻¹.'),G([['m/s','m s']], 'Include speed units.')],
 [G([['2pi','2 pi','2π'],['r'],['v']], 'Use T = 2πr/v.'),G([['second','seconds'],['3600','hour']], 'Convert seconds to hours.'),N(23.98,.6,'Orbital period ≈ 24.0 h.'),G([['hour','h']], 'State the final period in hours.')]
]);
set('PHY12-26-O1-004',[
 [G([['faraday'],['n','turn'],['flux']], 'Use Faraday’s law: |ε| = N|ΔΦ|/Δt.'),G([['6.2','1.8'],['10-5','10^-5','10⁻⁵']], 'Calculate the flux change: 4.4×10⁻⁵ Wb per turn.'),G([['600'],['0.040']], 'Use 600 turns and 0.040 s.'),N(.66,.03,'Average induced emf = 0.66 V.')],
 [G([['lenz']], 'Use Lenz’s law.'),G([['oppose'],['change','increase']], 'The induced field opposes the increase in magnetic flux.'),G([['near face'],['same pole','repel','south','north']], 'Identify the coil face/pole needed to oppose the approaching magnet.'),G([['current'],['right hand','right-hand','direction']], 'Use the right-hand grip rule to relate induced field to current direction.')],
 [G([['twice','double'],['rate','flux']], 'Twice the withdrawal speed gives approximately twice the rate of flux change.'),G([['emf'],['double','twice']], 'The induced emf magnitude is approximately doubled.'),G([['direction'],['reverse','opposite']], 'Withdrawing reverses the change in flux, so the induced emf/current reverses.'),G([['lenz'],['oppose']], 'Relate the reversal to Lenz’s law.')]
]);
set('PHY12-26-O1-005',[
 [G([['minimum','threshold'],['frequency']], 'Threshold frequency is the minimum frequency that produces photoemission.'),G([['photon'],['work function','binding']], 'At threshold, photon energy is just sufficient to overcome the work function.'),G([['kinetic'],['zero','approximately zero']], 'At threshold the maximum emitted-electron kinetic energy is zero.')],
 [G([['below'],['threshold']], 'Below f₀, individual photons have insufficient energy.'),G([['intensity'],['number','photons']], 'Greater intensity increases photon number, not photon energy at fixed frequency.'),G([['no','not'],['electron','emission']], 'Therefore no photoelectrons are emitted below threshold regardless of intensity.')],
 [G([['gradient','slope'],['planck','h']], 'The gradient of Kmax versus f gives Planck’s constant when consistent SI units are used.'),G([['k=hf','hf'],['work function','phi','φ']], 'Use Kmax = hf − φ.'),G([['y intercept','intercept'],['work function']], 'The y-intercept is −φ if the graph is extrapolated.'),G([['threshold','f0'],['hf0']], 'Alternatively φ = hf₀.'),G([['convert','ev','joule']], 'Account for eV-to-joule conversion if required.')]
]);
set('PHY12-26-O1-007',[[G([['speed'],['constant']], 'Constant speed does not mean constant velocity.'),G([['velocity'],['direction'],['change']], 'Velocity changes because its direction changes continuously.'),G([['acceleration','centripetal'],['centre','center']], 'Centripetal acceleration points toward the centre.'),G([['resultant','net force'],['centre','center']], 'The resultant force also points toward the centre.'),G([['force'],['acceleration'],['same direction']], 'Resultant force and acceleration have the same direction.')]]);
set('PHY12-26-O1-008',[[G([['gravity'],['substantial','acts']], 'Gravity still acts strongly on the astronauts and laboratory.'),G([['free fall','free-fall'],['astronaut']], 'The astronauts are in continuous free fall.'),G([['free fall','free-fall'],['laboratory','spacecraft']], 'The orbiting laboratory is also in free fall.'),G([['same','together'],['acceleration']], 'They accelerate together under gravity.'),G([['normal','support'],['zero','negligible']], 'There is negligible normal/support force.'),G([['apparent'],['weightless']], 'The absence of support force produces apparent weightlessness.')]]);
set('PHY12-26-O1-009',[[G([['magnetic flux','flux'],['change','decrease']], 'Pulling the loop out changes/decreases magnetic flux through it.'),G([['faraday']], 'Faraday’s law gives an induced emf when flux changes.'),G([['current'],['closed','loop']], 'The induced emf drives current in the closed conducting loop.'),G([['lenz']], 'Use Lenz’s law to determine the induced field.'),G([['oppose'],['decrease','change']], 'The induced magnetic field opposes the decrease/change in flux.'),G([['right hand','right-hand'],['current']], 'Use the right-hand grip rule to obtain current direction from the induced field.')]]);
})();
// Student Quiz universal-bank bootstrap. This runs only on student-quiz.html and leaves the Assessment Builders unchanged.
if(/(?:^|\/)student-quiz\.html(?:$|[?#])/.test(location.pathname+location.search+location.hash)){
 document.write('<script src="assessment-question-bank.js?v=2026.26"><\/script>');
 document.write('<script src="assessment-question-bank-mathematics.js?v=2026.26"><\/script>');
 document.write('<script src="assessment-question-bank-mathematics-expansion-1.js?v=2026.26"><\/script>');
 document.write('<script src="assessment-question-bank-mathematics-expansion-2.js?v=2026.26"><\/script>');
 document.write('<script src="assessment-question-bank-mathematics-expansion-3.js?v=2026.26"><\/script>');
 document.write('<script src="student-quiz-bank-adapter.js?v=2026.26"><\/script>');
}