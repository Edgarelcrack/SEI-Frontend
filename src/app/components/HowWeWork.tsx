import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { RevealText } from "./RevealText";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    num: "01",
    title: "DESCUBRIMIENTO",
    desc: "Entendemos tu negocio, tus usuarios y tus objetivos. Definimos alcance, prioridades y métricas de éxito.",
  },
  {
    num: "02",
    title: "ARQUITECTURA",
    desc: "Diseñamos la solución técnica: stack, modelo de datos e infraestructura pensada para escalar.",
  },
  {
    num: "03",
    title: "CONSTRUCCIÓN",
    desc: "Sprints cortos con entregas continuas. Código revisado, probado y listo para producción.",
  },
  {
    num: "04",
    title: "DESPLIEGUE",
    desc: "Lanzamiento, monitoreo 24/7 y evolución continua del producto en producción.",
  },
];

export function HowWeWork() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 0.8", "end 0.5"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section
      id="approach"
      className="cv-auto scroll-mt-32 py-32 px-6 lg:px-12 relative z-10"
    >
      <div className="max-w-[1400px] w-full mx-auto">
        <div className="mb-24">
          <div className="text-xs font-bold tracking-[0.3em] uppercase text-[#1B56D2] mb-4">
            Nuestro Enfoque
          </div>
          <h2 className="text-[8vw] sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-8">
            CÓMO
            <br />
            <span
              className="text-background"
              style={{ WebkitTextStroke: "4px #E31E24", paintOrder: "stroke fill" }}
            >
              TRABAJAMOS.
            </span>
          </h2>
          <RevealText
            text="Un proceso probado que convierte ideas en sistemas en producción. Sin humo: entregas medibles en cada fase."
            className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl leading-relaxed tracking-tight"
          />
        </div>

        <div ref={lineRef} className="relative">
          {/* Riel de fondo + línea que se dibuja con el scroll */}
          <div className="absolute left-[7px] md:left-1/2 md:ml-[-1px] top-2 bottom-2 w-0.5 dark:bg-white/10 bg-black/10 rounded-full" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[7px] md:left-1/2 md:ml-[-1px] top-2 bottom-2 w-0.5 origin-top rounded-full bg-gradient-to-b from-[#1B56D2] via-[#1B56D2] to-[#E31E24]"
          />

          {STEPS.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: EASE }}
                className="relative py-10 md:py-14 pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-24"
              >
                {/* Nodo sobre la línea */}
                <span className="absolute left-0 md:left-1/2 md:ml-[-8px] top-12 md:top-16 w-4 h-4 z-10">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.45, ease: EASE, delay: 0.25 }}
                    className="block w-full h-full rounded-full border-2 border-[#1B56D2] dark:bg-black bg-white"
                  />
                </span>

                <div
                  className={
                    right
                      ? "md:col-start-2 md:pl-4"
                      : "md:col-start-1 md:text-right md:pr-4"
                  }
                >
                  <div className="font-mono text-sm tracking-widest text-[#E31E24] mb-3">
                    /{step.num}
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
                    {step.title}
                  </h3>
                  <p
                    className={`text-zinc-500 font-light text-lg leading-relaxed max-w-md ${
                      right ? "" : "md:ml-auto"
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
