# D Creations: dctshirtfactory.co.in

This is the website for D Creations, a custom apparel manufacturer with production in Mangalore and Tiruppur. It's a static, mobile-first site with a dark "cinematic" look, and it's built to turn visitors into WhatsApp quote requests.

## Quick start

```bash
npm run build      # writes dist/ and lists any placeholder facts still in use
npm run serve      # previews dist/ on http://localhost:4173
npm run build:strict   # fails if any placeholder remains (use before go-live)
npm run images     # re-generates public/img from assets/ (Python + Pillow)
```

There are no npm dependencies. Node 18 or newer runs the build. GSAP 3.12.5, ScrollTrigger and Lenis 1.1.13 are vendored in `public/vendor/` and load lazily after first paint.

## Where things live

| Path | What |
|---|---|
| `src/data.mjs` | All business facts and content: products, fabrics, FAQ, stats, testimonials, contact. **Edit this file first.** |
| `src/home.mjs` | Homepage sections and teasers, plus the full sections reused by the standalone pages |
| `src/pages.mjs` | Standalone pages: `/fabrics`, `/work`, `/about`, `/quote`, `/faq`, `/contact` |
| `src/product.mjs` | Product page template, used for all 7 categories |
| `src/layout.mjs` | `<head>`/SEO/schema, header, footer, floating WhatsApp, mobile action bar, lightbox |
| `src/textures.mjs` | SVG fabric textures used until real macro photos arrive |
| `public/css/site.css` | Design tokens (section 1) and all styles |
| `public/js/main.js` | Interactions: quote builder, fabric tabs, filters, lightbox, slider, counters, motion |
| `assets/` | Original source photos. `scripts/make-images.py` turns them into WebP in `public/img/` |
| `SHOT-LIST.md` | Photos and videos the client needs to shoot |
| `REDESIGN-NOTES.md` | How each pain point was solved |

## Placeholders ("preview mode")

Anything D Creations hasn't confirmed is wrapped in `tbc(...)` in `src/data.mjs`. That covers MOQ, prices, GSM, turnaround, stats, address, email, hours, GSTIN, Google rating and star counts. While any `tbc()` value remains:

- the page shows a small dismissible "Preview" note,
- each placeholder value gets a dotted orange underline,
- photo slots show their `[PHOTO: …]` labels,
- unconfirmed facts are left out of the structured data (schema.org), so search engines never see guessed prices or addresses.

To confirm a fact, replace `tbc("50 pcs")` with `"50 pcs"`. When nothing is left, preview mode switches off by itself.

## Swapping in real photos

1. Put the photo in `assets/`, add it to `IMAGES` in `scripts/make-images.py`, then run `npm run images`.
2. Use its base name in `src/data.mjs`, either in a product's `images`, in `portfolio[].img`, or in a fabric's texture.
3. Hero video: drop `public/video/hero.mp4` (H.264, muted, 12–20 s, under 4 MB) and uncomment the `<video>` block in `hero()` in `src/home.mjs`.
4. Client logos: add SVG/PNG files to `public/img/clients/` and list them in `clientLogos`.

## Deploy

`vercel.json` builds with `npm run build` and serves `dist/` with clean URLs, so `/products/school-uniform.html` becomes `/products/school-uniform`. Images and vendor files get long-lived cache headers.
