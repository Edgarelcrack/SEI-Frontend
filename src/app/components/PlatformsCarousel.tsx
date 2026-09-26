import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SoftwareCard } from "./SoftwareCard";
import type { SoftwareListItem } from "../services/software";

const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 400;

interface PlatformsCarouselProps {
  items: SoftwareListItem[];
}

export function PlatformsCarousel({ items }: PlatformsCarouselProps) {
  const [index, setIndex] = useState(0);
  const draggingRef = useRef(false);
  const total = items.length;

  if (total === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const getOffset = (i: number) => {
    let offset = i - index;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  };

  return (
    <div className="relative w-full">
      <motion.div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Carrusel de plataformas"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
          }
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        dragMomentum={false}
        onDragStart={() => {
          draggingRef.current = true;
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) next();
          else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) prev();
          // Pequeño margen para que el click posterior al drag no abra la card.
          setTimeout(() => {
            draggingRef.current = false;
          }, 60);
        }}
        onClickCapture={(e) => {
          if (draggingRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="relative w-full flex items-center justify-center select-none outline-none focus-visible:ring-2 focus-visible:ring-[#1B56D2]/60 rounded-3xl cursor-grab active:cursor-grabbing"
        style={{
          perspective: "2200px",
          height: "clamp(560px, 70vw, 760px)",
          touchAction: "pan-y",
        }}
      >
        {items.map((item, i) => {
          const offset = getOffset(i);
          const abs = Math.abs(offset);
          const visible = abs <= 2;
          const isActive = offset === 0;

          if (!visible) return null;

          /*
           * Sin `transformStyle: preserve-3d`. Solo sirve para que los
           * descendientes compartan el espacio 3D del padre, y aquí no hay
           * ninguno que lo necesite: cada tarjeta es contenido plano al que el
           * carrusel aplica un `rotateY`. Mantenerlo impedía al navegador
           * aplanar la tarjeta a una superficie 2D normal y cachearla, así que
           * la rasterizaba dentro del contexto 3D con sus sombras e imágenes.
           * La `perspective` del contenedor basta para el efecto.
           */
          return (
            <motion.div
              key={item.id}
              className="absolute top-1/2 left-1/2 w-[88%] max-w-[640px]"
              style={{
                transformOrigin: "center center",
                pointerEvents: isActive ? "auto" : "none",
              }}
              animate={{
                x: `calc(-50% + ${offset * 38}%)`,
                y: "-50%",
                rotateY: offset * -55,
                scale: isActive ? 1 : 0.82 - (abs - 1) * 0.08,
                opacity: isActive ? 1 : 0.42 - (abs - 1) * 0.15,
                zIndex: 20 - abs,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Sin `transition-shadow`: interpolar una sombra de 120 px de
                  radio significa repintarla entera en cada fotograma durante
                  medio segundo, justo mientras el carrusel ya está rotando. */}
              <div
                aria-hidden={!isActive}
                className={`${
                  isActive ? "shadow-[0_40px_120px_-20px_rgba(0,0,0,0.45)]" : ""
                } rounded-3xl`}
              >
                {isActive ? (
                  <SoftwareCard software={item} />
                ) : (
                  /*
                   * Silueta de la tarjeta inactiva. Imita el reparto de
                   * SoftwareCard (imagen apaisada arriba, título abajo) en vez
                   * de estirar el thumbnail en un marco vertical: así la
                   * imagen se ve con su formato real y la altura sigue
                   * casando con la tarjeta activa.
                   */
                  <div className="pointer-events-none rounded-3xl overflow-hidden border dark:border-white/10 border-black/10 dark:bg-[#0a0a0a] bg-zinc-100 p-6 flex flex-col min-h-[500px]">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border dark:border-white/5 border-black/5 shadow-2xl">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1B56D2]/20 to-[#1B56D2]/5" />
                      )}
                    </div>

                    <div className="mt-auto pt-8">
                      <div className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
                        {item.tags[0]?.name ?? "Software"}
                      </div>
                      <div className="text-2xl font-black tracking-tighter uppercase dark:text-white text-zinc-900">
                        {item.name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          type="button"
          onClick={prev}
          aria-label="Plataforma anterior"
          className="group flex flex-col items-center justify-center w-28 h-20 rounded-2xl bg-[#1B56D2] text-white border border-[#1B56D2] hover:bg-[#E31E24] hover:border-[#E31E24] transition-colors duration-300 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 mb-1 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-xs font-black tracking-widest uppercase">Anterior</span>
        </button>

        <div className="flex items-center gap-2 px-4 text-xs font-bold tracking-widest uppercase text-zinc-500">
          <span className="dark:text-white text-zinc-900">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Siguiente plataforma"
          className="group flex flex-col items-center justify-center w-28 h-20 rounded-2xl dark:bg-white bg-white text-zinc-900 border dark:border-white border-black/10 hover:bg-[#1B56D2] hover:text-white hover:border-[#1B56D2] transition-colors duration-300 shadow-lg"
        >
          <span className="text-xs font-black tracking-widest uppercase mb-1">Siguiente</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
