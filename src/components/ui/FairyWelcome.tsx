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
  const [flightPath, setFlightPath] = useState("");
  useLayoutEffect(() => {
    const resize = () => {
      const w = window.innerWidth,
        h = window.innerHeight;
      const flightY = (value: number) => h * (0.5 + (value - 0.5) * 0.16);
      setFlightPath(
        `path("M ${1.45 * w} ${flightY(0.5)} C ${1.05 * w} ${flightY(0.23)}, ${0.5 * w} ${flightY(0.275)}, ${0.57 * w} ${flightY(0.48)} C ${0.62 * w} ${flightY(0.71)}, ${1.06 * w} ${flightY(0.68)}, ${0.94 * w} ${flightY(0.475)} C ${0.8 * w} ${flightY(0.2)}, ${0.2 * w} ${flightY(0.26)}, ${0.3 * w} ${flightY(0.5)} C ${0.42 * w} ${flightY(0.745)}, ${0.78 * w} ${flightY(0.675)}, ${0.63 * w} ${flightY(0.465)} C ${0.45 * w} ${flightY(0.24)}, ${0.12 * w} ${flightY(0.31)}, ${-0.45 * w} ${flightY(0.5)}")`,
      );
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const timeout = setTimeout(
      () =>
        phase === "leaving"
          ? onComplete()
          : setPhase(phase === "flying" ? "blooming" : "leaving"),
      phase === "flying" ? 4200 : phase === "blooming" ? 1600 : 100,
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
      style={{ "--flight-path": flightPath } as CSSProperties}
    >
      <div className="fairy-scene" aria-hidden="true">
        <div className="fairy-circle-guide" />
        <div className="fairy-orbit">
          <div className="fairy-rider">
            <img
              className="fairy-portrait"
              src="/assets/fairy/fairy-cutout.png"
              width="1254"
              height="1254"
              alt=""
              fetchPriority="high"
            />
            <span className="fairy-flight-trail" />
          </div>
        </div>
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
                  "--petal-delay": `${i * 0.035}s`,
                  "--petal-duration": `${1.65 + (i % 4) * 0.1}s`,
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
