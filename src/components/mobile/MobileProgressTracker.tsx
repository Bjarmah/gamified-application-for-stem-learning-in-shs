import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { useGamification } from '@/hooks/use-gamification';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';

interface MobileProgressTrackerProps {
  className?: string;
}

export const MobileProgressTracker: React.FC<MobileProgressTrackerProps> = ({ className = "" }) => {
  const { gamificationData, loading: gamificationLoading } = useGamification();
  const { performance, loading: analyticsLoading } = useLearningAnalytics();

  if (gamificationLoading || analyticsLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted rounded"></div>
              <div className="h-6 w-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate analytics from performance data
  const weeklyProgress = performance.length > 0 ? 
    performance.reduce((acc, p) => acc + (p.averageScore || 0), 0) / performance.length : 0;
  const dailyGoal = 60; // minutes
  const todayStudyTime = gamificationData?.total_time_studied ? 
    Math.min(gamificationData.total_time_studied / 60, dailyGoal) : 0;
  const currentStreak = gamificationData?.current_streak || 0;
  const completedModules = gamificationData?.modules_completed || 0;

  return (
    <Card className={`${className} bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Study Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Study Goal</span>
            <span className="font-medium">{todayStudyTime}/{dailyGoal} min</span>
          </div>
          <Progress 
            value={(todayStudyTime / dailyGoal) * 100} 
            className="h-2"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <Trophy className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-xs text-muted-foreground">Streak</div>
            <div className="text-sm font-semibold">{currentStreak}</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-xs text-muted-foreground">Modules</div>
            <div className="text-sm font-semibold">{completedModules}</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-xs text-muted-foreground">Weekly</div>
            <div className="text-sm font-semibold">{weeklyProgress}%</div>
          </div>
        </div>

        {/* Achievement Badge */}
        {currentStreak >= 7 && (
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300">
              🔥 Week Streak!
            </Badge>
          </div>
        )}

        {/* Motivation Message */}
        {todayStudyTime >= dailyGoal && (
          <div className="text-center">
            <Badge variant="default" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300">
              🎉 Daily Goal Achieved!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileProgressTracker;