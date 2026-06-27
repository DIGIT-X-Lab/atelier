# ATELIER

The DIGIT-X lab's Claude Code skills collection — research-grade visuals and lab workflows.
Works as an installable **plugin marketplace** *and* standalone (clone + symlink).

## Skills

| Skill | What it does |
|---|---|
| **research-visuals** | Design-assistant for reproducible, journal-grade **figures** (D3 → SVG/PDF, never matplotlib), browser-native **imaging** renders (niivue), **concept** diagrams (HTML Canvas), and **slide decks** (reveal.js) — all in the lab house style, with a locked palette + fonts chosen once and reused. |

## Install

**As a plugin (recommended for labmates):**
```
/plugin marketplace add <path-to-this-folder-or-git-url>
/plugin install atelier
```

**Standalone (symlink into your personal skills):**
```
bash atelier/install.sh
```

## The idea

One **house design system** (coral/greige · Inter for data · DM Sans + Cormorant Garamond for
display), extracted from the lab's own best artifacts. You **choose a palette once** (grounded in
Sanzo Wada's *A Dictionary of Color Combinations*) and the **fonts your target permits** (preprint /
journal / grant), it locks them to a `theme.json`, and every visual afterwards inherits that look.
Live HTML preview, iterate in seconds, export vector at submission size. Every artifact passes a
craft gate: no overlap, no clutter, accessible, a work of art.

See [`SPEC.md`](./SPEC.md) for the full design and [`CONTRIBUTING.md`](./CONTRIBUTING.md) to add a
skill or a chart recipe.
