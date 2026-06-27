#!/usr/bin/env node
/**
 * serve.mjs — ATELIER live preview.
 *
 * Static file server + file-watch live reload (SSE) + a /api/select endpoint that records
 * a chooser selection to .atelier-selection.json (so the palette/font pick is captured
 * without leaving the browser).
 *
 * Usage:  node serve.mjs [--root <dir>] [--port 4178]
 * Then open e.g. http://localhost:4178/scripts/render_swatches.html
 */
import { createServer } from "node:http";
import { readFile, writeFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { join, extname, resolve, normalize } from "node:path";

const arg = (f, d) => { const i = process.argv.indexOf(f); return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : d; };
const ROOT = resolve(arg("--root", "."));
const PORT = Number(arg("--port", "4178"));
const clients = new Set();

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".gz": "application/gzip", ".nii": "application/octet-stream" };

const LIVE = `<script>new EventSource('/__live').onmessage=()=>location.reload();</script>`;

const server = createServer(async (req, res) => {
  if (req.url === "/__live") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write("\n"); clients.add(res); req.on("close", () => clients.delete(res)); return;
  }
  if (req.url === "/api/select" && req.method === "POST") {
    let body = ""; for await (const c of req) body += c;
    try { await writeFile(join(ROOT, ".atelier-selection.json"), body); console.log("→ selection:", body); } catch {}
    res.writeHead(200, { "Content-Type": "application/json" }); res.end('{"ok":true}'); return;
  }
  let p = normalize(decodeURIComponent(req.url.split("?")[0])); if (p === "/") p = "/index.html";
  const file = join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end("forbidden"); return; }
  try {
    const s = await stat(file);
    if (s.isDirectory()) { res.writeHead(302, { Location: p.replace(/\/?$/, "/index.html") }); res.end(); return; }
    let data = await readFile(file);
    const ext = extname(file);
    if (ext === ".html") data = Buffer.from(data.toString().replace("</body>", LIVE + "</body>"));
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" }); res.end(data);
  } catch { res.writeHead(404); res.end("not found"); }
});

let timer = null;
watch(ROOT, { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => { for (const c of clients) c.write("data: reload\n\n"); }, 80);
});

server.listen(PORT, () => console.log(`ATELIER serving ${ROOT}\n  → http://localhost:${PORT}/  (live reload on)`));
