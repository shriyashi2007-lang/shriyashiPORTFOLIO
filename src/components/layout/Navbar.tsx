import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { config, hasAsset } from "@/data/config";
export const sections = [
  "home",
  "about",
  "education",
  "skills",
  "projects",
  "experience",
  "certifications",
  "achievements",
  "contact",
];
const navItems = ["about", "skills", "projects", "experience", "contact"];
export default function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      let current = "home";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) current = id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(onScroll, {
      threshold: [0, 0.2, 0.5],
    });
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const trigger = toggle.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button,a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const nodes = panel.current?.querySelectorAll<HTMLElement>("a,button");
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      trigger?.focus();
    };
  }, [open]);
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className={scrolled ? "header scrolled" : "header"}>
        <div className="container nav">
          <a href="#home" className="wordmark" aria-label="Shriyashi home">
            SHRIYASHI<span>.</span>
          </a>
          <nav aria-label="Main navigation" className="desktop-nav">
            {navItems.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
              >
                {id}
              </a>
            ))}
          </nav>
          {hasAsset(config.resumeUrl) ? (
            <a
              className="nav-resume"
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume <ArrowUpRight size={15} />
            </a>
          ) : (
            <span className="resume-pending">Resume coming soon</span>
          )}
          <button
            ref={toggle}
            className="menu-toggle icon-button"
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </header>
      {open && (
        <div
          id="mobile-menu"
          ref={panel}
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <button
            className="icon-button close-menu"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
          <nav aria-label="Mobile navigation">
            {sections.map((id, i) => (
              <a
                href={`#${id}`}
                key={id}
                aria-current={active === id ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                <small>0{i + 1}</small>
                {id}
              </a>
            ))}
          </nav>
          <p>{config.location}</p>
        </div>
      )}
    </>
  );
}
