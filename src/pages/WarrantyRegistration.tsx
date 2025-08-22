
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Scan, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const WarrantyRegistration = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [productCode, setProductCode] = useState("");

  const customers = [
    { id: "CUS-001", name: "Retail Store A" },
    { id: "CUS-002", name: "Retail Store B" },
    { id: "CUS-003", name: "Retail Store C" }
  ];

  const products = [
    { id: "MAT-001", name: "Centuary Ortho Plus Mattress", warranty: "10 Years" },
    { id: "PIL-001", name: "Centuary Memory Pillow", warranty: "2 Years" },
    { id: "ACC-001", name: "Mattress Protector", warranty: "1 Year" }
  ];

  const warrantyRecords = [
    {
      id: "WAR-001",
      customer: "Retail Store A",
      product: "Centuary Ortho Plus Mattress",
      registrationDate: "2024-01-15",
      expiryDate: "2034-01-15",
      status: "Active",
      productCode: "MAT001-2024-001"
    },
    {
      id: "WAR-002", 
      customer: "Retail Store B",
      product: "Centuary Memory Pillow",
      registrationDate: "2024-01-12",
      expiryDate: "2026-01-12", 
      status: "Active",
      productCode: "PIL001-2024-002"
    }
  ];

  const registerWarranty = () => {
    if (!selectedCustomer || !selectedProduct || !invoiceNumber) {
      toast.error("Please fill all required fields");
      return;
    }
    
    toast.success("Warranty registered successfully! SMS/Email confirmation sent to customer.");
    setSelectedCustomer("");
    setSelectedProduct("");
    setInvoiceNumber("");
    setProductCode("");
  };

  const scanProductCode = () => {
    // Simulate scanning
    setProductCode("MAT001-2024-003");
    toast.info("Product code scanned successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Warranty Registration</h1>
        <p className="text-gray-600">Register product warranties for your customers</p>
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
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
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
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {product.warranty}
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

            <Button className="w-full" onClick={registerWarranty}>
              <Shield className="h-4 w-4 mr-2" />
              Register Warranty
            </Button>
          </CardContent>
        </Card>

        {/* Recent Warranties */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Warranty Registrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {warrantyRecords.map((warranty) => (
              <div key={warranty.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{warranty.product}</h4>
                    <p className="text-sm text-gray-600">{warranty.customer}</p>
                  </div>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {warranty.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Code: {warranty.productCode}</p>
                  <p>Registered: {warranty.registrationDate}</p>
                  <p>Expires: {warranty.expiryDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarrantyRegistration;
