import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react";

interface InventoryRecord {
  Id: string;
  Name: string;
  Product__r: {
    Name: string;
  };
  Category__c: string;
  Current_Stock__c: number;
  Status__c: string;
  Minimum_Stock__c: number;
  Unit_Price__c: number;
  Inventory_Value__c: number;
}

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryRecord[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";
      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
    }
  };

  // Step 2: Fetch Inventory Data
  const fetchInventoryData = async () => {
    if (!accessToken) return;

    try {
      const query = `SELECT Id, Name, Product__r.Name, Category__c, Current_Stock__c, Status__c, Minimum_Stock__c, Unit_Price__c, Inventory_Value__c FROM Inventory__c where Distributor_Name__r.Name = 'Centuary Distributer Account'`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const records: InventoryRecord[] = response.data.records;
      setInventoryItems(records);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";
      console.error("❌ Error fetching data:", errorMessage);
      setError("Failed to fetch data from Salesforce.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchInventoryData();
    }
  }, [accessToken]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good": return "default";
      case "Low Stock": return "destructive";
      case "Ageing": return "secondary";
      default: return "outline";
    }
  };

  const getStockLevel = (closing: number, reorderLevel: number) => {
    return (closing / (reorderLevel * 3)) * 100;
  };

  // Calculate summary statistics
  const totalItems = inventoryItems.reduce((sum, item) => sum + (item.Current_Stock__c || 0), 0);
  const lowStockItems = inventoryItems.filter(item => 
    item.Status__c === "Low Stock" || (item.Current_Stock__c || 0) <= (item.Minimum_Stock__c || 0)
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading inventory data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Track your stock levels and movements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{inventoryItems.length}</div>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-sm text-gray-600">Total Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">
                  {inventoryItems.reduce((sum, item) => sum + (item.Inventory_Value__c || 0), 0).toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Inventory Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{lowStockItems}</div>
                <p className="text-sm text-gray-600">Low Stock Alert</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items */}
      <div className="space-y-4">
        {inventoryItems.map((item) => (
          <Card key={item.Id}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                <div className="lg:col-span-2">
                  <h3 className="font-semibold">{item.Product__r?.Name || item.Name}</h3>
                  <p className="text-sm text-gray-600">{item.Category__c}</p>
                  <Badge variant={getStatusColor(item.Status__c)} className="mt-1">
                    {item.Status__c}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Unit Price</p>
                  <p className="font-bold">₹{item.Unit_Price__c?.toFixed(2)}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Min Stock</p>
                  <p className="font-bold">{item.Minimum_Stock__c}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Stock</p>
                  <p className="font-bold">{item.Current_Stock__c}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Stock Level</p>
                    <p className="font-bold">{item.Current_Stock__c}</p>
                  </div>
                  <Progress 
                    value={getStockLevel(item.Current_Stock__c || 0, item.Minimum_Stock__c || 1)} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Reorder at {item.Minimum_Stock__c}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inventory;