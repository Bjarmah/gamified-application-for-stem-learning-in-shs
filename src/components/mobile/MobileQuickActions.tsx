import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  Trophy, 
  Gamepad2, 
  BarChart3,
  Users,
  Zap,
  Target
} from 'lucide-react';
import { MobileButton } from './MobileButton';
import { MobileGestureWrapper } from './MobileGestureWrapper';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
  gradient: string;
}

const MobileQuickActions = () => {
  const navigate = useNavigate();
  const { isMobile, vibrate } = useMobileUtils();

  if (!isMobile) return null;

  const quickActions: QuickAction[] = [
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      path: '/search',
      color: 'text-blue-600',
      gradient: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: BookOpen,
      path: '/subjects',
      color: 'text-green-600',
      gradient: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'lab',
      label: 'Virtual Lab',
      icon: Gamepad2,
      path: '/virtual-lab',
      color: 'text-purple-600',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      path: '/achievements',
      color: 'text-yellow-600',
      gradient: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      color: 'text-indigo-600',
      gradient: 'from-indigo-500/20 to-blue-500/20'
    },
    {
      id: 'rooms',
      label: 'Study Rooms',
      icon: Users,
      path: '/rooms',
      color: 'text-pink-600',
      gradient: 'from-pink-500/20 to-rose-500/20'
    }
  ];

  const handleActionPress = (action: QuickAction) => {
    vibrate(25);
    navigate(action.path);
  };

  return (
    <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        <Zap className="h-4 w-4 text-primary animate-pulse" />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <MobileGestureWrapper
              key={action.id}
              onLongPress={() => {
                vibrate([50, 50, 50]);
                // Could show action preview or context menu
              }}
            >
              <MobileButton
                variant="ghost"
                className={cn(
                  'h-20 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200',
                  'bg-gradient-to-br', action.gradient,
                  'hover:scale-105 active:scale-95',
                  'border border-border/50 hover:border-primary/30'
                )}
                onClick={() => handleActionPress(action)}
                hapticFeedback={true}
              >
                <div className={cn(
                  'p-2 rounded-lg bg-background/50 transition-all duration-200',
                  'group-hover:bg-background/80'
                )}>
                  <Icon className={cn('h-5 w-5', action.color)} />
                </div>
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </MobileButton>
            </MobileGestureWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default MobileQuickActions;