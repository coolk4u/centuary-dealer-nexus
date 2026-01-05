import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Eye, Package, User } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  specifications: string[];
  description: string;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Dummy customers data
  const customers = [
    { id: "CUS-001", name: "Standard Trading Company", contactPerson: "Dinesh Kumar", location: "Jubilee Hills, Hyderabad" },
    { id: "CUS-003", name: "Anu Furniture", contactPerson: "Satish Kumar", location: "Kokapet, Hyderabad" },
    { id: "CUS-004", name: "The Comfort Korner", contactPerson: "Bhanu Kumar", location: "Kondapur, Hyderabad"},
  ];

  // Dummy products data in JSON format
  const dummyProducts: Product[] = [
    {
      id: "PROD-001",
      name: "Ortho Memory Foam Mattress",
      category: "Mattress",
      price: 12599,
      mrp: 15999,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop",
      specifications: ["Queen Size", "Memory Foam", "Orthopedic Support"],
      description: "Premium orthopedic mattress with memory foam for optimal back support and comfort."
    },
    {
      id: "PROD-002",
      name: "Gel Memory Foam Pillow",
      category: "Pillow",
      price: 1299,
      mrp: 1999,
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w-800&auto=format&fit=crop",
      specifications: ["Gel Infused", "Breathable", "Medium Firm"],
      description: "Cooling gel memory foam pillow that adapts to your head and neck shape."
    },
    {
      id: "PROD-003",
      name: "Yoga and Exercise Mat",
      category: "Mat",
      price: 899,
      mrp: 1299,
      image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w-800&auto=format&fit=crop",
      specifications: ["Non-slip", "6mm Thick", "Eco-friendly"],
      description: "High-density exercise mat with excellent cushioning and non-slip surface."
    },
    {
      id: "PROD-004",
      name: "Latex Hybrid Mattress",
      category: "Mattress",
      price: 18999,
      mrp: 22999,
      image: "https://images.unsplash.com/photo-1616627561954-5c0e5c9e1d6b?w-800&auto=format&fit=crop",
      specifications: ["King Size", "Latex + Pocket Springs", "Anti-bacterial"],
      description: "Hybrid mattress combining natural latex with pocket springs for perfect support."
    },
    {
      id: "PROD-005",
      name: "Buckwheat Hull Pillow",
      category: "Pillow",
      price: 1599,
      mrp: 2199,
      image: "https://images.unsplash.com/photo-1555041463-a403f8beb8d6?w-800&auto=format&fit=crop",
      specifications: ["Adjustable", "Hypoallergenic", "Natural Fill"],
      description: "Naturally adjustable pillow filled with buckwheat hulls for customized support."
    },
    {
      id: "PROD-006",
      name: "Sleeping Mat for Camping",
      category: "Mat",
      price: 1499,
      mrp: 1999,
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w-800&auto=format&fit=crop",
      specifications: ["Waterproof", "Insulated", "Compact"],
      description: "Portable insulated sleeping mat perfect for camping and outdoor activities."
    }
  ];

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Load selected customer from localStorage on component mount
  useEffect(() => {
    const savedCustomer = localStorage.getItem('selectedCustomer');
    if (savedCustomer) {
      setSelectedCustomer(savedCustomer);
    }
  }, []);

  // Initialize products with dummy data
  useEffect(() => {
    // Simulate API loading delay
    const timer = setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save selected customer to localStorage whenever it changes
  useEffect(() => {
    if (selectedCustomer) {
      localStorage.setItem('selectedCustomer', selectedCustomer);
    }
  }, [selectedCustomer]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
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
                      {product.specifications.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">₹{product.price.toLocaleString()}</div>
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

      {/* No products found message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

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
