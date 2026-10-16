// Standalone pages: each reuses a full homepage-style section, promoted to
// the page's <h1>, with breadcrumbs above it.
import { site, fabrics, products } from "./data.mjs";
import { esc, show, val, isTbc, icon } from "./util.mjs";
import { fabricGuide, work, behind, statsBand, why, quote, faq, faqList, contact, ctaBand } from "./home.mjs";

const crumbs = (name) => `
<div class="wrap page-crumbs">
  <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${esc(name)}</li></ol></nav>
</div>`;

/** Turn the section's first <h2 class="display"> into the page <h1>. */
const promote = (html) => {
  const a = html.indexOf('<h2 class="display"');
  if (a < 0) return html;
  const b = html.indexOf("</h2>", a);
  return html.slice(0, a) + "<h1" + html.slice(a + 3, b) + "</h1>" + html.slice(b + 5);
};

const tierText = (t) => ["", "₹ Budget-friendly", "₹₹ Mid-range", "₹₹₹ Premium"][val(t)];

function fabricTable() {
  return `
<section class="section ftable" aria-labelledby="ftable-title">
  <div class="wrap">
    <h2 class="display display--sm" id="ftable-title">All fabrics side by side</h2>
    <div class="tscroll" tabindex="0" role="region" aria-label="Fabric comparison table">
      <table class="cmp">
        <thead><tr><th scope="col">Fabric</th><th scope="col">Feel</th><th scope="col">GSM</th><th scope="col">Breathability</th><th scope="col">Price tier</th><th scope="col">Best for</th></tr></thead>
        <tbody>
          ${fabrics
            .map(
              (f) => `<tr>
            <th scope="row"><a href="#fabric-${f.key}" data-fabric-link><span class="fab__chip" style="--tint:${f.tint}"></span>${esc(f.name)}</a></th>
            <td data-label="Feel">${esc(f.feel)}</td>
            <td data-label="GSM">${show(f.gsm)}</td>
            <td data-label="Breathability">${f.breathability} / 5</td>
            <td data-label="Price tier">${isTbc(f.priceTier) ? `<span class="tbc" title="Placeholder — to be confirmed by D Creations">${tierText(f.priceTier)}</span>` : tierText(f.priceTier)}</td>
            <td data-label="Best for">${esc(f.bestFor)}</td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <p class="fab__note">Can't decide? <a href="/quote">Start a quote</a> and pick "Help me choose" — we'll suggest the right fabric and can post you swatches.</p>
  </div>
</section>`;
}

function productFaqs() {
  return `
<section class="section pfaqs" aria-labelledby="pfaqs-title">
  <div class="wrap">
    <h2 class="display display--sm" id="pfaqs-title">Questions by product</h2>
    <div class="pfaqs__grid">
      ${products
        .map(
          (p, i) => `
      <div class="pfaqs__group">
        <h3><a href="/products/${p.slug}">${esc(p.name)} ${icon.arrow}</a></h3>
        ${faqList(p.faq.map(([q, a]) => [q, esc(a)]), `pf${i}`)}
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>`;
}

export const pages = [
  {
    path: "/fabrics",
    name: "Fabric guide",
    title: "Fabric Guide: Lacoste, Honeycomb, Dotknit, Lycra & More | D Creations",
    description:
      "What do Lacoste, Honeycomb, Selina, Mirror, Dotknit, Airtex, PC Matty and Fleece feel like? GSM, breathability, price tier and best use for every fabric we make custom apparel in.",
    body: () => promote(fabricGuide()) + fabricTable() + ctaBand(),
  },
  {
    path: "/work",
    name: "Our work",
    title: "Our Work: Custom Uniforms, Jerseys & Team Wear Portfolio | D Creations",
    description:
      "School uniforms, marathon tees, corporate polos, sublimation jerseys, hoodies and varsity jackets made by D Creations in Mangalore & Tiruppur. Browse by category.",
    body: () => promote(work()) + ctaBand(),
  },
  {
    path: "/about",
    name: "About us",
    title: "About D Creations: Apparel Manufacturing in Mangalore & Tiruppur",
    description:
      "Meet D Creations: custom apparel made between our Mangalore studio and Tiruppur production. In-house quality checks, sample before bulk, GST-registered business.",
    body: () => promote(behind()) + statsBand() + why() + ctaBand(),
  },
  {
    path: "/quote",
    name: "Get a quote",
    title: "Get a Free Quote for Custom T-Shirts & Uniforms | D Creations",
    description:
      "Build your quote in 60 seconds: pick the product, fabric, quantity, print method and deadline, and send it to D Creations on WhatsApp. Free mock-up with every quote.",
    data: true,
    body: () => promote(quote()),
  },
  {
    path: "/faq",
    name: "FAQ",
    title: "FAQ: MOQ, Delivery Time, Samples & Payment | D Creations",
    description:
      "Answers on minimum order quantity, delivery time, sample cost, payment terms, design help, bulk discounts, pan-India shipping and re-orders for custom apparel.",
    body: () => promote(faq()) + productFaqs() + ctaBand(),
  },
  {
    path: "/contact",
    name: "Contact",
    title: `Contact D Creations: WhatsApp ${site.phoneDisplay} | Mangalore`,
    description:
      "WhatsApp, call, email or visit D Creations in Mangalore. Business hours, address and map for our custom apparel studio.",
    body: () => promote(contact()) + ctaBand(),
  },
];

export const pageBody = (pg) => crumbs(pg.name) + pg.body();
