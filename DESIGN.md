---
name: Wander Niagara Winter
description: A red-brick house at night whose door and windows are the navigation; warm inside, cold outside.
colors:
  night: "oklch(23% 0.047 265)"
  night-2: "#0d1526"
  dusk: "#2b4a7a"
  snow: "oklch(97% 0.006 265)"
  snow-2: "oklch(87% 0.031 259)"
  dining-red: "oklch(47% 0.171 26)"
  velvet-red: "oklch(53% 0.207 22)"
  holly-green: "oklch(38% 0.077 150)"
  bottle-green: "oklch(31% 0.048 165)"
  brass: "oklch(74% 0.101 83)"
  candle-gold: "oklch(83% 0.109 84)"
  window-glow: "oklch(85% 0.137 79)"
  glow-core: "oklch(92% 0.081 84)"
  wallpaper-cream: "oklch(94% 0.027 84)"
  chintz-rose: "oklch(72% 0.095 8)"
  brick: "#7a3b2e"
  ink: "oklch(24% 0.028 41)"
  ink-on-night: "#f1ece2"
  ink-soft-night: "#c6c9d6"
typography:
  display:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "clamp(34px, 9vw, 64px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "clamp(24px, 5.4vw, 36px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "clamp(18px, 4.4vw, 22px)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Vollkorn, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.01em"
rounded:
  plaque: "2px"
  sign: "3px"
  stocking: "4px"
  chip: "999px"
spacing:
  gutter: "16px"
  tag-gap: "14px"
  section-mobile: "40px 0 44px"
  section-desktop: "64px 0 72px"
  max: "1200px"
components:
  plaque:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.plaque}"
    padding: "8px 24px"
    height: "44px"
  plaque-sm:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plaque}"
    padding: "6px 22px"
    height: "40px"
  chip:
    backgroundColor: "transparent"
    textColor: "inherit"
    rounded: "{rounded.chip}"
    padding: "12px 16px"
    height: "44px"
  chip-pressed:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
  tag:
    backgroundColor: "{colors.wallpaper-cream}"
    textColor: "{colors.ink}"
    padding: "26px 18px 16px"
    width: "min(78%, 290px)"
  print:
    backgroundColor: "{colors.bottle-green}"
    rounded: "{rounded.plaque}"
    padding: "14px"
  event-date-plate:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "6px 4px"
    height: "56px"
  faq-stocking:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "{colors.ink-on-night}"
    rounded: "{rounded.stocking}"
    padding: "14px 16px"
  letter:
    backgroundColor: "{colors.wallpaper-cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plaque}"
    padding: "26px 22px 24px"
    width: "min(100%, 560px)"
  input-email:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "10px 14px"
    height: "46px"
  house-sign:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sign}"
    padding: "7px 12px 6px"
  house-sign-desktop:
    backgroundColor: "{colors.holly-green}"
    textColor: "#f6ecd6"
    rounded: "{rounded.sign}"
    padding: "9px 16px 8px"
---

# Design System: Wander Niagara Winter

## Overview

**Creative North Star: "The Lit House in the Snow"**

The page is a house, not a page about a house. The home surface is a red-brick Georgian at night, every window glowing from inside, and its door and windows are the site's navigation. Every other page is the room behind one of those windows: the dining room (eat, drink and shop), the living room (outdoors), the foyer (events), the attic (stories), the bedroom (stay). The world is warm inside, cold outside: a night-navy sky with blue-shadowed snow and slow falling flakes outside; amber glow, brass, velvet red, holly green, damask paper and mahogany inside.

Everything interactive is a physical object from that house. Buttons are brass door plaques with two rivets. Cards are gift tags on a red string or photos in a mahogany frame with a green mat. Rules between movements are a garland plate; rules inside a section are a thin brass line. The FAQ is stockings on a mantel shelf. The newsletter is a letter in a brass mail slot. Dates on the events page are small brass plates. Nothing is glass, nothing blurs, nothing glows neon; the only light is amber window light and candle-gold focus rings.

