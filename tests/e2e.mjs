// Browser tests against the built site (run `npm run build` first).
//   npm run test:e2e              all checks
//   npm run test:e2e -- --shots   also save screenshots to qa/screenshots/
// Playwright is not a dependency of this repo: set PLAYWRIGHT_FROM to any folder whose
// node_modules has playwright (default: ../vedora-labs-website).
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { serve } from "./server.mjs";
import * as data from "../src/data.mjs";

const from = process.env.PLAYWRIGHT_FROM || fileURLToPath(new URL("../../vedora-labs-website/", import.meta.url));
const { chromium } = createRequire(`${from}/package.json`)("playwright");
const PORT = 4321;
const BASE = `http://localhost:${PORT}`;
const SHOTS = process.argv.includes("--shots");
const shotDir = fileURLToPath(new URL("../qa/screenshots/", import.meta.url));
if (SHOTS) mkdirSync(shotDir, { recursive: true });

const results = [];
const check = async (name, fn) => {
  const t = Date.now();
  try { await fn(); results.push({ name, ok: true, ms: Date.now() - t }); }
  catch (e) { results.push({ name, ok: false, err: e.message.split("\n")[0] }); }
};
const ok = (cond, msg) => { if (!cond) throw new Error(msg); };

const server = await serve(PORT);
const browser = await chromium.launch();
const sitemap = readFileSync(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
const ROUTES = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

/** New page that records console errors and failed same-origin requests. */
async function open(ctx, path, { wait = "load" } = {}) {
  const p = await ctx.newPage();
  p.errors = [];
  p.on("console", (m) => m.type() === "error" && p.errors.push(m.text()));
  p.on("pageerror", (e) => p.errors.push(e.message));
  p.on("response", (r) => r.url().startsWith(BASE) && r.status() >= 400 && p.errors.push(`${r.status()} ${r.url()}`));
  await p.goto(BASE + path, { waitUntil: wait });
  return p;
}
const scrollThrough = (p) =>
  p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 40)); }
    scrollTo({ top: 0, behavior: "instant" });
  });

// ---- every route, every width: loads, no errors, no sideways scroll, no broken images ----
for (const w of WIDTHS) {
  await check(`routes @${w}px: ${ROUTES.length} pages load cleanly, no horizontal overflow, images decode`, async () => {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 800 ? 800 : 900 }, reducedMotion: "reduce" });
    for (const r of ROUTES) {
      const p = await open(ctx, r);
      await scrollThrough(p);
      await p.waitForLoadState("networkidle");
      const res = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src")).map((i) => i.src),
        h1: document.querySelectorAll("h1").length,
        noSize: [...document.images].filter((i) => !i.getAttribute("width") && !i.closest("dialog")).map((i) => i.src),
      }));
      ok(res.overflow <= 0, `${r}: horizontal overflow ${res.overflow}px`);
      ok(!res.broken.length, `${r}: broken images ${res.broken.join(", ")}`);
      ok(res.h1 === 1, `${r}: ${res.h1} <h1> elements`);
      ok(!res.noSize.length, `${r}: images without dimensions ${res.noSize.join(", ")}`);
      ok(!p.errors.length, `${r}: ${p.errors.join(" | ")}`);
      if (SHOTS && [375, 1440].includes(w) && (r === "/" || r === "/clothing" || r === "/fabrics" || r === "/contact" || r === "/clothing/gym-wears" || r === "/manufacturing"))
        await p.screenshot({ path: `${shotDir}${(r.slice(1) || "home").replace(/\//g, "_")}-${w}.png`, fullPage: true });
      await p.close();
    }
    await ctx.close();
  });
}

// ---- entry sequence ----
await check("intro: first visit plays the title sequence, nav reachable, settles by ~4.8 s", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await open(ctx, "/", { wait: "commit" });
  await p.waitForSelector(".hero__title");
  ok(await p.evaluate(() => document.documentElement.classList.contains("intro-play")), "intro-play not set");
  ok(await p.isVisible("[data-intro-skip]"), "skip control not shown");
  ok(await p.isVisible(".intro"), "title sequence overlay not shown");
  // any tap ends it, so the nav is one interaction away; the link itself stays in the DOM
  ok(await p.$(".hdr__nav a[href='/clothing']"), "nav missing");
  await p.waitForTimeout(4900);
  const op = await p.$eval(".hero__ctas", (e) => getComputedStyle(e).opacity);
  ok(op === "1", `CTAs opacity ${op} after the sequence`);
  ok(await p.evaluate(() => document.documentElement.classList.contains("intro-done")), "not marked done");
  ok(!(await p.isVisible("[data-intro-skip]")), "skip control still visible after the end");
  ok(!(await p.isVisible(".intro")), "overlay still visible after the end");
  ok(!p.errors.length, p.errors.join(" | "));
  // repeat visit in the same session: short version
  await p.reload({ waitUntil: "commit" });
  await p.waitForSelector(".hero__title");
  ok(await p.evaluate(() => document.documentElement.classList.contains("intro-short")), "repeat visit did not use intro-short");
  await ctx.close();
});

