import { useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { SectionShell, Reveal } from "@/components/ui/Primitives";
import ProjectCard from "@/components/projects/ProjectCard";
import { useGithubRepos } from "@/hooks/useGithubRepos";
import { config } from "@/data/config";
import { resumeFallbacks } from "@/lib/curate";
export default function Projects() {
  const { status, projects, error, time, retry } = useGithubRepos();
  const [all, setAll] = useState(false);
  return (
    <SectionShell
      id="projects"
      number="04"
      label="A FEW THINGS I’VE BUILT"
      title="SELECTED WORK"
      script="ideas, brought to life."
    >
      <div className="section-intro">
        <p>
          A mix of practical tools, thoughtful interfaces and experiments with
          AI.
          <br />
          Built to learn. Designed to be used.
        </p>
        {config.github.username && (
          <a
            className="text-link"
            href={`https://github.com/${config.github.username}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
          >
            All repositories <ArrowUpRight size={18} />
          </a>
        )}
      </div>
      <div className="github-status" role="status">
        {status === "loading" ? (
          "Connecting to GitHub…"
        ) : status === "error" ? (
          <>
            {error}{" "}
            <button onClick={retry}>
              <RefreshCw size={13} /> Retry
            </button>
          </>
        ) : status === "empty" ? (
          "No public repositories to show yet. Explore the curated projects below."
        ) : time ? (
          `Data from GitHub, updated ${new Date(time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
        ) : (
          "Selected project links supplied by Shriyashi."
        )}
      </div>
      {status === "loading" ? (
        <div className="project-grid" aria-label="Loading projects">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`project-skeleton ${i === 0 ? "featured" : ""}`}
            >
              <div />
              <span />
              <span />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="project-grid">
            {(all ? projects : projects.slice(0, 6)).map((p, i) => (
              <Reveal key={p.repo}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
          {projects.length > 6 && (
            <div className="center">
              <button className="button outline" onClick={() => setAll(!all)}>
                {all ? "Show selected projects" : "Show all projects"}{" "}
                <ArrowUpRight size={17} />
              </button>
            </div>
          )}
        </>
      )}
      <details className="resume-projects">
        <summary>
          More from my academic work <span>03 PROJECTS</span>
        </summary>
        <p className="fine-print">
          Project descriptions provided in my portfolio brief. Repository links
          are not yet confirmed.
        </p>
        <div className="academic-grid">
          {resumeFallbacks().map((p) => (
            <article key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="chips">
                {p.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="fine-print">Repository link coming soon</span>
            </article>
          ))}
        </div>
      </details>
    </SectionShell>
  );
}
