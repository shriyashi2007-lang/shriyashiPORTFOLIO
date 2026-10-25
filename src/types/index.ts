export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  html_url: string;
  updated_at: string;
  topics: string[];
  size: number;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  owner: { login: string };
  hasReadme?: boolean;
}
export interface Project {
  repo: string;
  title: string;
  description: string;
  tags: readonly string[];
  art: string;
  color: string;
  liveUrl: string | null;
  url: string | null;
  updatedAt: string | null;
  screenshot?: string | null;
}
