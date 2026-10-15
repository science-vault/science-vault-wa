# Original Science assessment extraction

Status: started, not complete. Batch `repo-science-batch01`, 15 October 2026.

This import extracts questions from repository assessments. Existing lesson checks and authored equivalents are separate content and are not counted as original source extractions.

| Year 7 Narrogin 2024 paper | Multiple choice | Written | Marks | Live battle questions |
| --- | ---: | ---: | ---: | ---: |
| Biology 1 / Classification | 10 | 4 | 28 | 10 |
| Chemistry 1 | 15 | 8 | 45 | 15 |
| Earth and Space 1 | 10 | 4 | 25 | 8 |
| Total | 35 | 16 | 98 | 33 |

All 51 records include original paper and key paths, Git blob hashes, section, question number and page references. Text, response tables and marks remain editable in Word. Eight question stimuli and sixteen handwritten key crops are retained in a lossless image pack. Student copies contain no handwritten key crops.

The Biology plant flowchart uses the matching printed stimulus from key page 2 because conversion displaces the original DOCX text boxes. Its handwritten answers are excluded from the question image. Animal III in the Biology paper is a cockroach; the older key uses a fly. Both classify under the three-pairs-of-legs branch A. The original student illustration is retained.

## Marking keys

Use supplied keys when suitable. Create missing keys and identify them as **Learning Vault created**, with mark allocations and acceptable alternatives. Do not describe created guidance as an original school key. Preserve supplied keys separately when correcting or supplementing them.

This batch adds five labelled supplements: Chemistry written Q2 and Q8; Earth written Q2; Earth MC Q3 and Q8. References are stored with each created key. All written questions are manually marked. Earth MC Q3 and Q8 remain manually marked and excluded from games because the original questions do not have unique defensible single-choice answers.

Original-key issues: Cloud is classified as gas in the supplied Chemistry key; Earth written Q2 says 2pm in the student paper and 3pm in the older key; Earth MC Q3 has multiple incorrect statements and a conflicting key filename; Earth MC Q8 mixes meteor and meteorite terminology. Chemistry Q8 receives an explicit half-mark allocation and guidance for ambiguous low-resolution arrows.

## Coverage and remaining work

`science-assessment-import-status.json` is the source inventory and audit trail. It records 2,009 files, including keys and supporting material, across Years 7–10; 1,671 distinct file blobs and 338 byte-identical duplicate files. These are file counts, not question counts. Six distinct source/key files are covered by this batch; the other 1,665 distinct blobs still require triage or extraction. Duplicate aliases of covered files are recorded without re-importing questions.

The shared lower Science bank contains 3,890 records after this batch. Year totals: 7 — 1,072; 8 — 965; 9 — 867; 10 — 986. There are 1,653 multiple-choice records, of which 1,651 are eligible for battles. This includes older authored bank content; only 51 records belong to this original extraction batch.

## Verification

- Original paper question counts and mark totals reconciled: 51 questions, 98 marks.
- All three bank entry lists agree and load 3,890 unique records; year filters and question browser checked.
- No exact stem/options duplicate against the existing bank in this batch.
- All 1,632 game sets validate, including 1,651 Science assessment MC records; existing game sets retained.
- Manual-scoring guard prevents flagged MC questions from falling back to letter grading.
- All 51 questions pass editable Word preparation. Student DOCX embeds eight stimuli; marking-key DOCX embeds sixteen source-key crops. Images decode and student copies exclude answer crops.
- DOCX copies converted to PDF and source diagrams, dichotomous keys, tables and marking guidance visually inspected.
- No Firebase rule changes.
