
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react";

const Inventory = () => {
  const inventoryItems = [
    {
      id: "MAT-001",
      name: "Centuary Ortho Plus Mattress",
      category: "Mattresses",
      opening: 50,
      received: 20,
      sold: 15,
      closing: 55,
      reorderLevel: 10,
      status: "Good"
    },
    {
      id: "PIL-001", 
      name: "Centuary Memory Pillow",
      category: "Pillows",
      opening: 100,
      received: 50,
      sold: 80,
      closing: 70,
      reorderLevel: 20,
      status: "Good"
    },
    {
      id: "MAT-002",
      name: "Centuary Premium Mattress",
      category: "Mattresses", 
      opening: 25,
      received: 10,
      sold: 30,
      closing: 5,
      reorderLevel: 10,
      status: "Low Stock"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good": return "default";
      case "Low Stock": return "destructive";
      case "Ageing": return "secondary";
      default: return "outline";
    }
  };

  const getStockLevel = (closing: number, reorderLevel: number) => {
    return (closing / (reorderLevel * 3)) * 100;
  };

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
                <div className="text-2xl font-bold">130</div>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">80</div>
                <p className="text-sm text-gray-600">Items Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">125</div>
                <p className="text-sm text-gray-600">Items Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">1</div>
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
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <Badge variant={getStatusColor(item.status)} className="mt-1">
                    {item.status}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Opening</p>
                  <p className="font-bold">{item.opening}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Received</p>
                  <p className="font-bold text-green-600">+{item.received}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Sold</p>
                  <p className="font-bold text-red-600">-{item.sold}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Closing Stock</p>
                    <p className="font-bold">{item.closing}</p>
                  </div>
                  <Progress 
                    value={getStockLevel(item.closing, item.reorderLevel)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Reorder at {item.reorderLevel}
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
