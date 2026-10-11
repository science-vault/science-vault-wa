# Geography ATAR prebuilt lesson tasks

First subject rollout: Geography ATAR only, with 56 Year 11 and 73 Year 12 lesson packages. Other lesson courses, assessment builders and manual class assignments remain available.

Teachers: open `teacher-classes.html`, filter the prebuilt library by year or search by lesson / unit, choose **Use this task**, review the populated form, choose a class and optional due date, then **Assign task**. Packages use the existing Firestore lesson task schema and current rules. Each assignment links directly to the selected lesson.

Students: open `student-classes.html` (**My tasks**). Teacher assignments are listed first. **My learning plan** automatically supplies the Geography lessons for the student's approved year and subjects; no class code is required for independent use. The next task is the first unfinished lesson in the selected sequence. Filters and pagination allow revision or a different starting lesson.

Each lesson package contains a topic-specific focus and three stages: Learn, Practise, Check. Students attempt the lesson's existing guided and independent questions, compare their responses with marking points, and complete the mastery review. No replacement questions or unrelated question-bank quizzes are invented.

The three-stage checklist is student-reported. It saves to browser storage under the signed-in account's UID. It does not sync independent completion between devices or produce an exam grade. Existing class submissions continue to save through the established Firestore progress system when a student explicitly submits completion. Geography completion submission requires all three stages to be ticked. Teacher reports label it as student-marked completion. Storage failures show an error instead of a saved confirmation.

No Firebase rules change is required.

## Validation and maintenance

With jsdom available to Node (through normal dependency resolution or NODE_PATH):

```sh
node scripts/build-lesson-task-catalog.cjs
node --experimental-vm-modules tests/lesson-tasks.cjs
node --experimental-vm-modules geography-atar-check.cjs
```

The generator reads the current Topic Hub lesson scripts and emits `lesson-task-catalog.json`; its published-course allowlist is Geography ATAR for this rollout. Add another course only after the subject is ready for review. The tests exercise teacher assignment values, direct lesson opening, class links, independent selection, subject/year limits, per-account storage and completion submission with mocked Firebase calls. Live authenticated Firebase operations still require an approved teacher/student account.
