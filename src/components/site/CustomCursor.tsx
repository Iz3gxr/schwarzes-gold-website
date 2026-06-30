import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 24, stiffness: 250, mass: 0.6 });
  const ringY = useSpring(y, { damping: 24, stiffness: 250, mass: 0.6 });

  const lastTarget = useRef<Element | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-root");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      if (target !== lastTarget.current) {
        lastTarget.current = target;
        const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label");
        setHovering(!!interactive);
      }
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, [x, y]);

  if (!enabled) return null;

  const dotSize = 8;
  const ringSize = hovering ? 48 : 32;

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
        }}
        className="fixed top-0 left-0 z-[200] rounded-full bg-gold pointer-events-none mix-blend-normal"
        animate={{ scale: clicking ? 0.6 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      {/* Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: ringSize,
          height: ringSize,
        }}
        animate={{
          scale: clicking ? 0.85 : 1,
          backgroundColor: hovering ? "rgba(201, 168, 76, 0.12)" : "rgba(201, 168, 76, 0)",
        }}
        transition={{ type: "spring", stiffness: 250, damping: 24 }}
        className="fixed top-0 left-0 z-[199] rounded-full border border-gold pointer-events-none"
      />
    </>
  );
}
