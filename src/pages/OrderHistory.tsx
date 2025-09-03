import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Download } from "lucide-react";

interface OrderRecord {
  Id: string;
  OrderNumber: string;
  Account: {
    Name: string;
  };
  CreatedDate: string;
  Status: string;
  TotalAmount: number;
  OrderItems: {
    records: Array<{
      Id: string;
    }>;
  };
}

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Step 1: Get Access Token
  const getAccessToken = async () => {
    const salesforceUrl =
      "https://centuaryindia-dev-ed.develop.my.salesforce.com/services/oauth2/token";
    const clientId =
      "3MVG9nSH73I5aFNh79L8JaABhoZboVvF44jJMEaVNpVy6dzgmTzE_e3R7T2cRQXEJR7gj6wXjRebPYvPGbn1h";
    const clientSecret =
      "18AFFC6E432CC5A9D48D2CECF6386D59651E775DF127D9AC171D28F8DC7C01B9";

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    try {
      const response = await axios.post(salesforceUrl, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setAccessToken(response.data.access_token);
      console.log("✅ Access Token:", response.data.access_token);
      return response.data.access_token;
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
      return null;
    }
  };

  const fetchOrders = async (token: string) => {
    try {
      // Query to fetch orders with related data
      // We'll get the order items as a subquery and count them
      const query = `SELECT 
    Id, 
    OrderNumber, 
    Account.Name, 
    CreatedDate, 
    Status, 
    TotalAmount,
    (SELECT Id FROM OrderItems) 
FROM Order 
WHERE (AccountId IN ('001fn000005dW2HAAU', 
                     '001fn000005QtEEAA0', 
                     '001fn000005dnnmAAA'))
  AND Type = 'Secondary'
  AND CreatedDate = TODAY
ORDER BY CreatedDate DESC
LIMIT 50
`;

      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const records: OrderRecord[] = response.data.records;

      if (records && records.length > 0) {
        console.log("📦 Fetched Orders:", records);

        // Map Salesforce data to the order format needed by the component
        const mappedOrders = records.map((record) => ({
          id: record.OrderNumber,
          customer: record.Account?.Name || "N/A",
          date: new Date(record.CreatedDate).toLocaleDateString(),
          amount: record.TotalAmount || 0,
          status: record.Status,
          items: record.OrderItems?.records?.length || 0,
          salesforceId: record.Id, // Store Salesforce ID for future reference
        }));

        setOrders(mappedOrders);
      } else {
        console.log("ℹ️ No order records found.");
        setOrders([]);
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching orders:", errorMessage);
      setError("Failed to fetch orders from Salesforce.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = await getAccessToken();
      if (token) {
        await fetchOrders(token);
      }
    };

    initializeData();
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
                      onClick={() => navigate(`/orders/${order.salesforceId}`)}
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
