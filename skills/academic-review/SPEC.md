# academic-review — design spec

**Status:** approved design, pre-implementation
**Date:** 2026-07-02
**Author:** DIGIT-X Lab (via Claude Code brainstorming)
**Sibling skills:** `grant-proposals` (builds research writing), `research-visuals` (builds figures).
This skill **stress-tests and improves** finished academic writing.

---

## 1. Purpose

A reviewing assistant for **any academic work** — journal/conference manuscripts, theses &
dissertations, and short forms (abstracts, reviews, case reports, systematic reviews) — with a
**medical / clinical + ML backbone** (the lab's domain). It reviews from two perspectives and
produces a submission-grade critique that is **located, evidence-anchored, honestly calibrated, and
constructive** — and in author mode it **actively improves the work**, not just lists its faults.

It is the critique counterpart to `grant-proposals`: **agency/journal-standard-driven**, integrity-first,
and **not done until an automated gate on the review's own quality passes.**

## 2. Core principle (integrity spine — read first)

**The work is the user's; every criticism must be *earned from the text*.**

- **Never fabricate a flaw.** Do not invent a problem that isn't in the manuscript. Do not claim a
  citation is fake/misused or a statistic is invalid **without showing why from the text** (a quote +
  location) — or, if unverifiable in-context, flagging it as **`[VERIFY: …]`** rather than asserting it.
- **Every finding is located** (section / page / line / figure) and **evidence-anchored** (a quote or a
  specific mechanism), never vague.
- **Calibrate honestly.** Distinguish **fatal / major / minor / cosmetic**. No nitpick inflation to look
  thorough; no praise-padding to be nice. A fair review says what is genuinely wrong and what is fine.
- **Improve, don't just judge.** In author mode every Major finding ships with a concrete fix or a
  rewrite. The goal is a better paper, not a longer complaint.
- **Same evidence bar on the reviewer's own claims** (mirrors `grant-proposals` self-validation). A claim
  *the reviewer* makes ("this design has data leakage", "this contradicts prior work") must be justified
  from the text, verified via literature, or flagged as a hypothesis to check — never stated as fact from
  reviewer intuition alone.
- **Privacy.** When literature verification is used, send **only neutral published-literature search
  terms** to external services — never the user's unpublished manuscript text wholesale.

## 3. Modes (inferred from context, not a cold menu)

| Mode | Trigger | Output |
|---|---|---|
| **Author / pre-submission** *(default when the user wrote it)* | User supplies their own draft, asks "review my paper/thesis" | Severity-ranked findings + **revision plan** (impact/effort-ordered) + **inline rewrites**. Harsh-but-constructive. *"What would a reviewer kill this for — and how do we fix it?"* |
| **Reviewer / referee** | User was **asked to peer-review** someone else's manuscript | **Submittable referee report**: summary of the work, recommendation (accept / minor / major / reject), numbered points to authors, confidential notes to editor. |
| **Examiner / committee** | Thesis defense context | Chapter-by-chapter rigor pass + a set of likely **viva/defense questions**; does it meet the degree bar? |
| **Deep-panel** *(opt-in toggle, layered on any mode)* | High-stakes work; user requests a thorough/panel review | Multi-agent specialist fan-out + **adversarial verification** of each finding before it survives. |

Mode is **inferred** and confirmed in passing (like grant-proposals' draft/critique split); only asked
outright when genuinely ambiguous.

## 4. Workflow (value-first · ingest-first · flag-and-continue)

1. **Ingest** — open the work in whatever format the user provides (PDF, Google Doc, LaTeX/Markdown/Word,
   pasted text — anything Claude can open). Detect: **work type** (manuscript / thesis / short-form),
   **field**, applicable **reporting standard(s)**, and **mode**.
2. **Map** — build a quick structural map: the central thesis/claim, section inventory, figures/tables,
   the key statistical claims. This anchors every later finding to a location.
3. **Four review lenses** (the teeth):
   - **Rigor & methods** — study design, statistical validity, data-leakage / validation pitfalls (esp.
     ML), over-claiming vs. evidence, reproducibility, **reporting-guideline compliance** (load the
     matching `standards/*` pack).
   - **Argument & clarity** — does the conclusion follow from the results? Narrative coherence,
     structure, framing, readability, figure/table quality, **abstract↔body consistency**.
   - **Integrity & ethics** — undisclosed limitations, p-hacking / HARKing smells, missing
     ethics/consent/data-availability statements, salami-slicing, image-manipulation red flags, citation
     padding.
   - **Literature verification** *(opt-in, value-first)* — via PubMed/Paperclip: do cited claims hold?
     Are references real and correctly used? Is the novelty/gap claim actually true? Heavier; offered as
     a deeper pass, not forced up front.
4. **Deep-panel** *(if toggled)* — fan out specialist reviewers (methods-stats · clarity-structure ·
   integrity-ethics · literature-verify), each returning structured findings; then an **adversarial
   verify** stage where skeptics try to *refute* each finding, so plausible-but-wrong criticism dies
   before it reaches the user. Survivors are ranked.
5. **Synthesize** — merge/dedupe into **severity-ranked findings**; each carries *location + why-it-matters
   + concrete fix*.
6. **Deliver** — in the requested shape: findings list, referee report, inline annotations (into a marked
   copy or Google Doc), and/or revision plan. In author mode, **actively improve the article** with
   rewrites and strengthening suggestions.
7. **Gate** — run `verify.mjs` + a self-review pass. **Not done until it passes.**

## 5. File structure

```
skills/academic-review/
  SKILL.md                  # lean orchestrator (frontmatter + workflow + hard rules)
  SPEC.md                   # this design, shipped with the skill
  rubrics/
    _principles.md          # what makes a review GOOD: located, calibrated, constructive, honest,
                            #   evidence-anchored; the agency-agnostic craft of reviewing
    manuscript.md           # rigor bar + section-by-section expectations for research papers
    thesis.md               # long-form: narrative arc, chapter coherence, degree-level bar, defense
    short-form.md           # abstracts / reviews / case reports / systematic reviews (lighter passes)
  standards/                # reporting-guideline cheat-sheets, loaded just-in-time by work type/field
    _index.md               # decision table: work-type + field → which standard(s) apply
    claim.md                # medical-imaging AI
    tripod-ai.md            # clinical prediction models (ML)
    strobe.md               # observational studies
    consort.md              # RCTs
    stard.md                # diagnostic accuracy
    prisma.md               # systematic reviews / meta-analyses
    arrive.md               # animal research
    (extensible — one file per guideline)
  assets/
    intake.md               # how to detect type / mode / field / applicable standard
    severity-taxonomy.md    # fatal / major / minor / cosmetic — definitions + worked examples
    referee-report-template.md   # journal referee format for reviewer mode
  scripts/
    verify.mjs              # machine gate on the review's OWN quality
```

Consistent with house convention: **lean `SKILL.md`, heavy reference in sibling files, loaded
just-in-time.**

## 6. The machine gate (`verify.mjs`)

Validates the **review**, not the paper. Given the produced review (structured findings), it fails if:

- any finding lacks a **location**, a **severity** tag (`fatal|major|minor|cosmetic`), or a
  **rationale**;
- author mode: any **Major/fatal** finding lacks a **concrete fix**;
- a finding is **vague** — heuristic ban on "unclear / weak / could be better / needs work" with no
  specifics or location;
- reviewer mode: **recommendation** missing or not justified; no **points-to-authors** section;
- an **integrity/verification** finding ("citation is fake/misused", "stat is invalid") carries **no
  evidence** (quote/location) **and no `[VERIFY: …]` flag** — i.e., a bare assertion.

**The skill is not done until the gate passes** — the same "machine gate" contract as `grant-proposals`
and `research-visuals`.

## 7. Deep-panel (Approach C) — mechanics

Opt-in, triggered for high-stakes work or on explicit request. Implemented as a multi-agent harness:

- **Fan-out:** one specialist agent per lens (methods-stats, clarity-structure, integrity-ethics,
  literature-verify), each returning structured findings for its lens only.
- **Adversarial verify:** each candidate finding is handed to independent skeptic(s) prompted to
  **refute** it (default to "not a real problem" if uncertain). A finding survives only if it isn't
  refuted. This kills confident-but-wrong criticism.
- **Synthesize:** survivors deduped and severity-ranked; feed the same deliver + gate steps.

Default (non-panel) mode runs the four lenses in a single context — cheaper, still gated. Panel is the
thoroughness dial, not the baseline.

## 8. Integrity / hard rules (non-negotiable)

1. **Never fabricate a flaw** or invent a problem not present in the text.
2. **No bare accusations.** "Citation fake/misused" or "stat invalid" needs evidence or a `[VERIFY]` flag.
3. **Locate everything.** Every finding points to a section/page/line/figure.
4. **Calibrate fairly.** Fatal/major/minor/cosmetic, honestly assigned — no inflation, no padding.
5. **Improve, don't just judge** (author mode): every major finding carries a fix.
6. **Same evidence bar on the reviewer's own claims** as on the author's.
7. **Privacy:** only neutral literature search terms leave the machine; the unpublished manuscript does not.
8. **Gate is law:** not done until `verify.mjs` + self-review pass.

## 9. Out of scope (YAGNI)

- Copy-editing / grammar-only passes (Grammarly territory) — the skill flags clarity at the argument
  level, not comma-level line editing, unless asked.
- Grant proposals — already covered by `grant-proposals` (this skill defers to it for funding docs).
- Plagiarism-detection scoring — the skill flags integrity *smells* it can see, but is not a similarity
  scanner.
- Auto-submitting the referee report anywhere — it produces the report; the human sends it.

## 10. Standing task on completion

Per `CONTRIBUTING.md`: update **`README.md`** — add an `academic-review` row to the Skills table with a
status, and update the repo's concept/positioning to include reviewing alongside building.
