import { Link, useLocation } from "react-router";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import logoUrl from "../../imports/Logo-SEI-250px.png";

export function Header() {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = window.scrollY > 50;
    setScrolled(lastScrolled);

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const next = window.scrollY > 50;
        if (next !== lastScrolled) {
          lastScrolled = next;
          setScrolled(next);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "INICIO", path: "/" },
    { name: "PLATAFORMAS", path: "/platforms" },
    { name: "SERVICIOS", path: "/services" }
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
      <motion.div
        layout
        className={`pointer-events-auto w-full max-w-5xl flex items-center justify-between px-6 py-4 rounded-full border transition-all duration-500 ease-out ${
          scrolled
            ? "dark:bg-black/80 bg-white/90 backdrop-blur-xl shadow-2xl dark:border-white/10 border-black/10"
            : "bg-transparent border-transparent"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoUrl}
            alt="SEI Logo"
            className="h-8 md:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative text-xs font-bold tracking-widest uppercase overflow-hidden group"
            >
              <span className={`transition-colors duration-300 ${
                isActive(item.path)
                  ? "text-[#1B56D2]"
                  : "dark:text-zinc-400 text-zinc-500 hover:text-[#1B56D2]"
              }`}>
                {item.name}
              </span>
              {isActive(item.path) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#1B56D2]"
                />
              )}
            </Link>
          ))}

          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.85 }}
            className="p-2.5 rounded-full border dark:border-white/20 border-black/20 dark:text-zinc-400 text-zinc-500 hover:border-[#1B56D2] hover:text-[#1B56D2] transition-all duration-300"
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <Link
            to="/services#contacto"
            className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-[#1B56D2] text-white px-6 py-3 rounded-full hover:bg-[#E31E24] transition-colors duration-300"
          >
            HABLEMOS
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </Link>
        </nav>

        {/* Mobile right side: theme toggle + menu */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.85 }}
            className="p-2 dark:text-zinc-400 text-zinc-500 hover:text-[#1B56D2] transition-colors"
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "sun-m" : "moon-m"}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          <button
            className="p-2 dark:text-zinc-300 text-zinc-600 hover:text-[#1B56D2] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-24 left-4 right-4 pointer-events-auto z-40 dark:bg-[#0a0a0a] bg-white dark:border-white/10 border-black/10 border rounded-3xl p-6 shadow-2xl md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-bold tracking-tighter uppercase ${
                    isActive(item.path) ? "text-[#1B56D2]" : "dark:text-white text-zinc-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px w-full dark:bg-white/10 bg-black/10 my-2" />
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-lg font-bold tracking-widest uppercase bg-[#1B56D2] text-white px-6 py-4 rounded-2xl"
              >
                LET'S TALK
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
