// ---------------------------------------------------------------------------
// D Creations: every business fact and every piece of page content lives here.
//
// Anything wrapped in tbc(...) is a PLACEHOLDER that D Creations has not
// confirmed yet (MOQ, prices, stats, address...). While any tbc() value is in
// use the site runs in "preview" mode:
//   - a slim banner says figures are placeholders,
//   - each placeholder gets a dotted underline and a tooltip,
//   - photo slots show their "[PHOTO: ...]" labels,
//   - the build prints the full list of what still needs confirming.
// Replace tbc(x) with the plain confirmed value and the markers disappear.
// `npm run build:strict` refuses to build while any placeholder remains.
// ---------------------------------------------------------------------------

export const tbc = (value) => ({ __tbc: true, value });

export const site = {
  name: "D Creations",
  legalName: tbc("D Creations"),
  url: "https://dctshirtfactory.co.in",
  tagline: "Custom apparel manufacturer — Mangalore & Tiruppur",
  whatsapp: "918136867309", // digits only, with country code
  phoneDisplay: "+91 81368 67309",
  phoneHref: "+918136867309",
  email: tbc("orders@dctshirtfactory.co.in"),
  instagram: "https://www.instagram.com/dctshirtfactory/",
  instagramHandle: "@dctshirtfactory",
  mapsUrl: "https://maps.app.goo.gl/N29STUQ3fL6JTxXY8",
  // Coordinates from the map embed on the original site.
  geo: { lat: 12.914141, lng: 74.849991 },
  address: {
    street: tbc("Street address"),
    locality: "Mangalore",
    region: "Karnataka",
    postalCode: tbc("575001"),
    country: "IN",
  },
  secondHub: "Tiruppur, Tamil Nadu",
  hours: tbc("Mon–Sat · 9:30 am – 7:00 pm"),
  hoursSchema: tbc(["Mo-Sa 09:30-19:00"]),
  gstin: tbc("29XXXXXXXXXXXZX"),
  googleRating: tbc("4.9"),
  googleReviewCount: tbc("50+"),
  defaultMessage:
    "Hi D Creations! I'd like a quote for custom apparel. (Sent from your website)",
};

export const stats = [
  { value: tbc(50000), suffix: "+", label: "Pieces delivered" },
  { value: tbc(500), suffix: "+", label: "Happy clients" },
  { value: tbc(8), suffix: "+", label: "Years of making" },
  { value: tbc(20000), suffix: "", label: "Pieces / month capacity" },
];

// Shown in the hero under the CTAs.
export const heroTrust = [
  tbc("50,000+ pieces delivered"),
  "Sample before bulk",
  "Pan-India delivery",
];

export const printMethods = [
  { key: "screen", name: "Screen print", note: "Best value for big runs with 1–4 solid colours." },
  { key: "dtf", name: "DTF print", note: "Full-colour logos and photos, any quantity, soft feel." },
  { key: "sublimation", name: "Sublimation", note: "All-over prints dyed into polyester — never cracks or peels." },
  { key: "embroidery", name: "Embroidery", note: "Stitched logos for a premium, long-lasting finish." },
  { key: "patches", name: "Patches", note: "Chenille, woven or PVC patches — classic on varsity jackets." },
];

export const sizes = "Kids (2–14 yrs) · XS – 5XL";

