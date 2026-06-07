import { motion, useScroll } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-1 origin-left z-[100] bg-gradient-to-r from-[#1B56D2] via-[#E31E24] to-[#1B56D2]"
    />
  );
}
