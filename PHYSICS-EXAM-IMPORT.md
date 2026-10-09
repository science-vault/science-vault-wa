# Physics source exam import

The first batch adds 41 complete source questions from the 2024 Year 11 Unit 1 and Year 12 Unit 3 papers, with their matching marking-guide entries. The repository owner confirmed permission to publish the papers on 9 October 2026.

Questions remain grouped with their subparts and shared stimulus. The 41 question bodies now use selectable HTML text, source tables, superscripts/subscripts and MathML equations, with 39 preserved source figures. An expandable original question layout remains available. Marking guides retain their rendered source sections. Each record stores searchable source text, total marks, source paths, original question number and source exam year. Stable source IDs prevent repeat loading from creating duplicate records.

The Question Bank and Upper School Assessment Builder load the batch. In the Question Bank, filter Physics and choose question type, year or topic, or search source text. In the builder, select Physics ATAR, Year 11 or 12, and the syllabus option `2024 source exams (historical syllabus)`.

These records use manual marking against the original guide. They are not loaded into the automatically scored Student Quiz. Subpart-level structured marking rules and current syllabus alignment remain to be checked. Current 2026 Physics banks remain unchanged.

## Extraction and checks

The source paper and key must agree on every question number and total mark. The pilot contains 20 Year 11 questions and 21 Year 12 questions. Its 132 losslessly compressed WebP sections total approximately 4.4 MB. Source header/footer regions and unrelated following section instructions are excluded. Empty boundary slices are excluded; answer spaces and blank graph grids inside questions are retained.

A LibreOffice rendering issue clipped some equation text in the Year 11 marking guide. The working render copy resets left/right/first-line/hanging indentation for table paragraphs containing display equations. Source files in the repository are not modified. The resulting text includes the complete expected-mass calculation for Question 12.

`scripts/extract-physics-exam-sample.py SAMPLE_DIRECTORY` regenerates this fixed pilot from PDFs in `SAMPLE_DIRECTORY/rendered`. It writes the bank and image assets into this repository, and a crop-coordinate manifest and contact sheets into the temporary sample directory. The script is a pilot for these two audited papers; it does not claim to handle the entire archive automatically.

## Remaining archive

Initial tree audit found 1,034 non-temporary Physics exam-folder documents: 285 Year 11 and 749 Year 12. Removing 42 byte-identical copies leaves 992 distinct documents. Filename classification suggests 566 question papers, 425 keys and one data sheet. Those classifications require content verification. Forty-four same-name multi-format groups also require semantic deduplication.

Remaining work includes auditing the other paper/key pairs, semantic duplicate checks across formats and editions, structured subpart extraction, syllabus mapping and batch-by-batch visual verification. The entire archive has not been imported.

## Selectable text conversion

Run Pandoc on the two source DOCX papers with `-t html --mathml --extract-media=physics-text/media11` (or `media12`), writing `physics-text/year11.html` and `year12.html`. Keep `physics-sample/rendered/year11-paper.pdf` and `year12-paper.pdf` beside the `physics-text` directory, then run `python scripts/convert-physics-sample-to-text.py physics-text`. Media paths in HTML are relative to the parent of the working directory. The script preserves record IDs and original page fallbacks.

Eighteen reviewed crops restore Word vector drawings; 21 native raster figures are copied with transparency composited onto white. The Year 11 Question 14 isotope equation uses corrected MathML prescripts. Source captions clipped by the Word renderer are preserved as selectable figure captions. This converter is scoped to the audited pilot and requires review before adapting it to other papers.

## Archive batches for Assessment Builder

`physics-exam-import-queue.json` tracks all 992 distinct source documents, exact duplicates, format variants and filename-only paper/key candidates. Candidate matches are not treated as verified. `physics-exam-import-manifests/2024-full.json` describes the next two paper/key pairs.

The 2024 combined-unit batch adds 38 questions (20 Year 11 Units 1 & 2; 18 Year 12 Units 3 & 4). Each question retains selectable SVG text, source vector drawings, tables, native pictures, working space and blank graph grids. Source question headings and unrelated section/blank-page notices are omitted so the builder supplies its own numbering and total marks. Questions remain whole with their shared stimulus and subparts. Topic labels describe the source content, without asserting current syllabus alignment.

Two source label errors were resolved against the individual marking criteria: Year 11 Units 1 & 2 Question 12 (guide heading 6 and part (b) label 5, but criteria total 7), and Year 12 Units 3 & 4 Question 15 (guide heading 17, but criteria total 18). Both use the paper totals, 7 and 18, with explanatory marking notes. The importer independently checks the guide criteria maxima and the reviewed subpart totals before accepting these manifest overrides. The bank contains 79 imported source questions in total; the remaining archive is pending.

Run `python scripts/import-physics-source-pairs.py physics-exam-import-manifests/2024-full.json WORK_DIRECTORY` with the manifest PDFs under `WORK_DIRECTORY/rendered`. The importer requires consecutive question boundaries, explicit end markers and matching total marks, preserves source response space, namespaces SVG IDs, extracts native image assets and produces a report listing held questions. Visually review every generated section before publishing.

## Completion of the additional 50-question batch

Added 12 questions (67 marks) from the 2023 Year 11 Unit 1 paper, questions 1–12, with source marking tables and MathML. Combined with the preceding 38-question import, this completes the requested additional 50 questions. The cumulative source bank contains **91 questions**. Questions 13–19 of this paper remain queued; no further extraction was published.

All source question and key heading totals and rubric maxima match. Question 12 has an explicit note interpreting the source guide’s unnumbered “mark” in part (d) as 1 mark, consistent with the three-step, 3-mark rubric. Shared setup from Question 8 is included with Question 9 so it can be selected independently. Question 3 repeats the 240 V DC supply in selectable text because Word shape layering obscures part of its source label. Original source files remain unchanged.

The direct Word render dropped bare rectangles in several diagrams. `scripts/repair-physics-2023-render-copy.py ORIGINAL.docx TEMP_COPY.docx` makes a temporary rendering copy, expressing the same rectangle dimensions and anchors as zero-corner roundRect geometry. Visually checked restored circuit components, insulation layers and fuel-gauge assembly. Render this copy with LibreOffice and put its PDF at `WORK/rendered/paper.pdf`. Convert the original marking guide using Pandoc `-t html --mathml -o WORK/key.html`, then run `python scripts/import-physics-2023-next12.py WORK`. This importer is scoped to the reviewed twelve questions and stops there.

The Question Bank Database includes this batch in Recently added. In the Upper School Builder select Physics ATAR, Year 11, and **2023 source exams (historical syllabus)**. Historical source records are excluded from the current syllabus selection; current syllabus alignment and structured subpart marking remain pending.
