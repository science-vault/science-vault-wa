# Account access validation

Run from the repository root with Node 22 or newer, Java 17 or newer and npm:

```sh
npm install --prefix access-tests
access-tests/node_modules/.bin/firebase emulators:exec --project demo-science-vault-access --only firestore "cd access-tests && npm test"
```

The demo project and rules test environment never access production Firebase accounts. UI tests use a local DOM with fake accounts and do not send emails.

Tests cover private account records, pending student and teacher registration, year groups and senior subject limits, prohibited self-approval and admin escalation, owner-only permission edits, revocation, page denials, signup password clearing and account/admin form behavior. Class tests cover enrolment, task assignment, exact assessment question IDs, subject filtering, private class reports, immutable submissions, and suspension/revocation. Both account types need approval. Lesson completion is student-reported; practice marks are calculated in the browser.

Owner setup is documented at `firebase-setup.html`. GitHub-hosted HTML, JavaScript and resource files remain publicly retrievable. The page gate is website navigation control; confidential page content or downloads must be served by a backend that checks permissions.
