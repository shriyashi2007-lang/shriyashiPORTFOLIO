import { useState } from "react";
import {
  ArrowUpRight,
  Code2,
  FileText,
  ChartNoAxesCombined,
  Sparkles,
  CloudSun,
  ScanText,
  Github,
} from "lucide-react";
import type { Project } from "@/types";
import { hasAsset } from "@/data/config";
const icons = {
  code: Code2,
  resume: FileText,
  chart: ChartNoAxesCombined,
  spark: Sparkles,
  weather: CloudSun,
  sun: CloudSun,
  analysis: ScanText,
};
export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const [broken, setBroken] = useState(false);
  const path = `/assets/projects/${project.repo}.webp`;
  const Icon = icons[project.art as keyof typeof icons] ?? Code2;
  return (
    <article className={`project-card ${index === 0 ? "featured" : ""}`}>
      <div className={`project-art art-${project.color}`}>
        {hasAsset(path) && !broken ? (
          <img
            src={path}
            width="1600"
            height="1000"
            loading="lazy"
            alt={`${project.title} screenshot`}
            onError={() => setBroken(true)}
          />
        ) : (
          <>
            <span className="art-grid" />
            <span className="art-number">0{index + 1}</span>
            <div className="project-symbol">
              <Icon strokeWidth={1} />
            </div>
            <div className="art-title">
              {project.title === "DevTrack" ? (
                <>
                  dev<span>track</span>
                  <i>.</i>
                </>
              ) : (
                project.title
              )}
            </div>
            <span className="art-caption">
              PROJECT ARTWORK · NOT A SCREENSHOT
            </span>
            <span className="art-star" aria-hidden="true">
              ✳
            </span>
          </>
        )}
        <a
          href={project.url ?? "#contact"}
          className="project-open"
          aria-label={
            project.url
              ? `View ${project.title} on GitHub`
              : `Ask about ${project.title}`
          }
          {...(project.url
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          <ArrowUpRight size={23} />
        </a>
      </div>
      <div className="project-info">
        <div className="project-category">
          {project.tags.slice(0, 2).join(" / ")}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="chips">
          {project.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        <div className="project-links">
          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              <Github size={14} /> Source code <ArrowUpRight size={14} />
            </a>
          ) : (
            <span>Repository link coming soon</span>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Live demo <ArrowUpRight size={14} />
            </a>
          )}
        </div>
        {project.updatedAt && (
          <time dateTime={project.updatedAt}>
            Updated{" "}
            {new Date(project.updatedAt).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })}
          </time>
        )}
      </div>
    </article>
  );
}