// ----- Fabric guide -------------------------------------------------------
// gsm / priceTier are typical industry ranges, to be confirmed by D Creations.
// breathability: 1 (warm) – 5 (very airy). texture: key into the SVG patterns
// in src/textures.mjs (used until a real close-up photo is supplied in `photo`).
export const fabrics = [
  { key: "lacoste", name: "Lacoste (Pique)", texture: "pique", tint: "#3b4a6b",
    feel: "Soft, structured, with a fine diamond texture. Looks smart, holds its shape.",
    gsm: tbc("180–220"), breathability: 4, priceTier: tbc(3),
    bestFor: "Polos, corporate wear, school uniforms" },
  { key: "honeycomb", name: "Honeycomb", texture: "honeycomb", tint: "#7a2e2e",
    feel: "Light polyester knit with tiny hexagon cells. Quick-drying and durable.",
    gsm: tbc("150–180"), breathability: 4, priceTier: tbc(2),
    bestFor: "School sports tees, trackpants, team tees" },
  { key: "spun-honeycomb", name: "Spun Honeycomb", texture: "honeycombSoft", tint: "#5a5a3a",
    feel: "Honeycomb texture with a cotton-like hand feel and less shine.",
    gsm: tbc("160–190"), breathability: 4, priceTier: tbc(2),
    bestFor: "School polos, everyday uniforms" },
  { key: "selina", name: "Selina", texture: "smooth", tint: "#1f5f5b",
    feel: "Smooth, light polyester. Takes sublimation colours brilliantly.",
    gsm: tbc("130–160"), breathability: 4, priceTier: tbc(1),
    bestFor: "Marathon tees, event tees, sublimation" },
  { key: "mirror", name: "Mirror", texture: "sheen", tint: "#2d3d5a",
    feel: "Polyester with a subtle sheen. Sharp, sporty, holds colour.",
    gsm: tbc("150–200"), breathability: 3, priceTier: tbc(2),
    bestFor: "Team jerseys, gym wear" },
  { key: "lycra", name: "Lycra (NS Lycra)", texture: "rib", tint: "#222428",
    feel: "Four-way stretch that moves with you and snaps back.",
    gsm: tbc("180–220"), breathability: 3, priceTier: tbc(3),
    bestFor: "Gym wear, cycling jerseys, compression, trackpants" },
  { key: "fleece", name: "Fleece", texture: "fleece", tint: "#6b5a48",
    feel: "Brushed, cosy inside. Keeps warm without the weight.",
    gsm: tbc("280–340"), breathability: 2, priceTier: tbc(3),
    bestFor: "Hoodies, sweatshirts, varsity jackets" },
  { key: "mars", name: "Mars", texture: "matte", tint: "#40364f",
    feel: "Matte-finish polyester with a cotton-like look. No shine, easy care.",
    gsm: tbc("160–180"), breathability: 3, priceTier: tbc(2),
    bestFor: "School uniforms, everyday tees" },
  { key: "dotknit", name: "Dotknit", texture: "dots", tint: "#2f5a2f",
    feel: "Micro-dot mesh knit. Very airy, feather-light, wicks sweat fast.",
    gsm: tbc("140–160"), breathability: 5, priceTier: tbc(1),
    bestFor: "Marathons, sports days, sublimation jerseys" },
  { key: "airtex", name: "Airtex", texture: "holes", tint: "#4a6170",
    feel: "Open, breathable knit with tiny air holes. Made for hot days.",
    gsm: tbc("160–180"), breathability: 5, priceTier: tbc(2),
    bestFor: "PE uniforms, summer polos" },
  { key: "pc-matty", name: "PC Matty", texture: "basket", tint: "#5c4632",
    feel: "Poly-cotton in a basket (matty) weave. Sturdy, wrinkle-resistant.",
    gsm: tbc("180–200"), breathability: 3, priceTier: tbc(2),
    bestFor: "Corporate polos, school uniforms, workwear" },
];

