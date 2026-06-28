# Intake interview — eliciting the real science

*The structured question set the skill uses to **draw the user's real science out**, never to invent it.*
*Pairs with `best-practices/_principles.md` (the persuasion spine) and the per-agency profiles.*

---

## How to run this (read first — it governs everything below)

This is the skill's single most important integrity boundary: **the science comes from the user and
their materials, never from the model.** Every scientific claim in the final draft must trace to (1) the
user, (2) an ingested material, or (3) a real resolvable citation. The intake exists to surface (1) and
(2). Anything still missing becomes a **flagged question**, not invented prose.

Four operating rules, applied to every question in this file:

1. **Infer before you ask.** You will usually arrive here having already ingested the call/RFA, papers,
   prior proposals, datasets, and CV (workflow step 1). **Auto-populate every field you can from those
   materials first.** Then show the user what you extracted — *"Here's what I pulled: central question =
   …, Aim 1 = …, team = …"* — and ask them to confirm or correct. Do **not** re-ask what the documents
   already answer.

2. **Ask only genuine, load-bearing gaps.** A gap is load-bearing if the draft cannot be honestly
   written without it (e.g. no preliminary data for an aim, an unsupported novelty claim, no budget
   logic, no target call). Skip anything that is nice-to-have, already known, or that the agency profile
   supplies a sensible default for.

3. **Batch, never interrogate.** Ask a **coherent batch at a time** — grouped by theme, a handful of
   questions the user can answer in one sitting — not a hundred atomized prompts and not one-at-a-time
   ping-pong. The whole-draft default is **one consolidated intake turn** (SPEC step 2): show extractions
   + ask all real gaps together. Lead with the core batch; add only the per-agency batch your inferred
   funder actually needs.

4. **Flag-and-continue — never block on intake.** If the user can't answer something now (a number they
   need to look up, data not yet analysed), record it as an inline `[NEEDS: …]` placeholder, keep moving,
   and roll it into the **one consolidated open-questions punch-list** at the battle-test gate. Intake
   never stalls the session; it feeds the draft and the punch-list.

> **Privacy line (say once, here).** *"Your unpublished idea stays in your doc — I only ever send neutral,
> published-literature search terms out to find prior work. Your hypothesis, aims, and preliminary data
> are never uploaded."*

> **Critique mode is lighter.** When the user supplies a finished draft, the science is already in it —
> **do not re-elicit.** Extract the core fields from the draft to confirm, ask only what's genuinely
> absent or contradictory, and move to verification + the two pressure-tests.

---

## Part 1 — GENERAL core (every agency needs this)

Ask as **2–3 coherent batches**, not 11 separate questions. Anything ingested → confirm, don't re-ask.

### Batch A — The idea and why it's open

1. **Central question / hypothesis.** *In one or two sentences, what is the single question this project
   answers, or the one falsifiable hypothesis it tests?* — This is the spine; every aim must serve it.
   Push for one crisp, testable claim, not a topic area.
2. **The gap, and why it's still open.** *What does the field currently not know or cannot currently do —
   and why have existing approaches failed to close it?* — Need explicit gap language plus the **reason**
   the gap persists (method limit, missing data, conceptual barrier), not just "understudied."
3. **Significance / "so what".** *If you fully succeed, what changes — for the field, for patients, for
   practice — and who is affected?* — The first-paragraph payoff a tired reviewer must grasp instantly.

### Batch B — Aims, novelty, feasibility

4. **2–3 aims (3 is optimal).** *What are the 2–4 concrete objectives? For each: what will you actually
   do (an action verb — measure, quantify, define, test, not "explore/investigate"), and what's the
   assessable endpoint?* — Then probe the structural killer directly: **"If Aim 1 fails, can Aim 2 and 3
   still be completed?"** Flag any interdependence to be re-architected into parallel tracks.
5. **Novelty — what's genuinely new and why it matters.** *What is new here that does not exist in the
   field today — a new method, concept, dataset, model, or combination — and what does that newness let
   us do that we couldn't before?* — Distinguish novelty-for-its-own-sake from *consequential* novelty.
   (This feeds the literature briefing + idea stress-test, where novelty is checked against real prior
   work via Paperclip.)
6. **Preliminary results / feasibility evidence.** *What do you already have that shows this will work —
   pilot data, a working method, a relevant published result, a built tool, access to the cohort/data?*
   — **Hard integrity boundary: never invent or embellish this.** If an aim has no supporting
   preliminary data, that is a load-bearing gap → `[NEEDS: preliminary data for Aim N]`, surfaced to the
   user, never papered over.

