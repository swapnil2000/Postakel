import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Calendar, 
  DollarSign, 
  Award, 
  MessageCircle,
  Edit,
  Star,
  Gift,
  TrendingUp
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit: string;
  joinDate: string;
  whatsappOptIn: boolean;
  birthDate?: string;
  anniversary?: string;
  preferences: string[];
  orderHistory: Order[];
}

interface Order {
  id: string;
  date: string;
  items: string[];
  amount: number;
  table: number;
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Rajesh Sharma',
      phone: '+91 98765 43210',
      email: 'rajesh@email.com',
      totalOrders: 15,
      totalSpent: 12500,
      loyaltyPoints: 250,
      lastVisit: '2024-01-15',
      joinDate: '2023-06-15',
      whatsappOptIn: true,
      birthDate: '1985-08-20',
      preferences: ['Spicy', 'Vegetarian'],
      orderHistory: [
        { id: 'ORD001', date: '2024-01-15', items: ['Butter Chicken', 'Naan'], amount: 850, table: 5 },
        { id: 'ORD002', date: '2024-01-10', items: ['Biryani', 'Raita'], amount: 650, table: 3 }
      ]
    },
    {
      id: '2',
      name: 'Priya Kumar',
      phone: '+91 87654 32109',
      email: 'priya@email.com',
      totalOrders: 8,
      totalSpent: 6800,
      loyaltyPoints: 136,
      lastVisit: '2024-01-12',
      joinDate: '2023-09-10',
      whatsappOptIn: false,
      anniversary: '2020-12-05',
      preferences: ['Mild Spice', 'South Indian'],
      orderHistory: [
        { id: 'ORD003', date: '2024-01-12', items: ['Masala Dosa', 'Coffee'], amount: 320, table: 2 }
      ]
    },
    {
      id: '3',
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      totalOrders: 22,
      totalSpent: 18200,
      loyaltyPoints: 364,
      lastVisit: '2024-01-14',
      joinDate: '2023-03-20',
      whatsappOptIn: true,
      birthDate: '1990-03-15',
      preferences: ['Non-Vegetarian', 'Chinese'],
      orderHistory: [
        { id: 'ORD004', date: '2024-01-14', items: ['Chicken Manchurian', 'Fried Rice'], amount: 950, table: 8 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 20000) return { tier: 'Diamond', color: 'bg-purple-500' };
    if (totalSpent >= 10000) return { tier: 'Gold', color: 'bg-yellow-500' };
    if (totalSpent >= 5000) return { tier: 'Silver', color: 'bg-gray-400' };
    return { tier: 'Bronze', color: 'bg-orange-600' };
  };

  const stats = {
    totalCustomers: customers.length,
    loyalCustomers: customers.filter(c => c.totalOrders >= 10).length,
    totalLoyaltyPoints: customers.reduce((sum, c) => sum + c.loyaltyPoints, 0),
    whatsappOptIns: customers.filter(c => c.whatsappOptIn).length
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Customer Management</h1>
          <p className="text-muted-foreground">Manage customers and loyalty program</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter customer name" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" placeholder="customer@email.com" />
              </div>
              <div>
                <Label htmlFor="birth">Date of Birth (Optional)</Label>
                <Input id="birth" type="date" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="whatsapp" />
                <Label htmlFor="whatsapp">WhatsApp Marketing Opt-in</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Save Customer</Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search customers by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalCustomers}</div>
          <div className="text-sm text-muted-foreground">Total Customers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.loyalCustomers}</div>
          <div className="text-sm text-muted-foreground">Loyal Customers</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.totalLoyaltyPoints}</div>
          <div className="text-sm text-muted-foreground">Total Points</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.whatsappOptIns}</div>
          <div className="text-sm text-muted-foreground">WhatsApp Opt-ins</div>
        </Card>
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => {
          const tier = getCustomerTier(customer.totalSpent);
          return (
            <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{customer.name}</h3>
                        <Badge className={`${tier.color} text-white`}>
                          {tier.tier}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last visit: {customer.lastVisit}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{customer.totalOrders}</div>
                        <div className="text-xs text-muted-foreground">Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Spent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{customer.loyaltyPoints}</div>
                        <div className="text-xs text-muted-foreground">Points</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {customer.whatsappOptIn && (
                        <Badge variant="outline" className="text-green-600">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          WhatsApp
                        </Badge>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Customer Details - {customer.name}</DialogTitle>
                          </DialogHeader>
                          
                          <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="profile">Profile</TabsTrigger>
                              <TabsTrigger value="orders">Order History</TabsTrigger>
                              <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="profile" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Name</Label>
                                  <Input defaultValue={customer.name} />
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <Input defaultValue={customer.phone} />
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <Input defaultValue={customer.email} />
                                </div>
                                <div>
                                  <Label>Date of Birth</Label>
                                  <Input type="date" defaultValue={customer.birthDate} />
                                </div>
                              </div>
                              
                              <div>
                                <Label>Preferences</Label>
                                <div className="flex gap-2 mt-2">
                                  {customer.preferences.map((pref, index) => (
                                    <Badge key={index} variant="outline">{pref}</Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Switch id="whatsapp" defaultChecked={customer.whatsappOptIn} />
                                <Label htmlFor="whatsapp">WhatsApp Marketing Opt-in</Label>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="orders" className="space-y-4">
                              <div className="space-y-3">
                                {customer.orderHistory.map((order) => (
                                  <Card key={order.id} className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium">{order.id}</div>
                                        <div className="text-sm text-muted-foreground">{order.date}</div>
                                        <div className="text-sm">Table {order.table}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-bold text-primary">₹{order.amount}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {order.items.join(', ')}
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="loyalty" className="space-y-4">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-600">{customer.loyaltyPoints}</div>
                                <div className="text-muted-foreground">Available Points</div>
                              </div>
                              
                              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium">Redeem Points</div>
                                    <div className="text-sm text-muted-foreground">100 points = ₹10 discount</div>
                                  </div>
                                  <Button variant="outline">
                                    <Gift className="w-4 h-4 mr-2" />
                                    Redeem
                                  </Button>
                                </div>
                              </Card>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Points earned this month:</span>
                                  <span className="font-medium">45 points</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Points redeemed:</span>
                                  <span className="font-medium">120 points</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Next tier requirement:</span>
                                  <span className="font-medium">₹2,000 more</span>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}