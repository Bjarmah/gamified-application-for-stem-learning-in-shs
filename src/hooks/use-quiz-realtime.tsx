import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type RoomQuizAttempt = Database['public']['Tables']['room_quiz_attempts']['Row'] & {
  profile?: { full_name?: string };
};

export const useQuizRealtime = (roomId: string) => {
  const [liveAttempts, setLiveAttempts] = useState<RoomQuizAttempt[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (!roomId) return;

    // Set up real-time subscription for quiz attempts
    const channel = supabase
      .channel(`room_${roomId}_quiz_attempts`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_quiz_attempts'
        },
        async (payload) => {
          console.log('New quiz attempt:', payload);
          const newAttempt = payload.new as RoomQuizAttempt;
          
          // Get user profile
          if (newAttempt.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', newAttempt.user_id)
              .single();
            
            newAttempt.profile = profile || undefined;
          }

          setLiveAttempts(prev => [...prev, newAttempt]);
          updateLeaderboard(newAttempt);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const updateLeaderboard = (newAttempt: RoomQuizAttempt) => {
    setLeaderboard(prev => {
      // Group by user and get best score for each quiz
      const userScores: { [key: string]: any } = {};
      
      [...prev, newAttempt].forEach(attempt => {
        const key = `${attempt.user_id}_${attempt.quiz_id}`;
        if (!userScores[key] || attempt.percentage > userScores[key].percentage) {
          userScores[key] = attempt;
        }
      });

      // Calculate overall ranking
      const userTotals: { [key: string]: any } = {};
      Object.values(userScores).forEach((attempt: any) => {
        const userId = attempt.user_id;
        if (!userTotals[userId]) {
          userTotals[userId] = {
            user_id: userId,
            full_name: attempt.profile?.full_name || 'Unknown User',
            total_score: 0,
            attempts_count: 0,
            avg_percentage: 0
          };
        }
        userTotals[userId].total_score += attempt.percentage;
        userTotals[userId].attempts_count += 1;
        userTotals[userId].avg_percentage = userTotals[userId].total_score / userTotals[userId].attempts_count;
      });

      return Object.values(userTotals)
        .sort((a: any, b: any) => b.avg_percentage - a.avg_percentage)
        .slice(0, 10); // Top 10
    });
  };

  return {
    liveAttempts,
    leaderboard,
    setLiveAttempts
  };
};