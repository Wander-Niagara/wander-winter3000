---
version: 1
slug: "src-index-njk"
primary_target: "src/index.njk"
related_targets: ["src/eatdrinkplay.njk","src/outdoors.njk","src/events.njk","src/blog/index.njk"]
---

# Surface brief — `/winter/` home (the house) and the shared winter template

## Scope and mode

Persuade. The campaign microsite's home page and the template system every
other page inherits (`/winter/eatdrinkplay/`, `/winter/outdoors/`,
`/winter/events/`, `/winter/blog/`, articles, `/winter/privacy/`).
Comp-led, mobile-first: first-viewport comp is portrait 390×844; a 1440
desktop comp is the second.

## Audience, job, action, proof, constraints

- Mobile ad-feed visitors (Meta/Instagram, cold), late Nov to early Jan,
  planning a day trip or overnight within 90 minutes. Couples & friends,
  families, and an events-first ad set.
- Job: pick something to do this winter and click out to a business, event,
  itinerary or story. KPI: outbound clicks.
- Proof: MICHELIN recognition (two Stars, two Bib Gourmand, two Recommended),
  50+ wineries and icewine, drive times, GO Transit, real events and
  businesses (client data; `[PLACEHOLDER]` until supplied).
- Constraints: fall site anatomy and tracking mirrored exactly; IP constraint
  (original house, no film references); LCP < 2.5 s, house < ~350 KB on
  mobile; AA; reduced motion honoured; "St. Catharines and the Benchlands" in
  the first line of copy on every page, never as a kicker.

## Direction round (2026-10-22)

The brief pins the world and the form (facade-as-navigation). The roll ran for
the seed and its challengers: assigned index 4 of the grounded list; dealt
challengers ebru floated pigment, drum-machine step row, Versailles bosquet
vistas, sneaker-box stacks, variety telop field, grid-horizon sunset. All six
declined on both axes (audience identification, product clarity) against the
pinned direction. Raises kept from them, each a discipline, not clothes:

- **Sequenced reveal (Versailles):** the windows light as one authored
  sequence, left to right, door last, then hold.
- **One unbroken line (drum-machine row):** the "Choose a room" rail is one
  continuous row of brass plaques; it never breaks into cards.
- **Label grid ruling every card (sneaker boxes):** every business gift tag
  carries name / town / type in the same order.
- **One object, one pass (ebru):** the house is seen once, at one scale, from
  one point of view; interior pages never show a second house.
- **One horizon (grid horizon):** the snow line is the page's one horizon;
  headline, walk and plaque rail all sit on it.
- **Emphasis by scale, not position (telop):** the headline is the only large
  type in the first viewport.

Decision page not served: the user locked the pinned card in the brief and
asked for the comp round as the first gate. Telemetry ping sent (`grounded`).

## Direction contract

THESIS: The page is a house, not a page about a house. A red-brick Georgian
colonial at night, every window glowing from inside, decorated for Christmas in
the 1990 Rockwell-meets-English-country-house manner, is the whole first
viewport, and its door and lit windows are the navigation. It refuses the
category default (photo hero, headline, button, row of cards) and the poster
failure (a painting with no working parts): the facade carries the page, the
door and windows read as plainly clickable links, the headline is set text on
the snow, and the section below starts as a section.

OWN-WORLD: Warm inside, cold outside. Ground is warm night navy
`oklch(23% 0.047 265)`, never black, with slow falling snow; amber window glow
`oklch(85% 0.137 79)` / core `oklch(92% 0.081 84)` on blue-shadowed snow
`oklch(97% 0.006 265)` / `oklch(87% 0.031 259)`. Interior pages: Full
palette, one saturated field each: dining red `oklch(47% 0.171 26)` with
velvet red `oklch(53% 0.207 22)`; holly green `oklch(38% 0.077 150)` and bottle
green `oklch(31% 0.048 165)`; brass `oklch(74% 0.101 83)` and candle gold
`oklch(83% 0.109 84)` for metal, rules and focus rings; wallpaper cream
`oklch(94% 0.027 84)` with chintz rose `oklch(72% 0.095 8)` only inside a floral
paper; ink `oklch(24% 0.028 41)` on light. Materials: red brick and pale
mortar, white trim, black louvered shutters, brass lantern, velvet, tartan,
chintz, oriental-rug medallions, knit stockings, garland with red velvet bows,
warm-white mini-lights with halation, crystal chandelier, mahogany, film grain.
Components: buttons are brass door plaques or gift tags; cards are framed
prints with green mats or gift tags on a string; rules are garland or a thin
brass line; the newsletter is a letter in a brass mail slot; the FAQ is
stockings on a mantel; focus rings candle gold. Type: a heavy friendly
Clarendon/Cooper/Caslon-lineage display serif and a warm text serif, ranked by
font-match, self-hosted. Refused: cream page ground, lamplight-on-parchment,
glass/blur, neon, purple, gradient text, multicolour lights on the house,
emoji icons, kickers.

