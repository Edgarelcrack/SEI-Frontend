import { useState } from "react";
import { NavLink, Outlet, Navigate, Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  Cpu,
  Tags,
  Inbox,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import logoUrl from "../../../imports/Logo-SEI-250px.png";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/software", label: "Software", icon: Package, end: false },
  { to: "/admin/hardware", label: "Hardware", icon: Cpu, end: false },
  { to: "/admin/tags", label: "Etiquetas", icon: Tags, end: false },
  { to: "/admin/leads", label: "Leads", icon: Inbox, end: false },
];

export function AdminLayout() {
  const { isAuthenticated, loading, isSuperAdmin, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-10 h-10 rounded-full border-2 border-[#1B56D2] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const nav = isSuperAdmin
    ? [...NAV, { to: "/admin/users", label: "Usuarios", icon: Users, end: false }]
    : NAV;

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 h-20 dark:border-white/10 border-black/10 border-b shrink-0">
        <img src={logoUrl} alt="SEI" className="h-8 w-auto object-contain" />
        <span className="text-xs font-black tracking-widest uppercase text-zinc-500">
          Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 h-12 rounded-xl text-sm font-bold tracking-wide transition-colors ${
                  isActive
                    ? "bg-[#1B56D2] text-white"
                    : "dark:text-zinc-400 text-zinc-600 dark:hover:bg-white/5 hover:bg-black/5"
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 dark:border-white/10 border-black/10 border-t space-y-1 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold tracking-wide dark:text-zinc-400 text-zinc-600 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Ver sitio
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold tracking-wide dark:text-zinc-400 text-zinc-600 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Modo claro" : "Modo oscuro"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-sm font-bold tracking-wide text-[#E31E24] hover:bg-[#E31E24]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
        {user?.email && (
          <p className="px-4 pt-2 text-[11px] text-zinc-500 truncate">{user.email}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 dark:border-white/10 border-black/10 border-r dark:bg-[#0a0a0a] bg-zinc-50 fixed inset-y-0 left-0">
        {sidebar}
      </aside>

      {/* Sidebar móvil */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 dark:bg-[#0a0a0a] bg-white dark:border-white/10 border-black/10 border-r lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      {/* Contenido */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Topbar móvil */}
        <div className="lg:hidden flex items-center justify-between px-4 h-16 dark:border-white/10 border-black/10 border-b dark:bg-[#0a0a0a] bg-white sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 dark:text-zinc-300 text-zinc-700"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img src={logoUrl} alt="SEI" className="h-7 w-auto object-contain" />
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-[#E31E24]"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <main className="p-6 lg:p-10 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Cierre del sidebar móvil con X flotante */}
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/60 text-white lg:hidden"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
