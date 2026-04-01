import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/AdminLayout";
import { Loader2, Plus, Trash2, Edit2, Search } from "lucide-react";

interface NewInventoryItem {
  name: string;
  description: string;
  category: string;
  unitPrice: string;
  unit: string;
  quantity: string;
}

export default function AdminInventory() {
  const { data: inventory, isLoading } = trpc.inventory.list.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState<NewInventoryItem>({
    name: "",
    description: "",
    category: "plant",
    unitPrice: "",
    unit: "piece",
    quantity: "0",
  });

  const categories = ["plant", "hardscape", "mulch", "soil", "tools", "other"];

  const filteredInventory = inventory?.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;

    // TODO: Implement API call to create inventory item
    console.log("Creating inventory item:", newItem);
    setNewItem({
      name: "",
      description: "",
      category: "plant",
      unitPrice: "",
      unit: "piece",
      quantity: "0",
    });
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Inventario
          </h1>
          <p className="text-gray-600">
            Administra plantas, materiales y elementos de diseño
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Artículo
            </Button>
          </div>
        </Card>

        {/* Add New Item Form */}
        {showForm && (
          <Card className="p-6 mb-8 bg-green-50">
            <h2 className="text-xl font-bold mb-4">Nuevo Artículo de Inventario</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Nombre"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Descripción"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
              <Input
                placeholder="Precio unitario"
                type="number"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) =>
                  setNewItem({ ...newItem, unitPrice: e.target.value })
                }
              />
              <select
                value={newItem.unit}
                onChange={(e) =>
                  setNewItem({ ...newItem, unit: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="piece">Pieza</option>
                <option value="sqft">Pie Cuadrado</option>
                <option value="cubic_yard">Yarda Cúbica</option>
                <option value="gallon">Galón</option>
                <option value="lb">Libra</option>
              </select>
              <Input
                placeholder="Cantidad"
                type="number"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddItem}
                className="bg-green-600 hover:bg-green-700"
              >
                Guardar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        {/* Inventory Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory?.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${item.unitPrice}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement edit
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement delete
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!filteredInventory || filteredInventory.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No hay artículos de inventario que coincidan con los criterios de
              búsqueda
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
