import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ActivityDay {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ActivityStats {
  totalQuizzes: number;
  currentStreak: number;
  longestStreak: number;
  averagePerDay: number;
}

interface UseQuizActivityDataReturn {
  activityData: ActivityDay[];
  loading: boolean;
  error: string | null;
  stats: ActivityStats;
  refetch: () => void;
}

export const useQuizActivityData = (userId?: string): UseQuizActivityDataReturn => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ActivityStats>({
    totalQuizzes: 0,
    currentStreak: 0,
    longestStreak: 0,
    averagePerDay: 0
  });

  const targetUserId = userId || user?.id;

  const fetchQuizActivity = async () => {
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      // Get the date range for the last 365 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365);

      // Fetch quiz attempts from the last year
      const { data: quizAttempts, error: fetchError } = await supabase
        .from('quiz_attempts')
        .select('completed_at, score, total_questions')
        .eq('user_id', targetUserId)
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endDate.toISOString())
        .order('completed_at', { ascending: true });

      if (fetchError) throw fetchError;

      // Create a map of dates to quiz counts
      const activityMap = new Map<string, number>();
      
      // Initialize all days in the range with 0
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        activityMap.set(dateKey, 0);
      }

      // Count quiz attempts per day
      quizAttempts?.forEach(attempt => {
        if (attempt.completed_at) {
          const dateKey = new Date(attempt.completed_at).toISOString().split('T')[0];
          const currentCount = activityMap.get(dateKey) || 0;
          activityMap.set(dateKey, currentCount + 1);
        }
      });

      // Convert to ActivityDay array
      const activityDays: ActivityDay[] = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        const count = activityMap.get(dateKey) || 0;
        
        activityDays.push({
          date: new Date(d),
          count,
          level: getActivityLevel(count)
        });
      }

      // Calculate statistics
      const totalQuizzes = quizAttempts?.length || 0;
      const streaks = calculateStreaks(activityDays);
      const averagePerDay = totalQuizzes / 365;

      setActivityData(activityDays);
      setStats({
        totalQuizzes,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        averagePerDay: Number(averagePerDay.toFixed(1))
      });

    } catch (err) {
      console.error('Error fetching quiz activity:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const calculateStreaks = (days: ActivityDay[]): { current: number; longest: number } => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate from most recent day backwards for current streak
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (const day of days) {
      if (day.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { current: currentStreak, longest: longestStreak };
  };

  useEffect(() => {
    fetchQuizActivity();
  }, [targetUserId]);

  return {
    activityData,
    loading,
    error,
    stats,
    refetch: fetchQuizActivity
  };
};