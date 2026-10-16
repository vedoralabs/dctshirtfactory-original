import { site, products, printMethods, sizes, steps, faqs } from "./data.mjs";
import { esc, waLink, quoteMessage, img, icon } from "./util.mjs";
import { faqList, ctaBand, fabricByKey } from "./home.mjs";

function related(p) {
  const score = (q) => q.audience.filter((a) => p.audience.includes(a)).length;
  return products
    .filter((q) => q.slug !== p.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

export function productPage(p) {
  const methods = printMethods.filter((m) => p.branding.includes(m.key));
  const fabricList = p.fabrics.map((k) => fabricByKey[k]);
  const multi = p.images.length > 1;
  const rel = related(p);

  const specs = [
    ["Fabrics", fabricList.map((f) => `<a href="/fabrics#fabric-${f.key}">${esc(f.name)}</a>`).join(", ")],
    ["Sizes", esc(sizes)],
    ["Customisation", methods.map((m) => esc(m.name)).join(" · ")],
    ["Order size", "Small runs and bulk orders welcome"],
    ["Pricing", `Quoted for your specification. <a href="/quote?product=${p.slug}">Request a quote</a>`],
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
      <div class="gal__main">
        ${p.images
          .map(
            (base, i) =>
              `<button type="button" class="gal__slide${i === 0 ? " is-on" : ""}" data-gal-slide data-lb-src="/img/${base}-960.webp" data-lb-caption="${esc(p.short)}: design concept" aria-label="View image ${i + 1} larger">${img(base, `${p.short}: design concept, view ${i + 1}`, { eager: i === 0, sizes: "(min-width: 900px) 50vw, 100vw" })}</button>`
          )
          .join("")}
        <span class="concept-tag">Design concept</span>
      </div>
      ${
        multi
          ? `<div class="gal__thumbs" role="group" aria-label="Choose image">
        ${p.images.map((base, i) => `<button type="button" class="gal__thumb${i === 0 ? " is-on" : ""}" data-gal-thumb="${i}" aria-label="Show image ${i + 1} of ${p.images.length}" aria-pressed="${i === 0}">${img(base, "", { sizes: "96px", widths: [480] })}</button>`).join("")}
      </div>`
          : ""
      }
      <p class="concept-note">Design concept for illustration, not a photo of a delivered order.</p>
    </div>

    <div class="pp__info">
      <p class="eyebrow">Custom ${esc(p.name.toLowerCase())} · ${site.locations.replace("&", "&amp;")}</p>
      <h1 class="display pp__title" id="pp-title" data-split>${esc(p.short)}</h1>
      <p class="lead">${esc(p.pitch)}</p>
      <div class="pp__ctas">
        <a class="btn btn--accent btn--lg" data-magnetic href="/quote?product=${p.slug}">Request a custom quote ${icon.arrow}</a>
        <a class="btn btn--ghost btn--lg" href="${waLink(quoteMessage({ product: p.name }))}" target="_blank" rel="noopener">${icon.whatsapp} Ask on WhatsApp</a>
      </div>
      <ul class="pp__trust">
        <li>${icon.sample} Sample approval before production</li>
        <li>${icon.shield} Quality checks at every stage</li>
        <li>${icon.truck} Shipping across India</li>
      </ul>
    </div>
  </section>

  <section class="section pp__specs" aria-labelledby="specs-title">
    <div class="wrap pp__specs-grid">
      <div>
        <h2 class="display display--sm" id="specs-title">Options</h2>
        <table class="specs">
          <tbody>
            ${specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div>
        <h2 class="display display--sm">Made for</h2>
        <ul class="uses">
          ${p.useCases.map((u) => `<li>${icon.check}${esc(u)}</li>`).join("")}
        </ul>
        <h2 class="display display--sm">Customisation</h2>
        <ul class="methods">
          ${methods.map((m) => `<li><strong>${esc(m.name)}</strong><span>${esc(m.note)}</span></li>`).join("")}
        </ul>
      </div>
    </div>
  </section>

  <section class="section pp__steps" aria-labelledby="pp-steps-title">
    <div class="wrap">
      <h2 class="display display--sm" id="pp-steps-title">How it works</h2>
      <ol class="mini-steps">
        ${steps.map((s) => `<li data-reveal><span>${s.n}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
      </ol>
    </div>
  </section>

  <section class="section pp__faq" aria-labelledby="pp-faq-title">
    <div class="wrap faqs__grid">
      <header class="sec-head">
        <p class="eyebrow">Questions</p>
        <h2 class="display" id="pp-faq-title">Before you order</h2>
        <a class="btn btn--line" href="/faq">All FAQs ${icon.arrow}</a>
      </header>
      ${faqList(faqs.slice(0, 4), "pfaq")}
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
          <div class="pcard__img">${img(q.images[0], `${q.short}: design concept`, { sizes: "(min-width: 900px) 33vw, 100vw" })}</div>
          <div class="pcard__shade"></div>
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
${ctaBand(`Let's make your ${esc(p.name.toLowerCase())}. <em>Request a quote.</em>`, `/quote?product=${p.slug}`)}`;
}

// No offers, prices, ratings or reviews in structured data (owner brief).
export function productSchema(p) {
  return {
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
