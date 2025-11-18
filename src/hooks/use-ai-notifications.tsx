import { useState, useEffect, useCallback } from 'react';
import { useLearningAnalytics } from './use-learning-analytics';
import { useGamification } from './use-gamification';

export interface AINotification {
  id: string;
  type: 'insight' | 'achievement' | 'reminder' | 'warning' | 'tip';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const createNotification = (
  type: AINotification['type'],
  title: string,
  message: string,
  priority: AINotification['priority'],
  actionUrl?: string
): AINotification => ({
  id: `${type}-${Date.now()}-${Math.random()}`,
  type,
  title,
  message,
  priority,
  timestamp: new Date(),
  read: false,
  actionUrl,
});

export const useAINotifications = () => {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const { performance, recommendations } = useLearningAnalytics();
  const { gamificationData } = useGamification();

  const generateNotifications = useCallback(() => {
    const newNotifications: AINotification[] = [];

    // Achievement notifications
    if (gamificationData?.current_streak && gamificationData.current_streak >= 7) {
      newNotifications.push(
        createNotification(
          'achievement',
          '🔥 Amazing Streak!',
          `You're on a ${gamificationData.current_streak}-day streak! Keep it up!`,
          'high',
          '/achievements'
        )
      );
    }

    // Performance insights
    if (performance?.length > 0) {
      const avgScore =
        performance.reduce((sum, p) => sum + p.averageScore, 0) / performance.length;

      if (avgScore >= 85) {
        newNotifications.push(
          createNotification(
            'insight',
            '📊 Excellent Performance',
            `Your average score is ${Math.round(avgScore)}%! You're mastering the material.`,
            'medium',
            '/analytics'
          )
        );
      } else if (avgScore < 60) {
        newNotifications.push(
          createNotification(
            'warning',
            '⚠️ Need More Practice',
            "Your scores suggest you need more practice. Let's create a study plan!",
            'high',
            '/insights'
          )
        );
      }
    }

    // Weak areas notifications
    if (recommendations?.length > 0) {
      const weakArea = recommendations.find((r) => r.priority === 'high');
      if (weakArea) {
        newNotifications.push(
          createNotification(
            'tip',
            '💡 Study Suggestion',
            weakArea.reason,
            'medium',
            '/insights'
          )
        );
      }
    }

    // Study reminder
    const lastStudy = localStorage.getItem('lastStudyTime');
    if (lastStudy) {
      const hoursSince = (Date.now() - parseInt(lastStudy)) / (1000 * 60 * 60);
      if (hoursSince > 24) {
        newNotifications.push(
          createNotification(
            'reminder',
            '⏰ Time to Study',
            "You haven't studied in over 24 hours. Ready for a quick session?",
            'low',
            '/subjects'
          )
        );
      }
    }

    setNotifications(newNotifications);
  }, [performance, recommendations, gamificationData]);

  useEffect(() => {
    generateNotifications();
  }, [generateNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
