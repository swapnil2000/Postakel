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
  Scan,
  User,
  Percent,
  IndianRupee,
  CreditCard,
  Smartphone,
  Banknote,
  Receipt,
  MessageCircle,
  Calculator,
  Check,
  Package,
  Tag,
  X
} from 'lucide-react';

export function RetailPOSBilling() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('percentage'); // percentage or amount
  const [gstIncluded, setGstIncluded] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);

  const products = [
    { 
      id: 1, 
      name: 'Basmati Rice 1kg', 
      price: 125, 
      stock: 50, 
      barcode: '8901030801234', 
      category: 'Grocery',
      unit: 'kg',
      gst: 5,
      image: '🍚'
    },
    { 
      id: 2, 
      name: 'Milk Full Cream 1L', 
      price: 65, 
      stock: 25, 
      barcode: '8901030812345', 
      category: 'Dairy',
      unit: 'litre',
      gst: 0,
      image: '🥛'
    },
    { 
      id: 3, 
      name: 'Bread White', 
      price: 25, 
      stock: 15, 
      barcode: '8901030823456', 
      category: 'Bakery',
      unit: 'piece',
      gst: 5,
      image: '🍞'
    },
    { 
      id: 4, 
      name: 'Sugar 1kg', 
      price: 45, 
      stock: 30, 
      barcode: '8901030834567', 
      category: 'Grocery',
      unit: 'kg',
      gst: 0,
      image: '🍬'
    },
    { 
      id: 5, 
      name: 'Tea Powder 250g', 
      price: 125, 
      stock: 20, 
      barcode: '8901030845678', 
      category: 'Beverage',
      unit: 'packet',
      gst: 5,
      image: '🍵'
    },
    { 
      id: 6, 
      name: 'Biscuits Pack', 
      price: 80, 
      stock: 40, 
      barcode: '8901030856789', 
      category: 'Snacks',
      unit: 'packet',
      gst: 12,
      image: '🍪'
    }
  ];

  const customers = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', address: 'Shop 15, Main Market' },
    { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', address: 'House 42, Green Colony' },
    { id: 3, name: 'Amit Singh', phone: '+91 98765 43212', address: 'Flat 201, Sunrise Apartments' }
  ];

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getGSTAmount = () => {
    if (!gstIncluded) return 0;
    return cart.reduce((total, item) => {
      const itemTotal = item.price * item.quantity;
      const gstAmount = (itemTotal * item.gst) / (100 + item.gst);
      return total + gstAmount;
    }, 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discount) / 100;
    }
    return discount;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery)
  );

  const processPayment = () => {
    if (cart.length === 0 || !paymentMethod) {
      alert('Please add items to cart and select payment method');
      return;
    }
    
    alert(`Payment of ₹${getTotal().toFixed(2)} processed successfully via ${paymentMethod}`);
    
    // Reset cart
    setCart([]);
    setDiscount(0);
    setSelectedCustomer(null);
    setPaymentMethod('');
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          POS Billing
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="tap-zone">
            <Receipt className="w-4 h-4 mr-2" />
            Last Bill
          </Button>
          <Button variant="outline" className="tap-zone">
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Product Search & List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Barcode Scanner */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by product name or scan barcode..."
                    className="pl-12 h-14 bg-input-background tap-zone text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="h-14 px-6 tap-zone-large border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Scan className="w-5 h-5 mr-2" />
                  Scan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Customer
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                  className="tap-zone"
                >
                  {selectedCustomer ? 'Change' : 'Select'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-white">
                        {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer(null)}
                    className="tap-zone"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : showCustomerSearch ? (
                <div className="space-y-3">
                  <Input placeholder="Search customer by name or phone..." className="h-12 tap-zone" />
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors tap-zone"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowCustomerSearch(false);
                        }}
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
                  <Button variant="outline" className="w-full tap-zone">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Customer
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No customer selected</p>
                  <p className="text-sm text-muted-foreground">Tap "Select" to choose customer</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border rounded-xl hover:bg-accent transition-colors cursor-pointer tap-zone card-hover"
                    onClick={() => addToCart(product)}
                  >
                    <div className="text-center space-y-3">
                      <div className="text-4xl mb-2">{product.image}</div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-primary text-lg">₹{product.price}</p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stock} {product.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">GST: {product.gst}%</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full tap-zone">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                  <p className="text-sm text-muted-foreground">Add products to start billing</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{item.image}</div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 tap-zone"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0 tap-zone"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 text-destructive hover:text-destructive tap-zone"
                          onClick={() => removeFromCart(item.id)}
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

          {/* Discount & GST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-primary" />
                Discount & Tax
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant={discountType === 'percentage' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDiscountType('percentage')}
                    className="tap-zone"
                  >
                    %
                  </Button>
                  <Button
                    variant={discountType === 'amount' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDiscountType('amount')}
                    className="tap-zone"
                  >
                    ₹
                  </Button>
                  <Input
                    type="number"
                    placeholder={discountType === 'percentage' ? '0%' : '₹0'}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="flex-1 h-10 tap-zone"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">GST Included</span>
                  <Button
                    variant={gstIncluded ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setGstIncluded(!gstIncluded)}
                    className="tap-zone"
                  >
                    {gstIncluded ? 'Yes' : 'No'}
                  </Button>
                </div>
              </div>
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
                  <span>Discount ({discountType === 'percentage' ? `${discount}%` : `₹${discount}`})</span>
                  <span>-₹{getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              
              {gstIncluded && getGSTAmount() > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>GST Included</span>
                  <span>₹{getGSTAmount().toFixed(2)}</span>
                </div>
              )}
              
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
                className="w-full justify-start h-12 tap-zone-large"
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote className="w-5 h-5 mr-3" />
                Cash Payment
              </Button>
              <Button
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                className="w-full justify-start h-12 tap-zone-large"
                onClick={() => setPaymentMethod('upi')}
              >
                <Smartphone className="w-5 h-5 mr-3" />
                UPI Payment
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="w-full justify-start h-12 tap-zone-large"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Card Payment
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-14 bg-primary hover:bg-primary/90 tap-zone-large text-lg font-medium"
              onClick={processPayment}
              disabled={cart.length === 0 || !paymentMethod}
            >
              <Check className="w-5 h-5 mr-2" />
              Complete Sale
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-12 tap-zone">
                <Receipt className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" className="h-12 tap-zone">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}