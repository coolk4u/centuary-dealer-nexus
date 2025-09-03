import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Edit, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface AccountRecord {
  Id: string;
  Name: string;
  Rating: string;
  BillingCity: string;
  ShippingCity: string;
  LastModifiedDate: string;
  Contacts?: {
    records: Array<{
      Phone?: string;
      Email?: string;
    }>;
  };
}

const Customers = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

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
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : "Unknown error occurred";
      
      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
    }
  };

  // Function to format date to show only the date part
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Formats to local date format (e.g., "9/1/2025")
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const query = `SELECT Id, Name, Rating, BillingCity, ShippingCity, LastModifiedDate,
       (SELECT Phone, Email FROM Contacts WHERE Phone != null OR Email != null)
FROM Account 
WHERE Owner.Name = 'Piyush P'
`;
        const encodedQuery = encodeURIComponent(query);
        const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

        const response = await axios.get(queryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const records: AccountRecord[] = response.data.records;

        if (records && records.length > 0) {
          console.log("📦 Fetched Accounts:", records);
          
          // Map the Salesforce data to the customer format
          const mappedCustomers = records.map(account => ({
            id: account.Id,
            name: account.Name,
            phone: account.Contacts?.records[0]?.Phone || "N/A",
            email: account.Contacts?.records[0]?.Email || "N/A",
            location: account.BillingCity || "N/A",
            billingAddress: account.BillingCity || "N/A",
            shippingAddress: account.ShippingCity || "N/A",
            lastOrderDate: account.LastModifiedDate || "N/A",
            status: account.Rating || "N/A"
          }));
          
          setCustomers(mappedCustomers);
        } else {
          console.log("ℹ️ No account records found.");
        }
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message 
          : "Unknown error occurred";
        
        console.error("❌ Error fetching data:", errorMessage);
        setError("Failed to fetch data from Salesforce.");
      }
    };

    fetchData();
  }, [accessToken]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setEditForm({ ...customer });
  };

  const saveCustomer = () => {
    setCustomers(customers.map(customer =>
      customer.id === editForm.id ? editForm : customer
    ));
    toast.success("Customer updated successfully!");
    setSelectedCustomer(null);
  };

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (customers.length === 0) {
    return <div className="p-6">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Customers</h1>
        <p className="text-gray-600">Manage your retailer customer information</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                </div>
                <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                  {customer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{customer.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{customer.email}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span>Last Modified:</span>
                  <span className="font-medium">{formatDate(customer.lastOrderDate)}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Edit Customer - {customer.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Customer Name</Label>
                      <Input
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Billing Address</Label>
                      <Textarea
                        value={editForm.billingAddress || ""}
                        onChange={(e) => setEditForm({...editForm, billingAddress: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Shipping Address</Label>
                      <Textarea
                        value={editForm.shippingAddress || ""}
                        onChange={(e) => setEditForm({...editForm, shippingAddress: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                        Cancel
                      </Button>
                      <Button onClick={saveCustomer}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Customers;