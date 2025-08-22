
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

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([
    {
      id: "CUS-001",
      name: "Retail Store A",
      contactPerson: "John Doe",
      phone: "+91 98765 43210",
      email: "john@retaila.com",
      location: "Mumbai",
      billingAddress: "123 Main St, Mumbai, MH 400001",
      shippingAddress: "123 Main St, Mumbai, MH 400001",
      gst: "27ABCDE1234F1Z5",
      totalOrders: 25,
      lastOrderDate: "2024-01-15",
      status: "Active"
    },
    {
      id: "CUS-002", 
      name: "Retail Store B",
      contactPerson: "Jane Smith",
      phone: "+91 98765 43211",
      email: "jane@retailb.com",
      location: "Delhi",
      billingAddress: "456 Park Ave, Delhi, DL 110001",
      shippingAddress: "456 Park Ave, Delhi, DL 110001", 
      gst: "07FGHIJ5678K2L6",
      totalOrders: 18,
      lastOrderDate: "2024-01-12",
      status: "Active"
    }
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  <p className="text-sm text-gray-600">{customer.contactPerson}</p>
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
                  <span>Total Orders:</span>
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Order:</span>
                  <span className="font-medium">{customer.lastOrderDate}</span>
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
                      <Label>Contact Person</Label>
                      <Input
                        value={editForm.contactPerson || ""}
                        onChange={(e) => setEditForm({...editForm, contactPerson: e.target.value})}
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
                      <Label>GST Number</Label>
                      <Input
                        value={editForm.gst || ""}
                        onChange={(e) => setEditForm({...editForm, gst: e.target.value})}
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
