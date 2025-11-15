import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Calendar,
  Users,
  IndianRupee,
  UserPlus,
  Clock,
  Scissors,
  Gift,
  BarChart3,
  Package,
  CalendarPlus,
  MessageCircle,
  TrendingUp,
  Star,
  Heart,
  Sparkles
} from 'lucide-react';

interface SalonDashboardProps {
  onNavigate: (screen: string) => void;
}

export function SalonDashboard({ onNavigate }: SalonDashboardProps) {
  const todayStats = {
    appointments: { total: 24, completed: 18, upcoming: 6, cancelled: 2 },
    customers: { total: 156, new: 8, returning: 12 },
    revenue: { total: 45600, services: 38200, products: 7400 },
    walkIns: 12
  };

  const upcomingAppointments = [
    {
      id: 1,
      customer: 'Priya Sharma',
      service: 'Hair Color & Cut',
      time: '2:30 PM',
      staff: 'Maya',
      duration: '2h',
      status: 'confirmed'
    },
    {
      id: 2,
      customer: 'Ananya Gupta',
      service: 'Facial & Cleanup',
      time: '3:00 PM',
      staff: 'Riya',
      duration: '1.5h',
      status: 'confirmed'
    },
    {
      id: 3,
      customer: 'Kavya Reddy',
      service: 'Full Body Massage',
      time: '4:30 PM',
      staff: 'Deepa',
      duration: '1h',
      status: 'waiting'
    }
  ];

  const quickActions = [
    { id: 'booking', label: 'New Booking', icon: CalendarPlus, color: 'bg-primary' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'bg-secondary-foreground' },
    { id: 'promotions', label: 'Promotions', icon: Gift, color: 'bg-pink-500' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'bg-blue-500' },
    { id: 'products', label: 'Product Sales', icon: Package, color: 'bg-orange-500' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' }
  ];

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-appointment-gradient rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Sparkles className="w-8 h-8 text-primary/30" />
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarFallback className="bg-primary text-white text-xl">
              ✨
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Good Afternoon!</h1>
            <p className="text-muted-foreground">Welcome back to Glamour Studio</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">Premium Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-primary">{todayStats.appointments.total}</p>
                  <Badge variant="secondary" className="text-xs">
                    +{todayStats.appointments.upcoming} upcoming
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-foreground rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-secondary-foreground">{todayStats.customers.total}</p>
                  <Badge variant="outline" className="text-xs border-secondary-foreground text-secondary-foreground">
                    +{todayStats.customers.new} new
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-blue-600">₹{(todayStats.revenue.total / 1000).toFixed(1)}k</p>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Walk-ins</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-600">{todayStats.walkIns}</p>
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
                    Today
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                onClick={() => onNavigate(action.id)}
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onNavigate('calendar')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-white">
                      {appointment.customer.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.customer}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {appointment.staff}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{appointment.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{appointment.time}</p>
                  <Badge 
                    variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-primary" />
                  <span>Services</span>
                </div>
                <span className="font-medium">₹{todayStats.revenue.services.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-secondary-foreground" />
                  <span>Products</span>
                </div>
                <span className="font-medium">₹{todayStats.revenue.products.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span className="text-primary">₹{todayStats.revenue.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Customer Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Returning Customers</span>
                <Badge className="bg-green-100 text-green-700">
                  {Math.round((todayStats.customers.returning / todayStats.customers.total) * 100)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>New Customers</span>
                <Badge variant="outline">
                  {Math.round((todayStats.customers.new / todayStats.customers.total) * 100)}%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Bill</span>
                <span className="font-medium">₹{Math.round(todayStats.revenue.total / todayStats.appointments.completed)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}