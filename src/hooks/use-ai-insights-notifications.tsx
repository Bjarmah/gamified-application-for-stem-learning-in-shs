import { useState } from 'react';

// Simple placeholder hook for AI insights notifications
export const useAIInsightsNotifications = () => {
  const [notifications] = useState([]);

  return {
    notifications,
    unreadCount: 0,
    highPriorityCount: 0,
    actionableCount: 0,
    markAsRead: (id: string) => {},
    markAllAsRead: () => {},
    dismissNotification: (id: string) => {},
    getUnreadNotifications: () => [],
    getActionableNotifications: () => [],
    getHighPriorityNotifications: () => [],
    processNotificationRules: () => {},
    triggerTestNotification: () => {}
  };
};