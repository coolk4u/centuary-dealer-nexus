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
import { CheckCircle, Package, FileText } from "lucide-react";
import { toast } from "sonner";

interface GRNRecord {
  Id: string;
  Name: string;
  Order__r: {
    OrderNumber: string;
  };
  Distributor_Account__r: {
    Name: string;
  };
  GRN_Line_Items__r: {
    records: Array<{
      Quantity__c: number;
      Received__c: number;
      Product__c: string;
      Product__r: {
        Name: string;
      };
      Total_Amount__c: number;
    }>;
  };
  GRN_Status__c: string;
}

interface ProcessedGRNRecord {
  id: string;
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

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
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

        const response = await axios.get(queryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const records: GRNRecord[] = response.data.records;

        if (records && records.length > 0) {
          console.log("📦 Fetched GRN Records:", records);

          // Transform the Salesforce data to match the UI structure
          const processedRecords: ProcessedGRNRecord[] = records.map(
            (record) => ({
              id: record.Name, // Using Name as id
              orderNumber: record.Order__r?.OrderNumber || "N/A",
              supplier:
                record.Distributor_Account__r?.Name || "Unknown Supplier", // Updated to use Distributor_Account__r.Name
              totalItems: record.GRN_Line_Items__r.records.reduce(
                (sum, item) => sum + item.Quantity__c,
                0
              ),
              receivedItems: record.GRN_Line_Items__r.records.reduce(
                (sum, item) => sum + (item.Received__c || 0),
                0
              ),
              status: record.GRN_Status__c || "Pending",
              products: record.GRN_Line_Items__r.records.map((item) => ({
                id: item.Product__c,
                name: item.Product__r.Name,
                ordered: item.Quantity__c,
                received: item.Received__c || 0,
                price: item.Total_Amount__c,
              })),
            })
          );

          setGrnRecords(processedRecords);
        } else {
          console.log("ℹ️ No GRN records found.");
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

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (grnRecords.length === 0) {
    return <div className="p-4">Loading GRN data...</div>;
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
                    {grn.id}
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
                    <DialogTitle>Process GRN - {grn.id}</DialogTitle>
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
                              {/* <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  processGRN(grn.id, product.id, product.ordered);
                                  updateInventoryStock(product.id, product.ordered);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept All
                              </Button> */}
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