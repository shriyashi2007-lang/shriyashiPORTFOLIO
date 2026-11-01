import { useEffect, useState } from "react";

export default function ScrollRail() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const percent = Math.round(progress * 100);
  return (
    <aside className="scroll-rail" aria-label="Page progress">
      <button
        className="scroll-rail-track"
        type="button"
        aria-label={`Page progress ${percent} percent. Click to move.`}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const ratio = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
          window.scrollTo({ top: ratio * (document.documentElement.scrollHeight - window.innerHeight), behavior: "smooth" });
        }}
      >
        <span className="scroll-rail-thumb" style={{ top: `${progress * 100}%` }} />
      </button>
      <span className="scroll-rail-label">{String(percent).padStart(2, "0")}</span>
    </aside>
  );
}
