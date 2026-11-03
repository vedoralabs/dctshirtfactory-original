// ---------------------------------------------------------------------------
// D Creations / DCT Shirt Factory: all public content lives here.
//
// RULES (from the owner's website brief, 16 Oct 2026):
//  - No prices, price tiers or price-like hints anywhere.
//  - Category and fabric names exactly as DCT lists them (Nov 2026 brief), including
//    trade fabric names such as Lacoste and Lycra, used the way DCT uses them.
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

// ----- Fabrics ----------------------------------------------------------------
// Canonical fabric records. Names are exactly as DCT lists them (implementation
// brief, Nov 2026). A fabric's categories are derived from `categories[].fabrics`
// below, so each relationship is stated once. `description` and
// `verifiedProperties` stay absent until DCT confirms them: no GSM, composition,
// performance, durability or care claims. `texture` picks an illustrative SVG
// (src/textures.mjs). Construction-named fabrics get a matching pattern; trade
// names get a neutral knit. Every texture is labelled as illustrative on the site.
/**
 * @typedef {{ id: string, name: string, texture: string, tint: string,
 *   description?: string, verifiedProperties?: Record<string, string> }} Fabric
 * @typedef {{ id: string, slug: string, title: string, name: string, metaTitle: string,
 *   description: string, teaser: string, pitch: string, heroImage: string, images: string[],
 *   fabrics: string[], branding: string[], useCases: string[], audience: string[] }} Category
 */
/** @type {Fabric[]} */
export const fabrics = [
  { id: "lacoste", name: "Lacoste", texture: "pique", tint: "#2c3b5c" },
  { id: "pique", name: "Pique", texture: "pique", tint: "#3d4f3a" },
  { id: "honeycomb", name: "Honeycomb", texture: "honeycomb", tint: "#6b2c2c" },
  { id: "spun-honeycomb", name: "Spun Honeycomb", texture: "honeycombSoft", tint: "#5a5a3a" },
  { id: "mars", name: "Mars", texture: "jersey", tint: "#40364f" },
  { id: "mars-premium", name: "Mars Premium", texture: "jersey", tint: "#2f2a3d" },
  { id: "mars-200", name: "Mars 200", texture: "jersey", tint: "#4a3f5e" },
  { id: "njs", name: "NJS", texture: "jersey", tint: "#24414a" },
  { id: "nirmal", name: "Nirmal", texture: "jersey", tint: "#4d3b2a" },
  { id: "superpoly", name: "Superpoly", texture: "smooth", tint: "#1f3d5b" },
  { id: "dotknit", name: "Dotknit", texture: "dots", tint: "#2f5a2f" },
  { id: "airtex", name: "Airtex", texture: "holes", tint: "#4a6170" },
  { id: "pc-matty", name: "PC Matty", texture: "basket", tint: "#5c4632" },
  { id: "selina", name: "Selina", texture: "smooth", tint: "#1f5f5b" },
  { id: "jacquard", name: "Jacquard", texture: "jacquard", tint: "#3b2f4f" },
  { id: "lycra", name: "Lycra", texture: "jersey", tint: "#222428" },
  { id: "spandex", name: "Spandex", texture: "jersey", tint: "#2b2b33" },
  { id: "ns-lycra", name: "NS Lycra", texture: "jersey", tint: "#1d2530" },
  { id: "fine", name: "Fine", texture: "smooth", tint: "#3a4148" },
  { id: "mirror-200", name: "Mirror 200", texture: "sheen", tint: "#2d3d5a" },
  { id: "mirror-150x", name: "Mirror 150X", texture: "sheen", tint: "#24324a" },
  { id: "hydra-170", name: "Hydra 170", texture: "jersey", tint: "#1e4a52" },
  { id: "spectra-250-300", name: "Spectra 250/300", texture: "jersey", tint: "#3f2a2a" },
  { id: "cuba-300", name: "Cuba 300", texture: "jersey", tint: "#4a4030" },
  // From the owner's printed catalogue (Hoodies & Varsity and Sublimation T-Shirt pages)
  { id: "loopnet", name: "Loopnet", texture: "rib", tint: "#4a2f3a" },
  { id: "fleece", name: "Fleece", texture: "fleece", tint: "#5a4a3a" },
  { id: "adidas-selina", name: "Adidas Selina", texture: "smooth", tint: "#24445e" },
  { id: "pp", name: "PP", texture: "matte", tint: "#3d4a3a" },
];

