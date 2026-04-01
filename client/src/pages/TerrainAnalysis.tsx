import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, BarChart3, MapPin, Droplets, Wind } from "lucide-react";

interface MeasurementTool {
  type: "area" | "distance" | "polygon";
  points: Array<{ x: number; y: number }>;
  result?: number;
}

export default function TerrainAnalysis() {
  const [, params] = useLocation();
  const projectId = parseInt((params as any)?.id || "0");
  const [measurements, setMeasurements] = useState<MeasurementTool[]>([]);
  const [activeTool, setActiveTool] = useState<"area" | "distance" | null>(
    null
  );
  const [analysisData, setAnalysisData] = useState<any>(null);

  const { data: project, isLoading: projectLoading } =
    trpc.projects.getById.useQuery(
      { projectId },
      { enabled: projectId > 0 }
    );

  const { data: terrainData, isLoading: terrainLoading } =
    trpc.terrainAnalysis.getByProject.useQuery(
      { projectId },
      { enabled: projectId > 0 }
    );

  const calculateArea = (points: Array<{ x: number; y: number }>) => {
    if (points.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const handleMeasurementClick = (tool: "area" | "distance") => {
    setActiveTool(activeTool === tool ? null : tool);
    setMeasurements([]);
  };

  const handleAnalyzeWavespeed = async () => {
    // TODO: Integrate with Wavespeed API
    const mockAnalysis = {
      soilType: "Loamy soil with good drainage",
      slope: "5-8 degrees",
      sunExposure: "6-8 hours direct sunlight",
      moisture: "Moderate",
      pH: "6.5-7.0",
      confidence: 0.85,
    };
    setAnalysisData(mockAnalysis);
  };

  if (projectLoading || terrainLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Análisis de Terreno
          </h1>
          <p className="text-gray-600">
            {project?.name} - Mediciones y análisis del sitio
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel - Tools */}
          <div className="col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Herramientas de Medición</h2>

              <div className="space-y-3 mb-6">
                <Button
                  onClick={() => handleMeasurementClick("area")}
                  variant={activeTool === "area" ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Medir Área
                </Button>
                <Button
                  onClick={() => handleMeasurementClick("distance")}
                  variant={activeTool === "distance" ? "default" : "outline"}
                  className="w-full justify-start"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Medir Distancia
                </Button>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Análisis Avanzado</h3>
                <Button
                  onClick={handleAnalyzeWavespeed}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Analizar con Wavespeed
                </Button>
              </div>

              {/* Measurements List */}
              {measurements.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold mb-3">Mediciones</h3>
                  <div className="space-y-2">
                    {measurements.map((m, i) => (
                      <div
                        key={i}
                        className="p-3 bg-gray-100 rounded text-sm"
                      >
                        <p className="font-semibold">
                          {m.type === "area" ? "Área" : "Distancia"} {i + 1}
                        </p>
                        {m.result && (
                          <p className="text-green-600 font-bold">
                            {m.result.toFixed(2)} {m.type === "area" ? "ft²" : "ft"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="col-span-2">
            {/* Terrain Data */}
            {terrainData && terrainData.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Datos de Terreno Existentes</h2>
                <div className="space-y-3">
                  {terrainData.map((analysis: any) => (
                    <div
                      key={analysis.id}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p className="font-semibold text-blue-900">
                        {analysis.analysisType}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Fuente: {analysis.source}
                      </p>
                      {analysis.confidence && (
                        <p className="text-xs text-blue-600 mt-1">
                          Confianza: {(analysis.confidence * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Wavespeed Analysis Results */}
            {analysisData && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
                <h2 className="text-xl font-bold mb-4">Análisis de Wavespeed</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      <p className="font-semibold">Tipo de Suelo</p>
                    </div>
                    <p className="text-gray-700">{analysisData.soilType}</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-amber-600" />
                      <p className="font-semibold">Pendiente</p>
                    </div>
                    <p className="text-gray-700">{analysisData.slope}</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-yellow-600" />
                      <p className="font-semibold">Exposición Solar</p>
                    </div>
                    <p className="text-gray-700">{analysisData.sunExposure}</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-cyan-600" />
                      <p className="font-semibold">Humedad</p>
                    </div>
                    <p className="text-gray-700">{analysisData.moisture}</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-semibold mb-2">pH del Suelo</p>
                    <p className="text-gray-700">{analysisData.pH}</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-semibold mb-2">Confianza del Análisis</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${analysisData.confidence * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold">
                        {(analysisData.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {!analysisData && (
              <Card className="p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Ejecuta un análisis de Wavespeed para ver los datos del terreno
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
