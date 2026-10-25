import lighthouse from "lighthouse";

import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const chrome = await chromium.launch({
  args: ["--remote-debugging-port=9223"],
});
try {
  const result = await lighthouse("http://127.0.0.1:4180", {
    port: 9223,
    output: ["json", "html"],
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    logLevel: "error",
  });
  await writeFile("artifacts/lighthouse.json", result.report[0]);
  await writeFile("artifacts/lighthouse.html", result.report[1]);
  console.log(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, c]) => [
          key,
          Math.round(c.score * 100),
        ]),
      ),
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify(
      Object.values(result.lhr.audits)
        .filter((a) => a.score !== null && a.score < 0.9)
        .map((a) => ({
          id: a.id,
          title: a.title,
          score: a.score,
          display: a.displayValue,
          details: a.details,
        })),
      null,
      2,
    ),
  );
} finally {
  await chrome.close();
}
