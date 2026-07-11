import type { ReactNode } from "react";

export const inputClass =
  "w-full h-11 px-4 rounded-xl dark:bg-black bg-white dark:border-white/15 border-black/15 border text-sm focus:outline-none focus:border-[#1B56D2] transition-colors";

export const textareaClass =
  "w-full px-4 py-3 rounded-xl dark:bg-black bg-white dark:border-white/15 border-black/15 border text-sm focus:outline-none focus:border-[#1B56D2] transition-colors leading-relaxed";

export const selectClass = inputClass + " appearance-none cursor-pointer";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-black tracking-widest uppercase text-zinc-500 mb-2">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-zinc-500 mt-1.5">{hint}</span>}
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    unavailable: "bg-zinc-500/10 text-zinc-500 border-zinc-500/30",
    new: "bg-[#1B56D2]/10 text-[#1B56D2] border-[#1B56D2]/30",
    contacted: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    closed: "bg-zinc-500/10 text-zinc-500 border-zinc-500/30",
  };
  const labels: Record<string, string> = {
    available: "Disponible",
    unavailable: "No disponible",
    new: "Nuevo",
    contacted: "Contactado",
    closed: "Cerrado",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase ${
        map[status] ?? "bg-zinc-500/10 text-zinc-500 border-zinc-500/30"
      }`}
    >
      {labels[status] ?? status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Conversores para campos de array y JSON
// ---------------------------------------------------------------------------

/** Convierte un valor (array u otro) a texto con un elemento por línea. */
export function arrayToText(value: unknown): string {
  if (Array.isArray(value)) return value.join("\n");
  if (value == null) return "";
  return String(value);
}

/** Texto con un elemento por línea → array de strings (sin vacíos). */
export function textToArray(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Valor JSON → texto formateado (vacío si null/undefined). */
export function jsonToText(value: unknown): string {
  if (value == null) return "";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

/** Texto JSON → valor. Lanza Error con mensaje legible si es inválido. */
export function textToJson(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error("JSON inválido");
  }
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Genera un slug ASCII a partir de un texto. */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
