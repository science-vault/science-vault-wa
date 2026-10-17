# Lesson player development: acceptance checks

Development branch only. Do not merge into main until these checks pass in a browser against the configured Firebase project.

## Pilot lesson

Open `lesson-player-preview.html` on a hosted preview of this branch.

- [ ] Signed-out visitor can navigate the five-slide lesson; progress persists on reload in that browser.
- [ ] Question slide blocks Next until the correct answer is selected.
- [ ] Incorrect answer gives feedback without unlocking the next slide.
- [ ] The final slide requires selecting Finish lesson before progress reaches 100%.
- [ ] Approved student can sign in, resume after reload and see a successful account-sync status.
- [ ] Signed-in account A cannot inherit local or cloud progress from account B using the same browser.
- [ ] Offline/cloud-denied case retains local progress and reports sync failure accurately.
- [ ] Reset preview starts a new attempt and does not instantly restore previously completed slides.
- [ ] Student who completed the lesson once retains the prior completion history on a new attempt.
- [ ] Firestore rules accept the written lesson-journey document for an active student and reject unauthorised writes.

## Topic Hub Focus Mode

- [ ] Open a real Year 7–10 lesson and a real ATAR lesson.
- [ ] Focus Mode expands the lesson; Exit and Escape restore the normal layout.
- [ ] Lesson navigation and sequential slide gates still work.
- [ ] The Back to Topics control exits Focus Mode.
- [ ] Test desktop, tablet, mobile, keyboard and screen-reader announcements.

## Release gate

- [ ] Review browser console and Firebase permission errors.
- [ ] Verify no regressions in topic selection, lesson progress or teacher assignment.
- [ ] Confirm tests in a branch-hosted environment; GitHub Pages main is not a preview of this branch.
- [ ] Obtain approval before merging to main.

Current state: code committed; these manual and browser tests have **not** been executed.

## Batch 1 embedded practice checks

- [ ] Open a lesson with a matching lesson-game set; verify three multiple-choice questions load.
- [ ] Answer each question once; feedback and final score should appear.
- [ ] Switch to another lesson while questions load; old lesson content must not appear.
- [ ] Change between multiple-choice, written and calculation practice without stale results.
- [ ] Written self-check requires an answer before revealing the suggested answer; it is not automatically graded.
- [ ] A lesson with a suitable numeric calculation displays the numerical input and correct feedback.
- [ ] A lesson without a suitable calculation reports that none is available.
- [ ] Optional practice never changes lesson mastery or completion percentages.
- [ ] Focus Mode's exit button remains visible while the overlay is active.
- [ ] Refresh or reopen the lesson; verify account progress is not confused with optional practice.

## Test environment

GitHub Pages serves the production branch, not this development branch. Use an isolated branch deployment or a local HTTP server for the browser checks. Test signed-in Firebase sync only against an authorised configured environment. No production merge is authorised by this checklist.
