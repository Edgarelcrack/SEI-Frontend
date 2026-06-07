import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpDown, Check, Filter, Search, X } from "lucide-react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { SoftwareCard } from "../components/SoftwareCard";
import { PageTitle } from "../components/PageTitle";
import { softwareData } from "../data/software";

type SortMode = "default" | "alphabetical" | "popularity";

const SORT_LABELS: Record<SortMode, string> = {
  default: "Orden de salida",
  alphabetical: "Alfabético",
  popularity: "Popularidad",
};

const SORT_MODES: SortMode[] = ["default", "alphabetical", "popularity"];

export function Platforms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allCategories = useMemo(
    () => Array.from(new Set(softwareData.map((s) => s.category))).sort(),
    []
  );

  const allTechs = useMemo(() => {
    const techs = new Set<string>();
    softwareData.forEach((s) => s.techStack.forEach((t) => techs.add(t)));
    return Array.from(techs).sort();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...softwareData];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.tagline.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((s) => selectedCategories.includes(s.category));
    }

    if (selectedTechs.length > 0) {
      result = result.filter((s) =>
        selectedTechs.some((tech) => s.techStack.includes(tech))
      );
    }

    if (sortMode === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "popularity") {
      result.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    }

    return result;
  }, [searchQuery, selectedCategories, selectedTechs, sortMode]);

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    selectedCategories.length +
    selectedTechs.length;

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function toggleTech(tech: string) {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTechs([]);
  }

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-300">
      <PageTitle
        title="Plataformas"
        description="Explora nuestro catálogo de plataformas y soluciones de software a medida. Filtra por categoría y tecnología."
      />
      <section className="relative px-6 lg:px-12 z-10 pt-32 pb-16">
        <div className="max-w-[1400px] w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-[#1B56D2] transition-colors mb-12"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Volver al Inicio
          </Link>

          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase"
            >
              TODAS LAS
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-[12vw] sm:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase text-background"
              style={{ WebkitTextStroke: "6px #E31E24", paintOrder: "stroke fill" }}
            >
              PLATAFORMAS.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl font-light text-zinc-500 max-w-2xl leading-relaxed tracking-tight border-t dark:border-white/10 border-black/10 pt-10 mt-10"
          >
            El catálogo completo de nuestras arquitecturas listas para producción.
            Cada plataforma está diseñada para escalar contigo.
          </motion.p>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-12 relative z-20">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="flex flex-wrap gap-3 items-center">
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setFilterOpen((o) => !o);
                  setSortOpen(false);
                }}
                className="group inline-flex items-center gap-3 px-6 h-14 rounded-full dark:border-white/20 border-black/20 border text-sm font-black tracking-widest uppercase hover:border-[#1B56D2] transition-colors duration-300 dark:bg-black bg-white"
              >
                <Filter className="w-4 h-4" />
                Filtrar
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-[#1B56D2] text-white text-xs font-black">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-[calc(100%+12px)] w-[min(92vw,420px)] max-h-[70vh] overflow-y-auto rounded-3xl dark:border-white/15 border-black/15 border dark:bg-[#0a0a0a] bg-white shadow-2xl p-6 z-50"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
                        Filtros
                      </span>
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#E31E24] hover:opacity-70 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                          Limpiar
                        </button>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-2">
                        Nombre
                      </label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar plataforma..."
                          className="w-full h-11 pl-11 pr-4 rounded-full dark:border-white/15 border-black/15 border dark:bg-black bg-white text-sm focus:outline-none focus:border-[#1B56D2] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="block text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-2">
                        Categoría
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {allCategories.map((cat) => {
                          const active = selectedCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-bold tracking-wide transition-colors duration-200 ${
                                active
                                  ? "bg-[#1B56D2] text-white border border-[#1B56D2]"
                                  : "dark:border-white/20 border-black/20 border dark:text-white text-zinc-900 hover:border-[#1B56D2]"
                              }`}
                            >
                              {active && <Check className="w-3 h-3" />}
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="block text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-2">
                        Tecnología
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {allTechs.map((tech) => {
                          const active = selectedTechs.includes(tech);
                          return (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => toggleTech(tech)}
                              className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-bold tracking-wide transition-colors duration-200 ${
                                active
                                  ? "bg-[#1B56D2] text-white border border-[#1B56D2]"
                                  : "dark:border-white/20 border-black/20 border dark:text-white text-zinc-900 hover:border-[#1B56D2]"
                              }`}
                            >
                              {active && <Check className="w-3 h-3" />}
                              {tech}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setSortOpen((o) => !o);
                  setFilterOpen(false);
                }}
                className="group inline-flex items-center gap-3 px-6 h-14 rounded-full dark:border-white/20 border-black/20 border text-sm font-black tracking-widest uppercase hover:border-[#1B56D2] transition-colors duration-300 dark:bg-black bg-white"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Ordenar:&nbsp;</span>
                <span className="text-[#1B56D2]">{SORT_LABELS[sortMode]}</span>
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-[calc(100%+12px)] w-[min(92vw,260px)] rounded-3xl dark:border-white/15 border-black/15 border dark:bg-[#0a0a0a] bg-white shadow-2xl p-2 z-50"
                  >
                    {SORT_MODES.map((mode) => {
                      const active = sortMode === mode;
                      return (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => {
                            setSortMode(mode);
                            setSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 h-11 rounded-full text-sm font-bold tracking-wide transition-colors duration-200 ${
                            active
                              ? "bg-[#1B56D2] text-white"
                              : "dark:text-white text-zinc-900 dark:hover:bg-white/5 hover:bg-black/5"
                          }`}
                        >
                          {SORT_LABELS[mode]}
                          {active && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-auto text-xs font-bold tracking-widest uppercase text-zinc-500">
              {filteredAndSorted.length}{" "}
              {filteredAndSorted.length === 1 ? "resultado" : "resultados"}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-32 relative z-10">
        <div className="max-w-[1400px] w-full mx-auto">
          {filteredAndSorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-6xl font-black tracking-tighter uppercase text-zinc-500 mb-4">
                Sin resultados
              </div>
              <p className="text-base text-zinc-500 mb-8 max-w-md">
                No encontramos plataformas con los filtros seleccionados.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-[#1B56D2] text-white text-sm font-black tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSorted.map((software, index) => (
                  <motion.div
                    key={software.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % 2) * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <SoftwareCard software={software} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
