import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import "@/styles/fairy-welcome.css";

export default function FairyWelcome({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"flying" | "blooming" | "leaving">(
    "flying",
  );
  const skip = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const timeout = setTimeout(
      () =>
        phase === "leaving"
          ? onComplete()
          : setPhase(phase === "flying" ? "blooming" : "leaving"),
      phase === "flying" ? 3200 : phase === "blooming" ? 2200 : 650,
    );
    return () => clearTimeout(timeout);
  }, [phase, onComplete]);
  useLayoutEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    skip.current?.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhase("leaving");
      if (event.key === "Tab") {
        event.preventDefault();
        skip.current?.focus();
      }
    };
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (preference.matches) onComplete();
    };
    preference.addEventListener("change", change);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keyboard);
      preference.removeEventListener("change", change);
    };
  }, [onComplete]);
  return createPortal(
    <div
      className={`fairy-welcome is-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fairy-welcome-title"
      aria-describedby="fairy-welcome-description"
      data-testid="fairy-welcome"
    >
      <div className="fairy-scene" aria-hidden="true">
        <div className="fairy-forest-backdrop" />
        <img
          className="fairy-portrait"
          src="/assets/fairy/forest-fairy.png"
          width="554"
          height="554"
          alt=""
          fetchPriority="high"
        />
      </div>
      <div className="welcome-shade" aria-hidden="true" />
      <span className="welcome-wordmark">
        SHRIYASHI<span> ✧</span>
      </span>
      <div className="fairy-stage" aria-hidden="true">
        {Array.from({ length: 32 }, (_, i) => (
          <span
            key={i}
            className="welcome-sparkle"
            style={
              {
                left: `${4 + ((i * 37) % 92)}%`,
                top: `${4 + ((i * 23) % 90)}%`,
                "--twinkle-delay": `${i * 0.13}s`,
                "--spark-size": `${i % 4 === 0 ? 5 : 2}px`,
              } as CSSProperties
            }
          />
        ))}
        <div className="fairy-flowers">
          {Array.from({ length: 26 }, (_, i) => (
            <span
              className={`falling-flower ${i % 3 === 0 ? "whole-flower" : "single-petal"}`}
              key={i}
              style={
                {
                  "--flower-left": `${2 + ((i * 43) % 96)}%`,
                  "--petal-x": `${((i * 31) % 150) - 75}px`,
                  "--petal-spin": `${(i % 2 ? 1 : -1) * (140 + i * 17)}deg`,
                  "--petal-delay": `${i * 0.11}s`,
                  "--petal-duration": `${3.1 + (i % 5) * 0.3}s`,
                  "--petal-pink":
                    i % 3 === 0
                      ? "#f5d6dd"
                      : i % 3 === 1
                        ? "#eaa4c4"
                        : "#f2d494",
                } as CSSProperties
              }
            >
              {i % 3 === 0 ? "✿" : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="welcome-content">
        <p className="welcome-eyebrow">A LITTLE WONDER, BEFORE WE BEGIN</p>
        <h2 id="fairy-welcome-title">
          Let a little <em>magic</em> in.
        </h2>
        <p
          id="fairy-welcome-description"
          className="welcome-description"
          aria-live="polite"
        >
          {phase === "flying"
            ? "A flutter of wings. A trail of possibilities."
            : "A shower of flowers, and a new beginning."}
        </p>
        <div className="welcome-progress" aria-hidden="true">
          <span />
        </div>
      </div>
      <button
        ref={skip}
        className="welcome-skip"
        onClick={() => setPhase("leaving")}
      >
        Skip to portfolio <span aria-hidden="true">↗</span>
      </button>
      <span className="welcome-bottom-note" aria-hidden="true">
        MADE OF CURIOSITY & A LITTLE MAGIC
      </span>
    </div>,
    document.body,
  );
}
