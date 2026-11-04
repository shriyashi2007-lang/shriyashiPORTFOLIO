import { useEffect, useState } from "react";

export default function PointerCursor() {
  const [point, setPoint] = useState({ x: -40, y: -40 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (event: MouseEvent) => {
      setPoint({ x: event.clientX, y: event.clientY });
      setHovering(Boolean((event.target as HTMLElement).closest("a, button")));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <span className={`pointer-cursor ${hovering ? "is-hovering" : ""}`} style={{ left: point.x, top: point.y }} aria-hidden="true" />;
}
