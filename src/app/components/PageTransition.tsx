import { useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const COVER_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Congela el contenido del outlet en el momento del montaje para que la
 * página saliente siga visible durante su animación de salida.
 */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

export function PageTransition() {
  const location = useLocation();
  const reduce = useReducedMotion() ?? false;

  // Scroll a anclas (p. ej. /#approach) cuando la página destino ya está montada.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 600);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        // En este punto la cortina cubre la pantalla: el salto no se ve.
        if (!window.location.hash) {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        }
      }}
    >
      <motion.div key={location.pathname} initial="enter" animate="idle" exit="exit">
        {/* Cortina de marca: cubre al salir (baja desde arriba) y revela al entrar (sigue hacia abajo) */}
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center bg-[#1B56D2]"
          variants={{
            enter: { y: "0%" },
            idle: {
              y: "100%",
              transition: { duration: reduce ? 0 : 0.55, ease: COVER_EASE, delay: 0.05 },
            },
            exit: {
              y: ["-100%", "0%"],
              transition: { duration: reduce ? 0 : 0.4, ease: COVER_EASE },
            },
          }}
        >
          <span className="text-white font-black tracking-tighter uppercase text-5xl select-none">
            SEI
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#E31E24]" />
        </motion.div>

        <FrozenOutlet />
      </motion.div>
    </AnimatePresence>
  );
}
