/**
 * Compresión de imágenes en el navegador, antes de subirlas.
 *
 * Redimensiona y convierte a WebP con canvas para que al bucket lleguen
 * archivos de unos pocos cientos de KB en vez de fotos de cámara de 4-8 MB.
 * Es lo que da el grueso del beneficio de un CDN de imágenes sin sumar un
 * proveedor externo: menos almacenamiento, menos egress y carga más rápida.
 */

export interface CompressOptions {
  /** Ancho máximo en px (mantiene proporción). */
  maxWidth?: number;
  /** Alto máximo en px (mantiene proporción). */
  maxHeight?: number;
  /** Calidad 0–1 para formatos con pérdida. */
  quality?: number;
}

const DEFAULTS: Required<CompressOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
};

/** MIME types que acepta el bucket (ver 002_storage.sql). */
export const ACCEPTED_MIME = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

/** Valor para el atributo `accept` de un `<input type="file">`. */
export const ACCEPT_ATTR = ACCEPTED_MIME.join(",");

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function isAcceptedImage(file: File): boolean {
  return (ACCEPTED_MIME as readonly string[]).includes(file.type);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Devuelve una versión redimensionada y convertida a WebP del archivo.
 *
 * Nunca lanza: si el navegador no puede decodificar o el resultado pesa más
 * que el original, devuelve el archivo original intacto.
 */
export async function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const { maxWidth, maxHeight, quality } = { ...DEFAULTS, ...options };

  // AVIF ya viene muy optimizado y no todos los navegadores lo re-codifican bien.
  if (file.type === "image/avif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file;
  }

  try {
    const scale = Math.min(maxWidth / bitmap.width, maxHeight / bitmap.height, 1);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    let blob = await canvasToBlob(canvas, "image/webp", quality);

    // Safari viejo ignora el tipo pedido y devuelve PNG: en ese caso, JPEG.
    if (!blob || blob.type !== "image/webp") {
      blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }
    if (!blob) return file;

    // Comprimir un PNG pequeño o un WebP ya optimizado puede agrandarlo.
    if (blob.size >= file.size) return file;

    const ext = blob.type === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "") || "imagen";

    return new File([blob], `${base}.${ext}`, {
      type: blob.type,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    bitmap.close();
  }
}
