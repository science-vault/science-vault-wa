/* Explicit Year12 cosmology: original scenario teaching, with supplied-model extensions identified. */
(function(){'use strict';const C=window.PhysicsScenarioCourse,H=C.helpers,{esc,math,note,steps,paper,reveal,svg,text,line,arrow,ball,number,check}=H;
const P=s=>'<p>'+s+'</p>',table=ps=>'<table class="pf-marking"><thead><tr><th>Working and reasoning</th><th>Marks</th></tr></thead><tbody>'+ps.map(p=>'<tr><td>'+esc(p)+'</td><td>1</td></tr>').join('')+'</tbody></table>';
function diagram(kind){
const T=text,L=line,A=arrow,B=ball;
if(kind==='distance')return svg('Astronomical unit ladder: every entry is a distance, with megaparsec equal to one million parsecs',T(75,50,'Each unit measures LENGTH')+['1 AU ≈ 1.50 × 10¹¹ m','1 ly ≈ 9.46 × 10¹⁵ m','1 pc ≈ 3.09 × 10¹⁶ m ≈ 3.26 ly','1 Mpc = 10⁶ pc ≈ 3.09 × 10²² m'].map((s,i)=>T(110,120+i*80,s)).join('')+T(80,470,'Choose a scale; keep units attached to the conversion.'),510);
if(kind==='spectra')return svg('Reference and observed line pattern with the same fractional shift, shown on a shared wavelength axis',A(90,330,690,330)+T(100,45,'Same element: compare every line with its reference')+T(95,100,'Reference')+T(95,220,'Observed')+[400,500,600].map(v=>L(100+(v-350)*1.9,110,100+(v-350)*1.9,160,'#2a6bb2')+T(100+(v-350)*1.9,185,String(v),'#18374d','middle')).join('')+[408,510,612].map(v=>L(100+(v-350)*1.9,230,100+(v-350)*1.9,280,'#c87518')+T(100+(v-350)*1.9,307,String(v),'#18374d','middle')).join('')+T(485,370,'wavelength (nm)')+T(100,420,'Each observed/reference ratio is 1.020; z = +0.0200.'),460);
if(kind==='redshift')return svg('Signed spectral wavelength changes: redshift to longer wavelengths and blueshift to shorter wavelengths',A(90,240,690,240)+L(370,100,370,280,'#526d82',true)+T(370,75,'reference wavelength','#18374d','middle')+A(365,145,580,145,'#c87518')+A(365,200,170,200,'#2a6bb2')+T(470,115,'redshift: Δλ > 0')+T(110,315,'blueshift: Δλ < 0')+T(490,285,'longer wavelength →')+T(90,400,'Frequency and photon energy change in the opposite sense.'),450);
if(kind==='stretch'){let wave=(x,y,length)=>'<path d="'+Array.from({length:161},(_,i)=>(i?'L':'M')+(x+i*3)+' '+(y-28*Math.sin(i*3*2*Math.PI/length))).join(' ')+'" stroke="#2a6bb2" fill="none" stroke-width="3"/>';return svg('Illustrative expansion stretching: wavelength increases while vacuum light speed remains c',T(90,40,'Earlier: shorter wavelength')+wave(100,110,80)+T(90,210,'Later: longer wavelength')+wave(100,280,160)+A(100,155,180,155,'#c87518')+A(100,325,260,325,'#c87518')+T(620,120,'λ')+T(620,290,'2λ')+T(90,415,'Illustrative factor 2: frequency and photon energy are halved.'),455);}
if(kind==='hubble'||kind==='scatter'){const x=d=>100+7*d,y=v=>345-v*.060;const pts=kind==='scatter'?[[10,650],[20,1550],[30,2000],[40,2870],[50,3420],[60,4330]]:[[10,700],[20,1400],[30,2100],[40,2800],[50,3500],[60,4200]];return svg('Illustrative Hubble plot: recession velocity on vertical axis, distance horizontal, gradient is Hubble constant',A(100,345,680,345)+A(100,345,100,65)+L(x(0),y(0),x(60),y(4200),'#c87518')+pts.map(([d,v])=>B(x(d),y(v),5,'#2a6bb2')).join('')+T(110,35,'recession v (km/s)')+T(530,400,'distance d (Mpc)')+[0,20,40,60].map(d=>T(x(d),380,String(d),'#18374d','middle')).join('')+T(80,y(4200)+6,'4200','#18374d','end')+T(80,351,'0','#18374d','end')+T(145,455,kind==='scatter'?'Scatter is illustrative; line gives a trend, not every galaxy.':'Ideal line: v = 70d, with H₀ = 70 km/s/Mpc.'),495);}
if(kind==='observers')return svg('One-dimensional uniform expansion viewed from two galaxies: relative distances and velocities are proportional',T(75,40,'Model at one instant: velocities in A’s coordinates')+[0,1,2,3].map(i=>B(120+i*150,120,12)+T(120+i*150,90,['A','B','C','D'][i],'#18374d','middle')+T(120+i*150,175,String(i*10)+' Mpc','#18374d','middle')+T(120+i*150,210,String(i*700)+' km/s','#18374d','middle')).join('')+T(75,280,'From B: A is −10 Mpc with −700 km/s; C is +10 with +700.')+T(75,335,'D is +20 Mpc from B with +1400 km/s.')+T(75,415,'Another comoving observer sees the same expansion-rate pattern.'),460);
if(kind==='timeline')return svg('Early-universe sequence, with nuclei preceding neutral atoms and stars; spacing is not a time scale',T(75,40,'Sequence model: spacing does NOT represent elapsed time')+['Hot plasma and radiation','Light nuclei form in early minutes','Neutral atoms; photons propagate freely','Stars and galaxies form later'].map((s,i)=>{const y=100+i*90;return '<rect x="105" y="'+(y-28)+'" width="555" height="55" rx="8" fill="#edf4f8" stroke="#526d82"/>'+T(125,y+5,s)+(i<3?A(380,y+32,380,y+56):'');}).join('')+T(90,465,'Nuclei and neutral atoms are different structures.'),505);
if(kind==='abundance')return svg('Illustrative 100 mass units: hydrogen75 and helium25 gives twelve hydrogen nuclei per helium nucleus',T(75,40,'Mass basis: illustrative H = 75, He = 25')+'<rect x="100" y="90" width="420" height="65" fill="#2a6bb2"/><rect x="520" y="90" width="140" height="65" fill="#c87518"/>'+T(160,185,'H mass 75')+T(525,185,'He mass 25')+T(100,270,'Number calculation: NH = 75/1 = 75')+T(100,320,'Number calculation: NHe = 25/4 = 6.25')+T(100,370,'Nucleus ratio H:He = 12:1')+T(100,430,'One helium nucleus has roughly four hydrogen mass units.'),470);
if(kind==='cmb')return svg('Qualitative thermal CMB spectrum: a broad thermal peak, not a single microwave wavelength',A(100,330,690,330)+A(100,330,100,60)+'<path d="M110 330C180 330 220 100 295 95S440 275 660 319" fill="none" stroke="#c87518" stroke-width="4"/>'+T(110,35,'relative spectral intensity')+T(525,370,'wavelength →')+T(145,420,'Qualitative shape only; no numerical peak can be read here.')+T(145,465,'Observed near-thermal background corresponds to about 2.7 K.'),505);
if(kind==='rotation'){const x=r=>110+r*85,y=v=>350-v;return svg('Illustrative outer galaxy speeds: constant enclosed mass predicts falling speed while observations can remain nearly flat',A(100,350,690,350)+A(100,350,100,70)+'<path d="'+Array.from({length:71},(_,i)=>{const r=1+i/12;return(i?'L':'M')+x(r)+' '+y(190/Math.sqrt(r));}).join(' ')+'" stroke="#2a6bb2" fill="none" stroke-width="4"/>'+L(x(1),y(190),x(6.8),y(190),'#c87518')+T(120,35,'orbital speed (illustrative units)')+T(485,390,'radius →')+T(400,135,'near-flat observed trend')+T(350,290,'constant enclosed M model')+T(100,450,'Schematic comparison outside the luminous region.'),490);}
throw Error('Unknown cosmology diagram '+kind);
}
function lab(id,mode){return '<div data-cosmo-lab="'+mode+'" class="pp-sim"><label>'+(mode==='distance'?'Distance (pc)':mode==='hubble'?'Distance (Mpc)':'Supplied expansion factor')+'<input data-cosmo-slider type="range" min="1" max="'+(mode==='stretch'?10:100)+'" value="'+(mode==='stretch'?2:10)+'" step="1"></label><div data-cosmo-readout class="pp-sim-readout" aria-live="polite"></div><p>Change one quantity; explain the pattern before checking its value.</p></div>';}
function wire(root){root.querySelectorAll('[data-cosmo-lab]').forEach(el=>{const input=el.querySelector('input');const update=()=>{const v=+input.value,mode=el.dataset.cosmoLab;el.querySelector('[data-cosmo-readout]').textContent=mode==='distance'?v+' pc = '+(v*3.26).toFixed(2)+' ly = '+(v*3.09e16).toExponential(3)+' m':mode==='hubble'?v+' Mpc gives v = 70 × '+v+' = '+(70*v)+' km/s in this expansion model':'Wavelength factor '+v+'; frequency and photon-energy factors '+(1/v).toFixed(3)+'. Vacuum speed remains c.';};input.addEventListener('input',update);update();});}
const datasets=[
  {
    "id": "cosmology-focus-1",
    "parent": "cosmology",
    "title": "Cosmology: distances, spectra and redshift",
    "shortTitle": "Distances and redshift",
    "subtitle": "Convert astronomical distances and read spectral shifts before choosing a velocity model.",
    "learn": [
      [
        "Why astronomy needs a distance ladder",
        "A metre is convenient for a room but not for a galaxy. Large units reduce unwieldy powers of ten. A distance still describes separation: changing its unit cannot change the physical object. Start by naming the distance being measured, the unit and the observer.",
        "distance"
      ],
      [
        "The astronomical unit is a Solar System scale",
        "One astronomical unit, AU, is approximately 1.50 × 10¹¹ m. It is close to the mean Earth–Sun separation. Multiply a number of AU by metres per AU to find metres; divide metres by that same factor to find AU. It is a unit of length, not a speed."
      ],
      [
        "A light year is a length, despite its name",
        "A light year is the distance light travels in vacuum in one year: about 9.46 × 10¹⁵ m. The word year appears because distance = speed × travel time. An object 4.0 light years away is not four years old."
      ],
      [
        "Parsecs and megaparsecs",
        "One parsec is about 3.26 ly or 3.09 × 10¹⁶ m. One megaparsec, Mpc, is 10⁶ parsecs, about 3.09 × 10²² m. The prefix mega multiplies the complete unit. Write the conversion factor once before entering the calculator."
      ],
      [
        "Use units to decide multiply or divide",
        "To convert 2.0 pc into metres write 2.0 pc × (3.09 × 10¹⁶ m / pc). The pc labels cancel and metres remain. To reverse the conversion place metres in the denominator. A unit cancellation is a useful guard against using the reciprocal."
      ],
      [
        "Light travel time is not an object’s age",
        "In a simple stationary-distance model, t = d/c. We receive earlier information because propagation takes time. A distant star may already have changed while its previous light is travelling. At cosmological distances, current proper distance and light-travel distance differ; do not automatically identify either with c times the universe’s age."
      ],
      [
        "Spectra contain identifiable line patterns",
        "An element’s energy transitions produce specific reference wavelengths. Compare the observed pattern with a laboratory spectrum of the same element, not with an arbitrary colour. Multiple lines agreeing on one shift ratio make the identification stronger.",
        "spectra"
      ],
      [
        "Redshift and blueshift describe wavelength change",
        "A line observed at a longer wavelength than its laboratory wavelength is redshifted; a shorter wavelength is blueshifted. For ordinary relative motion along the line of sight, these suggest recession and approach respectively. A stationary atom’s allowed energy levels need not have changed."
      ],
      [
        "Frequency changes in the opposite sense",
        "For light in vacuum, c = fλ. If the observed wavelength increases, observed frequency decreases. Because E = hf, the observed energy of each photon also decreases. Do not say longer wavelength means higher photon energy. This is a measurement in the receiving frame."
      ],
      [
        "A supplied quantitative redshift model",
        "For calculation practice define z = (λobserved − λreference)/λreference. This numerical redshift definition and low-speed Doppler approximation are supplied model applications alongside the core spectral interpretation. z has no unit because the numerator and denominator use the same length unit.",
        "redshift"
      ],
      [
        "A fractional change is not an absolute change",
        "An increase of 10 nm means very different fractional changes for a 100 nm line and a 1000 nm line. The redshift compares the change with the reference value. Keep all wavelengths in one unit; nm can cancel directly when finding z."
      ],
      [
        "The low-redshift velocity approximation",
        "When |z| is small and the relevant motion is non-relativistic, the supplied approximation v ≈ cz estimates signed radial velocity. Use c in km/s for an answer in km/s or in m/s for m/s. At large z this approximation is unsuitable; cosmological redshift requires an expansion model."
      ],
      [
        "Only the radial part produces this Doppler estimate",
        "A spectral Doppler estimate describes the component along the line of sight in the stated model. It does not by itself give the complete three-dimensional velocity. Sideways motion and observer motion require additional information or corrections."
      ],
      [
        "Cosmological stretching is a different explanation",
        "During cosmic expansion, light’s wavelength can stretch with the scale of the universe. This is not simply every far galaxy flying through a fixed space at a speed cz. Local motion can add to or oppose the expansion-related shift.",
        "stretch"
      ],
      [
        "Looking back is a statement about received information",
        "Light from an early galaxy lets us study that galaxy at emission. Infrared instruments can detect light that began at shorter wavelengths and was stretched during travel. Neither the telescope nor its light travels backwards in time."
      ],
      [
        "Decide whether a numerical model is justified",
        "First identify reference and observed wavelengths. Interpret the sign. Then check whether the question supplies a redshift or Doppler relation and whether its approximation is appropriate. Only after that infer a velocity; keep any cosmological distance inference for the Hubble-law lesson."
      ]
    ],
    "worked": [
      {
        "q": "Worked distance conversion: a 2.50 AU orbit",
        "points": [
          "Use AU as the given length unit, not as a time.",
          "d = 2.50 × 1.50 × 10¹¹ = 3.75 × 10¹¹ m.",
          "The AU unit cancels; report the distance in metres to three significant figures."
        ]
      },
      {
        "q": "Worked nearby star: 12.0 ly in parsecs",
        "points": [
          "Use 1 pc = 3.26 ly, so divide the number of light years by 3.26.",
          "d = 12.0/3.26 = 3.68 pc.",
          "Check: a parsec is larger than a light year, so the number must decrease."
        ]
      },
      {
        "q": "Worked galaxy: 2.00 Mpc in metres",
        "points": [
          "Expand the mega prefix before using metres per parsec.",
          "d = 2.00 × 10⁶ × 3.09 × 10¹⁶ = 6.18 × 10²² m.",
          "The powers of ten add on multiplication; do not use 10³ for mega."
        ]
      },
      {
        "q": "Worked stationary travel model: light from 4.50 ly",
        "points": [
          "This exercise supplies a stationary path model; light travels one light year per year.",
          "t = d/c = 4.50 years, about 1.42 × 10⁸ s using 3.16 × 10⁷ s per year.",
          "We see the source as it was roughly 4.50 years before receipt, not its full age."
        ]
      },
      {
        "q": "Worked redshift: a 500 nm reference appears at 510 nm",
        "points": [
          "Use the supplied definition and retain a positive wavelength change.",
          "z = (510−500)/500 = +0.0200.",
          "The longer wavelength identifies a redshift. With the stated low-z approximation, v ≈ (3.00 × 10⁵)(0.0200) = +6000 km/s."
        ]
      },
      {
        "q": "Worked blueshift: a 600 nm reference appears at 598 nm",
        "points": [
          "The difference must be observed minus reference, not an absolute value.",
          "z = (598−600)/600 = −0.00333.",
          "The low-speed estimate v ≈ −1000 km/s indicates approach along the chosen outward-positive line of sight."
        ]
      },
      {
        "q": "Worked photon observation: 500 nm versus 510 nm",
        "points": [
          "Convert nm to metres for frequency; c is in metres per second.",
          "freference = 3.00 × 10⁸/(500 × 10⁻⁹) = 6.00 × 10¹⁴ Hz.",
          "fobserved = 3.00 × 10⁸/(510 × 10⁻⁹) = 5.88 × 10¹⁴ Hz.",
          "The observed photon has lower frequency and lower energy: this agrees with redshift."
        ]
      },
      {
        "q": "Worked two-line consistency test",
        "points": [
          "Reference lines are 400 nm and 600 nm; observed lines are 408 nm and 612 nm.",
          "First ratio = 408/400 = 1.020; second ratio = 612/600 = 1.020.",
          "Both give z = +0.0200, so one common fractional shift fits these identifications.",
          "The changes are 8 nm and 12 nm, not the same absolute wavelength change."
        ]
      }
    ],
    "practice": [
      {
        "q": "A star is 8.15 pc away. Convert to light years and metres; explain what light travel time means in a stationary approximation.",
        "points": [
          "d = 8.15 × 3.26 = 26.6 ly.",
          "d = 8.15 × 3.09 × 10¹⁶ = 2.52 × 10¹⁷ m.",
          "In the simple stationary model the travel time is about 26.6 years.",
          "The observation shows an earlier state; this is not the age of the star."
        ]
      },
      {
        "q": "Reference lines at 450 and 650 nm appear at 454.5 and 656.5 nm. Use supplied z = Δλ/λreference and v ≈ cz with c = 3.00 × 10⁵ km/s. Check the common shift and interpret it.",
        "points": [
          "z₁ = 4.5/450 = 0.0100.",
          "z₂ = 6.5/650 = 0.0100.",
          "Both have the same positive fractional shift.",
          "v ≈ +3000 km/s is recession in the stated low-z radial model.",
          "The approximation is not a general high-redshift distance law."
        ]
      }
    ],
    "guided": [
      {
        "q": "Convert 6.52 ly to pc.",
        "answer": 2,
        "tolerance": 0.01,
        "unit": "pc",
        "reason": "Divide by 3.26 ly per pc: 6.52/3.26 = 2.00 pc."
      },
      {
        "q": "Using supplied z = Δλ/λreference, a 400 nm line appears at 404 nm. Find z.",
        "answer": 0.01,
        "tolerance": 0.0001,
        "unit": "dimensionless",
        "reason": "z = (404−400)/400 = +0.0100."
      }
    ],
    "bank": [
      {
        "q": "A light year measures…",
        "o": [
          "time",
          "distance",
          "frequency"
        ],
        "a": 1,
        "explain": "It is the distance light travels in one year."
      },
      {
        "q": "A spectral line redshifted from 500 to 510 nm has observed frequency…",
        "o": [
          "larger",
          "unchanged",
          "smaller"
        ],
        "a": 2,
        "explain": "c = fλ; a larger wavelength means smaller frequency in vacuum."
      },
      {
        "q": "Mega in megaparsec means…",
        "o": [
          "10³",
          "10⁶",
          "10⁻⁶"
        ],
        "a": 1,
        "explain": "Mega multiplies parsecs by one million."
      },
      {
        "q": "A common redshift pattern has the same…",
        "o": [
          "fractional wavelength shift",
          "absolute shift in nm for every line",
          "energy for every transition"
        ],
        "a": 0,
        "explain": "Compare Δλ/λreference or λobserved/λreference."
      },
      {
        "q": "v ≈ cz at z = 3 should be used…",
        "o": [
          "without qualification",
          "as a universal exact rule",
          "only if a justified model is supplied; this low-z approximation is unsuitable"
        ],
        "a": 2,
        "explain": "Large cosmological redshift is not treated by the simple low-speed Doppler approximation."
      },
      {
        "q": "A blueshifted nearby galaxy…",
        "o": [
          "alone disproves expansion",
          "can have local approach motion",
          "must have negative distance"
        ],
        "a": 1,
        "explain": "Local velocity can oppose the large-scale expansion pattern."
      }
    ],
    "tasks": [
      {
        "q": "Convert 3.00 Mpc into metres and light years. Use 1 pc = 3.09 × 10¹⁶ m = 3.26 ly.",
        "points": [
          "3.00 Mpc = 3.00 × 10⁶ pc.",
          "Distance = 9.27 × 10²² m.",
          "Distance = 9.78 × 10⁶ ly."
        ]
      },
      {
        "q": "A 700 nm reference line is observed at 693 nm. Use supplied z = Δλ/λreference and v ≈ cz for small |z|. Find and interpret the shift and velocity using c = 3.00 × 10⁵ km/s.",
        "points": [
          "z = (693−700)/700 = −0.0100.",
          "v ≈ −3000 km/s.",
          "The shorter wavelength indicates approach along the line of sight in this stated model."
        ]
      }
    ]
  },
  {
    "id": "cosmology-focus-2",
    "parent": "cosmology",
    "title": "Cosmology: Hubble graphs and expanding space",
    "shortTitle": "Hubble law and expansion",
    "subtitle": "Read expansion data, calculate recession or distance and recognise where a simple model stops working.",
    "learn": [
      [
        "What Hubble’s law actually connects",
        "In the nearby large-scale expansion approximation, v = H₀d connects recession speed with distance. v is a radial recession measurement after appropriate corrections; d is a compatible galaxy distance. H₀ is the present expansion rate, not the speed of one particular galaxy.",
        "hubble"
      ],
      [
        "Read the Hubble constant’s compound unit",
        "A stated H₀ = 70.0 km s⁻¹ Mpc⁻¹ means each additional megaparsec corresponds to about 70.0 km/s additional recession speed in this model. The unit is velocity per distance. Multiply km/s per Mpc by Mpc to obtain km/s."
      ],
      [
        "Distance, velocity and the correct rearrangement",
        "Use v = H₀d to predict recession and d = v/H₀ to estimate a compatible distance. To determine the expansion rate use H₀ = v/d. Rearrange symbolically first so that you can check the resulting unit before substituting."
      ],
      [
        "The plotted gradient is an expansion rate",
        "On a v-versus-d graph, rise/run has units km s⁻¹ Mpc⁻¹. Choose widely separated points on a best-fit line rather than two noisy data points. The line represents a trend; an individual galaxy need not sit exactly on it.",
        "scatter"
      ],
      [
        "Axis swaps change the gradient",
        "If distance is on the vertical axis and recession speed on the horizontal axis, the gradient is 1/H₀. Its unit is Mpc per km/s. Reading a gradient without reading the axes can turn an otherwise correct calculation into the reciprocal result."
      ],
      [
        "Faster recession does not put us at the centre",
        "A uniform expansion model gives the same general recession-distance relation to observers attached to other widely separated galaxies. Relative separations increase throughout the model. Our observational location does not uniquely identify a physical centre of the universe.",
        "observers"
      ],
      [
        "Use a stretching grid with care",
        "Points on an expanding grid represent galaxies following large-scale expansion. The spacing changes; the dots do not have to grow. A balloon surface illustrates two-dimensional distances on its surface. The balloon’s centre and surrounding room are not required physical parts of the universe."
      ],
      [
        "Bound systems can resist expansion",
        "Gravity binds galaxies and Solar Systems; electromagnetic interactions bind atoms and solid rulers. Do not assume every local distance increases at H₀ times its length. Hubble’s law is a model for large-scale cosmic motion, not a prediction that desks or planets steadily expand."
      ],
      [
        "Local motion creates scatter and some blueshifts",
        "Measured line-of-sight motion can include the expansion trend and a galaxy’s local, or peculiar, motion. A nearby galaxy can approach us. One blue line is not a negative distance or sufficient evidence against the broader expansion trend."
      ],
      [
        "A spectral estimate needs an explicit approximation",
        "Some exercises supply v ≈ cz for small |z|. Use it only within its stated domain before applying v = H₀d. At large cosmological redshift, a calibrated cosmological distance model is required. The naive multiplication cz can even exceed c without being a locally measured particle speed."
      ],
      [
        "The constant is a value for an epoch",
        "H₀ denotes the expansion rate now. Its units can be converted into inverse seconds. It does not imply that the expansion rate has always been the same or that every galaxy maintains a constant recession speed throughout cosmic history."
      ],
      [
        "An inverse-rate time is an estimate, not the exact age",
        "In a supplied constant-rate back-extrapolation model, a timescale is tH = 1/H₀. Convert H₀ to s⁻¹ first. This is an optional model calculation; the actual history changes the age. Do not present a reciprocal as a model-independent measurement of the universe’s age."
      ],
      [
        "Use supplied H₀ rather than a memorised favourite",
        "This course practices several hypothetical H₀ values. A question may give a historical value or ask you to find one from data. Use that value consistently. Different methods and calibrations can lead to different inferred rates; the graph’s uncertainty matters."
      ],
      [
        "Distances inferred from Hubble’s law are model results",
        "When d is obtained from v/H₀, say the estimate assumes recession governed by the chosen expansion model. It is different from a direct geometric parallax measurement. The inference becomes unreliable when local motion dominates the measured speed."
      ],
      [
        "Uncertainty belongs with the conclusion",
        "For d = v/H₀, a conservative school calculation adds percentage uncertainties for division. If v is uncertain by 2% and H₀ by 4%, the distance has about 6% uncertainty by this prescribed rule. Do not confuse this conservative rule with independent-error statistical quadrature."
      ],
      [
        "Separate observation, calculation and interpretation",
        "A strong response identifies the measured spectral shift or distance, then shows the relationship used, then interprets the result as support for a large-scale expansion pattern. A calculation alone does not establish every detail of the Big Bang model."
      ]
    ],
    "worked": [
      {
        "q": "Worked prediction: H₀ = 70.0 km/s/Mpc, d = 30.0 Mpc",
        "points": [
          "Choose v = H₀d because distance and expansion rate are given.",
          "v = 70.0 × 30.0 = 2100 km/s.",
          "Mpc cancels; this is recession speed in the stated nearby expansion approximation."
        ]
      },
      {
        "q": "Worked inverse problem: v = 4900 km/s, H₀ = 70.0 km/s/Mpc",
        "points": [
          "The unknown is distance, so rearrange d = v/H₀.",
          "d = 4900/70.0 = 70.0 Mpc.",
          "Check by substituting back: 70.0 × 70.0 = 4900 km/s."
        ]
      },
      {
        "q": "Worked graph: best-fit points (10 Mpc, 720 km/s) and (50 Mpc, 3600 km/s)",
        "points": [
          "Use differences along the line, not the ratio of arbitrary plotted coordinates.",
          "H₀ = (3600−720)/(50−10) = 2880/40 = 72.0 km/s/Mpc.",
          "The rise is velocity and the run distance; a large triangle reduces relative reading error."
        ]
      },
      {
        "q": "Worked axis swap: distance gradient 0.0143 Mpc per km/s",
        "points": [
          "Distance plotted against velocity has gradient = 1/H₀.",
          "H₀ = 1/0.0143 = 69.9 km/s/Mpc.",
          "Do not report 0.0143 as the Hubble constant; that is the reciprocal unit."
        ]
      },
      {
        "q": "Worked unit conversion and optional expansion timescale",
        "points": [
          "For H₀ = 70.0 km/s/Mpc use 1 Mpc = 3.09 × 10¹⁹ km.",
          "H₀ = 70.0/(3.09 × 10¹⁹) = 2.27 × 10⁻¹⁸ s⁻¹.",
          "tH = 1/H₀ = 4.41 × 10¹⁷ s = 14.0 billion years using 3.16 × 10⁷ s/year.",
          "This constant-rate extrapolation is an optional timescale estimate, not the exact age."
        ]
      },
      {
        "q": "Worked low-z chain: reference 500 nm, observed 505 nm",
        "points": [
          "The question supplies z = Δλ/λreference and v ≈ cz for small |z|.",
          "z = 5/500 = 0.0100; v ≈ 3000 km/s.",
          "With H₀ = 75.0 km/s/Mpc, d ≈ 3000/75.0 = 40.0 Mpc.",
          "This uses two models: the stated low-z approximation and the expansion-distance relation."
        ]
      },
      {
        "q": "Worked local-motion correction: distance 5.00 Mpc, H₀ = 70.0",
        "points": [
          "Expansion contribution = 70.0 × 5.00 = +350 km/s.",
          "If supplied peculiar radial velocity is −500 km/s, total = 350−500 = −150 km/s.",
          "This object approaches despite the expansion contribution; do not infer a negative distance from the total."
        ]
      },
      {
        "q": "Worked uncertainty: v = 3500 ± 70 km/s, H₀ = 70 ± 2.8",
        "points": [
          "Central distance d = 3500/70 = 50 Mpc.",
          "Percentage uncertainties are 70/3500 = 2% and 2.8/70 = 4%.",
          "The prescribed conservative division rule gives 6%, or 3 Mpc.",
          "Report d = 50 ± 3 Mpc, with an additional model caveat if local motion is significant."
        ]
      }
    ],
    "practice": [
      {
        "q": "A galaxy has recession speed 5600 km/s. Use H₀ = 80.0 km/s/Mpc to find distance in Mpc and metres; state a model assumption.",
        "points": [
          "d = v/H₀ = 5600/80.0 = 70.0 Mpc.",
          "d = 70.0 × 3.09 × 10²² = 2.16 × 10²⁴ m.",
          "Assume the measured recession is suitably represented by the large-scale expansion trend."
        ]
      },
      {
        "q": "A best-fit v-versus-d line passes through (20 Mpc, 1360 km/s) and (80 Mpc, 5440 km/s). Find H₀ and predict recession at 50 Mpc. Explain why one nearby blueshifted galaxy does not invalidate the trend.",
        "points": [
          "Gradient = (5440−1360)/(80−20) = 68.0 km/s/Mpc.",
          "v = 68.0 × 50 = 3400 km/s.",
          "Local motion can oppose expansion and dominate for nearby galaxies.",
          "Assess the trend using many suitable observations and their uncertainties."
        ]
      }
    ],
    "guided": [
      {
        "q": "At H₀ = 75 km/s/Mpc, find v for d = 20 Mpc.",
        "answer": 1500,
        "tolerance": 1,
        "unit": "km/s",
        "reason": "v = H₀d = 75×20 = 1500 km/s."
      },
      {
        "q": "At v = 4200 km/s and H₀ = 70 km/s/Mpc, find d.",
        "answer": 60,
        "tolerance": 0.1,
        "unit": "Mpc",
        "reason": "d = v/H₀ = 4200/70 = 60.0 Mpc."
      }
    ],
    "bank": [
      {
        "q": "For a v-versus-d graph the gradient is…",
        "o": [
          "H₀",
          "1/H₀",
          "the age of each galaxy"
        ],
        "a": 0,
        "explain": "Velocity per distance is the expansion-rate unit."
      },
      {
        "q": "A distance-versus-v graph has gradient…",
        "o": [
          "H₀",
          "1/H₀",
          "c"
        ],
        "a": 1,
        "explain": "Rearrange d = v/H₀."
      },
      {
        "q": "A galaxy approaching locally implies…",
        "o": [
          "negative physical distance",
          "local motion may dominate its measured shift",
          "cosmic expansion is impossible"
        ],
        "a": 1,
        "explain": "Peculiar motion can oppose the large-scale trend."
      },
      {
        "q": "With fixed H₀, twice the distance predicts…",
        "o": [
          "half the recession",
          "twice the recession",
          "four times the recession"
        ],
        "a": 1,
        "explain": "v = H₀d is a direct proportionality in this model."
      },
      {
        "q": "The estimate 1/H₀ is…",
        "o": [
          "always the exact cosmic age",
          "a constant-rate model timescale",
          "a length"
        ],
        "a": 1,
        "explain": "H₀ has inverse-time dimensions; real expansion history must be considered."
      },
      {
        "q": "Hubble expansion necessarily makes atoms grow…",
        "o": [
          "yes, at exactly H₀",
          "no; bound local systems need not follow the expansion trend",
          "only if their photons are blue"
        ],
        "a": 1,
        "explain": "Local electromagnetic and gravitational binding matters."
      }
    ],
    "tasks": [
      {
        "q": "A v-versus-d best-fit line contains (15 Mpc, 1080 km/s) and (55 Mpc, 3960 km/s). Find H₀ and distance for 5040 km/s.",
        "points": [
          "H₀ = (3960−1080)/(55−15) = 72.0 km/s/Mpc.",
          "d = 5040/72.0 = 70.0 Mpc.",
          "Use points on the fitted trend and compatible units."
        ]
      },
      {
        "q": "H₀ = 65 km/s/Mpc and d = 4.0 Mpc. A galaxy has a supplied local radial velocity of −400 km/s. Find total radial speed and interpret the sign.",
        "points": [
          "Expansion contribution =65×4=+260 km/s.",
          "Total =260−400=−140 km/s.",
          "It approaches in this simple combined model although expansion contributes recession."
        ]
      }
    ]
  },
  {
    "id": "cosmology-focus-3",
    "parent": "cosmology",
    "title": "Cosmology: Big Bang evidence and the early universe",
    "shortTitle": "Big Bang evidence",
    "subtitle": "Build explanations from expansion, background radiation and light-element abundance, while separating evidence from speculation.",
    "learn": [
      [
        "A model of a hot, dense early universe",
        "The Big Bang model describes an earlier universe that was much hotter and denser, followed by expansion and cooling. It connects several observations in one physical history. The model is not simply a story that all matter exploded from one location into an already empty room.",
        "timeline"
      ],
      [
        "Expansion can be followed backwards conceptually",
        "If widely separated galaxy distances grow today, reversing a simplified expansion history points towards a denser past. Hubble’s law supports the expansion interpretation. By itself it does not specify every earlier temperature, reaction or stage; other evidence is needed."
      ],
      [
        "Cooling changes which structures can exist",
        "High temperatures give particles large random energies and energetic radiation. As conditions cool, bound structures become able to persist. Distinguish the formation of nuclei from the much later formation of neutral atoms; an electron joining a nucleus does not create that nucleus."
      ],
      [
        "Early nuclei formed before the first stars",
        "Primordial nucleosynthesis produced mainly light nuclei, including hydrogen and helium with small amounts of other light isotopes. It occurred early, before normal stars existed. Heavier elements such as carbon and iron were mainly produced later in stellar processes."
      ],
      [
        "Abundance is measured with a clearly stated basis",
        "A percentage by mass differs from a percentage by number of atoms. Helium nuclei are roughly four times as massive as hydrogen nuclei. Never treat 25% helium by mass as one helium atom in every four atoms. State which ratio the question supplies.",
        "abundance"
      ],
      [
        "An early ionised plasma scattered light",
        "Before neutral atoms could persist, free electrons repeatedly scattered photons. That made the universe opaque over long paths. The radiation already existed in the hot plasma; the cosmic background is not simply light created by electrons first attaching to nuclei."
      ],
      [
        "Neutral atoms allowed background light to propagate",
        "At roughly 380,000 years in the standard history, cooling allowed neutral atoms to form and photons to travel much more freely. This is often called recombination and photon decoupling. The approximate date is context; the key sequence is nuclei first, atoms and transparency later."
      ],
      [
        "The cosmic microwave background fills the sky",
        "The CMB is an almost uniform radiation background with a near-black-body spectrum corresponding to about 2.7 K today. It is detected from all directions, after accounting for local foregrounds. Its origin and spectrum fit a formerly hot, dense radiation bath.",
        "cmb"
      ],
      [
        "Expansion stretches and cools the radiation",
        "As the universe expands, wavelengths of the travelling background radiation stretch and individual photon energies fall. The initially hotter radiation is now measured in the microwave region. This connects expansion with the low present background temperature.",
        "stretch"
      ],
      [
        "Uniformity does not mean perfectly identical",
        "Small CMB temperature variations carry information about early density variations. They are deviations around the mean background, not separate hot stars. The near-uniform sky and its tiny variations are both features that a successful cosmological model must explain."
      ],
      [
        "Three observations answer different questions",
        "Galaxy recession supports expansion. The CMB supports an early hot radiation bath. The measured light-element abundances test early nuclear-reaction conditions. A response listing three names is weaker than one connecting each observation to a model prediction."
      ],
      [
        "Independent evidence strengthens an explanation",
        "When several different measurement methods agree with a shared physical history, confidence increases. The observations are not logically interchangeable: measuring a redshift is not directly measuring primordial helium, and neither is a CMB temperature measurement."
      ],
      [
        "First stars and galaxies followed the neutral era",
        "Gravity amplified density differences and formed structures after the universe became mostly neutral. Stars then produced light and heavier elements. The first-star epoch is uncertain in detail; do not make one precise supplied exercise time a universally established date."
      ],
      [
        "Dark matter is an inference from gravitational effects",
        "Rotation, lensing and other observations can imply more gravitating mass than visible matter explains. This is a distinct issue from evidence for an early hot universe. A flat galaxy rotation curve does not directly measure the Hubble constant.",
        "rotation"
      ],
      [
        "Dark energy describes a different cosmic problem",
        "Accelerated large-scale expansion motivates a contribution often called dark energy in modern models. It is not simply another name for dark matter. Neither should be used as a magic phrase to fill an explanation without identifying the observation being explained."
      ],
      [
        "State the model’s limits honestly",
        "A successful account of expansion and an early hot dense state does not settle every question about the earliest boundary, what happened before it or the universe’s total extent. Scientific explanations are evaluated by predictions and observations, not by claiming that every remaining question has disappeared."
      ]
    ],
    "worked": [
      {
        "q": "Worked explanation: use the CMB as evidence",
        "points": [
          "Observation: radiation is received across the sky with an approximately thermal spectrum.",
          "Model prediction: an early hot universe contains a radiation bath.",
          "Expansion stretches the photons and reduces the inferred radiation temperature.",
          "Link: a cool present background is consistent with that early hot state; naming microwaves alone is not a full explanation."
        ]
      },
      {
        "q": "Worked explanation: a nearby blueshifted galaxy",
        "points": [
          "A spectrum with shorter reference-relative wavelengths indicates approach in a local Doppler model.",
          "The large-scale expansion trend need not dominate a nearby galaxy’s local motion.",
          "Therefore one nearby approach does not erase the broader recession-distance pattern.",
          "A useful test compares many galaxies and uses more than this one datum."
        ]
      },
      {
        "q": "Worked abundance calculation: 75% hydrogen and 25% helium by mass",
        "points": [
          "Use a 100-unit sample, approximate nucleus masses 1 unit for H and 4 units for He.",
          "Relative nucleus counts: NH = 75/1 = 75; NHe = 25/4 = 6.25.",
          "NH/NHe = 12, so helium is 1 in 13 nuclei, about 7.69% by number.",
          "This shows why a mass fraction and a number fraction must not be interchanged."
        ]
      },
      {
        "q": "Worked timeline: order four supplied stages",
        "points": [
          "Light nuclei form; the plasma later becomes neutral and transparent; then stars form; later large-scale structure develops.",
          "Order by the conditions required: nuclei do not require pre-existing stars.",
          "The CMB last-scattering epoch precedes the first normal stars.",
          "Separate stages rather than placing nucleus formation and atom formation at one time."
        ]
      },
      {
        "q": "Worked supplied stretch model: wavelength doubles",
        "points": [
          "For this extension exercise supply λfinal/λinitial = afinal/ainitial = 2.",
          "Since f = c/λ, final frequency is half the initial frequency.",
          "Since photon E = hf, final photon energy is also half.",
          "Do not claim the photon speed falls to c/2: vacuum light speed remains c."
        ]
      },
      {
        "q": "Worked supplied temperature scaling: a factor of 1000 expansion",
        "points": [
          "This optional exercise supplies Tfinal = Tinitial/(afinal/ainitial).",
          "Starting at 2700 K with a scale increase of 1000 gives Tfinal = 2.70 K.",
          "This supports the direction of radiation cooling; the formula and numbers are supplied model data.",
          "A scale factor is dimensionless, not a radius measured from a cosmic centre."
        ]
      },
      {
        "q": "Worked rotation evidence: compare a constant-mass prediction",
        "points": [
          "Outside a central mass in a supplied circular model, v = √(GM/r).",
          "Doubling r with unchanged enclosed M predicts vnew/vold = 1/√2 = 0.707.",
          "If an observed outer speed stays nearly constant, the constant-enclosed-mass assumption fails.",
          "More enclosed gravitating mass is one interpretation; this is not a direct measurement of photon redshift expansion."
        ]
      },
      {
        "q": "Worked claim evaluation: “the CMB proves every detail”",
        "points": [
          "The observation is strong evidence for a hot early universe when combined with its spectrum and other tests.",
          "A model must explain expansion and light-element abundance as well.",
          "The data constrain a physical history; they do not independently answer every question about a pre-Big-Bang state.",
          "Separate well-supported conclusions from uncertain or speculative claims."
        ]
      }
    ],
    "practice": [
      {
        "q": "A student says the Big Bang was a bomb exploding at a central point and that the CMB is light from the first stars. Correct both claims and connect three observations to the model.",
        "points": [
          "Large-scale expansion is a change of separation throughout space; our observation does not identify a unique central explosion point.",
          "CMB photons last scattered when the plasma became neutral and transparent, before normal stars.",
          "Recession and the distance trend support expansion.",
          "An almost thermal CMB supports a hot early radiation bath that cooled.",
          "Light-element abundances test early nucleosynthesis predictions."
        ]
      },
      {
        "q": "A supplied model sample has 80% hydrogen and 20% helium by mass. Approximate masses per nucleus are 1 and 4 units. Find H:He nucleus-number ratio and helium number percentage. Explain why it differs from mass percentage.",
        "points": [
          "Use 100 mass units: NH =80/1=80; NHe=20/4=5.",
          "H:He =80:5=16:1.",
          "Helium number fraction =5/(80+5)=5.88%.",
          "Each helium nucleus contributes about four times as much mass as each hydrogen nucleus."
        ]
      }
    ],
    "guided": [
      {
        "q": "For a supplied mass sample of 75 H units and 25 He units with nucleus masses 1 and 4, find NH/NHe.",
        "answer": 12,
        "tolerance": 0.01,
        "unit": "ratio",
        "reason": "NH=75; NHe=25/4=6.25; their ratio is12."
      },
      {
        "q": "A supplied photon-stretch model triples wavelength. Find Efinal/Einitial.",
        "answer": 0.3333333333333333,
        "tolerance": 0.001,
        "unit": "ratio",
        "reason": "Photon energy hc/λ is inversely proportional to wavelength, giving1/3."
      }
    ],
    "bank": [
      {
        "q": "The CMB mainly supports…",
        "o": [
          "an early hot radiation bath",
          "all atoms expanding inside your body",
          "light emitted by present Solar System planets"
        ],
        "a": 0,
        "explain": "Its sky distribution and near-thermal spectrum fit a cooled relic radiation field."
      },
      {
        "q": "In the early-universe sequence…",
        "o": [
          "stars make all primordial helium before atoms form",
          "light nuclei precede neutral atoms and normal stars",
          "neutral atoms precede their own nuclei"
        ],
        "a": 1,
        "explain": "Nucleosynthesis occurs before recombination and the later first stars."
      },
      {
        "q": "A 25% helium mass fraction equals 25% helium nuclei…",
        "o": [
          "always",
          "only if helium nuclei have no mass",
          "not generally, because helium nuclei are heavier"
        ],
        "a": 2,
        "explain": "Convert each mass fraction to a number using the mass per nucleus."
      },
      {
        "q": "When radiation wavelength stretches, photon energy…",
        "o": [
          "increases",
          "decreases",
          "must be destroyed entirely"
        ],
        "a": 1,
        "explain": "E = hc/λ; larger wavelength means smaller energy."
      },
      {
        "q": "Dark matter and dark energy are…",
        "o": [
          "two names for the same observation",
          "different inferences addressing gravity and expansion respectively",
          "direct photographs of invisible particles"
        ],
        "a": 1,
        "explain": "They address different evidence and are not interchangeable terms."
      },
      {
        "q": "One strong CMB measurement…",
        "o": [
          "settles every possible question about cosmic origins",
          "must be interpreted with other observations and model limits",
          "makes all later observations unnecessary"
        ],
        "a": 1,
        "explain": "Explanations gain strength from independent tests and remain open to refinement."
      }
    ],
    "tasks": [
      {
        "q": "Correct this statement: “Big Bang helium formed in the first stars; 24% helium by mass means 24% helium atoms; background photons slowed down as space expanded.”",
        "points": [
          "Primordial light nuclei formed before normal stars.",
          "Mass fraction must be divided by mass per nucleus before obtaining number fraction.",
          "Expansion stretches wavelength and lowers photon energy, while vacuum speed remains c."
        ]
      },
      {
        "q": "An exercise supplies Tfinal=Tinitial/s and λfinal=sλinitial. Use Tinitial=3000 K, s=1200 and λinitial=1.0 micrometre. Find final temperature and wavelength and state what these calculations illustrate.",
        "points": [
          "Tfinal=3000/1200=2.50 K.",
          "λfinal=1200 micrometres=1.20 mm.",
          "The supplied expansion model illustrates cooling and wavelength stretching, rather than a decrease in light speed."
        ]
      }
    ]
  }
];
for(const d of datasets){const pages=[],add=(chapter,title,html,type='learn')=>pages.push({chapter,title,html:'<div class="pp-page">'+html+'</div>',type});
d.learn.forEach(([title,body,fig],i)=>{let html=(fig?diagram(fig):'')+P(body);if(i===8)html+=lab(d.id,d.id.endsWith('1')?'distance':d.id.endsWith('2')?'hubble':'stretch');add(i<8?0:1,title,html,i===8?'interactive':'learn');});
d.worked.forEach((q,i)=>add(2,q.q,steps(q.points.map((point,j)=>[j===0?'Choose and explain the model':j===q.points.length-1?'Interpret and check':'Substitute and calculate',P(point)])),'worked'));
d.guided.forEach((q,i)=>add(3,'Guided calculation '+(i+1)+': '+q.q,number(d.id+'-guided-'+i,q.q,q.answer,q.unit,q.reason,q.tolerance),'practice'));
d.bank.slice(0,2).forEach((q,i)=>add(3,'Reasoning check '+(i+1)+': '+q.q,check(d.id+'-guided-mc-'+i,q.q,q.o,q.a,q.o.map((_,j)=>j===q.a?q.explain:'Review the physical meaning. '+q.explain)),'interactive'));
d.practice.forEach((q,i)=>add(3,'Independent scenario '+(i+1),P('<b>Original exam-style question · '+q.points.length+' marks.</b> '+q.q)+paper('Your model, calculations and explained conclusion')+reveal('Compare your reasoning with the marking table',table(q.points)),'practice'));
add(3,'Transfer: distinguish data, model and conclusion',P(d.id.endsWith('1')?'A line pattern is shifted but the complete transverse velocity is unknown. Explain exactly what the spectrum does and does not determine.':d.id.endsWith('2')?'A nearby galaxy lies below a fitted expansion trend. Identify a physical reason, a measurement issue and an appropriate next check.':'A claimed new observation challenges one part of a cosmic model. Describe the prediction, the evidence quality and a test that could discriminate explanations.')+paper('Build an evidence-based response')+reveal('A reasoned response',P(d.id.endsWith('1')?'Compare the reference pattern with the measured wavelengths, identify the radial shift under the stated model, and avoid inferring transverse motion or cosmic distance without more information.':d.id.endsWith('2')?'Local motion can shift the measured radial speed; distance or spectral calibration can introduce uncertainty. Check the measurement and compare an ensemble rather than forcing one galaxy onto the line.':'Identify a specific prediction rather than claiming the entire model has vanished. Check calibration, uncertainty and independent replication, then test competing physical explanations.')),'practice');
add(3,'Your scenario method and further reading',P(d.subtitle)+P('Name the measured quantity and unit, select a model with its conditions, show the relationship and substitutions, then interpret the result. Explain what the evidence supports and where an approximation stops applying.')+'<p class="pp-source">Scope: <a href="https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/science/physics" target="_blank" rel="noopener">SCSA Physics, current 2026 syllabus and formula booklet</a>. Background: <a href="https://science.nasa.gov/universe/overview/" target="_blank" rel="noopener">NASA universe overview</a>. Numerical examples are original teaching exercises.</p>');
if(pages.length!==32)throw Error(d.id+' needs32sections');C.register({...d,pages,chapters:[['Recognise','Identify distances and observations'],['Build','Choose the physical model and its limits'],['Solve','Follow varied explained scenarios'],['Practise','Guided checks, independent questions and evidence']],wire,constants:'Use c = 3.00 × 10⁸ m/s; 1 AU = 1.50 × 10¹¹ m; 1 ly = 9.46 × 10¹⁵ m; 1 pc = 3.09 × 10¹⁶ m = 3.26 ly; 1 Mpc = 10⁶ pc. Use each question’s supplied H₀ and approximation.',focus:{question:d.practice[0].q,points:d.practice[0].points,claim:'One formula determines every astronomical distance and cosmic conclusion.'},summary:d.subtitle});}
})();
