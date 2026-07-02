# Short-Form Rubric
### Lighter, faster passes for abstracts, reviews, and case reports

*Loaded when `workType === "short-form"`. Read `rubrics/_principles.md` first; severity words are in [`../assets/severity-taxonomy.md`](../assets/severity-taxonomy.md).*

**Scale effort down.** Short forms do not warrant the full section-by-section machinery of [`manuscript.md`](manuscript.md) or the whole-document arc of [`thesis.md`](thesis.md). The reviewer's job here is to find the one or two things that actually threaten the piece and say them cleanly — a five-finding review of a 250-word abstract is nitpick inflation, not thoroughness. Match the depth of the critique to the size and stakes of the work.

---

## Abstracts (standalone, or conference submissions)

Three checks, in order:

- **Structure** — does it contain, however compactly, the background, the question, the method, the key result *with a number*, and the take-home? A conference abstract missing its actual result ("results will be presented") is a substantive gap, not a style note.
- **Over-claim** — the abstract is the whole deliverable here, so over-claiming has nowhere to hide. Is the headline claim proportionate to a study this size? Is a retrospective/pilot/single-center scope stated or concealed?
- **Is the take-home clear?** — a reader should finish knowing what the authors found and why it matters, in one pass. If the main message is buried or ambiguous, that's the primary finding.

## Narrative & systematic reviews

- **Search reproducibility** — for a systematic review, is the search strategy (databases, terms, dates, inclusion/exclusion) specified well enough to reproduce? An unreproducible search is a **major** finding — it's the difference between a systematic review and an opinion piece with citations. Load the **PRISMA** pack from [`../standards/prisma.md`](../standards/prisma.md) and check for the PRISMA flow diagram and risk-of-bias assessment.
- **Bias** — narrative reviews are especially prone to selection bias (citing only supportive work) and to presenting the authors' position as settled consensus. Check whether competing views are engaged fairly.
- **Currency & scope** — does the review's coverage match its claimed scope and timeframe?

## Case reports

- **CARE guideline pointer** — case reports have their own reporting standard (CARE); check for the essentials: timeline, diagnostic reasoning, intervention, outcome, and patient perspective/consent where applicable.
- **Generalizability caveats** — a single case cannot support a general claim. The most common failure is a case report whose discussion overreaches from *n*=1 to a recommendation. Check that the report is honest about what a single case can and cannot establish, and that its claimed novelty ("first reported case of…") is both located and, ideally, verifiable.
- **Consent & de-identification** — patient consent for publication and adequate de-identification are integrity requirements, not optional; flag their absence.

---

**When in doubt about which pass applies:** if the piece is an empirical study compressed into short form, borrow the relevant Methods/Results checks from [`manuscript.md`](manuscript.md) — but keep the finding count proportionate to what a reader of a short form can act on.
