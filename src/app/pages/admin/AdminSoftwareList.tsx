import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Pencil, Trash2, Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../components/PageTitle";
import { StatusBadge } from "../../components/admin/AdminUI";
import { formatPrice } from "../../services/api";
import {
  listAdminSoftware,
  deleteAdminSoftware,
  type AdminSoftwareListItem,
} from "../../services/admin";

export function AdminSoftwareList() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminSoftwareListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listAdminSoftware(token, { q: debounced || undefined, page, limit: 20 })
      .then((res) => {
        setItems(res.data);
        setTotal(res.total);
        setPages(res.pages);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar."))
      .finally(() => setLoading(false));
  }, [token, debounced, page]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(item: AdminSoftwareListItem) {
    if (!token) return;
    if (!window.confirm(`¿Eliminar "${item.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(item.id);
    try {
      await deleteAdminSoftware(token, item.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <PageTitle title="Admin · Software" />

      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Software</h1>
          <p className="text-sm text-zinc-500 mt-1">{total} registros</p>
        </div>
        <Link
          to="/admin/software/new"
          className="inline-flex items-center gap-2 px-5 h-12 rounded-full bg-[#1B56D2] text-white text-sm font-black tracking-widest uppercase hover:bg-[#E31E24] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </Link>
      </header>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full h-11 pl-11 pr-4 rounded-full dark:bg-black bg-white dark:border-white/15 border-black/15 border text-sm focus:outline-none focus:border-[#1B56D2] transition-colors"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-[#E31E24]/30 bg-[#E31E24]/10 text-[#E31E24] text-sm font-bold">
          {error}
        </div>
      )}

      <div className="rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#1B56D2]" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-24 text-center text-sm text-zinc-500">No hay registros.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="dark:border-white/10 border-black/10 border-b text-left">
                  <th className="px-6 py-4 text-[11px] font-black tracking-widest uppercase text-zinc-500">Nombre</th>
                  <th className="px-6 py-4 text-[11px] font-black tracking-widest uppercase text-zinc-500">Estado</th>
                  <th className="px-6 py-4 text-[11px] font-black tracking-widest uppercase text-zinc-500 hidden md:table-cell">Precio</th>
                  <th className="px-6 py-4 text-[11px] font-black tracking-widest uppercase text-zinc-500 hidden lg:table-cell">Vistas</th>
                  <th className="px-6 py-4 text-[11px] font-black tracking-widest uppercase text-zinc-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-white/5 divide-black/5">
                {items.map((item) => (
                  <tr key={item.id} className="dark:hover:bg-white/[0.02] hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.is_featured && <Star className="w-4 h-4 text-[#1B56D2] fill-[#1B56D2]" />}
                        <div className="min-w-0">
                          <p className="font-bold truncate">{item.name}</p>
                          <p className="text-xs text-zinc-500 truncate">/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                    <td className="px-6 py-4 hidden md:table-cell text-zinc-500">
                      {formatPrice(item.price_model, item.price_min, item.price_max)}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-zinc-500">{item.view_count}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/software/${item.id}`}
                          className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 text-zinc-500 hover:text-[#1B56D2] transition-colors"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 text-zinc-500 hover:text-[#E31E24] transition-colors disabled:opacity-50"
                          aria-label="Eliminar"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-full dark:border-white/15 border-black/15 border disabled:opacity-40 hover:border-[#1B56D2] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-widest uppercase text-zinc-500">
            {page} / {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
            className="p-2 rounded-full dark:border-white/15 border-black/15 border disabled:opacity-40 hover:border-[#1B56D2] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
