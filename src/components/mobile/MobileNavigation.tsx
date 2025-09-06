import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, Trophy, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMobileResponsive } from '@/hooks/use-mobile-responsive';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobileResponsive();

  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: BookOpen, label: 'Subjects', path: '/subjects' },
    { icon: Gamepad2, label: 'Lab', path: '/virtual-lab' },
    { icon: Trophy, label: 'Rewards', path: '/achievements' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Button
            key={path}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 px-2 py-2 h-auto min-w-0 flex-1 ${
              isActive(path) 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => navigate(path)}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium truncate">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;