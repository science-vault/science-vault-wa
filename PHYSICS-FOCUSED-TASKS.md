# Standalone tasks matched to the focused Physics lessons

The active task library now contains **142 lesson-specific Physics tasks**: **72 Year 11 and 70 Year 12**. Each task contains two newly authored structured written questions, two scenario checks, a qualitative labelled diagram, eight marks in total, suggested time of 20 minutes, writing space and step-by-step marking tables. The written questions are different from the lessons' independent questions.

Teachers find these in **My classes → Prebuilt task library → Physics ATAR**, or open a focused lesson's standalone task and choose **Assign this standalone task**. Students use **My tasks → Physics ATAR** for the automatic sequence when working independently, or follow their teacher's assignment. Every task returns to its exact focused lesson.

The original 44 broad-topic tasks remain playable through their original URLs and existing assignments. Their question identifiers, draft keys and completion keys are retained. They are excluded from the active focused-task catalogue to prevent duplicate or outdated entries. Completing a legacy task does not mark a new focused task complete.

Written answers are reviewed against suggested marking points; only the two scenario checks are automatically scored. Completion requires written attempts, correction/review, both checks correct and a reflection. New-task concept feedback is available after the written attempt. Drafts and independent completion remain separated by user account. No Firebase rules change is required.

## Authoring

`physics-task-authoring/focused-tasks.txt` contains explicit new questions and marking points for every focused lesson. `physics-legacy-standalone-tasks.json` preserves the original tasks. Generate the qualitative diagram data, then rebuild the combined playable collection and active catalogue:

```sh
NODE_PATH=<directory-containing-jsdom> node scripts/build-physics-task-figures.cjs
python scripts/build-physics-focused-tasks.py
```

The legacy authoring script writes only the legacy collection; rebuild the focused collection afterwards if legacy content changes.

## Verification

The task test checks all 142 focused lesson routes, all 142 task pages, exact lesson/task matching, teacher assignment, year/subject filtering, automatic student sequence, attempted-answer gates, correction and completion, printable writing space and marking keys, diagrams, preserved legacy assignments and draft separation. The compiler also rejects missing or repeated lesson mappings, duplicate written prompts, incorrect marking totals and lesson-question reuse.

```sh
NODE_PATH=<directory-containing-jsdom> node --experimental-vm-modules tests/lesson-tasks.cjs
```

Checks use the DOM and source. Real-account Firebase end-to-end and full visual browser testing are not available in this environment. Deployment success and live file contents are verified separately.
