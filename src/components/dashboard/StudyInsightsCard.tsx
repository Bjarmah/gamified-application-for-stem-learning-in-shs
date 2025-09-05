import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Trophy, Target } from 'lucide-react';

const StudyInsightsCard = () => {
  const { user } = useAuth();

  const { data: insights } = useQuery({
    queryKey: ['study-insights', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Get total study time from user_gamification
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('total_time_studied, current_streak, longest_streak')
        .eq('user_id', user.id)
        .single();

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { data: recentQuizzes } = await supabase
        .from('quiz_attempts')
        .select('completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', sevenDaysAgo.toISOString());

      // Get this week's activity pattern
      const weekActivity = new Array(7).fill(0);
      recentQuizzes?.forEach(quiz => {
        if (quiz.completed_at) {
          const dayIndex = new Date(quiz.completed_at).getDay();
          weekActivity[dayIndex]++;
        }
      });

      const mostActiveDay = weekActivity.indexOf(Math.max(...weekActivity));
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      return {
        totalStudyTime: gamificationData?.total_time_studied || 0,
        currentStreak: gamificationData?.current_streak || 0,
        longestStreak: gamificationData?.longest_streak || 0,
        weeklyActivity: recentQuizzes?.length || 0,
        mostActiveDay: dayNames[mostActiveDay],
        studyDays: weekActivity.filter(count => count > 0).length
      };
    },
    enabled: !!user
  });

  if (!insights) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-4/5"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatStudyTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Study Insights
        </CardTitle>
        <CardDescription>Your learning patterns and achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Study Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Total Study Time</span>
          </div>
          <Badge variant="secondary">{formatStudyTime(insights.totalStudyTime)}</Badge>
        </div>

        {/* Current Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Current Streak</span>
          </div>
          <Badge variant={insights.currentStreak > 0 ? "default" : "outline"}>
            {insights.currentStreak} days
          </Badge>
        </div>

        {/* Weekly Activity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">This Week</span>
            </div>
            <span className="text-sm font-medium">{insights.weeklyActivity} quizzes</span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={(insights.studyDays / 7) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Active {insights.studyDays}/7 days this week
            </p>
          </div>
        </div>

        {/* Best Day */}
        {insights.weeklyActivity > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Most active day: <span className="font-medium">{insights.mostActiveDay}</span>
            </p>
          </div>
        )}

        {/* Streak Record */}
        {insights.longestStreak > insights.currentStreak && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Personal best: <span className="font-medium">{insights.longestStreak} day streak</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyInsightsCard;