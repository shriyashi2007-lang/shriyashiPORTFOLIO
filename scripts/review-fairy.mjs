import { chromium } from "@playwright/test";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "no-preference",
    recordVideo: {
      dir: "artifacts/fairy-video",
      size: { width: 1280, height: 800 },
    },
  });
  const page = await context.newPage();
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({ json: [] }),
  );
  await page.goto(process.env.PORTFOLIO_URL ?? "http://127.0.0.1:5174/");
  await page.getByTestId("fairy-welcome").waitFor();
  await page.waitForTimeout(1400);
  await page.screenshot({ path: "artifacts/fairy-flight-desktop.png" });
  await page.waitForSelector(".fairy-welcome.is-blooming");
  await page.waitForTimeout(80);
  await page.screenshot({ path: "artifacts/fairy-reveal-desktop.png" });
  await page.waitForSelector(".fairy-welcome", { state: "detached" });
  await page.waitForTimeout(700);
  const video = page.video();
  await context.close();
  await video.saveAs("artifacts/fairy-cross-screen.webm");
  const mobile = await browser.newPage({
    viewport: { width: 360, height: 800 },
    reducedMotion: "no-preference",
  });
  await mobile.route("https://api.github.com/**", (route) =>
    route.fulfill({ json: [] }),
  );
  await mobile.goto(process.env.PORTFOLIO_URL ?? "http://127.0.0.1:5174/");
  await mobile.getByTestId("fairy-welcome").waitFor();
  await mobile.waitForTimeout(1800);
  await mobile.screenshot({ path: "artifacts/fairy-flight-mobile.png" });
  console.log(
    "Recorded full right-to-left looping entry and circular portfolio reveal.",
  );
} finally {
  await browser.close();
}
