import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Loader2, Plus, Trash2, ZoomIn, ZoomOut } from "lucide-react";

interface CanvasElement {
  id: string;
  inventoryId: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  selected: boolean;
}

export default function DesignCanvas() {
  const [, params] = useLocation();
  const projectId = parseInt((params as any)?.id || "0");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const { data: project, isLoading: projectLoading } = trpc.projects.getById.useQuery(
    { projectId },
    { enabled: projectId > 0 }
  );

  const { data: projectElements, isLoading: elementsLoading } = trpc.projectElements.getByProject.useQuery(
    { projectId },
    { enabled: projectId > 0 }
  );

  const { data: inventory } = trpc.inventory.list.useQuery();

  useEffect(() => {
    if (projectElements) {
      setElements(
        projectElements.map((el) => ({
          id: el.id.toString(),
          inventoryId: el.inventoryId,
          x: parseFloat(el.positionX.toString()),
          y: parseFloat(el.positionY.toString()),
          rotation: parseFloat(el.rotation?.toString() || "0"),
          scale: parseFloat(el.scale?.toString() || "1"),
          selected: false,
        }))
      );
    }
  }, [projectElements]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    const gridSize = 20 * zoom;
    for (let x = panX % gridSize; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = panY % gridSize; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw elements
    elements.forEach((el) => {
      const screenX = el.x * zoom + panX;
      const screenY = el.y * zoom + panY;
      const size = 40 * el.scale * zoom;

      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate((el.rotation * Math.PI) / 180);

      // Draw element
      if (el.selected) {
        ctx.fillStyle = "#3b82f6";
      } else {
        ctx.fillStyle = "#10b981";
      }
      ctx.fillRect(-size / 2, -size / 2, size, size);

      // Draw border
      ctx.strokeStyle = el.selected ? "#1e40af" : "#059669";
      ctx.lineWidth = 2;
      ctx.strokeRect(-size / 2, -size / 2, size, size);

      ctx.restore();
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [elements, zoom, panX, panY]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - panX) / zoom;
    const clickY = (e.clientY - rect.top - panY) / zoom;

    let clicked = false;
    elements.forEach((el) => {
      const size = 40 * el.scale;
      if (
        clickX >= el.x - size / 2 &&
        clickX <= el.x + size / 2 &&
        clickY >= el.y - size / 2 &&
        clickY <= el.y + size / 2
      ) {
        setSelectedElement(el.id);
        clicked = true;
      }
    });

    if (!clicked) {
      setSelectedElement(null);
    }
  };

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const newZoom = direction === "in" ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  if (projectLoading || elementsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-8">Proyecto no encontrado</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleZoom("out")}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleZoom("in")}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          {selectedElement && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                handleDeleteElement(selectedElement);
                setSelectedElement(null);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 bg-white">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair border-r"
          />
        </div>

        {/* Sidebar - Inventory */}
        <div className="w-64 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h2 className="font-bold mb-4">Inventario</h2>
            <div className="space-y-2">
              {inventory?.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 cursor-pointer hover:bg-blue-50 transition"
                  onClick={() => {
                    const newElement: CanvasElement = {
                      id: Math.random().toString(),
                      inventoryId: item.id,
                      x: 300,
                      y: 300,
                      rotation: 0,
                      scale: 1,
                      selected: true,
                    };
                    setElements((prev) => [...prev, newElement]);
                  }}
                >
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.category}</p>
                  <p className="text-xs text-green-600 font-semibold">
                    ${item.unitPrice}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
