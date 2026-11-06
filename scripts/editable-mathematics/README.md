# Editable Mathematics conversion

These scripts reproduce the conservative text-conversion pass from the original bank snapshot at `4efbe76e50bbf4b49886f97074328563412a3ef5`. They require Python with lxml and olefile, and LibreOffice with Math support. Use a temporary staging directory; generated files are review candidates rather than an automatic publication.

Every script accepts that staging directory as its sole argument. Run `audit.py`, `source_convert.py`, then `prepare_sources.py`. The first two download the original metadata, banks and Word sources. Preparation recovers all non-empty FX Equation cells, including multiline statements and worked steps.

For Equation 3 objects, convert the original Word files into the staging `converted/` directory as ODT files, with LibreOffice's `/org.openoffice.Office.Common/Filter/Microsoft/Import/MathTypeToMath` setting enabled. Then run `recover_e3.py`. Recovery refuses to pair objects when the original and converted object counts differ.

Run `remove_selection_controls.py`, `materialize_choice_labels.py`, `native_batch.py`, then `finalize.py`. The output is in `output/`. Selection-control removal is restricted to the source bank's repeated empty multiple-choice ovals. Question diagrams remain untouched.

The converter keeps section identity, continuation rows, automatic choice labels, statement labels, source correction notes, and all shared figures preceding the original question screenshot. It preserves question IDs, grading data and keys. Long responses without a matching long-response section and questions referring to an unmapped diagram remain as their original scans.

Compare every candidate against its original question and check the generated Word document before publication. The repository tests include regressions for long-response mapping, multiline equations, radicals, source assumptions, context maps, and unchanged marking behaviour. Keep `practice-studio-editable-progress.json` accurate when publishing a batch.
