# Concierge setup — Paperclip & Google Docs

This is the step-by-step the skill uses to provision its two external dependencies. **Read the framing first — it changes when you run these.**

## How setup is sequenced (value first, just-in-time)

Setup is **not** an upfront wall. The skill opens with your science — intake and idea-shaping need no external service — and provisions each dependency only at the step that first needs it:

- **Paperclip** is set up at the **literature briefing** (workflow step 3), when the skill first goes looking for real papers.
- **Google Docs** is set up at **first write-out** (workflow step 5), when there's an actual draft to put somewhere.

So you'll meet this file twice, a few minutes apart, never as a single gate before any value lands. Each block below is self-contained — the skill surfaces only the one you need, when you need it. Setup is **one-time**: once connected, later runs skip straight to drafting.

---

## 1. Paperclip — real literature & citations

Paperclip is how the skill finds real supporting papers (full-text PMC / bioRxiv / medRxiv / arXiv / OpenAlex / FDA / ClinicalTrials) instead of inventing references. You need **one** of the two paths below. Both need a free API key.

### Get an API key (≈1 min, needed either way)

1. Open the key portal: **https://paperclip.gxl.ai** (sign in / sign up — free tier is fine for literature search).
2. Create an API key and copy it. It looks like `pk-…`. Keep it handy for the commands below.

### Path A — CLI install (RECOMMENDED — works immediately, no restart)

This is the path to prefer. It installs a `paperclip` command the skill can call straight through Bash in the **current** session — there's nothing to reload.

```bash
curl -fsSL https://paperclip.gxl.ai/install.sh | bash
```

Then make your key available to it (replace `pk-your-key-here` with the key you copied):

```bash
export PAPERCLIP_API_KEY="pk-your-key-here"
```

To persist it across shells, add that same `export` line to your `~/.zshrc` (or `~/.bashrc`).

Verify it works (this should return results, not an auth error):

```bash
paperclip search "PET kinetic modeling parametric imaging" --limit 3
```

**Time:** ~30–60 s for the install, instant to use. **No Claude Code restart required** — this is exactly why it's the recommended path.

### Path B — MCP install (also supported; usually needs a restart)

The MCP path wires Paperclip in as native `mcp__paperclip__*` tools. It's a clean integration, but **a newly-added MCP server usually does not load until Claude Code is restarted** — so expect to add it, restart, and come back. Use Path A if you want to keep moving in this session.

```bash
claude mcp add --transport http paperclip https://paperclip.gxl.ai/mcp --header "Authorization: Bearer pk-your-key-here"
```

The auth is an HTTP header on the request — the exact form is:

```
Authorization: Bearer pk-your-key-here
```

(Replace `pk-your-key-here` with your real key. The whole `Authorization: Bearer <key>` string is what goes after `--header`, quoted as one argument.)

Confirm it registered:

```bash
claude mcp list
```

You should see `paperclip` listed. **Then restart Claude Code** so the new server's tools load — until you do, the `mcp__paperclip__*` tools won't be callable even though `mcp list` shows the server. After restarting, a test query through the tool should return papers.

**Time:** ~1 min to add, **plus a restart** and re-entry into the skill. That round-trip is the reason Path A is preferred for an in-flight session.

### If you decline Paperclip — PubMed fallback

If you'd rather not set up Paperclip at all, the skill falls back to **PubMed** via the google-docs `cite_search_pubmed` / `cite_lookup_doi` tools. This still gets you **real, resolvable citations** — no fabrication, ever — but literature search is **degraded**: PubMed alone won't reach preprints (bioRxiv/medRxiv/arXiv), full text, FDA, or ClinicalTrials, so novelty-checking and state-of-the-art coverage are thinner than with Paperclip. The skill will say so honestly rather than pretend the coverage is equivalent.

---

## 2. Google Docs — where the proposal is written

The skill writes the finished proposal into a Google Doc via the **google-docs MCP** (`create_document` → `write_document` / `replace_section`, managed references, figures via `insert_image`). It's set up at first write-out, not before.

### Connect / authorize

1. Check whether it's already wired in:

   ```bash
   claude mcp list
   ```

   If `google-docs` appears and is healthy, you're done — skip to drafting.

2. If it's present but unauthorized, the skill's first `create_document` call triggers an **OAuth consent flow** — a browser window asking you to sign in to Google and grant document access. Complete it once; the token is cached for later runs.

3. If the server isn't present at all, add it, then **restart Claude Code** (same MCP-reload reality as Paperclip — a freshly added MCP usually won't load until you restart), then run the auth flow above.

### Likely outcome on an institutional account: the Workspace OAuth block

If your Google account is a **managed institutional Workspace** account (e.g. a `…@med.uni-muenchen.de` org account), the OAuth consent may be **blocked by an admin policy** — you'll see something like *"access blocked: this app is not verified / your organization does not allow…"*. 

**That's your org's policy, not anything you did wrong.** Your options:

- Ask your Workspace admin to allow the app (often slow, sometimes a non-starter), **or**
- Authorize with a **personal** Google account instead (if your institution permits drafting there), **or**
- Just use the Markdown / `.docx` delivery below — which is a first-class path, not a consolation prize.

### Markdown / .docx delivery — a first-class option, not "degraded"

If Google Docs is blocked, declined, or you simply prefer a local file, the skill delivers the **same** submission-ready proposal as a **Markdown file** (and can convert to `.docx`). You get the identical structure, the same managed references, the same figures — just in a file you own outright, with no third-party account in the loop. Many users prefer this regardless of OAuth.

Convert Markdown to `.docx` with pandoc if you want a Word file to hand to your office:

```bash
pandoc proposal.md -o proposal.docx
```

(`brew install pandoc` if you don't have it.)

The skill treats this as a real delivery target. It will offer to set up Google Docs again next time, but it never holds the proposal hostage to it.

---

## 3. research-visuals — figures (no setup)

Figures (the conceptual diagram, the Gantt/timeline, preliminary-data plots) are produced by the **research-visuals** skill, already part of ATELIER. Nothing to install — it's invoked only if the proposal needs a figure.

---

## Quick reference

| Dependency | When provisioned | Fastest path | Restart needed? | Fallback |
|---|---|---|---|---|
| Paperclip | Literature briefing (step 3) | CLI: `curl -fsSL https://paperclip.gxl.ai/install.sh \| bash` | **No** (CLI) / Yes (MCP) | PubMed (`cite_*` tools) |
| Google Docs | First write-out (step 5) | OAuth on first `create_document` | Yes, if newly added | Markdown / `.docx` |
| research-visuals | When a figure is needed | already in ATELIER | No | — |
