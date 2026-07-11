import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { Loader2, Plus, Trash2, ShieldCheck, ShieldOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../components/PageTitle";
import { Field, inputClass, selectClass, formatDate } from "../../components/admin/AdminUI";
import {
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  type AdminUserFull,
  type AdminRole,
} from "../../services/admin";

export function AdminUsers() {
  const { token, user, isSuperAdmin, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<AdminUserFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    listAdminUsers(token)
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar."))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (isSuperAdmin) load();
  }, [isSuperAdmin, load]);

  if (!authLoading && !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setCreating(true);
    setError(null);
    try {
      await createAdminUser(token, { email: email.trim(), password, role });
      setEmail("");
      setPassword("");
      setRole("admin");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el usuario.");
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(u: AdminUserFull) {
    if (!token) return;
    setBusyId(u.id);
    setError(null);
    try {
      await updateAdminUser(token, u.id, { is_active: !u.is_active });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setBusyId(null);
    }
  }

  async function changeRole(u: AdminUserFull, next: AdminRole) {
    if (!token || u.role === next) return;
    setBusyId(u.id);
    setError(null);
    try {
      await updateAdminUser(token, u.id, { role: next });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(u: AdminUserFull) {
    if (!token) return;
    if (!window.confirm(`¿Eliminar al usuario ${u.email}? Esta acción es irreversible.`)) return;
    setBusyId(u.id);
    setError(null);
    try {
      await deleteAdminUser(token, u.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-3xl">
      <PageTitle title="Admin · Usuarios" />

      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Usuarios</h1>
        <p className="text-sm text-zinc-500 mt-1">{users.length} cuentas administrativas</p>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-2xl border border-[#E31E24]/30 bg-[#E31E24]/10 text-[#E31E24] text-sm font-bold">
          {error}
        </div>
      )}

      {/* Crear usuario */}
      <form
        onSubmit={handleCreate}
        className="mb-10 p-6 rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50"
      >
        <h2 className="text-sm font-black tracking-widest uppercase mb-5">Nueva cuenta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Correo">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Contraseña" hint="Mínimo 8 caracteres.">
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Rol">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className={selectClass}
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </select>
          </Field>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="mt-5 inline-flex items-center gap-2 px-5 h-11 rounded-full bg-[#1B56D2] text-white text-sm font-black tracking-widest uppercase hover:bg-[#E31E24] transition-colors disabled:opacity-60"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Crear usuario
        </button>
      </form>

      {/* Lista */}
      <div className="rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-[#1B56D2]" />
          </div>
        ) : (
          <ul className="divide-y dark:divide-white/5 divide-black/5">
            {users.map((u) => {
              const isSelf = u.id === user?.id;
              const busy = busyId === u.id;
              return (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="font-bold truncate">
                      {u.email ?? "—"}
                      {isSelf && <span className="ml-2 text-[10px] text-zinc-500">(tú)</span>}
                    </p>
                    <p className="text-xs text-zinc-500">Creado {formatDate(u.created_at)}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={u.role}
                      disabled={busy || isSelf}
                      onChange={(e) => changeRole(u, e.target.value as AdminRole)}
                      className="h-9 px-3 rounded-lg dark:bg-black bg-white dark:border-white/15 border-black/15 border text-xs font-bold disabled:opacity-50"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super admin</option>
                    </select>

                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase ${
                        u.is_active
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : "bg-zinc-500/10 text-zinc-500 border-zinc-500/30"
                      }`}
                    >
                      {u.is_active ? "Activo" : "Inactivo"}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleActive(u)}
                      disabled={busy || isSelf}
                      className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 text-zinc-500 hover:text-[#1B56D2] transition-colors disabled:opacity-40"
                      aria-label={u.is_active ? "Desactivar" : "Activar"}
                    >
                      {u.is_active ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(u)}
                      disabled={busy || isSelf}
                      className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10 text-zinc-500 hover:text-[#E31E24] transition-colors disabled:opacity-40"
                      aria-label="Eliminar"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
