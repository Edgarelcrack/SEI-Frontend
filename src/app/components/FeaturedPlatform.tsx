import { memo } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { Software } from "../data/software";

interface FeaturedPlatformProps {
  software: Software;
}

function FeaturedPlatformImpl({ software }: FeaturedPlatformProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
    >
      <Link
        to={`/software/${software.id}`}
        className="group relative block overflow-hidden rounded-3xl border dark:border-white/10 border-black/10 dark:bg-[#0a0a0a] bg-zinc-100 hover:border-[#1B56D2]/60 transition-colors duration-500"
      >
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-[#1B56D2]/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-[#E31E24]/10 blur-[80px] pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 md:p-12 lg:p-16 z-10">
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B56D2] text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-[#1B56D2]/30">
                <Sparkles className="w-3.5 h-3.5" />
                Plataforma Estrella
              </div>
              <div className="inline-flex items-center px-4 py-2 rounded-full border border-[#1B56D2]/30 bg-[#1B56D2]/5 text-[#1B56D2] text-xs font-bold tracking-widest uppercase">
                {software.category}
              </div>
            </div>

            <h3 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase dark:text-white text-zinc-900 leading-[0.9] mb-6 group-hover:text-[#1B56D2] transition-colors duration-500">
              {software.name}
            </h3>

            <p className="text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-zinc-500 mb-8">
              {software.tagline}
            </p>

            <p className="text-base md:text-lg text-zinc-500 font-light leading-relaxed mb-10 max-w-xl">
              {software.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {software.techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 dark:bg-white/5 bg-black/5 dark:text-zinc-300 text-zinc-600 text-xs font-bold tracking-widest uppercase rounded dark:border-white/10 border-black/10 border"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between gap-6 pt-8 dark:border-white/10 border-black/10 border-t">
              <span className="text-sm font-black tracking-widest uppercase dark:text-white text-zinc-900 group-hover:text-[#1B56D2] transition-colors duration-500">
                Explorar Plataforma
              </span>
              <div className="w-14 h-14 rounded-full bg-[#1B56D2] text-white flex items-center justify-center group-hover:bg-[#E31E24] group-hover:scale-110 group-hover:rotate-45 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-lg">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-3xl border-2 border-[#1B56D2]/30 hidden md:block" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-3xl border-2 border-[#E31E24]/30 hidden md:block" />

            <div className="relative w-full aspect-[4/5] md:aspect-[4/5] rounded-2xl overflow-hidden bg-black border dark:border-white/10 border-black/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <img
                src={software.thumbnail}
                alt={software.name}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#1B56D2] animate-pulse" />
                <span className="text-[10px] font-black tracking-widest uppercase text-white">
                  Destacado
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export const FeaturedPlatform = memo(FeaturedPlatformImpl);
