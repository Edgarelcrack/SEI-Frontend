import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";
import { useTheme } from "../context/ThemeContext";

export function Root() {
  const { isDark } = useTheme();
  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background text-foreground flex flex-col selection:bg-[#1B56D2] selection:text-white font-sans transition-colors duration-300`}>
      <ScrollToTop />
      <Header />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
