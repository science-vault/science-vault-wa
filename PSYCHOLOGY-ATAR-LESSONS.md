# Psychology ATAR student lessons

Added 7 October 2026. The courses use the SCSA Year 11 and Year 12 syllabuses effective 2026. The published Year 12 version effective 2027 was also checked; SCSA identifies revised grade descriptions for that version. Official syllabus and examination links appear within every module. These are original learning resources and suggested marking points, not SCSA-endorsed material.

## Course size and organisation

19 modules, 488 substantive learning/reference/question/solution screens, approximately 28,143 words of theory, 90 labelled SVG models, three interactive activities, 133 written tasks (57 worked examples and 76 independent tasks), and 95 additional multiple-choice concept checks. Each module has 25–27 screens. The written tasks include data interpretation, research design, study evaluation, scenario application, 12-mark extended responses and a Year 12 extended-answer practice set with 10-mark Part A and two alternative 20-mark Part B questions. A concept-check pass is distinguished from exam readiness and teacher-verified marking.

| Year | Unit | Module | Screens |
|---|---|---|---:|
| 11 | Unit 1 | Nervous system, neurons and communication | 25 |
| 11 | Unit 1 | Brain structure, historical evidence and imaging | 25 |
| 11 | Unit 1 | Lifespan development, plasticity and Piaget | 25 |
| 11 | Unit 1 | Attachment, designated studies and environments | 26 |
| 11 | Unit 1 | Science Inquiry: ethical design, data and evaluation | 27 |
| 11 | Unit 2 | Attitudes, attribution and cognitive dissonance | 26 |
| 11 | Unit 2 | Social identity, stereotypes and prejudice | 26 |
| 11 | Unit 2 | Compliance, obedience and conformity | 26 |
| 11 | Unit 2 | Bystanders, prosocial and antisocial behaviour | 25 |
| 12 | Unit 3 | Sensation, perception and memory models | 25 |
| 12 | Unit 3 | Remembering, forgetting and memory loss | 26 |
| 12 | Unit 3 | Classical conditioning and designated studies | 25 |
| 12 | Unit 3 | Operant conditioning, reinforcement and schedules | 26 |
| 12 | Unit 3 | Observational learning and behaviour modification | 26 |
| 12 | Unit 4 | Motivation, self-determination and Maslow | 26 |
| 12 | Unit 4 | Subjective and psychological wellbeing | 25 |
| 12 | Unit 4 | Stress models, appraisal and coping | 25 |
| 12 | Unit 4 | Sleep, circadian rhythms and He et al. (2020) | 26 |
| 12 | Unit 4 | Advanced Science Inquiry and written exam preparation | 27 |

## Syllabus coverage

Unit 1: nervous system organisation and functional divisions; neuron structure and electrochemical transmission; brain structures, cortical localisation and contralateral control; Gage, Sperry and Freeman; EEG, CT, MRI and fMRI; lifespan domains, adaptive/developmental plasticity and five neural developmental processes; adolescent brain development; Piaget; Bowlby; Harlow; Ainsworth; attachment criticism and cultural context.

Unit 2: implicit/explicit attitudes, tripartite structure, dissonance and forced compliance; situational/dispositional attribution, fundamental attribution error, self-serving and group-serving bias; social identity; stereotypes, prejudice, direct/indirect discrimination, just-world beliefs, contact and Robbers Cave; Kelman; obedience and Milgram; conformity and Asch; bystander effects and the smoke-filled room study; bullying, groupthink, reciprocity, social responsibility and personal influences on helping.

Unit 3: sensation and perception processes; multi-store and working memory features, store duration/capacity/encoding, the later episodic buffer, long-term memory types and brain contributions; Molaison; recall, recognition, relearning; levels of processing and specifically Craik and Tulving Experiment Two; rehearsal and Ebbinghaus; retrieval failure, interference, motivated forgetting and decay; CTE, Alzheimer's and Wernicke-Korsakoff syndrome; classical conditioning and its five principles, Pavlov and Little Albert; operant contingencies and reinforcement schedules, Thorndike and Skinner; Bandura and the 1961 Bobo-doll study; systematic desensitisation and token economies.

Unit 4: sources of motivation, Deci and Ryan's continuum and basic needs, classic and expanded Maslow hierarchy; Diener's subjective wellbeing and Ryff's six dimensions; Selye, distress/eustress, four stressor categories and source/duration/intensity; general adaptation syndrome, Holmes and Rahe, appraisal and coping; evolutionary/restorative sleep explanations, circadian rhythm, three NREM stages plus REM and sleep-cycle characteristics; acute/chronic deprivation and hygiene; He et al. (2020) pilot trial.

Science Inquiry across both years: ethics approval and monitoring, eight human safeguards and the animal three Rs; aims, operational variables and confounds; directional/non-directional hypotheses and qualitative inquiry; experimental, observational, case, correlational, longitudinal and cross-sectional designs; convenience, snowball, random and stratified sampling versus random allocation; placebo/expectancy controls and blinding; qualitative interviews/surveys, physiological and rating measures, mixed methods, subjective/objective differences; four graph types, summary/frequency tables, mean/median and Pearson r; valid conclusions; internal/external validity and test–retest/inter-rater reliability; generalisability, improvements, scientific-source criticism and referencing.

## Sources and corrections

Current official syllabuses, minor-change notice, 2025 examination, ratified marking key and examiner report were reviewed. Designated studies are taught through aim, method, findings, contribution and criticism. Primary study sources and official NIH/CDC health explanations are linked in relevant modules.

Eight existing Narrogin PowerPoints (120 slides) supported research methodology, data analysis, Piaget, attachment, cognitive dissonance, social identity, obedience and prosocial behaviour. Their content was checked and rewritten for students rather than copied as a slide transcript. Current syllabus details include Skinner (1938), Deci and Ryan (2000), four observational-learning processes and three NREM stages. Older deterministic attachment statements and unqualified causal/medical claims were corrected. Experiment variants are kept distinct: Craik and Tulving Experiment Two, the live-model 1961 Bobo study, and Latané and Darley's smoke-filled room.

## Player and integration

`psychology-atar-course.js` contains the complete course and question data. `psychology-visuals.js` contains accessible labelled SVGs with reading guidance and limitations. `psychology-atar-player.js` provides navigation, worked solutions, independent-answer reveal, point-by-point self-assessment, browser-local draft/progress saving, randomised concept checks and three interactive activities. `psychology-atar.css` provides responsive layouts. The Topic Hub adds Psychology ATAR in Years 11/12 and four units; the Psychology resources page links into both courses. Existing lesson tracking records lesson activity and concept scores through its existing interface. Written drafts and self-marks remain browser-local; they are not automatically marked or uploaded as teacher-verified answers.

## Validation

Run `node psychology-atar-check.cjs` for portable course integrity, question allocations, duplicate IDs, concept-bank structure and coverage checks.

Playwright verification rendered all 488 screens and all independent answer reveals; tested four unit menus, navigation, saved draft restoration, self-mark changes, zero and 100% concept submissions, lesson-tracking recording, and the numerical/consequence activities. All screens were checked for page overflow at 390px. All 90 SVGs passed text bounds checks and were visually reviewed. Existing Chemistry and Year 7–10 Science course entry paths were also checked. No browser page errors were recorded. This verifies implementation behaviour; it is not an independent subject-specialist endorsement.
