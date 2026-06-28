# Best Practices: Industry & Foundation Academic Grant Proposals

*Short, impact-and-feasibility-focused awards (compute/hardware grants, research gifts, cloud credits, foundation short awards).*

> **Scope & caveat.** This brief covers concise, non-government awards: GPU/compute grants (NVIDIA), cloud credits (Google Cloud, AWS, Microsoft Azure), and mission-driven foundations (Chan Zuckerberg Initiative, Wellcome short awards). These differ sharply from NIH/NSF. **These programs change their tracks, amounts, eligibility, and forms frequently — often quarterly. Always read the current Call for Proposals (CFP) / RFA before writing.** Award amounts and tracks cited here are illustrative as of mid-2026.

---

## 1. The core mental model: what these funders optimize for

Government agencies (NIH "Significance," NSF "Intellectual Merit") reward novelty, theoretical contribution, and rigor across a long, standardized 15-page format. Industry and foundation short awards reward something different:

- **Concrete, finite deliverables** — a tool, benchmark, model, pipeline, dataset, or demonstrable result with a clear end state. AWS explicitly funds "finite projects" and will *not* fund "ongoing or established research projects" or "general lab projects."
- **Feasibility over ambition** — can *this* team finish *this* scope in the award window? Reviewers reject work that "appeared to be beyond the capacity of the authors in terms of training, experience, and available resources."
- **Why THIS resource specifically** — the single most-overlooked requirement. Google "gives preference to proposals that distinctively take advantage of Google Cloud capabilities rather than other computing infrastructures." NVIDIA requires "demonstrable understanding of how to use NVIDIA technology, especially software and models," and that proposals "incorporate pretrained models from ai.nvidia.com and/or make extensive use of NVIDIA software distributions."
- **Alignment with the funder's mission/tech** — foundations fund their *strategy*, not your CV. CZI gives "preference… to applications that clearly articulate the challenge(s) they aim to address, their strategy and implementation plan."
- **Real-world / industry impact and dissemination** — open-source release, shared pipelines, adoption by a commercial/government partner. AWS weights "potential to disseminate the results and data." NVIDIA's secondary factors are "open-source contribution" and "positive social impact." NVIDIA's *Applied Research Accelerator* tiers scale with whether "a commercial or government organization is planning to adopt" the work (up to ~$60K) or "investing resources" to move it research-to-production (up to ~$160K).
- **A right-sized, justified ask** — the budget/credit request must visibly match the scope, ideally backed by a pricing-calculator estimate (AWS and Google both expect this).

**One-line heuristic:** *Government asks "Is this important and rigorous?" Industry/foundation asks "Will this team deliver a concrete result that advances our mission and uses our thing — and is the ask the right size?"*

---

## 2. Typical structure & length

Most of these are **1–3 pages** (Microsoft Azure research proposals are capped at **3 pages**; many compute grants use a fixed template with short fields). Use this skeleton, scaled to the page limit:

1. **Problem / motivation (2–4 sentences).** The real-world problem and why it matters now. Lead with the "so-what," intelligible to a non-specialist reviewer.
2. **Approach / what you'll build (1 short paragraph).** Methods and the concrete artifact you will produce. Solution-oriented, not a literature debate.
3. **Why this resource (critical, often a dedicated paragraph).** Name the specific GPUs/software/models/cloud services and explain what they *uniquely unlock* (scale, speed, a capability you cannot otherwise reach). Tie each named resource to a task.
4. **Feasibility / preliminary work.** Prior results, pilot data, prototypes, relevant publications — evidence you can execute. This is where short proposals are won or lost.
5. **Impact & deliverables.** Specific, quantifiable outcomes; dissemination plan (open-source repo, dataset, paper, workshop); and adoption/sustainability path beyond the award.
6. **Team & environment.** 2–4 sentences: who, why qualified, what infrastructure/support exists.
7. **Timeline / milestones.** A few dated milestones mapped to the award window. NVIDIA explicitly checks that "project timeline must align with GPU hours dates and hardware ship dates."
8. **Budget / resource justification.** The requested amount tied to scope, ideally with a calculator link (AWS requires "a link from the AWS Pricing Calculator to substantiate the… credit desired").

