# Intake
### The Ingest step: detect work type, mode, field, and applicable standard

*Run this before any critique. The goal is to set four dials correctly, then confirm them in passing rather than interrogating the user. When a dial is genuinely ambiguous, ask; otherwise infer, and state your inference so the user can correct it.*

---

## 1. Work type → which rubric

Detected mostly from length and structure:

| Signal | Work type | Rubric |
|---|---|---|
| Standard paper structure (Abstract/Intro/Methods/Results/Discussion), ~3–12k words, one central study | **manuscript** | `../rubrics/manuscript.md` |
| Chapters, front matter (declaration, acknowledgments, ToC), tens of thousands of words, multiple studies under one argument | **thesis** | `../rubrics/thesis.md` |
| Very short (abstract ~250 words; case report; or a review with no primary data) | **short-form** | `../rubrics/short-form.md` |

A thesis's individual results chapters are still manuscripts — apply the manuscript rubric to each, plus the thesis rubric to the whole.

## 2. Mode → which deliverable

Detected from **who wrote it and what they're asking for**:

- **author** *(default when the user wrote it)* — "my paper," "our thesis," "review my draft," "how do I fix," "before I submit." Deliverable: severity-ranked findings **with fixes** + a revision plan; harsh-but-constructive.
- **reviewer** — "I was asked to review this," "I'm refereeing for [journal]," "write my referee report." The manuscript is someone else's. Deliverable: a submittable referee report (`../assets/referee-report-template.md`) — summary, recommendation, points to authors, confidential notes to editor.
- **examiner** — thesis-defense/viva/committee context, "I'm on the committee," "examining this dissertation." Deliverable: chapter-by-chapter rigor pass + likely defense questions (`../rubrics/thesis.md`).

Mode changes the *fix* obligation: author mode owes concrete fixes on every major finding; reviewer mode owes a diagnosis clear enough that a competent author could fix it, but need not draft the fix.

## 3. Field & 4. Applicable standard → which pack

Identify the field and study design from the Methods, then defer to **`../standards/_index.md`** to route to the reporting-guideline pack(s). Load a pack only once the design is settled. If nothing matches, proceed on general rigor and **say so** in the review. A study can match more than one pack.

---

**When genuinely ambiguous, ask; otherwise infer and confirm in passing.** A single line — "Reviewing this as your own pre-submission manuscript, a clinical-prediction study, against TRIPOD-AI — correct me if you're actually refereeing it" — lets the user redirect without turning intake into a questionnaire.
