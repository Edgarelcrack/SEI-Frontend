import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

interface RevealTextProps {
  text: string;
  className?: string;
  /** Retraso inicial (s) antes de la primera palabra. */
  delay?: number;
}

/**
 * Revela un párrafo palabra a palabra (cada palabra sube desde abajo de su
 * línea) cuando entra en pantalla. Con prefers-reduced-motion se muestra plano.
 */
export function RevealText({ text, className, delay = 0 }: RevealTextProps) {
  const reduce = useReducedMotion() ?? false;
  const words = useMemo(() => text.split(" "), [text]);

  if (reduce) {
    return <p className={className}>{text}</p>;
  }

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
        >
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: "120%" }, visible: { y: "0%" } }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.025 }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}
