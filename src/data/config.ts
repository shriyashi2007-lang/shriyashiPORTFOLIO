export const config = {
  name: "Shriyashi",
  tagline:
    "Computer Science Engineering student · AI & Data Analytics enthusiast",
  roles: [
    "Computer Science Engineering Student",
    "AI & Data Analytics Enthusiast",
    "Full-Stack Developer",
    "React Developer",
    "Problem Solver",
  ],
  location: "New Delhi, India",
  email: "Shriyashi2007@gmail.com",
  github: {
    username:
      (import.meta.env.VITE_GITHUB_USERNAME as string | undefined)?.trim() ||
      "shriyashi2007-lang",
  },
  social: {
    linkedin: null as string | null,
    leetcode: null as string | null,
    kaggle: null as string | null,
  },
  phone: null as string | null,
  resumeUrl: "/resume/Shriyashi_Resume.pdf",
  education: {
    degree: "B.Tech in Computer Science Engineering",
    school: "K.R. Mangalam University",
    years: "2024–2028",
    cgpa: "8.8+",
    scholarship: "35% Merit Scholarship",
  },
  sih2026: {
    status: "unverified" as
      "unverified" | "participated" | "selected" | "completed",
    showUnverified: true,
  },
  contact: {
    provider: "formspree",
    endpoint:
      (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) || null,
  },
  experience: [
    {
      title: "Deloitte Data Analytics",
      subtitle: "Job simulation · Forage",
      date: "JUL 2026",
      description: "Completed a virtual job simulation in data analytics.",
      type: "Virtual experience",
    },
    {
      title: "Smart India Hackathon",
      subtitle: "SIH 2025",
      date: "2025",
      description: "Participated in Smart India Hackathon 2025.",
      type: "Hackathon participation",
    },
    {
      title: "Arambhathon",
      subtitle: "College AI Hackathon",
      date: "2025",
      description: "Participated in the Arambhathon 2025 AI hackathon.",
      type: "Hackathon participation",
    },
  ],
  certifications: [
    {
      title: "Data Analytics Job Simulation",
      issuer: "Deloitte · Forage",
      date: "JUL 2026",
      file: null as string | null,
    },
    {
      title: "Smart India Hackathon",
      issuer: "Certificate of Participation",
      date: "2025",
      file: null as string | null,
    },
    {
      title: "Arambhathon AI Hackathon",
      issuer: "Certificate of Participation",
      date: "2025",
      file: null as string | null,
    },
  ],
  resumeProjects: [
    {
      title: "PaperMind AI",
      description: "AI-powered automated question paper generation.",
      tags: ["React", "FastAPI", "SQL", "Python"],
    },
    {
      title: "University Dashboard",
      description: "Responsive university management dashboard.",
      tags: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Campus Energy Use Dashboard",
      description: "Python-based campus energy consumption analysis.",
      tags: ["Python", "Data Analytics"],
    },
  ],
};
export const publicAssets = Object.keys(
  import.meta.glob("/public/**/*", {
    query: "?url",
    import: "default",
    eager: true,
  }),
).map((path) => path.replace("/public", ""));
export const hasAsset = (path: string | null): path is string =>
  !!path && publicAssets.includes(path);
export const verifiedHackathons = () =>
  config.experience.filter((item) => item.type === "Hackathon participation")
    .length + (config.sih2026.status === "unverified" ? 0 : 1);
