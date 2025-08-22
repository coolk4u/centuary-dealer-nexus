
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Truck } from "lucide-react";
import { toast } from "sonner";

const OrderDetails = () => {
  const { id } = useParams();

  const order = {
    id: "ORD-001",
    customer: "Retail Store A",
    customerContact: "John Doe",
    customerPhone: "+91 98765 43210",
    date: "2024-01-15",
    status: "Delivered",
    paymentTerms: "30 Days Credit",
    deliveryMode: "Standard Delivery",
    items: [
      { id: "MAT-001", name: "Centuary Ortho Plus Mattress", quantity: 1, price: 25000, discount: 5 },
      { id: "PIL-001", name: "Centuary Memory Pillow", quantity: 2, price: 2500, discount: 0 }
    ],
    subtotal: 30000,
    discount: 1250,
    gst: 5175,
    total: 33925
  };

  const generateInvoice = () => {
    toast.success("E-Invoice generated successfully!");
  };

  const generateEWayBill = () => {
    toast.success("E-Way Bill generated successfully!");
  };

  const generateTallyXML = () => {
    toast.success("Tally XML file generated and downloaded!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600">Order {id}</p>
        </div>
        <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
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
                  <p className="text-sm font-medium">Contact Person</p>
                  <p className="text-sm text-gray-600">{order.customerContact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Terms</p>
                  <p className="text-sm text-gray-600">{order.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Delivery Mode</p>
                  <p className="text-sm text-gray-600">{order.deliveryMode}</p>
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
                      {item.discount > 0 && (
                        <p className="text-sm text-green-600">Discount: {item.discount}%</p>
                      )}
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
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{order.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{order.gst.toLocaleString()}</span>
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
