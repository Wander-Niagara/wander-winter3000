// Eleventy config — Wander Niagara Winter campaign microsite
// CommonJS (package.json has no "type":"module").
//
// Build targets (DEPLOY_TARGET env var, see _data/site.js):
//   ghpages  (default) — GitHub Pages preview/staging. Output _site/, pathPrefix
//                        comes from the CLI (--pathprefix=/wander-winter3000/ in
//                        the Actions workflow), index.html files. Unchanged.
//   flywheel           — static folder on the client's Flywheel WordPress host,
//                        served by Nginx at https://wanderniagara.com/winter/.
//                        Output dist-flywheel/fall/, pathPrefix /fall/, every page
//                        written as index.php (Flywheel's Nginx index directive
//                        only recognises index.php), no GitHub-Pages-only files.
const fs = require("fs");
const path = require("path");
const { HtmlBasePlugin } = require("@11ty/eleventy");

const TARGET = process.env.DEPLOY_TARGET === "flywheel" ? "flywheel" : "ghpages";
const FLYWHEEL = TARGET === "flywheel";

module.exports = function (eleventyConfig) {
  // Rewrites root-relative /paths (href, src, srcset, meta refresh…) in built
  // HTML to include the pathPrefix. Templates stay root-relative.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // ---- Passthrough copy (assets ship as-is; keep paths relative) ----
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });
  // robots.txt is GitHub-Pages-only: on Flywheel the WordPress site owns /robots.txt.
  if (!FLYWHEEL) eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Rebuild when CSS/JS change during --serve
  eleventyConfig.addWatchTarget("assets/");

  // ---- Collections ----
  // Blog articles live in src/blog/*.md
  eleventyConfig.addCollection("articles", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  // ---- Filters ----
  // Pull the registrable host out of a URL (for analytics params / display)
  eleventyConfig.addFilter("domain", (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  });

  // Grab businesses for a given page variant + theme key from the data file
  eleventyConfig.addFilter("themeBusinesses", (businesses, variant, themeKey) => {
    if (!businesses || !businesses[variant]) return [];
    const theme = (businesses[variant].themes || []).find((t) => t.key === themeKey);
    return theme ? theme.items : [];
  });


  // Group dated event rows by month label (Nov / Dec / Jan), keeping order.
  eleventyConfig.addFilter("groupByMonth", (items) => {
    const out = [], seen = {};
    const names = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    (items || []).forEach((ev) => {
      const d = new Date((ev.date || "2026-12-01") + "T12:00:00");
      const label = names[d.getMonth()] + " " + d.getFullYear();
      if (!seen[label]) { seen[label] = { label, items: [] }; out.push(seen[label]); }
      seen[label].items.push(ev);
    });
    return out;
  });
  // "Keep exploring" trio: ["eatdrinkplay:michelin", ...] -> first item of each theme.
  eleventyConfig.addFilter("keepItems", (keys, businesses) => {
    return (keys || []).map((k) => {
      const [pg, theme] = k.split(":");
      const t = ((businesses[pg] || {}).themes || []).find((x) => x.key === theme);
      return t && t.items[0];
    }).filter(Boolean);
  });

  // Nunjucks-friendly JSON dump for JSON-LD blocks
  eleventyConfig.addFilter("jsonld", (obj) => JSON.stringify(obj));

  // External links in markdown (the blog articles) open in a new tab with
  // rel="noopener" — per the Sept 3 brief. Internal links are left alone.
  eleventyConfig.amendLibrary("md", (md) => {
    const defaultRender =
      md.renderer.rules.link_open ||
      ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const href = tokens[idx].attrGet("href") || "";
      if (/^https?:\/\//i.test(href)) {
        tokens[idx].attrSet("target", "_blank");
        tokens[idx].attrSet("rel", "noopener");
      }
      return defaultRender(tokens, idx, options, env, self);
    };
  });

  // Inline a file's raw contents (used to inline critical CSS in <head>).
  eleventyConfig.addFilter("readFile", (p) => {
    try {
      const raw = fs.readFileSync(path.join(__dirname, p), "utf8");
      if (p.endsWith(".css")) { const CleanCSS = require("clean-css"); return new CleanCSS({ level: 1 }).minify(raw).styles; }
      return raw;
    } catch (e) {
      return "";
    }
  });

  // ---- Post-build: minify shipped CSS and JS (clean-css, terser) ----
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const CleanCSS = require("clean-css");
    const { minify } = require("terser");
    const out = dir.output;
    for (const f of ["assets/css/main.css", "assets/css/critical.css"]) {
      const p = path.join(out, f);
      if (fs.existsSync(p)) fs.writeFileSync(p, new CleanCSS({ level: 1 }).minify(fs.readFileSync(p, "utf8")).styles);
    }
    const js = path.join(out, "assets/js/app.js");
    if (fs.existsSync(js)) {
      const r = await minify(fs.readFileSync(js, "utf8"), { compress: true, mangle: true, format: { comments: false } });
      if (r.code) fs.writeFileSync(js, r.code);
    }
  });

  // ---- Flywheel post-build: index.html → index.php, PHP-safety scan, no GH files ----
  // Done as a mechanical post-build step so templates and page.url stay clean
  // (a permalink of …/index.php would leak into page.url, canonicals and nav).
  if (FLYWHEEL) {
    eleventyConfig.on("eleventy.after", ({ dir }) => {
      const out = dir.output;
      const walk = (d, fn) => {
        for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, entry.name);
          if (entry.isDirectory()) walk(p, fn);
          else fn(p);
        }
      };
      // GitHub-Pages-only files must not ship.
      for (const f of ["CNAME", ".nojekyll", "robots.txt"]) {
        const p = path.join(out, f);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
      let renamed = 0;
      const offenders = [];
      walk(out, (p) => {
        if (path.basename(p) !== "index.html") return;
        const php = path.join(path.dirname(p), "index.php");
        let html = fs.readFileSync(p, "utf8");
        // PHP executes these files: any "<?" outside a real PHP tag would be parsed
        // as PHP (e.g. an <?xml prolog inside copied SVG/embed code). Escape it.
        if (html.includes("<?")) {
          offenders.push(path.relative(out, p));
          html = html.replace(/<\?/g, "&lt;?");
        }
        fs.writeFileSync(php, html);
        fs.unlinkSync(p);
        renamed++;
      });
      console.log(`[flywheel] ${renamed} page(s) written as index.php in ${out}`);
      if (offenders.length) console.log(`[flywheel] escaped "<?" in: ${offenders.join(", ")}`);
    });
  }

  // ---- Dirs ----
  return {
    dir: {
      input: "src",
      output: FLYWHEEL ? "dist-flywheel/winter" : "_site",
      includes: "_includes",
      data: "_data",
    },
    // ghpages: "/" here, overridden by --pathprefix on the CLI for the Pages URL.
    // flywheel: the folder lives at wanderniagara.com/winter/.
    pathPrefix: FLYWHEEL ? "/winter/" : "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