// ----- Products -----------------------------------------------------------
// images: base names from public/img (see scripts/make-images.py).
// fabrics: free text as D Creations lists them; keys found in `fabrics`
// above become links into the Fabric Guide.
export const products = [
  {
    slug: "school-uniform",
    name: "School Uniforms",
    short: "School Uniform T-Shirts",
    title: "School Uniform Manufacturer in Karnataka | D Creations Mangalore",
    description:
      "School uniform t-shirts, polos and PE kits made in Mangalore & Tiruppur. Lacoste, Honeycomb, Airtex & more. Sizes kids to 5XL. Sample before bulk. Get a WhatsApp quote.",
    teaser: "Durable, colourfast uniforms that survive a full school year.",
    pitch:
      "Uniforms that look sharp on day one and still look sharp in March. Reinforced stitching, fade-resistant dyes, and sizes from tiny kids to staff — with your crest embroidered or printed.",
    images: ["school-set", "school-polo"],
    fabrics: ["Lacoste", "Honeycomb", "Mars", "Spun Honeycomb", "Dotknit", "Airtex", "PC Matty"],
    moq: tbc("50 pcs"),
    priceFrom: tbc(220),
    gsm: tbc("160–220"),
    colours: "Any school colour — dyed or matched to your swatch",
    branding: ["embroidery", "screen", "dtf", "patches"],
    turnaround: tbc("10–15 working days after sample approval"),
    useCases: ["Daily school uniforms", "House & team T-shirts", "PE and sports-day kits", "Staff polos"],
    audience: ["schools", "colleges"],
    faq: [
      ["Can you match our existing uniform colour?", "Yes. Send us a sample piece or swatch — we match the dye before bulk and show you a physical sample to approve."],
      ["Do you do the school crest?", "Yes — embroidered crests are most popular for uniforms. Printing is a lower-cost option for house tees."],
      ["Can we re-order mid-year for new students?", "Yes. We keep your specs on file so top-up orders match the first batch."],
    ],
  },
  {
    slug: "marathon-tshirt",
    name: "Marathon & Event Tees",
    short: "Marathon / Event T-Shirts",
    title: "Marathon & Event T-Shirt Manufacturer | Bulk Running Tees | D Creations",
    description:
      "Lightweight, quick-dry marathon and event t-shirts in Dotknit, Selina & Lycra. Full sublimation printing, bulk runs, pan-India delivery. Get a WhatsApp quote.",
    teaser: "Feather-light, quick-dry tees your runners will actually wear again.",
    pitch:
      "Race-day tees in quick-dry, airy fabrics with your event art, sponsors and dates printed edge to edge. Built for thousands of runners and delivered before the expo.",
    images: ["marathon-jersey", "marathon-green", "marathon-galaxy"],
    fabrics: ["Selina", "Dotknit", "Lycra", "Jacquard", "Spandex"],
    moq: tbc("100 pcs"),
    priceFrom: tbc(160),
    gsm: tbc("130–160"),
    colours: "Unlimited with sublimation · solid dyed colours for screen print",
    branding: ["sublimation", "screen", "dtf"],
    turnaround: tbc("7–12 working days after sample approval"),
    useCases: ["Marathons & fun runs", "Cyclothons & walkathons", "Corporate sports days", "Team running kits"],
    audience: ["sports", "events", "corporates"],
    faq: [
      ["Can you deliver size-wise packed for the expo?", "Yes — we can bundle by size and label cartons so your bib-collection team can hand out fast."],
      ["How many sponsor logos can go on the tee?", "With sublimation, as many as you like, anywhere on the tee, at no extra print cost."],
      ["Our event date is fixed. Can you commit to it?", "Tell us the date upfront. We plan the schedule backwards from it and confirm before you pay the advance."],
    ],
  },
  {
    slug: "corporate-tshirt",
    name: "Corporate Tees & Polos",
    short: "Corporate T-Shirts & Polos",
    title: "Corporate T-Shirts & Polos in Bulk, India | Custom Logo | D Creations",
    description:
      "Custom corporate polos and t-shirts with embroidered or printed logos. Pique/Lacoste, Mirror, Airtex, PC Matty. Bulk orders, pan-India delivery. WhatsApp for a quote.",
    teaser: "Smart polos and tees in your exact brand colours.",
    pitch:
      "Uniforms, offsites, launches and merch — polos and tees that make your team look like a team. Pantone-matched colours, crisp embroidery and consistent sizing across every batch.",
    images: ["corporate-white", "corporate-black"],
    fabrics: ["Pique", "Lacoste", "Mirror", "Airtex", "PC Matty"],
    moq: tbc("50 pcs"),
    priceFrom: tbc(280),
    gsm: tbc("180–220"),
    colours: "Stock colours or dyed to your brand colour",
    branding: ["embroidery", "screen", "dtf", "patches"],
    turnaround: tbc("10–15 working days after sample approval"),
    useCases: ["Staff uniforms", "Offsites & team events", "Product launches & promo merch", "Welcome kits for new joiners"],
    audience: ["corporates", "events", "startups"],
    faq: [
      ["Can we get different names on each polo?", "Yes — individual names or employee IDs can be printed or embroidered per piece."],
      ["Do you deliver to multiple offices?", "Yes. Share the size break-up per office and we pack and ship separately across India."],
      ["Can you add a woven label with our brand?", "Yes, custom woven neck labels are available on bulk orders."],
    ],
  },
  {
    slug: "trackpants-shorts",
    name: "Trackpants & Shorts",
    short: "Trackpants & Shorts",
    title: "Custom Trackpants & Shorts Manufacturer | Team & School | D Creations",
    description:
      "Custom trackpants and shorts for schools, teams and gyms. Superpoly, Honeycomb, NS Lycra. Zip pockets, piping, tapered fits. Bulk orders, WhatsApp quote.",
    teaser: "Comfortable bottoms with zip pockets, piping and tapered fits.",
    pitch:
      "Training bottoms that move with you: tapered or straight fits, elastic waists with drawcords, zip pockets and contrast piping in your team colours.",
    images: ["trackpants-set", "shorts-navy"],
    fabrics: ["Superpoly", "Honeycomb", "NJS", "Spun Honeycomb", "NS Lycra"],
    moq: tbc("50 pcs"),
    priceFrom: tbc(260),
    gsm: tbc("180–240"),
    colours: "Any solid colour · contrast piping and side panels",
    branding: ["screen", "dtf", "embroidery", "sublimation"],
    turnaround: tbc("12–18 working days after sample approval"),
    useCases: ["Team training kits", "School & college sports", "Gym and coaching batches", "Casual athleisure"],
    audience: ["schools", "sports", "gyms", "colleges"],
    faq: [
      ["Can you match trackpants to our jerseys?", "Yes — order the full kit together and we match colours and piping across tops and bottoms."],
      ["Zip pockets or open pockets?", "Your choice. Zip pockets are popular for running and travel."],
      ["Do you make kids' sizes?", "Yes, from kids' sizes up to 5XL."],
    ],
  },
  {
    slug: "gym-wears",
    name: "Gym Wear & Cycling Jerseys",
    short: "Gym Wear & Cycling Jerseys",
    title: "Custom Gym Wear & Cycling Jersey Manufacturer India | D Creations",
    description:
      "Custom gym wear, compression tops and cycling jerseys in NS Lycra and Mirror fabrics. Stretch, quick-dry, full sublimation. Built for gyms, clubs and fitness brands.",
    teaser: "Stretch, sweat-wicking kit for gyms, clubs and fitness brands.",
    pitch:
      "Compression tops, training tees and cycling jerseys cut for movement. Four-way stretch fabrics, flat seams that don't rub, and full-colour designs for your gym or club brand.",
    images: ["gym-compression"],
    fabrics: ["NS Lycra", "Mirror 200", "Mirror 150X", "Hydra", "Spectra"],
    moq: tbc("30 pcs"),
    priceFrom: tbc(350),
    gsm: tbc("160–220"),
    colours: "Unlimited with sublimation",
    branding: ["sublimation", "dtf", "screen"],
    turnaround: tbc("10–15 working days after sample approval"),
    useCases: ["Gym staff & member merch", "Cycling club jerseys", "Fitness brand collections", "Running & triathlon clubs"],
    audience: ["gyms", "sports", "startups"],
    faq: [
      ["Can cycling jerseys have back pockets and a full zip?", "Yes — tell us the features you need (pockets, zip length, silicone gripper) and we include them in the sample."],
      ["Can we launch our own gym clothing brand with you?", "Yes. We make private-label runs with your neck labels and tags."],
      ["Is the print going to crack when it stretches?", "Not with sublimation — the colour is dyed into the fabric, so it stretches with it."],
    ],
  },
  {
    slug: "hoodies-varsity",
    name: "Hoodies & Varsity Jackets",
    short: "Hoodies & Varsity Jackets",
    title: "Custom Hoodies & Varsity Jackets Manufacturer India | D Creations",
    description:
      "Custom hoodies, sweatshirts and varsity jackets with embroidery and chenille patches. Fleece, Loopnet, Superpoly. For colleges, teams and companies. WhatsApp for a quote.",
    teaser: "Fleece hoodies and varsity jackets with patches and embroidery.",
    pitch:
      "The piece people keep for years. Brushed fleece hoodies and classic varsity jackets with ribbed cuffs, embroidered names and chenille patches — for batches, teams and companies.",
    images: ["hoodie-varsity", "hoodie-grey"],
    fabrics: ["Fleece", "Loopnet", "Superpoly", "Cuba 300"],
    moq: tbc("30 pcs"),
    priceFrom: tbc(650),
    gsm: tbc("280–340"),
    colours: "Stock and custom-dyed colours · contrast sleeves and rib trims",
    branding: ["embroidery", "patches", "screen", "dtf"],
    turnaround: tbc("15–20 working days after sample approval"),
    useCases: ["College batch & fest jackets", "Team and club jackets", "Corporate winter giveaways", "Streetwear & merch drops"],
    audience: ["colleges", "corporates", "sports", "startups"],
    faq: [
      ["Can each jacket have a different name?", "Yes — names, numbers or roll numbers can be embroidered per piece."],
      ["What patches can you do?", "Chenille, woven and embroidered patches. Send your art and we'll suggest what will look best."],
      ["Zip hoodie or pullover?", "Both — plus zip-up varsity jackets with snap buttons."],
    ],
  },
  {
    slug: "sublimation-tshirt",
    name: "Sublimation T-Shirts",
    short: "Sublimation T-Shirts",
    title: "Sublimation Jersey Manufacturer Tiruppur | All-over Print | D Creations",
    description:
      "All-over sublimation t-shirts and jerseys made in Tiruppur & Mangalore. Unlimited colours, no cracking, breathable polyester. Team kits, events, merch. WhatsApp quote.",
    teaser: "Edge-to-edge prints in unlimited colours that never crack.",
    pitch:
      "Any design, any colours, every inch of the shirt. The ink is dyed into the fabric, so it stays bright wash after wash and never cracks or peels.",
    images: ["sublimation-art", "sublimation-sleeve"],
    fabrics: ["Selina", "Dotknit", "NJS", "NS Lycra", "Nirmal"],
    moq: tbc("25 pcs"),
    priceFrom: tbc(240),
    gsm: tbc("130–180"),
    colours: "Unlimited — full CMYK on white polyester",
    branding: ["sublimation"],
    turnaround: tbc("7–12 working days after sample approval"),
    useCases: ["Cricket, football & kabaddi kits", "Event and fest merch", "Brand and band merch", "Design-heavy streetwear"],
    audience: ["sports", "events", "colleges", "schools"],
    faq: [
      ["Does sublimation work on cotton?", "No — it needs polyester. That's why we use Selina, Dotknit and Lycra-based fabrics for it."],
      ["Can every player have their own name and number?", "Yes, at no extra print cost — it's all part of the same full-colour print."],
      ["We don't have a design yet.", "Our design team can create one from your logo and colours. You approve the mock-up before we print."],
    ],
  },
];

