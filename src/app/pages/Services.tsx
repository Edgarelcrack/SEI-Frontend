import {
  Code2,
  Wrench,
  Rocket,
  Users,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useTheme } from "../context/ThemeContext";

export function Services() {
  const { isDark } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Consulta recibida. Nos pondremos en contacto contigo en breve.");
  };

  const services = [
    {
      title: "ARQUITECTURA DE SISTEMAS",
      desc: "Infraestructura full-stack de extremo a extremo, diseñada para rendimiento y escala. React, Node, Edge Computing.",
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: "DESPLIEGUE EN LA NUBE",
      desc: "Pipelines CI/CD, orquestación de contenedores y arquitecturas serverless optimizadas para alta disponibilidad.",
      icon: <Rocket className="w-8 h-8" />
    },
    {
      title: "OPERACIONES TÉCNICAS",
      desc: "Monitoreo 24/7, auditorías de seguridad, gestión de dependencias y resolución de incidentes en tiempo real.",
      icon: <Wrench className="w-8 h-8" />
    },
    {
      title: "ESTRATEGIA & CONSULTORÍA",
      desc: "Transformación digital, migración de sistemas legados y liderazgo de ingeniería para equipos empresariales.",
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <div className="bg-background min-h-screen text-foreground pt-32 font-sans overflow-hidden transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 py-20 z-10 dark:border-white/10 border-black/10 border-b">
        <div className="max-w-[1400px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[12vw] sm:text-[9vw] leading-[0.85] font-black tracking-tighter uppercase mb-12">
              SERVICIOS
              <br />
              <span
                className="text-background"
                style={{
                  WebkitTextStroke: "6px #1B56D2",
                  paintOrder: "stroke fill"
                }}
              >
                & OPS
              </span>
            </h1>

            <p className="text-xl md:text-3xl text-zinc-500 font-light max-w-3xl leading-relaxed tracking-tight">
              Ofrecemos capacidades de ingeniería de élite. Desde construir productos desde cero hasta mantener cargas de trabajo empresariales masivas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Massive Services List */}
      <section className="px-6 lg:px-12 z-10 dark:bg-[#0a0a0a] bg-zinc-100 transition-colors duration-300">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="flex flex-col">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative flex flex-col lg:flex-row items-start lg:items-center justify-between py-16 lg:py-24 dark:border-white/10 border-black/10 border-b hover:border-[#1B56D2] transition-colors duration-500 gap-8 lg:gap-24 overflow-hidden"
              >
                {/* Hover Background Accent */}
                <div className="absolute inset-0 bg-[#1B56D2]/5 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

                <div className="flex items-center gap-8 relative z-10 w-full lg:w-auto">
                  <div className="text-zinc-500 font-mono text-sm tracking-widest">
                    0{index + 1}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase group-hover:text-[#1B56D2] transition-colors duration-500 max-w-xl leading-none">
                    {service.title}
                  </h2>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8 lg:w-[500px] shrink-0">
                  <div className="text-zinc-500 font-light text-lg md:text-xl leading-relaxed">
                    {service.desc}
                  </div>
                  <div className="w-16 h-16 rounded-full dark:border-white/20 border-black/20 border flex items-center justify-center shrink-0 group-hover:bg-[#1B56D2] group-hover:text-white group-hover:border-transparent transition-all duration-500">
                    <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Marquee */}
      <section className="py-8 dark:bg-white dark:text-black bg-zinc-900 text-white overflow-hidden flex items-center dark:border-white/10 border-black/10 border-y transition-colors duration-300">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap text-3xl font-black tracking-widest uppercase"
        >
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span>REACT</span> <span className="opacity-20">/</span>
              <span>NODE.JS</span> <span className="opacity-20">/</span>
              <span>TYPESCRIPT</span> <span className="opacity-20">/</span>
              <span>GRAPHQL</span> <span className="opacity-20">/</span>
              <span>AWS</span> <span className="opacity-20">/</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 lg:px-12 relative z-10 bg-background transition-colors duration-300">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-[8vw] sm:text-7xl font-black tracking-tighter uppercase mb-8 leading-none">
                INICIA TU
                <br />
                <span className="text-[#E31E24]">PROYECTO.</span>
              </h2>
              <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-md leading-relaxed tracking-tight">
                Reserva nuestros recursos de ingeniería para tu próximo despliegue o para operaciones continuas.
              </p>
            </div>

            <div className="space-y-6 mt-16 lg:mt-0">
              <a href="mailto:contact@correo.com" className="flex items-center justify-between group py-6 dark:border-white/10 border-black/10 border-b hover:border-[#1B56D2] transition-colors">
                <span className="text-sm font-bold tracking-widest uppercase text-zinc-500 group-hover:text-foreground transition-colors">Correo</span>
                <span className="text-xl md:text-2xl font-black uppercase tracking-tighter group-hover:text-[#1B56D2] transition-colors flex items-center gap-4">
                  contact@correo.com <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
                </span>
              </a>
              <div className="flex items-center justify-between py-6 dark:border-white/10 border-black/10 border-b">
                <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">Ubicación</span>
                <span className="text-xl md:text-2xl font-black uppercase tracking-tighter">
                  GLOBAL (REMOTO)
                </span>
              </div>
            </div>
          </div>

          {/* Minimalist Form */}
          <div className="dark:bg-[#0a0a0a] bg-zinc-100 p-8 md:p-16 rounded-3xl dark:border-white/10 border-black/10 border relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1B56D2]/5 blur-[100px] rounded-full pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              <div className="space-y-8">
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="NOMBRE / EMPRESA *"
                    required
                    className="bg-transparent border-0 dark:border-white/20 border-black/20 border-b rounded-none px-0 h-16 text-xl placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-[#1B56D2] dark:text-white text-zinc-900 font-bold tracking-widest uppercase"
                  />
                </div>

                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="CORREO ELECTRÓNICO *"
                    required
                    className="bg-transparent border-0 dark:border-white/20 border-black/20 border-b rounded-none px-0 h-16 text-xl placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-[#1B56D2] dark:text-white text-zinc-900 font-bold tracking-widest uppercase"
                  />
                </div>

                <div className="relative">
                  <select
                    id="service"
                    required
                    className="w-full bg-transparent border-0 dark:border-white/20 border-black/20 border-b h-16 text-xl text-zinc-500 focus:text-foreground focus:border-[#1B56D2] focus:ring-0 font-bold tracking-widest uppercase appearance-none cursor-pointer outline-none"
                  >
                    <option value="" className="dark:bg-black bg-white">SELECCIONA UN SERVICIO *</option>
                    <option value="arch" className="dark:bg-black bg-white text-foreground">ARQUITECTURA</option>
                    <option value="ops" className="dark:bg-black bg-white text-foreground">OPERACIONES TÉCNICAS</option>
                    <option value="consulting" className="dark:bg-black bg-white text-foreground">CONSULTORÍA</option>
                  </select>
                </div>

                <div className="relative">
                  <Textarea
                    id="message"
                    placeholder="DETALLES DEL PROYECTO *"
                    rows={4}
                    required
                    className="bg-transparent border-0 dark:border-white/20 border-black/20 border-b rounded-none px-0 text-xl placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-[#1B56D2] dark:text-white text-zinc-900 font-bold tracking-widest uppercase resize-none py-4"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-20 rounded-full bg-[#1B56D2] text-white hover:bg-[#E31E24] text-lg font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                ENVIAR CONSULTA
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
