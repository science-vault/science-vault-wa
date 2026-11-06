# Editable question-bank conversion

The completed bank contains 2,712 reviewed questions across Mathematics, Mathematics Methods, Physics, Chemistry and Human Biology. All 628 former Mathematics question scans now use editable text/MathML; 500 existing native Mathematics questions were reviewed too. Original diagrams, question IDs, marks and grading data are preserved.

Stage original banks, source-map.json, original Word files and diagram-mapping.json in the working directory. Prepare source documents using prepare_sources.py, source_convert.py and recover_e3.py. Run the selection/response-control passes and repair_diagram_anchors.py, then the original-source diagram extractors and native_batch.py. Apply the reviewed manual-overrides.json with apply_manual_overrides.py after automatic conversion; run finalize.py last to synchronize indexes and progress. Scripts copied from the conversion workspace run relative to their own directory; existing pipeline scripts accept the staging directory. Source documents and working derivatives are not published.

The isolated-source pass renders original Word graphics without changing their pixels. review_diagram_roundtrip.py verifies all 162 embedded source rasters against their original PDF render. Publish only referenced diagrams. Source crops retain explicit bounds and provenance.

Runtime studio-source-image-text.js contains 75 reviewed equation/response-image replacements and the source-verified Methods question 13 tail. studio-question-format.js applies those replacements, Arial 12 pt, and removes automatic answer leaders. Diagrams remain images. Teacher-added answer lines remain optional. source-image-text.json retains source hashes and transcription provenance.

Before publication run the import/formatter tests, complete-bank semantic review, native-question grading checks, and real student/marking-key Word export checks. The final review covers every indexed question; original marking data must remain unchanged.
