import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { gamificationService, GamificationReward } from '@/services/gamificationService';
import { toast } from 'sonner';

export function useGamificationRewards() {
  const { user } = useAuth();

  const showRewardToast = (reward: GamificationReward) => {
    if (reward.level_up) {
      toast.success(`🎉 Level Up! You're now level ${reward.new_level}!`, {
        description: `Earned ${reward.xp_awarded} XP • ${reward.reason}`,
        duration: 5000,
      });
    } else {
      toast.success(`+${reward.xp_awarded} XP`, {
        description: reward.reason,
        duration: 3000,
      });
    }

    // Show achievement notifications
    if (reward.achievements_unlocked && reward.achievements_unlocked.length > 0) {
      reward.achievements_unlocked.forEach((achievement) => {
        toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
          description: `+${achievement.xp_reward} XP`,
          duration: 6000,
        });
      });
    }

    // Show badge notifications
    if (reward.badges_unlocked && reward.badges_unlocked.length > 0) {
      reward.badges_unlocked.forEach((badge) => {
        toast.success(`🎖️ Badge Earned: ${badge.name}!`, {
          description: badge.description,
          duration: 6000,
        });
      });
    }
  };

  const rewardQuizCompletion = async (quizId: string, score: number, timeSpent: number) => {
    if (!user?.id) return;
    
    const reward = await gamificationService.rewardQuizCompletion(user.id, quizId, score, timeSpent);
    if (reward) {
      showRewardToast(reward);
    }
  };

  const rewardModuleCompletion = async (moduleId: string, timeSpent: number) => {
    if (!user?.id) return;
    
    const reward = await gamificationService.rewardModuleCompletion(user.id, moduleId, timeSpent);
    if (reward) {
      showRewardToast(reward);
    }
  };

  const rewardDailyLogin = async () => {
    if (!user?.id) return;
    
    // Check if already rewarded today
    const today = new Date().toDateString();
    const lastLoginReward = localStorage.getItem(`lastLoginReward_${user.id}`);
    
    if (lastLoginReward !== today) {
      const reward = await gamificationService.rewardDailyLogin(user.id);
      if (reward) {
        showRewardToast(reward);
        localStorage.setItem(`lastLoginReward_${user.id}`, today);
      }
    }
    
    // Always update daily activity for streak tracking
    await gamificationService.updateDailyActivity(user.id);
  };

  const rewardRoomJoin = async (roomId: string) => {
    if (!user?.id) return;
    
    const reward = await gamificationService.rewardRoomJoin(user.id, roomId);
    if (reward) {
      showRewardToast(reward);
    }
  };

  const rewardMessageSent = async (roomId: string) => {
    if (!user?.id) return;
    
    // Throttle message rewards (max 1 per minute per room)
    const throttleKey = `messageReward_${user.id}_${roomId}`;
    const lastReward = localStorage.getItem(throttleKey);
    const now = Date.now();
    
    if (!lastReward || now - parseInt(lastReward) > 60000) { // 1 minute throttle
      const reward = await gamificationService.rewardMessageSent(user.id, roomId);
      if (reward) {
        showRewardToast(reward);
        localStorage.setItem(throttleKey, now.toString());
      }
    }
  };

  // Auto-reward daily login on component mount
  useEffect(() => {
    if (user?.id) {
      rewardDailyLogin();
    }
  }, [user?.id]);

  return {
    rewardQuizCompletion,
    rewardModuleCompletion,
    rewardDailyLogin,
    rewardRoomJoin,
    rewardMessageSent,
  };
}