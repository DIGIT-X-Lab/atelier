# Referee Report Template
### The reviewer-mode output skeleton (a submittable peer-review report)

*Used when `mode === "reviewer"`. This is the shape editors expect. The sections map directly onto the findings JSON (`../assets/review-findings.schema.json`): **Major/Minor points** come from `findings[]`, the recommendation from `recommendation` + `recommendationRationale`, the author-facing list from `pointsToAuthors`, and the editor section from `notesToEditor`. Keep the author-facing report and the confidential editor note strictly separate.*

---

## Summary of the work

*2–4 neutral sentences.* Restate what the paper set out to do and what it reports — in your own words, without judgment yet. This shows the authors and editor you read and understood the work, and it anchors everything that follows. Getting the summary demonstrably right earns the authors' trust in the critique.

## Overall assessment & recommendation

*One paragraph of assessment, then a clear recommendation.* State the paper's genuine strengths first (calibrated, not flattering), then the central concerns that drive your recommendation. End with one of:

- **Accept** — publishable as is (rare).
- **Minor revision** — sound; specific fixable points, no new experiments.
- **Major revision** — a real threat to validity or a load-bearing gap that must be addressed, but the work is salvageable.
- **Reject** — a fatal flaw, or the contribution doesn't clear the bar, and no revision within scope fixes it.

Give the **rationale** in one or two sentences — the recommendation should follow visibly from the major points below, never arrive as a surprise verdict.

## Major points

*Numbered. Each located and evidence-anchored.* The findings that drive the recommendation — threats to validity, unsupported claims, missing controls or validation. For each: **where** it is, **what** the problem is, **why** it matters. You needn't draft the fix (author mode owes that; referee mode owes a diagnosis clear enough to act on), but a suggested direction is a courtesy. Order by importance, not by page number.

> 1. **(Methods, §2.3)** The headline AUC is computed on the threshold-tuning data; no held-out test set. As reported, the primary result is not a valid estimate of performance. The authors should evaluate on independent data before this claim can stand.

## Minor points

*Numbered.* Smaller issues — missing CIs, unclear figures, incomplete reporting items, presentation. Kept separate from the major points so the authors can triage. Don't pad this list to look thorough.

## Confidential comments to the editor

*Not shown to the authors.* Your candid read on the paper's suitability and your confidence: how sure you are of the major concerns, whether the flaws look fixable, any conflict of interest or limits to your expertise on part of the work, and any integrity concern you'd raise privately before stating publicly. If you flagged anything `[VERIFY]` that you couldn't confirm, say so here rather than asserting it to the authors.

---

*Tone throughout: critique the work, not the authors (see `../rubrics/_principles.md` §6). Every claim you make faces the same evidence bar you're holding the authors to.*
