// Checks src/data.mjs for broken references before anything is built.
// Imported by the build and the tests; `node scripts/validate-data.mjs` runs it alone.
import { fileURLToPath } from "node:url";
import * as data from "../src/data.mjs";
import { patterns } from "../src/textures.mjs";

/** Returns a list of problems (empty when the data is consistent). */
export function validate(d = data) {
  const errors = [];
  const dupes = (list, label) => {
    const seen = new Set();
    for (const v of list) {
      if (seen.has(v)) errors.push(`duplicate ${label}: ${v}`);
      seen.add(v);
    }
  };
  const fabricIds = new Set(d.fabrics.map((f) => f.id));
  const slugs = new Set(d.categories.map((c) => c.slug));
  const methods = new Set(d.printMethods.map((m) => m.key));

  dupes(d.fabrics.map((f) => f.id), "fabric id");
  dupes(d.fabrics.map((f) => f.name.toLowerCase()), "fabric name");
  dupes(d.categories.map((c) => c.id), "category id");
  dupes(d.categories.map((c) => c.slug), "category slug");

  for (const f of d.fabrics) {
    if (!/^[a-z0-9-]+$/.test(f.id)) errors.push(`fabric id not URL-safe: ${f.id}`);
    if (!patterns[f.texture]) errors.push(`fabric ${f.id}: unknown texture "${f.texture}"`);
    if (!d.categories.some((c) => c.fabrics.includes(f.id))) errors.push(`fabric ${f.id} is not listed by any category`);
  }
  for (const c of d.categories) {
    dupes(c.fabrics.map((id) => `${c.id}/${id}`), "category fabric");
    for (const id of c.fabrics) if (!fabricIds.has(id)) errors.push(`category ${c.id}: unknown fabric "${id}"`);
    for (const k of c.branding) if (!methods.has(k)) errors.push(`category ${c.id}: unknown customisation "${k}"`);
    if (!c.images.includes(c.heroImage)) errors.push(`category ${c.id}: heroImage not in images`);
  }
  for (const a of d.audiences) for (const s of a.categories) if (!slugs.has(s)) errors.push(`audience ${a.key}: unknown category "${s}"`);
  for (const w of d.concepts) if (!slugs.has(w.cat)) errors.push(`concept ${w.img}: unknown category "${w.cat}"`);
  for (const c of d.clients) if (c.category && !slugs.has(c.category)) errors.push(`client ${c.name}: unknown category "${c.category}"`);
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = validate();
  if (errors.length) {
    for (const e of errors) console.error("✖", e);
    process.exit(1);
  }
  console.log(`✔ Data valid: ${data.categories.length} categories, ${data.fabrics.length} fabrics.`);
}
