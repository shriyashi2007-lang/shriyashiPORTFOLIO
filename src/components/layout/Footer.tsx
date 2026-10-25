import { ArrowUpRight, ArrowUp, Github, Mail } from "lucide-react";
import { config } from "@/data/config";
export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-main">
          <a href="#home" className="wordmark">
            SHRIYASHI<span>.</span>
          </a>
          <p>Learning. Building. Evolving.</p>
          <a href="#home" className="back-top">
            Back to top <ArrowUp size={17} />
          </a>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {[
            "about",
            "education",
            "skills",
            "projects",
            "experience",
            "certifications",
            "achievements",
            "contact",
          ].map((id) => (
            <a href={`#${id}`} key={id}>
              {id} <ArrowUpRight size={12} />
            </a>
          ))}
        </nav>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {config.name}
          </span>
          <span>BUILT WITH INTENTION & A LITTLE CODE.</span>
          <div className="social-row">
            <a href={`mailto:${config.email}`} aria-label="Email Shriyashi">
              <Mail size={17} />
            </a>
            {config.github.username && (
              <a
                href={`https://github.com/${config.github.username}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                <Github size={17} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
