import { useCallback, useEffect, useState } from "react";
import { config } from "@/data/config";
import { fetchRepos } from "@/lib/github";
import { curate, fallbackProjects } from "@/lib/curate";
import type { Project } from "@/types";
export function useGithubRepos() {
  const [state, setState] = useState<{
    status: "loading" | "success" | "empty" | "error" | "fallback";
    projects: Project[];
    error: string;
    time: number | null;
  }>({
    status: "loading",
    projects: fallbackProjects(),
    error: "",
    time: null,
  });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((x) => x + 1), []);
  useEffect(() => {
    let active = true;
    const username = config.github.username;
    if (!username) {
      setState({
        status: "fallback",
        projects: fallbackProjects(),
        error: "",
        time: null,
      });
      return;
    }
    setState((s) => ({ ...s, status: "loading", error: "" }));
    fetchRepos(username, attempt > 0)
      .then(({ repos, time }) => {
        if (!active) return;
        const projects = curate(repos, username);
        setState({
          status: projects.length ? "success" : "empty",
          projects: projects.length ? projects : fallbackProjects(),
          error: "",
          time,
        });
      })
      .catch((e: unknown) => {
        if (active)
          setState({
            status: "error",
            projects: fallbackProjects(),
            error: e instanceof Error ? e.message : "GitHub is unavailable.",
            time: null,
          });
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  return { ...state, retry };
}
