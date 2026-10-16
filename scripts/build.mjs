// Builds the static site into dist/.  Usage:
//   node scripts/build.mjs           -> build, list any placeholders still in use
//   node scripts/build.mjs --strict  -> fail if any placeholder (tbc) remains
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import * as data from "../src/data.mjs";
import { page, orgSchema } from "../src/layout.mjs";
import { home, homeData } from "../src/home.mjs";
import { productPage, productSchema, breadcrumbSchema } from "../src/product.mjs";
import { imgSize, icon } from "../src/util.mjs";
import { fabricTexture } from "../src/textures.mjs";

const ROOT = new URL("../", import.meta.url);
const DIST = new URL("dist/", ROOT);
const strict = process.argv.includes("--strict");

// ---- find every placeholder still in the data --------------------------
const pending = [];
(function walk(node, path) {
  if (node && typeof node === "object") {
    if (node.__tbc) return pending.push(`${path} = ${JSON.stringify(node.value)}`);
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
  }
})(
  Object.fromEntries(Object.entries(data).filter(([k]) => k !== "tbc")),
  ""
);
const preview = pending.length > 0;

if (preview) {
  console.log(`\n⚠  ${pending.length} placeholder value(s) still need confirming by D Creations:`);
  for (const p of pending) console.log("   -", p);
  console.log("   (edit src/data.mjs — replace tbc(x) with the confirmed value)\n");
  if (strict) {
    console.error("✖ --strict: refusing to build with placeholders.");
    process.exit(1);
  }
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(new URL("products/", DIST), { recursive: true });
cpSync(new URL("public/", ROOT), DIST, { recursive: true });
rmSync(new URL("img/manifest.json", DIST), { force: true });

const write = (rel, html) => writeFileSync(new URL(rel, DIST), html);

// Fabric Guide textures as standalone SVG files (lazy-loaded, no DOM cost)
mkdirSync(new URL("img/tx/", DIST), { recursive: true });
for (const f of data.fabrics) write(`img/tx/${f.key}.svg`, fabricTexture(f).replace(' aria-hidden="true" focusable="false"', ""));

// ---- home ----------------------------------------------------------------
const [hw] = imgSize("hero-1-1600.webp");
const heroPreload = `<link rel="preload" as="image" href="/img/hero-1-1600.webp" imagesrcset="/img/hero-1-800.webp 800w, /img/hero-1-1600.webp ${hw}w" imagesizes="100vw" fetchpriority="high">\n`;

write(
  "index.html",
  page({
    title: "Custom T-Shirt Manufacturer in Mangalore & Tiruppur | D Creations",
    description:
      "D Creations makes custom school uniforms, marathon & event t-shirts, corporate polos, sublimation jerseys, gym wear and hoodies in bulk. Sample before bulk, pan-India delivery. Get a WhatsApp quote.",
    path: "/",
    preload: heroPreload,
    preview,
    jsonLd: [
      orgSchema(),
      { "@context": "https://schema.org", "@type": "WebSite", name: "D Creations", url: data.site.url },
    ],
    body: home(),
    data: homeData(),
  })
);

// ---- product pages ------------------------------------------------------
for (const p of data.products) {
  write(
    `products/${p.slug}.html`,
    page({
      title: p.title,
      description: p.description,
      path: `/products/${p.slug}`,
      preview,
      quoteHref: `/?product=${p.slug}#quote`,
      jsonLd: [productSchema(p), breadcrumbSchema(p), orgSchema()],
      body: productPage(p),
    })
  );
}

// ---- 404 -------------------------------------------------------------------
write(
  "404.html",
  page({
    title: "Page not found | D Creations",
    description: "This page doesn't exist. Browse D Creations custom apparel or message us on WhatsApp.",
    path: "/404",
    preview,
    body: `
<section class="nf">
  <div class="wrap">
    <p class="eyebrow">Error 404</p>
    <h1 class="display">Wrong size. <em>This page doesn't fit.</em></h1>
    <p class="lead">The page you're looking for has moved or never existed.</p>
    <div class="cta__btns">
      <a class="btn btn--accent btn--lg" href="/">Back to home ${icon.arrow}</a>
      <a class="btn btn--ghost btn--lg" href="/#products">See products</a>
    </div>
  </div>
</section>`,
  }).replace("<head>", '<head>\n<meta name="robots" content="noindex">')
);

// ---- sitemap / robots / manifest ---------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const urls = ["/", ...data.products.map((p) => `/products/${p.slug}`)];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${data.site.url}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${data.site.url}/sitemap.xml\n`);
write(
  "site.webmanifest",
  JSON.stringify(
    {
      name: "D Creations",
      short_name: "D Creations",
      icons: [{ src: "/img/icon-512.png", sizes: "512x512", type: "image/png" }],
      theme_color: "#0b0b0c",
      background_color: "#0b0b0c",
      display: "browser",
    },
    null,
    2
  )
);

console.log(`✔ Built ${urls.length + 1} pages into dist/${preview ? " (preview mode)" : ""}`);
