// Tiny static server for dist/ that mimics vercel.json: clean URLs, redirects, 404 page.
// Used by the browser tests; `node tests/server.mjs` serves on http://localhost:4173.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const vercel = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };

const redirect = (path) => {
  for (const r of vercel.redirects || []) {
    const re = new RegExp(`^${r.source.replace(/:(\w+)/g, "(?<$1>[^/]+)")}$`);
    const m = path.match(re);
    if (m) return r.destination.replace(/:(\w+)/g, (_, k) => m.groups[k]);
  }
  return null;
};

const isFile = async (p) => { try { return (await stat(p)).isFile(); } catch { return false; } };

export function serve(port = 4173) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const to = redirect(url.pathname);
    if (to) { res.writeHead(308, { Location: to + url.search }); return res.end(); }
    if (url.pathname.endsWith(".html")) { res.writeHead(308, { Location: url.pathname.slice(0, -5) + url.search }); return res.end(); }
    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, "");
    const candidates = rel === "" || rel === "." ? ["index.html"] : [rel, `${rel}.html`];
    for (const c of candidates) {
      const p = join(DIST, c);
      if (p.startsWith(DIST) && (await isFile(p))) {
        res.writeHead(200, { "Content-Type": TYPES[extname(p)] || "application/octet-stream" });
        return res.end(await readFile(p));
      }
    }
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    res.end(await readFile(join(DIST, "404.html")));
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 4173;
  await serve(port);
  console.log(`Serving dist/ on http://localhost:${port}`);
}
