import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

const Cart = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  // Dummy customer data
  const customers = [
    { id: "CUS-001", name: "Standard Trading Company", location: "Jubilee Hills, Hyderabad" },
    { id: "CUS-002", name: "Sleepwell Showroom", location: "Banjara Hills, Hyderabad" },
    { id: "CUS-003", name: "Anu Furniture", location: "Kokapet, Hyderabad" },
    { id: "CUS-004", name: "The Comfort Korner", location: "Kondapur, Hyderabad" }
  ];

  // Dummy orders data for localStorage
  const dummyOrders = [
    {
      id: "ORD-001",
      customerId: "CUS-001",
      customerName: "Standard Trading Company",
      date: "2024-01-15",
      total: 125000,
      status: "Delivered",
      items: [
        { id: "PROD-001", name: "Premium Mattress", quantity: 2, price: 45000 },
        { id: "PROD-003", name: "Memory Foam Pillow", quantity: 4, price: 2500 }
      ]
    },
    {
      id: "ORD-002",
      customerId: "CUS-002",
      customerName: "Sleepwell Showroom",
      date: "2024-01-18",
      total: 89000,
      status: "Processing",
      items: [
        { id: "PROD-002", name: "Luxury Bed Frame", quantity: 1, price: 89000 }
      ]
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const updateDiscount = (id: string, discount: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, discount: Math.max(0, Math.min(100, discount)) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity * item.discount / 100), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const gst = (subtotal - discount) * 0.18; // 18% GST
    return subtotal - discount + gst;
  };

  const placeOrder = async () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }
    if (!paymentTerms) {
      toast.error("Please select payment terms");
      return;
    }
    if (!deliveryMode) {
      toast.error("Please select delivery mode");
      return;
    }
    
    setIsPlacingOrder(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the selected customer
      const customer = customers.find(c => c.id === selectedCustomer);
      if (!customer) {
        throw new Error("Selected customer not found");
      }
      
      // Create new order with dummy data
      const newOrder = {
        id: `ORD-${Date.now()}`,
        customerId: selectedCustomer,
        customerName: customer.name,
        date: new Date().toISOString().split('T')[0],
        total: calculateTotal(),
        status: "Processing",
        paymentTerms: paymentTerms,
        deliveryMode: deliveryMode,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount
        }))
      };
      
      // Save order to localStorage (simulating database)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      toast.success(`Order #${newOrder.id} created successfully!`);
      
      // Clear cart
      setCartItems([]);
      localStorage.removeItem('cartItems');
      
      // Reset form
      setSelectedCustomer("");
      setPaymentTerms("");
      setDeliveryMode("");
      
      navigate('/orders');
      
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 p-4">
        <div className="bg-gray-100 p-6 rounded-full">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">Your cart is empty</h1>
        <p className="text-gray-600 text-center">Add some products to your cart first</p>
        <Button onClick={() => navigate('/catalog')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-1">Review and place order on behalf of your customer</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 space-y-4">
          <Card>
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Cart Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Price: ₹{item.price.toLocaleString()}</p>
                      {item.mrp && item.mrp > item.price && (
                        <p className="text-xs sm:text-sm text-gray-500 line-through">MRP: ₹{item.mrp.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 w-7 p-0 sm:h-9 sm:w-9"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-7 w-7 p-0 sm:h-9 sm:w-9"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      
                      <div className="w-16 sm:w-20">
                        <Label htmlFor={`discount-${item.id}`} className="text-xs">Discount %</Label>
                        <Input
                          id={`discount-${item.id}`}
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => updateDiscount(item.id, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs sm:h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3">
                      <div className="text-right text-sm sm:text-base font-medium">
                        ₹{(item.price * item.quantity * (1 - item.discount/100)).toLocaleString()}
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="h-7 w-7 p-0 sm:h-9 sm:w-9"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Customer Selection */}
        <div className="w-full lg:w-1/3 space-y-4">
          <Card>
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Customer Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div>
                <Label>Selected Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="text-sm md:text-base">
                    <SelectValue placeholder="Choose customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id} className="text-sm md:text-base">
                        <div className="flex flex-col">
                          <span>{customer.name}</span>
                          <span className="text-xs text-gray-500">{customer.location}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment Terms</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger className="text-sm md:text-base">
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash on Delivery" className="text-sm md:text-base">Cash on Delivery</SelectItem>
                    <SelectItem value="30 Days Credit" className="text-sm md:text-base">30 Days Credit</SelectItem>
                    <SelectItem value="60 Days Credit" className="text-sm md:text-base">60 Days Credit</SelectItem>
                    <SelectItem value="Advance Payment" className="text-sm md:text-base">Advance Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Delivery Mode</Label>
                <Select value={deliveryMode} onValueChange={setDeliveryMode}>
                  <SelectTrigger className="text-sm md:text-base">
                    <SelectValue placeholder="Select delivery mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard Delivery" className="text-sm md:text-base">Standard Delivery</SelectItem>
                    <SelectItem value="Express Delivery" className="text-sm md:text-base">Express Delivery</SelectItem>
                    <SelectItem value="Store Pickup" className="text-sm md:text-base">Store Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600 text-sm sm:text-base">
                <span>Discount</span>
                <span>-₹{calculateDiscount().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>GST (18%)</span>
                <span>₹{((calculateSubtotal() - calculateDiscount()) * 0.18).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <Button 
                className="w-full mt-2 text-sm sm:text-base" 
                onClick={placeOrder}
                disabled={cartItems.length === 0 || isPlacingOrder}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
