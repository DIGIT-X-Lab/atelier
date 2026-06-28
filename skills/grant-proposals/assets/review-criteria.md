# Review Criteria — Cross-Agency Scoring Reference

> Loaded for **critique / battle-test (mock-panel) mode**. This is *how each funder actually scores*, distilled so the critique can be run in the funder's own terms. For full proposal-writing guidance see `best-practices/{dfg,erc,nih,industry}.md`. Verify mechanics against the live call — frameworks change (NIH Jan-2025, ERC 2026/2027).

## The universal law of mock panels

**Weaknesses sink proposals more than strengths lift them.** Across all four funders, one identifiable fatal flaw outweighs an otherwise excellent application. Panels rank on overall strengths *and* weaknesses holistically, not by arithmetic — and empirically the weaknesses predict the outcome. So when battle-testing: **hunt for the single sinking flaw first**, then the pattern of smaller ones. A proposal with no glaring strength but no flaw often beats a brilliant one with a fatal crack.

The other near-universal killers: **objectives ≠ methods ≠ timeline ≠ budget** (the chain must be coherent end to end); **descriptive "fishing expedition" with no testable hypothesis**; **no risk/contingency plan**; **over-ambition vs. demonstrated capacity**; **written for specialists only** when the panel is mostly adjacent-field.

---

## NIH (R01/R21) — three Factors + 1–9 impact + percentile/payline

**Mechanism (Simplified Framework, applications on/after 25 Jan 2025):**
- **Factor 1 — Importance of the Research** (Significance + Innovation): **scored 1–9.** "Should it be done?"
- **Factor 2 — Rigor and Feasibility** (Approach): **scored 1–9.** "Can it be done well?" — **historically the highest correlation with the overall score; where applications live or die.**
- **Factor 3 — Expertise and Resources** (Investigator + Environment): **binary** (appropriate / additional needed), comment only on a gap — deliberately de-weighted to reduce reputation bias.
- All Factors feed one **overall impact score, 1 (best)–9 (worst)** per reviewer → averaged ×10 → **10–90** → **percentiled** → funded vs. the **IC-specific payline**.
- **~50% triaged ("Not Discussed")** — never scored — when no assigned reviewer is enthusiastic.

**Reviewers weight most:** Approach/feasibility (Factor 2). Then the Specific Aims page — many reviewers form their opinion there before reading on.