**Program-specific structure signals to mirror:**
- **AWS:** problem statement, project summary, specific AWS products/services, timeline + milestones, plan for sharing outcomes, future AWS use beyond the award, names of any AWS contacts. Projects must fit one of three types: *proof-of-concept/benchmark; repeatable sharable solution; or workshop/tutorial.*
- **Google Cloud:** background, problem, significance, methods, **GCP tools to be used**, timeline + milestones, future GCP use, plus a budget justification of the chosen machine types vs. estimated usage.
- **NVIDIA:** research description, computational requirements, institution/research-group info, relevant publications, a **clearly defined dataset**, and a timeline aligned to compute/ship dates. Submitted via the official template/portal.
- **Microsoft Azure:** ≤3 pages — research problem + why it's important, how Azure will be used, and resource estimates; rolling submission.
- **CZI / foundations:** challenge addressed, strategy + implementation plan, budget narrative (one-time vs. recurring, % personnel, **financial sustainability after the grant**). Strict formatting (≥11pt font, ≥0.5" margins, numbered pages) and strict deadlines.
- **Wellcome short awards:** use sub-headings in the research statement; make the relevance readable to reviewers outside the field; present outcomes and alternative approaches. Build a relationship with the programme manager early.

---

## 3. Section-by-section dos & don'ts

**Problem / motivation** — Do: open with the real-world stake in plain language; one crisp sentence a non-expert grasps. Don't: bury the point under a literature review or jargon.

**Approach / deliverable** — Do: state the concrete artifact (tool/model/benchmark/pipeline) and that it will be released. Don't: promise open-ended exploration or a multi-year program these awards aren't sized for.

**Why this resource** — Do: name specific services/GPUs/models and map each to a task; show you've used (or clearly understand) the stack. For NVIDIA, reference specific pretrained models and SDKs by name. Don't: write a generic "we need compute" that could be addressed to any vendor — a top, quiet rejection cause.

**Feasibility / preliminary work** — Do: show pilot results, a prototype, or directly relevant prior publications; right-size the scope. Don't: over-claim. Match ambition to demonstrated capacity and stated resources.

**Impact & deliverables** — Do: give *quantifiable* outcomes and a dissemination/adoption plan; for applied-track awards, name the commercial/government adopter and their commitment. Don't: use sweeping, grandiose claims — a documented rejection trigger.

**Timeline / milestones** — Do: a few dated, verifiable milestones inside the award period; align to ship/compute dates. Don't: present a vague phase list with no end state.

**Budget / resource ask** — Do: tie the number to scope and back it with a pricing-calculator estimate; justify chosen machine/GPU types. Don't: request the maximum "to be safe," or include administrative/operational workloads (AWS bars routine IT ops).

---

## 4. How to write a tight, compelling 1–2 page case

- **Front-load value.** First 2–3 sentences = problem + what you'll deliver + why it matters.
- **Active voice, plain words.** "My model will cut inference cost 4×," not "inference cost will be reduced." Cut fluff and jargon.
- **One claim, one piece of evidence.** Every assertion of feasibility should point to a pilot result, prior paper, or prototype.
- **Make the resource the hero.** Spend real estate on *what their specific technology unlocks that nothing else does.*
- **Quantify everything quantifiable.** Dataset size, speedup, accuracy target, users reached, GPU-hours, cost.
- **Use sub-headings even on one page** so reviewers find each criterion fast.
- **Mirror the CFP's language and criteria** — answer each scoring factor in the order the funder lists it.
- **Close with dissemination + sustainability** — open-source release, follow-on funding, or adoption path.

---

## 5. Common reasons these get rejected

- **No specific, quantifiable outcomes** / vague deliverables.
- **Generic resource justification** — no clear reason it must be *this* vendor's tech; for NVIDIA, no demonstrated understanding of their software/models.
- **Feasibility gap** — scope beyond the team's capacity, training, or resources; over-ambition for a short window.
- **Misalignment with the funder's mission/priorities** or wrong program entirely.
- **Budget/ask mismatch** — unrealistic or unjustified amount; cost exceeds plausible benefit; no calculator backing.
- **Funding excluded work** — ongoing/established research, admin/operational workloads, or general lab running costs (explicit AWS exclusions).
- **Ignored format/length rules** — over length, wrong font/margins, missing required fields; hard filters at foundations like CZI.
- **Poor writing** — grandiose claims, convoluted reasoning, repetition, jargon-dense opening.
- **No dissemination/sustainability plan** — nothing shared, no life after the credits run out.

---

## 6. Tone & voice

- **Concise, outcome-oriented, plain-spoken.** Practical, solution-focused — "outcomes, deliverables, and real-world applications rather than theoretical debates."
- **Confident but evidence-anchored.** State what you *will* do; back it with pilots/publications.
- **Minimal academic boilerplate.** Skip the sprawling literature review; cite only what establishes feasibility or the gap.
- **Partner-aware.** You're writing to a company/foundation advancing *its* agenda — speak to their mission, their tech, their definition of impact. Where relevant, name a real contact at the funder (AWS explicitly asks for this).
- **Readable by a non-specialist reviewer.**

---

## 7. Reviewer's eye / red flags

A reviewer skimming for 5 minutes mentally checks:
- ❓ "Could this paragraph be sent to any vendor?" → generic = weak. Kill it.
- ❓ "What exactly exists at the end?" → if you can't name the artifact, neither can they.
- ❓ "Can this team actually do it?" → no pilot/prototype/relevant pubs = feasibility doubt.
- ❓ "Does the ask match the scope?" → round-max numbers with no calculator = padded.
- ❓ "Does this advance *our* mission/tech?" → off-strategy = fast no.
- ❓ "Will anyone use the output?" → no open-source/dissemination/adopter = low impact.
- 🚩 Grandiose claims, vague timelines, over length, requested-tech never named, funds excluded categories, no post-award sustainability.
- 🚩 Boilerplate copied from a federal proposal — wrong altitude, too long, too theoretical.

---

## 8. Pre-submission checklist

- [ ] Read the **current** CFP/RFA; confirm eligibility (e.g., NVIDIA: full-time faculty at a PhD-granting institution).
- [ ] Within page/format limits (length, font ≥11pt, margins, numbered pages where required).
- [ ] Opening 3 sentences state problem + deliverable + impact in plain language.
- [ ] Every scoring criterion in the CFP explicitly addressed, in the funder's order/terms.
- [ ] **"Why this resource"** names specific services/GPUs/models and what each uniquely unlocks.
- [ ] For NVIDIA: references specific pretrained models / SDKs and a **clearly defined dataset**.
- [ ] Concrete, *quantifiable* deliverables and outcomes stated.
- [ ] Feasibility evidenced (pilot data, prototype, relevant publications); scope fits the window.
- [ ] Dated milestones aligned to award/compute/ship dates.
- [ ] Budget/credit ask right-sized and backed by a **pricing-calculator estimate** (AWS/Google).
- [ ] No excluded work (ongoing research, admin/operational/IT ops, general lab costs).
- [ ] Dissemination plan (open-source, dataset, paper, workshop) + post-award sustainability/adoption.
- [ ] Team/environment qualifications stated briefly.
- [ ] Acknowledgement + reporting obligations noted (e.g., NVIDIA: acknowledge in publications, 6-month follow-up).
- [ ] Named any funder contacts (AWS).
- [ ] Active voice, no grandiose claims, jargon stripped from the opening; proofread.
- [ ] Submitted via the correct portal **before** the deadline.

---

### Primary sources
- NVIDIA Academic Grant Program — https://www.nvidia.com/en-us/industries/higher-education-research/academic-grant-program/ · portal https://academicgrants.nvidia.com/s/Application
- NVIDIA Applied Research Accelerator — https://www.nvidia.com/en-us/industries/higher-education-research/applied-research-program/
- Google Cloud research credits — https://edu.google.com/intl/ALL_us/programs/credits/research/ · Stanford HAI CFP — https://hai.stanford.edu/call-google-cloud-credit-proposals
- AWS Cloud Credit for Research, proposal-prep FAQ — https://aws.amazon.com/government-education/research-and-technical-computing/cloud-credit-for-research/faqs/proposal-preparation/
- Microsoft Azure Research Credits — https://www.microsoft.com/en-us/azure-academic-research/
- CZI Community Fund guidelines — https://chanzuckerberg.com/wp-content/uploads/2017/10/Chan-Zuckerberg-Initiative-Community-Fund-Application-Guidelines.pdf
- Wellcome, how to write an application — https://wellcome.org/research-funding/guidance/prepare-to-apply/how-to-write-wellcome-grant-application
- Common rejection reasons — https://www.geneseo.edu/sponsored_research/common-reasons-proposals-are-rejected/ · https://www.fundsprout.ai/resources/reasons-grant-proposals-rejected

> **Recency:** program amounts, tracks, and eligibility shift frequently (NVIDIA rotates tracks/GPU types quarterly). Always read the live CFP before writing.
