# Year 8 Science student lessons

42 self-paced modules cover the four Science Understanding strands in the WA 2026 syllabus, with four additional Science Inquiry modules. Access: Topic Hub → Science → Year 8 → strand → topic tile. Science Inquiry is a fifth menu option.

| Strand | Modules | Curriculum coverage |
| --- | ---: | --- |
| Biological Sciences | 12 | Cells, microscope magnification and size, organelles, specialised cells, photosynthesis and respiration; plant and vertebrate gas exchange, transport and reproduction (WA8SSUB1–2) |
| Chemical Sciences | 8 | Atomic structure, elements and compounds, symbols and formulae, metals/non-metals, physical and chemical changes (WA8SSUC1–3) |
| Earth and Space Sciences | 9 | Plate tectonics and evidence, three boundary types, intraplate earthquakes, rock cycle and properties, mineral identification and resources (WA8SSUE1–3) |
| Physical Sciences | 9 | Energy forms and pathways, conduction/convection/radiation, insulation, circuits and series/parallel comparison, electrical protection (WA8SSUP1–3) |
| Science Inquiry | 4 | Questions and predictions, variables, risk management, reproducible methods, measurement and graphs, evidence and evaluation, collaboration and communication |

Source: https://k10outline.scsa.wa.edu.au/home/wa-curriculum/learning-areas/science/p-10-science-curriculum/pre-primary-to-year-10-science-syllabus (checked 7 October 2026).

Student presentation contains original labelled SVG models, short explanations, worked examples, independent explanations, category sorting, six ordering activities and two interactive models (microscope magnification and an open/closed circuit). Models include captions identifying simplifications. They are illustrations, not photographs. Each module has eight topic-specific mastery questions with shuffled questions/options and correction feedback. Screen visits are distinct from mastery.

## Files

- `year8-student-lessons.js`: module content, questions and catalogue.
- `year8-student-visuals.js`: labelled SVG models.
- `year8-student-player.js`: student lesson and mastery interactions.
- `year8-student.css`: styles scoped to Year 8.
- `topic-hub.html`: catalogue, navigation and lesson entry points.
- `lesson-tracking.js`: Year 8 screen and mastery hooks in the existing tracking system. Tracking activation remains governed by the existing configuration.

## Validation

Run the DOM regression check with Node and the development dependency `linkedom`:

```sh
npm install --prefix /tmp/year8-check linkedom
NODE_PATH=/tmp/year8-check/node_modules node tests/year8-student-lessons.cjs
```

The check builds all 42 modules, renders every screen, validates accessible SVG labels and question indices, exercises wrong/correct answers, empty/correct sorting, wrong/correct ordering, both interactive models, blank/passing/retried mastery and distinct visit counts. It also parses the hub inline scripts.

Browser integration was checked in Chromium at desktop and phone widths: all five Year 8 menu groups, tile entry, practice/mastery navigation, correct mastery results, tracking against a mock student API, back navigation and Year 7 entry. No page JavaScript errors or phone page overflow were observed. All model artwork was reviewed as a montage, and representative page screenshots were reviewed.
