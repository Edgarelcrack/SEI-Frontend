import { memo, useRef } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Check, Loader2, ShoppingBag } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { formatPrice } from "../services/api";
import type { HardwareListItem } from "../services/hardware";
import { useCart } from "../context/CartContext";

interface HardwareCardProps {
  hardware: HardwareListItem;
}

function HardwareCardImpl({ hardware }: HardwareCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { addItem, addingId, cart } = useCart();

  const adding = addingId === hardware.id;
  const inCart = cart?.items.some(
    (it) => it.item_type === "hardware" && it.item_id === hardware.id,
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
    addItem("hardware", hardware.id);
  }

  const categoryLabel = hardware.brand ?? hardware.tags[0]?.name ?? "Hardware";
  const tagPills = hardware.tags.slice(0, 3);
  const priceLabel = formatPrice(hardware.price_model, hardware.price_min, hardware.price_max);

  return (
    <TiltCard className="h-full">
      <Link
        ref={ref}
        onMouseMove={handleMouseMove}
        to={`/hardware/${hardware.slug}`}
        className="group block relative w-full h-full dark:border-white/10 border-black/10 border hover:border-[#E31E24]/50 transition-colors duration-500 dark:bg-[#0a0a0a] bg-zinc-100 rounded-3xl overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--spot-x) var(--spot-y), rgba(227,30,36,0.10), transparent 40%)",
          }}
        />

        <div className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-500 group-hover:opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative p-6 md:p-10 z-10 flex flex-col h-full min-h-[500px]">
          <div className="flex justify-between items-start mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#E31E24]/30 bg-[#E31E24]/5 text-[#E31E24] text-xs font-bold tracking-widest uppercase">
              {categoryLabel}
            </div>
            <div className="w-12 h-12 rounded-full dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/10 border flex items-center justify-center group-hover:bg-[#E31E24] group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-[background-color,border-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border dark:border-white/5 border-black/5 mb-10 shadow-2xl">
            {hardware.thumbnail_url ? (
              /* Ver nota en SoftwareCard: se evita `transition-all` y se acorta
                 la transición del `filter`, que es la más cara de las tres. */
              <img
                src={hardware.thumbnail_url}
                alt={hardware.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter grayscale opacity-70 ease-[cubic-bezier(0.16,1,0.3,1)] [transition-property:opacity,transform,filter] [transition-duration:700ms,700ms,300ms] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E31E24]/20 to-[#E31E24]/5" />
            )}
          </div>

          <div className="mt-auto flex flex-col gap-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase dark:text-white text-zinc-900 mb-2 group-hover:text-[#E31E24] transition-colors duration-500">
                {hardware.name}
              </h3>
              {hardware.brand && (
                <p className="text-sm font-medium tracking-widest uppercase text-zinc-500 mb-6">
                  {hardware.brand}
                </p>
              )}
              <p className="text-lg text-zinc-500 font-light leading-relaxed line-clamp-2 max-w-xl">
                {hardware.description}
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
                {hardware.tags.length > 3 && (
                  <span className="px-3 py-1 text-zinc-500 text-xs font-bold tracking-widest uppercase">
                    +{hardware.tags.length - 3}
                  </span>
                )}
              </div>

              {hardware.price_model !== 'quote' && (
                <div className="flex flex-col">
                  <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Precio</span>
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
                  ? "bg-[#E31E24]/10 text-[#E31E24] border border-[#E31E24]/30"
                  : "bg-[#E31E24] text-white hover:bg-[#1B56D2]"
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

export const HardwareCard = memo(HardwareCardImpl);
