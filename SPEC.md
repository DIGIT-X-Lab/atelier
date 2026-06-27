# ATELIER — Design Spec

*Date: 2026-06-27 · Status: approved design, building*

## What this is

**ATELIER** is the DIGIT-X lab's skills collection — a Claude Code plugin/marketplace that
also works standalone (clone + symlink). It lives inside the `digit-x-shaping-healthcare-knowledge`
repo. Its first skill is **`research-visuals`**: a design assistant that produces journal-grade
figures, concept artifacts, and slide decks in the lab's house style, reproducibly.

## Core principle

**Choose once, lock it, reuse everywhere.** The look of a project's visuals (palette + fonts) is
decided interactively *one time* with the user, written to a `theme.json`, and every figure,
diagram, or slide afterwards reads from that file — emitted as CSS custom properties so the look
propagates automatically. This is what makes the output reproducible and internally consistent.

## The house design system (observed, not invented)

Extracted from the lab's own artifacts — LION manuscript figures (D3/SVG), `tkg_architecture.html`
(HTML5 Canvas), `smart-ccc-strategy.html` (reveal.js deck). It is **one system in three media**:

- **Palette — coral + warm neutrals.** Coral ramp `#C85A20 / #D97B4A / #EBA87A`; greige
  `#8A7E74 / #A49890`; tawny `#9A7352 / #B08E6E`; dark `#6B5B4F / #897A6E`; ink
  `#3D342E / #5A4D43 / #8A8078`; paper `#FFFFFF`; tinted backgrounds
  `#FFF5EF / #FFF8F3 / #F9F5F0 / #F5F3F1 / #F3F0ED`.
- **Typography — always chosen, never defaulted.** There is no house font. The skill always asks the
  user to pick (font chooser), constrained to the target's permitted set — **distinctive sans**
  (Space Grotesk, Hanken Grotesk, Public Sans, Geist, General Sans) or **journal-safe** (Arial,
  Helvetica, Times, Georgia, Palatino). Never silently default; never use Inter / DM Sans / Cormorant.
- **Icons — Phosphor** (`assets/icons/`, recolored to the theme) for concepts and diagrams.
- **Tokens via CSS variables.** `--font-display`, `--font-body`, `--coral`, `--greige`, ramps, and
  tinted backgrounds — so theming is a variable swap, never a find-replace.

## Hard rules (non-negotiable, baked into the skill)

1. **Never matplotlib.** Figures are built with **D3.js → SVG/PDF**. (LION figures are all D3/SVG.)
2. **Palette comes from Sanzo Wada — *A Dictionary of Color Combinations*.** The skill announces
   this, renders real candidate swatches, and the user *chooses*. No ad-hoc color picking. The
   default seed is the existing house coral/greige aesthetic.
3. **Fonts: always ask, no default.** The skill never silently applies a font (and never the generic
   Inter / DM Sans / Cormorant). It always runs the font chooser; the user picks from the target's
   permitted set. If the pick isn't allowed for the target, the nearest substitute is offered and flagged.
4. **Vector first.** SVG/PDF for submission; PNG only as a convenience export.

## Four artifact families

Typography in every family = the **user-chosen** theme font (never a default).

| Family | Tech | Used for |
|---|---|---|
| **figures** | D3.js → SVG/PDF | data plots: scatter/regression, Bland–Altman, box/violin, survival; multi-panel assembly |
| **imaging** | niivue (browser-native NIfTI/DICOM) → SVG/PDF | MIP / slab / orthogonal views, PET-CT fusion, parametric overlays |
| **concepts** | self-contained HTML5 Canvas / SVG, Phosphor icons | architecture diagrams, pipeline/CONSORT flows, graphical abstracts, explainers (à la `tkg_architecture.html`) |
| **slides** | reveal.js (+ optional three.js) | strategy/research decks, grant pitches (à la `smart-ccc-strategy.html`) |

All four share the same **palette spine** (the chosen Sanzo Wada combination) and the same locked
`theme.json`. They differ only in typographic register and rendering tech.

## Not templates — harnesses + recipes

There is **no fixed set of templates**. Instead:

- **One base *harness* per family** — carries the locked theme/CSS variables, the craft-gate
  scaffolding, the live-reload wiring, and the export pipeline. Stable, few.
- **A growable *chart-recipe library*** (figures family) the plot advisor *composes* onto the
  harness — beeswarm, ridgeline, slope, dumbbell, hexbin, contour-density, lollipop, arc, chord,
  Bland–Altman, etc. New recipes are added without touching the harness.
