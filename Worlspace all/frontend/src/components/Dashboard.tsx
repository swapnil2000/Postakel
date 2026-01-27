import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Clock,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Bell,
  MapPin,
  UserCheck,
  ClipboardList,
  Target,
  Timer,
  Activity,
  DollarSign,
  IndianRupee,
  FileText,
  BarChart3,
  Plus,
  ArrowRight,
  Briefcase,
  Coffee,
  Gift,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarDays,
  MessageSquare,
  HardDrive,
  TrendingDown,
  Eye,
  Edit,
  Building2,
  Phone,
  Mail,
  Star,
  Award,
  Zap,
  BookOpen,
  Heart,
  Smile,
  Globe,
  Wifi,
  Shield,
  Brain,
  RefreshCw,
  Sun,
  Moon,
  CloudRain,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

interface DashboardProps {
  userRole: string;
  onNavigate: (screen: string) => void;
  currentUser: {
    id: number;
    name: string;
    role: string;
    department?: string;
    avatar?: string;
  };
  employees: any[];
  companySettings: {
    name: string;
    industry?: string;
    country?: string;
    city?: string;
    currency: string;
    currencySymbol: string;
    dateFormat?: string;
    timeFormat?: string;
    timezone?: string;
    [key: string]: any;
  };
  appData?: any;
}

