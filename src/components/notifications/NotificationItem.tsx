
import React from 'react';
import { Bell, BookOpen, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'reminder' | 'content' | 'streak';

interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  onRead: (id: string) => void;
}

const NotificationItem = ({
  id,
  type,
  title,
  message,
  time,
  read,
  onRead
}: NotificationItemProps) => {
  const getIcon = () => {
    switch (type) {
      case 'reminder':
        return <BookOpen className="text-stemPurple" size={18} />;
      case 'content':
        return <Bell className="text-stemGreen" size={18} />;
      case 'streak':
        return <Trophy className="text-stemYellow" size={18} />;
      default:
        return <Bell className="text-stemPurple" size={18} />;
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start p-3 border-b last:border-b-0 transition-colors",
        read ? "bg-background" : "bg-muted/30"
      )}
      onClick={() => onRead(id)}
    >
      <div className="flex-shrink-0 p-1">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium">{title}</h4>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {!read && (
        <div className="w-2 h-2 rounded-full bg-stemPurple flex-shrink-0 mt-2" />
      )}
    </div>
  );
};

export default NotificationItem;
