import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Scan, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface WarrantyRecord {
  id: string;
  name: string;
  customerName: string;
  productName: string;
  productCode: string;
  invoiceNumber: string;
  expiryDate: string;
  createdDate: string;
}

interface CustomerRecord {
  id: string;
  name: string;
}

interface ProductRecord {
  id: string;
  name: string;
}

const WarrantyRegistration = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [productCode, setProductCode] = useState("");
  const [recentWarranties, setRecentWarranties] = useState<WarrantyRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Dummy data for customers
  const dummyCustomers: CustomerRecord[] = [
    { id: "customer-1", name: "SleepWell Showroom" },
    { id: "customer-2", name: "John Smith" },
    { id: "customer-3", name: "Emma Johnson" },
    { id: "customer-4", name: "Michael Williams" },
    { id: "customer-5", name: "Sarah Brown" },
    { id: "customer-6", name: "Robert Davis" },
  ];

  // Dummy data for products
  const dummyProducts: ProductRecord[] = [
    { id: "product-1", name: "Premium Mattress - Queen Size" },
    { id: "product-2", name: "Memory Foam Pillow" },
    { id: "product-3", name: "Orthopedic Mattress - King Size" },
    { id: "product-4", name: "Gel Memory Foam Mattress" },
    { id: "product-5", name: "Latex Pillow" },
    { id: "product-6", name: "Yoga Mat - Premium" },
  ];

  // Dummy data for recent warranties
  const dummyWarranties: WarrantyRecord[] = [
    {
      id: "warranty-1",
      name: "WR-001",
      customerName: "John Smith",
      productName: "Premium Mattress - Queen Size",
      productCode: "MAT001-2024-001",
      invoiceNumber: "INV-2024-001",
      expiryDate: "2026-12-31",
      createdDate: "2024-01-15",
    },
    {
      id: "warranty-2",
      name: "WR-002",
      customerName: "Emma Johnson",
      productName: "Memory Foam Pillow",
      productCode: "PIL001-2024-002",
      invoiceNumber: "INV-2024-002",
      expiryDate: "2025-06-30",
      createdDate: "2024-01-14",
    },
    {
      id: "warranty-3",
      name: "WR-003",
      customerName: "Michael Williams",
      productName: "Orthopedic Mattress - King Size",
      productCode: "MAT002-2024-003",
      invoiceNumber: "INV-2024-003",
      expiryDate: "2024-03-15",
      createdDate: "2024-01-13",
    },
    {
      id: "warranty-4",
      name: "WR-004",
      customerName: "SleepWell Showroom",
      productName: "Gel Memory Foam Mattress",
      productCode: "MAT003-2024-004",
      invoiceNumber: "INV-2024-004",
      expiryDate: "2027-01-01",
      createdDate: "2024-01-12",
    },
  ];

  useEffect(() => {
    // Load dummy data
    setCustomers(dummyCustomers);
    setProducts(dummyProducts);
    setRecentWarranties(dummyWarranties);
  }, []);

  const registerWarranty = () => {
    if (!selectedCustomer || !selectedProduct || !invoiceNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Find selected customer and product names
      const customer = customers.find(c => c.id === selectedCustomer);
      const product = products.find(p => p.id === selectedProduct);

      // Create new warranty record
      const newWarranty: WarrantyRecord = {
        id: `warranty-${Date.now()}`,
        name: `WR-${recentWarranties.length + 1}`,
        customerName: customer?.name || "Unknown Customer",
        productName: product?.name || "Unknown Product",
        productCode: productCode || `CODE-${Date.now().toString().slice(-6)}`,
        invoiceNumber: invoiceNumber,
        expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 years from now
        createdDate: new Date().toISOString().split('T')[0],
      };

      // Add to recent warranties (at the beginning)
      setRecentWarranties(prev => [newWarranty, ...prev.slice(0, 9)]);

      // Reset form
      setSelectedCustomer("");
      setSelectedProduct("");
      setInvoiceNumber("");
      setProductCode("");

      toast.success("Warranty registered successfully! SMS/Email confirmation sent to customer.");
      setLoading(false);
    }, 1000);
  };

  const scanProductCode = () => {
    // Simulate scanning
    const scannedCode = `SCAN-${Date.now().toString().slice(-8)}`;
    setProductCode(scannedCode);
    toast.info("Product code scanned successfully!");
  };

  // Function to determine badge variant based on expiry date
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    
    if (expiry < today) {
      return "destructive"; // Expired
    } else if ((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30) {
      return "secondary"; // Expiring soon (within 30 days)
    } else {
      return "default"; // Active
    }
  };

  // Function to get status text based on expiry date
  const getStatusText = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    
    if (expiry < today) {
      return "Expired";
    } else if ((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= 30) {
      return "Expiring Soon";
    } else {
      return "Active";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Warranty Registration
        </h1>
        <p className="text-gray-600">
          Register product warranties for your customers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Register New Warranty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Customer</Label>
              <Select
                value={selectedCustomer}
                onValueChange={setSelectedCustomer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Product</Label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Enter invoice number"
              />
            </div>

            <div className="space-y-2">
              <Label>Product Code</Label>
              <div className="flex gap-2">
                <Input
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Enter or scan product code"
                />
                <Button variant="outline" onClick={scanProductCode}>
                  <Scan className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={registerWarranty}
              disabled={loading}
            >
              <Shield className="h-4 w-4 mr-2" />
              {loading ? "Registering..." : "Register Warranty"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Warranties */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Warranty Registrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentWarranties.length > 0 ? (
              recentWarranties.map((warranty) => (
                <div key={warranty.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{warranty.productName}</h4>
                      <p className="text-sm text-gray-600">{warranty.customerName}</p>
                    </div>
                    <Badge variant={getExpiryStatus(warranty.expiryDate)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {getStatusText(warranty.expiryDate)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Code: {warranty.productCode}</p>
                    <p>Invoice: {warranty.invoiceNumber}</p>
                    <p>Expires: {new Date(warranty.expiryDate).toLocaleDateString()}</p>
                    <p>Registered: {new Date(warranty.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent warranty registrations found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarrantyRegistration;
