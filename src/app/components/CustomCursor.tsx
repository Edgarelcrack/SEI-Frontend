import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type CursorMode = "default" | "link" | "ver" | "hidden";

const ringVariants = {
  default: { width: 36, height: 36, opacity: 1, backgroundColor: "rgba(27, 86, 210, 0)" },
  link: { width: 60, height: 60, opacity: 1, backgroundColor: "rgba(27, 86, 210, 0)" },
  ver: { width: 88, height: 88, opacity: 1, backgroundColor: "rgba(27, 86, 210, 1)" },
  hidden: { width: 36, height: 36, opacity: 0, backgroundColor: "rgba(27, 86, 210, 0)" },
};

/**
 * Cursor brutalista: punto que sigue directo + anillo con retraso elástico.
 * Crece sobre enlaces y se convierte en un disco "VER" sobre las cards
 * marcadas con data-cursor="ver". Solo se activa con puntero fino (desktop).
 */
export function CustomCursor() {
  const reduce = useReducedMotion() ?? false;
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("hidden");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const handleOver = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-cursor="ver"]')) setMode("ver");
      else if (target.closest("input, textarea, select")) setMode("hidden");
      else if (target.closest('a, button, [role="button"], label, summary')) setMode("link");
      else setMode("default");
    };
    const handleLeave = () => setMode("hidden");

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Anillo (sigue con retraso elástico) */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[250] pointer-events-none"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border flex items-center justify-center ${
            mode === "ver" ? "border-transparent" : "border-white mix-blend-difference"
          }`}
          variants={ringVariants}
          initial="hidden"
          animate={mode}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="text-white text-[10px] font-black tracking-[0.25em] uppercase select-none"
            animate={{ opacity: mode === "ver" ? 1 : 0, scale: mode === "ver" ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            Ver
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Punto (sigue directo, sin retraso) */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[251] pointer-events-none"
        style={{ x, y }}
      >
        <motion.div
          className="w-2 h-2 -ml-1 -mt-1 rounded-full bg-white mix-blend-difference"
          animate={{
            scale: mode === "ver" || mode === "hidden" ? 0 : 1,
            opacity: mode === "hidden" ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}
