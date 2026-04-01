import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Download, FileText, List } from "lucide-react";

export default function ExportDesign() {
  const [, params] = useLocation();
  const projectId = parseInt((params as any)?.id || "0");
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const { data: project, isLoading: projectLoading } =
    trpc.projects.getById.useQuery(
      { projectId },
      { enabled: projectId > 0 }
    );

  const { data: materialEstimates, isLoading: estimatesLoading } =
    trpc.materialEstimates.getByProject.useQuery(
      { projectId },
      { enabled: projectId > 0 }
    );

  const { data: inventory } = trpc.inventory.list.useQuery();

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (exportFormat === "pdf") {
        // TODO: Implement PDF export using jsPDF or similar
        console.log("Exporting to PDF...");
      } else {
        // TODO: Implement CSV export
        console.log("Exporting to CSV...");
      }

      // Simulate export delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsExporting(false);
    }
  };

  const totalCost = materialEstimates?.reduce(
    (sum, item) => sum + parseFloat(item.totalCost.toString()),
    0
  ) || 0;

  if (projectLoading || estimatesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exportar Diseño
          </h1>
          <p className="text-gray-600">
            {project?.name} - Genera reportes y listas de materiales
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Export Options */}
          <div className="col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Opciones de Exportación</h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="pdf"
                    checked={exportFormat === "pdf"}
                    onChange={(e) =>
                      setExportFormat(e.target.value as "pdf" | "csv")
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">PDF Profesional</p>
                    <p className="text-xs text-gray-600">
                      Reporte completo con diseño
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    value="csv"
                    checked={exportFormat === "csv"}
                    onChange={(e) =>
                      setExportFormat(e.target.value as "pdf" | "csv")
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">CSV (Excel)</p>
                    <p className="text-xs text-gray-600">
                      Lista de materiales editable
                    </p>
                  </div>
                </label>
              </div>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Material Estimates */}
          <div className="col-span-2">
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <List className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold">Lista de Materiales</h2>
              </div>

              {materialEstimates && materialEstimates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Material
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Cantidad
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Precio Unit.
                        </th>
                        <th className="px-4 py-2 text-right font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialEstimates.map((estimate) => {
                        const item = inventory?.find(
                          (i) => i.id === estimate.inventoryId
                        );
                        return (
                          <tr
                            key={estimate.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3">{item?.name}</td>
                            <td className="px-4 py-3">
                              {estimate.estimatedQuantity} {item?.unit}
                            </td>
                            <td className="px-4 py-3">
                              ${estimate.unitCost}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-green-600">
                              ${estimate.totalCost}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay estimaciones de materiales aún
                </p>
              )}
            </Card>

            {/* Summary */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Artículos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {materialEstimates?.length || 0}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Área Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {project?.totalArea || "N/A"} ft²
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border-2 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">Costo Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
