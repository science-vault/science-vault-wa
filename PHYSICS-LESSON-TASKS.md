# Standalone Physics ATAR tasks

Physics now has 44 separate question tasks: 24 Year 11 and 20 Year 12. They replace the Physics lesson-wrapper entries in the prebuilt task library. The original Physics lessons and existing class assignments remain intact; Geography retains its 129 lesson packages for its separate rollout.

Each standalone task contains four newly authored written questions, two objective concept checks, a relevant original SVG diagram, question-specific marking tables and a reflection. Each task totals 14 marks: 12 written marks requiring review and 2 automatically checked concept marks. Across Physics, there are 176 unique written prompts and 88 concept questions. These are original practice materials, not official SCSA examinations.

Teachers: Classes and progress → Prebuilt lesson tasks → Subject: Physics ATAR. Preview the standalone task, choose Use this task, select the class and assign. The task preview also offers Assign this standalone task. Assignment instructions and due dates remain editable.

Students: My tasks → My learning plan → Physics ATAR. Every Physics lesson also has an Open separate Physics task link; each task links back to its lesson. Independent tasks need no class code. Browser drafts are scoped to the account UID and topic. Standalone task completion has its own key, so an old lesson-checklist completion does not mark a new question task complete.

Students attempt all four written questions before revealing the marking tables. They self-review each marking point, complete both concept checks correctly, and record an improvement before completing the task. Assigned submissions include written responses, self-reviewed marks, concept responses and reflection. Teacher reports keep the two automatic concept marks separate from the written self-review marks. Firebase operations use the existing class-client; automated tests mock Firebase writes and cannot verify a real approved account's submission.

Printing: Print task with writing space produces an A4 worksheet with lined answer space and diagrams. Print marking guide produces the question-specific step tables and concept answers. Teachers can print the guide directly; students can do so after attempting the written questions.

No Firestore rules change is needed. Standalone views use the existing authorised Topic Hub route with activity=standalone. Class links are validated against course, year, unit, topic and standalone task format before submission.

## Maintenance and validation

```sh
python physics-task-authoring/build.py
node scripts/build-lesson-task-catalog.cjs
node --experimental-vm-modules tests/lesson-tasks.cjs
node --experimental-vm-modules geography-atar-check.cjs
```

Node checks require jsdom through dependency resolution or NODE_PATH. The authoring source verifies full coverage of the existing Physics sequence. Tests cover all 44 linked lesson players, unique question IDs / written prompts, marking totals, diagrams, printable writing space / answer keys, teacher assignment URLs, independent year / subject limits, draft isolation, completion separation, teacher preview, rejection of mismatched class links and student submission data. Selected multi-stage numerical results are also independently calculated during authoring QA. SVG diagrams were rasterised for visual inspection; a full browser print-dialog / authenticated Firebase test was unavailable.
