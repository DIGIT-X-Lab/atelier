# grant-proposals — Design Spec

*Date: 2026-06-28 · Status: approved design, building · part of ATELIER*

## What this is

A **grant-writing design assistant**, agency-driven the way `research-visuals` is journal-driven. The
user gives a topic + concept; the skill asks **which funder** and **which mode**, drafts a
submission-ready proposal that **follows that agency's best practices religiously**, grounds every
claim in **real literature**, **battle-tests its own draft** against the agency's review criteria, and
writes the result into **Google Docs**.

## Core principles (non-negotiable)

0. **Concierge for anyone — but value first, setup just-in-time.** The skill assumes nothing is set up
   and works for anyone (any lab, any OS, no prior config). But it does **not** front-load a setup wall:
   it **opens with the science** (which needs no external service) and **provisions each dependency only
   at the step that first needs it** — Paperclip at the literature briefing, Google Docs at first
   write-out. When a setup is needed, it guides the user through it step-by-step, honestly (incl. the
   MCP-reload reality and institutional-OAuth blocks), with first-class fallbacks (PubMed, Markdown/
   .docx). See *Concierge onboarding*.
1. **Best-practices as law, not suggestion.** Each agency ships a research-distilled
   `best-practices/<agency>.md` AND a derived, machine-checkable **checklist**. The skill runs the
   draft against the checklist and is **not done until it passes** — the prose analog of
   research-visuals' craft gate.
2. **Evidence, never invention.** Claims that need support get **real citations** found via
   **Paperclip** (full-text PMC/bioRxiv/medRxiv/arXiv/OpenAlex/FDA/ClinicalTrials) with a PubMed
   fallback. **Never fabricate** data, preliminary results, capabilities, budgets, or references.
3. **Ask when unsure.** If a fact isn't provided or verifiable (a prior result, a lab capability, a
   budget number, whether a citation truly supports a claim), the skill **stops and asks the user**
   rather than inventing or guessing. This is a hard rule, grounded in research-integrity standards
   (fabrication in *proposing* research is misconduct).
4a. **Battle-test the IDEA first (before drafting) — honest advisor, not yes-man.** Right after intake
   and before writing anything, the skill stress-tests the *research question itself* against the
   funder's actual bar: **Is it novel? Important? Relevant to this call? Feasible?** It uses **Paperclip
   to check novelty for real** — has this been done; is the claimed gap actually open; who's already
   working on it. If the idea is incremental, already-done, off-call, or the gap isn't real, the skill
   **says so honestly and helps the user sharpen, reframe, or pivot** — it does not proceed to a polished
   draft of a doomed proposal. A weak idea is surfaced as the #1 finding, with specifics and a path
   forward. (Agency-aware: ERC = ground-breaking/high-gain; NIH = significance + innovation; DFG =
   originality; foundation = impact + mission fit.)
4b. **Battle-test the DRAFT (review panel) — as a coach, not an adversary.** After drafting, the skill
   pressure-tests its own draft from distinct reviewer perspectives (the champion who must sell it, the
   methods reader, the non-specialist on the panel, the integrity/feasibility reader) — because
   *weaknesses drive rejection more than strengths drive acceptance*. It splits into **HARD checks**
   (page/word limits, citations resolve + support, required sections, non-interdependent aims) that
   genuinely block and iterate, and **SOFT findings** the user can accept or dismiss with a logged
   rationale. Results are delivered **strength-first** (the champion's case + real strengths, then
   forward-pointing fixes ranked by severity/effort) — never a 3-against-1 pile-on. Register throughout
   is coaching: *"here's where a reviewer will push, and how to make it bulletproof,"* not *"battle-test
   you."*
5. **Privacy: the user's unpublished idea never leaks.** A grant is the user's novel, unpublished
   concept. The skill sends only **published-literature search terms** to Paperclip — never the user's
   secret hypothesis, aims, or preliminary data. External calls carry only what's needed to find prior
   work; the proposal substance stays in the user's own Google Doc. Ingested private materials are used
   locally, not uploaded to third-party search.

## Where the content comes from (sourcing the science) — the heart of the skill

The skill does **not** know the user's science and **must not invent it**. Fabricating concept, aims,
preliminary results, novelty, or capabilities is research misconduct, not "drafting." The skill's job
is to **structure and articulate the user's real material persuasively** per the agency's best
practices — never to manufacture substance. Content is sourced, in priority order:

1. **Structured intake interview.** The skill *elicits* the science like a sharp co-PI: the central
   question/hypothesis, the 2–3 aims, the gap and why existing knowledge can't fill it, what is
   genuinely novel, preliminary results / feasibility evidence, the team, the timeline, the budget
   logic. `assets/intake.md` holds the question set (general + per-agency emphases). It asks one
   coherent batch at a time, not a hundred questions at once.
