import { supabase } from '@/integrations/supabase/client';

export interface GamificationReward {
  xp_awarded: number;
  total_xp: number;
  old_level: number;
  new_level: number;
  level_up: boolean;
  reason: string;
  achievements_unlocked?: any[];
  badges_unlocked?: any[];
}

class GamificationService {
  // Award XP for various activities
  async awardXP(
    userId: string, 
    amount: number, 
    reason: string, 
    referenceId?: string, 
    referenceType?: string
  ): Promise<GamificationReward | null> {
    try {
      const { data, error } = await supabase.rpc('award_xp', {
        user_uuid: userId,
        xp_amount: amount,
        xp_reason: reason,
        ref_id: referenceId,
        ref_type: referenceType
      });

      if (error) throw error;

      // Check for new achievements after XP award
      const achievements = await this.checkAchievements(userId);
      const badges = await this.checkBadges(userId);

      const rpcData = data as any; // Cast RPC response to any for property access
      
      const result: GamificationReward = {
        xp_awarded: rpcData?.xp_awarded || 0,
        total_xp: rpcData?.total_xp || 0,
        old_level: rpcData?.old_level || 1,
        new_level: rpcData?.new_level || 1,
        level_up: rpcData?.level_up || false,
        reason: rpcData?.reason || reason,
        achievements_unlocked: achievements,
        badges_unlocked: badges
      };

      // Send notifications for level up and achievements
      if (result.level_up) {
        await this.sendLevelUpNotification(userId, result.new_level);
      }

      if (achievements.length > 0) {
        await this.sendAchievementNotifications(userId, achievements);
      }

      if (badges.length > 0) {
        await this.sendBadgeNotifications(userId, badges);
      }

      return result;
    } catch (error) {
      console.error('Error awarding XP:', error);
      return null;
    }
  }

  // Check and unlock achievements
  private async checkAchievements(userId: string): Promise<any[]> {
    try {
      // Get user's current stats
      const { data: userStats } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!userStats) return [];

      // Get all active achievements user hasn't earned yet
      const { data: availableAchievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .not('id', 'in', `(
          SELECT achievement_id FROM user_achievements WHERE user_id = '${userId}'
        )`);

      if (!availableAchievements) return [];

      const unlockedAchievements: any[] = [];

      for (const achievement of availableAchievements) {
        let requirementMet = false;

        switch (achievement.requirement_type) {
          case 'total_xp':
            requirementMet = userStats.total_xp >= achievement.requirement_value;
            break;
          case 'current_level':
            requirementMet = userStats.current_level >= achievement.requirement_value;
            break;
          case 'current_streak':
            requirementMet = userStats.current_streak >= achievement.requirement_value;
            break;
          case 'modules_completed':
            requirementMet = userStats.modules_completed >= achievement.requirement_value;
            break;
          case 'quizzes_completed':
            requirementMet = userStats.quizzes_completed >= achievement.requirement_value;
            break;
          case 'perfect_scores':
            requirementMet = userStats.perfect_scores >= achievement.requirement_value;
            break;
        }

        if (requirementMet) {
          // Unlock the achievement
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              progress: achievement.requirement_value
            });

          if (!error) {
            unlockedAchievements.push(achievement);
          }
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Check and unlock badges
  private async checkBadges(userId: string): Promise<any[]> {
    try {
      // Get user's current stats
      const { data: userStats } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!userStats) return [];

      // Get all active badges user hasn't earned yet
      const { data: availableBadges } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true)
        .not('id', 'in', `(
          SELECT badge_id FROM user_badges WHERE user_id = '${userId}'
        )`);

      if (!availableBadges) return [];

      const unlockedBadges: any[] = [];

      for (const badge of availableBadges) {
        let requirementMet = false;

        switch (badge.requirement_type) {
          case 'total_xp':
            requirementMet = userStats.total_xp >= badge.requirement_value;
            break;
          case 'current_level':
            requirementMet = userStats.current_level >= badge.requirement_value;
            break;
          case 'current_streak':
            requirementMet = userStats.current_streak >= badge.requirement_value;
            break;
          case 'modules_completed':
            requirementMet = userStats.modules_completed >= badge.requirement_value;
            break;
          case 'quizzes_completed':
            requirementMet = userStats.quizzes_completed >= badge.requirement_value;
            break;
          case 'perfect_scores':
            requirementMet = userStats.perfect_scores >= badge.requirement_value;
            break;
        }

        if (requirementMet) {
          // Unlock the badge
          const { error } = await supabase
            .from('user_badges')
            .insert({
              user_id: userId,
              badge_id: badge.id,
              level: 1
            });

          if (!error) {
            unlockedBadges.push(badge);
          }
        }
      }

      return unlockedBadges;
    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }

  // Update streak and gamification stats
  async updateDailyActivity(userId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: currentStats } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!currentStats) return;

