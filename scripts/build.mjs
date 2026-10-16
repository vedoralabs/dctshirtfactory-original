// Builds the static site into dist/, then scans it for prohibited content.
//   node scripts/build.mjs           -> build + content check; lists owner inputs still pending
//   node scripts/build.mjs --strict  -> also fail while owner inputs are pending (go-live gate)
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as data from "../src/data.mjs";
import { page, orgSchema } from "../src/layout.mjs";
import { home, homeData } from "../src/home.mjs";
import { productPage, productSchema, breadcrumbSchema } from "../src/product.mjs";
import { pages, pageBody } from "../src/pages.mjs";
import { imgSize, icon } from "../src/util.mjs";
import { fabricTexture } from "../src/textures.mjs";

const ROOT = new URL("../", import.meta.url);
const DIST = new URL("dist/", ROOT);
const strict = process.argv.includes("--strict");

if (data.pending.length) {
  console.log(`
Owner inputs still pending (${data.pending.length}). Details in OWNER-INPUTS.md:`);
  for (const p of data.pending) console.log("   -", p);
  console.log("");
  if (strict) {
    console.error("✖ --strict: not ready for launch while owner inputs are pending.");
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
      quoteHref: `/quote?product=${p.slug}`,
      jsonLd: [productSchema(p), breadcrumbSchema(p), orgSchema()],
      body: productPage(p),
    })
  );
}

// ---- standalone pages (fabrics, work, about, quote, faq, contact) -----------
for (const pg of pages) {
  write(
    `${pg.path.slice(1)}.html`,
    page({
      title: pg.title,
      description: pg.description,
      path: pg.path,
      current: pg.path,
      data: pg.data ? homeData() : undefined,
      jsonLd: [
        orgSchema(),
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${data.site.url}/` },
            { "@type": "ListItem", position: 2, name: pg.name, item: `${data.site.url}${pg.path}` },
          ],
        },
      ],
      body: pageBody(pg),
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
const urls = ["/", ...pages.map((p) => p.path), ...data.products.map((p) => `/products/${p.slug}`)];
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

console.log(`✔ Built ${urls.length + 1} pages into dist/`);

// Prohibited-content regression check (prices, brand names, placeholders...).
try {
  execFileSync(process.execPath, [fileURLToPath(new URL("check-content.mjs", import.meta.url))], { stdio: "inherit" });
} catch {
  process.exit(1);
}
