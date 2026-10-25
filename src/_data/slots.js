// -----------------------------------------------------------------------------
// PENDING-ASSET SLOTS — the single swap-in file for Whereabouts / CrowdRiff
// embeds and client photography. Paste the embed code (or image path) into
// `embed`; while empty, the slot shows a labelled placeholder in dev
// (`--serve`, or SHOW_PLACEHOLDERS=1) and collapses to nothing in production.
// Winter widget ids are [PLACEHOLDER]: the fall ids below are real and work on
// the deployed origin, so stakeholder demos render live data until the client
// supplies winter-specific lists.
// -----------------------------------------------------------------------------
const embeds = require("./embeds.js");
const showPlaceholders =
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.SHOW_PLACEHOLDERS === "1";
const W = embeds.whereabouts;
const operators = (id) => `<whereabouts-operators-widget widget-id="${id}" access-id="${W.accessId}"></whereabouts-operators-widget><script src="${W.operatorLoader}" type="module"></script>`;
const tripper   = (id) => `<whereabouts-tripper-widget widget-id="${id}" access-id="${W.accessId}"></whereabouts-tripper-widget><script src="${W.tripperLoader}" type="module" crossorigin="anonymous"></script>`;
const events    = (id) => `<whereabouts-events-widget organization-id="${W.accessId}" widget-id="${id}" style="display:block;min-height:360px"></whereabouts-events-widget><script src="${W.eventLoader}" type="module"></script>`;

module.exports = {
  showPlaceholders,

  // Photography slots (client-supplied). Paths under /assets/img/photos/.
  // Every slot is [PLACEHOLDER] until the client's winter selects land.
  photos: {
    HOME_BREAK_LIGHTS:   { label: "Photo — holiday lights, downtown St. Catharines (portrait)", embed: "", alt: "" },
    HOME_BREAK_VINES:    { label: "Photo — Benchlands vineyard rows in snow (landscape)",       embed: "", alt: "" },
    HOME_BREAK_WIDE:     { label: "Photo — couple with wine by a fire (wide)",                  embed: "", alt: "" },
    HOME_TWOUP_URBAN:    { label: "Photo — St. Paul Street at night, decorated storefronts",     embed: "", alt: "" },
    HOME_TWOUP_RURAL:    { label: "Photo — Jordan Village or a winery barn in snow",             embed: "", alt: "" },
    EAT_HERO:            { label: "Photo — dining room page hero (optional, over the red field)", embed: "", alt: "" },
    OUTDOORS_HERO:       { label: "Photo — living room page hero (optional, over the green field)", embed: "", alt: "" },
    EVENTS_HERO:         { label: "Photo — foyer page hero (optional)",                          embed: "", alt: "" },
    BLOG_WEEKEND_HERO:   { label: "Photo — One winter weekend, two ways (hero)", embed: "", alt: "" },
    BLOG_LIGHTS_HERO:    { label: "Photo — Where to see the lights (hero)",      embed: "", alt: "" },
    BLOG_MICHELIN_HERO:  { label: "Photo — A MICHELIN Guide winter (hero)",      embed: "/assets/img/articles/michelin-2.jpg", alt: "A table of small plates, wine and cocktails at Les Incompétents in St. Catharines" },
    BLOG_MARKETS_HERO:   { label: "Photo — Holiday markets and tree farms (hero)", embed: "", alt: "" },
    BLOG_MICHELIN_1: { label: "Photo — MICHELIN article (Pearl Morissette plating)", embed: "/assets/img/articles/michelin-1.jpg", alt: "A diner photographing a plated dish at Restaurant Pearl Morissette" },
    BLOG_MICHELIN_2: { label: "Photo — MICHELIN article (Les Incompétents table)",   embed: "/assets/img/articles/michelin-2.jpg", alt: "A table of small plates, wine and cocktails at Les Incompétents in St. Catharines" },
    BLOG_MICHELIN_3: { label: "Photo — MICHELIN article (RPM Bakehouse)",            embed: "/assets/img/articles/michelin-3.jpg", alt: "Loaves of dough proofing in baskets at RPM Bakehouse" },
    BLOG_MICHELIN_4: { label: "Photo — MICHELIN article (OddBird)",                  embed: "/assets/img/articles/michelin-4.jpg", alt: "A spread of dishes at OddBird in St. Catharines" },
    BLOG_MICHELIN_5: { label: "Photo — MICHELIN article (Pearl Morissette dining room)", embed: "/assets/img/articles/michelin-5.jpg", alt: "The dining room at Restaurant Pearl Morissette with floor-to-ceiling windows" },
    BLOG_MICHELIN_6: { label: "Photo — MICHELIN article (Fat Rabbit)",               embed: "/assets/img/articles/michelin-6.jpg", alt: "Cutting into a plate of sausage and mash at Fat Rabbit" },
  },

  widgets: {
    ITINERARIES_COUPLES:  { label: "Whereabouts — couples & friends winter itineraries (tripper) [PLACEHOLDER: fall widget]", embed: tripper("6aa2be8a126a0c45b2f4d108") },
    ITINERARIES_FAMILIES: { label: "Whereabouts — family winter itineraries (tripper) [PLACEHOLDER: fall widget]",            embed: tripper("6aa2baf6126a0c45b2ed840b") },
    EVENTS:               { label: "Whereabouts — events widget (alternative to events.json) [PLACEHOLDER: fall widget]",    embed: events("6a835cfc86787426fc72ee1b") },
    MICHELIN:             { label: "Whereabouts — MICHELIN Guide restaurants widget",                                         embed: operators("6ab52f69885200b8f2219dbd") },
    CROWDRIFF_GALLERY:    { label: "CrowdRiff — curated winter photography gallery [PLACEHOLDER: fall gallery]",             embed: `<script id="${embeds.crowdriff.scriptId}" src="${embeds.crowdriff.scriptSrc}" async></script>` },
    GETTING_HERE_MAP:     { label: "Illustrated regional map", embed: "/assets/img/wander-map.png" },
  },
};
