import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import repositoryEvidence from "../../repository-evidence.json" with { type: "json" };
const repo = {
  name: "dev-track-",
  description: "A DSA tracker",
  language: "JavaScript",
  homepage: null,
  html_url: "https://github.com/shriyashi2007-lang/dev-track-",
  updated_at: "2026-10-20T00:00:00Z",
  topics: [],
  size: 100,
  fork: false,
  archived: false,
  stargazers_count: 0,
  owner: { login: "shriyashi2007-lang" },
};
test.beforeEach(async ({ page }) => {
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({
      json: route.request().url().includes("/readme") ? {} : repositoryEvidence,
    }),
  );
});
for (const viewport of [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
])
  test(`layout, accessibility and links ${viewport.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "SELECTED WORK" }),
    ).toBeVisible();
    await expect(page.locator(".github-status")).toContainText(
      "Data from GitHub",
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
      window.scrollTo(0, 0);
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const axe = await new AxeBuilder({ page }).analyze();
    expect(
      axe.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact ?? ""),
      ),
    ).toEqual([]);
    const links = await page.locator("a").evaluateAll((nodes) =>
      nodes.map((a) => ({
        href: a.getAttribute("href"),
        target: a.getAttribute("target"),
        rel: a.getAttribute("rel"),
      })),
    );
    for (const link of links) {
      expect(link.href).toBeTruthy();
      expect(link.href).not.toBe("#");
      if (link.target === "_blank") {
        expect(link.rel).toContain("noopener");
        expect(link.rel).toContain("noreferrer");
      }
      if (link.href?.startsWith("#"))
        expect(await page.locator(`[id="${link.href.slice(1)}"]`).count()).toBe(
          1,
        );
    }
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (img) => img instanceof HTMLImageElement && img.naturalWidth > 0,
          ),
        ),
    ).toBe(true);
    expect(await page.locator("h1").count()).toBe(1);
    await page.screenshot({
      path: `artifacts/portfolio-${viewport.width}.png`,
      fullPage: true,
    });
  });
test("desktop navigation and all section anchors", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#contact")).toBeAttached();
  for (const id of ["about", "skills", "projects", "experience", "contact"]) {
    const link = page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: id, exact: true });
    await link.click();
    await expect(link).toHaveAttribute("aria-current", "location");
    expect(
      Math.abs(
        await page
          .locator(`#${id}`)
          .evaluate((el) => el.getBoundingClientRect().top),
      ),
    ).toBeLessThan(160);
  }
  for (const id of ["education", "certifications", "achievements"]) {
    await page.locator(`footer a[href="#${id}"]`).click();
    expect(
      Math.abs(
        await page
          .locator(`#${id}`)
          .evaluate((el) => el.getBoundingClientRect().top),
      ),
    ).toBeLessThan(160);
  }
});
test("mobile menu traps focus, escapes and closes on navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "09 contact" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await dialog.getByRole("link", { name: "05 projects" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#projects$/);
});
for (const state of ["empty", "404", "403", "offline"])
  test(`GitHub ${state} shows honest fallback`, async ({ page }) => {
    await page.unroute("https://api.github.com/**");
    await page.route("https://api.github.com/**", (route) =>
      state === "offline"
        ? route.abort()
        : route.fulfill({
            status: state === "empty" ? 200 : Number(state),
            headers: {
              "x-ratelimit-remaining": "0",
              "access-control-expose-headers": "x-ratelimit-remaining",
            },
            json: state === "empty" ? [] : {},
          }),
    );
    await page.goto("/");
    await expect(page.locator(".github-status")).toContainText(
      state === "empty"
        ? "No public repositories"
        : state === "404"
          ? "could not be found"
          : state === "403"
            ? "rate limit"
            : "Could not connect",
    );
    await expect(
      page.getByRole("heading", { name: "DevTrack", exact: true }),
    ).toBeVisible();
    if (state !== "empty")
      await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  });
test("loading skeletons settle into projects", async ({ page }) => {
  await page.unroute("https://api.github.com/**");
  let release: () => void = () => {};
  const wait = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("https://api.github.com/**", async (route) => {
    await wait;
    await route.fulfill({
      json: route.request().url().includes("/readme") ? {} : [repo],
    });
  });
  await page.goto("/");
  await expect(page.getByLabel("Loading projects")).toBeVisible();
  release();
  await expect(page.locator(".github-status")).toContainText(
    "Data from GitHub",
  );
  await expect(page.getByLabel("Loading projects")).not.toBeVisible();
});
test("unconfigured contact and absent assets are honest", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Form not configured yet. Email me directly."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Send message" })).toHaveCount(
    0,
  );
  await expect(page.getByText("Resume coming soon")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Certificate not uploaded yet" }),
  ).toHaveCount(3);
});

test("shows six projects, expands to all seven and preserves academic fallbacks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".github-status")).toContainText(
    "Data from GitHub",
  );
  await expect(page.locator(".project-card")).toHaveCount(6);
  await page.getByRole("button", { name: "Show all projects" }).click();
  await expect(page.locator(".project-card")).toHaveCount(7);
  await page.locator(".resume-projects summary").click();
  await expect(
    page.getByRole("heading", { name: "PaperMind AI" }),
  ).toBeVisible();
  await expect(page.locator(".academic-grid a")).toHaveCount(0);
  await page.getByRole("button", { name: "Show selected projects" }).click();
  await expect(page.locator(".project-card")).toHaveCount(6);
});
