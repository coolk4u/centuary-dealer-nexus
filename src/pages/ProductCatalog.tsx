
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Eye, Package, User } from "lucide-react";
import { toast } from "sonner";

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});

  // Mock customers data
  const customers = [
    { id: "CUS-001", name: "Retail Store A", contactPerson: "John Doe", location: "Mumbai" },
    { id: "CUS-002", name: "Retail Store B", contactPerson: "Jane Smith", location: "Delhi" },
    { id: "CUS-003", name: "Comfort Mattress House", contactPerson: "Raj Kumar", location: "Bangalore" },
    { id: "CUS-004", name: "Sleep Well Store", contactPerson: "Priya Sharma", location: "Chennai" },
    { id: "CUS-005", name: "Dream Sleep Center", contactPerson: "Amit Patel", location: "Pune" }
  ];

  const products = [
    {
      id: "MAT-001",
      name: "Centuary Ortho Plus Mattress",
      category: "Mattresses",
      price: 25000,
      mrp: 30000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["King Size", "Memory Foam", "10 Year Warranty"],
      description: "Premium orthopedic mattress with memory foam for superior comfort"
    },
    {
      id: "MAT-002", 
      name: "Centuary Memory Foam Deluxe",
      category: "Mattresses",
      price: 32000,
      mrp: 38000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Queen Size", "Memory Foam", "15 Year Warranty"],
      description: "Luxury memory foam mattress with temperature regulation"
    },
    {
      id: "MAT-003",
      name: "Centuary Spring Classic",
      category: "Mattresses", 
      price: 18000,
      mrp: 22000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Double Size", "Spring Coil", "8 Year Warranty"],
      description: "Traditional spring mattress with firm support"
    },
    {
      id: "MAT-004",
      name: "Centuary Latex Premium",
      category: "Mattresses",
      price: 45000,
      mrp: 52000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png", 
      specifications: ["King Size", "Natural Latex", "20 Year Warranty"],
      description: "Premium natural latex mattress for ultimate comfort"
    },
    {
      id: "PIL-001", 
      name: "Centuary Memory Pillow",
      category: "Pillows",
      price: 2500,
      mrp: 3000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Memory Foam", "Contour Support", "2 Year Warranty"],
      description: "Ergonomic memory foam pillow for better sleep posture"
    },
    {
      id: "PIL-002",
      name: "Centuary Latex Pillow",
      category: "Pillows",
      price: 3200,
      mrp: 4000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Natural Latex", "Breathable", "3 Year Warranty"],
      description: "Natural latex pillow with excellent breathability"
    },
    {
      id: "PIL-003",
      name: "Centuary Fiber Pillow Set",
      category: "Pillows",
      price: 1800,
      mrp: 2200,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Fiber Fill", "Set of 2", "1 Year Warranty"],
      description: "Soft fiber fill pillow set for everyday comfort"
    },
    {
      id: "ACC-001",
      name: "Mattress Protector Waterproof",
      category: "Accessories",
      price: 1500,
      mrp: 2000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Waterproof", "Breathable", "Queen Size"],
      description: "Waterproof mattress protector with breathable fabric"
    },
    {
      id: "ACC-002",
      name: "Bed Sheet Set Premium",
      category: "Accessories",
      price: 2800,
      mrp: 3500,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Cotton Blend", "King Size", "4 Piece Set"],
      description: "Premium cotton blend bed sheet set with pillow covers"
    },
    {
      id: "ACC-003",
      name: "Mattress Topper Memory Foam",
      category: "Accessories",
      price: 8500,
      mrp: 10000,
      image: "/lovable-uploads/f2b2c506-5276-470f-a8cb-bb893408756b.png",
      specifications: ["Memory Foam", "3 Inch Thickness", "Queen Size"],
      description: "Memory foam mattress topper for added comfort"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer first!");
      return;
    }
    
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
    
    const customer = customers.find(c => c.id === selectedCustomer);
    toast.success(`Product added to cart for ${customer?.name}!`);
  };

  const getCartQuantity = (productId: string) => cartItems[productId] || 0;

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
            <SelectItem value="Mattresses">Mattresses</SelectItem>
            <SelectItem value="Pillows">Pillows</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
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
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{product.description}</p>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Specifications:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.specifications.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 line-through">₹{product.mrp.toLocaleString()}</div>
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
                        onClick={() => addToCart(product.id)}
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

      {Object.keys(cartItems).length > 0 && (
        <div className="fixed bottom-4 right-4">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            onClick={() => window.location.href = '/cart'}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            View Cart ({Object.values(cartItems).reduce((a, b) => a + b, 0)})
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
