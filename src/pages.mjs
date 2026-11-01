// Standalone pages. Each has its own <h1>, breadcrumbs and metadata.
import { site, fabrics, categories } from "./data.mjs";
import { esc } from "./util.mjs";
import { fabricLibrary } from "./fabrics.mjs";
import { clothingIndex } from "./clothing.mjs";
import {
  secHead, process, customisation, why, gallery, clientsSection, instagram, reviews,
  aboutStory, units, faq, contactSection, ctaBand,
} from "./home.mjs";

const crumbs = (name) => `
<div class="wrap page-crumbs">
  <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${esc(name)}</li></ol></nav>
</div>`;

function fabricsPage() {
  return `
<section class="section flibrary" aria-labelledby="flib-title">
  <div class="wrap">
    ${secHead({
      label: "Fabric library",
      id: "flib-title",
      h: "h1",
      row: true,
      title: `${fabrics.length} fabrics. <em>One library.</em>`,
      aside: `<p>Every fabric DCT lists, with the clothing categories it's listed for. Filter by category, then ask about any fabric. Availability, colours and specifications are confirmed with your quotation.</p>`,
    })}
    ${fabricLibrary()}
    <p class="concept-note">Textures are illustrative, drawn for this site. They are not photographs of the actual fabrics. Hoodies &amp; Varsity Jackets and Sublimation T-Shirts fabrics are confirmed on enquiry.</p>
  </div>
</section>
${ctaBand(`Found your fabric? <em>Let's talk.</em>`)}`;
}

function manufacturingPage() {
  return `
<section class="section mfg" aria-labelledby="mfg-title">
  <div class="wrap mfg__grid">
    <div>
      <p class="eyebrow">Manufacturing</p>
      <h1 class="display" id="mfg-title" data-split>Made in our own <em>setup.</em></h1>
    </div>
    <div class="mfg__copy" data-reveal>
      <p class="lead">D Creations works from two units, in Mangalore and Tiruppur. With our own manufacturing setup, we keep full control over quality, and every order follows the same path: brief, sample, approval, production, checks, dispatch.</p>
      <ul class="mfg__facts">
        <li><strong>${categories.length}</strong><span>clothing categories</span></li>
        <li><strong>${fabrics.length}</strong><span>fabrics listed</span></li>
        <li><strong>5</strong><span>customisation methods</span></li>
      </ul>
    </div>
  </div>
</section>
${process({ n: "", headId: "process-title" })}
${customisation()}
${why({ n: "" })}
${units()}
${ctaBand()}`;
}

function privacy() {
  return `
<section class="section legal" aria-labelledby="privacy-title">
  <div class="wrap legal__in">
    <p class="eyebrow">Privacy</p>
    <h1 class="display" id="privacy-title">Privacy notice</h1>
    <p class="lead">How this website handles your information.</p>

    <h2>What this website collects</h2>
    <p>This website has no user accounts and does not store enquiries. When you fill in the enquiry form, your answers are put together into a message <strong>on your own device</strong>. Nothing is sent until you choose to send that message in WhatsApp.</p>

    <h2>WhatsApp enquiries</h2>
    <p>When you continue to WhatsApp, the message you send (including your name, phone number and any details you add) is delivered to ${esc(site.name)} through WhatsApp, a service of Meta. It is used only to respond to your enquiry and prepare a quotation. WhatsApp's own privacy policy applies to messages sent through it.</p>

    <h2>Calls and email</h2>
    <p>If you call or email us, your phone number or email address is visible to us as usual, and is used only to respond to you.</p>

    <h2>Maps and Instagram</h2>
    <p>The map on the contact page and any Instagram posts load only when you choose to load them. When loaded, Google or Instagram may set cookies or collect data under their own policies. Links to Instagram and Google Maps open those services directly.</p>

    <h2>Hosting and this browser</h2>
    <p>This website is hosted by Vercel, which may keep standard technical logs (such as IP address and pages requested) to operate and secure the service. This site uses no analytics or advertising trackers. It remembers, for this browser tab only, that you have seen the opening animation, so it plays in full once.</p>

    <h2>Your choices</h2>
    <p>To ask about, correct or delete information you've sent us, contact us on WhatsApp, call <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a> or email <a href="mailto:${site.email}">${site.email}</a>.</p>
  </div>
</section>`;
}

export const pages = [
  {
    path: "/clothing",
    name: "Clothing",
    title: "Custom Clothing Manufacturer: Uniforms, Jerseys, Polos | D Creations",
    description: "School uniform T-shirts, marathon T-shirts, track pants, corporate T-shirts, gym wear, hoodies and sublimation T-shirts, made to order in Mangalore & Tiruppur.",
    crumbs: false,
    body: () => clothingIndex(),
  },
  {
    path: "/fabrics",
    name: "Fabrics",
    title: "Fabric Library: Lacoste, Honeycomb, Dotknit, Mirror & More | D Creations",
    description: `All ${fabrics.length} fabrics D Creations lists for custom uniforms, jerseys, polos and gym wear, with the clothing categories each is used for.`,
    body: () => fabricsPage(),
  },
  {
    path: "/manufacturing",
    name: "Manufacturing",
    title: "Custom Apparel Manufacturing in Mangalore & Tiruppur | D Creations",
    description: "How D Creations makes custom apparel: brief, design, sample approval, production with quality checks, packing and dispatch, plus printing and embroidery options.",
    body: () => manufacturingPage(),
  },
  {
    path: "/work",
    name: "Our Work",
    title: "Our Work: Event Jerseys, Marathon Tees & Design Concepts | D Creations",
    description: "Events and clubs that have worn kits made by DC T-Shirt Factory, from Hackfest at NMAMIT to the Udupi Marathon, plus design concepts we can make.",
    body: () => clientsSection({ full: true, h: "h1" }) + reviews() + gallery() + instagram() + ctaBand(),
  },
  {
    path: "/about",
    name: "About",
    title: "About D Creations (DC T-Shirt Factory) | Mangalore & Tiruppur",
    description: "D Creations makes custom T-shirts and apparel: school uniforms, sportswear, corporate polos, hoodies and sublimation jerseys. Small runs and bulk orders welcome.",
    body: () => aboutStory({ h: "h1" }) + units() + why({ n: "" }) + instagram() + ctaBand(),
  },
  {
    path: "/faq",
    name: "FAQ",
    title: "FAQ: Orders, Fabrics, Samples & Delivery | D Creations",
    description: "Answers about categories, small and bulk orders, fabrics, customisation, sizes, samples and shipping across India for custom apparel from D Creations.",
    body: () => faq({ h: "h1" }) + ctaBand(),
  },
  {
    path: "/contact",
    name: "Contact",
    title: `Contact & Request a Quote | D Creations ${site.phoneDisplay}`,
    description: "Send an enquiry for custom apparel on WhatsApp, or call D Creations. Units in Kankanady, Mangalore and Chettipalayam, Tiruppur.",
    data: true,
    body: () => contactSection({ h: "h1", title: `Request <em>a quote.</em>`, map: true }),
  },
  {
    path: "/privacy",
    name: "Privacy",
    title: "Privacy Notice | D Creations",
    description: "How the D Creations website handles your information.",
    body: () => privacy(),
  },
];

export const pageBody = (pg) => (pg.crumbs === false ? "" : crumbs(pg.name)) + pg.body();
