import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react";

interface InventoryRecord {
  id: string;
  name: string;
  productName: string;
  category: string;
  currentStock: number;
  status: string;
  minimumStock: number;
  unitPrice: number;
  inventoryValue: number;
}

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dummy inventory data
  const dummyInventoryData: InventoryRecord[] = [
    {
      id: "1",
      name: "PVC Pipe 4-inch",
      productName: "PVC Pipe 4-inch",
      category: "Pipes",
      currentStock: 150,
      status: "Good",
      minimumStock: 50,
      unitPrice: 120.75,
      inventoryValue: 18112.5
    },
    {
      id: "2",
      name: "CPVC Pipe 2-inch",
      productName: "CPVC Pipe 2-inch",
      category: "Pipes",
      currentStock: 25,
      status: "Low Stock",
      minimumStock: 30,
      unitPrice: 95.50,
      inventoryValue: 2387.5
    },
    {
      id: "3",
      name: "UPVC Elbow 90°",
      productName: "UPVC Elbow 90°",
      category: "Fittings",
      currentStock: 300,
      status: "Good",
      minimumStock: 100,
      unitPrice: 15.25,
      inventoryValue: 4575
    },
    {
      id: "4",
      name: "PVC Tee Joint",
      productName: "PVC Tee Joint",
      category: "Fittings",
      currentStock: 80,
      status: "Good",
      minimumStock: 40,
      unitPrice: 22.00,
      inventoryValue: 1760
    },
    {
      id: "5",
      name: "PVC Adhesive 1L",
      productName: "PVC Adhesive 1L",
      category: "Chemicals",
      currentStock: 12,
      status: "Low Stock",
      minimumStock: 20,
      unitPrice: 180.00,
      inventoryValue: 2160
    },
    {
      id: "6",
      name: "PVC Solvent Cement",
      productName: "PVC Solvent Cement",
      category: "Chemicals",
      currentStock: 45,
      status: "Good",
      minimumStock: 25,
      unitPrice: 150.50,
      inventoryValue: 6772.5
    },
    {
      id: "7",
      name: "PVC Coupling",
      productName: "PVC Coupling",
      category: "Fittings",
      currentStock: 200,
      status: "Good",
      minimumStock: 75,
      unitPrice: 8.75,
      inventoryValue: 1750
    },
    {
      id: "8",
      name: "CPVC Valve",
      productName: "CPVC Valve",
      category: "Valves",
      currentStock: 18,
      status: "Low Stock",
      minimumStock: 25,
      unitPrice: 350.00,
      inventoryValue: 6300
    }
  ];

  // Simulate API call to fetch inventory data
  const fetchInventoryData = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real application, you would fetch from your backend API:
      // const response = await axios.get('/api/inventory');
      // setInventoryItems(response.data);
      
      setInventoryItems(dummyInventoryData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch inventory data. Please try again.");
      setLoading(false);
      console.error("Error fetching inventory data:", err);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good": return "default";
      case "Low Stock": return "destructive";
      case "Ageing": return "secondary";
      default: return "outline";
    }
  };

  const getStockLevel = (currentStock: number, minimumStock: number) => {
    return (currentStock / (minimumStock * 3)) * 100;
  };

  // Calculate summary statistics
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockItems = inventoryItems.filter(item => 
    item.status === "Low Stock" || item.currentStock <= item.minimumStock
  ).length;
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.inventoryValue, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading inventory data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Track your stock levels and movements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{inventoryItems.length}</div>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-sm text-gray-600">Total Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">
                  {totalInventoryValue.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </div>
                <p className="text-sm text-gray-600">Inventory Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <p className="text-sm text-gray-600">Low Stock Alert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items */}
      <div className="space-y-4">
        {inventoryItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <div className="lg:col-span-2">
                  <h3 className="font-semibold">{item.productName || item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <Badge variant={getStatusColor(item.status)} className="mt-1">
                    {item.status}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Unit Price</p>
                  <p className="font-bold">
                    {item.unitPrice.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 2
                    })}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Min Stock</p>
                  <p className="font-bold">{item.minimumStock}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="font-bold">{item.currentStock}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Stock Level</p>
                    <p className="font-bold">{item.currentStock}</p>
                  </div>
                  <Progress 
                    value={getStockLevel(item.currentStock, item.minimumStock || 1)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Reorder at {item.minimumStock}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
