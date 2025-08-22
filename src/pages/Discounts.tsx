
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Discounts = () => {
  const schemes = [
    { id: "SCH-001", name: "New Year Bonanza", discount: "15%", validTill: "2024-01-31", status: "Active" },
    { id: "SCH-002", name: "Volume Discount", discount: "10%", validTill: "2024-03-31", status: "Active" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discounts & Claims</h1>
        <p className="text-gray-600">Available discount schemes and claim management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <Card key={scheme.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{scheme.name}</CardTitle>
                <Badge>{scheme.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-600">{scheme.discount} OFF</p>
                <p className="text-sm text-gray-600">Valid till: {scheme.validTill}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Discounts;
