# Mathematics Applications ATAR: lessons and coverage

Checked 8 October 2026. Original student learning material with suggested self-review marking points, not official examination questions or keys.

- 53 Year 11 lessons and 48 Year 12 lessons.
- 1539 screens, 617 written tasks: 202 worked examples and 415 independent tasks.
- Four focused theory screens in each lesson; 30 named SVG teaching examples with explanatory captions.
- Interactive normal intervals, regression and residuals, recurrence timing, loan/withdrawal timing and exhaustive small assignments.
- One formative concept question per lesson. The mastery view repeats that question; it does not replace written assessment.

## Syllabus sources and scope

[Official SCSA Applications page](https://senior-secondary.scsa.wa.edu.au/syllabus-and-support-materials/mathematics/mathematics-applications)

[Year 11, teaching from 2026](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0007/1232188/Mathematics-Applications-ATAR-Year-11-Syllabus-for-teaching-from-2026.PDF) and [current Year 12, teaching from 2025](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0009/1121310/Mathematics-Applications-ATAR-Year-12-Syllabus-for-teaching-from-January-2025_pdf.PDF) were checked for the numbered content map below. [Published Year 12 for 2027](https://senior-secondary.scsa.wa.edu.au/__data/assets/pdf_file/0018/1262133/Mathematics-Applications-ATAR-Year-12-Syllabus-for-teaching-from-2027.PDF) has the same 65 numbered content IDs and topic structure. All 49 Year 11 and 65 Year 12 IDs have mapped lessons. This mapping is a content index, not external accreditation of the resources.

## Learning and marking conventions

Questions are original and use supplied fictional financial data. Exact expressions in π are retained in geometry where useful. Histograms distinguish frequency from density with unequal bin widths. Small-data quartiles use median-of-halves, excluding the centre for odd samples; population and sample SD are distinguished. Normal displays use SD inputs and label standardisation. Regression predicts the stated response and uses residual = observed − predicted.

Sequences state initial indexing and keep discrete thresholds. Finance specifies nominal or effective rate, payment timing, and final partial payments. Interest is calculated at full precision unless a task explicitly specifies posted rounding. Loan and withdrawal models stop at exhaustion rather than continue into negative balances. Activity-on-node diagrams label durations at nodes; forward scanning uses maxima, backward scanning minima. Shared float is not treated as independent spare time. Maximum-flow solutions show a feasible flow and matching cut; Hungarian totals are recovered from original costs.

Written drafts and self-assessed marks save on the current browser. They are not teacher-verified grades. Existing tracking hooks remain; no central account or class-report system is added. Study diagrams use their own named example data; task data are authoritative for each calculation. Students draw requested graphs and models on paper.

## Rebuild and checks

Run `python build-applications.py`, `python build-applications-visuals.py`, then `python integrate-applications.py`. Run `node applications-atar-check.cjs` for structural and numeric-model checks. The build files are retained so content can be edited and regenerated. Verification details are recorded with the implementation commit.

## Lesson map

| Year | Unit | Lesson | SCSA IDs | Screens | Tasks |
|---|---|---|---|---:|---:|
| 11 | Unit 1 | Wages, salary and overtime | 1.1.1 | 15 | 6 |
| 11 | Unit 1 | Commission and piecework | 1.1.1 | 15 | 6 |
| 11 | Unit 1 | Supplied allowance rules and payment periods | 1.1.2 | 15 | 6 |
| 11 | Unit 1 | Personal budgets and cash-flow reserves | 1.1.3, 1.1.8 | 15 | 6 |
| 11 | Unit 1 | Unit costs and purchase decisions | 1.1.4 | 15 | 6 |
| 11 | Unit 1 | Successive and reverse percentages | 1.1.5 | 15 | 6 |
| 11 | Unit 1 | GST, markup, margin and profit | 1.1.5 | 15 | 6 |
| 11 | Unit 1 | Simple and compound interest | 1.1.5 | 15 | 6 |
| 11 | Unit 1 | Currency conversion and transaction fees | 1.1.6 | 15 | 6 |
| 11 | Unit 1 | Dividends, yield and P/E ratios | 1.1.7 | 15 | 6 |
| 11 | Unit 1 | Spreadsheet models and absolute references | 1.1.8, 1.2.3 | 15 | 6 |
| 11 | Unit 1 | Substitution and evaluating formulas | 1.2.1, 1.2.2 | 15 | 6 |
| 11 | Unit 1 | Tables of values and two-variable inputs | 1.2.1, 1.2.2, 1.2.3 | 15 | 6 |
| 11 | Unit 1 | Matrix information, order and special matrices | 1.2.4, 1.2.5 | 15 | 6 |
| 11 | Unit 1 | Matrix addition and scalar multiplication | 1.2.6 | 15 | 6 |
| 11 | Unit 1 | Matrix multiplication: rows meet columns | 1.2.6 | 15 | 6 |
| 11 | Unit 1 | Matrix cost models and compatible units | 1.2.4, 1.2.7 | 15 | 6 |
| 11 | Unit 1 | Matrix powers and multi-stage walks | 1.2.6, 1.2.7 | 15 | 6 |
| 11 | Unit 1 | Pythagoras in two dimensions | 1.3.1 | 15 | 6 |
| 11 | Unit 1 | Pythagoras and space diagonals | 1.3.1 | 15 | 6 |
| 11 | Unit 1 | Composite areas and boundary lengths | 1.3.2 | 16 | 7 |
| 11 | Unit 1 | Circle sectors: arc, area and perimeter | 1.3.2 | 15 | 6 |
| 11 | Unit 1 | Prisms, cylinders, cones and capacity | 1.3.3 | 16 | 7 |
| 11 | Unit 1 | Composite solids and tank capacity | 1.3.3 | 15 | 6 |
| 11 | Unit 1 | Surface area and exposed faces | 1.3.4 | 16 | 7 |
| 11 | Unit 1 | Similarity and corresponding lengths | 1.3.5, 1.3.6 | 15 | 6 |
| 11 | Unit 1 | Scale drawings, maps and units | 1.3.7 | 15 | 6 |
| 11 | Unit 1 | Area and volume under similarity | 1.3.8 | 16 | 7 |
| 11 | Unit 2 | Planning a statistical investigation | 2.1.1, 2.1.12 | 15 | 6 |
| 11 | Unit 2 | Variable types, tables and displays | 2.1.2, 2.1.3 | 16 | 7 |
| 11 | Unit 2 | Distribution shape, dot plots and stem plots | 2.1.4 | 15 | 6 |
| 11 | Unit 2 | Mean, standard deviation and interpretation | 2.1.5 | 15 | 6 |
| 11 | Unit 2 | Normal models and standard scores | 2.1.6 | 16 | 6 |
| 11 | Unit 2 | The 68–95–99.7 rule and expected counts | 2.1.8 | 16 | 6 |
| 11 | Unit 2 | Normal probabilities and technology inputs | 2.1.9 | 16 | 6 |
| 11 | Unit 2 | Normal percentiles and central intervals | 2.1.7 | 16 | 6 |
| 11 | Unit 2 | Quartiles, outliers and modified box plots | 2.1.10 | 15 | 6 |
| 11 | Unit 2 | Comparing group distributions | 2.1.11, 2.1.12 | 15 | 6 |
| 11 | Unit 2 | Right-triangle ratios and inverse angles | 2.2.1 | 15 | 6 |
| 11 | Unit 2 | Triangle area from an included angle | 2.2.2 | 15 | 6 |
| 11 | Unit 2 | Heron’s rule and three-side area | 2.2.2 | 15 | 6 |
| 11 | Unit 2 | Sine rule with opposite side–angle pairs | 2.2.3 | 15 | 6 |
| 11 | Unit 2 | Cosine rule for lengths and angles | 2.2.3 | 15 | 6 |
| 11 | Unit 2 | Angles of elevation and depression | 2.2.4 | 15 | 6 |
| 11 | Unit 2 | Bearings, route triangles and return directions | 2.2.4 | 15 | 6 |
| 11 | Unit 2 | Trigonometry in linked three-dimensional triangles | 2.2.4 | 15 | 6 |
| 11 | Unit 2 | Linear equations and checking a solution | 2.3.1 | 15 | 6 |
| 11 | Unit 2 | Building linear models from words | 2.3.2, 2.3.5, 2.3.6 | 15 | 6 |
| 11 | Unit 2 | Slope, intercepts and straight-line graphs | 2.3.3, 2.3.4, 2.3.5, 2.3.6 | 15 | 6 |
| 11 | Unit 2 | Simultaneous linear equations and plan comparisons | 2.3.7, 2.3.8 | 15 | 6 |
| 11 | Unit 2 | Cost, revenue and break-even decisions | 2.3.8 | 15 | 6 |
| 11 | Unit 2 | Continuous piecewise-linear tariffs | 2.3.9, 2.3.10 | 15 | 6 |
| 11 | Unit 2 | Step graphs and boundary conventions | 2.3.9, 2.3.10 | 15 | 6 |
| 12 | Unit 3 | Two-way tables and categorical association | 3.1.2, 3.1.3, 3.1.4 | 15 | 6 |
| 12 | Unit 3 | Scatterplots and explanatory variables | 3.1.5, 3.1.6, 3.1.8, 3.1.9 | 15 | 6 |
| 12 | Unit 3 | Pearson correlation and its limits | 3.1.7 | 15 | 6 |
| 12 | Unit 3 | Least-squares lines and contextual coefficients | 3.1.10, 3.1.12 | 16 | 6 |
| 12 | Unit 3 | Residual plots and model suitability | 3.1.11 | 16 | 6 |
| 12 | Unit 3 | Explained variation and r squared | 3.1.13 | 15 | 6 |
| 12 | Unit 3 | Interpolation, extrapolation and predictions | 3.1.14, 3.1.15 | 15 | 6 |
| 12 | Unit 3 | Association, coincidence and confounding | 3.1.17, 3.1.18 | 15 | 6 |
| 12 | Unit 3 | Reporting a complete bivariate investigation | 3.1.1, 3.1.16, 3.1.19 | 15 | 6 |
| 12 | Unit 3 | Arithmetic sequences, recursion and explicit rules | 3.2.1, 3.2.2, 3.2.3 | 15 | 6 |
| 12 | Unit 3 | Linear growth, decay and discrete thresholds | 3.2.4 | 15 | 6 |
| 12 | Unit 3 | Geometric sequences and index conventions | 3.2.5, 3.2.6, 3.2.7 | 15 | 6 |
| 12 | Unit 3 | Depreciation and geometric threshold models | 3.2.8 | 15 | 6 |
| 12 | Unit 3 | First-order linear recurrences and update order | 3.2.9, 3.2.11 | 17 | 7 |
| 12 | Unit 3 | Steady states and long-term recurrence behaviour | 3.2.10, 3.2.11 | 16 | 6 |
| 12 | Unit 3 | Graph vocabulary, degrees and network models | 3.3.1, 3.3.2 | 15 | 6 |
| 12 | Unit 3 | Adjacency matrices and multi-stage connections | 3.3.3 | 15 | 6 |
| 12 | Unit 3 | Planar graphs, faces and Euler’s formula | 3.3.4, 3.3.5 | 15 | 6 |
| 12 | Unit 3 | Walks, trails, paths, cycles and bridges | 3.3.6 | 15 | 6 |
| 12 | Unit 3 | Shortest routes by systematic comparison | 3.3.7 | 15 | 6 |
| 12 | Unit 3 | Eulerian trails: using every edge once | 3.3.8 | 16 | 7 |
| 12 | Unit 3 | Hamiltonian paths: visiting every vertex | 3.3.9 | 15 | 6 |
| 12 | Unit 4 | Time-series plots, trends and seasonality | 4.1.1, 4.1.2 | 15 | 6 |
| 12 | Unit 4 | Odd-window moving averages and spreadsheets | 4.1.3 | 15 | 6 |
| 12 | Unit 4 | Even-window moving averages and centring | 4.1.3 | 15 | 6 |
| 12 | Unit 4 | Seasonal indices by the average-percentage method | 4.1.4 | 15 | 6 |
| 12 | Unit 4 | Deseasonalising observations | 4.1.5 | 15 | 6 |
| 12 | Unit 4 | Trend regression and seasonal forecasts | 4.1.6, 4.1.7 | 15 | 6 |
| 12 | Unit 4 | A complete time-series investigation | 4.1.8 | 15 | 6 |
| 12 | Unit 4 | Compound interest and matching periods | 4.2.1 | 15 | 6 |
| 12 | Unit 4 | Effective annual rates and fair comparisons | 4.2.2 | 15 | 6 |
| 12 | Unit 4 | Financial solvers and period thresholds | 4.2.3 | 16 | 7 |
| 12 | Unit 4 | Reducing-balance loans and amortisation tables | 4.2.4 | 16 | 6 |
| 12 | Unit 4 | Loan repayments, total interest and final adjustments | 4.2.5 | 16 | 6 |
| 12 | Unit 4 | Refinancing comparisons and remaining balances | 4.2.5 | 15 | 6 |
| 12 | Unit 4 | Regular deposits and savings annuities | 4.2.3, 4.2.7 | 15 | 6 |
| 12 | Unit 4 | Withdrawal annuities and final partial payments | 4.2.6, 4.2.7 | 16 | 6 |
| 12 | Unit 4 | Perpetuities and preserving principal | 4.2.7 | 15 | 6 |
| 12 | Unit 4 | Trees, spanning trees and connector costs | 4.3.1, 4.3.3 | 15 | 6 |
| 12 | Unit 4 | Prim’s algorithm and minimum spanning trees | 4.3.2, 4.3.3 | 15 | 6 |
| 12 | Unit 4 | Activity dependencies and project networks | 4.3.4 | 15 | 6 |
| 12 | Unit 4 | Forward scanning and earliest starts | 4.3.5 | 15 | 6 |
| 12 | Unit 4 | Backward scanning and latest starts | 4.3.5 | 15 | 6 |
| 12 | Unit 4 | Critical paths and multiple longest chains | 4.3.6, 4.3.7 | 15 | 6 |
| 12 | Unit 4 | Total float and interacting delays | 4.3.8 | 15 | 6 |
| 12 | Unit 4 | Maximum flow and minimum cuts | 4.3.9 | 16 | 7 |
| 12 | Unit 4 | Bipartite assignments and small-case optimisation | 4.3.10, 4.3.11 | 17 | 7 |
| 12 | Unit 4 | Hungarian reductions and optimality | 4.3.11 | 17 | 7 |
