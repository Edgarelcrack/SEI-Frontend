import { Link } from "react-router";
import { Home, Search } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <Search className="h-20 w-20 mx-auto text-gray-300 mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
          <p className="text-gray-600">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>

        <Button asChild size="lg">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Volver al Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
