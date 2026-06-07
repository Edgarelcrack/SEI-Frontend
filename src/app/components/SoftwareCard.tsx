import { memo, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import type { Software } from "../data/software";

interface SoftwareCardProps {
  software: Software;
}

function SoftwareCardImpl({ software }: SoftwareCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <Link
      ref={ref}
      onMouseMove={handleMouseMove}
      to={`/software/${software.id}`}
      className="group block relative w-full dark:border-white/10 border-black/10 border hover:border-[#1B56D2]/50 transition-colors duration-500 dark:bg-[#0a0a0a] bg-zinc-100 rounded-3xl overflow-hidden"
    >
      {/* Spotlight que sigue el cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background:
            "radial-gradient(600px circle at var(--spot-x) var(--spot-y), rgba(27,86,210,0.15), transparent 40%)",
        }}
      />

      {/* Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-500 group-hover:opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative p-6 md:p-10 z-10 flex flex-col h-full min-h-[500px]">
        {/* Top Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B56D2]/30 bg-[#1B56D2]/5 text-[#1B56D2] text-xs font-bold tracking-widest uppercase">
            {software.category}
          </div>
          <div className="w-12 h-12 rounded-full dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/10 border flex items-center justify-center group-hover:bg-[#1B56D2] group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border dark:border-white/5 border-black/5 mb-10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
          <img
            src={software.thumbnail}
            alt={software.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter grayscale opacity-70 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="mt-auto flex flex-col gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase dark:text-white text-zinc-900 mb-2 group-hover:text-[#1B56D2] transition-colors duration-500">
              {software.name}
            </h3>
            <p className="text-sm font-medium tracking-widest uppercase text-zinc-500 mb-6">
              {software.tagline}
            </p>
            <p className="text-lg text-zinc-500 font-light leading-relaxed line-clamp-2 max-w-xl">
              {software.shortDescription}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-8 dark:border-white/10 border-black/10 border-t">
            <div className="flex flex-wrap gap-2">
              {software.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 dark:bg-white/5 bg-black/5 dark:text-zinc-300 text-zinc-600 text-xs font-bold tracking-widest uppercase rounded dark:border-white/5 border-black/5 border"
                >
                  {tech}
                </span>
              ))}
              {software.techStack.length > 3 && (
                <span className="px-3 py-1 text-zinc-500 text-xs font-bold tracking-widest uppercase">
                  +{software.techStack.length - 3}
                </span>
              )}
            </div>

            {software.pricing && (
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Licencia</span>
                <span className="text-xl font-black tracking-tighter dark:text-white text-zinc-900">
                  {software.pricing.startingPrice}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export const SoftwareCard = memo(SoftwareCardImpl);
