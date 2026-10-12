# Physics lesson expansion — 12 October 2026

The original 44 large Physics modules remain available at their original topic URLs. The normal course view now groups **142 focused lessons** into those topic sequences: **72 for Year 11 and 70 for Year 12**. Each original topic has three bounded lessons; ten additional Year 12 lessons address velocity transformations and quantum mechanisms or applications.

Each focused lesson includes retrieval, an explicit I–We–You sequence, topic-specific explanations, model conditions and misconception diagnosis, worked reasoning, a labelled diagram, interactive checks, an independently authored three-mark question, a step-by-step marking table, a printable worksheet and an optional printable suggested key. Browser drafts are separated by account and lesson. Written work is self-reviewed or teacher marked; multiple-choice mastery is a concept check.

The added lessons cover relativistic velocity addition, Young's double slit, polarisation, black-body radiation, the photoelectric determination of Planck's constant, fluorescence and phosphorescence, X-ray production, stimulated emission and lasers, photovoltaic cells and LEDs. Advanced radial gravitational energy, quantitative polarisation and Wien calculations are identified as extension models.

## Compatibility

- Existing lesson URLs, the 44 original standalone task definitions and stored task identifiers are retained.
- Each of the 142 focused lessons links to its own separately authored standalone task. The original 44 broad topic tasks remain playable for existing assignments and retain their identifiers and completion records.
- Teachers can assign a focused lesson through the existing “Assign this lesson” control.
- The original full modules are placed in reference disclosures below each focused sequence.
- Existing course, year and page permission checks still apply. No Firebase rule changes are required.

## Sources and authoring

Current 2026 materials were checked against the [SCSA Physics course page](https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/science/physics), [Year 11 syllabus](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0009/1232856/Physics-ATAR-Year-11-Syllabus-for-teaching-from-2026_.PDF) and [Year 12 syllabus](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0006/1114692/Physics-ATAR-Year-12-Syllabus-for-teaching-from2026.PDF). Teaching explanations and added questions are original authoring; existing topic explanations and supplied-deck examples are retained in their relevant lesson sections and in the full references.

`physics-focused-authoring.txt` holds the explicit three-part boundaries, explanations, independent questions and suggested marking points for each existing topic. `physics-extra-authoring.json` holds the ten additional lessons, including separately modelled and guided applications. Rebuild their data with:

```sh
python scripts/build-physics-focused.py
```

## Verification

The focused-course test checks all 142 lessons and all 1,917 screens, rendering, numerical examples, diagrams, marking tables, mastery answers, account-separated drafts, sequence navigation and worksheet/key separation. The existing task suite checks stable original lesson routes, standalone tasks, teacher assignment, subject/year filtering and independent plans; it also opens a focused lesson through the signed-in hub and checks its parent-task link.

```sh
NODE_PATH=<directory-containing-jsdom> node tests/physics-focused.cjs
NODE_PATH=<directory-containing-jsdom> node --experimental-vm-modules tests/lesson-tasks.cjs
```

These are DOM and source checks. A full visual browser and real-account Firebase end-to-end check are not available in this environment. Deployment status and published source files are verified separately after publication.
