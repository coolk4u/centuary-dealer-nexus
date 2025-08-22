
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PriceList = () => {
  const priceList = [
    { id: "MAT-001", name: "Centuary Ortho Plus Mattress", mrp: 30000, dealerPrice: 25000, margin: "16.7%" },
    { id: "PIL-001", name: "Centuary Memory Pillow", mrp: 3000, dealerPrice: 2500, margin: "16.7%" },
    { id: "ACC-001", name: "Mattress Protector", mrp: 2000, dealerPrice: 1500, margin: "25%" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Price List & Schemes</h1>
        <p className="text-gray-600">Current pricing and promotional schemes</p>
      </div>

      <div className="space-y-4">
        {priceList.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">MRP</p>
                    <p className="font-bold">₹{item.mrp.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Dealer Price</p>
                    <p className="font-bold text-green-600">₹{item.dealerPrice.toLocaleString()}</p>
                  </div>
                  <Badge variant="secondary">{item.margin} Margin</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PriceList;
