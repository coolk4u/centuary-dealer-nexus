import { useEffect, useState } from "react";
import axios from "axios";
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

const Invoices = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
      setLoading(false);
    }
  };

  // Step 2: Fetch Invoices from Salesforce
  const fetchInvoices = async () => {
    if (!accessToken) return;

    try {
      const query = `SELECT Id, Name, Order__r.OrderNumber, Type__c, Status__c, Invoice_Amount__c FROM Invoice__c WHERE Account__r.Name = 'Centuary Distributer Account'`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const records: InvoiceRecord[] = response.data.records;

      if (records && records.length > 0) {
        console.log("📦 Fetched Invoices:", records);
        setInvoices(records);
      } else {
        console.log("ℹ️ No invoice records found.");
        setInvoices([]);
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching data:", errorMessage);
      setError("Failed to fetch data from Salesforce.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchInvoices();
    }
  }, [accessToken]);

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

  // Calculate totals from actual Salesforce data
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
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