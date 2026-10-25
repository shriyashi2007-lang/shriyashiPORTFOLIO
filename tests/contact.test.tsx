import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { config } from "@/data/config";
import Contact from "@/components/sections/Contact";
const original = config.contact.endpoint;
beforeEach(() => {
  config.contact.endpoint = "https://formspree.io/f/test";
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  cleanup();
  config.contact.endpoint = original;
  vi.unstubAllGlobals();
});
function fill() {
  fireEvent.change(screen.getByLabelText("Your name"), {
    target: { value: "Shriyashi" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("What’s on your mind?"), {
    target: { value: "Let us build something together." },
  });
}
it("blocks invalid fields and exposes validation messages", () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  render(<Contact />);
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  expect(screen.getByText(/at least 2 characters/)).toBeInTheDocument();
  expect(screen.getByText(/valid email/)).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
it("reports actual endpoint success and clears the form", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
  );
  render(<Contact />);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("Message delivered"),
  );
  expect(screen.getByLabelText("Your name")).toHaveValue("");
});
it("reports delivery failure honestly", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("{}", { status: 500 })),
  );
  render(<Contact />);
  fill();
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent("could not be sent"),
  );
  expect(screen.getByLabelText("Your name")).toHaveValue("Shriyashi");
});
it("blocks honeypot submissions", () => {
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  render(<Contact />);
  fill();
  fireEvent.change(screen.getByLabelText("Leave this field empty"), {
    target: { value: "spam" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send message" }));
  expect(fetch).not.toHaveBeenCalled();
});
