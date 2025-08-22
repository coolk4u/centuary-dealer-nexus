
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, TrendingUp, Package, Users } from "lucide-react";

const Reports = () => {
  const reportTypes = [
    { name: "Sales Report", icon: TrendingUp, description: "Monthly and quarterly sales analysis" },
    { name: "Inventory Report", icon: Package, description: "Stock levels and movement analysis" },
    { name: "Customer Insights", icon: Users, description: "Customer purchase patterns and behavior" },
    { name: "Target vs Achievement", icon: BarChart3, description: "Performance tracking and analysis" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Business insights and analytical reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className="h-5 w-5" />
                {report.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
