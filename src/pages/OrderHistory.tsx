import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Download } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
  items: number;
  salesforceId?: string;
}

const dummyOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Smith",
    date: "2024-01-15",
    amount: 12500,
    status: "Delivered",
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "Emma Johnson",
    date: "2024-01-14",
    amount: 8900,
    status: "Dispatched",
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "Michael Brown",
    date: "2024-01-13",
    amount: 21500,
    status: "Processing",
    items: 5,
  },
  {
    id: "ORD-004",
    customer: "Sarah Davis",
    date: "2024-01-12",
    amount: 5400,
    status: "Cancelled",
    items: 1,
  },
  {
    id: "ORD-005",
    customer: "Robert Wilson",
    date: "2024-01-11",
    amount: 18300,
    status: "Approved",
    items: 4,
  },
  {
    id: "ORD-006",
    customer: "Lisa Miller",
    date: "2024-01-10",
    amount: 7200,
    status: "Delivered",
    items: 2,
  },
  {
    id: "ORD-007",
    customer: "David Taylor",
    date: "2024-01-09",
    amount: 15600,
    status: "Draft",
    items: 3,
  },
  {
    id: "ORD-008",
    customer: "Jennifer Anderson",
    date: "2024-01-08",
    amount: 9400,
    status: "Activated",
    items: 2,
  },
];

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      try {
        // In a real app, you would fetch from your backend API here
        setOrders(dummyOrders);
        setLoading(false);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
        console.error("Error loading orders:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Dispatched":
        return "secondary";
      case "Approved":
        return "outline";
      case "Activated":
        return "default";
      case "Draft":
        return "outline";
      case "Processing":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

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
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">
                        ₹{order.amount.toLocaleString()}
                      </p>
                      <p className="text-gray-600">{order.items} items</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
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
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