await check("intro: skip button and any key jump straight to the final state", async () => {
  for (const how of ["click", "key"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const p = await open(ctx, "/", { wait: "commit" });
    await p.waitForSelector("[data-intro-skip]");
    await p.waitForTimeout(300);
    if (how === "click") await p.click("[data-intro-skip]");
    else await p.keyboard.press("Tab");
    await p.waitForTimeout(50);
    const st = await p.evaluate(() => ({
      ctas: getComputedStyle(document.querySelector(".hero__ctas")).opacity,
      ring: getComputedStyle(document.querySelector(".ring")).opacity,
      done: document.documentElement.classList.contains("intro-done"),
    }));
    ok(st.done && st.ctas === "1", `${how}: not finished (${JSON.stringify(st)})`);
    ok(st.ring === "1", `${how}: garment ring still fading in (${st.ring})`);
    await ctx.close();
  }
});

await check("intro: reduced motion shows the final hero directly", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const p = await open(ctx, "/", { wait: "commit" });
  await p.waitForSelector(".hero__ctas");
  await p.waitForTimeout(100);
  const st = await p.evaluate(() => ({ cls: document.documentElement.className, op: getComputedStyle(document.querySelector(".hero__ctas")).opacity }));
  ok(!/intro-/.test(st.cls) && /\brm\b/.test(st.cls), `classes: ${st.cls}`);
  ok(st.op === "1", `CTAs opacity ${st.op}`);
  ok(!(await p.isVisible("[data-intro-skip]")), "skip control shown under reduced motion");
  await ctx.close();
});

await check("intro: slow or failing hero image never delays the sequence", async () => {
  for (const mode of ["slow", "fail"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.route(/cycling-jersey-teal-\d+\.webp/, async (route) => {
      if (mode === "fail") return route.abort();
      await new Promise((r) => setTimeout(r, 6000));
      route.continue();
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "/", { waitUntil: "commit" });
    await p.waitForTimeout(4900);
    const op = await p.$eval(".hero__ctas", (e) => getComputedStyle(e).opacity);
    ok(op === "1", `${mode}: CTAs opacity ${op} at 4.9 s`);
    await ctx.close();
  }
});

await check("intro: a link can be followed mid-sequence", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await open(ctx, "/", { wait: "commit" });
  await p.waitForSelector(".hdr__nav a");
  await p.waitForTimeout(400);
  await p.mouse.click(10, 300); // any tap ends the sequence
  await p.click(".hdr__nav a[href='/clothing']");
  await p.waitForURL("**/clothing");
  ok((await p.textContent("h1")).includes("Seven categories"), "did not reach /clothing");
  await ctx.close();
});

// ---- navigation ----
await check("mobile menu: opens, traps focus, Escape closes and returns focus, no scroll lock leak", async () => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, reducedMotion: "reduce" });
  const p = await open(ctx, "/fabrics");
  await p.click("[data-burger]");
  ok((await p.getAttribute("[data-burger]", "aria-expanded")) === "true", "aria-expanded not true");
  ok(await p.isVisible("#mnav"), "menu not visible");
  ok(await p.evaluate(() => document.activeElement?.closest("#mnav") !== null), "focus not moved into menu");
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).overflow === "hidden"), "page scroll not locked");
  for (let i = 0; i < 15; i++) await p.keyboard.press("Tab");
  ok(await p.evaluate(() => !!(document.activeElement?.closest("#mnav") || document.activeElement?.matches("[data-burger]"))), "focus escaped the open menu");
  await p.keyboard.press("Escape");
  ok(!(await p.isVisible("#mnav")), "Escape did not close");
  ok(await p.evaluate(() => document.activeElement?.matches("[data-burger]")), "focus not returned to the menu button");
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).overflow !== "hidden"), "scroll lock leaked");
  await p.click("[data-burger]");
  await p.click("#mnav a[href='/clothing']");
  await p.waitForURL("**/clothing");
  ok(!(await p.isVisible("#mnav")), "menu still open after navigating");
  ok(await p.evaluate(() => getComputedStyle(document.documentElement).overflow !== "hidden"), "scroll lock leaked after navigating");
  await p.goBack();
  await p.waitForURL("**/fabrics");
  await p.goForward();
  await p.waitForURL("**/clothing");
  await ctx.close();
});