Density is a campaign site on a phone: 390 px portrait is the design viewport, one saturated field per section, 17 px Vollkorn body, Caslon headings that stay large and few. Desktop widens to 1200 px and adds the lawn, the oaks, the fifth bay and the hanging wooden signs under each window; it does not add a second house or a second visual idea.

**Key Characteristics:**
- Night-navy page ground, never black, never cream; cream and snow appear only as paper, cards and the funders band.
- Each interior page owns one saturated field (dining red, holly green, damask-on-red foyer, attic dusk blue); accents inside a field are brass, candle gold and glow-core, never a second field colour.
- Two self-hosted serifs: Libre Caslon Text 700 for every heading, label and control; Vollkorn for body, italics and metadata.
- Components are house objects (plaque, tag, print, sign, stocking, letter, mail slot, garland); none of them is a generic card or pill.
- One authored motion moment (windows light left to right, door last), one hover grammar (a window warms, its sign drops), snow bounded to the hero and static under reduced motion.
- Film grain at 7% soft-light over the house and the room heroes; depth by inset bevels and soft drop shadows, not by layering blur.

## Colors

A night exterior palette and a warm interior palette that never trade places: navy and blue-shadowed snow outside, amber, brass, red, green and cream inside.

### Primary
- **Night** (`night`): the page ground on every page, the header sky, the `.field--night` sections, the gift-tag string hole. The whole site sits on it; `color-scheme: dark` is declared from it.
- **Night Deep** (`night-2`): footer, modal backdrop (at 82% alpha), sticky-CTA bar (at 92% alpha), the empty photo well inside a framed print.
- **Window Glow** (`window-glow`) and **Glow Core** (`glow-core`): the amber of the lit windows. Glow lives in the plates (screen-blended overlays); in CSS, glow-core is the link colour on red, damask, green and dusk fields and the "Event details" arrow.

### Secondary
- **Dining Red** (`dining-red`): the dining-room and foyer hero fields, the events page field, the "keep exploring" band on articles, the gift-tag "go" link and its underline, the on-light text link, the modal close glyph, the email caret.
- **Velvet Red** (`velvet-red`): the gift tag's hanging string only.
- **Holly Green** (`holly-green`): the living-room hero field, the gift-tag photo's top edge, the wooden sign's wood.
- **Bottle Green** (`bottle-green`): the mat inside every framed print, and the `.field--bottle` sections (MICHELIN, itineraries on blog, the article widget band).
- **Dusk** (`dusk`): the attic hero on `/blog/`, the one cold interior; secondary text there is `#d6e0f2` / `#cdd8ea`.

### Tertiary
- **Brass** (`brass`): every control surface (plaque, chip border and pressed fill, event date plate, mobile sign), thin rules, scrollbar thumb, the dashed widget-slot border, nav hover underline, social ring. Always carries the brass texture plate on plaques, signs and date plates.
- **Candle Gold** (`candle-gold`): focus rings (3px outline, 3px offset) on every control, text selection, text links on night, the italic emphasis in a lede, the "+"/"–" of accordions, the audience and "On now / This weekend" badges, the skip link.
- **Wallpaper Cream** (`wallpaper-cream`): paper surfaces only: gift tags, the letter, label cards, the chintz stay section, Whereabouts card surfaces. Never a page ground.
- **Chintz Rose** (`chintz-rose`): lives inside the chintz tile plate and nowhere in CSS.
- **Brick** (`brick`): the email input's 2px border.

### Neutral
- **Snow** (`snow`) and **Snow in Shadow** (`snow-2`): the headline and subline on the house, the snowflakes (`rgba(244,246,250, …)`), the funders band and the region-map well, the TIAO logo tile.
- **Ink** (`ink`): text on every light surface (plaques, tags, letter, cream, snow). Supporting text on cream is `#5b4336`, `#6b4b3c`, `#3f2a22`.
- **Ink on Night** (`ink-on-night`) and **Soft Ink on Night** (`ink-soft-night`): body and secondary text on navy; secondary text on red fields is `#f3d9cf` / `#f0d6cc`, on green `#cfdcc9`.

