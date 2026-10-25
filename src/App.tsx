import { lazy, Suspense } from "react";
import { MotionConfig } from "motion/react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/layout/Footer";
const Story = lazy(() => import("@/components/sections/Story"));
const Projects = lazy(() => import("@/components/sections/Projects"));
const Experience = lazy(() =>
  import("@/components/sections/Story").then((module) => ({
    default: module.ExperienceAndAchievements,
  })),
);
const Contact = lazy(() => import("@/components/sections/Contact"));
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}
