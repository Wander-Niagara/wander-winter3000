// -----------------------------------------------------------------------------
// EMBEDS & ANALYTICS — the single paste-here file for the client / Loud and Clear.
// Every third-party integration is a slot below. Leave a value as "" and the
// site degrades gracefully: the module renders a labelled placeholder instead
// of a live embed, and analytics no-ops. Nothing here is render-blocking.
// See README → "What the client pastes where".
// -----------------------------------------------------------------------------
module.exports = {
  // ---- Analytics -----------------------------------------------------------
  // GA4 Measurement ID. Carried over from the fall site (shared with the main
  // wanderniagara.com property; filter this microsite by page_variant).
  // [PLACEHOLDER-DECISION] keep shared, or paste a winter-only property here.
  ga4Id: "G-1JK9KHWCS3",
  // Meta (Facebook) Pixel ID from Loud and Clear, e.g. "1234567890". [PLACEHOLDER]
  metaPixelId: "",
  // Optional GTM container id "GTM-XXXXXXX" if Loud and Clear prefer GTM. [PLACEHOLDER]
  gtmId: "",
  // StackAdapt universal pixel (carried over from fall). Set "" to disable.
  stackAdaptPixelId: "kfPIwrQ72HRILrPivbDP8g",
  // Plausible script src (carried over from fall). Set "" to disable.
  plausibleSrc: "https://plausible.io/js/pa-OBP5InHVvW5mgJGXal8R7.js",

  // ---- Whereabouts ---------------------------------------------------------
  // Widget embeds live per-slot in src/_data/slots.js (ITINERARIES_*, EVENTS,
  // MICHELIN). This block holds the shared loader/access values.
  whereabouts: {
    accessId: "6a733c9f069c5aa5556f466c",
    operatorLoader: "https://api.prod.next.whereabouts.tech/embeddable/widget/operator/main.js",
    tripperLoader:  "https://next.whereabouts.tech/widget/tripper/v1/main.js",
    eventLoader:    "https://api.prod.next.whereabouts.tech/embeddable/widget/event/main.js",
  },

  // ---- CrowdRiff -----------------------------------------------------------
  // The script id + src from the CrowdRiff embed snippet (fall gallery kept as
  // a working stand-in). [PLACEHOLDER] swap for the winter gallery when ready.
  crowdriff: {
    scriptId: "cr-init__ca96b69426de3407",
    scriptSrc: "https://starling.crowdriff.com/js/crowdriff.js",
  },

  // ---- Mailchimp -----------------------------------------------------------
  // Audience → Signup forms → Embedded form → the <form action="…"> URL.
  mailchimp: {
    actionUrl: "https://wanderniagara.us14.list-manage.com/subscribe/post?u=5c9980c2b101d254a2bab94af&id=da5bfb6035&f_id=00eca0e0f0",
    honeypot: "b_5c9980c2b101d254a2bab94af_da5bfb6035",
    // Audience tag for winter-campaign signups. [PLACEHOLDER] (fall tag shown)
    tags: "7335926",
  },

  preconnect: [
    "https://api.prod.next.whereabouts.tech",
    "https://next.whereabouts.tech",
    "https://www.googletagmanager.com",
    "https://plausible.io",
    "https://tags.srv.stackadapt.com",
    "https://connect.facebook.net",
    "https://starling.crowdriff.com",
  ],
};
