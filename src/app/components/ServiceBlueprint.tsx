import { useId } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

export type BlueprintKind = "architecture" | "deploy" | "ops" | "strategy";

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#E31E24";
const LIVE = "#22C55E";

/** Trazo común para las líneas/cajas del esquema. */
const stroke = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
  fill: "none",
};

/** Estilo común para las etiquetas monoespaciadas. */
const label = {
  textAnchor: "middle" as const,
  fontSize: 11,
  fill: "currentColor",
  fillOpacity: 0.7,
  stroke: "none",
  className: "font-mono uppercase tracking-widest",
};

function buildVariants(reduce: boolean) {
  const k = reduce ? 0 : 1;
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i = 0) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.7 * k, delay: (0.05 + i * 0.08) * k, ease: EASE },
        opacity: { duration: 0.25 * k, delay: (0.05 + i * 0.08) * k },
      },
    }),
  };
  const pop: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i = 0) => ({
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4 * k, delay: (0.25 + i * 0.08) * k, ease: EASE },
    }),
  };
  const fade: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 0) => ({
      opacity: 1,
      transition: { duration: 0.3 * k, delay: (0.3 + i * 0.08) * k },
    }),
  };
  return { draw, pop, fade };
}

interface ServiceBlueprintProps {
  kind: BlueprintKind;
  active: boolean;
  className?: string;
}

