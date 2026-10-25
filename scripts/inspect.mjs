import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5174");
await page.waitForTimeout(10000);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "artifacts/desktop-hero.png" });
await page.getByRole("button", { name: "Show all projects" }).click();
for (
  let y = 0;
  y < (await page.evaluate(() => document.body.scrollHeight));
  y += 650
) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(60);
}
await page.screenshot({
  path: "artifacts/live-desktop-full.png",
  fullPage: true,
});
await page
  .locator("#projects")
  .screenshot({ path: "artifacts/projects-desktop.png" });
const links = [
  ...new Set(
    await page
      .locator('a[href^="https://"]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href"))),
  ),
];
const results = await Promise.all(
  links.map(async (url) => {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(20000),
      });
      return { url, status: response.status };
    } catch (e) {
      return { url, error: e.message };
    }
  }),
);
await writeFile(
  "artifacts/links.json",
  JSON.stringify({ errors, links: results }, null, 2),
);
console.log(
  JSON.stringify(
    {
      errors,
      links: results,
      status: await page.locator(".github-status").innerText(),
    },
    null,
    2,
  ),
);
await browser.close();
