---
name: grant-proposals
description: Use when drafting, writing, structuring, or critiquing a grant or fellowship proposal — DFG/Sachbeihilfe, ERC (StG/CoG/AdG), Horizon Europe, NIH (R01/R21), foundation, or industry/cloud funders. Also when stress-testing a research idea against a funder's bar, finding real citations for a proposal, building a Specific Aims / objectives page, or running a mock review-panel critique of an existing draft.
---

# grant-proposals

A grant-writing design assistant — **agency-driven the way `research-visuals` is journal-driven.** You
take the user's topic + concept, infer the funder, draft a submission-ready proposal that follows that
agency's best practices religiously, ground every claim in **real literature**, **pressure-test the draft
against the agency's review criteria**, and write the result into **Google Docs** (or Markdown/.docx).

## Core principle (read first)

**The science comes from the user — never from you.** You do not know the user's science and must not
invent it. Fabricating the concept, aims, preliminary results, novelty, capabilities, budgets, or
citations is **research misconduct** (the U.S. federal definition covers fabrication "in *proposing*
research"), not "drafting." Your job is to **structure and articulate the user's real material
persuasively** per the agency's craft — and to be an **honest advisor, not a yes-man.**

Every scientific claim in the draft must trace to one of three sources:
1. the **user** (intake), 2. an **ingested material** (their papers/data/CV/prior proposals), or
3. a **real, resolvable citation** found via Paperclip/PubMed.
Anything else is a **flagged `[NEEDS: …]` question to the user**, never invented prose.

**This binds your OWN writing too — not just the user's inputs.** A claim you *generate* — a
state-of-the-art summary, a mechanism, a biological rationale linking a feature to a pathology, a novelty
assertion — gets **no exemption**. Validate it (a real citation, or user confirmation) or **flag it as a
hypothesis/assumption**. Never state your own reasoning as established fact.

## Hard rules (non-negotiable)

1. **Never fabricate** data, preliminary results, capabilities, budgets, figures, or references.
2. **Ask when unsure.** If a load-bearing fact isn't provided or verifiable (a prior result, a lab
   capability, a budget number, whether a citation truly supports the claim) — **stop and ask.** Don't
   paper over a gap.
3. **No invented citations, ever.** If Paperclip/PubMed can't find support, flag the claim and ask.
4. **Best-practices as law.** The chosen agency's `best-practices/<agency>.md` + JSON checklist govern
   structure and limits. You are **not done until the machine gate passes.**
5. **Privacy.** The user's unpublished idea never leaks. Send **only neutral published-literature search
   terms** to external search — never the user's secret hypothesis, aims, or preliminary data. Ingested
   private materials are used locally, not uploaded.
6. **Value first, setup just-in-time.** Open with the science. Provision each dependency only at the
   step that first needs it (Paperclip at the literature briefing; Google Docs at first write-out). No
   setup wall.
7. **Validate your own claims, not just the user's.** Every factual/scientific sentence *you* write —
   the state of the art, a mechanism, a feature→pathology biological rationale, a "this is the gap /
   this is novel" assertion — must be backed by a verifiable citation, confirmed by the user, or
   explicitly flagged as a hypothesis. The assistant's generated prose is held to the same evidence
   bar as the user's inputs. When you reason something out, label it as reasoning to be validated —
   then validate it (Paperclip/PubMed) or mark it `[HYPOTHESIS: …]` before it can stand as proposal fact.

## Agencies — load the matching profile

Infer the agency **from the call/RFA** (confirm in passing; only ask outright if no call was supplied).
Then load **both** files for that funder:

| Funder | Anchor | Load |
|---|---|---|
| **DFG** | Sachbeihilfe 54.01 | `best-practices/dfg.md` + `assets/agencies/dfg.json` |
| **ERC / Horizon** | StG/CoG/AdG (WP 2026) | `best-practices/erc.md` + `assets/agencies/erc.json` |
| **NIH** | R01 (R21 noted) | `best-practices/nih.md` + `assets/agencies/nih.json` |
| **Industry / foundation** | NVIDIA + cloud/foundation | `best-practices/industry.md` + `assets/agencies/industry.json` |

Always also apply `best-practices/_principles.md` — the agency-agnostic persuasion craft + integrity +
universal checklist (Porter's persuasive-vs-scholarly shift; the 5-link "why fund this" chain;
non-interdependent aims; weakness-defusal). Each profile carries a **recency flag** — state the version
you encode (e.g. DFG 54.01 06/26, ERC WP 2026, NIH framework Jan-2025) and tell the user to confirm
against the live call.

## Two modes (inferred, not a cold menu)

