import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, Award, BookOpen, Clock } from 'lucide-react';

interface AINotificationItemProps {
  id: string;
  type: 'insight' | 'achievement' | 'reminder' | 'warning' | 'tip';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  onMarkAsRead: (id: string) => void;
}

const ICON_MAP = {
  insight: TrendingUp,
  achievement: Award,
  reminder: Clock,
  warning: AlertCircle,
  tip: BookOpen,
} as const;

const PRIORITY_VARIANT = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
} as const;

export const AINotificationItem: React.FC<AINotificationItemProps> = ({
  id,
  type,
  title,
  message,
  priority,
  timestamp,
  read,
  actionUrl,
  onMarkAsRead,
}) => {
  const Icon = ICON_MAP[type];

  return (
    <div
      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
        read ? 'bg-muted/30' : 'bg-card border-primary/20'
      }`}
      onClick={() => onMarkAsRead(id)}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${read ? 'opacity-50' : ''}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className={`font-semibold text-sm ${read ? 'opacity-70' : ''}`}>
              {title}
            </p>
            <Badge variant={PRIORITY_VARIANT[priority]} className="text-xs">
              {priority}
            </Badge>
          </div>
          <p className={`text-sm ${read ? 'opacity-60' : 'opacity-80'}`}>
            {message}
          </p>
          <p className="text-xs opacity-50">
            {timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {actionUrl && !read && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = actionUrl;
              }}
            >
              View Details →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