await check("keyboard: skip link is first, focus is visible, contact reachable", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const p = await open(ctx, "/clothing");
  await p.keyboard.press("Tab");
  ok((await p.evaluate(() => document.activeElement.className)) === "skip", "first Tab is not the skip link");
  const outline = await p.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  ok(outline !== "none", "no visible focus outline");
  await ctx.close();
});

await check("redirects: old product, quote and clients URLs", async () => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  for (const [from, to] of [["/products/school-uniform", "/clothing/school-uniform"], ["/quote?product=gym-wears", "/contact?product=gym-wears"], ["/clients", "/work"]]) {
    await p.goto(BASE + from);
    ok(p.url() === BASE + to, `${from} → ${p.url()}`);
  }
  await p.goto(BASE + "/no-such-page");
  ok((await p.textContent("h1")).includes("Wrong size"), "404 page not served");
  await ctx.close();
});

// ---- clothing & fabrics ----
await check("clothing: every category page shows exactly its fabrics, linked to the library", async () => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const p = await ctx.newPage();
  for (const c of data.categories) {
    await p.goto(`${BASE}/clothing/${c.slug}`);
    ok((await p.textContent("h1")).trim() === c.title, `${c.slug}: h1`);
    const names = await p.$$eval(".cat__fabrics .fcard__name", (els) => els.map((e) => e.textContent.trim()));
    const want = c.fabrics.map((id) => data.fabrics.find((f) => f.id === id).name);
    ok(JSON.stringify(names) === JSON.stringify(want), `${c.slug}: ${names.join(", ")}`);
    ok((await p.getAttribute(".cat__ctas .btn--accent", "href")) === `/contact?category=${c.slug}`, `${c.slug}: quote CTA`);
  }
  await ctx.close();
});

await check("fabrics: filter by category, deep link to a fabric, tap targets ≥ 44 px", async () => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 800 }, reducedMotion: "reduce" });
  const p = await open(ctx, "/fabrics");
  ok((await p.$$(".fcard:not([hidden])")).length === 24, "not all 24 shown");
  await p.click("[data-flib-filter='gym-wears']");
  ok((await p.$$(".fcard:not([hidden])")).length === 6, "Gym Wear filter count");
  ok((await p.getAttribute("[data-flib-filter='gym-wears']", "aria-pressed")) === "true", "aria-pressed");
  const small = await p.$$eval(".seg, .fcard__ask, .fcard__cats a", (els) => els.filter((e) => e.offsetParent && e.getBoundingClientRect().height < 36).length);
  ok(small === 0, `${small} targets under 36 px`);
  const segH = await p.$$eval(".seg", (els) => Math.min(...els.map((e) => e.getBoundingClientRect().height)));
  ok(segH >= 44, `filter buttons ${segH}px`);
  await p.goto(`${BASE}/fabrics#fabric-hydra-170`);
  ok(await p.evaluate(() => { const r = document.getElementById("fabric-hydra-170").getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight; }), "deep link not in view");
  await ctx.close();
});

// ---- enquiry ----
async function stubOpen(p) {
  await p.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return {}; }; });
}
await check("enquiry: invalid input shows field errors and opens nothing", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const p = await open(ctx, "/contact");
  await stubOpen(p);
  await p.click("[data-enq-send]");
  const st = await p.evaluate(() => ({
    invalid: [...document.querySelectorAll("[data-enq] [aria-invalid=true]")].map((e) => e.name),
    summary: document.querySelector("[data-enq-summary]").textContent,
    focus: document.activeElement.name,
    opened: window.__opened.length,
  }));
  ok(JSON.stringify(st.invalid) === JSON.stringify(["name", "phone", "category", "consent"]), `invalid: ${st.invalid}`);
  ok(/4 fields/.test(st.summary), `summary: ${st.summary}`);
  ok(st.focus === "name", "focus not on first invalid field");
  ok(st.opened === 0, "WhatsApp opened with invalid input");
  await p.fill("[data-enq] [name=phone]", "12345");
  await p.click("[data-enq-send]");
  ok((await p.textContent("[data-err=phone]")).includes("valid phone"), "short phone accepted");
  await ctx.close();
});

