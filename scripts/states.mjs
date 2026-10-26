// Interaction-state captures: hover sign (desktop), keyboard focus ring (mobile), light-up sequence frames.
import puppeteer from "puppeteer-core";
const base = process.argv[2] || "http://localhost:8080/";
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox", "--hide-scrollbars"] });
async function shot(opts, out, fn) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: opts.motion ? "no-preference" : "reduce" }]);
  await page.setViewport({ width: opts.w, height: opts.h, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: opts.motion ? "domcontentloaded" : "networkidle0" });
  if (fn) await fn(page);
  await page.screenshot({ path: out, clip: opts.clip });
  console.log("CAPTURED", out); await page.close();
}
// 1. desktop hover on the dining-room window → hanging sign + warmed glow
await shot({ w: 1440, h: 900 }, ".impeccable/review/state-hover-desktop.png", async (p) => {
  await p.hover(".house__portals--d .house__portal--dining"); await new Promise(r => setTimeout(r, 500));
});
// 2. mobile keyboard focus: Tab to the second portal (dining)
await shot({ w: 390, h: 844 }, ".impeccable/review/state-focus-mobile.png", async (p) => {
  for (let i = 0; i < 4; i++) await p.keyboard.press("Tab");
  const el = await p.evaluate(() => document.activeElement && (document.activeElement.getAttribute("aria-label") || document.activeElement.textContent.trim()));
  console.log("focused:", el); await new Promise(r => setTimeout(r, 300));
});
// 3. light-up sequence: frames at 150 ms and 1800 ms with motion allowed
await shot({ w: 390, h: 844, motion: true }, ".impeccable/review/state-seq-0.png", async (p) => { await new Promise(r => setTimeout(r, 150)); });
await shot({ w: 390, h: 844, motion: true }, ".impeccable/review/state-seq-1.png", async (p) => { await new Promise(r => setTimeout(r, 1800)); });
// 4. tab order through the whole hero: list focusable names
{
  const page = await browser.newPage(); await page.setViewport({ width: 390, height: 844 }); await page.goto(base, { waitUntil: "networkidle0" });
  const names = [];
  for (let i = 0; i < 12; i++) { await page.keyboard.press("Tab"); names.push(await page.evaluate(() => { const a = document.activeElement; return a ? (a.getAttribute("aria-label") || a.textContent.trim().slice(0, 40)) : null; })); }
  console.log("tab order:", JSON.stringify(names)); await page.close();
}
await browser.close();
