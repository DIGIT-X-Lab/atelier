# The House Design System

The look shared by the lab's best artifacts — LION manuscript figures (D3/SVG),
`tkg_architecture.html` (HTML5 Canvas), `smart-ccc-strategy.html` (reveal.js deck). It is **one
system expressed in four media**. Treat this file as the source of truth for tokens; everything else
(themes, harnesses, recipes) derives from it.

> The chosen Sanzo Wada combination overrides the *primary + accent* hues per project. The
> **neutrals, ink, paper, tints, type scale, spacing, and craft rules below stay constant** — they
> are the house, not the paint.

## Palette (default seed = LION coral/greige)

| Role | Token | Hex |
|---|---|---|
| Primary | `--coral` | `#C85A20` |
| Primary light | `--coral-2` | `#D97B4A` |
| Primary lighter | `--coral-3` | `#EBA87A` |
| Neutral | `--greige` | `#8A7E74` |
| Neutral light | `--greige-2` | `#A49890` |
| Warm dark | `--dark` | `#6B5B4F` |
| Warm dark light | `--dark-2` | `#897A6E` |
| Tawny accent | `--tawny` | `#9A7352` |
| Tawny light | `--tawny-2` | `#B08E6E` |
| Ink (text) | `--ink` | `#3D342E` |
| Ink muted | `--ink-muted` | `#5A4D43` |
| Ink faint | `--ink-faint` | `#8A8078` |
| Paper | `--paper` | `#FFFFFF` |
| Tints (category backgrounds) | `--tint-1..4` | `#FFF5EF` `#F9F5F0` `#F5F3F1` `#F3F0ED` |
| Hairline (axes/rules) | `--hairline` | `#E0E0E0` |

Data-figure categorical accents (when >1 series), in order: `--coral`, a teal `#508C6E`, a blue
`#2B5C8A`, `--tawny`. Keep ≤ 3–4 meaning-carrying hues; everything else neutral.

## Typography — ALWAYS CHOSEN, NEVER DEFAULTED

There is **no house font.** The skill always asks the user to pick (via the font chooser), constrained
to what the target permits. **Never silently default — and never reach for Inter, DM Sans, or Cormorant
Garamond** (the generic fonts the user explicitly rejects).

The offered set (see `journal-fonts.json`):
- **Distinctive sans** — Space Grotesk, Hanken Grotesk, Public Sans, Geist, General Sans (for
  preprint / screen / talks).
- **Journal-safe** — Arial, Helvetica, Times New Roman, Georgia, Palatino Linotype (required by most
  journals and grants).

The chosen fonts flow through `theme.css` as `--font-figures`, `--font-display`, `--font-body` (with a
`system-ui` fallback, never a baked font). Type scale (~1.25 ratio): caption 11 · label 12–13 ·
body 14–16 · subhead 20 · title 28 · display 40+. **Never more than ~3 sizes in a single figure.**

## Icons

Use **Phosphor** icons for concepts/diagrams (`assets/icons/`, bundled locally; download more from
`@phosphor-icons/core` regular weight as needed). Recolor to the theme — never leave default black.

## Spacing & grid

- Spacing scale (px): **4 · 8 · 16 · 24 · 40 · 64**. Use these, nothing in between.
- Elements snap to an 8px baseline grid. Margins are generous — white space is a design element.
- Figure frame: hairline axes only (`--hairline`); no chartjunk, no heavy gridlines, no boxed
  legends. **Direct-label** series where possible.
- Panel labels: `A B C …` upper-left of each panel, Inter 700, `--ink`, 14px.

## Encoding conventions (from tkg)

Categorical entities may use **shape** as a redundant channel (so color is never load-bearing alone):
circle, hexagon, diamond, round-rect, each with a matching tint background. This doubles as the
colorblind-safety backup.

## The craft bar (every artifact must pass)

1. **No collisions, ever.** See the collision checklist below — this is the most-failed rule, check
   it explicitly every time.
2. **Breathing room** — generous consistent margins; spacing from the scale; baseline-grid aligned.
3. **One focal point**; high data–ink ratio.
4. **Typographic hierarchy** — distinct, consistent sizes/weights; ≤ 3 sizes per figure.
5. **Restraint with color** — locked palette; ≤ 3–4 meaning hues.
6. **Accessible** — survives deuteranopia/protanopia; text meets WCAG AA contrast.

## Collision checklist — MANDATORY, EVERY artifact

The #1 recurring failure. **Zoom into the screenshot** and check EVERY text element against EVERY
other element. A label that merely **touches** another element — including a fill edge, a gridline, an
axis, a curve, or a marker — is a COLLISION. "Bounding boxes don't technically overlap" is NOT a pass;
judge it **visually**, by eye, on the rendered pixels.

Enumerate and verify each — none may overlap/touch/clip:

- **Title** vs subheading, panel label, plot area
- **Subheading** vs the top of the plot / first data row
- **Axis titles** (x and y) vs tick labels, vs the frame
- **Tick labels** vs each other (crowding on dense axes), vs axis title, vs data
- **Data/series labels** (direct labels, ridgeline row names, bar values) vs marks, vs **fill edges
  and baselines**, vs each other, vs adjacent rows
- **Legend** vs data and frame (prefer direct labels — see Spacing & grid)
- **Annotations / significance bars / n= counts** vs marks and vs each other
- **Markers / points** vs the frame (clipping) and vs labels
- **Panel labels** `A B C` vs title and plot

Common offenders to watch: a row label whose vertical centre lands **on a baseline or fill edge**
(reads as strike-through); tick labels colliding when the axis is dense; the top ridge/bar touching the
subheading; long category names running into the plot.

**If two elements are within a few px, treat it as a collision and fix it** — by moving, dodging,
adding margin, leader lines, abbreviating, rotating ticks, or reducing overlap. The fix is never
"leave it, it's close enough."

Render → **zoom** screenshot → inspect against 1–6 **and run the full collision checklist** → fix →
re-render. Not done until a clean, zoomed screenshot passes every item.
