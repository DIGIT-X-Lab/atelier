#!/usr/bin/env node
/**
 * profile_data.mjs — infer a dataset's shape to drive the plot advisor.
 *
 * Reads CSV / TSV / JSON, infers per-column type (quantitative / categorical / temporal / id),
 * cardinality, missingness, and suggests candidate "relationships" the data can show. The skill
 * feeds this profile + d3-chart-catalog.json to recommend the best-fit chart.
 *
 * Usage:  node profile_data.mjs <data.csv|.tsv|.json>
 * Output: JSON profile on stdout.
 */
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const path = process.argv[2];
if (!path) { console.error("usage: node profile_data.mjs <data.csv|.tsv|.json>"); process.exit(1); }
const raw = readFileSync(path, "utf8");

function parseDelim(text, d) {
  const lines = text.trim().split(/\r?\n/);
  const head = lines[0].split(d).map((s) => s.trim());
  const rows = lines.slice(1).map((l) => { const c = l.split(d); const o = {}; head.forEach((h, i) => (o[h] = (c[i] ?? "").trim())); return o; });
  return { head, rows };
}
let head, rows;
const ext = extname(path).toLowerCase();
if (ext === ".json") {
  const arr = JSON.parse(raw); rows = Array.isArray(arr) ? arr : arr.data || [];
  head = [...new Set(rows.flatMap((r) => Object.keys(r)))];
} else { ({ head, rows } = parseDelim(raw, ext === ".tsv" ? "\t" : ",")); }

const isNum = (v) => v !== "" && v != null && !isNaN(Number(v));
const isDate = (v) => v && /^\d{4}-\d{2}(-\d{2})?/.test(String(v));

const columns = head.map((h) => {
  const vals = rows.map((r) => r[h]).filter((v) => v !== "" && v != null);
  const miss = rows.length - vals.length;
  const uniq = new Set(vals.map(String));
  let type = "categorical";
  if (vals.length && vals.every(isNum)) type = "quantitative";
  else if (vals.length && vals.every(isDate)) type = "temporal";
  if (type === "categorical" && uniq.size === vals.length && /id|name|subject|patient/i.test(h)) type = "id";
  const col = { name: h, type, cardinality: uniq.size, missing: miss };
  if (type === "quantitative") {
    const nums = vals.map(Number).sort((a, b) => a - b);
    col.min = nums[0]; col.max = nums[nums.length - 1];
    col.median = nums[Math.floor(nums.length / 2)];
  }
  return col;
});

const q = columns.filter((c) => c.type === "quantitative");
const cat = columns.filter((c) => c.type === "categorical");
const tmp = columns.filter((c) => c.type === "temporal");

const relationships = [];
if (q.length >= 2) relationships.push(rows.length > 300 ? "density" : "correlation");
if (q.length >= 1 && cat.length >= 1) relationships.push("distribution", "compare groups");
if (tmp.length >= 1 && q.length >= 1) relationships.push("over-time");
if (q.length >= 2 && /pre|post|before|after|baseline|follow/i.test(head.join(" "))) relationships.push("paired");
if (q.length >= 3) relationships.push("multivariate");
if (cat.length >= 1 && q.length >= 1 && cat[0].cardinality <= 12) relationships.push("ranking");

const profile = { file: path, nRows: rows.length, nCols: head.length, columns,
  summary: { quantitative: q.length, categorical: cat.length, temporal: tmp.length },
  candidateRelationships: [...new Set(relationships)] };

console.log(JSON.stringify(profile, null, 2));
