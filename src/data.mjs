// ---------------------------------------------------------------------------
// D Creations / DCT Shirt Factory: all public content lives here.
//
// RULES (from the owner's website brief, 16 Oct 2026):
//  - No prices, price tiers or price-like hints anywhere.
//  - No brand-like fabric names (e.g. Lacoste, Lycra). Generic descriptors only.
//  - No unverified facts. Anything the owner has not confirmed is `null` and is
//    simply not shown. It is listed in `pending` (see OWNER-INPUTS.md).
//  - Copy only repeats claims the owner already publishes: the original
//    dctshirtfactory.co.in site and the @dctshirtfactory Instagram bio.
//  - Product images are AI design concepts and are labelled as such.
// `npm run build` scans the output for prohibited content (scripts/check-content.mjs).
// ---------------------------------------------------------------------------

export const site = {
  name: "D Creations",
  altName: "DC T-Shirt Factory", // as printed in the owner's catalogue
  // Intended production domain. Not yet pointed at this build, so pages are noindex.
  url: "https://dctshirtfactory.co.in",
  indexable: false,
  whatsapp: "918136867309",
  phoneDisplay: "+91 81368 67309",
  phoneHref: "+918136867309",
  instagram: "https://www.instagram.com/dctshirtfactory/",
  instagramHandle: "@dctshirtfactory",
  mapsUrl: "https://maps.app.goo.gl/N29STUQ3fL6JTxXY8",
  geo: { lat: 12.914141, lng: 74.849991 }, // from the original site's map embed
  locality: "Mangalore",
  region: "Karnataka",
  locations: "Mangalore & Tiruppur",
  // NOTE: the owner's catalogue prints "dcreationstripur@gmail.com" (t-r-i-p-u-r).
  // Kept as confirmed by the user on 2026-10-18 until the owner settles which is right.
  email: "dcreationstirpur@gmail.com",
  // Mangalore address from the owner's printed catalogue.
  street: "1st Floor, Jean Complex, Kankanady",
  postalCode: "575002",
  // Not yet confirmed by the owner → not shown anywhere:
  hours: null,
  gstin: null,
};

// Both units, exactly as printed in the owner's catalogue (Oct 2026).
export const addresses = [
  { name: "DC T-Shirt Factory", city: "Mangalore", lines: ["1st Floor, Jean Complex, Kankanady", "Mangalore, Karnataka 575002"], maps: true },
  { name: "D Creations", city: "Tiruppur", lines: ["8/29J, A.V.P Layout, Gandhi Nagar PO", "Chettipalayam, Tiruppur, Tamil Nadu 641603"] },
];

export const waGreeting = "Hello D Creations (DC T-Shirt Factory), I would like a quotation.";

// Sizes and customisation methods come from the owner's project brief.
export const sizes = "Kids to 5XL";

export const printMethods = [
  { key: "screen", name: "Screen printing", note: "Solid-colour artwork printed directly onto the garment." },
  { key: "dtf", name: "DTF printing", note: "Full-colour artwork applied as a film transfer." },
  { key: "sublimation", name: "Sublimation", note: "All-over designs dyed into polyester fabric." },
  { key: "embroidery", name: "Embroidery", note: "Logos and names stitched with thread." },
  { key: "patches", name: "Patches", note: "Separate badges stitched or applied to the garment." },
];

