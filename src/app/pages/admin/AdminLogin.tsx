import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageTitle } from "../../components/PageTitle";
import { Field, inputClass } from "../../components/admin/AdminUI";

export function AdminLogin() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 font-sans">
      <PageTitle title="Admin · Iniciar sesión" />

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1B56D2] flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Panel de administración</h1>
          <p className="text-sm text-zinc-500 mt-2">Acceso restringido a personal autorizado.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-8 rounded-3xl dark:border-white/10 border-black/10 border dark:bg-[#0a0a0a] bg-zinc-50"
        >
          <Field label="Correo electrónico">
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@sei.com"
            />
          </Field>

          <Field label="Contraseña">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="text-sm font-bold text-[#E31E24] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-3 w-full h-12 rounded-full bg-[#1B56D2] text-white font-black tracking-widest uppercase text-sm hover:bg-[#E31E24] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
