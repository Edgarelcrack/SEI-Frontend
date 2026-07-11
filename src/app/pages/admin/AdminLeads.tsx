import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../components/PageTitle";
import { StatusBadge, formatDate } from "../../components/admin/AdminUI";
import {
  listAdminLeads,
  updateAdminLeadStatus,
  type AdminLead,
  type LeadStatus,
} from "../../services/admin";

const STATUS_FILTERS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "new", label: "Nuevos" },
  { value: "contacted", label: "Contactados" },
  { value: "closed", label: "Cerrados" },
];

export function AdminLeads() {
  const { token } = useAuth();
  const [items, setItems] = useState<AdminLead[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debounced, status]);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listAdminLeads(token, {
      status: status === "all" ? undefined : status,
      q: debounced || undefined,
      page,
      limit: 20,
    })
      .then((res) => {
        setItems(res.data);
        setTotal(res.total);
        setPages(res.pages);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar."))
      .finally(() => setLoading(false));
  }, [token, status, debounced, page]);

  useEffect(() => { load(); }, [load]);

  async function changeStatus(lead: AdminLead, next: LeadStatus) {
    if (!token || next === lead.status) return;
    setUpdatingId(lead.id);
    try {
      await updateAdminLeadStatus(token, lead.id, next);
      setItems((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status: next } : l)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <PageTitle title="Admin · Leads" />

      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Leads</h1>
        <p className="text-sm text-zinc-500 mt-1">{total} solicitudes de contacto</p>
      </header>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatus(f.value)}
              className={`px-4 h-10 rounded-full text-xs font-black tracking-widest uppercase transition-colors ${
                status === f.value
                  ? "bg-[#1B56D2] text-white"
                  : "dark:border-white/15 border-black/15 border text-zinc-500 hover:border-[#1B56D2]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full h-10 pl-11 pr-4 rounded-full dark:bg-black bg-white dark:border-white/15 border-black/15 border text-sm focus:outline-none focus:border-[#1B56D2] transition-colors"
          />
        </div>
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
          <p className="py-24 text-center text-sm text-zinc-500">No hay leads.</p>
        ) : (
          <ul className="divide-y dark:divide-white/5 divide-black/5">
            {items.map((lead) => {
              const open = expanded === lead.id;
              return (
                <li key={lead.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : lead.id)}
                      className="flex items-center gap-3 min-w-0 text-left flex-1"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                      <div className="min-w-0">
                        <p className="font-bold truncate">{lead.name}</p>
                        <p className="text-xs text-zinc-500 truncate">
                          {lead.email}
                          {lead.company ? ` · ${lead.company}` : ""}
                        </p>
                      </div>
                    </button>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-zinc-500 hidden md:block">
                        {formatDate(lead.created_at)}
                      </span>
                      <StatusBadge status={lead.status} />
                    </div>
                  </div>

                  {open && (
                    <div className="mt-4 ml-7 pl-4 dark:border-white/10 border-black/10 border-l space-y-4">
                      {lead.service_type && (
                        <p className="text-xs">
                          <span className="font-black tracking-widest uppercase text-zinc-500">Servicio: </span>
                          {lead.service_type}
                        </p>
                      )}
                      <p className="text-sm dark:text-zinc-300 text-zinc-700 leading-relaxed whitespace-pre-wrap">
                        {lead.message}
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-[11px] font-black tracking-widest uppercase text-zinc-500">
                          Cambiar estado:
                        </span>
                        {(["new", "contacted", "closed"] as LeadStatus[]).map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={updatingId === lead.id || lead.status === s}
                            onClick={() => changeStatus(lead, s)}
                            className={`px-3 h-8 rounded-full text-[10px] font-black tracking-widest uppercase transition-colors disabled:opacity-100 ${
                              lead.status === s
                                ? "bg-[#1B56D2] text-white"
                                : "dark:border-white/15 border-black/15 border text-zinc-500 hover:border-[#1B56D2] disabled:opacity-40"
                            }`}
                          >
                            {s === "new" ? "Nuevo" : s === "contacted" ? "Contactado" : "Cerrado"}
                          </button>
                        ))}
                        {updatingId === lead.id && (
                          <Loader2 className="w-4 h-4 animate-spin text-[#1B56D2]" />
                        )}
                      </div>
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-block text-xs font-bold tracking-widest uppercase text-[#1B56D2] hover:opacity-70"
                      >
                        Responder por correo →
                      </a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
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
