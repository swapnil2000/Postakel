import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee,
  Calendar,
  ShoppingBag,
  Users,
  Receipt
} from 'lucide-react';

export function Reports() {
  const [dateFilter, setDateFilter] = useState('today');
  const [activeTab, setActiveTab] = useState('sales');

  const salesData = [
    { name: 'Mon', sales: 4200, orders: 28 },
    { name: 'Tue', sales: 5100, orders: 34 },
    { name: 'Wed', sales: 3800, orders: 25 },
    { name: 'Thu', sales: 6200, orders: 41 },
    { name: 'Fri', sales: 7800, orders: 52 },
    { name: 'Sat', sales: 9200, orders: 61 },
    { name: 'Sun', sales: 8500, orders: 56 }
  ];

  const categoryData = [
    { name: 'Main Course', value: 45, color: '#1e40af' },
    { name: 'Starters', value: 25, color: '#3b82f6' },
    { name: 'Beverages', value: 15, color: '#60a5fa' },
    { name: 'Desserts', value: 10, color: '#93c5fd' },
    { name: 'Chinese', value: 5, color: '#dbeafe' }
  ];

  const topItems = [
    { name: 'Butter Chicken', quantity: 45, revenue: 12600 },
    { name: 'Biryani', quantity: 38, revenue: 9500 },
    { name: 'Paneer Tikka', quantity: 32, revenue: 5760 },
    { name: 'Dal Makhani', quantity: 28, revenue: 4480 },
    { name: 'Chicken Tikka', quantity: 25, revenue: 5500 }
  ];

  const todayStats = {
    totalSales: 45670,
    totalOrders: 127,
    avgOrderValue: 359,
    gstCollected: 8220,
    cashSales: 18900,
    digitalSales: 26770
  };

  const downloadReport = (format: 'pdf' | 'excel') => {
    // Mock download functionality
    console.log(`Downloading ${format} report for ${dateFilter}`);
  };

  return (
    <div className="flex-1 bg-background p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-primary">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track your restaurant performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2" size={16} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => downloadReport('pdf')}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <FileText className="mr-2" size={16} />
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => downloadReport('excel')}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <Download className="mr-2" size={16} />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <div className="flex items-center gap-1 mt-1">
                  <IndianRupee size={18} className="text-primary" />
                  <span className="text-xl font-bold text-primary">{todayStats.totalSales.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-green-600" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <span className="text-xl font-bold text-primary">{todayStats.totalOrders}</span>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-green-600" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order</p>
                <div className="flex items-center gap-1">
                  <IndianRupee size={16} className="text-primary" />
                  <span className="text-xl font-bold text-primary">{todayStats.avgOrderValue}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown size={12} className="text-red-600" />
                  <span className="text-xs text-red-600">-3%</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">GST Collected</p>
                <div className="flex items-center gap-1">
                  <IndianRupee size={16} className="text-primary" />
                  <span className="text-xl font-bold text-primary">{todayStats.gstCollected.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-green-600" />
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Receipt size={20} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="sales">Sales Summary</TabsTrigger>
          <TabsTrigger value="items">Item-wise Sales</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
          <TabsTrigger value="gst">GST Report</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'sales' ? `₹${value}` : value,
                      name === 'sales' ? 'Sales' : 'Orders'
                    ]}
                  />
                  <Bar dataKey="sales" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span>Cash Payments</span>
                  <div className="text-right">
                    <div className="font-semibold text-green-700">₹{todayStats.cashSales.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-green-600">41.4%</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span>Digital Payments</span>
                  <div className="text-right">
                    <div className="font-semibold text-blue-700">₹{todayStats.digitalSales.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-blue-600">58.6%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-primary">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Peak Hour</span>
                  <Badge className="bg-primary">7:30 PM - 8:30 PM</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Best Day</span>
                  <Badge variant="outline">Saturday</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Customer Satisfaction</span>
                  <Badge className="bg-green-500">4.7/5</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.quantity} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">₹{item.revenue.toLocaleString('en-IN')}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <span className="font-semibold">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">GST Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <h4 className="text-primary">CGST (9%)</h4>
                  <div className="text-2xl font-bold text-primary mt-2">₹4,110</div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <h4 className="text-primary">SGST (9%)</h4>
                  <div className="text-2xl font-bold text-primary mt-2">₹4,110</div>
                </div>
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                  <h4 className="text-primary">Total GST</h4>
                  <div className="text-2xl font-bold text-primary mt-2">₹8,220</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">GST Details</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <div className="flex justify-between">
                    <span>Taxable Amount:</span>
                    <span>₹45,670</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Rate:</span>
                    <span>18%</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Tax:</span>
                    <span>₹8,220</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}