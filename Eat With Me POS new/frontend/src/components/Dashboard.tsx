import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { AIInsights } from './AIInsights';
import {
  BarChart3,
  CalendarDays,
  ShoppingBag,
  CreditCard,
  IndianRupee,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Bot,
  Timer,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // State for current date filter
  const [dateFilter, setDateFilter] = useState<
    'today' | 'yesterday' | 'week' | 'month' | 'all'
  >('today');

  // State for storing dashboard statistics from backend
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Separate state for current user info
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Provide default safe stats values when dashboardStats is not yet loaded
  const stats = dashboardStats || {
    sales: 0,
    orders: 0,
    cashAmount: 0,
    digitalAmount: 0,
    avgOrderValue: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    occupied: 0,
    total: 0,
    free: 0,
    recentActivities: [],
    growthPercentage: 0,
  };

  // Use currency and restaurantId from dashboard stats or localStorage
  const currencySymbol = dashboardStats?.currencySymbol || '₹';
  const restaurantId = dashboardStats?.restaurantId || localStorage.getItem('restaurantId') || '';

  // Fetch dashboard data and current user info any time dateFilter changes
  useEffect(() => {
    async function fetchDashboard() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        const restaurantId = localStorage.getItem('restaurantId') || '';
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/dashboard/${restaurantId}?dateFilter=${dateFilter}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error('Failed to load dashboard data');
        const data = await res.json();
        setDashboardStats(data.stats);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboard();
  }, [dateFilter]);

  // Generate label for date filter
  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'all':
        return 'All Time';
      default:
        return 'Today';
    }
  };

  // Show loading UI while fetching data
  if (isLoading) {
    return (
      <div className="flex-1 bg-background p-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Show error UI if data fetch failed
  if (error) {
    return (
      <div className="flex-1 bg-background p-4 flex items-center justify-center text-destructive">
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background p-4 space-y-6 animate-slide-up">
      {/* Header - Restaurant Name, Date Filter, Current User */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">
            Good{' '}
            {new Date().getHours() < 12
              ? 'Morning'
              : new Date().getHours() < 17
              ? 'Afternoon'
              : 'Evening'}
            !
          </h1>
          <p className="text-muted-foreground">
            Here's your restaurant overview with real-time insights • <span className="font-bold">{restaurantId}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={dateFilter}
            onValueChange={(value: any) => setDateFilter(value)}
          >
            <SelectTrigger className="w-40 min-w-[140px] cursor-pointer hover:bg-secondary/50 transition-colors">
              <CalendarDays className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="today" className="cursor-pointer">Today</SelectItem>
              <SelectItem value="yesterday" className="cursor-pointer">Yesterday</SelectItem>
              <SelectItem value="week" className="cursor-pointer">This Week</SelectItem>
              <SelectItem value="month" className="cursor-pointer">This Month</SelectItem>
              <SelectItem value="all" className="cursor-pointer">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Data
          </Badge>

          <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
            <Bot className="w-3 h-3 mr-1" />
            AI Enabled
          </Badge>

          {/* Current User Badge */}
          {currentUser && (
            <Badge variant="outline" className="text-primary border-primary/30">
              {currentUser.name} • {currentUser.role || 'User'}
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Date Filter Summary */}
          <div className="text-center">
            <Badge variant="outline" className="px-4 py-2">
              <CalendarDays className="w-4 h-4 mr-2" />
              Showing data for: {getDateFilterLabel()} • {stats.orders} orders
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Sales */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-primary-foreground/90 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg">{currencySymbol}</span>
                  <span className="text-3xl font-bold">{stats.sales.toLocaleString()}</span>
                </div>
                <p className="text-primary-foreground/80 mt-1">
                  {stats.growthPercentage >= 0 ? '+' : ''}
                  {stats.growthPercentage}% from previous period
                </p>
              </CardContent>
            </Card>

            {/* Total Orders */}
            <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.orders}</div>
                <p className="text-muted-foreground mt-1">
                  Avg: {currencySymbol}
                  {stats.avgOrderValue}
                </p>
              </CardContent>
            </Card>

            {/* Table Status */}
            <Card className="hover:shadow-lg transition-all duration-300 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Table Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {stats.occupied}/{stats.total}
                </div>
                <p className="text-muted-foreground mt-1">{stats.free} available</p>
              </CardContent>
            </Card>

            {/* Payment Split */}
            <Card className="hover:shadow-lg transition-all duration-300 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Split
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Cash</span>
                  </div>
                  <span className="font-semibold">
                    {currencySymbol}
                    {stats.cashAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Digital</span>
                  </div>
                  <span className="font-semibold">
                    {currencySymbol}
                    {stats.digitalAmount.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Section - Quick Actions & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {quickActions.slice(0, 6).map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                      onClick={() => onNavigate(action.moduleId)}
                    >
                      <span className="text-xl">
                        {action.icon === 'Plus' && '+'}
                        {action.icon === 'Users' && '👥'}
                        {action.icon === 'ChefHat' && '👨‍🍳'}
                      </span>
                      <span className="text-xs text-center">
                        {action.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-primary" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <Badge variant="secondary">{stats.completed}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <Badge variant="outline">{stats.pending}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Cancelled</span>
                  </div>
                  <Badge variant="destructive">{stats.cancelled}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>
                Latest orders and updates for{' '}
                {getDateFilterLabel().toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.status === 'success'
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                        ></div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {activity.amount}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>
                      No activities for {getDateFilterLabel().toLowerCase()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights">
          <AIInsights
            onNavigate={onNavigate}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
