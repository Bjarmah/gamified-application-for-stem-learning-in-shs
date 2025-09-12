import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Brain, Bell, Zap, Clock, Target, TrendingUp,
  AlertCircle, CheckCircle, XCircle, Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useToast } from '@/hooks/use-toast';

interface SmartNotification {
  id: string;
  type: 'study_reminder' | 'weak_area' | 'achievement' | 'motivation' | 'adaptive_content';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  actionable: boolean;
  category: string;
  aiGenerated: boolean;
}

interface NotificationSettings {
  studyReminders: boolean;
  weakAreaAlerts: boolean;
  achievementUpdates: boolean;
  motivationalBoosts: boolean;
  adaptiveContent: boolean;
  smartTiming: boolean;
}

export const SmartNotificationSystem: React.FC = () => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    studyReminders: true,
    weakAreaAlerts: true,
    achievementUpdates: true,
    motivationalBoosts: true,
    adaptiveContent: true,
    smartTiming: true
  });

  // Generate AI-powered notifications
  useEffect(() => {
    if (!analytics || !user) return;

    const generateSmartNotifications = () => {
      const newNotifications: SmartNotification[] = [];

      // Study reminder based on optimal time
      if (settings.studyReminders) {
        const now = new Date();
        const hour = now.getHours();
        
        // Personalized study time (evening for most students)
        if (hour === 19 && analytics.streak > 0) {
          newNotifications.push({
            id: `study_${Date.now()}`,
            type: 'study_reminder',
            title: 'Perfect Study Time! 🎯',
            message: 'Based on your patterns, you perform best at this time. Ready to continue your streak?',
            priority: 'high',
            timestamp: new Date(),
            actionable: true,
            category: 'Study',
            aiGenerated: true
          });
        }
      }

      // Weak area detection
      if (settings.weakAreaAlerts && analytics.averageScore < 75) {
        newNotifications.push({
          id: `weak_${Date.now()}`,
          type: 'weak_area',
          title: 'Improvement Opportunity',
          message: 'AI detected concepts that need reinforcement. Let\'s tackle them together!',
          priority: 'medium',
          timestamp: new Date(),
          actionable: true,
          category: 'Learning',
          aiGenerated: true
        });
      }

      // Achievement notification
      if (settings.achievementUpdates && analytics.streak >= 7) {
        newNotifications.push({
          id: `achievement_${Date.now()}`,
          type: 'achievement',
          title: 'Streak Master! 🔥',
          message: `Amazing! You've maintained a ${analytics.streak}-day learning streak. You're building excellent habits!`,
          priority: 'high',
          timestamp: new Date(),
          actionable: false,
          category: 'Achievement',
          aiGenerated: true
        });
      }

      // Motivational boost
      if (settings.motivationalBoosts && analytics.progressTrend === 'increasing') {
        newNotifications.push({
          id: `motivation_${Date.now()}`,
          type: 'motivation',
          title: 'You\'re Improving! 📈',
          message: 'Your performance has been consistently improving. Keep up the fantastic work!',
          priority: 'low',
          timestamp: new Date(),
          actionable: false,
          category: 'Motivation',
          aiGenerated: true
        });
      }

      // Adaptive content suggestion
      if (settings.adaptiveContent) {
        newNotifications.push({
          id: `content_${Date.now()}`,
          type: 'adaptive_content',
          title: 'Personalized Content Ready',
          message: 'AI has prepared new practice questions tailored to your learning level.',
          priority: 'medium',
          timestamp: new Date(),
          actionable: true,
          category: 'Content',
          aiGenerated: true
        });
      }

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev.slice(0, 9)]);
        
        // Show toast for high priority notifications
        newNotifications
          .filter(n => n.priority === 'high')
          .forEach(notification => {
            toast({
              title: notification.title,
              description: notification.message,
              duration: 5000,
            });
          });
      }
    };

    // Generate notifications periodically
    generateSmartNotifications();
    const interval = setInterval(generateSmartNotifications, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [analytics, settings, user, toast]);

  const handleNotificationAction = (notification: SmartNotification) => {
    switch (notification.type) {
      case 'study_reminder':
        toast({
          title: "Study Session Started",
          description: "Let's make this session productive!",
          duration: 3000,
        });
        break;
      case 'weak_area':
        toast({
          title: "Opening Practice Mode",
          description: "Targeted practice for your improvement areas",
          duration: 3000,
        });
        break;
      case 'adaptive_content':
        toast({
          title: "Loading Personalized Content",
          description: "AI-generated questions at your level",
          duration: 3000,
        });
        break;
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: SmartNotification['type']) => {
    switch (type) {
      case 'study_reminder': return Clock;
      case 'weak_area': return AlertCircle;
      case 'achievement': return CheckCircle;
      case 'motivation': return TrendingUp;
      case 'adaptive_content': return Brain;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Smart Notifications
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Notification Preferences
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {key === 'studyReminders' && 'Optimal study time alerts'}
                    {key === 'weakAreaAlerts' && 'Learning gap notifications'}
                    {key === 'achievementUpdates' && 'Progress celebrations'}
                    {key === 'motivationalBoosts' && 'Encouragement messages'}
                    {key === 'adaptiveContent' && 'Personalized content suggestions'}
                    {key === 'smartTiming' && 'AI-optimized delivery times'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Notifications</h3>
            <Badge variant="outline">{notifications.length} active</Badge>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
              <p className="text-xs">AI will generate personalized alerts based on your activity</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-2 ${getPriorityColor(notification.priority)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-white">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {notification.category}
                          </Badge>
                          {notification.aiGenerated && (
                            <Badge variant="secondary" className="text-xs">
                              AI
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                          
                          <div className="flex gap-2">
                            {notification.actionable && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 text-xs"
                                onClick={() => handleNotificationAction(notification)}
                              >
                                Take Action
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-xs"
                              onClick={() => dismissNotification(notification.id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Analytics Integration */}
        {analytics && (
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <h4 className="text-sm font-medium">AI Analysis Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-primary">{analytics.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary">
                  {analytics.averageScore?.toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary capitalize">
                  {analytics.progressTrend}
                </p>
                <p className="text-xs text-muted-foreground">Trend</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};