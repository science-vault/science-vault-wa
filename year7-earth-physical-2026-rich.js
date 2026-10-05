/* Detailed Year 7 Earth & Space + Physical Sciences — WA Curriculum/SCSA 2026 */
(function(){
function lesson(unit,topic,n,title,li,sc,blocks){window.registerTopicLesson({year:7,course:'Science',unit,topic,lesson:n,lessonTitle:`Lesson ${n} — ${title}`,curriculum:'Western Australian Curriculum: Science 2026',repositorySources:['Year 7 repository resources used as supporting material; SCSA 2026 mandated content is authoritative.']},`<section class="lesson-block"><p><strong>Year 7 ${unit}</strong></p><h2>${title}</h2><p><strong>Learning intention:</strong> ${li}</p><p><strong>Success criteria:</strong> ${sc}</p></section>`+blocks.map(b=>`<div class="lesson-block"><h3>${b[0]}</h3>${b[1]}</div>`).join(''));}
const E='Earth and Space Sciences',ET='Space and predictable phenomena';
lesson(E,ET,1,'Classifying Celestial Objects','Classify common celestial objects using defining features.','I can distinguish planets, stars, moons, asteroids, meteoroids, comets, constellations and galaxies.',[
['Do Now','<p>Sort these into objects or patterns/groups: Sun, Moon, Mars, Orion, Milky Way, comet.</p>'],
['Learn — our astronomical neighbourhood','<p>A <strong>star</strong> is a huge luminous sphere of hot gas/plasma powered by nuclear fusion. A <strong>planet</strong> orbits a star and is massive enough to become nearly spherical. A <strong>moon</strong> is a natural satellite orbiting a larger body. <strong>Asteroids</strong> are rocky or metallic bodies, while <strong>comets</strong> contain ice, dust and rock and can form a coma and tails near the Sun. A <strong>meteoroid</strong> is a smaller natural rocky/metallic body in space. A <strong>constellation</strong> is an apparent pattern/region of stars viewed from Earth, while a <strong>galaxy</strong> is an enormous gravitationally bound system of stars, gas and dust.</p>'],
['Visual model','<div class="space-map"><span>🌌 <b>Galaxy</b></span><i>contains</i><span>☀️ <b>Stars</b></span><i>orbited by</i><span>🪐 <b>Planets</b></span><i>may have</i><span>🌕 <b>Moons</b></span></div><p>Scale matters: a constellation is an apparent sky pattern, not a group whose stars must be physically close together.</p>'],
['Compare and classify','<table><tr><th>Example</th><th>Classification</th><th>Evidence</th></tr><tr><td>Sun</td><td>Star</td><td>Produces its own energy/light</td></tr><tr><td>Earth</td><td>Planet</td><td>Orbits the Sun</td></tr><tr><td>Halley</td><td>Comet</td><td>Icy body orbiting Sun</td></tr><tr><td>Milky Way</td><td>Galaxy</td><td>Contains vast numbers of stars</td></tr></table>'],
['Interactive challenge','<div class="science-choice" data-answer="galaxy"><b>Guess the term:</b> I contain billions of stars, gas and dust held together by gravity.<button>planet</button><button data-correct="1">galaxy</button><button>constellation</button><p></p></div>'],
['Apply','<p>Explain why the Moon is not a planet and why the Sun is not a planet. Then compare an asteroid with a comet.</p>'],
['Exit ticket','<p>Classify five: Sun, Europa, Mars, Andromeda, a small rocky body orbiting the Sun.</p>']]);
lesson(E,ET,2,'The Solar System and Planet Features','Compare planets using distinguishing physical and orbital features.','I can compare planets by composition, temperature, size, orbit, rotation, axial tilt, moons and rings.',[
['Do Now','<p>Name the eight planets in order from the Sun.</p>'],
['Learn — eight different worlds','<p>The planets are <strong>Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune</strong>. The inner planets are smaller and rocky; the outer planets are much larger and dominated by gases/ices. Planets differ in <strong>composition, temperature, size, orbital period, rotation, axial tilt, number of moons and ring systems</strong>.</p>'],
['Solar-system diagram','<div class="orbit-strip"><b>☀️ Sun</b><span>Mercury</span><span>Venus</span><span>🌍 Earth</span><span>Mars</span><span>Jupiter</span><span>Saturn</span><span>Uranus</span><span>Neptune</span></div>'],
['Evidence table','<table><tr><th>Feature</th><th>Useful comparison</th></tr><tr><td>Composition</td><td>rocky vs gas/ice-rich</td></tr><tr><td>Orbit</td><td>distance/path and time around Sun</td></tr><tr><td>Rotation</td><td>spin and length of day</td></tr><tr><td>Axial tilt</td><td>orientation of spin axis</td></tr><tr><td>Moons/rings</td><td>satellite and ring systems</td></tr></table>'],
['Data detective','<p>A very large planet is mostly gas, has many moons and a ring system. Which broad group is it likely to belong to: inner rocky planets or outer giant planets? Justify using evidence.</p>'],
['Misconception check','<p><strong>Claim:</strong> “The planet closest to the Sun must always be the hottest.” Evaluate this claim. Consider that temperature also depends on atmosphere and surface conditions.</p>'],
['Exit ticket','<p>Choose two planets and compare them using at least four SCSA features.</p>']]);
lesson(E,ET,3,'Orbits, Rotation and Models','Distinguish rotation from revolution and interpret orbital models.','I can explain rotation, orbit/revolution and use models without confusing their scale.',[
['Learn','<p><strong>Rotation</strong> is spinning about an axis. <strong>Revolution/orbit</strong> is movement around another body due largely to gravity. Earth rotates in about 24 hours and revolves around the Sun in about one year. The Moon rotates and revolves around Earth.</p>'],
['Diagram','<div class="orbit-model"><div class="sun">☀️</div><div class="path"><div class="earth">🌍 ↻</div></div></div><p>The circular diagram is a teaching model; real planetary orbits are elliptical and the diagram is not to scale.</p>'],
['Model critique','<p>Identify two limitations of a classroom lamp-and-ball Solar System model. Consider size, distance, orbit shape and speed.</p>'],
['Match','<p>Match: <b>24 hours</b>, <b>one year</b>, <b>spin</b>, <b>path around Sun</b> to rotation or revolution.</p>'],
['Exit ticket','<p>Explain the difference between rotation and revolution in your own words and provide one example of each.</p>']]);
lesson(E,ET,4,'Phases of the Moon','Explain predictable lunar phases from Sun–Earth–Moon geometry.','I can explain phases as different views of the Moon’s sunlit half.',[
['Learn','<p>The Sun always illuminates roughly half of the Moon. As the Moon orbits Earth, we see changing fractions of that illuminated half. The sequence includes <strong>new moon, waxing crescent, first quarter, waxing gibbous, full moon, waning gibbous, third/last quarter and waning crescent</strong>.</p>'],
['Phase diagram','<div class="phase-row"><span>🌑<b>New</b></span><span>🌒<b>Waxing crescent</b></span><span>🌓<b>First quarter</b></span><span>🌔<b>Waxing gibbous</b></span><span>🌕<b>Full</b></span><span>🌖<b>Waning gibbous</b></span><span>🌗<b>Last quarter</b></span><span>🌘<b>Waning crescent</b></span></div>'],
['Misconception check','<p>Moon phases are <strong>not</strong> normally caused by Earth’s shadow. Earth’s shadow is involved in a lunar eclipse.</p>'],
['Unjumble','<p>Put these in order: full moon · waxing crescent · new moon · first quarter · waxing gibbous.</p>'],
['Apply','<p>Why can the Moon look half-lit even though half of it is always illuminated by the Sun?</p>'],
['Exit ticket','<p>Explain a full moon using the relative positions of Sun, Earth and Moon.</p>']]);
lesson(E,ET,5,'Solar and Lunar Eclipses','Use alignment models to explain eclipses.','I can distinguish solar and lunar eclipses and explain why they do not occur every month.',[
['Learn','<p>A <strong>solar eclipse</strong> occurs when the Moon passes between the Sun and Earth so its shadow falls on part of Earth. A <strong>lunar eclipse</strong> occurs when Earth lies between the Sun and Moon and Earth’s shadow falls on the Moon.</p>'],
['Alignment diagrams','<div class="align"><div>☀️ → 🌑 → 🌍<b>Solar eclipse</b></div><div>☀️ → 🌍 → 🌕<b>Lunar eclipse</b></div></div>'],
['Why not monthly?','<p>The Moon’s orbital plane is tilted relative to Earth’s orbital plane, so exact alignment is uncommon. Most months the Moon passes above or below the required alignment.</p>'],
['Drag-order challenge','<p>For each eclipse, arrange Sun, Earth and Moon in the correct order. Then identify where the shadow falls.</p>'],
['Exit ticket','<p>Compare a solar and lunar eclipse in three scientifically accurate sentences.</p>']]);
lesson(E,ET,6,'Seasons and Earth’s Tilt','Explain seasons using Earth’s axial tilt and revolution.','I can relate sunlight angle and day length to seasonal change.',[
['Learn','<p>Earth’s axis is tilted by about 23.5°. As Earth revolves around the Sun, each hemisphere alternately tilts more toward or away from the Sun. A hemisphere tilted toward the Sun receives more direct sunlight and longer daylight, producing warmer seasonal conditions. Six months later the pattern reverses.</p>'],
['Season model','<div class="season-grid"><span>☀️</span><div>🌍↗<b>Southern summer</b><small>more direct sunlight; longer days</small></div><div>🌍↗<b>Southern winter</b><small>less direct sunlight; shorter days</small></div></div>'],
['Misconception','<p>Seasons are <strong>not primarily caused by Earth being nearer or farther from the Sun</strong>. Axial tilt changes the angle and duration of incoming sunlight.</p>'],
['Perth application','<p>Explain why Perth experiences summer around December while Europe experiences winter.</p>'],
['Exit ticket','<p>Use the words <strong>tilt, revolution, sunlight angle, day length</strong> to explain seasons.</p>']]);
lesson(E,ET,7,'Tides','Explain tides as predictable changes linked mainly to the Moon and Sun.','I can explain high and low tides and compare spring and neap tide alignments.',[
['Learn','<p><strong>Tides</strong> are regular changes in sea level caused mainly by gravitational interactions with the Moon, with the Sun also contributing. Earth’s oceans form tidal bulges, and coastlines rotate through regions of higher and lower water level.</p>'],
['Spring vs neap','<div class="tides"><div>☀️ — 🌍 — 🌕<b>Spring-tide alignment</b><small>Sun and Moon effects reinforce</small></div><div>☀️ — 🌍<br>　　　 │<br>　　　🌗<b>Neap-tide arrangement</b><small>effects partly oppose</small></div></div>'],
['Interpret','<p>A tide table predicts two high-water periods and two low-water periods in a day at a location. Explain why tide times are predictable but not identical everywhere.</p>'],
['Exit ticket','<p>What causes tides, and how does a spring tide differ from a neap tide?</p>']]);
lesson(E,ET,8,'Predictable Phenomena — Integrated Challenge','Connect phases, eclipses, seasons and tides to relative positions in space.','I can choose an appropriate Sun–Earth–Moon model to explain a phenomenon.',[
['Concept map','<div class="concept"><b>Position and motion</b><span>Moon orbit → phases</span><span>special alignment → eclipses</span><span>Earth tilt + orbit → seasons</span><span>gravity + relative positions → tides</span></div>'],
['Scenario carousel','<ol><li>Southern Hemisphere tilted toward Sun.</li><li>Moon between Sun and Earth in exact alignment.</li><li>Earth between Sun and Moon in exact alignment.</li><li>Sun, Earth and Moon roughly aligned for stronger tidal range.</li></ol><p>Name and explain each phenomenon.</p>'],
['Model evaluation','<p>Choose one diagram from this topic. State what it explains well and one limitation.</p>'],
['Mastery preparation','<p>Draw four labelled models from memory: lunar phase, solar eclipse, seasons and tides. Check each against the scientific explanation.</p>']]);

const P='Physical Sciences',PT='Forces and simple machines';
lesson(P,PT,1,'Forces and Motion','Understand that unbalanced forces change an object’s motion.','I can identify forces, distinguish balanced/unbalanced situations and use newtons.',[
['Learn','<p>A <strong>force</strong> is a push or pull measured in <strong>newtons (N)</strong>. Forces have size and direction. When forces on an object are balanced, its motion does not change. An <strong>unbalanced force</strong> causes a change in motion: speeding up, slowing down or changing direction.</p>'],
['Force diagram','<div class="forcebox"><span>← 30 N</span><b>📦</b><span>50 N →</span></div><p>Resultant effect is toward the larger force, so this object’s motion changes to the right.</p>'],
['Calculate','<p>A trolley is pushed 18 N right while friction acts 6 N left. Determine the net force and direction.</p>'],
['True/false','<p>“If an object is moving, there must always be an unbalanced force in the direction it moves.” Decide and justify.</p>'],
['Exit ticket','<p>Define force, state its unit and explain the effect of an unbalanced force.</p>']]);
lesson(P,PT,2,'Friction','Explain friction as a contact force affecting motion.','I can identify useful and unwanted friction and predict its effect.',[
['Learn','<p><strong>Friction</strong> is a contact force that opposes relative motion between surfaces. Roughness, materials and the force pressing surfaces together can affect friction. Friction enables walking and braking but can also cause heating and wear.</p>'],
['Diagram','<div class="friction"><span>motion →</span><b>🚗</b><span>← friction</span></div>'],
['Investigation','<p><strong>Question:</strong> How does surface type affect the force needed to pull a block at steady speed? Identify the changed variable, measured variable, two controlled variables, a risk and how repeated trials improve data quality.</p>'],
['Apply','<p>Why do sports shoes use textured soles? Why might oil reduce friction in machinery?</p>'],
['Exit ticket','<p>Give one useful and one unwanted example of friction and explain each.</p>']]);
lesson(P,PT,3,'Gravitational Force','Describe gravity as a non-contact attractive force.','I can distinguish mass and weight qualitatively and identify gravity in force diagrams.',[
['Learn','<p><strong>Gravity</strong> is an attractive non-contact force between masses. Near Earth, gravity pulls objects toward Earth’s centre. An object’s <strong>mass</strong> describes how much matter it contains, while its <strong>weight</strong> is the gravitational force acting on it and is measured in newtons.</p>'],
['Diagram','<div class="gravity"><span>⚽</span><i>↓ gravitational force</i><b>🌍</b></div>'],
['Compare','<p>An astronaut has the same mass on Earth and the Moon but a different weight. Explain why.</p>'],
['Exit ticket','<p>Why is gravity called a non-contact force? Distinguish mass from weight.</p>']]);
lesson(P,PT,4,'Magnetic Force','Explore attraction and repulsion as non-contact magnetic forces.','I can predict interactions between poles and identify magnetic-force applications.',[
['Learn','<p>Magnets exert forces without direct contact. Like poles repel; unlike poles attract. Magnetic effects are strongest near a magnet’s poles. Only some materials respond strongly to magnets.</p>'],
['Field idea','<div class="magnet"><b>N</b><span>)))) magnetic interaction ((((</span><b>S</b></div>'],
['Predict','<p>Predict what happens for N–N, S–S and N–S arrangements. Then explain why a magnet can move an iron object without touching it.</p>'],
['Application','<p>Identify one technology that uses magnetic force and explain the role of the force.</p>'],
['Exit ticket','<p>State the pole rule and explain why magnetism is classified as a non-contact force.</p>']]);
lesson(P,PT,5,'Electrostatic Force','Explain attraction and repulsion between electric charges.','I can describe electrostatic interactions as non-contact forces.',[
['Learn','<p><strong>Electrostatic force</strong> acts between electrically charged objects. Like charges repel and unlike charges attract. Rubbing some insulating materials can transfer electrons, leaving an imbalance of charge.</p>'],
['Charge diagram','<div class="charges"><span>＋　← repel →　＋</span><span>＋　→ attract ←　−</span></div>'],
['Everyday example','<p>A rubbed balloon can attract small paper pieces or stick temporarily to a wall. Explain this using electric charge and non-contact force.</p>'],
['Compare forces','<p>Create a Venn diagram comparing magnetic, gravitational and electrostatic forces. Include at least one similarity and one difference for each.</p>'],
['Exit ticket','<p>Predict what happens between two like charges and between unlike charges.</p>']]);
lesson(P,PT,6,'Balanced and Unbalanced Force Diagrams','Use arrows to represent force size and direction.','I can interpret and construct qualitative force diagrams.',[
['Learn','<p>Force diagrams use arrows: arrow direction shows force direction and relative arrow length can show relative magnitude. Opposing equal forces are balanced. Unequal forces are unbalanced.</p>'],
['Examples','<div class="diagram-pair"><div>← 20 N　📦　20 N →<b>balanced</b></div><div>← 10 N　📦　35 N →<b>unbalanced right</b></div></div>'],
['Draw','<p>Draw a force diagram for a book resting on a table, then for a sled being pulled forward while friction acts backward.</p>'],
['Spot the error','<p>A student says a stationary book has no forces acting on it. Correct the explanation.</p>'],
['Exit ticket','<p>What information should a force arrow communicate?</p>']]);
lesson(P,PT,7,'Levers and Mechanical Advantage','Explain how levers can provide force, distance or speed advantage.','I can identify effort, load and fulcrum and reason about lever advantage.',[
['Learn','<p>A <strong>lever</strong> is a rigid bar that pivots around a <strong>fulcrum</strong>. An <strong>effort</strong> force acts to move a <strong>load</strong>. Changing the distances from the fulcrum changes the mechanical advantage. A longer effort arm can allow a smaller effort force to move a load, while other arrangements can favour distance or speed.</p>'],
['Lever diagram','<div class="lever"><span>EFFORT ↓</span><div class="bar">──────────────</div><i>▲ fulcrum</i><span>LOAD ↑</span></div>'],
['Examples','<p>Seesaws, crowbars, wheelbarrows and parts of the human body can act as levers. For each, identify the pivot, effort and load.</p>'],
['STEM challenge','<p>Design a lever arrangement to lift a heavy object using the smallest practical effort. Sketch it and explain how changing the fulcrum position affects force and movement distance.</p>'],
['Exit ticket','<p>Explain why gaining force advantage often means the effort moves through a greater distance.</p>']]);
lesson(P,PT,8,'Inclined Planes','Explain how ramps trade force for distance.','I can explain the mechanical advantage of an inclined plane.',[
['Learn','<p>An <strong>inclined plane</strong> is a sloping surface. Moving a load up a ramp can require a smaller force than lifting it vertically, but the load travels a greater distance. This is a force–distance trade-off.</p>'],
['Diagram','<div class="ramp"><span>📦 ↗</span><div></div><b>same height, longer path</b></div>'],
['Compare','<p>Two ramps reach the same platform. Ramp A is short and steep; Ramp B is long and gentle. Predict which generally needs less input force and which requires greater travel distance.</p>'],
['Investigation','<p>Plan a reproducible investigation into ramp slope and pulling force. Include variables, equipment, repeated trials, risk management and a suitable graph.</p>'],
['Exit ticket','<p>Explain the mechanical advantage of a ramp without saying that it “reduces the work to zero.”</p>']]);
lesson(P,PT,9,'Wheel and Axle','Explain mechanical advantage in wheel-and-axle systems.','I can identify wheel-and-axle systems and describe force, distance or speed trade-offs.',[
['Learn','<p>A <strong>wheel and axle</strong> consists of two connected rotating parts of different radii. Applying force at the larger radius can create a force advantage at the axle; applying input differently can instead favour speed or distance.</p>'],
['Diagram','<div class="wheel"><div>◯<span>large wheel</span><i>● axle</i></div></div>'],
['Examples','<p>Door knobs, steering wheels, screwdrivers and some winches use wheel-and-axle principles. Choose two and identify where effort is applied and where the output occurs.</p>'],
['Apply','<p>Why can a large steering wheel make turning easier than gripping a small central shaft directly?</p>'],
['Exit ticket','<p>Describe one force advantage and one possible speed/distance advantage of simple machines.</p>']]);
lesson(P,PT,10,'Simple Machines Engineering Challenge','Integrate levers, inclined planes and wheels/axles to solve a problem.','I can justify a machine design using mechanical advantage and evidence.',[
['Design brief','<p>You must move a heavy load onto a raised platform using only a lever, ramp and wheel-and-axle components. Create a labelled design.</p>'],
['Engineering reasoning','<p>For each component, explain whether it gives a <strong>force, distance or speed advantage</strong> and what trade-off occurs. Your design should not claim that a machine creates energy.</p>'],
['Test and improve','<p>Propose measurements for input force and movement distance. Describe how you would compare two designs fairly, identify anomalies and improve the investigation.</p>'],
['Mastery review','<ol><li>What changes motion?</li><li>State the unit of force.</li><li>Compare friction, gravity, magnetism and electrostatic force.</li><li>Explain balanced vs unbalanced forces.</li><li>Explain mechanical advantage for a lever, ramp and wheel/axle.</li></ol>']]);

/* topic catalogues */
window.Year7EarthTopics=[
{id:'celestial',title:'Celestial Objects',subtitle:'Stars, planets, moons, asteroids, meteoroids, comets, constellations and galaxies',icon:'🌌',lessons:[1]},
{id:'planets',title:'Solar System & Planet Features',subtitle:'Composition, temperature, size, orbit, rotation, tilt, moons and rings',icon:'🪐',lessons:[2,3]},
{id:'moon',title:'Moon Phases & Eclipses',subtitle:'Sun–Earth–Moon geometry and predictable phenomena',icon:'🌕',lessons:[4,5]},
{id:'seasons',title:'Seasons',subtitle:'Earth’s axial tilt, revolution and sunlight',icon:'🌍',lessons:[6]},
{id:'tides',title:'Tides',subtitle:'Gravitational interactions of Earth, Moon and Sun',icon:'🌊',lessons:[7]},
{id:'earth-review',title:'Predictable Phenomena Review',subtitle:'Integrate phases, eclipses, seasons and tides',icon:'🔭',lessons:[8]}
];
window.Year7PhysicalTopics=[
{id:'forces',title:'Forces & Motion',subtitle:'Unbalanced forces and the newton',icon:'➡️',lessons:[1,6]},
{id:'friction',title:'Friction',subtitle:'Contact forces, motion and investigations',icon:'🛞',lessons:[2]},
{id:'gravity',title:'Gravity',subtitle:'Non-contact gravitational force',icon:'🌍',lessons:[3]},
{id:'magnetic',title:'Magnetic Forces',subtitle:'Attraction, repulsion and applications',icon:'🧲',lessons:[4]},
{id:'electrostatic',title:'Electrostatic Forces',subtitle:'Forces between electric charges',icon:'⚡',lessons:[5]},
{id:'levers',title:'Levers',subtitle:'Fulcrum, effort, load and mechanical advantage',icon:'⚖️',lessons:[7]},
{id:'ramps',title:'Inclined Planes',subtitle:'Force–distance trade-offs',icon:'📐',lessons:[8]},
{id:'wheel-axle',title:'Wheels & Axles',subtitle:'Force, distance and speed advantage',icon:'⚙️',lessons:[9]},
{id:'machines',title:'Simple Machines Challenge',subtitle:'Engineering design and mastery',icon:'🛠️',lessons:[10]}
];
const st=document.createElement('style');st.textContent=`.space-map,.orbit-strip,.phase-row,.concept{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;padding:20px;background:#eef5ff;border:2px solid #6587b4;border-radius:16px}.space-map span,.orbit-strip span,.phase-row span,.concept span{background:white;border:1px solid #a9bdd5;border-radius:12px;padding:10px;text-align:center}.phase-row span{display:grid;gap:4px;font-size:28px}.phase-row b{font-size:11px}.orbit-model{position:relative;height:240px;display:grid;place-items:center}.orbit-model .sun{font-size:55px}.orbit-model .path{position:absolute;width:300px;height:170px;border:3px dashed #7993aa;border-radius:50%}.orbit-model .earth{position:absolute;right:-22px;top:60px;font-size:32px}.align,.tides,.diagram-pair,.season-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.align div,.tides div,.diagram-pair div,.season-grid div{padding:20px;background:#eef8f5;border:2px solid #62a191;border-radius:14px;text-align:center}.align b,.tides b,.season-grid b{display:block;margin-top:10px}.align small,.tides small,.season-grid small{display:block}.forcebox,.friction,.magnet{display:flex;justify-content:center;align-items:center;gap:28px;padding:30px;background:#f1f6fa;border-radius:16px;font-size:22px}.gravity{display:grid;place-items:center;gap:8px;font-size:38px}.gravity i{font-size:15px}.charges{display:grid;gap:15px;text-align:center;font-size:24px}.lever{display:grid;grid-template-columns:1fr 2fr 1fr;align-items:center;text-align:center;padding:25px}.lever .bar{border-bottom:8px solid #6f4d35}.ramp{padding:25px;text-align:center}.ramp div{height:120px;max-width:400px;margin:auto;border-bottom:7px solid #596b76;border-right:7px solid #596b76;transform:skewY(-18deg)}.wheel{text-align:center;font-size:100px}.wheel span,.wheel i{display:block;font-size:14px}.science-choice button{margin:8px;padding:9px 13px}@media(max-width:650px){.align,.tides,.diagram-pair,.season-grid{grid-template-columns:1fr}.orbit-model .path{width:220px}.forcebox,.friction,.magnet{gap:12px;font-size:16px}}`;document.head.appendChild(st);
})();