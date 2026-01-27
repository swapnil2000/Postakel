import { Badge } from './ui/badge';
import { 
  Home,
  ClipboardList,
  Users,
  Calendar,
  MoreHorizontal,
  Bell,
  Timer,
  Target,
  Brain
} from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  userRole: 'admin' | 'employee';
  notificationCount?: number;
  appData?: any;
}

export function BottomNavigation({ 
  activeScreen, 
  onNavigate, 
  userRole, 
  notificationCount = 0,
  appData = {}
}: BottomNavigationProps) {
  // Calculate dynamic notification counts from real data
  const getTaskNotifications = () => {
    return appData.tasks?.overdueTasks || 0;
  };

  const getPerformanceNotifications = () => {
    if (userRole === 'admin') {
      // Count pending reviews for admin
      return appData.performance?.reviews?.filter((review: any) => review.status === 'pending').length || 0;
    } else {
      // Count goals due for employee
      const now = new Date();
      return appData.performance?.goals?.filter((goal: any) => {
        const dueDate = new Date(goal.dueDate);
        return goal.status !== 'completed' && dueDate <= now;
      }).length || 0;
    }
  };

  const getAINotifications = () => {
    // Count high-priority AI insights
    return appData.aiInsights?.filter((insight: any) => insight.priority === 'high').length || 0;
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: Home,
      notifications: notificationCount
    },
    {
      id: 'timetracker',
      label: 'Time',
      icon: Timer,
      notifications: 0 // Time tracker notifications handled separately
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: ClipboardList,
      notifications: getTaskNotifications()
    },
    {
      id: 'performance',
      label: userRole === 'admin' ? 'Reviews' : 'Goals',
      icon: Target,
      notifications: getPerformanceNotifications()
    },
    {
      id: 'ai-insights',
      label: 'AI',
      icon: Brain,
      notifications: getAINotifications()
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      notifications: 0
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="grid grid-cols-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`mobile-tab relative ${activeScreen === item.id ? 'active' : ''}`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.notifications > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white animate-pulse">
                  {item.notifications > 9 ? '9+' : item.notifications}
                </Badge>
              )}
            </div>
            <span>{item.label}</span>
            {activeScreen === item.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}