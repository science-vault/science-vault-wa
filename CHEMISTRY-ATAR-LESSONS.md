# Chemistry ATAR student lessons

Sixteen modules across Years 11 and 12, with 477 screens, 112 original written tasks (64 worked questions with separate solutions and 48 independent tasks), 492 suggested written marks and 80 multiple-choice concept checks. Theory contains approximately 25,887 words. Each module exceeds 20 screens.

Students can save typed drafts, reveal explanations and self-assess individual marking points. Drafts and visited screens are stored in their current browser. Written marks are self-assessed; five-question concept checks do not certify ATAR readiness. Requested drawings and calculations should also be completed on paper. Existing lesson tracking hooks are preserved; no new teacher tracking service is activated by this change.

| Year | Module | Screens |
|---|---|---:|
| 11 | Atomic structure, evidence and periodicity | 29 |
| 11 | Materials, separation and bonding models | 31 |
| 11 | Hydrocarbons: structures, names and reactions | 29 |
| 11 | Moles, equations, stoichiometry and chemical energy | 30 |
| 11 | Lewis structures, shape and intermolecular forces | 29 |
| 11 | Chromatography and gas behaviour | 30 |
| 11 | Water, solutions, precipitation and acidity | 30 |
| 11 | Reaction rates, catalysts and investigation skills | 29 |
| 12 | Dynamic equilibrium and responding to change | 31 |
| 12 | Acid–base models, salt hydrolysis and buffers | 30 |
| 12 | Volumetric analysis and titration exam problems | 30 |
| 12 | Redox equations and reaction tendency | 29 |
| 12 | Galvanic cells, electrolysis and corrosion | 29 |
| 12 | Organic structures, functional groups and reactions | 30 |
| 12 | Polymers, amino acids and protein models | 29 |
| 12 | Chemical synthesis, industrial chemistry and surfactants | 32 |

## Sources and coverage

Checked against the [SCSA Chemistry course page](https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/science/chemistry) on 7 October 2026: Year 11 syllabus effective 2026, Year 12 syllabus effective 2024, the 2026 data booklet and 2025 examination, marking key and examination report. Every module links these official resources. These lessons and questions are original learning material, not official SCSA questions or an endorsed textbook.

Year 11 covers atomic evidence and periodicity, materials and separation, bonding, hydrocarbons, stoichiometry and energy, molecular geometry and intermolecular forces, chromatography and gases, aqueous solutions and acidity, rates, investigation design and science in society. Reference screens include the syllabus ions and common molecular formulas.

Year 12 covers equilibrium, acids and buffers, titration, redox, electrochemistry, organic structures and reactions, polymers and proteins, synthesis, industrial processes and green chemistry. Inquiry and science in society are integrated into explanations and written tasks.

Repository PowerPoints consulted: Kennedy atomic structure, materials/bonding, organic chemistry, intermolecular forces/gases and reaction rates; Safety Bay acids and bases. Older simplified statements were checked against current syllabus requirements.

## Models and validation

125 figure placements use 104 distinct native SVG or chemical-formula models. Captions explain how to read each model and its limits. Four interactive calculations cover gas pressure, limiting reagent, equilibrium quotient and strong-acid titration.

Run `node chemistry-atar-check.cjs` for course integrity, diagram references, question marking allocations and selected independent numerical checks. Browser validation exercised every screen, answer saving and reveal, self-assessment, concept checks, topic navigation, all four interactive models, teacher tracking events and mobile layout. All SVG text was checked for clipping. Browser smoke tests are development-only and are not a requirement for opening the static site.

Files: `chemistry-atar-course.js` contains editable lesson data; `chemistry-visuals.js` contains technical models; `chemistry-atar-player.js` implements the student player; `chemistry-atar.css` styles it. `topic-hub.html` and `chemistry.html` provide entry points.
