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
  arrayToText,
  textToArray,
  jsonToText,
  textToJson,
  slugify,
} from "../../components/admin/AdminUI";
import {
  getAdminSoftware,
  createAdminSoftware,
  updateAdminSoftware,
  listAdminTags,
  type SoftwareInput,
  type PriceModel,
  type ItemStatus,
  type AdminTag,
} from "../../services/admin";

const EMPTY = {
  name: "",
  slug: "",
  tagline: "",
  short_description: "",
  overview: "",
  scalability_info: "",
  security_info: "",
  demo_url: "",
  price_model: "quote" as PriceModel,
  price_min: "",
  price_max: "",
  status: "available" as ItemStatus,
  is_featured: false,
  sort_order: "0",
  features: "",
  tech_stack: "",
  video_urls: "",
  technical_details: "",
  api_integrations: "",
};

export function AdminSoftwareForm() {
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
      .then((res) => setTags(res.data.filter((t) => t.applies_to === "software" || t.applies_to === "both")))
      .catch(() => setTags([]));
  }, [token]);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    getAdminSoftware(token, id)
      .then((res) => {
        const d = res.data;
        setForm({
          name: d.name ?? "",
          slug: d.slug ?? "",
          tagline: d.tagline ?? "",
          short_description: d.short_description ?? "",
          overview: d.overview ?? "",
          scalability_info: d.scalability_info ?? "",
          security_info: d.security_info ?? "",
          demo_url: d.demo_url ?? "",
          price_model: d.price_model,
          price_min: d.price_min != null ? String(d.price_min) : "",
          price_max: d.price_max != null ? String(d.price_max) : "",
          status: d.status,
          is_featured: d.is_featured,
          sort_order: String(d.sort_order ?? 0),
          features: arrayToText(d.features),
          tech_stack: arrayToText(d.tech_stack),
          video_urls: arrayToText(d.video_urls),
          technical_details: jsonToText(d.technical_details),
          api_integrations: jsonToText(d.api_integrations),
        });
        setTagIds(d.software_tags.map((t) => t.tag_id));
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

    let body: SoftwareInput;
    try {
      body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        tagline: form.tagline.trim() || null,
        short_description: form.short_description.trim() || null,
        overview: form.overview.trim() || null,
        scalability_info: form.scalability_info.trim() || null,
        security_info: form.security_info.trim() || null,
        demo_url: form.demo_url.trim() || null,
        price_model: form.price_model,
        price_min: form.price_min ? Number(form.price_min) : null,
        price_max: form.price_max ? Number(form.price_max) : null,
        status: form.status,
        is_featured: form.is_featured,
        sort_order: Number(form.sort_order) || 0,
        features: textToArray(form.features),
        tech_stack: textToArray(form.tech_stack),
        video_urls: textToArray(form.video_urls),
        technical_details: parseJsonField("Detalles técnicos", form.technical_details),
        api_integrations: parseJsonField("Integraciones API", form.api_integrations),
        tag_ids: tagIds,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Datos inválidos.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateAdminSoftware(token, id, body);
      } else {
        await createAdminSoftware(token, body);
      }
      navigate("/admin/software");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B56D2]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageTitle title={isEdit ? "Admin · Editar software" : "Admin · Nuevo software"} />

      <Link
        to="/admin/software"
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 hover:text-[#1B56D2] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>

      <h1 className="text-4xl font-black tracking-tighter uppercase mb-8">
        {isEdit ? "Editar software" : "Nuevo software"}
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
              placeholder="mi-software"
            />
            <button
              type="button"
              onClick={() => setField("slug", slugify(form.name))}
              className="shrink-0 inline-flex items-center gap-2 px-4 rounded-xl dark:border-white/15 border-black/15 border text-xs font-bold tracking-widest uppercase text-zinc-500 hover:border-[#1B56D2] hover:text-[#1B56D2] transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              Generar
            </button>
          </div>
        </Field>

        <Field label="Tagline">
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => setField("tagline", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Descripción corta">
          <textarea
            rows={2}
            value={form.short_description}
            onChange={(e) => setField("short_description", e.target.value)}
            className={textareaClass}
          />
        </Field>

        <Field label="Overview">
          <textarea
            rows={4}
            value={form.overview}
            onChange={(e) => setField("overview", e.target.value)}
            className={textareaClass}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Escalabilidad">
            <textarea
              rows={3}
              value={form.scalability_info}
              onChange={(e) => setField("scalability_info", e.target.value)}
              className={textareaClass}
            />
          </Field>
          <Field label="Seguridad">
            <textarea
              rows={3}
              value={form.security_info}
              onChange={(e) => setField("security_info", e.target.value)}
              className={textareaClass}
            />
          </Field>
        </div>

        <Field label="Características" hint="Una por línea.">
          <textarea
            rows={4}
            value={form.features}
            onChange={(e) => setField("features", e.target.value)}
            className={textareaClass}
          />
        </Field>

        <Field label="Stack tecnológico" hint="Uno por línea.">
          <textarea
            rows={3}
            value={form.tech_stack}
            onChange={(e) => setField("tech_stack", e.target.value)}
            className={textareaClass}
          />
        </Field>

        <Field label="URLs de video" hint="Una por línea (embed de YouTube).">
          <textarea
            rows={2}
            value={form.video_urls}
            onChange={(e) => setField("video_urls", e.target.value)}
            className={textareaClass}
          />
        </Field>

        <Field label="Detalles técnicos" hint="JSON (objeto o array). Dejar vacío si no aplica.">
          <textarea
            rows={4}
            value={form.technical_details}
            onChange={(e) => setField("technical_details", e.target.value)}
            className={textareaClass + " font-mono text-xs"}
            placeholder='["..."]'
          />
        </Field>

        <Field label="Integraciones API" hint="JSON (objeto o array). Dejar vacío si no aplica.">
          <textarea
            rows={4}
            value={form.api_integrations}
            onChange={(e) => setField("api_integrations", e.target.value)}
            className={textareaClass + " font-mono text-xs"}
            placeholder='["..."]'
          />
        </Field>

        <Field label="URL de demo" hint="Debe ser una URL válida o vacío.">
          <input
            type="url"
            value={form.demo_url}
            onChange={(e) => setField("demo_url", e.target.value)}
            className={inputClass}
            placeholder="https://..."
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
              className="w-5 h-5 rounded accent-[#1B56D2]"
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
                        ? "bg-[#1B56D2] text-white border border-[#1B56D2]"
                        : "dark:border-white/20 border-black/20 border hover:border-[#1B56D2]"
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
            className="inline-flex items-center gap-3 px-6 h-12 rounded-full bg-[#1B56D2] text-white text-sm font-black tracking-widest uppercase hover:bg-[#E31E24] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Guardar cambios" : "Crear software"}
          </button>
          <Link
            to="/admin/software"
            className="inline-flex items-center px-6 h-12 rounded-full dark:border-white/15 border-black/15 border text-sm font-black tracking-widest uppercase text-zinc-500 hover:border-[#E31E24] hover:text-[#E31E24] transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

function parseJsonField(label: string, text: string): unknown {
  try {
    return textToJson(text);
  } catch {
    throw new Error(`${label}: JSON inválido.`);
  }
}
