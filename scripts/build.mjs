// Builds the static site into dist/, then scans it for prohibited content.
//   node scripts/build.mjs           -> validate data, build, content check; lists owner inputs still pending
//   node scripts/build.mjs --strict  -> also fail while owner inputs are pending (go-live gate)
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as data from "../src/data.mjs";
import { page, orgSchema, breadcrumbSchema } from "../src/layout.mjs";
import { home } from "../src/home.mjs";
import { categoryPage, categorySchema } from "../src/clothing.mjs";
import { pages, pageBody } from "../src/pages.mjs";
import { enquiryData } from "../src/enquiry.mjs";
import { imgSize, icon } from "../src/util.mjs";
import { fabricTexture } from "../src/textures.mjs";
import { validate } from "./validate-data.mjs";

const ROOT = new URL("../", import.meta.url);
const DIST = new URL("dist/", ROOT);
const strict = process.argv.includes("--strict");

const problems = validate();
if (problems.length) {
  for (const p of problems) console.error("✖", p);
  console.error("✖ src/data.mjs has broken references.");
  process.exit(1);
}

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
mkdirSync(new URL("clothing/", DIST), { recursive: true });
cpSync(new URL("public/", ROOT), DIST, { recursive: true });
rmSync(new URL("img/manifest.json", DIST), { force: true });

const write = (rel, html) => writeFileSync(new URL(rel, DIST), html);

// Illustrative fabric textures as standalone SVG files (lazy-loaded, no DOM cost),
// plus the lime knit panel the homepage entry pulls away.
mkdirSync(new URL("img/tx/", DIST), { recursive: true });
const svgFile = (f) => fabricTexture(f).replace(' aria-hidden="true" focusable="false"', "");
for (const f of data.fabrics) write(`img/tx/${f.id}.svg`, svgFile(f));
write("img/tx/hero-knit.svg", svgFile({ id: "hero-knit", texture: "pique", tint: "#b8dc2c" }));

const crumbs = (...trail) => breadcrumbSchema([["Home", "/"], ...trail]);

// ---- home ----------------------------------------------------------------
const hero = data.categories.find((c) => c.slug === "gym-wears").heroImage;
const [hw] = imgSize(`${hero}-960.webp`);
const [sw] = imgSize(`${hero}-480.webp`);
const heroPreload = `<link rel="preload" as="image" href="/img/${hero}-960.webp" imagesrcset="/img/${hero}-480.webp ${sw}w, /img/${hero}-960.webp ${hw}w" imagesizes="(min-width: 1000px) 40vw, 70vw" fetchpriority="high">\n`;

write(
  "index.html",
  page({
    title: "Custom T-Shirt & Apparel Manufacturer in Mangalore | D Creations",
    description:
      "D Creations manufactures custom school uniform T-shirts, marathon T-shirts, corporate T-shirts, track pants, gym wear, hoodies and sublimation tees in Mangalore & Tiruppur. Request a quote.",
    path: "/",
    home: true,
    preload: heroPreload,
    jsonLd: [orgSchema(), { "@context": "https://schema.org", "@type": "WebSite", name: "D Creations", url: data.site.url }],
    body: home(),
    data: enquiryData(),
  })
);

// ---- clothing category pages ----------------------------------------------
for (const c of data.categories) {
  write(
    `clothing/${c.slug}.html`,
    page({
      title: c.metaTitle,
      description: c.description,
      path: `/clothing/${c.slug}`,
      jsonLd: [categorySchema(c), crumbs(["Clothing", "/clothing"], [c.title, `/clothing/${c.slug}`]), orgSchema()],
      body: categoryPage(c),
    })
  );
}

// ---- standalone pages --------------------------------------------------------
for (const pg of pages) {
  write(
    `${pg.path.slice(1)}.html`,
    page({
      title: pg.title,
      description: pg.description,
      path: pg.path,
      data: pg.data ? enquiryData() : undefined,
      jsonLd: [orgSchema(), crumbs([pg.name, pg.path])],
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
      <a class="btn btn--ghost btn--lg" href="/clothing">See clothing</a>
    </div>
  </div>
</section>`,
  }).replace("<head>", '<head>\n<meta name="robots" content="noindex">')
);

// ---- sitemap / robots / manifest ---------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const urls = ["/", ...pages.map((p) => p.path), ...data.categories.map((c) => `/clothing/${c.slug}`)];
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${data.site.url}${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`
);
// Until the production domain is confirmed, every page is noindex and robots stays open
// so crawlers can see that. Flip `site.indexable` in src/data.mjs at go-live.
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${data.site.url}/sitemap.xml\n`);
write(
  "site.webmanifest",
  JSON.stringify(
    {
      name: "D Creations",
      short_name: "D Creations",
      icons: [{ src: "/img/icon-512.png", sizes: "512x512", type: "image/png" }],
      theme_color: "#0e0f10",
      background_color: "#0e0f10",
      display: "browser",
    },
    null,
    2
  )
);

console.log(`✔ Built ${urls.length + 1} pages into dist/`);

// Prohibited-content regression check (prices, placeholders, unverified claims...).
try {
  execFileSync(process.execPath, [fileURLToPath(new URL("check-content.mjs", import.meta.url))], { stdio: "inherit" });
} catch {
  process.exit(1);
}
