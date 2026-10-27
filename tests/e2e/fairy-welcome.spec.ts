import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({ json: [] }),
  );
});
test("full-screen reference fairy enters with flowers and reveals the interactive site", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const intro = page.getByRole("dialog", { name: "Let a little magic in." });
  await expect(intro).toBeVisible();
  await expect(intro).toHaveClass(/is-flying/);
  await expect(intro.locator(".fairy-portrait")).toHaveAttribute(
    "src",
    "/assets/fairy/forest-fairy.png",
  );
  expect(
    await intro
      .locator(".fairy-portrait")
      .evaluate((el) => ({ width: el.clientWidth, height: el.clientHeight })),
  ).toEqual(
    await page.evaluate(() => ({ width: innerWidth, height: innerHeight })),
  );
  expect(
    await page.locator("main").evaluate((el) => !!el.closest("[inert]")),
  ).toBe(true);
  await expect(
    page.getByRole("button", { name: "Skip to portfolio" }),
  ).toBeFocused();
  await page.clock.runFor(3200);
  await expect(intro).toHaveClass(/is-blooming/);
  await expect(intro.locator(".falling-flower")).toHaveCount(26);
  await expect(
    intro.getByText("A shower of flowers, and a new beginning."),
  ).toBeVisible();
  await page.clock.runFor(2850);
  await expect(intro).toHaveCount(0);
  expect(
    await page.locator("main").evaluate((el) => !!el.closest("[inert]")),
  ).toBe(false);
  await expect(page.locator("main")).toBeFocused();
});
test("skip button and Escape dismiss the intro and restore keyboard access", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const skip = page.getByRole("button", { name: "Skip to portfolio" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await skip.click();
  await expect(page.getByTestId("fairy-welcome")).toHaveCount(0);
  await expect(page.locator("main")).toBeFocused();
  await page.reload();
  await expect(page.getByTestId("fairy-welcome")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("fairy-welcome")).toHaveCount(0);
});
test("reduced motion opens the portfolio immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("fairy-welcome")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Shriyashi." })).toBeVisible();
  expect(
    await page.locator("main").evaluate((el) => !!el.closest("[inert]")),
  ).toBe(false);
});
for (const viewport of [
  { width: 360, height: 800 },
  { width: 1280, height: 900 },
])
  test(`fairy intro is accessible and fits ${viewport.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.clock.install();
    await page.goto("/");
    await expect(page.getByTestId("fairy-welcome")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact ?? ""),
      ),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.clock.runFor(3500);
    await page.screenshot({
      path: `artifacts/fairy-welcome-${viewport.width}.png`,
    });
    await page.clock.runFor(3000);
  });
