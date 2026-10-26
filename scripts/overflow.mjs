import puppeteer from "puppeteer-core";
const url = process.argv[2], width = +(process.argv[3]||390);
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage(); await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto(url, { waitUntil: "networkidle0" });
const r = await page.evaluate((w) => {
  const out = []; document.querySelectorAll("body *").forEach(el => { const b = el.getBoundingClientRect(); if (b.right > w + 1 || b.left < -1) out.push({ tag: el.tagName, cls: el.className && el.className.baseVal === undefined ? el.className : "", left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width) }); });
  return { scrollWidth: document.documentElement.scrollWidth, items: out.slice(0, 25) };
}, width);
console.log(JSON.stringify(r, null, 1)); await browser.close();