// ----- Fabrics --------------------------------------------------------------
// Public names are generic construction descriptors. `supplierName` is the name
// the original site used. It's internal only (never rendered) so the owner can
// match the two. Descriptions are visual/tactile only: no fibre content, GSM or
// performance claims until the owner supplies verified specs.
export const fabrics = [
  { key: "pique", name: "Piqué knit", supplierName: "Lacoste / Pique", texture: "pique", tint: "#3b4a6b",
    feel: "A knit with a fine raised diamond texture and a structured, polo-style look.",
    usedFor: "Polos, corporate wear, school uniforms" },
  { key: "honeycomb", name: "Honeycomb knit", supplierName: "Honeycomb", texture: "honeycomb", tint: "#7a2e2e",
    feel: "A knit with a small hexagon-cell surface texture.",
    usedFor: "School wear, trackpants, team tees" },
  { key: "spun-honeycomb", name: "Spun honeycomb knit", supplierName: "Spun Honeycomb", texture: "honeycombSoft", tint: "#5a5a3a",
    feel: "A honeycomb-textured knit with a softer, less shiny surface.",
    usedFor: "School polos, everyday uniforms" },
  { key: "smooth-light", name: "Lightweight smooth knit", supplierName: "Selina", texture: "smooth", tint: "#1f5f5b",
    feel: "A light knit with a smooth, even surface.",
    usedFor: "Event tees, sublimation printing" },
  { key: "smooth-finish", name: "Smooth-finish knit", supplierName: "Mirror", texture: "sheen", tint: "#2d3d5a",
    feel: "A knit with a smooth, finished surface.",
    usedFor: "Team jerseys, activewear" },
  { key: "stretch", name: "Stretch knit", supplierName: "Lycra / NS Lycra", texture: "rib", tint: "#222428",
    feel: "A knit with stretch, for close-fitting garments.",
    usedFor: "Gym wear, cycling jerseys, trackpants" },
  { key: "fleece", name: "Fleece knit", supplierName: "Fleece", texture: "fleece", tint: "#6b5a48",
    feel: "A knit with a brushed, soft inner surface.",
    usedFor: "Hoodies, sweatshirts, jackets" },
  { key: "matte", name: "Matte-finish knit", supplierName: "Mars", texture: "matte", tint: "#40364f",
    feel: "A knit with a flat, non-shiny finish.",
    usedFor: "School uniforms, corporate tees, everyday tees" },
  { key: "dot-textured", name: "Dot-textured knit", supplierName: "Dotknit", texture: "dots", tint: "#2f5a2f",
    feel: "A knit with a fine dotted surface texture.",
    usedFor: "Event tees, sports days, sublimation jerseys" },
  { key: "open-mesh", name: "Open mesh knit", supplierName: "Airtex", texture: "holes", tint: "#4a6170",
    feel: "A knit with a visible open, airy structure.",
    usedFor: "PE uniforms, summer polos" },
  { key: "matty", name: "Matty-weave knit", supplierName: "PC Matty", texture: "basket", tint: "#5c4632",
    feel: "A knit with a small basket-style (matty) texture.",
    usedFor: "Corporate polos, school uniforms" },
];

