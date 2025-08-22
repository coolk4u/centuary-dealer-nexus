
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; 
import { Search, Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    {
      id: "INV-2024-001",
      customer: "Retail Store A",
      orderRef: "ORD-001",
      date: "2024-01-15",
      dueDate: "2024-02-14",
      amount: 33925,
      status: "Paid",
      gstNumber: "27ABCDE1234F1Z5"
    },
    {
      id: "INV-2024-002",
      customer: "Retail Store B", 
      orderRef: "ORD-002",
      date: "2024-01-12",
      dueDate: "2024-02-11",
      amount: 37680,
      status: "Pending",
      gstNumber: "07FGHIJ5678K2L6"
    },
    {
      id: "INV-2024-003",
      customer: "Retail Store C",
      orderRef: "ORD-003", 
      date: "2024-01-10",
      dueDate: "2024-02-09",
      amount: 33040,
      status: "Overdue",
      gstNumber: "29KLMNO9012P3Q7"
    }
  ];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "default";
      case "Pending": return "secondary";
      case "Overdue": return "destructive";
      default: return "outline";
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    toast.success(`Invoice ${invoiceId} downloaded successfully!`);
  };

  const viewInvoice = (invoiceId: string) => {
    toast.info(`Opening invoice ${invoiceId}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600">Manage customer invoices and billing</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">₹1,04,645</div>
            <p className="text-sm text-gray-600">Total Invoiced</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">₹33,925</div>
            <p className="text-sm text-gray-600">Paid Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">₹37,680</div>
            <p className="text-sm text-gray-600">Pending Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">₹33,040</div>
            <p className="text-sm text-gray-600">Overdue Amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <h3 className="font-semibold">{invoice.id}</h3>
                    <p className="text-sm text-gray-600">Order: {invoice.orderRef}</p>
                  </div>
                  <div>
                    <p className="font-medium">{invoice.customer}</p>
                    <p className="text-sm text-gray-600">GST: {invoice.gstNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Invoice Date</p>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-gray-600">Due: {invoice.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">₹{invoice.amount.toLocaleString()}</p>
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewInvoice(invoice.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Invoices;
