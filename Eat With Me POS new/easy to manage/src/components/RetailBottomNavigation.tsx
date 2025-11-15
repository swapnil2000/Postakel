import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  Plus
} from 'lucide-react';

interface RetailBottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  notificationCount?: number;
}

export function RetailBottomNavigation({ activeScreen, onNavigate, notificationCount = 0 }: RetailBottomNavigationProps) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      icon: Home,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: ShoppingCart,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    },
    { 
      id: 'stock', 
      label: 'Stock', 
      icon: Package,
      activeColor: 'text-primary',
      inactiveColor: 'text-muted-foreground'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3,
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-2xl z-50">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          const IconComponent = item.icon;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 py-4 px-2 h-auto rounded-none relative tap-zone-large ${
                isActive 
                  ? 'bg-primary/10 ' + item.activeColor 
                  : 'hover:bg-accent ' + item.inactiveColor
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="relative">
                <IconComponent 
                  size={22} 
                  className={`transition-colors ${
                    isActive ? item.activeColor : item.inactiveColor
                  }`}
                />
                
                {/* Notification badge for stock alerts */}
                {item.id === 'stock' && notificationCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive">
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
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-primary rounded-b-full" />
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Quick Action Button */}
      <Button
        className="absolute bottom-16 right-4 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg tap-zone-large"
        onClick={() => onNavigate('billing')}
      >
        <Plus className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}