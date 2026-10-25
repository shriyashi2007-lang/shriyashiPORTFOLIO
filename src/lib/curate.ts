import { featuredProjects, hiddenRepos } from "@/data/featuredProjects";
import { config } from "@/data/config";
import type { Project, Repo } from "@/types";
export const isMeaningful = (r: Repo, username: string) =>
  !r.fork &&
  !r.archived &&
  r.size > 0 &&
  r.name.toLowerCase() !== username.toLowerCase() &&
  !hiddenRepos.includes(r.name) &&
  (!!r.description || featuredProjects.some((p) => p.repo === r.name));
export const scoreRepo = (r: Repo, now = Date.now()) =>
  (featuredProjects.some((p) => p.repo === r.name) ? 5 : 0) +
  (r.description ? 3 : 0) +
  (r.homepage ? 3 : 0) +
  (r.topics?.length ? 2 : 0) +
  (r.hasReadme ? 2 : 0) +
  Math.min(r.stargazers_count, 5) +
  Math.max(0, 1 - (now - Date.parse(r.updated_at)) / (365 * 86400000));
export const fallbackProjects = (): Project[] =>
  featuredProjects.map((p) => ({
    ...p,
    url: `https://github.com/shriyashi2007-lang/${p.repo}`,
    updatedAt: null,
  }));
export function curate(repos: Repo[], username: string): Project[] {
  const ranked = repos
    .filter((r) => isMeaningful(r, username))
    .sort((a, b) => scoreRepo(b) - scoreRepo(a));
  return ranked.map((r) => {
    const manual = featuredProjects.find((p) => p.repo === r.name);
    return {
      repo: r.name,
      title: manual?.title ?? r.name.replaceAll("-", " "),
      description:
        manual?.description ??
        r.description ??
        "Explore this project on GitHub.",
      tags:
        manual?.tags ??
        [...(r.topics ?? []), ...(r.language ? [r.language] : [])].slice(0, 4),
      art: manual?.art ?? "code",
      color: manual?.color ?? "blue",
      liveUrl: manual?.liveUrl ?? null,
      url: r.html_url,
      updatedAt: r.updated_at,
    };
  });
}
export const resumeFallbacks = (): Project[] =>
  config.resumeProjects.map((p) => ({
    ...p,
    repo: p.title,
    art: "code",
    color: "neutral",
    liveUrl: null,
    url: null,
    updatedAt: null,
  }));
