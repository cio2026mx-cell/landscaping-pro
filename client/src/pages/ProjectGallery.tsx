import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProjectGallery() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [newProjectName, setNewProjectName] = useState("");

  const { data: projects, isLoading } = trpc.projects.list.useQuery();
  const createProjectMutation = trpc.projects.create.useMutation();

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      await createProjectMutation.mutateAsync({
        name: newProjectName,
        description: "",
      });
      setNewProjectName("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mis Proyectos de Paisajismo
          </h1>
          <p className="text-gray-600">
            Crea y gestiona tus diseños de espacios verdes
          </p>
        </div>

        {/* Create New Project */}
        <Card className="p-6 mb-8 bg-white shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Nuevo Proyecto</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nombre del proyecto..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateProject()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending || !newProjectName.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear
            </Button>
          </div>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card
              key={project.id}
              className="bg-white shadow-lg hover:shadow-xl transition overflow-hidden cursor-pointer group"
              onClick={() => setLocation(`/design/${project.id}`)}
            >
              {/* Thumbnail */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center group-hover:from-green-200 group-hover:to-blue-200 transition">
                {project.thumbnailUrl ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌿</div>
                    <p className="text-gray-500 text-sm">Sin vista previa</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {project.description || "Sin descripción"}
                </p>

                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      project.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {project.status === "draft"
                      ? "Borrador"
                      : project.status === "in_progress"
                        ? "En Progreso"
                        : project.status === "completed"
                          ? "Completado"
                          : "Archivado"}
                  </span>
                  {project.totalArea && (
                    <span className="text-xs text-gray-600">
                      {project.totalArea} ft²
                    </span>
                  )}
                </div>

                {/* Cost */}
                {project.estimatedCost && (
                  <p className="text-sm font-semibold text-green-600 mb-4">
                    Costo estimado: ${project.estimatedCost}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/design/${project.id}`);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement delete
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {(!projects || projects.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay proyectos aún. ¡Crea tu primer proyecto de paisajismo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
