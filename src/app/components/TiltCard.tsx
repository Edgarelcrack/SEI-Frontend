import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Inclinación máxima en grados. */
  maxTilt?: number;
}

/**
 * Inclina su contenido en 3D siguiendo el cursor. Inactivo en táctil
 * y cuando el usuario prefiere menos movimiento.
 */
export function TiltCard({ children, className, maxTilt = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 20, mass: 0.6 };
  const rotateX = useSpring(rx, springConfig);
  const rotateY = useSpring(ry, springConfig);

  const interactive = finePointer && !reduce;

  /*
   * La geometría se cachea en vez de medirse en cada mousemove:
   * getBoundingClientRect() fuerza un reflow síncrono, y con el cursor
   * recorriendo una rejilla de cards eso son cientos de reflows por segundo.
   * El caché se invalida al hacer scroll o redimensionar (que es cuando el
   * rect deja de ser válido) y se vuelve a medir de forma perezosa.
   */
  const rectRef = useRef<DOMRect | null>(null);

  // Referencia estable: add/removeEventListener deben recibir la misma función
  // aunque el componente se vuelva a renderizar mientras el cursor está encima.
  const invalidate = useCallback(() => {
    rectRef.current = null;
  }, []);

  function handleEnter() {
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    let rect = rectRef.current;
    if (!rect) {
      rect = ref.current?.getBoundingClientRect() ?? null;
      rectRef.current = rect;
      if (!rect) return;
    }
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * maxTilt * 2);
    rx.set(-py * maxTilt * 2);
  }

  function handleLeave() {
    window.removeEventListener("scroll", invalidate);
    window.removeEventListener("resize", invalidate);
    invalidate();
    rx.set(0);
    ry.set(0);
  }

  // Si el componente se desmonta con el cursor encima, los listeners deben irse.
  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, [invalidate]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={interactive ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      onMouseEnter={interactive ? handleEnter : undefined}
      onMouseMove={interactive ? handleMove : undefined}
      onMouseLeave={interactive ? handleLeave : undefined}
    >
      {children}
    </motion.div>
  );
}
