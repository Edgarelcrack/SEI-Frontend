import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { Preloader } from "./components/Preloader";

function shouldSkipPreloader(): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (sessionStorage.getItem("sei-preloader-shown") === "1") return true;
  } catch {
    /* sin sessionStorage, el preloader se muestra siempre */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const [skip] = useState(shouldSkipPreloader);
  const [appReady, setAppReady] = useState(skip);
  const [preloaderDone, setPreloaderDone] = useState(skip);

  return (
    <ThemeProvider>
      {appReady && <RouterProvider router={router} />}
      {!preloaderDone && (
        <Preloader
          onReveal={() => setAppReady(true)}
          onComplete={() => setPreloaderDone(true)}
        />
      )}
    </ThemeProvider>
  );
}
