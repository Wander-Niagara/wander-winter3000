# Article ideas — DROP THE REAL DOC HERE  ⚠︎ PLACEHOLDER

Mackenzie is supplying the real article-ideas list and article images. This file
is a placeholder so the build has something to reference. It was **not** attached
to the build request.

The 3 demo articles currently in `/src/stories/articles/` are stand-ins:

1. `perfect-fall-weekend-on-the-bench.md` — couples / wine weekend
2. `easy-fall-colour-walks-for-families.md` — families / outdoors
3. `local-guide-to-fall-harvest-markets.md` — food / markets

## To replace with real articles

For each real article, edit (or add) a Markdown file in `src/stories/articles/`.
Front-matter fields:

```yaml
---
title: "..."                # headline
order: 1                    # controls order on /stories/
date: "2026-09-05"
category: "Wine & Getaways"
readTime: "4 min read"
excerpt: "..."             # shows on the hub card
image: "/assets/img/your-hero.webp"   # client-supplied hero
exploreCards:               # 3 cards for the "keep exploring" module (outbound)
  - { title: "...", img: "...", url: "https://...", cta: "View the ...", blurb: "..." }
  - { ... }
  - { ... }
---
Body in Markdown. Inline images with ![alt](/assets/img/...).
```

Images go in `src/assets/img/`. Prefer WebP/AVIF; keep them sized to display
dimensions. The permalink is generated automatically as `/stories/<file-slug>/`.
