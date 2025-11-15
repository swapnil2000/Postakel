import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Calendar, 
  Scissors, 
  Users, 
  Settings,
  Bell
} from 'lucide-react';

interface SalonBottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  notificationCount?: number;
}

export function SalonBottomNavigation({ activeScreen, onNavigate, notificationCount = 0 }: SalonBottomNavigationProps) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: Home,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    },
    { 
      id: 'services', 
      label: 'Services', 
      icon: Scissors,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    },
    { 
      id: 'customers', 
      label: 'CRM', 
      icon: Users,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border/50 shadow-lg z-50">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const IconComponent = item.icon;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 py-3 px-2 h-auto rounded-none relative ${
                isActive 
                  ? 'bg-primary/10 ' + item.activeColor 
                  : 'hover:bg-accent ' + item.inactiveColor
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="relative">
                <IconComponent 
                  size={20} 
                  className={`transition-colors ${
                    isActive ? item.activeColor : item.inactiveColor
                  }`}
                />
                
                {/* Notification badge for specific screens */}
                {item.id === 'calendar' && notificationCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center text-xs bg-destructive">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>
              
              <span className={`text-xs transition-colors ${
                isActive ? item.activeColor : item.inactiveColor
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}