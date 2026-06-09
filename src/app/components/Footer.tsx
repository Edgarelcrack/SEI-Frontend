import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Magnetic } from "./Magnetic";
import logoUrl from "../../imports/Logo-SEI-250px.png";

function formatCaliTime() {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

/** Reloj en vivo de la hora local de Cali. */
function LocalClock() {
  const [time, setTime] = useState(formatCaliTime);
  useEffect(() => {
    const id = setInterval(() => setTime(formatCaliTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-xs tracking-widest uppercase text-zinc-500">
      Cali · {time} <span className="text-zinc-600">GMT-5</span>
    </span>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative dark:bg-black bg-white pt-32 pb-8 overflow-hidden dark:border-white/10 border-black/10 border-t transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1B56D2]/10 rounded-full blur-[150px] mix-blend-screen opacity-30 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      {/* Wordmark gigante de fondo */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none select-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <span className="block whitespace-nowrap leading-none font-black uppercase tracking-tighter text-[34vw] bg-gradient-to-r from-[#1B56D2] via-[#E31E24] to-[#1B56D2] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient opacity-[0.12] dark:opacity-20">
          SEI
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Volver arriba (magnético) */}
        <div className="flex justify-end mb-16">
          <Magnetic strength={0.4}>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Volver arriba"
              className="group flex items-center gap-3 dark:text-white text-zinc-900"
            >
              <span className="text-xs font-bold tracking-widest uppercase text-zinc-500 group-hover:text-foreground transition-colors">
                Volver arriba
              </span>
              <span className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:bg-[#1B56D2] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
            </button>
          </Magnetic>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32">
          {/* Brand */}
          <div className="col-span-1 md:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="flex items-center gap-3 mb-8 group block">
                <img
                  src={logoUrl}
                  alt="SEI Logo"
                  className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out origin-left"
                />
              </Link>
              <p className="text-xl font-light text-zinc-500 max-w-md leading-relaxed tracking-tight">
                Arquitectos del futuro digital. Ingeniería de software de alto rendimiento para marcas con ambición.
              </p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1" />

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-xs font-bold tracking-widest text-zinc-500 mb-8 uppercase">Explorar</h3>
            <ul className="space-y-6">
              {[
                { name: "Plataformas", path: "/platforms" },
                { name: "Servicios de Ingeniería", path: "/services" },
                { name: "Nuestro Enfoque", path: "#approach" }
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="text-lg font-medium dark:text-zinc-300 text-zinc-700 hover:text-[#1B56D2] transition-colors relative overflow-hidden group inline-flex"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1B56D2] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 dark:border-white/10 border-black/10 border-t">
          <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            © {currentYear} TODOS LOS DERECHOS RESERVADOS
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <LocalClock />
            <div className="flex gap-8">
              <a href="#privacy" className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 uppercase transition-colors">Privacidad</a>
              <a href="#terms" className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 uppercase transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
