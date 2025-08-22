
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, Users, Target, AlertTriangle, CheckCircle } from "lucide-react";

const Dashboard = () => {
  const kpis = [
    { title: "Monthly Sales", value: "₹12,45,000", change: "+15%", icon: TrendingUp, trend: "up" },
    { title: "Stock Value", value: "₹3,25,000", change: "-5%", icon: Package, trend: "down" },
    { title: "Active Customers", value: "156", change: "+8%", icon: Users, trend: "up" },
    { title: "Target Achievement", value: "78%", change: "+12%", icon: Target, trend: "up" },
  ];

  const pendingTasks = [
    { id: 1, task: "Process GRN for Order #1234", priority: "high", type: "GRN" },
    { id: 2, task: "Update customer billing address", priority: "medium", type: "Customer" },
    { id: 3, task: "Generate invoice for Order #1235", priority: "high", type: "Invoice" },
    { id: 4, task: "Register warranty for Product #ABC123", priority: "low", type: "Warranty" },
  ];

  const recentOrders = [
    { id: "ORD-001", customer: "Retail Store A", amount: "₹45,000", status: "Pending" },
    { id: "ORD-002", customer: "Retail Store B", amount: "₹32,000", status: "Approved" },
    { id: "ORD-003", customer: "Retail Store C", amount: "₹28,000", status: "Dispatched" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Target Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Target Progress</CardTitle>
            <CardDescription>Your sales performance this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Sales Target</span>
                <span>₹12,45,000 / ₹16,00,000</span>
              </div>
              <Progress value={78} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Volume Target</span>
                <span>156 / 200 units</span>
              </div>
              <Progress value={78} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {task.priority === 'high' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.type}</p>
                    </div>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest orders from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <Badge variant={
                    order.status === 'Pending' ? 'secondary' :
                    order.status === 'Approved' ? 'default' : 'outline'
                  }>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
