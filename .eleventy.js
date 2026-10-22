// Eleventy config — Wander Niagara Fall campaign microsite
// CommonJS (package.json has no "type":"module").
//
// Build targets (DEPLOY_TARGET env var, see _data/site.js):
//   ghpages  (default) — GitHub Pages preview/staging. Output _site/, pathPrefix
//                        comes from the CLI (--pathprefix=/wander-niagara-fall/ in
//                        the Actions workflow), index.html files. Unchanged.
//   flywheel           — static folder on the client's Flywheel WordPress host,
//                        served by Nginx at https://wanderniagara.com/fall/.
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
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  // robots.txt is GitHub-Pages-only: on Flywheel the WordPress site owns /robots.txt.
  if (!FLYWHEEL) eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Rebuild when CSS/JS change during --serve
  eleventyConfig.addWatchTarget("src/assets/");

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
      return fs.readFileSync(path.join(__dirname, p), "utf8");
    } catch (e) {
      return "";
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
      output: FLYWHEEL ? "dist-flywheel/fall" : "_site",
      includes: "_includes",
      data: "_data",
    },
    // ghpages: "/" here, overridden by --pathprefix on the CLI for the Pages URL.
    // flywheel: the folder lives at wanderniagara.com/fall/.
    pathPrefix: FLYWHEEL ? "/fall/" : "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