- **An `index.html` contact sheet** that shows every visual in the project at a glance.

## Live HTML iterate loop (the workflow spine)

Every artifact is a living HTML, not a one-shot export:

> **Confirm a design decision → ATELIER writes/updates the HTML and serves it live → you look →
> you ask for a tweak ("tighten spacing / swap accent / enlarge panel B") → it edits the *same
> file* against the *locked theme* → it hot-reloads in the browser.**

`atelier serve` runs a tiny static server with file-watch + live reload. Export to SVG/PDF/PNG is
the **last** step, once you're happy — never per iteration. Iteration always edits the same file so a
layout tweak can never silently change the palette.

## Data profiler (drives the plot advisor)

Before recommending a chart, ATELIER reads the analysis data (CSV / TSV / JSON / Parquet) and infers
row count, variable types, cardinality, missingness, and the relationship being shown. *This profile
is the input to the plot advisor* — the recommendation reflects the actual data, not a guess.

## Plot recommendation (figures family)

The figures family is a **visualization advisor**, not a template filler. Before rendering a data
plot it must:

1. **Read the data's shape** — n rows, variable types, and the relationship being shown
   (distribution / paired-or-repeated measures / correlation / part-to-whole / over-time /
   ranking / two-variable density / network-or-relations / agreement).
2. **Recommend the best-fit chart from the D3 gallery vocabulary**, biased toward expressive,
   structure-revealing encodings over boring defaults, e.g.:
   - distribution → **beeswarm / ridgeline / violin-with-points**, not a bar of means
   - paired / before–after → **slope chart / dumbbell**, not grouped bars
   - dense correlation → **hexbin / contour-density**, not an overplotted scatter
   - ranking / few categories → **lollipop**, not a plain bar
   - relations → **arc diagram / chord**
   - agreement → **Bland–Altman** (house default for method comparison)
3. **Justify the pick** in one line (why it fits *this* data) and name the runner-up, then render it.
   The user can override; the recommendation is the default, not a lock.

This logic is backed by `assets/d3-chart-catalog.json` — a `data shape + intent → recommended
charts + why + when-not` lookup the skill reasons over.

## Craft bar — the quality gate (non-negotiable)

The output must reach the LION level: restrained, editorial, generous whitespace — **a work of art,
never cluttered, crowded, or overlapping**. This is enforced two ways:

**A. Layout rules baked into every template**
- **No collisions, ever.** Labels are placed by *measure-then-place*: compute each text box, detect
  overlap, and resolve with dodging, leader lines, or repositioning. Never let text touch text,
  text touch marks, or marks clip the frame.
- **Breathing room.** Generous, consistent margins; a single spacing scale (e.g. 4/8/16/24/40);
  elements snap to a baseline grid. White space is a design element, not leftover.
- **One focal point** per figure; high data–ink ratio (drop chartjunk, heavy gridlines, redundant
  legends — direct-label instead). Hairline axes (`#e0e0e0`), muted tick text (`#888`).
- **Typographic hierarchy.** Distinct, consistent sizes/weights for title / label / annotation /
  caption. Panel labels `A B C` in the house weight. Never more than ~3 type sizes per figure.
- **Restraint with color.** Use the locked palette; ≤ 3–4 hues carrying meaning; everything else
  neutral.

**B. Mandatory visual self-review loop (before delivery)**
Render → screenshot the result in the browser → **inspect for: text overlap, clipping at edges,
crowding, misalignment, inconsistent spacing, illegible contrast** → fix → re-render. The artifact
is not "done" until a clean screenshot passes this check. No exceptions, no "looks fine without
checking."

**C. Accessibility check (part of the gate)**
Simulate deuteranopia/protanopia on the rendered figure and verify the meaningful hues stay
distinguishable; verify text/background contrast meets WCAG AA. If the chosen Sanzo combination fails
for the data's category count, flag it and propose a distinguishable accent assignment (shape/texture
encoding as backup) — never ship an inaccessible figure silently.

## Export, captions & provenance

- **Journal sizing presets.** Export at the target's physical width — single column ≈ 3.5″, double
  ≈ 7.2″ — at the target DPI, with fonts embedded in the SVG/PDF (no missing-glyph fallback).
  Vector (SVG/PDF) first; PNG as convenience.
- **Caption + alt-text.** Auto-draft a figure caption and alt text from the data profile and the
  chart's encoding; the user edits.
- **Provenance footer.** Each artifact records a small footer/metadata block: data-file hash, theme
  name + Sanzo combo id, and date — so any figure is traceable back to its inputs and look.

## The locked theme (`theme.json`)

