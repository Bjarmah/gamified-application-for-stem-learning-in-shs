import React from 'react';
import { Bell, MessageSquare, Users, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useOptimizedNotifications } from '@/hooks/use-optimized-notifications';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useOptimizedNotifications();
  const unreadNotifications = notifications.filter(notification => !notification.read);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'room_message' && notification.data?.room_id) {
      navigate(`/rooms/${notification.data.room_id}`);
    } else if (notification.type === 'room_join' && notification.data?.room_id) {
      navigate(`/rooms/${notification.data.room_id}`);
    } else if (notification.type === 'quiz_complete' && notification.data?.room_id) {
      navigate(`/rooms/${notification.data.room_id}`);
    }
  };

  return (
    <div className="w-80">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {unreadNotifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-sm"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="h-96">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

const NotificationItem = ({ 
  notification, 
  onClick, 
  onDelete 
}: { 
  notification: any;
  onClick: () => void;
  onDelete: () => void;
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'room_join':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'room_message':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'quiz_complete':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'success':
        return <span className="text-green-500">✅</span>;
      case 'warning':
        return <span className="text-yellow-500">⚠️</span>;
      case 'error':
        return <span className="text-red-500">❌</span>;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 group ${
        notification.read 
          ? 'bg-muted/50 hover:bg-muted' 
          : 'bg-primary/10 hover:bg-primary/20 border border-primary/20'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm truncate">{notification.title}</p>
            <span className="text-xs text-muted-foreground ml-2">
              {formatTimeAgo(notification.created_at)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          {!notification.read && (
            <Badge variant="secondary" className="mt-2 text-xs">
              New
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export { NotificationDropdown as default };