import { site, products } from "./data.mjs";
import { esc, waLink, icon, imgSize } from "./util.mjs";

export const NAV = [
  ["Products", "/#products"],
  ["Fabrics", "/fabrics"],
  ["Process", "/#process"],
  ["Gallery", "/work"],
  ["About", "/about"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
];

const year = new Date().getFullYear();

function head({ title, description, path, ogImage = "/img/og-image.jpg", jsonLd = [], preload = "" }) {
  const url = site.url + path;
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${site.indexable ? "" : `<meta name="robots" content="noindex">
`}<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0b0b0c">
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
<script>document.documentElement.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('rm')}catch(e){}</script>
${jsonLd.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("\n")}
</head>`;
}

function header(current) {
  const [lw, lh] = imgSize("logo-light.png");
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="hdr" data-hdr>
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="/" aria-label="D Creations — home"><img src="/img/logo-light.png" alt="D Creations" width="${lw}" height="${lh}"></a>
    <nav class="hdr__nav" aria-label="Main">
      ${NAV.map(([l, h]) => `<a href="${h}"${h === current ? ' class="is-current" aria-current="page"' : ""}>${l}</a>`).join("")}
    </nav>
    <a class="btn btn--accent btn--sm hdr__cta" data-magnetic href="/quote">Get a quote</a>
    <button class="hdr__burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu" data-burger><span></span><span></span></button>
  </div>
</header>
<!-- Sibling of the header, not inside it: the header's backdrop-filter would
     otherwise become the containing block and clip this fixed overlay. -->
<div class="mnav" id="mnav" data-mnav hidden>
    <nav aria-label="Mobile">
      ${NAV.map(([l, h], i) => `<a href="${h}" style="--i:${i}"${h === current ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
      <a href="/quote" style="--i:${NAV.length}" class="mnav__quote">Get a quote</a>
    </nav>
    <div class="mnav__foot">
      <a class="btn btn--accent" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp} WhatsApp us</a>
      <a class="btn btn--ghost" href="tel:${site.phoneHref}">${icon.phone} ${site.phoneDisplay}</a>
    </div>
</div>`;
}

export function footer() {
  return `
<footer class="ftr">
  <div class="wrap ftr__grid">
    <div class="ftr__brand">
      <a href="/" class="ftr__logo" aria-label="D Creations — home"><img src="/img/logo-light.png" alt="D Creations" width="273" height="135" loading="lazy"></a>
      <p>Custom T-shirt and apparel manufacturer for schools, companies, teams and events. ${site.locations.replace("&", "&amp;")}.</p>
      <div class="ftr__social">
        <a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram ${site.instagramHandle}">${icon.instagram}</a>
        <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon.whatsapp}</a>
        <a href="${site.mapsUrl}" target="_blank" rel="noopener" aria-label="Google Maps">${icon.pin}</a>
      </div>
    </div>
    <nav class="ftr__col" aria-label="Quick links">
      <h2>Quick links</h2>
      ${NAV.map(([l, h]) => `<a href="${h}">${l}</a>`).join("")}
      <a href="/quote">Request a quote</a>
      <a href="/privacy">Privacy notice</a>
    </nav>
    <nav class="ftr__col" aria-label="Product categories">
      <h2>Categories</h2>
      ${products.map((p) => `<a href="/products/${p.slug}">${esc(p.name)}</a>`).join("")}
    </nav>
    <div class="ftr__col">
      <h2>Contact</h2>
      <a href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp} WhatsApp ${site.phoneDisplay}</a>
      <a href="tel:${site.phoneHref}">${icon.phone} Call ${site.phoneDisplay}</a>
      <a href="mailto:${site.email}">${icon.mail} ${site.email}</a>
      <a href="${site.instagram}" target="_blank" rel="noopener">${icon.instagram} ${site.instagramHandle}</a>
      <a href="${site.mapsUrl}" target="_blank" rel="noopener">${icon.pin} ${site.locality}, ${site.region}</a>
      <a class="ftr__quote" href="/quote">Request a custom quote ${icon.arrow}</a>
    </div>
  </div>
  <div class="wrap ftr__bottom">
    <p>© <span data-year>${year}</span> D Creations. All rights reserved.</p>
    <p>Made with care in Mangalore &amp; Tiruppur · <a href="https://vedora-labs-website-kappa.vercel.app" target="_blank" rel="noopener">Website by Vedora Labs</a></p>
  </div>
</footer>`;
}

function actionBars(quoteHref = "/quote") {
  return `
<a class="wa-float" data-magnetic href="${waLink()}" target="_blank" rel="noopener" aria-label="Chat with D Creations on WhatsApp">${icon.whatsapp}<span>Chat with us</span></a>
<nav class="mbar" aria-label="Quick actions">
  <a href="tel:${site.phoneHref}">${icon.phone}<span>Call</span></a>
  <a class="mbar__wa" href="${waLink()}" target="_blank" rel="noopener">${icon.whatsapp}<span>WhatsApp</span></a>
  <a href="${quoteHref}">${icon.grid}<span>Get a quote</span></a>
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
      "Custom T-shirt and apparel manufacturer: school uniforms, event T-shirts, corporate polos, sublimation jerseys, gym wear, trackpants and hoodies.",
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
  // Only confirmed facts. No prices, ratings or reviews.
  if (site.street) o.address.streetAddress = site.street;
  if (site.postalCode) o.address.postalCode = site.postalCode;
  if (site.email) o.email = site.email;
  return o;
};

export function page({ title, description, path, body, jsonLd = [], preload = "", quoteHref, data, current }) {
  return `${head({ title, description, path, jsonLd, preload })}
<body>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
${actionBars(quoteHref)}
<div class="grain" aria-hidden="true"></div>
${data ? `<script type="application/json" id="site-data">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>` : ""}
<script src="/js/main.js" defer></script>
</body>
</html>
`;
}
