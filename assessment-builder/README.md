# Assessment Builder

This directory is the modular home for the Learning Vault WA Assessment Builder.

## Architecture

- `config/subjects.js` — learning-area/subject registry and bank paths.
- `js/bank-loader.js` — lazy-loads only the selected subject/year question bank.
- `question-banks/` — subject-specific question banks. Science Years 7–10 will be migrated here after the loader is proven live.
- `images/` — reusable assessment imagery with licence/source metadata.

## Migration strategy

The existing root Assessment Builder and Science question-bank files remain live during migration. New modular files are added alongside them first so the Resource Vault is not disrupted. After the modular loader is tested, Science banks can be consolidated into clean 2026 SCSA files and legacy correction layers retired.

## Performance rule

Do not preload every SCSA question bank. Load a bank only after the user chooses the relevant learning area/subject/year. This keeps initial page load small as the library expands.