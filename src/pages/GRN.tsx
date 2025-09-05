import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, FileText } from "lucide-react";
import { toast } from "sonner";

interface GRNRecord {
  Id: string;
  Name: string;
  Order__r?: {
    OrderNumber: string;
  };
  Distributor_Account__r?: {
    Name: string;
  };
  GRN_Line_Items__r?: {
    records: Array<{
      Id: string;
      Quantity__c: number;
      Received__c: number;
      Product__c: string;
      Product__r?: {
        Name: string;
      };
      Total_Amount__c: number;
    }>;
  };
  GRN_Status__c: string;
}

interface ProcessedGRNRecord {
  id: string;
  grnNumber: string;
  orderNumber: string;
  supplier: string;
  totalItems: number;
  receivedItems: number;
  status: string;
  products: Array<{
    id: string;
    name: string;
    ordered: number;
    received: number;
    price: number;
  }>;
}

const GRN = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [grnRecords, setGrnRecords] = useState<ProcessedGRNRecord[]>([]);
  const [selectedGRN, setSelectedGRN] = useState<ProcessedGRNRecord | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      setError("Failed to fetch access token.");
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const token = await getAccessToken();
        if (token) {
          await fetchData(token);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize application.");
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchData = async (token: string) => {
    try {
      const query = `SELECT 
    Id, 
    Name,
    Order__r.OrderNumber,
    Distributor_Account__r.Name,
    CreatedDate,
    (SELECT Quantity__c, Received__c, Product__c, Product__r.Name, Total_Amount__c FROM GRN_Line_Items__r),
    GRN_Status__c
    FROM GRN__c
    WHERE CreatedDate = LAST_N_DAYS:7
    ORDER BY CreatedDate DESC
    LIMIT 1000`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      console.log("Fetching data from:", queryUrl);

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      console.log("API Response:", response.data);

      // Check if records exists and is an array
      if (!response.data.records || !Array.isArray(response.data.records)) {
        console.error("❌ Invalid response format - records is null or not an array");
        setError("No GRN records found or invalid response format.");
        setLoading(false);
        return;
      }

      const records: GRNRecord[] = response.data.records;

      if (records.length > 0) {
        console.log("📦 Fetched GRN Records:", records);

        // Transform the Salesforce data to match the UI structure
        const processedRecords: ProcessedGRNRecord[] = records.map(
          (record) => {
            // Extract line items safely
            const lineItems = record.GRN_Line_Items__r?.records || [];
            
            return {
              id: record.Id, // Using Salesforce Id as the unique identifier
              grnNumber: record.Name, // Using Name as the GRN number for display
              orderNumber: record.Order__r?.OrderNumber || "N/A",
              supplier: record.Distributor_Account__r?.Name || "Unknown Supplier",
              totalItems: lineItems.reduce(
                (sum, item) => sum + (item.Quantity__c || 0),
                0
              ),
              receivedItems: lineItems.reduce(
                (sum, item) => sum + (item.Received__c || 0),
                0
              ),
              status: record.GRN_Status__c || "Pending",
              products: lineItems.map((item) => ({
                id: item.Id || item.Product__c,
                name: item.Product__r?.Name || "Unknown Product",
                ordered: item.Quantity__c || 0,
                received: item.Received__c || 0,
                price: item.Total_Amount__c || 0,
              })),
            };
          }
        );

        console.log("📊 Processed Records:", processedRecords);
        setGrnRecords(processedRecords);
      } else {
        console.log("ℹ️ No GRN records found.");
        setError("No GRN records found for the last 7 days.");
      }
      setLoading(false);
    } catch (err: unknown) {
      console.error("❌ Full error object:", err);
      
      let errorMessage = "Unknown error occurred";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.[0]?.message || 
                      err.response?.data?.error_description || 
                      err.response?.statusText || 
                      err.message;
        console.error("❌ HTTP Status:", err.response?.status);
        console.error("❌ Response Data:", err.response?.data);
      }
      
      console.error("❌ Error fetching data:", errorMessage);
      setError(`Failed to fetch data from Salesforce: ${errorMessage}`);
      setLoading(false);
    }
  };

  const processGRN = (
    grnId: string,
    productId: string,
    receivedQty: number
  ) => {
    setGrnRecords((records) =>
      records.map((record) => {
        if (record.id === grnId) {
          const updatedProducts = record.products.map((product) =>
            product.id === productId
              ? { ...product, received: receivedQty }
              : product
          );
          const totalReceived = updatedProducts.reduce(
            (sum, p) => sum + p.received,
            0
          );
          return {
            ...record,
            products: updatedProducts,
            receivedItems: totalReceived,
            status:
              totalReceived === record.totalItems ? "Completed" : "Partial",
          };
        }
        return record;
      })
    );
    toast.success("GRN updated successfully!");
  };

  const updateInventoryStock = async (productId: string, receivedQty: number) => {
    if (!accessToken) {
      toast.error("No access token available");
      return;
    }

    try {
      const requestBody = {
        productId: productId,
        receivedQuantity: receivedQty
      };

      const response = await axios.post(
        "https://centuaryindia-dev-ed.develop.my.salesforce.com/services/apexrest/UpdateInventoryStock",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(`Inventory updated successfully! New stock: ${response.data.updatedStock}`);
      } else {
        toast.error(`Failed to update inventory: ${response.data.message}`);
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";
      toast.error(`Error updating inventory: ${errorMessage}`);
    }
  };

  const handleProcessGRN = (grnId: string, productId: string, receivedQty: number) => {
    processGRN(grnId, productId, receivedQty);
    updateInventoryStock(productId, receivedQty);
  };

  const retryFetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      if (accessToken) {
        await fetchData(accessToken);
      } else {
        const token = await getAccessToken();
        if (token) {
          await fetchData(token);
        }
      }
    } catch (error) {
      console.error("Retry failed:", error);
      setError("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading GRN data...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Button onClick={retryFetchData}>Retry</Button>
      </div>
    );
  }

  if (grnRecords.length === 0) {
    return (
      <div className="p-4">
        <div>No GRN records found.</div>
        <Button onClick={retryFetchData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">GRN Process</h1>
        <p className="text-gray-600">
          Good Receive Notes - Process incoming inventory
        </p>
      </div>

      <div className="grid gap-6">
        {grnRecords.map((grn) => (
          <Card key={grn.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {grn.grnNumber || grn.id}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Order: {grn.orderNumber}
                  </p>
                </div>
                <Badge
                  variant={
                    grn.status === "Completed"
                      ? "default"
                      : grn.status === "Partial"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {grn.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium">Supplier</p>
                  <p className="text-sm text-gray-600">{grn.supplier}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Items</p>
                  <p className="text-sm text-gray-600">{grn.totalItems}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Received Items</p>
                  <p className="text-sm text-gray-600">{grn.receivedItems}</p>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedGRN(grn)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Process GRN
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Process GRN - {grn.grnNumber || grn.id}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Ordered Qty</TableHead>
                          <TableHead>Received Qty</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grn.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.ordered}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max={product.ordered}
                                defaultValue={product.received}
                                className="w-20"
                                data-product={product.id}
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value) || 0;
                                  processGRN(grn.id, product.id, qty);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="default"
                                className="ml-2"
                                onClick={() => {
                                  const receivedInput = document.querySelector(`input[data-product="${product.id}"]`) as HTMLInputElement;
                                  const receivedQty = receivedInput ? parseInt(receivedInput.value) || 0 : 0;
                                  handleProcessGRN(grn.id, product.id, receivedQty);
                                }}
                              >
                                <Package className="h-4 w-4 mr-1" />
                                Process GRN
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

export default GRN;