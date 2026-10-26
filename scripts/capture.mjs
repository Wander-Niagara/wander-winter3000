// Screenshot helper for the Impeccable gates and reviews.
// usage: node scripts/capture.mjs <url> <out.png> [--width 390 --height 844 --dpr 1.969 --full] [--class plates-only] [--settle 1500]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
const args = process.argv.slice(2);
const url = args[0], out = args[1];
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i > -1 ? args[i + 1] : d; };
const width = +opt("width", 390), height = +opt("height", 844), dpr = +opt("dpr", 2);
const full = args.includes("--full"), cls = opt("class", ""), settle = +opt("settle", 1500);
const chrome = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: args.includes("--motion") ? "no-preference" : "reduce" }]);
await page.setViewport({ width, height, deviceScaleFactor: dpr });
if (cls) await page.evaluateOnNewDocument((c) => { document.addEventListener("DOMContentLoaded", () => document.documentElement.classList.add(c)); }, cls);
await page.goto(url, { waitUntil: opt("wait", "networkidle0"), timeout: 60000 });
await page.evaluate(() => document.fonts && document.fonts.ready);
await new Promise(r => setTimeout(r, settle));
if (full) { // walk the page so lazy images and reveals settle before a full-page capture
  await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } window.scrollTo(0, 0); });
  await page.evaluate(() => Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; }))));
  await new Promise(r => setTimeout(r, 400));
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: out, fullPage: full });
await browser.close();
const st = fs.statSync(out); console.log(`CAPTURED ${out} ${width}x${height}@${dpr}${full ? " full" : ""} (${(st.size/1024).toFixed(0)} KB)`);
