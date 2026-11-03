import {
  site, categories, fabrics, benefits, steps, testimonials, concepts,
  clients, instagramPosts, faqs, printMethods, sizes, addresses,
} from "./data.mjs";
import { esc, waLink, img, icon } from "./util.mjs";
import { fabricById } from "./fabrics.mjs";
import { enquiryForm } from "./enquiry.mjs";

const pad = (n) => String(n).padStart(2, "0");
export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
const conceptTag = `<span class="concept-tag">Design concept</span>`;

/** Section heading with a small index label and an oversized outline number. */
export function secHead({ n, label, title, id, lead = "", aside = "", row = false, h = "h2" }) {
  return `
    <header class="sec-head${row ? " sec-head--row" : ""}" data-reveal>
      <div>
        <p class="eyebrow">${n ? `<span class="eyebrow__n">${n}</span>` : ""}${label}</p>
        <${h} class="display" id="${id}" data-split>${title}</${h}>
        ${lead ? `<p class="lead">${lead}</p>` : ""}
      </div>
      ${aside ? `<div class="sec-head__aside">${aside}</div>` : ""}
      ${n ? `<span class="sec-num" aria-hidden="true">${n}</span>` : ""}
    </header>`;
}

// The hero is also the entry sequence (see the intro classes in layout.mjs and
// "Signature entry" in site.css): type mask-reveals, the garment ring rises in
// and starts turning, then copy and CTAs settle.
function hero() {
  const lead = categoryBySlug["gym-wears"];
  // A 3D ring of the seven category garments, led by gym wear (main.js spins it; drag to turn).
  // It repeats the category links below, so it is hidden from screen readers and the tab order.
  const ring = [lead, ...categories.filter((c) => c !== lead)];
  return `
<div class="intro" data-intro>
  <button type="button" class="intro-skip" data-intro-skip>Skip intro</button>
  <div aria-hidden="true">
  <div class="intro__strips">${Array.from({ length: 10 }, (_, i) => `<span style="--i:${i}"></span>`).join("")}</div>
  <p class="intro__kicker">Custom apparel manufacturing · ${site.locations.replace("&", "&amp;")}</p>
  <span class="intro__thread"></span>
  <div class="intro__cards"><span>Fabric.</span><span>Print.</span><span>Stitch.</span><span>Dispatch.</span></div>
  <p class="intro__word"><span class="ln"><span>Made to</span></span><span class="ln"><span>order.</span></span></p>
  </div>
</div>
<section class="hero" id="top" aria-labelledby="hero-title" data-hero>
  <div class="wrap hero__grid">
    <div class="hero__media" data-ring aria-hidden="true">
      <div class="ring">
        <ul class="ring__spin" style="--n:${ring.length}">
          ${ring
            .map(
              (c, i) => `<li class="ring__card" style="--i:${i}" data-t="${pad(categories.indexOf(c) + 1)} · ${esc(c.title)}"><a href="/clothing/${c.slug}" tabindex="-1">${img(c.heroImage, "", { eager: i === 0, sizes: "(min-width: 1000px) 22vw, 45vw" })}</a></li>`
            )
            .join("")}
        </ul>
      </div>
      <span class="ring__floor"></span>
      <p class="ring__cap"><span class="ring__tag">Design concepts</span><span data-ring-cap>${pad(categories.indexOf(lead) + 1)} · ${esc(lead.title)}</span></p>
    </div>
    <div class="hero__copy">
      <p class="hero__kicker">Custom apparel manufacturing · ${site.locations.replace("&", "&amp;")}</p>
      <h1 class="hero__title" id="hero-title">
        <span class="ln"><span>Your team.</span></span>
        <span class="ln"><span>Your fabric.</span></span>
        <span class="ln ln--accent"><span>Made to order.</span></span>
      </h1>
      <span class="hero__rule" aria-hidden="true"></span>
      <p class="hero__sub">School uniforms, marathon and corporate T-shirts, track pants, gym wear, hoodies and sublimation tees, manufactured to your design, fabric and quantity.</p>
      <div class="hero__ctas">
        <a class="btn btn--accent btn--lg" href="/clothing">Explore clothing ${icon.arrow}</a>
        <a class="btn btn--ghost btn--lg" href="/contact">Request a quote</a>
      </div>
      <ul class="hero__meta" aria-label="At a glance">
        <li><strong>${categories.length}</strong> clothing categories</li>
        <li><strong>${fabrics.length}</strong> fabrics listed</li>
        <li><strong>${esc(sizes)}</strong> sizes</li>
      </ul>
    </div>
  </div>
</section>`;
}

