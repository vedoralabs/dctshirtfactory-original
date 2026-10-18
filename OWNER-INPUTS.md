# Owner inputs needed before launch

Under the owner's brief (16 Oct 2026), anything unverified is **left off the site**. It isn't shown as a placeholder. Each item below unlocks content once confirmed. Fill in the matching field in `src/data.mjs` and remove the line from `pending` there. `npm run build:strict` fails until `pending` is empty.

## 1. Business identity
- [x] Trading names from the catalogue: DC T-Shirt Factory (Mangalore) and D Creations (Tiruppur)
- [ ] GSTIN. The site no longer mentions GST at all.
- [ ] **Email spelling conflict:** the site uses dcreationstirpur@gmail.com (confirmed 18 Oct 2026), but the printed catalogue says **dcreationstripur@gmail.com**. Which one receives mail?
- [x] Addresses from the catalogue, now on the contact page and footer: 1st Floor, Jean Complex, Kankanady, Mangalore 575002, and 8/29J, A.V.P Layout, Gandhi Nagar PO, Chettipalayam, Tiruppur 641603
- [ ] Business hours
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

Old-site fabric names **not shown** because their meaning is unclear (confirm what they are): Jacquard, Spandex, Hydra, Spectra, NJS, Nirmal, Loopnet, Superpoly, Cuba 300, PP, Fine (from the catalogue). "Adidas Selina" in the catalogue is a brand name and will never be shown.

Per-product fabric lists were checked against the catalogue (Oct 2026); Corporate now also lists the matte-finish knit ("Mars 200").

## 4. Services & claims
- [ ] Customisation methods actually offered: screen printing, DTF, sublimation, embroidery, patches (from the project brief; please confirm each)
- [ ] Sizes "Kids to 5XL" (from the project brief)
- [ ] Benefit statements (`benefits` in `src/data.mjs`). These repeat the original website, so please re-confirm.
- [ ] FAQ answers (`faqs`). They deliberately avoid times, charges and terms.
- [ ] If you want them shown: MOQ, turnaround, sample charges, payment terms, delivery coverage, years in business, capacity, order counts. Each needs evidence. **Prices will never be shown.**

## 5. Proof
- [ ] The 3 testimonials shown (Naveen R Goshal's "affordable price" review was removed: no price wording) (Mahesh, Sathwik Shetty, Prajwal Pai): where they came from (Google? in person?) and permission to show them. The star ratings and "Verified customer" labels have been removed.
- [ ] Google rating / review count. Removed. The site links to the Google Maps listing only.
- [ ] **Clients page (/clients, live 18 Oct 2026).** Built from the owner's own public Instagram captions, text only, no logos or event photos copied:
  - Hackfest, NMAM Institute of Technology: official event T-shirts (posts 4 Dec 2025, 27 Apr 2026)
  - NITTE Walkathon 2025: jerseys and caps (29 Dec 2025)
  - Mangaluru Beach Festival Marathon: official jersey (23 Dec 2025)
  - Udupi Marathon: official jerseys, 7 Dec 2025 (7 Dec 2025)
  Owner to confirm these, add older clients not visible on Instagram, and ideally get each organiser's written OK (and logo file, if logos are wanted).
  - Balipu Run Club (Mangalore): added 18 Oct 2026 on Vedora Labs' confirmation that they are a client. Work: running T-shirts (confirmed by Vedora Labs). Their Reels are @balipuclub's content, so none is embedded.
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
- [ ] Review the 9 new AI concept images (generated 16 Oct 2026, logo-free, see `assets/generated/` and the GEN rows in the register). In particular, check that the blue/white team jersey doesn't resemble a local team's kit, and confirm the Runway plan's commercial-use terms.

## 7. Legal review (recommended)
- [ ] Generic fabric names, client mentions, testimonials and the privacy notice. No website can be guaranteed free of legal risk; these are the items worth a counsel check.
