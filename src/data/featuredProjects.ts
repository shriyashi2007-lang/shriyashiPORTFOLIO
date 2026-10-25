export const featuredProjects = [
  {
    repo: "dev-track-",
    title: "DevTrack",
    description:
      "A dedicated space for DSA practice, coding consistency and spaced repetition.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    art: "code",
    color: "blue",
    liveUrl: null,
  },
  {
    repo: "Ai-Productivity-Dashboard",
    title: "AI Productivity Dashboard",
    description:
      "Tasks, notes and an AI assistant, brought together in one focused workspace.",
    tags: ["React", "Groq AI", "Tailwind CSS"],
    art: "spark",
    color: "lavender",
    liveUrl: "https://ai-productivity-dashboard-taupe.vercel.app",
  },
  {
    repo: "student-resume-builder",
    title: "Student Resume Builder",
    description:
      "Turn student details into a formatted resume, ready to download as a PDF.",
    tags: ["JavaScript", "HTML5", "CSS3"],
    art: "resume",
    color: "peach",
    liveUrl: "https://student-resume-builder.vercel.app",
  },
  {
    repo: "Student-Scoreboard",
    title: "Student Scoreboard",
    description:
      "An accessible student performance dashboard with visual analytics and CSV tools.",
    tags: ["React", "JavaScript", "Vite"],
    art: "chart",
    color: "mint",
    liveUrl: "https://student-scoreboard-five.vercel.app",
  },
  {
    repo: "Supervisor-Feedback-Analyzer-Trinethra-Module",
    title: "Trinethra Feedback Analyzer",
    description:
      "AI-assisted transcript analysis with evidence, rubric scoring and follow-up questions.",
    tags: ["React", "Node.js", "Ollama"],
    art: "analysis",
    color: "pink",
    liveUrl: null,
  },
  {
    repo: "weather-data-visualizer-",
    title: "Weather Data Visualizer",
    description: "Python weather visualization application.",
    tags: ["Python", "Data Visualization"],
    art: "weather",
    color: "sand",
    liveUrl: null,
  },
  {
    repo: "async-Weather-Tracker",
    title: "Async Weather Tracker",
    description:
      "City weather search with asynchronous API requests and search history.",
    tags: ["JavaScript", "OpenWeatherMap", "HTML5"],
    art: "sun",
    color: "blue",
    liveUrl: "https://async-weather-tracker-jade.vercel.app",
  },
] as const;
export const hiddenRepos: string[] = [];
// Verified absent via GitHub on 25 October 2026; avoid a known failing request.
export const missingReadmes: string[] = ["weather-data-visualizer-"];
