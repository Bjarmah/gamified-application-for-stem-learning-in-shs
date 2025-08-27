import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  subject: string;
  time: string;
  type: 'module' | 'quiz' | 'achievement' | 'room_join' | 'room_message';
  initials: string;
  created_at: string;
}

export const useActivityFeed = (limit: number = 20) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch recent user progress (module completions)
      const { data: moduleProgress } = await supabase
        .from('user_progress')
        .select('*, modules(title)')
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Fetch recent quiz attempts
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title)')
        .order('completed_at', { ascending: false })
        .limit(limit);

      // Fetch recent room quiz attempts
      const { data: roomQuizAttempts } = await supabase
        .from('room_quiz_attempts')
        .select('*, room_quizzes(title)')
        .order('completed_at', { ascending: false })
        .limit(limit);

      // Fetch recent user achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*, achievements(name)')
        .order('earned_at', { ascending: false })
        .limit(limit);

      // Fetch recent room joins
      const { data: roomJoins } = await supabase
        .from('room_members')
        .select('*, rooms(name)')
        .order('joined_at', { ascending: false })
        .limit(limit);

      // Get all unique user IDs
      const userIds = new Set<string>();
      moduleProgress?.forEach(p => p.user_id && userIds.add(p.user_id));
      quizAttempts?.forEach(q => q.user_id && userIds.add(q.user_id));
      roomQuizAttempts?.forEach(r => r.user_id && userIds.add(r.user_id));
      userAchievements?.forEach(a => a.user_id && userIds.add(a.user_id));
      roomJoins?.forEach(r => r.user_id && userIds.add(r.user_id));

      // Fetch all profiles at once
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', Array.from(userIds));

      // Create a map for quick profile lookup
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Transform and combine all activities
      const allActivities: ActivityItem[] = [];

      // Module completions
      moduleProgress?.forEach(progress => {
        const profile = profileMap.get(progress.user_id);
        if (profile?.full_name && progress.modules?.title) {
          allActivities.push({
            id: `module-${progress.id}`,
            user: profile.full_name,
            action: 'completed',
            subject: progress.modules.title,
            time: formatTimeAgo(progress.created_at),
            type: 'module',
            initials: getInitials(profile.full_name),
            created_at: progress.created_at
          });
        }
      });

      // Quiz attempts
      quizAttempts?.forEach(attempt => {
        const profile = profileMap.get(attempt.user_id);
        if (profile?.full_name && attempt.quizzes?.title) {
          allActivities.push({
            id: `quiz-${attempt.id}`,
            user: profile.full_name,
            action: `scored ${attempt.score}% on`,
            subject: attempt.quizzes.title,
            time: formatTimeAgo(attempt.completed_at),
            type: 'quiz',
            initials: getInitials(profile.full_name),
            created_at: attempt.completed_at
          });
        }
      });

      // Room quiz attempts
      roomQuizAttempts?.forEach(attempt => {
        const profile = profileMap.get(attempt.user_id);
        if (profile?.full_name && attempt.room_quizzes?.title) {
          allActivities.push({
            id: `room-quiz-${attempt.id}`,
            user: profile.full_name,
            action: `scored ${attempt.percentage}% on`,
            subject: attempt.room_quizzes.title,
            time: formatTimeAgo(attempt.completed_at),
            type: 'quiz',
            initials: getInitials(profile.full_name),
            created_at: attempt.completed_at
          });
        }
      });

      // User achievements
      userAchievements?.forEach(userAchievement => {
        const profile = profileMap.get(userAchievement.user_id);
        if (profile?.full_name && userAchievement.achievements?.name) {
          allActivities.push({
            id: `achievement-${userAchievement.id}`,
            user: profile.full_name,
            action: 'earned',
            subject: userAchievement.achievements.name,
            time: formatTimeAgo(userAchievement.earned_at),
            type: 'achievement',
            initials: getInitials(profile.full_name),
            created_at: userAchievement.earned_at
          });
        }
      });

      // Room joins
      roomJoins?.forEach(join => {
        const profile = profileMap.get(join.user_id);
        if (profile?.full_name && join.rooms?.name) {
          allActivities.push({
            id: `room-join-${join.id}`,
            user: profile.full_name,
            action: 'joined',
            subject: join.rooms.name,
            time: formatTimeAgo(join.joined_at),
            type: 'room_join',
            initials: getInitials(profile.full_name),
            created_at: join.joined_at
          });
        }
      });

      // Sort all activities by created_at and limit
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);

      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error fetching activity feed:', error);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Set up real-time subscriptions for live updates
  useEffect(() => {
    if (!user) return;

    const channels: any[] = [];

    // Subscribe to user progress updates
    const progressChannel = supabase
      .channel('activity-user-progress')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'user_progress',
        filter: `completed=eq.true`
      }, () => {
        fetchActivities();
      })
      .subscribe();

    // Subscribe to quiz attempts
    const quizChannel = supabase
      .channel('activity-quiz-attempts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quiz_attempts'
      }, () => {
        fetchActivities();
      })
      .subscribe();

    // Subscribe to room quiz attempts
    const roomQuizChannel = supabase
      .channel('activity-room-quiz-attempts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'room_quiz_attempts'
      }, () => {
        fetchActivities();
      })
      .subscribe();

    // Subscribe to achievements
    const achievementChannel = supabase
      .channel('activity-user-achievements')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_achievements'
      }, () => {
        fetchActivities();
      })
      .subscribe();

    // Subscribe to room joins
    const roomJoinChannel = supabase
      .channel('activity-room-members')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'room_members'
      }, () => {
        fetchActivities();
      })
      .subscribe();

    channels.push(progressChannel, quizChannel, roomQuizChannel, achievementChannel, roomJoinChannel);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [user, fetchActivities]);

  return {
    activities,
    loading,
    refetch: fetchActivities
  };
};

// Helper functions
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
};

const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};