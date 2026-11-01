# Motion system

Motion works like material: panels drop, a knit panel pulls away, type rises out of a clipping line. Each pattern below has one job. Performance, accessibility and usability come before any of them.

## Tokens (`public/css/site.css`, `:root`)

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Entry: things arriving |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | Transitions: panels moving away |
| `--ease-draw` | `linear` | Rules and progress bars |
| `--t-micro` | 150 ms | Hover and focus feedback |
| `--t-std` | 320 ms | Menus, accordions, filters |
| `--t-sig` | 900 ms | Signature moments (entry beats, section reveals) |

No elastic or bouncy easing. Every animation uses transform and opacity only. Nothing animates `top`, `left`, `width`, `height` or `clip-path`.

## Patterns

| Pattern | Where | How |
|---|---|---|
| **Signature entry** | Homepage hero | CSS keyframes, set before first paint (see below) |
| **Text mask reveal** | Hero headline (3 lines); section titles (`data-split`) | Lines or words rise inside an `overflow: hidden` wrapper. Screen readers get the full title through `aria-label`, and the split words are `aria-hidden`. |
| **Strip weave** | Opening sequence only | Ten full-width bars, transform-only, alternating directions |
| **Image reveal** | Hero frame only | A graphite shutter (`::after`) slides off. The image is painted underneath from the first frame, so LCP is never delayed. |
| **Staggered entrance** | Hero copy, CTAs, meta | Three items 100 ms apart, so nobody waits on a long chain |
| **Scroll reveal** | `[data-reveal]` blocks | IntersectionObserver, fires once: 24 px rise plus fade over 700 ms. No scroll-jacking. |
| **Parallax depth** | Homepage category cards only | GSAP ScrollTrigger, ±5 %, desktop with a fine pointer only |
| **Pinned track** | Manufacturing process, ≥ 1000 px only | GSAP ScrollTrigger pin; `gsap.matchMedia` reverts it below 1000 px. On phones it's a plain stacked list. |
| **Hover / focus** | Nav, cards, buttons, swatches | 150–320 ms colour, underline or small zoom. Hover never hides essential content, and every target has a visible `:focus-visible` ring. |
| **Page transition** | None | Native navigation, so back/forward, open-in-new-tab and history behave normally |

## Signature entry (homepage)

An inline script in `<head>` (`src/layout.mjs`, `introBoot`) puts a class on `<html>` before the first paint:

| Class | When | What plays |
|---|---|---|
| `intro-play` | First homepage visit in this tab | The full sequence, about 2.1 s |
| `intro-short` | Repeat visit in the same tab (sessionStorage `dct:intro`) | About 0.7 s settle; no shutter or knit panel |
| `intro-lite` | Save-Data, ≤ 2 GB device memory or ≤ 2 CPU cores | Same as short |
| none (`rm`) | `prefers-reduced-motion: reduce` | Final state at once |
| none | JS disabled or storage blocked | Final state at once |

Timeline for `intro-play`, a full-screen title sequence on a fixed overlay (`.intro`, outside the hero so it sits above the header and mobile bar):

| Beat | Time | What happens |
|---|---|---|
| Thread | 0.15–0.8 s | Black frame. A lime thread draws across the middle under the kicker line. |
| Title cards | 0.8–1.94 s | FABRIC. → PRINT. → STITCH. → DISPATCH. cut in on the thread, 300 ms each (DISPATCH in lime) |
| Weave | 1.85–2.73 s | Ten fabric strips slide in from alternating sides (35 ms stagger) into a full-screen lime knit |
| Statement | 2.35–3.99 s | MADE TO ORDER. rises out of the fabric, holds, then lifts away |
| Pull | 3.47–4.45 s | Strips pull out the way they came, revealing the homepage. The overlay is hidden at 4.45 s. |
| Settle | 3.5–4.75 s | The header is uncovered as the strips leave (no fade, so it is never semi-transparent). Headline lines rise, rule draws, frame shutter + knit panel show the garment, copy and CTAs settle |

The repeat-visit, low-power and reduced-motion paths skip the overlay entirely.

How it stays safe:
- It's all CSS, so nothing waits on JavaScript, the hero image or fonts. A slow or failed image still finishes on time (tested).
- The page never locks scrolling. The overlay covers the page for up to 4.45 s, but one tap or key press removes it, so nav and contact are one interaction away.
- "Skip intro" is visible during the sequence. Any key, tap, wheel or touch-move also finishes it at once: `main.js` calls `finish()` on every hero animation through `document.getAnimations()`.
- The tests cover first visit, repeat visit, skip, key press, reduced motion, slow image, failed image and following a link mid-sequence (`tests/e2e.mjs`).

## Lifecycle rules
- GSAP and ScrollTrigger load only after `load` + idle, and only on desktop (≥ 1000 px, hover-capable, motion allowed). Phones never download them.
- All GSAP setup lives inside `gsap.matchMedia()`, which kills triggers and clears inline transforms when the media query stops matching.
- `ScrollTrigger.refresh()` runs after fonts load, after `load`, and after a gallery filter changes the layout.
- No smooth-scroll library is used (Lenis was removed in Nov 2026). Native scrolling only.
