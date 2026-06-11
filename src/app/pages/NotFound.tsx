import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Magnetic } from "../components/Magnetic";
import { PageTitle } from "../components/PageTitle";

export function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
      <PageTitle
        title="Página no encontrada"
        description="Error 404: la ruta que buscas no existe o fue movida."
      />

      <div className="text-center max-w-3xl relative">
        <div className="font-mono text-xs tracking-[0.35em] uppercase text-[#E31E24] mb-6">
          Error_404 // Ruta no encontrada
        </div>

        <div
          className="relative select-none leading-[0.8] font-black tracking-tighter mb-10"
          role="img"
          aria-label="404"
        >
          <span className="block text-[36vw] sm:text-[22vw] lg:text-[16rem] dark:text-white text-zinc-900">
            404
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 text-[36vw] sm:text-[22vw] lg:text-[16rem] text-[#1B56D2] animate-glitch-a motion-reduce:animate-none"
          >
            404
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 text-[36vw] sm:text-[22vw] lg:text-[16rem] text-[#E31E24] animate-glitch-b motion-reduce:animate-none"
          >
            404
          </span>
        </div>

        <p className="text-xl md:text-2xl text-zinc-500 font-light leading-relaxed max-w-xl mx-auto mb-12">
          La página que buscas no existe, fue movida o nunca se desplegó a producción.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Magnetic strength={0.4}>
            <Link
              to="/"
              className="group flex items-center gap-3 h-16 px-10 rounded-full bg-[#1B56D2] text-white text-sm font-black tracking-widest uppercase hover:bg-[#E31E24] transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Volver al inicio
            </Link>
          </Magnetic>

          <Link
            to="/platforms"
            className="group flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-zinc-500 hover:text-[#1B56D2] transition-colors"
          >
            Ver plataformas
            <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