      const lastActivity = currentStats.last_activity;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = currentStats.current_streak;

      if (lastActivity === yesterdayStr) {
        // Consecutive day
        newStreak += 1;
      } else if (lastActivity !== today) {
        // Streak broken
        newStreak = 1;
      }

      const longestStreak = Math.max(currentStats.longest_streak, newStreak);

      await supabase
        .from('user_gamification')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_activity: today
        })
        .eq('user_id', userId);

      // Award streak bonus XP
      if (newStreak > currentStats.current_streak) {
        await this.awardXP(userId, newStreak * 5, `Daily streak bonus (${newStreak} days)`);
      }
    } catch (error) {
      console.error('Error updating daily activity:', error);
    }
  }

  // Notification helpers
  private async sendLevelUpNotification(userId: string, newLevel: number): Promise<void> {
    await supabase.rpc('send_notification', {
      target_user_id: userId,
      notification_title: '🎉 Level Up!',
      notification_message: `Congratulations! You've reached level ${newLevel}!`,
      notification_type: 'achievement',
      notification_data: { level: newLevel }
    });
  }

  private async sendAchievementNotifications(userId: string, achievements: any[]): Promise<void> {
    for (const achievement of achievements) {
      await supabase.rpc('send_notification', {
        target_user_id: userId,
        notification_title: '🏆 Achievement Unlocked!',
        notification_message: `You've earned "${achievement.name}"! +${achievement.xp_reward} XP`,
        notification_type: 'achievement',
        notification_data: { achievement_id: achievement.id, xp_reward: achievement.xp_reward }
      });
    }
  }

  private async sendBadgeNotifications(userId: string, badges: any[]): Promise<void> {
    for (const badge of badges) {
      await supabase.rpc('send_notification', {
        target_user_id: userId,
        notification_title: '🎖️ Badge Earned!',
        notification_message: `You've earned the "${badge.name}" badge!`,
        notification_type: 'badge',
        notification_data: { badge_id: badge.id }
      });
    }
  }

  // Quick XP reward methods for common actions
  async rewardCorrectAnswer(userId: string, quizId: string, questionIndex: number): Promise<GamificationReward | null> {
    const xpAmount = 1; // 1 XP per correct answer (30 questions = 30 XP max)
    return await this.awardXP(userId, xpAmount, `Correct answer (Q${questionIndex + 1})`, quizId, 'question');
  }

  async rewardQuizCompletion(userId: string, quizId: string, score: number, timeSpent: number): Promise<GamificationReward | null> {
    let xpAmount = 20; // Reduced base XP for completing quiz (since we award per question)
    
    // Time bonus (faster completion = more XP)
    if (timeSpent < 300) xpAmount += 15; // Under 5 minutes
    else if (timeSpent < 600) xpAmount += 10; // Under 10 minutes

    // Update quiz completion stats
    const { data: currentStats } = await supabase
      .from('user_gamification')
      .select('quizzes_completed, perfect_scores')
      .eq('user_id', userId)
      .single();

    if (currentStats) {
      await supabase
        .from('user_gamification')
        .update({
          quizzes_completed: currentStats.quizzes_completed + 1,
          perfect_scores: currentStats.perfect_scores + (score >= 90 ? 1 : 0)
        })
        .eq('user_id', userId);
    }

    return await this.awardXP(userId, xpAmount, `Quiz completed (${score}%)`, quizId, 'quiz');
  }

  async rewardModuleCompletion(userId: string, moduleId: string, timeSpent: number): Promise<GamificationReward | null> {
    const xpAmount = 75; // Base XP for module completion

    // Update module completion stats
    const { data: currentStats } = await supabase
      .from('user_gamification')
      .select('modules_completed, total_time_studied')
      .eq('user_id', userId)
      .single();

    if (currentStats) {
      await supabase
        .from('user_gamification')
        .update({
          modules_completed: currentStats.modules_completed + 1,
          total_time_studied: currentStats.total_time_studied + timeSpent
        })
        .eq('user_id', userId);
    }

    return await this.awardXP(userId, xpAmount, 'Module completed', moduleId, 'module');
  }

  async rewardDailyLogin(userId: string): Promise<GamificationReward | null> {
    return await this.awardXP(userId, 25, 'Daily login bonus');
  }

  async rewardRoomJoin(userId: string, roomId: string): Promise<GamificationReward | null> {
    return await this.awardXP(userId, 15, 'Joined study room', roomId, 'room');
  }

  async rewardMessageSent(userId: string, roomId: string): Promise<GamificationReward | null> {
    return await this.awardXP(userId, 5, 'Active participation', roomId, 'message');
  }
}

export const gamificationService = new GamificationService();