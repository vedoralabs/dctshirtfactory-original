import { site, categories, addresses } from "./data.mjs";
import { esc, waLink, icon, imgSize } from "./util.mjs";

export const NAV = [
  ["Clothing", "/clothing"],
  ["Fabrics", "/fabrics"],
  ["Manufacturing", "/manufacturing"],
  ["Our Work", "/work"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

const year = new Date().getFullYear();

// Runs before first paint. Decides which version of the homepage entry plays, so the
// first frame is already the right one (no flash, no layout jump):
//   intro-play  first visit this session: the full sequence (~2 s, skippable)
//   intro-short repeat visit: a quick settle
//   intro-lite  low-power device or Save-Data: fades only, no clip/scale
// Reduced motion gets none of them. Everything is CSS, so nothing waits on JS or images;
// the timeout here removes the overlay even if main.js fails to load.
const introBoot = `(function(){var d=document.documentElement;d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('rm');return}if(!d.hasAttribute('data-home'))return;var n=navigator,c=n.connection||{},seen=sessionStorage.getItem('dct:intro');var lite=c.saveData||(n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2);d.classList.add(seen?'intro-short':lite?'intro-lite':'intro-play');if(!seen&&!lite)setTimeout(function(){d.classList.add('intro-done')},5200);sessionStorage.setItem('dct:intro','1')}catch(e){}})();`;

function head({ title, description, path, ogImage = "/img/og-image.jpg", jsonLd = [], preload = "", home = false }) {
  const url = site.url + path;
  return `<!doctype html>
<html lang="en-IN"${home ? " data-home" : ""}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${site.indexable ? "" : `<meta name="robots" content="noindex">
`}<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0e0f10">
<meta property="og:type" content="website">
<meta property="og:site_name" content="D Creations">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" as="font" type="font/woff2" href="/fonts/anton-latin.woff2" crossorigin>
${preload}<link rel="stylesheet" href="/css/site.css">
<script>${introBoot}</script>
${jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>`;
}

function header(current) {
  const [lw, lh] = imgSize("logo-light.png");
  const isCurrent = (h) => current && (current === h || current.startsWith(`${h}/`));
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="hdr" data-hdr>
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="/" aria-label="D Creations, home"><img src="/img/logo-light.png" alt="D Creations" width="${lw}" height="${lh}"></a>
    <nav class="hdr__nav" aria-label="Main">
      ${NAV.map(([l, h]) => `<a href="${h}"${isCurrent(h) ? ' class="is-current" aria-current="page"' : ""}>${l}</a>`).join("")}
    </nav>
    <a class="btn btn--accent btn--sm hdr__cta" href="/contact">Request a quote</a>
    <button class="hdr__burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu" data-burger><span></span><span></span></button>
  </div>
</header>
<!-- Sibling of the header, not inside it: the header's backdrop-filter would
     otherwise become the containing block and clip this fixed overlay. -->
<div class="mnav" id="mnav" data-mnav role="dialog" aria-modal="true" aria-label="Menu" hidden>
    <nav aria-label="Mobile">
      ${[["Home", "/"], ...NAV].map(([l, h], i) => `<a href="${h}" style="--i:${i}"${(h === "/" ? current === "/" : isCurrent(h)) ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
    </nav>
    <div class="mnav__foot">
      <a class="btn btn--accent" href="/contact">Request a quote ${icon.arrow}</a>
      <a class="btn btn--wa" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp} WhatsApp ${site.phoneDisplay}</a>
      <a class="btn btn--ghost" href="tel:${site.phoneHref}">${icon.phone} Call ${site.phoneDisplay}</a>
    </div>
</div>`;
}

export function footer() {
  return `
<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand" data-reveal>
      <a href="/" class="ftr__logo" aria-label="D Creations, home"><img src="/img/logo-light.png" alt="D Creations" width="273" height="135" loading="lazy"></a>
      <p>Custom apparel manufacturer for schools, companies, teams and events. ${site.locations.replace("&", "&amp;")}.</p>
      <div class="ftr__social">
        <a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${site.instagramHandle}">${icon.instagram}</a>
        <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon.whatsapp}</a>
        <a href="${site.mapsUrl}" target="_blank" rel="noopener" aria-label="Google Maps">${icon.pin}</a>
      </div>
    </div>
    <nav class="ftr__col" aria-label="Site" data-reveal>
      <h2>Site</h2>
      <a href="/">Home</a>
      ${NAV.map(([l, h]) => `<a href="${h}">${l}</a>`).join("")}
      <a href="/faq">FAQ</a>
      <a href="/privacy">Privacy notice</a>
    </nav>
    <nav class="ftr__col" aria-label="Clothing categories" data-reveal>
      <h2>Clothing</h2>
      ${categories.map((c) => `<a href="/clothing/${c.slug}">${esc(c.title)}</a>`).join("")}
    </nav>
    <div class="ftr__col" data-reveal>
      <h2>Contact</h2>
      <a href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp} WhatsApp ${site.phoneDisplay}</a>
      <a href="tel:${site.phoneHref}">${icon.phone} Call ${site.phoneDisplay}</a>
      <a href="mailto:${site.email}">${icon.mail} ${site.email}</a>
      <a href="${site.instagram}" target="_blank" rel="noopener">${icon.instagram} ${site.instagramHandle}</a>
      ${addresses
        .map((a) => `<p class="ftr__addr">${icon.pin}<span><strong>${esc(a.name)}</strong><br>${a.lines.map(esc).join("<br>")}</span></p>`)
        .join("")}
      <a class="ftr__quote" href="/contact">Request a quote ${icon.arrow}</a>
    </div>
  </div>
  <div class="wrap ftr__bottom">
    <p>© <span data-year>${year}</span> D Creations. All rights reserved.</p>
    <p>Made in Mangalore &amp; Tiruppur · <a href="https://vedoralabs.co.in" target="_blank" rel="noopener">Website by Vedora Labs</a></p>
  </div>
</footer>`;
}

function actionBars() {
  return `
<a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with D Creations on WhatsApp">${icon.whatsapp}<span>WhatsApp</span></a>
<nav class="mbar" aria-label="Quick actions">
  <a href="tel:${site.phoneHref}">${icon.phone}<span>Call</span></a>
  <a class="mbar__wa" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>WhatsApp</span></a>
  <a href="/contact">${icon.grid}<span>Get a quote</span></a>
</nav>
<dialog class="lb" data-lightbox aria-label="Image viewer">
  <button class="lb__close" type="button" data-lb-close aria-label="Close">${icon.close}</button>
  <button class="lb__nav lb__prev" type="button" data-lb-prev aria-label="Previous image">${icon.arrowL}</button>
  <figure><img alt="" data-lb-img><figcaption data-lb-cap></figcaption></figure>
  <button class="lb__nav lb__next" type="button" data-lb-next aria-label="Next image">${icon.arrow}</button>
</dialog>`;
}

export const orgSchema = () => {
  const o = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    alternateName: site.altName,
    description:
      "Custom apparel manufacturer: school uniform T-shirts, marathon T-shirts, track pants and shorts, corporate T-shirts, gym wear, hoodies and sublimation T-shirts.",
    url: site.url,
    logo: `${site.url}/img/icon-512.png`,
    image: `${site.url}/img/og-image.jpg`,
    telephone: site.phoneHref,
    sameAs: [site.instagram, site.mapsUrl],
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: site.mapsUrl,
    areaServed: { "@type": "Country", name: "India" },
    address: { "@type": "PostalAddress", addressLocality: site.locality, addressRegion: site.region, addressCountry: "IN" },
  };
  // Only confirmed facts. No prices, ratings, reviews or opening hours.
  if (site.street) o.address.streetAddress = site.street;
  if (site.postalCode) o.address.postalCode = site.postalCode;
  if (site.email) o.email = site.email;
  return o;
};

export const breadcrumbSchema = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site.url}${path}` })),
});

export function page({ title, description, path, body, jsonLd = [], preload = "", data, current, home = false }) {
  return `${head({ title, description, path, jsonLd, preload, home })}
<body>
${header(current ?? path)}
<main id="main">
${body}
</main>
${footer()}
${actionBars()}
${data ? `<script type="application/json" id="site-data">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>` : ""}
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}
