import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../components/PageTitle";
import { Field, inputClass, selectClass, slugify } from "../../components/admin/AdminUI";
import {
  listAdminTags,
  createAdminTag,
  updateAdminTag,
  deleteAdminTag,
  type AdminTag,
  type AppliesTo,
} from "../../services/admin";

const APPLIES_LABELS: Record<AppliesTo, string> = {
  software: "Software",
  hardware: "Hardware",
  both: "Ambos",
};

export function AdminTags() {
  const { token } = useAuth();
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [appliesTo, setAppliesTo] = useState<AppliesTo>("both");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    listAdminTags(token)
      .then((res) => setTags(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setSlug("");
    setAppliesTo("both");
  }

  function startEdit(tag: AdminTag) {
    setEditingId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
    setAppliesTo(tag.applies_to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);
    const body = { name: name.trim(), slug: slug.trim(), applies_to: appliesTo };
    try {
      if (editingId) {
        await updateAdminTag(token, editingId, body);
      } else {
        await createAdminTag(token, body);
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(tag: AdminTag) {
    if (!token) return;
    if (!window.confirm(`¿Eliminar la etiqueta "${tag.name}"?`)) return;
    setDeletingId(tag.id);
    setError(null);
    try {
      await deleteAdminTag(token, tag.id);
      if (editingId === tag.id) resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-3xl">
      <PageTitle title="Admin · Etiquetas" />

      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Etiquetas</h1>
        <p className="text-sm text-zinc-500 mt-1">{tags.length} etiquetas · sistema de filtrado</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-[#E31E24]/30 bg-[#E31E24]/10 text-[#E31E24] text-sm font-bold">
          {error}
        </div>
      )}

      {/* Formulario crear/editar */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 p-6 rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-black tracking-widest uppercase">
            {editingId ? "Editar etiqueta" : "Nueva etiqueta"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-[#E31E24]"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Nombre">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingId) setSlug(slugify(e.target.value));
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Slug">
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Aplica a">
            <select
              value={appliesTo}
              onChange={(e) => setAppliesTo(e.target.value as AppliesTo)}
              className={selectClass}
            >
              <option value="both">Ambos</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
            </select>
          </Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 px-5 h-11 rounded-full bg-[#1B56D2] text-white text-sm font-black tracking-widest uppercase hover:bg-[#E31E24] transition-colors disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : editingId ? (
            <Save className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {editingId ? "Guardar" : "Crear"}
        </button>
      </form>

      {/* Lista */}
      <div className="rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-[#1B56D2]" />
          </div>
        ) : tags.length === 0 ? (
          <p className="py-16 text-center text-sm text-zinc-500">No hay etiquetas aún.</p>
        ) : (
          <ul className="divide-y dark:divide-white/5 divide-black/5">
            {tags.map((tag) => (
              <li key={tag.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="font-bold truncate">{tag.name}</p>
                  <p className="text-xs text-zinc-500 truncate">/{tag.slug}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 hidden sm:block">
                    {APPLIES_LABELS[tag.applies_to]}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(tag)}
                    className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 text-zinc-500 hover:text-[#1B56D2] transition-colors"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tag)}
                    disabled={deletingId === tag.id}
                    className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 text-zinc-500 hover:text-[#E31E24] transition-colors disabled:opacity-50"
                    aria-label="Eliminar"
                  >
                    {deletingId === tag.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