### Named Rules
**The One Field Rule.** A section or room hero sits on exactly one field (night, red, damask-on-red, holly, bottle, dusk, chintz, snow). Within it, the only accents are brass, candle gold, glow-core and cream paper; a second field colour never appears as an accent.

**The Paper Rule.** Cream and snow are objects (tag, letter, label card, funders band), never the page. The page is always night.

**The Logo-Only Yellow Rule.** Brand yellow `#FFD300` exists only inside the Wander logo lockups; no CSS token carries it and no surface may introduce it.

**The One Light Rule.** House light is warm amber (glow / glow-core) and nothing else. No multicolour lights on the facade; the tree's ornaments inside the living-room window are the single exception the render carries.

## Typography

**Display Font:** Libre Caslon Text 700 (with Georgia, Times New Roman, serif), self-hosted woff2, latin and latin-ext subsets, 400 and 400 italic also loaded.
**Body Font:** Vollkorn variable 400–900 upright and italic (with Georgia, serif), self-hosted, oldstyle numerals on by default.

**Character:** A heavy, friendly Caslon speaks for the house (every heading, every control, every caption and sign); a warm, readable Vollkorn carries the copy, and its italic carries metadata (town, venue, dek, drive-time notes). Headings are tightly tracked (−0.01 to −0.015em) and balanced.

### Hierarchy
- **Display** (700, `clamp(34px, 9vw, 64px)`, 1.04): room-hero `h1` on interior pages, max 14ch. The house headline is its own size: `clamp(30px, 8.2vw, 48px)` in the mobile snow band, `clamp(40px, 4vw, 58px)` on the desktop lawn, snow-white with a two-layer soft text shadow. Article `h1` is `clamp(30px, 7.6vw, 52px)`.
- **Headline** (700, `clamp(24px, 5.4vw, 36px)`, 1.08): section `h2`. Variants: "Choose a room" `clamp(21px, 5.6vw, 30px)`; two-up feature `clamp(26px, 6.4vw, 44px)` with an italic candle-gold `em`; letter `h2` `clamp(22px, 5.4vw, 30px)`.
- **Title** (700, `clamp(18px, 4.4vw, 22px)`, 1.2): `h3`, story titles, gift-tag names (19px), event titles (18px), month headers (20px, with a brass fade rule).
- **Body** (400, 17px, 1.55): all copy; ledes and secondary copy in soft ink. Article prose is 18px / 1.65 at 66ch; FAQ answers 16px at 72ch; card blurbs 15px / 1.45.
- **Subline** (Vollkorn 400, `clamp(17px, 4.4vw, 22px)`, 1.35): room-hero sub at 40ch; the house subline is Caslon 400 `clamp(15px, 3.85vw, 19px)` on mobile and `clamp(17px, 1.5vw, 22px)` at 34ch on desktop.
- **Label** (Caslon 700, 13–16px, +0.01em): plaque text (15px / 14px small), chips (14px), signs (13px mobile, 15px desktop), date plates (13px), print captions (14px), text links (16px), footer `h4` (17px).
- **Micro label** (Vollkorn 600–700, 11–12px, +0.04 to +0.08em, uppercase): weekday on a date plate, "On now / This weekend" badge, audience badge on a story mat, placeholder slot labels. These are the only uppercase settings in the system.

### Named Rules
**The Caslon Controls Rule.** Anything you can press or read as a sign is set in Libre Caslon Text 700: plaques, chips, signs, date plates, links, captions. Vollkorn never appears on a control.

**The Italic Metadata Rule.** Secondary facts (town, venue, duration, dek, byline) are Vollkorn italic at 15px, never a kicker above the title. "St. Catharines and the Benchlands" lives in the first line of copy, never as a kicker.

**The One Large Type Rule.** The headline is the only large type in the first viewport; the house, the snow and the plaque rail carry everything else at label size.

