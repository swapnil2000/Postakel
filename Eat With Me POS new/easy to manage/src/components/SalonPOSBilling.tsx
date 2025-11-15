import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  User,
  Gift,
  Percent,
  IndianRupee,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
  MessageCircle,
  Calculator,
  Check,
  Star,
  Scissors,
  Package,
  Tag,
  Users
} from 'lucide-react';

export function SalonPOSBilling() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    { id: 1, name: 'Hair Cut & Style', price: 1200, duration: '45 min', category: 'Hair', type: 'service' },
    { id: 2, name: 'Hair Color', price: 3500, duration: '2.5 hours', category: 'Hair', type: 'service' },
    { id: 3, name: 'Luxury Facial', price: 2200, duration: '75 min', category: 'Skin', type: 'service' },
    { id: 4, name: 'Body Massage', price: 2000, duration: '60 min', category: 'Body', type: 'service' },
    { id: 5, name: 'Manicure', price: 1000, duration: '45 min', category: 'Nails', type: 'service' },
    { id: 6, name: 'Bridal Package', price: 8500, duration: '4 hours', category: 'Package', type: 'service' }
  ];

  const products = [
    { id: 101, name: 'Hair Serum Premium', price: 850, stock: 25, barcode: '123456789', category: 'Hair Care', type: 'product' },
    { id: 102, name: 'Face Cream SPF 30', price: 1200, stock: 18, barcode: '123456790', category: 'Skin Care', type: 'product' },
    { id: 103, name: 'Nail Polish Set', price: 600, stock: 32, barcode: '123456791', category: 'Nail Care', type: 'product' },
    { id: 104, name: 'Shampoo Organic', price: 950, stock: 15, barcode: '123456792', category: 'Hair Care', type: 'product' },
    { id: 105, name: 'Body Lotion', price: 750, stock: 22, barcode: '123456793', category: 'Body Care', type: 'product' }
  ];

  const customers = [
    { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', loyaltyPoints: 2280, totalVisits: 24 },
    { id: 2, name: 'Ananya Gupta', phone: '+91 98765 43211', loyaltyPoints: 1420, totalVisits: 16 },
    { id: 3, name: 'Kavya Reddy', phone: '+91 98765 43212', loyaltyPoints: 620, totalVisits: 8 }
  ];

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === item.type);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id && cartItem.type === item.type
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: number, type: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, type);
      return;
    }
    setCart(cart.map(item =>
      item.id === itemId && item.type === type
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (itemId: number, type: string) => {
    setCart(cart.filter(item => !(item.id === itemId && item.type === type)));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * discount) / 100;
  };

  const getLoyaltyDiscount = () => {
    return loyaltyPointsToRedeem * 1; // 1 point = ₹1
  };

  const getGSTAmount = () => {
    const taxableAmount = getSubtotal() - getDiscountAmount() - getLoyaltyDiscount();
    return taxableAmount * 0.18; // 18% GST
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() - getLoyaltyDiscount() + getGSTAmount();
  };

  const allItems = [...services, ...products].filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const processPayment = () => {
    if (!selectedCustomer || cart.length === 0 || !paymentMethod) {
      alert('Please select customer, add items to cart, and choose payment method');
      return;
    }
    
    // Process payment logic here
    alert(`Payment of ₹${getTotal().toFixed(2)} processed successfully via ${paymentMethod}`);
    
    // Reset cart
    setCart([]);
    setDiscount(0);
    setCouponCode('');
    setLoyaltyPointsToRedeem(0);
    setPaymentMethod('');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          POS Billing & Checkout
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="w-4 h-4 mr-2" />
            View Last Invoice
          </Button>
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Items Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-white">
                        {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {selectedCustomer.loyaltyPoints} points
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {selectedCustomer.totalVisits} visits
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search customer by name or phone..." className="pl-10" />
                  </div>
                  <div className="grid gap-2 max-h-48 overflow-y-auto">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-secondary-foreground text-white text-sm">
                              {customer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services & Products</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="services">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>

                <TabsContent value="services" className="space-y-3 mt-4">
                  {services
                    .filter(service => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => addToCart(service)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Scissors className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{service.category}</Badge>
                            <span className="text-xs text-muted-foreground">{service.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">₹{service.price}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="products" className="space-y-3 mt-4">
                  {products
                    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                            <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-secondary-foreground">₹{product.price}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Cart & Billing */}
        <div className="space-y-6">
          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={`${item.type}-${item.id}-${index}`} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id, item.type)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discounts & Loyalty */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Discounts & Loyalty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Discount %</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Percent className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>

              {selectedCustomer && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Redeem Points (Available: {selectedCustomer.loyaltyPoints})
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="0"
                      max={selectedCustomer.loyaltyPoints}
                      value={loyaltyPointsToRedeem}
                      onChange={(e) => setLoyaltyPointsToRedeem(Math.min(Number(e.target.value), selectedCustomer.loyaltyPoints))}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLoyaltyPointsToRedeem(selectedCustomer.loyaltyPoints)}
                    >
                      Max
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bill Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Bill Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-₹{getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              
              {loyaltyPointsToRedeem > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Loyalty Points</span>
                  <span>-₹{getLoyaltyDiscount().toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{getGSTAmount().toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{getTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote className="w-4 h-4 mr-2" />
                Cash
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Card
              </Button>
              <Button
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setPaymentMethod('upi')}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                UPI
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90"
              onClick={processPayment}
              disabled={cart.length === 0 || !selectedCustomer || !paymentMethod}
            >
              <Check className="w-4 h-4 mr-2" />
              Process Payment
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">
                <Receipt className="w-4 h-4 mr-2" />
                Print Invoice
              </Button>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}