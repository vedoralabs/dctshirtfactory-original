// node --test tests/   (no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import * as data from "../src/data.mjs";
import { validate } from "../scripts/validate-data.mjs";
import { waLink, quoteMessage } from "../src/util.mjs";

// Exactly as listed in the DCT implementation brief (Nov 2026), section 06; the last two
// categories (empty in the brief) are from the owner's printed catalogue.
const BRIEF = {
  "School Uniform T-Shirts": ["Lacoste", "Honeycomb", "Mars", "Mars Premium", "Spun Honeycomb", "NJS", "Nirmal", "Superpoly", "Dotknit", "Airtex", "PC Matty"],
  "Marathon T-Shirts": ["Selina", "Dotknit", "Jacquard", "Lycra", "Spandex"],
  "Track Pants / Shorts": ["Superpoly", "Honeycomb", "NJS", "Spun Honeycomb", "Nirmal", "NS Lycra", "Jacquard"],
  "Corporate T-Shirts": ["Pique", "Lacoste", "Mars 200", "Airtex", "PC Matty", "Fine", "Mirror 200"],
  "Gym Wear": ["NS Lycra", "Mirror 200", "Mirror 150X", "Hydra 170", "Spectra 250/300", "Cuba 300"],
  "Hoodies & Varsity Jackets": ["Loopnet", "Superpoly", "Fleece", "Cuba 300"],
  "Sublimation T-Shirts": ["Selina", "Dotknit", "NJS", "Adidas Selina", "Nirmal", "PP", "NS Lycra"],
};

const name = (id) => data.fabrics.find((f) => f.id === id)?.name;

test("data has no broken references", () => {
  assert.deepEqual(validate(), []);
});

test("category titles match the brief exactly, in order", () => {
  assert.deepEqual(data.categories.map((c) => c.title), Object.keys(BRIEF));
});

test("each category lists exactly the brief's fabric names, in order", () => {
  for (const c of data.categories) assert.deepEqual(c.fabrics.map(name), BRIEF[c.title], c.title);
});

test("every fabric name in the brief has one canonical record", () => {
  const all = [...new Set(Object.values(BRIEF).flat())].sort();
  assert.deepEqual(data.fabrics.map((f) => f.name).sort(), all);
});

test("fabric → categories is derived, not duplicated", () => {
  assert.deepEqual(data.fabricCategories("lacoste").map((c) => c.title), ["School Uniform T-Shirts", "Corporate T-Shirts"]);
  assert.deepEqual(data.fabricCategories("hydra-170").map((c) => c.title), ["Gym Wear"]);
});

test("no unconfirmed fabric properties are present", () => {
  for (const f of data.fabrics) {
    assert.equal(f.description, undefined, f.id);
    assert.equal(f.verifiedProperties, undefined, f.id);
  }
});

test("validate() catches a broken reference", () => {
  const broken = { ...data, categories: [{ ...data.categories[0], fabrics: ["nope"] }, ...data.categories.slice(1)] };
  assert.ok(validate(broken).some((e) => e.includes('unknown fabric "nope"')));
});

test("WhatsApp links use the one configured number and encode the text", () => {
  assert.equal(data.site.whatsapp, "918136867309");
  const url = new URL(waLink(quoteMessage({ category: "Track Pants / Shorts", fabric: "Spectra 250/300" })));
  assert.equal(url.origin + url.pathname, "https://wa.me/918136867309");
  const text = url.searchParams.get("text");
  assert.match(text, /^Hello D Creations/);
  assert.match(text, /Category: Track Pants \/ Shorts\nFabric: Spectra 250\/300\n/);
  assert.ok(!/[₹]|price/i.test(text));
});
