// Fabric cards and the fabric library. One canonical record per fabric
// (src/data.mjs); categories are looked up, never duplicated.
import { categories, fabrics, fabricCategories } from "./data.mjs";
import { esc, icon } from "./util.mjs";

export const fabricById = Object.fromEntries(fabrics.map((f) => [f.id, f]));

const swatch = (f, eager = false) =>
  `<img class="fcard__tx" src="/img/tx/${f.id}.svg" alt="" width="400" height="400"${eager ? "" : ' loading="lazy"'} decoding="async">`;

/**
 * One fabric: name, illustrative texture, the categories DCT lists it for and a
 * quote action. `inCategory` (a slug) pre-fills that category in the enquiry.
 */
export function fabricCard(f, { inCategory = "", headingLevel = 3, anchor = false } = {}) {
  const cats = fabricCategories(f.id);
  const h = `h${headingLevel}`;
  const ask = `/contact?${inCategory ? `category=${inCategory}&` : ""}fabric=${f.id}`;
  return `
<article class="fcard"${anchor ? ` id="fabric-${f.id}"` : ""} data-cats="${cats.map((c) => c.slug).join(" ")}">
  <figure class="fcard__sw" style="--tint:${f.tint}">${swatch(f)}<figcaption>Illustrative texture</figcaption></figure>
  <div class="fcard__body">
    <${h} class="fcard__name">${esc(f.name)}</${h}>
    <p class="fcard__k">Listed for</p>
    <ul class="fcard__cats">${cats.map((c) => `<li><a href="/clothing/${c.slug}">${esc(c.title)}</a></li>`).join("")}</ul>
    <a class="fcard__ask" href="${ask}">Ask about ${esc(f.name)} ${icon.arrow}</a>
  </div>
</article>`;
}

/** Category filter + every fabric card (the /fabrics page). */
export function fabricLibrary() {
  const withFabrics = categories.filter((c) => c.fabrics.length);
  return `
<div class="flib" data-flib>
  <div class="flib__filter" role="group" aria-label="Show fabrics for">
    <button type="button" class="seg is-on" data-flib-filter="all" aria-pressed="true">All fabrics <span>${fabrics.length}</span></button>
    ${withFabrics.map((c) => `<button type="button" class="seg" data-flib-filter="${c.slug}" aria-pressed="false">${esc(c.title)} <span>${c.fabrics.length}</span></button>`).join("")}
  </div>
  <p class="flib__count" aria-live="polite" data-flib-count>Showing all ${fabrics.length} fabrics</p>
  <div class="fgrid">
    ${fabrics.map((f) => fabricCard(f, { headingLevel: 2, anchor: true })).join("")}
  </div>
</div>`;
}
