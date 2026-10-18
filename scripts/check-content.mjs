// Scans every built page for content the owner brief prohibits. Exits non-zero on any hit.
// Run automatically at the end of `npm run build`.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

const RULES = [
  ["currency symbol", /₹|\bINR\b|\bRs\.?\s?\d/],
  ["price wording", /\bprice[ -]?(tier|range|from|list)\b|\bfrom ₹|starting (at|from)|per[- ]piece|budget[- ]friendly|affordable|cheap|lowest|best price|discount|wholesale rate|mid-range|slab-wise|priceRange|"price"|lowPrice|AggregateOffer|"offers"/i],
  ["brand-like fabric name", /lacoste|lycra/i],
  ["placeholder text", /\[(PHOTO|VIDEO|HERO VIDEO|MACRO PHOTO)|XXXX|\bplaceholder\b(?!=)|to be confirmed|\btbc\b|lorem/i],
  ["unverified claim", /GSTIN|GST invoice|verified customer|google reviews|\b\d{2,3},000\+?\s*(pieces|pcs)|happy clients|years of making|pieces \/ month/i],
  ["rating markup", /aggregateRating|"ratingValue"|out of 5 stars/i],
];

const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|xml|txt|webmanifest|js|json|svg)$/.test(f) && !p.includes(`${join("vendor")}`)) files.push(p);
  }
})(DIST);

let hits = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const [name, re] of RULES) {
    const m = text.match(re);
    if (m) {
      hits++;
      const at = text.indexOf(m[0]);
      console.error(`✖ ${name}: "${m[0]}" in ${file.replace(DIST, "dist/")} …${text.slice(Math.max(0, at - 50), at + 50).replace(/\s+/g, " ")}…`);
    }
  }
}
if (hits) {
  console.error(`\n✖ Content check failed: ${hits} prohibited item(s).`);
  process.exit(1);
}
console.log(`✔ Content check passed: ${files.length} files, no prices, brand names, placeholders or unverified claims.`);