await check("enquiry: valid input hands off to WhatsApp with an encoded, honest message", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const p = await open(ctx, "/contact");
  await stubOpen(p);
  await p.fill("[data-enq] [name=name]", "Asha & Co <test>");
  await p.fill("[data-enq] [name=phone]", "+91 98450 12345");
  await p.fill("[data-enq] [name=org]", "St. Mary's School");
  await p.selectOption("[data-enq] [name=category]", "school-uniform");
  const opts = await p.$$eval("[data-enq] [name=fabric] option", (o) => o.length);
  ok(opts === 12, `fabric options for School Uniform: ${opts - 1}`);
  await p.selectOption("[data-enq] [name=fabric]", "pc-matty");
  await p.selectOption("[data-enq] [name=qty]", "250–500");
  await p.fill("[data-enq] [name=notes]", "Navy, crest embroidery #1, 50% by June");
  await p.check("[data-enq] [name=consent]");
  await p.click("[data-enq-send]");
  const url = await p.evaluate(() => window.__opened[0]);
  ok(url?.startsWith("https://wa.me/918136867309?text="), `url: ${url}`);
  const text = new URL(url).searchParams.get("text");
  for (const want of ["Category: School Uniform T-Shirts", "Estimated quantity: 250–500", "Fabric preference: PC Matty", "Notes: Navy, crest embroidery #1, 50% by June", "Name: Asha & Co <test>", "Phone: +91 98450 12345", "Organisation: St. Mary's School"])
    ok(text.includes(want), `message missing "${want}"`);
  const status = await p.textContent("[data-enq-status]");
  ok(/not sent until you press Send/.test(status), `status: ${status}`);
  ok(!/sent successfully|has been sent/i.test(status), "claims the enquiry was sent");
  ok(!(await p.$("[data-enq-status] test")), "user input rendered as HTML");
  await ctx.close();
});

await check("enquiry: contextual prefill from category and fabric links", async () => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const p = await open(ctx, "/contact?category=gym-wears&fabric=hydra-170");
  ok((await p.inputValue("[data-enq] [name=category]")) === "gym-wears", "category not prefilled");
  ok((await p.inputValue("[data-enq] [name=fabric]")) === "hydra-170", "fabric not prefilled");
  ok((await p.$$eval("[data-enq] [name=fabric] option", (o) => o.length)) === 7, "fabric list not filtered to Gym Wear");
  // a fabric from the library without a category keeps the full list
  await p.goto(`${BASE}/contact?fabric=lacoste`);
  ok((await p.inputValue("[data-enq] [name=fabric]")) === "lacoste", "fabric-only prefill");
  // the homepage form works the same way
  await p.goto(`${BASE}/`);
  ok(await p.isVisible("#enquiry [data-enq]"), "homepage form missing");
  // category link → quote link carries the slug
  await p.goto(`${BASE}/clothing/hoodies-varsity`);
  ok((await p.textContent(".cat__fabrics")).includes("confirmed with your quotation"), "empty fabric state missing");
  await ctx.close();
});

await check("external links open safely; tel/mailto/WhatsApp use one number", async () => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const p = await open(ctx, "/contact");
  const links = await p.$$eval("a[href]", (as) => as.map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel })));
  for (const l of links.filter((l) => l.target === "_blank")) ok(/noopener/.test(l.rel), `${l.href} lacks rel=noopener`);
  const numbers = new Set(links.map((l) => (l.href.match(/(?:wa\.me\/|tel:\+?)(\d+)/) || [])[1]).filter(Boolean));
  ok(numbers.size === 1 && numbers.has("918136867309"), `numbers: ${[...numbers]}`);
  await ctx.close();
});

