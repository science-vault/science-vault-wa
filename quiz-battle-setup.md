# Quiz Battle — activation

Open `quiz-battle.html` from the student dashboard or teacher Classes and progress screen. Approved accounts can use Solo Sprint immediately.

## Activate live class battles

1. Open https://console.firebase.google.com/project/science-vault-wa/firestore/rules using the Firebase project owner account.
2. Open the complete `firestore.rules` file published with this site (or download it from Quiz Battle → Live play setup for the site owner).
3. Replace the Firestore Rules editor contents with the complete file, then click Publish. Do not paste only the new game section: it uses the existing class/account helper functions.
4. Reload Quiz Battle. As a verified, approved teacher, select your class, year, subject and mode. Review the questions, create the battle, and share its eight-character code. Students must already be enrolled in that class and approved for the selected year/subject.

The site publication does not automatically publish Firebase rules. Existing account, class, task and progress rules are retained in the complete rules file.

## Play

- Ready-made Physics games provide 20 questions for each of 146 focused lessons and 44 full-topic references. Use the year/unit/lesson picker in Quiz Battle, or the game link inside a Physics lesson. Sets begin with that lesson’s checks and include clearly labelled related topic revision. The library contains 975 unique questions shared across the 190 sets; the 3,800 question uses are not 3,800 different questions.
- Use Play solo for independent practice, or Use in class battle to load the reviewed set into the teacher console. Select your class and create the battle. Personal bests are stored separately for each lesson on this browser/device.
- Premade lesson checks use two to four options. Publish the latest complete Firestore rules even if an earlier version of live battles was activated; the new rules accept the lesson sets’ three-option questions.
- Solo Sprint also includes 26 original starter questions across Science, Physics, Chemistry, Biology, Human Biology and Mathematics Methods. Personal bests stay on that browser/device.
- Teachers can paste their own four-option questions, correct answers and explanations, or a JSON array, with up to 50 questions per game. Written-response and image-based assessment questions are not automatically converted into multiple-choice questions.
- Live games support up to 100 enrolled players, individual or team mode, 20/30/45/60-second rounds, locked first answers, speed/streak bonuses, answer explanations, standings and a final podium.
- Teams use average points per player. Players select a team when joining; coordinate teams before starting.
- The host starts each round and reveals its answer. Responses are accepted only while the round is open and within its server-timed deadline. A teacher may close a round early.
- If the host refreshes, use Resume a hosted battle with the battle code. A partially calculated round can be resumed using Finish calculating scores.
- Players can rejoin an existing game with their account and code. New players cannot join after the lobby closes. Room access expires 12 hours after creation. Room documents are not automatically deleted.
- Battle points are separate from school marks and Learning League XP. Lessons and standard practice quizzes continue to award Learning League XP through their existing flows.

## Verification

Scoring, question parsing, timeout behaviour, solo completion, personal bests, join flow, answer locking, teacher controls, answer reveal, podium and account-switch protection were checked. The complete Firestore rules compiled in the local emulator, and an actual two-player game was exercised through the game client's database functions. Membership/year/subject boundaries, answer-key privacy, immutable answers, server deadlines, room capacity and expiry were checked. Authenticated production multiplayer requires the Firebase rules activation above; it has not been tested against the production database.

