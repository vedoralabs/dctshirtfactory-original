# Handover: DCT implementation brief (Nov 2026)

**Live:** https://dctshirtfactory.vercel.app (Vercel project `dctshirtfactory`, production deploy `dpl_AyM4BXjfwxJtjckiM93ynQwpExJS`)
**Branch:** `redesign/cinematic`
**Real domain:** dctshirtfactory.co.in is live on the owner's Apache server (since 4 Nov 2026) and indexable. dctshirtfactory.vercel.app stays as the preview copy (sent `X-Robots-Tag: noindex`). Deploy steps: `docs/DEPLOY.md`.

## What was implemented

| Brief section | Delivered |
|---|---|
| 01–02 Direction | Graphite / warm off-white / electric lime identity with sparing signal orange. Anton (condensed display) + Inter. Sharp geometry, thin rules, oversized outline section numbers. The reference set the bar for craft; its design and assets were not reused. |
| 03 Signature entry | A ~4.7 s cinematic opening, reworked on request: a lime thread, then title cards FABRIC. / PRINT. / STITCH. / DISPATCH., then fabric strips weave into a lime knit, MADE TO ORDER. rises out of it, and the strips pull away to reveal the hero, which settles (headline, garment, CTAs). Pure CSS keyframes with transform/opacity only, chosen at first paint by an inline script. Skippable by button, any key, tap or scroll. The short (repeat visit), lite (Save-Data / low-power) and reduced-motion paths skip the overlay. Nothing waits on images or fonts. |
| 04 Motion system | Named patterns and tokens, documented in `docs/MOTION.md`. GSAP + ScrollTrigger kept (already vendored) for the desktop pinned process track and card parallax only. Lenis smooth scroll removed (scroll-jacking). |
| 05 IA | Nav: Clothing, Fabrics, Manufacturing, Our Work, About, Contact, plus a Request a quote CTA (Home via logo and the mobile menu). Homepage order follows the brief: hero, clothing, fabrics, manufacturing, work, why, FAQ, contact form. |
| 06 Clothing & fabrics | `/clothing` editorial archive, 7 category pages with image-led hero, one quote CTA, fabric cards, options, concepts, process, FAQ, related categories. `/fabrics` library: 24 fabrics with a category filter, deep links (`/fabrics#fabric-<id>`) and a quote action per fabric. **Category and fabric names are exactly as in the brief.** Each fabric is one canonical record, with categories derived from the category lists. No descriptions or properties are shown. Hoodies & Varsity Jackets and Sublimation T-Shirts are kept, with fabrics "confirmed with your quotation". |
| 07 Assets | No new images were generated (see limitations). The hero uses the existing GEN-007 concept, textures are procedural SVG labelled "Illustrative texture", the share image was rebuilt, and the rights register was updated. |
| 08 Enquiry | Short form with the brief's fields. Client-side validation with per-field messages, an error summary, a busy state and a recoverable "didn't open" state. Clearly labelled as a WhatsApp handoff that never claims it was sent. Contextual prefill from `?category=` / `?fabric=` (old `?product=` too). One WhatsApp number, from `src/data.mjs`. |
| 09 Mobile / a11y | Tested at 320–1920 px. 44 px targets, focus-visible rings, skip link, focus-trapped mobile menu with Escape, labelled form controls, reduced motion respected. |
| 10 Engineering | Same static generator kept (no framework change). New modules: `clothing.mjs`, `fabrics.mjs`, `enquiry.mjs`. JSDoc-typed data and `scripts/validate-data.mjs`, which the build runs. |
| 11 SEO | Unique titles/descriptions, canonical, OG image in the new identity, sitemap, robots, Service (per category, no price needed)/Breadcrumb/FAQPage/LocalBusiness schema (Mangalore + Tiruppur unit) with only confirmed facts, geo meta, location-led titles and descriptions. Redirects: `/products/:slug` → `/clothing/:slug`, `/quote` → `/contact` (query kept), `/clients` → `/work`. |

## Test commands and results (1 Nov 2026)