## Layout

Mobile-first at 390 px portrait; desktop breakpoint at 900 px (tags also break at 600, stories at 700 and 1100, funders at 700 and 1000). Content is held by `.wrap` at `max-width: 1200px` with a `16px` gutter; the house on the home page escapes the wrap and fills the viewport width (mobile three-bay plate at 1536×1823, desktop five-bay plate at 1536×1024, height `min(plate ratio, 100svh)`).

The house sets the page's one horizon: on mobile the headline sits in a snow plate pulled up under the steps (`margin-top: -105/1536 × 100%`), on desktop it sits on the lawn, bottom-left of the walk. Directly beneath, the "Choose a room" rail repeats the five portals as plaques: a single column at `min(72%, 300px)` with 7px gaps on mobile, one unbroken row with 12px gaps on desktop, flanked by evergreen plates (21.5% width, max 120 / 170px). The header is 52px (64px desktop), absolute over the sky on the home page, flowing on interior pages; the desktop nav is Caslon 17px with 28px gaps.

Interior pages open with a room hero: a grid of text and plate at `min-height: 52vh` (62vh desktop), two columns 1.05fr / 0.95fr from 900px, `h1` at 14ch, sub at 40ch, plaque CTAs in a wrapping row with 14px / 18px gaps. Sections run `40px 0 44px` on mobile and `64px 0 72px` on desktop, heads capped at 62ch, CTAs 22px below content. Gift tags are a horizontal snap scroller (`min(78%, 290px)` columns, 14px gaps, bleeding into the gutter) on mobile and an auto-fit grid of ≥240px columns on desktop. Stories are one column, two at 700px, four at 1100px when marked `--4`. Events stay at 880px with an 80px (88px desktop) date column. The garland rule is `min(86%, 760px)` wide, overlapping the next section by 6px.

A sticky bottom CTA (plaque small + gold text link, on night-deep at 92% with a brass hairline) appears on mobile once the hero sentinel leaves the viewport; it is hidden at 900px and up.

## Elevation & Depth

Depth is material, not atmospheric. Objects are bevelled with inset highlights and shadows (brass plaques, date plates, mats) and sit on the field with soft, dark, downward shadows; the field itself is flat except for the 7% soft-light film grain over the house and room heroes and the damask tile multiplied into the red rooms (16% dining, 38% foyer). No backdrop blur, no glass, no gradient text anywhere; the only gradients are the mahogany frame, the brass hairline fade, the mantel shelf and the rivet highlight.

### Shadow Vocabulary
- **Brass bevel** (`inset 0 1px 0 rgba(255,246,220,.55), inset 0 -1px 0 rgba(60,35,10,.55), inset 0 0 0 1px rgba(120,85,30,.35)`): plaques and date plates, with a `0 1px 0 rgba(255,246,220,.45)` text shadow to engrave the label.
- **Frame drop** (`0 10px 24px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,220,170,.18)`): the mahogany print frame; its mat recesses with `inset 0 0 0 1px rgba(0,0,0,.35), inset 0 2px 6px rgba(0,0,0,.35)`.
- **Hanging object** (`0 6px 16px rgba(0,0,0,.35)` tag; `0 14px 30px rgba(0,0,0,.45)` letter; `0 6px 14px rgba(0,0,0,.4)` mantel shelf; `0 3px 8px rgba(0,0,0,.45)` mobile sign, `0 4px 10px rgba(0,0,0,.5)` wooden sign): things that hang or rest cast a soft shadow onto the field.
- **Label card edge** (`0 2px 0 var(--brass), 0 8px 18px rgba(0,0,0,.18)`): a cream card sitting on a brass lip.
- **Headline on snow** (`text-shadow: 0 1px 2px rgba(0,0,0,.35), 0 3px 12px rgba(0,0,0,.3)`; desktop `0 1px 2px rgba(0,0,0,.5), 0 6px 22px rgba(0,0,0,.5)`): lifts snow-white type off the plate.
- **Focus halo on the house** (`0 0 0 6px rgba(18,28,51,.6)` behind the 3px gold outline): keeps the ring legible over bright glow.

