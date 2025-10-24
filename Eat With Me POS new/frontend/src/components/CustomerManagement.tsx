import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  TrendingUp,
  Send,
  Filter,
  UserCheck,
  RefreshCw,
  Info
} from 'lucide-react';

// Using ExtendedCustomer interface from AppContext

export function CustomerManagement() {
  const { 
    settings,
    extendedCustomers,
    addExtendedCustomer,
    updateExtendedCustomer,
    deleteExtendedCustomer,
    getCustomerOrderHistory,
    updateCustomerStats,
    syncAllCustomers,
    reservations,
    orders,
    tables
  } = useAppContext();

  const token = localStorage.getItem('token') || '';
  const restaurantId = localStorage.getItem('restaurantId') || '';
  const [customers, setCustomers] = useState([]);
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showMarketingDialog, setShowMarketingDialog] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  
  // Marketing filters
  const [marketingFilters, setMarketingFilters] = useState({
    minOrders: '',
    minSpent: '',
    tier: 'all',
    lastVisitDays: '',
    whatsappOptIn: true,
    hasBirthday: false,
    hasAnniversary: false
  });

  const [marketingMessage, setMarketingMessage] = useState('');
  const [selectedCustomersForMarketing, setSelectedCustomersForMarketing] = useState<string[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/customers?restaurantId=${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCustomers(await res.json());
    };

    fetchCustomers();
  }, [token, restaurantId]);

  const filteredCustomers = extendedCustomers.filter(customer => 
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

  const getFilteredCustomersForMarketing = () => {
    return extendedCustomers.filter(customer => {
      const tier = getCustomerTier(customer.totalSpent);
      const daysSinceLastVisit = Math.floor((new Date().getTime() - new Date(customer.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
      
      if (marketingFilters.minOrders && customer.visitCount < parseInt(marketingFilters.minOrders)) return false;
      if (marketingFilters.minSpent && customer.totalSpent < parseInt(marketingFilters.minSpent)) return false;
      if (marketingFilters.tier && marketingFilters.tier !== 'all' && tier.tier !== marketingFilters.tier) return false;
      if (marketingFilters.lastVisitDays && daysSinceLastVisit < parseInt(marketingFilters.lastVisitDays)) return false;
      if (marketingFilters.whatsappOptIn && !customer.whatsappOptIn) return false;
      if (marketingFilters.hasBirthday && !customer.birthDate) return false;
      if (marketingFilters.hasAnniversary && !customer.anniversary) return false;
      
      return true;
    });
  };

  const handleSendMarketingMessage = () => {
    const selectedCustomers = selectedCustomersForMarketing.length > 0 
      ? extendedCustomers.filter(c => selectedCustomersForMarketing.includes(c.id))
      : getFilteredCustomersForMarketing();
    
    if (selectedCustomers.length === 0) {
      alert('No customers selected or match the filters.');
      return;
    }

    selectedCustomers.forEach(customer => {
      const extendedCustomer = extendedCustomers.find(ec => ec.id === customer.id);
      if (extendedCustomer?.whatsappOptIn) {
        const personalizedMessage = marketingMessage.replace('{name}', customer.name).replace('{points}', (extendedCustomer.loyaltyPoints || 0).toString());
        const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(personalizedMessage)}`;
        window.open(whatsappUrl, '_blank');
      }
    });

    alert(`Marketing message sent to ${selectedCustomers.filter(c => extendedCustomers.find(ec => ec.id === c.id)?.whatsappOptIn).length} customers via WhatsApp!`);
    setShowMarketingDialog(false);
    setMarketingMessage('');
    setSelectedCustomersForMarketing([]);
  };

  const stats = {
    totalCustomers: extendedCustomers.length,
    basicCustomers: customers.length,
    loyalCustomers: extendedCustomers.filter(c => c.visitCount >= 10).length,
    totalLoyaltyPoints: extendedCustomers.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0),
    whatsappOptIns: extendedCustomers.filter(c => c.whatsappOptIn).length
  };

  const handleSyncCustomers = async () => {
    setSyncInProgress(true);
    try {
      syncAllCustomers();
      setLastSyncTime(new Date().toLocaleString());
      alert(`Synchronized customers from ${reservations.length} reservations, ${orders.length} orders, and ${tables.filter(t => t.status === 'occupied' || t.status === 'reserved').length} tables with customer data.`);
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Synchronization failed. Please try again.');
    } finally {
      setSyncInProgress(false);
    }
  };

  // Debug information
  const debugInfo = {
    reservationsWithCustomers: reservations.filter(r => r.customerName && r.customerPhone).length,
    ordersWithCustomers: orders.filter(o => o.customerName && o.customerPhone).length,
    tablesWithCustomers: tables.filter(t => 
      (t.status === 'occupied' && t.customer) || 
      (t.status === 'reserved' && t.reservationName && t.reservationPhone)
    ).length,
    totalCustomers: extendedCustomers.length,
    basicCustomers: customers.length,
    lastSync: lastSyncTime
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Customer Management</h1>
            <p className="text-muted-foreground">Manage customers, loyalty program, and marketing</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="whitespace-nowrap"
            >
              <Info className="w-4 h-4 mr-2" />
              Debug Info
            </Button>
            <Button
              variant="outline"
              onClick={handleSyncCustomers}
              disabled={syncInProgress}
              className="whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
              {syncInProgress ? 'Syncing...' : 'Manual Sync'}
            </Button>
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
              <DialogDescription>
                Add a new customer to your database with their contact information and preferences.
              </DialogDescription>
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
        </div>

        {/* Debug Information */}
        {showDebugInfo && (
          <Card className="p-4 bg-muted/20 border-dashed">
            <CardHeader className="px-0 pt-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Info className="w-4 h-4" />
                Customer Synchronization Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reservations with customers:</span>
                  <span className="font-medium">{debugInfo.reservationsWithCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Orders with customers:</span>
                  <span className="font-medium">{debugInfo.ordersWithCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tables with customers:</span>
                  <span className="font-medium">{debugInfo.tablesWithCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extended customers:</span>
                  <span className="font-medium text-primary">{debugInfo.totalCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basic customers:</span>
                  <span className="font-medium">{debugInfo.basicCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last manual sync:</span>
                  <span className="font-medium text-xs">{debugInfo.lastSync || 'Never'}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-dashed text-xs text-muted-foreground">
                <p>• Extended customers include synchronized data from reservations, orders, and tables</p>
                <p>• Basic customers are from the core customer database</p>
                <p>• Auto-sync runs when reservations, orders, or table data changes</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <UserCheck size={16} />
            Customers
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <MessageCircle size={16} />
            Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
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
                            <div className="text-lg font-bold text-primary">{customer.visitCount}</div>
                            <div className="text-xs text-muted-foreground">Visits</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">₹{customer.totalSpent.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Total Spent</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-600">{customer.loyaltyPoints || 0}</div>
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
                                <DialogDescription>
                                  View and edit customer information, order history, and loyalty program details.
                                </DialogDescription>
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
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">WhatsApp Marketing</h3>
              <p className="text-muted-foreground">Send promotional messages to customers who have opted in</p>
            </div>
            <Button onClick={() => setShowMarketingDialog(true)}>
              <Send className="w-4 h-4 mr-2" />
              Send Campaign
            </Button>
          </div>

          {/* Marketing Filters */}
          <Card className="p-4">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Customer Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="minOrders">Min Orders</Label>
                  <Input
                    id="minOrders"
                    type="number"
                    placeholder="e.g., 5"
                    value={marketingFilters.minOrders}
                    onChange={(e) => setMarketingFilters(prev => ({ ...prev, minOrders: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="minSpent">Min Amount Spent</Label>
                  <Input
                    id="minSpent"
                    type="number"
                    placeholder="e.g., 5000"
                    value={marketingFilters.minSpent}
                    onChange={(e) => setMarketingFilters(prev => ({ ...prev, minSpent: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="tier">Customer Tier</Label>
                  <Select 
                    value={marketingFilters.tier}
                    onValueChange={(value) => setMarketingFilters(prev => ({ ...prev, tier: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lastVisitDays">Days since last visit</Label>
                  <Input
                    id="lastVisitDays"
                    type="number"
                    placeholder="e.g., 30"
                    value={marketingFilters.lastVisitDays}
                    onChange={(e) => setMarketingFilters(prev => ({ ...prev, lastVisitDays: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="whatsappOptIn" 
                    checked={marketingFilters.whatsappOptIn}
                    onCheckedChange={(checked) => setMarketingFilters(prev => ({ ...prev, whatsappOptIn: !!checked }))}
                  />
                  <Label htmlFor="whatsappOptIn">WhatsApp Opt-in only</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasBirthday" 
                    checked={marketingFilters.hasBirthday}
                    onCheckedChange={(checked) => setMarketingFilters(prev => ({ ...prev, hasBirthday: !!checked }))}
                  />
                  <Label htmlFor="hasBirthday">Has birthday info</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasAnniversary" 
                    checked={marketingFilters.hasAnniversary}
                    onCheckedChange={(checked) => setMarketingFilters(prev => ({ ...prev, hasAnniversary: !!checked }))}
                  />
                  <Label htmlFor="hasAnniversary">Has anniversary info</Label>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">{getFilteredCustomersForMarketing().length}</span> customers match the current filters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filtered Customers Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Filtered Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {getFilteredCustomersForMarketing().map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedCustomersForMarketing.includes(customer.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCustomersForMarketing(prev => [...prev, customer.id]);
                          } else {
                            setSelectedCustomersForMarketing(prev => prev.filter(id => id !== customer.id));
                          }
                        }}
                      />
                      <span className="font-medium">{customer.name}</span>
                      <Badge className={`${getCustomerTier(customer.totalSpent).color} text-white text-xs`}>
                        {getCustomerTier(customer.totalSpent).tier}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customer.totalOrders} orders • ₹{customer.totalSpent.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Message Dialog */}
          <Dialog open={showMarketingDialog} onOpenChange={setShowMarketingDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Marketing Campaign</DialogTitle>
                <DialogDescription>
                  Create and send WhatsApp marketing messages to selected customers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">Message Template</Label>
                  <Textarea
                    id="message"
                    placeholder="Hi {name}! We miss you at RestaurantPOS. Use code WELCOME10 for 10% off your next order. You have {points} loyalty points to use!"
                    value={marketingMessage}
                    onChange={(e) => setMarketingMessage(e.target.value)}
                    className="min-h-20"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use {'{name}'} for customer name and {'{points}'} for loyalty points
                  </p>
                </div>

                <div className="bg-muted/50 p-3 rounded">
                  <p className="text-sm">
                    Will send to: <span className="font-medium">
                      {selectedCustomersForMarketing.length > 0 
                        ? `${selectedCustomersForMarketing.length} selected customers`
                        : `${getFilteredCustomersForMarketing().filter(c => c.whatsappOptIn).length} customers (filtered + WhatsApp opt-in)`
                      }
                    </span>
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleSendMarketingMessage}
                    disabled={!marketingMessage.trim()}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Messages
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMarketingDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}