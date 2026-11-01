// The Clothing archive (/clothing) and one page per category (/clothing/<slug>).
import { site, categories, printMethods, sizes, steps, faqs } from "./data.mjs";
import { esc, waLink, quoteMessage, img, icon } from "./util.mjs";
import { fabricById, fabricCard } from "./fabrics.mjs";
import { faqList, ctaBand } from "./home.mjs";

const pad = (n) => String(n).padStart(2, "0");

const crumbs = (trail) => `
  <nav class="crumbs" aria-label="Breadcrumb"><ol>${trail
    .map(([name, href], i) => (i === trail.length - 1 ? `<li aria-current="page">${esc(name)}</li>` : `<li><a href="${href}">${esc(name)}</a></li>`))
    .join("")}</ol></nav>`;

/** Editorial category index: alternating image / text rows. */
export function clothingIndex() {
  return `
<section class="section archive" aria-labelledby="archive-title">
  <div class="wrap">
    ${crumbs([["Home", "/"], ["Clothing", "/clothing"]])}
    <header class="archive__head">
      <p class="eyebrow">The clothing archive</p>
      <h1 class="display" id="archive-title" data-split>Seven categories. <em>Made to your order.</em></h1>
      <p class="lead">Every category is manufactured to your design, fabric and size break-up, from small runs to bulk orders. Pick one to see its fabrics and customisation options.</p>
    </header>
    <ol class="archive__list">
      ${categories
        .map(
          (c, i) => `
      <li class="arow" data-reveal>
        <a class="arow__img" href="/clothing/${c.slug}" tabindex="-1" aria-hidden="true">${img(c.heroImage, "", { sizes: "(min-width: 1000px) 45vw, 100vw" })}<span class="concept-tag">Design concept</span></a>
        <div class="arow__body">
          <span class="arow__n" aria-hidden="true">${pad(i + 1)}</span>
          <h2 class="arow__t"><a href="/clothing/${c.slug}">${esc(c.title)}</a></h2>
          <p>${esc(c.teaser)}</p>
          <p class="arow__fabrics">${
            c.fabrics.length
              ? `<span>${c.fabrics.length} fabrics</span> ${c.fabrics.map((id) => esc(fabricById[id].name)).join(" · ")}`
              : `<span>Fabrics</span> confirmed with your quotation`
          }</p>
          <div class="arow__ctas">
            <a class="btn btn--line" href="/clothing/${c.slug}">View ${esc(c.title)} ${icon.arrow}</a>
            <a class="arow__quote" href="/contact?category=${c.slug}">Request a quote</a>
          </div>
        </div>
      </li>`
        )
        .join("")}
    </ol>
  </div>
</section>
${ctaBand(`Not sure which fits? <em>Ask us.</em>`)}`;
}

