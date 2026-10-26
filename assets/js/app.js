/* Wander Niagara — Winter campaign. First-party JS (target < 15KB).
 * Analytics bootstrap (GA4 + Plausible + Meta + StackAdapt), outbound click
 * tracking, portal_click, scroll depth + engaged time, lazy embeds, sticky CTA,
 * exit-intent newsletter, anchor landings, the window light-up sequence, falling
 * snow, event filters. No frameworks. Mirrors the fall build's tracking exactly. */
(function () {
  "use strict";
  var html = document.documentElement;
  html.classList.add("js");

  var cfg = {};
  try { cfg = JSON.parse(document.getElementById("wn-config").textContent); } catch (e) { cfg = {}; }
  var variant = cfg.variant || "";
  var ref = cfg.ref || { enabled: false };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ss = window.sessionStorage, ls = window.localStorage;
  function ssGet(k){ try { return ss.getItem(k); } catch(e){ return null; } }
  function ssSet(k,v){ try { ss.setItem(k,v); } catch(e){} }

  // 1. Preserve inbound UTM / click ids for the session.
  (function preserveUtm(){
    var keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];
    var q = new URLSearchParams(location.search), found = {}, any = false;
    keys.forEach(function(k){ if (q.has(k)) { found[k] = q.get(k); any = true; } });
    if (any) { var prev = {}; try { prev = JSON.parse(ssGet("wn_utm") || "{}"); } catch(e){} ssSet("wn_utm", JSON.stringify(Object.assign(prev, found))); }
  })();

  // 2. Analytics bootstrap: lazy, never blocks LCP.
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
    window.gtag("js", new Date()); window.gtag("config", id, { send_page_view: true });
    var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id); document.head.appendChild(s);
  }
  function loadPixel(id){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id); window.fbq("track", "PageView");
  }
  function loadStackAdapt(id){
    !function(s,a,e,v,n,t,z){if(s.saq)return;n=s.saq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!s._saq)s._saq=n;n.push=n;n.loaded=!0;n.version='1.0';n.queue=[];t=a.createElement(e);t.async=!0;t.src=v;z=a.getElementsByTagName(e)[0];z.parentNode.insertBefore(t,z)}(window,document,'script','https://tags.srv.stackadapt.com/events.js');
    window.saq('ts', id);
  }
  function loadPlausible(src){
    window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments); };
    window.plausible.init = window.plausible.init || function(i){ window.plausible.o = i || {}; };
    window.plausible.init();
    var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s);
  }
  ["scroll","pointerdown","keydown","touchstart"].forEach(function(ev){ window.addEventListener(ev, boot, { once: true, passive: true }); });
  window.setTimeout(boot, 3500);

  function track(name, params){
    params = params || {};
    if (window.gtag) window.gtag("event", name, params);
    if (window.plausible) window.plausible(name, { props: params });
    if (cfg.gtmId && window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params));
  }
  window.wnTrack = track; // exposed for DebugView checks

  // 3. Outbound click_out (event delegation, capture phase) + portal_click.
  document.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var portal = a.getAttribute("data-portal");
    if (portal) { boot(); track("portal_click", { portal: portal, module: a.getAttribute("data-module") || "house-portal", page_variant: variant }); }
    var raw = a.getAttribute("href");
    if (!/^https?:\/\//i.test(raw)) return;
    var url; try { url = new URL(a.href); } catch(_){ return; }
    if (url.hostname === location.hostname) return;
    boot();
    var scope = a.closest("[data-module]");
    var module = a.getAttribute("data-module") || (scope && scope.getAttribute("data-module")) || "other";
    var label = a.getAttribute("data-card-label") || a.getAttribute("aria-label") || (a.textContent || "").trim().slice(0, 80);
    maybeAppendRef(a, url);
    var params = { destination_domain: url.hostname.replace(/^www\./, ""), destination_url: url.href, module: module, page_variant: variant, card_label: label };
    track("click_out", params);
    if (!ssGet("wn_first_click")) { ssSet("wn_first_click", "1"); track("first_click_out", params); }
    if (window.fbq) window.fbq("trackCustom", "OutboundClick", params);
  }, true);
  function maybeAppendRef(a, url){
    if (!ref.enabled) return;
    var host = url.hostname.replace(/^www\./, "");
    if ((ref.disabledDomains || []).indexOf(host) !== -1) return;
    if (url.searchParams.has(ref.param)) return;
    url.searchParams.set(ref.param, ref.value); a.setAttribute("href", url.href);
  }

  // 4. Scroll depth + engaged time.
  var marks = { 25: 0, 50: 0, 75: 0, 100: 0 };
  function onScroll(){
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    var pct = dh > 0 ? (window.scrollY / dh) * 100 : 100;
    [25,50,75,100].forEach(function(m){ if (!marks[m] && pct >= m) { marks[m] = 1; track("scroll_depth", { percent: m, page_variant: variant }); } });
  }
  window.addEventListener("scroll", throttle(onScroll, 350), { passive: true });
  var engaged = 0, engagedFired = false;
  window.setInterval(function(){
    if (document.visibilityState !== "visible") return;
    engaged++;
    if (engaged >= 15 && !engagedFired) { engagedFired = true; track("engaged_time", { seconds: 15, page_variant: variant }); }
  }, 1000);

  // 5. Sticky bottom CTA once the hero sentinel scrolls out.
  var sticky = document.querySelector(".sticky-cta");
  var sentinel = document.getElementById("hero-cta-sentinel");
  if (sticky && sentinel && "IntersectionObserver" in window) {
    new IntersectionObserver(function(entries){ entries.forEach(function(en){ sticky.classList.toggle("is-visible", !en.isIntersecting && en.boundingClientRect.top < 0); }); }, { rootMargin: "0px 0px -10px 0px" }).observe(sentinel);
  }

  // 6. Lazy third-party embeds.
  var slots = document.querySelectorAll("[data-embed]");
  if (slots.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries, obs){ entries.forEach(function(en){ if (!en.isIntersecting) return; activateEmbed(en.target); obs.unobserve(en.target); }); }, { rootMargin: "300px 0px" });
    slots.forEach(function(s){ io.observe(s); });
  }
  function activateEmbed(el){
    var tpl = el.querySelector("template"); if (!tpl) return;
    var frag = tpl.content.cloneNode(true);
    el.querySelectorAll(".embed-slot").forEach(function(n){ n.remove(); });
    el.appendChild(frag);
    el.querySelectorAll("script").forEach(function(old){ var s = document.createElement("script"); for (var i=0;i<old.attributes.length;i++){ s.setAttribute(old.attributes[i].name, old.attributes[i].value); } s.text = old.text; old.parentNode.replaceChild(s, old); });
    track("embed_view", { module: el.getAttribute("data-embed"), page_variant: variant });
  }

  // 7. Exit-intent newsletter: once / 30 days, never before 30 s, never on load.
  var modal = document.getElementById("nl-modal");
  if (modal) {
    var THIRTY = 30 * 24 * 3600 * 1000, last = 0;
    try { last = +ls.getItem("wn_nl_seen") || 0; } catch(e){}
    var eligible = (Date.now() - last) > THIRTY, armed = false, lastFocus = null;
    window.setTimeout(function(){ armed = true; }, 30000);
    function openModal(trigger){
      if (!eligible || !armed || !modal.hidden) return;
      lastFocus = document.activeElement; modal.hidden = false; modal.classList.add("is-open");
      try { ls.setItem("wn_nl_seen", String(Date.now())); } catch(e){}
      document.body.style.overflow = "hidden";
      track("newsletter_prompt", { page_variant: variant, trigger: trigger });
      var f = modal.querySelector("input,button"); if (f) f.focus();
    }
    function closeModal(){ modal.classList.remove("is-open"); modal.hidden = true; document.body.style.overflow = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
    if (window.matchMedia("(min-width:900px) and (pointer:fine)").matches) {
      document.addEventListener("mouseout", function(e){ if (!e.relatedTarget && e.clientY <= 2) openModal("exit-intent"); });
    } else {
      var hit70 = false, idle = null;
      window.addEventListener("scroll", function(){
        var dh = document.documentElement.scrollHeight - window.innerHeight;
        var pct = dh > 0 ? window.scrollY / dh * 100 : 100;
        if (pct >= 70) hit70 = true;
        if (hit70) { clearTimeout(idle); idle = setTimeout(function(){ openModal("scroll-idle"); }, 10000); }
      }, { passive: true });
    }
    modal.addEventListener("click", function(e){ if (e.target.hasAttribute("data-close") || e.target.classList.contains("modal__backdrop")) closeModal(); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape" && !modal.hidden) closeModal(); });
  }
  document.querySelectorAll(".nl-form").forEach(function(form){
    form.addEventListener("submit", function(e){
      if (!form.getAttribute("action")) { e.preventDefault(); return; }
      track("newsletter_submit", { page_variant: variant, location: form.getAttribute("data-nl-loc") || "inline" });
    });
  });

  // 8. Event badges from real dates; event filter chips.
  document.querySelectorAll(".event-row[data-date]").forEach(function(row){
    var badge = row.querySelector(".event-row__badge"); if (!badge) return;
    var d = new Date(row.getAttribute("data-date") + "T12:00:00"); if (isNaN(d)) return;
    var now = new Date(), days = Math.floor((d - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000), dow = d.getDay();
    if (days === 0) { badge.textContent = "Today"; badge.hidden = false; }
    else if (days > 0 && days <= 6 && (dow === 5 || dow === 6 || dow === 0)) { badge.textContent = "This weekend"; badge.hidden = false; }
  });
  var chips = document.querySelector(".event-filters");
  if (chips) {
    chips.addEventListener("click", function(e){
      var b = e.target.closest("button[data-filter]"); if (!b) return;
      var f = b.getAttribute("data-filter");
      chips.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", String(x === b)); });
      document.querySelectorAll(".event-row").forEach(function(row){ row.hidden = f !== "all" && (row.getAttribute("data-tags") || "").split(" ").indexOf(f) === -1; });
      document.querySelectorAll(".events-month").forEach(function(m){ m.hidden = !m.querySelector(".event-row:not([hidden])"); });
      track("event_filter", { filter: f, page_variant: variant });
    });
  }

  // 9. Anchor landings: re-align while lazy content above settles.
  (function anchorLanding(){
    if (!location.hash || location.hash.length < 2) return;
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (!target) return;
    var userScrolled = false;
    ["wheel","touchstart","keydown"].forEach(function(ev){ window.addEventListener(ev, function(){ userScrolled = true; }, { once: true, passive: true }); });
    function realign(){ if (!userScrolled) target.scrollIntoView({ block: "start" }); }
    [0, 400, 1200, 2500].forEach(function(ms){ window.setTimeout(realign, ms); });
  })();

  // 10. The house: windows light in sequence (left to right, door last) once
  //     the facade has painted, then stay lit. Reduced motion renders them lit.
  var house = document.getElementById("house");
  if (house) {
    // a hovered or focused portal warms its window (replaces :has(), which is costly to recalc)
    house.addEventListener("pointerover", warm); house.addEventListener("pointerout", warm);
    house.addEventListener("focusin", warm); house.addEventListener("focusout", warm);
  }
  function warm(e){
    var a = e.target.closest && e.target.closest(".house__portal"); if (!a) return;
    var on = e.type === "pointerover" || e.type === "focusin";
    house.querySelectorAll(".house__glow--" + a.getAttribute("data-portal")).forEach(function(g){ g.classList.toggle("is-warm", on); });
  }
  if (house && html.classList.contains("seq")) {
    var facade = house.querySelector(".house__facade img");
    function light(){ window.requestAnimationFrame(function(){ html.classList.add("lit"); }); }
    if (facade && !facade.complete) { facade.addEventListener("load", light, { once: true }); window.setTimeout(light, 2500); }
    else light();
  }

  // 11. Falling snow: a bounded canvas over the hero, paused off-screen and
  //     when the tab is hidden, never started under reduced motion.
  var canvas = document.querySelector(".snowfall");
  if (canvas && !reduced && canvas.getContext) {
    var ctx = canvas.getContext("2d"), flakes = [], running = false, raf = 0, W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size(){
      var r = canvas.parentNode.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + "px"; canvas.style.height = H + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, W * H / 6000));
      while (flakes.length < n) flakes.push(flake(true));
      flakes.length = n;
    }
    function flake(anywhere){ return { x: Math.random() * W, y: anywhere ? Math.random() * H : -6, r: .8 + Math.random() * 2.2, v: 18 + Math.random() * 34, d: (Math.random() - .5) * 14, p: Math.random() * 6.28 }; }
    var last = 0;
    function frame(t){
      if (!running) return;
      var dt = Math.min(.05, (t - last) / 1000 || 0); last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(244,246,250,.85)";
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i]; f.p += dt; f.y += f.v * dt; f.x += (f.d + Math.sin(f.p) * 9) * dt;
        if (f.y > H + 6 || f.x < -8 || f.x > W + 8) flakes[i] = f = flake(false);
        ctx.globalAlpha = .45 + (f.r / 3) * .55;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(frame);
    }
    function start(){ if (running) return; running = true; last = 0; raf = window.requestAnimationFrame(frame); }
    function stop(){ running = false; window.cancelAnimationFrame(raf); }
    // start after the page has settled so the snow never competes with the first paint
    var begin = function(){
      size(); window.addEventListener("resize", throttle(size, 250));
      if ("IntersectionObserver" in window) new IntersectionObserver(function(en){ en[0].isIntersecting && document.visibilityState === "visible" ? start() : stop(); }, { threshold: .02 }).observe(canvas);
      else start();
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(begin, { timeout: 2500 }); else window.setTimeout(begin, 1200);
    document.addEventListener("visibilitychange", function(){ document.visibilityState === "visible" ? start() : stop(); });
  }

  function throttle(fn, wait){
    var t = 0, timer = null;
    return function(){ var now = Date.now(), rem = wait - (now - t); if (rem <= 0) { t = now; fn(); } else if (!timer) { timer = setTimeout(function(){ t = Date.now(); timer = null; fn(); }, rem); } };
  }
})();
