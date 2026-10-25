import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  curate,
  fallbackProjects,
  isMeaningful,
  scoreRepo,
} from "@/lib/curate";
import { fetchRepos } from "@/lib/github";
import { config, hasAsset, verifiedHackathons } from "@/data/config";
import { validateContact } from "@/components/sections/Contact";
import type { Repo } from "@/types";
const repo: Repo = {
  name: "dev-track-",
  description: "DSA tracker",
  language: "JavaScript",
  homepage: null,
  html_url: "https://github.com/shriyashi2007-lang/dev-track-",
  updated_at: "2026-10-20T00:00:00Z",
  topics: [],
  size: 50,
  fork: false,
  archived: false,
  stargazers_count: 0,
  owner: { login: "shriyashi2007-lang" },
};
describe("curation", () => {
  it("excludes forks, archives, empty repositories, profile READMEs and undescribed non-featured projects", () => {
    for (const patch of [
      { fork: true },
      { archived: true },
      { size: 0 },
      { name: "shriyashi2007-lang" },
      { name: "unfeatured", description: null },
    ])
      expect(isMeaningful({ ...repo, ...patch }, "shriyashi2007-lang")).toBe(
        false,
      );
    expect(
      isMeaningful({ ...repo, description: null }, "shriyashi2007-lang"),
    ).toBe(true);
  });
  it("scores evidence and caps stars", () => {
    expect(scoreRepo({ ...repo, stargazers_count: 100 }, 0)).toBe(
      scoreRepo({ ...repo, stargazers_count: 5 }, 0),
    );
    expect(
      scoreRepo({ ...repo, hasReadme: true }, 0) - scoreRepo(repo, 0),
    ).toBe(2);
  });
  it("matches exact names and never invents demo URLs", () => {
    const result = curate(
      [repo, { ...repo, name: "similar-dev-track" }],
      "shriyashi2007-lang",
    );
    expect(result[0].title).toBe("DevTrack");
    expect(result[1].title).toBe("similar dev track");
    expect(result[0].liveUrl).toBeNull();
  });
  it("deduplicates the supplied resume builder link", () =>
    expect(
      fallbackProjects().filter((p) => p.repo === "student-resume-builder"),
    ).toHaveLength(1));
});
describe("GitHub", () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());
  it.each([
    [404, "could not be found"],
    [403, "rate limit"],
  ])("handles %s with a useful error", async (status, message) => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response("{}", {
            status,
            headers: { "x-ratelimit-remaining": "0" },
          }),
        ),
    );
    await expect(fetchRepos("test")).rejects.toThrow(message);
  });
  it("handles offline failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    await expect(fetchRepos("test")).rejects.toThrow("Could not connect");
  });
  it("caches successful data for ten minutes", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    await fetchRepos("test");
    await fetchRepos("test");
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("times out", async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, options: RequestInit) =>
          new Promise((_resolve, reject) =>
            options.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            ),
          ),
      ),
    );
    const promise = expect(fetchRepos("test")).rejects.toThrow("too long");
    await vi.advanceTimersByTimeAsync(8001);
    await promise;
    vi.useRealTimers();
  });
  it("ignores malformed storage", async () => {
    sessionStorage.setItem("portfolio-repos-v1:test", "broken");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("[]", { status: 200 })),
    );
    expect((await fetchRepos("test")).repos).toEqual([]);
  });
});
describe("truthful config guards", () => {
  it("keeps absent assets disabled and unverified SIH out of counts", () => {
    expect(hasAsset(config.resumeUrl)).toBe(false);
    expect(hasAsset(null)).toBe(false);
    expect(verifiedHackathons()).toBe(2);
    expect(config.phone).toBeNull();
    expect(config.social.linkedin).toBeNull();
  });
  it("validates all contact fields", () => {
    expect(
      Object.values(validateContact("a", "bad", "short")).every(Boolean),
    ).toBe(true);
    expect(
      Object.values(
        validateContact("Shri", "test@example.com", "A meaningful message."),
      ).some(Boolean),
    ).toBe(false);
  });
});
