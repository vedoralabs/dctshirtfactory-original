// Knowledge base for the on-site assistant (public/js/assistant.js), written to
// dist/assistant.json at build time. Every answer is assembled from the same data the
// pages show, so the assistant can't say anything the site doesn't already say.
// Matching is plain keyword scoring in the browser: no AI service, no key, no cost.
import {
  site, categories, fabrics, faqs, printMethods, steps, benefits, sizes, addresses, fabricCategories,
} from "./data.mjs";
import { shownClients } from "./home.mjs";
import { waLink } from "./util.mjs";

const list = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}` : xs[0] || "");
const fabricName = Object.fromEntries(fabrics.map((f) => [f.id, f.name]));
const quote = ["Request a quote", "/contact"];

export function assistantKB() {
  const entries = [];
  // t: title (weighted), k: extra keywords, a: answer, l: links [label, href]
  const add = (t, k, a, l = [quote]) => entries.push({ t, k, a, l });

  faqs.forEach(([q, a]) => add(q, "", a, [quote, ["All questions", "/faq"]]));

  categories.forEach((c) => {
    const fab = c.fabrics.map((id) => fabricName[id]);
    const methods = c.branding.map((k) => printMethods.find((m) => m.key === k)?.name).filter(Boolean);
    add(
      c.title,
      [c.name, c.teaser, c.useCases.join(" "), c.audience.join(" "), fab.join(" "), "fabric fabrics material"].join(" "),
      `${c.pitch} ${fab.length ? `Fabrics listed: ${list(fab)}.` : "Fabrics are confirmed with your quotation."} ${
        methods.length ? `Customisation: ${list(methods)}.` : ""
      } Sizes: ${sizes}.`,
      [[`View ${c.title}`, `/clothing/${c.slug}`], ["Get a quote for this", `/contact?category=${c.slug}`]]
    );
  });

  fabrics.forEach((f) => {
    const cats = fabricCategories(f.id);
    add(
      `${f.name} fabric`,
      "fabric material cloth knit",
      `${f.name} is listed for ${list(cats.map((c) => c.title))}. Availability, colours and specifications are confirmed with your quotation.`,
      [[`${f.name} in the fabric library`, `/fabrics#fabric-${f.id}`], [`Ask about ${f.name}`, `/contact?fabric=${f.id}${cats[0] ? `&category=${cats[0].slug}` : ""}`]]
    );
  });

  add(
    "All fabrics",
    "fabric fabrics material cloth knit list options types range which",
    `There are ${fabrics.length} fabrics in the library: ${list(fabrics.map((f) => f.name))}. Each category page lists the ones used for it.`,
    [["Open the fabric library", "/fabrics"]]
  );
  add(
    "Customisation and printing",
    `print printing logo branding brand customise custom ${printMethods.map((m) => m.name).join(" ")} patch patches name names`,
    `Options include ${list(printMethods.map((m) => `${m.name.toLowerCase()} (${m.note.replace(/\.$/, "").toLowerCase()})`))}, depending on the garment and fabric.`,
    [["Manufacturing", "/manufacturing"], quote]
  );
  add(
    "How an order works",
    "process steps order start begin procedure workflow how work",
    steps.map((s) => `${Number(s.n)}. ${s.title}: ${s.text}`).join(" "),
    [["Manufacturing", "/manufacturing"], quote]
  );
  add(
    "Contact details",
    "contact phone number call mobile whatsapp email mail instagram reach talk message",
    `WhatsApp or call ${site.phoneDisplay}. Email ${site.email}. Instagram ${site.instagramHandle}.`,
    [["WhatsApp us", waLink()], ["Call", `tel:${site.phoneHref}`], ["Contact page", "/contact"]]
  );
  add(
    "Location and address",
    "where location located address office factory unit units visit map directions mangalore mangaluru tiruppur tirupur karnataka tamil nadu",
    addresses.map((a) => `${a.city}: ${a.name}, ${a.lines.join(", ")}.`).join(" "),
    [["Open in Google Maps", site.mapsUrl], ["About us", "/about"]]
  );
  add(
    "Price and quotation",
    "price prices pricing cost costs rate rates charge charges much budget estimate quote quotation",
    "Every order is quoted for its exact specification: product, fabric, quantity and customisation. Share those on the enquiry form or WhatsApp and the owner will reply with a quotation.",
    [quote, ["WhatsApp us", waLink()]]
  );
  add(
    "Opening hours",
    "hours timing timings open opening close closing time today sunday visit",
    "Opening hours aren't listed on the site yet. Message on WhatsApp before you visit.",
    [["WhatsApp us", waLink()]]
  );
  add(
    `About ${site.name}`,
    `about who company business ${site.altName} dct d creations factory manufacturer`,
    `${site.name} (${site.altName}) manufactures custom apparel from two units, in ${site.locations}: ${list(categories.map((c) => c.title.toLowerCase()))}.`,
    [["About us", "/about"]]
  );
  add(
    "Why choose us",
    "why choose quality benefit benefits good trust reliable",
    benefits.map((b) => `${b.title}: ${b.text}`).join(" "),
    [["About us", "/about"]]
  );
  const ok = shownClients();
  add(
    "Past work and clients",
    "clients client work past previous portfolio done before event events college marathon walkathon example examples orders",
    `Recent work includes ${list(ok.map((c) => c.name))}.`,
    [["See our work", "/work"]]
  );

  return {
    entries,
    hello: `Hi! Ask me about our clothing, fabrics, customisation, ordering or where we are. Answers come from this website.`,
    suggestions: ["What can you make?", "Fabrics for gym wear", "Do you take small orders?", "Where are you located?", "How do I get a quote?"],
    fallback: "I couldn't find that on the website. The owner can answer it directly on WhatsApp.",
    wa: `https://wa.me/${site.whatsapp}`,
  };
}
