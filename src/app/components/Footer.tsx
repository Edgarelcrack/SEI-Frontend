import { Github, Linkedin, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import logoUrl from "../../imports/Logo-SEI-250px.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative dark:bg-black bg-white pt-32 pb-8 overflow-hidden dark:border-white/10 border-black/10 border-t transition-colors duration-300">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1B56D2]/10 rounded-full blur-[150px] mix-blend-screen opacity-30 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
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

            <div className="mt-12 hidden md:block">
              <a
                href="mailto:contact@gmail.com"
                className="group flex items-center gap-4 text-3xl font-black uppercase tracking-tighter dark:text-white text-zinc-900 hover:text-[#1B56D2] transition-colors"
              >
                contact@gmail.com
                <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center group-hover:-rotate-45 transition-transform duration-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </a>
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
                { name: "Nuestro Enfoque", path: "#approach" },
                { name: "Carreras", path: "#careers" }
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

          {/* Socials & Address */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-xs font-bold tracking-widest text-zinc-500 mb-8 uppercase">Conecta</h3>
            <div className="flex gap-4 mb-12">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full dark:border-white/20 border-black/20 border text-zinc-500 hover:bg-[#1B56D2] hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full dark:border-white/20 border-black/20 border text-zinc-500 hover:bg-[#1B56D2] hover:text-white hover:border-transparent flex items-center justify-center transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <div className="text-zinc-500 text-sm font-medium tracking-wide uppercase leading-loose">
              100 INFORMACION UBICACION
              <br />
              INFORMACION, CA 94043
              <br />
              COLOMBIA
            </div>
          </div>
        </div>

        {/* Mobile Email CTA */}
        <div className="md:hidden dark:border-white/10 border-black/10 border-y py-8 mb-12">
          <a
            href="mailto:contact@kirbinet.com"
            className="flex items-center justify-between text-2xl font-black uppercase tracking-tighter dark:text-white text-zinc-900 hover:text-[#1B56D2] transition-colors"
          >
            contact@gmail.com
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>

        {/* Massive Typography Name */}
        <div className="w-full mb-12 select-none pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15vw] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b dark:from-white dark:to-white/20 from-zinc-800 to-zinc-800/20"
          >
            SISTEMAS
          </motion.h1>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 dark:border-white/10 border-black/10 border-t">
          <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            © {currentYear} TODOS LOS DERECHOS RESERVADOS
          </p>
          <div className="flex gap-8">
            <a href="#privacy" className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 uppercase transition-colors">Privacidad</a>
            <a href="#terms" className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 uppercase transition-colors">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
