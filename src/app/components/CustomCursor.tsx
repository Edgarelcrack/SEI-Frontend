import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type CursorMode = "default" | "link" | "hidden";

const ringVariants = {
  default: { width: 36, height: 36, opacity: 1 },
  link: { width: 60, height: 60, opacity: 1 },
  hidden: { width: 36, height: 36, opacity: 0 },
};

/**
 * Cursor brutalista: punto que sigue directo + anillo con retraso elástico.
 * Crece un poco sobre elementos interactivos; nunca cambia de forma ni muestra
 * etiquetas. Solo se activa con puntero fino (desktop).
 *
 * Rendimiento: aquí NO se usa `mix-blend-mode`. Un blend sobre un elemento
 * fijo que se mueve con el ratón obliga al navegador a releer y recomponer
 * el fondo de todo el viewport en cada evento de puntero (Firefox no tiene
 * el atajo que sí aplica Chrome). El contraste se resuelve con el tema.
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
      if (target.closest("input, textarea, select")) setMode("hidden");
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
        className="fixed top-0 left-0 z-[250] pointer-events-none will-change-transform"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border dark:border-white border-zinc-900"
          variants={ringVariants}
          initial="hidden"
          animate={mode}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* Punto (sigue directo, sin retraso) */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[251] pointer-events-none will-change-transform"
        style={{ x, y }}
      >
        <motion.div
          className="w-2 h-2 -ml-1 -mt-1 rounded-full dark:bg-white bg-zinc-900"
          animate={{
            scale: mode === "hidden" ? 0 : 1,
            opacity: mode === "hidden" ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </>
  );
}
