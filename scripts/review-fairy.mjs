import { chromium } from "@playwright/test";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "no-preference",
  });
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({ json: [] }),
  );
  await page.goto(process.env.PORTFOLIO_URL ?? "http://127.0.0.1:5174/");
  await page.getByTestId("fairy-welcome").waitFor();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "artifacts/fairy-flight-desktop.png" });
  await page.waitForSelector(".fairy-welcome.is-blooming");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "artifacts/fairy-flowers-desktop.png" });
  await page.waitForSelector(".fairy-welcome", { state: "detached" });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  await page.getByTestId("fairy-welcome").waitFor();
  await page.waitForSelector(".fairy-welcome.is-blooming");
  await page.waitForTimeout(400);
  await page.screenshot({ path: "artifacts/fairy-flowers-mobile.png" });
  console.log("Captured fairy flight and flower reveal on desktop and mobile.");
} finally {
  await browser.close();
}