| Command | Result |
|---|---|
| `npm run lint` (JS syntax + data validation) | ✔ 7 categories, 27 fabrics, no broken references |
| `npm test` (node:test) | ✔ 8/8: exact names and order vs the brief, canonical fabrics, derived relationships, no unconfirmed properties, validator catches errors, WhatsApp URL encoding |
| `npm run build` | ✔ 17 pages; content scan passed (46 files) |
| `npm run test:e2e` (Playwright, Chromium) | ✔ 24/24. All 16 routes at 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 px: no console errors, no failed requests, no horizontal overflow, no broken or unsized images, one `<h1>`. Entry: first visit, repeat visit, skip button, key press, reduced motion, slow image, failed image, link mid-sequence. Menu focus trap / Escape / scroll lock / back-forward. Keyboard skip link. Redirects and 404. Every category's fabric list. Fabric filter, deep link, tap targets. Enquiry invalid / valid / encoding / honest status / prefill. Safe external links, one phone number. |

Lighthouse against the **live** site (local Lighthouse 12, simulated throttling):

| Route | Mobile | Desktop |
|---|---|---|
| `/` | Perf 100 (3 runs; first cold run 89), LCP 1.7 s, TBT 10–40 ms, CLS 0.02 | Perf 100, LCP 0.4 s |
| `/clothing` | 100, LCP 1.5 s | 100 |
| `/fabrics` | 100, LCP 1.5 s | 100 |
| `/contact` | 100, LCP 1.5 s | 100 |

Accessibility 100 and Best Practices 100 everywhere. **SEO 69 is expected:** it comes from the deliberate `noindex`, and will read ~100 once `site.indexable` is turned on at go-live. The PageSpeed Insights API quota was exhausted on the day, so re-check there.

Release screenshots (mobile 375 px and desktop 1440 px for home, clothing, a category, fabrics, manufacturing and contact): `npm run test:e2e -- --shots` writes them to `qa/screenshots/` (git-ignored).

## Issue log

| Severity | Issue | Fix | Verified |
|---|---|---|---|
| High | Hero LCP image was hidden by a `clip-path` reveal, so Lighthouse counted render delay | Replaced with a transform-only shutter over an already-painted image | In-browser LCP = FCP (1.4 s at 4× CPU); live mobile LCP 1.7 s |
| Medium | SVG `feTurbulence` grain in every texture rasterised on the main thread | Filters removed from all textures | Main-thread stall reduced; live TBT ≤ 40 ms |
| Medium | `text-wrap: balance` on all display headings cost about 30 % of layout time | Removed | Layout-time comparison, Lighthouse |
| Medium | 390 px hero pushed CTAs below the fold | Smaller frame, tighter spacing, CTAs side by side | Screenshot at 390×844 (CTAs visible); on 360×640 they sit just below the fold, with the sticky Call / WhatsApp / Quote bar always visible |
| Low | Outline section numbers collided with headings in narrow columns | Shown only where there is room | Screenshots |
| Low | Knit panel tiled with visible seams; concept label sat above it | Cover-sized, z-order fixed | Frame-by-frame entry captures |

## Known limitations (not done, or not verifiable here)
- **No new imagery was generated.** The brief's asset list (school editorial, runners, studio polos, macro textiles, manufacturing) needs either real DCT photos (preferred) or AI generation on the Runway account (about 185 credits left, 20 per image). The Manufacturing page therefore has no photos rather than fake ones.
- **Browsers:** automated tests ran in Chromium only. Safari/iOS and Firefox were not tested, and no physical phones were used (emulated viewports and CPU throttling only).
- **Assistive tech:** labels, landmarks, focus order and keyboard flows are tested, but no screen reader (NVDA/VoiceOver) was run, and 200 % zoom was not tested separately.
- **Typecheck:** there is no TypeScript in this repo. The data is JSDoc-typed and checked by `validate-data.mjs`; no `tsc`/ESLint pass was added.
- **Entry under heavy throttling:** in headless Chrome at 4× CPU, rAF sampling showed main-thread gaps during load. Compositor animations keep running, and an unthrottled trace has no task over 8 ms. Worth a look on a real low-end Android.
- **Enquiries are WhatsApp-only.** There is no backend, so nothing is stored or emailed (owner to decide, OWNER-INPUTS §2).

## Owner must supply / confirm
See `OWNER-INPUTS.md` (also printed by every build). Key items: public name styling, SVG logo, fabric availability and mapping for all 24 names (and comfort with showing **Lacoste/Lycra**, which are trademarks), whether the two legacy categories stay, lead times / MOQ / certifications, real product / process / fabric photos, client confirmations, enquiry destination, production domain.

## Deploying
`npx vercel deploy --prod` from the repo root (CLI deploy; no Git integration). That updates the preview copy only. The real domain is updated by uploading `dist/` (with its `.htaccess`) to the Apache server: follow `docs/DEPLOY.md`.
