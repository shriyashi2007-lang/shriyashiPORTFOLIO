import type { Repo } from "@/types";
import { isMeaningful, scoreRepo } from "./curate";
import { missingReadmes } from "@/data/featuredProjects";
export class GithubError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "GithubError";
  }
}
const ttl = 600000;
export async function fetchRepos(
  username: string,
  refresh = false,
): Promise<{ repos: Repo[]; time: number }> {
  const key = `portfolio-repos-v1:${username}`;
  if (!refresh)
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const cached = JSON.parse(raw) as { repos: Repo[]; time: number };
        if (Array.isArray(cached.repos) && Date.now() - cached.time < ttl)
          return cached;
      }
    } catch {
      /* Storage can be unavailable. */
    }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal,
      },
    );
    if (!response.ok)
      throw new GithubError(
        response.status,
        response.status === 403
          ? response.headers.get("x-ratelimit-remaining") === "0"
            ? "GitHub rate limit reached. Please try again later."
            : "GitHub access is temporarily unavailable."
          : response.status === 404
            ? "GitHub profile could not be found."
            : "GitHub is unavailable right now.",
      );
    const data: unknown = await response.json();
    if (!Array.isArray(data))
      throw new Error("GitHub returned an unexpected response.");
    const repos = data as Repo[];
    const candidates = repos
      .filter((r) => isMeaningful(r, username))
      .sort((a, b) => scoreRepo(b) - scoreRepo(a))
      .slice(0, 12);
    await Promise.allSettled(
      candidates.map(async (repo) => {
        if (missingReadmes.includes(repo.name)) {
          repo.hasReadme = false;
          return;
        }
        const readme = await fetch(
          `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/readme`,
          {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          },
        );
        repo.hasReadme = readme.ok;
      }),
    );
    const result = { repos, time: Date.now() };
    try {
      sessionStorage.setItem(key, JSON.stringify(result));
    } catch {
      /* Cache is optional. */
    }
    return result;
  } catch (error) {
    if (error instanceof GithubError) throw error;
    throw new Error(
      controller.signal.aborted
        ? "GitHub took too long to respond."
        : "Could not connect to GitHub. Showing curated projects.",
    );
  } finally {
    clearTimeout(timeout);
  }
}