// ----- Products ----------------------------------------------------------------
// Pitches and use cases follow the owner's original product pages.
// images: AI design concepts with no logos or text (see docs/content-rights-register.csv).
export const products = [
  {
    slug: "school-uniform",
    name: "School Uniforms",
    short: "School Uniform T-Shirts",
    title: "School Uniform T-Shirts & Polos, Custom Made | D Creations Mangalore",
    description: "Custom school uniform T-shirts and polos made to your school's colours and crest. Small runs and bulk orders welcome. Request a custom quote.",
    teaser: "Uniform tees and polos made to your school's requirements.",
    pitch: "School uniform T-shirts with reinforced stitching, fade-resistant dyes and sizes for all age groups. Logo embroidery and print options, trial samples and pack-ready finishing for distribution.",
    images: ["school-polo-white", "school-set"],
    fabrics: ["pique", "honeycomb", "matte", "spun-honeycomb", "dot-textured", "open-mesh", "matty"],
    branding: ["embroidery", "screen", "dtf"],
    useCases: ["Daily school uniforms", "House / team T-shirts", "Inter-school sports and events"],
    audience: ["schools", "colleges"],
  },
  {
    slug: "marathon-tshirt",
    name: "Marathon & Event Tees",
    short: "Marathon / Event T-Shirts",
    title: "Marathon & Event T-Shirts, Custom Printed | D Creations",
    description: "Custom marathon and event T-shirts with full sublimation printing and logo placement, made for event bulk runs. Request a custom quote.",
    teaser: "Lightweight tees for races, runs and event days.",
    pitch: "Made for marathons and mass-participation events: lightweight fabrics, full sublimation printing and event bulk runs with logo placement and size charts.",
    images: ["event-tee-orange", "team-jersey", "marathon-galaxy"],
    fabrics: ["smooth-light", "dot-textured", "stretch"],
    branding: ["sublimation", "screen", "dtf"],
    useCases: ["Marathons & races", "Team running kits", "Corporate sports days"],
    audience: ["sports", "events", "corporates"],
  },
  {
    slug: "corporate-tshirt",
    name: "Corporate Tees & Polos",
    short: "Corporate T-Shirts & Polos",
    title: "Corporate T-Shirts & Polos with Your Logo | D Creations",
    description: "Custom corporate polos and T-shirts for staff uniforms, events and promotions, with embroidery, printing and woven labels. Request a custom quote.",
    teaser: "Polos and tees for teams, events and promotions.",
    pitch: "Polos and branded tees for staff uniforms, events and promotions, with woven labels, embroidery and printed branding.",
    images: ["polo-navy", "corporate-black"],
    fabrics: ["pique", "matte", "smooth-finish", "open-mesh", "matty"],
    branding: ["embroidery", "screen", "dtf"],
    useCases: ["Corporate uniforms", "Promotional merch", "Retail-ready branded apparel"],
    audience: ["corporates", "events"],
  },
  {
    slug: "trackpants-shorts",
    name: "Trackpants & Shorts",
    short: "Trackpants & Shorts",
    title: "Custom Trackpants & Shorts for Teams & Schools | D Creations",
    description: "Custom trackpants and shorts with elastic waists, drawstrings and zip pocket options for teams, schools and training. Request a custom quote.",
    teaser: "Training bottoms in tapered or straight fits.",
    pitch: "Trackpants and lightweight shorts designed for movement. Options include tapered fits, elastic waists, drawstrings, zip pockets and reflective trims.",
    images: ["trackpants-navy", "shorts-navy"],
    fabrics: ["honeycomb", "spun-honeycomb", "stretch"],
    branding: ["screen", "dtf", "embroidery"],
    useCases: ["Team training gear", "School & college sports", "Casual athleisure"],
    audience: ["schools", "sports", "gyms", "colleges"],
  },
  {
    slug: "gym-wears",
    name: "Gym Wear & Cycling Jerseys",
    short: "Gym Wear & Cycling Jerseys",
    title: "Custom Gym Wear & Cycling Jerseys | D Creations",
    description: "Custom gym wear, compression tops and cycling jerseys with custom cuts and branding for teams, gyms and fitness brands. Request a custom quote.",
    teaser: "Training tops and cycling jerseys for gyms and clubs.",
    pitch: "Gym wear, compression tops, cycling jerseys and training shorts, with custom cuts and branding for sports teams and fitness brands.",
    images: ["cycling-jersey-teal", "gym-compression"],
    fabrics: ["stretch", "smooth-finish"],
    branding: ["sublimation", "dtf", "screen"],
    useCases: ["Cycling & running jerseys", "Gym training apparel", "Fitness brand collections"],
    audience: ["gyms", "sports"],
  },
  {
    slug: "hoodies-varsity",
    name: "Hoodies & Varsity Jackets",
    short: "Hoodies & Varsity Jackets",
    title: "Custom Hoodies & Varsity Jackets | D Creations",
    description: "Custom hoodies and varsity jackets with ribbed cuffs, embroidered logos, woven labels and patches for colleges, teams and companies. Request a custom quote.",
    teaser: "Hoodies and jackets for colleges, teams and companies.",
    pitch: "Hoodies and varsity jackets with ribbed cuffs and custom patches. Options for embroidered logos, woven labels and printed branding.",
    images: ["hoodie-charcoal", "varsity-cream", "hoodie-beige"],
    fabrics: ["fleece"],
    branding: ["embroidery", "patches", "screen", "dtf"],
    useCases: ["College & varsity teams", "Corporate winter giveaways", "Retail & fashion lines"],
    audience: ["colleges", "corporates", "sports"],
  },
  {
    slug: "sublimation-tshirt",
    name: "Sublimation T-Shirts",
    short: "Sublimation T-Shirts",
    title: "Sublimation T-Shirts & Jerseys, All-Over Print | D Creations",
    description: "Custom sublimation T-shirts and jerseys with full all-over prints for team kits, events and custom designs. Request a custom quote.",
    teaser: "All-over prints for team kits and events.",
    pitch: "Full-coverage sublimation printing for team kits, events and custom designs, with colour matching and batch consistency across large runs.",
    images: ["sublimation-wave", "sublimation-art", "sublimation-sleeve"],
    fabrics: ["smooth-light", "dot-textured", "stretch"],
    branding: ["sublimation"],
    useCases: ["Team kits", "Event merchandise", "Design-heavy printed apparel"],
    audience: ["sports", "events", "colleges", "schools"],
  },
];