/** Category cards (home "Capabilities"). */
function capabilities() {
  return `
<section class="section caps" id="clothing" aria-labelledby="caps-title">
  <div class="wrap">
    ${secHead({ n: "01", label: "Clothing", id: "caps-title", row: true, title: `Seven categories. <em>One workshop.</em>`, aside: `<p>Each category is made to your design, fabric and size break-up. Open one to see the fabrics DCT lists for it.</p><a class="btn btn--line" href="/clothing">The clothing archive ${icon.arrow}</a>` })}
    <div class="bento">
      ${categories
        .map(
          (c, i) => `
      <a class="pcard pcard--${i + 1}" href="/clothing/${c.slug}" data-reveal style="--d:${(i % 4) * 70}ms">
        <div class="pcard__img" data-parallax="0.05">${img(c.heroImage, `${c.title}: design concept`, { sizes: i === 0 ? "(min-width: 1000px) 50vw, 100vw" : "(min-width: 1000px) 25vw, (min-width: 640px) 50vw, 100vw" })}</div>
        <div class="pcard__shade"></div>
        <span class="pcard__num">${pad(i + 1)}</span>
        <div class="pcard__body">
          <h3 class="pcard__name">${esc(c.title)}</h3>
          <p class="pcard__teaser">${esc(c.teaser)}</p>
          <span class="pcard__cta">${c.fabrics.length ? `${c.fabrics.length} fabrics` : "Fabrics on request"} ${icon.arrow}</span>
        </div>
      </a>`
        )
        .join("")}
    </div>
    <p class="concept-note">Images are design concepts for illustration, not photographs of delivered orders.</p>
  </div>
</section>`;
}

/** Fabric story: a tactile strip of swatches, then the full library. */
function fabricStory() {
  const pick = ["lacoste", "honeycomb", "airtex", "dotknit", "jacquard", "pc-matty", "mirror-200", "ns-lycra"].map((id) => fabricById[id]);
  return `
<section class="section fstory" id="fabrics" aria-labelledby="fstory-title">
  <div class="wrap">
    ${secHead({ n: "02", label: "Fabrics", id: "fstory-title", row: true, title: `Pick the knit. <em>We cut the rest.</em>`, aside: `<p>${fabrics.length} fabrics across the categories, from Lacoste and Honeycomb to Mirror and NS Lycra. Actual availability, colours and specifications are confirmed with your quotation.</p><a class="btn btn--line" href="/fabrics">Open the fabric library ${icon.arrow}</a>` })}
    <ul class="swatches">
      ${pick
        .map(
          (f, i) => `<li data-reveal style="--d:${(i % 4) * 60}ms"><a class="swatch" href="/fabrics#fabric-${f.id}" style="--tint:${f.tint}"><img src="/img/tx/${f.id}.svg" alt="" width="400" height="400" loading="lazy" decoding="async"><span class="swatch__t"><strong>${esc(f.name)}</strong><small>${pad(i + 1)} / ${pad(fabrics.length)}</small></span></a></li>`
        )
        .join("")}
    </ul>
    <p class="concept-note">Textures are illustrative, not photographs of the actual fabrics.</p>
  </div>
</section>`;
}

