import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { reveal } from "@/lib/motionPresets";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={reveal}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
export function GhostWord({ children }: { children: ReactNode }) {
  return (
    <span className="ghost" aria-hidden="true">
      <svg width="100%" height="100%" aria-hidden="true" focusable="false">
        <text x="0" y=".85em" fill="currentColor">
          {children}
        </text>
      </svg>
    </span>
  );
}
export function ScriptTag({ children }: { children: ReactNode }) {
  return <span className="script">{children}</span>;
}
export function BannerBar({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="banner"
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="container banner-inner">
        {children}
        <span aria-hidden="true">✳</span>
      </div>
    </motion.div>
  );
}
export function SectionShell({
  id,
  number,
  label,
  title,
  script,
  children,
  className = "",
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  script?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="container">
        <div className="section-meta">
          <span>
            {number} / {label}
          </span>
          <span className="meta-line" />
        </div>
        <Reveal className="heading-wrap">
          <GhostWord>{title}</GhostWord>
          <h2 id={`${id}-title`}>{title}</h2>
          {script && <ScriptTag>{script}</ScriptTag>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
export function MagneticButton({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  function move(e: MouseEvent<HTMLAnchorElement>) {
    if (reduce || matchMedia("(pointer: coarse)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform = `translate(${Math.max(-8, Math.min(8, (e.clientX - r.left - r.width / 2) * 0.12))}px, ${Math.max(-8, Math.min(8, (e.clientY - r.top - r.height / 2) * 0.12))}px)`;
  }
  return (
    <a
      ref={ref}
      className={`button ${className}`}
      href={href}
      onMouseMove={move}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </a>
  );
}
