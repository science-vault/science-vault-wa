/* Physics ATAR: additions to the assembled live course; no modules or screens added.
   SCSA 2026 syllabuses and formula booklet reviewed 8 October 2026. */
(function(){'use strict';
if(window.PhysicsATARCompletion)return;
const additions={
  "y11-foundations": {
    "question": "A trolley travels (1.200 ± 0.005) m in (0.800 ± 0.010) s. Calculate its average speed and absolute uncertainty using the course uncertainty rules. Explain whether repeating the timing removes a zero error.",
    "points": [
      "v = s/t = 1.200/0.800 = 1.50 m s⁻¹.",
      "For division, add relative uncertainties: 0.005/1.200 + 0.010/0.800 = 0.0167, or 1.67%.",
      "Absolute uncertainty = (1.50)(0.0167) = 0.025 m s⁻¹. A consistent uncertainty report is (1.50 ± 0.03) m s⁻¹.",
      "Repeating measurements can reduce uncertainty in the mean from random scatter. A consistent zero offset needs calibration or correction and remains after averaging."
    ]
  },
  "y11-heat-temperature": {
    "question": "A large bucket and a small cup of water are both at 30.0 °C. Compare their mean particle kinetic energy and total internal energy. Explain what happens when the cup is placed against a 10.0 °C metal block.",
    "points": [
      "For the same substance at the same temperature, the mean particle kinetic energy is equal.",
      "The bucket contains more water particles, so it has greater total internal energy under the same physical conditions.",
      "Energy transfers from the warmer water to the colder block because of the temperature difference.",
      "The temperature difference decreases until thermal equilibrium is reached, assuming the combined system is isolated."
    ]
  },
  "y11-specific-latent": {
    "question": "Calculate the energy required to turn 0.100 kg of ice at −10.0 °C into liquid water at 20.0 °C. Use cᵢ = 2100 J kg⁻¹ K⁻¹, Lf = 3.34 × 10⁵ J kg⁻¹ and cw = 4180 J kg⁻¹ K⁻¹.",
    "points": [
      "Warm the solid: Q₁ = mcᵢΔT = (0.100)(2100)(10.0) = 2100 J.",
      "Melt at 0 °C: Q₂ = mLf = (0.100)(3.34 × 10⁵) = 33 400 J.",
      "Warm the liquid: Q₃ = mcwΔT = (0.100)(4180)(20.0) = 8360 J.",
      "Qtotal = 43 860 J = 4.39 × 10⁴ J. During melting, added energy changes particle interactions rather than increasing temperature."
    ]
  },
  "y11-transfer-calorimetry": {
    "question": "Mix 0.200 kg of water at 80.0 °C with 0.300 kg at 20.0 °C in an insulated container of negligible heat capacity. Find the final temperature. Predict the effect of a real container initially at 20.0 °C.",
    "points": [
      "At equilibrium both portions have a common final temperature T.",
      "Energy lost = energy gained: (0.200)c(80.0 − T) = (0.300)c(T − 20.0).",
      "16.0 − 0.200T = 0.300T − 6.00, giving T = 44.0 °C.",
      "A container initially at 20.0 °C also gains energy, so the equilibrium temperature is below 44.0 °C. Include Ccontainer(T − 20.0) on the gain side."
    ]
  },
  "y11-vectors": {
    "question": "A student walks 120 m east, then 50.0 m south. Find the distance and displacement, and the average velocity if the journey lasts 85.0 s.",
    "points": [
      "Distance = 120 + 50.0 = 170 m. Displacement components are 120 m east and 50.0 m south.",
      "Displacement magnitude = √(120² + 50.0²) = 130 m.",
      "Direction = tan⁻¹(50.0/120) = 22.6° south of east.",
      "Average velocity = displacement/time = 1.53 m s⁻¹, 22.6° south of east. Average speed is 2.00 m s⁻¹ and answers a different question."
    ]
  },
  "y11-motion-graphs": {
    "question": "A velocity–time graph rises linearly from 0 to +8.00 m s⁻¹ during 0–4.00 s, then falls linearly to −4.00 m s⁻¹ at 10.0 s. Find displacement and total distance.",
    "points": [
      "First signed area = ½(4.00)(8.00) = +16.0 m.",
      "Second acceleration = (−4.00 − 8.00)/6.00 = −2.00 m s⁻², so velocity crosses zero at t = 8.00 s.",
      "Areas from 4–8 s and 8–10 s are +16.0 m and −4.00 m. Displacement = 16.0 + 16.0 − 4.00 = +28.0 m.",
      "Distance adds absolute areas: 16.0 + 16.0 + 4.00 = 36.0 m. The negative area represents motion in the opposite direction."
    ]
  },
  "y11-kinematics": {
    "question": "A ball is thrown vertically upward at 12.0 m s⁻¹ from a platform 5.00 m above the ground. Calculate the time to reach the ground and its impact velocity. Ignore air resistance; g = 9.80 m s⁻².",
    "points": [
      "Choose upward positive: u = +12.0 m s⁻¹, a = −9.80 m s⁻², s = −5.00 m.",
      "−5.00 = 12.0t − 4.90t² gives t = [12.0 + √(144 + 98.0)]/9.80 = 2.81 s. Reject the negative time.",
      "v = u + at = 12.0 − 9.80(2.81) = −15.6 m s⁻¹, or 15.6 m s⁻¹ downward.",
      "The ball has zero vertical velocity at its highest point, but acceleration remains 9.80 m s⁻² downward throughout the ideal flight."
    ]
  },
  "y11-newton": {
    "question": "A 65.0 kg person stands on a scale in a lift accelerating upward at 1.50 m s⁻². Find the scale reading in newtons and identify the Newton’s third-law partner of the normal force on the person. Use g = 9.80 m s⁻².",
    "points": [
      "The person’s free-body diagram contains upward normal force N and downward weight mg.",
      "With upward positive, N − mg = ma; N = 65.0(9.80 + 1.50) = 735 N.",
      "The scale measures contact force, so its force reading exceeds the person’s 637 N weight.",
      "The reaction partner is the downward force the person exerts on the scale. Weight acts on the person too and therefore is not that reaction partner."
    ]
  },
  "y11-friction-slopes": {
    "question": "A 4.00 kg box slides down a 25.0° incline with μk = 0.200. Calculate its acceleration. Explain whether f = μsN gives the actual static friction on a stationary box.",
    "points": [
      "N = mg cos25.0° = 35.5 N for a box with no other perpendicular force.",
      "Kinetic friction = μkN = 7.11 N and acts uphill.",
      "Fnet = mg sin25.0° − μkmg cos25.0°; a = 9.80(sin25.0° − 0.200cos25.0°) = 2.37 m s⁻² downhill.",
      "Static friction adjusts as needed up to μsN. Equality applies at impending slipping, not for every stationary situation."
    ]
  },
  "y11-momentum-impulse": {
    "question": "A 0.150 kg ball approaches a wall at +20.0 m s⁻¹ and rebounds at −15.0 m s⁻¹. Contact lasts 0.0100 s. Determine the impulse and average net force.",
    "points": [
      "Initial momentum pi = (0.150)(20.0) = +3.00 kg m s⁻¹.",
      "Final momentum pf = (0.150)(−15.0) = −2.25 kg m s⁻¹.",
      "Impulse J = pf − pi = −5.25 N s, directed away from the wall.",
      "Average net force = J/Δt = −525 N. Use the change in signed momentum; subtracting speed magnitudes would underestimate the impulse."
    ]
  },
  "y11-collisions": {
    "question": "A 0.500 kg trolley moving at +3.00 m s⁻¹ sticks to a stationary 1.00 kg trolley. Calculate their velocity and the kinetic energy converted into other forms. Assume negligible external impulse.",
    "points": [
      "Conserve momentum: (0.500)(3.00) + (1.00)(0) = (1.50)v.",
      "v = +1.00 m s⁻¹.",
      "Initial Ek = ½(0.500)(3.00²) = 2.25 J; final Ek = ½(1.50)(1.00²) = 0.750 J.",
      "1.50 J becomes internal energy, deformation or sound. Total energy is conserved, although the collision is perfectly inelastic and kinetic energy decreases."
    ]
  },
  "y11-work-energy-power": {
    "question": "A 20.0 kg load moves up a ramp through a vertical height of 2.00 m in 5.00 s. Friction converts 80.0 J into internal energy. The load starts and ends at rest. Find the input work, useful power and efficiency.",
    "points": [
      "Useful increase in gravitational potential energy = mgh = (20.0)(9.80)(2.00) = 392 J.",
      "Input work = 392 + 80.0 = 472 J since ΔEk = 0.",
      "Useful average power = 392/5.00 = 78.4 W. Input power = 94.4 W.",
      "Efficiency = 392/472 × 100 = 83.1%. State which energy transfer counts as useful before calculating the ratio."
    ]
  },
  "y11-wave-foundations": {
    "question": "Two successive crests on a displacement–distance graph are 0.800 m apart. At a fixed point, 10 complete oscillations take 4.00 s. Calculate period, frequency and wave speed.",
    "points": [
      "Wavelength λ = 0.800 m because adjacent crests have the same phase.",
      "Period T = 4.00/10 = 0.400 s.",
      "Frequency f = 1/T = 2.50 Hz; wave speed v = fλ = 2.00 m s⁻¹.",
      "A distance graph gives spatial separation. A time graph gives temporal separation. The particles oscillate locally while the disturbance transfers energy."
    ]
  },
  "y11-wave-behaviour": {
    "question": "An ultrasound pulse returns from a boundary after 80.0 μs. Sound speed in the tissue is 1540 m s⁻¹. Calculate the boundary depth and explain why frequency stays constant when the wave enters another medium.",
    "points": [
      "Convert the round-trip time: 80.0 μs = 8.00 × 10⁻⁵ s.",
      "Total distance = vt = (1540)(8.00 × 10⁻⁵) = 0.1232 m.",
      "Depth = vt/2 = 0.0616 m = 6.16 cm because the pulse travels outward and back.",
      "The source fixes the oscillation rate. At the boundary frequency remains continuous; a changed speed changes wavelength according to λ = v/f."
    ]
  },
  "y11-wave-interference": {
    "question": "Two coherent, in-phase speakers emit 680 Hz sound travelling at 340 m s⁻¹. At P the path difference is 0.750 m. Predict the interference. A tuning fork instead produces 4.00 beats per second with a 440 Hz reference: find possible frequencies.",
    "points": [
      "λ = v/f = 340/680 = 0.500 m.",
      "Path difference/λ = 0.750/0.500 = 1.50, a half-integer, so the waves arrive in antiphase.",
      "Destructive interference occurs; complete cancellation requires equal amplitudes.",
      "Beat frequency = |f − 440| = 4.00 Hz, so f = 436 Hz or 444 Hz. One beat measurement alone does not resolve the ambiguity."
    ]
  },
  "y11-standing-waves": {
    "question": "A 0.850 m pipe is closed at one end. Sound speed is 340 m s⁻¹. Find the first three allowed frequencies and explain the displacement boundary conditions.",
    "points": [
      "The closed end is a displacement node because the air cannot move longitudinally through it. The open end is approximately a displacement antinode.",
      "Fundamental λ = 4L = 3.40 m, so f₁ = v/(4L) = 100 Hz.",
      "Allowed frequencies for the ideal pipe are odd harmonics: 100 Hz, 300 Hz and 500 Hz.",
      "The second allowed resonance is the third harmonic. Pressure nodes and antinodes are opposite to displacement nodes and antinodes."
    ]
  },
  "y11-nuclear-structure": {
    "question": "Describe beta-minus decay at the nucleon and quark levels. State how the parent nucleus’s proton number and mass number change, and explain the role of the antineutrino.",
    "points": [
      "A neutron changes to a proton, emitting an electron and an electron antineutrino: n → p + e⁻ + ν̄e.",
      "One down quark changes to an up quark, so ddu becomes uud. Charge remains conserved.",
      "The nucleus gains one proton: Z increases by 1 while A stays constant.",
      "The antineutrino carries energy and momentum. Together with nuclear recoil, it explains why emitted electrons have a range of kinetic energies rather than one fixed energy."
    ]
  },
  "y11-nuclear-equations-half-life": {
    "question": "A detector records 820 counts per minute initially and 220 counts per minute 12.0 min later. Background is a constant 20 counts per minute. Determine the half-life.",
    "points": [
      "Correct both readings: initial source count rate = 820 − 20 = 800 min⁻¹; later rate = 220 − 20 = 200 min⁻¹.",
      "Remaining fraction = 200/800 = 1/4 = (1/2)².",
      "Two half-lives occur in 12.0 min, giving t½ = 6.00 min.",
      "Radioactive decay is random for an individual nucleus, but large populations follow a predictable exponential trend. Subtracting background is essential before taking the ratio."
    ]
  },
  "y11-radiation-dose": {
    "question": "A 0.0200 kg tissue sample absorbs 3.00 × 10⁻⁵ J from radiation. Calculate absorbed dose and the course-model equivalent dose if the radiation weighting factor is 20. Explain why alpha radiation is especially concerning inside the body.",
    "points": [
      "Absorbed dose D = E/m = (3.00 × 10⁻⁵)/0.0200 = 1.50 × 10⁻³ Gy.",
      "Equivalent dose H = wRD = (20)(1.50 × 10⁻³) = 3.00 × 10⁻² Sv = 30.0 mSv.",
      "Alpha particles deposit energy densely through strong ionisation over a short range in tissue.",
      "External alpha exposure is largely stopped by the outer skin layer, but an internal source exposes nearby living tissue. Equivalent dose is a protection model, not a prediction of an individual clinical outcome."
    ]
  },
  "y11-nuclear-energy": {
    "question": "A nucleus has mass defect 0.0300 u and mass number 4. Use 1 u = 1.6605 × 10⁻²⁷ kg and c = 3.00 × 10⁸ m s⁻¹. Find its binding energy and binding energy per nucleon.",
    "points": [
      "Δm = (0.0300)(1.6605 × 10⁻²⁷) = 4.9815 × 10⁻²⁹ kg.",
      "Binding energy Eb = Δmc² = 4.48 × 10⁻¹² J.",
      "Using 1 eV = 1.602 × 10⁻¹⁹ J, Eb = 28.0 MeV, so Eb/A = 7.00 MeV per nucleon.",
      "For positive binding energy, use the mass of separated nucleons minus the bound nucleus’s mass. Match nuclear masses with nucleons or consistently use atomic masses with hydrogen atoms."
    ]
  },
  "y11-charge-current-voltage": {
    "question": "A current of 0.250 A flows through a lamp for 120 s across a 6.00 V potential difference. Calculate charge, the number of electrons passing a cross-section, and energy transferred. Use e = 1.602 × 10⁻¹⁹ C.",
    "points": [
      "q = IΔt = (0.250)(120) = 30.0 C.",
      "Number of electrons = |q|/e = 30.0/(1.602 × 10⁻¹⁹) = 1.87 × 10²⁰.",
      "Energy transferred = qΔV = (30.0)(6.00) = 180 J.",
      "Conventional current points in the direction of positive charge flow. In a metal the electron drift is opposite to conventional current."
    ]
  },
  "y11-resistance-energy-power": {
    "question": "An ohmic 24.0 Ω heater operates across 12.0 V for 10.0 min. Find current, power and energy transferred. Predict the power if the voltage doubles and resistance stays constant.",
    "points": [
      "I = V/R = 12.0/24.0 = 0.500 A.",
      "P = VI = 6.00 W; Δt = 600 s gives E = PΔt = 3600 J.",
      "With constant R, P = V²/R, so doubling voltage quadruples power to 24.0 W.",
      "The fixed-resistance assumption requires unchanged physical conditions, especially temperature. A filament lamp’s resistance changes as it heats."
    ]
  },
  "y11-series-parallel-circuits": {
    "question": "A 4.00 Ω resistor is in series with a parallel combination of 6.00 Ω and 3.00 Ω across 12.0 V. Determine equivalent resistance, total current and the two branch currents.",
    "points": [
      "Parallel equivalent resistance: 1/Rp = 1/6.00 + 1/3.00, giving Rp = 2.00 Ω.",
      "Total resistance = 4.00 + 2.00 = 6.00 Ω; total current = 12.0/6.00 = 2.00 A.",
      "Voltage across the series resistor = (2.00)(4.00) = 8.00 V, leaving 4.00 V across each parallel branch.",
      "Branch currents are 4.00/6.00 = 0.667 A and 4.00/3.00 = 1.33 A; their sum equals 2.00 A by charge conservation."
    ]
  },
  "y11-components-ac-safety": {
    "question": "Compare an RCD and a fuse when a person provides an unintended path to Earth. Explain why double-insulated appliances do not rely on protective earth.",
    "points": [
      "An RCD compares active and neutral currents. Some current returning by an unintended Earth path creates an imbalance that can trigger disconnection.",
      "A fuse responds to excessive current by melting. A dangerous leakage current can be too small to exceed the fuse rating.",
      "Double insulation separates accessible parts from live conductors through two protective insulation barriers or reinforced insulation.",
      "Protection devices reduce specific risks but do not justify touching live components. An RCD may not detect a balanced active-to-neutral current through a person."
    ]
  },
  "static-equilibrium": {
    "question": "A uniform 4.00 m horizontal beam weighs 200 N and has supports at its ends. A 600 N load is 1.00 m from the left support. Find both support reactions.",
    "points": [
      "The beam’s weight acts at its centre, 2.00 m from the left support.",
      "Take moments about the left support: RB(4.00) = 200(2.00) + 600(1.00).",
      "RB = 250 N upward. Vertical equilibrium gives RA + RB = 800 N, so RA = 550 N upward.",
      "Both net force and net torque are zero. Choosing a pivot at a support removes that support’s unknown reaction from the torque equation."
    ]
  },
  "inclined-planes": {
    "question": "A 10.0 kg crate is pulled at constant speed up a 30.0° slope by a force parallel to the surface. μk = 0.200 and g = 9.80 m s⁻². Find the pulling force and work over 5.00 m.",
    "points": [
      "N = mg cos30.0° = 84.9 N; friction = μkN = 17.0 N uphill-opposing, hence downhill.",
      "Constant speed means zero net force along the slope: F = mg sin30.0° + μkN = 66.0 N.",
      "Pulling work = Fs = (66.0)(5.00) = 330 J.",
      "Energy check: gain in GPE = mg(5.00sin30.0°) = 245 J and frictional transfer = 84.9 J, adding to 330 J."
    ]
  },
  "grav-fields": {
    "question": "A planet has twice Earth’s mass and 1.50 times Earth’s radius. Find its surface gravitational field strength if Earth’s is 9.80 N kg⁻¹. Determine the planet’s field at an altitude equal to its own radius.",
    "points": [
      "gplanet/gEarth = (Mplanet/MEarth)/(Rplanet/REarth)² = 2.00/1.50².",
      "Surface field = 8.71 N kg⁻¹ towards the planet’s centre.",
      "At altitude h = Rplanet, centre distance r = Rplanet + h = 2Rplanet.",
      "The field becomes one-quarter of the surface field: 2.18 N kg⁻¹. Surface radius and altitude must not be confused."
    ]
  },
  "grav-energy": {
    "question": "A 500 kg object is lifted slowly through 120 m near Earth’s surface. Calculate the change in gravitational potential energy and the work done by gravity. Explain when the mgh model becomes unsuitable. Use g = 9.80 N kg⁻¹.",
    "points": [
      "Near the surface over a small height, treat g as uniform: ΔU = mgΔh = (500)(9.80)(120) = 5.88 × 10⁵ J.",
      "Gravity acts opposite the displacement, so Wgravity = −ΔU = −5.88 × 10⁵ J.",
      "Slow lifting with unchanged kinetic energy requires external work +5.88 × 10⁵ J if other energy transfers are negligible.",
      "For distances comparable to the planet’s radius, g changes significantly. The wider-distance extension uses U = −GMm/r with zero at infinity and takes a difference between endpoints."
    ]
  },
  "projectile": {
    "question": "A ball is launched horizontally at 15.0 m s⁻¹ from a 20.0 m cliff. Find flight time, horizontal distance and impact speed. Ignore air resistance; g = 9.80 m s⁻².",
    "points": [
      "Use vertical motion to find time: 20.0 = ½(9.80)t², so t = 2.02 s.",
      "Horizontal acceleration is zero, so x = uxt = (15.0)(2.02) = 30.3 m.",
      "Downward impact component = gt = 19.8 m s⁻¹.",
      "Impact speed = √(15.0² + 19.8²) = 24.8 m s⁻¹, directed 52.9° below horizontal. Resolve the final velocity components before finding its magnitude."
    ]
  },
  "circular": {
    "question": "A 0.200 kg object on a light string moves in a vertical circle of radius 0.800 m. At the bottom its speed is 7.00 m s⁻¹. Find the top speed and top tension if mechanical energy is conserved. Use g = 9.80 m s⁻².",
    "points": [
      "The height gain from bottom to top is 2r = 1.60 m.",
      "Energy: vtop² = vbottom² − 4gr = 49.0 − 31.36 = 17.64, so vtop = 4.20 m s⁻¹.",
      "At the top the inward direction is downward, so T + mg = mvtop²/r.",
      "T = (0.200)(17.64)/0.800 − (0.200)(9.80) = 2.45 N. The positive tension confirms the string can stay taut at the top."
    ]
  },
  "orbits": {
    "question": "Two satellites orbit the same planet in circular orbits. Satellite B has twice satellite A’s orbital radius. Compare their speed, period and apparent weight.",
    "points": [
      "For gravity supplying radial acceleration, GMm/r² = mv²/r, hence v = √(GM/r).",
      "vB/vA = 1/√2 = 0.707.",
      "T = 2πr/v, so TB/TA = 2√2 = 2.83, equivalent to T² proportional to r³.",
      "Both can have zero apparent weight while orbiting because they are freely falling without a support force. Their gravitational weights are nonzero; at twice the radius, gravitational force on equal masses is one-quarter."
    ]
  },
  "relativity-foundations": {
    "question": "A spaceship moves at 0.800c relative to Earth and emits a forward light pulse. State the pulse speed measured in each inertial frame, calculate the Lorentz factor and explain why simply adding velocities fails.",
    "points": [
      "Both inertial frames measure the vacuum light speed as c.",
      "γ = 1/√(1 − 0.800²) = 1/0.600 = 1.67.",
      "The two postulates state that the laws of physics are the same in all inertial frames and vacuum light speed is invariant.",
      "The classical sum c + 0.800c violates the invariant-speed postulate because classical reasoning assumes common time and length. Frames instead assign different time and space intervals."
    ]
  },
  "relativity-effects": {
    "question": "Muons have a mean proper lifetime of 2.20 μs and move at 0.980c relative to Earth. Find the Earth-frame mean lifetime and mean distance travelled. Use c = 3.00 × 10⁸ m s⁻¹.",
    "points": [
      "Proper time is measured between events at one position in the muon’s rest frame; τ = 2.20 μs.",
      "γ = 1/√(1 − 0.980²) = 5.03.",
      "Earth-frame mean lifetime t = γτ = 11.1 μs, and mean travel distance vt = 3.25 × 10³ m.",
      "In the muon frame its lifetime is 2.20 μs while Earth’s travel distance is length-contracted. Individual decay is probabilistic, so this mean distance does not describe every muon."
    ]
  },
  "relativity-energy": {
    "question": "A particle has rest energy 938 MeV and travels at 0.600c. Calculate its total energy, kinetic energy and momentum in MeV/c. Explain whether its mass changes.",
    "points": [
      "γ = 1/√(1 − 0.600²) = 1.25.",
      "Total energy E = γmc² = (1.25)(938) = 1172.5 MeV, or 1.17 × 10³ MeV.",
      "Ek = E − Erest = 234.5 MeV = 235 MeV. p = γmv = γ(0.600)(Erest/c) = 704 MeV/c.",
      "Rest mass m remains constant. Increasing speed increases total energy and momentum; kinetic energy must not be replaced by total energy."
    ]
  },
  "general-relativity": {
    "question": "A student says GPS needs only special-relativistic time dilation. Explain the missing effect and how the two effects combine for an orbiting GPS clock compared with a clock on Earth.",
    "points": [
      "Satellite motion causes its clock to tick slower relative to an Earth-based reference in the special-relativistic comparison.",
      "A satellite is higher in Earth’s gravitational potential; general relativity predicts its clock ticks faster than a lower clock from that effect.",
      "The effects have opposite signs and must both be included. For typical GPS orbits, the gravitational contribution exceeds the motion contribution, producing a net faster satellite clock.",
      "Uncorrected timing offsets accumulate as position errors because the receiver infers distance from signal travel time. The statement needs both physical mechanisms, not just a claim that gravity affects clocks."
    ]
  },
  "electric-fields": {
    "question": "Parallel plates have a potential difference of 300 V and separation 0.0200 m. Find field magnitude and an electron’s force and energy gain when accelerated through the full voltage. Use e = 1.602 × 10⁻¹⁹ C.",
    "points": [
      "E = |ΔV|/d = 300/0.0200 = 1.50 × 10⁴ V m⁻¹, from positive to negative plate.",
      "Force magnitude = eE = 2.40 × 10⁻¹⁵ N. The electron’s force is opposite to the field because its charge is negative.",
      "Kinetic-energy gain = e|ΔV| = 4.81 × 10⁻¹⁷ J = 300 eV if other energy transfers are negligible.",
      "With signed potentials, ΔU = qΔV and Wfield = −qΔV. State the direction of motion to avoid mixing potential-energy gain with work done by the field."
    ]
  },
  "magnetic-fields": {
    "question": "A proton moves perpendicular to a 0.400 T magnetic field at 2.00 × 10⁶ m s⁻¹. Find magnetic force and path radius. Use q = 1.602 × 10⁻¹⁹ C and m = 1.673 × 10⁻²⁷ kg.",
    "points": [
      "F = qvB = (1.602 × 10⁻¹⁹)(2.00 × 10⁶)(0.400) = 1.28 × 10⁻¹³ N.",
      "The magnetic force supplies the radial net force: qvB = mv²/r.",
      "r = mv/(qB) = 0.0522 m.",
      "Force is perpendicular to velocity, so it changes direction without doing work. Speed and kinetic energy stay constant in the ideal magnetic field; reverse the positive-charge force direction for an electron."
    ]
  },
  "motors": {
    "question": "A DC motor is connected to 24.0 V and has winding resistance 2.00 Ω. Its running back emf is 18.0 V. Find running and initial current, and explain the role of the split-ring commutator.",
    "points": [
      "Net winding voltage while running is Vsupply − εback = 6.00 V.",
      "Running current = 6.00/2.00 = 3.00 A.",
      "Initially the stationary coil has negligible back emf, so initial current = 24.0/2.00 = 12.0 A. This explains the large starting current.",
      "The split-ring commutator reverses current in the rotating coil each half-turn so the torque continues in the same rotation sense. Back emf opposes the supply according to Lenz’s law."
    ]
  },
  "induction": {
    "question": "A 200-turn coil of area 0.0100 m² lies with its normal parallel to a field. The field falls from +0.500 T to zero in 0.0400 s. Calculate induced emf magnitude and explain its magnetic direction.",
    "points": [
      "Flux per turn Φ = BAcosθ; θ = 0°, so initial flux = 0.00500 Wb and final flux = 0.",
      "|ε| = N|ΔΦ|/Δt = 200(0.00500)/0.0400 = 25.0 V.",
      "The induced current creates a field in the original field’s direction to oppose the decrease in flux.",
      "Lenz’s law opposes the change in flux. State the viewing direction before assigning clockwise or anticlockwise current; the minus sign is not a negative emf magnitude."
    ]
  },
  "generators": {
    "question": "An ideal AC generator has 100 turns, coil area 0.0200 m², B = 0.500 T and rotation frequency 50.0 Hz. Find peak and RMS emf. Explain the relative phases of flux and emf.",
    "points": [
      "ω = 2πf = 314 rad s⁻¹.",
      "εmax = NBAω = (100)(0.500)(0.0200)(314) = 314 V.",
      "For sinusoidal output, εrms = εmax/√2 = 222 V.",
      "With Φ = BAcosωt, ε = NBAωsinωt. Emf is zero at maximum or minimum flux and greatest in magnitude when flux crosses zero, because emf depends on the rate of flux change."
    ]
  },
  "transformers": {
    "question": "An ideal transformer steps 240 V RMS up to 24.0 kV RMS while transmitting 12.0 kW. Find the turns ratio and currents. Compare line losses at the two voltages for a 10.0 Ω transmission line.",
    "points": [
      "Ns/Np = Vs/Vp = 24 000/240 = 100.",
      "Primary current = P/Vp = 12 000/240 = 50.0 A; secondary current = 12 000/24 000 = 0.500 A.",
      "At the stated currents, line losses I²R are 25 000 W at 50.0 A and 2.50 W at 0.500 A, a factor of 10 000 difference.",
      "The enormous low-voltage loss shows that the proposed low-voltage transmission cannot deliver the stated useful power with those assumptions. The comparison illustrates why raising voltage reduces current and resistive loss for a specified transmitted power."
    ]
  },
  "particle-physics": {
    "question": "A proton moves at 0.800c in a 1.50 T field perpendicular to its velocity. Find its path radius. Use m = 1.673 × 10⁻²⁷ kg, q = 1.602 × 10⁻¹⁹ C and c = 3.00 × 10⁸ m s⁻¹.",
    "points": [
      "γ = 1/√(1 − 0.800²) = 1.67.",
      "p = γmv = (1.6667)(1.673 × 10⁻²⁷)(2.40 × 10⁸) = 6.69 × 10⁻¹⁹ kg m s⁻¹.",
      "r = p/(qB) = (6.69 × 10⁻¹⁹)/[(1.602 × 10⁻¹⁹)(1.50)] = 2.78 m.",
      "Use relativistic momentum at this speed. Electric fields add kinetic energy; a perpendicular magnetic field steers the particle and does no work on it."
    ]
  },
  "quantum": {
    "question": "A metal has work function 2.20 eV and is illuminated by photons of energy 3.10 eV. Find maximum photoelectron kinetic energy and stopping potential. Predict the effects of doubling intensity at fixed frequency.",
    "points": [
      "Ek,max = hf − φ = 3.10 − 2.20 = 0.900 eV = 1.44 × 10⁻¹⁹ J.",
      "eVs = Ek,max, so stopping-potential magnitude is 0.900 V.",
      "At fixed frequency, higher intensity means more photons per second. Above threshold, the emitted-electron rate can increase under the same collection conditions.",
      "Maximum electron kinetic energy and stopping potential remain unchanged. Below threshold, increasing intensity alone cannot cause photoemission in the course’s single-photon model."
    ]
  },
  "cosmology": {
    "question": "A galaxy has low redshift z = 0.0200. Estimate its recession speed and distance using c = 3.00 × 10⁵ km s⁻¹ and H₀ = 70.0 km s⁻¹ Mpc⁻¹. Explain why redshift alone is weaker evidence than several independent observations.",
    "points": [
      "For sufficiently small redshift, v ≈ cz = (3.00 × 10⁵)(0.0200) = 6000 km s⁻¹.",
      "Hubble’s law gives d = v/H₀ = 6000/70.0 = 85.7 Mpc.",
      "The low-redshift approximation and large-scale recession model are assumptions. At large z, interpreting redshift as an ordinary Doppler speed v = cz is inappropriate.",
      "The CMB spectrum and light-element abundances independently support a hot early universe. A model must explain all these observations as well as the expansion relation."
    ]
  }
};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const section=(title,body)=>'<section class="physics-completion"><h3>'+title+'</h3>'+body+'</section>';
function add(id,title,heading,body){const m=window.Year11PhysicsLessons?.[id]||window.Year12PhysicsLessons?.[id];if(!m)throw Error('Missing Physics module: '+id);const s=m.screens.find(x=>x.title===title);if(!s)throw Error('Missing Physics screen: '+id+' / '+title);s.html+=section(heading,body);}
const fig=(label,svg,caption)=>'<figure class="physics-model"><svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+escape(label)+'" viewBox="0 0 680 300">'+svg+'</svg><figcaption>'+caption+'</figcaption></figure>';
const defs='<defs><marker id="phyArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="context-stroke"/></marker></defs>';
function arrow(x,y,a,b,color='#1564a6'){return '<path d="M'+x+' '+y+'L'+a+' '+b+'" stroke="'+color+'" stroke-width="3" marker-end="url(#phyArrow)"/>';}
function text(x,y,s){return '<text x="'+x+'" y="'+y+'" fill="#142b43" font-size="18">'+s+'</text>';}
const source='<p class="physics-source">Course reference: <a href="https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/science/physics" target="_blank" rel="noopener">SCSA Physics course materials</a>. These questions and suggested marking points are original practice, not official examination questions or an official marking key.</p>';
for(const [id,data]of Object.entries(additions)){
 const m=window.Year11PhysicsLessons?.[id]||window.Year12PhysicsLessons?.[id];if(!m)throw Error('Missing Physics module: '+id);
 const s=m.screens[m.screens.length-1];
 s.html+=section('Exam practice with marking points','<p><strong>Original ATAR-style problem · '+data.points.length+' marks</strong></p><p>'+escape(data.question)+'</p><label class="physics-response-label">Write your working and explanation<textarea data-physics-response="'+id+'" rows="6" placeholder="State the model, show substitutions and include units."></textarea></label><details class="physics-marking"><summary>Show worked solution and marking points</summary><ol>'+data.points.map(p=>'<li>'+escape(p)+' <span class="physics-mark">[1 mark]</span></li>').join('')+'</ol><p>Compare each step with your own response. Equivalent correct reasoning can earn the same practice mark. A multiple-choice score alone does not demonstrate extended-response exam readiness.</p></details>'+source);
}
add('y11-foundations','Graph gradients','Graphs, anomalous data and uncertainty','<p>A best-fit line represents the trend across the data rather than joining measurements dot to dot. Plot the independent variable on the horizontal axis, label units and draw uncertainty bars. A point well outside the trend is a reason to inspect the measurement and method. Record it and justify any exclusion rather than deleting it simply to improve a fit.</p><p>Find a gradient using two widely separated points on the best-fit line. Its units are the vertical-axis units divided by horizontal-axis units. For a straight position–time graph the gradient has units m s⁻¹; for a voltage–current graph it has units V A⁻¹ = Ω. A nonzero intercept can indicate a physical offset or systematic error and should be interpreted in context.</p><p>If appropriate, draw the steepest and shallowest lines consistent with uncertainty bars. A useful estimate is Δgradient = (maximum gradient − minimum gradient)/2. Repeated measurements improve precision, while calibration addresses a systematic offset. For comparison with an accepted value, percentage difference = |measured − accepted|/|accepted| × 100%; this is different from percentage uncertainty.</p>');
add('y11-transfer-calorimetry','Refrigerators and reverse-cycle systems','Energy accounting in a heat pump','<p>The refrigerant evaporates at low pressure, taking energy from the cold region. A compressor supplies electrical work and raises refrigerant pressure and temperature. The hot refrigerant condenses and transfers energy to the warm region. Expansion lowers pressure before the cycle repeats. A reverse-cycle system changes which heat exchanger warms the room.</p><p>For one cycle, Qhot = Qcold + Win. If 400 J of work moves 1000 J from the cold region, 1400 J reaches the hot region. Moving thermal energy is different from converting all input work directly into heat: heating output can exceed electrical input because energy also comes from the surroundings. Total energy remains conserved.</p>');
add('y11-standing-waves','Pipe boundaries diagram','Pressure and displacement are different patterns','<p>At a closed pipe end, longitudinal displacement is zero but the pressure variation is maximum. At an open end, pressure stays approximately atmospheric and displacement variation is maximum. Thus a displacement node corresponds to a pressure antinode. Use the quantity labelled on the diagram before assigning a node.</p><p>Both-open pipes and strings fixed at both ends have λn = 2L/n for n = 1, 2, 3… under their respective displacement boundary conditions. A pipe with one closed end has λn = 4L/n for odd n only. These are ideal models: a real open pipe needs an end correction, and sound speed changes with conditions.</p>');
add('y11-nuclear-energy','Stars and the elements','Where the elements formed','<p>The early hot universe produced mainly hydrogen and helium, with small amounts of lithium. Stars fuse light nuclei into heavier nuclei; massive stars can build nuclei through stages ending around the iron group. Fusion of nuclei beyond that region does not release energy in the same way because binding energy per nucleon no longer increases.</p><p>Neutron capture in evolved stars and violent events, including neutron-star mergers, contributes to many heavier elements. Stellar explosions distribute enriched material that later forms stars and planets. The statement “all elements heavier than hydrogen were made in stars” misses primordial helium and lithium.</p>');
add('grav-energy','Choosing the correct model','Core model and wider-distance extension','<p>For the 2026 core syllabus, practise W = Fs cosθ and ΔU = mgΔh in a uniform field. The inverse-radius potential, escape speed and orbital-energy relations elsewhere in this module extend that model. Derive or use such relations when a problem supplies the necessary information; do not assume every extension formula is provided in the examination booklet.</p>');
add('relativity-foundations','AT​​AR practice'.replace('​​',''),'2026 scope and frame labels','<p>Use the two postulates, time dilation, length contraction and explicitly identified reference frames. SCSA removed the relativistic velocity-addition relationships in its February 2026 update. Older repository slides or past papers may still contain them; treat those calculations as extension material rather than required 2026 formula recall.</p><p>Always identify the events before choosing proper time. Proper time joins two events at the same position in one inertial frame. Proper length is measured in the object’s rest frame using simultaneous endpoint measurements. The two definitions refer to different measurements.</p>');
add('induction','Motional emf','Geometry and the complete Faraday relation','<p>For the stated straight-conductor geometry, ε = ℓvB sinθ, where θ is the angle between velocity and magnetic field and the active conductor length has the required orientation. A rod moving parallel to B does not cut field lines and has zero motional emf in this model.</p><p>For a fixed-turn coil, ε = −NΔΦ/Δt = −NΔ(BA⊥)/Δt. Keep the factor −N in both forms. A⊥ = A cosθ when θ is measured from the area normal. If N itself changes, reason from the change in total flux linkage NΦ rather than taking N outside the change automatically.</p>');
add('induction','Eddy currents','Induction hotplates and regenerative braking','<p>An induction hotplate carries alternating current in a coil, creating a changing magnetic field. This induces eddy currents in a suitable conducting pan; electrical resistance converts their energy into internal energy. Magnetic materials can also have hysteresis losses. The supply provides the energy, and pan properties affect heating.</p><p>During regenerative braking the driven motor acts as a generator. Its induced current produces a torque opposing rotation, transferring some vehicle kinetic energy to electrical energy for storage. Conversion losses and battery limits mean recovery is incomplete; ordinary braking may still be required.</p>');
add('particle-physics','Cyclotron principle','Cyclotron limits, synchrotrons and mass spectrometers','<p>For a nonrelativistic cyclotron, qvB = mv²/r gives r = mv/(qB), and T = 2πm/(|q|B). The approximately constant period allows the alternating gap voltage to accelerate particles each half-turn. At relativistic speeds, p = γmv increases and the simple constant-frequency condition fails. Synchrotrons adjust fields and accelerating timing to maintain the required orbit and phase.</p><p>In a velocity selector with crossed fields, opposite electric and magnetic forces balance when |q|E = |q|vB, so v = E/B. Selected ions then enter a magnetic analyser; r = mv/(|q|B) at low speed. For a known charge and selected speed, a larger radius identifies larger mass. Neutral particles cannot be accelerated or steered by these electric-charge forces.</p>');
add('quantum','Electromagnetic radiation','Transverse fields, polarisation and interference','<p>An electromagnetic wave has oscillating electric and magnetic fields perpendicular to each other and to its propagation direction. It travels through a vacuum without a material medium. An oscillating source charge produces radiation at its oscillation frequency; the electric field can drive receiving charges at that frequency.</p><p>Polarisation restricts the orientation of the electric-field oscillation and therefore supports a transverse model. Longitudinal sound in air does not show this same polarisation behaviour. In Young’s experiment, coherent light passing through two slits gives bright regions where path difference is nλ and dark regions where it is (n + ½)λ for in-phase slits. A single photon or electron produces a localised detection; many detections build the interference distribution when path information is not obtained.</p>');
add('quantum','Photon energy','Photon momentum and beam power','<p>A photon has zero rest mass but carries energy and momentum: E = hf = hc/λ and p = E/c = h/λ. A beam’s intensity depends on energy delivered per area per time. At fixed frequency, increasing intensity increases the number of photons delivered, without increasing the energy of each photon.</p><p><strong>Worked example:</strong> a monochromatic 2.00 mW beam has λ = 500 nm. Each photon carries 3.98 × 10⁻¹⁹ J, so the emission rate is P/Ephoton = (2.00 × 10⁻³)/(3.98 × 10⁻¹⁹) = 5.03 × 10¹⁵ photons s⁻¹. Use beam power in watts and wavelength in metres.</p>');
add('quantum','Threshold frequency','Finding Planck’s constant from a graph','<p>Rearrange Ek,max = hf − φ into straight-line form. On a graph of maximum kinetic energy in joules against frequency in hertz, gradient = h in J s, extrapolated vertical intercept = −φ in joules and horizontal intercept = φ/h = f₀. The extrapolated negative-energy segment represents the algebraic line; electrons do not emerge with negative kinetic energy.</p><p>On a stopping-potential graph, Vs = (h/e)f − φ/e: the gradient is h/e, not h. On an energy graph in eV, the numerical gradient also corresponds to h/e. Convert axis units before interpreting the gradient. For example, a Vs–f gradient of 4.14 × 10⁻¹⁵ V s gives h = e × gradient = 6.63 × 10⁻³⁴ J s. Use a best-fit line and include gradient uncertainty rather than calculating a separate h from each noisy point.</p>');
add('quantum','Atomic spectra','Energy-level transitions, absorption and ionisation','<p>For emission from Ei to a lower Ef, the photon energy is the positive difference Ei − Ef. For absorption, a bound electron takes a photon that matches the gap to an allowed higher level. A photon above the ionisation energy can remove the electron, with the excess becoming kinetic energy if recoil is negligible.</p><p><strong>Worked example:</strong> given hydrogen levels −3.40 eV and −1.51 eV, a downward transition releases 1.89 eV = 3.03 × 10⁻¹⁹ J. λ = hc/ΔE = 657 nm using h = 6.63 × 10⁻³⁴ J s. A ground-state hydrogen atom requiring 13.6 eV to ionise can absorb a 15.0 eV ionising photon and release an electron with approximately 1.40 eV kinetic energy.</p><p>Hot, low-density gas produces characteristic emission lines. Cooler gas viewed in front of a continuous source removes characteristic wavelengths, producing absorption lines. Level differences determine the line positions; identifying their pattern permits spectral analysis of composition.</p>');
add('quantum','Bohr model','Fluorescence, phosphorescence and X-rays','<p>In fluorescence, absorption excites a system, some energy can transfer to its surroundings, and rapid emission follows. The emitted photon is commonly lower in energy and longer in wavelength than the absorbed photon. Phosphorescence involves long-lived excited states with restricted transitions, so emission can continue after excitation stops. These energy-level models explain fluorescent biological labels, security markings and glow materials.</p><p>X-ray tubes accelerate electrons through a large voltage onto a target. Electron deceleration produces a continuous bremsstrahlung spectrum; transitions into inner-shell vacancies produce characteristic X-ray lines. The maximum photon energy is e|ΔV| if an electron transfers all its gained energy to one photon. For 30.0 kV, Emax = 30.0 keV and λmin = hc/Emax = 4.14 × 10⁻¹¹ m. Most electrons transfer some energy into heating, so not every photon has this maximum energy.</p><p>The Bohr model successfully connects hydrogen levels with spectra but fixed classical electron orbits do not explain all atoms or modern quantum behaviour. Use supplied levels to analyse transitions rather than treating the model as a complete account of every material.</p>');
add('quantum','Evidence and model development','Blackbody radiation and quantum devices','<p>A blackbody is an ideal absorber and emitter. At one temperature it emits a broad continuous thermal spectrum with a finite maximum. Raising temperature increases emitted power and shifts the peak towards shorter wavelengths. Quantisation concerns the energy exchanged in packets; it does not turn a thermal continuum into a gas line spectrum.</p><p>Classical equipartition with unrestricted high-frequency modes predicts an unbounded short-wavelength output, the ultraviolet catastrophe. Planck’s allowed energy exchanges in multiples of hf suppress high-frequency emission when available thermal energy is insufficient. This accounts for the observed spectrum. Wien’s law and the Stefan–Boltzmann law are useful extensions if supplied, rather than assumed 2026 formula recall.</p><p>In a laser, stimulated emission produces a photon matching the stimulating photon’s frequency and phase in the same mode. Pumping and a population inversion make amplification possible, with an optical cavity supporting selected modes. LEDs emit photons when electrons and holes recombine across an energy gap; the gap controls the typical photon energy. Photovoltaic cells absorb sufficiently energetic photons to create mobile carriers, and a junction field separates charges to produce electrical output. Link each device’s energy transfer to quantised states rather than describing every device as photoelectric emission into a vacuum.</p>');
// Exact geometric models, with captions identifying assumptions.
add('static-equilibrium','Practice 1 — support reactions','Beam model for the worked practice',fig('Beam with two supports, a 600 N load and 200 N beam weight',defs+'<rect x="100" y="120" width="480" height="16" fill="#506e86"/>'+arrow(100,235,100,142)+arrow(580,235,580,142)+arrow(220,45,220,118,'#b94822')+arrow(340,45,340,118,'#b94822')+text(70,270,'RA = 550 N')+text(480,270,'RB = 250 N')+text(170,30,'600 N')+text(300,30,'200 N')+text(120,185,'1.00 m')+text(290,185,'beam centre')+text(265,225,'Total length 4.00 m'),'The original practice load is 1.00 m from the left support. Beam weight acts at its midpoint. Arrows show forces on the beam.'));
add('projectile','Horizontal launch from a height','Independent motion components',fig('Horizontal projectile with constant horizontal velocity and downward acceleration',defs+'<path d="M110 55L110 235L600 235" fill="none" stroke="#657b8e" stroke-width="2"/><path d="M110 55Q350 55 550 235" fill="none" stroke="#1564a6" stroke-width="3"/>'+arrow(110,55,245,55)+arrow(320,105,320,175,'#b94822')+text(130,35,'vx constant')+text(345,155,'a = g downward')+text(125,275,'Same flight time for horizontal and vertical motion'),'Ideal model: air resistance is negligible, ax = 0 and ay = −g when upward is positive. The velocity changes direction even though vx remains constant.'));
add('quantum','Atomic spectra','Reading an energy-level model',fig('Hydrogen levels with downward emission and upward absorption',defs+'<path d="M70 230H570M70 90H570M70 55H570" stroke="#506e86" stroke-width="3"/>'+text(75,260,'−13.6 eV: ground state')+text(75,118,'−3.40 eV')+text(75,40,'−1.51 eV')+arrow(380,58,380,87,'#b94822')+arrow(530,224,530,95)+text(240,165,'Emission: 1.89 eV')+text(390,210,'Absorption: 10.2 eV'),'Level heights are schematic. Calculate photon energy from the labelled differences, rather than measuring the drawn distance. The downward transition emits energy; the upward transition absorbs it.'));
add('y11-standing-waves','Pipe boundaries diagram','Closed–open fundamental model',fig('Closed pipe displacement node and open pipe displacement antinode', '<path d="M100 70V230M100 70H570M100 230H570" stroke="#506e86" stroke-width="4" fill="none"/><path d="M100 150C260 150 410 80 570 80M100 150C260 150 410 220 570 220" stroke="#1564a6" stroke-width="3" fill="none"/>'+text(70,265,'Closed: node')+text(435,265,'Open: antinode')+text(150,40,'Displacement envelope: L = λ/4'),'Curves show the extremes of longitudinal displacement along the pipe, not transverse motion of air. The closed-end pressure pattern has an antinode.'));
add('generators','AC waveform','Flux and induced emf across a revolution',fig('Flux and emf values at five quarter-turn positions','<path d="M50 210H630" stroke="#657b8e" stroke-width="2"/>'+[0,1,2,3,4].map((n)=>text(55+n*130,245,n*90+'°')).join('')+text(40,35,'Angle from field to area normal')+text(40,80,'Flux:')+text(40,155,'Emf:')+['+max','0','−max','0','+max'].map((s,n)=>text(145+n*105,80,s)).join('')+['0','+max','0','−max','0'].map((s,n)=>text(145+n*105,155,s)).join(''),'For Φ = BA cosθ with increasing θ, ε = NBAω sinθ. The sign depends on the chosen coil normal and terminal convention. Flux and emf have a quarter-cycle phase difference.'));
add('y11-motion-graphs','Practice: graph reasoning','Signed areas and a direction reversal',fig('Velocity graph with positive and negative triangular areas','<path d="M80 30V260M80 205H620" stroke="#657b8e" stroke-width="2"/><path d="M80 205L280 45L580 285" stroke="#1564a6" stroke-width="3" fill="none"/><path d="M80 205L280 45L480 205Z" fill="#1564a6" opacity=".12"/><path d="M480 205L580 285L580 205Z" fill="#b94822" opacity=".18"/>'+text(90,30,'v (m s⁻¹)')+text(55,210,'0')+text(263,32,'+8')+text(295,190,'4 s')+text(470,190,'8 s')+text(570,190,'10 s')+text(515,275,'−4')+text(160,140,'Positive area')+text(600,230,'t (s)'),'The areas illustrate the original review problem. Integrating signed velocity gives displacement; adding the absolute areas gives distance.'));
// Expand checks for the newly explained content without changing lesson counts.
const quantumExtra=[
['A blackbody spectrum at one temperature is:',['continuous with a finite peak','a single spectral line','only ultraviolet','zero at every wavelength'],0],
['On a stopping-potential versus frequency graph, the gradient is:',['h','h/e','e/h','the work function'],1],
['A downward atomic transition emits a photon with energy:',['the sum of level energies','the positive difference between levels','zero','any arbitrary value'],1],
['Phosphorescence persists after excitation because of:',['long-lived excited states','increasing photon speed','continuous ionisation of air','zero energy differences'],0],
['In an X-ray tube the maximum photon energy after accelerating an electron through V is:',['eV','V/e','hV','mc only'],0],
['A laser amplifies light primarily through:',['stimulated emission','nuclear fission','sound resonance','gravitational lensing'],0],
['At fixed photon frequency, doubling beam power doubles:',['photon energy','photons delivered per second','vacuum light speed','photon rest mass'],1],
['With photons sent one at a time through two slits, many detections can build:',['an interference distribution','only a single straight track','no detections','a mechanical sound wave'],0]
];window.Year12PhysicsLessons.quantum.bank.push(...quantumExtra);
window.Year12PhysicsLessons['static-equilibrium'].bank.push(
{q:'Increasing base width while holding centre-of-mass height fixed generally:',o:['increases resistance to toppling','reduces stability','eliminates weight','makes torque zero for every force'],a:0},
{q:'A 10 N force acts 0.40 m from a pivot at 30° to the lever arm. Torque magnitude is:',o:['4.0 N m','2.0 N m','20 N m','0 N m'],a:1},
{q:'Choosing a pivot at an unknown support often helps because:',o:['all forces disappear','that support force has zero lever arm','gravity vanishes','only horizontal forces remain'],a:1},
{q:'A supported beam with zero net torque but nonzero net force is:',o:['in static equilibrium','not in static equilibrium','weightless','always rotating at constant speed'],a:1});
// Store draft responses by module, leaving the existing lesson wire callbacks intact.
for(const player of [window.Year11PhysicsPlayer,window.Year12PhysicsPlayer]){
 if(!player?.build)continue;const original=player.build;player.build=function(topic,host){const result=original.apply(this,arguments);if(!host.dataset.physicsDrafts){host.dataset.physicsDrafts='1';host.addEventListener('input',e=>{const id=e.target.dataset?.physicsResponse;if(id){try{localStorage.setItem('physics-response-'+id,e.target.value)}catch(_){}}});const restore=()=>host.querySelectorAll('[data-physics-response]').forEach(el=>{try{el.value=localStorage.getItem('physics-response-'+el.dataset.physicsResponse)||''}catch(_){}});new MutationObserver(restore).observe(host,{childList:true,subtree:true});}return result;};
}
window.PhysicsATARCompletion={version:'2026.116',practiceCount:Object.keys(additions).length};
})();
