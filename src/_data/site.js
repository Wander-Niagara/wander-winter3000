// Global site configuration — Wander Niagara winter campaign.
// Everything a stakeholder might want to flip lives here, not in templates.
// The site is built with a path prefix: /wander-winter3000/ on the GitHub Pages
// preview (set by the CI workflow) and /winter/ on the client's host
// (DEPLOY_TARGET=flywheel). Templates use root-relative paths; the
// HtmlBasePlugin rewrites them at build time.
const FLYWHEEL = process.env.DEPLOY_TARGET === "flywheel";
module.exports = {
  name: "Wander Niagara",
  campaign: "Winter in St. Catharines & the Benchlands",
  positioning: "St. Catharines and the Benchlands",

  // Header: section links + one CTA (the brass plaque).
  nav: [
    { label: "Eat and drink", href: "/eatdrinkplay/" },
    { label: "Outdoors",      href: "/outdoors/" },
    { label: "Stay",          href: "/eatdrinkplay/#accommodations" },
    { label: "Stories",       href: "/blog/" },
  ],
  cta: { label: "What's on", href: "/events/" },

  // Sticky bottom bar on mobile (appears once the hero leaves view).
  stickyCta: {
    primary:   { label: "See what's on",          href: "/events/" },
    secondary: { label: "See winter itineraries", href: "/eatdrinkplay/#itineraries" },
  },

  target: FLYWHEEL ? "flywheel" : "ghpages",
  // Absolute URL for canonicals, og:url / og:image, JSON-LD and the sitemap.
  url: FLYWHEEL ? "https://wanderniagara.com/winter" : "https://wander-niagara.github.io/wander-winter3000",
  description:
    "Winter is made for wandering. Plan a holiday escape to St. Catharines and the Benchlands: lights, wine country in snow, MICHELIN dining, markets, skating and trails, all within 90 minutes of Toronto.",

  // DIRECTORY DESTINATION — single source of truth for every directory CTA.
  directoryUrl: "https://www.wanderniagara.com/directory/",

  featureFlags: { directoryPage: false },

  // Outbound ref param appended to outbound clicks where safe.
  outboundRef: {
    enabled: true,
    param: "ref",
    value: "wintercampaign",
    disabledDomains: [],
  },

  gettingHere: {
    origins: [
      { from: "Toronto",        time: "1 hr 15 min", note: "via QEW" },
      { from: "Hamilton",       time: "30 min",      note: "via QEW" },
      { from: "Buffalo, NY",    time: "45 min",      note: "via QEW / Peace Bridge" },
      { from: "Niagara Falls",  time: "20 min",      note: "via QEW" },
    ],
  },

  social: [
    { label: "Instagram", url: "https://www.instagram.com/wanderniagara/", icon: "instagram" },
    { label: "Facebook",  url: "https://www.facebook.com/wanderniagara/",  icon: "facebook" },
    { label: "TikTok",    url: "https://www.tiktok.com/@wanderniagara",    icon: "tiktok" },
  ],

  privacyUrl: "https://www.wanderniagara.com/privacy/",
  copyrightHolder: "St. Catharines Lincoln Destination Partnership",
  year: 2026,
};
