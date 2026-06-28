# ATELIER

**The DIGIT-X lab's shared collection of Claude Code skills.**

ATELIER is where the lab keeps reusable, version-controlled *skills* — packaged instructions and
tools that make Claude Code do specialised research work the same high-quality way every time. Install
it once and every lab member gets the same capabilities; improve a skill and everyone benefits.

## Why this repo exists

Research work is full of high-stakes tasks that are easy to do *adequately* and hard to do *well and
consistently* — a publication figure, a concept diagram, a grant proposal. Done ad hoc, every person
(and every paper, every application) comes out different and quality drifts. ATELIER captures the lab's
way of doing these things as skills, so the output is **reproducible, on-brand, and submission-grade by
default** — not dependent on who happened to make it.

It started with research *visuals* and is growing into a broader **research toolkit** — anything worth
codifying so the whole lab does it the right way every time (next up: grant proposals).

## What's a "skill"?

A skill is a folder with a `SKILL.md` (instructions Claude follows) plus any supporting tools/assets.
Claude loads a skill only when it's relevant. Skills are shareable and composable — this repo is a
[Claude Code plugin marketplace](https://docs.claude.com/en/docs/claude-code/plugins) bundling the
lab's skills.

## Skills in this repo

| Skill | Status | What it does |
|---|---|---|
| **`research-visuals`** | ✅ available | A design assistant for reproducible, journal-grade visuals. You choose a colour palette (from Sanzo Wada's *A Dictionary of Color Combinations*) and fonts **once**; it locks them to a `theme.json` and every figure, diagram, and slide inherits that look. Four families: **figures** (D3.js → SVG/PDF, *never matplotlib*), **imaging** (niivue NIfTI/DICOM renders), **concepts** (HTML5 Canvas + Phosphor icons), and **slides** (reveal.js). It recommends the *right* chart for your data, previews live in the browser, and runs an automated craft gate so nothing ships cluttered or overlapping. |
| **`grant-proposals`** | ✅ available | A grant-writing assistant for **DFG · ERC/Horizon · NIH · industry** funders. It works from *your* real science (it never fabricates) — interviews you, ingests your call/RFA + papers, grounds every claim in real literature via **Paperclip**, **pressure-tests the idea before you write a word** (is it actually novel/fundable?), drafts to the agency's best practices, machine-checks limits + citations, and writes it into **Google Docs** with figures + a Gantt from `research-visuals`. Concierge setup walks anyone through it. |

## Install

**As a plugin (recommended for the lab):**
```
/plugin marketplace add DIGIT-X-Lab/atelier
/plugin install atelier
```

**Standalone (symlink into your personal skills):**
```
git clone https://github.com/DIGIT-X-Lab/atelier.git
bash atelier/install.sh
```

## Principles

- **Reproducible by default** — choose the look once, lock it, reuse it everywhere.
- **Submission-grade** — vector output, journal/grant-aware sizing and fonts, accessibility checks.
- **Ask, don't assume** — e.g. fonts are always chosen by you, never silently defaulted.
- **A work of art, never cluttered** — every visual passes a no-overlap / breathing-room craft gate.

## Repo layout

```
.claude-plugin/marketplace.json   # makes this repo /plugin-installable
plugins/atelier/                  # plugin manifest (skills symlinked from ./skills)
skills/<skill-name>/SKILL.md      # the skills themselves (single source of truth)
install.sh                        # standalone symlink installer
SPEC.md                           # design spec for research-visuals
CONTRIBUTING.md                   # how to add a skill or a chart recipe
```

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md). In short: add `skills/<name>/SKILL.md` (it's picked up
automatically), keep `SKILL.md` lean with heavy reference in sibling files, and test it on a real task
before relying on it.

---
*Maintained by the [DIGIT-X Lab](https://github.com/DIGIT-X-Lab) · LMU Munich.*
