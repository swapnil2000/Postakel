import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Users,
  Calendar,
  Download,
  Filter,
  Eye,
  Target,
  Award,
  Package,
  Scissors,
  Star,
  Clock,
  Percent
} from 'lucide-react';

export function SalonReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const overviewStats = {
    revenue: {
      total: 285600,
      growth: 12.5,
      services: 238400,
      products: 47200
    },
    appointments: {
      total: 456,
      completed: 423,
      cancelled: 18,
      noShow: 15,
      growth: 8.3
    },
    customers: {
      total: 289,
      new: 45,
      returning: 244,
      growth: 15.2
    },
    performance: {
      avgBill: 626,
      growth: 4.7,
      satisfaction: 4.8,
      repeatRate: 74
    }
  };

  const salesData = [
    { service: 'Hair Cut & Style', revenue: 45600, bookings: 38, avgPrice: 1200, growth: 8.2 },
    { service: 'Hair Color', revenue: 52500, bookings: 15, avgPrice: 3500, growth: 15.6 },
    { service: 'Facial Premium', revenue: 35200, bookings: 16, avgPrice: 2200, growth: 12.1 },
    { service: 'Body Massage', revenue: 32000, bookings: 16, avgPrice: 2000, growth: -2.4 },
    { service: 'Bridal Package', revenue: 51000, bookings: 6, avgPrice: 8500, growth: 25.8 },
    { service: 'Manicure', revenue: 22000, bookings: 22, avgPrice: 1000, growth: 5.3 }
  ];

  const staffPerformance = [
    { name: 'Maya Patel', revenue: 156000, services: 42, rating: 4.9, tips: 8500, efficiency: 95 },
    { name: 'Riya Singh', revenue: 120000, services: 38, rating: 4.8, tips: 6200, efficiency: 92 },
    { name: 'Deepa Kumar', revenue: 98000, services: 35, rating: 4.9, tips: 7800, efficiency: 98 },
    { name: 'Sunita Rao', revenue: 76000, services: 44, rating: 4.7, tips: 4200, efficiency: 88 }
  ];

  const paymentMethods = [
    { method: 'UPI', amount: 142800, percentage: 50, transactions: 228, growth: 18.5 },
    { method: 'Cash', amount: 85680, percentage: 30, transactions: 142, growth: -5.2 },
    { method: 'Card', amount: 57120, percentage: 20, transactions: 86, growth: 12.3 }
  ];

  const customerInsights = [
    { segment: 'VIP Customers', count: 28, revenue: 85600, avgBill: 3057, visits: 156 },
    { segment: 'Regular Customers', count: 156, revenue: 145200, avgBill: 931, visits: 389 },
    { segment: 'New Customers', count: 105, revenue: 54800, avgBill: 522, visits: 125 }
  ];

  const monthlyTrends = [
    { month: 'Aug', revenue: 245000, appointments: 387, customers: 234 },
    { month: 'Sep', revenue: 268000, appointments: 412, customers: 256 },
    { month: 'Oct', revenue: 289000, appointments: 438, customers: 278 },
    { month: 'Nov', revenue: 312000, appointments: 465, customers: 298 },
    { month: 'Dec', revenue: 285600, appointments: 456, customers: 289 }
  ];

  const exportOptions = [
    { format: 'PDF', icon: '📄', description: 'Professional PDF report' },
    { format: 'Excel', icon: '📊', description: 'Detailed Excel spreadsheet' },
    { format: 'Tally', icon: '💼', description: 'Tally format for accounting' },
    { format: 'CSV', icon: '📋', description: 'Raw data in CSV format' }
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Reports & Analytics
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <Button
                key={period.id}
                variant={selectedPeriod === period.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.id)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(overviewStats.revenue.total / 1000).toFixed(0)}k
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">+{overviewStats.revenue.growth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-2xl font-bold text-blue-600">{overviewStats.appointments.total}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-600">+{overviewStats.appointments.growth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customers</p>
                    <p className="text-2xl font-bold text-primary">{overviewStats.customers.total}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-xs text-primary">+{overviewStats.customers.growth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Bill</p>
                    <p className="text-2xl font-bold text-orange-600">₹{overviewStats.performance.avgBill}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-orange-600">+{overviewStats.performance.growth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-primary" />
                    <span>Services</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(overviewStats.revenue.services / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((overviewStats.revenue.services / overviewStats.revenue.total) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-secondary-foreground" />
                    <span>Products</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(overviewStats.revenue.products / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((overviewStats.revenue.products / overviewStats.revenue.total) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Revenue</span>
                    <span className="text-primary">₹{(overviewStats.revenue.total / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Completed</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{overviewStats.appointments.completed}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((overviewStats.appointments.completed / overviewStats.appointments.total) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Cancelled</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{overviewStats.appointments.cancelled}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((overviewStats.appointments.cancelled / overviewStats.appointments.total) * 100)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>No Show</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{overviewStats.appointments.noShow}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((overviewStats.appointments.noShow / overviewStats.appointments.total) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service-wise Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Scissors className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{service.service}</p>
                        <p className="text-sm text-muted-foreground">{service.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-medium">₹{(service.revenue / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">₹{service.avgPrice}</p>
                        <p className="text-xs text-muted-foreground">Avg Price</p>
                      </div>
                      <div className="text-center">
                        <div className={`flex items-center gap-1 ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {service.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">{Math.abs(service.growth)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Growth</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffPerformance.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{member.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-medium">₹{(member.revenue / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{member.services}</p>
                        <p className="text-xs text-muted-foreground">Services</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">₹{member.tips.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Tips</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{member.efficiency}%</p>
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {customerInsights.map((segment, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{segment.segment}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Count</p>
                      <p className="font-bold text-2xl text-primary">{segment.count}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-bold text-2xl text-secondary-foreground">
                        ₹{(segment.revenue / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg Bill</p>
                      <p className="font-medium">₹{segment.avgBill}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Visits</p>
                      <p className="font-medium">{segment.visits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IndianRupee className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{method.method}</p>
                        <p className="text-sm text-muted-foreground">{method.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-medium">₹{(method.amount / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">Amount</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{method.percentage}%</p>
                        <p className="text-xs text-muted-foreground">Share</p>
                      </div>
                      <div className="text-center">
                        <div className={`flex items-center gap-1 ${method.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {method.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-medium">{Math.abs(method.growth)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Growth</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyTrends.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="font-medium text-primary">{month.month}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="font-medium">₹{(month.revenue / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{month.appointments}</p>
                        <p className="text-xs text-muted-foreground">Appointments</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{month.customers}</p>
                        <p className="text-xs text-muted-foreground">Customers</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exportOptions.map((option) => (
              <Button
                key={option.format}
                variant="outline"
                className="h-20 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">{option.icon}</span>
                <div className="text-center">
                  <p className="font-medium">{option.format}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}