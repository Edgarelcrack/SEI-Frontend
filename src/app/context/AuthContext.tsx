import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminLogin, adminLogout, adminMe, type AdminUser } from "../services/admin";

const TOKEN_KEY = "sei_admin_token";

interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  isAuthenticated: false,
  isSuperAdmin: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  });
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Revalida el token guardado al montar (no hay endpoint de refresh:
  // si expiró, adminMe devuelve 401 y limpiamos la sesión).
  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setLoading(false);
      return;
    }

    adminMe(token)
      .then((res) => {
        if (!cancelled) setUser(res.data);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // Solo en el montaje inicial: validar el token persistido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminLogin(email, password);
    const session = res.data;
    localStorage.setItem(TOKEN_KEY, session.access_token);
    setToken(session.access_token);
    // Recupera el perfil completo (is_active, created_at).
    const me = await adminMe(session.access_token);
    setUser(me.data);
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      await adminLogout(token).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        isSuperAdmin: user?.role === "super_admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
