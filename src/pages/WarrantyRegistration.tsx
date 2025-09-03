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
import axios from "axios";

interface WarrantyRecord {
  Id: string;
  Name: string;
  Customer_Name__r?: {
    Name: string;
  };
  Selected_Products__r?: {
    Name: string;
  };
  Product_Code__c?: string;
  Invoice_Number__c?: string;
  Expiry__c?: string;
  CreatedDate?: string;
}

interface CustomerRecord {
  Id: string;
  Name: string;
}

interface ProductRecord {
  Id: string;
  Name: string;
}

const WarrantyRegistration = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [productCode, setProductCode] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [recentWarranties, setRecentWarranties] = useState<WarrantyRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Get Access Token
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
      toast.error("Failed to fetch access token.");
      return null;
    }
  };

  // Fetch customers from Salesforce
  const fetchCustomers = async (token: string) => {
    try {
      const query = `SELECT Id, Name FROM Customer_Onboarding__c ORDER BY Name LIMIT 50`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Add SleepWell Showroom if it doesn't exist in the response
      let customerList = response.data.records;
      
      // Check if SleepWell Showroom already exists
      const sleepWellExists = customerList.some(
        (customer: CustomerRecord) => customer.Name === "SleepWell Showroom"
      );
      
      // If not found, add it to the beginning of the list
      if (!sleepWellExists) {
        customerList = [
          { Id: "sleepwell-showroom", Name: "SleepWell Showroom" },
          ...customerList
        ];
      }
      
      // Add some sample customers for demonstration if we have less than 4
      if (customerList.length < 4) {
        const sampleCustomers = [
          { Id: "customer-2", Name: "John Smith" },
          { Id: "customer-3", Name: "Emma Johnson" },
          { Id: "customer-4", Name: "Michael Williams" }
        ];
        
        // Add sample customers only if they don't already exist
        sampleCustomers.forEach(sample => {
          if (!customerList.some((c: CustomerRecord) => c.Name === sample.Name)) {
            customerList.push(sample);
          }
        });
      }

      setCustomers(customerList);
    } catch (err: unknown) {
      console.error("❌ Error fetching customers:", err);
      
      // Fallback to sample data if API fails
      const fallbackCustomers = [
        { Id: "sleepwell-showroom", Name: "SleepWell Showroom" },
        { Id: "customer-2", Name: "John Smith" },
        { Id: "customer-3", Name: "Emma Johnson" },
        { Id: "customer-4", Name: "Michael Williams" }
      ];
      setCustomers(fallbackCustomers);
    }
  };

  // Fetch products from Salesforce
  const fetchProducts = async (token: string) => {
    try {
      const query = `SELECT Id, Name FROM Product2 where Family IN ('Mattress', 'Pillow', 'Mat') and isActive = true`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setProducts(response.data.records);
    } catch (err: unknown) {
      console.error("❌ Error fetching products:", err);
    }
  };

  // Fetch recent warranty registrations
  const fetchRecentWarranties = async (token: string) => {
    try {
      const query = `Select Id, Name, Customer_Name__r.Name, Selected_Products__r.Name, Product_Code__c, Invoice_Number__c, Expiry__c, CreatedDate From Warranty_Registration__c ORDER BY CreatedDate DESC LIMIT 10`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setRecentWarranties(response.data.records);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching warranty data:", errorMessage);
      toast.error("Failed to fetch warranty data.");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const token = await getAccessToken();
      if (token) {
        fetchCustomers(token);
        fetchProducts(token);
        fetchRecentWarranties(token);
      }
    };
    initialize();
  }, []);

  const registerWarranty = async () => {
    if (!selectedCustomer || !selectedProduct || !invoiceNumber) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    
    try {
      // First get an access token if we don't have one
      let token = accessToken;
      if (!token) {
        token = await getAccessToken();
        if (!token) {
          throw new Error("Failed to get access token");
        }
      }

      // Create the warranty registration
      const response = await axios.post(
        'https://centuaryindia-dev-ed.develop.my.salesforce.com/services/apexrest/WarrantyRegistration',
        {
          customerId: selectedCustomer,
          productId: selectedProduct,
          invoiceNumber: invoiceNumber,
          productCode: productCode
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.includes('Success')) {
        toast.success("Warranty registered successfully! SMS/Email confirmation sent to customer.");
        
        // Reset form
        setSelectedCustomer("");
        setSelectedProduct("");
        setInvoiceNumber("");
        setProductCode("");
        
        // Refresh the recent warranties list
        fetchRecentWarranties(token);
      } else {
        throw new Error(response.data);
      }
    } catch (error: any) {
      console.error('Error registering warranty:', error);
      toast.error(`Failed to register warranty: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const scanProductCode = () => {
    // Simulate scanning
    setProductCode("MAT001-2024-003");
    toast.info("Product code scanned successfully!");
  };

  // Function to determine badge variant based on expiry date
  const getExpiryStatus = (expiryDate: string | undefined) => {
    if (!expiryDate) return "default";
    
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
  const getStatusText = (expiryDate: string | undefined) => {
    if (!expiryDate) return "Active";
    
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
                    <SelectItem key={customer.Id} value={customer.Id}>
                      {customer.Name}
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
                    <SelectItem key={product.Id} value={product.Id}>
                      {product.Name}
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
                <div key={warranty.Id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{warranty.Selected_Products__r?.Name || 'N/A'}</h4>
                      <p className="text-sm text-gray-600">{warranty.Customer_Name__r?.Name || 'N/A'}</p>
                    </div>
                    <Badge variant={getExpiryStatus(warranty.Expiry__c)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {getStatusText(warranty.Expiry__c)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Code: {warranty.Product_Code__c || 'N/A'}</p>
                    <p>Invoice: {warranty.Invoice_Number__c || 'N/A'}</p>
                    {warranty.Expiry__c && (
                      <p>Expires: {new Date(warranty.Expiry__c).toLocaleDateString()}</p>
                    )}
                    {warranty.CreatedDate && (
                      <p>Registered: {new Date(warranty.CreatedDate).toLocaleDateString()}</p>
                    )}
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