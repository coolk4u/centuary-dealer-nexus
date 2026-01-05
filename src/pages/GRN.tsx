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

// Dummy data in JSON format
const DUMMY_GRN_DATA: GRNRecord[] = [
  {
    id: "GRN001",
    grnNumber: "GRN-2024-001",
    orderNumber: "ORD-2024-1001",
    supplier: "Global Electronics Inc.",
    totalItems: 45,
    receivedItems: 30,
    status: "Partial",
    products: [
      {
        id: "PROD001",
        name: "Laptop Pro 16",
        ordered: 10,
        received: 8,
        price: 120000,
      },
      {
        id: "PROD002",
        name: "Wireless Mouse",
        ordered: 25,
        received: 15,
        price: 2500,
      },
      {
        id: "PROD003",
        name: "USB-C Hub",
        ordered: 10,
        received: 7,
        price: 4500,
      },
    ],
  },
  {
    id: "GRN002",
    grnNumber: "GRN-2024-002",
    orderNumber: "ORD-2024-1002",
    supplier: "Office Supplies Co.",
    totalItems: 120,
    receivedItems: 120,
    status: "Completed",
    products: [
      {
        id: "PROD004",
        name: "Desk Chair",
        ordered: 20,
        received: 20,
        price: 7500,
      },
      {
        id: "PROD005",
        name: "Monitor 27-inch",
        ordered: 15,
        received: 15,
        price: 18000,
      },
      {
        id: "PROD006",
        name: "Keyboard",
        ordered: 35,
        received: 35,
        price: 3500,
      },
      {
        id: "PROD007",
        name: "Notebooks",
        ordered: 50,
        received: 50,
        price: 250,
      },
    ],
  },
  {
    id: "GRN003",
    grnNumber: "GRN-2024-003",
    orderNumber: "ORD-2024-1003",
    supplier: "Tech Gadgets Ltd.",
    totalItems: 75,
    receivedItems: 0,
    status: "Pending",
    products: [
      {
        id: "PROD008",
        name: "Smartphone X",
        ordered: 25,
        received: 0,
        price: 45000,
      },
      {
        id: "PROD009",
        name: "Bluetooth Earbuds",
        ordered: 30,
        received: 0,
        price: 5500,
      },
      {
        id: "PROD010",
        name: "Power Bank",
        ordered: 20,
        received: 0,
        price: 3000,
      },
    ],
  },
];

const GRN = () => {
  const [grnRecords, setGrnRecords] = useState<GRNRecord[]>([]);
  const [selectedGRN, setSelectedGRN] = useState<GRNRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call with timeout
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use dummy data
        setGrnRecords(DUMMY_GRN_DATA);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load GRN data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              totalReceived === record.totalItems ? "Completed" : 
              totalReceived > 0 ? "Partial" : "Pending",
          };
        }
        return record;
      })
    );
    toast.success("GRN updated successfully!");
  };

  const updateInventoryStock = async (productId: string, receivedQty: number) => {
    try {
      // Simulate API call to update inventory
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Inventory updated for product ${productId}! Quantity: ${receivedQty}`);
    } catch (err) {
      console.error("Error updating inventory:", err);
      toast.error("Failed to update inventory. Please try again.");
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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setGrnRecords(DUMMY_GRN_DATA);
      setLoading(false);
    } catch (error) {
      console.error("Retry failed:", error);
      setError("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading GRN data...</p>
        </div>
      </div>
    );
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
        <div className="text-gray-500 text-center py-8">No GRN records found.</div>
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
                    {grn.grnNumber}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Order: {grn.orderNumber}
                  </p>
                </div>
                <Badge
                  className={
                    grn.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : grn.status === "Partial"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
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
                    <DialogTitle>Process GRN - {grn.grnNumber}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Ordered Qty</TableHead>
                          <TableHead>Received Qty</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grn.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.ordered}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max={product.ordered}
                                defaultValue={product.received}
                                className="w-24"
                                data-product={product.id}
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value) || 0;
                                  const clampedQty = Math.min(Math.max(0, qty), product.ordered);
                                  e.target.value = clampedQty.toString();
                                  processGRN(grn.id, product.id, clampedQty);
                                }}
                              />
                            </TableCell>
                            <TableCell>₹{product.price.toLocaleString()}</TableCell>
                            <TableCell>₹{(product.received * product.price).toLocaleString()}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                  const receivedInput = document.querySelector(
                                    `input[data-product="${product.id}"]`
                                  ) as HTMLInputElement;
                                  const receivedQty = receivedInput
                                    ? parseInt(receivedInput.value) || 0
                                    : 0;
                                  handleProcessGRN(grn.id, product.id, receivedQty);
                                }}
                              >
                                <Package className="h-4 w-4 mr-1" />
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium">Total Received Items: {grn.receivedItems}</p>
                        <p className="text-sm text-gray-600">of {grn.totalItems} total</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Total Value: ₹{grn.products.reduce((sum, p) => sum + (p.received * p.price), 0).toLocaleString()}
                        </p>
                      </div>
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

export default GRN;