// ----- Clothing categories ----------------------------------------------------------
// Titles are exactly as DCT lists them. `slug` keeps old URLs stable
// (/products/<slug> redirects to /clothing/<slug>). Pitches and use cases follow
// the owner's original product pages. Images are AI design concepts with no logos
// or text (docs/content-rights-register.csv). Hoodies & Varsity Jackets and
// Sublimation T-Shirts fabric lists are from the owner's printed catalogue.
/** @type {Category[]} */
export const categories = [
  {
    id: "school-uniform-t-shirts",
    slug: "school-uniform",
    title: "School Uniform T-Shirts",
    name: "School Uniforms",
    metaTitle: "School Uniform T-Shirt Manufacturer in Mangalore | D Creations",
    description: "Custom school uniform T-shirts and polos made to your school's colours and crest, from small runs to bulk orders. Request a quote on WhatsApp.",
    teaser: "Uniform tees and polos made to your school's requirements.",
    pitch: "School uniform T-shirts with reinforced stitching, fade-resistant dyes and sizes for all age groups. Logo embroidery and print options, trial samples and pack-ready finishing for distribution.",
    heroImage: "school-polo-white",
    images: ["school-polo-white", "school-set"],
    fabrics: ["lacoste", "honeycomb", "mars", "mars-premium", "spun-honeycomb", "njs", "nirmal", "superpoly", "dotknit", "airtex", "pc-matty"],
    branding: ["embroidery", "screen", "dtf"],
    useCases: ["Daily school uniforms", "House / team T-shirts", "Inter-school sports and events"],
    audience: ["schools", "colleges"],
  },
  {
    id: "marathon-t-shirts",
    slug: "marathon-tshirt",
    title: "Marathon T-Shirts",
    name: "Marathon T-Shirts",
    metaTitle: "Custom Marathon & Event T-Shirts | D Creations Mangalore",
    description: "Custom marathon and event T-shirts with sublimation printing and logo placement, made for event bulk runs. Request a quote on WhatsApp.",
    teaser: "Race-day tees for marathons, runs and events.",
    pitch: "Made for marathons and mass-participation events: lightweight fabrics, full sublimation printing and event bulk runs with logo placement and size charts.",
    heroImage: "event-tee-orange",
    images: ["event-tee-orange", "team-jersey", "marathon-galaxy"],
    fabrics: ["selina", "dotknit", "jacquard", "lycra", "spandex"],
    branding: ["sublimation", "screen", "dtf"],
    useCases: ["Marathons & races", "Team running kits", "Corporate sports days"],
    audience: ["sports", "events", "corporates"],
  },
  {
    id: "track-pants-shorts",
    slug: "trackpants-shorts",
    title: "Track Pants / Shorts",
    name: "Track Pants / Shorts",
    metaTitle: "Custom Track Pants & Shorts for Teams & Schools | D Creations",
    description: "Custom track pants and shorts with elastic waists, drawstrings and zip pocket options for teams, schools and training. Request a quote.",
    teaser: "Training bottoms in tapered or straight fits.",
    pitch: "Track pants and lightweight shorts designed for movement. Options include tapered fits, elastic waists, drawstrings, zip pockets and reflective trims.",
    heroImage: "trackpants-navy",
    images: ["trackpants-navy", "shorts-navy"],
    fabrics: ["superpoly", "honeycomb", "njs", "spun-honeycomb", "nirmal", "ns-lycra", "jacquard"],
    branding: ["screen", "dtf", "embroidery"],
    useCases: ["Team training gear", "School & college sports", "Casual athleisure"],
    audience: ["schools", "sports", "gyms", "colleges"],
  },
  {
    id: "corporate-t-shirts",
    slug: "corporate-tshirt",
    title: "Corporate T-Shirts",
    name: "Corporate T-Shirts",
    metaTitle: "Corporate T-Shirts & Polos with Your Logo | D Creations",
    description: "Custom corporate T-shirts and polos for staff uniforms, events and promotions, with embroidery, printing and woven labels. Request a quote.",
    teaser: "Polos and tees for teams, events and promotions.",
    pitch: "Polos and branded tees for staff uniforms, events and promotions, with woven labels, embroidery and printed branding.",
    heroImage: "polo-navy",
    images: ["polo-navy", "corporate-black"],
    fabrics: ["pique", "lacoste", "mars-200", "airtex", "pc-matty", "fine", "mirror-200"],
    branding: ["embroidery", "screen", "dtf"],
    useCases: ["Corporate uniforms", "Promotional merch", "Retail-ready branded apparel"],
    audience: ["corporates", "events"],
  },
  {
    id: "gym-wear",
    slug: "gym-wears",
    title: "Gym Wear",
    name: "Gym Wear",
    metaTitle: "Custom Gym Wear & Cycling Jerseys | D Creations",
    description: "Custom gym wear, compression tops and cycling jerseys with custom cuts and branding for teams, gyms and fitness brands. Request a quote.",
    teaser: "Training tops and cycling jerseys for gyms and clubs.",
    pitch: "Gym wear, compression tops, cycling jerseys and training shorts, with custom cuts and branding for sports teams and fitness brands.",
    heroImage: "cycling-jersey-teal",
    images: ["cycling-jersey-teal", "gym-compression"],
    fabrics: ["ns-lycra", "mirror-200", "mirror-150x", "hydra-170", "spectra-250-300", "cuba-300"],
    branding: ["sublimation", "dtf", "screen"],
    useCases: ["Cycling & running jerseys", "Gym training apparel", "Fitness brand collections"],
    audience: ["gyms", "sports"],
  },
  {
    id: "hoodies-varsity-jackets",
    slug: "hoodies-varsity",
    title: "Hoodies & Varsity Jackets",
    name: "Hoodies & Varsity Jackets",
    metaTitle: "Custom Hoodies & Varsity Jackets | D Creations",
    description: "Custom hoodies and varsity jackets with ribbed cuffs, embroidered logos, woven labels and patches for colleges, teams and companies. Request a quote.",
    teaser: "Hoodies and jackets for colleges, teams and companies.",
    pitch: "Hoodies and varsity jackets with ribbed cuffs and custom patches. Options for embroidered logos, woven labels and printed branding.",
    heroImage: "hoodie-charcoal",
    images: ["hoodie-charcoal", "varsity-cream", "hoodie-beige"],
    fabrics: ["loopnet", "superpoly", "fleece", "cuba-300"],
    branding: ["embroidery", "patches", "screen", "dtf"],
    useCases: ["College & varsity teams", "Corporate winter giveaways", "Retail & fashion lines"],
    audience: ["colleges", "corporates", "sports"],
  },
  {
    id: "sublimation-t-shirts",
    slug: "sublimation-tshirt",
    title: "Sublimation T-Shirts",
    name: "Sublimation T-Shirts",
    metaTitle: "Sublimation T-Shirts & Jerseys, All-Over Print | D Creations",
    description: "Custom sublimation T-shirts and jerseys with full all-over prints for team kits, events and custom designs. Request a quote.",
    teaser: "All-over prints for team kits and events.",
    pitch: "Full-coverage sublimation printing for team kits, events and custom designs, with colour matching and batch consistency across large runs.",
    heroImage: "sublimation-wave",
    images: ["sublimation-wave", "sublimation-art", "sublimation-sleeve"],
    fabrics: ["selina", "dotknit", "njs", "adidas-selina", "nirmal", "pp", "ns-lycra"],
    branding: ["sublimation"],
    useCases: ["Team kits", "Event merchandise", "Design-heavy printed apparel"],
    audience: ["sports", "events", "colleges", "schools"],
  },
];

