import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const letters = "SCHWARZES GOLD".split("");

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
          aria-hidden
        >
          <div className="flex">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`font-display text-4xl md:text-6xl tracking-[0.2em] ${
                  i >= 10 ? "text-gold" : "text-foreground"
                }`}
                style={{ display: ch === " " ? "inline-block" : undefined, width: ch === " " ? "0.5em" : undefined }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </div>
          <svg width="280" height="4" viewBox="0 0 280 4" className="mt-6">
            <motion.line
              x1="0" y1="2" x2="280" y2="2"
              stroke="var(--gold)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
