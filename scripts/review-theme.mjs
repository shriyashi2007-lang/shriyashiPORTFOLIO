import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const repositories = JSON.parse(
  await readFile("repository-evidence.json", "utf8"),
);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({
      json: route.request().url().includes("/readme") ? {} : repositories,
    }),
  );
  await page.goto(process.env.PORTFOLIO_URL ?? "http://127.0.0.1:5174/");
  await page.locator("#contact").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "artifacts/heritage-desktop.png" });
  await page
    .locator("#projects")
    .screenshot({ path: "artifacts/heritage-projects.png" });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "artifacts/heritage-mobile.png" });
  console.log(
    JSON.stringify({
      horizontalOverflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    }),
  );
} finally {
  await browser.close();
}
