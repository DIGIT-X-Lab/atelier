# Reporting-Standard Routing
### Which reporting-guideline pack(s) to load for the work in front of you

*Used at the **Ingest** step and by [`../rubrics/manuscript.md`](../rubrics/manuscript.md). Match the study on the bench to a row, then load only the pack(s) that apply — **just-in-time**, not all at once. The packs carry the field-specific teeth the general rubric can't; the general rubric handles everything a specific guideline doesn't reach.*

| Work / study type | Load pack(s) | One-line why |
|---|---|---|
| Medical-imaging AI / CAD / segmentation model | [`claim.md`](claim.md) | CLAIM is the checklist reviewers apply to imaging-AI claims (data provenance, split integrity, external test set, ground truth). |
| Clinical prediction / prognostic / diagnostic ML model | [`tripod-ai.md`](tripod-ai.md) | TRIPOD-AI governs how prediction models are developed, validated, and reported (calibration, sample size, missing data). |
| Observational study (cohort / case-control / cross-sectional) | [`strobe.md`](strobe.md) | STROBE targets the biases that sink observational work — confounding, selection, participant flow. |
| Randomized controlled trial | [`consort.md`](consort.md) | CONSORT is the trial-reporting standard editors expect (randomization, allocation concealment, CONSORT flow diagram). |
| Diagnostic accuracy study | [`stard.md`](stard.md) | STARD covers the traps specific to test-accuracy studies (reference standard, spectrum bias, indeterminate results). |
| Systematic review / meta-analysis | [`prisma.md`](prisma.md) | PRISMA is the reproducibility-and-transparency bar for evidence synthesis (search strategy, PRISMA flow, risk of bias). |
| Animal / preclinical *in vivo* research | [`arrive.md`](arrive.md) | ARRIVE governs the rigor and reporting of animal experiments (randomization, blinding, sample size, ethics). |
| **(fallback) no row matches** | none — apply [`../rubrics/manuscript.md`](../rubrics/manuscript.md) general rigor only | State plainly in the review that **no specific reporting guideline was matched**, and that the critique rests on general methodological rigor rather than a named checklist. |

**Notes**

- **A study can match more than one row.** An imaging-AI *diagnostic* model may warrant both `claim.md` and `stard.md`; a prediction model reported inside an RCT may warrant `tripod-ai.md` and `consort.md`. Load all that apply.
- **Packs are loaded just-in-time** — pull a pack only once the work type is settled, and only the one(s) that fit.
- **The list is extensible.** To add a guideline, drop a new `standards/<name>.md` written to the common pack shape (`## What it governs` · `## Highest-yield checklist items` · `## Review prompts`) and add a row here. Candidates to add as needs arise: SPIRIT (trial protocols), CHEERS (economic evaluations), SRQR/COREQ (qualitative), CARE (case reports).
- **The pack encodes a specific version/year of each guideline.** Reporting guidelines are revised; treat the pack as a fast-start memory aid and confirm any borderline call against the live published checklist.
