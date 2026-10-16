// Standalone pages. Each reuses a full section, promoted to the page's <h1>,
// with breadcrumbs above it.
import { site, fabrics } from "./data.mjs";
import { esc, icon } from "./util.mjs";
import { fabricGuide, work, clientsSection, instagram, aboutStory, why, quote, faq, contact, ctaBand } from "./home.mjs";

const crumbs = (name) => `
<div class="wrap page-crumbs">
  <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${esc(name)}</li></ol></nav>
</div>`;

/** Turn the section's first <h2 class="display…"> into the page <h1>. */
const promote = (html) => {
  const a = html.indexOf('<h2 class="display');
  if (a < 0) return html;
  const b = html.indexOf("</h2>", a);
  return html.slice(0, a) + "<h1" + html.slice(a + 3, b) + "</h1>" + html.slice(b + 5);
};

function fabricTable() {
  return `
<section class="section ftable" aria-labelledby="ftable-title">
  <div class="wrap">
    <h2 class="display display--sm" id="ftable-title">All fabrics at a glance</h2>
    <div class="tscroll" tabindex="0" role="region" aria-label="Fabric overview table">
      <table class="cmp">
        <thead><tr><th scope="col">Fabric</th><th scope="col">Look &amp; feel</th><th scope="col">Often used for</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead>
        <tbody>
          ${fabrics
            .map(
              (f) => `<tr>
            <th scope="row"><a href="#fabric-${f.key}"><span class="fab__chip" style="--tint:${f.tint}"></span>${esc(f.name)}</a></th>
            <td data-label="Look &amp; feel">${esc(f.feel)}</td>
            <td data-label="Often used for">${esc(f.usedFor)}</td>
            <td data-label=""><a class="cmp__ask" href="/quote?fabric=${f.key}">Ask about this fabric ${icon.arrow}</a></td>
          </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <p class="fab__note">Fabric names describe the knit construction. Exact composition and weight are confirmed with your quotation.</p>
  </div>
</section>`;
}

function privacy() {
  return `
<section class="section legal" aria-labelledby="privacy-title">
  <div class="wrap legal__in">
    <p class="eyebrow">Privacy</p>
    <h1 class="display" id="privacy-title">Privacy notice</h1>
    <p class="lead">How this website handles your information.</p>

    <h2>What this website collects</h2>
    <p>This website does not have user accounts and does not store enquiries itself. When you use the quote form, your answers are put together into a message <strong>on your own device</strong>. Nothing is sent until you choose to send that message in WhatsApp.</p>

    <h2>WhatsApp enquiries</h2>
    <p>When you continue to WhatsApp, the message you send (including your name, phone number and any details you add) is delivered to ${esc(site.name)} through WhatsApp, a service of Meta. It is used only to respond to your enquiry and prepare a quotation. WhatsApp's own privacy policy applies to messages sent through it.</p>

    <h2>Calls</h2>
    <p>If you call us, your phone number is visible to us as with any phone call, and is used only to respond to you.</p>

    <h2>Maps and Instagram</h2>
    <p>The map on the contact page and any Instagram posts load only when you choose to load them. When loaded, Google or Instagram may set cookies or collect data under their own policies. Links to Instagram and Google Maps open those services directly.</p>

    <h2>Hosting</h2>
    <p>This website is hosted by Vercel, which may keep standard technical logs (such as IP address and pages requested) to operate and secure the service. This site uses no analytics or advertising trackers.</p>

    <h2>Your choices</h2>
    <p>To ask about, correct or delete information you've sent us, contact us on WhatsApp or call <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a>.</p>
  </div>
</section>`;
}

export const pages = [
  {
    path: "/fabrics",
    name: "Fabric library",
    title: "Fabric Library: Knit Types for Custom Apparel | D Creations",
    description: "A plain-words guide to the knit types D Creations works with for uniforms, polos, jerseys and hoodies, and what each is often used for.",
    data: false,
    body: () => promote(fabricGuide()) + fabricTable() + ctaBand(),
  },
  {
    path: "/work",
    name: "Gallery",
    title: "Gallery: Custom Apparel Design Concepts | D Creations",
    description: "Design concepts showing the custom T-shirts, polos, uniforms, jerseys and hoodies D Creations makes. See real work on Instagram.",
    body: () => promote(work()) + clientsSection() + instagram() + ctaBand(),
  },
  {
    path: "/about",
    name: "About us",
    title: "About D Creations (DCT Shirt Factory) | Mangalore & Tiruppur",
    description: "D Creations makes custom T-shirts and apparel: school uniforms, sportswear, corporate polos, hoodies and sublimation jerseys. Small runs and bulk orders welcome.",
    body: () => promote(aboutStory()) + why() + instagram() + ctaBand(),
  },
  {
    path: "/quote",
    name: "Request a quote",
    title: "Request a Custom Quote | D Creations",
    description: "Tell us the product, quantity, fabric and customisation you need. The owner will review your brief and share a quotation for your specification.",
    data: true,
    body: () => promote(quote()),
  },
  {
    path: "/faq",
    name: "FAQ",
    title: "FAQ: Orders, Samples & Delivery | D Creations",
    description: "Answers about small orders, quotations, samples, design help and shipping across India for custom apparel from D Creations.",
    body: () => promote(faq()) + ctaBand(),
  },
  {
    path: "/contact",
    name: "Contact",
    title: `Contact D Creations: WhatsApp & Call ${site.phoneDisplay}`,
    description: "Call or WhatsApp D Creations about custom apparel, or request a quote online. Based in Mangalore, Karnataka.",
    body: () => promote(contact()) + ctaBand(),
  },
  {
    path: "/privacy",
    name: "Privacy",
    title: "Privacy Notice | D Creations",
    description: "How the D Creations website handles your information.",
    body: () => privacy(),
  },
];

export const pageBody = (pg) => crumbs(pg.name) + pg.body();