export function ServiceBlueprint({ kind, active, className }: ServiceBlueprintProps) {
  const reduce = useReducedMotion() ?? false;
  const { draw, pop, fade } = buildVariants(reduce);
  const sweepId = useId().replace(/:/g, "");

  return (
    <motion.svg
      viewBox="0 0 460 200"
      fill="none"
      aria-hidden="true"
      className={className}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
    >
      {/* Línea de escaneo que barre el esquema */}
      <defs>
        <linearGradient id={sweepId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {active && !reduce && (
        <motion.rect
          y={0}
          width={64}
          height={200}
          fill={`url(#${sweepId})`}
          stroke="none"
          initial={{ x: -64 }}
          animate={{ x: 460 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: 0.6 }}
        />
      )}
      {kind === "architecture" && (
        <>
          {/* Nodos: CLIENT → EDGE → API */}
          <motion.rect variants={draw} custom={0} x={20} y={70} width={96} height={48} rx={4} {...stroke} />
          <motion.rect variants={draw} custom={1} x={182} y={70} width={96} height={48} rx={4} {...stroke} />
          <motion.rect variants={draw} custom={2} x={344} y={70} width={96} height={48} rx={4} {...stroke} />
          {/* Conexiones horizontales */}
          <motion.line variants={draw} custom={3} x1={116} y1={94} x2={182} y2={94} {...stroke} />
          <motion.line variants={draw} custom={4} x1={278} y1={94} x2={344} y2={94} {...stroke} />
          {/* Rama hacia la base de datos */}
          <motion.line variants={draw} custom={5} x1={230} y1={118} x2={230} y2={150} {...stroke} />
          <motion.rect variants={draw} custom={6} x={182} y={150} width={96} height={36} rx={14} {...stroke} />
          {/* Acentos en las conexiones */}
          <motion.circle variants={pop} custom={2} cx={116} cy={94} r={4} fill={ACCENT} stroke="none" />
          <motion.circle variants={pop} custom={3} cx={278} cy={94} r={4} fill={ACCENT} stroke="none" />
          {/* Etiquetas */}
          <motion.text variants={fade} custom={0} x={68} y={62} {...label}>CLIENT</motion.text>
          <motion.text variants={fade} custom={1} x={230} y={62} {...label}>EDGE</motion.text>
          <motion.text variants={fade} custom={2} x={392} y={62} {...label}>API</motion.text>
          <motion.text variants={fade} custom={3} x={230} y={173} {...label}>DB</motion.text>
        </>
      )}

      {kind === "deploy" && (
        <>
          {/* Conexiones del pipeline */}
          <motion.line variants={draw} custom={1} x1={68} y1={80} x2={132} y2={80} {...stroke} />
          <motion.line variants={draw} custom={2} x1={168} y1={80} x2={232} y2={80} {...stroke} />
          <motion.line variants={draw} custom={3} x1={268} y1={80} x2={332} y2={80} {...stroke} />
          {/* Etapas */}
          <motion.circle variants={draw} custom={0} cx={50} cy={80} r={16} {...stroke} />
          <motion.circle variants={draw} custom={1} cx={150} cy={80} r={16} {...stroke} />
          <motion.circle variants={draw} custom={2} cx={250} cy={80} r={16} {...stroke} />
          <motion.circle variants={draw} custom={3} cx={350} cy={80} r={18} stroke={ACCENT} strokeWidth={2} fill="none" vectorEffect="non-scaling-stroke" />
          {/* Check final (SHIP) */}
          <motion.path variants={draw} custom={4} d="M 342 80 l 5 6 l 10 -12" stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" vectorEffect="non-scaling-stroke" />
          {/* Etiquetas */}
          <motion.text variants={fade} custom={0} x={50} y={116} {...label}>PUSH</motion.text>
          <motion.text variants={fade} custom={1} x={150} y={116} {...label}>BUILD</motion.text>
          <motion.text variants={fade} custom={2} x={250} y={116} {...label}>TEST</motion.text>
          <motion.text variants={fade} custom={3} x={350} y={120} {...label} fill={ACCENT} fillOpacity={1}>SHIP</motion.text>
        </>
      )}

      {kind === "ops" && (
        <>
          {/* Línea de monitoreo (ECG) */}
          <motion.path
            variants={draw}
            custom={0}
            d="M 20 110 H 110 L 130 70 L 150 150 L 170 110 H 250 L 268 60 L 286 160 L 304 110 H 440"
            {...stroke}
          />
          {/* Pulsos en vivo */}
          {active && !reduce && (
            <>
              <motion.circle cx={130} cy={70} r={5} fill={ACCENT} stroke="none"
                animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <motion.circle cx={268} cy={60} r={5} fill={ACCENT} stroke="none"
                animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            </>
          )}
          <motion.circle variants={pop} custom={1} cx={130} cy={70} r={4} fill={ACCENT} stroke="none" />
          <motion.circle variants={pop} custom={2} cx={268} cy={60} r={4} fill={ACCENT} stroke="none" />
          {/* Estado en línea */}
          <motion.circle variants={pop} custom={0} cx={26} cy={28} r={5} fill={LIVE} stroke="none" />
          <motion.text variants={fade} custom={0} x={40} y={32} {...label} textAnchor="start">MONITOR · 24/7</motion.text>
        </>
      )}

      {kind === "strategy" && (
        <>
          {/* Línea base (legado) */}
          <motion.line variants={fade} custom={0} x1={20} y1={170} x2={440} y2={170} strokeDasharray="4 6" {...stroke} />
          {/* Ruta ascendente de transformación */}
          <motion.path variants={draw} custom={0} d="M 50 150 L 180 120 L 310 78 L 420 40" {...stroke} />
          {/* Punta de flecha */}
          <motion.path variants={draw} custom={4} d="M 420 40 l -16 2 m 16 -2 l -4 16" {...stroke} />
          {/* Hitos */}
          <motion.circle variants={pop} custom={0} cx={50} cy={150} r={5} fill="currentColor" stroke="none" />
          <motion.circle variants={pop} custom={1} cx={180} cy={120} r={5} fill="currentColor" stroke="none" />
          <motion.circle variants={pop} custom={2} cx={310} cy={78} r={5} fill="currentColor" stroke="none" />
          <motion.circle variants={pop} custom={3} cx={420} cy={40} r={6} fill={ACCENT} stroke="none" />
          {/* Etiquetas */}
          <motion.text variants={fade} custom={0} x={50} y={188} {...label}>LEGADO</motion.text>
          <motion.text variants={fade} custom={4} x={420} y={28} {...label} fill={ACCENT} fillOpacity={1}>ESCALA</motion.text>
        </>
      )}
    </motion.svg>
  );
}
