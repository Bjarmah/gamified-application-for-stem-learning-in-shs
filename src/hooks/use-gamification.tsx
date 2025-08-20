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
        .eq('is_active', true)
        .order('requirement_value', { ascending: true });

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
        .eq('is_active', true)
        .order('requirement_value', { ascending: true });

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

  // Check and award achievements based on current user data
  const checkAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !gamificationData) return;

      // Get all active achievements
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true);

      if (achievementsError) throw achievementsError;

      for (const achievement of allAchievements || []) {
        // Check if user already has this achievement
        const { data: existingAchievement } = await supabase
          .from('user_achievements')
          .select('id')
          .eq('user_id', user.id)
          .eq('achievement_id', achievement.id)
          .single();

        if (existingAchievement) continue; // Already earned

        let shouldAward = false;
        let progress = 0;

        // Check achievement requirements based on type
        switch (achievement.requirement_type) {
          case 'modules_completed':
            progress = gamificationData.modules_completed;
            shouldAward = progress >= achievement.requirement_value;
            break;
          case 'quizzes_completed':
            progress = gamificationData.quizzes_completed;
            shouldAward = progress >= achievement.requirement_value;
            break;
          case 'streak_days':
            progress = gamificationData.current_streak;
            shouldAward = progress >= achievement.requirement_value;
            break;
          case 'perfect_scores':
            progress = gamificationData.perfect_scores;
            shouldAward = progress >= achievement.requirement_value;
            break;
          case 'xp_total':
            progress = gamificationData.total_xp;
            shouldAward = progress >= achievement.requirement_value;
            break;
          case 'time_studied':
            progress = gamificationData.total_time_studied;
            shouldAward = progress >= achievement.requirement_value;
            break;
          default:
            continue;
        }

        if (shouldAward) {
          // Award the achievement
          const { error: awardError } = await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_id: achievement.id,
              progress: progress,
              earned_at: new Date().toISOString()
            });

          if (!awardError) {
            // Award XP for the achievement
            await awardXP(achievement.xp_reward, `Achievement unlocked: ${achievement.name}`, achievement.id, 'achievement');

            // Show achievement notification
            toast({
              title: `🏆 Achievement Unlocked!`,
              description: achievement.name,
            });
          }
        } else if (progress > 0) {
          // Update progress even if not yet earned
          if (existingAchievement) {
            await supabase
              .from('user_achievements')
              .update({ progress: progress })
              .eq('id', existingAchievement.id);
          } else {
            await supabase
              .from('user_achievements')
              .insert({
                user_id: user.id,
                achievement_id: achievement.id,
                progress: progress
              });
          }
        }
      }

      // Refresh achievements data
      await fetchAchievements();
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  // Check and award badges based on current user data
  const checkBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !gamificationData) return;

      // Get all active badges
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true);

      if (badgesError) throw badgesError;

      for (const badge of allBadges || []) {
        // Check if user already has this badge
        const { data: existingBadge } = await supabase
          .from('user_badges')
          .select('id')
          .eq('user_id', user.id)
          .eq('badge_id', badge.id)
          .single();

        if (existingBadge) continue; // Already earned

        let shouldAward = false;
        let level = 1;

        // Check badge requirements based on type
        switch (badge.requirement_type) {
          case 'subject_modules':
            // Check modules completed for specific subject
            if (badge.subject_id) {
              // First get module IDs for this subject
              const { data: moduleIds } = await supabase
                .from('modules')
                .select('id')
                .eq('subject_id', badge.subject_id);

              const moduleIdList = moduleIds?.map(m => m.id) || [];

              const { data: subjectModules } = await supabase
                .from('user_progress')
                .select('module_id')
                .eq('user_id', user.id)
                .eq('completed', true)
                .in('module_id', moduleIdList);

              const completedCount = subjectModules?.length || 0;
              shouldAward = completedCount >= badge.requirement_value;
              level = Math.floor(completedCount / badge.requirement_value) + 1;
            }
            break;
          case 'subject_perfect_modules':
            // Check perfect scores for specific subject
            if (badge.subject_id) {
              // First get module IDs for this subject
              const { data: moduleIds } = await supabase
                .from('modules')
                .select('id')
                .eq('subject_id', badge.subject_id);

              const moduleIdList = moduleIds?.map(m => m.id) || [];

              const { data: perfectModules } = await supabase
                .from('user_progress')
                .select('module_id')
                .eq('user_id', user.id)
                .eq('completed', true)
                .gte('score', 95)
                .in('module_id', moduleIdList);

              const perfectCount = perfectModules?.length || 0;
              shouldAward = perfectCount >= badge.requirement_value;
              level = Math.floor(perfectCount / badge.requirement_value) + 1;
            }
            break;
          case 'streak_days':
            shouldAward = gamificationData.current_streak >= badge.requirement_value;
            level = Math.floor(gamificationData.current_streak / badge.requirement_value) + 1;
            break;
          case 'fast_completion':
            // This would need to be tracked separately in user_progress
            // For now, skip this type
            continue;
          case 'night_study':
          case 'morning_study':
          case 'weekend_study':
            // These would need time-based tracking
            // For now, skip these types
            continue;
          case 'quick_quiz':
            // This would need quiz completion time tracking
            // For now, skip this type
            continue;
          case 'consecutive_perfects':
            // This would need consecutive perfect score tracking
            // For now, skip this type
            continue;
          default:
            continue;
        }

        if (shouldAward) {
          // Award the badge
          const { error: awardError } = await supabase
            .from('user_badges')
            .insert({
              user_id: user.id,
              badge_id: badge.id,
              level: level,
              earned_at: new Date().toISOString()
            });

          if (!awardError) {
            // Show badge notification
            toast({
              title: `🎖️ Badge Earned!`,
              description: `${badge.name} (Level ${level})`,
            });
          }
        }
      }

      // Refresh badges data
      await fetchBadges();
    } catch (error) {
      console.error('Error checking badges:', error);
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

  // Update modules completed count
  const updateModulesCompleted = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count completed modules from user_progress
      const { data: completedModules, error } = await supabase
        .from('user_progress')
        .select('module_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      const modulesCompletedCount = completedModules?.length || 0;

      // Update the gamification record
      const { error: updateError } = await supabase
        .from('user_gamification')
        .update({
          modules_completed: modulesCompletedCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Refresh gamification data
      await fetchGamificationData();

      // Check for new achievements and badges
      await checkAchievements();
      await checkBadges();
    } catch (error) {
      console.error('Error updating modules completed count:', error);
    }
  };

  // Update quizzes completed count
  const updateQuizzesCompleted = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Count completed quizzes from quiz_attempts
      const { data: completedQuizzes, error } = await supabase
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null);

      if (error) throw error;

      const quizzesCompletedCount = completedQuizzes?.length || 0;

      // Count perfect scores (95% or higher)
      const { data: perfectScores, error: perfectError } = await supabase
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .gte('score', 95);

      if (perfectError) throw perfectError;

      const perfectScoresCount = perfectScores?.length || 0;

      // Update the gamification record
      const { error: updateError } = await supabase
        .from('user_gamification')
        .update({
          quizzes_completed: quizzesCompletedCount,
          perfect_scores: perfectScoresCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Refresh gamification data
      await fetchGamificationData();

      // Check for new achievements and badges
      await checkAchievements();
      await checkBadges();
    } catch (error) {
      console.error('Error updating quizzes completed count:', error);
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
    updateModulesCompleted,
    updateQuizzesCompleted,
    checkAchievements,
    checkBadges,
    fetchGamificationData,
    getLevelProgress,
    getXpForNextLevel,
    initializeGamification
  };
}