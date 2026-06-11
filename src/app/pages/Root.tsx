import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { ScrollProgress } from "../components/ScrollProgress";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { CustomCursor } from "../components/CustomCursor";
import { useTheme } from "../context/ThemeContext";

export function Root() {
  const { isDark } = useTheme();
  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background text-foreground flex flex-col selection:bg-[#1B56D2] selection:text-white font-sans transition-colors duration-300`}>
      <ScrollProgress />
      <Header />
      <main className="flex-1 relative">
        <PageTransition />
      </main>
      <Footer />
      <WhatsAppButton />
      <CustomCursor />
    </div>
  );
}
