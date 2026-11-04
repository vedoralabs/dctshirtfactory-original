/* D Creations: on-site assistant. Loaded by main.js on the first tap of an "Ask" button.
   Answers come only from /assistant.json, built from the same data as the pages
   (src/assistant.mjs). Matching is keyword scoring: no AI service, nothing leaves the
   browser. Anything it can't match goes to WhatsApp with the question filled in. */

const STOP = new Set("a an the is are am be do does did can could would will you your yours we our us i me my to of for in on at and or with about any have has what which who how please tell know want need get there it this that these those make made".split(" "));
// visitor words -> words the knowledge base uses
const SYN = {
  tee: "tshirt", tees: "tshirt", tshirts: "tshirt", shirt: "tshirt", shirts: "tshirt", jersey: "tshirt", jerseys: "tshirt",
  hoodies: "hoodie", jacket: "varsity", jackets: "varsity", pant: "track", pants: "track", trackpants: "track", joggers: "track", short: "shorts",
  gym: "gym", fitness: "gym", workout: "gym", training: "gym", cycling: "gym", sports: "sport", sportswear: "sport",
  uniform: "school", uniforms: "school", students: "school", office: "corporate", company: "corporate", staff: "corporate",
  run: "marathon", running: "marathon", race: "marathon", runners: "marathon", walkathon: "marathon",
  price: "quote", prices: "quote", pricing: "quote", cost: "quote", costs: "quote", rate: "quote", rates: "quote", charges: "quote", charge: "quote", much: "quote", quotation: "quote", estimate: "quote",
  located: "location", where: "location", address: "location", visit: "location", map: "location", directions: "location", mangaluru: "mangalore", tirupur: "tiruppur",
  phone: "contact", number: "contact", call: "contact", mobile: "contact", email: "contact", mail: "contact", reach: "contact",
  long: "time", days: "time", weeks: "time", delivery: "time", turnaround: "time", deadline: "time", fast: "time",
  minimum: "small", moq: "small", few: "small", quantity: "small", pieces: "small", bulk: "small", order: "order", orders: "order",
  shipping: "ship", courier: "ship", deliver: "ship", dispatch: "ship", india: "ship",
  printing: "print", printed: "print", logo: "print", logos: "print", branding: "print", embroidered: "embroidery", dtf: "dtf",
  sample: "sample", samples: "sample", trial: "sample", design: "design", artwork: "design", designer: "design",
  size: "sizes", sized: "sizes", xl: "sizes", xxl: "sizes", "5xl": "sizes", kids: "sizes",
  fabrics: "fabric", material: "fabric", materials: "fabric", cloth: "fabric", knit: "fabric",
  timing: "hours", timings: "hours", open: "hours", opening: "hours",
  past: "work", previous: "work", portfolio: "work", clients: "work", client: "work", examples: "work", done: "work",
  hi: "hello", hey: "hello", hii: "hello", namaste: "hello",
};
const tokens = (s) =>
  s.toLowerCase().replace(/t-shirts?/g, "tshirt").replace(/[^a-z0-9]+/g, " ").split(" ")
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => SYN[w] || (w.length > 4 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w));

let kb, docs, idf, ui;

async function load() {
  if (kb) return;
  kb = await (await fetch("/assistant.json")).json();
  docs = kb.entries.map((e) => ({ e, t: new Set(tokens(e.t)), k: new Set(tokens(`${e.k} ${e.a}`)) }));
  const df = {};
  docs.forEach((d) => new Set([...d.t, ...d.k]).forEach((w) => (df[w] = (df[w] || 0) + 1)));
  idf = (w) => Math.log(1 + docs.length / (df[w] || docs.length));
}

