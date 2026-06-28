#!/usr/bin/env node
/**
 * verify.mjs — machine-checked gate for the grant-proposals skill (ATELIER).
 *
 * The deterministic, dependency-free analog of research-visuals' `__qa`: it reads a
 * proposal draft (markdown/plain text) plus an agency profile JSON, runs the AUTO
 * checklist items the profile declares, and reports blocking HARD failures vs advisory
 * SOFT findings.
 *
 * Usage:
 *   node verify.mjs --draft <draft.md> --agency <path-to-agency.json> [--mechanism R01]
 *
 * Output (stdout, JSON):
 *   { "pass": bool, "hardFailures": [{id,check,detail}], "softFindings": [{id,check,detail}] }
 *
 * Exit code: 0 if no hard failures, 1 if any hard failure, 2 on a usage / input error.
 *
 * AUTO checklist kinds handled (driven by each checklist item's `autoKind`):
 *   - page-limit          : estimate pages (~500 words/page) and compare to the limit
 *   - word-limit          : count words and compare to the word limit
 *   - required-sections   : confirm each required section title is present (fuzzy heading match)
 *   - citations-resolve   : every in-text citation has a backing entry in the draft's own
 *                           References/Bibliography section (NO network in v1)
 *   - aim-interdependence : flag language that makes aims depend on one another
 *
 * Design notes:
 *   - No network, no third-party deps. Pure Node ESM + the standard library.
 *   - The agency JSON supplies the limits/rules; this script supplies the mechanics.
 *   - Each AUTO check only emits a finding when something is WRONG. A clean check is silent.
 *   - `hard:true` checklist items route to hardFailures (blocking); `hard:false` to softFindings.
 */

import { readFileSync } from "node:fs";

// Words-per-page heuristic used to estimate page count from a plain-text draft.
const WORDS_PER_PAGE = 500;

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const USAGE = `Usage:
  node verify.mjs --draft <draft.md> --agency <path-to-agency.json> [--mechanism <id>]

Arguments:
  --draft      Path to the proposal draft (markdown or plain text).   [required]
  --agency     Path to the agency profile JSON (assets/agencies/*).   [required]
  --mechanism  Mechanism id (e.g. R01, StG, Sachbeihilfe) to apply
               per-mechanism limits/sections.                          [optional]

Outputs JSON { pass, hardFailures[], softFindings[] } to stdout.
Exit 0 = passed, 1 = hard failure(s), 2 = usage/input error.`;

