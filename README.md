# D Creations: dctshirtfactory.co.in

This is the website for D Creations (DC T-Shirt Factory), a custom apparel manufacturer with units in Mangalore and Tiruppur. It's a static, mobile-first site: graphite, warm off-white and electric lime, with a signature homepage entry. It's built to turn visitors into WhatsApp quote requests.

## Quick start

```bash
npm run build          # validates data, writes dist/, scans it for prohibited content
npm run serve          # serves dist/ on http://localhost:4173 (clean URLs + redirects, like Vercel)
npm run lint           # syntax-checks the browser script and validates src/data.mjs
npm test               # unit tests: exact category/fabric names, references, WhatsApp links
npm run test:e2e       # browser tests (Playwright); add `-- --shots` for screenshots in qa/
npm run build:strict   # also fails while owner inputs are pending (use before go-live)
npm run images         # regenerates public/img from assets/ (Python + Pillow)
```

There are no npm dependencies, and Node 18 or newer runs the build. GSAP 3.12.5 and ScrollTrigger are vendored in `public/vendor/`. They load lazily, on desktop only.

`test:e2e` borrows Playwright from another checkout. Set `PLAYWRIGHT_FROM` to any folder whose `node_modules` contains `playwright`; it defaults to `../vedora-labs-website`.

## Where things live

| Path | What |
|---|---|
| `src/data.mjs` | All business facts and content: categories, fabrics, FAQ, clients, contact. **Edit this file first.** |
| `scripts/validate-data.mjs` | Checks every category→fabric reference, id and texture. The build stops on any error. |
| `src/layout.mjs` | `<head>`/SEO/schema, the inline entry-sequence bootstrap, header, footer, action bars, lightbox |
| `src/home.mjs` | Homepage sections, plus the shared sections other pages reuse |
| `src/clothing.mjs` | `/clothing` archive and the 7 `/clothing/<slug>` category pages |
| `src/fabrics.mjs` | Fabric card and the `/fabrics` library (filter + 24 cards) |
| `src/enquiry.mjs` | The short enquiry form (WhatsApp handoff) |
| `src/pages.mjs` | `/fabrics`, `/manufacturing`, `/work`, `/about`, `/faq`, `/contact`, `/privacy` |
| `src/textures.mjs` | Illustrative SVG fabric textures, used until real macro photos arrive |
| `public/css/site.css` | Design tokens (section 1), the entry choreography (section 4) and all styles |
| `public/js/main.js` | Entry skip, menu, reveals, filters, enquiry form, lightbox, desktop GSAP layer |
| `docs/MOTION.md` | The motion system: tokens, patterns, entry timeline, lifecycle rules |
| `docs/HANDOVER.md` | Latest implementation report, test results and open items |
| `OWNER-INPUTS.md` | Everything the owner must confirm |
| `docs/content-rights-register.csv` | Internal asset / permission log (never published) |
| `tests/` | `unit.test.mjs`, `e2e.mjs`, and `server.mjs` (local server that mimics `vercel.json`) |

## Content rules

- **No prices anywhere**: no rupee figures, price tiers, "from" prices or Offer schema. Every enquiry goes to the owner for a quotation.
- **Category and fabric names exactly as DCT lists them** (Nov 2026 brief), Lacoste and Lycra included. A fabric record holds only its name and an illustrative texture. Description and `verifiedProperties` stay absent until DCT confirms them.
- **No unverified facts.** Anything not confirmed is `null` or absent in `src/data.mjs` and isn't shown. Open items are in `pending` and in `OWNER-INPUTS.md`.
- **Product images are AI design concepts** and are labelled "Design concept". Fabric textures are labelled "Illustrative texture".
- `npm run build` ends with `scripts/check-content.mjs`, which **fails the build** on currency symbols, price wording, placeholder text, GSTIN/rating claims and similar.
- The site is `noindex` until the production domain is confirmed (`site.indexable`).

## Adding a fabric or category

1. Add the fabric to `fabrics` once, with a URL-safe `id`, its exact `name`, a `texture` from `src/textures.mjs` and a `tint`.
2. Add its `id` to each category's `fabrics` list. The fabric's "Listed for" links, the library filter and the form options all follow from that.
3. Run `npm run lint && npm test`. A typo in an id fails validation before anything is built.

## Swapping in real photos

1. Put the photo in `assets/`, add it to `IMAGES` in `scripts/make-images.py`, then run `npm run images`.
2. Use its base name in `src/data.mjs`, in a category's `images`/`heroImage` or in `concepts[].img`. Use only logo-free images, and real photos only with permission (log them in the rights register).
3. Named clients need either the owner's own Instagram post or written approval. The gate is in `shownClients()`.

## Deploy

`vercel.json` builds with `npm run build` and serves `dist/` with clean URLs. It redirects old URLs: `/products/:slug` → `/clothing/:slug`, `/quote` → `/contact` (the query string is kept) and `/clients` → `/work`. Images and vendor files get long-lived cache headers.
