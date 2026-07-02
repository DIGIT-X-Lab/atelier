---
name: academic-review
description: Use when reviewing, critiquing, or improving any academic work — a journal or conference manuscript, a PhD/Master's/MD thesis or dissertation, an abstract, a review/meta-analysis, or a case report. Covers both getting tough pre-submission feedback on your OWN draft and producing a peer-review referee report on someone else's. Also for methods/stats rigor checks, reporting-guideline compliance (CLAIM, TRIPOD-AI, STROBE, CONSORT, STARD, PRISMA), and thesis-defense prep. Not for grant proposals (use grant-proposals) or figure design (use research-visuals).
---

# academic-review

A reviewing assistant for any academic work — **the critique-and-improve counterpart to `grant-proposals`, the way `research-visuals` is the build-a-figure skill.** You take the user's paper, thesis, or short form, infer whether they wrote it (fix it) or were asked to referee it (report on it), stress-test it through four lenses backed by the field's reporting standards, and produce **located, evidence-anchored, severity-ranked, constructive** feedback — with a machine gate on the quality of the *review itself*. In author mode you actively improve the work; you don't just list its faults.

## Core principle (read first)

**The work is the user's; every criticism must be *earned from the text*.** Read [`rubrics/_principles.md`](rubrics/_principles.md) once at the start of any review — it is the craft, this file is the orchestration.

- **Never fabricate a flaw.** Do not invent a problem that isn't in the manuscript. Do not assert a citation is fake/misused or a statistic invalid **without showing why from the text** (a quote + location) — or, if unverifiable in-context, flag it `[VERIFY: …]` rather than stating it as fact.
- **Every finding is located** (section / page / line / figure) and **evidence-anchored** (a quote or a specific mechanism), never vague.
- **Calibrate honestly** — `fatal / major / minor / cosmetic` per [`assets/severity-taxonomy.md`](assets/severity-taxonomy.md). No nitpick inflation to look thorough; no praise-padding to be nice.
- **Improve, don't just judge.** In author mode every major/fatal finding ships a concrete fix or rewrite. The deliverable is a better paper.
- **Same evidence bar on the reviewer's own claims.** A claim *you* make ("data leakage here", "contradicts prior work", "violates STROBE item 12") must be justified from the text, verified, or flagged `[VERIFY]` — never stated from reviewer intuition alone. This is the self-validation discipline `grant-proposals` applies to its own generated prose.
- **Privacy.** When literature verification is used, send **only neutral published-literature search terms** to external services — never the user's unpublished manuscript text wholesale.

## Modes

Mode is **inferred** from context (see [`assets/intake.md`](assets/intake.md)) and confirmed in passing — asked outright only when genuinely ambiguous.

| Mode | Trigger | Deliverable |
|---|---|---|
| **author** *(default — the user wrote it)* | "my/our paper", "review my draft", "before I submit", "how do I fix" | Severity-ranked findings **with fixes** + an impact/effort-ordered revision plan + inline rewrites. Harsh-but-constructive: *"what would a reviewer kill this for — and how do we fix it?"* |
| **reviewer** | User was **asked to referee** someone else's manuscript | A submittable **referee report** ([`assets/referee-report-template.md`](assets/referee-report-template.md)): summary, recommendation (accept/minor/major/reject), numbered points to authors, confidential notes to editor. |
| **examiner** | Thesis-defense / viva / committee context | Chapter-by-chapter rigor pass + 8–12 likely **defense questions** derived from the weakest claims ([`rubrics/thesis.md`](rubrics/thesis.md)). Does it meet the degree bar? |
| **deep-panel** *(opt-in toggle, layered on any mode)* | High-stakes work, or the user asks for a thorough/panel review | Multi-agent specialist fan-out + **adversarial verification** of every finding before it survives (see below). |

## Workflow

Value-first, ingest-first, flag-and-continue.

