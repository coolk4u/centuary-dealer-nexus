import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Eye, Package, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ProductRecord {
  Id: string;
  Name: string;
  Family: string;
  MRP__c: number;
  Prod_Img_Url__c: string;
  Description: string;
  Specifications__c: string;
  UnitPrice: number;
  Product2: {
    Id: string;
    Name: string;
    Family: string;
    MRP__c: number;
    Prod_Img_Url__c: string;
    Description: string;
    Specifications__c: string;
  };
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  mrp?: number;
  image?: string;
  category?: string;
}

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Mock customers data
  const customers = [
    { id: "CUS-001", name: "Standard Trading Company", contactPerson: "Dinesh Kumar", location: "Jubilee Hills, Hyderabad" },
    // { id: "CUS-002", name: "Sleepwell Showroom", contactPerson: "Rajesh K", location: "Banjara Hills, Hyderabad" },
    { id: "CUS-003", name: "Anu Furniture", contactPerson: "Satish Kumar", location: "Kokapet, Hyderabad" },
    { id: "CUS-004", name: "The Comfort Korner", contactPerson: "Bhanu Kumar", location: "Kondapur, Hyderabad"},
    // { id: "CUS-005", name: "Dream Sleep Center", contactPerson: "Amit Patel", location: "Pune" }
  ];

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

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
      return response.data.access_token;
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : "Unknown error occurred";
      
      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
      return null;
    }
  };

  const fetchProducts = async (token: string) => {
    try {
      const query = `SELECT 
    Product2.Id, 
    Product2.Name, 
    Product2.Family, 
    Product2.MRP__c, 
    Product2.Prod_Img_Url__c, 
    Product2.Description, 
    Product2.Specifications__c,
    UnitPrice
    FROM PricebookEntry
    WHERE Pricebook2.IsStandard = true
    AND IsActive = true
    AND Product2.IsActive = true
    AND Product2.Family IN ('Mattress', 'Pillow', 'Mat')
`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://centuaryindia-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const records: ProductRecord[] = response.data.records;

      if (records && records.length > 0) {
        console.log("📦 Fetched Products:", records);
        
        // Map the Salesforce data to the product format needed by the component
        const mappedProducts = records.map(record => ({
          id: record.Product2.Id,
          name: record.Product2.Name,
          category: record.Product2.Family,
          price: record.UnitPrice,
          mrp: record.Product2.MRP__c,
          image: record.Product2.Prod_Img_Url__c,
          specifications: record.Product2.Specifications__c ? 
            record.Product2.Specifications__c.split(';') : [],
          description: record.Product2.Description
        }));
        
        setProducts(mappedProducts);
      } else {
        console.log("ℹ️ No product records found.");
        setProducts([]);
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : "Unknown error occurred";
      
      console.error("❌ Error fetching data:", errorMessage);
      setError("Failed to fetch data from Salesforce.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = await getAccessToken();
      if (token) {
        await fetchProducts(token);
      }
    };
    
    initializeData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer first!");
      return;
    }
    
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // Add new product to cart
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        discount: 0,
        mrp: product.mrp,
        image: product.image,
        category: product.category
      };
      setCartItems([...cartItems, newCartItem]);
    }
    
    const customer = customers.find(c => c.id === selectedCustomer);
      toast.success(`Product added to cart for ${customer?.name}!`, {
    position: "top-right",
    duration: 2000,
  });
  };

  const getCartQuantity = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-gray-600">Browse and select products for your customers</p>
      </div>

      {/* Customer Selection */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
            <User className="h-5 w-5" />
            Select Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger className="w-full bg-white border-blue-200">
              <SelectValue placeholder="Choose a customer to place order for..." />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-sm text-gray-500">{customer.contactPerson} • {customer.location}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Mattress">Mattresses</SelectItem>
            <SelectItem value="Pillow">Pillows</SelectItem>
            <SelectItem value="Mat">Mats</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const cartQty = getCartQuantity(product.id);
          return (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Package className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{product.description}</p>
                
                {product.specifications && product.specifications.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Specifications:</div>
                    <div className="flex flex-wrap gap-1">
                      {product.specifications.map((spec: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">₹{product.price?.toLocaleString()}</div>
                    {product.mrp && (
                      <div className="text-sm text-gray-500 line-through">₹{product.mrp.toLocaleString()}</div>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      {cartQty > 0 && (
                        <Badge variant="default" className="bg-blue-600">
                          {cartQty}
                        </Badge>
                      )}
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(product)}
                        disabled={!selectedCustomer}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            View Cart ({totalCartItems})
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;