import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  QrCode, 
  Smartphone, 
  ShoppingCart, 
  Plus, 
  Minus, 
  IndianRupee,
  Clock,
  Star,
  Utensils,
  Coffee,
  Cake,
  Share2,
  Download,
  Settings
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating: number;
  spiceLevel: number;
  estimatedTime: number;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

export function QROrdering() {
  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Butter Chicken',
      description: 'Creamy tomato-based curry with tender chicken pieces',
      price: 320,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
      category: 'Main Course',
      isVeg: false,
      rating: 4.5,
      spiceLevel: 2,
      estimatedTime: 25,
      available: true
    },
    {
      id: '2',
      name: 'Paneer Tikka Masala',
      description: 'Grilled paneer cubes in rich aromatic gravy',
      price: 280,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
      category: 'Main Course',
      isVeg: true,
      rating: 4.3,
      spiceLevel: 3,
      estimatedTime: 20,
      available: true
    },
    {
      id: '3',
      name: 'Garlic Naan',
      description: 'Soft bread with garlic and butter',
      price: 60,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
      category: 'Breads',
      isVeg: true,
      rating: 4.7,
      spiceLevel: 1,
      estimatedTime: 10,
      available: true
    },
    {
      id: '4',
      name: 'Masala Chai',
      description: 'Traditional Indian spiced tea',
      price: 40,
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
      category: 'Beverages',
      isVeg: true,
      rating: 4.8,
      spiceLevel: 2,
      estimatedTime: 5,
      available: true
    },
    {
      id: '5',
      name: 'Gulab Jamun',
      description: 'Sweet milk dumplings in sugar syrup',
      price: 80,
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
      category: 'Desserts',
      isVeg: true,
      rating: 4.6,
      spiceLevel: 0,
      estimatedTime: 5,
      available: true
    }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [tableNumber, setTableNumber] = useState('5');
  const [customerName, setCustomerName] = useState('');
  const [showQRSettings, setShowQRSettings] = useState(false);

  const categories = ['All', 'Main Course', 'Breads', 'Beverages', 'Desserts'];

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getSpiceIndicator = (level: number) => {
    if (level === 0) return '';
    return '🌶️'.repeat(level);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Main Course': return <Utensils className="w-4 h-4" />;
      case 'Beverages': return <Coffee className="w-4 h-4" />;
      case 'Desserts': return <Cake className="w-4 h-4" />;
      default: return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">QR Code Ordering</h1>
          <p className="text-muted-foreground">Manage table QR codes and online orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowQRSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            QR Settings
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download QR Codes
          </Button>
        </div>
      </div>

      {/* QR Code Management */}
      <Tabs defaultValue="customer-view" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customer-view">Customer View</TabsTrigger>
          <TabsTrigger value="qr-management">QR Management</TabsTrigger>
          <TabsTrigger value="online-orders">Online Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer-view" className="space-y-4">
          {/* Customer Interface Simulation */}
          <Card className="border-2 border-dashed border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Customer Mobile View - Table {tableNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {/* Restaurant Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Royal Biryani</h2>
                <p className="text-muted-foreground">Authentic Indian Cuisine</p>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">4.5</span>
                  </div>
                  <span className="text-sm text-muted-foreground">• Table {tableNumber}</span>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    {category !== 'All' && getCategoryIcon(category)}
                    {category}
                  </Button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredItems.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <Badge variant={item.isVeg ? "outline" : "secondary"} className="text-xs">
                            {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{item.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.estimatedTime} min</span>
                          </div>
                          {item.spiceLevel > 0 && (
                            <span>{getSpiceIndicator(item.spiceLevel)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-bold text-primary">₹{item.price}</div>
                        {getItemQuantity(item.id) > 0 ? (
                          <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {getItemQuantity(item.id)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => addToCart(item)}
                            className="h-8"
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <Card className="mt-4 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        <span className="font-semibold">Your Order ({getTotalItems()} items)</span>
                      </div>
                      <div className="font-bold text-primary">₹{getTotalAmount()}</div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Customer name (optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                      <Button className="w-full" size="lg">
                        Place Order • ₹{getTotalAmount()}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qr-management" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(tableNum => (
              <Card key={tableNum} className="p-4 text-center">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Table {tableNum}</h3>
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                    <QrCode className="w-24 h-24 mx-auto text-gray-400" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="online-orders" className="space-y-4">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Order #QR001</h3>
                  <p className="text-sm text-muted-foreground">Table 5 • 2:30 PM</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">₹890</div>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Butter Chicken × 2</span>
                  <span>₹640</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Garlic Naan × 3</span>
                  <span>₹180</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Masala Chai × 2</span>
                  <span>₹80</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">Accept</Button>
                <Button variant="outline" size="sm" className="flex-1">Reject</Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Order #QR002</h3>
                  <p className="text-sm text-muted-foreground">Table 3 • 2:25 PM</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">₹450</div>
                  <Badge className="bg-green-500">Confirmed</Badge>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Paneer Tikka Masala × 1</span>
                  <span>₹280</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Garlic Naan × 2</span>
                  <span>₹120</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gulab Jamun × 1</span>
                  <span>₹80</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">Send to Kitchen</Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* QR Settings Dialog */}
      <Dialog open={showQRSettings} onOpenChange={setShowQRSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input id="restaurantName" defaultValue="Royal Biryani" />
            </div>
            <div>
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input id="baseUrl" defaultValue="https://menu.royalbiryani.com" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" defaultValue="Authentic Indian Cuisine" />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" defaultValue="+91 98765 43210" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">Save Settings</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowQRSettings(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}