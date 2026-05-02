import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github, Check, Server, Lock, TrendingUp, Plug, Code2, Cpu } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PageTitle } from "../components/PageTitle";
import { getSoftwareById } from "../data/software";

export function SoftwareDetail() {
  const { id } = useParams<{ id: string }>();
  const software = id ? getSoftwareById(id) : undefined;

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);

  if (!software) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-background min-h-screen text-foreground pb-32 font-sans transition-colors duration-300">
      <PageTitle title={`${software.name} | KIRBINET`} />

      {/* Immersive Header */}
      <div className="relative min-h-[80vh] flex flex-col justify-end pb-24 overflow-hidden dark:border-white/10 border-black/10 border-b">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img
            src={software.thumbnail}
            alt={software.name}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover filter grayscale opacity-40 mix-blend-luminosity scale-105"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

        <div className="container mx-auto px-6 lg:px-12 relative z-20 w-full max-w-[1400px]">
          <Button asChild variant="ghost" className="mb-12 text-zinc-500 hover:text-[#1B56D2] hover:bg-transparent px-0 font-bold tracking-widest uppercase transition-colors">
            <Link to="/">
              <ArrowLeft className="mr-3 w-5 h-5" />
              VOLVER A PLATAFORMAS
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-l border-[#1B56D2] pl-6 md:pl-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B56D2]/30 bg-[#1B56D2]/10 text-[#1B56D2] text-sm font-bold tracking-widest uppercase mb-8">
                {software.category}
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-[8vw] leading-[0.85] font-black tracking-tighter uppercase mb-6">
                {software.name}
              </h1>
              <p className="text-2xl md:text-3xl text-zinc-400 font-light leading-relaxed tracking-tight max-w-3xl">
                {software.tagline}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 pb-2">
              {software.demoUrl && (
                <a
                  href={software.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 h-16 rounded-full bg-[#1B56D2] text-white font-black tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
                >
                  VER DEMO
                  <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </a>
              )}
              {software.githubUrl && (
                <a
                  href={software.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-3 px-8 h-16 rounded-full bg-transparent dark:border-white/20 border-black/20 border dark:text-white text-zinc-900 font-bold tracking-widest uppercase hover:border-[#1B56D2] hover:text-[#1B56D2] transition-colors duration-300"
                >
                  <Github className="w-5 h-5" />
                  CÓDIGO
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-32">

            {/* Preview Block */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#1B56D2]/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative w-full aspect-[16/9] dark:bg-[#0a0a0a] bg-zinc-100 rounded-3xl dark:border-white/10 border-black/10 border overflow-hidden shadow-2xl transition-colors duration-300">
                <div className="absolute top-0 w-full h-12 dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/10 border-b flex items-center px-6 gap-3 z-10 backdrop-blur-sm">
                  <div className="w-3 h-3 rounded-full bg-[#1B56D2]" />
                  <div className="w-3 h-3 rounded-full dark:bg-white/20 bg-black/20" />
                  <div className="w-3 h-3 rounded-full dark:bg-white/20 bg-black/20" />
                  <div className="ml-auto text-xs font-mono text-zinc-500 tracking-widest">PREVIEW.MOV</div>
                </div>
                <div className="w-full h-full pt-12 dark:bg-black bg-zinc-200">
                  <iframe
                    className="w-full h-full filter contrast-125"
                    src={software.videoUrl}
                    title={`${software.name} Demo Video`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Spec Tabs */}
            <div className="dark:border-white/10 border-black/10 border-t pt-16">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-transparent dark:border-white/10 border-black/10 border p-2 rounded-2xl h-auto mb-16">
                  <TabsTrigger
                    value="overview"
                    className="rounded-xl data-[state=active]:bg-[#1B56D2] data-[state=active]:text-white text-zinc-500 font-black tracking-widest uppercase py-4 transition-all"
                  >
                    RESUMEN
                  </TabsTrigger>
                  <TabsTrigger
                    value="technical"
                    className="rounded-xl data-[state=active]:bg-[#1B56D2] data-[state=active]:text-white text-zinc-500 font-black tracking-widest uppercase py-4 flex items-center justify-center gap-3 transition-all"
                  >
                    <Cpu className="w-5 h-5" />
                    DOCS TÉCNICOS
                  </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-24 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 dark:border-white/10 border-black/10 border-l pl-6 md:pl-12">
                    <div className="md:col-span-1">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">RESUMEN</h3>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-2xl font-light leading-relaxed tracking-tight">
                        {software.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-l border-[#1B56D2]/50 pl-6 md:pl-12">
                    <div className="md:col-span-1">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-[#1B56D2]">CAPACIDADES</h3>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {software.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <Check className="w-6 h-6 text-[#1B56D2] shrink-0" />
                          <span className="text-lg dark:text-zinc-300 text-zinc-700 font-light leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {software.pricing && (
                    <div className="p-12 rounded-3xl bg-[#1B56D2] text-white flex flex-col md:flex-row items-center justify-between gap-8 transform hover:scale-[1.02] transition-transform duration-500">
                      <div>
                        <div className="text-xs font-black tracking-widest uppercase text-white/60 mb-2">ESTRUCTURA DE LICENCIA</div>
                        <div className="text-6xl font-black tracking-tighter">
                          {software.pricing.startingPrice}
                        </div>
                        <div className="text-lg font-bold tracking-widest uppercase text-white/70 mt-2">
                          {software.pricing.model}
                        </div>
                      </div>
                      <a
                        href="/services"
                        className="group flex items-center justify-center w-48 h-48 rounded-full border-2 border-white/40 font-black tracking-widest uppercase hover:bg-white hover:text-[#1B56D2] transition-colors duration-300 shrink-0"
                      >
                        ADQUIRIR
                        <ArrowUpRight className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform" />
                      </a>
                    </div>
                  )}
                </TabsContent>

                {/* TECH DOCS TAB */}
                <TabsContent value="technical" className="space-y-16 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-[#050505] dark:border-white/10 border-zinc-700 border p-8 rounded-3xl font-mono text-sm leading-relaxed text-zinc-400 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <Code2 className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-[#1B56D2]" />
                    </div>
                    <p className="relative z-10">
                      <span className="text-[#1B56D2]">import</span> <span className="text-white">{'{'} architecture_spec {'}'}</span> <span className="text-[#1B56D2]">from</span> <span className="text-emerald-400">'@dev/core'</span>;
                      <br /><br />
                      <span className="text-zinc-600">// Desglose técnico de la implementación</span>
                      <br />
                      <span className="text-purple-400">export const</span> <span className="text-white">SystemDetails</span> = ...
                    </p>
                  </div>

                  <div className="space-y-12">
                    <div className="dark:border-white/10 border-black/10 border-l pl-6 md:pl-12">
                      <h3 className="flex items-center gap-4 text-2xl font-black tracking-widest uppercase mb-6">
                        <Server className="w-6 h-6 text-[#1B56D2]" />
                        ARQUITECTURA DEL SISTEMA
                      </h3>
                      <p className="text-xl text-zinc-500 font-light leading-relaxed">
                        {software.advancedDescription.overview}
                      </p>
                    </div>

                    <div className="dark:border-white/10 border-black/10 border-l pl-6 md:pl-12">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-6">PROTOCOLOS DE IMPLEMENTACIÓN</h3>
                      <ul className="space-y-6">
                        {software.advancedDescription.technicalDetails.map((detail, index) => (
                          <li key={index} className="flex items-start gap-6 p-6 dark:bg-white/5 bg-black/5 dark:border-white/5 border-black/5 border rounded-2xl">
                            <div className="w-1.5 h-1.5 bg-[#1B56D2] rounded-full mt-2.5 shrink-0" />
                            <span className="text-lg dark:text-zinc-300 text-zinc-700 font-light leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 dark:border-white/10 border-black/10 border-t pt-16">
                      {software.advancedDescription.apiIntegrations && (
                        <div className="p-8 dark:border-white/10 border-black/10 border rounded-3xl dark:bg-[#0a0a0a] bg-zinc-100 transition-colors duration-300">
                          <h3 className="flex items-center gap-4 text-xl font-black tracking-widest uppercase mb-6">
                            <Plug className="w-6 h-6 text-[#1B56D2]" />
                            INTEGRACIONES
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {software.advancedDescription.apiIntegrations.map((api, index) => (
                              <span key={index} className="px-4 py-2 dark:border-white/10 border-black/10 border rounded-full text-xs font-bold tracking-widest uppercase text-zinc-500">
                                {api}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {software.advancedDescription.scalability && (
                        <div className="p-8 border border-[#1B56D2]/20 rounded-3xl bg-[#1B56D2]/5">
                          <h3 className="flex items-center gap-4 text-xl font-black tracking-widest uppercase mb-6 text-[#1B56D2]">
                            <TrendingUp className="w-6 h-6" />
                            ESCALABILIDAD
                          </h3>
                          <p className="text-zinc-500 text-sm font-light leading-relaxed">
                            {software.advancedDescription.scalability}
                          </p>
                        </div>
                      )}

                      {software.advancedDescription.security && (
                        <div className="md:col-span-2 p-8 border border-red-500/20 rounded-3xl bg-red-500/5">
                          <h3 className="flex items-center gap-4 text-xl font-black tracking-widest uppercase mb-6 text-red-400">
                            <Lock className="w-6 h-6" />
                            SEGURIDAD & CUMPLIMIENTO
                          </h3>
                          <p className="text-zinc-500 text-sm font-light leading-relaxed max-w-3xl">
                            {software.advancedDescription.security}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">

              {/* Stack Block */}
              <div className="p-8 dark:border-white/10 border-black/10 border rounded-3xl dark:bg-[#0a0a0a] bg-zinc-100 transition-colors duration-300">
                <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8">STACK TECNOLÓGICO</h3>
                <div className="flex flex-col gap-4">
                  {software.techStack.map((tech) => (
                    <div key={tech} className="flex items-center justify-between py-3 dark:border-white/5 border-black/5 border-b last:border-0 group cursor-default">
                      <span className="text-lg font-black tracking-widest uppercase dark:text-white text-zinc-900 group-hover:text-[#1B56D2] transition-colors">{tech}</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#1B56D2] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs Block */}
              <div className="p-8 dark:border-white/10 border-black/10 border rounded-3xl dark:bg-[#0a0a0a] bg-zinc-100 transition-colors duration-300">
                <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8">ESPECIFICACIONES</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">CATEGORÍA</span>
                    <span className="text-sm font-black tracking-widest uppercase text-[#1B56D2]">{software.category}</span>
                  </div>

                  {software.pricing && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">MODELO</span>
                      <span className="text-sm font-black tracking-widest uppercase">{software.pricing.model}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">SLA</span>
                    <span className="text-sm font-black tracking-widest uppercase text-emerald-400">99.9% DISPONIBILIDAD</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">ACTUALIZACIONES</span>
                    <span className="text-sm font-black tracking-widest uppercase">CONTINUAS</span>
                  </div>
                </div>
              </div>

              {/* CTA Block */}
              <div className="p-8 border border-[#1B56D2]/30 rounded-3xl bg-gradient-to-b from-[#1B56D2]/10 to-transparent relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">¿LISTO PARA DESPLEGAR?</h3>
                  <p className="text-sm font-light text-zinc-500 leading-relaxed mb-8">
                    Contacta con ingeniería para revisar la arquitectura y los tiempos de despliegue.
                  </p>
                  <Link
                    to="/services"
                    className="flex items-center justify-center gap-3 w-full h-14 rounded-full bg-[#1B56D2] text-white font-black tracking-widest uppercase hover:bg-[#E31E24] transition-colors"
                  >
                    CONSULTA
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
