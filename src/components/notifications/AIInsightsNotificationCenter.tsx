import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Brain,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  X,
  Lightbulb,
  Calendar,
  Zap
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface InsightNotification {
  id: string;
  type: 'suggestion' | 'achievement' | 'reminder' | 'insight';
  title: string;
  message: string;
  actionLabel?: string;
  actionHandler?: () => void;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

interface AIInsightsNotificationCenterProps {
  className?: string;
}

export const AIInsightsNotificationCenter = ({ className }: AIInsightsNotificationCenterProps) => {
  const { user } = useAuth();
  const { getLatestInsight, generateInsights, cachedInsights } = useLearningInsights();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<InsightNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    generateSmartNotifications();
  }, [cachedInsights]);

  const generateSmartNotifications = () => {
    const newNotifications: InsightNotification[] = [];
    
    // Check if user hasn't generated any insights recently
    if (!cachedInsights || cachedInsights.length === 0) {
      newNotifications.push({
        id: 'welcome-ai',
        type: 'suggestion',
        title: 'Welcome to AI Learning Analytics!',
        message: 'Start by generating your first AI-powered learning insight to get personalized recommendations.',
        actionLabel: 'Get Started',
        actionHandler: () => generateInsights('comprehensive_insights'),
        timestamp: new Date(),
        priority: 'high',
        read: false
      });
    }

    // Check for outdated insights (older than 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const hasRecentInsights = cachedInsights?.some(insight => 
      new Date(insight.generatedAt) > oneWeekAgo
    );

    if (cachedInsights?.length > 0 && !hasRecentInsights) {
      newNotifications.push({
        id: 'outdated-insights',
        type: 'reminder',
        title: 'Time for Fresh Insights!',
        message: 'Your learning insights are over a week old. Generate new ones for the latest recommendations.',
        actionLabel: 'Refresh Insights',
        actionHandler: () => generateInsights('comprehensive_insights'),
        timestamp: new Date(),
        priority: 'medium',
        read: false
      });
    }

    // Check for specific insight types and suggest missing ones
    const comprehensiveData = getLatestInsight('comprehensive_insights');
    const patternsData = getLatestInsight('learning_patterns');
    const predictiveData = getLatestInsight('predictive_insights');
    const gapsData = getLatestInsight('knowledge_gaps');

    if (comprehensiveData && !patternsData) {
      newNotifications.push({
        id: 'missing-patterns',
        type: 'suggestion',
        title: 'Discover Your Learning Patterns',
        message: 'Find out when you learn best and optimize your study schedule.',
        actionLabel: 'Analyze Patterns',
        actionHandler: () => generateInsights('learning_patterns'),
        timestamp: new Date(),
        priority: 'medium',
        read: false
      });
    }

    if (comprehensiveData && !gapsData) {
      newNotifications.push({
        id: 'missing-gaps',
        type: 'suggestion',
        title: 'Identify Knowledge Gaps',
        message: 'Get targeted recommendations to strengthen weak areas in your learning.',
        actionLabel: 'Find Gaps',
        actionHandler: () => generateInsights('knowledge_gaps'),
        timestamp: new Date(),
        priority: 'medium',
        read: false
      });
    }

    // Achievement notifications for new insights
    if (cachedInsights?.length >= 4) {
      const hasAchievementNotification = notifications.some(n => n.id === 'insights-achievement');
      if (!hasAchievementNotification) {
        newNotifications.push({
          id: 'insights-achievement',
          type: 'achievement',
          title: 'AI Analytics Master!',
          message: 'Congratulations! You\'ve generated all types of AI insights. You\'re making the most of personalized learning.',
          timestamp: new Date(),
          priority: 'low',
          read: false
        });
      }
    }

    // Study reminders based on patterns
    if (patternsData?.insights?.peakTimes && patternsData.insights.peakTimes.length > 0) {
      const now = new Date();
      const currentHour = now.getHours();
      const peakHour = patternsData.insights.peakTimes[0];
      
      if (peakHour && Math.abs(currentHour - parseInt(peakHour.split(':')[0])) <= 1) {
        newNotifications.push({
          id: `study-reminder-${now.toDateString()}`,
          type: 'reminder',
          title: 'Optimal Study Time!',
          message: `This is one of your peak learning times (${peakHour}). Perfect moment for a focused study session.`,
          actionLabel: 'Start Session',
          actionHandler: () => {
            toast({
              title: "🎯 Study Session Ready!",
              description: "You're in your optimal learning zone. Make the most of it!",
              duration: 4000,
            });
          },
          timestamp: new Date(),
          priority: 'high',
          read: false
        });
      }
    }

    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const filteredNew = newNotifications.filter(n => !existingIds.includes(n.id));
      return [...prev, ...filteredNew];
    });

    setUnreadCount(prev => prev + newNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const dismissNotification = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'achievement': return <Target className="h-5 w-5 text-green-500" />;
      case 'reminder': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'insight': return <Brain className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const recentNotifications = notifications
    .filter(n => !n.read)
    .sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    })
    .slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            AI Insights Center
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">
                {unreadCount} new
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="text-sm text-muted-foreground">
              You're all caught up! No new AI insights notifications.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentNotifications.map((notification, index) => (
              <div key={notification.id}>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant={getPriorityColor(notification.priority)} 
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissNotification(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleDateString()}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {notification.actionHandler && notification.actionLabel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              notification.actionHandler!();
                              markAsRead(notification.id);
                            }}
                            className="text-xs"
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                          >
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {index < recentNotifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};