// ----- Audiences ----------------------------------------------------------
export const audiences = [
  { key: "schools", name: "Schools", line: "Uniforms, house tees & PE kits", products: ["school-uniform", "trackpants-shorts", "sublimation-tshirt"] },
  { key: "corporates", name: "Corporates", line: "Polos, event tees & welcome kits", products: ["corporate-tshirt", "hoodies-varsity", "marathon-tshirt"] },
  { key: "sports", name: "Sports & Marathons", line: "Race tees, team jerseys & kits", products: ["marathon-tshirt", "sublimation-tshirt", "trackpants-shorts"] },
  { key: "gyms", name: "Gyms & Clubs", line: "Stretch training wear & cycling jerseys", products: ["gym-wears", "trackpants-shorts"] },
  { key: "colleges", name: "Colleges", line: "Batch hoodies, fest tees & varsity", products: ["hoodies-varsity", "sublimation-tshirt"] },
  { key: "events", name: "Events & Startups", line: "Merch drops, crew tees & giveaways", products: ["corporate-tshirt", "marathon-tshirt", "hoodies-varsity"] },
];

export const benefits = [
  { icon: "check", title: "In-house quality checks", text: "Fabric, stitching, print and packing are checked at every stage — not just at the end." },
  { icon: "sample", title: "Sample before bulk", text: "You hold and approve a real sample before a single bulk piece is cut." },
  { icon: "factory", title: "Two manufacturing hubs", text: "Mangalore for service and finishing, Tiruppur — India's knitwear capital — for scale." },
  { icon: "fabric", title: "11+ fabrics to choose from", text: "From breathable Dotknit to cosy Fleece. We help you pick the right one for the job." },
  { icon: "clock", title: "On-time delivery", text: "Tell us your event date upfront. We plan backwards from it and keep you posted." },
  { icon: "pen", title: "Free design support", text: "No artwork? Our team turns your logo and idea into a print-ready mock-up." },
];