### Named Rules
**The No-Glass Rule.** Nothing uses `backdrop-filter`, translucency over imagery or blurred panels. Overlays (sticky bar, modal backdrop) are night-deep at 82–92% alpha, flat.

**The Soft-Shadow Rule.** Every drop shadow is black at 18–50% alpha with blur at least twice its offset. There are no hard offset shadows; the only solid offset is the 2px brass lip under a label card.

## Shapes

Corners are nearly square: 2px on paper and plaques, 3px on signs, date plates, inputs and the brass rule ends, 4px on the stocking accordions and widget slots. The only round things are rivets, the string hole, social rings, the modal close and the 999px filter chips. Silhouettes come from clip-paths and pseudo-elements rather than radius: the plaque is an octagon (9px chamfers) with a 7px rivet at each end; the gift tag has one 18px clipped corner, a brass-ringed hole and a 2px velvet-red string rotated 14°; the sign hangs from a 1px (2px desktop) brass wire. Rules are either an image plate (garland) or a 1px line fading in and out of brass; borders are 1px brass at ~30% alpha (events rows, drive times, FAQ, footer rule) or 2px brass (chips, social rings) or 2px brick (email input). Images are hard-edged inside their mats at 4:3, 3:4, 16:9 or 16:10; the region map is 1600:1034 contained on snow.

## Components

### Buttons: the brass plaque
A brass door plaque with two rivets; the one button shape on the site.
- **Shape:** octagonal clip (9px chamfers) over a 2px radius, 44px minimum height (40px for `--sm`), rivets at 10px / 8px from each end.
- **Primary:** brass with the brass texture plate at 220px, ink text, Caslon 700 15px (+0.01em), padding `8px 24px` (`6px 22px` small), brass bevel and engraved text shadow.
- **Hover / Active / Focus:** `filter: brightness(1.07)` on hover; `translateY(1px)` on press; 3px candle-gold outline at 3px offset. Transitions 180ms on `--ease-out` (`cubic-bezier(.16,1,.3,1)`).
- **Text link (`.tlink`):** Caslon 700 16px in candle gold with a 2px underline at 55% alpha and 4px offset; dining red on light; glow-core on red, damask, green and dusk fields.

### Chips
Pill filters on the events page, one row, wrapping, 8px gaps.
- **Style:** transparent with a 2px brass border, 999px radius, Caslon 700 14px, 44px tall, `12px 16px` padding, inherit text colour.
- **State:** `aria-pressed="true"` fills brass with ink text; focus is the 3px gold ring at 2px offset. A live status line below is Vollkorn italic 15px.

### Cards: gift tag
A business or itinerary on a cream tag hanging from a red string.
- **Corner Style:** one 18px clipped top-left corner; a 9px night hole ringed 2px brass; a 2px velvet-red string rising 30px at 14°.
- **Background:** wallpaper cream, ink text; padding `26px 18px 16px`; rows name (Caslon 700 19px) / town (Vollkorn italic 15px `#6b4b3c`) / blurb (15px `#3f2a22`) / go link (Caslon 700 14px dining red, 2px red underline). An optional photo bleeds to the tag edges at 3:2 with a 3px holly-green top edge. Every tag carries name / town / type in the same order.
- **Hover:** `translateY(-3px) rotate(-.6deg)` over 220ms.
- **Layout:** snap scroller on mobile with a brass scrollbar; grid on desktop.

### Cards: framed print
A photo in a mahogany frame with a bottle-green mat; also wraps stories, the room plates for foyer, attic and bedroom, and the region map.
- **Frame:** 14px padding of mahogany gradient (`#5a2d1a → #3b1a0f → #6a3a22`), 2px radius, frame drop shadow.
- **Mat:** 10px bottle green, recessed. Image aspect 4:3 default (`--portrait` 3:4, `--wide` 16:9, large stories 16:10); the empty well is night-deep with a brass uppercase placeholder label.
- **Caption:** Caslon 700 14px in `#f1e6cf`; story titles on the body below the mat with a candle-gold audience badge pinned to the mat's top-left. Hover underlines the title in gold.

