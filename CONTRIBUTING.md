# Contributing to ATELIER

## Add a new skill

1. Create `skills/<your-skill>/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: your-skill
   description: Use when ... (triggering conditions only — not a workflow summary)
   ---
   ```
2. Keep heavy reference (API docs, data tables) in sibling files; keep `SKILL.md` lean.
3. The skill is picked up automatically — `skills/` is the single source of truth, and the plugin's
   `skills/` is a symlink to it. No manifest edits needed for skills.
4. Test it: trigger it from a real task and confirm Claude follows it. For discipline skills, see the
   `superpowers:writing-skills` methodology (baseline test → write → close loopholes).

## Add a chart recipe (research-visuals)

1. Drop a file in `skills/research-visuals/recipes/<chart>.js` exporting a `render(svg, data, theme)`
   function that draws onto the figure harness using the theme's CSS variables.
2. Add an entry to `assets/d3-chart-catalog.json`: which `dataShape` + `intent` it fits, a one-line
   *why*, and a *whenNot*. The plot advisor reads this to recommend it.
3. It must pass the craft bar in `assets/house-style.md` (no overlap, breathing room, accessible).

## Conventions

- **Never matplotlib.** Figures are D3 → SVG/PDF.
- Derive all color/type/spacing from the locked `theme.json` / CSS variables — never hard-code hues.
- Vector first; PNG only as convenience.
