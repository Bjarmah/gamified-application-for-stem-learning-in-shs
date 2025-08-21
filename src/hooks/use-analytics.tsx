import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export interface StudentAnalytics {
  totalStudents: number;
  activeStudents: number;
  completionRates: {
    modules: number;
    quizzes: number;
  };
  averageScores: {
    overall: number;
    bySubject: { subject: string; score: number }[];
  };
  timeSpent: {
    total: number;
    average: number;
    bySubject: { subject: string; time: number }[];
  };
  streakData: {
    average: number;
    longest: number;
    distribution: { days: number; count: number }[];
  };
  progressOverTime: {
    date: string;
    modules: number;
    quizzes: number;
    xp: number;
  }[];
  subjectPopularity: {
    subject: string;
    students: number;
    modules: number;
    avgScore: number;
  }[];
}

export interface UserAnalytics {
  userId: string;
  userName: string;
  totalXP: number;
  level: number;
  streak: number;
  modulesCompleted: number;
  quizzesCompleted: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
  progressTrend: 'increasing' | 'decreasing' | 'stable';
  subjectProgress: {
    subject: string;
    completed: number;
    total: number;
    avgScore: number;
  }[];
}

// Helper function to generate real progress over time data
const generateRealProgressOverTime = async (progressData: any[], quizData: any[], gamificationData: any[]) => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return last30Days.map(date => {
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // Count modules completed on this date
    const modulesCompleted = progressData?.filter(p => 
      p.completed && 
      new Date(p.last_accessed || p.created_at) >= dayStart && 
      new Date(p.last_accessed || p.created_at) < dayEnd
    ).length || 0;

    // Count quizzes taken on this date  
    const quizzesTaken = quizData?.filter(q =>
      new Date(q.completed_at) >= dayStart &&
      new Date(q.completed_at) < dayEnd
    ).length || 0;

    // Calculate XP earned on this date (simplified - based on activity)
    const xpEarned = (modulesCompleted * 50) + (quizzesTaken * 25);

    return {
      date,
      modules: modulesCompleted,
      quizzes: quizzesTaken,
      xp: xpEarned
    };
  });
};

export const useStudentAnalytics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('analytics-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_progress'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['student-analytics'] });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'quiz_attempts'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['student-analytics'] });
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_gamification'
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['student-analytics'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['student-analytics'],
    queryFn: async (): Promise<StudentAnalytics> => {
      // Get total and active students
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('id, created_at')
        .eq('role', 'student');

      const { data: activeStudentsData } = await supabase
        .from('user_gamification')
        .select('user_id, last_activity')
        .gte('last_activity', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get completion rates
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('user_id, module_id, completed, score, time_spent');

      const { data: quizData } = await supabase
        .from('quiz_attempts')
        .select('user_id, score, total_questions, time_spent, completed_at');

      // Get gamification data
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('*');

      // Get modules and subjects for analysis
      const { data: modulesData } = await supabase
        .from('modules')
        .select('id, title, subject_id, subjects(name)');

      // Calculate analytics
      const totalStudents = studentsData?.length || 0;
      const activeStudents = activeStudentsData?.length || 0;

      const completedModules = progressData?.filter(p => p.completed).length || 0;
      const totalModuleAttempts = progressData?.length || 0;
      const moduleCompletionRate = totalModuleAttempts > 0 ? (completedModules / totalModuleAttempts) * 100 : 0;

      const quizCompletionRate = quizData?.length || 0;

      const overallAverageScore = quizData?.length 
        ? quizData.reduce((sum, quiz) => sum + quiz.score, 0) / quizData.length 
        : 0;

      // Calculate subject-wise data
      const subjectScores = new Map();
      const subjectTime = new Map();
      const subjectPopularityMap = new Map();

      progressData?.forEach(progress => {
        const module = modulesData?.find(m => m.id === progress.module_id);
        const subjectName = module?.subjects?.name || 'Unknown';
        
        if (!subjectScores.has(subjectName)) {
          subjectScores.set(subjectName, []);
          subjectTime.set(subjectName, 0);
          subjectPopularityMap.set(subjectName, new Set());
        }
        
        if (progress.score) subjectScores.get(subjectName).push(progress.score);
        subjectTime.set(subjectName, subjectTime.get(subjectName) + (progress.time_spent || 0));
        subjectPopularityMap.get(subjectName).add(progress.user_id);
      });

      const averageScoresBySubject = Array.from(subjectScores.entries()).map(([subject, scores]) => ({
        subject,
        score: scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0
      }));

      const timeSpentBySubject = Array.from(subjectTime.entries()).map(([subject, time]) => ({
        subject,
        time
      }));

      const subjectPopularity = Array.from(subjectPopularityMap.entries()).map(([subject, userSet]) => ({
        subject,
        students: userSet.size,
        modules: modulesData?.filter(m => m.subjects?.name === subject).length || 0,
        avgScore: subjectScores.get(subject)?.length 
          ? subjectScores.get(subject).reduce((a: number, b: number) => a + b, 0) / subjectScores.get(subject).length 
          : 0
      }));

      // Calculate streak data
      const streaks = gamificationData?.map(g => g.current_streak) || [];
      const averageStreak = streaks.length ? streaks.reduce((a, b) => a + b, 0) / streaks.length : 0;
      const longestStreak = Math.max(...streaks, 0);

      // Create streak distribution
      const streakDistribution = streaks.reduce((acc, streak) => {
        const range = Math.floor(streak / 5) * 5; // Group by 5s
        const existing = acc.find(item => item.days === range);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ days: range, count: 1 });
        }
        return acc;
      }, [] as { days: number; count: number }[]);

      // Generate progress over time from real data
      const progressOverTime = await generateRealProgressOverTime(progressData, quizData, gamificationData);

      return {
        totalStudents,
        activeStudents,
        completionRates: {
          modules: moduleCompletionRate,
          quizzes: quizCompletionRate
        },
        averageScores: {
          overall: overallAverageScore,
          bySubject: averageScoresBySubject
        },
        timeSpent: {
          total: timeSpentBySubject.reduce((sum, item) => sum + item.time, 0),
          average: timeSpentBySubject.length 
            ? timeSpentBySubject.reduce((sum, item) => sum + item.time, 0) / timeSpentBySubject.length 
            : 0,
          bySubject: timeSpentBySubject
        },
        streakData: {
          average: averageStreak,
          longest: longestStreak,
          distribution: streakDistribution
        },
        progressOverTime,
        subjectPopularity
      };
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds for real-time feel
  });
};

