# Owner inputs needed before launch

Under the owner's brief (16 Oct 2026), anything unverified is **left off the site**. It isn't shown as a placeholder. Each item below unlocks content once confirmed. Fill in the matching field in `src/data.mjs` and remove the line from `pending` there. `npm run build:strict` fails until `pending` is empty.

## 1. Business identity
- [ ] Legal trading name (D Creations / DCT Shirt Factory: which goes on the site?)
- [ ] GSTIN. The site no longer mentions GST at all.
- [ ] Street address + PIN, email, business hours (currently: WhatsApp, phone, Instagram, Maps link only)
- [ ] Which steps are in-house vs outsourced, and what happens in Mangalore vs Tiruppur (the site now just says "Mangalore & Tiruppur", as the original site did)
- [ ] Production domain. dctshirtfactory.co.in still serves the old site. All pages are **noindex** until the domain is pointed here (`site.indexable` in `src/data.mjs`).

## 2. Quote handling
- [ ] Destination: WhatsApp only (current), or also email/CRM? An email/CRM route needs a small backend with server-side validation and spam protection.
- [ ] Who answers enquiries and how quickly. Not stated on the site until confirmed.
- [ ] Sign-off on the privacy notice at /privacy. It describes the current set-up: no storage, WhatsApp hand-off, click-to-load map.

## 3. Fabrics
For each fabric: physical sample → confirm the public name, then supply composition / GSM / macro photo if you want those shown.

| Public name on site | Name used on old site | Confirm construction? |
|---|---|---|
| Piqué knit | Lacoste / Pique | ☐ |
| Honeycomb knit | Honeycomb | ☐ |
| Spun honeycomb knit | Spun Honeycomb | ☐ |
| Lightweight smooth knit | Selina | ☐ |
| Smooth-finish knit | Mirror (200 / 150X) | ☐ |
| Stretch knit | Lycra / NS Lycra | ☐ |
| Fleece knit | Fleece | ☐ |
| Matte-finish knit | Mars | ☐ |
| Dot-textured knit | Dotknit | ☐ |
| Open mesh knit | Airtex | ☐ |
| Matty-weave knit | PC Matty | ☐ |

Old-site fabric names **not shown** because their meaning is unclear (confirm what they are): Jacquard, Spandex, Hydra, Spectra, NJS, Nirmal, Loopnet, Superpoly, Cuba 300.

## 4. Services & claims
- [ ] Customisation methods actually offered: screen printing, DTF, sublimation, embroidery, patches (from the project brief; please confirm each)
- [ ] Sizes "Kids to 5XL" (from the project brief)
- [ ] Benefit statements (`benefits` in `src/data.mjs`). These repeat the original website, so please re-confirm.
- [ ] FAQ answers (`faqs`). They deliberately avoid times, charges and terms.
- [ ] If you want them shown: MOQ, turnaround, sample charges, payment terms, delivery coverage, years in business, capacity, order counts. Each needs evidence. **Prices will never be shown.**

## 5. Proof
- [ ] The 4 testimonials (Naveen R Goshal, Mahesh, Sathwik Shetty, Prajwal Pai): where they came from (Google? in person?) and permission to show them. The star ratings and "Verified customer" labels have been removed.
- [ ] Google rating / review count. Removed. The site links to the Google Maps listing only.
- [ ] Named clients for "Our clients & collaborations": the name, the work done, written approval (who, when) and the logo file. The section stays hidden until at least one is approved.
- [ ] Instagram posts/Reels to feature. Candidates found on the public profile (not yet reviewed for faces, logos or music):
  - https://www.instagram.com/dctshirtfactory/reel/DXpKLNeiWF1/ (27 Apr 2026)
  - https://www.instagram.com/dctshirtfactory/p/DTjnk7kks_r/ (15 Jan 2026)
  - https://www.instagram.com/dctshirtfactory/p/DS2qn9MkpCf/ (29 Dec 2025)
  - https://www.instagram.com/dctshirtfactory/reel/DSnKTuNkvu3/ (23 Dec 2025)
  - https://www.instagram.com/dctshirtfactory/p/DR_PKHGknNX/ (7 Dec 2025)
  - https://www.instagram.com/dctshirtfactory/p/DR2M0ewksRO/ (4 Dec 2025)
  - The profile also shows tagged Reels from **other accounts**. These are not to be used without those creators' permission.

## 6. Media
- [ ] Real production, process and factory photos/video (see SHOT-LIST.md), with consent from anyone identifiable (guardian consent for minors)
- [ ] Source and licence of the existing product images in `assets/`. They appear AI-generated, creator unknown; see `docs/content-rights-register.csv`.
- [ ] Approval to generate new logo-free AI concept images (several views per product), using the prompt pack in the brief

## 7. Legal review (recommended)
- [ ] Generic fabric names, client mentions, testimonials and the privacy notice. No website can be guaranteed free of legal risk; these are the items worth a counsel check.