STORY: A visitor on a phone lands at the foot of a glowing house in the snow
and knows in two seconds: a winter escape to St. Catharines and the
Benchlands, and I can go inside. They tap the door for what's on, or a window
to eat and drink, get outdoors, stay, or read. Every room is warm and full of
real places to click through to. They leave with a plan and a business tab open.

FIRST VIEWPORT (390×844): slim header on night sky, Wander logo left, one
brass-plaque CTA "What's on" right. The house fills the width, cropped to the
central three bays: two ground-floor windows (dining room left with
chandelier; living room right with tree), the front door under its arched
portico with wreath and lantern, two dormers above; each a tap target ≥ 56 px.
Windows light in sequence over ~1.2 s (left to right, door last) and stay lit;
reduced motion renders them lit. Snow falls slowly behind. In the snow beneath
the steps, in the display face: "Winter is made for wandering", subline "A
holiday escape to St. Catharines and the Benchlands." Directly below, still in
the first scroll, "Choose a room": five brass-plaque links repeating the
portals. Desktop 1440: full facade centred with lawn and oaks, headline in the
snow left of the walk, room labels as hanging wooden signs under each window on
hover/focus.

FORM: Facade-as-navigation, pinned by the brief (my grounded list's
candidate 1 of 7; the roll assigned index 4, whose topology the pinned form
absorbs as the raises above). seed:b6a08690c77abdb9

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.

## Approved comp

`.impeccable/mocks/comp-a.png` (768×1662, 390:844), approved by the user on 2026-10-22; desktop companion `.impeccable/mocks/comp-a-desktop.png`.

## Portal map

| Portal | Destination | Room |
|---|---|---|
| Front door | `/winter/events/` | Foyer: red runner, garland on the banister |
| Ground floor left | `/winter/eatdrinkplay/` | Dining room: red walls, chandelier, lace table |
| Ground floor right | `/winter/outdoors/` | Living room: tree, mantel, stockings |
| Dormer left | `/winter/blog/` | Attic: quieter, cold daylight |
| Dormer right | `/winter/eatdrinkplay/#accommodations` | Primary bedroom: four-poster, red comforter |
| Side wing (desktop) | `#getting-here` | Kitchen: green tile, red cookware |

## Memorable moment

The windows lighting up one by one as the page lands, the door last, then a
tapped window warming and its hanging sign swinging into view.

## Unresolved

- Production hostname (`wanderniagara.com/winter/` vs `winter.wanderniagara.com`).
- Client photography, business list, dated events, article copy: placeholders
  until supplied.

## Type (measured 2026-10-22)

font-match on the headline region: Libertinus Serif 700 and Libre Caslon Text 700
tied at distance 0.462 (next: Ibarra Real Nova 0.500, Playfair 0.518). The tool's
USE line wrote Libertinus (first of the tie); the brief pins Caslon lineage, so the
build sets **Libre Caslon Text 700** as the display face (cap 51.8 comp px →
font-size 63 comp px / 32 CSS px at 390). Body: **Vollkorn** (variable, 400–700,
italic), ranked third for the subline shape and the warm readable text serif the
brief asks for. Both self-hosted from `assets/fonts/`.

## Plates (2026-10-23)

One lit render per viewport (portrait three-bay for mobile, five-bay wide for
desktop) is the source; `scripts/plates/facade.py` derives the unlit facade, the
per-portal glow overlays (inverse-screen, so facade + screen(glow) reproduces the
render exactly) and the snow band. Hotspot and glow boxes are in
`src/_data/portals.json` as percentages of each plate. The plates gate scores
structure against the comp crop at 21–36% because the render is a different
house in the same composition, not a crop of the comp; the user's plates review
decides whether the render stands in for the comp's house.
