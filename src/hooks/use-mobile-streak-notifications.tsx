import { useEffect } from 'react';
import { useMobileUtils } from './use-mobile-utils';
import { useGamification } from './use-gamification';
import { useToast } from './use-toast';
import { Flame, Trophy, Star, Target } from 'lucide-react';

export const useMobileStreakNotifications = () => {
  const { isMobile, vibrate } = useMobileUtils();
  const { gamificationData } = useGamification();
  const { toast } = useToast();

  useEffect(() => {
    if (!isMobile || !gamificationData) return;

    const currentStreak = gamificationData.current_streak;
    const previousStreak = parseInt(localStorage.getItem('previousStreak') || '0');

    // Check if streak increased
    if (currentStreak > previousStreak) {
      const streakMilestone = getStreakMilestone(currentStreak);
      
      if (streakMilestone) {
        // Trigger haptic feedback for milestone
        vibrate([100, 50, 100, 50, 200]);
        
        // Show milestone notification
        toast({
          title: streakMilestone.title,
          description: streakMilestone.description,
          duration: 5000,
        });

        // Schedule a push notification reminder for tomorrow
        if ('serviceWorker' in navigator && 'Notification' in window) {
          scheduleDailyStreakReminder(currentStreak);
        }
      } else if (currentStreak > 1) {
        // Regular streak notification
        vibrate([50, 50, 100]);
        
        toast({
          title: `${currentStreak} Day Streak! 🔥`,
          description: `Keep it up! Come back tomorrow to maintain your streak.`,
          duration: 3000,
        });
      }

      // Update stored streak
      localStorage.setItem('previousStreak', currentStreak.toString());
    }
  }, [gamificationData?.current_streak, isMobile, vibrate, toast]);

  const getStreakMilestone = (streak: number) => {
    const milestones = [
      { days: 7, title: '7 Day Streak! 🎉', description: 'Amazing! You\'ve studied for a whole week straight!' },
      { days: 14, title: '2 Week Streak! 🏆', description: 'Incredible dedication! You\'re building great study habits.' },
      { days: 30, title: '30 Day Streak! 🌟', description: 'Outstanding! A full month of consistent learning!' },
      { days: 50, title: '50 Day Streak! 💎', description: 'You\'re a diamond learner! This dedication is exceptional.' },
      { days: 100, title: '100 Day Streak! 👑', description: 'LEGENDARY! You\'ve achieved the ultimate learning milestone!' },
    ];

    return milestones.find(milestone => milestone.days === streak);
  };

  const scheduleDailyStreakReminder = async (currentStreak: number) => {
    try {
      // Request notification permission if not granted
      if (Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
      }

      // Calculate tomorrow at 9 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      const timeUntilReminder = tomorrow.getTime() - Date.now();

      // Schedule the reminder
      setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          new Notification(`Don't break your ${currentStreak} day streak! 🔥`, {
            body: 'Come back to STEM Stars and keep learning!',
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'daily-streak-reminder',
            requireInteraction: true,
          });
        }
      }, timeUntilReminder);

    } catch (error) {
      console.log('Could not schedule notification:', error);
    }
  };

  return {
    // Exposed functions for manual notifications
    showStreakLostNotification: () => {
      if (isMobile) {
        vibrate([200, 100, 200]);
        toast({
          title: 'Streak Lost 💔',
          description: 'Don\'t worry! Start a new streak today.',
          variant: 'destructive',
          duration: 4000,
        });
      }
    },
    
    showStreakSavedNotification: () => {
      if (isMobile) {
        vibrate([50, 50, 50, 50, 100]);
        toast({
          title: 'Streak Saved! 🎯',
          description: 'Great job completing your daily learning goal!',
          duration: 3000,
        });
      }
    }
  };
};