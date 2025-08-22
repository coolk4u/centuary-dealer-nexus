
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Package, FileText } from "lucide-react";
import { toast } from "sonner";

const GRN = () => {
  const [grnRecords, setGrnRecords] = useState([
    {
      id: "GRN-001",
      orderNumber: "PO-2024-001",
      supplier: "Centuary Manufacturing",
      totalItems: 5,
      receivedItems: 0,
      status: "Pending",
      products: [
        { id: "MAT-001", name: "Ortho Plus Mattress", ordered: 10, received: 0, price: 25000 },
        { id: "PIL-001", name: "Memory Pillow", ordered: 20, received: 0, price: 2500 },
      ]
    }
  ]);

  const [selectedGRN, setSelectedGRN] = useState<any>(null);

  const processGRN = (grnId: string, productId: string, receivedQty: number) => {
    setGrnRecords(records =>
      records.map(record => {
        if (record.id === grnId) {
          const updatedProducts = record.products.map(product =>
            product.id === productId
              ? { ...product, received: receivedQty }
              : product
          );
          const totalReceived = updatedProducts.reduce((sum, p) => sum + p.received, 0);
          return {
            ...record,
            products: updatedProducts,
            receivedItems: totalReceived,
            status: totalReceived === record.totalItems ? "Completed" : "Partial"
          };
        }
        return record;
      })
    );
    toast.success("GRN updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">GRN Process</h1>
        <p className="text-gray-600">Good Receive Notes - Process incoming inventory</p>
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
                  <p className="text-sm text-gray-600">Order: {grn.orderNumber}</p>
                </div>
                <Badge variant={
                  grn.status === "Completed" ? "default" :
                  grn.status === "Partial" ? "secondary" : "outline"
                }>
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
                <DialogContent className="max-w-4xl">
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
                                onChange={(e) => {
                                  const qty = parseInt(e.target.value) || 0;
                                  processGRN(grn.id, product.id, qty);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => processGRN(grn.id, product.id, product.ordered)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept All
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
