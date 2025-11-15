import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  IndianRupee,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Plus,
  Users,
  BarChart3,
  Store,
  Calendar,
  Clock,
  Eye,
  Truck,
  MessageCircle,
  FileText
} from 'lucide-react';

interface RetailDashboardProps {
  onNavigate: (screen: string) => void;
}

export function RetailDashboard({ onNavigate }: RetailDashboardProps) {
  const todayStats = {
    sales: { total: 18650, transactions: 47, avgBill: 396 },
    stockValue: 285400,
    lowStockItems: 12,
    profit: 4250,
    customers: { total: 43, new: 8, returning: 35 }
  };

  const quickActions = [
    { 
      id: 'billing', 
      label: 'New Bill', 
      icon: ShoppingCart, 
      color: 'bg-primary',
      description: 'Start new sale'
    },
    { 
      id: 'stock', 
      label: 'Add Stock', 
      icon: Package, 
      color: 'bg-blue-500',
      description: 'Update inventory'
    },
    { 
      id: 'reports', 
      label: 'View Reports', 
      icon: BarChart3, 
      color: 'bg-purple-500',
      description: 'Sales analytics'
    },
    { 
      id: 'suppliers', 
      label: 'Suppliers', 
      icon: Truck, 
      color: 'bg-orange-500',
      description: 'Manage suppliers'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      customer: 'Rajesh Kumar',
      items: 5,
      amount: 450,
      time: '2 min ago',
      paymentMethod: 'UPI'
    },
    {
      id: 2,
      customer: 'Priya Sharma',
      items: 8,
      amount: 320,
      time: '15 min ago',
      paymentMethod: 'Cash'
    },
    {
      id: 3,
      customer: 'Amit Singh',
      items: 3,
      amount: 180,
      time: '32 min ago',
      paymentMethod: 'Card'
    }
  ];

  const lowStockItems = [
    { name: 'Rice (1kg)', currentStock: 5, minStock: 20, category: 'Grocery' },
    { name: 'Milk (1L)', currentStock: 8, minStock: 25, category: 'Dairy' },
    { name: 'Bread', currentStock: 3, minStock: 15, category: 'Bakery' },
    { name: 'Sugar (1kg)', currentStock: 2, minStock: 10, category: 'Grocery' }
  ];

  const topSellingItems = [
    { name: 'Tea (250g)', sold: 15, revenue: 1875 },
    { name: 'Biscuits', sold: 12, revenue: 960 },
    { name: 'Soft Drink', sold: 18, revenue: 720 },
    { name: 'Chips', sold: 8, revenue: 320 }
  ];

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-success-gradient rounded-2xl p-6 relative overflow-hidden card-hover">
        <div className="absolute top-4 right-4">
          <Store className="w-8 h-8 text-primary/30" />
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarFallback className="bg-primary text-white text-xl">
              🏪
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Good Morning!</h1>
            <p className="text-muted-foreground">Welcome back to Sharma General Store</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Calendar className="w-3 h-3 mr-1" />
                Today: {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center tap-zone">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Sales</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-primary">₹{todayStats.sales.total.toLocaleString()}</p>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">{todayStats.sales.transactions} transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center tap-zone">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-2xl font-bold text-blue-600">₹{(todayStats.stockValue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Total inventory</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center tap-zone">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-600">{todayStats.lowStockItems}</p>
                  <Badge variant="destructive" className="text-xs">
                    Alert
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Items need reorder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center tap-zone">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Profit</p>
                <p className="text-2xl font-bold text-purple-600">₹{todayStats.profit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Net margin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-24 flex flex-col items-center gap-3 hover:shadow-lg transition-all border-2 hover:border-primary/50 tap-zone-large card-hover"
                onClick={() => onNavigate(action.id)}
              >
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="font-medium">{action.label}</span>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Transactions
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => onNavigate('billing')}>
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-accent/30 rounded-xl hover:bg-accent/50 transition-colors card-hover"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-white">
                        {transaction.customer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="text-sm text-muted-foreground">{transaction.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{transaction.amount}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {transaction.paymentMethod}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{transaction.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Low Stock Alerts
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => onNavigate('stock')}>
                <Package className="w-4 h-4 mr-2" />
                Manage Stock
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-warning-gradient rounded-xl border border-orange-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-700">{item.currentStock}/{item.minStock}</p>
                    <p className="text-xs text-orange-600">Need {item.minStock - item.currentStock} more</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Selling Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSellingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.sold} units sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">₹{item.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Business Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success-gradient rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Total Customers</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{todayStats.customers.total}</p>
                  <p className="text-xs text-muted-foreground">{todayStats.customers.new} new today</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-secondary-foreground" />
                  <span>Average Bill</span>
                </div>
                <p className="font-bold text-secondary-foreground">₹{todayStats.sales.avgBill}</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Profit Margin</span>
                </div>
                <p className="font-bold text-blue-600">
                  {Math.round((todayStats.profit / todayStats.sales.total) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}