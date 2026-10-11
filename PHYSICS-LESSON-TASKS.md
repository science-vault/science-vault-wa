# Physics ATAR prebuilt lesson tasks

Second subject rollout: 24 Year 11 and 20 Year 12 Physics lesson packages, alongside the existing 129 Geography packages. All Physics tasks are drawn from the current Topic Hub lesson sequence; the generator checks that each has a published module with teaching screens.

Teachers: **Classes and progress → Prebuilt lesson tasks → Subject: Physics ATAR**. Filter by year or search by lesson / unit. Choose **Use this task**, review the instructions, select the class and optional due date, then **Assign task**.

Students: **My tasks → My learning plan → Subject: Physics ATAR**. The approved year and subjects determine the sequence. No class code is needed for independent tasks. Teacher-assigned tasks remain above the independent plan.

Each Physics task links directly to its lesson and includes:

1. Learn: retrieval where available, explanations, models and worked examples.
2. Practise: guided and independent lesson questions before revealing solutions. Show equations, rearrangement, substitution, units, appropriate significant figures, labelled diagrams and physical reasoning where relevant. Use the marking points to correct work.
3. Check: mastery review, feedback, retry and one recorded improvement.

All three stages must be ticked before submitting Physics completion. Checklists are student-reported; they do not award an exam grade. Independent progress is saved for the account in the current browser. Existing class submissions use the unchanged Firestore schema and rules.

Validation: `node --experimental-vm-modules tests/lesson-tasks.cjs` with jsdom available. Tests cover all 44 Physics players and checklists, lesson existence, teacher task creation, independent year/subject selection, direct lesson opening and completion submission, while retaining Geography checks. Firebase writes are mocked in these tests; authenticated classroom verification requires approved accounts.

Rebuild the catalogue after lesson edits with `node scripts/build-lesson-task-catalog.cjs`. The rollout allowlist currently includes Geography and Physics only.
