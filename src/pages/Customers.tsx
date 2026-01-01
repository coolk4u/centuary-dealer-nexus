import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Edit, MapPin, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  billingAddress: string;
  shippingAddress: string;
  lastOrderDate: string;
  status: string;
}

const dummyCustomers: Customer[] = [
  {
    id: "1",
    name: "Global Retail Solutions",
    phone: "+1 (555) 123-4567",
    email: "contact@globalretail.com",
    location: "New York, NY",
    billingAddress: "123 Broadway, Suite 100, New York, NY 10001",
    shippingAddress: "456 Warehouse Ave, Brooklyn, NY 11201",
    lastOrderDate: "2024-01-15T10:30:00Z",
    status: "Active"
  },
  {
    id: "2",
    name: "Premium Distributors Inc",
    phone: "+1 (555) 234-5678",
    email: "sales@premiumdist.com",
    location: "Chicago, IL",
    billingAddress: "789 Michigan Ave, Chicago, IL 60611",
    shippingAddress: "321 Industrial Park, Chicago, IL 60609",
    lastOrderDate: "2024-01-10T14:20:00Z",
    status: "Active"
  },
  {
    id: "3",
    name: "Value Mart Stores",
    phone: "+1 (555) 345-6789",
    email: "orders@valuemart.com",
    location: "Los Angeles, CA",
    billingAddress: "101 Sunset Blvd, Los Angeles, CA 90046",
    shippingAddress: "202 Commerce St, Los Angeles, CA 90021",
    lastOrderDate: "2024-01-05T09:15:00Z",
    status: "Inactive"
  },
  {
    id: "4",
    name: "Metro Wholesale Group",
    phone: "+1 (555) 456-7890",
    email: "info@metrowholesale.com",
    location: "Miami, FL",
    billingAddress: "303 Ocean Dr, Miami, FL 33139",
    shippingAddress: "404 Port Ave, Miami, FL 33132",
    lastOrderDate: "2023-12-28T16:45:00Z",
    status: "Active"
  },
  {
    id: "5",
    name: "Northwest Retail Chain",
    phone: "+1 (555) 567-8901",
    email: "support@nwretail.com",
    location: "Seattle, WA",
    billingAddress: "505 Pike St, Seattle, WA 98101",
    shippingAddress: "606 Harbor Way, Seattle, WA 98121",
    lastOrderDate: "2023-12-20T11:10:00Z",
    status: "Active"
  },
  {
    id: "6",
    name: "Heritage Department Stores",
    phone: "+1 (555) 678-9012",
    email: "customerservice@heritage.com",
    location: "Boston, MA",
    billingAddress: "707 Beacon St, Boston, MA 02215",
    shippingAddress: "808 Cambridge St, Boston, MA 02134",
    lastOrderDate: "2023-12-15T13:25:00Z",
    status: "Pending"
  }
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});

  // Function to format date to show only the date part
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "N/A") return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({ ...customer });
  };

  const saveCustomer = () => {
    if (!editForm.id) return;
    
    setCustomers(customers.map(customer =>
      customer.id === editForm.id ? { ...customer, ...editForm } as Customer : customer
    ));
    toast.success("Customer updated successfully!");
    setSelectedCustomer(null);
    setEditForm({});
  };

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
          placeholder="Search customers by name, location, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-sm text-gray-500">{customer.location}</p>
                </div>
                <Badge 
                  variant={
                    customer.status === "Active" ? "default" :
                    customer.status === "Inactive" ? "destructive" : "secondary"
                  }
                >
                  {customer.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="truncate">{customer.billingAddress}</span>
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Order:</span>
                  <span className="font-medium">{formatDate(customer.lastOrderDate)}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Customer - {customer.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Customer Name</Label>
                      <Input
                        id="name"
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editForm.status || ""}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastOrderDate">Last Order Date</Label>
                      <Input
                        id="lastOrderDate"
                        type="date"
                        value={editForm.lastOrderDate ? editForm.lastOrderDate.split('T')[0] : ""}
                        onChange={(e) => setEditForm({...editForm, lastOrderDate: e.target.value + 'T00:00:00Z'})}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="billingAddress">Billing Address</Label>
                      <Textarea
                        id="billingAddress"
                        value={editForm.billingAddress || ""}
                        onChange={(e) => setEditForm({...editForm, billingAddress: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="shippingAddress">Shipping Address</Label>
                      <Textarea
                        id="shippingAddress"
                        value={editForm.shippingAddress || ""}
                        onChange={(e) => setEditForm({...editForm, shippingAddress: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2 flex justify-end gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedCustomer(null);
                          setEditForm({});
                        }}
                      >
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

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No customers found matching your search.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
};

export default Customers;
