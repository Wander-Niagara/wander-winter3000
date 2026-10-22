# Product

<!-- impeccable:product-schema 1 -->

<!-- Written 2026-10-22 from Part A of the client's build prompt
     (`claude-code-winter-impeccable-prompt.md`), which pre-answered the init
     interview, plus the fall campaign repo (Wander-Niagara/fall) this site
     mirrors. Facts the brief did not state are marked (inferred). -->

## Platform

web

## Stack

Eleventy 3 + Nunjucks static site, no client framework, vanilla JS under ~15 KB
(the fall site's stack, reused by the brief's instruction). Deploys from `main`
via GitHub Pages (preview) with the fall site's Flywheel static-folder path as
the production target at `wanderniagara.com/winter/` (or `winter.wanderniagara.com`
with a `CNAME`; the client decides at cutover). Repo: `Wander-Niagara/wander-winter3000`.

## Users

- **Mobile visitors (80%+) from Meta/Instagram ads** run by Loud and Clear:
  cold traffic, late November to early January, planning a day trip or
  overnight within a 90-minute drive (Toronto, Hamilton, Buffalo, Niagara Falls).
- **Couples & Friends (30–65+):** wine, dining, shopping, boutique stays, nights out.
- **Families:** holiday lights, skating, trails, farms and holiday markets,
  kid-friendly attractions.
- A third ad set is **events-first** and lands on `/winter/events/`.

## Product Purpose

Wander Niagara's winter / holiday paid-media campaign microsite for
"St. Catharines and the Benchlands" (Niagara region, Ontario). The visitor's
job: choose something to do this winter and click through to a local business,
an event, an itinerary or a story.

**Primary KPI: outbound link clicks** (to businesses, events, itineraries,
listings, the directory). Secondary: dwell time and bounce rate.

## Positioning

- "St. Catharines and the Benchlands" appears in the first line of copy on every
  page (headline or subline; never a kicker).
- Niagara's "flip side": the region beyond the Falls, with Ontario's only
  two-MICHELIN-Star restaurant, 50+ wineries, icewine, the Escarpment and a
  walkable downtown, all 20 minutes from the Falls and 75 minutes from Toronto.
- Curated for two named audiences (couples & friends; families) rather than a
  generic things-to-do list; backed by live Whereabouts listings and events.

## Operating Context

- Businesses and events arrive as data files from the client (Whereabouts data
  or CSV) and partly as Whereabouts embed widgets; article ideas and all
  photography are client-supplied. CrowdRiff UGC gallery and Mailchimp
  newsletter embeds as on the fall site.
- Whereabouts widgets are origin-restricted and only render on the deployed
  origin, never on localhost (fall-site finding).
- Ads A/B test landing pages at the ad-set level (separate URLs, no client-side
  testing); `page_variant` must stay consistent per page.
- The fall site (`Wander-Niagara/fall`) is the structural template: page
  anatomy, data shape, tracking code, embeds slot file, footer, funders row,
  Getting Here block, FAQ, newsletter. Only the visual world and content change.

## Capabilities and Constraints

- Performance: LCP < 2.5 s on mid-tier mobile, CLS < 0.1, page weight < 1 MB
  before embeds; Lighthouse mobile Performance ≥ 90 on `/winter/`.
- Tracking: GA4 `click_out` on every outbound link (event delegation on
  `a[href^="http"]`) with `destination_domain`, `destination_url`, `module`,
  `page_variant`, `card_label`; `first_click_out` once per session; Meta Pixel
  custom `OutboundClick`; scroll depth 25/50/75/100; 15 s `engaged_time`; UTM
  preservation; `?ref=wintercampaign` appended where safe; campaign event
  `portal_click` with `portal`.
- FAQPage JSON-LD; Mailchimp exit-intent modal (desktop mouse-leave; mobile 70%
  scroll + 10 s idle; never before 30 s; once per 30 days) plus inline form.
- A single `directoryUrl` config value feeds every directory CTA; `embeds.json`
  holds every third-party ID with commented placeholders.
- Accessibility AA; keyboard reaches every control with visible focus;
  `prefers-reduced-motion` honoured.
- Pages: `/winter/`, `/winter/eatdrinkplay/`, `/winter/outdoors/`,
  `/winter/events/`, `/winter/blog/` + four articles, `/winter/privacy/`.
- Open: the production hostname (`wanderniagara.com/winter/` vs
  `winter.wanderniagara.com`) is the client's call at DNS cutover.

## Brand Commitments

- Product name: **Wander Niagara**. The Wander Niagara logo appears in header
  and footer (client supplies SVG; the fall repo's lockups are reused until then).
  Brand yellow `#FFD300` is confined to the logo and is **not** a campaign colour.
- **Voice:** warm, plain, grade 5–7 reading level, specific CTAs ("See the
  holiday market", never "Learn more"). Playful, never cutesy. ~400 words per
  page excluding FAQ.
- **Hard brand/IP constraint:** the look is inspired by a 1990 suburban-Chicago
  Christmas-movie house, but the site is an original work. No film title, logo
  lettering, character names, quotes, gags or references anywhere on public
  pages or in alt text. The reference photos in `../reference/` are internal
  direction only and never ship as assets.
- Binding visual constraint volunteered by the user (recorded, not expanded
  here): the brief's pinned world in `claude-code-winter-impeccable-prompt.md`
  Part B, a red-brick Georgian house at night as the home page's navigation.

## Evidence on Hand

- Real MICHELIN Guide recognition (2026 Toronto & Region Guide): Restaurant
  Pearl Morissette (two Stars, Jordan), Les Incompétents and RPM Bakehouse (Bib
  Gourmand), OddBird and Fat Rabbit (Recommended); the fall site's MICHELIN
  article is reusable verbatim.
- Drive times: Toronto 1 hr 15 min, Hamilton 30 min, Buffalo 45 min, Niagara
  Falls 20 min; GO Transit serves St. Catharines.
- The illustrated regional map (`wander-map.png/.webp`), funders' logos
  (Ontario, Visit Niagara Canada, Town of Lincoln, Niagara Benchlands, LoveSTC,
  City of St. Catharines), TIAO logo, Wander lockups, social handles: all in the
  fall repo and copied over.
- Live GA4 property `G-1JK9KHWCS3` (shared with the main site), Plausible,
  StackAdapt pixel, Mailchimp action URL and Whereabouts access id: in the fall
  repo's `embeds.js` / `slots.js`.
- **Absent, must not be fabricated as fact:** winter business list, dated winter
  events, itineraries, winter photography, article copy. Until the client
  supplies them, placeholders are plausible Niagara-flavoured and marked
  `[PLACEHOLDER]` so stakeholder demos read well.

## Product Principles

1. **Outbound clicks are the product.** Every module exists to send someone to
   a real place; every card is a link and every link is measured.
2. **Phone in the ad feed first.** 390 px portrait is the design viewport;
   desktop adapts.
3. **Two audiences, named.** Couples & friends and families each find their
   path in one tap; events-first traffic lands on events.
4. **Mirror the fall site's bones.** Same anatomy, data shape and tracking so
   the client and Loud and Clear operate both sites the same way.
5. **Original, not a replica.** The archetype (red-brick Georgian in warm-white
   lights) is ours; the film and the address are not.

## Accessibility & Inclusion

WCAG AA. Every house portal is a real link with an accessible name, 44 px
minimum target, visible candle-gold focus ring, and a plain text equivalent
("Choose a room") directly below the house. Reduced-motion users see the house
fully lit with no sequence and no falling snow.
