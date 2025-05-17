
import { useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useToast } from '@/hooks/use-toast';

export function useNotificationSystem() {
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  
  // Function to generate a reminder notification
  const generateReminderNotification = (subject: string) => {
    const notification = {
      type: 'reminder' as const,
      title: 'Complete your lesson',
      message: `You have an unfinished ${subject} lesson. Continue learning!`
    };
    
    addNotification(notification);
    
    // Also show a toast
    toast({
      title: notification.title,
      description: notification.message,
    });
  };
  
  // Function to notify about new content
  const notifyNewContent = (subject: string) => {
    const notification = {
      type: 'content' as const,
      title: 'New content available',
      message: `We've added new modules to ${subject}. Check them out!`
    };
    
    addNotification(notification);
    
    // Also show a toast
    toast({
      title: notification.title,
      description: notification.message,
    });
  };
  
  // Function to remind about streaks
  const remindStreak = (days: number) => {
    const notification = {
      type: 'streak' as const,
      title: 'Keep your streak going!',
      message: `Log in tomorrow to maintain your ${days}-day streak`
    };
    
    addNotification(notification);
    
    // Also show a toast
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  return {
    generateReminderNotification,
    notifyNewContent,
    remindStreak
  };
}

// Demo hook to simulate notifications for demonstration purposes
export function useDemoNotifications() {
  const { generateReminderNotification, notifyNewContent, remindStreak } = useNotificationSystem();
  
  useEffect(() => {
    // Simulate a reminder notification after 20 seconds
    const reminderTimeout = setTimeout(() => {
      generateReminderNotification('Physics');
    }, 20000);
    
    // Simulate a new content notification after 45 seconds
    const contentTimeout = setTimeout(() => {
      notifyNewContent('Mathematics');
    }, 45000);
    
    // Simulate a streak reminder after 90 seconds
    const streakTimeout = setTimeout(() => {
      remindStreak(5);
    }, 90000);
    
    // Clean up timeouts
    return () => {
      clearTimeout(reminderTimeout);
      clearTimeout(contentTimeout);
      clearTimeout(streakTimeout);
    };
  }, []);
}
