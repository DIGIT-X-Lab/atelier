import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const VERIFY = join(here, "verify.mjs");
const FIX = (name) => join(here, "fixtures", name);

/** Run verify.mjs on a fixture; return {code, json}. */
function run(fixture) {
  try {
    const out = execFileSync("node", [VERIFY, "--review", FIX(fixture)], { encoding: "utf8" });
    return { code: 0, json: JSON.parse(out) };
  } catch (e) {
    // execFileSync throws on non-zero exit; stdout still holds our JSON.
    return { code: e.status, json: JSON.parse(e.stdout) };
  }
}

test("good author review passes", () => {
  const { code, json } = run("good-author.json");
  assert.equal(code, 0);
  assert.equal(json.pass, true);
  assert.equal(json.hardFailures.length, 0);
});

test("missing location is a hard failure", () => {
  const { code, json } = run("bad-missing-location.json");
  assert.equal(code, 1);
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /location/i.test(f.detail)));
});

test("vague-only finding is a hard failure", () => {
  const { json } = run("bad-vague.json");
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /vague/i.test(f.check + f.detail)));
});

test("bare accusation without evidence is a hard failure", () => {
  const { json } = run("bad-bare-accusation.json");
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /evidence/i.test(f.detail)));
});

test("reviewer mode without recommendation is a hard failure", () => {
  const { json } = run("bad-reviewer-no-rec.json");
  assert.equal(json.pass, false);
  assert.ok(json.hardFailures.some((f) => /recommendation/i.test(f.detail)));
});
