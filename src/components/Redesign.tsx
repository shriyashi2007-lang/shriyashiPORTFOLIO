import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, Mail, X } from "lucide-react";
import { config } from "@/data/config";
import { featuredProjects } from "@/data/featuredProjects";
import "@/styles/redesign.css";
import "@/styles/redesign-overrides.css";

const roles = ["Web Developer", "UI/UX Designer", "Data Explorer", "Creative Builder"];
const doors = [
  ["Web Development", "Builds that feel fast, clear and alive.", "#ead7b7"],
  ["App Development", "Useful tools for everyday momentum.", "#d6c09b"],
  ["UI/UX Design", "Interfaces with a little more feeling.", "#b88761"],
  ["Graphic Design", "Visual systems with a point of view.", "#c97873"],
] as const;

export default function Redesign() {
  const [role, setRole] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { const id = window.setInterval(() => setRole((v) => (v + 1) % roles.length), 2200); return () => window.clearInterval(id); }, []);
  const selected = useMemo(() => doors.find(([name]) => name === open), [open]);
  return <div className="new-site">
    <header className="new-nav"><a href="#top" className="new-logo">SHRIYASHI<span>.</span></a><nav>{["Home", "Web Development", "App Development", "UI/UX Design", "Graphic Design", "My story", "Contact"].map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-").replace("/", "")}`}>{item}</a>)}</nav><time>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} — {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</time></header>
    <main id="top">
      <section className="new-hero"><div className="hero-tag">● Independent freelancer</div><div className="hero-layout"><div><p className="new-kicker">A LITTLE CURIOSITY. A LOT OF BUILDING.</p><h1>Hi, I’m<br /><em>Shriyashi.</em></h1><p className="new-intro">I am a <span className="role-sticker">{roles[role]}<i>✦</i></span></p><p className="new-copy">Computer Science student with a 9+ CGPA, a 35% merit scholarship and a habit of turning ideas into useful things.</p><div className="new-actions"><a className="new-pill" href="#contact">Start a project <ArrowUpRight size={17} /></a><a href="#doors">See my work <ArrowDown size={16} /></a></div></div><div className="portrait-card"><img src="/assets/profile/profile.webp" alt="Shriyashi" /><span>MY ABILITY CARD</span></div></div><div className="hero-foot"><span>AVAILABLE FOR WORK</span><a href="#doors">SCROLL DOWN ↓</a></div></section>
      <section className="doors-section" id="doors"><div className="new-section-head"><p>02 / THE WORKSHOP</p><h2>Magic happens<br /><em>behind the doors.</em></h2></div><div className="doors-grid">{doors.map(([name, desc, color], i) => <button key={name} className="magic-door" style={{ "--door": color } as React.CSSProperties} onClick={() => setOpen(name)}><span className="door-number">0{i + 1}</span><span className="door-shape"><b>{name}</b><small>{desc}</small><i>↗</i></span></button>)}</div></section>
      <section className="new-work" id="web-development"><p>03 / SELECTED WORK</p><h2>Things I’ve<br /><em>made lately.</em></h2><div className="new-projects">{featuredProjects.slice(0, 4).map((p) => <article key={p.repo}><span>{p.tags.slice(0, 2).join(" · ")}</span><h3>{p.title}</h3><p>{p.description}</p><a href={p.liveUrl ?? `https://github.com/${config.github.username}/${p.repo}`} target="_blank" rel="noreferrer">Explore <ArrowUpRight size={15} /></a></article>)}</div></section>
      <section className="new-story" id="my-story"><div><p>04 / MY STORY</p><h2>Let’s go<br /><em>back in time.</em></h2><strong>2026</strong></div><div className="story-line">{config.experience.slice(0, 3).map((x) => <article key={x.title}><span>{x.date}</span><h3>{x.title}</h3><p>{x.description}</p></article>)}</div></section>
      <section className="new-contact" id="contact"><p>● AVAILABLE FOR NEW WORK</p><h2>Got a project?<br /><em>Let’s build it together.</em></h2><a className="new-pill" href={`mailto:${config.email}`}>Say hello <Mail size={17} /></a><footer>{config.email}<span>SHRIYASHI © {new Date().getFullYear()}</span></footer></section>
    </main>{open && <div className="door-modal" role="dialog" aria-modal="true"><button onClick={() => setOpen(null)} aria-label="Close"><X /></button><p>DOOR OPEN / CATEGORY VIEW</p><h2>{selected?.[0]}</h2><p>{selected?.[1]}</p><div>{featuredProjects.filter((p) => p.tags.some((tag) => tag.toLowerCase().includes(selected?.[0].split(" ")[0].toLowerCase() ?? ""))).slice(0, 3).map((p) => <article key={p.repo}><h3>{p.title}</h3><span>{p.description}</span></article>)}</div></div>}
  </div>;
}
