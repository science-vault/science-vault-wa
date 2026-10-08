# Biology ATAR student courses

Year 11 and Year 12 Biology are available through `biology.html` and `topic-hub.html`, under **Biology ATAR**. These are original student lessons supporting the current WA course, with original practice and suggested marking points. They are not an SCSA-endorsed textbook or official examination bank.

## Course scope

| Year | Unit | Modules | Principal coverage |
|---|---|---:|---|
| 11 | 1 – Ecosystems and biodiversity | 6 | Diversity, classification/species concepts, phylogeny, sampling, ecological relationships, energy/nutrient cycles, populations, succession/fire, human impacts and conservation |
| 11 | 2 – From single cells to multicellular organisms | 6 | Cells/microscopy, membrane transport, biological molecules/enzymes, ATP/photosynthesis/respiration, animal exchange/digestion/circulation/waste, plant transport |
| 12 | 3 – Continuity of species | 6 | DNA/expression, division/meiosis/variation, inheritance/pedigrees, gene technology/bioinformatics, evolutionary evidence, gene pools/selection/drift/speciation |
| 12 | 4 – Surviving in a changing environment | 6 | Thermal homeostasis, water/ion balance, plant dryness/salinity responses, named pathogens, transmission/immunity/control, inquiry and extended-response practice |

Totals: **24 modules; 534 screens; 28,029 words of theory; 109 SVG teaching diagrams; 168 written exam tasks (72 worked, 96 independent); 120 multiple-choice concept checks; four quantitative interactive activities.** Every module exceeds 20 screens. Tables and source screens are additional to the explanatory theory. Diagrams include reading guides and model limits. No publisher PowerPoint images or paragraphs are reproduced.

Six Year 11 Nelson PowerPoints and ten Year 12 Nelson PowerPoints (490 slides) were inspected from the repository. They informed topic organisation and were checked against current syllabus requirements. Original wording corrects common misconceptions, including teleological evolution, dominance versus frequency, chromosome counts after replication, energy from bond breaking, fixed ATP yields, uptake versus transpiration and oomycetes versus true fungi.

## Course and assessment versions

Currency checked **8 October 2026** against the [SCSA Biology course page](https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/science/biology).

- Year 11: [syllabus effective 2026](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0020/1232615/Biology-ATAR-Year-11-Syllabus-for-teaching-from-2026.PDF).
- Year 12: [prescribed syllabus effective January 2024](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0006/1089654/Biology-ATAR-Year-12-Syllabus-for-teaching-from-January-2024_pdf.PDF).
- Published 2027 syllabuses and change summaries were also checked. Lessons explain changes to conservation/protected areas and Traditional Owner rights, cellular technologies, explicit bioinformatics, and disease-model processing/data variables. Removed Science as a Human Endeavour examples are distinguished from biological core concepts that remain.
- [2025 examination](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0005/1232645/2025-BLY-Examination-Web-Version.PDF), [ratified key](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0006/1232646/2025-BLY-Ratified-Marking-Key-Web-Version.PDF) and [examination report](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0004/1242526/2025-ATAR-course-examination-report-BLY-public-version.PDF) informed practice emphasis and response planning. The original course includes two Unit 3 and two Unit 4 20-mark options; students can choose one from each to practise the selection pattern.
- Named disease biology was checked against CDC, WHO, WA Health, WA Government, DCCEEW, DAFF and RHS sources linked inside each module. Course content explains biology rather than personal diagnosis or medication protocols.

## Student learning and tracking

Navigation includes a screen selector, complete outline, previous/next controls and direct written-practice/mastery links. Typed answers, visited screens and self-assessed marking points persist in this browser. Drawings on paper do not. Independent question answers are revealed on request; worked examples use separate solution screens. Marks are explicit suggested allocations and accept appropriate equivalent explanations.

Concept checks randomise question/option order and require 100% to pass, with explanatory feedback. Screen visits, self-awarded marks and concept-check success are distinct from teacher-verified exam readiness. The existing lesson-tracking integration receives the Biology module/year/unit context and observes mastery results. Browser tests use mocked student RPCs and do not write student data.

## Files and verification

Course assets: `biology-atar-course.js`, `biology-visuals.js`, `biology-atar-player.js`, `biology-atar.css`. Entry points: `biology.html`, `topic-hub.html`.

Run `node biology-atar-check.cjs` from the repository root to validate module/question IDs, mark totals, option uniqueness, diagram references, activity models, year distribution, screen counts and required topic landmarks. Browser verification and visual review are performed separately before commit; no independent subject-specialist endorsement is claimed.

Pre-commit verification passed: all 534 screens rendered on desktop and at 390 px mobile width; all four units displayed their six modules; written-practice/mastery links worked; typed drafts and self-marking persisted after reopening; 0/5 failure and 5/5 success produced appropriate feedback; mocked tracking received a 100% result; all four quantitative models produced checked outcomes. Chemistry, Psychology and Years 7–10 Science continued to open in the shared hub. All 109 final diagrams passed SVG text-bound checks and visual review; no browser JavaScript errors were recorded.
