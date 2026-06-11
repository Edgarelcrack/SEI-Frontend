import { useEffect, useRef, useState, type ReactNode } from "react";
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

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * maxTilt * 2);
    rx.set(-py * maxTilt * 2);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={interactive ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
      onMouseMove={interactive ? handleMove : undefined}
      onMouseLeave={interactive ? reset : undefined}
    >
      {children}
    </motion.div>
  );
}
