import { memo, useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useInView, animate } from "motion/react";
import { PlatformsCarousel } from "../components/PlatformsCarousel";
import { FeaturedPlatform } from "../components/FeaturedPlatform";
import { softwareData } from "../data/software";

const CountUp = memo(function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        node.textContent = value.toFixed(decimals);
      },
    });
    return () => controls.stop();
  }, [isInView, to, decimals]);

  return <span ref={ref}>0</span>;
});

const featuredPlatform = softwareData.find((s) => s.featured) ?? softwareData[0];
const otherPlatforms = softwareData.filter((s) => s.id !== featuredPlatform?.id);

export function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="bg-background min-h-screen text-foreground overflow-hidden transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
        <motion.div
          style={{ y, willChange: "transform" }}
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#1B56D2] opacity-[0.04] blur-[100px] mix-blend-screen"
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 z-10 pt-32 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.18] dark:opacity-25"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=70')",
              filter: "grayscale(40%) contrast(110%)",
            }}
          />
          <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-black/40 dark:via-black/60 dark:to-background bg-gradient-to-b from-white/40 via-white/70 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(27,86,210,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(227,30,36,0.10),transparent_55%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="max-w-[1400px] w-full mx-auto relative">
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase"
            >
              SOFTWARE
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-[12vw] sm:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase text-transparent"
              style={{
                WebkitTextStroke: "3px #1B56D2"
              }}
            >
              SEI.
            </motion.h1>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-20 md:items-end justify-between dark:border-white/10 border-black/10 border-t pt-10 mt-20">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-xl md:text-2xl font-light text-zinc-500 max-w-2xl leading-relaxed tracking-tight"
            >
              Diseñamos productos digitales escalables, brutalistas y ultramodernos.
              Hechos para marcas visionarias que exigen excelencia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex shrink-0"
            >
              <Link
                to="/services"
                className="group flex items-center justify-center gap-4 bg-[#E31E24] text-white w-40 h-40 rounded-full text-sm font-black tracking-widest uppercase hover:scale-105 hover:bg-[#1B56D2] transition-all duration-500 ease-out"
              >
                HABLEMOS
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Marquee */}
      <section className="relative z-10 py-12 bg-[#1B56D2] text-white overflow-hidden flex items-center border-y dark:border-black/30 border-[#1B56D2]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="flex whitespace-nowrap text-5xl md:text-7xl font-black tracking-tighter uppercase"
        >
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span>INGENIERÍA</span>
              <span className="text-white/30">✦</span>
              <span>DISEÑO</span>
              <span className="text-white/30">✦</span>
              <span>ESCALA</span>
              <span className="text-white/30">✦</span>
              <span>RENDIMIENTO</span>
              <span className="text-white/30">✦</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="cv-auto py-32 px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] w-full mx-auto dark:border-white/10 border-black/10 border-b pb-32">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-x-24">
            {[
              { num: "50", sym: "+", label: "Partners Empresariales" },
              { num: "99.9", sym: "%", label: "Disponibilidad SLA" },
              { num: "12", sym: "ms", label: "Latencia Media" },
              { num: "24", sym: "/7", label: "Soporte Global" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col dark:border-white/10 border-black/10 border-l pl-6 md:pl-12 hover:border-[#1B56D2] transition-colors duration-500">
                <div className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                  <CountUp
                    to={parseFloat(stat.num)}
                    decimals={stat.num.includes('.') ? stat.num.split('.')[1].length : 0}
                  /><span className="text-[#1B56D2]">{stat.sym}</span>
                </div>
                <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Platform */}
      <section id="software" className="cv-auto py-32 px-6 lg:px-12 relative z-10">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
            <div>
              <h2 className="text-[8vw] sm:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
                PLATAFORMAS
              </h2>
              <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-2xl">
                Nuestro producto insignia — la plataforma que marca el rumbo en este momento.
              </p>
            </div>

            <Link
              to="/services"
              className="flex items-center gap-3 text-sm font-bold tracking-widest uppercase hover:text-[#1B56D2] transition-colors group"
            >
              SOLICITAR DEMO
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {featuredPlatform && <FeaturedPlatform software={featuredPlatform} />}
        </div>
      </section>

      {/* Other Platforms - 3D Carousel */}
      {otherPlatforms.length > 0 && (
        <section className="cv-auto py-32 px-6 lg:px-12 relative z-10 dark:border-white/10 border-black/10 border-t">
          <div className="max-w-[1400px] w-full mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
              <div>
                <div className="text-xs font-bold tracking-[0.3em] uppercase text-[#1B56D2] mb-4">
                  Explora Más
                </div>
                <h2 className="text-[8vw] sm:text-6xl font-black tracking-tighter uppercase leading-none">
                  OTRAS<br />
                  <span className="text-background" style={{ WebkitTextStroke: "4px #1B56D2", paintOrder: "stroke fill" }}>
                    PLATAFORMAS.
                  </span>
                </h2>
              </div>
              <p className="text-base md:text-lg text-zinc-500 font-light max-w-md">
                Recorre el resto de nuestras arquitecturas listas para producción.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <PlatformsCarousel items={otherPlatforms} />
            </motion.div>

            <div className="mt-20 flex justify-center">
              <Link
                to="/platforms"
                className="group relative flex items-center justify-center gap-4 h-20 px-10 rounded-full dark:border-white/20 border-black/20 border overflow-hidden hover:border-[#1B56D2] transition-colors duration-500 dark:bg-black bg-white"
              >
                <div className="absolute inset-0 w-full h-full bg-[#1B56D2] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 flex items-center gap-3 text-sm font-black tracking-widest uppercase dark:text-white text-zinc-900 group-hover:text-white transition-colors duration-500">
                  Ver Todas las Plataformas
                  <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Outro CTA */}
      <section className="cv-auto py-40 px-6 lg:px-12 relative z-10 dark:border-white/10 border-black/10 border-t dark:bg-[#0a0a0a] bg-zinc-100 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#1B56D2]/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-[1400px] w-full mx-auto flex flex-col items-center text-center relative z-10">
          <h2 className="text-[10vw] sm:text-[8vw] font-black tracking-tighter uppercase mb-12 leading-[0.9]">
            EMPIEZA A
            <br />
            <span className="text-background" style={{ WebkitTextStroke: "8px #E31E24", paintOrder: "stroke fill" }}>CONSTRUIR.</span>
          </h2>

          <Link
            to="/services"
            className="group relative flex items-center justify-center w-64 h-20 rounded-full dark:border-white/20 border-black/20 border overflow-hidden hover:border-[#1B56D2] transition-colors duration-500 dark:bg-black bg-white"
          >
            <div className="absolute inset-0 w-full h-full bg-[#1B56D2] transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="relative z-10 flex items-center gap-3 text-sm font-black tracking-widest uppercase dark:text-white text-zinc-900 group-hover:text-white transition-colors duration-500">
              CONTÁCTANOS <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