/** The categories that list a fabric, in category order. */
export const fabricCategories = (fabricId) => categories.filter((c) => c.fabrics.includes(fabricId));

// ----- Audiences (sectors served, not named clients) ----------------------------
export const audiences = [
  { key: "schools", name: "Schools", line: "Uniforms, house tees and sports kits", categories: ["school-uniform", "trackpants-shorts", "sublimation-tshirt"] },
  { key: "corporates", name: "Corporates", line: "Polos, event tees and branded apparel", categories: ["corporate-tshirt", "hoodies-varsity", "marathon-tshirt"] },
  { key: "sports", name: "Sports & Marathons", line: "Race tees, team jerseys and kits", categories: ["marathon-tshirt", "sublimation-tshirt", "trackpants-shorts"] },
  { key: "gyms", name: "Gyms & Clubs", line: "Training wear and cycling jerseys", categories: ["gym-wears", "trackpants-shorts"] },
  { key: "colleges", name: "Colleges", line: "Hoodies, fest tees and varsity jackets", categories: ["hoodies-varsity", "sublimation-tshirt"] },
  { key: "events", name: "Events & Brands", line: "Event tees, merch and promotions", categories: ["corporate-tshirt", "marathon-tshirt"] },
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
// `thumbs`: photos from the owner's own Instagram posts of each order (they show client
// logos; used at the user's request, owner approval pending). [image base name, alt text]
export const clients = [
  {
    name: "Hackfest, NMAM Institute of Technology",
    place: "Nitte",
    type: "College tech event",
    work: "Official event T-shirts: custom navy and olive tees for the 50-hour hackathon.",
    thumbs: [
      ["work-hackfest-tees", "Hackfest event T-shirt in navy, front and back"],
      ["work-hackfest-worn", "Hackfest T-shirts being worn, back print visible"],
    ],
    when: "2025",
    category: "marathon-tshirt",
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
    thumbs: [["work-nitte-polo", "NITTE Walkathon 2025 polo in white, front and back"]],
    when: "2025",
    category: "marathon-tshirt",
    sources: [{ url: "https://www.instagram.com/dctshirtfactory/p/DS2qn9MkpCf/", date: "29 Dec 2025" }],
  },
  {
    name: "Mangaluru Beach Festival Marathon",
    place: "Mangaluru",
    type: "Marathon",
    work: "The official marathon jersey.",
    thumbs: [["work-beach-marathon", "Mangaluru Beach Festival Marathon jersey in red and blue"]],
    when: "Dec 2025",
    category: "marathon-tshirt",
    sources: [{ url: "https://www.instagram.com/dctshirtfactory/reel/DSnKTuNkvu3/", date: "23 Dec 2025" }],
  },
  {
    name: "Udupi Marathon",
    place: "Udupi",
    type: "Marathon",
    work: "The official blue and white jerseys for the 7 December run.",
    thumbs: [["work-udupi-marathon", "Udupi Marathon jersey in white and sky blue, front and back"]],
    when: "Dec 2025",
    category: "marathon-tshirt",
    sources: [{ url: "https://www.instagram.com/dctshirtfactory/p/DR_PKHGknNX/", date: "7 Dec 2025" }],
  },
  {
    // Their Reels on the profile are @balipuclub's own content, so none is embedded here.
    name: "Balipu Run Club",
    place: "Mangalore",
    type: "Run club",
    work: "Running T-shirts for the club.",
    when: null,
    category: "marathon-tshirt",
    approvedBy: "Vedora Labs, confirmed as a client on the owner's behalf",
    approvedOn: "2026-10-18",
  },
];

// Owner-selected Instagram posts/Reels (official URLs). Empty → a profile link only.
// Candidates found on the public profile (awaiting owner selection) are listed in OWNER-INPUTS.md.
export const instagramPosts = [];

// FAQ: answers avoid times, charges and terms the owner hasn't confirmed.
// Lead times, minimum quantities and sample charges stay unstated until DCT confirms them.
export const faqs = [
  ["What can you make?", "School uniform T-shirts, marathon T-shirts, track pants and shorts, corporate T-shirts, gym wear, hoodies and varsity jackets, and sublimation T-shirts. Each is made to your design, fabric and size break-up."],
  ["Do you take small orders as well as bulk orders?", "Yes. Small runs and bulk orders are both welcome. Share your quantity and we'll confirm what's possible for your product."],
  ["How do I get a quotation?", "Send your category, rough quantity, preferred fabric and design idea through the enquiry form or on WhatsApp. Every order is quoted for its exact specification."],
  ["Which fabrics can I choose from?", "Each category lists the fabrics DCT works with for it. Actual availability, colours and specifications are confirmed with your quotation."],
  ["How can the garments be customised?", "Options include screen printing, DTF printing, sublimation, embroidery and patches, depending on the garment and fabric."],
  ["What sizes do you make?", "Kids to 5XL. Share your size break-up with your enquiry."],
  ["Can I see a sample before the full order?", "Yes. You approve a sample before production starts."],
  ["How long will my order take?", "It depends on the product, quantity and customisation. Tell us your required-by date and we'll confirm before you commit."],
  ["We don't have a design. Can you help?", "Yes. Send your artwork, or let our team help create it."],
  ["Do you ship across India?", "Yes, we ship orders across India."],
];

// Everything the owner still needs to confirm before launch (mirrors OWNER-INPUTS.md).
export const pending = [
  "Public name styling: D Creations / DC T-Shirt Factory / DCT Shirt Factory",
  "Logo as SVG or high-resolution transparent file",
  "Quote destination: WhatsApp only, or also email/CRM? (currently WhatsApp)",
  "Production domain + redirect plan (site is noindex until then)",
  "Email spelling: catalogue says dcreationstripur@, site uses dcreationstirpur@",
  "GSTIN, business hours",
  "Fabric availability, spelling, specifications and category mappings (28 fabrics)",
  "Customisation methods actually offered (screen, DTF, sublimation, embroidery, patches)",
  "Lead times, minimum quantities, service area and any certifications",
  "Source + permission for the 3 testimonials",
  "Approved Instagram posts/Reels to feature, incl. the 5 work photos now shown on Our Work (they show client logos)",
  "Clients: owner to confirm the 4 events listed from Instagram, and any older clients",
  "Real product, fabric macro, process and factory photos/video",
  "FAQ answers and benefit statements sign-off",
  "Privacy notice sign-off",
];
