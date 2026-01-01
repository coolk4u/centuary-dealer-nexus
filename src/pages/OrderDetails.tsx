import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Truck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerPhone: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

// Dummy order data
const DUMMY_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customer: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    date: "2024-01-15",
    status: "Delivered",
    total: 12500,
    items: [
      { id: "1", name: "Premium Laptop", quantity: 1, price: 85000 },
      { id: "2", name: "Wireless Mouse", quantity: 2, price: 2500 },
      { id: "3", name: "Laptop Bag", quantity: 1, price: 3000 }
    ]
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customer: "Emma Johnson",
    customerPhone: "+1 (555) 987-6543",
    date: "2024-01-16",
    status: "Processing",
    total: 72000,
    items: [
      { id: "4", name: "Smartphone", quantity: 1, price: 65000 },
      { id: "5", name: "Screen Protector", quantity: 2, price: 1500 },
      { id: "6", name: "Phone Case", quantity: 1, price: 2000 }
    ]
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customer: "Robert Williams",
    customerPhone: "+1 (555) 456-7890",
    date: "2024-01-17",
    status: "Dispatched",
    total: 45000,
    items: [
      { id: "7", name: "Tablet", quantity: 1, price: 35000 },
      { id: "8", name: "Stylus Pen", quantity: 1, price: 5000 },
      { id: "9", name: "Tablet Cover", quantity: 1, price: 5000 }
    ]
  }
];

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call delay
    const fetchOrderDetails = () => {
      setLoading(true);
      setTimeout(() => {
        const foundOrder = DUMMY_ORDERS.find(order => order.id === id);
        if (foundOrder) {
          // Format the date for display
          const formattedOrder = {
            ...foundOrder,
            date: new Date(foundOrder.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          };
          setOrder(formattedOrder);
        } else {
          setError("Order not found.");
        }
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchOrderDetails();
  }, [id]);

  const generateInvoice = () => {
    toast.success("E-Invoice generated successfully!");
    // In a real app, you would generate and download the invoice
    console.log(`Generating invoice for order ${order?.orderNumber}`);
  };

  const generateEWayBill = () => {
    toast.success("E-Way Bill generated successfully!");
    // In a real app, you would generate and download the e-way bill
    console.log(`Generating e-way bill for order ${order?.orderNumber}`);
  };

  const generateTallyXML = () => {
    toast.success("Tally XML file generated and downloaded!");
    // In a real app, you would generate and download the Tally XML
    console.log(`Generating Tally XML for order ${order?.orderNumber}`);
    
    // Simulate file download
    const xmlContent = `<?xml version="1.0"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE>
          <ORDER>
            <ORDERNUMBER>${order?.orderNumber}</ORDERNUMBER>
            <DATE>${order?.date}</DATE>
            <CUSTOMER>${order?.customer}</CUSTOMER>
            <TOTAL>${order?.total}</TOTAL>
          </ORDER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
    
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `order_${order?.orderNumber}_tally.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
  const subtotal = order.total - gst;

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
            <p className="text-gray-600">Order {order.orderNumber}</p>
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
                  <p className="text-sm text-gray-600">{order.orderNumber}</p>
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
                {order.items.map((item) => (
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
                <span>₹{subtotal.toLocaleString()}</span>
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