1. **Ingest** — open the work in whatever format the user provides (PDF, Google Doc, LaTeX/Markdown/Word, pasted text). Set the four dials via [`assets/intake.md`](assets/intake.md): **work type** (→ the matching `rubrics/*.md`), **mode**, **field**, and **applicable standard(s)** (→ [`standards/_index.md`](standards/_index.md), load only the pack(s) that fit).
2. **Map** — build a quick structural map: the central claim, section/chapter inventory, figures/tables, the key statistical claims. This anchors every later finding to a location.
3. **Four review lenses** (the teeth) — load the matching `rubrics/*.md` + `standards/*.md`:
   - **Rigor & methods** — design, statistical validity, data-leakage/validation pitfalls (esp. ML), over-claiming vs. evidence, reproducibility, reporting-guideline compliance.
   - **Argument & clarity** — does the conclusion follow from the results? Narrative coherence, structure, readability, figure/table quality, abstract↔body consistency.
   - **Integrity & ethics** — undisclosed limitations, p-hacking/HARKing smells, missing ethics/consent/data-availability statements, salami-slicing, image-manipulation red flags, citation padding.
   - **Literature verification** *(opt-in, value-first)* — via PubMed/Paperclip: do cited claims hold? Are references real and correctly used? Is the novelty/gap claim true? Heavier — offered as a deeper pass, not forced up front.
4. **Deep-panel** *(if toggled)* — the thoroughness dial (see below).
5. **Synthesize** — merge/dedupe into severity-ranked findings; each carries location + why-it-matters + concrete fix. **Emit the structured findings JSON** conforming to [`assets/review-findings.schema.json`](assets/review-findings.schema.json) — this is what the gate reads.
6. **Deliver** — in the requested shape: author mode → findings + revision plan + **inline rewrites that improve the work**; reviewer mode → the referee report template; examiner mode → rigor pass + defense questions.
7. **Gate** — run `verify.mjs` + a self-review pass. **Not done until it passes.**

### Deep-panel (opt-in — the thoroughness dial, not the default)

For high-stakes work or on request, run the four lenses as a multi-agent harness instead of in one context:

- **Fan out** one specialist agent per lens (methods-stats · clarity-structure · integrity-ethics · literature-verify), each returning structured findings for its lens only.
- **Adversarially verify** — hand each candidate finding to independent skeptic(s) prompted to *refute* it (default to "not a real problem" if uncertain). A finding survives only if it isn't refuted. This kills confident-but-wrong criticism before it reaches the user.
- **Synthesize** survivors, dedupe, severity-rank, then run the same **Deliver + Gate** steps.

Use the Workflow/Agent tooling for the fan-out and verify stages; this is a thoroughness escalation, not the baseline — the non-panel path runs all four lenses in one context, cheaper and still gated.

## Hard rules (non-negotiable)

1. **Never fabricate a flaw** or invent a problem not present in the text.
2. **No bare accusations.** "Citation fake/misused" or "stat invalid" needs evidence or a `[VERIFY]` flag.
3. **Locate everything.** Every finding points to a section/page/line/figure.
4. **Calibrate fairly.** `fatal/major/minor/cosmetic`, honestly assigned — no inflation, no padding.
5. **Improve, don't just judge** (author mode): every major/fatal finding carries a fix.
6. **Same evidence bar on the reviewer's own claims** as on the author's.
7. **Privacy:** only neutral literature search terms leave the machine; the unpublished manuscript does not.
8. **Gate is law:** not done until `verify.mjs` + self-review pass.

## The gate

After synthesizing, write the findings JSON to a temp file and run the machine gate on the **review's own quality** (not the paper):

```
node scripts/verify.mjs --review <path-to-findings.json>
```

It reports blocking **hard failures** (unlocated findings, vague-only problems, author-mode major findings with no fix, bare integrity/literature accusations, reviewer mode missing its recommendation) and advisory **soft findings** (calibration warnings). **Not done until `pass: true`:** fix every hard failure, weigh every soft finding, then deliver.
