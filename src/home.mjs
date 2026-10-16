import {
  site, stats, heroTrust, products, fabrics, audiences, benefits, steps,
  testimonials, portfolio, clientLogos, faqs, faqValues, story, printMethods, sizes,
} from "./data.mjs";
import { esc, show, val, isTbc, inr, waLink, img, slotTag, icon, audienceIcon } from "./util.mjs";

const pad = (n) => String(n).padStart(2, "0");
const byKey = Object.fromEntries(products.map((p) => [p.slug, p]));

// Plain-text version of a value (for FAQ answers etc.), placeholders marked.
const txt = (x) => show(x);

function hero() {
  const frames = [1, 2, 3, 4];
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__media" aria-hidden="true">
    <!-- [HERO VIDEO] When the client supplies footage, add:
         <video class="hero__video" autoplay muted loop playsinline poster="/img/hero-1-1600.webp"><source src="/video/hero.mp4" type="video/mp4"></video>
         The Ken Burns frames below then act as the fallback. -->
    <div class="kb" data-kb>
      ${frames.map((n, i) => `<div class="kb__frame${i === 0 ? " is-on" : ""}">${img(`hero-${n}`, "", { sizes: "100vw", eager: i === 0 })}</div>`).join("")}
    </div>
    <div class="hero__shade"></div>
  </div>
  ${slotTag("[HERO VIDEO: 15s loop — fabric rolls → printing press → stitching close-up → finished jerseys]")}
  <div class="wrap hero__content">
    <p class="eyebrow hero__eyebrow"><span class="pulse"></span>Custom apparel manufacturer · Mangalore &amp; Tiruppur</p>
    <h1 class="hero__title" id="hero-title" data-split>We don't just print tees. <em>We build your team's identity.</em></h1>
    <p class="hero__sub">School uniforms, event tees, corporate polos, jerseys and hoodies — designed with you, sampled before bulk, and delivered anywhere in India.</p>
    <div class="hero__ctas">
      <a class="btn btn--accent btn--lg" data-magnetic href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp} Get a free quote on WhatsApp</a>
      <a class="btn btn--ghost btn--lg" href="#products">Explore products ${icon.arrow}</a>
    </div>
    <ul class="hero__trust">
      ${heroTrust.map((t) => `<li>${icon.check}${show(t)}</li>`).join("")}
    </ul>
  </div>
  <a class="hero__scroll" href="#who" aria-label="Scroll to content"><span></span></a>
</section>`;
}

function marquee() {
  const words = ["Schools", "Corporates", "Sports clubs", "Marathon organisers", "Gyms", "Colleges", "Event companies", "Startups"];
  const row = words.map((w) => `<span>${w}</span><i aria-hidden="true">✦</i>`).join("");
  const logos = clientLogos.length
    ? `<div class="marquee marquee--logos" aria-label="Clients"><div class="marquee__track">${[...clientLogos, ...clientLogos]
        .map((c, i) => `<img src="/img/${c.file}" alt="${i < clientLogos.length ? esc(c.name) : ""}" loading="lazy" height="40">`)
        .join("")}</div></div>`
    : "";
  return `
<section class="trustband" aria-label="Who trusts us">
  <p class="trustband__lead">Trusted by</p>
  <div class="marquee"><div class="marquee__track"><div class="marquee__set">${row}</div><div class="marquee__set" aria-hidden="true">${row}</div></div></div>
  ${logos}
</section>`;
}

function who() {
  return `
