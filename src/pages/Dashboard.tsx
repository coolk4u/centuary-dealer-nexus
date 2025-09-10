import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ShoppingCart, Package, Target, Users, AlertCircle, ArrowUp, ArrowDown, BarChart3 } from "lucide-react";
const Dashboard = () => {
  const kpiData = [{
    title: "Monthly Sales",
    value: "₹12.45L",
    change: "+12.3%",
    changeType: "increase",
    subtitle: "vs last month",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-600"
  }, {
    title: "Orders Pending",
    value: "23",
    change: "-5.2%",
    changeType: "decrease",
    subtitle: "awaiting approval",
    icon: ShoppingCart,
    color: "from-blue-500 to-indigo-600"
  }, {
    title: "Stock Value",
    value: "₹8.67L",
    change: "+2.1%",
    changeType: "increase",
    subtitle: "current inventory",
    icon: Package,
    color: "from-purple-500 to-violet-600"
  }, {
    title: "Target Achievement",
    value: "87.5%",
    change: "+15.2%",
    changeType: "increase",
    subtitle: "this quarter",
    icon: Target,
    color: "from-orange-500 to-red-600"
  }];
  const topProducts = [{
    rank: 1,
    name: "Ortho Plus Mattress",
    sales: "₹2,25,000",
    units: "45 units sold",
    growth: "+15%"
  }, {
    rank: 2,
    name: "Memory Foam Deluxe",
    sales: "₹1,92,000",
    units: "32 units sold",
    growth: "+8%"
  }, {
    rank: 3,
    name: "Spring Classic",
    sales: "₹1,40,000",
    units: "28 units sold",
    growth: "+12%"
  }, {
    rank: 4,
    name: "Premium Pillow Set",
    sales: "₹84,000",
    units: "35 units sold",
    growth: "+22%"
  }];
  const recentActivities = [{
    type: "order",
    message: "New order #ORD-2024-156 from Retail Store A",
    time: "2 hours ago",
    urgent: false
  }, {
    type: "stock",
    message: "Low stock alert: Memory Foam Pillow",
    time: "4 hours ago",
    urgent: true
  }, {
    type: "customer",
    message: "New customer registration: Dream Sleep Center",
    time: "6 hours ago",
    urgent: false
  }, {
    type: "payment",
    message: "Payment received for invoice #INV-2024-089",
    time: "1 day ago",
    urgent: false
  }];
  return <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Centuary Distributer. Here's what's happening with your dealership.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r ${kpi.color} p-4`}>
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <p className="text-white/80 text-sm mx-0">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-white/80" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {kpi.changeType === "increase" ? <ArrowUp className="h-4 w-4 text-green-600" /> : <ArrowDown className="h-4 w-4 text-red-600" />}
                      <span className={`font-medium ${kpi.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                        {kpi.change}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{kpi.subtitle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Overview
            </CardTitle>
            <p className="text-sm text-gray-600">Your sales performance over the last 6 months</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[3.0, 2.8, 3.5, 4.2, 3.8, 4.5].map((height, index) => <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t" style={{
                height: `${height * 40}px`
              }} />
                  <span className="text-xs text-gray-500 mt-2">
                    {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                </div>)}
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
              <span>₹3.0L</span>
              <span>₹4.5L</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <p className="text-sm text-gray-600">Best selling mattresses this month</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map(product => <div key={product.rank} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {product.rank}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.units}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.sales}</p>
                  <p className="text-sm text-green-600">{product.growth}</p>
                </div>
              </div>)}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Activities
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${activity.urgent ? 'bg-red-500' : 'bg-blue-500'}`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                {activity.urgent && <Badge variant="destructive" className="text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Urgent
                  </Badge>}
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default Dashboard;