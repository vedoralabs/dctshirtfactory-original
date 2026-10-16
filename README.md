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
| `OWNER-INPUTS.md` | Everything the owner must confirm before launch |
| `docs/content-rights-register.csv` | Internal asset / permission log (not published) |
| `scripts/check-content.mjs` | Prohibited-content scan run by every build |
| `REDESIGN-NOTES.md` | How each pain point was solved |

## Content rules (owner brief, 16 Oct 2026)

- **No prices anywhere**: no rupee figures, price tiers, "from" prices or Offer schema. Every enquiry goes to the owner for a quotation.
- **No brand-like fabric names** (e.g. Lacoste, Lycra). Fabrics use generic construction names.
- **No unverified facts.** Anything not confirmed is `null` in `src/data.mjs` and simply not shown. Open items are listed in `pending` and in `OWNER-INPUTS.md`. `npm run build:strict` fails while any remain.
- **Product images are AI design concepts** and are labelled "Design concept". The asset log is `docs/content-rights-register.csv`, which is internal and never published.
- `npm run build` ends with `scripts/check-content.mjs`. It scans every built file and **fails the build** on currency symbols, price wording, brand-like fabric names, placeholder text, GSTIN/rating claims and similar. Run against the earlier live site, it flags 6 kinds of violation.
- The site is `noindex` until the production domain is confirmed (`site.indexable`).

## Swapping in real photos

1. Put the photo in `assets/`, add it to `IMAGES` in `scripts/make-images.py`, then run `npm run images`.
2. Use its base name in `src/data.mjs`, in a product's `images` or in `concepts[].img`. Only logo-free images, and real photos only with permission (log them in `docs/content-rights-register.csv`).
3. Hero video: drop `public/video/hero.mp4` (H.264, muted, 12–20 s, under 4 MB) and uncomment the `<video>` block in `hero()` in `src/home.mjs`.
4. Named clients: only with written approval. Add them to `clients` with `approvedBy` and `approvedOn`; the section stays hidden otherwise. Instagram: add owner-approved post URLs to `instagramPosts`. They load only when the visitor clicks.

## Deploy

`vercel.json` builds with `npm run build` and serves `dist/` with clean URLs, so `/products/school-uniform.html` becomes `/products/school-uniform`. Images and vendor files get long-lived cache headers.
