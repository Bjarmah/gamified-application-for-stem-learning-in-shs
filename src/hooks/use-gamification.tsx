import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserGamification {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity: string;
  total_time_studied: number;
  modules_completed: number;
  quizzes_completed: number;
  perfect_scores: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  is_active: boolean;
  earned_at?: string;
  progress?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlock_condition: string;
  requirement_type: string;
  requirement_value: number;
  subject_id?: string;
  earned_at?: string;
  level?: number;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
}

export function useGamification() {
  const [gamificationData, setGamificationData] = useState<UserGamification | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [xpHistory, setXpHistory] = useState<XPTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize user gamification data
  const initializeGamification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('initialize_user_gamification', {
        user_uuid: user.id
      });

      if (error) throw error;
      await fetchGamificationData();
    } catch (error) {
      console.error('Error initializing gamification:', error);
    }
  };

  // Fetch user gamification data
  const fetchGamificationData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setGamificationData(data);
      } else {
        await initializeGamification();
      }
    } catch (error) {
      console.error('Error fetching gamification data:', error);
    }
  };

  // Fetch achievements with user progress
  const fetchAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: achievementsData, error } = await supabase
        .from('achievements')
        .select(`
          *,
          user_achievements!left (
            earned_at,
            progress
          )
        `)
        .eq('user_achievements.user_id', user.id);

      if (error) throw error;

      const formattedAchievements = achievementsData?.map(achievement => ({
        ...achievement,
        rarity: achievement.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
        earned_at: achievement.user_achievements?.[0]?.earned_at,
        progress: achievement.user_achievements?.[0]?.progress || 0
      })) || [];

      setAchievements(formattedAchievements as Achievement[]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  // Fetch badges with user progress
  const fetchBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: badgesData, error } = await supabase
        .from('badges')
        .select(`
          *,
          user_badges!left (
            earned_at,
            level
          )
        `)
        .eq('user_badges.user_id', user.id);

      if (error) throw error;

      const formattedBadges = badgesData?.map(badge => ({
        ...badge,
        rarity: badge.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
        earned_at: badge.user_badges?.[0]?.earned_at,
        level: badge.user_badges?.[0]?.level || 1
      })) || [];

      setBadges(formattedBadges as Badge[]);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  // Fetch XP history
  const fetchXpHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setXpHistory(data || []);
    } catch (error) {
      console.error('Error fetching XP history:', error);
    }
  };

  // Award XP to user
  const awardXP = async (
    amount: number, 
    reason: string, 
    referenceId?: string, 
    referenceType?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc('award_xp', {
        user_uuid: user.id,
        xp_amount: amount,
        xp_reason: reason,
        ref_id: referenceId,
        ref_type: referenceType
      });

      if (error) throw error;

      // Show XP gained notification
      toast({
        title: `+${amount} XP gained! ✨`,
        description: reason,
      });

      // Show level up notification if applicable
      const result = data as any;
      if (result?.level_up) {
        toast({
          title: `🎉 Level Up! You're now level ${result.new_level}!`,
          description: `Keep up the great work!`,
        });
      }

      // Refresh data
      await fetchGamificationData();
      await fetchXpHistory();
      
      return data;
    } catch (error) {
      console.error('Error awarding XP:', error);
      return null;
    }
  };

  // Update streak
  const updateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !gamificationData) return;

      const today = new Date().toISOString().split('T')[0];
      const lastActivity = gamificationData.last_activity;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = gamificationData.current_streak;

      if (lastActivity === today) {
        // Already studied today, no change
        return;
      } else if (lastActivity === yesterdayStr) {
        // Continuing streak
        newStreak = gamificationData.current_streak + 1;
      } else {
        // Streak broken, start over
        newStreak = 1;
      }

      const { error } = await supabase
        .from('user_gamification')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, gamificationData.longest_streak),
          last_activity: today
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Award streak XP
      if (newStreak > 1) {
        await awardXP(25, `${newStreak} day learning streak!`);
      }

      await fetchGamificationData();
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchGamificationData(),
        fetchAchievements(),
        fetchBadges(),
        fetchXpHistory()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const getXpForNextLevel = (level: number) => {
    return level * level * 100;
  };

  const getLevelProgress = () => {
    if (!gamificationData) return 0;
    
    const currentLevelXp = getXpForNextLevel(gamificationData.current_level - 1);
    const nextLevelXp = getXpForNextLevel(gamificationData.current_level);
    const progressXp = gamificationData.total_xp - currentLevelXp;
    const neededXp = nextLevelXp - currentLevelXp;
    
    return Math.min((progressXp / neededXp) * 100, 100);
  };

  return {
    gamificationData,
    achievements,
    badges,
    xpHistory,
    loading,
    awardXP,
    updateStreak,
    fetchGamificationData,
    getLevelProgress,
    getXpForNextLevel,
    initializeGamification
  };
}