### Event rows and date plates
- **Row:** two columns (80px / 88px date, 1fr body), `12px 0` padding, 1px brass hairline (28%) beneath; title Caslon 700 18px, meta Vollkorn italic 15px, blurb 15px, "Event details →" in glow-core. Past rows drop to 72% opacity and move into a `<details>` "Past events" list. Hover underlines the title in gold.
- **Date plate:** a small brass plaque 56px tall, 3px radius, Caslon 700 13px ink with a Vollkorn 700 11px uppercase weekday in `#5a3d16` above; bevel and engraved shadow as the plaque.
- **Badge:** candle gold, ink, Vollkorn 700 11px uppercase (+0.06em), 2px radius; text set by script ("On now", "This weekend").
- **Month header:** Caslon 700 20px followed by a 1px brass-to-transparent rule.

### FAQ: stockings on a mantel
- **Shelf:** an 18px plaster shelf (`#fbf7ef → #cbbfa9`) with a 10px apron below, soft shadow.
- **Stocking:** each `<details>` is a 4px-radius panel on `rgba(255,255,255,.04)` with a 1px brass border (30%); summary grid `26px 1fr auto`, a 26px stocking plate as the marker, Caslon 700 17px question, a candle-gold "+" that becomes "–" when open. Answer indents 54px, 16px / 1.55 soft ink, 72ch. Focus ring sits inside (−3px offset). On light fields the panel is white at 55% with a brick border and dining-red glyph and links.

### Newsletter: the letter in a mail slot
- **Letterbox:** centred stack; the brass mail-slot plate at `min(72%, 420px)` above a cream letter at `min(100%, 560px)`.
- **Letter:** cream, ink, `26px 22px 24px`, 2px radius, deep hanging shadow, a 1px brick inset edge and a dashed dining-red inner border inset 8px. `h2` Caslon `clamp(22px, 5.4vw, 30px)`; copy 16px `#5b4336`.
- **Form:** one column, `1fr auto` from 600px; the submit is a plaque ("Post my letter").

### Inputs / Fields
- **Style:** white, 2px brick border, 3px radius, 46px tall, `10px 14px`, Vollkorn 17px ink, placeholder `#8a6f62`, caret dining red.
- **Focus:** 3px candle-gold outline at 2px offset. No error or disabled styling exists.

### Navigation
- **Header:** 52px / 64px bar on the night sky; Wander logo at 32px / 34px left; desktop links Caslon 17px in ink-on-night with a 2px transparent bottom border that turns brass on hover; one small plaque CTA right ("What's on"; "Eat and drink" on the events variant). No mobile menu: the house and the plaque rail are the mobile navigation.
- **House portals:** real links positioned by percentage from `portals.json` over the facade plate, 44px minimum on mobile, 3px radius, gold tap highlight at 25%; focus is the 3px gold outline plus the night halo. Tab order is door first (priority), light-up order is left to right, door last (array order).
- **Signs:** each portal carries a hidden label that drops on hover or focus: on mobile a brass tag (Caslon 700 13px ink, `7px 12px 6px`, 3px radius) hung from a 1px brass wire 6→10px below the window; on desktop a wooden sign (holly green with the wood tile, `#f6ecd6` text, 15px, `9px 16px 8px`) on a 14px brass wire; the dining sign hangs above its window. 300ms on `--ease-out`.
- **Choose a room rail:** five full-width plaques in one column (mobile) or one unbroken row (desktop), never cards.
- **Sticky CTA (mobile):** slides up 350ms when the hero leaves view.

