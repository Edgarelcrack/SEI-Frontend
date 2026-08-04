import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  listAdminImages,
  uploadAdminImage,
  updateAdminImage,
  reorderAdminImages,
  deleteAdminImage,
  type AdminImage,
  type ImageKind,
} from "../../services/admin";
import {
  compressImage,
  isAcceptedImage,
  formatBytes,
  ACCEPT_ATTR,
  MAX_UPLOAD_BYTES,
} from "../../lib/imageCompress";

interface Props {
  kind: ImageKind;
  productId: string | null;
}

export function ImageManager({ kind, productId }: Props) {
  const { token } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<AdminImage[]>([]);
  const [loading, setLoading] = useState(!!productId);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token || !productId) return;
    try {
      const res = await listAdminImages(token, kind, productId);
      setImages(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las imágenes.");
    }
  }, [token, kind, productId]);

  useEffect(() => {
    if (!token || !productId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [token, productId, refresh]);

  async function handleFiles(fileList: FileList | null) {
    if (!token || !productId || !fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList);
    const invalid = files.find((f) => !isAcceptedImage(f));
    if (invalid) {
      setError(`"${invalid.name}" no es un formato permitido. Usa JPG, PNG, WebP o AVIF.`);
      return;
    }

    setProgress({ done: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      try {
        const compressed = await compressImage(files[i]);

        if (compressed.size > MAX_UPLOAD_BYTES) {
          setError(
            `"${files[i].name}" pesa ${formatBytes(compressed.size)} tras comprimir y supera el límite de 5 MB.`,
          );
          break;
        }

        await uploadAdminImage(token, kind, productId, compressed);
        setProgress({ done: i + 1, total: files.length });
      } catch (err) {
        setError(
          err instanceof Error
            ? `Error al subir "${files[i].name}": ${err.message}`
            : "No se pudo subir la imagen.",
        );
        break;
      }
    }

    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    await refresh();
  }

  async function handleSetThumbnail(id: string) {
    if (!token) return;
    setBusyId(id);
    setError(null);
    try {
      await updateAdminImage(token, kind, id, { is_thumbnail: true });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo marcar la portada.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleAltText(id: string, value: string, previous: string) {
    if (!token || value.trim() === previous.trim()) return;
    try {
      await updateAdminImage(token, kind, id, { alt_text: value.trim() || null });
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, alt_text: value.trim() || null } : img)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el texto alternativo.");
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    if (!token || !productId) return;
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next); // optimista: el reorden se siente inmediato

    try {
      await reorderAdminImages(
        token,
        kind,
        productId,
        next.map((img) => img.id),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo reordenar.");
      await refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm("¿Eliminar esta imagen? La acción no se puede deshacer.")) return;

    setBusyId(id);
    setError(null);
    try {
      await deleteAdminImage(token, kind, id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la imagen.");
    } finally {
      setBusyId(null);
    }
  }

  if (!productId) {
    return (
      <section className="rounded-2xl dark:border-white/15 border-black/15 border border-dashed p-8 text-center">
        <ImagePlus className="w-8 h-8 mx-auto mb-3 text-zinc-500" />
        <p className="text-sm font-bold tracking-wide text-zinc-500">
          Guarda el producto para poder subir imágenes.
        </p>
      </section>
    );
  }

  const uploading = progress !== null;

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <span className="block text-[11px] font-black tracking-widest uppercase text-zinc-500">
          Imágenes
        </span>
        <span className="text-[11px] text-zinc-500">
          {images.length} {images.length === 1 ? "imagen" : "imágenes"} · la portada se marca con ★
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl border border-[#E31E24]/30 bg-[#E31E24]/10 text-[#E31E24] text-sm font-bold">
          {error}
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!uploading) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`rounded-2xl border border-dashed p-8 text-center transition-colors cursor-pointer ${
          dragging
            ? "border-[#1B56D2] bg-[#1B56D2]/5"
            : "dark:border-white/15 border-black/15 hover:border-[#1B56D2]"
        } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-[#1B56D2]" />
            <p className="text-sm font-bold tracking-wide">
              Subiendo {progress.done + 1} de {progress.total}…
            </p>
          </>
        ) : (
          <>
            <UploadCloud className="w-8 h-8 mx-auto mb-3 text-zinc-500" />
            <p className="text-sm font-bold tracking-wide">
              Arrastra imágenes aquí o haz clic para elegirlas
            </p>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              JPG, PNG, WebP o AVIF · se optimizan a WebP antes de subir · máx. 5 MB
            </p>
          </>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#1B56D2]" />
        </div>
      ) : (
        images.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, index) => (
              <li
                key={img.id}
                className={`rounded-2xl border overflow-hidden ${
                  img.is_thumbnail
                    ? "border-[#1B56D2]"
                    : "dark:border-white/15 border-black/15"
                }`}
              >
                <div className="relative aspect-video dark:bg-white/5 bg-black/5">
                  <img
                    src={img.url}
                    alt={img.alt_text ?? ""}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                  {img.is_thumbnail && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1B56D2] text-white text-[10px] font-black tracking-widest uppercase">
                      <Star className="w-3 h-3 fill-current" />
                      Portada
                    </span>
                  )}
                  {busyId === img.id && (
                    <div className="absolute inset-0 grid place-items-center bg-black/50">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-3">
                  <input
                    type="text"
                    defaultValue={img.alt_text ?? ""}
                    placeholder="Texto alternativo (accesibilidad y SEO)"
                    onBlur={(e) => handleAltText(img.id, e.target.value, img.alt_text ?? "")}
                    className="w-full h-9 px-3 rounded-lg dark:bg-black bg-white dark:border-white/15 border-black/15 border text-xs focus:outline-none focus:border-[#1B56D2] transition-colors"
                  />

                  <div className="flex items-center gap-1.5">
                    <IconButton
                      title="Mover antes"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      title="Mover después"
                      disabled={index === images.length - 1}
                      onClick={() => handleMove(index, 1)}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </IconButton>

                    <button
                      type="button"
                      title="Marcar como portada"
                      disabled={img.is_thumbnail}
                      onClick={() => handleSetThumbnail(img.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg dark:border-white/15 border-black/15 border text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:border-[#1B56D2] hover:text-[#1B56D2] transition-colors disabled:opacity-40 disabled:hover:border-inherit disabled:hover:text-zinc-500"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Portada
                    </button>

                    <IconButton
                      title="Eliminar"
                      danger
                      onClick={() => handleDelete(img.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  );
}

function IconButton({
  title,
  onClick,
  disabled,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`shrink-0 grid place-items-center w-9 h-9 rounded-lg dark:border-white/15 border-black/15 border text-zinc-500 transition-colors disabled:opacity-30 ${
        danger
          ? "hover:border-[#E31E24] hover:text-[#E31E24]"
          : "hover:border-[#1B56D2] hover:text-[#1B56D2]"
      }`}
    >
      {children}
    </button>
  );
}
