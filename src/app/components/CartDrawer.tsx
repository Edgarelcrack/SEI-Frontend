import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";
import { ArrowUpRight, Loader2, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../services/api";

export function CartDrawer() {
  const {
    cart,
    itemCount,
    isOpen,
    checkingOut,
    removingId,
    error,
    closeCart,
    removeItem,
    checkout,
  } = useCart();

  const items = cart?.items ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            /* Sin backdrop-blur: es un filtro a pantalla completa cuya opacidad
               además se anima, así que el navegador reharía el desenfoque de
               todo el viewport en cada fotograma de apertura y cierre. Bajo un
               velo negro al 70 % el desenfoque no se percibía. */
            className="fixed inset-0 z-[60] bg-black/70"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-label="Carrito de cotización"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-[61] h-full w-[min(92vw,440px)] flex flex-col will-change-transform dark:bg-[#0a0a0a] bg-white dark:border-white/10 border-black/10 border-l shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 dark:border-white/10 border-black/10 border-b shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#1B56D2]" />
                <h2 className="text-lg font-black tracking-tighter uppercase">
                  Carrito
                </h2>
                {itemCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-[#1B56D2] text-white text-xs font-black">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="p-2 rounded-full dark:text-zinc-400 text-zinc-500 hover:text-[#E31E24] dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="w-16 h-16 rounded-full dark:bg-white/5 bg-black/5 flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-zinc-500" />
                  </div>
                  <p className="text-sm font-bold tracking-widest uppercase text-zinc-500">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-zinc-500 font-light max-w-[260px]">
                    Agrega plataformas o equipos para solicitar una cotización por WhatsApp.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => {
                    const product = item.product;
                    const detailPath =
                      product
                        ? `/${item.item_type === "software" ? "software" : "hardware"}/${product.slug}`
                        : null;
                    const priceLabel = product
                      ? formatPrice(product.price_model, product.price_min, product.price_max)
                      : "—";

                    return (
                      <li
                        key={item.id}
                        className="flex gap-4 p-3 rounded-2xl dark:border-white/10 border-black/10 border dark:bg-white/[0.02] bg-black/[0.02]"
                      >
                        <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden dark:bg-black bg-zinc-100 dark:border-white/5 border-black/5 border">
                          {product?.thumbnail_url ? (
                            <img
                              src={product.thumbnail_url}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${
                                item.item_type === "software"
                                  ? "from-[#1B56D2]/20 to-[#1B56D2]/5"
                                  : "from-[#E31E24]/20 to-[#E31E24]/5"
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-[10px] font-black tracking-widest uppercase ${
                                item.item_type === "software" ? "text-[#1B56D2]" : "text-[#E31E24]"
                              }`}
                            >
                              {item.item_type === "software" ? "Software" : "Hardware"}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              disabled={removingId === item.id}
                              aria-label="Eliminar del carrito"
                              className="p-1 rounded-md text-zinc-500 hover:text-[#E31E24] transition-colors disabled:opacity-50"
                            >
                              {removingId === item.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>

                          {detailPath ? (
                            <Link
                              to={detailPath}
                              onClick={closeCart}
                              className="text-sm font-black tracking-tight uppercase truncate hover:text-[#1B56D2] transition-colors"
                            >
                              {product?.name ?? "Producto"}
                            </Link>
                          ) : (
                            <span className="text-sm font-black tracking-tight uppercase truncate text-zinc-500">
                              Producto no disponible
                            </span>
                          )}

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                              Cant. {item.quantity}
                            </span>
                            <span className="text-sm font-black tracking-tighter">
                              {priceLabel}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-6 dark:border-white/10 border-black/10 border-t shrink-0 space-y-4">
              {error && (
                <p className="text-xs font-bold tracking-wide text-[#E31E24] text-center">
                  {error}
                </p>
              )}
              <p className="text-xs text-zinc-500 font-light leading-relaxed text-center">
                Los precios son referenciales. Envía tu selección por WhatsApp y un asesor confirmará la cotización.
              </p>
              <button
                type="button"
                onClick={checkout}
                disabled={items.length === 0 || checkingOut}
                className="group flex items-center justify-center gap-3 w-full h-14 rounded-full bg-[#25D366] text-white font-black tracking-widest uppercase hover:bg-[#1faa52] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {checkingOut ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Enviar por WhatsApp
                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
