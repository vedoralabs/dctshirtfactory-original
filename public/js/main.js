/* D Creations — site interactions. No dependencies; GSAP + Lenis are loaded
   lazily after first paint for the cinematic layer (desktop, motion allowed). */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const data = (() => { try { return JSON.parse($("#site-data")?.textContent || "{}"); } catch { return {}; } })();
  let lenis = null;

  /* ---------- year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- preview note ---------- */
  const pbar = $("[data-preview-bar]");
  if (pbar) {
    try { if (sessionStorage.getItem("dc-preview-hidden")) pbar.hidden = true; } catch {}
    // on phones, tuck the note away after a few seconds so it never blocks content
    if (innerWidth < 900 && !pbar.hidden) setTimeout(() => (pbar.hidden = true), 7000);
    $("[data-preview-close]", pbar)?.addEventListener("click", () => {
      pbar.hidden = true;
      try { sessionStorage.setItem("dc-preview-hidden", "1"); } catch {}
    });
  }

  /* ---------- header: solid on scroll, mobile menu ---------- */
  const hdr = $("[data-hdr]");
  const onScroll = () => hdr?.classList.toggle("is-solid", scrollY > 40 || !$(".hero"));
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const burger = $("[data-burger]");
  const mnav = $("[data-mnav]");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mnav.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
    hdr.classList.toggle("is-solid", open || scrollY > 40);
    open ? lenis?.stop() : lenis?.start();
    if (open) $("a", mnav)?.focus();
  };
  burger?.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  mnav?.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger?.getAttribute("aria-expanded") === "true") { setMenu(false); burger.focus(); }
  });

  /* ---------- current section in nav ---------- */
  const navLinks = $$(".hdr__nav a[href^='/#']");
  if (navLinks.length && $(".hero")) {
    const map = new Map(navLinks.map((a) => [a.getAttribute("href").slice(2), a]));
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("is-current"));
          map.get(en.target.id)?.classList.add("is-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); s && io.observe(s); });
  }

  /* ---------- split headlines into words ---------- */
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
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
    $$(".w", el).forEach((w) => w.setAttribute("aria-hidden", "true"));
    el.classList.add("is-split");
  });

  /* ---------- reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  $$("[data-reveal], .is-split").forEach((el) => revealIO.observe(el));
  // hero headline animates in immediately
  requestAnimationFrame(() => $(".hero__title")?.classList.add("is-in"));

  /* ---------- hero Ken Burns sequence ---------- */
  const kb = $("[data-kb]");
  if (kb && !reduced) {
    const frames = $$(".kb__frame", kb);
    let k = 0;
    // load the non-first frames only after the page has loaded (keeps LCP lean)
    addEventListener("load", () => {
      setInterval(() => {
        if (document.hidden) return;
        frames[k].classList.remove("is-on");
        k = (k + 1) % frames.length;
        frames[k].classList.add("is-on");
      }, 6500);
    });
  }

  /* ---------- counters ---------- */
  const fmt = new Intl.NumberFormat("en-IN");
  const countIO = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      countIO.unobserve(en.target);
      const el = en.target;
      const to = Number(el.dataset.count);
      if (reduced) return (el.textContent = fmt.format(to));
      const t0 = performance.now();
      const dur = 1800;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = "0";
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- fabric tabs ---------- */
  const tabs = $("[data-tabs]");
  if (tabs) {
    const list = $$("[role=tab]", tabs);
    const select = (tab, focus = true) => {
      list.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).classList.toggle("is-active", on);
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
    };
    list.forEach((t, i) => {
      t.addEventListener("click", () => select(t, false));
      t.addEventListener("keydown", (e) => {
        const horiz = innerWidth < 1000;
        const next = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
        if (next && ((horiz && /Left|Right/.test(e.key)) || (!horiz && /Up|Down/.test(e.key)))) {
          e.preventDefault();
          select(list[(i + next + list.length) % list.length]);
        } else if (e.key === "Home") { e.preventDefault(); select(list[0]); }
        else if (e.key === "End") { e.preventDefault(); select(list[list.length - 1]); }
      });
    });
    // deep link: /fabrics#fabric-lacoste
    const fromHash = () => {
      const m = location.hash.match(/^#fabric-(.+)$/);
      const t = m && document.getElementById(`tab-${m[1]}`);
      if (t) { select(t, false); setTimeout(() => scrollToEl(document.getElementById("fabrics")), 50); }
    };
    fromHash();
    addEventListener("hashchange", fromHash);
  }

  /* ---------- lightbox ---------- */
  const lb = $("[data-lightbox]");
  let lbItems = [];
  let lbIndex = 0;
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
    lb.classList.toggle("is-single", items.length < 2);
    lbShow(i);
    lb.showModal();
    lenis?.stop();
  };
  if (lb) {
    $("[data-lb-close]", lb).addEventListener("click", () => lb.close());
    $("[data-lb-prev]", lb).addEventListener("click", () => lbShow(lbIndex - 1));
    $("[data-lb-next]", lb).addEventListener("click", () => lbShow(lbIndex + 1));
    lb.addEventListener("click", (e) => e.target === lb && lb.close());
    lb.addEventListener("close", () => lenis?.start());
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      if (e.key === "ArrowRight") lbShow(lbIndex + 1);
    });
  }

  /* ---------- portfolio filter ---------- */
  const work = $("[data-gallery=work]");
  if (work) {
    const btns = $$("[data-filter]");
    btns.forEach((b) =>
      b.addEventListener("click", () => {
        const f = b.dataset.filter;
        btns.forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", String(on)); });
        $$(".work__item", work).forEach((it) => {
          const show = f === "all" || it.dataset.cat === f;
          it.hidden = !show;
          if (show) { it.classList.remove("is-filtering"); void it.offsetWidth; it.classList.add("is-filtering"); it.classList.add("is-in"); }
        });
        window.ScrollTrigger?.refresh();
      })
    );
    work.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lb-src]");
      if (!b) return;
      const visible = $$(".work__item:not([hidden]) [data-lb-src]", work);
      lbOpen(visible, visible.indexOf(b));
    });
  }

  /* ---------- testimonials slider ---------- */
  const slider = $("[data-slider]");
  if (slider) {
    const track = $("[data-slider-track]", slider);
    const slides = $$("[data-slide]", slider);
    const dots = $("[data-slider-dots]", slider);
    slides.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", `Review ${i + 1}`);
      d.addEventListener("click", () => go(i));
      dots.append(d);
    });
    const current = () => {
      const x = track.scrollLeft;
      let best = 0;
      slides.forEach((s, i) => { if (Math.abs(s.offsetLeft - track.offsetLeft - x - parseFloat(getComputedStyle(track).paddingLeft)) < Math.abs(slides[best].offsetLeft - track.offsetLeft - x - parseFloat(getComputedStyle(track).paddingLeft))) best = i; });
      return best;
    };
    const go = (i) => {
      const n = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[n].offsetLeft - slides[0].offsetLeft, behavior: reduced ? "auto" : "smooth" });
    };
    const sync = () => $$("button", dots).forEach((d, i) => d.setAttribute("aria-current", String(i === current())));
    track.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    // first sync only when the slider nears the viewport (avoids a forced layout at startup)
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { o.disconnect(); sync(); } }, { rootMargin: "300px" }).observe(slider);
    $("[data-slider-prev]", slider).addEventListener("click", () => go(current() - 1));
    $("[data-slider-next]", slider).addEventListener("click", () => go(current() + 1));
    let paused = reduced;
    ["pointerenter", "focusin", "touchstart"].forEach((ev) => slider.addEventListener(ev, () => (paused = true), { passive: true }));
    slider.addEventListener("pointerleave", () => (paused = reduced));
    setInterval(() => {
      if (paused || document.hidden) return;
      const r = slider.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      go(atEnd ? 0 : current() + 1);
    }, 6000);
  }

  /* ---------- quote builder ---------- */
  const qb = $("[data-qb]");
  if (qb) {
    const steps = $$(".qb__step", qb);
    const back = $("[data-qb-back]", qb);
    const next = $("[data-qb-next]", qb);
    const send = $("[data-qb-send]", qb);
    const err = $("[data-qb-err]", qb);
    const fabricBox = $("[data-qb-fabrics]", qb);
    const preview = $("[data-qb-preview]", qb);
    let step = 0;

    const allFabrics = [...new Set((data.products || []).flatMap((p) => p.fabrics))];
    const renderFabrics = () => {
      const slug = qb.product?.value;
      const p = (data.products || []).find((x) => x.slug === slug);
      const chosen = qb.fabric?.value;
      const list = p ? p.fabrics : allFabrics;
      fabricBox.innerHTML = "";
      [...list, "Help me choose"].forEach((f) => {
        const l = document.createElement("label");
        l.className = "opt";
        const i = document.createElement("input");
        i.type = "radio"; i.name = "fabric"; i.value = f;
        if (f === chosen) i.checked = true;
        const s = document.createElement("span");
        s.textContent = f;
        l.append(i, s);
        fabricBox.append(l);
      });
    };

    const value = (name) => {
      const els = qb.elements[name];
      if (!els) return "";
      if (els instanceof RadioNodeList) {
        const vals = [...els].filter((e) => e.checked).map((e) => e.value);
        return vals.join(", ");
      }
      return els.type === "checkbox" ? (els.checked ? els.value : "") : els.value.trim();
    };
    const productName = () => {
      const v = value("product");
      return v === "mixed" ? "A mix / not sure yet" : (data.products || []).find((p) => p.slug === v)?.name || "";
    };
    const message = () => {
      const date = value("date") ? new Date(value("date")).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
      const lines = [
        "Hi D Creations! I'd like a quote:",
        "",
        `• Product: ${productName() || "—"}`,
        `• Fabric: ${value("fabric") || "Help me choose"}`,
        `• Quantity: ${value("qtyExact") ? `${value("qtyExact")} pcs` : value("qty") || "Not sure yet"}`,
        `• Branding: ${value("print") || "Not sure — suggest one"}`,
        `• Needed by: ${[value("when"), date].filter(Boolean).join(" — ") || "Flexible"}`,
        "",
        `Name: ${value("name")}`,
        `Phone: ${value("phone")}`,
      ];
      if (value("org")) lines.push(`Organisation: ${value("org")}`);
      if (value("city")) lines.push(`City: ${value("city")}`);
      if (value("notes")) lines.push(`Notes: ${value("notes")}`);
      lines.push("", "(Sent from the website quote builder)");
      return lines.join("\n");
    };

    const show = (i, focus = true) => {
      step = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach((s, k) => s.classList.toggle("is-active", k === step));
      $("[data-qb-step]", qb).textContent = step + 1;
      $("[data-qb-label]", qb).textContent = steps[step].dataset.label;
      $("[data-qb-bar]", qb).style.width = `${((step + 1) / steps.length) * 100}%`;
      back.hidden = step === 0;
      next.hidden = step === steps.length - 1;
      send.hidden = step !== steps.length - 1;
      err.textContent = "";
      if (step === 1) renderFabrics();
      if (step === steps.length - 1) preview.textContent = message();
      if (focus) {
        const legend = $("legend", steps[step]);
        legend.tabIndex = -1;
        legend.focus({ preventScroll: true });
        const top = qb.getBoundingClientRect().top;
        if (top < 0 || top > innerHeight * 0.5) scrollToEl(qb);
      }
    };

    const validate = () => {
      if (step === 0 && !value("product")) return "Pick a product (or “A mix / not sure yet”).";
      if (step === steps.length - 1) {
        const name = qb.elements.name;
        const phone = qb.elements.phone;
        name.setAttribute("aria-invalid", String(!name.value.trim()));
        const digits = phone.value.replace(/\D/g, "");
        const okPhone = digits.length >= 10 && digits.length <= 13;
        phone.setAttribute("aria-invalid", String(!okPhone));
        if (!name.value.trim()) { name.focus(); return "Please add your name."; }
        if (!okPhone) { phone.focus(); return "Please add a valid phone / WhatsApp number."; }
      }
      return "";
    };

    next.addEventListener("click", () => {
      const m = validate();
      if (m) return (err.textContent = m);
      show(step + 1);
    });
    back.addEventListener("click", () => show(step - 1));
    // Auto-advance on single-choice steps for a snappy feel
    qb.addEventListener("change", (e) => {
      if (["product", "fabric", "qty", "when"].includes(e.target.name) && e.target.type === "radio") {
        if (e.target.name === "qty") qb.elements.qtyExact.value = "";
        setTimeout(() => show(step + 1), 220);
      }
    });
    qb.addEventListener("input", () => { if (step === steps.length - 1) preview.textContent = message(); });
    qb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && step < steps.length - 1) { e.preventDefault(); next.click(); }
    });
    qb.addEventListener("submit", (e) => {
      e.preventDefault();
      const m = validate();
      if (m) return (err.textContent = m);
      const url = `https://wa.me/${data.wa}?text=${encodeURIComponent(message())}`;
      window.open(url, "_blank", "noopener") || (location.href = url);
    });

    // Pre-select a product from ?product=slug (links from product pages)
    const pre = new URLSearchParams(location.search).get("product");
    const radio = pre && $(`input[name=product][value="${CSS.escape(pre)}"]`, qb);
    if (radio) { radio.checked = true; show(1, false); }
    else show(0, false);
  }

  /* ---------- product gallery: thumbs, hover zoom, lightbox ---------- */
  const gal = $("[data-gal]");
  if (gal) {
    const slides = $$("[data-gal-slide]", gal);
    const thumbs = $$("[data-gal-thumb]", gal);
    const set = (i) => {
      slides.forEach((s, k) => s.classList.toggle("is-on", k === i));
      thumbs.forEach((t, k) => { t.classList.toggle("is-on", k === i); t.setAttribute("aria-pressed", String(k === i)); });
    };
    thumbs.forEach((t, i) => t.addEventListener("click", () => set(i)));
    slides.forEach((s) => {
      if (!s.dataset.lbSrc) return;
      if (finePointer) {
        s.addEventListener("pointermove", (e) => {
          const r = s.getBoundingClientRect();
          s.style.setProperty("--zx", `${((e.clientX - r.left) / r.width) * 100}%`);
          s.style.setProperty("--zy", `${((e.clientY - r.top) / r.height) * 100}%`);
          s.classList.add("is-zoom");
        });
        s.addEventListener("pointerleave", () => s.classList.remove("is-zoom"));
      }
      s.addEventListener("click", () => {
        const items = slides.filter((x) => x.dataset.lbSrc);
        lbOpen(items, items.indexOf(s));
      });
    });
  }

  /* ---------- lazy map ---------- */
  const map = $("[data-map]");
  if (map) {
    const load = () => {
      if ($("iframe", map)) return;
      const f = document.createElement("iframe");
      f.src = map.dataset.src;
      f.title = "D Creations location on Google Maps";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      map.prepend(f);
      $("[data-map-load]", map)?.remove();
    };
    $("[data-map-load]", map)?.addEventListener("click", load);
    new IntersectionObserver((ents, io) => {
      if (ents[0].isIntersecting) { io.disconnect(); setTimeout(load, 400); }
    }, { rootMargin: "200px" }).observe(map);
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- smooth anchor scrolling (works with or without Lenis) ---------- */
  function scrollToEl(el) {
    if (!el) return;
    const offset = -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hdr-h")) || 72) - 8;
    if (lenis) lenis.scrollTo(el, { offset });
    else scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: reduced ? "auto" : "smooth" });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href*='#']");
    if (!a || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    if (url.hash.startsWith("#fabric-")) return; // handled by hashchange
    e.preventDefault();
    history.pushState(null, "", url.hash);
    scrollToEl(el);
  });

  /* ---------- cinematic layer: Lenis + GSAP ScrollTrigger (lazy) ---------- */
  addEventListener("load", () => document.documentElement.classList.add("is-loaded"));
  // The cinematic layer (pinned timeline, parallax, smooth scroll) is desktop-only;
  // phones and reduced-motion users never download it.
  if (reduced || !matchMedia("(min-width: 1000px) and (hover: hover)").matches) return;
  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.async = true; s.onload = res; s.onerror = rej;
    document.head.append(s);
  });
  const boot = async () => {
    try {
      await Promise.all([loadScript("/vendor/lenis.min.js"), loadScript("/vendor/gsap.min.js")]);
      await loadScript("/vendor/ScrollTrigger.min.js");
    } catch { return; }
    const { gsap, ScrollTrigger, Lenis } = window;
    gsap.registerPlugin(ScrollTrigger);

    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    document.documentElement.classList.add("lenis");
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    const mm = gsap.matchMedia();

    // Horizontal "How we work" timeline on desktop
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
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (st) => bar && (bar.style.transform = `scaleX(${st.progress})`),
        },
      });
      return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(track, { clearProps: "transform" }); how.classList.remove("is-h"); };
    });

    // Parallax layers
    mm.add("(min-width: 1000px)", () => {
      $$("[data-parallax]").forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 0.1;
        gsap.fromTo(el, { yPercent: -amt * 100 }, {
          yPercent: amt * 100, ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      // hero content drifts up and fades as you leave
      const hc = $(".hero__content");
      if (hc) gsap.to(hc, { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      const hm = $(".hero__media");
      if (hm) gsap.to(hm, { yPercent: 20, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    });

    addEventListener("load", () => ScrollTrigger.refresh());
    if (location.hash && !location.hash.startsWith("#fabric-")) {
      const el = document.getElementById(location.hash.slice(1));
      el && setTimeout(() => lenis.scrollTo(el, { offset: -80, immediate: true }), 100);
    }
  };
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
  if (document.readyState === "complete") setTimeout(() => idle(boot), 600);
  else addEventListener("load", () => setTimeout(() => idle(boot), 600));
})();
