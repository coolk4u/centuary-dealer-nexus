import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; 
import { Search, Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

interface InvoiceRecord {
  Id: string;
  Name: string;
  Order__r: {
    OrderNumber: string;
  };
  Type__c: string;
  Status__c: string;
  Invoice_Amount__c: number;
}

// Dummy invoice data
const DUMMY_INVOICES: InvoiceRecord[] = [
  {
    Id: "1",
    Name: "INV-001",
    Order__r: { OrderNumber: "ORD-1001" },
    Type__c: "Standard",
    Status__c: "Paid",
    Invoice_Amount__c: 12500
  },
  {
    Id: "2",
    Name: "INV-002",
    Order__r: { OrderNumber: "ORD-1002" },
    Type__c: "Recurring",
    Status__c: "Pending",
    Invoice_Amount__c: 8500
  },
  {
    Id: "3",
    Name: "INV-003",
    Order__r: { OrderNumber: "ORD-1003" },
    Type__c: "Credit",
    Status__c: "Overdue",
    Invoice_Amount__c: 15600
  },
  {
    Id: "4",
    Name: "INV-004",
    Order__r: { OrderNumber: "ORD-1004" },
    Type__c: "Standard",
    Status__c: "Paid",
    Invoice_Amount__c: 9200
  },
  {
    Id: "5",
    Name: "INV-005",
    Order__r: { OrderNumber: "ORD-1005" },
    Type__c: "Recurring",
    Status__c: "Pending",
    Invoice_Amount__c: 11300
  }
];

const Invoices = () => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load dummy data
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setInvoices(DUMMY_INVOICES);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const filteredInvoices = invoices.filter(invoice =>
    invoice.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.Order__r?.OrderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Calculate totals from dummy data
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + (invoice.Invoice_Amount__c || 0), 0);
  const paidAmount = invoices
    .filter(invoice => invoice.Status__c === "Paid")
    .reduce((sum, invoice) => sum + (invoice.Invoice_Amount__c || 0), 0);
  const pendingAmount = invoices
    .filter(invoice => invoice.Status__c === "Pending")
    .reduce((sum, invoice) => sum + (invoice.Invoice_Amount__c || 0), 0);
  const overdueAmount = invoices
    .filter(invoice => invoice.Status__c === "Overdue")
    .reduce((sum, invoice) => sum + (invoice.Invoice_Amount__c || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading invoices...</div>
      </div>
    );
  }

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
          placeholder="Search invoices by name or order number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">₹{totalInvoiced.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Invoiced</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">₹{paidAmount.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Paid Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">₹{pendingAmount.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Pending Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">₹{overdueAmount.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Overdue Amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No invoices found</p>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.Id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <h3 className="font-semibold">{invoice.Name}</h3>
                      <p className="text-sm text-gray-600">Order: {invoice.Order__r?.OrderNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium">{invoice.Type__c || 'N/A'}</p>
                      <p className="text-sm text-gray-600">Type: {invoice.Type__c}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Invoice Reference</p>
                      <p className="font-medium">{invoice.Name}</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">₹{(invoice.Invoice_Amount__c || 0).toLocaleString()}</p>
                      <Badge variant={getStatusColor(invoice.Status__c)}>
                        {invoice.Status__c}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => viewInvoice(invoice.Name)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadInvoice(invoice.Name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Invoices;
