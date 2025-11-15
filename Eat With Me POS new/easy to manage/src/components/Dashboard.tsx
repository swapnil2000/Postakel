import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  Smartphone, 
  Plus, 
  BarChart3, 
  Menu as MenuIcon, 
  Printer,
  IndianRupee,
  Users,
  Clock,
  ChefHat,
  QrCode,
  MessageCircle,
  UserCheck,
  Package
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const todayStats = {
    sales: 45670,
    orders: 127,
    cashAmount: 18900,
    upiAmount: 26770,
    avgOrderValue: 359
  };

  const quickActions = [
    { icon: Plus, label: 'New Order', action: () => onNavigate('pos'), color: 'bg-green-500' },
    { icon: Users, label: 'Table Manager', action: () => onNavigate('tables'), color: 'bg-blue-500' },
    { icon: ChefHat, label: 'Kitchen Display', action: () => onNavigate('kitchen'), color: 'bg-red-500' },
    { icon: QrCode, label: 'QR Ordering', action: () => onNavigate('qr-ordering'), color: 'bg-purple-500' },
    { icon: UserCheck, label: 'Customers', action: () => onNavigate('customers'), color: 'bg-pink-500' },
    { icon: Package, label: 'Inventory', action: () => onNavigate('inventory'), color: 'bg-indigo-500' },
    { icon: MenuIcon, label: 'Menu Manager', action: () => onNavigate('menu'), color: 'bg-orange-500' },
    { icon: BarChart3, label: 'Reports', action: () => onNavigate('reports'), color: 'bg-teal-500' },
    { icon: Users, label: 'Staff', action: () => onNavigate('staff'), color: 'bg-cyan-500' },
    { icon: MessageCircle, label: 'WhatsApp', action: () => {}, color: 'bg-green-600' },
    { icon: Printer, label: 'Settings', action: () => onNavigate('settings'), color: 'bg-gray-500' }
  ];

  return (
    <div className="flex-1 bg-background p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Good Evening!</h1>
          <p className="text-muted-foreground">Here's your restaurant overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live
          </Badge>
        </div>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Today's Sales</span>
              <TrendingUp size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <IndianRupee size={24} />
              <span className="text-3xl font-bold">{todayStats.sales.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-primary-foreground/80 mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-primary">
              <span>Total Orders</span>
              <ShoppingBag size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{todayStats.orders}</div>
            <p className="text-muted-foreground mt-1">Avg: ₹{todayStats.avgOrderValue}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200 md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-primary">Payment Split</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-green-600" />
                <span>Cash</span>
              </div>
              <span className="font-semibold">₹{todayStats.cashAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-blue-600" />
                <span>UPI/Card</span>
              </div>
              <span className="font-semibold">₹{todayStats.upiAmount.toLocaleString('en-IN')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-24 flex-col gap-3 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              onClick={action.action}
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                <action.icon size={24} />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-primary">
            <span>Recent Activity</span>
            <Clock size={20} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { time: '2:45 PM', action: 'Order #127 completed', amount: '₹456', status: 'success' },
            { time: '2:42 PM', action: 'Payment received', amount: '₹789', status: 'success' },
            { time: '2:38 PM', action: 'New order placed', amount: '₹234', status: 'info' },
            { time: '2:35 PM', action: 'Table 5 order', amount: '₹567', status: 'info' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
              <span className="font-semibold text-primary">{activity.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}