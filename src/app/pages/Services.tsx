import {
  Code2,
  Wrench,
  Rocket,
  Users,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView, useMotionValue, useMotionTemplate } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { PageTitle } from "../components/PageTitle";
import { ServiceBlueprint, type BlueprintKind } from "../components/ServiceBlueprint";
import { RevealText } from "../components/RevealText";
import { useIsMobile } from "../components/ui/use-mobile";
import { useTheme } from "../context/ThemeContext";

interface ServiceItem {
  title: string;
  desc: string;
  kind: BlueprintKind;
  tech: string[];
  icon: React.ReactNode;
}

function ServiceRow({ service, index }: { service: ServiceItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { amount: 0.6 });
  // En desktop el esquema se dibuja al pasar el ratón; en móvil, al entrar en pantalla.
  const active = isMobile ? inView : hovered;

  // Foco que sigue al cursor dentro de la fila.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${mx}px ${my}px, rgba(27,86,210,0.18), transparent 72%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onMouseMove={handleMove}
      className="group relative flex flex-col lg:flex-row items-start lg:items-center justify-between py-16 lg:py-20 dark:border-white/10 border-black/10 border-b hover:border-[#1B56D2] transition-colors duration-500 gap-10 lg:gap-16 overflow-hidden"
    >
      {/* Acento de fondo al hover */}
      <div className="absolute inset-0 bg-[#1B56D2]/5 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

      {/* Glow del cursor sobre toda la fila (solo desktop) */}
      {!isMobile && (
        <motion.div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: spotlight }}
        />
      )}

      {/* ---------- Texto agrupado (izquierda) ---------- */}
      <div className="relative z-10 w-full lg:w-[34%] shrink-0">
        {/* Cabecera: número — regla */}
        <div className="flex items-center gap-5 mb-6">
          <span className="font-mono text-sm tracking-widest text-zinc-500">0{index + 1}</span>
          <span className="h-px flex-1 dark:bg-white/10 bg-black/10" />
        </div>

        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase group-hover:text-[#1B56D2] transition-colors duration-500 leading-none">
          {service.title}
        </h2>

        <p className="mt-6 text-zinc-500 font-light text-lg md:text-xl leading-relaxed">
          {service.desc}
        </p>

        {/* Chips de stack */}
        <motion.div
          className="flex flex-wrap gap-2 mt-6"
          initial="hidden"
          animate={active ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {service.tech.map((t) => (
            <motion.span
              key={t}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              className="px-3 py-1 rounded-full border dark:border-white/20 border-black/20 text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:bg-black/30 bg-white/40 backdrop-blur-sm"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* ---------- Figura técnica (centro, grande, sin caja) ---------- */}
      <div className="relative z-10 w-full lg:flex-1 h-[260px] lg:h-[340px] flex items-center justify-center">
        {/* Halo de respaldo que aparece al activar */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full bg-[#1B56D2]/10 blur-[70px] transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}
        />

        {/* Esquema técnico */}
        <ServiceBlueprint
          kind={service.kind}
          active={active}
          className="relative z-10 h-full w-full text-[#1B56D2]"
        />

        {/* Anotación tipo plano */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
          <span>fig.0{index + 1}</span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-[#1B56D2] opacity-75 ${active ? "animate-ping" : ""}`} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1B56D2]" />
            </span>
            esquema
          </span>
        </div>
      </div>

      {/* ---------- Flecha (derecha, centrada) ---------- */}
      <div className="relative z-10 shrink-0 self-end lg:self-center">
        <div className="w-16 h-16 rounded-full dark:border-white/20 border-black/20 border flex items-center justify-center group-hover:bg-[#1B56D2] group-hover:text-white group-hover:border-transparent transition-all duration-500">
          <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  const { isDark } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Consulta recibida. Nos pondremos en contacto contigo en breve.");
  };

  const services: ServiceItem[] = [
    {
      title: "ARQUITECTURA DE SISTEMAS",
      desc: "Infraestructura full-stack de extremo a extremo, diseñada para rendimiento y escala. React, Node, Edge Computing.",
      kind: "architecture",
      tech: ["React", "Node", "Edge", "PostgreSQL"],
      icon: <Code2 className="w-8 h-8" />
    },
    {
      title: "DESPLIEGUE EN LA NUBE",
      desc: "Pipelines CI/CD, orquestación de contenedores y arquitecturas serverless optimizadas para alta disponibilidad.",
      kind: "deploy",
      tech: ["Docker", "Kubernetes", "Serverless", "AWS"],
      icon: <Rocket className="w-8 h-8" />
    },
    {
      title: "OPERACIONES TÉCNICAS",
      desc: "Monitoreo 24/7, auditorías de seguridad, gestión de dependencias y resolución de incidentes en tiempo real.",
      kind: "ops",
      tech: ["Grafana", "SLA 99.9%", "SIEM", "On-call"],
      icon: <Wrench className="w-8 h-8" />
    },
    {
      title: "ESTRATEGIA & CONSULTORÍA",
      desc: "Transformación digital, migración de sistemas legados y liderazgo de ingeniería para equipos empresariales.",
      kind: "strategy",
      tech: ["Discovery", "Roadmap", "Legacy→Cloud", "Mentoring"],
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <div className="bg-background min-h-screen text-foreground pt-32 font-sans overflow-hidden transition-colors duration-300">
      <PageTitle
        title="Servicios de software"
        description="Arquitectura de sistemas, desarrollo full-stack y consultoría técnica. Ingeniería de software de alto rendimiento para marcas con ambición."
      />

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

            <RevealText
              text="Ofrecemos capacidades de ingeniería de élite. Desde construir productos desde cero hasta mantener cargas de trabajo empresariales masivas."
              delay={0.25}
              className="text-xl md:text-3xl text-zinc-500 font-light max-w-3xl leading-relaxed tracking-tight"
            />
          </motion.div>
        </div>
      </section>

      {/* Massive Services List */}
      <section className="px-6 lg:px-12 z-10 dark:bg-[#0a0a0a] bg-zinc-100 transition-colors duration-300">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="flex flex-col">
            {services.map((service, index) => (
              <ServiceRow key={service.kind} service={service} index={index} />
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
      <section id="contacto" className="scroll-mt-32 py-32 px-6 lg:px-12 relative z-10 bg-background transition-colors duration-300">
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