### Batch C — Team, time, money, target

7. **Team & environment.** *Who is on the team, and what specific expertise / track record / facilities
   make this team the right one to do it?* — Names, roles, the one credential each brings. (CV/Drive may
   supply this — confirm, don't re-ask.)
8. **Timeline.** *Over what period (months/years), and roughly how do the aims sequence into work
   packages with milestones and go/no-go decision points?* — Feeds the required Gantt.
9. **Budget logic.** *What are the major cost drivers (people, equipment, compute, consumables, access)
   and why does each map to the work?* — Narrative logic, not a spreadsheet; every line must trace to an
   aim. Flag unjustified items.
10. **Target call & deadline.** *Which exact call/RFA and funder, and when is it due?* — If a call was
    ingested, confirm it; if none, this determines the agency profile and every limit downstream. Also
    capture **how much runway** remains (a <3-month start is itself a risk to flag).

---

## Part 2 — Per-agency emphases (add only the batch for the inferred funder)

Layer these **on top of** the general core — ask only the funder you inferred from the call, as one extra
small batch. Each maps to that agency's distinctive review premium.

### DFG (Sachbeihilfe)
- **Hypothesis-driven framing.** *State the project as a hypothesis to be tested (DFG rewards scientific
  quality and originality) — is the central claim falsifiable and clearly the thread through all
  objectives?*
- **Self-contained state of the art.** *Can you summarise the state of the art so it stands on its own
  without the reader chasing citations?* — DFG expects the case made in the prose itself.
- **Data management.** *What data will you generate, and how will it be stored, documented, and shared
  (repositories, standards, open-access)?* — A required section; elicit it explicitly.
- **Sex/gender dimension.** *Is there a sex- or gender-related dimension to the research subjects/data,
  and how is it accounted for (or why is it not applicable)?* — Required consideration.

### ERC / Horizon
- **Ground-breaking — "what changes if you succeed".** *Beyond incremental progress, what does the field
  look like differently if this works — what becomes possible that is impossible today?* — ERC's premium
  is high-gain ambition, not soundness alone.
- **Conceptual vs operational risk.** *What is the key **conceptual** risk — the idea that might be wrong
  — as opposed to merely operational risk, and what is the high-gain payoff that justifies taking it?* —
  ERC explicitly rewards high-risk/high-gain; name the real intellectual gamble, not just logistics.
- **PI trajectory / fit to scheme.** *What in your track record signals you can lead something
  field-changing (StG/CoG/AdG fit)?*

### NIH (R01 / R21)
- **Specific Aims hook.** *What is the opening hook — the one-paragraph importance-and-gap that opens the
  Specific Aims page and makes a reviewer care by sentence two?*
- **Non-interdependent aims (state it as a requirement).** *Confirm each aim can succeed even if another
  fails* — re-architect any dependency; this is the most common NIH structural killer.
- **Rigor & reproducibility.** *How will you ensure rigorous, reproducible design — controls,
  blinding/randomisation, power/sample-size, authentication of key resources (cell lines, antibodies)?*
- **SABV — sex as a biological variable.** *How are both sexes included and analysed (or what is the
  strong scientific justification for studying one)?* — Required; elicit explicitly.

### Industry / foundation (NVIDIA, cloud, foundations)
- **"Why THIS resource".** *Why specifically this funder's resource — name the exact GPUs / models /
  cloud services / programme — and why is it necessary (not just convenient) for the work?*
- **Quantifiable deliverables.** *What concrete, countable deliverables will the funder get — a released
  model, a dataset, a tool, a benchmark, users reached, papers — with numbers and dates?*
- **Dissemination & sustainability.** *How will the output be shared (open weights, repo, publication)
  and sustained after the award ends?*
- **Mission fit.** *How does the project advance this funder's stated mission/programme themes?* — and,
  where relevant, a **pricing-calculator-backed ask** so the resource request is justified, not round.

---

## Part 3 — Closing the loop

After the batches, **reflect the assembled picture back** in compact form (central question → gap →
aims → novelty → feasibility → team/time/budget → target call) for one confirm/correct pass. Carry every
unanswered item forward as an `[NEEDS: …]` placeholder into the single open-questions punch-list at the
battle-test gate — **the intake's job is to source the real science and name the real gaps, never to
fill them with invention.**