/** Manufacturing: the order process, as stated on the original site. */
export function process({ n = "03", headId = "how-title", h = "h2" } = {}) {
  return `
<section class="how" id="process" aria-labelledby="${headId}" data-how>
  <div class="how__pin">
    <div class="how__track" data-how-track>
      <header class="how__intro">
        <p class="eyebrow">${n ? `<span class="eyebrow__n">${n}</span>` : ""}Manufacturing</p>
        <${h} class="display" id="${headId}" data-split>From brief <em>to dispatch.</em></${h}>
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

export function customisation() {
  return `
<section class="section custom" aria-labelledby="custom-title">
  <div class="wrap">
    ${secHead({ label: "Customisation", id: "custom-title", title: `Print it, stitch it, <em>dye it in.</em>`, lead: "Methods depend on the garment and fabric. We advise on the right one for your design." })}
    <ol class="methods-grid">
      ${printMethods.map((m, i) => `<li data-reveal style="--d:${i * 60}ms"><span class="methods-grid__n">${pad(i + 1)}</span><h3>${esc(m.name)}</h3><p>${esc(m.note)}</p></li>`).join("")}
    </ol>
  </div>
</section>`;
}

export function why({ n = "05" } = {}) {
  const icons = { check: icon.shield, sample: icon.sample, factory: icon.factory, fabric: icon.fabric, clock: icon.truck, pen: icon.pen };
  return `
<section class="section why" id="why" aria-labelledby="why-title">
  <div class="wrap why__wrap">
    <div class="why__head">
      ${secHead({ n, label: "Why D Creations", id: "why-title", title: `Made with care. <em>Checked at every stage.</em>`, lead: "With our own manufacturing setup, we keep control over quality from fabric to packing." })}
      <a class="btn btn--accent" href="/contact">Request a quote ${icon.arrow}</a>
    </div>
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

/** Concept gallery. Every item is labelled as a design concept. */
export function gallery() {
  const cats = [...new Set(concepts.map((w) => w.cat))];
  return `
<section class="section work" id="gallery" aria-labelledby="gallery-title">
  <div class="wrap">
    ${secHead({ label: "Gallery", id: "gallery-title", row: true, title: `Design concepts <em>we can make.</em>`, aside: "<p>These design concepts show the kinds of garments we make. They are not photographs of delivered client orders. For real work, see the clients above and our Instagram.</p>" })}
    <div class="work__filters" role="group" aria-label="Filter by category">
      <button type="button" class="seg is-on" data-filter="all" aria-pressed="true">All</button>
      ${cats.map((c) => `<button type="button" class="seg" data-filter="${c}" aria-pressed="false">${esc(categoryBySlug[c].title)}</button>`).join("")}
    </div>
    <ul class="work__grid" data-gallery="work">
      ${concepts
        .map(
          (w, i) => `
      <li class="work__item work__item--${i + 1}" data-cat="${w.cat}" data-reveal>
        <button type="button" class="work__btn" data-lb-src="/img/${w.img}-960.webp" data-lb-caption="${esc(`${w.title}: design concept (${categoryBySlug[w.cat].title})`)}" aria-label="${esc(`View ${w.title}, design concept, larger`)}">
          ${img(w.img, `${w.title}: design concept`, { sizes: "(min-width: 900px) 33vw, 50vw" })}
          ${conceptTag}
          <span class="work__cap"><strong>${esc(w.title)}</strong><span>${esc(categoryBySlug[w.cat].title)}</span></span>
        </button>
      </li>`
        )
        .join("")}
    </ul>
  </div>
</section>`;
}

const igPost = /^https:\/\/www\.instagram\.com\/dctshirtfactory\/(p|reel)\//;

/** Clients that pass the gate: owner's own public post(s) naming them, or written approval. */
export const shownClients = () =>
  clients.filter(
    (c) => c.name && c.work && ((c.sources || []).some((s) => igPost.test(s.url)) || (c.approvedBy && c.approvedOn))
  );

/**
 * Clients & collaborations. `full` (the /work page) adds the owner's Instagram
 * posts as click-to-load embeds; the homepage version links through to it.
 */
export function clientsSection({ full = false, n = "", h = "h2" } = {}) {
  const ok = shownClients();
  if (!ok.length) return "";
  const card = (c, i) => {
    const sources = (c.sources || []).filter((s) => igPost.test(s.url));
    const meta = [c.type, c.place, c.when].filter(Boolean).map(esc).join(" · ");
    return `
      <li class="client" data-reveal>
        ${
          c.thumbs?.length
            ? `<div class="client__thumbs${c.thumbs.length > 1 ? " client__thumbs--2" : ""}">${c.thumbs
                .map(
                  ([base, alt]) => `<button type="button" class="client__thumb" data-lb-src="/img/${base}-640.webp" data-lb-caption="${esc(c.name)}: ${esc(alt)} (from our Instagram)" aria-label="View larger: ${esc(alt)}">${img(base, alt, { sizes: "(min-width: 900px) 320px, 90vw" })}</button>`
                )
                .join("")}</div>`
            : ""
        }
        <span class="client__n" aria-hidden="true">${pad(i + 1)}</span>
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
        ${full && c.category ? `<a class="client__ask" href="/contact?category=${esc(c.category)}">Plan a similar order ${icon.arrow}</a>` : ""}
      </li>`;
  };
  return `
<section class="section clients${full ? " clients--full" : ""}" id="clients" aria-labelledby="clients-title">
  <div class="wrap">
    ${secHead({
      n,
      h,
      label: "Our work",
      id: "clients-title",
      row: !full,
      title: `Made for <em>events people run in.</em>`,
      lead: "Colleges, walkathons, marathons and run clubs that have worn kits made by DC T-Shirt Factory.",
      aside: full ? "" : `<a class="btn btn--line" href="/work">All work ${icon.arrow}</a>`,
    })}
    <ol class="clients__grid" data-gallery="clients">${ok.map(card).join("")}</ol>
    ${full ? `<p class="clients__note">Clients are listed as described in our own Instagram posts or confirmed by us. Photos are from our own Instagram posts of each order; client names and logos belong to their owners.</p>` : ""}
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
      <h2 class="display display--sm" id="ig-title" data-split>See our real work on Instagram</h2>
      <p class="lead">Our latest products, production and customer orders are posted on ${site.instagramHandle}.</p>
    </div>
    ${grid}
    <a class="btn btn--line ig__cta" href="${site.instagram}" target="_blank" rel="noopener">${icon.instagram} View ${site.instagramHandle} on Instagram</a>
  </div>
</section>`;
}

export function reviews() {
  return `
<section class="section reviews" id="reviews" aria-labelledby="reviews-title">
  <div class="wrap">
    ${secHead({ label: "Customer feedback", id: "reviews-title", row: true, title: `What customers <em>told us.</em>`, aside: `<p>Shared on our previous website.</p><a class="btn btn--line" href="${site.mapsUrl}" target="_blank" rel="noopener">${icon.pin} Our Google Maps listing</a>` })}
    <ul class="quotes">
      ${testimonials
        .map(
          (t) => `
      <li data-reveal><figure class="tcard">
        <blockquote><p>“${esc(t.text)}”</p></blockquote>
        <figcaption><span class="tcard__av" aria-hidden="true">${esc(t.name[0])}</span><strong>${esc(t.name)}</strong></figcaption>
      </figure></li>`
        )
        .join("")}
    </ul>
  </div>
</section>`;
}

export function aboutStory({ h = "h2" } = {}) {
  return `
<section class="section bts" id="story" aria-labelledby="bts-title">
  <div class="wrap bts__grid">
    <div class="bts__copy" data-reveal>
      <p class="eyebrow">About us</p>
      <${h} class="display" id="bts-title" data-split>Made in Mangalore <em>&amp; Tiruppur.</em></${h}>
      <p class="lead">D Creations (DC T-Shirt Factory) manufactures quality T-shirts and custom apparel: school uniforms, sportswear, corporate polos, hoodies, varsity jackets and sublimation jerseys. With our own manufacturing setup, we keep full control over quality.</p>
      <p>As a true custom apparel company, we welcome every customisation request, however unique, and work to your requirement and timeline from concept to delivery. Small runs and bulk orders welcome.</p>
    </div>
    <ul class="about__pillars" data-reveal>
      <li><h3>Quality first</h3><p>Checks at every stage: fabric, stitching, finishing and packing.</p></li>
      <li><h3>Made to order</h3><p>From concept to delivery, with samples and approvals along the way.</p></li>
      <li><h3>Wide fabric range</h3><p>${fabrics.length} fabrics listed across our categories. <a href="/fabrics">See the fabric library</a>.</p></li>
    </ul>
  </div>
</section>`;
}

/** Both units, from the owner's catalogue. */
export function units() {
  return `
<section class="section units" aria-labelledby="units-title">
  <div class="wrap">
    ${secHead({ label: "Where we work", id: "units-title", title: `Two units. <em>One standard.</em>` })}
    <ul class="units__grid">
      ${addresses
        .map(
          (a, i) => `<li class="unit" data-reveal style="--d:${i * 80}ms"><p class="unit__k">${esc(a.city)}</p><h3>${esc(a.name)}</h3><address>${a.lines.map(esc).join("<br>")}</address>${a.maps ? `<a href="${site.mapsUrl}" target="_blank" rel="noopener">Open in Google Maps ${icon.arrow}</a>` : ""}</li>`
        )
        .join("")}
    </ul>
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

export function faq({ items = faqs, more = "", n = "", h = "h2" } = {}) {
  return `
<section class="section faqs" id="faq" aria-labelledby="faq-title">
  <div class="wrap faqs__grid">
    <div>
      ${secHead({ n, label: "FAQ", id: "faq-title", h, title: `Good questions. <em>Straight answers.</em>`, lead: "Something else on your mind? Ask us on WhatsApp." })}
      <a class="btn btn--line" href="${waLink("Hello D Creations (DC T-Shirt Factory), I have a question: ")}" target="_blank" rel="noopener">${icon.whatsapp} Ask a question</a>
    </div>
    <div>${faqList(items)}${more}</div>
  </div>
</section>`;
}

/** Contact channels: WhatsApp, call, email, Instagram, both addresses. */
export function channels() {
  return `
      <ul class="contact__list">
        <li><a href="${waLink()}" target="_blank" rel="noopener"><span class="contact__ico">${icon.whatsapp}</span><span><small>WhatsApp</small>${site.phoneDisplay}</span></a></li>
        <li><a href="tel:${site.phoneHref}"><span class="contact__ico">${icon.phone}</span><span><small>Call</small>${site.phoneDisplay}</span></a></li>
        <li><a href="mailto:${site.email}"><span class="contact__ico">${icon.mail}</span><span><small>Email</small>${site.email}</span></a></li>
        <li><a href="${site.instagram}" target="_blank" rel="noopener"><span class="contact__ico">${icon.instagram}</span><span><small>Instagram</small>${site.instagramHandle}</span></a></li>
        ${addresses
          .map((a) => {
            const body = `<span class="contact__ico">${icon.pin}</span><span><small>${esc(a.city)} · ${esc(a.name)}</small><address>${a.lines.map(esc).join("<br>")}</address>${a.maps ? `<span class="contact__go">Open in Google Maps</span>` : ""}</span>`;
            return a.maps ? `<li><a href="${site.mapsUrl}" target="_blank" rel="noopener">${body}</a></li>` : `<li><div>${body}</div></li>`;
          })
          .join("")}
      </ul>`;
}

/** Enquiry form beside the contact channels. Used on the homepage and /contact. */
export function contactSection({ n = "", h = "h2", title = `Tell us what <em>you need.</em>`, map = false } = {}) {
  return `
<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap contact__grid">
    <div class="contact__side">
      ${secHead({ n, label: "Contact &amp; quote", id: "contact-title", h, title, lead: "Share the category, rough quantity and any fabric or design ideas. The owner will review your brief and reply with a quotation." })}
      ${channels()}
      ${
        map
          ? `<div class="contact__map" data-map data-src="https://www.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=15&output=embed">
        <button type="button" class="contact__mapbtn" data-map-load>${icon.pin} Show map</button>
        <p class="contact__mapnote">Loads Google Maps, which may set cookies.</p>
        <a class="contact__maplink" href="${site.mapsUrl}" target="_blank" rel="noopener">Open in Google Maps ${icon.arrow}</a>
      </div>`
          : ""
      }
    </div>
    <div class="contact__form" id="enquiry">
      <p class="contact__form-h">Enquiry · WhatsApp handoff</p>
      ${enquiryForm()}
    </div>
  </div>
</section>`;
}

export function ctaBand(title = `Ready when <em>you are.</em>`, href = "/contact") {
  return `
<section class="cta" aria-labelledby="cta-title">
  <div class="wrap cta__in">
    <h2 class="display cta__title" id="cta-title" data-split>${title}</h2>
    <p class="lead">Share your category, quantity and date. The owner will review your brief and send a quotation.</p>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" href="${href}">Request a quote ${icon.arrow}</a>
      <a class="btn btn--ghost btn--lg" href="tel:${site.phoneHref}">${icon.phone} Call ${site.phoneDisplay}</a>
    </div>
  </div>
</section>`;
}

export function home() {
  return [
    hero(),
    capabilities(),
    fabricStory(),
    process({ n: "03" }),
    clientsSection({ n: "04" }),
    why({ n: "05" }),
    faq({ items: faqs.slice(0, 5), n: "06", more: `<p class="faq__more"><a class="btn btn--line" href="/faq">All questions ${icon.arrow}</a></p>` }),
    contactSection({ n: "07", title: `Ready when you are. <em>Tell us what you need.</em>` }),
  ].join("\n");
}
