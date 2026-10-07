# Activate live student tracking

This is an integration ready for activation, not an active database. Until configured, no student data is collected and the pages explicitly say tracking is inactive.

1. Create a Supabase project for the site and choose the region and plan appropriate to your school. Configure Auth for email/password. Supply approved accounts through the dashboard, or configure signup and confirmation email delivery before inviting a class. Apply your school's rules for student accounts and use of external services.
2. Run `tracking/schema.sql` once in the Supabase SQL editor. It creates profiles, classes, membership, progress and attempt history, with row-level security. Keep student records in the database, never in this public GitHub repository.
3. Register the teacher through the tracking sign-up form, confirm the email and run the approval statement at the bottom of the SQL file with the teacher's exact email. New accounts are always students; site navigation is not an authorization boundary.
4. Set `tracking-config.js` to the project's HTTPS URL and **publishable** API key (`sb_publishable_...`). These are public connection settings. Never use a secret key or legacy service-role key in the website.
5. Deploy the configuration. Sign in on `teacher-tracking.html`, create a class and share its 32-character code with students. Students sign in on `student-tracking.html`, join the class and open lessons in the same tab. Sign out on shared devices.
6. Perform a live acceptance check with two teacher accounts and two student accounts before inviting students: each teacher must see only their class, students only their own records, and unapproved students must not create classes or change their roles. Verify recording, refresh, expired-session handling and CSV output against the live hosted project.

## What is recorded

- Stable module identifier and title, course, most recent screen and distinct screens visited.
- Whole mastery test checks for Year 11/12 Physics and Year 12 Human Biology: latest score, best score and check count. Rechecking the same answers is another check, not necessarily a new randomized attempt.
- Year 7 lessons: visited screens and successful cumulative mastery; their question-by-question review is not a whole-test score history.
- Server timestamp of the latest saved event. The dashboard polls every 30 seconds while visible and can be refreshed manually.

Screens visited are not evidence of learning, and the navigation progress bar is not a completion score. Browser-calculated mastery is a formative report; answers and reporting code are public and these results are not secure exam results. No time-on-task or online-presence claim is made. Historic lesson work before activation cannot be recovered.

Pending events are stored in the current tab's session storage under the signed-in student ID and retried after connection failures. Keep the tab open if it says saving is pending. The queue does not survive closing the tab; the interface does not claim an event is saved until the server accepts it. Authentication tokens are kept in session storage; passwords are sent to Auth, not saved by this code.

The first release supports join codes, rosters and progress reports. Class removal, assignments, password recovery, administrators' account management and record-retention/deletion controls remain in the provider administration workflow. Define your retention process before rollout.

Official references: [Supabase Auth](https://supabase.com/docs/guides/auth), [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
