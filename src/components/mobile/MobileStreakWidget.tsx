import React from 'react';
import { Flame, Calendar, Trophy, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/use-gamification';
import { useMobileStreakNotifications } from '@/hooks/use-mobile-streak-notifications';
import { useMobileUtils } from '@/hooks/use-mobile-utils';
import { MobileButton } from './MobileButton';
import { cn } from '@/lib/utils';

interface MobileStreakWidgetProps {
  className?: string;
  showActions?: boolean;
}

export function MobileStreakWidget({ 
  className, 
  showActions = true 
}: MobileStreakWidgetProps) {
  const { gamificationData, loading } = useGamification();
  const { isMobile, vibrate } = useMobileUtils();
  const { showStreakSavedNotification } = useMobileStreakNotifications();

  if (!isMobile || loading || !gamificationData) return null;

  const currentStreak = gamificationData.current_streak;
  const longestStreak = gamificationData.longest_streak;
  const isNewRecord = currentStreak === longestStreak && currentStreak > 1;

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '👑';
    if (streak >= 50) return '💎';
    if (streak >= 30) return '🌟';
    if (streak >= 14) return '🏆';
    if (streak >= 7) return '🎉';
    if (streak >= 3) return '🔥';
    return '📚';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your learning journey!';
    if (streak === 1) return 'Great start! Keep it up!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 14) return 'Amazing dedication!';
    if (streak < 30) return 'Incredible consistency!';
    if (streak < 50) return 'Outstanding commitment!';
    if (streak < 100) return 'Exceptional learner!';
    return 'LEGENDARY status!';
  };

  const handleCelebrate = () => {
    vibrate([100, 50, 100, 50, 200]);
    showStreakSavedNotification();
  };

  return (
    <Card className={cn(
      "mobile-streak-widget overflow-hidden relative",
      isNewRecord && "border-primary shadow-lg shadow-primary/20",
      className
    )}>
      {isNewRecord && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg">
          New Record! 🎉
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">
              {getStreakEmoji(currentStreak)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {currentStreak}
                </span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getStreakMessage(currentStreak)}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="secondary" className="mb-1">
              <Trophy className="h-3 w-3 mr-1" />
              Best: {longestStreak}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Daily Goal
            </div>
          </div>
        </div>

        {/* Progress visualization */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-xs">
            <span>Weekly Progress</span>
            <span>{currentStreak % 7}/7</span>
          </div>
          <div className="flex gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full flex-1 transition-colors",
                  i < (currentStreak % 7) 
                    ? "bg-primary" 
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2">
            {currentStreak > 0 && (
              <MobileButton
                variant="outline"
                size="sm"
                onClick={handleCelebrate}
                className="flex-1 text-xs"
                hapticFeedback={true}
              >
                <Flame className="h-3 w-3 mr-1" />
                Celebrate
              </MobileButton>
            )}
            
            <MobileButton
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              hapticFeedback={true}
            >
              <Target className="h-3 w-3 mr-1" />
              Set Goal
            </MobileButton>
          </div>
        )}

        {/* Next milestone hint */}
        {currentStreak > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Next milestone:</span>
              <span>
                {currentStreak < 7 && `${7 - currentStreak} days to 7-day badge`}
                {currentStreak >= 7 && currentStreak < 14 && `${14 - currentStreak} days to 2-week badge`}
                {currentStreak >= 14 && currentStreak < 30 && `${30 - currentStreak} days to 1-month badge`}
                {currentStreak >= 30 && currentStreak < 50 && `${50 - currentStreak} days to 50-day badge`}
                {currentStreak >= 50 && currentStreak < 100 && `${100 - currentStreak} days to 100-day badge`}
                {currentStreak >= 100 && 'You\'ve reached the ultimate milestone! 👑'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}