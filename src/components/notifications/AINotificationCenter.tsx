import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIService } from '@/hooks/use-ai-service';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';
import { useGamification } from '@/hooks/use-gamification';
import { 
  Bell, 
  TrendingUp, 
  AlertCircle, 
  Award, 
  BookOpen, 
  Target,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface AINotification {
  id: string;
  type: 'insight' | 'achievement' | 'reminder' | 'warning' | 'tip';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const AINotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { generateLearningInsights } = useAIService();
  const { performance, recommendations } = useLearningAnalytics();
  const { gamificationData } = useGamification();

  useEffect(() => {
    generateAINotifications();
  }, [performance, recommendations, gamificationData]);

  const generateAINotifications = () => {
    const newNotifications: AINotification[] = [];

    // Achievement notifications
    if (gamificationData?.current_streak && gamificationData.current_streak >= 7) {
      newNotifications.push({
        id: `achievement-${Date.now()}-1`,
        type: 'achievement',
        title: '🔥 Amazing Streak!',
        message: `You're on a ${gamificationData.current_streak}-day streak! Keep it up!`,
        priority: 'high',
        timestamp: new Date(),
        read: false,
        actionUrl: '/achievements'
      });
    }

    // Performance insights
    if (performance && performance.length > 0) {
      const avgScore = performance.reduce((sum, p) => sum + p.averageScore, 0) / performance.length;
      
      if (avgScore >= 85) {
        newNotifications.push({
          id: `insight-${Date.now()}-1`,
          type: 'insight',
          title: '📊 Excellent Performance',
          message: `Your average score is ${Math.round(avgScore)}%! You're mastering the material.`,
          priority: 'medium',
          timestamp: new Date(),
          read: false,
          actionUrl: '/analytics'
        });
      } else if (avgScore < 60) {
        newNotifications.push({
          id: `warning-${Date.now()}-1`,
          type: 'warning',
          title: '⚠️ Need More Practice',
          message: 'Your scores suggest you need more practice. Let\'s create a study plan!',
          priority: 'high',
          timestamp: new Date(),
          read: false,
          actionUrl: '/insights'
        });
      }
    }

    // Weak areas notifications
    if (recommendations && recommendations.length > 0) {
      const weakArea = recommendations.find(r => r.priority === 'high');
      if (weakArea) {
        newNotifications.push({
          id: `tip-${Date.now()}-1`,
          type: 'tip',
          title: '💡 Study Suggestion',
          message: weakArea.reason,
          priority: 'medium',
          timestamp: new Date(),
          read: false,
          actionUrl: '/insights'
        });
      }
    }

    // Study reminder
    const lastStudy = localStorage.getItem('lastStudyTime');
    if (lastStudy) {
      const hoursSince = (Date.now() - parseInt(lastStudy)) / (1000 * 60 * 60);
      if (hoursSince > 24) {
        newNotifications.push({
          id: `reminder-${Date.now()}-1`,
          type: 'reminder',
          title: '⏰ Time to Study',
          message: 'You haven\'t studied in over 24 hours. Ready for a quick session?',
          priority: 'low',
          timestamp: new Date(),
          read: false,
          actionUrl: '/subjects'
        });
      }
    }

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: AINotification['type']) => {
    switch (type) {
      case 'insight': return <TrendingUp className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'tip': return <BookOpen className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: AINotification['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            AI Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read ? 'bg-muted/30' : 'bg-card border-primary/20'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${notification.read ? 'opacity-50' : ''}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm ${notification.read ? 'opacity-70' : ''}`}>
                          {notification.title}
                        </p>
                        <Badge 
                          variant={getPriorityColor(notification.priority)}
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className={`text-sm ${notification.read ? 'opacity-60' : 'opacity-80'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs opacity-50">
                        {notification.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {notification.actionUrl && !notification.read && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="h-auto p-0 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = notification.actionUrl!;
                          }}
                        >
                          View Details →
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
