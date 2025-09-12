import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, BellRing, X, CheckCircle, AlertTriangle, Brain, Target, 
  Clock, TrendingUp, Award, Calendar, Zap, Play, RefreshCw
} from 'lucide-react';
import { useAIInsightsNotifications } from '@/hooks/use-ai-insights-notifications';
import { useToast } from '@/hooks/use-toast';

interface SmartNotificationCenterProps {
  className?: string;
  compact?: boolean;
}

export const SmartNotificationCenter: React.FC<SmartNotificationCenterProps> = ({ 
  className,
  compact = false 
}) => {
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    highPriorityCount,
    actionableCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    getUnreadNotifications,
    getActionableNotifications,
    getHighPriorityNotifications,
    processNotificationRules
  } = useAIInsightsNotifications();

  const [activeTab, setActiveTab] = useState('all');

  const handleNotificationAction = (notification: any) => {
    if (!notification.actionable) return;

    // Mark as read when action is taken
    markAsRead(notification.id);

    // Execute action based on type
    switch (notification.category) {
      case 'knowledge_gaps':
        toast({
          title: "Starting Practice Session",
          description: `Focusing on ${notification.actionData.subject}: ${notification.actionData.topic}`,
          duration: 4000,
        });
        break;
      
      case 'scheduling':
        toast({
          title: "Study Session Ready",
          description: "Optimal learning time detected. Let's make the most of it!",
          duration: 3000,
        });
        break;
      
      case 'performance':
        toast({
          title: "Action Plan Activated",
          description: "Reviewing performance risks and recommendations.",
          duration: 4000,
        });
        break;
      
      default:
        toast({
          title: "Action Triggered",
          description: notification.actionText || "Action completed successfully.",
          duration: 3000,
        });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'insight': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'recommendation': return <Target className="h-4 w-4 text-blue-500" />;
      case 'achievement': return <Award className="h-4 w-4 text-yellow-500" />;
      case 'reminder': return <Clock className="h-4 w-4 text-green-500" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'learning_patterns': return 'bg-purple-100 text-purple-800';
      case 'knowledge_gaps': return 'bg-orange-100 text-orange-800';
      case 'performance': return 'bg-red-100 text-red-800';
      case 'motivation': return 'bg-yellow-100 text-yellow-800';
      case 'scheduling': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread': return getUnreadNotifications();
      case 'high-priority': return getHighPriorityNotifications();
      case 'actionable': return getActionableNotifications();
      case 'all':
      default:
        return notifications.slice(0, 20); // Limit to recent 20
    }
  };

  const filteredNotifications = getFilteredNotifications();

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Smart Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>All caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="p-2 border rounded text-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium">{notification.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {notification.actionable && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 text-xs h-6"
                        onClick={() => handleNotificationAction(notification)}
                      >
                        {notification.actionText}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            <CardTitle>Smart Notification Center</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={processNotificationRules}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <CardDescription>
          AI-powered notifications based on your learning patterns and performance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="high-priority" className="text-xs">
              Priority ({highPriorityCount})
            </TabsTrigger>
            <TabsTrigger value="actionable" className="text-xs">
              Action ({actionableCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <ScrollArea className="h-[400px]">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications in this category</p>
                  <p className="text-sm mt-2">
                    {activeTab === 'all' 
                      ? "Generate AI insights to receive personalized notifications"
                      : "Check other categories for available notifications"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div className={`p-4 border rounded-lg transition-all ${
                        notification.read ? 'opacity-70 bg-muted/30' : 'bg-accent/20'
                      } ${notification.priority === 'urgent' ? 'border-red-200 bg-red-50' : ''}`}>
                        
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <span className="font-medium text-sm">{notification.title}</span>
                            <Badge variant={getPriorityVariant(notification.priority)} className="text-xs">
                              {notification.priority}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp.toLocaleTimeString()}
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
                        
                        {/* Message */}
                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getCategoryBadgeColor(notification.category)}`}
                            >
                              {notification.category.replace('_', ' ')}
                            </Badge>
                            
                            {notification.triggerCondition && (
                              <span className="text-xs text-muted-foreground">
                                • {notification.triggerCondition}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {notification.actionable && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleNotificationAction(notification)}
                                className="text-xs"
                              >
                                <Play className="h-3 w-3 mr-1" />
                                {notification.actionText}
                              </Button>
                            )}
                            
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs"
                              >
                                Mark read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {index < filteredNotifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};