import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Calendar, 
  Wallet, 
  User, 
  MessageCircle,
  Users,
  Search,
  Heart,
  BarChart3,
  Settings,
  Plus
} from 'lucide-react';

interface ArtistBottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  userRole: string;
  notificationCount?: number;
}

export function ArtistBottomNavigation({ 
  activeScreen, 
  onNavigate, 
  userRole, 
  notificationCount = 0 
}: ArtistBottomNavigationProps) {
  
  const getNavItems = () => {
    switch (userRole) {
      case 'artist':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'wallet', label: 'Wallet', icon: Wallet },
          { id: 'profile', label: 'Profile', icon: User }
        ];
      case 'client':
        return [
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'browse', label: 'Browse', icon: Search },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'favorites', label: 'Saved', icon: Heart },
          { id: 'profile', label: 'Profile', icon: User }
        ];
      case 'agency':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'artists', label: 'Artists', icon: Users },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'bookings', label: 'Bookings', icon: Calendar },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'wallet', label: 'Wallet', icon: Wallet },
          { id: 'profile', label: 'Profile', icon: User }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-secondary shadow-2xl z-50">
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
                  ? 'bg-artist-neon-purple/10 text-artist-neon-purple scale-105' 
                  : 'hover:bg-secondary/30 text-muted-foreground hover:text-white'
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="relative">
                <div className={`p-2 rounded-2xl transition-all duration-300 ${
                  isActive ? 'bg-artist-neon-purple/20 animate-neon-glow' : 'hover:bg-artist-neon-purple/10'
                }`}>
                  <IconComponent 
                    size={22} 
                    className={`transition-all duration-300 ${
                      isActive ? 'text-artist-neon-purple' : 'text-muted-foreground group-hover:text-white'
                    }`}
                  />
                </div>
                
                {/* Notification badge */}
                {(item.id === 'bookings' || item.id === 'dashboard') && notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-artist-gold animate-pulse-scale">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>
              
              <span className={`text-xs transition-all duration-300 font-medium ${
                isActive ? 'text-artist-neon-purple' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator - neon line */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-artist-neon-purple rounded-b-full animate-slide-up shadow-lg" 
                     style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)' }} />
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Floating Action Button - Role specific */}
      <Button
        className={`absolute bottom-16 right-4 w-16 h-16 rounded-full shadow-lg tap-zone-large animate-float ${
          userRole === 'artist' ? 'btn-artist' : 
          userRole === 'client' ? 'btn-gold' : 
          'bg-neon-gradient'
        }`}
        onClick={() => {
          if (userRole === 'artist') onNavigate('new-post');
          else if (userRole === 'client') onNavigate('book');
          else onNavigate('add-artist');
        }}
      >
        <Plus className="w-8 h-8 text-white" />
      </Button>
      
      {/* Stage lighting effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-artist-neon-purple to-transparent opacity-50 animate-spotlight"></div>
    </div>
  );
}