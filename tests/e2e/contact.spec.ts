import { expect, test, type Page } from "@playwright/test";
const endpoint = "https://formspree.io/f/portfolio-test";
async function open(page: Page) {
  await page.route("https://api.github.com/**", (route) =>
    route.fulfill({ json: [] }),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:4175/#contact");
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeVisible();
}
async function fill(page: Page) {
  await page.getByLabel("Your name").fill("Shriyashi");
  await page.getByLabel("Email address").fill("hello@example.com");
  await page
    .getByLabel("What’s on your mind?")
    .fill("Let us build something useful together.");
}
test("configured contact validates fields before making a request", async ({
  page,
}) => {
  let requests = 0;
  await page.route(endpoint, (route) => {
    requests++;
    return route.fulfill({ json: { ok: true } });
  });
  await open(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByText("Please enter your name (at least 2 characters)."),
  ).toBeVisible();
  await expect(
    page.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await expect(
    page.getByText("Please write at least 10 characters."),
  ).toBeVisible();
  expect(requests).toBe(0);
});
test("configured contact shows loading then actual mocked delivery success", async ({
  page,
}) => {
  let release: () => void = () => {};
  const wait = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    await wait;
    expect(route.request().postDataJSON().name).toBe("Shriyashi");
    await route.fulfill({ json: { ok: true } });
  });
  await open(page);
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
  release();
  await expect(page.locator(".form-status")).toContainText("Message delivered");
  await expect(page.getByLabel("Your name")).toHaveValue("");
});
test("configured contact reports delivery errors and preserves input", async ({
  page,
}) => {
  await page.route(endpoint, (route) =>
    route.fulfill({ status: 500, json: { error: "test failure" } }),
  );
  await open(page);
  await fill(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page
      .locator('[role="status"]')
      .filter({ hasText: "Your message could not be sent" }),
  ).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("Shriyashi");
});
