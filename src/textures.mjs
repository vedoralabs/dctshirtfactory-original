// Illustrative fabric textures drawn as SVG, used in the Fabric Guide until
// real macro photos of each fabric are supplied (see SHOT-LIST.md).
// Each returns a complete <svg> string filled with the fabric's tint.

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  );
  return `rgb(${c.join(",")})`;
};

const wrap = (id, tint, size, body, extra = "") => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="${id}" width="${size[0]}" height="${size[1]}" patternUnits="userSpaceOnUse">${body}</pattern>
    <radialGradient id="${id}-light" cx="30%" cy="25%" r="85%">
      <stop offset="0" stop-color="#fff" stop-opacity=".22"/>
      <stop offset=".6" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity=".45"/>
    </radialGradient>
    <filter id="${id}-grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0"/></filter>
  </defs>
  <rect width="400" height="400" fill="${tint}"/>
  ${extra}
  <rect width="400" height="400" fill="url(#${id})"/>
  <rect width="400" height="400" filter="url(#${id}-grain)" opacity=".5"/>
  <rect width="400" height="400" fill="url(#${id}-light)"/>
</svg>`;

const patterns = {
  pique: (id, t) =>
    wrap(id, t, [12, 12], `
      <path d="M6 0 L12 6 L6 12 L0 6Z" fill="${shade(t, 0.06)}"/>
      <path d="M6 2.5 L9.5 6 L6 9.5 L2.5 6Z" fill="${shade(t, -0.08)}"/>`),
  honeycomb: (id, t) =>
    wrap(id, t, [14, 24.25], `
      <path d="M7 0 L14 4 L14 12.1 L7 16.1 L0 12.1 L0 4Z M7 16.1 L7 24.25 M0 4 L0 0 M14 4 L14 0" fill="none" stroke="${shade(t, -0.12)}" stroke-width="1.6"/>
      <path d="M7 3 L11 5.5 L11 10.5 L7 13 L3 10.5 L3 5.5Z" fill="${shade(t, 0.05)}"/>`),
  honeycombSoft: (id, t) =>
    wrap(id, t, [16, 27.7], `
      <path d="M8 0 L16 4.6 L16 13.9 L8 18.5 L0 13.9 L0 4.6Z M8 18.5 L8 27.7" fill="none" stroke="${shade(t, -0.08)}" stroke-width="2.4" stroke-linejoin="round" opacity=".7"/>`),
  smooth: (id, t) =>
    wrap(id, t, [4, 4], `<path d="M0 2 H4" stroke="${shade(t, 0.04)}" stroke-width=".8"/>`),
  sheen: (id, t) =>
    wrap(id, t, [3, 3], `<path d="M0 1.5 H3" stroke="${shade(t, -0.05)}" stroke-width=".7"/>`,
      `<linearGradient id="${id}-s" x1="0" y1="0" x2="1" y2="1"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity=".05"/><stop offset=".72" stop-color="#fff" stop-opacity=".2"/><stop offset=".9" stop-color="#fff" stop-opacity="0"/></linearGradient><rect width="400" height="400" fill="url(#${id}-s)"/>`),
  rib: (id, t) =>
    wrap(id, t, [6, 6], `
      <rect width="3" height="6" fill="${shade(t, 0.05)}"/>
      <rect x="3" width="3" height="6" fill="${shade(t, -0.05)}"/>`),
  fleece: (id, t) =>
    wrap(id, t, [400, 400], "",
      `<filter id="${id}-f"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="4" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 -.1"/></filter><rect width="400" height="400" filter="url(#${id}-f)" opacity=".45"/>`),
  matte: (id, t) =>
    wrap(id, t, [400, 400], "",
      `<filter id="${id}-m"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .4 0"/></filter><rect width="400" height="400" filter="url(#${id}-m)" opacity=".35"/>`),
  dots: (id, t) =>
    wrap(id, t, [8, 8], `
      <circle cx="2" cy="2" r="1.3" fill="${shade(t, -0.14)}"/>
      <circle cx="6" cy="6" r="1.3" fill="${shade(t, -0.14)}"/>`),
  holes: (id, t) =>
    wrap(id, t, [11, 11], `
      <rect width="11" height="11" fill="${shade(t, 0.04)}"/>
      <circle cx="5.5" cy="5.5" r="2.4" fill="${shade(t, -0.25)}"/>`),
  basket: (id, t) =>
    wrap(id, t, [16, 16], `
      <rect width="8" height="8" fill="${shade(t, 0.05)}"/>
      <path d="M0 2.7 H8 M0 5.4 H8" stroke="${shade(t, -0.06)}" stroke-width="1"/>
      <rect x="8" y="8" width="8" height="8" fill="${shade(t, 0.05)}"/>
      <path d="M10.7 8 V16 M13.4 8 V16" stroke="${shade(t, -0.06)}" stroke-width="1"/>
      <path d="M8 0 V8 H16 M0 8 H8 V16" fill="none" stroke="${shade(t, -0.1)}" stroke-width="1"/>`),
};

export function fabricTexture(fabric) {
  const fn = patterns[fabric.texture] ?? patterns.smooth;
  return fn(`tx-${fabric.key}`, fabric.tint).trim();
}
