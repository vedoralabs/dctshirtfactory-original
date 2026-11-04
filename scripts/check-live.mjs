// Checks a deployed copy of the site: every page loads, clean URLs and redirects work,
// the site's own 404 page shows, compression and indexing are right.
//   npm run check:live                       -> checks https://dctshirtfactory.co.in
//   npm run check:live -- https://example.com -> checks another copy
import { site, categories } from "../src/data.mjs";
import { pages } from "../src/pages.mjs";

const base = (process.argv[2] || site.url).replace(/\/$/, "");
const host = new URL(base).host;
const get = (path, opts = {}) => fetch(base + path, { redirect: "manual", ...opts });
let fails = 0;
const check = (ok, label, detail = "") => {
  if (!ok) fails++;
  console.log(`${ok ? "✔" : "✖"} ${label}${!ok && detail ? `  (${detail})` : ""}`);
};

// 1. Every page answers 200 at its clean URL, with the right canonical and no noindex
for (const path of ["/", "/clothing", ...pages.filter((p) => p.path !== "/clothing").map((p) => p.path), ...categories.map((c) => `/clothing/${c.slug}`)]) {
  const r = await get(path);
  const html = r.status === 200 ? await r.text() : "";
  check(r.status === 200, `${path} loads`, `status ${r.status}${r.headers.get("location") ? " → " + r.headers.get("location") : ""}`);
  if (r.status !== 200) continue;
  check(html.includes(`<link rel="canonical" href="${site.url}${path === "/" ? "/" : path}">`), `${path} canonical`);
  check(!/name="robots" content="noindex"/.test(html), `${path} indexable`);
}

// 2. Redirects
const redirects = [
  ["/products/school-uniform", "/clothing/school-uniform"],
  ["/quote", "/contact"],
  ["/clients", "/work"],
  ["/fabrics.html", "/fabrics"],
  ["/fabrics/", "/fabrics"],
  ["/index.html", "/"],
];
for (const [from, to] of redirects) {
  const r = await get(from);
  const loc = r.headers.get("location") || "";
  check([301, 308].includes(r.status) && new URL(loc, base).pathname === to, `${from} redirects to ${to}`, `status ${r.status} ${loc}`);
}
if (!host.startsWith("www.") && !host.startsWith("localhost") && !host.endsWith(".vercel.app")) {
  const r = await fetch(`https://www.${host}/`, { redirect: "manual" }).catch(() => null);
  check(r && [301, 308].includes(r.status) && (r.headers.get("location") || "").startsWith(`https://${host}`), `www.${host} redirects to ${host}`, r ? `status ${r.status}` : "no answer");
  const h = await fetch(`http://${host}/`, { redirect: "manual" }).catch(() => null);
  check(h && [301, 308].includes(h.status) && (h.headers.get("location") || "").startsWith("https://"), "http redirects to https", h ? `status ${h.status}` : "no answer");
}

// 3. Missing pages: status 404 with the site's own page
const nf = await get("/this-page-does-not-exist");
const nfHtml = await nf.text();
check(nf.status === 404, "missing page answers 404", `status ${nf.status}`);
check(nfHtml.includes("Wrong size"), "missing page shows the site's 404 page", "server default page");

// 4. Assets, compression, caching
for (const path of ["/css/site.css", "/js/main.js", "/assistant.json", "/sitemap.xml", "/robots.txt", "/img/og-image.jpg"]) {
  const r = await get(path);
  check(r.status === 200, `${path} loads`, `status ${r.status}`);
}
const gz = await get("/", { headers: { "Accept-Encoding": "gzip, br" } });
check(/gzip|br/.test(gz.headers.get("content-encoding") || ""), "pages are compressed", "no Content-Encoding");
const img = await get("/img/og-image.jpg");
check(/max-age=31536000/.test(img.headers.get("cache-control") || ""), "images cached for a year", img.headers.get("cache-control") || "no Cache-Control");

console.log(fails ? `\n✖ ${fails} check(s) failed on ${base}` : `\n✔ All checks passed on ${base}`);
process.exit(fails ? 1 : 0);
