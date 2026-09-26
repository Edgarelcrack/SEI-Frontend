import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ArrowLeft, ArrowUpRight, Check, Loader2, Package, ShoppingBag } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { PageTitle } from "../components/PageTitle";
import { getHardwareBySlug, type HardwareDetail as HardwareDetailType } from "../services/hardware";
import { ApiError, formatPrice } from "../services/api";
import { useCart } from "../context/CartContext";

export function HardwareDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [hardware, setHardware] = useState<HardwareDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addItem, addingId, cart } = useCart();

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    getHardwareBySlug(slug)
      .then((res) => setHardware(res.data))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#E31E24] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !hardware) {
    return <Navigate to="/hardware" replace />;
  }

  const heroImage =
    hardware.images.find((img) => img.is_thumbnail)?.url ??
    hardware.images[0]?.url ??
    null;

  const priceLabel = formatPrice(hardware.price_model, hardware.price_min, hardware.price_max);
  const categoryLabel = hardware.brand ?? hardware.tags[0]?.name ?? "Hardware";

  const adding = addingId === hardware.id;
  const inCart = cart?.items.some(
    (it) => it.item_type === "hardware" && it.item_id === hardware.id,
  ) ?? false;

  const specs = hardware.specifications as Record<string, string> | null;
  const specEntries = specs ? Object.entries(specs) : [];

  const galleryImages = hardware.images.filter((img) => !img.is_thumbnail);

  return (
    <div className="bg-background min-h-screen text-foreground pb-32 font-sans transition-colors duration-300">
      <PageTitle title={hardware.name} description={hardware.description ?? undefined} />

      {/* Immersive Header */}
      <div className="relative min-h-[80vh] flex flex-col justify-end pb-24 overflow-hidden dark:border-white/10 border-black/10 border-b">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 pointer-events-none z-0 will-change-transform"
        >
          <div className="absolute inset-0 bg-black/60 z-10" />
          {heroImage ? (
            <img
              src={heroImage}
              alt={hardware.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="w-full h-full object-cover filter grayscale opacity-40 scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#E31E24]/20 to-transparent" />
          )}
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

        <div className="container mx-auto px-6 lg:px-12 relative z-20 w-full max-w-[1400px]">
          <Button asChild variant="ghost" className="mb-12 text-zinc-500 hover:text-[#E31E24] hover:bg-transparent px-0 font-bold tracking-widest uppercase transition-colors">
            <Link to="/hardware">
              <ArrowLeft className="mr-3 w-5 h-5" />
              VOLVER A EQUIPOS
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-l border-[#E31E24] pl-6 md:pl-12">
            <div className="max-w-4xl">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#E31E24]/30 bg-[#E31E24]/10 text-[#E31E24] text-sm font-bold tracking-widest uppercase mb-8">
                {categoryLabel}
              </div>
              <h1 className="text-display-detail leading-[0.85] font-black tracking-tighter uppercase mb-6">
                {hardware.name}
              </h1>
              {hardware.brand && (
                <p className="text-2xl md:text-3xl text-zinc-400 font-light leading-relaxed tracking-tight max-w-3xl">
                  {hardware.brand}
                </p>
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

            {/* Hero image (non-thumbnail) gallery */}
            {heroImage && (
              <div className="relative group">
                <div className="glow-red absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <div className="relative w-full aspect-[16/9] dark:bg-[#0a0a0a] bg-zinc-100 rounded-3xl dark:border-white/10 border-black/10 border overflow-hidden shadow-2xl">
                  <img
                    src={heroImage}
                    alt={hardware.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Tabs: Descripción / Especificaciones */}
            <div className="dark:border-white/10 border-black/10 border-t pt-16">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-transparent dark:border-white/10 border-black/10 border p-2 rounded-2xl h-auto mb-16">
                  <TabsTrigger
                    value="description"
                    className="rounded-xl data-[state=active]:bg-[#E31E24] data-[state=active]:text-white text-zinc-500 font-black tracking-widest uppercase py-4 transition-colors"
                  >
                    DESCRIPCIÓN
                  </TabsTrigger>
                  <TabsTrigger
                    value="specs"
                    className="rounded-xl data-[state=active]:bg-[#E31E24] data-[state=active]:text-white text-zinc-500 font-black tracking-widest uppercase py-4 flex items-center justify-center gap-3 transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    ESPECIFICACIONES
                  </TabsTrigger>
                </TabsList>

                {/* DESCRIPTION TAB */}
                <TabsContent value="description" className="space-y-16 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {hardware.description && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 dark:border-white/10 border-black/10 border-l pl-6 md:pl-12">
                      <div className="md:col-span-1">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500">SOBRE ESTE EQUIPO</h3>
                      </div>
                      <div className="md:col-span-3">
                        <p className="text-2xl font-light leading-relaxed tracking-tight">
                          {hardware.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {hardware.tags.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-l border-[#E31E24]/50 pl-6 md:pl-12">
                      <div className="md:col-span-1">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-[#E31E24]">CATEGORÍAS</h3>
                      </div>
                      <div className="md:col-span-3 flex flex-wrap gap-3">
                        {hardware.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-4 py-2 dark:border-white/10 border-black/10 border rounded-full text-xs font-bold tracking-widest uppercase text-zinc-500"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hardware.price_model !== 'quote' && (
                    <div className="p-12 rounded-3xl bg-[#E31E24] text-white flex flex-col md:flex-row items-center justify-between gap-8 transform hover:scale-[1.02] transition-transform duration-500">
                      <div>
                        <div className="text-xs font-black tracking-widest uppercase text-white/60 mb-2">PRECIO</div>
                        <div className="text-6xl font-black tracking-tighter">{priceLabel}</div>
                        <div className="text-lg font-bold tracking-widest uppercase text-white/70 mt-2">
                          {hardware.price_model === 'subscription' ? 'Suscripción mensual' : hardware.price_model === 'range' ? 'Precio por rango' : 'Precio fijo'}
                        </div>
                      </div>
                      <a
                        href="/services"
                        className="group flex items-center justify-center w-48 h-48 rounded-full border-2 border-white/40 font-black tracking-widest uppercase hover:bg-white hover:text-[#E31E24] transition-colors duration-300 shrink-0"
                      >
                        COTIZAR
                        <ArrowUpRight className="w-5 h-5 ml-2 group-hover:rotate-45 transition-transform" />
                      </a>
                    </div>
                  )}
                </TabsContent>

                {/* SPECS TAB */}
                <TabsContent value="specs" className="space-y-16 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {specEntries.length > 0 ? (
                    <div className="dark:border-white/10 border-black/10 border-l pl-6 md:pl-12 space-y-0">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8">FICHA TÉCNICA</h3>
                      <div className="divide-y dark:divide-white/5 divide-black/5">
                        {specEntries.map(([key, value]) => (
                          <div key={key} className="flex items-start justify-between py-5 gap-8">
                            <span className="text-sm font-black tracking-widest uppercase text-zinc-500 shrink-0 w-40">
                              {key}
                            </span>
                            <span className="text-sm dark:text-zinc-300 text-zinc-700 font-light leading-relaxed text-right">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Package className="w-12 h-12 text-zinc-500 mb-4" />
                      <p className="text-zinc-500 text-sm">
                        Las especificaciones técnicas están disponibles bajo consulta.
                      </p>
                    </div>
                  )}

                  {/* Additional images gallery */}
                  {galleryImages.length > 0 && (
                    <div className="dark:border-white/10 border-black/10 border-t pt-16">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8">GALERÍA</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {galleryImages.map((img) => (
                          <div key={img.id} className="aspect-video rounded-2xl overflow-hidden dark:border-white/5 border-black/5 border">
                            <img
                              src={img.url}
                              alt={img.alt_text ?? hardware.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">

              <div className="p-8 dark:border-white/10 border-black/10 border rounded-3xl dark:bg-[#0a0a0a] bg-zinc-100 transition-colors duration-300">
                <h3 className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-8">FICHA RÁPIDA</h3>
                <div className="space-y-6">
                  {hardware.brand && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">MARCA</span>
                      <span className="text-sm font-black tracking-widest uppercase text-[#E31E24]">{hardware.brand}</span>
                    </div>
                  )}

                  {hardware.tags[0] && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">CATEGORÍA</span>
                      <span className="text-sm font-black tracking-widest uppercase">{hardware.tags[0].name}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">PRECIO</span>
                    <span className="text-sm font-black tracking-widest uppercase">{priceLabel}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">DISPONIBILIDAD</span>
                    <span className="text-sm font-black tracking-widest uppercase text-emerald-400">DISPONIBLE</span>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-[#E31E24]/30 rounded-3xl bg-gradient-to-b from-[#E31E24]/10 to-transparent relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">¿INTERESADO?</h3>
                  <p className="text-sm font-light text-zinc-500 leading-relaxed mb-8">
                    Agrega este equipo a tu cotización o contáctanos para recibir asesoría técnica.
                  </p>
                  <button
                    type="button"
                    onClick={() => { if (!adding) addItem("hardware", hardware.id); }}
                    disabled={adding}
                    className={`flex items-center justify-center gap-3 w-full h-14 rounded-full font-black tracking-widest uppercase transition-colors mb-4 disabled:cursor-not-allowed ${
                      inCart
                        ? "bg-[#E31E24]/10 text-[#E31E24] border border-[#E31E24]/30"
                        : "bg-[#E31E24] text-white hover:bg-[#1B56D2]"
                    }`}
                  >
                    {adding ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : inCart ? (
                      <><Check className="w-5 h-5" /> EN EL CARRITO</>
                    ) : (
                      <><ShoppingBag className="w-5 h-5" /> AGREGAR AL CARRITO</>
                    )}
                  </button>
                  <Link
                    to="/services"
                    className="flex items-center justify-center gap-3 w-full h-14 rounded-full dark:bg-white/5 bg-black/5 dark:text-white text-zinc-900 font-black tracking-widest uppercase dark:hover:bg-white/10 hover:bg-black/10 transition-colors"
                  >
                    COTIZAR
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