// ----- Audiences (sectors served, not named clients) ----------------------------
export const audiences = [
  { key: "schools", name: "Schools", line: "Uniforms, house tees and sports kits", products: ["school-uniform", "trackpants-shorts", "sublimation-tshirt"] },
  { key: "corporates", name: "Corporates", line: "Polos, event tees and branded apparel", products: ["corporate-tshirt", "hoodies-varsity", "marathon-tshirt"] },
  { key: "sports", name: "Sports & Marathons", line: "Race tees, team jerseys and kits", products: ["marathon-tshirt", "sublimation-tshirt", "trackpants-shorts"] },
  { key: "gyms", name: "Gyms & Clubs", line: "Training wear and cycling jerseys", products: ["gym-wears", "trackpants-shorts"] },
  { key: "colleges", name: "Colleges", line: "Hoodies, fest tees and varsity jackets", products: ["hoodies-varsity", "sublimation-tshirt"] },
  { key: "events", name: "Events & Brands", line: "Event tees, merch and promotions", products: ["corporate-tshirt", "marathon-tshirt"] },
];

// Each benefit repeats a statement from the owner's original website.
export const benefits = [
  { icon: "check", title: "Quality checks at every stage", text: "Fabric, stitching, finishing and packing are checked as the order is made." },
  { icon: "sample", title: "Sample approval first", text: "You approve a sample before production starts." },
  { icon: "pen", title: "Design help", text: "Send your artwork, or let our team help create it." },
  { icon: "fabric", title: "Wide fabric range", text: "Several knit types to choose from, for uniforms, sportswear and winter wear." },
  { icon: "factory", title: "Small runs and bulk orders", text: "Made to order, whether you need a small batch or a large run." },
  { icon: "clock", title: "Shipping across India", text: "Orders are packed and dispatched to you anywhere in India." },
];

// How it works: no promised times, charges or terms.
export const steps = [
  { n: "01", title: "Share your requirement", text: "Tell us the product, quantity, fabric and design you have in mind." },
  { n: "02", title: "Design & specification", text: "Send your artwork, or our team helps create it. We agree the details together." },
  { n: "03", title: "Sample & quotation", text: "You approve a sample and receive a quotation for your exact specification." },
  { n: "04", title: "Production & quality checks", text: "Your order is made and checked at each stage." },
  { n: "05", title: "Packing & dispatch", text: "Your order is packed and shipped to you." },
];

// From the owner's original website. Source/permission still to be confirmed
// (see OWNER-INPUTS.md). Shown without ratings or "verified" labels.
// A fourth review ("…in affordable price") is left out: no price wording on the site.
export const testimonials = [
  { name: "Mahesh", text: "Good quality clothes, well maintained office, and I liked their service when customers walk into the office." },
  { name: "Sathwik Shetty", text: "Great quality jersey! The material feels premium, the print is sharp, and the fit is perfect. Really happy with the final product. Recommended!" },
  { name: "Prajwal Pai", text: "Good quality fabrics and in time delivery." },
];

// Design concepts (AI-generated, logo-free). These are NOT delivered client work.
export const concepts = [
  { img: "sublimation-wave", cat: "sublimation-tshirt", title: "All-over wave print tee" },
  { img: "polo-navy", cat: "corporate-tshirt", title: "Navy polo" },
  { img: "school-polo-white", cat: "school-uniform", title: "Tipped school polo" },
  { img: "hoodie-charcoal", cat: "hoodies-varsity", title: "Pullover hoodie" },
  { img: "event-tee-orange", cat: "marathon-tshirt", title: "Event tee" },
  { img: "varsity-cream", cat: "hoodies-varsity", title: "Varsity jacket" },
  { img: "team-jersey", cat: "marathon-tshirt", title: "Team jersey, front & back" },
  { img: "cycling-jersey-teal", cat: "gym-wears", title: "Cycling jersey" },
  { img: "trackpants-navy", cat: "trackpants-shorts", title: "Piped trackpants" },
  { img: "sublimation-art", cat: "sublimation-tshirt", title: "Illustrated print tee" },
];