export function Dashboard({ 
  userRole, 
  onNavigate, 
  currentUser,
  employees = [],
  companySettings,
  appData = {}
}: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Ensure we have valid data
  if (!currentUser || !companySettings) {
    return (
      <div className="container-mobile py-6 pb-24">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Dynamic weather info based on company location
  const getWeatherInfo = () => {
    const location = companySettings.country === 'India' ? 
      (companySettings.city || 'Mumbai') : 
      (companySettings.city || companySettings.country || 'Unknown');
    
    // Simple temperature estimation based on location
    const baseTemp = companySettings.country === 'India' ? 28 : 20; // Celsius
    const temp = companySettings.country === 'India' ? 
      `${baseTemp}°C` : 
      `${Math.round(baseTemp * 9/5 + 32)}°F`;
    
    return {
      temp,
      condition: 'partly-cloudy',
      location
    };
  };

  const weatherInfo = getWeatherInfo();

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // If timezone is specified in company settings, we could handle it here
      // For now, we'll use the system timezone
      setCurrentTime(now);
    };

    updateTime(); // Initial update
    const timer = setInterval(updateTime, 60000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [companySettings.timezone]);

  // Generate dynamic dashboard data based on actual application state
  const generateDashboardData = () => {
    const now = new Date();
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    
    // Calculate time tracking data from actual sessions
    const timeTrackingData = {
      todayHours: appData.timeTracking?.totalHoursToday || 0,
      weekHours: appData.timeTracking?.totalHoursWeek || 0,
      isCheckedIn: appData.timeTracking?.isCheckedIn || false,
      lastClockIn: appData.timeTracking?.currentSession?.startTime || null,
      breakTime: 0, // Calculate from actual break sessions
      productivity: appData.timeTracking?.totalHoursToday ? Math.min(100, (appData.timeTracking.totalHoursToday / 8) * 100) : 0
    };

    // Calculate task data from actual tasks
    const taskData = {
      totalTasks: appData.tasks?.totalTasks || 0,
      completedTasks: appData.tasks?.completedTasks || 0,
      overdueTasks: appData.tasks?.overdueTasks || 0,
      upcomingDeadlines: appData.tasks?.tasks?.filter((task: any) => {
        const deadline = new Date(task.dueDate);
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        return deadline <= threeDaysFromNow && task.status !== 'completed';
      }).length || 0
    };

    // Calculate leave data from actual requests
    const leaveData = {
      pendingRequests: appData.leave?.requests?.filter((req: any) => req.status === 'pending').length || 0,
      approvedRequests: appData.leave?.requests?.filter((req: any) => req.status === 'approved').length || 0,
      remainingLeaves: userRole === 'employee' ? 
        (appData.leave?.balances?.find((bal: any) => bal.employeeId === currentUser.id)?.totalRemaining || 0) : 0,
      teamOnLeave: appData.leave?.requests?.filter((req: any) => {
        const today = new Date().toISOString().split('T')[0];
        return req.status === 'approved' && req.startDate <= today && req.endDate >= today;
      }).length || 0
    };

    // Calculate performance data from actual reviews and goals
    const performanceData = {
      averageRating: appData.performance?.ratings?.length > 0 ? 
        appData.performance.ratings.reduce((sum: number, rating: any) => sum + rating.score, 0) / appData.performance.ratings.length : 0,
      pendingReviews: appData.performance?.reviews?.filter((review: any) => review.status === 'pending').length || 0,
      completedGoals: appData.performance?.goals?.filter((goal: any) => goal.status === 'completed').length || 0,
      developmentPlans: appData.performance?.goals?.filter((goal: any) => goal.type === 'development').length || 0
    };

    // Calculate salary data from actual employee salaries
    const totalPayroll = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
    const salaryData = {
      totalPayroll: userRole === 'admin' ? totalPayroll : 0,
      pendingPayments: 0, // Would be calculated from payroll system
      nextPayroll: getNextPayrollDate(),
      bonusPool: userRole === 'admin' ? Math.round(totalPayroll * 0.1) : 0 // 10% of total payroll as bonus pool
    };

    // Calculate asset data from actual assets
    const assetData = {
      totalAssets: appData.assets?.assets?.length || 0,
      assignedAssets: appData.assets?.assignments?.length || 0,
      maintenanceAssets: appData.assets?.assets?.filter((asset: any) => asset.status === 'maintenance').length || 0,
      totalValue: appData.assets?.totalValue || 0
    };

    return {
      timeTracking: timeTrackingData,
      tasks: taskData,
      leave: leaveData,
      performance: performanceData,
      salary: salaryData,
      assets: assetData,
      employees: totalEmployees,
      activeEmployees
    };
  };

  const getNextPayrollDate = () => {
    const now = new Date();
    const nextPayroll = new Date(now.getFullYear(), now.getMonth(), 15);
    if (nextPayroll < now) {
      nextPayroll.setMonth(nextPayroll.getMonth() + 1);
    }
    
    // Use company's date format and locale
    const locale = companySettings.country === 'India' ? 'en-IN' : 'en-US';
    const dateFormat = companySettings.dateFormat === 'DD/MM/YYYY' ? 
      { day: 'numeric', month: 'short', year: 'numeric' } :
      { month: 'short', day: 'numeric', year: 'numeric' };
    
    return nextPayroll.toLocaleDateString(locale, dateFormat);
  };

  const dashboardData = generateDashboardData();

  // Generate dynamic stats based on user role and real data
  const getStatsCards = () => {
    if (userRole === 'admin') {
      return [
        {
          label: 'Total Employees',
          value: dashboardData.employees.toString(),
          icon: Users,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          change: `${dashboardData.activeEmployees} active`,
          changeType: 'positive'
        },
        {
          label: 'Active Tasks',
          value: (dashboardData.tasks.totalTasks - dashboardData.tasks.completedTasks).toString(),
          icon: ClipboardList,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          change: `${dashboardData.tasks.overdueTasks} overdue`,
          changeType: dashboardData.tasks.overdueTasks > 0 ? 'negative' : 'neutral'
        },
        {
          label: 'Leave Requests',
          value: dashboardData.leave.pendingRequests.toString(),
          icon: Calendar,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          change: `${dashboardData.leave.teamOnLeave} on leave today`,
          changeType: 'neutral'
        },
        {
          label: 'Monthly Payroll',
          value: `${companySettings.currencySymbol}${Math.round(dashboardData.salary.totalPayroll / 12).toLocaleString()}`,
          icon: companySettings.currency === 'INR' ? IndianRupee : DollarSign,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          change: `Next: ${dashboardData.salary.nextPayroll}`,
          changeType: 'neutral'
        },
        {
          label: 'Company Assets',
          value: dashboardData.assets.totalAssets.toString(),
          icon: HardDrive,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
          change: `${dashboardData.assets.assignedAssets} assigned`,
          changeType: 'positive'
        },
        {
          label: 'Pending Reviews',
          value: dashboardData.performance.pendingReviews.toString(),
          icon: Target,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          change: `${dashboardData.performance.completedGoals} goals completed`,
          changeType: 'positive'
        }
      ];
    } else {
      return [
        {
          label: 'Today\'s Hours',
          value: dashboardData.timeTracking.todayHours.toFixed(1),
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          change: dashboardData.timeTracking.isCheckedIn ? 'Checked In' : 'Not Checked In',
          changeType: dashboardData.timeTracking.isCheckedIn ? 'positive' : 'neutral'
        },
        {
          label: 'My Tasks',
          value: (dashboardData.tasks.totalTasks - dashboardData.tasks.completedTasks).toString(),
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          change: `${dashboardData.tasks.completedTasks} completed`,
          changeType: 'positive'
        },
        {
          label: 'Leave Balance',
          value: dashboardData.leave.remainingLeaves.toString(),
          icon: Calendar,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          change: 'days remaining',
          changeType: 'neutral'
        },
        {
          label: 'Performance',
          value: dashboardData.performance.averageRating ? `${dashboardData.performance.averageRating.toFixed(1)}/5` : 'N/A',
          icon: Star,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          change: `${dashboardData.performance.completedGoals} goals done`,
          changeType: 'positive'
        }
      ];
    }
  };

  const statsCards = getStatsCards();

  // Generate dynamic quick actions based on user role
  const getQuickActions = () => {
    if (userRole === 'admin') {
      return [
        { label: 'Add Employee', icon: Plus, screen: 'add-employee', color: 'blue' },
        { label: 'View Reports', icon: BarChart3, screen: 'reports', color: 'purple' },
        { label: 'AI Insights', icon: Brain, screen: 'ai-insights', color: 'indigo' },
        { label: 'Manage Assets', icon: HardDrive, screen: 'assets', color: 'orange' },
        { label: 'Team Performance', icon: Target, screen: 'performance', color: 'green' },
        { label: 'System Settings', icon: Shield, screen: 'settings', color: 'gray' }
      ];
    } else {
      return [
        { label: 'Clock In/Out', icon: Timer, screen: 'timetracker', color: 'green' },
        { label: 'My Tasks', icon: ClipboardList, screen: 'tasks', color: 'blue' },
        { label: 'Request Leave', icon: Calendar, screen: 'leave', color: 'orange' },
        { label: 'My Performance', icon: Target, screen: 'performance', color: 'purple', badge: dashboardData.performance.pendingReviews > 0 ? '!' : null },
        { label: 'AI Insights', icon: Brain, screen: 'ai-insights', color: 'indigo' },
        { label: 'Team Directory', icon: Users, screen: 'team', color: 'orange' },
      ];
    }
  };

  const quickActions = getQuickActions();

  // Generate dynamic notifications based on actual data
  const getNotifications = () => {
    const notifications = [];
    
    if (userRole === 'admin') {
      if (dashboardData.leave.pendingRequests > 0) {
        notifications.push({
          id: 'leave-requests',
          type: 'info',
          title: `${dashboardData.leave.pendingRequests} Leave Request${dashboardData.leave.pendingRequests > 1 ? 's' : ''} Pending`,
          message: 'Review and approve employee leave requests',
          action: 'View Requests',
          screen: 'leave'
        });
      }
      
      if (dashboardData.performance.pendingReviews > 0) {
        notifications.push({
          id: 'pending-reviews',
          type: 'warning',
          title: `${dashboardData.performance.pendingReviews} Performance Review${dashboardData.performance.pendingReviews > 1 ? 's' : ''} Due`,
          message: 'Complete employee performance evaluations',
          action: 'View Reviews',
          screen: 'performance'
        });
      }
      
      if (dashboardData.tasks.overdueTasks > 0) {
        notifications.push({
          id: 'overdue-tasks',
          type: 'alert',
          title: `${dashboardData.tasks.overdueTasks} Overdue Task${dashboardData.tasks.overdueTasks > 1 ? 's' : ''}`,
          message: 'Some team tasks are past their deadlines',
          action: 'View Tasks',
          screen: 'tasks'
        });
      }
    } else {
      if (!dashboardData.timeTracking.isCheckedIn && currentTime.getHours() >= 9) {
        notifications.push({
          id: 'not-checked-in',
          type: 'reminder',
          title: 'Don\'t Forget to Clock In',
          message: 'Track your work hours for today',
          action: 'Clock In',
          screen: 'timetracker'
        });
      }
      
      if (dashboardData.tasks.overdueTasks > 0) {
        notifications.push({
          id: 'my-overdue-tasks',
          type: 'warning',
          title: `You Have ${dashboardData.tasks.overdueTasks} Overdue Task${dashboardData.tasks.overdueTasks > 1 ? 's' : ''}`,
          message: 'Complete your pending tasks',
          action: 'View Tasks',
          screen: 'tasks'
        });
      }
      
      if (dashboardData.performance.pendingReviews > 0) {
        notifications.push({
          id: 'my-review',
          type: 'info',
          title: 'Performance Review Available',
          message: 'Your manager has completed your review',
          action: 'View Review',
          screen: 'performance'
        });
      }
    }
    
    return notifications.slice(0, 3); // Limit to 3 notifications
  };

  const notifications = getNotifications();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'info': return Bell;
      case 'reminder': return Clock;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'reminder': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="avatar-large bg-blue-600 text-white">
              <AvatarFallback>{currentUser.avatar || currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, {currentUser.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-600">
                {currentTime.toLocaleDateString(
                  companySettings.country === 'India' ? 'en-IN' : 'en-US', 
                  { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }
                )}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {currentTime.toLocaleTimeString(
                      companySettings.country === 'India' ? 'en-IN' : 'en-US', 
                      { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: companySettings.timeFormat !== '24h'
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{weatherInfo.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1">
              {weatherInfo.condition === 'sunny' ? '☀️' : 
               weatherInfo.condition === 'cloudy' ? '☁️' : 
               weatherInfo.condition === 'partly-cloudy' ? '⛅' : '🌧️'}
            </div>
            <div className="text-sm text-gray-600">{weatherInfo.temp}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hr-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 truncate">{stat.label}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.changeType === 'positive' && <TrendingUp className="w-3 h-3 text-green-600" />}
                    {stat.changeType === 'negative' && <TrendingDown className="w-3 h-3 text-red-600" />}
                    <span className={`text-xs ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <div 
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <IconComponent className="w-5 h-5 mt-0.5 text-gray-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onNavigate(notification.screen)}
                    >
                      {notification.action}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col gap-2 relative hover:bg-blue-50 hover:border-blue-300"
                onClick={() => {
                  console.log('🚀 Dashboard Quick Action clicked:', action.screen, action.label);
                  console.log('onNavigate function:', typeof onNavigate);
                  console.log('User role:', userRole);
                  console.log('Action details:', action);
                  
                  // Force navigation with error handling
                  try {
                    onNavigate(action.screen);
                    console.log('✅ Navigation successful');
                  } catch (error) {
                    console.error('❌ Navigation failed:', error);
                  }
                }}
              >
                <action.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.label}</span>
                {action.badge && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {action.badge}
                  </Badge>
                )}
                
                {/* Debug indicator for Add Employee */}
                {action.screen === 'add-employee' && (
                  <div className="absolute top-1 left-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" 
                       title="Add Employee Debug Active"></div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Info */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{companySettings.name}</h3>
                <p className="text-sm text-gray-600">{companySettings.industry || 'Business'}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{employees.length} employees</span>
                  </div>
                  {companySettings.country && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{companySettings.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {userRole === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => onNavigate('settings')}>
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}