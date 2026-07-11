import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Package, Cpu, Tags, Inbox, ArrowUpRight, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../components/PageTitle";
import { StatusBadge, formatDate } from "../../components/admin/AdminUI";
import {
  listAdminSoftware,
  listAdminHardware,
  listAdminTags,
  listAdminLeads,
  type AdminLead,
} from "../../services/admin";

interface Metrics {
  software: number;
  hardware: number;
  tags: number;
  leads: number;
  leadsNew: number;
  recentLeads: AdminLead[];
}

export function AdminDashboard() {
  const { token, user } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);

    Promise.all([
      listAdminSoftware(token, { limit: 1 }),
      listAdminHardware(token, { limit: 1 }),
      listAdminTags(token),
      listAdminLeads(token, { limit: 5 }),
      listAdminLeads(token, { status: "new", limit: 1 }),
    ])
      .then(([sw, hw, tags, leads, leadsNew]) => {
        if (cancelled) return;
        setMetrics({
          software: sw.total,
          hardware: hw.total,
          tags: tags.data.length,
          leads: leads.total,
          leadsNew: leadsNew.total,
          recentLeads: leads.data,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar métricas.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [token]);

  const cards = [
    { label: "Software", value: metrics?.software, to: "/admin/software", icon: Package, color: "#1B56D2" },
    { label: "Hardware", value: metrics?.hardware, to: "/admin/hardware", icon: Cpu, color: "#E31E24" },
    { label: "Etiquetas", value: metrics?.tags, to: "/admin/tags", icon: Tags, color: "#1B56D2" },
    { label: "Leads", value: metrics?.leads, to: "/admin/leads", icon: Inbox, color: "#E31E24" },
  ];

  return (
    <div>
      <PageTitle title="Admin · Dashboard" />

      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-2">
          Bienvenido{user?.email ? `, ${user.email}` : ""}. Resumen general del catálogo.
        </p>
      </header>

      {error && (
        <div className="mb-8 p-4 rounded-2xl border border-[#E31E24]/30 bg-[#E31E24]/10 text-[#E31E24] text-sm font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#1B56D2]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.label}
                  to={card.to}
                  className="group p-6 rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50 hover:border-[#1B56D2]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                    <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-[#1B56D2] transition-colors" />
                  </div>
                  <div className="text-4xl font-black tracking-tighter">{card.value ?? 0}</div>
                  <div className="text-xs font-bold tracking-widest uppercase text-zinc-500 mt-1">
                    {card.label}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 dark:border-white/10 border-black/10 border-b">
              <h2 className="text-sm font-black tracking-widest uppercase">
                Leads recientes
                {metrics && metrics.leadsNew > 0 && (
                  <span className="ml-3 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-[#E31E24] text-white text-xs">
                    {metrics.leadsNew} nuevos
                  </span>
                )}
              </h2>
              <Link
                to="/admin/leads"
                className="text-xs font-bold tracking-widest uppercase text-[#1B56D2] hover:opacity-70"
              >
                Ver todos
              </Link>
            </div>

            {metrics && metrics.recentLeads.length > 0 ? (
              <ul className="divide-y dark:divide-white/5 divide-black/5">
                {metrics.recentLeads.map((lead) => (
                  <li key={lead.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{lead.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{lead.email}</p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-zinc-500 hidden sm:block">
                        {formatDate(lead.created_at)}
                      </span>
                      <StatusBadge status={lead.status} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-10 text-center text-sm text-zinc-500">
                Aún no hay leads registrados.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