export const steps = [
  { n: "01", title: "Design", text: "Share your logo or idea on WhatsApp. We send a mock-up with fabric and print suggestions.", photo: "[PHOTO: designer showing a mock-up on screen]" },
  { n: "02", title: "Sample approval", text: "We make a real sample. You check the fit, feel and print — and approve before bulk.", photo: "[PHOTO: hand holding the approved sample]" },
  { n: "03", title: "QC'd bulk production", text: "Cutting, printing and stitching in Mangalore & Tiruppur, with checks at every stage.", photo: "[PHOTO: stitching line, Tiruppur]" },
  { n: "04", title: "Packed & delivered", text: "Size-wise packing and tracked delivery anywhere in India — on the date we promised.", photo: "[PHOTO: labelled cartons ready to ship]" },
];

export const testimonials = [
  { name: "Naveen R Goshal", text: "Super quality cloth in affordable price.", stars: tbc(5) },
  { name: "Mahesh", text: "Good quality clothes, well maintained office, and I liked their service when customers walk into the office.", stars: tbc(5) },
  { name: "Sathwik Shetty", text: "Great quality jersey! The material feels premium, the print is sharp, and the fit is perfect. Really happy with the final product. Recommended!", stars: tbc(5) },
  { name: "Prajwal Pai", text: "Good quality fabrics and in time delivery.", stars: tbc(5) },
];