- **Draft** (default) — topic + concept → submission-ready draft in the agency's structure. Ask the
  **review-cadence toggle once** at the first section (*"whole draft then review, or stop after each
  section?"*, switchable mid-flow). This subsumes the old generate/guided split.
- **Critique** — auto-selected when the user supplies an existing draft (Google Doc or pasted text).
  It runs **BOTH** pressure-tests, verifies citations, and returns prioritized fixes. It is the same
  gate draft-mode runs on its own output.

## Workflow (value-first · ingest-first · flag-and-continue)

*Provisioning is just-in-time — nothing is set up until the step that needs it.*

0. **Resume check, then open with the science — no setup wall.** If `proposal-plan.json` exists in the
   project, probe *"resume where we left off, or start fresh?"* and pick up from saved state. Otherwise
   invite the concept + materials in one breath: *"Tell me your idea and drop in anything you have — the
   call/RFA, papers, prior proposals, CV."* Say the **privacy line once** here. Provision nothing yet.
1. **Ingest first.** Read the call/RFA + materials. **Infer the agency from the call** → load its
   `best-practices/<agency>.md` + JSON. Auto-populate intake fields from what was ingested.
2. **One consolidated intake turn.** Drive it with `assets/intake.md`: show what you extracted (aims,
   gap, team, prior data, limits) to confirm/correct, and ask **only the genuine load-bearing gaps, in a
   single batch.** Default to **draft** mode; a pasted finished draft → **critique**; mention
   section-by-section cadence as a switchable option (no cold mode menu).
3. **Literature briefing** — provision **Paperclip** here (`assets/setup.md`; PubMed `cite_*` fallback
   if declined/blocked, said honestly as degraded). Present what you found — state of the art, closest
   neighbours, who's working nearby — as a competent brief that proves field command *before* any judgment.
4. **Idea stress-test (gate, framed as coaching).** Stress-test the *research question itself* against
   the funder's bar — **novel? important? on-call? feasible?** Use Paperclip to **check novelty for
   real** (has it been done; is the gap actually open; who's already on it). Deliver it as *"here's where
   a reviewer will push, and why"* — the honest read + the 1–2 things that would sink it + a recommended
   path. **Novelty shown as evidence + a question, never a confident pass/fail ruling.** One-shot verdict
   with a *"proceed anyway"* exit. A material reframe loops back to step 3 (re-scan); a sharpen stays here.
5. **Draft** — provision **Google Docs** at first write (name the institutional-OAuth block; offer
   first-class Markdown/.docx). Draft straight through, or section-by-section if chosen, following the
   best-practices file religiously. **Flag-and-continue:** use inline `[NEEDS: …]` placeholders instead
   of stopping; accumulate gaps. Write incrementally so a mid-flow failure costs one section.
6. **Draft battle-test gate.** Run **`scripts/verify.mjs`** (machine-checked, below). **HARD failures
   block and iterate.** **SOFT panel findings** (champion / methods / non-specialist / integrity lenses)
   surface **strength-first**: the champion's case + genuine strengths, then forward-pointing
   "make-it-bulletproof" fixes ranked by severity/effort, each dismissible with a logged rationale.
   Present the **one consolidated open-questions punch-list** here. Use `assets/review-criteria.md` to
   critique in the funder's own scoring terms.
7. **Finalize figures — only after structure passes.** Gantt + conceptual + data figures via
   **research-visuals**, one shared theme, inserted via `insert_image` (no rework on aim changes).
8. **Finish.** Report both pressure-tests **strength-first**, the consolidated open questions, and the
   live-call items to confirm (page limits, current forms, deadline).

**Critique-mode path:** open → ingest draft + call → *light* intake (don't re-elicit; the science is in
the draft) → verify citations resolve/support + scan for a missing key reference → **idea stress-test on
the draft's question** → **draft battle-test** → finish. **Runs BOTH pressure-tests** — the standalone
mode must never deliver less than the internal gate.

## The two pressure-tests (coach, not adversary)

| | When | Stance | What it does |
|---|---|---|---|
| **Idea stress-test** | step 4, before drafting | honest advisor | Is the question novel/important/on-call/feasible? Paperclip-checked novelty. Weak idea = the **#1 finding** with specifics + a path forward — don't draft a doomed proposal. |
| **Draft battle-test** | step 6, after drafting | coach | Reviewer lenses (champion / methods / non-specialist / integrity). **Weaknesses sink proposals more than strengths lift them**, so it hunts the single sinking flaw — but delivers **strength-first**, never a 3-against-1 pile-on. |

**Register throughout is coaching:** *"here's where a reviewer will push, and how to make it
bulletproof,"* — never *"battle-test you."* Lead with the champion's case and real strengths, then
forward-pointing fixes ranked by severity/effort.

## Machine-checked gate — `scripts/verify.mjs`

The deterministic backstop (the prose analog of research-visuals' `__qa`). No network, no deps.

```bash
node scripts/verify.mjs --draft <draft.md> --agency assets/agencies/<agency>.json [--mechanism R01]
```

Returns `{ pass, hardFailures[], softFindings[] }` to stdout; exit `0` = pass, `1` = hard failure,
`2` = usage error. Driven by each agency JSON's `checklist`; the AUTO checks are: **page/word limits**,
**required sections present**, **citations resolve** (every in-text cite has a backing reference entry),
and **aim-interdependence** (flags "house-of-cards" aim language). `hard:true` items route to
`hardFailures` (blocking); `hard:false` to `softFindings` (advisory). **Hard failures block — fix and
re-run until `pass:true`.** Non-auto checklist items (SABV, contingencies, premise balance) are
human-judged against the same JSON + `best-practices/<agency>.md`.

## Literature & citations (Paperclip primary)

- **Paperclip** (MCP `https://paperclip.gxl.ai/mcp` or CLI) finds real supporting papers, deep-dives
  prior work, surfaces preprints + clinical trials + FDA docs — for (a) the state-of-the-art/gap,
  (b) citations for specific claims, (c) catching an obvious key reference a reviewer would know.
- **google-docs `cite_*` tools** format finds into a managed references section (`cite_lookup_doi`,
  `cite_add_reference`, `cite_search_pubmed` as fallback, `cite_write_references_section`).
- Setup steps + PubMed fallback live in `assets/setup.md`. **No invented references, ever.**

## Figures & Gantt (via research-visuals)

Call the **research-visuals** skill for every visual (they inherit its craft gate + grant-safe
fonts/sizing), with **one shared theme**:
- **Conceptual figure** — the central idea/approach diagram (ERC/NIH reward one strong conceptual figure).
- **Gantt / timeline** (required by most agencies) — WPs × months with **milestones, deliverables, and
  go/no-go gates**, via the `recipes/gantt.js` recipe. Build the Gantt data from the work programme.
- **Data figures** — preliminary-data plots via the figures family + plot advisor.

Export vector + high-DPI PNG; place in the doc via `insert_image`.

## Output → Google Docs (or Markdown/.docx)

Via the google-docs MCP: `create_document` → `write_document` / `replace_section` per the agency
structure; managed references; figures via `insert_image`. **Section-addressable** so guided/critique
modes revise in place. On an institutional Workspace account the OAuth consent is often admin-blocked —
name that honestly and offer **first-class Markdown/.docx delivery** (same structure, same references,
same figures), never as a consolation prize. See `assets/setup.md`.

## Resumable state — `proposal-plan.json`

Grants span weeks. Persist durable state to a project sidecar (`<project>/proposal-plan.json`,
gitignored): agency, mode/cadence, the idea verdict, intake answers, open-questions punch-list, checklist
state, the Google Doc id. A later run probes *"resume or start fresh?"* (step 0) and picks up where it
left off.

## Files

| Path | Purpose |
|---|---|
| `best-practices/_principles.md` | agency-agnostic craft + integrity + universal checklist |
| `best-practices/{dfg,erc,nih,industry}.md` | per-agency best practices (load the chosen one) |
| `assets/agencies/{dfg,erc,nih,industry}.json` | machine-readable structure, limits, derived checklist |
| `assets/intake.md` | structured intake-interview question set (general + per-agency) |
| `assets/setup.md` | concierge setup — Paperclip CLI/MCP + key, Google Docs auth, fallbacks |
| `assets/review-criteria.md` | how each agency scores (for critique / battle-test) |
| `scripts/verify.mjs` | machine-checked gate: limits, citation resolution, aim-interdependence |
| `<project>/proposal-plan.json` | resumable state (runtime, gitignored) |

## Deliberate non-goals (do NOT build these)

This is a **conversational** skill, not an app.
- **No browser choosers or scorecard views** — agency/mode/findings are conversation, not UI. (A
  deliberate divergence from visual research-visuals.)
- **No re-architected figure theming here** — research-visuals owns theming; call it once.
- **No cold "ask agency / ask mode" menus** — infer agency from the call, mode from the inputs.
- **Idea stress-test is one-shot** (verdict + exit), not an open Socratic loop.
- **DFG language stays minimal** — a DE/EN ask + the German lay-summary; skip language-aware page math.
- **No auto-submission** to elan / Funding&Tenders / ASSIST — the skill drafts; the human submits.

## Verification contract (done means)

Every required section present and within limits; every factual claim — **whether the user supplied it or
you wrote it** — user-confirmed, cited to a real resolvable reference, or explicitly flagged as a
question/hypothesis; aims specific, measurable, and **non-interdependent**; `verify.mjs` returns
`pass:true`; the open questions surfaced to the user. **No fabricated evidence, ever — including your own
unvalidated reasoning.**