// Gated. A client appears only when it has a name, the work done, and either
//  - `sources`: the owner's own public @dctshirtfactory posts that name the client, or
//  - the owner's written approval (`approvedBy` + `approvedOn`).
// Text only, worded as in the owner's caption. No client logos or event photos are
// copied onto the site; the owner's posts load as official Instagram embeds on click.
// Clients' own written OK is still recommended (see OWNER-INPUTS.md §5).
export const clients = [
  {
    name: "Hackfest, NMAM Institute of Technology",
    place: "Nitte",
    type: "College tech event",
    work: "Official event T-shirts: custom navy and olive tees for the 50-hour hackathon.",
    when: "2025",
    product: "marathon-tshirt",
    sources: [
      { url: "https://www.instagram.com/dctshirtfactory/p/DR2M0ewksRO/", date: "4 Dec 2025" },
      { url: "https://www.instagram.com/dctshirtfactory/reel/DXpKLNeiWF1/", date: "27 Apr 2026" },
    ],
  },
  {
    name: "NITTE Walkathon 2025",
    place: null,
    type: "Walkathon",
    work: "Custom jerseys and caps for the walk's “Protect Our Oceans” theme.",
    when: "2025",
    product: "marathon-tshirt",
    sources: [{ url: "https://www.instagram.com/dctshirtfactory/p/DS2qn9MkpCf/", date: "29 Dec 2025" }],
  },
  {
    name: "Mangaluru Beach Festival Marathon",
    place: "Mangaluru",
    type: "Marathon",
    work: "The official marathon jersey.",
    when: "Dec 2025",
    product: "marathon-tshirt",
    sources: [{ url: "https://www.instagram.com/dctshirtfactory/reel/DSnKTuNkvu3/", date: "23 Dec 2025" }],
  },
  {
    name: "Udupi Marathon",
    place: "Udupi",
    type: "Marathon",
    work: "The official blue and white jerseys for the 7 December run.",
    when: "Dec 2025",
    product: "marathon-tshirt",
    sources: [{ url: "https://www.instagram.com/dctshirtfactory/p/DR_PKHGknNX/", date: "7 Dec 2025" }],
  },
  {
    // Their Reels on the profile are @balipuclub's own content, so none is embedded here.
    name: "Balipu Run Club",
    place: "Mangalore",
    type: "Run club",
    work: "Custom apparel for the club's runs.",
    when: null,
    product: "marathon-tshirt",
    approvedBy: "Vedora Labs, confirmed as a client on the owner's behalf",
    approvedOn: "2026-10-18",
  },
];

// Owner-selected Instagram posts/Reels (official URLs). Empty → a profile link only.
// Candidates found on the public profile (awaiting owner selection) are listed in OWNER-INPUTS.md.
export const instagramPosts = [];

// FAQ: answers avoid times, charges and terms the owner hasn't confirmed.
export const faqs = [
  ["Do you take small orders?", "Yes. Small runs and bulk orders are both welcome. Share your quantity and we'll confirm what's possible for your product."],
  ["How much does it cost?", "Every order is quoted for its exact specification: product, fabric, quantity, customisation and delivery. Request a quote and the owner will review your brief."],
  ["Can I see a sample before the full order?", "Yes. You approve a sample before production starts."],
  ["How long will my order take?", "It depends on the product, quantity and customisation. Tell us your required-by date and we'll confirm before you commit."],
  ["We don't have a design. Can you help?", "Yes. Send your artwork, or let our team help create it."],
  ["Do you ship across India?", "Yes, we ship orders across India."],
];

// Everything the owner still needs to confirm before launch (mirrors OWNER-INPUTS.md).
export const pending = [
  "Quote destination: WhatsApp only, or also email/CRM? (currently WhatsApp)",
  "Production domain + redirect plan (site is noindex until then)",
  "Email spelling: catalogue says dcreationstripur@, site uses dcreationstirpur@",
  "GSTIN, business hours",
  "Fabric names/specs verified against physical samples (and macro photos)",
  "Customisation methods actually offered (screen, DTF, sublimation, embroidery, patches)",
  "Source + permission for the 3 testimonials",
  "Approved Instagram posts/Reels to feature",
  "Clients page: owner to confirm the 4 events listed from Instagram, and any older clients",
  "Real product, process and factory photos/video",
  "FAQ answers and benefit statements sign-off",
  "Privacy notice sign-off",
];