// Portfolio: until real order photos arrive these use the product visuals,
// each labelled with the photo D Creations should drop in.
export const portfolio = [
  { img: "marathon-jersey", cat: "marathon-tshirt", title: "Race-day jersey", slot: "[PHOTO: real marathon order, runners wearing it]" },
  { img: "school-set", cat: "school-uniform", title: "School PE set", slot: "[PHOTO: school uniform order, kids in a line-up]" },
  { img: "corporate-black", cat: "corporate-tshirt", title: "Corporate polo", slot: "[PHOTO: client team in their polos]" },
  { img: "sublimation-art", cat: "sublimation-tshirt", title: "All-over art tee", slot: "[PHOTO: sublimation jersey close-up]" },
  { img: "hoodie-varsity", cat: "hoodies-varsity", title: "Batch hoodie & varsity", slot: "[PHOTO: college batch jackets]" },
  { img: "trackpants-set", cat: "trackpants-shorts", title: "Training bottoms", slot: "[PHOTO: team kit flat-lay]" },
  { img: "gym-compression", cat: "gym-wears", title: "Compression top", slot: "[PHOTO: gym or cycling club order]" },
  { img: "marathon-galaxy", cat: "sublimation-tshirt", title: "Team jersey", slot: "[PHOTO: cricket/football team kit]" },
  { img: "school-polo", cat: "school-uniform", title: "Crest polo", slot: "[PHOTO: embroidered school crest close-up]" },
  { img: "corporate-white", cat: "corporate-tshirt", title: "Launch-day tee", slot: "[PHOTO: event crew tees]" },
];

// Client logos (with the client's permission). Leave empty to show the
// audience marquee only. e.g. { name: "XYZ School", file: "clients/xyz.svg" }
export const clientLogos = [];

export const faqs = [
  ["What's the minimum order quantity (MOQ)?", (v) => `Most products start from ${v.moq}. Sublimation tees start lower. Small runs are welcome — ask us on WhatsApp.`],
  ["How long does delivery take?", (v) => `Usually ${v.turnaround}, plus shipping time. Tell us your deadline first — we'll confirm before you commit.`],
  ["Do you make a sample first? Does it cost extra?", (v) => `Yes, every bulk order starts with a sample you approve. ${v.sampleCost}`],
  ["What are your payment terms?", (v) => `${v.payment}`],
  ["We don't have a design. Can you help?", () => "Yes. Send your logo, colours and an idea — our team makes a mock-up for free and revises it until you're happy."],
  ["Do you give bulk discounts?", () => "Yes. The per-piece price drops as quantity goes up. Share your quantity and we'll send slab-wise pricing."],
  ["Do you ship across India?", () => "Yes — we deliver pan-India by courier or transport, packed size-wise and labelled. Local pickup in Mangalore is also possible."],
  ["Can we re-order the same design later?", () => "Yes. We keep your fabric, colour and print specs on file, so re-orders match the first batch."],
];

export const faqValues = {
  moq: tbc("50 pieces"),
  turnaround: tbc("10–15 working days after sample approval"),
  sampleCost: tbc("Sample charges are adjusted against your bulk order."),
  payment: tbc("50% advance to start production, balance before dispatch. UPI, bank transfer and cards accepted; GST invoice provided."),
};

export const story = {
  // Shown in the Behind the Scenes section.
  photos: [
    "[PHOTO: fabric rolls stacked, Tiruppur warehouse]",
    "[PHOTO: cutting table with patterns]",
    "[VIDEO 10s: screen-printing squeegee pass]",
    "[PHOTO: tailor's hands at the sewing machine]",
    "[PHOTO: QC check under the lamp]",
    "[PHOTO: the Mangalore studio & team]",
  ],
};
