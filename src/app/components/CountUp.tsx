import { memo, useEffect, useRef } from "react";
import { useInView, animate } from "motion/react";

interface CountUpProps {
  to: number;
  decimals?: number;
  duration?: number;
  /**
   * Si se pasa, el conteo se dispara con este flag (p. ej. el hover de una fila)
   * en vez de con la propia visibilidad del elemento.
   */
  trigger?: boolean;
}

export const CountUp = memo(function CountUp({
  to,
  decimals = 0,
  duration = 2,
  trigger,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Cuando no hay trigger externo, cuenta una sola vez al entrar en pantalla.
  const selfInView = useInView(ref, { once: trigger === undefined, amount: 0.4 });
  const active = trigger ?? selfInView;

  useEffect(() => {
    if (!active || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        node.textContent = value.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [active, to, decimals, duration]);

  return <span ref={ref}>{(0).toFixed(decimals)}</span>;
});
