import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, Trophy, User } from 'lucide-react';
import { MobileButton } from './MobileButton';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TabItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const MobileTabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, vibrate } = useMobileUtils();

  if (!isMobile) return null;

  const navItems: TabItem[] = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/subjects', label: 'Subjects', icon: BookOpen },
    { path: '/virtual-lab', label: 'Lab', icon: Gamepad2 },
    { path: '/achievements', label: 'Rewards', icon: Trophy, badge: 3 },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    vibrate(25); // Light haptic feedback
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ icon: Icon, label, path, badge }) => {
          const active = isActive(path);
          
          return (
            <MobileButton
              key={path}
              variant="ghost"
              size="sm"
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-2 h-auto min-w-0 flex-1 relative transition-all duration-200',
                'hover:scale-105 active:scale-95',
                active 
                  ? 'text-primary bg-primary/10 shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              onClick={() => handleNavigation(path)}
              hapticFeedback={true}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  active && "text-primary scale-110"
                )} />
                {badge && badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[10px] flex items-center justify-center animate-pulse"
                  >
                    {badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium truncate transition-all duration-200",
                active && "text-primary font-semibold"
              )}>
                {label}
              </span>
              
              {/* Active indicator */}
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </MobileButton>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabNavigation;