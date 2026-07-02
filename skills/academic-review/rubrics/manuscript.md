# Manuscript Rubric
### The section-by-section rigor bar for a research paper (journal or conference)

*Loaded when `workType === "manuscript"`. Read `rubrics/_principles.md` first — this file is the **where to look**, that file is the **how to judge**. Severity words (`fatal / major / minor / cosmetic`) are defined in [`../assets/severity-taxonomy.md`](../assets/severity-taxonomy.md). Before the Methods pass, resolve the applicable reporting guideline via [`../standards/_index.md`](../standards/_index.md) and load its pack — the pack is where the field-specific teeth live.*

The order below is the order a skeptical reviewer actually reads in: title and abstract set an expectation, and every later section either earns it or fails to. Work the paper the same way — hold the abstract's promise in your head and check each section against it.

---

## Title & Abstract

The abstract is a contract. Check **abstract↔body consistency** as a first-class pass, not a courtesy: every number, every claim of superiority, every "first to" in the abstract must appear — with the same value and the same hedging — in the body. The classic failure is the abstract reporting the best-case number ("AUC 0.94") while the body reveals it came from internal validation, or from the single best of five runs. Over-claiming in the abstract is a **major** finding when the body doesn't support the claim, because it is the part most readers will act on. Also check: does the abstract state the actual design and sample, or hide a small/retrospective study behind confident phrasing?

## Introduction

The introduction's job is to justify that the study needed to exist. Check the **gap claim**: "no prior work has X" is a factual assertion — if you can verify it's false (or the authors ignore an obvious precedent), that's a finding, evidence-anchored to the missing citation. Watch for a gap that's manufactured by defining the problem narrowly enough that only this paper fills it. The introduction should also commit to a hypothesis or objective *before* the Methods; a paper that only reveals what it was testing in the Results is a HARKing smell (flag to the integrity lens).

## Methods

This is where papers live or die, and where most **fatal** findings come from. Work through, in order:

- **Design appropriateness** — does the design answer the question asked? A cross-sectional design cannot support a causal claim; a single-center retrospective cohort cannot support a generalization claim. Mismatch between the design and the conclusion is major-to-fatal.
- **Sample & power** — is there a power calculation, and does it match the reported sample size? An underpowered study reporting a null result as "no effect" is a major finding. Check n per arm/group in the actual tables, not just the text.
- **Statistics validity** — are the tests appropriate to the data type and distribution; is multiplicity handled (many comparisons, no correction → inflated false positives); are the modeling assumptions stated and checked? Report the specific test and where it's misapplied.
- **ML-specific pitfalls** *(load the CLAIM or TRIPOD-AI pack)* — these are the highest-yield checks for a medical-AI paper and the ones authors most often get wrong:
  - **Data leakage** — any path by which test-set information influenced training or model selection. Patient-level leakage (slices from one patient in both train and test), preprocessing fit on the full dataset, feature selection before the split, or hyperparameter/threshold tuning on the evaluation set. Leakage in the headline model is **fatal** — the reported performance is not real.
  - **Train/test contamination & no external validation** — a model evaluated only on a random split of one dataset has shown internal consistency, not generalization. Absence of an external or temporally-split test set is a **major** finding for any paper claiming clinical utility.
  - **Metric mismatch** — accuracy on imbalanced data, AUC where calibration is what matters clinically, Dice reported without a clinically meaningful threshold. The metric must match the claim.
- **Reproducibility** — is code available, are data accessible or the access path stated, are hyperparameters and preprocessing specified well enough to reproduce? Missing availability statements are minor-to-major depending on the venue's policy and the claim.

## Results

Check that the numbers in the text **match** the tables and figures — transcription drift between text and Table 3 is common and undermines trust even when minor. Then check reporting completeness: are **effect sizes and uncertainty** (CIs, not just point estimates) reported, or does the paper lean on p-values alone? A result reported as "significant (p<0.05)" with no effect size tells the reader nothing about whether it matters. Watch for selective reporting — secondary outcomes that appear in Methods but vanish from Results, or subgroup analyses that appear only when they're favorable.

## Discussion

The core question: **does the conclusion follow from the results actually obtained?** The most common failure is a Discussion that argues for the hypothesis the authors wanted rather than the data they got — overreaching from a correlational result to a causal recommendation, or from a single-center result to "should be adopted clinically." Check that **limitations are honest**: a limitations paragraph that lists only trivial caveats while ignoring the study's actual weakness (the one *you* just found in Methods) is itself a finding. Check that claimed **novelty is proportionate** to what was shown — "among the first" is defensible; "we prove" rarely is.

## Figures & Tables

Every figure and table should be **self-contained** (legible caption, defined abbreviations, stated n) and **legible** (readable axes, units on every axis, no undefined color coding). Check that the **chart type fits the data** — a bar chart hiding a distribution, a dual axis engineered to imply a correlation, a truncated y-axis exaggerating an effect. For figure craft specifics, point the author to `research-visuals` conventions rather than re-deriving them here. Most figure findings are minor-to-cosmetic — but a figure that misrepresents the data (truncated axis, cherry-picked example case) is a major integrity finding, not a cosmetic one.

## References

Spot-check that references are **real and correctly used** — that a citation supporting a specific claim actually says what it's cited for. This is the literature lens; do not assert a citation is fabricated or misused without evidence, and flag `[VERIFY]` when you cannot check in-context. Watch for citation padding (self-citation stacks, irrelevant citations inflating the reference count) and for the load-bearing claim cited to a preprint, a blog, or nothing at all.

---

## Reviewer reject triggers for manuscripts

A shortlist of findings that, alone, justify a **reject** or major-revision recommendation — the things a referee kills a paper for:

- **Test-set leakage / no held-out evaluation** in the headline result — the central performance claim is not trustworthy.
- **Design cannot support the central claim** — e.g., causal language on a cross-sectional or uncontrolled design.
- **No external or independent validation** for a paper claiming clinical/real-world utility.
- **Abstract materially overstates the body** — the reported result is not what the study actually shows.
- **Missing ethics/consent/IRB statement** for human- or animal-subjects work (integrity lens).
- **Irreproducible core method** — insufficient detail, no code/data, and results that cannot be checked.
- **Conclusion unsupported by the results** — the Discussion argues for something the data do not show.

When one of these is present, say so plainly and rank it `fatal` or `major`; when none is, say *that* plainly too — a manuscript with only minor and cosmetic findings deserves to hear it's fundamentally sound.