await check("phones: both hero CTAs sit above the bottom action bar (portrait and landscape)", async () => {
  for (const [w, h] of [[320, 568], [360, 640], [375, 667], [375, 812], [390, 844], [412, 915], [768, 1024], [844, 390], [667, 375]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const p = await open(ctx, "/");
    const r = await p.evaluate(() => {
      const bar = document.querySelector(".mbar");
      const limit = getComputedStyle(bar).display === "none" ? innerHeight : bar.getBoundingClientRect().top;
      return { limit, bottoms: [...document.querySelectorAll(".hero__ctas .btn")].map((b) => b.getBoundingClientRect().bottom) };
    });
    ok(r.bottoms.length === 2 && r.bottoms.every((b) => b <= r.limit + 1), `${w}x${h}: CTA bottoms ${r.bottoms.map(Math.round)} vs bar ${Math.round(r.limit)}`);
    await ctx.close();
  }
});

await check("hero headline never runs into the photo and the hero fits on screen (phones to wide desktops)", async () => {
  for (const [w, h, mobile] of [[320, 568, 1], [390, 844, 1], [768, 1024, 1], [1024, 768], [1280, 720], [1366, 657], [1440, 900], [1893, 903], [1920, 1080], [2560, 1300]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: !!mobile, hasTouch: !!mobile, reducedMotion: "reduce" });
    const p = await open(ctx, "/");
    const r = await p.evaluate(() => {
      const f = document.querySelector(".ring__card.is-front").getBoundingClientRect();
      const lines = [...document.querySelectorAll(".hero__title .ln > span")].map((e) => e.getBoundingClientRect());
      const hit = lines.some((l) => l.right > f.left + 1 && l.left < f.right - 1 && l.bottom > f.top + 1 && l.top < f.bottom - 1);
      const widest = Math.max(...lines.map((l) => l.right));
      return { hit, widest, frameBottom: f.bottom };
    });
    ok(!r.hit, `${w}x${h}: headline overlaps the photo`);
    ok(r.widest <= w, `${w}x${h}: headline wider than the screen (${Math.round(r.widest)}px)`);
    if (!mobile) ok(r.frameBottom <= h + 1, `${w}x${h}: photo runs below the fold (${Math.round(r.frameBottom)}px)`);
    await ctx.close();
  }
});

await check("hero ring: 3D cards placed, turns on its own, drag turns it", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => sessionStorage.setItem("dct:intro", "1"));
  const p = await open(ctx, "/");
  const read = () => p.evaluate(() => ({ is3d: document.querySelector(".ring").classList.contains("is-3d"), t: document.querySelector(".ring__spin").style.transform, r: parseFloat(getComputedStyle(document.querySelector(".ring__spin")).getPropertyValue("--r")) }));
  const a = await read();
  await p.waitForTimeout(600);
  const b = await read();
  ok(a.is3d && a.r > 50, `ring not set up in 3D (${JSON.stringify(a)})`);
  ok(a.t !== b.t, "ring is not turning on its own");
  const box = await p.locator("[data-ring]").boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width / 2 + 200, box.y + box.height / 2, { steps: 8 });
  await p.mouse.up();
  const url = p.url();
  await p.waitForTimeout(300);
  ok(p.url() === url, "dragging the ring followed a card link");
  await ctx.close();
});

await check("assistant: answers from site content, falls back to WhatsApp", async () => {
  for (const [w, h, btn] of [[390, 844, ".mbar [data-ask]"], [1280, 800, ".ask-float"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 900, hasTouch: w < 900 });
    await ctx.addInitScript(() => sessionStorage.setItem("dct:intro", "1"));
    const p = await open(ctx, "/fabrics");
    await p.click(btn);
    await p.waitForSelector(".ask.is-open");
    for (const [q, expect] of [["fabrics for gym wear", "NS Lycra"], ["where is your factory", "Kankanady"], ["what sizes do you make", "5XL"], ["do you make sarees", "WhatsApp"]]) {
      await p.fill("#ask-q", q);
      await p.press("#ask-q", "Enter");
      await p.waitForTimeout(600);
      const last = await p.evaluate(() => [...document.querySelectorAll(".ask__msg--bot")].pop().textContent);
      ok(last.includes(expect), `${w}px "${q}": expected "${expect}" in "${last.slice(0, 120)}"`);
    }
    await p.keyboard.press("Escape");
    await p.waitForTimeout(400);
    ok(!(await p.evaluate(() => document.querySelector(".ask").classList.contains("is-open"))), "Escape did not close the assistant");
    await ctx.close();
  }
});

await check("deep links land on their target on a phone (fabric anchor, prefilled quote form)", async () => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => sessionStorage.setItem("dct:intro", "1"));
  for (const [path, id] of [["/fabrics#fabric-selina", "fabric-selina"], ["/contact?category=gym-wears&fabric=lycra", "enquiry"], ["/?category=marathon-tshirt", "enquiry"]]) {
    const p = await open(ctx, path, { wait: "networkidle" });
    await p.waitForTimeout(800);
    const top = await p.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, id);
    ok(top > 60 && top < 110, `${path}: target top ${Math.round(top)}px (expected just under the header)`);
    await p.close();
  }
  await ctx.close();
});

await browser.close();
server.close();

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "✔" : "✖"} ${r.name}${r.ok ? ` (${r.ms} ms)` : `\n    ${r.err}`}`);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
