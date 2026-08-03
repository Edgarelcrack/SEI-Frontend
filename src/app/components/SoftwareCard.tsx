import { memo, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Loader2, ShoppingBag } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { formatPrice } from "../services/api";
import type { SoftwareListItem } from "../services/software";
import { useCart } from "../context/CartContext";

interface SoftwareCardProps {
  software: SoftwareListItem;
}

function SoftwareCardImpl({ software }: SoftwareCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { addItem, addingId, cart } = useCart();

  const adding = addingId === software.id;
  const inCart = cart?.items.some(
    (it) => it.item_type === "software" && it.item_id === software.id,
  ) ?? false;

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    addItem("software", software.id);
  }

  const categoryLabel = software.tags[0]?.name ?? "Software";
  const tagPills = software.tags.slice(0, 3);
  const priceLabel = formatPrice(software.price_model, software.price_min, software.price_max);

  return (
    <TiltCard className="h-full">
      <Link
        ref={ref}
        onMouseMove={handleMouseMove}
        to={`/software/${software.slug}`}
        data-cursor="ver"
        className="group block relative w-full h-full dark:border-white/10 border-black/10 border hover:border-[#1B56D2]/50 transition-colors duration-500 dark:bg-[#0a0a0a] bg-zinc-100 rounded-3xl overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--spot-x) var(--spot-y), rgba(27,86,210,0.15), transparent 40%)",
          }}
        />

        <div className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-500 group-hover:opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative p-6 md:p-10 z-10 flex flex-col h-full min-h-[500px]">
          <div className="flex justify-between items-start mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B56D2]/30 bg-[#1B56D2]/5 text-[#1B56D2] text-xs font-bold tracking-widest uppercase">
              {categoryLabel}
            </div>
            <div className="w-12 h-12 rounded-full dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/10 border flex items-center justify-center group-hover:bg-[#1B56D2] group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border dark:border-white/5 border-black/5 mb-10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60" />
            {software.thumbnail_url ? (
              /*
               * `transition-all` hacía que el navegador vigilase todas las
               * propiedades. Ahora se listan las tres que cambian, y el
               * `filter` (lo más caro: matriz de color sobre la imagen
               * completa en cada fotograma) se resuelve en 300 ms en vez
               * de 700, mientras opacidad y escala mantienen el ritmo.
               */
              <img
                src={software.thumbnail_url}
                alt={software.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter grayscale opacity-70 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-property:opacity,transform,filter] [transition-duration:700ms,700ms,300ms] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1B56D2]/20 to-[#1B56D2]/5" />
            )}
          </div>

          <div className="mt-auto flex flex-col gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase dark:text-white text-zinc-900 mb-2 group-hover:text-[#1B56D2] transition-colors duration-500">
                {software.name}
              </h3>
              <p className="text-sm font-medium tracking-widest uppercase text-zinc-500 mb-6">
                {software.tagline}
              </p>
              <p className="text-lg text-zinc-500 font-light leading-relaxed line-clamp-2 max-w-xl">
                {software.short_description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-8 dark:border-white/10 border-black/10 border-t">
              <div className="flex flex-wrap gap-2">
                {tagPills.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 dark:bg-white/5 bg-black/5 dark:text-zinc-300 text-zinc-600 text-xs font-bold tracking-widest uppercase rounded dark:border-white/5 border-black/5 border"
                  >
                    {tag.name}
                  </span>
                ))}
                {software.tags.length > 3 && (
                  <span className="px-3 py-1 text-zinc-500 text-xs font-bold tracking-widest uppercase">
                    +{software.tags.length - 3}
                  </span>
                )}
              </div>

              {software.price_model !== 'quote' && (
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Licencia</span>
                  <span className="text-xl font-black tracking-tighter dark:text-white text-zinc-900">
                    {priceLabel}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              className={`relative z-20 flex items-center justify-center gap-3 w-full h-14 rounded-full font-black tracking-widest uppercase text-sm transition-colors duration-300 disabled:cursor-not-allowed ${
                inCart
                  ? "bg-[#1B56D2]/10 text-[#1B56D2] border border-[#1B56D2]/30"
                  : "bg-[#1B56D2] text-white hover:bg-[#E31E24]"
              }`}
            >
              {adding ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : inCart ? (
                <>
                  <Check className="w-5 h-5" />
                  En el carrito
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export const SoftwareCard = memo(SoftwareCardImpl);
