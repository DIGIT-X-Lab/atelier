---
name: research-visuals
description: Use when creating or refining any research visual — a figure, plot, chart, medical-imaging render (MIP/PET-CT fusion), concept/architecture diagram, graphical abstract, or slide deck — for a paper, grant, or talk. Also when choosing a figure palette or fonts, or making visuals reproducible and consistent across a manuscript.
---

# research-visuals

Design assistant for the DIGIT-X lab's visuals. Produces reproducible, journal-grade artifacts in
the house design system: **choose a palette + fonts once, lock them, reuse everywhere.**

## Core principle

The look (palette + fonts) is decided interactively **one time**, written to `theme.json` +
`theme.css`, and every artifact inherits it. You act as a **design assistant**, not a renderer —
propose, render live in the browser, iterate fast, and never ship clutter.

## Hard rules (non-negotiable)

1. **Never matplotlib.** Figures are **D3.js → SVG/PDF**.
2. **Palette comes from Sanzo Wada** (`assets/sanzo-wada.json`) — announce the source, render real
   swatches, the user *chooses*. Never invent colors.
3. **Fonts: ALWAYS ASK, NO DEFAULT.** Never silently apply a font — especially not Inter, DM Sans, or
   Cormorant Garamond (the generic defaults the user rejects). Always run the font chooser; the user
   picks from the target's permitted set (`assets/journal-fonts.json`: distinctive sans + journal-safe).
   If the pick isn't allowed for the target, offer the nearest substitute and **flag** it.
4. **Vector first** (SVG/PDF); PNG only as convenience.
5. **The craft bar always applies** (see `assets/house-style.md`): no text overlap, no clutter,
   breathing room, accessible. Enforced by a render→inspect→fix loop before delivery.

## Workflow

Run everything against a project visuals folder (e.g. the manuscript's `figures/`). All scripts live
in `scripts/`; serve with live reload so iteration is instant.

1. **Theme present?** If the project already has `theme.json`, use it silently → go to step 5.
2. **Palette.** Tell the user you're drawing from *Sanzo Wada — A Dictionary of Color Combinations*.
   Serve and open `scripts/render_swatches.html`; they pick a card (default seed = house coral/greige).
3. **Fonts (always — never skip).** Open `scripts/render_fonts.html`; ask the target (preprint /
   journal / grant); they pick from the permitted set (distinctive sans + journal-safe). Never default
   a font yourself. Substitutions for forbidden picks are flagged.
4. **Lock:** `node scripts/make_theme.mjs --combo <id> --target <target> --name <proj> --out <dir>`
   → writes `theme.json` + `theme.css`. Run `node scripts/cvd_check.mjs <dir>/theme.json`; if it
   fails, fix the accent assignment or add shape/texture encoding before continuing.
5. **Pick the family & render** (see table). Copy the harness into the project, point it at the theme,
   and iterate live (`node scripts/serve.mjs --root <dir>`).
6. **Craft gate (mandatory).** Screenshot the rendered artifact → inspect for overlap / clipping /
   crowding / misalignment / contrast → fix → re-render. Not done until a clean screenshot passes.
7. **Finish.** Export at the target's size/DPI (fonts embedded), draft a caption + alt-text, and keep
   the provenance footer (data hash · theme · date). Add the artifact to `index.template.html`.

## Families

| Family | Harness | Tech (typography = the chosen theme font, never a default) |
|---|---|---|
| figures | `harnesses/figure.html` + `recipes/*` | D3 → SVG |
| imaging | `harnesses/imaging.html` | niivue (NIfTI/DICOM) |
| concepts | `harnesses/concept.html` | HTML5 Canvas + Phosphor icons (`assets/icons/`) |
| slides | `harnesses/slides.html` | reveal.js |

## Plot advisor (figures)

Never default to a boring chart. First **profile the data**:
`node scripts/profile_data.mjs <data.csv>`. Then match its shape + intent against
`assets/d3-chart-catalog.json` and **recommend the best-fit chart**, justify in one line, name a
runner-up, and render it (beeswarm/ridgeline over bar-of-means; slope/dumbbell over grouped bars;
hexbin/contour over overplotted scatter; Bland–Altman for agreement). The user can override.

To add a chart, drop `recipes/<name>.js` exporting `render({svg, d3, theme, data})` (copy
`recipes/bland-altman.js`) and register it in the catalog. Recipes read colors from `theme.palette` —
never hard-code hues.

## Common mistakes

- Reaching for matplotlib or a static PNG. → D3/SVG, vector.
- Hard-coding `#C85A20` in a recipe. → read `theme.palette` / CSS vars.
- Picking a chart before profiling the data. → profile first, then advise.
- Declaring done without the screenshot inspection. → run the craft gate every time.
- Defaulting a font (especially Inter/DM Sans/Cormorant). → always run the font chooser; the user picks.
- Adding Phosphor icons by name without checking `assets/icons/` (download into it if missing).
