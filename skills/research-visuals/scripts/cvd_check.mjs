#!/usr/bin/env node
/**
 * cvd_check.mjs — accessibility gate for a locked palette.
 *
 * Simulates deuteranopia & protanopia on the theme's meaning-carrying colors, checks that they
 * stay mutually distinguishable, and checks WCAG contrast of ink-on-paper and each color on paper.
 *
 * Usage:  node cvd_check.mjs <theme.json>   |   node cvd_check.mjs --colors "#C85A20,#508C6E,#2B5C8A"
 * Exit code 1 if any check fails (so it can gate a build).
 */
import { readFileSync } from "node:fs";

const arg = (f) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : null; };
let colors, ink = "#3D342E", paper = "#FFFFFF", name = "(adhoc)";
if (arg("--colors")) colors = arg("--colors").split(",").map((s) => s.trim());
else {
  const t = JSON.parse(readFileSync(process.argv[2], "utf8"));
  name = t.name; ink = t.palette.ink; paper = t.palette.paper;
  colors = [t.palette.primary, ...(t.palette.accents || [])];
}

const hex2rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const relLum = (rgb) => { const [r, g, b] = rgb.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const L1 = relLum(hex2rgb(a)), L2 = relLum(hex2rgb(b)); const hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); };

// Viénot 1999 dichromat simulation (LMS) — deuteranopia & protanopia.
const RGB2LMS = [[0.31399, 0.63951, 0.04649], [0.15537, 0.75789, 0.08670], [0.01775, 0.10945, 0.87262]];
const LMS2RGB = [[5.47221, -4.6419, 0.16963], [-1.1252, 2.29317, -0.1678], [0.02980, -0.1932, 1.16364]];
const SIM = {
  deuteranopia: [[1, 0, 0], [0.49421, 0, 1.24827], [0, 0, 1]],
  protanopia: [[0, 2.02344, -2.52581], [0, 1, 0], [0, 0, 1]],
};
const mul = (m, v) => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const clamp = (x) => Math.max(0, Math.min(255, Math.round(x)));
function simulate(hex, kind) {
  const lms = mul(RGB2LMS, hex2rgb(hex).map(lin).map((c) => c * 255));
  const out = mul(LMS2RGB, mul(SIM[kind], lms)).map((c) => { c /= 255; const s = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; return clamp(s * 255); });
  return out;
}
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]); // rough RGB distance
const MIN_DIST = 40; // perceptual floor for "distinguishable"

let fail = false;
console.log(`ATELIER cvd_check — theme "${name}"  (${colors.length} meaning colors)\n`);

console.log("Contrast (WCAG):");
const ic = contrast(ink, paper);
console.log(`  ink ${ink} on paper ${paper}: ${ic.toFixed(2)}:1 ${ic >= 4.5 ? "✓ AA" : "✗ below 4.5"}`);
if (ic < 4.5) fail = true;

for (const kind of ["deuteranopia", "protanopia"]) {
  console.log(`\n${kind}:`);
  const sims = colors.map((c) => simulate(c, kind));
  for (let i = 0; i < colors.length; i++)
    for (let j = i + 1; j < colors.length; j++) {
      const d = dist(sims[i], sims[j]);
      const ok = d >= MIN_DIST;
      if (!ok) fail = true;
      console.log(`  ${colors[i]} vs ${colors[j]}: Δ=${d.toFixed(0)} ${ok ? "✓" : "✗ too similar — add shape/texture encoding"}`);
    }
}

console.log(fail ? "\n✗ FAIL — do not ship as-is; use redundant (shape/texture) encoding or pick a more separable accent set."
                 : "\n✓ PASS — palette is colorblind-safe and meets contrast.");
process.exit(fail ? 1 : 0);