Written to the project's visuals folder; emitted to a `theme.css` of CSS variables that every
artifact `@import`s. Shape:

```json
{
  "name": "lion",
  "source": "Sanzo Wada — A Dictionary of Color Combinations (combo #142)",
  "palette": {
    "primary": "#C85A20", "primaryRamp": ["#C85A20", "#D97B4A", "#EBA87A"],
    "neutral": "#8A7E74", "neutralRamp": ["#6B5B4F", "#8A7E74", "#A49890"],
    "accents": ["#9A7352", "#508C6E", "#2B5C8A"],
    "ink": "#3D342E", "inkMuted": "#5A4D43", "inkFaint": "#8A8078",
    "paper": "#FFFFFF", "tints": ["#FFF5EF", "#F9F5F0", "#F5F3F1", "#F3F0ED"]
  },
  "target": "preprint",
  "fonts": { "figures": "Space Grotesk", "display": "Space Grotesk", "body": "Public Sans" },
  "export": { "format": ["svg", "pdf"], "dpi": 300 }
}
```

## Interactive workflow (the skill, end to end)

1. **Detect or create `theme.json`.** If one exists in the project, use it silently and skip to step 5.
2. **Palette chooser.** Announce the Sanzo Wada source. Seed from the house coral/greige aesthetic
   and render a sheet of candidate combinations as real swatches in the browser. User picks one.
3. **Font chooser.** Ask the target (preprint / specific journal / grant body). Render previews of
   *only* that target's allowed fonts. User picks. Non-allowed house-font substitutions are flagged.
4. **Lock.** Write `theme.json` + `theme.css` (CSS variables).
5. **Render.** For each requested visual: pick the family, load the matching template, inject the
   theme, produce SVG/PDF (figures), self-contained HTML (concepts), or a reveal.js deck (slides).
   Act as design assistant — propose layout/encoding, iterate live in the browser.
6. **Craft gate.** Run the mandatory visual self-review loop (see *Craft bar*): screenshot, inspect
   for overlap/clutter/clipping, fix, re-render. Deliver only a clean result.

## Repo layout

```
atelier/
  .claude-plugin/marketplace.json        # makes it /plugin-installable
  plugins/atelier/
    .claude-plugin/plugin.json
    skills -> ../../skills               # symlink: one source of truth
  skills/
    research-visuals/
      SKILL.md
      assets/sanzo-wada.json             # curated palette combinations (hex)
      assets/journal-fonts.json          # target -> allowed fonts + sizing presets
      assets/d3-chart-catalog.json       # data-shape + intent -> best-fit D3 charts
      assets/house-style.md              # the LION/TKG/CCC design system, written down
      scripts/render_swatches.html       # palette chooser (opens in browser)
      scripts/render_fonts.html          # font chooser
      scripts/make_theme.mjs             # writes theme.json + theme.css from a chosen combo
      scripts/profile_data.mjs           # infers data shape -> feeds the plot advisor
      scripts/serve.mjs                  # static server + file-watch live reload
      scripts/cvd_check.mjs              # colorblind + contrast check on a rendered figure
      harnesses/figure.html              # D3 figure base (theme + craft gate + export)
      harnesses/imaging.html             # niivue base (NIfTI/DICOM MIP/slab/fusion)
      harnesses/concept.html             # HTML5 Canvas concept base
      harnesses/slides.html              # reveal.js deck base
      recipes/                           # composable D3 chart recipes (beeswarm, slope, hexbin, …)
      recipes/bland-altman.js            # seed recipe
      index.template.html                # contact-sheet gallery of a project's visuals
      theme.example.json
  install.sh                             # symlinks skills/* -> ~/.claude/skills (standalone)
  README.md
  CONTRIBUTING.md                        # how labmates add a skill / a recipe
```

## Install paths

- **Marketplace:** `/plugin marketplace add <path-or-git-url>` → `/plugin install atelier`.
- **Standalone:** already in digit-x → `bash atelier/install.sh` symlinks each skill into
  `~/.claude/skills/`.

## Out of scope (YAGNI for v1)

- Migrating the existing MOOSE-prep skill (`digit-x/skills.md`) into ATELIER — natural second skill, later.
- A full digitization of all 348 Sanzo Wada combinations — v1 ships a curated subset; expandable.
- Auto-detecting the target journal from a manuscript — the user states the target.
- three.js scene authoring for slides beyond a working starter — opt-in, not default.

## Reproducibility contract

Given the same `theme.json` and the same data file, a template produces the same artifact. The theme
is committed alongside the project. No hidden global state, no per-run color drift.
