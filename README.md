# Wander Niagara — Winter Campaign Microsite

Static, mobile-first landing pages for the **"Winter in St. Catharines & the
Benchlands"** paid-media campaign (Meta/Instagram, run by Loud and Clear),
Nov 2026 – Jan 2027.

**Primary KPI:** outbound link clicks to businesses, events, itineraries and the
directory. Every design and engineering decision serves fast load, mobile-first,
maximum measured click-through.

- **The idea:** the home page is a house. A red-brick colonial at night fills the
  first viewport and its front door and lit windows are the navigation. Each
  interior page is the room behind a window (dining room, living room, foyer,
  attic). See `DESIGN.md` for the visual system and `.impeccable/surfaces/` for
  the direction contract.
- **Stack:** [Eleventy 3](https://www.11ty.dev/) + Nunjucks, no client framework,
  ~15 KB of first-party JS (`assets/js/app.js`). Same anatomy, data shape and
  tracking as the fall site (`Wander-Niagara/fall`).
- **Preview:** GitHub Pages from this repo, built on every push to `main`:
  <https://wander-niagara.github.io/wander-winter3000/>
- **Production:** `https://wanderniagara.com/winter/` (static folder on the
  client's Flywheel host) or `winter.wanderniagara.com` with a CNAME; see
  *Going live*.
- **Pages:** `/`, `/eatdrinkplay/`, `/outdoors/`, `/events/`, `/blog/` and four
  stories under `/blog/<slug>/`, `/privacy/`.

---

## Quick start

```bash
npm install
npx @11ty/eleventy --serve
```

Open <http://localhost:8080/>. `--serve` (and `SHOW_PLACEHOLDERS=1` on a build)
renders labelled placeholders for every photo and embed slot the client has not
filled yet; a plain `npm run build` collapses them so nothing unfinished ships.

```bash
npm run build              # → _site/           (GitHub Pages preview, CI adds --pathprefix)
npm run build:flywheel     # → dist-flywheel/winter/  (production, index.php, /winter/ prefix)
```

---

## Project structure

```
assets/                 ← served as-is at /assets/
  css/critical.css      ← inlined in <head>: tokens, faces, header, the house, plaques
  css/main.css          ← deferred: sections, cards, room heroes, FAQ, newsletter, footer
  js/app.js             ← tracking + interactions (one file)
  fonts/                ← Libre Caslon Text + Vollkorn, self-hosted woff2
  plates/               ← the house and room plates (see "The house as plates")
  img/                  ← logos, regional map, OG image, favicons, article photos
src/
  _data/                ← EDIT THESE to change content (no template edits needed)
    site.js             ← nav, CTA labels, directoryUrl, ref param, drive times, social
    embeds.js           ← ★ analytics IDs, Whereabouts/CrowdRiff/Mailchimp values
    slots.js            ← ★ photo slots and widget slots (one named slot each)
    portals.json        ← ★ the portal map: window → page, hotspot boxes
    events.json         ← dated winter events (Nov/Dec/Jan), tags family/couples/free
    businesses.json     ← themed business cards per page (3–6 per theme)
    itineraries.json    ← itinerary card fallbacks when a tripper widget is empty
    faq.js              ← 9 winter FAQs (also emitted as FAQPage JSON-LD)
  _includes/            ← base.njk, layouts/, partials/
  blog/                 ← four stories (Markdown) + blog hub
  index.njk, eatdrinkplay.njk, outdoors.njk, events.njk, privacy.md
scripts/
  capture.mjs           ← screenshot helper (puppeteer-core + installed Chrome)
  plates/facade.py      ← derives unlit facade + glow overlays from one lit render
  plates/key.py, key2.py← chroma-key cutouts to alpha
```

---

## The portal map (`src/_data/portals.json`)

Each window and the door is a real `<a>` placed over the facade plate by
percentages, so the client can **re-map a window to a different page without
touching templates**: edit `href`, `label` and `ariaLabel` on the entry.

| Portal | `id` | Destination | Room behind it |
|---|---|---|---|
| Front door | `door` | `/events/` | Foyer: red stair runner, garland |
| Ground floor, left | `dining` | `/eatdrinkplay/` | Dining room: red walls, chandelier |
| Ground floor, right | `living` | `/outdoors/` | Living room: tree, mantel, stockings |
| Dormer, left | `dormer-left` | `/blog/` | Attic: quiet, cold daylight |
| Dormer, right | `dormer-right` | `/eatdrinkplay/#accommodations` | Bedroom: four-poster |

The order of the array is the light-up sequence (left to right, door last).
Each entry carries `mobile` and `desktop` boxes (`glass` = the tappable opening,
`glow` = where that portal's overlay plate sits), as percentages of the mobile
plate (`facade.png`, 1536×1823) and the desktop plate (`facade-wide.png`,
1536×1024). The side-wing/kitchen portal from the brief has no window in the
rendered desktop house and is not implemented.

Every portal fires `portal_click` (param `portal`) and the "Choose a room"
plaques repeat the five portals as text links, so no visitor depends on hitting
a window.

---

## The house as plates (`assets/plates/`)

One lit render per viewport is the source. `scripts/plates/facade.py` derives:

| File | What it is |
|---|---|
| `facade.png` + `-780/-1170/-1536.{avif,webp}` | Mobile three-bay facade, windows dark, candles lit |
| `glow-{door,dining,living,dormer-left,dormer-right}.png` + `-1x/-1.5x.{avif,webp}` | One amber glow overlay per portal; `mix-blend-mode: screen` over the facade reproduces the lit render exactly; opacity animates |
| `snow-ground.png` + variants | The snow band the headline sits in (graded cooler so white type reads) |
| `facade-wide.png`, `glow-wide-*.png` | The desktop five-bay facade and its overlays (plus a decorative upper-floor glow) |
| `wreath.png`, `lantern.png` | Reusable marks (favicon from the wreath) |
| `evergreen-left/right.png` | Boughs flanking the "Choose a room" section |
| `chandelier.png`, `tree.png`, `mantel.png`, `room-foyer.png`, `room-attic.png`, `room-bedroom.png` | Interior-page plates |
| `garland.png`, `stocking.png`, `mail-slot.png` | Section rule, FAQ marker, newsletter header |
| `brass-texture.png`, `chintz-tile.png`, `damask-tile.png`, `wood-tile.png` | Seamless material tiles (plaques, Stay the Night paper, foyer paper, hanging signs) |

Every raster carries its generation prompt (and derivation note) embedded as
metadata; read it with
`~/.claude/skills/impeccable/scripts/impeccable embed-prompt <file> --read`.
Images were generated with GPT Image 2.5 via Figma's image generator on
2026-10-22/25. The reference photos in the parent folder's `reference/` are
internal direction only and are not in this repo. **No film title, character
names or quotes appear anywhere on the public pages or in alt text.**

First-viewport weight on mobile (AVIF): facade 94 KB + snow 13 KB + five glows
≈ 109 KB → **~215 KB** of plates; the WebP fallback is ~437 KB.

---

## ★ What the client pastes where

Everything third-party lives in **`src/_data/embeds.js`** and **`src/_data/slots.js`**.
Leave a value empty and the module degrades gracefully.

| Slot | Where | Status |
|---|---|---|
| GA4 Measurement ID | `embeds.js` → `ga4Id` | Carried over from fall (`G-1JK9KHWCS3`, shared with the main site). **[PLACEHOLDER-DECISION]** keep shared (filter by `page_variant`) or create a winter property |
| Meta Pixel ID | `embeds.js` → `metaPixelId` | **[PLACEHOLDER]** from Loud and Clear |
| GTM (optional) | `embeds.js` → `gtmId` | empty |
| StackAdapt, Plausible | `embeds.js` | carried over from fall |
| Mailchimp action URL, honeypot, tag | `embeds.js` → `mailchimp` | fall values; **[PLACEHOLDER]** winter audience tag |
| Whereabouts itineraries (couples / families) | `slots.js` → `ITINERARIES_COUPLES`, `ITINERARIES_FAMILIES` | **[PLACEHOLDER]** fall tripper ids stand in |
| Whereabouts events widget | `slots.js` → `EVENTS` | fall widget stands in; shown under the JSON rows on `/events/` |
| MICHELIN operators widget | `slots.js` → `MICHELIN` | real, carried over |
| CrowdRiff gallery | `slots.js` → `CROWDRIFF_GALLERY` | **[PLACEHOLDER]** fall gallery stands in |
| Photography (home break, two-up, story heroes) | `slots.js` → `photos.*` | **[PLACEHOLDER]** all empty except the MICHELIN article photos |
| Wander logo SVG | `assets/img/logos/wander-footer.svg` (white) | fall lockup; replace if the client supplies a new file |

Whereabouts widgets are **origin-restricted**: they return "invalid widget" on
localhost and only render on the deployed origin.

---

## Placeholder checklist (still empty or marked `[PLACEHOLDER]`)

1. **Photos** — every `slots.js → photos` slot except the MICHELIN article set.
2. **Events** — all 12 rows in `events.json` need confirmed dates, venues and
   their own URLs (they point at wanderniagara.com/events/ for now).
3. **Businesses** — bracketed names in `businesses.json` are plausible stand-ins;
   every `url` still points at the Wander directory until outbound destinations
   are confirmed.
4. **Itineraries** — `itineraries.json` URLs, or the winter tripper widget ids.
5. **Stories** — `[PLACEHOLDER]` marks inside the four articles for names, hours
   and dates; the MICHELIN story reuses the client's real article copy.
6. **FAQ** — three answers carry `[PLACEHOLDER]` date/rink confirmations.
7. **Meta Pixel ID**, winter **Mailchimp tag**, winter **CrowdRiff** gallery.
8. **GA4 property decision** (shared vs winter-only).

---

## Tracking (this is the product)

Loaded lazily by `assets/js/app.js` (never blocks LCP). Event delegation on
`a[href^="http"]`; no per-link handlers.

| Event | When | Key params |
|---|---|---|
| `click_out` | any outbound link click | `destination_domain`, `destination_url`, `module`, `page_variant`, `card_label` |
| `first_click_out` | first outbound click of the session | same |
| `portal_click` | a window, door or room plaque is tapped | `portal` (door / dining / living / dormer-left / dormer-right), `module` (house-portal / house-list) |
| `scroll_depth` | 25 / 50 / 75 / 100% | `percent`, `page_variant` |
| `engaged_time` | 15 s of visible time | `seconds`, `page_variant` |
| `embed_view` | a lazy embed enters view | `module`, `page_variant` |
| `event_filter` | a Family / Couples / Free chip is used | `filter`, `page_variant` |
| `newsletter_prompt` / `newsletter_submit` | modal shown / form submitted | `trigger` / `location` |

`module` values: `house-portal`, `house-list`, `hero`, `header`, `theme`,
`events`, `stories`, `itinerary`, `directory`, `faq`, `map`, `newsletter`,
`sticky-cta`, `footer`, `home`, `gallery`, `article`. `page_variant`: `home`,
`couples` (eatdrinkplay), `families` (outdoors), `events`, `stories`.

**Meta Pixel:** a custom `OutboundClick` event mirrors `click_out`. Optimise
campaigns toward this custom conversion and buy Landing Page Views, not Link
Clicks.

**UTMs and the outbound `ref`:** inbound `utm_*` / `gclid` / `fbclid` are kept
in `sessionStorage`; outbound clicks get `?ref=wintercampaign` where safe
(skips hosts in `site.outboundRef.disabledDomains`, never double-appends).

**Verifying in GA4 DebugView:** build, load a page with `?_dbg=1` or the GA
Debugger extension, click a window and a business card, and confirm
`portal_click`, `click_out` (and `first_click_out` once) in Admin → DebugView.
`window.wnTrack(name, params)` is exposed for manual checks in the console.

---

## A/B setup for Loud and Clear

Variants are **separate URLs**; split traffic at the **ad-set level**, never
client-side.

| Ad set | Landing URL | `page_variant` |
|---|---|---|
| Couples & Friends | `/winter/eatdrinkplay/` | `couples` |
| Families | `/winter/outdoors/` | `families` |
| Events-first | `/winter/events/` | `events` |
| Retargeting / brand | `/winter/` (the house) | `home` |
| Story test (B) | `/winter/blog/<slug>/` | `stories` |

Compare `click_out` rate per `page_variant` in GA4. Every page carries the same
header, sticky CTA, tracking, FAQ, newsletter and footer, so comparisons stay
clean.

---

## Going live

### Preview (GitHub Pages)
Push to `main` → `.github/workflows/deploy.yml` builds with
`--pathprefix=/wander-winter3000/` and `SHOW_PLACEHOLDERS=1`, and deploys
`_site` to Pages. Enable Pages once in the repo settings with **Source: GitHub
Actions**. PRs get a build check (`ci.yml`).

### Production option A — folder on the WordPress host (`wanderniagara.com/winter/`)
Same pattern as the fall site:

1. `npm run build:flywheel` → `dist-flywheel/winter/` (pages written as
   `index.php` because Flywheel's Nginx only indexes `index.php`; the files
   contain no PHP).
2. Upload `dist-flywheel/winter/` into the WordPress root via SFTP (or
   `scripts/deploy-flywheel.sh` once copied from the fall repo with `.env`).
3. Flywheel dashboard → Advanced → **Flush Cache**.
4. Check `https://wanderniagara.com/winter/` in a private window; submit
   `https://wanderniagara.com/winter/sitemap.xml` to Search Console.

### Production option B — subdomain (`winter.wanderniagara.com`)
1. Add `src/CNAME` containing `winter.wanderniagara.com` and a passthrough
   copy for it in `.eleventy.js`; remove `--pathprefix` from `deploy.yml`.
2. DNS: `CNAME winter → wander-niagara.github.io`.
3. Repo Settings → Pages → Custom domain `winter.wanderniagara.com`, enforce HTTPS.
4. Set `site.url` in `src/_data/site.js` to the new origin.

Share URL for Loud and Clear: the production origin plus the landing page
paths above, no `www`, trailing slash.

---

## Accessibility and motion

- Every portal is a link with an accessible name, a 44 px minimum target, a
  candle-gold focus ring and a visible label on hover/focus.
- Keyboard order: skip link → logo → What's on → the five windows (left to
  right, door last) → the room plaques → page content.
- `prefers-reduced-motion`: windows render lit, no light-up sequence, no
  falling snow. Without JS the house is fully lit.
- FAQPage, Organization, WebPage and BlogPosting JSON-LD are emitted.

## Performance

- Critical CSS inlined; `main.css` deferred; two font files preloaded, all
  faces self-hosted.
- Facade preloaded with `fetchpriority="high"`; glows lazy with low priority;
  AVIF → WebP → PNG fallbacks with `srcset`.
- Falling snow is a bounded canvas, paused off-screen and when the tab is
  hidden; capped at 90 flakes.
- Third-party embeds are facades activated by `IntersectionObserver`.
