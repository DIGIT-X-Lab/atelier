# Severity Taxonomy
### fatal · major · minor · cosmetic — the decision procedure

*Every finding carries exactly one severity. The whole point of ranking is to tell the author (or editor) where to spend attention — so calibrate honestly. The one question that sorts almost everything: **what happens to the paper's central conclusion if this issue is real?***

---

## fatal

**Test:** The finding, if correct, means the **central claim cannot stand** — the headline result is not trustworthy and no amount of rewriting saves it without new work. Reviewer verdict: reject, or major-revision-at-absolute-best.

**Worked example:**
> **Location:** Methods §2.3 / Table 2. **Problem:** The headline AUC of 0.94 is computed on the same 200 scans used to select the classification threshold; there is no held-out test set. **Why it's fatal:** Tuning on the evaluation data leaks label information into the reported metric — the number that the paper's entire contribution rests on is inflated by an unknown amount and does not estimate real-world performance. **Fix:** Report performance on a pre-registered external or temporally-split test set never touched during development; the current figure becomes, at most, "internal validation."

## major

**Test:** A **real threat to validity** or a **load-bearing gap** that must be fixed before the work is acceptable — but the study is salvageable (with added analysis, data, or honest re-framing). Not fatal, but a reviewer would not accept the paper as-is.

**Worked example:**
> **Location:** Methods §2.1. **Problem:** The model is evaluated only on a random split of a single-center dataset; there is no external validation, yet the Discussion recommends clinical deployment. **Why it's major:** Internal performance doesn't demonstrate generalization across sites/scanners; the deployment claim outruns the evidence. **Fix:** Add external validation, or scope the claim down to "internally validated, generalization untested."

## minor

**Test:** **Weakens but does not threaten** the conclusion. Worth fixing for completeness or clarity; the paper's verdict doesn't turn on it.

**Worked example:**
> **Location:** Table 4. **Problem:** The secondary endpoint is reported as a point estimate with no confidence interval. **Why it's minor:** The primary result is unaffected; the reader just can't gauge the precision of a secondary number. **Fix:** Add the 95% CI.

## cosmetic

**Test:** **Presentation only** — no bearing on validity or interpretation. Typos, formatting, an unlabeled axis that's still guessable from context.

**Worked example:**
> **Location:** Figure 3. **Problem:** The y-axis has no unit label. **Why it's cosmetic:** The quantity is clear from the caption; a reader loses nothing but polish. **Fix:** Label the axis "Dice coefficient (0–1)."

*(Note: a figure that **misrepresents** data — truncated axis exaggerating an effect, a cherry-picked example case — is not cosmetic. It's a major integrity finding. Cosmetic means the presentation is imperfect, not misleading.)*

---

## Calibration guardrails

- **If everything is major, nothing is.** A review where every finding is major/fatal has abandoned calibration and will be discounted wholesale by the author. Force yourself to sort — which two or three findings actually decide the paper's fate? (The machine gate emits a soft warning when ≥3 findings are all major/fatal.)
- **If nothing is major, say so plainly.** A sound paper deserves to hear it. A review of only minor and cosmetic findings should state up front that the work is fundamentally solid — don't manufacture severity to look diligent.
- **Severity is about the conclusion, not the effort to fix.** A one-line fix can resolve a fatal flaw (add the held-out set you already have); a laborious rewrite can be merely cosmetic. Rank by impact on validity, not by how much work the fix is.
- **When you're unsure between two levels, state the hinge.** "Major if the external cohort confirms the drop, minor if it doesn't — this needs checking" is more useful than a false-confident single tag.