**Weaknesses that sink it:** over-ambitious/not feasible (the #1 Approach killer); interdependent "house-of-cards" aims; no/weak preliminary data; **no pitfalls/alternatives/contingencies** (mandatory in Approach); descriptive non-hypothesis aims; thin scientific premise / incremental work dressed as innovative; missing rigor (no power analysis, no SABV, no resource authentication); resubmission that doesn't visibly answer the prior summary statement. Lack of overall enthusiasm → triage.

**Critique in their terms:** mirror Factor language — importance, rigor/feasibility, expertise/resources. Push hardest on Factor 2.

---

## ERC (StG/CoG/AdG) — A/B/C, two steps, excellence only

**Mechanism:** sole criterion is **scientific excellence** — no impact pillar, no consortium, no co-funding. Two scored elements: **(1) the research project** — ground-breaking nature, ambition, feasibility; **(2) the PI** — intellectual capacity, creativity, commitment.
- **Step 1 (B1 only — extended synopsis + CV):** marks **A / B / C.** A → goes to Step 2; B → weaknesses, normally dropped; C → rejected. **The major bottleneck — only a limited number of A's pass.**
- **Step 2 (full B1+B2 + interview, incl. AdG from 2026):** marks **A / B.** A = fundable if budget allows; B = not. **Feasibility is assessed only at Step 2** (2026). The **CV/track record gets qualitative feedback, not a score** (2026) — weight shifted toward the idea over reputation.

**Reviewers weight most:** is it genuinely **ground-breaking** (changes the field, not advances it)? The wanted risk is **conceptual** (the hypothesis may be wrong even with unlimited resources), not **operational** (might fail for lack of time/people/kit — reads as poor planning). Must hit the paradox: bold uncertain idea **+** a credible, concrete, pilot-anchored route.

**Weaknesses that sink it:** "interesting but incremental" — could be a national grant (the #1 Step-1 cause); ambition asserted but never substantiated (no "if true, the field changes because…"); fishing expedition / no falsifiable hypothesis; methods that imply the answer is already known (kills the risk); **"no significant risks foreseen"** (signals it isn't ambitious); science smuggled into appendices/Funding ID; recycled Horizon/national proposal; specialist-only prose the multidisciplinary panel can't follow; weak Step-2 interview.

**Critique in their terms:** for the panel (mostly adjacent-field), not the world expert. Is the breakthrough front-loaded and explicit? Is the risk conceptual? Is the gain unmistakable?

---

## DFG (Sachbeihilfe) — comparative prioritisation + 4 criteria, qualitative

**Mechanism:** no public numeric rubric. **Three-stage:** external written reviewers (Gutachter) assess merit and whether funds are appropriate → elected review boards (Fachkollegien) **comparatively prioritise all proposals in the field against a limited budget** → Head Office/Joint Committee decides. **Only ~1 in 3 funded** — rejection is often a budget/competition outcome.
- **Four review criteria (form 10.20):** quality of the project · objectives and work programme · applicants' qualifications · work/research environment. Weighs scientific excellence, relevance, originality; considers career stage; **no non-scientific criteria, no bibliometrics** (h-index/JIF explicitly disregarded).

**Reviewers weight most:** the **work programme** — DFG states "the quality of the work programme is critical to the success of a funding proposal." Plus the iron rule that **the review is based on the proposal text alone** — reviewers are told they need not read any cited work, so Section 1 must be **self-contained**.

**Weaknesses that sink it:** weak/illogical work programme (the explicitly "critical" element); **not self-contained / missing key references**; **objectives ≠ work programme ≠ budget** (most common substantive flaw); no hypotheses / purely descriptive; no risk management / no plan B; budget over-ask or staff/co-applicants with no defined role; over-ambition vs. thin preliminary work; **bibliometric padding** (signals rule-blindness); empty mandatory sections (data handling, sex/gender/diversity, ethics); formatting violations (under-size font, over-length, locked PDFs); undisclosed generative-AI text.

**Critique in their terms:** assume nothing beyond the 25 pages is read. Is every task mapped to a budget line? Are hypotheses crisp and derived from the state of the art? Are alternatives/risk mitigation present?

---

## Industry & Foundation (compute/cloud/foundation short awards) — mission-fit / feasibility / why-this-resource / right-sized ask

**Mechanism:** no standardised score; reviewers skim a 1–3 page case in minutes against the CFP's own criteria, in the funder's order. The question is **not** "is this important and rigorous?" but **"will this team deliver a concrete result that advances our mission and uses our thing — and is the ask the right size?"**

**Reviewers weight most (the four levers):**
1. **Concrete, finite deliverable** — a named artifact (tool/benchmark/model/pipeline/dataset) with an end state. AWS funds "finite projects," not ongoing/established/general-lab research.
2. **Feasibility over ambition** — can *this* team finish *this* scope in the window? Over-reach beyond training/resources is a documented reject.
3. **Why THIS resource** — the most-overlooked requirement. Name the specific GPUs/SDKs/cloud services/pretrained models and what each *uniquely unlocks*. A paragraph that could be sent to any vendor is a quiet rejection.
4. **Mission/strategy alignment + dissemination** — foundations fund their strategy, not your CV; weight open-source release, adoption by a commercial/government partner, post-award sustainability.
- Plus a **right-sized, justified ask** backed by a pricing-calculator estimate (AWS/Google expect this).

**Weaknesses that sink it:** vague/non-quantifiable deliverables; **generic resource justification** (no reason it must be *this* vendor; for NVIDIA, no grasp of their software/models); feasibility gap / over-ambition for a short window; off-strategy or wrong program; padded "round-max" ask with no calculator; proposing excluded work (ongoing research, admin/IT ops, general lab costs); grandiose claims; ignored format/length limits (hard filters at foundations like CZI); **federal-proposal boilerplate at the wrong altitude** — too long, too theoretical, resource never named; no dissemination/sustainability.

**Critique in their terms (5-minute skim test):** Could this paragraph go to any vendor? What exactly exists at the end? Can this team do it? Does the ask match the scope? Does it advance *our* mission/tech? Will anyone use the output?

---

## Quick cross-agency contrast (for picking the critique lens)

| | Scoring mechanism | Single most-weighted thing | The flaw that most reliably sinks it |
|---|---|---|---|
| **NIH** | 3 Factors (two 1–9, one binary) → 10–90 → percentile vs. payline; ~50% triaged | **Approach** (Factor 2 — rigor & feasibility) | Over-ambitious/infeasible; no pitfalls-and-alternatives |
| **ERC** | A/B/C Step 1 → A/B Step 2 + interview; excellence only | **Ground-breaking nature** (conceptual risk + high gain) | "Interesting but incremental"; risk is operational not conceptual |
| **DFG** | Qualitative; comparative prioritisation vs. budget; 4 criteria; ~⅓ funded | **Work programme** (+ self-contained text) | Illogical/weak work programme; objectives≠programme≠budget |
| **Industry/Foundation** | CFP-criteria skim, no formal score; 1–3 pp | **Why-this-resource + concrete deliverable** | Generic ask any vendor could read; vague deliverable; wrong altitude |

**Running the mock panel:** adopt the relevant funder's mechanism and vocabulary, find the sinking flaw first, then map every other weakness to a named criterion. Be the harsh-but-fair reviewer who has 40 proposals and can fund 12 — weaknesses are the currency of the decision.
