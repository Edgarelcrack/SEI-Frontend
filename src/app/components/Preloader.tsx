import { useEffect, useRef, useState } from "react";
import { motion, animate } from "motion/react";

interface PreloaderProps {
  /** El contador llegó a 100: momento de montar la app detrás de la cortina. */
  onReveal: () => void;
  /** La cortina terminó de subir: ya se puede desmontar el preloader. */
  onComplete: () => void;
}

export function Preloader({ onReveal, onComplete }: PreloaderProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("sei-preloader-shown", "1");
    } catch {
      /* sin sessionStorage, el preloader simplemente volverá a mostrarse */
    }
    document.documentElement.style.overflow = "hidden";

    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate(value) {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(value)).padStart(3, "0");
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${value / 100})`;
        }
      },
      onComplete() {
        onReveal();
        setRevealing(true);
      },
    });

    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[300] bg-[#050505] text-white overflow-hidden"
      animate={revealing ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (revealing) {
          document.documentElement.style.overflow = "";
          onComplete();
        }
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <span className="text-7xl md:text-9xl font-black tracking-tighter uppercase bg-gradient-to-r from-[#1B56D2] via-[#E31E24] to-[#1B56D2] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient select-none">
          SEI
        </span>
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40">
          Ingeniería de software
        </span>
      </div>

      <span
        ref={counterRef}
        className="absolute bottom-6 right-6 md:bottom-10 md:right-12 font-mono text-5xl md:text-7xl font-black tracking-tighter text-white/20 tabular-nums select-none"
      >
        000
      </span>

      <div className="absolute bottom-0 left-0 right-0 h-1">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#1B56D2] to-[#E31E24]"
        />
      </div>
    </motion.div>
  );
}
