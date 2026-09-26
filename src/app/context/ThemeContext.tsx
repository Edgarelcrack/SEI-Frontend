import { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "sei-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
});

/**
 * Elección explícita del usuario. `null` significa que todavía no ha tocado el
 * interruptor, así que el tema lo sigue mandando el navegador / sistema.
 */
function storedTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    /* modo privado o storage bloqueado: se cae al preferido del navegador */
    return null;
  }
}

function prefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia(DARK_QUERY).matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = storedTheme();
    return saved ? saved === "dark" : prefersDark();
  });

  // Mientras no haya elección guardada, seguimos en vivo al sistema operativo
  // (cambio automático día/noche, ajuste manual del tema en el SO, etc.).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia(DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (storedTheme() === null) setIsDark(event.matches);
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Solo se persiste al pulsar el interruptor: guardar en el montaje dejaría
  // congelada la preferencia y el navegador nunca volvería a mandar.
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* sin storage la elección solo dura la sesión */
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
