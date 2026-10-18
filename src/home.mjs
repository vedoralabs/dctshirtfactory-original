import {
  site, products, fabrics, audiences, benefits, steps, testimonials, concepts,
  clients, instagramPosts, faqs, printMethods, sizes, addresses,
} from "./data.mjs";
import { esc, waLink, img, icon, audienceIcon } from "./util.mjs";

const pad = (n) => String(n).padStart(2, "0");
const byKey = Object.fromEntries(products.map((p) => [p.slug, p]));
export const fabricByKey = Object.fromEntries(fabrics.map((f) => [f.key, f]));

const conceptTag = `<span class="concept-tag">Design concept</span>`;

function hero() {
  const frames = [1, 2, 3, 4];
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__media" aria-hidden="true">
    <!-- Real production footage can replace these frames later:
         <video class="hero__video" autoplay muted loop playsinline poster="/img/hero-1-1600.webp"><source src="/video/hero.mp4" type="video/mp4"></video> -->
    <div class="kb" data-kb>
      ${frames.map((n, i) => `<div class="kb__frame${i === 0 ? " is-on" : ""}">${img(`hero-${n}`, "", { sizes: "100vw", eager: i === 0 })}</div>`).join("")}
    </div>
    <div class="hero__shade"></div>
  </div>
  <div class="wrap hero__content">
    <p class="eyebrow hero__eyebrow"><span class="pulse"></span>Custom apparel manufacturer · ${site.locations.replace("&", "&amp;")}</p>
    <h1 class="hero__title" id="hero-title" data-split>Custom apparel, <em>made for your team.</em></h1>
    <p class="hero__sub">T-shirts, polos, uniforms, jerseys and more, developed to your brief. Tell us what you need and the owner will share a quotation for your specification.</p>
    <div class="hero__ctas">
      <a class="btn btn--accent btn--lg" data-magnetic href="/quote">Get a custom quote ${icon.arrow}</a>
      <a class="btn btn--ghost btn--lg" href="#products">Explore products</a>
    </div>
    <ul class="hero__trust">
      <li>${icon.check}Sample approval before production</li>
      <li>${icon.check}Quality checks at every stage</li>
      <li>${icon.check}Shipping across India</li>
    </ul>
  </div>
  <a class="hero__scroll" href="#who" aria-label="Scroll to content"><span></span></a>
</section>`;
}

// Sectors served. A static row, not a ticker, and not a list of clients.
function sectors() {
  const words = ["Schools", "Corporates", "Sports teams", "Marathons & events", "Gyms", "Colleges", "Brands"];
  return `
<section class="sectors" aria-label="Sectors we make for">
  <div class="wrap sectors__in">
    <p class="sectors__lead">We make for</p>
    <ul class="sectors__list">${words.map((w) => `<li>${w}</li>`).join("")}</ul>
  </div>
</section>`;
}

function who() {
  return `
<section class="section who" id="who" aria-labelledby="who-title">
  <div class="wrap">
    <header class="sec-head" data-reveal>
      <p class="eyebrow">Who we make for</p>
      <h2 class="display" id="who-title" data-split>Made for teams <em>of every kind.</em></h2>
    </header>
    <div class="who__grid">
      ${audiences
        .map(
          (a, i) => `
      <article class="who__tile" data-reveal style="--d:${i * 60}ms">
        <span class="who__ico">${audienceIcon[a.key]}</span>
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.line)}</p>
        <ul class="who__links">
          ${a.products.map((s) => `<li><a href="/products/${s}">${esc(byKey[s].name)} ${icon.arrow}</a></li>`).join("")}
        </ul>
      </article>`
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function productGrid() {
  return `
<section class="section products" id="products" aria-labelledby="products-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">What we make · 7 categories</p>
        <h2 class="display" id="products-title" data-split>Built to order. <em>Built to last.</em></h2>
      </div>
      <p class="sec-head__aside">Every category is made to your design, fabric and size break-up. Tap one to see fabrics and customisation options, then request a quote.</p>
    </header>
    <div class="bento">
      ${products
        .map(
          (p, i) => `
      <a class="pcard pcard--${i + 1}" href="/products/${p.slug}" data-reveal style="--d:${(i % 4) * 70}ms">
        <div class="pcard__img" data-parallax="0.06">${img(p.images[0], `${p.short}: design concept`, { sizes: i === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 100vw" })}</div>
        <div class="pcard__shade"></div>
        <span class="pcard__num">${pad(i + 1)}</span>
        <div class="pcard__body">
          <h3 class="pcard__name">${esc(p.name)}</h3>
          <div class="pcard__more"><div><p class="pcard__teaser">${esc(p.teaser)}</p><span class="pcard__cta">View details ${icon.arrow}</span></div></div>
        </div>
      </a>`
        )
        .join("")}
    </div>
    <p class="concept-note">Product images are design concepts for illustration, not photographs of delivered orders.</p>
  </div>
</section>`;
}

export function why() {
  const icons = { check: icon.shield, sample: icon.sample, factory: icon.factory, fabric: icon.fabric, clock: icon.truck, pen: icon.pen };
  return `
<section class="section why" id="why" aria-labelledby="why-title">
  <div class="wrap why__wrap">
    <header class="sec-head why__head" data-reveal>
      <p class="eyebrow">Why D Creations</p>
      <h2 class="display" id="why-title" data-split>Made with care. <em>Checked at every stage.</em></h2>
      <p class="lead">We combine skilled craftsmanship with modern production techniques to deliver apparel that lasts.</p>
      <a class="btn btn--accent" data-magnetic href="/quote">Request a custom quote ${icon.arrow}</a>
    </header>
    <ol class="why__list">
      ${benefits
        .map(
          (b, i) => `
      <li class="why__item" data-reveal style="--d:${i * 60}ms">
        <span class="why__ico">${icons[b.icon]}</span>
        <div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></div>
      </li>`
        )
        .join("")}
    </ol>
  </div>
</section>`;
}

export function fabricGuide() {
  return `
<section class="section fabrics" id="fabrics" aria-labelledby="fabrics-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">Fabric library</p>
        <h2 class="display" id="fabrics-title" data-split>Knits for every <em>kind of order.</em></h2>
      </div>
      <p class="sec-head__aside">A plain-words guide to the knit types we work with. Not sure which suits your order? Ask about any fabric and we'll advise.</p>
    </header>
    <div class="fab" data-tabs>
      <div class="fab__tabs" role="tablist" aria-label="Fabrics">
        ${fabrics
          .map(
            (f, i) => `<button class="fab__tab" type="button" role="tab" id="tab-${f.key}" aria-controls="fabric-${f.key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="fab__chip" style="--tint:${f.tint}"></span>${esc(f.name)}</button>`
          )
          .join("")}
      </div>
      ${fabrics
        .map(
          (f, i) => `
      <div class="fab__panel${i === 0 ? " is-active" : ""}" role="tabpanel" id="fabric-${f.key}" aria-labelledby="tab-${f.key}" tabindex="0">
        <figure class="fab__swatch">
          <img class="fab__tx" src="/img/tx/${f.key}.svg" alt="" width="400" height="400" loading="lazy" decoding="async">
          <figcaption class="fab__cap">Illustrative texture, not a photo of the actual fabric</figcaption>
        </figure>
        <div class="fab__info">
          <h3>${esc(f.name)}</h3>
          <p class="fab__feel">${esc(f.feel)}</p>
          <dl class="fab__specs"><div><dt>Often used for</dt><dd>${esc(f.usedFor)}</dd></div></dl>
          <a class="btn btn--accent btn--sm" href="/quote?fabric=${f.key}">Ask about this fabric ${icon.arrow}</a>
        </div>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function process() {
  return `
<section class="how" id="process" aria-labelledby="how-title" data-how>
  <div class="how__pin">
    <div class="how__track" data-how-track>
      <header class="how__intro">
        <p class="eyebrow">How it works</p>
        <h2 class="display" id="how-title" data-split>From brief <em>to dispatch.</em></h2>
        <p class="lead">You approve a sample and receive a quotation before bulk production begins.</p>
        <p class="how__hint" aria-hidden="true">Scroll ${icon.arrow}</p>
      </header>
      ${steps
        .map(
          (s) => `
      <article class="how__step" data-reveal>
        <span class="how__n" aria-hidden="true">${s.n}</span>
        <h3><span class="sr-only">Step ${Number(s.n)}: </span>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </article>`
        )
        .join("")}
    </div>
    <div class="how__bar" aria-hidden="true"><span data-how-bar></span></div>
  </div>
</section>`;
}

/** Concept gallery (/work). Every item is labelled as a design concept. */
export function work() {
  const cats = [...new Set(concepts.map((w) => w.cat))];
  return `
<section class="section work" id="work" aria-labelledby="work-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">Gallery</p>
        <h2 class="display" id="work-title" data-split>Design concepts <em>we can make.</em></h2>
      </div>
      <div class="sec-head__aside">
        <p>These are design concepts showing the kinds of garments we make. They are not photographs of delivered client orders. For real work, see our Instagram.</p>
      </div>
    </header>
    <div class="work__filters" role="group" aria-label="Filter by category">
      <button type="button" class="chip is-on" data-filter="all" aria-pressed="true">All</button>
      ${cats.map((c) => `<button type="button" class="chip" data-filter="${c}" aria-pressed="false">${esc(byKey[c].name)}</button>`).join("")}
    </div>
    <ul class="work__grid" data-gallery="work">
      ${concepts
        .map(
          (w, i) => `
      <li class="work__item work__item--${i + 1}" data-cat="${w.cat}" data-reveal>
        <button type="button" class="work__btn" data-lb-src="/img/${w.img}-960.webp" data-lb-caption="${esc(`${w.title}: design concept (${byKey[w.cat].name})`)}" aria-label="${esc(`View ${w.title}, design concept, larger`)}">
          ${img(w.img, `${w.title}: design concept`, { sizes: "(min-width: 900px) 33vw, 50vw" })}
          ${conceptTag}
          <span class="work__cap"><strong>${esc(w.title)}</strong><span>${esc(byKey[w.cat].name)}</span></span>
        </button>
      </li>`
        )
        .join("")}
    </ul>
  </div>
</section>`;
}

/** Shown only when the owner has approved named clients in writing. */
const igPost = /^https:\/\/www\.instagram\.com\/dctshirtfactory\/(p|reel)\//;

/** Clients that pass the gate: owner's own public post(s) naming them, or written approval. */
export const shownClients = () =>
  clients.filter(
    (c) => c.name && c.work && ((c.sources || []).some((s) => igPost.test(s.url)) || (c.approvedBy && c.approvedOn))
  );

/**
 * Clients & collaborations. `full` (the /clients page) adds the owner's Instagram
 * posts as click-to-load embeds; the homepage version links through to it.
 */
export function clientsSection({ full = false } = {}) {
  const ok = shownClients();
  if (!ok.length) return "";
  const card = (c, i) => {
    const sources = (c.sources || []).filter((s) => igPost.test(s.url));
    const meta = [c.type, c.place, c.when].filter(Boolean).map(esc).join(" · ");
    return `
      <li class="client" data-reveal>
        <span class="client__n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <p class="client__meta">${meta}</p>
        <h3 class="client__name">${esc(c.name)}</h3>
        <p class="client__work">${esc(c.work)}</p>
        ${
          full && sources.length
            ? `<div class="client__posts">${sources
                .map(
                  (s) => `<div class="ig__item" data-ig="${esc(s.url)}"><button type="button" class="ig__load" data-ig-load>${icon.instagram}<span>Our post, ${esc(s.date)}</span><small>Loads content from Instagram</small></button><a class="ig__fallback" href="${esc(s.url)}" target="_blank" rel="noopener">Open on Instagram ${icon.arrow}</a></div>`
                )
                .join("")}</div>`
            : sources.length
            ? `<a class="client__src" href="${esc(sources[0].url)}" target="_blank" rel="noopener">${icon.instagram} See the post</a>`
            : ""
        }
        ${full && c.product ? `<a class="client__ask" href="/quote?product=${esc(c.product)}">Plan a similar order ${icon.arrow}</a>` : ""}
      </li>`;
  };
  return `
<section class="section clients${full ? " clients--full" : ""}" id="clients" aria-labelledby="clients-title">
  <div class="wrap">
    <header class="sec-head${full ? "" : " sec-head--row"}" data-reveal>
      <div>
        <p class="eyebrow">Our clients &amp; collaborations</p>
        <h2 class="display${full ? "" : " display--sm"}" id="clients-title" data-split>Made for <em>events people run in.</em></h2>
        <p class="lead">Colleges, walkathons, marathons and run clubs that have worn kits made by DC T-Shirt Factory.</p>
      </div>
      ${full ? "" : `<a class="btn btn--line" href="/clients">All clients ${icon.arrow}</a>`}
    </header>
    <ol class="clients__grid">${ok.map(card).join("")}</ol>
    ${full ? `<p class="clients__note">Clients are listed as described in our own Instagram posts or confirmed by us. Logos and event photos belong to their owners and are not reproduced here.</p>` : ""}
  </div>
</section>`;
}

/** Instagram: owner-approved posts load on click (no tracking until then); otherwise a profile link. */
export function instagram() {
  const posts = instagramPosts.filter((p) => /^https:\/\/www\.instagram\.com\/(p|reel)\//.test(p.url));
  const grid = posts.length
    ? `<ul class="ig__grid">${posts
        .map(
          (p) => `<li class="ig__item" data-ig="${esc(p.url)}"><button type="button" class="ig__load" data-ig-load>${icon.instagram}<span>${esc(p.label || "View post")}</span><small>Loads content from Instagram</small></button><a class="ig__fallback" href="${esc(p.url)}" target="_blank" rel="noopener">Open on Instagram ${icon.arrow}</a></li>`
        )
        .join("")}</ul>`
    : "";
  return `
<section class="section ig" id="instagram" aria-labelledby="ig-title">
  <div class="wrap ig__in">
    <div data-reveal>
      <p class="eyebrow">From the workshop</p>
      <h2 class="display display--sm" id="ig-title">See our real work on Instagram</h2>
      <p class="lead">Our latest products, production and customer orders are posted on ${site.instagramHandle}.</p>
    </div>
    ${grid}
    <a class="btn btn--line ig__cta" href="${site.instagram}" target="_blank" rel="noopener">${icon.instagram} View ${site.instagramHandle} on Instagram</a>
  </div>
</section>`;
}

export function aboutStory() {
  return `
<section class="section bts" id="story" aria-labelledby="bts-title">
  <div class="wrap bts__grid">
    <div class="bts__copy" data-reveal>
      <p class="eyebrow">About us</p>
      <h2 class="display" id="bts-title" data-split>Made in Mangalore <em>&amp; Tiruppur.</em></h2>
      <p class="lead">D Creations (DC T-Shirt Factory) manufactures quality T-shirts and custom apparel: school uniforms, sportswear, corporate polos, hoodies, varsity jackets and sublimation jerseys. With our own manufacturing setup, we keep full control over quality.</p>
      <p>As a true custom apparel company, we welcome every customisation request, however unique, and work to your requirement and timeline from concept to delivery. Small runs and bulk orders welcome.</p>
      <p class="about__units">Kankanady, Mangalore · Chettipalayam, Tiruppur. <a href="/contact">See both addresses</a></p>
    </div>
    <ul class="about__pillars" data-reveal>
      <li><h3>Quality first</h3><p>Checks at every stage: fabric, stitching, finishing and packing.</p></li>
      <li><h3>Made to order</h3><p>From concept to delivery, with samples and approvals along the way.</p></li>
      <li><h3>Wide fabric range</h3><p>Several knit types for uniforms, sportswear and winter wear. <a href="/fabrics">See the fabric library</a>.</p></li>
    </ul>
  </div>
</section>`;
}

function reviews() {
  return `
<section class="section reviews" id="reviews" aria-labelledby="reviews-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">Customer feedback</p>
        <h2 class="display" id="reviews-title" data-split>What customers <em>tell us.</em></h2>
      </div>
      <a class="btn btn--line" href="${site.mapsUrl}" target="_blank" rel="noopener">${icon.google} Our Google Maps listing</a>
    </header>
    <div class="slider" data-slider>
      <div class="slider__track" data-slider-track tabindex="0" aria-label="Customer feedback" role="region">
        ${testimonials
          .map(
            (t) => `
        <figure class="tcard" data-slide>
          <blockquote><p>“${esc(t.text)}”</p></blockquote>
          <figcaption><span class="tcard__av" aria-hidden="true">${esc(t.name[0])}</span><strong>${esc(t.name)}</strong></figcaption>
        </figure>`
          )
          .join("")}
      </div>
      <div class="slider__ctrl">
        <button type="button" class="round" data-slider-prev aria-label="Previous">${icon.arrowL}</button>
        <div class="slider__dots" data-slider-dots></div>
        <button type="button" class="round" data-slider-next aria-label="Next">${icon.arrow}</button>
      </div>
    </div>
  </div>
</section>`;
}

const QTY = ["Under 50", "50–100", "100–250", "250–500", "500–1,000", "1,000+"];

/** The quote form (/quote). Works as a step-by-step builder with JS; a plain WhatsApp form is the no-JS fallback. */
export function quote() {
  return `
<section class="section quote" id="quote" aria-labelledby="quote-title">
  <div class="wrap quote__grid">
    <header class="quote__head" data-reveal>
      <p class="eyebrow">Request a quote</p>
      <h2 class="display" id="quote-title" data-split>Get a custom <em>quote.</em></h2>
      <p class="lead">Tell us what you need. The owner will review your brief and share a quotation based on your specifications.</p>
      <ul class="quote__perks">
        <li>${icon.check} Only name, phone and product are required</li>
        <li>${icon.check} Not sure about something? Skip it</li>
        <li>${icon.check} Artwork can be attached in WhatsApp</li>
      </ul>
      <p class="quote__alt">Prefer to talk? <a href="tel:${site.phoneHref}">Call ${site.phoneDisplay}</a> or email <a href="mailto:${site.email}?subject=${encodeURIComponent("Quotation request")}">${site.email}</a></p>
    </header>

    <form class="qb" data-qb novalidate>
      <div class="qb__top">
        <p class="qb__count" aria-live="polite"><span data-qb-step>1</span> / 6 · <span data-qb-label>Product</span></p>
        <div class="qb__bar" aria-hidden="true"><span data-qb-bar></span></div>
      </div>

      <fieldset class="qb__step is-active" data-step="1" data-label="Product">
        <legend>What do you need?</legend>
        <div class="opts opts--cards">
          ${products
            .map(
              (p) => `<label class="opt opt--card"><input type="radio" name="product" value="${p.slug}" required><span class="opt__img">${img(p.images[0], "", { sizes: "120px", widths: [480] })}</span><span class="opt__t">${esc(p.name)}</span></label>`
            )
            .join("")}
          <label class="opt opt--card opt--plain"><input type="radio" name="product" value="mixed"><span class="opt__t">A mix / not sure yet</span></label>
        </div>
      </fieldset>

      <fieldset class="qb__step" data-step="2" data-label="Fabric">
        <legend>Which fabric? <small>(optional)</small></legend>
        <p class="qb__help">Fabrics usually used for this product. <a href="/fabrics" target="_blank" rel="noopener">Open the fabric library</a></p>
        <div class="opts" data-qb-fabrics></div>
      </fieldset>

      <fieldset class="qb__step" data-step="3" data-label="Quantity">
        <legend>Roughly how many pieces?</legend>
        <div class="opts">
          ${QTY.map((q) => `<label class="opt"><input type="radio" name="qty" value="${q}"><span>${q}</span></label>`).join("")}
        </div>
        <label class="field field--inline"><span>Or exact number</span><input type="number" name="qtyExact" min="1" inputmode="numeric" placeholder="e.g. 180"></label>
      </fieldset>

      <fieldset class="qb__step" data-step="4" data-label="Customisation">
        <legend>Customisation <small>(optional)</small></legend>
        <p class="qb__help">Pick any you're interested in.</p>
        <div class="opts opts--list">
          ${printMethods.map((m) => `<label class="opt opt--row"><input type="checkbox" name="print" value="${esc(m.name)}"><span><strong>${esc(m.name)}</strong><small>${esc(m.note)}</small></span></label>`).join("")}
          <label class="opt opt--row"><input type="checkbox" name="print" value="Not sure, please advise"><span><strong>Not sure</strong><small>We'll discuss the options with you.</small></span></label>
        </div>
      </fieldset>

      <fieldset class="qb__step" data-step="5" data-label="Delivery">
        <legend>Delivery</legend>
        <div class="fields">
          <label class="field"><span>Delivery city</span><input name="city" autocomplete="address-level2" placeholder="e.g. Mangalore"></label>
          <label class="field"><span>Required by</span><input type="date" name="date"></label>
          <label class="field field--wide"><span>Sizes / colours <small>(optional)</small></span><textarea name="sizes" rows="2" placeholder="e.g. 40 × M, 30 × L, navy with white logo"></textarea></label>
        </div>
      </fieldset>

      <fieldset class="qb__step" data-step="6" data-label="Your details">
        <legend>Your details</legend>
        <div class="fields">
          <label class="field"><span>Your name *</span><input name="name" autocomplete="name" required></label>
          <label class="field"><span>Phone / WhatsApp *</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="+91" aria-describedby="phone-hint"><small id="phone-hint" class="field__hint">10-digit mobile number</small></label>
          <label class="field"><span>Email <small>(optional)</small></span><input name="email" type="email" autocomplete="email"></label>
          <label class="field"><span>Organisation / team <small>(optional)</small></span><input name="org" autocomplete="organization"></label>
          <label class="field field--wide"><span>Notes <small>(optional)</small></span><textarea name="notes" rows="3" placeholder="Design idea, deadline details, anything else"></textarea></label>
          <label class="check field--wide"><input type="checkbox" name="consent" required><span>I agree that D Creations may contact me about this enquiry. See the <a href="/privacy" target="_blank" rel="noopener">privacy notice</a>.</span></label>
        </div>
        <div class="qb__preview">
          <p class="qb__preview-h">Your enquiry message</p>
          <pre data-qb-preview></pre>
        </div>
      </fieldset>

      <p class="qb__err" role="alert" data-qb-err></p>
      <div class="qb__nav">
        <button type="button" class="btn btn--ghost" data-qb-back hidden>${icon.arrowL} Back</button>
        <button type="button" class="btn btn--accent" data-qb-next>Next ${icon.arrow}</button>
        <button type="submit" class="btn btn--accent" data-qb-send hidden>${icon.whatsapp} Continue in WhatsApp</button>
      </div>
      <p class="qb__note" data-qb-note hidden>Your enquiry is only sent when you press <strong>Send</strong> in WhatsApp.</p>
      <div class="qb__status" role="status" tabindex="-1" data-qb-status hidden></div>
    </form>

    <noscript>
      <form class="qb qb--basic" action="https://wa.me/${site.whatsapp}" method="get" target="_blank">
        <p class="qb__q">Send your enquiry on WhatsApp</p>
        <label class="field"><span>Edit the message, then continue in WhatsApp</span>
          <textarea name="text" rows="9">Hello D Creations (DC T-Shirt Factory), I would like a quotation.
Product:
Quantity:
Fabric (optional):
Customisation (optional):
Delivery city:
Required by:
Notes:
Name:
Please contact me to discuss the specifications.</textarea></label>
        <button type="submit" class="btn btn--accent">Continue in WhatsApp</button>
        <p class="qb__help">Or call <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a>.</p>
      </form>
    </noscript>
  </div>
</section>`;
}

export function faqList(items, idPrefix = "faq") {
  return `<div class="faq">${items
    .map(
      ([q, a], i) => `
    <details class="faq__item" data-reveal${i === 0 ? " open" : ""}>
      <summary id="${idPrefix}-${i}"><span>${esc(q)}</span><span class="faq__ico" aria-hidden="true">${icon.plus}</span></summary>
      <div class="faq__a"><p>${esc(a)}</p></div>
    </details>`
    )
    .join("")}</div>`;
}

export function faq(items = faqs, more = "") {
  return `
<section class="section faqs" id="faq" aria-labelledby="faq-title">
  <div class="wrap faqs__grid">
    <header class="sec-head" data-reveal>
      <p class="eyebrow">FAQ</p>
      <h2 class="display" id="faq-title" data-split>Good questions. <em>Straight answers.</em></h2>
      <p class="lead">Something else on your mind? Ask us on WhatsApp.</p>
      <a class="btn btn--line" href="${waLink("Hello D Creations (DC T-Shirt Factory), I have a question: ")}" target="_blank" rel="noopener">${icon.whatsapp} Ask a question</a>
    </header>
    <div>${faqList(items)}${more}</div>
  </div>
</section>`;
}

export function ctaBand(title = `Ready to build your team's look? <em>Let's talk.</em>`, quoteHref = "/quote") {
  return `
<section class="cta" aria-labelledby="cta-title">
  <div class="cta__glow" aria-hidden="true"></div>
  <div class="wrap cta__in">
    <h2 class="display cta__title" id="cta-title" data-split>${title}</h2>
    <p class="lead">Share your product, quantity and date. The owner will review your brief and send a quotation.</p>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" data-magnetic href="${quoteHref}">Request a custom quote ${icon.arrow}</a>
      <a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}">${icon.phone} Call ${site.phoneDisplay}</a>
    </div>
  </div>
</section>`;
}

export function contact() {
  return `
<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap contact__grid">
    <div data-reveal>
      <p class="eyebrow">Contact</p>
      <h2 class="display" id="contact-title">Call <em>or message.</em></h2>
      <ul class="contact__list">
        <li><a href="${waLink()}" target="_blank" rel="noopener"><span class="contact__ico">${icon.whatsapp}</span><span><small>WhatsApp</small>${site.phoneDisplay}</span></a></li>
        <li><a href="tel:${site.phoneHref}"><span class="contact__ico">${icon.phone}</span><span><small>Call</small>${site.phoneDisplay}</span></a></li>
        <li><a href="mailto:${site.email}"><span class="contact__ico">${icon.mail}</span><span><small>Email</small>${site.email}</span></a></li>
        <li><a href="${site.instagram}" target="_blank" rel="noopener"><span class="contact__ico">${icon.instagram}</span><span><small>Instagram</small>${site.instagramHandle}</span></a></li>
        ${addresses
          .map((a) => {
            const body = `<span class="contact__ico">${icon.pin}</span><span><small>${esc(a.city)} · ${esc(a.name)}</small><address>${a.lines.map(esc).join("<br>")}</address>${a.maps ? `<span class="contact__go">Open in Google Maps</span>` : ""}</span>`;
            return a.maps
              ? `<li><a href="${site.mapsUrl}" target="_blank" rel="noopener">${body}</a></li>`
              : `<li><div>${body}</div></li>`;
          })
          .join("")}
      </ul>
      <p class="contact__more"><a class="btn btn--accent" href="/quote">Request a custom quote ${icon.arrow}</a></p>
    </div>
    <div class="contact__map" data-map data-src="https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=15&output=embed">
      <button type="button" class="contact__mapbtn" data-map-load>${icon.pin} Show map</button>
      <p class="contact__mapnote">Loads Google Maps, which may set cookies.</p>
      <a class="contact__maplink" href="${site.mapsUrl}" target="_blank" rel="noopener">Open in Google Maps ${icon.arrow}</a>
    </div>
  </div>
</section>`;
}

// ---- Homepage teasers ---------------------------------------------------------

function fabricTeaser() {
  return `
<section class="section fteaser" id="fabrics" aria-labelledby="fabrics-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">Fabric library</p>
        <h2 class="display" id="fabrics-title" data-split>Knits for every <em>kind of order.</em></h2>
      </div>
      <div class="sec-head__aside">
        <p>A plain-words guide to the knit types we work with, and what each is often used for.</p>
        <a class="btn btn--line" href="/fabrics">Open the fabric library ${icon.arrow}</a>
      </div>
    </header>
    <ul class="ftiles">
      ${fabrics
        .map(
          (f, i) => `<li data-reveal style="--d:${(i % 6) * 50}ms"><a class="ftile" href="/fabrics#fabric-${f.key}"><img src="/img/tx/${f.key}.svg" alt="" width="400" height="400" loading="lazy" decoding="async"><span class="ftile__t"><strong>${esc(f.name)}</strong><small>${esc(f.usedFor.split(",")[0])}</small></span></a></li>`
        )
        .join("")}
    </ul>
    <p class="concept-note">Textures are illustrative, not photographs of the actual fabrics.</p>
  </div>
</section>`;
}

function quoteTeaser() {
  return `
<section class="section quote" id="quote" aria-labelledby="quote-title">
  <div class="wrap quote__grid">
    <header class="quote__head" data-reveal>
      <p class="eyebrow">Request a quote</p>
      <h2 class="display" id="quote-title" data-split>Get a custom <em>quote.</em></h2>
      <p class="lead">Tell us what you need. The owner will review your brief and share a quotation based on your specifications.</p>
    </header>
    <div class="qb" data-reveal>
      <p class="qb__count"><span>1</span> / 6 · Product</p>
      <h3 class="qb__q">What do you need?</h3>
      <div class="opts opts--cards">
        ${products
          .map(
            (p) => `<a class="opt opt--card" href="/quote?product=${p.slug}"><span class="opt__img">${img(p.images[0], "", { sizes: "120px", widths: [480] })}</span><span class="opt__t">${esc(p.name)}</span></a>`
          )
          .join("")}
        <a class="opt opt--card opt--plain" href="/quote?product=mixed"><span class="opt__t">A mix / not sure yet</span></a>
      </div>
    </div>
  </div>
</section>`;
}

function faqTeaser() {
  return faq(faqs.slice(0, 4), `<p class="faq__more"><a class="btn btn--line" href="/faq">All questions ${icon.arrow}</a></p>`);
}

export function home() {
  return [hero(), sectors(), who(), productGrid(), why(), fabricTeaser(), process(), clientsSection(), instagram(), reviews(), quoteTeaser(), faqTeaser(), ctaBand()].join("\n");
}

export const homeData = () => ({
  wa: site.whatsapp,
  products: products.map((p) => ({ slug: p.slug, name: p.name, fabrics: p.fabrics.map((k) => fabricByKey[k].name) })),
  fabrics: fabrics.map((f) => ({ key: f.key, name: f.name })),
});

export { sizes };
