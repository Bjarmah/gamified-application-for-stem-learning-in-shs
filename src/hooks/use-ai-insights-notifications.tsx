import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useLearningInsights } from '@/hooks/use-learning-insights';

interface AINotification {
  id: string;
  title: string;
  message: string;
  type: 'insight' | 'recommendation' | 'achievement' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  isActionable: boolean;
  createdAt: Date;
  data?: any;
}

export const useAIInsightsNotifications = () => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { getLatestInsight } = useLearningInsights(user?.id);
  
  const [notifications, setNotifications] = useState<AINotification[]>([]);

  // Generate AI-powered notifications based on user data
  useEffect(() => {
    if (!user || !analytics) return;

    const generateNotifications = () => {
      const newNotifications: AINotification[] = [];

      // Performance insights
      if (analytics.averageScore < 70) {
        newNotifications.push({
          id: 'performance-low',
          title: 'Performance Alert',
          message: `Your average score is ${analytics.averageScore.toFixed(0)}%. Let's work on improvement!`,
          type: 'insight',
          priority: 'high',
          isRead: false,
          isActionable: true,
          createdAt: new Date(),
          data: { score: analytics.averageScore }
        });
      }

      // Streak notifications
      if (analytics.streak >= 7) {
        newNotifications.push({
          id: 'streak-achievement',
          title: 'Amazing Streak!',
          message: `You're on a ${analytics.streak}-day learning streak. Keep it up!`,
          type: 'achievement',
          priority: 'medium',
          isRead: false,
          isActionable: false,
          createdAt: new Date(),
          data: { streak: analytics.streak }
        });
      }

      // Study recommendations
      if (analytics.progressTrend === 'decreasing') {
        newNotifications.push({
          id: 'study-recommendation',
          title: 'Study Recommendation',
          message: 'Your progress has slowed. Consider reviewing previous topics.',
          type: 'recommendation',
          priority: 'medium',
          isRead: false,
          isActionable: true,
          createdAt: new Date(),
          data: { trend: analytics.progressTrend }
        });
      }

      // Daily reminder
      const now = new Date();
      if (now.getHours() >= 18 && analytics.streak === 0) {
        newNotifications.push({
          id: 'daily-reminder',
          title: 'Daily Study Reminder',
          message: "You haven't studied today. Even 10 minutes can make a difference!",
          type: 'reminder',
          priority: 'low',
          isRead: false,
          isActionable: true,
          createdAt: new Date()
        });
      }

      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const filteredNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...prev, ...filteredNew].slice(-20); // Keep latest 20
      });
    };

    generateNotifications();
    const interval = setInterval(generateNotifications, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user, analytics]);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high');
  const actionableNotifications = notifications.filter(n => n.isActionable && !n.isRead);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getUnreadNotifications = () => unreadNotifications;
  const getActionableNotifications = () => actionableNotifications;
  const getHighPriorityNotifications = () => highPriorityNotifications;

  const processNotificationRules = () => {
    // Process any custom notification rules
    console.log('Processing notification rules...');
  };

  const triggerTestNotification = () => {
    const testNotification: AINotification = {
      id: `test-${Date.now()}`,
      title: 'Test Notification',
      message: 'This is a test AI insight notification.',
      type: 'insight',
      priority: 'medium',
      isRead: false,
      isActionable: true,
      createdAt: new Date()
    };
    
    setNotifications(prev => [testNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount: unreadNotifications.length,
    highPriorityCount: highPriorityNotifications.length,
    actionableCount: actionableNotifications.length,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    getUnreadNotifications,
    getActionableNotifications,
    getHighPriorityNotifications,
    processNotificationRules,
    triggerTestNotification
  };
};