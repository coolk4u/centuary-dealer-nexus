import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ShoppingCart, Eye, Package } from "lucide-react";
import { toast } from "sonner";

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<string[]>([]);

  const products = [
    {
      id: "MAT-001",
      name: "Centuary Ortho Plus Mattress",
      category: "Mattresses",
      price: 25000,
      mrp: 30000,
      image: "/api/placeholder/300/200",
      specifications: ["King Size", "Memory Foam", "10 Year Warranty"],
      description: "Premium orthopedic mattress with memory foam"
    },
    {
      id: "PIL-001", 
      name: "Centuary Memory Pillow",
      category: "Pillows",
      price: 2500,
      mrp: 3000,
      image: "/api/placeholder/300/200", 
      specifications: ["Memory Foam", "Contour Support", "2 Year Warranty"],
      description: "Ergonomic memory foam pillow for better sleep"
    },
    {
      id: "ACC-001",
      name: "Mattress Protector",
      category: "Accessories",
      price: 1500,
      mrp: 2000,
      image: "/api/placeholder/300/200",
      specifications: ["Waterproof", "Breathable", "Queen Size"],
      description: "Waterproof mattress protector"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    setCartItems(prev => [...prev, productId]);
    toast.success("Product added to cart!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-gray-600">Browse and select products for your customers</p>
      </div>

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
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
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
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(product.id)}
                    disabled={cartItems.includes(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {cartItems.includes(product.id) ? "Added" : "Add"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
