import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Award, GraduationCap, MoveUpRight } from "lucide-react";
import { config, hasAsset, verifiedHackathons } from "@/data/config";
import { skills } from "@/data/skills";
import { education } from "@/data/education";
import { BannerBar, Reveal, SectionShell } from "@/components/ui/Primitives";
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inside = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const spring = useSpring(inside ? value : 0, { duration: 1200, bounce: 0 });
  const display = useTransform(
    spring,
    (v) => `${Number(v.toFixed(value % 1 ? 1 : 0))}${suffix}`,
  );
  return (
    <span ref={ref}>
      {reduce ? `${value}${suffix}` : <motion.span>{display}</motion.span>}
    </span>
  );
}
function Education() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 40%"],
  });
  return (
    <SectionShell
      id="education"
      number="02"
      label="THE FOUNDATION"
      title="ALWAYS LEARNING"
      script="one step at a time."
    >
      <Reveal className="education-grid">
        <div className="education-note">
          <GraduationCap size={44} strokeWidth={1} />
          <p>
            Building a strong foundation.
            <br />
            Keeping an open mind.
          </p>
        </div>
        <div ref={ref} className="education-timeline">
          <svg
            className="timeline-line"
            width="12"
            height="260"
            viewBox="0 0 12 260"
            aria-hidden="true"
          >
            <path d="M6 4V260" stroke="var(--line)" strokeWidth="2" />
            <motion.path
              d="M6 4V260"
              stroke="var(--navy)"
              strokeWidth="2"
              style={{ pathLength: reduce ? 1 : scrollYProgress }}
            />
          </svg>
          {education.map((entry) => (
            <div
              key={`${entry.school}-${entry.years}`}
              className="education-entry"
            >
              <span className="timeline-dot" />
              <span className="label">{entry.years} · UNDERGRADUATE</span>
              <h3>{entry.degree}</h3>
              <p>{entry.school}</p>
              <div className="education-badges">
                <span>{entry.cgpa} CGPA</span>
                <span>
                  <Award size={15} />
                  {entry.scholarship}
                </span>
              </div>
              <p className="fine-print">
                Merit scholarship awarded for outstanding Class XII performance.
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}
function Certifications() {
  return (
    <SectionShell
      id="certifications"
      number="06"
      label="LEARNING, RECOGNISED"
      title="CERTIFICATIONS"
      script="little milestones."
    >
      <div className="certificate-grid">
        {config.certifications.map((c, i) => (
          <Reveal key={c.title}>
            <article className="certificate">
              <div className="certificate-top">
                <Award size={30} strokeWidth={1} />
                <span>0{i + 1}</span>
              </div>
              <p className="label">{c.issuer}</p>
              <h3>{c.title}</h3>
              <p className="certificate-date">{c.date}</p>
              {hasAsset(c.file) ? (
                <a
                  className="text-link"
                  href={c.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View certificate <ArrowUpRight size={15} />
                </a>
              ) : (
                <button className="certificate-pending" disabled>
                  Certificate not uploaded yet
                </button>
              )}
            </article>
          </Reveal>
        ))}
      </div>
      {(config.sih2026.status !== "unverified" ||
        config.sih2026.showUnverified) && (
        <p className="unverified">
          SIH 2026 ·{" "}
          {config.sih2026.status === "unverified"
            ? "Details to be confirmed"
            : config.sih2026.status}{" "}
          · Certificate not uploaded yet
        </p>
      )}
    </SectionShell>
  );
}
export default function Story() {
  return (
    <>
      <SectionShell
        id="about"
        number="01"
        label="A LITTLE INTRODUCTION"
        title="MORE THAN CODE"
        script="curiosity comes first."
      >
        <div className="about-grid">
          <Reveal>
            <p className="large-serif">
              A student by chapter.
              <br />A builder by instinct<span className="accent">.</span>
            </p>
            <div className="about-stamp" aria-hidden="true">
              LEARN
              <br />
              <MoveUpRight size={26} />
              <br />
              BUILD
              <br />
              REPEAT
            </div>
          </Reveal>
          <Reveal>
            <p className="body-serif">
              I’m Shriyashi, a Computer Science Engineering student at K.R.
              Mangalam University. I’m interested in the space where data,
              intelligent systems and thoughtful interfaces meet.
            </p>
            <p className="body-serif">
              My learning extends into hands-on projects, hackathon
              participation and the Deloitte Data Analytics job simulation. I
              enjoy turning the concepts I study into things I can build and
              explore.
            </p>
            <div className="chips interest-chips">
              {[
                "Data Analytics",
                "Artificial Intelligence",
                "Full-Stack Development",
                "Problem Solving",
              ].map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="soft-skills">
              <span className="label">HOW I WORK</span> Teamwork <span>·</span>{" "}
              Leadership <span>·</span> Communication
            </div>
          </Reveal>
        </div>
      </SectionShell>
      <Education />
      <BannerBar>CURIOUS MIND. PRACTICAL SKILLS.</BannerBar>
      <SectionShell
        id="skills"
        number="03"
        label="TOOLS OF THE TRADE"
        title="MY TOOLKIT"
        script="always growing."
      >
        <div className="section-intro">
          <p>
            The languages, frameworks and foundations I’m learning and building
            with.
          </p>
          <span className="label">NO PERCENTAGES. JUST PRACTICE.</span>
        </div>
        <div className="skills-grid">
          {skills.map((group, i) => (
            <Reveal key={group.title}>
              <article className="skill-card">
                <div className="skill-heading">
                  <span className="skill-symbol" aria-hidden="true">
                    {group.symbol}
                  </span>
                  <span className="fine-print">0{i + 1}</span>
                </div>
                <h3>{group.title}</h3>
                <div className="chips">
                  {group.items.map((item) => (
                    <span className="chip" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
export function ExperienceAndAchievements() {
  return (
    <>
      <BannerBar>LEARN BY DOING. GROW BY BUILDING.</BannerBar>
      <SectionShell
        id="experience"
        number="05"
        label="BEYOND THE CLASSROOM"
        title="THE JOURNEY"
        script="showing up & learning."
      >
        <div className="experience-list">
          {config.experience.map((item, i) => (
            <Reveal key={item.title}>
              <article className="experience-card">
                <span className="experience-date">{item.date}</span>
                <div>
                  <span className="label">{item.type}</span>
                  <h3>{item.title}</h3>
                  <p className="experience-subtitle">{item.subtitle}</p>
                  <p>{item.description}</p>
                </div>
                <span className="experience-number" aria-hidden="true">
                  0{i + 1}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
        {(config.sih2026.status !== "unverified" ||
          config.sih2026.showUnverified) && (
          <p className="unverified">
            Smart India Hackathon 2026{" "}
            <span>
              ·{" "}
              {config.sih2026.status === "unverified"
                ? "Details to be confirmed"
                : config.sih2026.status}
            </span>
          </p>
        )}
      </SectionShell>
      <Certifications />
      <SectionShell
        id="achievements"
        number="07"
        label="PROGRESS, NOT PERFECTION"
        title="SMALL WINS"
        script="and counting."
      >
        <div className="achievement-grid">
          <Reveal>
            <article>
              <span className="stat-number">
                <Counter value={parseFloat(config.education.cgpa)} suffix="+" />
              </span>
              <h3>CGPA</h3>
              <p>Learning with consistency</p>
            </article>
          </Reveal>
          <Reveal>
            <article>
              <span className="stat-number">
                <Counter
                  value={parseFloat(config.education.scholarship)}
                  suffix="%"
                />
              </span>
              <h3>Merit scholarship</h3>
              <p>For Class XII performance</p>
            </article>
          </Reveal>
          <Reveal>
            <article>
              <span className="stat-number">
                <Counter value={verifiedHackathons()} suffix="" />
              </span>
              <h3>Hackathon participations</h3>
              <p>Ideas, teamwork and learning</p>
            </article>
          </Reveal>
          <Reveal>
            <article>
              <span className="stat-number stat-word">
                DONE<span className="accent">.</span>
              </span>
              <h3>Deloitte job simulation</h3>
              <p>Data Analytics · Forage</p>
            </article>
          </Reveal>
        </div>
      </SectionShell>
    </>
  );
}
