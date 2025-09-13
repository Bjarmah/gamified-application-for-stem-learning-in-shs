import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, BellRing, X, CheckCircle, AlertTriangle, 
  Info, Zap, Clock, Target, Brain
} from 'lucide-react';
import { useAIInsightsNotifications } from '@/hooks/use-ai-insights-notifications';
import { useToast } from '@/hooks/use-toast';

interface AINotificationCenterProps {
  className?: string;
}

export const AINotificationCenter: React.FC<AINotificationCenterProps> = ({
  className = ""
}) => {
  const { 
    notifications, 
    unreadCount, 
    highPriorityCount,
    actionableCount,
    markAsRead, 
    markAllAsRead, 
    dismissNotification,
    triggerTestNotification
  } = useAIInsightsNotifications();
  
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'recommendation':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'insight':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-primary/20 bg-background';
    }
  };

  const handleNotificationAction = (notification: any) => {
    if (notification.isActionable) {
      toast({
        title: "Action Triggered",
        description: `Taking action for: ${notification.title}`,
        duration: 3000,
      });
      
      // Mark as read when action is taken
      markAsRead(notification.id);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!isExpanded) {
    return (
      <Card className={`${className} cursor-pointer hover:shadow-md transition-shadow`} 
            onClick={() => setIsExpanded(true)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {unreadCount > 0 ? (
                <BellRing className="h-4 w-4 text-primary" />
              ) : (
                <Bell className="h-4 w-4 text-muted-foreground" />
              )}
              AI Notifications
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
              {actionableCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {actionableCount} actionable
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 
              ? `${unreadCount} new AI-powered insights and recommendations`
              : 'All caught up! No new insights.'
            }
          </p>
          {notifications.length > 0 && (
            <div className="mt-2 space-y-1">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-center gap-2 text-xs">
                  {getNotificationIcon(notification.type)}
                  <span className={`truncate ${!notification.isRead ? 'font-medium' : ''}`}>
                    {notification.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-primary/20`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Notification Center
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        
        {/* Summary Stats */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="h-5">
              {notifications.length} Total
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="destructive" className="h-5">
              {unreadCount} Unread
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="h-5">
              {highPriorityCount} High Priority
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs h-7"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={triggerTestNotification}
            className="text-xs h-7"
          >
            <Zap className="h-3 w-3 mr-1" />
            Test Notification
          </Button>
        </div>

        <Separator />

        {/* Notifications List */}
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No AI notifications yet</p>
              <p className="text-xs">Your AI insights will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg transition-all ${
                    notification.isRead ? 'opacity-70 bg-muted/30' : 'bg-background shadow-sm'
                  } ${getPriorityColor(notification.priority)}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="font-medium text-sm">{notification.title}</span>
                      <Badge 
                        variant={notification.priority === 'high' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {notification.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {notification.type.replace('_', ' ')}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      {notification.isActionable && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNotificationAction(notification)}
                          className="text-xs h-6"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Take Action
                        </Button>
                      )}
                      
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs h-6"
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};