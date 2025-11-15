import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Printer, 
  FileText,
  Trash2,
  IndianRupee
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

export function POSBilling() {
  const [selectedCategory, setSelectedCategory] = useState('Starters');
  const [cart, setCart] = useState<CartItem[]>([]);

  const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Chinese'];

  const menuItems: MenuItem[] = [
    { id: '1', name: 'Paneer Tikka', price: 180, category: 'Starters', available: true },
    { id: '2', name: 'Chicken Tikka', price: 220, category: 'Starters', available: true },
    { id: '3', name: 'Veg Spring Roll', price: 120, category: 'Starters', available: false },
    { id: '4', name: 'Dal Makhani', price: 160, category: 'Main Course', available: true },
    { id: '5', name: 'Butter Chicken', price: 280, category: 'Main Course', available: true },
    { id: '6', name: 'Biryani', price: 250, category: 'Main Course', available: true },
    { id: '7', name: 'Gulab Jamun', price: 80, category: 'Desserts', available: true },
    { id: '8', name: 'Ice Cream', price: 90, category: 'Desserts', available: true },
    { id: '9', name: 'Masala Chai', price: 30, category: 'Beverages', available: true },
    { id: '10', name: 'Lassi', price: 60, category: 'Beverages', available: true },
    { id: '11', name: 'Hakka Noodles', price: 180, category: 'Chinese', available: true },
    { id: '12', name: 'Manchurian', price: 160, category: 'Chinese', available: true }
  ];

  const filteredItems = menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, increment: boolean) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + gst;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background">
      {/* Menu Section */}
      <div className="flex-1 p-4 space-y-4">
        {/* Categories */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-primary text-primary hover:bg-primary/10'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className={`border-0 shadow-md hover:shadow-lg transition-all duration-200 ${
                !item.available ? 'opacity-50' : 'cursor-pointer hover:scale-105'
              }`}
              onClick={() => item.available && addToCart(item)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-primary line-clamp-2">{item.name}</h4>
                  {!item.available && (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <IndianRupee size={16} className="text-primary" />
                    <span className="text-lg font-semibold text-primary">{item.price}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90"
                    disabled={!item.available}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 bg-card border-l border-border p-4">
        <Card className="h-full border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ShoppingCart size={20} />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            {/* Cart Items */}
            <ScrollArea className="flex-1 mb-4">
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No items in cart</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium truncate">{item.name}</h5>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <IndianRupee size={12} />
                          <span>{item.price} × {item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, false)}
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => updateQuantity(item.id, true)}
                        >
                          <Plus size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-8 h-8 p-0 ml-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Order Total */}
            {cart.length > 0 && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg text-primary">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-12 flex-col gap-1 border-green-200 text-green-700 hover:bg-green-50">
                    <Banknote size={18} />
                    <span className="text-xs">Cash</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex-col gap-1 border-blue-200 text-blue-700 hover:bg-blue-50">
                    <CreditCard size={18} />
                    <span className="text-xs">Card</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex-col gap-1 border-purple-200 text-purple-700 hover:bg-purple-50">
                    <Smartphone size={18} />
                    <span className="text-xs">UPI</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex-col gap-1 border-orange-200 text-orange-700 hover:bg-orange-50">
                    <FileText size={18} />
                    <span className="text-xs">Split</span>
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90">
                    <Printer className="mr-2" size={18} />
                    Print Invoice
                  </Button>
                  <Button variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary/5">
                    <FileText className="mr-2" size={18} />
                    Print KOT
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}