export const useUserAnalytics = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['user-analytics', targetUserId],
    queryFn: async (): Promise<UserAnalytics | null> => {
      if (!targetUserId) return null;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', targetUserId)
        .single();

      // Get gamification data
      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', targetUserId)
        .single();

      // Get progress data
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*, modules(title, subjects(name))')
        .eq('user_id', targetUserId);

      // Get quiz attempts
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('score, total_questions, time_spent')
        .eq('user_id', targetUserId);

      if (!gamification) return null;

      // Calculate subject progress
      const subjectProgressMap = new Map();
      progressData?.forEach(progress => {
        const subjectName = progress.modules?.subjects?.name || 'Unknown';
        if (!subjectProgressMap.has(subjectName)) {
          subjectProgressMap.set(subjectName, {
            subject: subjectName,
            completed: 0,
            total: 0,
            scores: []
          });
        }
        const subjectData = subjectProgressMap.get(subjectName);
        subjectData.total++;
        if (progress.completed) subjectData.completed++;
        if (progress.score) subjectData.scores.push(progress.score);
      });

      const subjectProgress = Array.from(subjectProgressMap.entries()).map(([subject, data]) => ({
        subject,
        completed: data.completed,
        total: data.total,
        avgScore: data.scores.length ? data.scores.reduce((a: number, b: number) => a + b, 0) / data.scores.length : 0
      }));

      // Calculate average score
      const averageScore = quizAttempts?.length 
        ? quizAttempts.reduce((sum, quiz) => sum + quiz.score, 0) / quizAttempts.length 
        : 0;

      // Calculate total time spent
      const totalTimeSpent = (progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0) +
                            (quizAttempts?.reduce((sum, q) => sum + (q.time_spent || 0), 0) || 0);

      // Determine progress trend (simplified calculation)
      const recentProgress = progressData?.filter(p => 
        new Date(p.last_accessed || 0) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;
      const olderProgress = progressData?.filter(p => 
        new Date(p.last_accessed || 0) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length || 0;

      let progressTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (recentProgress > olderProgress * 1.2) progressTrend = 'increasing';
      else if (recentProgress < olderProgress * 0.8) progressTrend = 'decreasing';

      return {
        userId: targetUserId,
        userName: profile?.full_name || 'Unknown User',
        totalXP: gamification.total_xp,
        level: gamification.current_level,
        streak: gamification.current_streak,
        modulesCompleted: gamification.modules_completed,
        quizzesCompleted: gamification.quizzes_completed,
        averageScore,
        timeSpent: totalTimeSpent,
        lastActivity: new Date(gamification.last_activity),
        progressTrend,
        subjectProgress
      };
    },
    enabled: !!targetUserId,
    refetchInterval: 60000, // Refresh every minute
  });
};