function answer(q) {
  const qt = [...new Set(tokens(q))];
  // "what do you make / offer / sell?" is all small words: answer it with the product list
  if ((!qt.length || qt.every((w) => /^(offer|sell|product|products|manufacture|produce|item|items)$/.test(w))) && /\b(make|made|offer|sell|products?|manufacture|produce)\b/i.test(q))
    return kb.entries.find((e) => e.t === "What can you make?");
  if (!qt.length) return null;
  if (qt.every((w) => w === "hello")) return { a: kb.hello, l: [] };
  if (qt.some((w) => /^(thanks?|thank|thx|ok|okay)$/.test(w)) && qt.length <= 2) return { a: "You're welcome! Anything else?", l: [] };
  let best = null, bestScore = 0;
  for (const d of docs) {
    let s = 0;
    for (const w of qt) s += d.t.has(w) ? 2.2 * idf(w) : d.k.has(w) ? idf(w) : 0;
    // all of a short title named in the question ("ns lycra", "mirror 200") wins outright
    if (d.t.size && [...d.t].every((w) => qt.includes(w) || w === "fabric")) s += 4;
    if (s > bestScore) { bestScore = s; best = d.e; }
  }
  return bestScore >= 1.6 ? best : null;
}

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const escH = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function say(who, text, links = []) {
  const m = el("div", `ask__msg ask__msg--${who}`);
  m.append(el("p", "", escH(text)));
  if (links.length) {
    const row = el("div", "ask__links");
    links.forEach(([label, href]) => {
      const a = el("a", "ask__link", `${escH(label)} <span aria-hidden="true">→</span>`);
      a.href = href;
      if (/^https?:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
      row.append(a);
    });
    m.append(row);
  }
  ui.log.append(m);
  ui.log.scrollTop = ui.log.scrollHeight;
}

function ask(q) {
  q = q.trim().slice(0, 300);
  if (!q) return;
  say("me", q);
  const typing = el("div", "ask__msg ask__msg--bot ask__typing", "<span></span><span></span><span></span>");
  ui.log.append(typing);
  ui.log.scrollTop = ui.log.scrollHeight;
  setTimeout(() => {
    typing.remove();
    const hit = answer(q);
    if (hit) say("bot", hit.a, hit.l);
    else say("bot", kb.fallback, [["Ask on WhatsApp", `${kb.wa}?text=${encodeURIComponent(`Hello D Creations, ${q}`)}`]]);
  }, 380);
}

function build() {
  const box = el("div", "ask");
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "false");
  box.setAttribute("aria-labelledby", "ask-title");
  box.hidden = true;
  box.innerHTML = `
    <div class="ask__head">
      <div><p class="ask__title" id="ask-title">Ask D Creations</p><p class="ask__sub">Instant answers from this website</p></div>
      <button type="button" class="ask__close" aria-label="Close">×</button>
    </div>
    <div class="ask__log" role="log" aria-live="polite"></div>
    <div class="ask__chips"></div>
    <form class="ask__form">
      <label class="sr-only" for="ask-q">Your question</label>
      <input id="ask-q" name="q" type="text" autocomplete="off" maxlength="300" placeholder="Ask about fabrics, sizes, orders…" required>
      <button type="submit" class="ask__send" aria-label="Send">→</button>
    </form>`;
  document.body.append(box);
  ui = { box, log: box.querySelector(".ask__log"), input: box.querySelector("input"), chips: box.querySelector(".ask__chips") };
  kb.suggestions.forEach((s) => {
    const b = el("button", "ask__chip", escH(s));
    b.type = "button";
    b.addEventListener("click", () => ask(s));
    ui.chips.append(b);
  });
  box.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    ask(ui.input.value);
    ui.input.value = "";
  });
  box.querySelector(".ask__close").addEventListener("click", close);
  box.addEventListener("keydown", (e) => e.key === "Escape" && close());
  say("bot", kb.hello);
}

let opener = null;
function close() {
  ui.box.classList.remove("is-open");
  document.documentElement.classList.remove("is-asking");
  setTimeout(() => { if (!ui.box.classList.contains("is-open")) ui.box.hidden = true; }, 300);
  opener?.focus();
}

export async function open(from) {
  opener = from || null;
  await load();
  if (!ui) build();
  ui.box.hidden = false;
  requestAnimationFrame(() => ui.box.classList.add("is-open"));
  document.documentElement.classList.add("is-asking");
  // phones: don't pop the keyboard over the suggestions
  if (matchMedia("(hover: hover)").matches) ui.input.focus({ preventScroll: true });
  else ui.box.querySelector(".ask__close").focus({ preventScroll: true });
}

export function toggle(from) {
  if (ui && !ui.box.hidden && ui.box.classList.contains("is-open")) close();
  else open(from);
}

// for tests
export { answer, load };
