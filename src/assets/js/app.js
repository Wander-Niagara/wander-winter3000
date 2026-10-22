/* Wander Niagara — Fall campaign. First-party JS (target < 15KB).
 * Responsibilities: analytics bootstrap (GA4 + Plausible + Meta + StackAdapt), outbound
 * click tracking, scroll-depth + engaged-time, lazy embeds, global menu,
 * anchor landings, UTM preservation, outbound ref param. No frameworks. */
(function () {
  "use strict";

  // Design behaviors gate (.js on <html> is set inline in <head> to avoid a
  // reveal flash; this is the belt-and-suspenders for cached templates).
  document.documentElement.classList.add("js");

  // ---- Config (emitted by the template as a JSON <script>) ----
  var cfg = {};
  try {
    cfg = JSON.parse(document.getElementById("wn-config").textContent);
  } catch (e) { cfg = {}; }
  var variant = cfg.variant || "";
  var ref = cfg.ref || { enabled: false };

  var ss = window.sessionStorage, ls = window.localStorage;
  function ssGet(k){ try { return ss.getItem(k); } catch(e){ return null; } }
  function ssSet(k,v){ try { ss.setItem(k,v); } catch(e){} }

  // ---------------------------------------------------------------------------
  // 1. Preserve inbound UTM / click ids into sessionStorage (once per session).
  // ---------------------------------------------------------------------------
  (function preserveUtm(){
    var keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];
    var q = new URLSearchParams(location.search), found = {}, any = false;
    keys.forEach(function(k){ if (q.has(k)) { found[k] = q.get(k); any = true; } });
    if (any) {
      var prev = {};
      try { prev = JSON.parse(ssGet("wn_utm") || "{}"); } catch(e){}
      ssSet("wn_utm", JSON.stringify(Object.assign(prev, found)));
    }
  })();

  // ---------------------------------------------------------------------------
  // 2. Analytics bootstrap — lazy. Never blocks LCP; loads on first interaction
  //    or after a short idle timeout, whichever comes first.
  // ---------------------------------------------------------------------------
  var booted = false;
  function boot(){
    if (booted) return; booted = true;
    if (cfg.ga4Id) loadGtag(cfg.ga4Id);
    if (cfg.metaPixelId) loadPixel(cfg.metaPixelId);
    if (cfg.stackAdaptPixelId) loadStackAdapt(cfg.stackAdaptPixelId);
    if (cfg.plausibleSrc) loadPlausible(cfg.plausibleSrc);
  }
  function loadGtag(id){
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: true });
    var s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
  }
  function loadPixel(id){
    /* Meta Pixel base snippet (condensed) */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id); window.fbq("track", "PageView");
  }
  function loadStackAdapt(id){
    /* StackAdapt universal retargeting pixel (client-supplied snippet) */
    !function(s,a,e,v,n,t,z){if(s.saq)return;n=s.saq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!s._saq)s._saq=n;
      n.push=n;n.loaded=!0;n.version='1.0';n.queue=[];t=a.createElement(e);t.async=!0;
      t.src=v;z=a.getElementsByTagName(e)[0];z.parentNode.insertBefore(t,z)}
      (window,document,'script','https://tags.srv.stackadapt.com/events.js');
    window.saq('ts', id);
  }
  function loadPlausible(src){
    /* Plausible snippet (client-supplied): queue stub + init, then the script */
    window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments); };
    window.plausible.init = window.plausible.init || function(i){ window.plausible.o = i || {}; };
    window.plausible.init();
    var s = document.createElement("script");
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }
  ["scroll","pointerdown","keydown","touchstart"].forEach(function(ev){
    window.addEventListener(ev, boot, { once: true, passive: true });
  });
  window.setTimeout(boot, 3500);

  // Central event dispatch → GA4 (gtag), Plausible custom events, and/or GTM.
  function track(name, params){
    params = params || {};
    if (window.gtag) window.gtag("event", name, params);
    if (window.plausible) window.plausible(name, { props: params });
    if (cfg.gtmId && window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params));
  }

  // ---------------------------------------------------------------------------
  // 3. Outbound click tracking (event delegation, capture phase so we can
  //    rewrite href with the ref param before navigation).
  // ---------------------------------------------------------------------------
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var raw = a.getAttribute("href");
    if (!/^https?:\/\//i.test(raw)) return;         // only absolute links
    var url; try { url = new URL(a.href); } catch(_){ return; }
    if (url.hostname === location.hostname) return; // same-site absolute → ignore

    boot(); // make sure analytics exists so the event is not dropped

    var scope = a.closest("[data-module]");
    var module = a.getAttribute("data-module") || (scope && scope.getAttribute("data-module")) || "other";
    var label = a.getAttribute("data-card-label")
      || a.getAttribute("aria-label")
      || (a.textContent || "").trim().slice(0, 80);

    maybeAppendRef(a, url); // mutate href in place (capture phase)

    var params = {
      destination_domain: url.hostname.replace(/^www\./, ""),
      destination_url: url.href,
      module: module,
      page_variant: variant,
      card_label: label
    };
    track("click_out", params);
    if (!ssGet("wn_first_click")) { ssSet("wn_first_click", "1"); track("first_click_out", params); }
    if (window.fbq) window.fbq("trackCustom", "OutboundClick", params);
  }, true);

  function maybeAppendRef(a, url){
    if (!ref.enabled) return;
    var host = url.hostname.replace(/^www\./, "");
    if ((ref.disabledDomains || []).indexOf(host) !== -1) return;
    if (url.searchParams.has(ref.param)) return;
    url.searchParams.set(ref.param, ref.value);
    a.setAttribute("href", url.href);
  }

  // ---------------------------------------------------------------------------
  // 4. Scroll depth (25/50/75/100) + engaged-time (15s of visible time).
  // ---------------------------------------------------------------------------
  var marks = { 25: 0, 50: 0, 75: 0, 100: 0 };
  function onScroll(){
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    var pct = dh > 0 ? (window.scrollY / dh) * 100 : 100;
    [25,50,75,100].forEach(function(m){
      if (!marks[m] && pct >= m) { marks[m] = 1; track("scroll_depth", { percent: m, page_variant: variant }); }
    });
  }
  window.addEventListener("scroll", throttle(onScroll, 350), { passive: true });

  var engaged = 0, engagedFired = false;
  window.setInterval(function(){
    if (document.visibilityState !== "visible") return;
    engaged++;
    if (engaged >= 15 && !engagedFired) { engagedFired = true; track("engaged_time", { seconds: 15, page_variant: variant }); }
  }, 1000);

  // ---------------------------------------------------------------------------
  // 5. Sticky bottom CTA — reveal once the hero CTA sentinel scrolls out.
  // ---------------------------------------------------------------------------
  var sticky = document.querySelector(".sticky-cta");
  var sentinel = document.getElementById("hero-cta-sentinel");
  if (sticky && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function(entries){
      entries.forEach(function(en){ sticky.classList.toggle("is-visible", !en.isIntersecting); });
    }, { rootMargin: "0px 0px -10px 0px" }).observe(sentinel);
  }

  // ---------------------------------------------------------------------------
  // 6. Video hero — click-to-play (user-initiated; no autoplay-with-sound).
  // ---------------------------------------------------------------------------
  var vhero = document.querySelector(".hero--video");
  if (vhero) {
    var pbtn = vhero.querySelector(".hero__play");
    var video = vhero.querySelector("video");
    if (pbtn && video) {
      pbtn.addEventListener("click", function(){
        video.muted = false; video.controls = true;
        var p = video.play();
        if (p && p.catch) p.catch(function(){ video.muted = true; video.play(); });
        vhero.classList.add("is-playing");
        track("hero_video_play", { page_variant: variant });
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7. Lazy third-party embeds — swap facade → real embed on first approach.
  // ---------------------------------------------------------------------------
  var slots = document.querySelectorAll("[data-embed]");
  if (slots.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        activateEmbed(en.target); obs.unobserve(en.target);
      });
    }, { rootMargin: "300px 0px" });
    slots.forEach(function(s){ io.observe(s); });
  }
  function activateEmbed(el){
    var tpl = el.querySelector("template");
    if (!tpl) return;              // no code pasted yet → leave the placeholder
    var frag = tpl.content.cloneNode(true);
    // Re-create <script> nodes so they actually execute.
    el.querySelectorAll(".embed-slot").forEach(function(n){ n.remove(); });
    el.appendChild(frag);
    el.querySelectorAll("script").forEach(function(old){
      var s = document.createElement("script");
      for (var i=0;i<old.attributes.length;i++){ s.setAttribute(old.attributes[i].name, old.attributes[i].value); }
      s.text = old.text; old.parentNode.replaceChild(s, old);
    });
    track("embed_view", { module: el.getAttribute("data-embed"), page_variant: variant });
  }

  // ---------------------------------------------------------------------------
  // 8. Exit-intent newsletter modal — capped once / 30 days, never before 30s,
  //    never on load. Desktop = mouse-leave to chrome; mobile = 70% + 10s idle.
  // ---------------------------------------------------------------------------
  var modal = document.getElementById("nl-modal");
  if (modal) {
    var THIRTY = 30 * 24 * 3600 * 1000;
    var last = 0; try { last = +ls.getItem("wn_nl_seen") || 0; } catch(e){}
    var eligible = (Date.now() - last) > THIRTY;
    var armed = false;
    window.setTimeout(function(){ armed = true; }, 30000); // never before 30s

    function openModal(trigger){
      if (!eligible || !armed || modal.classList.contains("is-open")) return;
      modal.classList.add("is-open");
      try { ls.setItem("wn_nl_seen", String(Date.now())); } catch(e){}
      document.body.style.overflow = "hidden";
      track("newsletter_prompt", { page_variant: variant, trigger: trigger });
      var f = modal.querySelector("input,button"); if (f) f.focus();
    }
    function closeModal(){ modal.classList.remove("is-open"); document.body.style.overflow = ""; }

    if (window.matchMedia("(min-width:900px) and (pointer:fine)").matches) {
      document.addEventListener("mouseout", function(e){
        if (!e.relatedTarget && e.clientY <= 2) openModal("exit-intent");
      });
    } else {
      var hit70 = false, idle = null;
      window.addEventListener("scroll", function(){
        var dh = document.documentElement.scrollHeight - window.innerHeight;
        var pct = dh > 0 ? window.scrollY / dh * 100 : 100;
        if (pct >= 70) hit70 = true;
        if (hit70) { clearTimeout(idle); idle = setTimeout(function(){ openModal("scroll-idle"); }, 10000); }
      }, { passive: true });
    }
    modal.addEventListener("click", function(e){
      if (e.target.hasAttribute("data-close") || e.target.classList.contains("modal__backdrop")) closeModal();
    });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeModal(); });
  }

  // Newsletter submit tracking (both inline + modal forms).
  document.querySelectorAll(".nl-form").forEach(function(form){
    form.addEventListener("submit", function(e){
      if (!form.getAttribute("action")) { e.preventDefault(); return; } // not configured yet
      track("newsletter_submit", { page_variant: variant, location: form.getAttribute("data-nl-loc") || "inline" });
    });
  });

  // ---------------------------------------------------------------------------
  // 9. Stamp-in reveals — one orchestrated entrance per section (letterpress
  //    "stamp"). Elements are visible by default without JS (.js gate in CSS).
  // ---------------------------------------------------------------------------
  var stamps = document.querySelectorAll(".stamp");
  if (stamps.length && "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var sio = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        en.target.classList.add("is-stamped"); obs.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    stamps.forEach(function(s){ sio.observe(s); });
  } else {
    stamps.forEach(function(s){ s.classList.add("is-stamped"); });
  }

  // ---------------------------------------------------------------------------
  // 10. Honest event badges — computed from each row's real data-date, never
  //     painted on. "Today" on the day; "This weekend" for Fri–Sun within 6 days.
  // ---------------------------------------------------------------------------
  document.querySelectorAll(".event-row[data-date]").forEach(function(row){
    var badge = row.querySelector(".event-badge");
    if (!badge) return;
    var d = new Date(row.getAttribute("data-date") + "T12:00:00");
    if (isNaN(d)) return;
    var now = new Date();
    var days = Math.floor((d - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
    var dow = d.getDay(); // 0 Sun … 6 Sat
    if (days === 0) { badge.textContent = "Today"; badge.hidden = false; }
    else if (days > 0 && days <= 6 && (dow === 5 || dow === 6 || dow === 0)) {
      badge.textContent = "This weekend"; badge.hidden = false;
    }
  });

  // ---------------------------------------------------------------------------
  // 11. Global menu — accessible hamburger on every viewport (client, Sept 10).
  //     aria-expanded, Escape closes and returns focus, closes on link click
  //     and on outside click. Button is [hidden] until JS arms it (no-JS keeps
  //     the inline nav via CSS). Items are page#section anchors; a same-page
  //     item just scrolls (the browser handles the hash).
  // ---------------------------------------------------------------------------
  var menuBtn = document.querySelector(".menu-btn");
  var headerEl = document.getElementById("site-header");
  if (menuBtn && headerEl) {
    menuBtn.hidden = false;
    function setMenu(open){
      headerEl.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    }
    menuBtn.addEventListener("click", function(){
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        setMenu(false); menuBtn.focus();
      }
    });
    document.addEventListener("click", function(e){
      if (menuBtn.getAttribute("aria-expanded") === "true" && !headerEl.contains(e.target)) setMenu(false);
    });
    headerEl.querySelectorAll(".nav a").forEach(function(a){
      a.addEventListener("click", function(){ setMenu(false); });
    });
  }

  // ---------------------------------------------------------------------------
  // 12. Anchor landings — menu items open a page at #section. Widgets above the
  //     target load lazily and grow after the browser's initial jump, which
  //     would push the target down the page; re-align to it a few times while
  //     content settles, unless the visitor has started scrolling themselves.
  // ---------------------------------------------------------------------------
  (function anchorLanding(){
    if (!location.hash || location.hash.length < 2) return;
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    var userScrolled = false;
    ["wheel","touchstart","keydown"].forEach(function(ev){
      window.addEventListener(ev, function(){ userScrolled = true; }, { once: true, passive: true });
    });
    function realign(){ if (!userScrolled) target.scrollIntoView({ block: "start" }); }
    [0, 400, 1200, 2500].forEach(function(ms){ window.setTimeout(realign, ms); });
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function(){ realign(); });
      ro.observe(document.getElementById("main") || document.body);
      window.setTimeout(function(){ ro.disconnect(); }, 4000);
    }
  })();

  // ---------------------------------------------------------------------------
  // 13. Home hero slideshow — gentle crossfade, auto-advance unless
  //     prefers-reduced-motion; pause on hover/focus; swipe on touch.
  //     First slide is server-rendered active, so no JS = static hero.
  // ---------------------------------------------------------------------------
  var slidesWrap = document.querySelector("[data-slideshow]");
  if (slidesWrap) {
    var slides = [].slice.call(slidesWrap.children);
    if (slides.length > 1) {
      var idx = 0, timer = null, paused = false;
      var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      function show(n){
        idx = (n + slides.length) % slides.length;
        slides.forEach(function(s, i){
          s.classList.toggle("is-active", i === idx);
          if (i === idx) s.removeAttribute("aria-hidden");
          else s.setAttribute("aria-hidden", "true");
        });
      }
      function tick(){ if (!paused) show(idx + 1); }
      function arm(){ if (!reduced && !timer) timer = window.setInterval(tick, 6000); }
      var hero = slidesWrap.closest(".hero") || slidesWrap;
      ["mouseenter", "focusin"].forEach(function(ev){ hero.addEventListener(ev, function(){ paused = true; }); });
      ["mouseleave", "focusout"].forEach(function(ev){ hero.addEventListener(ev, function(){ paused = false; }); });
      var x0 = null;
      hero.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener("touchend", function(e){
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      }, { passive: true });
      arm();
    }
  }

  // ---- utils ----
  function throttle(fn, wait){
    var t = 0, timer = null;
    return function(){
      var now = Date.now(), rem = wait - (now - t);
      if (rem <= 0) { t = now; fn(); }
      else if (!timer) { timer = setTimeout(function(){ t = Date.now(); timer = null; fn(); }, rem); }
    };
  }
})();
