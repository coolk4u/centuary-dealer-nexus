
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Targets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Targets & Achievements</h1>
        <p className="text-gray-600">Track your sales performance and targets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Achieved</span>
                <span>₹12,45,000 / ₹16,00,000</span>
              </div>
              <Progress value={78} />
              <p className="text-sm text-gray-600">78% Complete - 5 days remaining</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Units Sold</span>
                <span>156 / 200 units</span>
              </div>
              <Progress value={78} />
              <p className="text-sm text-gray-600">78% Complete</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Targets;
