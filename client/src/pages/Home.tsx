import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Leaf, Palette, BarChart3, Map, Download } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">Landscaping Pro</span>
          </div>
          <div className="flex gap-4 items-center">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Bienvenido, {user?.name}</span>
                <Button
                  onClick={() => setLocation("/projects")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mis Proyectos
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-green-600 hover:bg-green-700"
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Diseña Espacios Verdes
          <span className="block text-green-600">con Precisión Profesional</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Herramienta completa de diseño de paisajismo con análisis de terreno,
          gestión de inventario y cálculo automático de materiales.
        </p>
        {isAuthenticated ? (
          <Button
            onClick={() => setLocation("/projects")}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
          >
            Comenzar Nuevo Proyecto
          </Button>
        ) : (
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
          >
            Comenzar Ahora
          </Button>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Características Principales
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition">
              <Palette className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Canvas Interactivo
              </h3>
              <p className="text-gray-700">
                Diseña espacios verdes con un editor visual intuitivo y herramientas
                profesionales de manipulación de elementos.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition">
              <Map className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Análisis de Terreno
              </h3>
              <p className="text-gray-700">
                Detecta características del terreno, mide áreas y dimensiones con
                precisión profesional.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition">
              <Leaf className="w-12 h-12 text-amber-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inventario Completo
              </h3>
              <p className="text-gray-700">
                Gestiona plantas, materiales y elementos con especificaciones
                detalladas y precios actualizados.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition">
              <BarChart3 className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Cálculo Automático
              </h3>
              <p className="text-gray-700">
                Calcula automáticamente cantidades de materiales y costos basado
                en tu diseño.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition">
              <Download className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Exportación PDF
              </h3>
              <p className="text-gray-700">
                Exporta tus diseños y listas de materiales en PDF profesional para
                presentaciones.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition">
              <Leaf className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Galería de Proyectos
              </h3>
              <p className="text-gray-700">
                Guarda y organiza todos tus proyectos con vistas previas y
                acceso rápido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para transformar espacios?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Únete a profesionales del paisajismo que ya usan Landscaping Pro
          </p>
          {isAuthenticated ? (
            <Button
              onClick={() => setLocation("/projects")}
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 font-bold"
            >
              Acceder a Mis Proyectos
            </Button>
          ) : (
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 font-bold"
            >
              Comenzar Gratis
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 Landscaping Pro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
