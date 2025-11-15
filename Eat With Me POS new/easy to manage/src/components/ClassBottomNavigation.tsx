import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Calendar, 
  CheckCircle, 
  IndianRupee, 
  Settings,
  Users,
  BookOpen,
  Award,
  Bell
} from 'lucide-react';

interface ClassBottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  userRole: string;
  notificationCount?: number;
}

export function ClassBottomNavigation({ activeScreen, onNavigate, userRole, notificationCount = 0 }: ClassBottomNavigationProps) {
  const getNavItems = () => {
    switch (userRole) {
      case 'owner':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'schedule', label: 'Classes', icon: Calendar },
          { id: 'attendance', label: 'Attendance', icon: CheckCircle },
          { id: 'fees', label: 'Fees', icon: IndianRupee },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      case 'instructor':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'schedule', label: 'Classes', icon: Calendar },
          { id: 'attendance', label: 'Attendance', icon: CheckCircle },
          { id: 'homework', label: 'Homework', icon: BookOpen },
          { id: 'progress', label: 'Progress', icon: Award }
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'schedule', label: 'Classes', icon: Calendar },
          { id: 'homework', label: 'Homework', icon: BookOpen },
          { id: 'progress', label: 'Progress', icon: Award },
          { id: 'gallery', label: 'Gallery', icon: Settings }
        ];
      case 'parent':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'attendance', label: 'Attendance', icon: CheckCircle },
          { id: 'fees', label: 'Fees', icon: IndianRupee },
          { id: 'progress', label: 'Progress', icon: Award },
          { id: 'notices', label: 'Notices', icon: Bell }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'schedule', label: 'Classes', icon: Calendar },
          { id: 'attendance', label: 'Attendance', icon: CheckCircle },
          { id: 'fees', label: 'Fees', icon: IndianRupee },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-2xl z-50 rounded-t-3xl">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const IconComponent = item.icon;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 py-4 px-2 h-auto rounded-none relative tap-zone-large transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 text-primary scale-105' 
                  : 'hover:bg-accent text-muted-foreground hover:text-primary'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="relative">
                <div className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-primary/20' : 'hover:bg-primary/10'
                }`}>
                  <IconComponent 
                    size={20} 
                    className={`transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                    }`}
                  />
                </div>
                
                {/* Notification badge for notices/notifications */}
                {(item.id === 'notices' || item.id === 'settings') && notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive animate-pulse-scale">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>
              
              <span className={`text-xs transition-all duration-300 font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full animate-slide-up" />
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Floating Action Button - Role specific */}
      {(userRole === 'owner' || userRole === 'instructor') && (
        <Button
          className="absolute bottom-16 right-4 w-14 h-14 rounded-full btn-creative shadow-lg tap-zone-large animate-bounce-gentle"
          onClick={() => onNavigate(userRole === 'owner' ? 'enrollment' : 'attendance')}
        >
          {userRole === 'owner' ? (
            <Users className="w-6 h-6 text-white" />
          ) : (
            <CheckCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      )}
    </div>
  );
}