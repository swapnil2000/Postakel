import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users,
  Search,
  Plus,
  Star,
  Gift,
  MessageCircle,
  Send,
  Calendar,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  Heart,
  Crown,
  Trophy,
  Clock,
  TrendingUp,
  Filter
} from 'lucide-react';

export function SalonCRM() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const customers = [
    {
      id: 1,
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@email.com',
      gender: 'Female',
      birthday: '1992-03-15',
      joinDate: '2023-01-15',
      totalVisits: 24,
      totalSpent: 45600,
      loyaltyPoints: 2280,
      lastVisit: '2024-01-10',
      status: 'VIP',
      preferredServices: ['Hair Color', 'Facial'],
      visitHistory: [
        { date: '2024-01-10', services: ['Hair Cut', 'Hair Color'], amount: 3200 },
        { date: '2023-12-28', services: ['Facial Premium'], amount: 2000 },
        { date: '2023-12-15', services: ['Hair Cut'], amount: 800 }
      ],
      notes: 'Prefers natural hair colors. Allergic to sulfates.',
      nextSuggestedVisit: '2024-02-10'
    },
    {
      id: 2,
      name: 'Ananya Gupta',
      phone: '+91 98765 43211',
      email: 'ananya.gupta@email.com',
      gender: 'Female',
      birthday: '1988-07-22',
      joinDate: '2023-06-10',
      totalVisits: 16,
      totalSpent: 28400,
      loyaltyPoints: 1420,
      lastVisit: '2024-01-05',
      status: 'Regular',
      preferredServices: ['Facial', 'Massage'],
      visitHistory: [
        { date: '2024-01-05', services: ['Facial Classic', 'Manicure'], amount: 1800 },
        { date: '2023-12-20', services: ['Full Body Massage'], amount: 1800 },
        { date: '2023-12-05', services: ['Pedicure'], amount: 800 }
      ],
      notes: 'Books appointments mostly on weekends.',
      nextSuggestedVisit: '2024-02-05'
    },
    {
      id: 3,
      name: 'Kavya Reddy',
      phone: '+91 98765 43212',
      email: 'kavya.reddy@email.com',
      gender: 'Female',
      birthday: '1995-11-08',
      joinDate: '2023-09-20',
      totalVisits: 8,
      totalSpent: 12400,
      loyaltyPoints: 620,
      lastVisit: '2023-12-30',
      status: 'New',
      preferredServices: ['Hair Cut', 'Nails'],
      visitHistory: [
        { date: '2023-12-30', services: ['Hair Cut', 'Hair Style'], amount: 1200 },
        { date: '2023-12-10', services: ['Manicure', 'Pedicure'], amount: 1400 },
        { date: '2023-11-25', services: ['Hair Cut'], amount: 800 }
      ],
      notes: 'New customer, very interested in nail art.',
      nextSuggestedVisit: '2024-01-30'
    }
  ];

  const loyaltyTiers = [
    { name: 'Bronze', minSpent: 0, maxSpent: 10000, color: 'bg-amber-100 text-amber-800', icon: '🥉' },
    { name: 'Silver', minSpent: 10000, maxSpent: 25000, color: 'bg-gray-100 text-gray-800', icon: '🥈' },
    { name: 'Gold', minSpent: 25000, maxSpent: 50000, color: 'bg-yellow-100 text-yellow-800', icon: '🥇' },
    { name: 'Platinum', minSpent: 50000, maxSpent: Infinity, color: 'bg-purple-100 text-purple-800', icon: '👑' }
  ];

  const getCustomerTier = (totalSpent: number) => {
    return loyaltyTiers.find(tier => totalSpent >= tier.minSpent && totalSpent < tier.maxSpent) || loyaltyTiers[0];
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'vip') return matchesSearch && customer.status === 'VIP';
    if (activeTab === 'new') return matchesSearch && customer.status === 'New';
    if (activeTab === 'regular') return matchesSearch && customer.status === 'Regular';
    
    return matchesSearch;
  });

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.status === 'VIP').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpentPerCustomer = Math.round(totalRevenue / totalCustomers);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Customer CRM & Loyalty
        </h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VIP Customers</p>
                <p className="text-2xl font-bold text-primary">{vipCustomers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-foreground rounded-xl flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-foreground">₹{(totalRevenue / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Spent</p>
                <p className="text-2xl font-bold text-orange-600">₹{avgSpentPerCustomer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Customer Database</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name or phone..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({totalCustomers})</TabsTrigger>
                  <TabsTrigger value="vip">VIP ({vipCustomers})</TabsTrigger>
                  <TabsTrigger value="regular">Regular</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredCustomers.map((customer) => {
                  const tier = getCustomerTier(customer.totalSpent);
                  return (
                    <div
                      key={customer.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                        selectedCustomer?.id === customer.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-white">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{customer.name}</h3>
                            <Badge className={tier.color} variant="secondary">
                              {tier.icon} {tier.name}
                            </Badge>
                            {customer.status === 'VIP' && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {customer.totalVisits} visits
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              ₹{customer.totalSpent.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Gift className="w-3 h-3" />
                              {customer.loyaltyPoints} pts
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">
                            Last visit: {new Date(customer.lastVisit).toLocaleDateString()}
                          </p>
                          <Badge variant={customer.status === 'VIP' ? 'default' : 'secondary'} className="text-xs">
                            {customer.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Detail Panel */}
        <div>
          {selectedCustomer ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getCustomerTier(selectedCustomer.totalSpent).color} variant="secondary">
                          {getCustomerTier(selectedCustomer.totalSpent).icon} {getCustomerTier(selectedCustomer.totalSpent).name}
                        </Badge>
                        {selectedCustomer.status === 'VIP' && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(selectedCustomer.birthday).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedCustomer.gender}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-3 bg-accent/50 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{selectedCustomer.totalVisits}</p>
                      <p className="text-xs text-muted-foreground">Total Visits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-secondary-foreground">₹{(selectedCustomer.totalSpent / 1000).toFixed(1)}k</p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-500">{selectedCustomer.loyaltyPoints}</p>
                      <p className="text-xs text-muted-foreground">Loyalty Points</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Preferred Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.preferredServices.map((service: string) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground bg-accent/30 p-2 rounded">
                      {selectedCustomer.notes}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Gift className="w-4 h-4 mr-2" />
                      Send Offer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Visit History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Visits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCustomer.visitHistory.map((visit: any, index: number) => (
                      <div key={index} className="p-3 bg-accent/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">{new Date(visit.date).toLocaleDateString()}</p>
                          <p className="font-medium text-primary">₹{visit.amount}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {visit.services.map((service: string) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-pink-500" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-sm">Suggested Next Visit</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedCustomer.nextSuggestedVisit).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-sm">Recommended Services</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">Hair Treatment</Badge>
                      <Badge variant="outline" className="text-xs">Facial</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-pink-500 hover:bg-pink-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Next Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a customer to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}