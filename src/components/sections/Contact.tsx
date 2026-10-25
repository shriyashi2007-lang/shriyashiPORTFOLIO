import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, Send } from "lucide-react";
import { config } from "@/data/config";
import { BannerBar, Reveal } from "@/components/ui/Primitives";
export const validateContact = (
  name: string,
  email: string,
  message: string,
) => ({
  name:
    name.trim().length < 2
      ? "Please enter your name (at least 2 characters)."
      : "",
  email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "Please enter a valid email address."
    : "",
  message:
    message.trim().length < 10 ? "Please write at least 10 characters." : "",
});
export default function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const endpoint = config.contact.endpoint;
  async function submit(e: FormEvent) {
    e.preventDefault();
    const found = validateContact(values.name, values.email, values.message);
    setErrors(found);
    if (Object.values(found).some(Boolean) || !endpoint || values.website)
      return;
    setState("loading");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...values, _gotcha: values.website }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Delivery failed");
      setState("success");
      setValues({ name: "", email: "", message: "", website: "" });
    } catch {
      setState("error");
    } finally {
      clearTimeout(timeout);
    }
  }
  return (
    <section id="contact" aria-labelledby="contact-title">
      <BannerBar>LET’S WORK TOGETHER</BannerBar>
      <div className="container contact-grid">
        <Reveal>
          <span className="label">08 / NEXT CHAPTER</span>
          <h2 id="contact-title" className="contact-title">
            HAVE AN IDEA?
            <br />
            SAY HELLO<span className="accent">.</span>
          </h2>
          <p className="body-serif">
            A question, a collaboration, or a conversation about something
            you’re building — my inbox is open.
          </p>
          <a className="contact-email" href={`mailto:${config.email}`}>
            {config.email}
            <ArrowUpRight size={22} />
          </a>
          <p className="location">
            <MapPin size={15} />
            {config.location}
          </p>
          {config.phone && <a href={`tel:${config.phone}`}>{config.phone}</a>}
          <div className="social-text">
            {config.github.username && (
              <a
                href={`https://github.com/${config.github.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <ArrowUpRight size={14} />
              </a>
            )}
            {Object.entries(config.social)
              .filter(([, url]) => !!url)
              .map(([label, url]) => (
                <a
                  key={label}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label} <ArrowUpRight size={14} />
                </a>
              ))}
          </div>
        </Reveal>
        <Reveal>
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="form-top">
              <span className="label">LET’S START A CONVERSATION</span>
              <Mail size={20} />
            </div>
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="How should I call you?"
              value={values.name}
              maxLength={100}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="field-error">
                {errors.name}
              </p>
            )}
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              autoComplete="email"
              type="email"
              placeholder="you@example.com"
              maxLength={254}
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="field-error">
                {errors.email}
              </p>
            )}
            <label htmlFor="message">What’s on your mind?</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell me a little about your idea…"
              rows={3}
              maxLength={5000}
              value={values.message}
              onChange={(e) =>
                setValues({ ...values, message: e.target.value })
              }
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              required
            />
            {errors.message && (
              <p id="message-error" className="field-error">
                {errors.message}
              </p>
            )}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                tabIndex={-1}
                id="website"
                autoComplete="off"
                value={values.website}
                onChange={(e) =>
                  setValues({ ...values, website: e.target.value })
                }
              />
            </div>
            {endpoint ? (
              <button
                className="button"
                type="submit"
                disabled={state === "loading"}
              >
                {state === "loading" ? "Sending…" : "Send message"}
                <Send size={16} />
              </button>
            ) : (
              <div className="unconfigured">
                <p>Form not configured yet. Email me directly.</p>
                <a className="button" href={`mailto:${config.email}`}>
                  Email me <ArrowUpRight size={17} />
                </a>
              </div>
            )}
            <p
              role="status"
              aria-live="polite"
              className={state === "error" ? "field-error" : "form-status"}
            >
              {state === "success"
                ? "Message delivered. Thank you for reaching out!"
                : state === "error"
                  ? "Your message could not be sent. Please try again or email me directly."
                  : ""}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
