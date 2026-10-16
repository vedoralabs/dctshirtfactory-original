# Redesign notes: how each pain point was solved

| # | Pain point | Solution |
|---|---|---|
| 1 | Placeholder hero image | Full-screen cinematic hero: a slow cross-fading Ken Burns sequence of four graded frames behind a dark gradient, with film grain over it. The headline is "We don't just print tees. We build your team's identity.", its words rise in one by one, and there are two CTAs plus a trust line. A labelled `<video>` slot is ready for real footage (see SHOT-LIST §1). |
| 2 | Carousel duplicated every category | The infinite carousel and its duplicated set are gone. There's now a 7-card **bento grid**, one card per category. On desktop the overlay lifts on hover and reveals a teaser and "View details →". Each card shows its starting price. |
| 3 | Product pages lacked buying info | One template drives all 7 pages. Each has breadcrumbs, a gallery with hover-zoom and a lightbox, and chips for price-from, MOQ and sizes. The specs table covers MOQ, price, fabrics (linked to the Fabric Guide), GSM, sizes from kids to 5XL, colours, branding methods and turnaround. Pages also have use cases, branding option cards, the 4 steps, a mini FAQ, related products and a **"Customise this on WhatsApp"** CTA prefilled with the product name. "Build a detailed quote" opens the quote builder with that product already picked. |
| 4 | Fabric names meant nothing | Interactive **Fabric Guide**: 11 keyboard-accessible tabs. Each shows a texture swatch (SVG for now, with a slot for a real macro photo), how it feels, GSM, a breathability meter, a price tier, what it's best for, and an "Ask for a swatch" WhatsApp button. Product pages link straight to a fabric with `/#fabric-<name>`. |
| 5 | Weak trust | Animated stats counter, a "Trusted by" marquee (with a slot for client logos), a Google rating badge linking to the Maps profile, a Behind the Scenes photo/video strip, the "Made in Mangalore & Tiruppur" story with two hub cards, and the GST-registered mention in that story and in the footer. All 4 real testimonials are in a slider. |
| 6 | Only one contact channel | Floating WhatsApp button on desktop, and a sticky **Call / WhatsApp / Get Quote** bar on mobile. The Contact section has WhatsApp, click-to-call, email, Instagram, the written address, business hours and a lazy-loaded map. The header has "Get Quote" and the mobile menu has WhatsApp and Call. |
| 7 | No FAQ | Accordion FAQ with 8 questions: MOQ, delivery time, sample and cost, payment terms, design help, bulk discounts, pan-India shipping and re-orders. Each product page adds 3 product-specific questions. |
| 8 | Thin footer, no year | The full footer has brand and blurb, GST, socials, quick links, all 7 categories, full contact details and maps, an auto-updating © year (set at build time and refreshed in the browser), and a "Website by Vedora Labs" credit. |

## Beyond the brief
- **Smart Quote Builder:** six steps (product, fabric filtered to that product, quantity, branding, deadline, details). It auto-advances on single-choice steps, previews the message live, and sends one neat WhatsApp message.
- **"How We Work":** a pinned horizontal-scroll timeline on desktop, which becomes a stacked list on mobile.
- **Portfolio:** filterable by category, with no gaps in the grid, and a lightbox with arrow keys and Esc.
- **Honest preview mode:** unconfirmed facts are visibly marked and kept out of the schema.org data (see README).

## Performance and accessibility choices
- Static HTML, with no framework. Images are WebP at 480 and 960 px plus a hero frame at about 1430 px, all with width and height set and lazy loading. The first hero frame is preloaded.
- GSAP, ScrollTrigger and Lenis (around 130 KB) load only after the page has loaded, and only when the visitor allows motion. Basic reveals use an IntersectionObserver and CSS.
- `prefers-reduced-motion` turns off grain, Ken Burns, the marquee, parallax, pinning and smooth scroll.
- There's a skip link, visible focus rings, ARIA tabs with arrow keys, a native `<dialog>` lightbox, `<details>` for the FAQ, 44–62 px touch targets, and no horizontal scroll at 360 px.
- SEO: every page has its own title and meta description with the target keywords, a canonical URL and Open Graph image. Structured data covers ClothingStore/LocalBusiness, Product and BreadcrumbList. There's also a sitemap.xml, robots.txt and a noindex 404 page.

## Things to confirm with D Creations
Every `tbc()` value in `src/data.mjs` (the build lists them all), plus some of the copy: the hub descriptions for Mangalore and Tiruppur, the "11+ fabrics" claim, the "free mock-up" promise, and the reply-time line in the quote builder.