/**
 * Parse `--flag value` style args into a plain object. Unknown flags are kept so a
 * typo surfaces as a "missing required flag" rather than being silently dropped.
 */
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const tok = argv[i];
    if (tok === "-h" || tok === "--help") {
      out.help = true;
      continue;
    }
    if (tok.startsWith("--")) {
      const key = tok.slice(2);
      const next = argv[i + 1];
      // A flag with no following value (or followed by another flag) is treated as a boolean.
      if (next === undefined || next.startsWith("--")) {
        out[key] = true;
      } else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

/** Print a message to stderr and exit with the given code. */
function die(message, code = 2) {
  process.stderr.write(message.replace(/\n*$/, "\n"));
  process.exit(code);
}

// ---------------------------------------------------------------------------
// Text utilities
// ---------------------------------------------------------------------------

/** Lowercase, collapse whitespace — used for fuzzy title/heading comparison. */
function norm(s) {
  return String(s == null ? "" : s)
    .toLowerCase()
    .replace(/[`*_#>~]/g, " ")        // strip common markdown emphasis/heading chars
    .replace(/[^a-z0-9\s]/g, " ")     // drop punctuation
    .replace(/\s+/g, " ")
    .trim();
}

/** Count words in a chunk of text (whitespace-delimited, ignoring empties). */
function countWords(text) {
  const m = text.trim().match(/\S+/g);
  return m ? m.length : 0;
}

/**
 * Locate a "References" / "Bibliography" / "Literature cited" / "Works cited" heading and
 * return everything after it as the reference list. Returns "" when no such section exists.
 */
function extractReferences(text) {
  const lines = text.split(/\r?\n/);
  const headingRe =
    /^\s*(#{1,6}\s*)?(?:\d+[.)]\s*)?(references|bibliography|literature\s+cited|works\s+cited|reference\s+list)\s*:?\s*$/i;
  for (let i = 0; i < lines.length; i++) {
    if (headingRe.test(lines[i])) {
      return lines.slice(i + 1).join("\n");
    }
  }
  return "";
}

/**
 * Split the body (everything before the references section) from the references block.
 * In-text citations are searched only in the body so reference entries don't self-resolve.
 */
function splitBodyAndRefs(text) {
  const refs = extractReferences(text);
  if (!refs) return { body: text, refs: "" };
  const idx = text.length - refs.length;
  // Trim the heading line itself off the body for cleanliness.
  const bodyWithHeading = text.slice(0, idx);
  const body = bodyWithHeading.replace(
    /(?:^|\n)\s*(?:#{1,6}\s*)?(?:\d+[.)]\s*)?(?:references|bibliography|literature\s+cited|works\s+cited|reference\s+list)\s*:?\s*$/i,
    ""
  );
  return { body, refs };
}

// ---------------------------------------------------------------------------
// AUTO check implementations
//   Each returns { ok: bool, detail: string }. `ok:false` produces a finding.
// ---------------------------------------------------------------------------

/** page-limit: estimate pages from word count and compare to the applicable limit. */
function checkPageLimit(ctx) {
  const { limits } = ctx;
  const limit = ctx.mechLimits.totalPages ?? limits.totalPages ?? null;
  if (limit == null) {
    return { ok: true, detail: `no page limit declared in profile — skipped` };
  }
  const words = ctx.bodyWords; // page limits apply to narrative, not the reference list
  const pages = words / WORDS_PER_PAGE;
  const pagesRounded = Math.round(pages * 10) / 10;
  if (pages > limit) {
    return {
      ok: false,
      detail:
        `estimated ~${pagesRounded} pages (${words} words / ${WORDS_PER_PAGE} wpp) ` +
        `exceeds the ${limit}-page limit${ctx.mechName ? ` for ${ctx.mechName}` : ""}`,
    };
  }
  return {
    ok: true,
    detail: `~${pagesRounded} pages within the ${limit}-page limit`,
  };
}

/** word-limit: count words and compare to the applicable word limit. */
function checkWordLimit(ctx) {
  const { limits } = ctx;
  const limit = ctx.mechLimits.wordLimit ?? limits.wordLimit ?? null;
  if (limit == null) {
    return { ok: true, detail: `no word limit declared in profile — skipped` };
  }
  const words = ctx.bodyWords;
  if (words > limit) {
    return {
      ok: false,
      detail: `${words} words exceeds the ${limit}-word limit${
        ctx.mechName ? ` for ${ctx.mechName}` : ""
      }`,
    };
  }
  return { ok: true, detail: `${words} words within the ${limit}-word limit` };
}

/**
 * required-sections: confirm every required section title is present via fuzzy match.
 * A title matches if its normalized form appears as (or within) any heading line, or as
 * a substring of the normalized full body — tolerant of "1. Background" vs "Background".
 */
function checkRequiredSections(ctx) {
  // Combine the profile's own required sections with any the active mechanism declares.
  const sections = [
    ...(Array.isArray(ctx.profile.sections) ? ctx.profile.sections : []),
    ...(Array.isArray(ctx.mechLimits.sections) ? ctx.mechLimits.sections : []),
  ];
  const required = sections.filter((s) => s && s.required !== false && s.title);
  if (required.length === 0) {
    return { ok: true, detail: `no required sections declared — skipped` };
  }

  // Gather heading lines from the draft (markdown ATX, "Section:" lines, numbered, ALL-CAPS).
  const headingLines = ctx.draft
    .split(/\r?\n/)
    .filter((ln) =>
      /^\s*#{1,6}\s+\S/.test(ln) ||                 // # Heading
      /^\s*\d+[.)]\s+\S/.test(ln) ||                // 1. Heading / 1) Heading
      /^\s*[A-Z][^.!?]{0,80}:\s*$/.test(ln) ||      // Heading:
      /^\s*[A-Z0-9][A-Z0-9 \-/&]{3,}\s*$/.test(ln)  // ALL CAPS HEADING
    )
    .map(norm);
  const normHeadings = headingLines.join("  ");
  const normBody = norm(ctx.draft);

  const missing = [];
  for (const sec of required) {
    const t = norm(sec.title);
    if (!t) continue;
    const found =
      normHeadings.includes(t) ||
      normBody.includes(t) ||
      // tolerate minor wording: require all "significant" title tokens to co-occur in a heading
      titleTokensInHeadings(t, headingLines);
    if (!found) missing.push(sec.title);
  }

  if (missing.length) {
    return {
      ok: false,
      detail: `missing required section(s): ${missing.join("; ")}`,
    };
  }
  return { ok: true, detail: `all ${required.length} required sections present` };
}

/** Helper: do all meaningful tokens of a title appear together in any single heading? */
function titleTokensInHeadings(normTitle, headingLines) {
  const stop = new Set([
    "the", "a", "an", "and", "of", "to", "for", "in", "on", "with", "section", "part",
  ]);
  const tokens = normTitle.split(" ").filter((w) => w.length > 2 && !stop.has(w));
  if (tokens.length === 0) return false;
  return headingLines.some((h) => tokens.every((tok) => h.includes(tok)));
}

/**
 * citations-resolve: find in-text citations and confirm each has a backing entry in the
 * draft's own References/Bibliography section. v1 does NOT hit the network — it matches
 * against the draft's reference list only. Unresolved citations are flagged.
 *
 * Recognized in-text forms:
 *   [@key]            pandoc/markdown citekeys (also [@k1; @k2])
 *   [12] / [3,5-7]    numeric reference markers
 *   (Author, 2020)    author-year parentheticals (also (Author et al., 2020))
 *   10.1000/xyz       bare DOIs
 */
function checkCitationsResolve(ctx) {
  const { body, refs } = ctx.split;
  if (!refs.trim()) {
    // No reference list at all: if the body cites anything, that's unresolved across the board.
    const anyCite =
      /\[@[^\]]+\]|\[\d|\(\s*[A-Z][A-Za-z'’-]+(?:\s+et\s+al\.?|\s*,)?[^)]*\b(1[89]|20)\d{2}[a-z]?\s*\)|\b10\.\d{4,9}\/\S+/.test(
        body
      );
    if (anyCite) {
      return {
        ok: false,
        detail:
          `draft contains in-text citations but has no References/Bibliography section to resolve them against`,
      };
    }
    return { ok: true, detail: `no citations and no reference list — nothing to resolve` };
  }

  const normRefs = norm(refs);
  const unresolved = [];
  const seen = new Set();
  const flag = (label, resolved) => {
    if (resolved) return;
    if (seen.has(label)) return;
    seen.add(label);
    unresolved.push(label);
  };

  // (1) pandoc citekeys: [@smith2020], [@a; @b]
  for (const m of body.matchAll(/\[@([^\]]+)\]/g)) {
    const keys = m[1].split(/[;,]/).map((s) => s.trim().replace(/^@/, "")).filter(Boolean);
    for (const key of keys) {
      const nk = norm(key);
      // resolve if the citekey, or its author/year fragments, appear in the reference list
      const resolved =
        normRefs.includes(nk) || refs.includes(key) || citekeyParts(key, refs, normRefs);
      flag(`[@${key}]`, resolved);
    }
  }

  // (2) numeric markers: [12], [3, 5], [4-6]  (skip pandoc [@...] already handled)
  for (const m of body.matchAll(/\[(\d[\d\s,–—-]*)\]/g)) {
    const nums = expandNumberRanges(m[1]);
    for (const n of nums) {
      const resolved = numericRefPresent(n, refs);
      flag(`[${n}]`, resolved);
    }
  }

  // (3) author-year parentheticals: (Smith, 2020), (Smith et al., 2020), (Smith & Lee 2019)
  const ayRe =
    /\(([A-Z][A-Za-z'’.-]+(?:\s+(?:et\s+al\.?|and|&|,)\s*[A-Za-z'’.-]+)*)[,\s]+((?:1[89]|20)\d{2}[a-z]?)\)/g;
  for (const m of body.matchAll(ayRe)) {
    const author = m[1].replace(/\bet\s+al\.?/i, "").replace(/[,&]/g, " ").trim().split(/\s+/)[0];
    const year = m[2];
    const resolved =
      normRefs.includes(norm(author)) && refs.includes(year.replace(/[a-z]$/, ""));
    flag(`(${m[1].trim()}, ${year})`, resolved && norm(author).length > 1);
  }

  // (4) bare DOIs in the body
  for (const m of body.matchAll(/\b(10\.\d{4,9}\/[^\s)>\]]+)/g)) {
    const doi = m[1].replace(/[.,;]+$/, "");
    const resolved = refs.includes(doi) || normRefs.includes(norm(doi));
    flag(doi, resolved);
  }

  if (unresolved.length) {
    return {
      ok: false,
      detail: `unresolved citation(s) with no backing reference-list entry: ${unresolved.join(", ")}`,
    };
  }
  return { ok: true, detail: `all in-text citations resolve to the reference list` };
}

/** Does a citekey's author/year fragment appear in the references? e.g. smith2020 -> smith + 2020. */
function citekeyParts(key, refs, normRefs) {
  const ym = key.match(/(1[89]|20)\d{2}/);
  const author = key.replace(/(1[89]|20)\d{2}.*$/, "").replace(/[^A-Za-z]/g, "");
  if (author.length >= 3 && normRefs.includes(norm(author))) {
    if (!ym) return true;
    return refs.includes(ym[0]);
  }
  return false;
}

/** Expand a numeric marker body like "3, 5-7" into [3,5,6,7]. */
function expandNumberRanges(s) {
  const out = [];
  for (const part of s.split(/\s*,\s*/)) {
    const range = part.match(/^(\d+)\s*[–—-]\s*(\d+)$/);
    if (range) {
      let a = parseInt(range[1], 10);
      let b = parseInt(range[2], 10);
      if (a <= b && b - a < 1000) for (let n = a; n <= b; n++) out.push(n);
    } else {
      const n = parseInt(part, 10);
      if (Number.isFinite(n)) out.push(n);
    }
  }
  return out;
}

/**
 * Is reference number `n` present as a list entry? Matches "12.", "[12]", "(12)" or "12)"
 * at the start of a line, tolerating a leading markdown bullet ("- ", "* ", "• ").
 */
function numericRefPresent(n, refs) {
  const re = new RegExp(
    `(^|\\n)\\s*(?:[-*•]\\s*)?(?:\\[${n}\\]|\\(${n}\\)|${n}[.)])(\\s|$)`,
    "m"
  );
  return re.test(refs);
}

/**
 * aim-interdependence: flag prose that makes one aim depend on another — a classic
 * reviewer reject trigger (if Aim 1 fails, the rest must still stand).
 */
function checkAimInterdependence(ctx) {
  const text = ctx.split.body || ctx.draft;
  const patterns = [
    // "Aim 2 requires/depends on/relies on/is contingent on ... Aim 1"
    /\baim\s*\d+\b[^.\n]{0,80}\b(requires?|depend(?:s|ent)?\s+on|relies?\s+on|contingent\s+(?:up)?on|predicated\s+on|conditional\s+on|hinges?\s+on)\b[^.\n]{0,80}\baim\s*\d+/i,
    // "building on / builds on Aim 1"
    /\b(building|builds?)\s+(?:up)?on\s+(?:the\s+(?:results?|findings?|success)\s+of\s+)?aim\s*\d+/i,
    // "results/data/findings from Aim 1 will enable/inform/feed Aim 2"
    /\b(results?|findings?|data|output|deliverabl\w+)\s+(?:from|of)\s+aim\s*\d+\b[^.\n]{0,90}\b(will|to|then)\b[^.\n]{0,40}\b(enabl\w+|inform\w*|feed\w*|drive\w*|allow\w*|support\w*)\b[^.\n]{0,40}\baim\s*\d+/i,
    // "if Aim 1 fails/is unsuccessful, Aim 2 cannot ..."
    /\bif\s+aim\s*\d+\b[^.\n]{0,60}\b(fails?|unsuccessful|does\s+not\s+(?:work|succeed))\b[^.\n]{0,80}\baim\s*\d+/i,
    // "Aim 2 cannot proceed without/until Aim 1"
    /\baim\s*\d+\b[^.\n]{0,60}\b(cannot|can'?t|won'?t)\b[^.\n]{0,40}\b(proceed|begin|start|continue)\b[^.\n]{0,40}\b(without|until|unless|before)\b[^.\n]{0,40}\baim\s*\d+/i,
    // "prerequisite for Aim 2" / "Aim 1 is a prerequisite"
    /\b(prerequisite|precondition|foundation)\b[^.\n]{0,40}\baim\s*\d+/i,
  ];
  const hits = [];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) hits.push(m[0].replace(/\s+/g, " ").trim().slice(0, 140));
  }
  if (hits.length) {
    return {
      ok: false,
      detail:
        `aims appear interdependent — a reviewer reject trigger. Offending phrase(s): ` +
        hits.map((h) => `"${h}"`).join(" | "),
    };
  }
  return { ok: true, detail: `no aim-interdependence language detected` };
}

// Dispatch table: autoKind -> implementation.
const CHECKS = {
  "page-limit": checkPageLimit,
  "word-limit": checkWordLimit,
  "required-sections": checkRequiredSections,
  "citations-resolve": checkCitationsResolve,
  "aim-interdependence": checkAimInterdependence,
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    process.stdout.write(USAGE + "\n");
    process.exit(0);
  }

  // Validate required flags up front with a clear message.
  const missingFlags = [];
  if (typeof args.draft !== "string") missingFlags.push("--draft <draft.md>");
  if (typeof args.agency !== "string") missingFlags.push("--agency <agency.json>");
  if (missingFlags.length) {
    die(`Error: missing required flag(s): ${missingFlags.join(", ")}\n\n${USAGE}`);
  }

  // Read the draft.
  let draft;
  try {
    draft = readFileSync(args.draft, "utf8");
  } catch (e) {
    die(`Error: cannot read draft file "${args.draft}": ${e.message}`);
  }

  // Read + parse the agency profile JSON.
  let profile;
  try {
    profile = JSON.parse(readFileSync(args.agency, "utf8"));
  } catch (e) {
    die(`Error: cannot read/parse agency JSON "${args.agency}": ${e.message}`);
  }

  const limits = profile.limits || {};
  const mechName = typeof args.mechanism === "string" ? args.mechanism : null;
  // Per-mechanism overrides, if the requested mechanism exists in the profile.
  const mechLimits =
    (mechName && limits.perMechanism && limits.perMechanism[mechName]) || {};
  if (mechName && limits.perMechanism && !limits.perMechanism[mechName]) {
    process.stderr.write(
      `Warning: mechanism "${mechName}" not found in profile.limits.perMechanism — using base limits.\n`
    );
  }

  // Pre-compute shared text views once.
  const split = splitBodyAndRefs(draft);
  const ctx = {
    draft,
    profile,
    limits,
    mechName,
    mechLimits,
    split,
    bodyWords: countWords(split.body),
    totalWords: countWords(draft),
  };

  // The checklist drives which AUTO checks run. Default to [] if absent.
  const checklist = Array.isArray(profile.checklist) ? profile.checklist : [];
  const autoItems = checklist.filter((it) => it && it.auto === true && it.autoKind);

  const hardFailures = [];
  const softFindings = [];

  for (const item of autoItems) {
    const impl = CHECKS[item.autoKind];
    if (!impl) {
      // Unknown autoKind in the profile — surface as a soft finding rather than crash.
      softFindings.push({
        id: item.id || item.autoKind || "unknown",
        check: item.check || `(${item.autoKind})`,
        detail: `unsupported autoKind "${item.autoKind}" — cannot machine-check; review manually`,
      });
      continue;
    }
    let result;
    try {
      result = impl(ctx);
    } catch (e) {
      // A check should never crash the gate; treat an internal error as a soft finding.
      softFindings.push({
        id: item.id || item.autoKind,
        check: item.check || item.autoKind,
        detail: `internal check error: ${e.message}`,
      });
      continue;
    }
    if (!result.ok) {
      const finding = {
        id: item.id || item.autoKind,
        check: item.check || item.autoKind,
        detail: result.detail,
      };
      (item.hard ? hardFailures : softFindings).push(finding);
    }
  }

  const output = {
    pass: hardFailures.length === 0,
    hardFailures,
    softFindings,
  };

  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
  process.exit(hardFailures.length ? 1 : 0);
}

main();