### Room heroes
One per interior page; the room behind the window the visitor tapped, and the only place a room appears.
- **Dining** (`/eatdrinkplay/`): dining red with damask multiplied at 16%; a chandelier plate hangs from the top (`min(58%, 360px)`, pulled up 36px / 56px).
- **Living** (`/outdoors/`): holly green; tree plate (52%, overlapping the mantel by 22%) over the mantel plate (88%).
- **Foyer** (`/events/`): dining red with damask multiplied at 38%; the hall as a framed print at `min(100%, 560px)`.
- **Attic** (`/blog/`): dusk blue, `#eef2fa` text; the attic as a framed print.
- All carry the 7% film grain; `h1` display, sub Vollkorn, plaque CTAs with an optional gold text link.

### Rules
- **Garland** between the house and the sections and before the page tail: the garland plate at `min(86%, 760px)`, overlapping 6px.
- **Brass line** inside sections: 1px, fading from transparent to brass between 20% and 80%; a 120px short variant centred under a head.

### Motion
- **The light-up:** `html.seq` is set only when motion is allowed; glows start at opacity 0 and fade in over 420ms on `--ease-out`, each delayed `i × 220ms + 120ms` in portal order (dormer-left, dining, living, dormer-right, door), after the facade image loads (2.5 s fallback). They then hold. Without `.seq` (reduced motion, or no JS) the windows are simply lit.
- **Warming:** hovering or focusing a portal adds `.is-warm` to its glow (`brightness(1.18) saturate(1.05)`, 250ms) and drops its sign.
- **Snow:** a `<canvas>` bounded to the hero, up to 90 soft radial flakes (0.6–2.2px, 16–46px/s, sine drift), DPR capped at 2, started on idle, paused when off-screen or the tab is hidden; under reduced motion one static scatter is drawn and redrawn on resize.
- **Everything else:** 180–350ms on `--ease-out`; `scroll-behavior: smooth` off under reduced motion.

## Do's and Don'ts

### Do:
- **Do** set every new page on night and give each new section one field (`.field--night`, `--red`, `--damask`, `--green`, `--bottle`, `--dusk`, `--chintz`, `--snow`); use brass, candle gold, glow-core and cream objects as the accents inside it.
- **Do** make every button a `.plaque` (or `.plaque--sm`) and every secondary action a `.tlink`; both are Libre Caslon Text 700.
- **Do** present a business, itinerary or place as a gift tag with name / town / type in that order, and a photo or story as a framed print with a bottle-green mat.
- **Do** give every control a 3px candle-gold `:focus-visible` outline (3px offset; 2px on chips and inputs; −3px inside stockings) and a 44px minimum target.
- **Do** keep "St. Catharines and the Benchlands" in the first line of copy (headline or subline) on every page.
- **Do** carry the brass texture plate on every brass surface (plaques, date plates, mobile signs) and the 7% soft-light grain on heroes.
- **Do** honour `prefers-reduced-motion`: windows render lit, snow renders as a static scatter, smooth scroll is off.
- **Do** add new portals, labels and destinations in `src/_data/portals.json`, never by hand in templates; array order is the light-up order, `priority` is tab order.

### Don't:
- **Don't** put cream, parchment or snow under a page or section as ground; cream and snow are paper and funders band only (The Paper Rule).
- **Don't** use `backdrop-filter`, glass panels, blur, neon, purple or gradient text anywhere.
- **Don't** add coloured or multicolour lights to the house or to the glow plates; house light is amber only.
- **Don't** use brand yellow `#FFD300` outside the Wander logo lockups.
- **Don't** add kickers or eyebrows above headings; secondary facts go in Vollkorn italic beneath the title, and the only uppercase settings are the 11–12px micro labels on date plates, badges and placeholders.
- **Don't** use emoji or glyph icons; the only icons are inline SVG social marks and the stocking, garland, mail-slot and evergreen plates.
- **Don't** render a second house, a second facade crop or a photo-hero-plus-cards layout on any page; the house is seen once, on the home page, at one scale.
- **Don't** break the "Choose a room" rail into cards or add a hamburger menu; the house and the plaque rail are the mobile navigation.
- **Don't** add a second authored animation; the light-up, the warming and the snow are the whole motion budget.
