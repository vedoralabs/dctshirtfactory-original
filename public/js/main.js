/* D Creations: site interactions. No dependencies. GSAP + ScrollTrigger are loaded
   lazily after first paint for the desktop scroll layer only (pinned process track,
   subtle parallax). The homepage entry is pure CSS (site.css "Signature entry"). */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Home: the floating Ask/WhatsApp buttons wait until the hero (which has its own CTAs) scrolls away.
  const heroEl = $("[data-hero]");
  if (heroEl) root.classList.add("hero-on");
  if (heroEl) new IntersectionObserver(([e]) => root.classList.toggle("hero-on", e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] }).observe(heroEl);
  const data = (() => { try { return JSON.parse($("#site-data")?.textContent || "{}"); } catch { return {}; } })();

  /* ---------- year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- entry sequence: skip / finish on any intent ---------- */
  // The sequence never blocks anything; this only lets visitors jump to the end state.
  if (root.classList.contains("intro-play")) {
    const hero = $("[data-hero]");
    const intro = $("[data-intro]");
    const hdr = $("[data-hdr]");
    const finish = (e) => {
      if (root.classList.contains("intro-done")) return;
      // The overlay disappears on this tap, so the click that follows must not land on
      // whatever (still hidden) link now sits under the finger.
      if (e?.type === "pointerdown" && !e.target.closest?.("[data-intro-skip]")) {
        const swallow = (c) => { c.preventDefault(); c.stopPropagation(); };
        addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => removeEventListener("click", swallow, true), 600);
      }
      root.classList.add("intro-done");
      document.getAnimations?.().forEach((a) => {
        const t = a.effect?.target;
        // (endless ones, like the garment ring's turn, can't be finished)
        if (t && (hero?.contains(t) || intro?.contains(t) || t === hdr) && a.effect.getTiming().iterations !== Infinity) a.finish();
      });
      dispatchEvent(new Event("intro:done"));
      off();
    };
    const events = ["keydown", "pointerdown", "wheel", "touchmove"];
    const off = () => events.forEach((e) => removeEventListener(e, finish, true));
    events.forEach((e) => addEventListener(e, finish, { capture: true, passive: true }));
    $("[data-intro-skip]")?.addEventListener("click", () => finish());
    // Done naturally: release the listeners.
    setTimeout(() => { root.classList.add("intro-done"); off(); }, 4800);
  }

  /* ---------- header: solid on scroll ---------- */
  const hdr = $("[data-hdr]");
  const hasHero = !!$(".hero");
  const onScroll = () => hdr?.classList.toggle("is-solid", !hasHero || scrollY > 40);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile menu: focus trap, Escape, no scroll leak ---------- */
  const burger = $("[data-burger]");
  const mnav = $("[data-mnav]");
  const setMenu = (open, restoreFocus = true) => {
    if (!burger || !mnav) return;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mnav.hidden = !open;
    root.classList.toggle("is-menu-open", open);
    hdr?.classList.toggle("is-solid", open || !hasHero || scrollY > 40);
    if (open) $("a", mnav)?.focus();
    else if (restoreFocus) burger.focus();
  };
  burger?.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  mnav?.addEventListener("click", (e) => e.target.closest("a") && setMenu(false, false));
  addEventListener("keydown", (e) => {
    if (!mnav || mnav.hidden) return;
    if (e.key === "Escape") return setMenu(false);
    if (e.key !== "Tab") return;
    // keep focus inside the open menu (burger + menu links)
    const items = [burger, ...$$("a", mnav)];
    const i = items.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
    else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
  });
  // closing on resize to desktop avoids a stuck scroll lock
  matchMedia("(min-width: 1100px)").addEventListener?.("change", (m) => m.matches && !mnav?.hidden && setMenu(false, false));
  // back/forward cache restore: never come back with the menu open
  addEventListener("pageshow", (e) => e.persisted && !mnav?.hidden && setMenu(false, false));

  /* ---------- deep links land exactly ---------- */
  // Web fonts and the phone-only content-visibility placeholders change heights after the
  // first jump, which left /fabrics#fabric-… and prefilled quote links short of their target.
  // Lay the page out fully, jump, then jump again once fonts and images settle, unless
  // the visitor has started scrolling by then.
  let reland = null; // the desktop scroll layer calls this after its pin spacer shifts the page
  function landOn(el) {
    if (!el) return;
    root.classList.add("cv-off");
    const go = () => el.scrollIntoView({ block: "start", behavior: "instant" });
    let touched = false;
    const stop = () => (touched = true);
    ["wheel", "touchstart", "keydown"].forEach((e) => addEventListener(e, stop, { once: true, passive: true }));
    requestAnimationFrame(go);
    const loaded = document.readyState === "complete" ? null : new Promise((r) => addEventListener("load", r, { once: true }));
    reland = () => requestAnimationFrame(() => !touched && go());
    Promise.all([document.fonts?.ready, loaded]).then(reland);
  }
  if (location.hash.length > 1) {
    let target = null;
    try { target = $(location.hash); } catch {}
    if (target && target.id !== "main") landOn(target);
  }

  /* ---------- hero: 3D garment ring ---------- */
  // The turn is a CSS animation (runs off the main thread). JS only sizes the ring, names
  // the front card a few times a second, and scrubs the animation while it's dragged.
  // Paused off screen, in hidden tabs and during the intro. Reduced motion: no auto-turn.
  const ringBox = $("[data-ring]");
  const ring = ringBox && $(".ring", ringBox);
  if (ring) {
    const spin = $(".ring__spin", ring);
    const cards = $$(".ring__card", ring);
    const cap = $("[data-ring-cap]", ringBox);
    const step = 360 / cards.length;
    const TURN = 36000; // ms per full turn, as in site.css
    const size = () => spin.style.setProperty("--r", `${(spin.offsetWidth / 2 / Math.tan(Math.PI / cards.length)) * 1.14}px`);
    size();
    new ResizeObserver(size).observe(spin);
    ring.classList.add("is-3d");
    const anim = spin.getAnimations?.()[0];
    let front = -1, onScreen = true, drag = null, moved = 0;
    let armed = !root.classList.contains("intro-play"); // wait for the intro to clear
    const angle = () => (anim ? -((Number(anim.currentTime) || 0) % TURN) / TURN * 360 : 0);
    const name = () => {
      const f = (((Math.round(-angle() / step) % cards.length) + cards.length) % cards.length);
      if (f === front) return;
      cards[front]?.classList.remove("is-front");
      cards[f].classList.add("is-front");
      front = f;
      if (cap) cap.textContent = cards[f].dataset.t;
    };
    const sync = () => {
      if (!anim) return;
      const go = armed && onScreen && !document.hidden && !drag && !reduced;
      if (go && anim.playState !== "running") anim.play();
      if (!go && anim.playState === "running") anim.pause();
    };
    if (anim) anim.pause();
    name();
    setInterval(() => onScreen && !document.hidden && name(), 250);
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(ringBox);
    document.addEventListener("visibilitychange", sync);
    const arm = () => { armed = true; sync(); };
    if (armed) sync();
    else { setTimeout(arm, 4300); addEventListener("intro:done", arm); }

    // drag: scrub the animation's clock (one style write per pointer event)
    ringBox.addEventListener("pointerdown", (e) => {
      if (!anim) return;
      drag = { x: e.clientX, t: Number(anim.currentTime) || 0 };
      moved = 0;
      armed = true; sync();
    });
    addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      moved = Math.max(moved, Math.abs(dx));
      anim.currentTime = (((drag.t - (dx * 0.3 / 360) * TURN) % TURN) + TURN) % TURN;
      name();
    }, { passive: true });
    const release = () => { if (drag) { drag = null; sync(); } };
    addEventListener("pointerup", release);
    addEventListener("pointercancel", release);
    // a drag is not a tap: don't follow the card's link after turning the ring
    ringBox.addEventListener("click", (e) => { if (moved > 6) e.preventDefault(); }, true);
  }

  /* ---------- text mask reveal for section titles ---------- */
  $$("[data-split]").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.append(" ");
            const w = document.createElement("span");
            w.className = "w";
            w.setAttribute("aria-hidden", "true");
            const inner = document.createElement("span");
            inner.style.setProperty("--wi", i++);
            inner.textContent = part;
            w.append(inner);
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    // screen readers read the label; the split words are presentation only
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
    el.classList.add("is-split");
  });

  /* ---------- scroll reveal (once) ---------- */
  const revealIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  // siblings that reveal together cascade in, unless the markup set its own delay
  $$("[data-reveal]").forEach((el) => {
    if (el.style.getPropertyValue("--d")) return;
    const sibs = [...el.parentElement.children].filter((s) => s.hasAttribute("data-reveal"));
    if (sibs.length > 1) el.style.setProperty("--d", `${(sibs.indexOf(el) % 4) * 80}ms`);
  });
  $$("[data-reveal], .is-split").forEach((el) => revealIO.observe(el));

  /* ---------- assistant: loaded on first use ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ask]");
    if (!b) return;
    import("/js/assistant.js").then((m) => m.toggle(b)).catch(() => (location.href = "/faq"));
  });

  /* ---------- lightbox ---------- */
  const lb = $("[data-lightbox]");
  let lbItems = [];
  let lbIndex = 0;
  let lbReturn = null;
  const lbShow = (i) => {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbIndex];
    const im = $("[data-lb-img]", lb);
    im.src = it.dataset.lbSrc;
    im.alt = it.dataset.lbCaption || "";
    $("[data-lb-cap]", lb).textContent = it.dataset.lbCaption || "";
  };
  const lbOpen = (items, i) => {
    if (!lb?.showModal) return;
    lbItems = items;
    lbReturn = document.activeElement;
    lb.classList.toggle("is-single", items.length < 2);
    lbShow(i);
    lb.showModal();
  };
  if (lb) {
    $("[data-lb-close]", lb).addEventListener("click", () => lb.close());
    $("[data-lb-prev]", lb).addEventListener("click", () => lbShow(lbIndex - 1));
    $("[data-lb-next]", lb).addEventListener("click", () => lbShow(lbIndex + 1));
    lb.addEventListener("click", (e) => e.target === lb && lb.close());
    lb.addEventListener("close", () => lbReturn?.focus?.());
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      if (e.key === "ArrowRight") lbShow(lbIndex + 1);
    });
  }
  // Any group of [data-lb-src] buttons opens as one set (gallery, category images).
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-lb-src]");
    if (!b) return;
    const scope = b.closest("[data-gallery]") || b.parentElement;
    const set = $$("[data-lb-src]", scope).filter((x) => !x.closest("[hidden]"));
    lbOpen(set, Math.max(0, set.indexOf(b)));
  });

  /* ---------- filters (gallery + fabric library) ---------- */
  const filterGroup = (buttons, apply) => {
    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        buttons.forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on)); });
        apply(b);
        window.ScrollTrigger?.refresh();
      })
    );
  };
  const work = $("[data-gallery=work]");
  if (work) {
    filterGroup($$("[data-filter]"), (b) => {
      const f = b.dataset.filter;
      $$(".work__item", work).forEach((it) => {
        const show = f === "all" || it.dataset.cat === f;
        it.hidden = !show;
        if (show && !reduced) { it.classList.remove("is-filtering"); void it.offsetWidth; it.classList.add("is-filtering", "is-in"); }
      });
    });
  }
  const flib = $("[data-flib]");
  if (flib) {
    const cards = $$(".fcard", flib);
    const count = $("[data-flib-count]", flib);
    const btns = $$("[data-flib-filter]", flib);
    const apply = (b) => {
      const f = b.dataset.flibFilter;
      let n = 0;
      cards.forEach((c) => {
        const show = f === "all" || c.dataset.cats.split(" ").includes(f);
        c.hidden = !show;
        if (show) n++;
      });
      count.textContent = f === "all" ? `Showing all ${n} fabrics` : `Showing ${n} fabrics listed for ${b.firstChild.textContent.trim()}`;
    };
    filterGroup(btns, apply);
    // a deep link to a fabric must never land on a hidden card
    addEventListener("hashchange", () => {
      if (/^#fabric-/.test(location.hash) && $(location.hash)?.hidden) btns[0].click();
    });
  }

  /* ---------- enquiry form → WhatsApp handoff ---------- */
  // Composes the message on the visitor's device. No endpoint, nothing stored. We never
  // say it was "sent": only pressing Send in WhatsApp sends it.
  $$("[data-enq]").forEach((form) => {
    const el = form.elements;
    const fabricSel = $("[data-enq-fabric]", form);
    const fabricHint = $("[data-enq-fabric-hint]", form);
    const summary = $("[data-enq-summary]", form);
    const status = $("[data-enq-status]", form);
    const sendBtn = $("[data-enq-send]", form);
    const label = $("[data-enq-label]", form);
    const cats = data.categories || [];
    const fabrics = data.fabrics || [];
    const fabricName = (id) => fabrics.find((f) => f.id === id)?.name || "";
    const catTitle = (slug) => (slug === "mixed" ? "A mix / not sure yet" : cats.find((c) => c.slug === slug)?.title || "");

    // Fabric options follow the category: its own list, or every fabric when it has none.
    const fillFabrics = () => {
      const cat = cats.find((c) => c.slug === el.category.value);
      const keep = fabricSel.value;
      const ids = cat?.fabrics.length ? cat.fabrics : fabrics.map((f) => f.id);
      fabricSel.length = 1;
      ids.forEach((id) => fabricSel.add(new Option(fabricName(id), id)));
      if (keep && !ids.includes(keep)) fabricSel.add(new Option(fabricName(keep), keep), 1);
      fabricSel.value = keep;
      fabricHint.textContent = cat && !cat.fabrics.length
        ? `Fabrics for ${cat.title} are confirmed with your quotation.`
        : cat ? `Fabrics listed for ${cat.title}. Availability is confirmed with your quotation.` : "Availability is confirmed with your quotation.";
    };

    const setErr = (name, msg) => {
      const input = el[name];
      const box = $(`[data-err="${name}"]`, form);
      if (box) box.textContent = msg;
      input?.setAttribute?.("aria-invalid", String(!!msg));
      return msg;
    };
    const rules = {
      name: () => (el.name.value.trim() ? "" : "Please add your name."),
      phone: () => {
        const d = el.phone.value.replace(/\D/g, "");
        return d.length >= 10 && d.length <= 13 ? "" : "Please add a valid phone / WhatsApp number (10 digits).";
      },
      category: () => (el.category.value ? "" : "Please choose a clothing category, or “A mix / not sure yet”."),
      consent: () => (el.consent.checked ? "" : "Please tick the box so we can contact you about this enquiry."),
    };
    const validate = () => {
      const bad = Object.keys(rules).filter((k) => setErr(k, rules[k]()));
      summary.textContent = bad.length ? `Please check ${bad.length} field${bad.length > 1 ? "s" : ""} marked below.` : "";
      return bad;
    };

    const message = () =>
      [
        data.greeting,
        `Category: ${catTitle(el.category.value)}`,
        el.qty.value && `Estimated quantity: ${el.qty.value}`,
        el.fabric.value && `Fabric preference: ${fabricName(el.fabric.value)}`,
        el.notes.value.trim() && `Notes: ${el.notes.value.trim()}`,
        `Name: ${el.name.value.trim()}`,
        `Phone: ${el.phone.value.trim()}`,
        el.org.value.trim() && `Organisation: ${el.org.value.trim()}`,
        "Please contact me to discuss the specifications.",
      ].filter(Boolean).join("\n");

    el.category.addEventListener("change", () => { fillFabrics(); if (el.category.getAttribute("aria-invalid") === "true") setErr("category", rules.category()); });
    // re-check a field once the visitor fixes it
    form.addEventListener("input", (e) => {
      const n = e.target.name;
      if (rules[n] && e.target.getAttribute("aria-invalid") === "true") setErr(n, rules[n]());
    });
    form.addEventListener("change", (e) => {
      if (e.target.name === "consent" && e.target.getAttribute("aria-invalid") === "true") setErr("consent", rules.consent());
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.hidden = true;
      const bad = validate();
      if (bad.length) { el[bad[0]].focus(); return; }
      const url = `https://wa.me/${data.wa}?text=${encodeURIComponent(message())}`;
      sendBtn.setAttribute("aria-busy", "true");
      label.textContent = "Opening WhatsApp…";
      const win = window.open(url, "_blank", "noopener");
      setTimeout(() => { sendBtn.removeAttribute("aria-busy"); label.textContent = "Continue on WhatsApp"; }, 1200);
      status.hidden = false;
      status.replaceChildren();
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = win === null ? "WhatsApp didn't open automatically." : "WhatsApp opened with your message.";
      p.append(strong, " It is not sent until you press Send in WhatsApp. ");
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.textContent = win === null ? "Open WhatsApp" : "Didn't open? Try again";
      const call = document.createElement("a");
      call.href = `tel:${data.phone?.href || ""}`;
      call.textContent = `call ${data.phone?.display || "us"}`;
      p.append(a, " · or ", call, ".");
      status.append(p);
      status.focus();
    });

    // Contextual prefill: /contact?category=<slug>&fabric=<id> (old ?product= links too)
    const q = new URLSearchParams(location.search);
    const cat = q.get("category") || q.get("product");
    if (cat && [...el.category.options].some((o) => o.value === cat)) el.category.value = cat;
    fillFabrics();
    const fab = q.get("fabric");
    if (fab && fabrics.some((f) => f.id === fab)) {
      if (![...fabricSel.options].some((o) => o.value === fab)) fabricSel.add(new Option(fabricName(fab), fab), 1);
      fabricSel.value = fab;
    }
    // arriving from a "Request a quote" link: bring the form into view
    if ((cat || fab) && form.closest("#enquiry")) landOn(document.getElementById("enquiry"));
  });

  /* ---------- Instagram: official embed only after the visitor asks ---------- */
  $$("[data-ig-load]").forEach((b) =>
    b.addEventListener("click", () => {
      const item = b.closest("[data-ig]");
      const bq = document.createElement("blockquote");
      bq.className = "instagram-media";
      bq.dataset.instgrmPermalink = item.dataset.ig;
      bq.dataset.instgrmVersion = "14";
      const a = document.createElement("a");
      a.href = item.dataset.ig; a.textContent = "View this post on Instagram";
      bq.append(a);
      b.replaceWith(bq);
      if (window.instgrm) window.instgrm.Embeds.process();
      else {
        const s = document.createElement("script");
        s.src = "https://www.instagram.com/embed.js"; s.async = true;
        document.body.append(s);
      }
    })
  );

  /* ---------- lazy map (Google Maps loads only when asked; it can set cookies) ---------- */
  const map = $("[data-map]");
  $("[data-map-load]", map || undefined)?.addEventListener("click", () => {
    if ($("iframe", map)) return;
    const f = document.createElement("iframe");
    f.src = map.dataset.src;
    f.title = "D Creations location on Google Maps";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    map.prepend(f);
    $("[data-map-load]", map)?.remove();
    $(".contact__mapnote", map)?.remove();
  });

  /* ---------- desktop scroll layer: GSAP + ScrollTrigger (lazy) ---------- */
  // Phones, touch devices and reduced-motion visitors never download it.
  if (reduced || !matchMedia("(min-width: 1000px) and (hover: hover)").matches) return;
  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.async = true; s.onload = res; s.onerror = rej;
    document.head.append(s);
  });
  const boot = async () => {
    try {
      await loadScript("/vendor/gsap.min.js");
      await loadScript("/vendor/ScrollTrigger.min.js");
    } catch { return; }
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Manufacturing process: pinned horizontal track. mm reverts it if the viewport shrinks.
    mm.add("(min-width: 1000px)", () => {
      const how = $("[data-how]");
      if (!how) return;
      how.classList.add("is-h");
      const track = $("[data-how-track]", how);
      const bar = $("[data-how-bar]", how);
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      $$(".how__step", how).forEach((s) => s.classList.add("is-in"));
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: how,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: $(".how__pin", how),
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (st) => bar && (bar.style.transform = `scaleX(${st.progress})`),
        },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(track, { clearProps: "transform" }); how.classList.remove("is-h"); };
    });

    // Parallax depth on category cards only (small, scroll-linked, transform only)
    mm.add("(min-width: 1000px)", () => {
      $$("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 0.05;
        gsap.fromTo(el, { yPercent: -amt * 100 }, {
          yPercent: amt * 100, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    // Re-measure once fonts and late images have settled; a deep link re-lands each time.
    ScrollTrigger.addEventListener("refresh", () => reland?.());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    addEventListener("load", () => ScrollTrigger.refresh());
  };
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
  if (document.readyState === "complete") setTimeout(() => idle(boot), 600);
  else addEventListener("load", () => setTimeout(() => idle(boot), 600));
})();
