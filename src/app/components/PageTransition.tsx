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

    let correction: number | undefined;
    let userTookOver = false;
    const release = () => {
      userTookOver = true;
    };

    const start = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      /*
       * Segunda pasada, a propósito. Las secciones llevan
       * `content-visibility: auto`: la primera vez que se visitan, el navegador
       * todavía no conoce su alto real y las mide con el valor de placeholder.
       * `scrollIntoView` calcula el destino con esas alturas, y mientras el
       * scroll avanza las secciones intermedias se renderizan de verdad, el
       * documento se reajusta y el ancla se desplaza: la animación termina
       * corta. Cuando el scroll suave ya ha parado se vuelve a medir y se
       * corrige solo si de verdad quedó fuera de sitio.
       */
      correction = window.setTimeout(() => {
        const target = document.getElementById(id);
        if (userTookOver || !target) return;
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        if (Math.abs(target.getBoundingClientRect().top - margin) > 4) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 900);
    }, 600);

    // Si el usuario coge el scroll durante ese intervalo, no se le corrige debajo.
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(correction);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
    };
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
