import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Truck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  Id: string;
  Product2: {
    Name: string;
  };
  Quantity: number;
  UnitPrice: number;
}

interface OrderRecord {
  Id: string;
  OrderNumber: string;
  Account: {
    Name: string;
    Phone: string;
  };
  CreatedDate: string;
  Status: string;
  TotalAmount: number;
  OrderItems: {
    records: OrderItem[];
  };
}

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchOrderDetails = async (token: string) => {
    try {
      // Query to fetch specific order with all details
      const query = `SELECT 
        Id, 
        OrderNumber, 
        Account.Name, 
        Account.Phone,
        CreatedDate, 
        Status, 
        TotalAmount,
        (SELECT Id, Product2.Name, Quantity, UnitPrice FROM OrderItems) 
      FROM Order 
      WHERE Id = '${id}'`;

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
        const orderRecord = records[0];
        console.log("📦 Fetched Order Details:", orderRecord);
        
        // Map Salesforce data to the order format needed by the component
        const mappedOrder = {
          id: orderRecord.OrderNumber,
          customer: orderRecord.Account?.Name || 'N/A',
          customerPhone: orderRecord.Account?.Phone || 'N/A',
          date: new Date(orderRecord.CreatedDate).toLocaleDateString(),
          status: orderRecord.Status,
          total: orderRecord.TotalAmount || 0,
          items: orderRecord.OrderItems?.records?.map(item => ({
            id: item.Id,
            name: item.Product2?.Name || 'Unknown Product',
            quantity: item.Quantity,
            price: item.UnitPrice
          })) || []
        };
        
        setOrder(mappedOrder);
      } else {
        console.log("ℹ️ Order not found.");
        setError("Order not found.");
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : "Unknown error occurred";
      
      console.error("❌ Error fetching order details:", errorMessage);
      setError("Failed to fetch order details from Salesforce.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = await getAccessToken();
      if (token) {
        await fetchOrderDetails(token);
      }
    };
    
    initializeData();
  }, [id]);

  const generateInvoice = () => {
    toast.success("E-Invoice generated successfully!");
  };

  const generateEWayBill = () => {
    toast.success("E-Way Bill generated successfully!");
  };

  const generateTallyXML = () => {
    toast.success("Tally XML file generated and downloaded!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "default";
      case "Dispatched": return "secondary";
      case "Approved": return "outline";
      case "Activated": return "default";
      case "Draft": return "outline";
      case "Processing": return "secondary";
      case "Cancelled": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">{error}</div>
        <Button onClick={() => navigate(-1)} className="ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">Order not found</div>
        <Button onClick={() => navigate(-1)} className="ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  // Calculate GST (20% of total)
  const gst = order.total * 0.20;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order {order.id}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Order ID</p>
                  <p className="text-sm text-gray-600">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Order Date</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={generateInvoice}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate E-Invoice
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={generateEWayBill}
              >
                <Truck className="h-4 w-4 mr-2" />
                Generate E-Way Bill
              </Button>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={generateTallyXML}
              >
                <Download className="h-4 w-4 mr-2" />
                Generate XML for Tally
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{(order.total - gst).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (20%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;