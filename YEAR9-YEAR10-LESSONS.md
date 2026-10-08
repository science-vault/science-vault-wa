# Year 9 and Year 10 Science student lessons

Student access: Topic Hub → Science → Year 9 or Year 10 → strand → topic tile. Each year also has a Science Inquiry menu.

## Coverage

| Strand | Year 9 modules | Year 10 modules |
| --- | ---: | ---: |
| Biological Sciences | 8 | 8 |
| Chemical Sciences | 8 | 8 |
| Earth and Space Sciences | 6 | 6 |
| Physical Sciences | 8 | 9 |
| Science Inquiry | 3 | 3 |
| Total | 33 | 34 |

Year 9 topics cover adaptations; endotherms/ectotherms and tropisms; abiotic/biotic factors, quadrats, capture–recapture and monitoring (WA9SSUB1–3); atomic numbers and isotopes, electron arrangements, periodic groups, ionic/covalent substances, formulae and balanced equations (WA9SSUC1–4); Earth spheres, carbon/water cycles and climate (WA9SSUE1–2); longitudinal sound, wave quantities, echoes, resonance/hearing, light models, mirrors, refraction/lenses and the eye (WA9SSUP1–2).

Year 10 topics cover DNA, mitosis/meiosis, autosomal and X-linked inheritance, pedigrees, natural selection and speciation (WA10SSUB1–3); bonding, naming/formulae, precipitation, acids/bases, acid reaction patterns, balanced equations and rates (WA10SSUC1–3); the Big Bang, galaxies, stellar formation/life cycles, planetary formation and space exploration (WA10SSUE1–2); scalars/vectors, speed/velocity, acceleration and graphs, Newton’s laws, work, gravitational/kinetic energy and efficiency (WA10SSUP1–3).

Inquiry topics in each year address testable questions, method validity and reproducibility, risk and ethics, precision and errors, graph interpretation, evidence-based arguments, collaboration and societal choices. Contexts are learning examples, not independent practical instructions.

Curriculum reference checked 7 October 2026: https://k10outline.scsa.wa.edu.au/home/wa-curriculum/learning-areas/science/p-10-science-curriculum/pre-primary-to-year-10-science-syllabus

## Student experience

67 modules contain 904 screens, 139 diagram placements (including reused models), 335 inline choice checks, 67 category activities, eight ordering activities, 12 numerical checks and three interactive models: wave frequency, Punnett crosses and force/mass. Each module has eight topic-specific mastery questions, with questions and options shuffled and corrective feedback. The 536 mastery-question placements include category questions derived from each topic’s sorting activity.

Labelled SVG figures are original explanatory models, not photographs. Captions specify assumptions and scale limitations. Existing Year 8 models are reused for relevant foundational diagrams. Mobile figures scroll horizontally, with a visible hint. Screen visits do not imply mastery; mastery requires all eight answers correct. Written explanations remain on the current screen and are not submitted or saved as notes.

## Implementation

- `year9-student-lessons.js` and `year10-student-lessons.js`: separate catalogues and content; unique `y9-`/`y10-` IDs.
- `middle-science-visuals.js`: new models plus relevant models from the existing `year8-student-visuals.js`.
- `middle-science-player.js`: shared player with year-specific labels, checks and numerical/model interactions.
- `middle-science.css`: scoped styles.
- `topic-hub.html`: both year menus, tile routing and practice/mastery entry points.
- `lesson-tracking.js`: screen and mastery hooks using the existing tracking configuration. This change does not activate the external tracking backend.

## Validation

Install the development-only DOM dependency outside the repository and run:

```sh
npm install --prefix /tmp/science-check linkedom
NODE_PATH=/tmp/science-check/node_modules node tests/middle-science-lessons.cjs
```

The regression check renders every module and screen, checks year labels, accessible model labels, question/category indices and content presence, exercises wrong/correct choices, empty/correct sorting, ordering moves, numeric input states, all model controls and blank/passing/retried mastery. It checks unique screen visits and parses hub inline scripts.

Chromium integration checks covered all ten Year 9/10 menu groups, tile entry, practice/mastery links, correct assessment results, actual model control events, existing tracking hooks against a mock student API, phone page overflow and diagram scrolling, and Year 7/8 lesson access. No page errors were observed. SVG text bounds and desktop/phone layouts were checked; all model artwork was reviewed, with targeted rerendering after corrections.
