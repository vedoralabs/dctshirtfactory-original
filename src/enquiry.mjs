// The short enquiry form. There is no submission endpoint: the form composes a
// message on the visitor's device and hands it to WhatsApp, and says so plainly.
// public/js/main.js validates it, filters fabrics by category and opens WhatsApp.
import { site, categories, fabrics, waGreeting } from "./data.mjs";
import { esc, icon } from "./util.mjs";

export const QTY = ["Under 50", "50–100", "100–250", "250–500", "500–1,000", "1,000+"];

/** Fields from the brief: name, phone, organisation, category, quantity, fabric, notes. */
export function enquiryForm(id = "enq") {
  const f = (name) => `${id}-${name}`;
  const err = (name) => `<small class="field__err" id="${f(name)}-err" data-err="${name}"></small>`;
  return `
<form class="enq" id="${id}" data-enq novalidate>
  <div class="enq__grid">
    <div class="field">
      <label for="${f("name")}">Your name <span class="req">required</span></label>
      <input id="${f("name")}" name="name" autocomplete="name" required aria-describedby="${f("name")}-err">
      ${err("name")}
    </div>
    <div class="field">
      <label for="${f("phone")}">Phone / WhatsApp <span class="req">required</span></label>
      <input id="${f("phone")}" name="phone" type="tel" autocomplete="tel" inputmode="tel" required placeholder="+91" aria-describedby="${f("phone")}-hint ${f("phone")}-err">
      <small class="field__hint" id="${f("phone")}-hint">10-digit mobile number</small>
      ${err("phone")}
    </div>
    <div class="field field--wide">
      <label for="${f("org")}">Business / organisation <span class="opt-l">optional</span></label>
      <input id="${f("org")}" name="org" autocomplete="organization">
    </div>
    <div class="field">
      <label for="${f("category")}">Clothing category <span class="req">required</span></label>
      <select id="${f("category")}" name="category" required aria-describedby="${f("category")}-err">
        <option value="">Choose a category</option>
        ${categories.map((c) => `<option value="${c.slug}">${esc(c.title)}</option>`).join("")}
        <option value="mixed">A mix / not sure yet</option>
      </select>
      ${err("category")}
    </div>
    <div class="field">
      <label for="${f("qty")}">Estimated quantity <span class="opt-l">optional</span></label>
      <select id="${f("qty")}" name="qty">
        <option value="">Not sure yet</option>
        ${QTY.map((q) => `<option>${q}</option>`).join("")}
      </select>
    </div>
    <div class="field field--wide">
      <label for="${f("fabric")}">Fabric preference <span class="opt-l">optional</span></label>
      <select id="${f("fabric")}" name="fabric" data-enq-fabric aria-describedby="${f("fabric")}-hint">
        <option value="">No preference, please advise</option>
        ${fabrics.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join("")}
      </select>
      <small class="field__hint" id="${f("fabric")}-hint" data-enq-fabric-hint>Availability is confirmed with your quotation.</small>
    </div>
    <div class="field field--wide">
      <label for="${f("notes")}">Message / customisation notes <span class="opt-l">optional</span></label>
      <textarea id="${f("notes")}" name="notes" rows="4" placeholder="Design idea, print or embroidery, colours, sizes, required-by date"></textarea>
    </div>
    <label class="check field--wide"><input type="checkbox" name="consent" required aria-describedby="${f("consent")}-err"><span>D Creations may contact me about this enquiry. See the <a href="/privacy">privacy notice</a>.</span></label>
    ${err("consent")}
  </div>
  <div class="enq__foot">
    <button type="submit" class="btn btn--accent btn--lg" data-enq-send>${icon.whatsapp} <span data-enq-label>Continue on WhatsApp</span></button>
    <p class="enq__note">This opens WhatsApp with your message ready. <strong>Nothing is sent until you press Send there.</strong> You can edit it first.</p>
  </div>
  <p class="enq__summary" role="alert" data-enq-summary></p>
  <div class="enq__status" role="status" tabindex="-1" data-enq-status hidden></div>
</form>
<noscript>
  <form class="enq enq--basic" action="https://wa.me/${site.whatsapp}" method="get" target="_blank">
    <label class="field"><span>Edit the message, then continue in WhatsApp</span>
      <textarea name="text" rows="9">${esc(waGreeting)}
Category:
Quantity:
Fabric (optional):
Notes:
Name:
Please contact me to discuss the specifications.</textarea></label>
    <button type="submit" class="btn btn--accent">Continue on WhatsApp</button>
    <p class="field__hint">Or call <a href="tel:${site.phoneHref}">${site.phoneDisplay}</a>.</p>
  </form>
</noscript>`;
}

/** What the browser script needs to filter fabrics and build the message. */
export const enquiryData = () => ({
  wa: site.whatsapp,
  greeting: waGreeting,
  phone: { href: site.phoneHref, display: site.phoneDisplay },
  categories: categories.map((c) => ({ slug: c.slug, title: c.title, fabrics: c.fabrics })),
  fabrics: fabrics.map((x) => ({ id: x.id, name: x.name })),
});
