import { site, products, fabrics, printMethods, sizes, steps, faqValues } from "./data.mjs";
import { esc, show, val, isTbc, inr, waLink, productMessage, img, slotTag, icon } from "./util.mjs";
import { faqList, ctaBand } from "./home.mjs";

// Map free-text fabric names to Fabric Guide entries where one exists.
const fabricKey = (name) => {
  const n = name.toLowerCase().replace(/\s+\d.*$/, "");
  const hit = fabrics.find((f) => {
    const fn = f.name.toLowerCase();
    return fn.startsWith(n) || fn.includes(`(${n})`) || (n.includes("lycra") && f.key === "lycra");
  });
  return n === "pique" ? "lacoste" : hit?.key;
};

const fabricLinks = (list) =>
  list
    .map((name) => {
      const k = fabricKey(name);
      return k ? `<a href="/#fabric-${k}">${esc(name)}</a>` : esc(name);
    })
    .join(", ");

function related(p) {
  const score = (q) => q.audience.filter((a) => p.audience.includes(a)).length;
  return products
    .filter((q) => q.slug !== p.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

export function productPage(p) {
  const msg = productMessage(p);
  const methods = printMethods.filter((m) => p.branding.includes(m.key));
  const gallery = [
    ...p.images.map((base) => ({ base })),
    { slot: `[PHOTO: ${p.short} — real order, worn]` },
    { slot: `[PHOTO: ${p.short} — fabric & print close-up]` },
  ];
  const rel = related(p);
  const faqs = [
    ...p.faq,
    ["What's the minimum order?", `${show(p.moq)} for ${esc(p.short.toLowerCase())}. Ask us about smaller runs.`],
    ["How long will it take?", `${show(p.turnaround)}, plus shipping anywhere in India.`],
    ["What are the payment terms?", show(faqValues.payment)],
  ];

  const specs = [
    ["Minimum order", show(p.moq)],
    ["Price", `From ${show(p.priceFrom, inr)} per piece <small>· depends on fabric, quantity &amp; print</small>`],
    ["Fabrics", fabricLinks(p.fabrics)],
    ["Fabric weight", `${show(p.gsm)} GSM`],
    ["Sizes", esc(sizes)],
    ["Colours", esc(p.colours)],
    ["Branding", methods.map((m) => esc(m.name)).join(" · ")],
    ["Turnaround", show(p.turnaround)],
  ];

  return `
<div class="pp">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <ol><li><a href="/">Home</a></li><li><a href="/#products">Products</a></li><li aria-current="page">${esc(p.name)}</li></ol>
    </nav>
  </div>

  <section class="wrap pp__top" aria-labelledby="pp-title">
    <div class="gal" data-gal>
      <div class="gal__main" data-gal-main>
        ${gallery
          .map((g, i) =>
            g.base
              ? `<button type="button" class="gal__slide${i === 0 ? " is-on" : ""}" data-gal-slide data-lb-src="/img/${g.base}-960.webp" data-lb-caption="${esc(p.short)}" aria-label="Zoom image ${i + 1}">${img(g.base, `${p.short} by D Creations — view ${i + 1}`, { eager: i === 0, sizes: "(min-width: 900px) 50vw, 100vw" })}</button>`
              : `<div class="gal__slide gal__slide--slot" data-gal-slide>${slotTag(g.slot)}</div>`
          )
          .join("")}
        <span class="gal__hint" aria-hidden="true">Hover to zoom · tap to expand</span>
      </div>
      <div class="gal__thumbs" role="group" aria-label="Choose image">
        ${gallery
          .map(
            (g, i) =>
              `<button type="button" class="gal__thumb${i === 0 ? " is-on" : ""}" data-gal-thumb="${i}" aria-label="Show image ${i + 1}" aria-pressed="${i === 0}">${g.base ? img(g.base, "", { sizes: "96px", widths: [480] }) : `<span class="gal__thumb-slot">Photo slot</span>`}</button>`
          )
          .join("")}
      </div>
    </div>

    <div class="pp__info">
      <p class="eyebrow">Custom ${esc(p.name.toLowerCase())} · Made in Mangalore &amp; Tiruppur</p>
      <h1 class="display pp__title" id="pp-title" data-split>${esc(p.short)}</h1>
      <p class="lead">${esc(p.pitch)}</p>
      <div class="pp__chips">
        <span class="kchip"><small>From</small>${show(p.priceFrom, inr)}<small>/pc</small></span>
        <span class="kchip"><small>MOQ</small>${show(p.moq)}</span>
        <span class="kchip"><small>Sizes</small>Kids – 5XL</span>
      </div>
      <div class="pp__ctas">
        <a class="btn btn--accent btn--lg" data-magnetic href="${waLink(msg)}" target="_blank" rel="noopener">${icon.whatsapp} Customise this on WhatsApp</a>
        <a class="btn btn--ghost btn--lg" href="/?product=${p.slug}#quote">Build a detailed quote ${icon.arrow}</a>
      </div>
      <ul class="pp__trust">
        <li>${icon.sample} Sample before bulk</li>
        <li>${icon.shield} In-house quality checks</li>
        <li>${icon.truck} Pan-India delivery</li>
      </ul>
    </div>
  </section>

  <section class="section pp__specs" aria-labelledby="specs-title">
    <div class="wrap pp__specs-grid">
      <div>
        <h2 class="display display--sm" id="specs-title">Key specs</h2>
        <table class="specs">
          <tbody>
            ${specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div>
        <h2 class="display display--sm">Perfect for</h2>
        <ul class="uses">
          ${p.useCases.map((u) => `<li>${icon.check}${esc(u)}</li>`).join("")}
        </ul>
        <h2 class="display display--sm">Branding options</h2>
        <ul class="methods">
          ${methods.map((m) => `<li><strong>${esc(m.name)}</strong><span>${esc(m.note)}</span></li>`).join("")}
        </ul>
      </div>
    </div>
  </section>

  <section class="section pp__steps" aria-labelledby="pp-steps-title">
    <div class="wrap">
      <h2 class="display display--sm" id="pp-steps-title">How your order comes together</h2>
      <ol class="mini-steps">
        ${steps.map((s) => `<li data-reveal><span>${s.n}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
      </ol>
    </div>
  </section>

  <section class="section pp__faq" aria-labelledby="pp-faq-title">
    <div class="wrap faqs__grid">
      <header class="sec-head">
        <p class="eyebrow">Questions</p>
        <h2 class="display" id="pp-faq-title">About ${esc(p.name.toLowerCase())}</h2>
        <a class="btn btn--line" href="/#faq">All FAQs ${icon.arrow}</a>
      </header>
      ${faqList(faqs, "pfaq")}
    </div>
  </section>

  <section class="section pp__rel" aria-labelledby="rel-title">
    <div class="wrap">
      <h2 class="display display--sm" id="rel-title">You might also need</h2>
      <div class="rel">
        ${rel
          .map(
            (q) => `
        <a class="pcard pcard--rel" href="/products/${q.slug}" data-reveal>
          <div class="pcard__img">${img(q.images[0], `${q.short} by D Creations`, { sizes: "(min-width: 900px) 33vw, 100vw" })}</div>
          <div class="pcard__shade"></div>
          <span class="pcard__price">from ${show(q.priceFrom, inr)}</span>
          <div class="pcard__body">
            <h3 class="pcard__name">${esc(q.name)}</h3>
            <div class="pcard__more"><div><p class="pcard__teaser">${esc(q.teaser)}</p><span class="pcard__cta">View details ${icon.arrow}</span></div></div>
          </div>
        </a>`
          )
          .join("")}
      </div>
    </div>
  </section>
</div>
${ctaBand(`Let's make your ${esc(p.name.toLowerCase())}. <em>Start on WhatsApp.</em>`, msg)}`;
}

export function productSchema(p) {
  const s = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Custom ${p.short}`,
    description: p.description,
    image: p.images.map((b) => `${site.url}/img/${b}-960.webp`),
    brand: { "@type": "Brand", name: "D Creations" },
    manufacturer: { "@id": `${site.url}/#business` },
    category: "Apparel & Accessories > Clothing",
    url: `${site.url}/products/${p.slug}`,
  };
  // Offers only once the price is confirmed (no guessed prices in search results).
  if (!isTbc(p.priceFrom)) {
    s.offers = {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: p.priceFrom,
      availability: "https://schema.org/InStock",
      seller: { "@id": `${site.url}/#business` },
    };
  }
  return s;
}

export const breadcrumbSchema = (p) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
    { "@type": "ListItem", position: 2, name: "Products", item: `${site.url}/#products` },
    { "@type": "ListItem", position: 3, name: p.name, item: `${site.url}/products/${p.slug}` },
  ],
});
