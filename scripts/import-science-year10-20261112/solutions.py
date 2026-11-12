MC={};SOL={};OV={};NOTES={}
def mc(prefix,text):
 for n,row in enumerate(text.strip().split('\n'),1):
  letter,ex=row.split('|',1);MC[prefix+str(n)]=(letter,ex)
def s(key,marks,ex,kind='Short answer'):SOL[key]=(marks,ex,kind)
mc('chem-A','''A|Heating increases particles’ average kinetic energy, so collisions are more frequent and a larger fraction exceed the activation energy. More successful collisions per second increase the rate.
D|The same tablet reacts in 30 s in hot water rather than 100 s in cold water. Its average rate is therefore about 100/30 = 3.33 times greater. These results alone do not establish a doubling per 10°C.
B|Powder exposes a greater surface area for the same mass, allowing more magnesium particles to contact oxygen and react at once.
D|CuCO₃ contains Cu (copper), C (carbon) and O (oxygen). The other formulas lack at least one of these elements.
C|Zinc conducts electricity because its delocalised electrons are mobile and carry charge through the solid metal.
D|Zn + 2HCl → ZnCl₂ + H₂ balances Zn, H and Cl. Doubling all coefficients also balances the equation, so both B and C work, although B is the simplest ratio.
D|Mg²⁺ requires two Cl⁻ ions to give zero net charge, so the formula is MgCl₂.
B|Sample A has the least exposed surface area for the same mass, so fewer sugar particles contact water at once. Dissolving sugar is a physical change.
A|Charge = protons − electrons = 17 − 18 = −1. The other examples have equal proton and electron numbers and are neutral.
C|Substances 1 and 4 conduct electricity and are malleable. Both properties together support their classification as metals; colour alone is insufficient.
C|Reactants are left of the arrow: Mg and HCl. Among the options, HCl is a reactant; MgCl₂ and H₂ are products.
C|Metallic bonding is electrostatic attraction between positive metal ions in a lattice and mobile delocalised electrons.
D|The 2 outside (NO₃) multiplies both N and O: Mg = 1, N = 2 and O = 6.
A|Balance Al first, then sulfate and hydrogen: 2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂. Both sides contain 2 Al, 3 S, 12 O and 6 H.
C|Atomic number is proton number. Increasing proton number defines the sequence of elements in the modern periodic table.
C|All nitrates and all sodium salts are soluble under standard school solubility rules. NaNO₃ is therefore soluble; the other listed salts are treated as insoluble.
D|One mole contains approximately 6.02 × 10²³ specified entities. The entities may be atoms, molecules, ions or other particles, depending on what is being counted.''')
mc('bio-A','''A|Mitosis produces two daughter cells with the same chromosome complement as the parent, apart from mutation. A shows two cells with the original chromosome number.
B|Meiosis makes haploid gametes. Fertilisation combines two haploid sets, restoring the diploid number and maintaining that number across generations.
C|A fertilised egg is diploid: 2n = 8. Each gamete is haploid: n = 8/2 = 4.
C|Eye colour is strongly influenced by inherited alleles. Occupation is learned; weight and food preference have strong environmental influences.
B|Comparing homologous DNA sequences provides direct evidence of genetic similarity. Greater similarity generally supports a more recent common ancestor.
D|Homozygous means identical alleles: AA or aa. Aa contains different alleles and is heterozygous.
D|Shared developmental features support common ancestry. Different inherited adaptations were favoured in different environments over generations, including fins and wings. DNA does not simply transform from fish-like to bird-like as an embryo develops.
B|B crosses homozygous QQ with heterozygous Qq. A homozygote has two identical alleles; a heterozygote has two different alleles.
B|Mutation is a change in genetic material, such as the DNA base sequence. Recombination rearranges existing alleles rather than necessarily creating new ones.
A|Mutation is the original source of new alleles. Crossbreeding combines existing alleles; selection changes their frequencies.
B|Only the original strain appears at P, but the new strain is present at Q. Therefore the mutation occurred between P and Q, before insecticide selected survivors at R.
D|Lice surviving the insecticide at R are resistant to that treatment. This does not make them impossible to kill by all methods.
C|Susceptible lice die more readily; resistant lice survive and reproduce. Differential survival and reproduction of heritable variants is natural selection.
B|In the intended simplified comparison, more food alone does not create new alleles or reproductive isolation. Mutations, sexual recombination and isolation can contribute directly to evolutionary change. Food availability can nevertheless change selection pressures.
A|Short generations allow many reproductive cycles in a short time, so selection can change allele frequencies quickly across generations.
D|Heritable variation supplied by mutation and recombination, combined with changing selection pressures, permits strong differential survival and reproduction.
C|Isolation reduces gene flow. Different environments favour different inherited traits; accumulated differences can lead to reproductive isolation and separate species.
D|Environmental change can remove suitable habitat or resources or impose conditions that the population cannot survive, causing extinction.
D|Natural selection is a mechanism of evolution. Fossils and comparative anatomy and embryology are observations used as evidence of evolutionary relationships.
B|Evolution is change in a population’s inherited characteristics or allele frequencies over generations, rather than change within one organism’s lifetime.''')
mc('earth-A','''C|The Oort cloud is a distant reservoir of icy bodies that can be disturbed into long-period comet orbits.
B|A Sun-like star evolves from protostar to main sequence to red giant, then sheds its outer layers and leaves a white dwarf. A brown dwarf does not sustain normal hydrogen fusion.
C|The intended school ordering is red giant, main-sequence star, neutron star, black hole. Red giants have low average density; neutron stars are highly compact. A black hole’s assigned average density depends on its mass and definition, so this is a simplified comparison.
B|The main asteroid belt lies between the orbits of Mars and Jupiter.
D|The first image shows a central bar, the second a smooth elliptical shape, the third spiral arms and the fourth an irregular shape: barred spiral, elliptical, spiral, irregular.
A|The Sun’s core has the high temperature and pressure needed for hydrogen fusion. Energy then travels outward through the radiative and convective zones.
D|100 billion is the intended order-of-magnitude estimate in this historical assessment. It is not a fixed modern census; estimates depend on observational sensitivity and what is counted.
A|Systematic recession of distant galaxies, inferred from their redshifts, supports expanding space and a hotter, denser earlier universe.
B|The early universe produced mostly hydrogen and helium. Heavier elements formed later through stellar nucleosynthesis and energetic stellar events.
C|A sunspot is cooler than the surrounding photosphere and looks dark by contrast. It still emits light.
D|Fusion turns hydrogen into helium with a small decrease in rest mass. The mass difference is released as energy: E = Δmc². This is not chemical burning.
C|The listed sequence is core → radiative zone → convective zone → photosphere (surface) → corona. The chromosphere is omitted from the choices.
B|The Sun will lose its outer layers after its red-giant phase and leave a white dwarf. It is not massive enough for a core-collapse supernova.
A|A comet contains ice, dust and rock, traditionally described as a dirty snowball. Solar heating releases gas and dust; it is not burning like a fire.
C|In the intended massive-star pathway, a red supergiant can undergo core collapse and leave a black hole if the remnant is sufficiently massive.''')
mc('earth-ExtA','''A|L = 4πR²σT⁴. A cool surface radiates less per unit area, so a cool but highly luminous star needs a very large surface area and radius.
D|At equal luminosity, R²T⁴ is constant. The larger star must have a lower surface temperature and therefore a redder colour.
C|Surface temperature determines the broad thermal colour: hotter stars are bluer and cooler stars redder.
C|Plasma contains free electrons and positive ions, including atomic nuclei, rather than only neutral atoms.
A|B is at high luminosity and low temperature on the upper right of the H–R diagram, where red giants and supergiants lie.
D|White dwarfs are hot but faint because they have small radii. They lie at the lower left, region D in this diagram.
A|An approaching source produces closer-spaced wavefronts, shorter wavelength and higher observed frequency, so the pitch rises.
A|Solar wind pushes ionised gas away from the Sun; radiation pressure also pushes dust. A comet’s tail does not merely trail its direction of motion.
C|The luminous passage through the atmosphere is a meteor. The object in space is a meteoroid; a surviving fragment on the ground is a meteorite.
A|Fusion releases energy from a small rest-mass difference, E = Δmc², so the Sun loses mass as it radiates energy.''')
mc('sem1-A','''A|Atomic number counts protons in the nucleus and identifies the element; it does not change when electrons are gained or lost.
C|A neutral potassium atom has 19 electrons, arranged 2,8,8,1 in the school shell model.
C|Magnesium has configuration 2,8,2: three occupied shells put it in period 3 and two valence electrons put it in group 2.
B|Losing two negatively charged electrons leaves two more protons than electrons, producing X²⁺ without changing the nucleus.
C|For ²³₁₁Na, A = 23 and Z = 11. Neutrons = 23 − 11 = 12.
C|In the standard school model, a metal transfers electrons to a non-metal, producing oppositely charged ions whose attraction is ionic bonding.
C|P₄O₁₀ + 10C → P₄ + 10CO conserves 4 P, 10 O and 10 C atoms. The other equations are unbalanced as printed.
C|Al₂(SO₄)₃ contains 2 Al + 3 S + 12 O = 17 atoms per formula unit. The sulfate subscript multiplies both S and O.
B|The modern periodic table orders elements by increasing atomic number, not by atomic mass or density.
C|A full valence shell makes noble gases relatively stable and generally unreactive; merely being gaseous does not explain this.''')
mc('sem2-A','''C|Velocity includes direction and uses displacement per time; speed is distance per time and has no direction.
C|30 min = 0.5 h. Distance = vt = 50 × 0.5 = 25 km.
C|From 0 to 4 s, position increases from 0 to 8 m. Speed = 8/4 = 2 m/s.
B|From 4 to 8 s, position increases from 8 to 10 m. Speed = (10 − 8)/(8 − 4) = 0.5 m/s.
D|At 6 s the position is halfway between 8 m at 4 s and 10 m at 8 s, giving 9 m.
A|Newton’s first law explains the driver continuing forward as the car stops; the windscreen then supplies the stopping force if no belt restrains the driver.
B|72 km/h ÷ 3.6 = 20 m/s. Acceleration = (20 − 0)/4 = 5 m/s².
C|The astronaut and container exert equal opposite forces. With equal masses and initially zero total momentum, they move at equal speeds in opposite directions.
A|Atomic number is proton number. Electron loss changes charge, not element identity.
C|Mg + 2HCl → MgCl₂ + H₂ conserves each atom, giving x = 2.
A|Electron loss removes negative charge, leaving a positive ion. Proton number remains unchanged.
C|P₄O₁₀ + 10C → P₄ + 10CO has 4 P, 10 O and 10 C on each side.
C|A molecule is a discrete group of two or more chemically bonded atoms, which may be the same or different elements.
D|Isotopes have the same proton number but different neutron numbers, giving different mass numbers.
B|Loss of two valence electrons gives X²⁺. Chemical bonding does not normally remove protons from the nucleus.
A|Neon is in group 18 and has a complete valence shell; nitrogen, chlorine and oxygen are not noble gases.
B|Cobalt (Co) is in period 4. Mg is in period 3; C and O are in period 2.
D|²³₁₁Na has mass number 23 and 23 − 11 = 12 neutrons.
A|X⁺ combines with Cl⁻ as XCl; X²⁺ combines with two Cl⁻ as XCl₂. Therefore i and v are charge-balanced.
B|A positive ion has fewer electrons than the corresponding neutral atom; its proton number is unchanged.
C|Metal–non-metal bonding is treated as ionic in the school model: electron transfer forms attracting positive and negative ions.
C|Cl–Cl and H–Cl involve electron sharing between non-metal atoms and are covalent; these are iii and iv.
B|A normal human body cell has 46 chromosomes; meiosis makes haploid gametes with 23.
D|The heterozygote is intermediate between long and round: oval. This is incomplete dominance.
A|White parents producing a black recessive offspring must both carry the recessive allele: Ww × Ww can produce ww.
D|A non-roller is rr and needs r from each parent. Only Rr × Rr among these choices can produce rr.
B|In the simplified XX/XY model, an egg contributes X and sperm contribute X or Y. This model does not encompass every variation in human sex development.
D|With incomplete dominance, long-ear LL × short-ear SS produces LS offspring with intermediate, medium-length ears.
C|Brown offspring may be BB or Bb and need a cross with bb to distinguish them. White offspring are already known to be bb, so all brown offspring need testing.
A|White mouse 2 is bb, so black mouse 1 must carry b to produce white offspring. Black mice 6 and 7 also produce a white offspring and must be Bb. Mouse 3 could be BB or Bb.
C|White fur is recessive, so unshaded mice 2, 4 and 5 all have genotype bb.
A|Black mouse 8 has Bb × Bb parents and may be BB or Bb. Phenotype alone cannot distinguish the two.
D|In the stated simplified model, blue-eyed bb × bb parents produce only bb offspring. Actual human eye colour is polygenic.
C|Populations change over generations as inherited variants differ in survival and reproduction under environmental pressures. Individuals do not evolve inherited traits by need.
A|Bird predation directly selects against conspicuous light moths on dark backgrounds. Pollution changes the background but birds are the direct selective agent.
B|Antibiotics favour survival and reproduction of resistant variants, increasing their frequency through natural selection.
B|Human choice of breeders with desirable inherited traits is artificial selection.
A|The same underlying forelimb bone arrangement with different functions is a homologous structure, supporting common ancestry.
D|A nebula is a cloud of gas and dust in space; nebulas or nebulae is its plural.
A|Compare known intrinsic brightness with apparent brightness, for example for standard candles in a galaxy. Fainter apparent brightness for the same intrinsic brightness indicates greater distance.
B|Hot material in an accretion disc outside a black hole emits X-rays. This is not light escaping from inside the event horizon.
A|The Sun consists mostly of hydrogen and helium and is not massive enough for a core-collapse supernova.
D|The corrected pathway is nebula → Sun-like main-sequence star → red giant → planetary nebula → white dwarf. The original option incorrectly ended in red dwarf.
A|2.5 million parsecs × 3.26 light-years/parsec = 8.15 million light-years, so the travel time is about 8 million years.
B|Recession shifts spectral features toward longer, redder wavelengths; approach produces blueshift.
A|Systematic recession of distant galaxies supports expansion and does not imply that the Milky Way is a unique centre.
D|Thermal colour depends on surface temperature: hotter stars are bluer and cooler stars redder.
D|The intended approximate age is 14 billion years, close to the commonly stated 13.8 billion years.
B|Earlier generations of stars formed heavy elements and stellar events dispersed enriched material before the Solar System formed. The Sun did not make Earth’s iron before Earth formed.
C|The intended red-giant model can engulf Earth. The exact outcome depends on mass loss and orbital changes, so this is the best supplied option rather than a guaranteed detailed prediction.''')
MC['sem2-A28']=('C','Cross DD × Dd. The DD parent produces only D gametes; the Dd parent produces D or d. Offspring are 50% DD and 50% Dd, all long-eared. The question asks genotype, so C is correct rather than the phenotype-only answer A.')
s('chem-A18',5,'(a) Magnesium transfers two valence electrons to oxygen: Mg → Mg²⁺ + 2e⁻ and O + 2e⁻ → O²⁻. The opposite charges attract in an ionic lattice, MgO. Show two transferred electrons and label the ion charges. [2]\n(b) Carbon shares two electron pairs with each oxygen, giving O=C=O with two double bonds. Each oxygen has two lone pairs and each atom has a complete octet. Draw and label shared pairs and lone pairs. [3]','Labelling')
s('chem-B1',1,'n = m/M. Here n is amount (mol), m mass (g), and M molar mass (g mol⁻¹). The mass divided by molar mass gives the number of moles.')
s('chem-B2',1,'M(C) = 12.01 g mol⁻¹, so one mole of carbon has mass 12.01 g. Accept 12 g when rounded atomic masses are used.')
s('chem-B3',1,'n = m/M = 36.03/12.01 = 3.000 mol of carbon.','Calculations')
s('chem-B4',2,'Oxygen gas is O₂, so M = 2 × 16.00 = 32.00 g mol⁻¹. [1] m = nM = 6 × 32.00 = 192 g. [1] Six moles of oxygen atoms would instead have mass 96 g; gas is specified to resolve the original ambiguity.','Calculations')
OV['chem-B4']='Calculate the mass of 6 moles of oxygen gas, O₂. Show working. [2]'
NOTES['chem-B4']='Specified O₂ gas; the original oxygen wording also permits an atomic interpretation.'
s('chem-B5',2,'Mᵣ(CaCO₃) = 40.08 + 12.01 + 3(16.00) = 100.09. [1 for sum; 1 for result] Relative formula mass has no units; the corresponding molar mass is 100.09 g mol⁻¹.','Calculations')
s('chem-B6',1,'Carbon usually forms four covalent bonds, sharing electrons to complete its valence shell. A double bond counts as two bonds.')
s('chem-B7',3,'For an alkane, CₙH₂ₙ₊₂ with n = 5 gives C₅H₁₂. [1] The straight-chain condensed structure is CH₃–CH₂–CH₂–CH₂–CH₃. [1] In a displayed structure, each terminal carbon has three H atoms, each internal carbon two, and every C has four bonds. [1]','Labelling')
s('chem-B8',3,'Propane is CH₃–CH₂–CH₃, C₃H₈, with only single C–C bonds. [1] Propene is CH₂=CH–CH₃, C₃H₆. [1] The double C–C bond uses an extra bonding position on each of two carbons, leaving two fewer positions for H while each C retains four bonds. [1]','Extended response')
s('chem-B9',3,'butane + oxygen → carbon dioxide + water. [1] Balance C and H first: C₄H₁₀ + 6.5O₂ → 4CO₂ + 5H₂O. [1] Multiply by two for whole-number coefficients: 2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O. [1] Check: 8 C, 20 H and 26 O on each side.','Multi-step')
s('chem-B10',7,'(a) Pb(NO₃)₂(aq) + 2NaI(aq) → PbI₂(s) + 2NaNO₃(aq). [2; ½ per state] PbI₂ is the insoluble precipitate.\n(b) Atoms are conserved. Coefficients match the number of each atom without changing the identity of a substance; changing subscripts changes the substance. [2]\n(c) The mole ratio is 1:1, so 2 mol Pb(NO₃)₂ produces 2 mol PbI₂. [1]\n(d) M(PbI₂) = 207.2 + 2(126.9) = 461.0 g mol⁻¹. m = nM = 2 × 461.0 = 922 g. [2]','Multi-step')
s('chem-B11',6,'C₂H₆: covalent bonding; draw H₃C–CH₃ with six C–H bonds and one C–C bond. Shared pairs hold atoms in discrete ethane molecules. [3: bonding, structure, explanation]\nCaCl₂: ionic bonding; draw a repeating array of Ca²⁺ and Cl⁻ ions with twice as many chloride ions as calcium ions. Electrostatic attraction extends throughout the lattice; CaCl₂ states an ion ratio, not a separate molecule. [3]','Extended response')
s('chem-B12',3,'Draw an array of positive metal ions surrounded by delocalised electrons and label both. [1] The ions remain at lattice positions in the solid. [1] Under a potential difference, mobile electrons drift through the metal carrying charge, so it conducts. [1]','Labelling')
s('bio-B21',2,'E → B → D → A → C. E shows the cell before mitosis; B chromosome condensation; D equatorial alignment; A chromatid separation; C daughter cells. [2 for correct sequence; partial credit for a substantially correct order] The supplied key repeats E in third place; D is the correct diagram.','Labelling')
NOTES['bio-B21']='Corrected key sequence E–B–E–A–C to E–B–D–A–C after diagram inspection.'
s('bio-B22',7,'(a) Female: the first shaded person is a circle. [1]\n(b) Recessive. [1] Unaffected parents A and B have affected child D. [1] Both must carry the recessive allele, Bb, to produce affected bb; a fully penetrant dominant trait would normally require an affected parent. [1]\n(c) Bb × Bb gives BB, Bb, Bb and bb. [2 for genotypes and square] One of four possibilities is affected: 25% for each pregnancy. [1]','Multi-step')
s('bio-B23',6,'(a) WW, homozygous dominant for white fur in this question’s model; both alleles are W. [2]\n(b) The diagram defines white W as dominant and black w as recessive. The black male is ww. [1] A Ww female crossed with ww would give 50% Ww white and 50% ww black. [1] WW × ww instead gives Ww in every cell of the Punnett square. [1] Thus all offspring are white, matching the stated result. [1]','Multi-step')
s('bio-B24',2,'Replication copies each chromosome before division. [1] Separation of the sister chromatids can then give each daughter cell a complete copy of the genetic information. [1]')
s('bio-B25',3,'Label a phosphate group, deoxyribose sugar and nitrogenous base. [1 each] The phosphate and base each attach to the sugar: phosphate–sugar–base. One nucleotide has one base, A, T, C or G; it is not an entire base pair.','Labelling')
s('bio-B26',8,'(a) Smaller heads limit swallowed toad size and thus toxin intake. [2] Larger bodies reduce toxin dose per unit body mass and increase survival. [2]\n(b) Heritable variation in head/body size already existed. [1] Toxic cane toads imposed a selection pressure. [1] Small-headed, large-bodied snakes were more likely to survive and reproduce. [1] Their relevant alleles became more common over generations. Individuals did not deliberately alter inherited anatomy through need. [1]','Comprehension')
s('bio-B27',4,'Incorrectly spaced or incomplete prescribed treatment can allow bacteria to survive. [1] Less-susceptible variants may have a survival advantage during antibiotic exposure. [1] Survivors reproduce and pass on resistance determinants, increasing their frequency. [1] Infection may persist or recur, so medication should be taken as prescribed and any change discussed with the prescriber. [1] This is selection, not proof that every missed dose creates resistance.','Extended response')
s('bio-B28',3,'Compare homologous DNA base sequences or corresponding protein amino-acid sequences. [1] Align equivalent regions and count similarities/differences. [1] Greater similarity between humans and chimpanzees supports a more recent common ancestor than with gorillas. [1]')
s('bio-B29',3,'Humans choose parents with desirable heritable characteristics and breed them repeatedly over generations. [1] For example, dairy cattle can be selected for high milk yield. [1] This increases useful traits for human purposes; humans select breeders, distinguishing artificial from natural selection. [1]')
s('earth-B16',3,'A gas-and-dust nebula collapsed under gravity. [1] It rotated faster and flattened into a disc with a hot central region forming the Sun. [1] Collisions and accretion in the disc built planetesimals and then planets. [1]')
s('earth-B17',3,'Transit method: a planet between the star and observer blocks a small fraction of starlight. [1] Regular repeated brightness dips indicate an orbiting planet. [1] Draw and label star, planet and observer, or repeated dips on a brightness–time graph. [1] A correctly explained periodic Doppler wobble method is also acceptable.','Labelling')
s('earth-B18',1,'One effect is enhanced auroral activity associated with solar activity. Accept disruption of radio communication or satellites, or power-network disturbances. Solar flares and associated coronal mass ejections are related but distinct phenomena.')
s('earth-B19',3,'Any three distinct inaccuracies: planet and Sun diameters are not to scale; orbital distances are not to the same scale as sizes; planets are shown lined up rather than at their actual positions; Pluto is shown among planets although classified as a dwarf planet. [1 each]','Data / source analysis')
s('earth-ExtB11',3,'(a) Compare stellar absorption lines in Andromeda with laboratory wavelengths. [1] Their shift to shorter wavelengths is blueshift, indicating approach; the fractional shift yields the line-of-sight velocity. [1]\n(b) Most distant galaxies recede with cosmic expansion, whereas Andromeda’s local gravitational motion is toward the Milky Way. [1]','Data / source analysis')
OV['earth-ExtB11']='Andromeda is a nearby large galaxy approaching the Milky Way at about 110 km/s along our line of sight. (a) Explain how astronomers determine this motion using a spectrum. [2] (b) Why is its direction different from the general distant-galaxy trend? [1]'
NOTES['earth-ExtB11']='Corrected key redshift to blueshift, and nearest neighbouring galaxy to nearby large galaxy.'
s('earth-ExtB12',2,'Draw a curve with a higher intensity [1] and a peak further left, at shorter wavelengths/bluer light. [1] A hotter thermal emitter has a shorter peak wavelength and greater emission per unit area.','Labelling')
s('earth-ExtB13',2,'A star initially 15–20 times the Sun’s mass can become a red supergiant and undergo core-collapse supernova. [1] The remnant can be a neutron star or, if sufficiently massive, a black hole. [1] Outcome depends on remaining core mass and mass loss.')
OV['earth-ExtB13']='Explain one possible future for a star whose initial mass is 15–20 times the mass of the Sun. [2]'
NOTES['earth-ExtB13']='Clarified larger as initial mass, not radius.'
s('earth-ExtB14',3,'Each element produces a characteristic pattern of spectral lines. [1] Compare observed line patterns with laboratory reference spectra, allowing for a shared Doppler shift. [1] Matching patterns identify elements in the star’s atmosphere. [1]')
OV['earth-A7']='According to the estimate used in this 2015 assessment, approximately how many galaxies were thought to be in the observable universe?'
NOTES['earth-A7']='Historical galaxy estimate explicitly dated.'
s('phys-A1',6,'Blanks in order: work; work; transformed; mass; position; motion; power; potential; kinetic; created; destroyed; energy. [½ each]\nEₚ = mgh depends on mass and position; Eₖ = ½mv² depends on motion. P = W/t measures work per time. Descending changes gravitational potential into kinetic and other forms while total energy is conserved.','Fill in the blanks')
s('phys-A2',4,'(a) A and E: greatest height and therefore maximum gravitational potential energy. [1]\n(b) C: minimum height. [1]\n(c) C: maximum speed and kinetic energy. [1]\n(d) A and E: turning points with instantaneous zero speed and kinetic energy. [1] Ignore air resistance and friction.','Data / source analysis')
s('phys-A3',9,'(a) Velocity = graph gradient = (20 − 0)/(10 − 0) = +2.0 m/s. [2]\n(b) The horizontal segment from 10 to 15 s gives 0 m/s. [1]\n(c) Total distance = 20 + 60 + 50 = 130 m, counting return travel positively. [1]\n(d) Average speed = 130/75 = 1.73 m/s. [2]\n(e) Final displacement = +30 m. [1]\n(f) Average velocity = 30/75 = +0.40 m/s. [2]','Calculations')
s('phys-A4',6,'Assume a steady lift, with g = 10 m/s².\n(a) F = mg = 120 × 10 = 1200 N upward. [2]\n(b) W = Fh = 1200 × 2.0 = 2400 J. [2]\n(c) P = W/t = 2400/3 = 800 W. [2] Each part earns credit for the equation/substitution and correct result with unit.','Calculations')
s('phys-A5',8,'(a) Read 25 m/s at 30 s. [1]\n(b) 25 × 3.6 = 90 km/h. [1]\n(c) a = Δv/Δt = 25/20 = 1.25 m/s². [2]\n(d) Distance is area under the graph: ½(20)(25) + (30)(25) + ½(10)(25) = 250 + 750 + 125 = 1125 m. [2]\n(e) Average speed = 1125/60 = 18.75 m/s. [2]','Calculations')
s('phys-A6',2,'Power is the rate of doing work or transferring energy, P = W/t, measured in watts (J/s). [1] A more powerful engine transfers more useful energy each second or does the same work in less time. [1] Engine capacity alone does not establish every model’s power output.')
s('phys-A7',7,'(a) W = Fd with d = 0.5 m. For 100 g: 1.5 × 0.5 = 0.75 J. For 150 g: 2.7 × 0.5 = 1.35 J. For 180 g: 3.5 × 0.5 = 1.75 J. [3]\n(b) Energy transferred for 150 g is 1.35 J. [1]\n(c) Friction [1] acts at the block–bench contact [1], opposite the motion [1]. At steady speed, pulling force balances friction.','Calculations')
s('phys-A8',8,'Use g = 10 m/s².\n(a) Eₚ = mgh = 0.06 × 10 × 3.1 = 1.86 J. [2]\n(b) Eₖ = ½mv² = 0.5 × 0.06 × 58.33² = 102.07 J ≈ 102 J. [2]\n(c) Efficiency = output/input × 100 = 102.07/1600 × 100 = 6.38%. [2]\n(d) Total energy is conserved. The remaining input is transferred to the player/racket’s motion, thermal energy, sound and other forms, so not all becomes the ball’s translational kinetic energy. [2]','Calculations')
s('phys-A9',3,'A is 15 m and C is 5 m above the same reference, so height lost = 10 m. [1] Ignoring resistive forces, mgΔh = ½mv². [1] v = √(2gΔh) = √(2 × 10 × 10) = 14.14 m/s ≈ 14 m/s. [1] Mass cancels; use height lost, not the original full height.','Calculations')
s('phys-A10',7,'(a) Nearly 1200 deaths, as reported for 2013 in the passage. [1]\n(b) Kinetic energy transfers to deformation, heat, sound and other motion. [1] Deformation and forces can crush occupants or throw them against the interior. [1]\n(c) Shorter stopping time gives greater deceleration, |a| = |Δv|/Δt. [1] F = ma then gives a greater net force for the same mass. [1]\n(d) Higher speed increases distance travelled during reaction time [1] and generally increases braking distance, making hazards harder to avoid. [1]','Comprehension')
s('mid-A1',6,'In order: kg; m/s; newton (N); joule (J); m/s²; force; velocity; speed; acceleration; Newton’s third law; Newton’s first law; Newton’s second law. [½ each]\nSpeed uses distance, velocity uses displacement and direction. The first law requires zero resultant external force, rather than no individual forces.','Fill in the blanks')
s('mid-A2',3,'(a) Average speed = 400/49.11 = 8.145 m/s ≈ 8.15 m/s. [2]\n(b) The start and finish coincide, so displacement = 0 and average velocity = 0/49.11 = 0 m/s. [1]','Calculations')
s('mid-A3',4,'(a) Draw 35 m north, then 25 m east head-to-tail; resultant runs from start to final point. [1]\n(b) Distance = 35 + 25 = 60 m. [1]\n(c) Displacement = √(35² + 25²) = 43.0 m. [1]\n(d) Direction = tan⁻¹(25/35) = 35.5° east of north, or 54.5° north of east. [1]','Calculations')
s('mid-A4',3,'Draw each pair head-to-tail to scale; resultant runs from the first tail to the final head. [1 per correct diagram]\n(a) A + B: 40 N east then 30 N southeast. Taking southeast as 45°, resultant components are 61.2 N east and 21.2 N south: magnitude ≈64.8 N, 19.1° south of east.\n(b) B + C: 21.2 N east and 46.2 N south: ≈50.9 N, 65.3° south of east.\n(c) A + C: 40 N east and 25 N south: ≈47.2 N, 32.0° south of east. Numerical values support the required drawings.','Labelling')
s('mid-A4x',7,'(a) Use the 200 m scale bar to measure route segments. The key’s approximate segment estimates are 650 + 530 + 100 = 1280 m. [2; allow reasonable measurement tolerance]\n(b) t = 20 × 60 = 1200 s. Average speed = 1280/1200 = 1.07 m/s. [3: time conversion, substitution, result]\n(c) Average-velocity magnitude is less than average speed because straight-line displacement is shorter than route distance, with the same time. [2] Carry the student’s measured distance forward consistently; the handwritten key changes its distance between parts.','Calculations')
NOTES['mid-A4x']='Source has two questions numbered 4. Preserved map question separately; key changes distance between parts, so worked solution uses consistent measured distance.'
s('mid-A5',3,'Distance = 1.5 + 40 + 10 = 51.5 km = 51,500 m. [1] Time = 3600 + 57(60) + 55 = 7075 s. [1] Average speed = 51,500/7075 = 7.28 m/s. [1]','Calculations')
s('mid-A6',7,'(a) Distance ≈8.0 cm = 0.080 m. [1] There are 13 intervals, so t = 13 × 0.02 = 0.26 s. [1] v = 0.080/0.26 = 0.308 m/s ≈0.31 m/s. [1] Count intervals, not dots.\n(b) Constant speed: equally spaced dots are made in equal times. [2]\n(c) Speed increases from left to right because the gaps increase over equal times; the tape represents accelerated motion. [2]','Calculations')
s('mid-A7',4,'(a) F = ma = 1100 × 36 = 39,600 N. [2]\n(b) a = F/m = 60,000/1100 = 54.5 m/s² opposite the motion. [2] With forwards positive, acceleration is −54.5 m/s²; deceleration magnitude is positive.','Calculations')
s('mid-A8',5,'Use corrected mass 1000 kg.\n(a) u = 60/3.6 = 16.6667 m/s; v = 100/3.6 = 27.7778 m/s. [1]\n(b) a = (v − u)/t = (27.7778 − 16.6667)/6 = 1.85 m/s². [2]\n(c) F = ma = 1000 × 1.85185 = 1.85 × 10³ N forward. [2]','Calculations')
NOTES['mid-A8']='Corrected mass unit 1000 N to 1000 kg, as the supplied key directs.'
s('mid-A9',2,'Newton’s first law states that velocity remains constant unless a resultant external force acts. [1] When a car stops, the passenger tends to continue forwards; a seat belt supplies a restraining force and helps prevent collision with the interior. [1]')
s('mid-A10',1,'The swimmer pushes backwards against the wall; the wall exerts an equal opposite forward force on the swimmer. The forces act on different objects and therefore do not cancel on the swimmer. [1]')
s('mid-A11',2,'Assume rest initially and constant a = 10 m/s². v = u + at = 0 + 10(25) = 250 m/s downward. [1 formula/substitution; 1 result and direction]','Calculations')
s('mid-A12',3,'In row order: third; second; first; second; third; first. [½ each]\nRocket thrust is an action–reaction pair. Lower mass gives greater acceleration for equal net force (second law). Rider and loose object continue moving by inertia (first law). Engine forces relate to acceleration and mass (second). Sprigs improve frictional contact: player pushes ground backwards and ground pushes player forwards (third).')
s('sem1-B1',3,'For oxygen-16, label a nucleus with 8 protons and 8 neutrons. [2] Draw 8 electrons outside it: 2 in the first shell and 6 in the second. [1] Proton number identifies oxygen; neutron number depends on isotope, so oxygen-16 is specified.','Labelling')
OV['sem1-B1']='Draw a clearly labelled neutral oxygen-16 atom showing the location and number of protons, neutrons and electrons. [3]'
s('sem1-B2',4,'(a) Na: 11 electrons → 2,8,1. [1]\n(b) S²⁻: 16 + 2 = 18 electrons → 2,8,8. [1]\n(c) Li⁺: 3 − 1 = 2 electrons → 2. [1]\n(d) Ar: 18 electrons → 2,8,8. [1]')
s('sem1-B3',3,'(a) 2Na + 2H₂O → 2NaOH + H₂. [1]\n(b) 2CuS + 3O₂ → 2CuO + 2SO₂. [1]\n(c) 2KClO₃ → 2KCl + 3O₂. [1] Change coefficients, not formulas. Check each element separately: (b) has 2 Cu, 2 S and 6 O on each side; (c) has 2 K, 2 Cl and 6 O.','Multi-step')
s('sem1-B4',4,'(a) methane + oxygen → carbon dioxide + water. [1]\n(b) Skeleton: CH₄ + O₂ → CO₂ + H₂O. [1]\n(c) Balance H then O: CH₄ + 2O₂ → CO₂ + 2H₂O. [1]\n(d) Atoms are rearranged, not created or destroyed, so each element’s atom count must match and mass is conserved. [1]','Multi-step')
s('sem1-B5',4,'(a) Solid NaCl is an ordered lattice of Na⁺ and Cl⁻. [1] The ions cannot move freely, so there are no mobile charge carriers; molten or dissolved ions can move. [1]\n(b) A force can shift lattice layers. [1] Like charges then line up, repel strongly and split the crystal, making it brittle. [1]')
s('sem1-B6',4,'(a) NaBr: Na⁺ balances Br⁻. [1]\n(b) CaCl₂: Ca²⁺ needs two Cl⁻. [1]\n(c) FeBr₂: Fe²⁺ (iron II) needs two Br⁻. [1]\n(d) K₂S: two K⁺ balance S²⁻. [1]')
s('sem1-B7',2,'Convert 100 km = 100,000 m and 2 h = 7200 s. [1] Average speed = 100,000/7200 = 13.9 m/s. [1] The source only gives distance and no direction, so the practice wording uses speed rather than velocity.','Calculations')
OV['sem1-B7']='Calculate the average speed of a car travelling 100 km in two hours. Show working in m/s. [2]'
NOTES['sem1-B7']='Changed velocity to speed because only distance and time are supplied.'
s('sem1-B8',4,'A: 20 N right − 15 N left = 5 N right. [1]\nB: equal 5 N up and down cancel: 0 N. [1]\nC: 5 N and 10 N both right: 15 N right. [1]\nD: 18 N up − 4 N down − 5 N down = 9 N up. [1]','Calculations')
s('sem1-B9',6,'(a) Distance = 40 + 30 = 70 km. [2]\n(b) Displacement is shorter: √(40² + 30²) = 50 km compared with the 70 km two-leg route. [2]\n(c) Time = 30 + 20 = 50 min = 3000 s. Average speed = 70,000/3000 = 23.3 m/s. [2]','Calculations')
s('sem1-B10',4,'(a) Draw 80 m north then 60 m east head-to-tail, with resultant start to finish. [1]\n(b) Magnitude = √(80² + 60²) = 100 m. [2] Direction = tan⁻¹(60/80) = 36.9° east of north, or 53.1° north of east. [1]','Calculations')
s('sem1-B11',2,'W = Fs for parallel force and displacement. W = 120 × 4 = 480 J. [1 for substitution; 1 for correct answer with unit]','Calculations')
s('sem1-C1',5,'(a) 60 × 60 = 3600 s per hour. [1]\n(b) 24 × 3600 = 86,400 s per day. [1]\n(c) 365 × 86,400 = 31,536,000 s per year. [1]\n(d) d = vt = 300,000 × 31,536,000 = 9.4608 × 10¹² km = 9.4608 × 10¹⁵ m. [2] A light-year is a distance, not a time.','Calculations')
s('sem1-C2',6,'(a) Eₖ = ½mv² = 0.5 × 0.8 × 25² = 250 J. [3: formula, substitution, result]\n(b) Net work from rest equals the kinetic-energy increase: 250 J. [1]\n(c) Going up increases gravitational potential energy; going down increases kinetic energy. [2]','Calculations')
s('sem1-C3',4,'(a) At maximum cord stretch, the jumper is momentarily stationary. [1]\n(b)(i) ΔEₚ = mgΔh = 60 × 10 × (−50) = −30,000 J, a loss of 30,000 J. [1]\n(ii) Maximum speed and kinetic energy occur when net downward force becomes zero and then upward: approximately where cord tension balances weight, allowing for drag. This is generally after stretching starts. [1]\n(iii) Air resistance transfers some energy to the surroundings during the first 50 m, so kinetic energy immediately before the cord stretches can be less than 30,000 J. [1]','Multi-step')
OV['sem1-C3']='A 60 kg student weighing 600 N jumps from rest. The bungee cord becomes taut after a 50 m fall. (a) When does he first stop: before stretching, at greatest stretch, or when elastic potential energy is zero? [1] (b)(i) Calculate the gravitational potential energy change after 50 m. [1] (ii) State the force condition at maximum kinetic energy during the fall. [1] (iii) Why is kinetic energy immediately before the cord stretches likely to be less than the gravitational potential energy lost over the first 50 m? [1]'
NOTES['sem1-C3']='Corrected key maximum-speed statement; reworded final comparison to the first 50 m because the original maximum-energy comparison is not generally valid.'
s('sem1-C4',8,'(a)(i) Friction equals driving force at constant velocity: net force is zero. [1]\n(ii) Δv = at = 12 × 4.0 = 48 m/s. [2]\n(c) Family car: a = 30/10 = 3 m/s² and F = 1400 × 3 = 4200 N. Sports car: a = 30/5 = 6 m/s² and F = 600 × 6 = 3600 N. [2] The sports car has greater acceleration but smaller net force because of its lower mass. [1]\n(d) Inertia carries driver and bag forwards. The belt applies a restraining force to the driver; the unsecured bag may slide or fly forward. [2]','Multi-step')
s('sem1-C5',12,'(a)(i) Sam: d = vt = 10 × 15 = 150 m. [2]\n(ii) From 4 to 10 s Joe accelerates while Sam has zero acceleration, so Joe has greater net force. [1]\n(iii) 10 − 4 = 6 s. [1]\n(iv) a = (15 − 0)/6 = 2.5 m/s². [3]\n(b)(i) F = 100 − 30 = 70 N forwards. [1]\n(ii) Weight = mg = 55 × 10 = 550 N downwards. [2]\n(iii) Removing the bag lowers mass; for the same resultant force, a = F/m increases. [2]','Multi-step')
s('sem1-D1',15,'(a) Late 1980s. [1]\n(b)(i) 1959. [1] (ii) Victoria, 1970. [2] (iii) The passage reports a 50% reduction in driver hospital admissions per 100 vehicles. [1]\n(c) Newton’s first law: the occupant tends to keep moving forward as the car stops. [1] The belt provides the external force to slow the occupant [1], reducing collision with the interior or ejection. [1]\n(d)(i) The rigid cell maintains survival space and resists crushing/intrusion. [2]\n(ii) Crumple zones deform controllably, transferring kinetic energy into deformation and increasing stopping distance/time. [2]\n(e) F = ma (Newton’s second law). [1] The airbag increases head/body stopping time, reducing deceleration for the same velocity change [1], so average force is lower; it also spreads contact force over a wider area. [1]','Comprehension')
s('sem2-B1',3,'Given u = 2.0 m/s, a = 0.5 m/s² and t = 6 s. [1] v = u + at = 2.0 + 0.5(6). [1] v = 5.0 m/s in the original direction. [1]','Calculations')
s('sem2-B2',3,'Convert v = 60/3.6 = 16.6667 m/s. [1] Eₖ = ½mv² = 0.5 × 1100 × 16.6667². [1] Eₖ = 152,778 J ≈ 1.53 × 10⁵ J. [1]','Calculations')
s('sem2-B3',4,'For ³⁹₁₉K: (a) mass number 39; (b) protons 19; (c) atomic number 19; (d) neutrons = 39 − 19 = 20. [1 each] The upper number is protons plus neutrons, the lower proton number.')
s('sem2-B4',3,'(a) Na has 11 electrons: 2,8,1. [1]\n(b) Ne has 10: 2,8. [1]\n(c) O²⁻ has 8 + 2 = 10: 2,8. [1]')
s('sem2-B5',2,'(a) Ag is in period 5. [1]\n(b) Ar is in group 18. [1] Periods are rows and groups columns.')
s('sem2-B6',4,'(a) Mg(NO₃)₂: Mg²⁺ balances two NO₃⁻. [1]\n(b) Fe(OH)₂: Fe²⁺ balances two OH⁻. [1]\n(c) Na₂CO₃: two Na⁺ balance CO₃²⁻. [1]\n(d) Ca₃(PO₄)₂: +6 from three Ca²⁺ balances −6 from two PO₄³⁻. [1]')
s('sem2-B7',3,'(a) 2Al + 3F₂ → 2AlF₃. [1]\n(b) 2NaOH + H₂SO₄ → Na₂SO₄ + 2H₂O. [1]\n(c) 2SO₂ + O₂ → 2SO₃. [1] Check each element on both sides; coefficients multiply entire formulas.','Multi-step')
s('sem2-B8',1,'James Watson and Francis Crick proposed the double-helix model in 1953. [1] It relied on important evidence from Rosalind Franklin, Raymond Gosling, Maurice Wilkins and others. This is distinct from discovering DNA itself.')
s('sem2-B9',2,'(a) Capital N represents the dominant allele and lower-case n the recessive allele; Nn shows normal wings in this model. [1]\n(b) A diploid fly has two alleles at the locus, one inherited from each parent. [1]')
s('sem2-B10',3,'Let D be double-jointed and d normal. Parents are Dd × dd. [1] Gametes are D/d and d/d; the square gives Dd, dd, Dd, dd. [1] Genotypes: 50% Dd, 50% dd. Phenotypes: 50% double-jointed and 50% normal, per pregnancy. [1]','Multi-step')
s('sem2-B11',3,'Cross XᴮY × XᴮXᵇ. Gametes are Xᴮ/Y and Xᴮ/Xᵇ. [1] Offspring genotypes, each 25%: XᴮXᴮ, XᴮXᵇ, XᴮY, XᵇY. [1] Daughters have normal vision (half carriers); sons are half normal, half colour-blind. Thus 25% of all children, or 50% of sons, are colour-blind. [1]','Multi-step')
s('sem2-B12',4,'(a) Parent 2 is shaded: nn. [1] Parent 1 is unshaded: NN or Nn; the shown offspring do not distinguish these. [1]\n(b) Person 6 is Nn. [1] He lacks the recessive trait but has affected nn children, so he must carry and transmit n. [1]','Data / source analysis')
s('sem2-B13',7,'(a) Meiosis. [1]\n(b) Mitosis has one nuclear division, meiosis two; mitosis usually gives two genetically similar diploid cells, meiosis four varied haploid products; homologous pairing/crossing over occur in meiosis but not normal mitosis. [3, one per paired difference]\n(c) A mutation is a change in genetic material, such as the DNA sequence. [1]\n(d) More heritable mutations can supply more new alleles and variation. [1] Selection can change variant frequencies over generations if reproductive success differs. [1] Mutation does not guarantee faster adaptation: many changes are neutral or harmful.','Comprehension')
s('sem2-B14',4,'(a) Redshift is a shift of spectral features to longer wavelengths than their laboratory values. [1]\n(b) A very large cosmological redshift indicates light emitted in a much earlier, less-expanded universe, supporting great distance and substantial cosmic expansion along its path. [1]\n(c) The Big Bang model describes expansion from a hot, dense early state. [1] Expansion cooled the universe, allowing atoms and later stars and galaxies to form. [1] It is not an ordinary explosion into pre-existing empty space.')
s('sem2-B15',4,'In order: Universe; solar system; star; galaxy; black hole; nuclear fusion; light-year; stellar parallax method. [½ each]\nA light-year is distance. Stellar parallax is the apparent shift of a nearby star relative to distant stars as Earth orbits the Sun. A black hole has an event horizon beyond which light cannot escape.','Fill in the blanks')
OV['sem2-A43']='Which sequence correctly describes the main stages in the Sun’s evolution?'
NOTES['sem2-A43']='Corrected original option D, which incorrectly ended with a red dwarf.'
