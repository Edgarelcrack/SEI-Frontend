import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Loader2, Save, Wand2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../components/PageTitle";
import {
  Field,
  inputClass,
  textareaClass,
  selectClass,
  jsonToText,
  textToJson,
  slugify,
} from "../../components/admin/AdminUI";
import {
  getAdminHardware,
  createAdminHardware,
  updateAdminHardware,
  listAdminTags,
  type HardwareInput,
  type PriceModel,
  type ItemStatus,
  type AdminTag,
} from "../../services/admin";

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  brand: "",
  specifications: "",
  price_model: "quote" as PriceModel,
  price_min: "",
  price_max: "",
  status: "available" as ItemStatus,
  is_featured: false,
  sort_order: "0",
};

export function AdminHardwareForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!token) return;
    listAdminTags(token)
      .then((res) => setTags(res.data.filter((t) => t.applies_to === "hardware" || t.applies_to === "both")))
      .catch(() => setTags([]));
  }, [token]);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    getAdminHardware(token, id)
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name ?? "",
          slug: d.slug ?? "",
          description: d.description ?? "",
          brand: d.brand ?? "",
          specifications: jsonToText(d.specifications),
          price_model: d.price_model,
          price_min: d.price_min != null ? String(d.price_min) : "",
          price_max: d.price_max != null ? String(d.price_max) : "",
          status: d.status,
          is_featured: d.is_featured,
          sort_order: String(d.sort_order ?? 0),
        });
        setTagIds(d.hardware_tags.map((t) => t.tag_id));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "No se pudo cargar."))
      .finally(() => setLoading(false));
  }, [token, id]);

  function toggleTag(tagId: string) {
    setTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);

    let specifications: unknown;
    try {
      specifications = textToJson(form.specifications);
    } catch {
      setError("Especificaciones: JSON inválido.");
      return;
    }

    const body: HardwareInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      brand: form.brand.trim() || null,
      specifications,
      price_model: form.price_model,
      price_min: form.price_min ? Number(form.price_min) : null,
      price_max: form.price_max ? Number(form.price_max) : null,
      status: form.status,
      is_featured: form.is_featured,
      sort_order: Number(form.sort_order) || 0,
      tag_ids: tagIds,
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateAdminHardware(token, id, body);
      } else {
        await createAdminHardware(token, body);
      }
      navigate("/admin/hardware");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#E31E24]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageTitle title={isEdit ? "Admin · Editar hardware" : "Admin · Nuevo hardware"} />

      <Link
        to="/admin/hardware"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-[#E31E24] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      <h1 className="text-4xl font-black tracking-tighter uppercase mb-8">
        {isEdit ? "Editar hardware" : "Nuevo hardware"}
      </h1>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-[#E31E24]/30 bg-[#E31E24]/10 text-[#E31E24] text-sm font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Nombre">
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Slug" hint="Solo minúsculas, números y guiones. Único.">
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              className={inputClass}
              placeholder="mi-equipo"
            />
            <button
              type="button"
              onClick={() => setField("slug", slugify(form.name))}
              className="shrink-0 inline-flex items-center gap-2 px-4 rounded-xl dark:border-white/15 border-black/15 border text-xs font-bold tracking-widest uppercase text-zinc-500 hover:border-[#E31E24] hover:text-[#E31E24] transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              Generar
            </button>
          </div>
        </Field>

        <Field label="Marca">
          <input
            type="text"
            value={form.brand}
            onChange={(e) => setField("brand", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Descripción">
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className={textareaClass}
          />
        </Field>

        <Field label="Especificaciones" hint='JSON clave-valor. Ej: {"CPU": "Intel i7", "RAM": "16GB"}'>
          <textarea
            rows={6}
            value={form.specifications}
            onChange={(e) => setField("specifications", e.target.value)}
            className={textareaClass + " font-mono text-xs"}
            placeholder='{"CPU": "...", "RAM": "..."}'
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Field label="Modelo de precio">
            <select
              value={form.price_model}
              onChange={(e) => setField("price_model", e.target.value as PriceModel)}
              className={selectClass}
            >
              <option value="quote">Cotización</option>
              <option value="fixed">Fijo</option>
              <option value="range">Rango</option>
              <option value="subscription">Suscripción</option>
            </select>
          </Field>
          <Field label="Precio mín.">
            <input
              type="number"
              step="any"
              min="0"
              value={form.price_min}
              onChange={(e) => setField("price_min", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Precio máx.">
            <input
              type="number"
              step="any"
              min="0"
              value={form.price_max}
              onChange={(e) => setField("price_max", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          <Field label="Estado">
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value as ItemStatus)}
              className={selectClass}
            >
              <option value="available">Disponible</option>
              <option value="unavailable">No disponible</option>
            </select>
          </Field>
          <Field label="Orden">
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) => setField("sort_order", e.target.value)}
              className={inputClass}
            />
          </Field>
          <label className="flex items-center gap-3 h-11 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setField("is_featured", e.target.checked)}
              className="w-5 h-5 rounded accent-[#E31E24]"
            />
            <span className="text-sm font-bold tracking-wide">Destacado</span>
          </label>
        </div>

        {tags.length > 0 && (
          <Field label="Etiquetas">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = tagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 h-9 rounded-full text-xs font-bold tracking-wide transition-colors ${
                      active
                        ? "bg-[#E31E24] text-white border border-[#E31E24]"
                        : "dark:border-white/20 border-black/20 border hover:border-[#E31E24]"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-3 px-6 h-12 rounded-full bg-[#E31E24] text-white text-sm font-black tracking-widest uppercase hover:bg-[#1B56D2] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Guardar cambios" : "Crear hardware"}
          </button>
          <Link
            to="/admin/hardware"
            className="inline-flex items-center px-6 h-12 rounded-full dark:border-white/15 border-black/15 border text-sm font-black tracking-widest uppercase text-zinc-500 hover:border-[#E31E24] hover:text-[#E31E24] transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