<section class="section who" id="who" aria-labelledby="who-title">
  <div class="wrap">
    <header class="sec-head" data-reveal>
      <p class="eyebrow">Who we make for</p>
      <h2 class="display" id="who-title" data-split>Whoever you're dressing, <em>we've made it before.</em></h2>
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
      <p class="sec-head__aside">Every category is made to your design, fabric and size break-up. Tap one for MOQ, pricing, fabrics and turnaround.</p>
    </header>
    <div class="bento">
      ${products
        .map(
          (p, i) => `
      <a class="pcard pcard--${i + 1}" href="/products/${p.slug}" data-reveal style="--d:${(i % 4) * 70}ms">
        <div class="pcard__img" data-parallax="0.06">${img(p.images[0], `${p.short} made by D Creations`, { sizes: i === 0 ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, 100vw" })}</div>
        <div class="pcard__shade"></div>
        <span class="pcard__num">${pad(i + 1)}</span>
        <span class="pcard__price">from ${show(p.priceFrom, inr)}</span>
        <div class="pcard__body">
          <h3 class="pcard__name">${esc(p.name)}</h3>
          <div class="pcard__more"><div><p class="pcard__teaser">${esc(p.teaser)}</p><span class="pcard__cta">View details ${icon.arrow}</span></div></div>
        </div>
      </a>`
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function why() {
  const icons = { check: icon.shield, sample: icon.sample, factory: icon.factory, fabric: icon.fabric, clock: icon.clockFast, pen: icon.pen };
  return `
<section class="section why" id="why" aria-labelledby="why-title">
  <div class="wrap why__wrap">
    <header class="sec-head why__head" data-reveal>
      <p class="eyebrow">Why D Creations</p>
      <h2 class="display" id="why-title" data-split>Factory direct. <em>Zero guesswork.</em></h2>
      <p class="lead">You deal with the people who actually make your clothes. No middlemen, no surprises between the sample and the bulk.</p>
      <a class="btn btn--accent" data-magnetic href="#quote">Start your quote ${icon.arrow}</a>
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

function statsBand() {
  return `
<section class="stats" aria-label="D Creations in numbers">
  <div class="wrap stats__grid">
    ${stats
      .map((s) => {
        const n = val(s.value);
        const num = `<span class="stats__num" data-count="${n}">${Number(n).toLocaleString("en-IN")}</span>${s.suffix}`;
        return `
    <div class="stats__item" data-reveal>
      <p class="stats__value">${isTbc(s.value) ? `<span class="tbc" title="Placeholder — to be confirmed by D Creations">${num}</span>` : num}</p>
      <p class="stats__label">${esc(s.label)}</p>
    </div>`;
      })
      .join("")}
  </div>
</section>`;
}

const tier = (t) => {
  const n = val(t);
  const label = ["", "Budget-friendly", "Mid-range", "Premium"][n];
  const html = `<span class="tier" aria-label="${label}">${"₹".repeat(n)}<span aria-hidden="true">${"₹".repeat(3 - n)}</span></span> ${label}`;
  return isTbc(t) ? `<span class="tbc" title="Placeholder — to be confirmed by D Creations">${html}</span>` : html;
};

const meter = (n) =>
  `<span class="meter" role="img" aria-label="${n} out of 5">${[1, 2, 3, 4, 5].map((i) => `<i${i <= n ? ' class="on"' : ""}></i>`).join("")}</span>`;

function fabricGuide() {
  return `
<section class="section fabrics" id="fabrics" aria-labelledby="fabrics-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">Fabric guide</p>
        <h2 class="display" id="fabrics-title" data-split>Lacoste? Dotknit? <em>Here's what they feel like.</em></h2>
      </div>
      <p class="sec-head__aside">Fabric names mean little until you touch them. Pick one to see how it feels, how heavy it is (GSM) and what it's best for. Not sure? We'll post you swatches.</p>
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
        <div class="fab__swatch">
          <img class="fab__tx" src="/img/tx/${f.key}.svg" alt="" width="400" height="400" loading="lazy" decoding="async">
          ${slotTag(`[MACRO PHOTO: ${f.name} fabric close-up]`)}
          <span class="fab__name-big" aria-hidden="true">${esc(f.name.split(" (")[0])}</span>
        </div>
        <div class="fab__info">
          <h3>${esc(f.name)}</h3>
          <p class="fab__feel">${esc(f.feel)}</p>
          <dl class="fab__specs">
            <div><dt>Weight (GSM)</dt><dd>${show(f.gsm)}</dd></div>
            <div><dt>Breathability</dt><dd>${meter(f.breathability)}</dd></div>
            <div><dt>Price tier</dt><dd>${tier(f.priceTier)}</dd></div>
            <div><dt>Best for</dt><dd>${esc(f.bestFor)}</dd></div>
          </dl>
          <a class="btn btn--line btn--sm" href="${waLink(`Hi D Creations! Can you send me swatches / details for ${f.name} fabric?`)}" target="_blank" rel="noopener">${icon.whatsapp} Ask for a ${esc(f.name.split(" (")[0])} swatch</a>
        </div>
      </div>`
        )
        .join("")}
    </div>
    <p class="fab__note">GSM = grams per square metre. Higher GSM means a thicker, heavier fabric.</p>
  </div>
</section>`;
}

function process() {
  return `
<section class="how" id="process" aria-labelledby="how-title" data-how>
  <div class="how__pin">
    <div class="how__track" data-how-track>
      <header class="how__intro">
        <p class="eyebrow">How we work</p>
        <h2 class="display" id="how-title" data-split>Idea to doorstep <em>in 4 steps.</em></h2>
        <p class="lead">You see and approve everything before bulk production begins. No surprises.</p>
        <p class="how__hint" aria-hidden="true">Scroll ${icon.arrow}</p>
      </header>
      ${steps
        .map(
          (s) => `
      <article class="how__step" data-reveal>
        <span class="how__n" aria-hidden="true">${s.n}</span>
        <div class="how__photo">${slotTag(s.photo)}</div>
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

function work() {
  const cats = [...new Set(portfolio.map((w) => w.cat))];
  return `
<section class="section work" id="work" aria-labelledby="work-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">Our work</p>
        <h2 class="display" id="work-title" data-split>Made here. <em>Worn everywhere.</em></h2>
      </div>
      <div class="work__filters" role="group" aria-label="Filter by category">
        <button type="button" class="chip is-on" data-filter="all" aria-pressed="true">All</button>
        ${cats.map((c) => `<button type="button" class="chip" data-filter="${c}" aria-pressed="false">${esc(byKey[c].name)}</button>`).join("")}
      </div>
    </header>
    <ul class="work__grid" data-gallery="work">
      ${portfolio
        .map(
          (w, i) => `
      <li class="work__item work__item--${i + 1}" data-cat="${w.cat}" data-reveal>
        <button type="button" class="work__btn" data-lb-src="/img/${w.img}-960.webp" data-lb-caption="${esc(`${w.title} — ${byKey[w.cat].name}`)}">
          ${img(w.img, `${w.title} — ${byKey[w.cat].name}`, { sizes: "(min-width: 900px) 33vw, 50vw" })}
          <span class="work__cap"><strong>${esc(w.title)}</strong><span>${esc(byKey[w.cat].name)}</span></span>
          ${slotTag(w.slot)}
        </button>
      </li>`
        )
        .join("")}
    </ul>
    <p class="work__more"><a class="btn btn--line" href="${site.instagram}" target="_blank" rel="noopener">${icon.instagram} See more on Instagram ${site.instagramHandle}</a></p>
  </div>
</section>`;
}

function behind() {
  return `
<section class="section bts" id="story" aria-labelledby="bts-title">
  <div class="wrap bts__grid">
    <div class="bts__copy" data-reveal>
      <p class="eyebrow">Behind the scenes</p>
      <h2 class="display" id="bts-title" data-split>Made in Mangalore <em>&amp; Tiruppur.</em></h2>
      <p class="lead">Two cities, one standard. Our Mangalore studio is where you meet us, feel fabrics and approve samples. Tiruppur — India's knitwear capital — gives us the fabric mills and production muscle for big runs.</p>
      <div class="bts__hubs">
        <div class="hub"><span class="hub__k">Hub 01</span><h3>Mangalore</h3><p>Design, sampling, customer service and finishing. Walk in any working day.</p></div>
        <div class="hub"><span class="hub__k">Hub 02</span><h3>Tiruppur</h3><p>Fabric sourcing and high-volume knitting, printing and stitching.</p></div>
      </div>
      <p class="bts__gst">${icon.shield}<span>Registered business · GST invoice on every order · GSTIN ${show(site.gstin)}</span></p>
    </div>
    <div class="bts__strip" aria-label="Factory photos">
      ${story.photos
        .map(
          (p, i) => `<figure class="bts__ph bts__ph--${i + 1}" data-parallax="${[0.08, -0.06, 0.1, -0.04, 0.06, -0.08][i]}">${p.startsWith("[VIDEO") ? `<span class="bts__play">${icon.arrow}</span>` : ""}${slotTag(p)}</figure>`
        )
        .join("")}
    </div>
  </div>
</section>`;
}

const stars = (s) => {
  const n = val(s);
  const html = `<span class="stars" role="img" aria-label="${n} out of 5 stars">${icon.star.repeat(n)}</span>`;
  return isTbc(s) ? `<span class="tbc" title="Placeholder — to be confirmed by D Creations">${html}</span>` : html;
};

function reviews() {
  return `
<section class="section reviews" id="reviews" aria-labelledby="reviews-title">
  <div class="wrap">
    <header class="sec-head sec-head--row" data-reveal>
      <div>
        <p class="eyebrow">Reviews</p>
        <h2 class="display" id="reviews-title" data-split>Don't take <em>our word for it.</em></h2>
      </div>
      <a class="gbadge" href="${site.mapsUrl}" target="_blank" rel="noopener">
        ${icon.google}
        <span><strong>${show(site.googleRating)}</strong> ${icon.star}<small>${show(site.googleReviewCount)} Google reviews</small></span>
      </a>
    </header>
    <div class="slider" data-slider>
      <div class="slider__track" data-slider-track tabindex="0" aria-label="Customer reviews" role="region">
        ${testimonials
          .map(
            (t) => `
        <figure class="tcard" data-slide>
          ${stars(t.stars)}
          <blockquote><p>“${esc(t.text)}”</p></blockquote>
          <figcaption><span class="tcard__av" aria-hidden="true">${esc(t.name[0])}</span><span><strong>${esc(t.name)}</strong><small>Verified customer</small></span></figcaption>
        </figure>`
          )
          .join("")}
      </div>
      <div class="slider__ctrl">
        <button type="button" class="round" data-slider-prev aria-label="Previous review">${icon.arrowL}</button>
        <div class="slider__dots" data-slider-dots></div>
        <button type="button" class="round" data-slider-next aria-label="Next review">${icon.arrow}</button>
        <a class="btn btn--line btn--sm slider__g" href="${site.mapsUrl}" target="_blank" rel="noopener">Read all on Google ${icon.arrow}</a>
      </div>
    </div>
  </div>
</section>`;
}

function quote() {
  const qty = ["25–50", "50–100", "100–250", "250–500", "500–1,000", "1,000+"];
  const when = ["Urgent (under 2 weeks)", "2–4 weeks", "1–2 months", "Flexible"];
  return `
<section class="section quote" id="quote" aria-labelledby="quote-title">
  <div class="wrap quote__grid">
    <header class="quote__head" data-reveal>
      <p class="eyebrow">Smart quote builder</p>
      <h2 class="display" id="quote-title" data-split>Your quote in <em>60 seconds.</em></h2>
      <p class="lead">Six quick taps. We turn your answers into a neat WhatsApp message — you just hit send. We usually reply within working hours.</p>
      <ul class="quote__perks">
        <li>${icon.check} No obligation, no spam</li>
        <li>${icon.check} Not sure about something? Skip it</li>
        <li>${icon.check} Free mock-up with every quote</li>
      </ul>
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
        <legend>Which fabric?</legend>
        <p class="qb__help">Showing fabrics we suggest for your product. <a href="#fabrics">Compare fabrics</a></p>
        <div class="opts" data-qb-fabrics></div>
      </fieldset>

      <fieldset class="qb__step" data-step="3" data-label="Quantity">
        <legend>Roughly how many pieces?</legend>
        <div class="opts">
          ${qty.map((q) => `<label class="opt"><input type="radio" name="qty" value="${q}"><span>${q}</span></label>`).join("")}
        </div>
        <label class="field field--inline"><span>Or exact number</span><input type="number" name="qtyExact" min="1" inputmode="numeric" placeholder="e.g. 180"></label>
      </fieldset>

      <fieldset class="qb__step" data-step="4" data-label="Branding">
        <legend>How should we add your logo/design?</legend>
        <p class="qb__help">Pick one or more.</p>
        <div class="opts opts--list">
          ${printMethods.map((m) => `<label class="opt opt--row"><input type="checkbox" name="print" value="${esc(m.name)}"><span><strong>${esc(m.name)}</strong><small>${esc(m.note)}</small></span></label>`).join("")}
          <label class="opt opt--row"><input type="checkbox" name="print" value="Not sure — suggest one"><span><strong>Not sure</strong><small>We'll suggest the best method for your design and budget.</small></span></label>
        </div>
      </fieldset>

      <fieldset class="qb__step" data-step="5" data-label="Deadline">
        <legend>When do you need it?</legend>
        <div class="opts">
          ${when.map((w) => `<label class="opt"><input type="radio" name="when" value="${w}"><span>${w}</span></label>`).join("")}
        </div>
        <label class="field field--inline"><span>Or a specific date</span><input type="date" name="date"></label>
      </fieldset>

      <fieldset class="qb__step" data-step="6" data-label="Your details">
        <legend>Where should we send your quote?</legend>
        <div class="fields">
          <label class="field"><span>Your name *</span><input name="name" autocomplete="name" required placeholder="e.g. Rajesh Kumar"></label>
          <label class="field"><span>Phone / WhatsApp *</span><input name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="+91 98XXXXXXXX" pattern="[0-9+ ()-]{10,16}"></label>
          <label class="field"><span>School / company / team</span><input name="org" autocomplete="organization" placeholder="Optional"></label>
          <label class="field"><span>City</span><input name="city" autocomplete="address-level2" placeholder="Optional"></label>
          <label class="field field--wide"><span>Anything else?</span><textarea name="notes" rows="3" placeholder="Colours, sizes, design idea, delivery address…"></textarea></label>
        </div>
        <div class="qb__preview" aria-live="polite">
          <p class="qb__preview-h">Your WhatsApp message</p>
          <pre data-qb-preview></pre>
        </div>
      </fieldset>

      <p class="qb__err" role="alert" data-qb-err></p>
      <div class="qb__nav">
        <button type="button" class="btn btn--ghost" data-qb-back hidden>${icon.arrowL} Back</button>
        <button type="button" class="btn btn--accent" data-qb-next>Next ${icon.arrow}</button>
        <button type="submit" class="btn btn--accent" data-qb-send hidden>${icon.whatsapp} Send on WhatsApp</button>
      </div>
      <noscript><p class="qb__help">The quote builder needs JavaScript. You can <a href="${waLink()}">message us on WhatsApp</a> directly instead.</p></noscript>
    </form>
  </div>
</section>`;
}

export function faqList(items, idPrefix = "faq") {
  return `<div class="faq">${items
    .map(
      ([q, a], i) => `
    <details class="faq__item" data-reveal${i === 0 ? " open" : ""}>
      <summary id="${idPrefix}-${i}"><span>${esc(q)}</span><span class="faq__ico" aria-hidden="true">${icon.plus}</span></summary>
      <div class="faq__a"><p>${a}</p></div>
    </details>`
    )
    .join("")}</div>`;
}

export const homeFaqItems = () => {
  const v = Object.fromEntries(Object.entries(faqValues).map(([k, x]) => [k, txt(x)]));
  return faqs.map(([q, a]) => [q, a(v)]);
};

function faq() {
  return `
<section class="section faqs" id="faq" aria-labelledby="faq-title">
  <div class="wrap faqs__grid">
    <header class="sec-head" data-reveal>
      <p class="eyebrow">FAQ</p>
      <h2 class="display" id="faq-title" data-split>Good questions. <em>Straight answers.</em></h2>
      <p class="lead">Something else on your mind? Ask us on WhatsApp — a real person replies.</p>
      <a class="btn btn--line" href="${waLink("Hi D Creations! I have a question: ")}" target="_blank" rel="noopener">${icon.whatsapp} Ask a question</a>
    </header>
    ${faqList(homeFaqItems())}
  </div>
</section>`;
}

export function ctaBand(title = `Ready to build your team's look? <em>Let's talk.</em>`, msg) {
  return `
<section class="cta" aria-labelledby="cta-title">
  <div class="cta__glow" aria-hidden="true"></div>
  <div class="wrap cta__in">
    <h2 class="display cta__title" id="cta-title" data-split>${title}</h2>
    <p class="lead">Send your logo, quantity and date. We'll come back with fabric options, a mock-up and a price.</p>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" data-magnetic href="${waLink(msg)}" target="_blank" rel="noopener">${icon.whatsapp} Chat on WhatsApp</a>
      <a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}">${icon.phone} Call ${site.phoneDisplay}</a>
    </div>
  </div>
</section>`;
}

function contact() {
  const a = site.address;
  return `
<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap contact__grid">
    <div data-reveal>
      <p class="eyebrow">Contact</p>
      <h2 class="display" id="contact-title">Visit, call <em>or message.</em></h2>
      <ul class="contact__list">
        <li><a href="${waLink()}" target="_blank" rel="noopener"><span class="contact__ico">${icon.whatsapp}</span><span><small>WhatsApp (fastest)</small>${site.phoneDisplay}</span></a></li>
        <li><a href="tel:${site.phoneHref}"><span class="contact__ico">${icon.phone}</span><span><small>Call</small>${site.phoneDisplay}</span></a></li>
        <li><a href="mailto:${val(site.email)}"><span class="contact__ico">${icon.mail}</span><span><small>Email</small>${show(site.email)}</span></a></li>
        <li><a href="${site.instagram}" target="_blank" rel="noopener"><span class="contact__ico">${icon.instagram}</span><span><small>Instagram</small>${site.instagramHandle}</span></a></li>
        <li><a href="${site.mapsUrl}" target="_blank" rel="noopener"><span class="contact__ico">${icon.pin}</span><span><small>Studio · Mangalore</small><address>${show(a.street)}, ${a.locality}, ${a.region} ${show(a.postalCode)}</address></span></a></li>
        <li><div><span class="contact__ico">${icon.clock}</span><span><small>Business hours</small>${show(site.hours)}</span></div></li>
      </ul>
    </div>
    <div class="contact__map" data-map data-src="https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=15&output=embed">
      <button type="button" class="contact__mapbtn" data-map-load>${icon.pin} Load map</button>
      <a class="contact__maplink" href="${site.mapsUrl}" target="_blank" rel="noopener">Open in Google Maps ${icon.arrow}</a>
    </div>
  </div>
</section>`;
}

export function home() {
  return [hero(), marquee(), who(), productGrid(), why(), statsBand(), fabricGuide(), process(), work(), behind(), reviews(), quote(), faq(), ctaBand(), contact()].join("\n");
}

export const homeData = () => ({
  wa: site.whatsapp,
  products: products.map((p) => ({ slug: p.slug, name: p.name, fabrics: p.fabrics })),
});

export { sizes };
