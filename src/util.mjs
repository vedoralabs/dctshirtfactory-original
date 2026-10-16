import { readFileSync } from "node:fs";
import { site, waGreeting } from "./data.mjs";

const manifest = JSON.parse(
  readFileSync(new URL("../public/img/manifest.json", import.meta.url), "utf8")
);

export const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** WhatsApp deep link. Messages never contain prices or estimates. */
export const waLink = (text = `${waGreeting} Please contact me to discuss my requirement.`) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

/** The owner's quotation template (brief §7.2), with known fields filled in. */
export const quoteMessage = ({ product = "", fabric = "" } = {}) =>
  [
    waGreeting,
    product && `Product: ${product}.`,
    fabric && `Fabric: ${fabric}.`,
    "Quantity: ",
    "Delivery city: ",
    "Required by: ",
    "Please contact me to discuss the specifications.",
  ]
    .filter(Boolean)
    .join("\n");

/**
 * Responsive <img>. `base` is a name from public/img (e.g. "school-set").
 * Uses manifest sizes for width/height so nothing shifts while loading.
 */
export function img(base, alt, { sizes = "(min-width: 900px) 50vw, 100vw", eager = false, cls = "", widths } = {}) {
  const files = Object.keys(manifest)
    .filter((f) => f.startsWith(`${base}-`) && f.endsWith(".webp") && /-\d+\.webp$/.test(f))
    .filter((f) => f.slice(base.length + 1).match(/^\d+\.webp$/))
    .sort((a, b) => manifest[a][0] - manifest[b][0]);
  if (!files.length) throw new Error(`No images for "${base}"`);
  const use = widths ? files.filter((f) => widths.includes(Number(f.match(/-(\d+)\.webp$/)[1]))) : files;
  const largest = use[use.length - 1];
  const [w, h] = manifest[largest];
  const srcset = use.map((f) => `/img/${f} ${manifest[f][0]}w`).join(", ");
  return `<img src="/img/${largest}" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export const imgSize = (file) => manifest[file];

const I = (d, extra = "") =>
  `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"${extra}>${d}</svg>`;
const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';

export const icon = {
  whatsapp: I('<path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 14.96L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.89.9-3-.2-.31a8.2 8.2 0 1 1 6.88 3.75Zm4.5-6.14c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.96-.15.17-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22a7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.3c-.22.25-.86.85-.86 2.07 0 1.21.88 2.39 1 2.55.13.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.4.52.6.19 1.13.16 1.56.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z"/>'),
  phone: I(`<path ${S} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>`),
  mail: I(`<rect ${S} x="3" y="5" width="18" height="14" rx="2"/><path ${S} d="m3 7 9 6 9-6"/>`),
  pin: I(`<path ${S} d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle ${S} cx="12" cy="9.5" r="2.5"/>`),
  clock: I(`<circle ${S} cx="12" cy="12" r="9"/><path ${S} d="M12 7v5l3 2"/>`),
  instagram: I(`<rect ${S} x="3" y="3" width="18" height="18" rx="5"/><circle ${S} cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>`),
  arrow: I(`<path ${S} d="M5 12h14M13 6l6 6-6 6"/>`),
  arrowL: I(`<path ${S} d="M19 12H5M11 6l-6 6 6 6"/>`),
  check: I(`<path ${S} d="M20 6 9 17l-5-5"/>`),
  sample: I(`<path ${S} d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3c-.5 1.7-2 3-4 3S8.5 4.7 8 3Z"/><path ${S} d="m10 14 1.5 1.5L14.5 12"/>`),
  factory: I(`<path ${S} d="M3 21V10l5 3V10l5 3V10l5 3V4h3v17Z"/><path ${S} d="M7 17h2M12 17h2"/>`),
  fabric: I(`<path ${S} d="M4 6c2-2 4 2 6 0s4 2 6 0 4 2 4 0v12c0 2-2-2-4 0s-4-2-6 0-4-2-6 0-2 0-2 0Z"/>`),
  clockFast: I(`<circle ${S} cx="13" cy="13" r="8"/><path ${S} d="M13 9v4l2.5 1.5M2 9h3M2 13h2M3 17h2"/>`),
  pen: I(`<path ${S} d="M4 20h4L19 9l-4-4L4 16Z"/><path ${S} d="m13 7 4 4"/>`),
  star: I('<path fill="currentColor" d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9Z"/>'),
  close: I(`<path ${S} d="M6 6l12 12M18 6 6 18"/>`),
  plus: I(`<path ${S} d="M12 5v14M5 12h14"/>`),
  google: I('<path fill="#EA4335" d="M12 10.2v3.9h5.4c-.24 1.4-1.66 4.1-5.4 4.1a6.2 6.2 0 0 1 0-12.4c1.9 0 3.2.8 3.9 1.5l2.7-2.6A9.6 9.6 0 0 0 12 2.2a9.8 9.8 0 1 0 0 19.6c5.6 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6Z"/>'),
  shield: I(`<path ${S} d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6Z"/><path ${S} d="m9 12 2 2 4-4"/>`),
  truck: I(`<path ${S} d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle ${S} cx="7" cy="17.5" r="1.8"/><circle ${S} cx="17" cy="17.5" r="1.8"/>`),
  grid: I(`<rect ${S} x="3" y="3" width="7" height="7" rx="1"/><rect ${S} x="14" y="3" width="7" height="7" rx="1"/><rect ${S} x="3" y="14" width="7" height="7" rx="1"/><rect ${S} x="14" y="14" width="7" height="7" rx="1"/>`),
};

// Audience icons (simple line drawings)
export const audienceIcon = {
  schools: I(`<path ${S} d="M2 9 12 4l10 5-10 5Z"/><path ${S} d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>`),
  corporates: I(`<rect ${S} x="3" y="7" width="18" height="13" rx="2"/><path ${S} d="M9 7V4h6v3M3 12h18"/>`),
  sports: I(`<circle ${S} cx="14" cy="4.5" r="1.8"/><path ${S} d="m8 21 3-6 3 2v5M6 11l3-3h4l2 4 3 1M11 15l-1-4"/>`),
  gyms: I(`<path ${S} d="M2 12h20M5 8v8M8 6v12M16 6v12M19 8v8"/>`),
  colleges: I(`<path ${S} d="M4 20V9l8-5 8 5v11M9 20v-6h6v6M2 20h20"/>`),
  events: I(`<path ${S} d="M4 20 9 6l9 9Z"/><path ${S} d="M14 4c1 1 1 2 0 3M18 8c1-1 2-1 3 0M16 3v1M21 5h-1"/>`),
};
