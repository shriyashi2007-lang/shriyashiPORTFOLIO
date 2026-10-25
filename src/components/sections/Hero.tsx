import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Github,
  Mail,
  ChartNoAxesCombined,
} from "lucide-react";
import {
  SiPython,
  SiReact,
  SiTypescript,
  SiFastapi,
  SiMysql,
} from "react-icons/si";
import { useReducedMotion } from "motion/react";
import { config, hasAsset } from "@/data/config";
import {
  GhostWord,
  MagneticButton,
  ScriptTag,
} from "@/components/ui/Primitives";
const tools = [
  { name: "Python", icon: SiPython },
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "FastAPI", icon: SiFastapi },
  { name: "SQL", icon: SiMysql },
  { name: "Tableau", icon: ChartNoAxesCombined },
];
export default function Hero() {
  const reduce = useReducedMotion();
  const [role, setRole] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setRole((i) => (i + 1) % config.roles.length),
      3400,
    );
    return () => clearInterval(id);
  }, [reduce]);
  const profile = "/assets/profile/profile.webp";
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-eyebrow">
          <span>
            <i /> LEARNING. BUILDING. EVOLVING.
          </span>
          <span>
            NEW DELHI, INDIA <span aria-hidden="true">↗</span>
          </span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <ScriptTag>Hi, I’m</ScriptTag>
            <div className="hero-name">
              <GhostWord>PORTFOLIO</GhostWord>
              <h1 id="hero-title">
                Shriyashi<span>.</span>
              </h1>
            </div>
            <p className="hero-subtitle">
              A LITTLE CURIOSITY. A LOT OF BUILDING.
            </p>
            <p className="rotating-role" aria-label={config.roles[role]}>
              <span aria-hidden="true">&lt; </span>
              {config.roles[role]}
              <span aria-hidden="true"> /&gt;</span>
            </p>
            <p className="hero-description">
              I’m a Computer Science student with an {config.education.cgpa}{" "}
              CGPA and a {config.education.scholarship.toLowerCase()}. I explore
              AI, data analytics and full-stack development through hands-on
              projects, hackathons and the Deloitte virtual experience.
            </p>
            <div className="hero-actions">
              <MagneticButton href="#projects">
                Explore my work <ArrowUpRight size={19} />
              </MagneticButton>
              {hasAsset(config.resumeUrl) ? (
                <>
                  <a
                    className="button outline"
                    href={config.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View resume <ArrowUpRight size={18} />
                  </a>
                  <a
                    className="icon-button"
                    href={config.resumeUrl}
                    download
                    aria-label="Download resume"
                  >
                    <Download size={18} />
                  </a>
                </>
              ) : (
                <a className="text-link" href="#about">
                  A little about me <ArrowDownRight size={18} />
                </a>
              )}
            </div>
            <div className="tool-row">
              <span className="tool-label">
                MY EVERYDAY
                <br />
                TOOLKIT
              </span>
              {tools.map(({ name, icon: Icon }) => (
                <span className="tool-tile" key={name} title={name}>
                  <Icon aria-hidden="true" />
                  <span className="sr-only">{name}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="device-halo" aria-hidden="true" />
            <div className="portfolio-device">
              <div className="device-island" aria-hidden="true" />
              <div className="device-browser">
                <span>shriyashi / portfolio</span>
                <ArrowUpRight size={12} />
              </div>
              <div className="device-top">
                <span>
                  SHRIYASHI<span className="accent">.</span>
                </span>
                <span aria-hidden="true">☰</span>
              </div>
              <p className="device-title">
                Thoughtful code.
                <br />
                <em>Endless curiosity.</em>
              </p>
              <div className="device-subtitle">
                A COLLECTION OF IDEAS & EXPLORATIONS
              </div>
              <div className="botanical-art" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <span
                    key={i}
                    style={{ "--petal": i } as React.CSSProperties}
                  />
                ))}
                <i />
              </div>
              <div
                className="sticker device-monogram"
                aria-label="Shriyashi monogram"
              >
                {hasAsset(profile) ? (
                  <img src={profile} width="400" height="500" alt="Shriyashi" />
                ) : (
                  <span>
                    S<span className="sticker-dot">.</span>
                  </span>
                )}
              </div>
              <div className="device-bottom">
                <span>EXPLORE THE POSSIBILITIES</span>
                <ArrowDown size={14} />
              </div>
            </div>
            <div className="device-note">
              <span className="note-line" />
              <span>
                Ideas deserve
                <br />
                <em>to become real.</em>
              </span>
            </div>
            <span className="visual-caption">
              AN ORIGINAL PORTFOLIO STUDY · MADE WITH CSS
            </span>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#about" className="scroll-cue">
            <ArrowDown size={16} /> SCROLL TO EXPLORE
          </a>
          <span className="hero-index">
            PORTFOLIO / {new Date().getFullYear()}
          </span>
          <div className="social-row">
            <a href={`mailto:${config.email}`} aria-label="Email Shriyashi">
              <Mail size={19} />
            </a>
            {config.github.username && (
              <a
                href={`https://github.com/${config.github.username}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                <Github size={19} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
