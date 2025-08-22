
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Download } from "lucide-react";

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const orders = [
    {
      id: "ORD-001",
      customer: "Retail Store A",
      date: "2024-01-15",
      amount: 45000,
      status: "Delivered",
      items: 3
    },
    {
      id: "ORD-002", 
      customer: "Retail Store B",
      date: "2024-01-12",
      amount: 32000,
      status: "Dispatched",
      items: 2
    },
    {
      id: "ORD-003",
      customer: "Retail Store C", 
      date: "2024-01-10",
      amount: 28000,
      status: "Approved",
      items: 4
    }
  ];

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Dispatched": return "secondary";
      case "Approved": return "outline";
      case "Pending": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600">View and manage your past orders</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{order.id}</h3>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">₹{order.amount.toLocaleString()}</p>
                    <p className="text-gray-600">{order.items} items</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
