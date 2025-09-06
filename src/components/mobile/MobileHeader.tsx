import React from 'react';
import { ArrowLeft, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMobileResponsive } from '@/hooks/use-mobile-responsive';
import SearchButton from '@/components/layout/SearchButton';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  onMenuClick?: () => void;
  rightAction?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  showSearch = true,
  showNotifications = true,
  onMenuClick,
  rightAction
}) => {
  const navigate = useNavigate();
  const { isMobile } = useMobileResponsive();

  if (!isMobile) return null;

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 safe-area-pt">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {showBack ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : onMenuClick ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          ) : null}
          
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {showSearch && (
            <SearchButton />
          )}
          
          {showNotifications && (
            <NotificationBell />
          )}
          
          {rightAction}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;