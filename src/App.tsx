import {
  lazy,
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MotionConfig } from "motion/react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";
import FairyWelcome from "@/components/ui/FairyWelcome";
const Story = lazy(() => import("@/components/sections/Story"));
const Projects = lazy(() => import("@/components/sections/Projects"));
const Experience = lazy(() =>
  import("@/components/sections/Story").then((module) => ({
    default: module.ExperienceAndAchievements,
  })),
);
const Contact = lazy(() => import("@/components/sections/Contact"));
export default function App() {
  const [opening, setOpening] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const content = useRef<HTMLDivElement>(null);
  const hadWelcome = useRef(opening);
  const finishWelcome = useCallback(() => {
    setOpening(false);
  }, []);
  useLayoutEffect(() => {
    if (content.current) content.current.inert = opening;
    if (!opening && hadWelcome.current) {
      hadWelcome.current = false;
      document.getElementById("main")?.focus({ preventScroll: true });
    }
  }, [opening]);
  return (
    <MotionConfig reducedMotion="user">
      {opening && <FairyWelcome onComplete={finishWelcome} />}
      <div ref={content} aria-hidden={opening ? true : undefined}>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Suspense
            fallback={
              <div className="container section-loading" role="status">
                Loading the next chapter…
              </div>
            }
          >
            <Story />
            <Projects />
            <Experience />
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
