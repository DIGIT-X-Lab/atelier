#!/usr/bin/env node
/**
 * verify.mjs — machine gate for the academic-review skill (ATELIER).
 * Validates the REVIEW's own quality (not the paper). Reads a findings JSON
 * (see assets/review-findings.schema.json) and reports blocking HARD failures
 * vs advisory SOFT findings.
 *
 * Usage:  node verify.mjs --review <review.json>
 * Output: { "pass": bool, "hardFailures":[{id,check,detail}], "softFindings":[...] }
 * Exit:   0 pass · 1 hard failure · 2 usage/input error
 */
import { readFileSync } from "node:fs";

const SEVERITIES = new Set(["fatal", "major", "minor", "cosmetic"]);
const LENSES = new Set(["rigor", "clarity", "integrity", "literature"]);
const MODES = new Set(["author", "reviewer", "examiner"]);
const WORKTYPES = new Set(["manuscript", "thesis", "short-form"]);
const RECS = new Set(["accept", "minor", "major", "reject"]);
const VAGUE = /\b(unclear|weak|vague|poor|bad|confusing|awkward|needs (?:work|improvement)|could be (?:better|improved)|not (?:clear|good|great))\b/i;
// A *specific* location reference carries a number or a § symbol (e.g. "Table 3",
// "§2.3", "p.6", "Figure 2"). A bare locator noun like "section" is NOT specific —
// otherwise "this section is weak" would dodge the vague check.
const REFHINT = /(§|\d)/i;

function die(msg, code = 2) {
  process.stderr.write(String(msg).replace(/\n*$/, "\n"));
  process.exit(code);
}
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "-h" || t === "--help") { out.help = true; continue; }
    if (t.startsWith("--")) {
      const k = t.slice(2), n = argv[i + 1];
      if (n === undefined || n.startsWith("--")) out[k] = true; else { out[k] = n; i++; }
    }
  }
  return out;
}
function words(s) { const m = String(s || "").trim().match(/\S+/g); return m ? m.length : 0; }
function nonEmpty(s) { return typeof s === "string" && s.trim().length > 0; }

/** A finding whose `problem` is essentially just a vague adjective. */
function isVagueOnly(problem) {
  const p = String(problem || "");
  if (!VAGUE.test(p)) return false;
  if (words(p) > 8) return false;      // long enough to carry specifics
  if (REFHINT.test(p)) return false;   // mentions a location/number/figure
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { process.stdout.write("Usage: node verify.mjs --review <review.json>\n"); process.exit(0); }
  if (typeof args.review !== "string") die("Error: missing required flag --review <review.json>");

  let review;
  try { review = JSON.parse(readFileSync(args.review, "utf8")); }
  catch (e) { die(`Error: cannot read/parse review JSON "${args.review}": ${e.message}`); }

  const hard = [], soft = [];
  const push = (arr, id, check, detail) => arr.push({ id, check, detail });

  // --- top-level shape ---
  if (!MODES.has(review.mode)) push(hard, "top", "mode", `mode must be one of ${[...MODES].join("|")}`);
  if (!WORKTYPES.has(review.workType)) push(hard, "top", "workType", `workType must be one of ${[...WORKTYPES].join("|")}`);
  const findings = Array.isArray(review.findings) ? review.findings : null;
  if (!findings) { push(hard, "top", "findings", "findings must be an array"); }

  // --- per-finding checks ---
  for (const f of findings || []) {
    const id = f && f.id ? String(f.id) : "(no id)";
    if (!f || typeof f !== "object") { push(hard, id, "shape", "finding is not an object"); continue; }
    if (!SEVERITIES.has(f.severity)) push(hard, id, "severity", `severity must be one of ${[...SEVERITIES].join("|")}`);
    if (!LENSES.has(f.lens)) push(hard, id, "lens", `lens must be one of ${[...LENSES].join("|")}`);
    if (!nonEmpty(f.location)) push(hard, id, "location", "finding has no location (section/page/line/figure)");
    if (!nonEmpty(f.problem)) push(hard, id, "problem", "finding has no problem statement");
    if (!nonEmpty(f.why)) push(hard, id, "why", "finding has no rationale (why it matters)");
    if (isVagueOnly(f.problem)) push(hard, id, "vague", `finding is vague — "${String(f.problem).trim()}" states no specifics or location`);
    if (review.mode === "author" && (f.severity === "fatal" || f.severity === "major") && !nonEmpty(f.fix))
      push(hard, id, "author-fix", `author-mode ${f.severity} finding has no concrete fix`);
    if ((f.lens === "integrity" || f.lens === "literature") && !nonEmpty(f.evidence) && f.verifyFlag !== true)
      push(hard, id, "evidence", `${f.lens} finding is a bare accusation — needs evidence or verifyFlag`);
  }

  // --- reviewer-mode report completeness ---
  if (review.mode === "reviewer") {
    if (!RECS.has(review.recommendation)) push(hard, "report", "recommendation", `reviewer mode needs a recommendation (${[...RECS].join("|")})`);
    if (!nonEmpty(review.recommendationRationale)) push(hard, "report", "recommendationRationale", "reviewer mode needs a recommendation rationale");
    if (!Array.isArray(review.pointsToAuthors) || review.pointsToAuthors.length === 0)
      push(hard, "report", "pointsToAuthors", "reviewer mode needs a non-empty pointsToAuthors list");
  }

  // --- SOFT: calibration sanity ---
  if (findings && findings.length >= 3) {
    const sev = findings.map((f) => f && f.severity);
    if (sev.every((s) => s === "major" || s === "fatal"))
      push(soft, "calibration", "calibration", "every finding is major/fatal — recheck severity calibration");
    if (sev.every((s) => s === "cosmetic"))
      push(soft, "calibration", "calibration", "every finding is cosmetic — is nothing substantive wrong?");
  }

  const output = { pass: hard.length === 0, hardFailures: hard, softFindings: soft };
  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
  process.exit(hard.length ? 1 : 0);
}
main();
