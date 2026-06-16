import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpDown, Check, Filter, Search, X } from "lucide-react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { HardwareCard } from "../components/HardwareCard";
import { PageTitle } from "../components/PageTitle";
import { listHardware, type HardwareListItem } from "../services/hardware";
import { listTags, type Tag } from "../services/tags";

type SortMode = "created_desc" | "name_asc" | "views";

const SORT_LABELS: Record<SortMode, string> = {
  created_desc: "Más recientes",
  name_asc: "Alfabético",
  views: "Más vistos",
};

const SORT_MODES: SortMode[] = ["created_desc", "name_asc", "views"];

export function Hardware() {
  const [items, setItems] = useState<HardwareListItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("created_desc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) setFilterOpen(false);
      if (sortRef.current && !sortRef.current.contains(target)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    listTags("hardware")
      .then((res) => setTags(res.data))
      .catch(() => setTags([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listHardware({ limit: 100 })
      .then((res) => {
        if (!cancelled) {
          setItems(res.data);
          setTotal(res.meta.total);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading) return;

    let cancelled = false;
    setFiltering(true);

    listHardware({
      q: debouncedSearch || undefined,
      tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
      sort: sortMode,
      limit: 100,
    })
      .then((res) => {
        if (!cancelled) {
          setItems(res.data);
          setTotal(res.meta.total);
          setError(null);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setFiltering(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedTags, sortMode]);

  const activeFilterCount = (searchQuery.trim() ? 1 : 0) + selectedTags.length;

  function toggleTag(slug: string) {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedTags([]);
  }

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-300">
      <PageTitle
        title="Hardware & Equipos"
        description="Explora nuestro catálogo de equipos y soluciones de hardware. Filtra por marca y categoría."
      />
      <section className="relative px-6 lg:px-12 z-10 pt-32 pb-16">
        <div className="max-w-[1400px] w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-[#E31E24] transition-colors mb-12"
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
              TODOS LOS
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-12">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-[12vw] sm:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase text-background"
              style={{ WebkitTextStroke: "6px #1B56D2", paintOrder: "stroke fill" }}
            >
              EQUIPOS.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl font-light text-zinc-500 max-w-2xl leading-relaxed tracking-tight border-t dark:border-white/10 border-black/10 pt-10 mt-10"
          >
            Hardware seleccionado para rendimiento empresarial.
            Equipos y dispositivos listos para integrar con nuestras plataformas.
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
                className="group inline-flex items-center gap-3 px-6 h-14 rounded-full dark:border-white/20 border-black/20 border text-sm font-black tracking-widest uppercase hover:border-[#E31E24] transition-colors duration-300 dark:bg-black bg-white"
              >
                <Filter className="w-4 h-4" />
                Filtrar
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-[#E31E24] text-white text-xs font-black">
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
                          placeholder="Buscar equipo..."
                          className="w-full h-11 pl-11 pr-4 rounded-full dark:border-white/15 border-black/15 border dark:bg-black bg-white text-sm focus:outline-none focus:border-[#E31E24] transition-colors"
                        />
                      </div>
                    </div>

                    {tags.length > 0 && (
                      <div>
                        <span className="block text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-2">
                          Etiquetas
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => {
                            const active = selectedTags.includes(tag.slug);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => toggleTag(tag.slug)}
                                className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-bold tracking-wide transition-colors duration-200 ${
                                  active
                                    ? "bg-[#E31E24] text-white border border-[#E31E24]"
                                    : "dark:border-white/20 border-black/20 border dark:text-white text-zinc-900 hover:border-[#E31E24]"
                                }`}
                              >
                                {active && <Check className="w-3 h-3" />}
                                {tag.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
                className="group inline-flex items-center gap-3 px-6 h-14 rounded-full dark:border-white/20 border-black/20 border text-sm font-black tracking-widest uppercase hover:border-[#E31E24] transition-colors duration-300 dark:bg-black bg-white"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Ordenar:&nbsp;</span>
                <span className="text-[#E31E24]">{SORT_LABELS[sortMode]}</span>
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
                              ? "bg-[#E31E24] text-white"
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
              {filtering ? (
                <div className="w-4 h-4 rounded-full border-2 border-[#E31E24] border-t-transparent animate-spin" />
              ) : (
                <>
                  {total}{" "}
                  {total === 1 ? "resultado" : "resultados"}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-12 pb-32 relative z-10">
        <div className="max-w-[1400px] w-full mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-10 h-10 rounded-full border-2 border-[#E31E24] border-t-transparent animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-6xl font-black tracking-tighter uppercase text-zinc-500 mb-4">
                Error
              </div>
              <p className="text-base text-zinc-500 max-w-md">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-6xl font-black tracking-tighter uppercase text-zinc-500 mb-4">
                Sin resultados
              </div>
              <p className="text-base text-zinc-500 mb-8 max-w-md">
                No encontramos equipos con los filtros seleccionados.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-[#E31E24] text-white text-sm font-black tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 transition-opacity duration-300 ${filtering ? "opacity-60" : "opacity-100"}`}
            >
              <AnimatePresence mode="popLayout">
                {items.map((hardware, index) => (
                  <motion.div
                    key={hardware.id}
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
                    <HardwareCard hardware={hardware} />
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
