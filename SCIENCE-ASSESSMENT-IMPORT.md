# Original Science assessment extraction

Status: in progress, not complete. Updated 15 October 2026. Scope: every question type in the repository's Years 7–10 Science assessment folders, with diagrams, student response space and supplied or clearly labelled Learning Vault created marking keys.

| Original Narrogin paper | MC | Written | Marks | Battle eligible MC |
| --- | ---: | ---: | ---: | ---: |
| Year 7 Biology / Classification 2024 | 10 | 4 | 28 | 10 |
| Year 7 Chemistry 1 2024 | 15 | 8 | 45 | 15 |
| Year 7 Earth and Space 1 2024 | 10 | 4 | 25 | 8 |
| Year 7 Forces and Simple Machines 2023 | 10 | 7 | 35 | 9 |
| Year 8 Cells 2023 (filed under 2024) | 10 | 5 | 30 | 10 |
| Year 8 Energy and Heat 2023 | 20 | 7 | 50 | 19 |
| Total | 75 | 35 | 213 | 71 |

All 110 original questions are included in the shared bank, builder and practice. All 35 written items remain manually marked. The four ambiguous MC items remain available for teacher review and are excluded from automatic scoring and battles. Each record retains source path, Git blob hash, section, printed question number and page references. Original wording, diagrams and marks are preserved, with explanatory review notices where necessary. The unnumbered six-mark heat-transfer table after Year 8 Energy Q6 is imported as its own record and identified as unnumbered; it has not been omitted or falsely renumbered in the source metadata.

## Marking keys

Use supplied keys when suitable. Create missing keys and identify them as **Learning Vault created**, including mark allocations and acceptable alternatives. Preserve supplied keys separately when adding corrections. There are 17 new keys for the Year 7 Forces paper and nine supplementary guides across the two batches. Created guidance is labelled in the key rows so it remains visible in site previews and Word exports.

Batch 1 supplements: Chemistry written Q2 (cloud classification) and Q8 (diagram marking allocation); Earth written Q2 (2pm student paper / 3pm older key); Earth MC Q3 (conflicting options/key) and Q8 (meteor/meteorite terminology). The Biology plant flowchart uses the matching printed key stimulus because DOCX conversion displaces text boxes; handwritten answers are excluded. Biology animal III is a cockroach in the student paper and a fly in the older key; both follow the three-pairs-of-legs branch A.

Batch 2: Year 7 magnetic-alignment MC Q3 needs a pole legend; the conditional created key explains the dot convention. The spring-balance readings accept justified estimates from the original coarse image. Compound-machine labels accept explanations consistent with the illustrated use. Year 8 Energy MC Q7 overstates the Sun as the source of all Earth energy; the created guide recognises non-solar counterexamples. Energy written Q2 improperly limits answers to Q1 types and omits electrical/light; the guide accepts appropriate additional types and justified engine outputs. Written Q3 is one mark in the student paper despite the key's two-mark annotation. The final heat-transfer table oversimplifies conduction and radiation by state; created guidance accepts scientifically justified responses instead of forcing incorrect categorical labels. All source-key scans are retained as reference images.

## Coverage and remaining work

`science-assessment-import-status.json` is the source inventory and audit trail. It contains 2,009 files, including keys and supporting material: 1,671 distinct blobs and 338 exact duplicate files. These are file counts, not question counts. Eleven distinct source/key blobs are covered by the two batches; 1,660 distinct blobs remain to be triaged or extracted. Duplicate aliases are identified without re-importing identical source files. Existing lesson checks and authored equivalents are separate bank content and do not count as original extractions.

After batch 2, the shared lower Science bank has 3,949 questions: Year 7 — 1,089; Year 8 — 1,007; Year 9 — 867; Year 10 — 986. Of 1,693 MC records, 1,689 are battle eligible. Only 110 of the overall bank records belong to these original extraction batches.

## Verification

- Reconciled all six papers: 110 original questions, including 35 written items, 213 marks.
- Three bank entry lists agree; duplicate IDs rejected; exact MC stem/options comparison performed against existing records.
- All 59 batch 2 records pass editable Word preparation. The 14 microscope labels retain 0.5 mark per row.
- Multipart source prompts render in the builder, practice and Word; this also fixes the earlier Chemistry muddy-seawater subparts in the builder preview.
- Manual-marking guard excludes review MC items from letter grading; all 38 batch 2 game questions preserve options, keys and required image references.
- Source crops checked against papers and keys; lossless WebP pixels compared with the original PNG crops.
- No Firebase rule changes.
