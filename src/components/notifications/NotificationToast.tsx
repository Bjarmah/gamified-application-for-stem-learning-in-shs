import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, MessageSquare, Users, Trophy } from 'lucide-react';
import { useOptimizedNotifications } from '@/hooks/use-optimized-notifications';

export const NotificationToast = () => {
  const { notifications } = useOptimizedNotifications();

  useEffect(() => {
    // Show toast for the most recent notification if it's unread
    const latestNotification = notifications[0];
    if (latestNotification && !latestNotification.read) {
      const getIcon = (type: string) => {
        switch (type) {
          case 'room_join':
            return <Users className="h-4 w-4 text-blue-500" />;
          case 'room_message':
            return <MessageSquare className="h-4 w-4 text-green-500" />;
          case 'quiz_complete':
            return <Trophy className="h-4 w-4 text-yellow-500" />;
          default:
            return <Bell className="h-4 w-4 text-primary" />;
        }
      };

      toast.success(latestNotification.title, {
        description: latestNotification.message,
        icon: getIcon(latestNotification.type),
        duration: 5000,
      });
    }
  }, [notifications]);

  return null; // This component doesn't render anything visible
};