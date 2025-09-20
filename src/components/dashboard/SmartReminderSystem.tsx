import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Lightbulb,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LearningReminder {
  id: string;
  type: 'study_time' | 'quiz_due' | 'streak_risk' | 'goal_check' | 'review_session';
  title: string;
  message: string;
  scheduledFor: Date;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

interface SmartReminderSystemProps {
  studyStreak: number;
  dailyGoalProgress: number;
  upcomingDeadlines: Array<{
    title: string;
    date: Date;
    type: string;
  }>;
}

const SmartReminderSystem: React.FC<SmartReminderSystemProps> = ({
  studyStreak,
  dailyGoalProgress,
  upcomingDeadlines
}) => {
  const [reminders, setReminders] = useState<LearningReminder[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [goalNotifications, setGoalNotifications] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    generateSmartReminders();
  }, [studyStreak, dailyGoalProgress, upcomingDeadlines]);

  const generateSmartReminders = () => {
    const now = new Date();
    const newReminders: LearningReminder[] = [];

    // Study streak risk warning
    if (studyStreak > 3 && streakAlerts) {
      const lastStudyTime = new Date(now.getTime() - 20 * 60 * 60 * 1000); // 20 hours ago
      if (now.getHours() > 20) {
        newReminders.push({
          id: 'streak-risk',
          type: 'streak_risk',
          title: 'Streak Alert! 🔥',
          message: `Don't break your ${studyStreak}-day streak! Complete a quick quiz before midnight.`,
          scheduledFor: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutes
          isActive: true,
          priority: 'high',
          icon: '🔥'
        });
      }
    }

    // Daily goal reminder
    if (dailyGoalProgress < 50 && goalNotifications) {
      newReminders.push({
        id: 'daily-goal',
        type: 'goal_check',
        title: 'Daily Goal Check',
        message: `You're ${Math.round(dailyGoalProgress)}% to your daily goal. Keep going!`,
        scheduledFor: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
        isActive: true,
        priority: 'medium',
        icon: '🎯'
      });
    }

    // Optimal study time suggestions
    if (studyReminders) {
      const optimalTimes = [
        { hour: 9, message: "Morning focus session - your brain is fresh!" },
        { hour: 14, message: "Afternoon review - reinforce what you learned!" },
        { hour: 19, message: "Evening practice - end the day strong!" }
      ];

      optimalTimes.forEach((time, index) => {
        if (now.getHours() < time.hour) {
          const reminderTime = new Date(now);
          reminderTime.setHours(time.hour, 0, 0, 0);
          
          newReminders.push({
            id: `study-time-${index}`,
            type: 'study_time',
            title: 'Optimal Study Time',
            message: time.message,
            scheduledFor: reminderTime,
            isActive: true,
            priority: 'low',
            icon: '📚'
          });
        }
      });
    }

    // Upcoming deadline reminders
    upcomingDeadlines.forEach((deadline, index) => {
      const daysUntil = Math.ceil((deadline.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil <= 3 && daysUntil > 0) {
        newReminders.push({
          id: `deadline-${index}`,
          type: 'quiz_due',
          title: 'Deadline Approaching!',
          message: `${deadline.title} is due in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
          scheduledFor: new Date(deadline.date.getTime() - 24 * 60 * 60 * 1000), // 1 day before
          isActive: true,
          priority: daysUntil === 1 ? 'high' : 'medium',
          icon: '⏰'
        });
      }
    });

    // Spaced repetition reminders
    const reviewTopics = ['Photosynthesis', 'Atomic Structure', 'Quadratic Equations'];
    reviewTopics.forEach((topic, index) => {
      newReminders.push({
        id: `review-${index}`,
        type: 'review_session',
        title: 'Review Session',
        message: `Time to review: ${topic}`,
        scheduledFor: new Date(now.getTime() + (index + 1) * 2 * 60 * 60 * 1000),
        isActive: true,
        priority: 'low',
        icon: '🔄'
      });
    });

    setReminders(newReminders.sort((a, b) => 
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    ));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const snoozeReminder = (id: string, minutes: number) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { 
            ...reminder, 
            scheduledFor: new Date(reminder.scheduledFor.getTime() + minutes * 60 * 1000)
          }
        : reminder
    ));
    
    toast({
      title: "Reminder snoozed",
      description: `Reminder postponed by ${minutes} minutes`
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Smart Learning Reminders
          </CardTitle>
          <Switch 
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
        <CardDescription>
          AI-powered reminders to optimize your learning schedule
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="reminders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reminders">Active Reminders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reminders" className="space-y-4 mt-4">
            {reminders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                <p>All caught up! We'll create new reminders based on your activity.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`p-3 rounded-lg border ${getPriorityColor(reminder.priority)} ${
                      !reminder.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{reminder.icon}</span>
                          <h4 className="font-medium">{reminder.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {formatTime(reminder.scheduledFor)}
                          </Badge>
                        </div>
                        <p className="text-sm opacity-90">{reminder.message}</p>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => snoozeReminder(reminder.id, 30)}
                          className="text-xs px-2"
                        >
                          +30m
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleReminder(reminder.id)}
                          className="text-xs px-2"
                        >
                          {reminder.isActive ? 'Pause' : 'Resume'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Study Time Reminders</label>
                  <p className="text-xs text-muted-foreground">
                    Optimal study time suggestions
                  </p>
                </div>
                <Switch 
                  checked={studyReminders}
                  onCheckedChange={setStudyReminders}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Streak Alerts</label>
                  <p className="text-xs text-muted-foreground">
                    Notifications when streak is at risk
                  </p>
                </div>
                <Switch 
                  checked={streakAlerts}
                  onCheckedChange={setStreakAlerts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Goal Notifications</label>
                  <p className="text-xs text-muted-foreground">
                    Daily and weekly goal progress
                  </p>
                </div>
                <Switch 
                  checked={goalNotifications}
                  onCheckedChange={setGoalNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Sound Effects</label>
                  <p className="text-xs text-muted-foreground">
                    Audio notifications for reminders
                  </p>
                </div>
                <Switch 
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartReminderSystem;