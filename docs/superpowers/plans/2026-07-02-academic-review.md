# academic-review Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `academic-review` skill — a reviewing/critique assistant for any academic work (manuscripts, theses, short forms) that produces located, evidence-anchored, severity-ranked, constructive feedback and passes a machine gate on its own review quality.

**Architecture:** A lean `SKILL.md` orchestrator plus just-in-time sibling reference files (rubrics, reporting-standard packs, assets). The skill emits a **structured findings JSON** alongside the human-readable review; a dependency-free Node ESM gate (`scripts/verify.mjs`) validates that JSON. Two inferred modes (author / reviewer, plus an examiner flavor) and an opt-in multi-agent "deep-panel" harness for high-stakes work. This mirrors the proven `grant-proposals` architecture in the same repo.

**Tech Stack:** Markdown (skill instructions + reference), Node.js ESM (`verify.mjs`, no third-party deps — matches `skills/grant-proposals/scripts/verify.mjs`), `node:test` + `node:assert` for the gate's own tests. Optional Workflow tool for the deep-panel.

## Global Constraints

- **SKILL.md frontmatter** = `name` + `description` only; `description` states **triggering conditions**, not a workflow summary (repo convention, see `CONTRIBUTING.md`).
- **Lean SKILL.md, heavy reference in siblings, loaded just-in-time** (repo convention).
- **Integrity spine (non-negotiable):** never fabricate a flaw; every finding is **located** + **evidence-anchored**; accusations ("citation fake", "stat invalid") need evidence or a `[VERIFY]` flag; the reviewer's own claims face the **same evidence bar** as the author's; only neutral literature search terms leave the machine.
- **`verify.mjs` is dependency-free Node ESM.** No npm install. Output JSON `{pass, hardFailures[], softFindings[]}`; exit 0 pass / 1 hard failure / 2 usage error — same contract as the grant gate.
- **Severity vocabulary is fixed:** `fatal | major | minor | cosmetic`.
- **Defer grant docs** to the `grant-proposals` skill; **defer figure critique specifics** to `research-visuals` conventions where relevant.
- **Standing rule:** the skill is not complete until `README.md` is updated (concept/positioning + Skills table row) per `CONTRIBUTING.md`.
- All paths below are relative to the repo root `/Users/nutellabear/Documents/00-Code/atelier`.

---

## File Structure

```
skills/academic-review/
  SKILL.md                       # lean orchestrator (Tasks 1 + 9)
  SPEC.md                        # shipped copy of the design spec (Task 10)
  rubrics/
    _principles.md               # craft of a GOOD review (Task 2)
    manuscript.md                # research-paper rigor bar (Task 3)
    thesis.md                    # long-form / degree bar / defense (Task 4)
    short-form.md                # abstracts / reviews / case reports (Task 4)
  standards/
    _index.md                    # work-type + field -> guideline routing (Task 5)
    claim.md tripod-ai.md strobe.md consort.md stard.md prisma.md arrive.md   # (Task 6)
  assets/
    review-findings.schema.json  # the structured-findings contract (Task 1)
    severity-taxonomy.md         # fatal/major/minor/cosmetic + examples (Task 7)
    intake.md                    # detect type / mode / field / standard (Task 7)
    referee-report-template.md   # reviewer-mode output format (Task 7)
  scripts/
    verify.mjs                   # machine gate on the review's own quality (Task 8)
    verify.test.mjs              # gate's own tests (Task 8)
    fixtures/                     # good/bad review JSON fixtures (Task 8)
```

---

### Task 1: Scaffold the skill + define the findings contract

Creates the skill directory, the `SKILL.md` frontmatter + skeleton, and the **structured-findings JSON schema** every later task depends on.

**Files:**
- Create: `skills/academic-review/SKILL.md`
- Create: `skills/academic-review/assets/review-findings.schema.json`

**Interfaces:**
- Consumes: nothing (first task).
- Produces:
  - `SKILL.md` with valid frontmatter (`name: academic-review`, a triggering-condition `description`).
  - `review-findings.schema.json` — the contract the skill emits and `verify.mjs` reads. Fields:
    - top-level: `mode` (`"author"|"reviewer"|"examiner"`), `workType` (`"manuscript"|"thesis"|"short-form"`), `standardsApplied` (string[]), `findings` (Finding[]), and for reviewer mode `recommendation` (`"accept"|"minor"|"major"|"reject"`), `recommendationRationale` (string), `pointsToAuthors` (string[]), `notesToEditor` (string, optional).
    - `Finding`: `id` (string), `severity` (`"fatal"|"major"|"minor"|"cosmetic"`), `lens` (`"rigor"|"clarity"|"integrity"|"literature"`), `location` (string, required non-empty), `problem` (string, required), `why` (string, required), `fix` (string, required when `mode==="author"` and `severity` in {fatal,major}), `evidence` (string, required when `lens` in {integrity,literature} unless `verifyFlag`), `verifyFlag` (boolean, optional).

- [ ] **Step 1: Create the schema file**

`skills/academic-review/assets/review-findings.schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "academic-review findings",
  "type": "object",
  "required": ["mode", "workType", "findings"],
  "properties": {
    "mode": { "enum": ["author", "reviewer", "examiner"] },
    "workType": { "enum": ["manuscript", "thesis", "short-form"] },
    "standardsApplied": { "type": "array", "items": { "type": "string" } },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "severity", "lens", "location", "problem", "why"],
        "properties": {
          "id": { "type": "string" },
          "severity": { "enum": ["fatal", "major", "minor", "cosmetic"] },
          "lens": { "enum": ["rigor", "clarity", "integrity", "literature"] },
          "location": { "type": "string", "minLength": 1 },
          "problem": { "type": "string", "minLength": 1 },
          "why": { "type": "string", "minLength": 1 },
          "fix": { "type": "string" },
          "evidence": { "type": "string" },
          "verifyFlag": { "type": "boolean" }
        }
      }
    },
    "recommendation": { "enum": ["accept", "minor", "major", "reject"] },
    "recommendationRationale": { "type": "string" },
    "pointsToAuthors": { "type": "array", "items": { "type": "string" } },
    "notesToEditor": { "type": "string" }
  }
}
```

- [ ] **Step 2: Create SKILL.md frontmatter + skeleton**

`skills/academic-review/SKILL.md` (body sections are filled in Task 9 — this step establishes frontmatter + section headers only so the file is valid and discoverable):

```markdown
---
name: academic-review
description: Use when reviewing, critiquing, or improving any academic work — a journal or conference manuscript, a PhD/Master's/MD thesis or dissertation, an abstract, a review/meta-analysis, or a case report. Covers both getting tough pre-submission feedback on your OWN draft and producing a peer-review referee report on someone else's. Also for methods/stats rigor checks, reporting-guideline compliance (CLAIM, TRIPOD-AI, STROBE, CONSORT, STARD, PRISMA), and thesis-defense prep. Not for grant proposals (use grant-proposals) or figure design (use research-visuals).
---

# academic-review

<!-- Task 9 fills: one-paragraph positioning, core principle, modes, workflow, standards routing, deep-panel, hard rules, gate. -->

## Core principle (read first)

<!-- Task 9 -->

## Modes

<!-- Task 9 -->

## Workflow

<!-- Task 9 -->

## Hard rules (non-negotiable)

<!-- Task 9 -->

## The gate

<!-- Task 9 -->
```

- [ ] **Step 3: Verify the skill is discoverable and JSON is valid**

Run:
```bash
test -f skills/academic-review/SKILL.md && \
head -3 skills/academic-review/SKILL.md | grep -q '^name: academic-review' && \
node -e "JSON.parse(require('fs').readFileSync('skills/academic-review/assets/review-findings.schema.json','utf8')); console.log('schema OK')"
```
Expected: prints `schema OK` and exits 0 (frontmatter name line matched, JSON parses).

- [ ] **Step 4: Commit**

```bash
git add skills/academic-review/SKILL.md skills/academic-review/assets/review-findings.schema.json
git commit -m "feat(academic-review): scaffold skill + findings-JSON contract"
```

---

### Task 2: Write the review-craft principles (`rubrics/_principles.md`)

The agency-agnostic "what makes a review GOOD" file — the counterpart to grant-proposals' `best-practices/_principles.md`.

**Files:**
- Create: `skills/academic-review/rubrics/_principles.md`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: prose reference loaded by SKILL.md at review time. Must define, with a heading each: **located**, **evidence-anchored**, **honestly calibrated** (fatal/major/minor/cosmetic, no inflation/padding), **constructive** (every major finding carries a fix), **same-evidence-bar-on-the-reviewer**, and **fair tone** (critique the work, not the author).

- [ ] **Step 1: Write the file**

Content outline (write full prose, ~400–700 words, no placeholders):
1. **The one idea:** a review's job is to make the work *better and its verdict trustworthy* — not to display the reviewer's cleverness. Signal:noise > volume.
2. **Located.** Every finding names section/page/line/figure. An unlocated criticism is unactionable and usually unfalsifiable.
3. **Evidence-anchored.** Quote or point to the specific text/number. "Earned from the text," never from vibe.
4. **Honestly calibrated.** Define fatal/major/minor/cosmetic (defer detail to `assets/severity-taxonomy.md`). No nitpick inflation to look thorough; no praise-padding to be nice.
5. **Constructive & improving.** In author mode, every major finding ships a concrete fix/rewrite. The deliverable is a better paper.
6. **Same bar on the reviewer.** A claim the reviewer makes ("data leakage here", "contradicts prior work") must be justified from the text, verified, or flagged `[VERIFY]`. No confident-but-wrong criticism.
7. **Fair tone.** Attack the argument, not the person; acknowledge genuine strengths honestly (calibration, not flattery).

- [ ] **Step 2: Verify required sections present**

Run:
```bash
for kw in Located Evidence Calibrat Constructive "same" tone; do \
  grep -iq "$kw" skills/academic-review/rubrics/_principles.md || echo "MISSING: $kw"; done; \
echo "check done"
```
Expected: prints only `check done` (no `MISSING:` lines).

- [ ] **Step 3: Commit**

```bash
git add skills/academic-review/rubrics/_principles.md
git commit -m "feat(academic-review): review-craft principles"
```

---

### Task 3: Write the manuscript rubric (`rubrics/manuscript.md`)

**Files:**
- Create: `skills/academic-review/rubrics/manuscript.md`

**Interfaces:**
- Consumes: references `assets/severity-taxonomy.md` and `standards/_index.md` by name (created in Tasks 7/5) — link by relative path; do not inline their content.
- Produces: the per-section rigor bar for research papers, loaded when `workType==="manuscript"`.

- [ ] **Step 1: Write the file**

Full prose covering, section by section (Title/Abstract, Introduction, Methods, Results, Discussion, Figures/Tables, References):
- **Abstract↔body consistency** check; over-claiming in the abstract.
- **Methods:** design appropriateness, sample/power, statistics validity, **ML-specific pitfalls** (data leakage, train/test contamination, no external validation, metric mismatch), reproducibility (code/data availability).
- **Results:** do numbers in text match tables/figures; are effect sizes + uncertainty reported, not just p-values.
- **Discussion:** does the conclusion follow from the results; are limitations honest; is novelty claimed proportionate.
- **Figures/Tables:** legibility, self-containedness, appropriate chart type (point to `research-visuals` conventions).
- A closing **"reviewer reject triggers for manuscripts"** shortlist.

- [ ] **Step 2: Verify**

Run:
```bash
for kw in Abstract Methods leakage Results Discussion Figures reject; do \
  grep -iq "$kw" skills/academic-review/rubrics/manuscript.md || echo "MISSING: $kw"; done; echo "check done"
```
Expected: only `check done`.

- [ ] **Step 3: Commit**

```bash
git add skills/academic-review/rubrics/manuscript.md
git commit -m "feat(academic-review): manuscript rubric"
```

---

### Task 4: Write the thesis + short-form rubrics

Two rubric variants that share a task because they are parallel deliverables.

**Files:**
- Create: `skills/academic-review/rubrics/thesis.md`
- Create: `skills/academic-review/rubrics/short-form.md`

**Interfaces:**
- Consumes: links `assets/severity-taxonomy.md` by path.
- Produces: `thesis.md` loaded when `workType==="thesis"`; `short-form.md` when `workType==="short-form"`.

- [ ] **Step 1: Write `thesis.md`**

Full prose: long-form narrative arc & chapter coherence; does each chapter earn its place; consistency of notation/terminology across chapters; the **degree-level bar** (is the contribution sufficient for the degree); literature-review completeness; **defense/viva readiness** — include a subsection "generate likely examiner questions" (how to derive 8–12 probing questions from the weakest claims). Note examiner mode reuses this file.

- [ ] **Step 2: Write `short-form.md`**

Full prose: lighter passes for abstracts (structure, over-claim, is the take-home clear), narrative/systematic reviews (search reproducibility, **PRISMA** pointer, bias), case reports (CARE pointer, generalizability caveats). Explicitly scale effort down vs. manuscript/thesis.

- [ ] **Step 3: Verify**

Run:
```bash
for kw in chapter degree viva defense; do grep -iq "$kw" skills/academic-review/rubrics/thesis.md || echo "MISSING thesis: $kw"; done; \
for kw in abstract PRISMA case; do grep -iq "$kw" skills/academic-review/rubrics/short-form.md || echo "MISSING short: $kw"; done; \
echo "check done"
```
Expected: only `check done`.

- [ ] **Step 4: Commit**

```bash
git add skills/academic-review/rubrics/thesis.md skills/academic-review/rubrics/short-form.md
git commit -m "feat(academic-review): thesis + short-form rubrics"
```

---

### Task 5: Write the standards routing index (`standards/_index.md`)

**Files:**
- Create: `skills/academic-review/standards/_index.md`

**Interfaces:**
- Consumes: nothing.
- Produces: a decision table mapping (study type / field) → which `standards/*.md` pack(s) to load. Referenced by SKILL.md workflow step "Ingest" and by `rubrics/manuscript.md`.

- [ ] **Step 1: Write the routing table**

A markdown table with columns *Work / study type* · *Load pack(s)* · *One-line why*. Rows at minimum:
- Medical-imaging AI / CAD model → `claim.md`
- Clinical prediction / prognostic ML model → `tripod-ai.md`
- Observational study (cohort/case-control/cross-sectional) → `strobe.md`
- Randomized controlled trial → `consort.md`
- Diagnostic accuracy study → `stard.md`
- Systematic review / meta-analysis → `prisma.md`
- Animal research → `arrive.md`
- *(fallback)* none matches → apply `rubrics/manuscript.md` general rigor only; state that no specific reporting guideline was matched.

Include a one-line note: packs are **loaded just-in-time**, and the list is **extensible** (drop a new `standards/<name>.md` + add a row).

- [ ] **Step 2: Verify all referenced packs are listed**

Run:
```bash
for p in claim tripod-ai strobe consort stard prisma arrive; do \
  grep -q "$p" skills/academic-review/standards/_index.md || echo "MISSING route: $p"; done; echo "check done"
```
Expected: only `check done`.

- [ ] **Step 3: Commit**

```bash
git add skills/academic-review/standards/_index.md
git commit -m "feat(academic-review): reporting-standard routing index"
```

---

### Task 6: Write the reporting-standard packs

Seven small cheat-sheets. Each is loaded only when the routing index selects it.

**Files:**
- Create: `skills/academic-review/standards/claim.md`
- Create: `skills/academic-review/standards/tripod-ai.md`
- Create: `skills/academic-review/standards/strobe.md`
- Create: `skills/academic-review/standards/consort.md`
- Create: `skills/academic-review/standards/stard.md`
- Create: `skills/academic-review/standards/prisma.md`
- Create: `skills/academic-review/standards/arrive.md`

**Interfaces:**
- Consumes: nothing.
- Produces: each pack loaded by name from `standards/_index.md`.

- [ ] **Step 1: Write each pack to a common shape**

Each file (~150–300 words) MUST contain these headings:
- `# <GUIDELINE> — <full name>` (state the version/year you encode + a "confirm against the live checklist" note, mirroring grant-proposals' recency flag).
- `## What it governs` — which studies this applies to.
- `## Highest-yield checklist items` — the 6–10 items reviewers most often find violated (e.g., for CLAIM: data provenance, train/validation/test split integrity, external test set, ground-truth definition, model transparency; for TRIPOD-AI: predictors defined a priori, calibration reported not just discrimination, sample-size/EPV, handling of missing data; for STROBE: confounding control, selection bias, funnel of participants; for CONSORT: randomization + allocation concealment + flow diagram; for STARD: reference standard, spectrum bias, indeterminate results; for PRISMA: search reproducibility, PRISMA flow diagram, risk-of-bias assessment; for ARRIVE: randomization/blinding, sample size, ethics).
- `## Review prompts` — 3–5 concrete questions the reviewer asks the manuscript against this guideline.

- [ ] **Step 2: Verify each pack has the required shape**

Run:
```bash
for f in claim tripod-ai strobe consort stard prisma arrive; do \
  p="skills/academic-review/standards/$f.md"; \
  grep -q "What it governs" "$p" && grep -q "checklist items" "$p" && grep -q "Review prompts" "$p" \
    || echo "MALFORMED: $f"; done; echo "check done"
```
Expected: only `check done`.

- [ ] **Step 3: Commit**

```bash
git add skills/academic-review/standards/
git commit -m "feat(academic-review): reporting-standard packs (CLAIM/TRIPOD-AI/STROBE/CONSORT/STARD/PRISMA/ARRIVE)"
```

---

### Task 7: Write the assets (severity taxonomy, intake, referee template)

**Files:**
- Create: `skills/academic-review/assets/severity-taxonomy.md`
- Create: `skills/academic-review/assets/intake.md`
- Create: `skills/academic-review/assets/referee-report-template.md`

**Interfaces:**
- Consumes: `review-findings.schema.json` (Task 1) — the referee template and intake reference its field names.
- Produces: files linked from SKILL.md workflow.

- [ ] **Step 1: Write `severity-taxonomy.md`**

Define each severity with a one-line test + a worked example finding:
- **fatal** — invalidates the central claim / conclusion cannot stand (e.g., test-set leakage in the headline model). Reviewer verdict: reject or major-revision-at-best.
- **major** — a real threat to validity or a load-bearing gap that must be fixed before acceptance (e.g., no external validation; missing confounder).
- **minor** — weakens but does not threaten the conclusion (e.g., missing CI on a secondary metric).
- **cosmetic** — presentation only (e.g., figure axis unlabeled, typo in equation).
Add a "calibration guardrails" note: if everything is major, nothing is; if nothing is major, say so plainly.

- [ ] **Step 2: Write `intake.md`**

A short decision guide for the Ingest step: how to detect **work type** (manuscript vs thesis vs short-form — length, structure, front matter), **mode** (author if the user says "my/our paper" or asks how to fix; reviewer if "I was asked to review"; examiner if thesis-defense context), **field** and **applicable standard** (defer to `standards/_index.md`). End with "when genuinely ambiguous, ask; otherwise infer and confirm in passing."

- [ ] **Step 3: Write `referee-report-template.md`**

The reviewer-mode output skeleton: **Summary** (2–4 sentences, neutral), **Overall assessment + recommendation** (accept/minor/major/reject with rationale), **Major points** (numbered, each located), **Minor points** (numbered), **Confidential comments to the editor** (kept separate from author-facing points). Note these map onto the findings JSON (`pointsToAuthors`, `notesToEditor`, `recommendation`).

- [ ] **Step 4: Verify**

Run:
```bash
grep -iq fatal skills/academic-review/assets/severity-taxonomy.md && \
grep -iq "work type" skills/academic-review/assets/intake.md && \
grep -iq editor skills/academic-review/assets/referee-report-template.md && echo "assets OK" || echo "ASSET MISSING"
```
Expected: prints `assets OK`.

- [ ] **Step 5: Commit**

```bash
git add skills/academic-review/assets/
git commit -m "feat(academic-review): severity taxonomy, intake guide, referee template"
```

---

### Task 8: Build the machine gate (`scripts/verify.mjs`) — TDD

The deterministic quality gate on the review's own output. **Test-first.**

**Files:**
- Create: `skills/academic-review/scripts/verify.test.mjs`
- Create: `skills/academic-review/scripts/verify.mjs`
- Create: `skills/academic-review/scripts/fixtures/good-author.json`
- Create: `skills/academic-review/scripts/fixtures/bad-missing-location.json`
- Create: `skills/academic-review/scripts/fixtures/bad-vague.json`
- Create: `skills/academic-review/scripts/fixtures/bad-bare-accusation.json`
- Create: `skills/academic-review/scripts/fixtures/bad-reviewer-no-rec.json`

**Interfaces:**
- Consumes: the findings JSON contract from Task 1.
- Produces: `verify.mjs` invoked as `node verify.mjs --review <review.json>`; prints JSON `{pass, hardFailures[], softFindings[]}`; exit 0 / 1 / 2. Rules enforced (all HARD unless noted):
  1. **schema-shape** — top-level `mode`/`workType`/`findings` present and valid enums; each finding has non-empty `location`, `problem`, `why`, valid `severity`, valid `lens`.
  2. **no-vague** — a finding fails if `problem` is "vague-only": after stripping, it matches a vague stem (`unclear|weak|vague|poor|bad|confusing|awkward|needs (work|improvement)|could be (better|improved)|not (clear|good|great)`) AND is ≤ 8 words AND contains no digit and no section/figure/page reference. (Catches "this section is weak.")
  3. **author-fix** — when `mode==="author"`, every `severity` in {fatal,major} finding must have a non-empty `fix`.
  4. **evidence-for-accusation** — any finding with `lens` in {integrity,literature} must have non-empty `evidence` OR `verifyFlag===true`. A bare accusation fails.
  5. **reviewer-report** — when `mode==="reviewer"`: `recommendation` present + in enum, `recommendationRationale` non-empty, `pointsToAuthors` a non-empty array.
  6. **calibration** (SOFT) — if there are ≥3 findings and ALL are `major`/`fatal`, or every finding is `cosmetic`, emit an advisory soft finding.

- [ ] **Step 1: Write the fixtures**

`fixtures/good-author.json` (should PASS):
```json
{
  "mode": "author",
  "workType": "manuscript",
  "standardsApplied": ["claim"],
  "findings": [
    { "id": "F1", "severity": "fatal", "lens": "rigor",
      "location": "Methods, p.6, §2.3",
      "problem": "The reported 0.94 AUC is computed on the same 200 scans used to tune the threshold; there is no held-out test set.",
      "why": "Threshold tuning on the evaluation data leaks label information and inflates AUC; the headline result is not trustworthy.",
      "fix": "Report AUC on a pre-registered external or temporally split test set never seen during tuning; move the current number to 'internal validation'." },
    { "id": "F2", "severity": "minor", "lens": "clarity",
      "location": "Figure 3",
      "problem": "Figure 3 y-axis has no units.",
      "why": "Readers cannot interpret the effect magnitude.",
      "fix": "Label the y-axis 'Dice coefficient (0–1)'." },
    { "id": "F3", "severity": "integrity", "lens": "integrity",
      "location": "Discussion, p.11",
      "problem": "Claims 'first to show X' but Zhang 2023 reported the same finding.",
      "why": "Overstated novelty; misattributes priority.",
      "fix": "Soften to 'among the first' and cite Zhang 2023.",
      "evidence": "Zhang et al. 2023, Radiology, doi:10.1148/xyz reports the same X in their Table 2." }
  ]
}
```
> Note: `F3.severity` must be a valid enum value — set it to `"major"` (not `"integrity"`). Correct the fixture accordingly when writing it (this is the value the test asserts on).

`fixtures/bad-missing-location.json` (FAIL rule 1) — same as good but `F1.location` is `""`.
`fixtures/bad-vague.json` (FAIL rule 2) — one finding `{ "severity":"major","lens":"clarity","location":"Section 4","problem":"This section is weak.","why":"It is not good." }` in author mode with a `fix`.
`fixtures/bad-bare-accusation.json` (FAIL rule 4) — a `lens:"integrity"` finding with no `evidence` and no `verifyFlag`.
`fixtures/bad-reviewer-no-rec.json` (FAIL rule 5) — `mode:"reviewer"` with findings but no `recommendation`/`pointsToAuthors`.

- [ ] **Step 2: Write the failing test**

`skills/academic-review/scripts/verify.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const VERIFY = join(here, "verify.mjs");
const FIX = (name) => join(here, "fixtures", name);

/** Run verify.mjs on a fixture; return {code, json}. */
function run(fixture) {
  try {
    const out = execFileSync("node", [VERIFY, "--review", FIX(fixture)], { encoding: "utf8" });
    return { code: 0, json: JSON.parse(out) };
  } catch (e) {
    // execFileSync throws on non-zero exit; stdout still holds our JSON.
    return { code: e.status, json: JSON.parse(e.stdout) };
  }
}

test("good author review passes", () => {
  const { code, json } = run("good-author.json");
  assert.equal(code, 0);
  assert.equal(json.pass, true);
  assert.equal(json.hardFailures.length, 0);
});

test("missing location is a hard failure", () => {
  const { code, json } = run("bad-missing-location.json");
  assert.equal(code, 1);
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /location/i.test(f.detail)));
});

test("vague-only finding is a hard failure", () => {
  const { json } = run("bad-vague.json");
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /vague/i.test(f.check + f.detail)));
});

test("bare accusation without evidence is a hard failure", () => {
  const { json } = run("bad-bare-accusation.json");
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /evidence/i.test(f.detail)));
});

test("reviewer mode without recommendation is a hard failure", () => {
  const { json } = run("bad-reviewer-no-rec.json");
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /recommendation/i.test(f.detail)));
});
```

- [ ] **Step 3: Run the test to confirm it fails**

Run:
```bash
node --test skills/academic-review/scripts/verify.test.mjs
```
Expected: FAIL — `verify.mjs` does not exist yet, so every `run()` throws / tests error.

- [ ] **Step 4: Implement `verify.mjs`**

`skills/academic-review/scripts/verify.mjs` (dependency-free Node ESM; structure mirrors `skills/grant-proposals/scripts/verify.mjs` — CLI parse, `die()`, checks return `{ok, detail}`, JSON out, exit codes):

```javascript
#!/usr/bin/env node
/**
 * verify.mjs — machine gate for the academic-review skill (ATELIER).
 * Validates the REVIEW's own quality (not the paper). Reads a findings JSON
 * (see assets/review-findings.schema.json) and reports blocking HARD failures
 * vs advisory SOFT findings.
 *
 * Usage:  node verify.mjs --review <review.json>
 * Output: { "pass": bool, "hardFailures":[{id,check,detail}], "softFindings":[...] }
 * Exit:   0 pass · 1 hard failure · 2 usage/input error
 */
import { readFileSync } from "node:fs";

const SEVERITIES = new Set(["fatal", "major", "minor", "cosmetic"]);
const LENSES = new Set(["rigor", "clarity", "integrity", "literature"]);
const MODES = new Set(["author", "reviewer", "examiner"]);
const WORKTYPES = new Set(["manuscript", "thesis", "short-form"]);
const RECS = new Set(["accept", "minor", "major", "reject"]);
const VAGUE = /\b(unclear|weak|vague|poor|bad|confusing|awkward|needs (?:work|improvement)|could be (?:better|improved)|not (?:clear|good|great))\b/i;
const REFHINT = /(section|sec\.|§|p\.|page|line|fig(?:ure)?|table|eq(?:uation)?|\d)/i;

function die(msg, code = 2) {
  process.stderr.write(String(msg).replace(/\n*$/, "\n"));
  process.exit(code);
}
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "-h" || t === "--help") { out.help = true; continue; }
    if (t.startsWith("--")) {
      const k = t.slice(2), n = argv[i + 1];
      if (n === undefined || n.startsWith("--")) out[k] = true; else { out[k] = n; i++; }
    }
  }
  return out;
}
function words(s) { const m = String(s || "").trim().match(/\S+/g); return m ? m.length : 0; }
function nonEmpty(s) { return typeof s === "string" && s.trim().length > 0; }

/** A finding whose `problem` is essentially just a vague adjective. */
function isVagueOnly(problem) {
  const p = String(problem || "");
  if (!VAGUE.test(p)) return false;
  if (words(p) > 8) return false;      // long enough to carry specifics
  if (REFHINT.test(p)) return false;   // mentions a location/number/figure
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { process.stdout.write("Usage: node verify.mjs --review <review.json>\n"); process.exit(0); }
  if (typeof args.review !== "string") die("Error: missing required flag --review <review.json>");

  let review;
  try { review = JSON.parse(readFileSync(args.review, "utf8")); }
  catch (e) { die(`Error: cannot read/parse review JSON "${args.review}": ${e.message}`); }

  const hard = [], soft = [];
  const push = (arr, id, check, detail) => arr.push({ id, check, detail });

  // --- top-level shape ---
  if (!MODES.has(review.mode)) push(hard, "top", "mode", `mode must be one of ${[...MODES].join("|")}`);
  if (!WORKTYPES.has(review.workType)) push(hard, "top", "workType", `workType must be one of ${[...WORKTYPES].join("|")}`);
  const findings = Array.isArray(review.findings) ? review.findings : null;
  if (!findings) { push(hard, "top", "findings", "findings must be an array"); }

  // --- per-finding checks ---
  for (const f of findings || []) {
    const id = f && f.id ? String(f.id) : "(no id)";
    if (!f || typeof f !== "object") { push(hard, id, "shape", "finding is not an object"); continue; }
    if (!SEVERITIES.has(f.severity)) push(hard, id, "severity", `severity must be one of ${[...SEVERITIES].join("|")}`);
    if (!LENSES.has(f.lens)) push(hard, id, "lens", `lens must be one of ${[...LENSES].join("|")}`);
    if (!nonEmpty(f.location)) push(hard, id, "location", "finding has no location (section/page/line/figure)");
    if (!nonEmpty(f.problem)) push(hard, id, "problem", "finding has no problem statement");
    if (!nonEmpty(f.why)) push(hard, id, "why", "finding has no rationale (why it matters)");
    if (isVagueOnly(f.problem)) push(hard, id, "vague", `finding is vague — "${String(f.problem).trim()}" states no specifics or location`);
    if (review.mode === "author" && (f.severity === "fatal" || f.severity === "major") && !nonEmpty(f.fix))
      push(hard, id, "author-fix", `author-mode ${f.severity} finding has no concrete fix`);
    if ((f.lens === "integrity" || f.lens === "literature") && !nonEmpty(f.evidence) && f.verifyFlag !== true)
      push(hard, id, "evidence", `${f.lens} finding is a bare accusation — needs evidence or verifyFlag`);
  }

  // --- reviewer-mode report completeness ---
  if (review.mode === "reviewer") {
    if (!RECS.has(review.recommendation)) push(hard, "report", "recommendation", `reviewer mode needs a recommendation (${[...RECS].join("|")})`);
    if (!nonEmpty(review.recommendationRationale)) push(hard, "report", "recommendationRationale", "reviewer mode needs a recommendation rationale");
    if (!Array.isArray(review.pointsToAuthors) || review.pointsToAuthors.length === 0)
      push(hard, "report", "pointsToAuthors", "reviewer mode needs a non-empty pointsToAuthors list");
  }

  // --- SOFT: calibration sanity ---
  if (findings && findings.length >= 3) {
    const sev = findings.map((f) => f && f.severity);
    if (sev.every((s) => s === "major" || s === "fatal"))
      push(soft, "calibration", "calibration", "every finding is major/fatal — recheck severity calibration");
    if (sev.every((s) => s === "cosmetic"))
      push(soft, "calibration", "calibration", "every finding is cosmetic — is nothing substantive wrong?");
  }

  const output = { pass: hard.length === 0, hardFailures: hard, softFindings: soft };
  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
  process.exit(hard.length ? 1 : 0);
}
main();
```

- [ ] **Step 5: Correct the `good-author.json` fixture**

In `fixtures/good-author.json`, change `F3`'s `"severity": "integrity"` to `"severity": "major"` (integrity is a *lens*, not a severity). The finding keeps `"lens": "integrity"` and its `evidence` field. Without this the good fixture would fail rule 1.

- [ ] **Step 6: Run the tests to confirm they pass**

Run:
```bash
node --test skills/academic-review/scripts/verify.test.mjs
```
Expected: PASS — all 5 tests pass.

- [ ] **Step 7: Sanity-run the gate on the good fixture**

Run:
```bash
node skills/academic-review/scripts/verify.mjs --review skills/academic-review/scripts/fixtures/good-author.json; echo "exit=$?"
```
Expected: JSON with `"pass": true`, empty `hardFailures`, and `exit=0`.

- [ ] **Step 8: Commit**

```bash
git add skills/academic-review/scripts/
git commit -m "feat(academic-review): machine gate on review quality (verify.mjs + tests)"
```

---

### Task 9: Complete the SKILL.md orchestrator

Fill the body left as `<!-- Task 9 -->` in Task 1, now that all siblings exist. Follow the `superpowers:writing-skills` methodology when authoring the discipline instructions.

**Files:**
- Modify: `skills/academic-review/SKILL.md`

**Interfaces:**
- Consumes: every sibling file (rubrics, standards, assets, scripts) by relative path.
- Produces: the complete orchestrator. No new interfaces.

- [ ] **Step 1: Write the positioning + core principle**

One paragraph positioning (critique/improve counterpart to `grant-proposals`), then a **Core principle** block copying the integrity spine from the spec §2 (work is the user's; earned from the text; located + evidence-anchored; honest calibration; improve don't just judge; same evidence bar on the reviewer; privacy).

- [ ] **Step 2: Write the Modes section**

The four modes from spec §3 as a table (author default / reviewer / examiner / deep-panel toggle), each with its trigger and its deliverable. State that mode is inferred and confirmed in passing.

- [ ] **Step 3: Write the Workflow section**

The 7 steps from spec §4: Ingest (→ `assets/intake.md`, `standards/_index.md`) · Map · Four lenses (→ the matching `rubrics/*.md` + `standards/*.md`) · Deep-panel (if toggled, → Step 4 harness) · Synthesize (→ emit the findings JSON per `assets/review-findings.schema.json`) · Deliver (→ `assets/referee-report-template.md` for reviewer mode; inline/rewrite for author mode) · Gate.

- [ ] **Step 4: Write the Deep-panel subsection**

Describe the opt-in multi-agent harness (spec §7): fan out one agent per lens → adversarial verify (skeptics try to refute each finding; survivors only) → synthesize → same deliver+gate. Note it is the thoroughness dial, not the default, and is triggered on request/high-stakes. Reference the Workflow/Agent tooling in general terms (do not hard-code a script).

- [ ] **Step 5: Write the Hard rules + The gate sections**

Copy the 8 hard rules from spec §8. Then the gate section: after synthesizing, write the findings JSON to a temp file and run:
```
node scripts/verify.mjs --review <path-to-findings.json>
```
State plainly: **not done until `pass: true`**; fix every hard failure, weigh every soft finding, then deliver.

- [ ] **Step 6: Verify SKILL.md is complete and lean**

Run:
```bash
! grep -q "Task 9" skills/academic-review/SKILL.md && \
for kw in "Core principle" Modes Workflow "Hard rules" gate verify.mjs deep-panel; do \
  grep -iq "$kw" skills/academic-review/SKILL.md || echo "MISSING: $kw"; done; \
wc -l skills/academic-review/SKILL.md; echo "check done"
```
Expected: no `MISSING:` lines, no leftover `Task 9` markers, `check done` printed. (Line count is informational — keep it lean; heavy content stays in siblings.)

- [ ] **Step 7: Commit**

```bash
git add skills/academic-review/SKILL.md
git commit -m "feat(academic-review): complete SKILL.md orchestrator"
```

---

### Task 10: Ship the SPEC, update the README, end-to-end baseline test

Finalize per the repo's standing rules and prove the skill works on a real document.

**Files:**
- Create: `skills/academic-review/SPEC.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: the whole skill.
- Produces: shipped skill + updated repo positioning.

- [ ] **Step 1: Ship the SPEC**

Copy the approved design into the skill folder (matches `grant-proposals/SPEC.md`):
```bash
cp docs/superpowers/specs/2026-07-02-academic-review-design.md skills/academic-review/SPEC.md
```

- [ ] **Step 2: Update README.md**

In `README.md`: (a) update the concept/positioning prose so the repo describes **reviewing/critiquing** alongside building (visuals, grants); (b) add a Skills-table row:

```markdown
| **`academic-review`** | ✅ available | A reviewing assistant for **theses, papers, and any academic work** — the critique/improve counterpart to `grant-proposals`. Two inferred modes (get tough pre-submission feedback on *your* draft, or produce a submittable **peer-review referee report** on someone else's), four review lenses (rigor · clarity · integrity · literature), reporting-guideline packs (CLAIM/TRIPOD-AI/STROBE/CONSORT/STARD/PRISMA/ARRIVE), an opt-in adversarial **deep-panel**, and a machine gate that holds the *review itself* to a located-and-evidence-anchored bar. |
```

- [ ] **Step 3: Confirm plugin pickup**

Run:
```bash
ls -la plugins/atelier/skills/ 2>/dev/null | grep -i academic-review || echo "note: skills symlinked from ./skills — no manifest edit needed (see CONTRIBUTING.md)"
```
Expected: either the symlink shows `academic-review`, or the note prints (per CONTRIBUTING, `skills/` is the single source of truth and is picked up automatically).

- [ ] **Step 4: End-to-end baseline test (writing-skills methodology)**

Pick a real short manuscript or paste an abstract+methods excerpt. Trigger the skill mentally/practically end to end and confirm:
1. It infers work type + mode and loads the matching rubric + standard pack.
2. It produces located, severity-ranked findings with fixes (author mode).
3. It writes a findings JSON and runs `verify.mjs` which returns `pass: true`.
4. For a deliberately vague finding, `verify.mjs` returns a hard failure (loophole closed).

Document the baseline result in the commit message. If the skill under-triggers or the gate misfires, fix `SKILL.md`/`verify.mjs` and re-run before committing.

- [ ] **Step 5: Final commit**

```bash
git add skills/academic-review/SPEC.md README.md
git commit -m "feat(academic-review): ship SPEC + README, baseline-tested end to end"
```

---

## Self-Review

**Spec coverage:**
- §1 Purpose → Tasks 1–9 (whole skill). ✓
- §2 Core principle → Task 2 (`_principles.md`) + Task 9 Step 1 (SKILL.md). ✓
- §3 Modes → Task 9 Step 2. ✓
- §4 Workflow (7 steps + 4 lenses) → Task 9 Step 3; lenses backed by rubrics (T3/T4) + standards (T5/T6). ✓
- §5 File structure → all tasks; each file has an owning task. ✓
- §6 Machine gate → Task 8 (TDD). ✓
- §7 Deep-panel → Task 9 Step 4. ✓
- §8 Hard rules → Task 9 Step 5. ✓
- §9 Out of scope → encoded in the SKILL.md `description` ("Not for grant proposals / figure design") in Task 1. ✓
- §10 Standing README task → Task 10 Step 2. ✓

**Placeholder scan:** No "TBD/TODO/handle edge cases". The only intentional deferrals are the `<!-- Task 9 -->` markers in Task 1's skeleton, which Task 9 fills and Task 9 Step 6 asserts are gone. ✓

**Type/name consistency:** The findings JSON field names (`mode`, `workType`, `findings[].{id,severity,lens,location,problem,why,fix,evidence,verifyFlag}`, `recommendation`, `recommendationRationale`, `pointsToAuthors`, `notesToEditor`) are identical across the schema (Task 1), the fixtures + `verify.mjs` (Task 8), and the referee template (Task 7). Severity set `{fatal,major,minor,cosmetic}` and lens set `{rigor,clarity,integrity,literature}` are consistent everywhere. The Task 8 fixture note fixes the one intentional trap (`severity:"integrity"` → `"major"`). ✓