2. **The user's existing materials, ingested.** Papers, preprints, prior proposals, datasets, results,
   figures, CV — provided as files, Google Drive links, or URLs. The skill reads them and draws the
   real substance (prior results, methods, the lab's track record) from there. Paperclip can also
   retrieve the user's own published work.
3. **The specific call / RFA, ingested.** Not just the generic agency profile — the *actual* call the
   user is applying to (its page limits, topic/expected-outcomes, eligibility, deadline). The skill
   reads it (URL/PDF) and conforms to it; the generic profile is the fallback when no call is given.
4. **Paperclip** for the *external* state-of-the-art and real citations (see Literature search).

**The hard rule:** every scientific claim in the draft is traceable to (1) the user, (2) an ingested
material, or (3) a real resolvable citation. Anything else is a **flagged question to the user**, not
prose. When the intake leaves a load-bearing gap (no preliminary data for an aim, an unsupported novelty
claim), the skill **stops and asks** — it does not paper over it.

## Agency profiles (extensible; user picks at invocation)

`best-practices/<agency>.md` + `assets/agencies/<agency>.json` (the machine-readable structure +
limits + checklist), distilled from the research:

| Agency | Anchor mechanism | Key encoded facts |
|---|---|---|
| **DFG** | Sachbeihilfe (form 54.01) | 25-page / 17+8 split; self-contained-without-citations; objectives→work-programme→budget chain; ≤10 highlighted pubs; no bibliometrics; AI disclosure; data-management + sex/gender sections |
| **ERC / Horizon** | StG/CoG/AdG (WP 2026) | B1 5-page synopsis + ~4-page CV (Step 1) / B2 7-page methodology (Step 2); A/B/C marking; **conceptual** vs operational risk; ground-breaking ambition; Horizon = Excellence/Impact/Implementation |
| **NIH** | R01 (R21 noted) | 1-page Specific Aims + 12-page Research Strategy; **2025 three-Factor** review (Importance / Rigor&Feasibility / Expertise&Resources); rigor + SABV + authentication; non-interdependent aims |
| **Industry / foundation** | NVIDIA + cloud/foundation | 1–3 pages; "why THIS resource" (name GPUs/models/services); quantifiable deliverables; pricing-calculator-backed ask; dissemination + post-award sustainability; mission fit |

Plus `best-practices/_principles.md` — the **agency-agnostic craft + integrity + universal
verification checklist** that applies to every draft (Porter's persuasive-vs-scholarly shift; the
5-link "why fund this" chain; how reviewers actually read; weakness-defusal; ethics).

> All profiles carry **recency flags**: agency rules change yearly. The skill states the version it
> encodes (e.g. DFG 54.01 06/26, ERC WP 2026, NIH framework Jan-2025) and tells the user to confirm
> against the live call.

## Two modes (inferred, not a cold menu)

- **Draft** (default) — topic + concept → submission-ready draft in the agency's structure, with a
  **review-cadence toggle** asked once at the first section (*"whole draft then review, or stop after
  each section?"*, switchable mid-flow). This single mode subsumes the old "generate" and "guided"
  (their only difference was pause cadence on the same section-addressable pipeline).
- **Critique** — auto-selected when the user supplies an existing draft (Google Doc or pasted text):
  runs **both** pressure-tests (idea stress-test on the draft's question + the draft battle-test),
  verifies citations, and returns prioritized fixes. It is also the same gate the draft mode runs on its
  own output.

## Literature search (Paperclip primary)

- **Paperclip MCP** (`https://paperclip.gxl.ai/mcp`) / CLI — find real supporting papers, deep-dive
  prior work, surface preprints + clinical trials + FDA docs.
- The skill uses it to (a) substantiate the state-of-the-art / gap, (b) find citations for specific
  claims, (c) check the user isn't missing an obvious key reference a reviewer would know.
- **google-docs `cite_*` tools** format what Paperclip finds into a managed references section
  (`cite_lookup_doi`, `cite_add_reference`, `cite_search_pubmed` as fallback,
  `cite_write_references_section`).
- **No invented references, ever.** If Paperclip/PubMed can't find support for a claim, the skill
  flags the claim and asks the user — it does not fabricate a citation.

## Figures & Gantt (via research-visuals)

Grants need visuals, and the skill **uses the `research-visuals` skill** for all of them (so they
inherit the house craft gate + grant-appropriate journal-safe fonts/sizing):

- **Conceptual figure** — the central idea / approach diagram (ERC/NIH reviewers reward one strong
  conceptual figure). → research-visuals *concept* family.
- **Gantt / timeline (required by most agencies)** — work packages × months, with **milestones,
  deliverables, and go/no-go decision gates**. This needs a new **`gantt` recipe added to
  research-visuals** (figures family, D3 → SVG, themed). The grant skill builds the Gantt data from the
  work programme (WPs, durations, dependencies, milestones) and calls research-visuals to render it.
- **Data figures** — any preliminary-data plots → research-visuals figures family + the plot advisor.

All are exported as vector + high-DPI PNG and placed in the doc via `insert_image`. The `gantt` recipe
is a reusable research-visuals addition (useful well beyond grants).

## Output → Google Docs

Via the google-docs MCP: `create_document` → `write_document` / `replace_section` per the agency's
structure; managed references; figures (incl. the Gantt) placed via `insert_image`. Section-addressable
so guided/critique modes can revise in place.

## Workflow (revised after the UX critique — value-first, ingest-first, flag-and-continue)

*Provisioning is just-in-time, never a wall: nothing is set up until the step that needs it.*

0. **Resume check, then open with the science — no setup wall.** If a `proposal-plan.json` exists in the
   project, probe *"resume where we left off, or start fresh?"* and pick up from the saved state.
   Otherwise invite the concept and any materials in one breath: *"Tell me your idea and drop in anything
   you have — the call/RFA, papers, prior proposals, CV."* Say the **privacy line once** here (*"your
   unpublished idea stays in your doc; I only send neutral published-literature search terms out"*).
   Provision nothing yet.
1. **Ingest first.** Read the call/RFA + materials. **Infer the agency from the call** (confirm in
   passing; only ask outright if no call was supplied) → load `best-practices/<agency>.md` + the JSON
   profile. Auto-populate the intake fields from what was ingested.
2. **One consolidated intake turn.** Show what was extracted (aims, gap, team, prior data, limits) to
   confirm/correct, and ask **only the genuine load-bearing gaps, in a single batch**. Default to
   **draft** mode; a pasted finished draft → **critique**; mention section-by-section cadence as a
   switchable option (no cold mode menu).
3. **Literature briefing** (provision **Paperclip** here; PubMed fallback if declined/blocked). Present
   what you found — state of the art, closest neighbours, who's working nearby — as a helpful, competent
   brief that proves field command *before* any judgment.
4. **Idea stress-test (gate, framed as coaching).** "Here's where a reviewer will push, and why" — the
   honest read + the 1–2 things that would sink it + a recommended path; **novelty shown as evidence +
   a question, never a confident pass/fail ruling.** One-shot verdict with a *"proceed anyway"* exit. A
   material reframe loops back to step 3 (re-scan); a sharpen stays here.
5. **Draft** (provision **Google Docs** at first write — name the institutional-OAuth block + offer
   first-class Markdown/.docx). Draft straight through, or section-by-section if chosen, following the
   best-practices file religiously. **Flag-and-continue:** use inline `[NEEDS: …]` placeholders instead
   of stopping; accumulate gaps. Write incrementally so a mid-flow failure costs one section.
6. **Draft battle-test gate.** Run **`scripts/verify.mjs`** (machine-checked): page/word limits,
   citations resolve + support, required sections present, **non-interdependent aims** → these HARD
   failures block and iterate. **SOFT panel findings** (champion / methods / non-specialist / integrity
   lenses) surface **strength-first**: the champion's case + genuine strengths, then forward-pointing
   "make-it-bulletproof" fixes ranked by severity/effort, each dismissible with a logged rationale.
   Present the **one consolidated open-questions punch-list** here.
7. **Finalize figures — only after structure passes.** Gantt + conceptual + data figures via
   `research-visuals`, **one shared theme**, inserted via `insert_image` (no rework on aim changes).
8. **Finish.** Report both pressure-tests **strength-first**, the consolidated open questions, and the
   live-call items to confirm (page limits, current forms, deadline).

**Critique-mode path:** open → ingest draft + call → *light* intake (don't re-elicit; the science is in
the draft) → verify citations resolve/support + scan for a missing key reference → **idea stress-test
on the draft's question** → draft battle-test → finish. **Runs BOTH pressure-tests** (the standalone
mode must not deliver less than the internal gate).

## Repo layout

```
skills/grant-proposals/
  SKILL.md
  best-practices/_principles.md          # agency-agnostic craft + integrity + universal checklist
  best-practices/dfg.md
  best-practices/erc.md
  best-practices/nih.md
  best-practices/industry.md
  assets/agencies/<agency>.json          # machine-readable structure, limits, derived checklist
  assets/review-criteria.md              # how each agency scores (for critique mode)
  assets/setup.md                        # concierge setup steps (Paperclip CLI/MCP + key, Google Docs auth)
  assets/intake.md                       # the structured intake-interview question set (general + per-agency)
  scripts/verify.mjs                     # machine-checked gate: limits, citation resolution, aim-interdependence
  # (runtime, per project, gitignored) <project>/proposal-plan.json  — resumable state
```

## Concierge onboarding (first-run setup, guided)

The skill begins by **probing each capability and helping the user set up whatever's missing** — it
never assumes and never silently fails. A `assets/setup.md` holds the exact, copy-pasteable steps; the
skill surfaces only the steps the user actually needs.

**Probe → guide → verify**, per dependency:

- **Paperclip (literature).** Probe: is the Paperclip MCP connected, or the CLI installed with a key?
  If not, concierge the user: (1) get a free API key at the Paperclip key portal; (2) add the MCP —
  exact command (`claude mcp add --transport http paperclip https://paperclip.gxl.ai/mcp` + key
  header) or the CLI install (`curl -fsSL https://paperclip.gxl.ai/install.sh | bash`); (3) confirm a
  test query returns. If the user declines, **fall back to PubMed** and say lit-search is degraded.
- **Google Docs (output).** Probe: can the google-docs MCP create/write a doc? If it needs auth, walk
  the user through connecting/authorizing it. If unavailable, **fall back to a Markdown draft** and
  offer to set it up next time.
- **research-visuals (figures).** Already in ATELIER; used only if the proposal needs a figure.

Setup is **one-time** — once connected, later runs skip straight to step 1 of the workflow. The
concierge tone is friendly and concrete: *"You'll need Paperclip for real citations — here's the
30-second setup,"* not a wall of caveats. Each guided step ends by **verifying it worked** before
moving on.

## Deliberate simplicity (non-goals — do NOT build these)

It's a **conversational** skill, not an app. The UX critique flagged these as over-engineering to
avoid (with two deliberate exceptions the user chose for extra rigor):

- **No browser choosers or scorecard views.** Agency/mode/findings aren't visual; conversation is
  faster. This is a **deliberate divergence** from research-visuals (which is visual), not an oversight.
- **No re-architected figure theming in this skill.** `research-visuals` owns theming; call it once with
  one consistent palette/font.
- **No cold "ask agency / ask mode" menus.** Infer agency from the call, mode from the inputs.
- **Idea stress-test is one-shot (verdict + exit), not an open Socratic loop.**
- **DFG language: minimal** — a DE/EN ask + the German lay-summary; skip language-aware page-limit math.

**Two deliberate complexity choices (user-selected — the critique recommended lighter, the user chose
rigor):**

- **Machine-checked verifier (`scripts/verify.mjs`).** The draft gate is backed by a **real
  deterministic checker**, the prose analog of research-visuals' `__qa`: it counts pages/words against
  the agency limit, **resolves every citation** (does the DOI/PMID exist?), detects **interdependent
  aims**, and confirms required sections are present — returning `{pass, hardFailures[], softFindings[]}`.
  Hard failures block; soft persona findings are advisory. The agency JSON supplies the limits/rules it
  checks against.
- **Sidecar state file (`<project>/proposal-plan.json`).** Grants span weeks. The skill persists the
  durable state — agency, mode/cadence, the idea verdict, intake answers, open-questions punch-list,
  checklist state, the Google Doc id — to a sidecar so a later run **probes "resume or start fresh?"**
  and picks up where it left off.

## Out of scope (YAGNI v1)

- Auto-submission to agency portals (elan / Funding&Tenders / ASSIST) — the skill drafts; the human
  submits.
- Budget-spreadsheet generation beyond a justified narrative.
- Agencies beyond the four anchors — the profile format is extensible; add more later.
- Auto-updating profiles from live agency sites — v1 encodes a dated snapshot + tells the user to verify.

## Repo maintenance (every new skill — standing rule)

Adding a skill to ATELIER is not done until the **repo README is revisited and updated**: the
repo's *concept/positioning* (ATELIER is now a multi-skill research toolkit, not just visuals) **and**
the **skills table**. This is encoded as a standing rule in `CONTRIBUTING.md` so every future
contributor/agent does it. As part of shipping `grant-proposals`: update `README.md` (concept + add
the grant-proposals row) and add the rule to `CONTRIBUTING.md`.

## Verification contract

A proposal is "done" only when: every section the agency requires is present and within limits; every
factual claim is either user-provided, cited to a real resolvable reference, or explicitly flagged as
an assumption/question to the user; aims/objectives are specific, measurable, and non-interdependent;
the draft passes the agency checklist + universal checklist; and the open questions are surfaced to the
user. No fabricated evidence, ever.