function related(c) {
  const score = (q) => q.audience.filter((a) => c.audience.includes(a)).length;
  return categories
    .filter((q) => q.slug !== c.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

export function categoryPage(c) {
  const methods = printMethods.filter((m) => c.branding.includes(m.key));
  const fabricList = c.fabrics.map((id) => fabricById[id]);
  const rel = related(c);
  const quote = `/contact?category=${c.slug}`;
  const others = c.images.filter((b) => b !== c.heroImage);

  return `
<div class="cat">
  <section class="cat__hero" aria-labelledby="cat-title">
    <div class="wrap cat__hero-grid">
      <div class="cat__copy">
        ${crumbs([["Home", "/"], ["Clothing", "/clothing"], [c.title, `/clothing/${c.slug}`]])}
        <p class="eyebrow"><span class="eyebrow__n">${pad(categories.indexOf(c) + 1)}</span>Custom ${esc(c.title.toLowerCase())}</p>
        <h1 class="display cat__title" id="cat-title" data-split>${esc(c.title)}</h1>
        <p class="lead">${esc(c.pitch)}</p>
        <div class="cat__ctas">
          <a class="btn btn--accent btn--lg" href="${quote}">Request a quote ${icon.arrow}</a>
          <a class="cat__wa" href="${waLink(quoteMessage({ category: c.title }))}" target="_blank" rel="noopener">${icon.whatsapp} Or ask on WhatsApp</a>
        </div>
      </div>
      <figure class="cat__media" data-reveal>
        <button type="button" class="cat__frame" data-lb-src="/img/${c.heroImage}-960.webp" data-lb-caption="${esc(c.title)}: design concept" aria-label="View larger image">
          ${img(c.heroImage, `${c.title}: design concept`, { eager: true, sizes: "(min-width: 1000px) 45vw, 100vw" })}
        </button>
        <figcaption>Design concept, not a photo of a delivered order</figcaption>
      </figure>
    </div>
  </section>

  <section class="section cat__fabrics" aria-labelledby="cf-title">
    <div class="wrap">
      <header class="sec-head sec-head--row" data-reveal>
        <div>
          <p class="eyebrow">Fabrics</p>
          <h2 class="display" id="cf-title">${fabricList.length ? `${fabricList.length} fabrics for <em>${esc(c.title)}.</em>` : `Fabrics for <em>${esc(c.title)}.</em>`}</h2>
        </div>
        <div class="sec-head__aside"><p>${
          fabricList.length
            ? "The fabrics DCT lists for this category. Availability, colours and specifications are confirmed with your quotation."
            : "Fabric options for this category are confirmed with your quotation. Tell us what you have in mind and we'll advise."
        }</p><a class="btn btn--line" href="/fabrics">All fabrics ${icon.arrow}</a></div>
      </header>
      ${
        fabricList.length
          ? `<div class="fgrid">${fabricList.map((f) => fabricCard(f, { inCategory: c.slug })).join("")}</div>`
          : `<p class="cat__nofab"><a class="btn btn--accent" href="${quote}">Ask about fabrics for ${esc(c.title)} ${icon.arrow}</a></p>`
      }
    </div>
  </section>

  <section class="section cat__opts" aria-labelledby="opts-title">
    <div class="wrap cat__opts-grid">
      <div>
        <h2 class="display display--sm" id="opts-title">Options</h2>
        <table class="specs">
          <tbody>
            <tr><th scope="row">Sizes</th><td>${esc(sizes)}</td></tr>
            <tr><th scope="row">Customisation</th><td>${methods.map((m) => esc(m.name)).join(" · ")}</td></tr>
            <tr><th scope="row">Order size</th><td>Small runs and bulk orders welcome</td></tr>
            <tr><th scope="row">Pricing</th><td>Quoted for your specification. <a href="${quote}">Request a quote</a></td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2 class="display display--sm">Made for</h2>
        <ul class="uses">${c.useCases.map((u) => `<li>${icon.check}${esc(u)}</li>`).join("")}</ul>
        <h2 class="display display--sm">Customisation</h2>
        <ul class="methods">${methods.map((m) => `<li><strong>${esc(m.name)}</strong><span>${esc(m.note)}</span></li>`).join("")}</ul>
      </div>
    </div>
  </section>

  ${
    others.length
      ? `<section class="section cat__gal" aria-labelledby="gal-title">
    <div class="wrap">
      <h2 class="display display--sm" id="gal-title">More design concepts</h2>
      <ul class="cat__gal-grid" data-gallery="cat">
        ${others
          .map(
            (b, i) => `<li data-reveal><button type="button" class="work__btn" data-lb-src="/img/${b}-960.webp" data-lb-caption="${esc(c.title)}: design concept" aria-label="View design concept ${i + 2} larger">${img(b, `${c.title}: design concept ${i + 2}`, { sizes: "(min-width: 900px) 33vw, 50vw" })}<span class="concept-tag">Design concept</span></button></li>`
          )
          .join("")}
      </ul>
    </div>
  </section>`
      : ""
  }

  <section class="section cat__steps" aria-labelledby="steps-title">
    <div class="wrap">
      <h2 class="display display--sm" id="steps-title">How an order works</h2>
      <ol class="mini-steps">
        ${steps.map((s) => `<li data-reveal><span>${s.n}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}
      </ol>
      <p class="cat__more"><a href="/manufacturing">More about manufacturing ${icon.arrow}</a></p>
    </div>
  </section>

  <section class="section cat__faq" aria-labelledby="cat-faq-title">
    <div class="wrap faqs__grid">
      <header class="sec-head">
        <p class="eyebrow">Questions</p>
        <h2 class="display" id="cat-faq-title">Before you order</h2>
        <a class="btn btn--line" href="/faq">All FAQs ${icon.arrow}</a>
      </header>
      ${faqList([faqs[1], faqs[2], faqs[6], faqs[7]], "cfaq")}
    </div>
  </section>

  <section class="section cat__rel" aria-labelledby="rel-title">
    <div class="wrap">
      <h2 class="display display--sm" id="rel-title">Other categories</h2>
      <div class="rel">
        ${rel
          .map(
            (q) => `
        <a class="pcard pcard--rel" href="/clothing/${q.slug}" data-reveal>
          <div class="pcard__img">${img(q.heroImage, `${q.title}: design concept`, { sizes: "(min-width: 700px) 33vw, 100vw" })}</div>
          <div class="pcard__shade"></div>
          <div class="pcard__body">
            <h3 class="pcard__name">${esc(q.title)}</h3>
            <p class="pcard__teaser">${esc(q.teaser)}</p>
            <span class="pcard__cta">View category ${icon.arrow}</span>
          </div>
        </a>`
          )
          .join("")}
      </div>
    </div>
  </section>
</div>
${ctaBand(`Let's make your ${esc(c.title.toLowerCase())}. <em>Request a quote.</em>`, quote)}`;
}

// No offers, prices, ratings or reviews in structured data.
export function categorySchema(c) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Custom ${c.title}`,
    description: c.description,
    image: c.images.map((b) => `${site.url}/img/${b}-960.webp`),
    brand: { "@type": "Brand", name: "D Creations" },
    manufacturer: { "@id": `${site.url}/#business` },
    category: "Apparel & Accessories > Clothing",
    url: `${site.url}/clothing/${c.slug}`,
  };
}
