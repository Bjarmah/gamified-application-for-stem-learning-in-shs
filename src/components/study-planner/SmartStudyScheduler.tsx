import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  Clock, 
  Brain, 
  Target, 
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  Bell
} from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  scheduledTime: Date;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high';
  aiRecommended: boolean;
  estimatedEffectiveness: number;
}

interface StudyPreferences {
  preferredTimes: string[];
  sessionLength: number;
  breakDuration: number;
  maxSessionsPerDay: number;
  focusAreas: string[];
  enableSmartScheduling: boolean;
  remindersEnabled: boolean;
}

export const SmartStudyScheduler: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'preferences' | 'analytics'>('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [optimizing, setOptimizing] = useState(false);

  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: '1',
      subject: 'Chemistry',
      topic: 'Chemical Bonding',
      duration: 45,
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      completed: false,
      difficulty: 'medium',
      priority: 'high',
      aiRecommended: true,
      estimatedEffectiveness: 92
    },
    {
      id: '2',
      subject: 'Mathematics',
      topic: 'Calculus Integration',
      duration: 30,
      scheduledTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      completed: false,
      difficulty: 'hard',
      priority: 'medium',
      aiRecommended: true,
      estimatedEffectiveness: 85
    },
    {
      id: '3',
      subject: 'Physics',
      topic: 'Wave Mechanics',
      duration: 60,
      scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      completed: true,
      difficulty: 'medium',
      priority: 'medium',
      aiRecommended: false,
      estimatedEffectiveness: 78
    }
  ]);

  const [preferences, setPreferences] = useState<StudyPreferences>({
    preferredTimes: ['09:00', '14:00', '19:00'],
    sessionLength: 45,
    breakDuration: 15,
    maxSessionsPerDay: 4,
    focusAreas: ['Chemistry', 'Mathematics', 'Physics'],
    enableSmartScheduling: true,
    remindersEnabled: true
  });

  const optimizeSchedule = async () => {
    setOptimizing(true);
    // Simulate AI optimization
    setTimeout(() => {
      // Reorder sessions based on optimal timing
      const optimizedSessions = [...sessions].sort((a, b) => {
        // Prioritize high priority sessions
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        
        // Then by effectiveness
        return b.estimatedEffectiveness - a.estimatedEffectiveness;
      });
      
      setSessions(optimizedSessions);
      setOptimizing(false);
    }, 2000);
  };

  const markSessionCompleted = (sessionId: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, completed: true }
          : session
      )
    );
  };

  const rescheduleSession = (sessionId: string, newTime: Date) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, scheduledTime: newTime }
          : session
      )
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'medium': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'low': return <Clock className="h-3 w-3 text-green-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return 'text-green-600';
    if (effectiveness >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const todaySessions = sessions.filter(session => {
    const today = new Date();
    const sessionDate = new Date(session.scheduledTime);
    return sessionDate.toDateString() === today.toDateString();
  });

  const completedToday = todaySessions.filter(s => s.completed).length;
  const totalStudyTime = todaySessions.reduce((acc, session) => acc + session.duration, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Smart Study Scheduler
        </CardTitle>
        <CardDescription>
          AI-optimized study planning based on your performance patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-2">
          {[
            { key: 'schedule', label: 'Schedule', icon: Calendar },
            { key: 'preferences', label: 'Preferences', icon: Settings },
            { key: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(key as any)}
              className="flex items-center gap-1"
            >
              <Icon className="h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {/* Today's Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Today's Schedule</h4>
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Sessions:</span>
                  <div className="font-medium">{completedToday}/{todaySessions.length}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Study Time:</span>
                  <div className="font-medium">{totalStudyTime}min</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Progress:</span>
                  <div className="font-medium">
                    {todaySessions.length > 0 ? Math.round((completedToday / todaySessions.length) * 100) : 0}%
                  </div>
                </div>
              </div>
              <Progress 
                value={todaySessions.length > 0 ? (completedToday / todaySessions.length) * 100 : 0} 
                className="h-2" 
              />
            </div>

            {/* Optimization Controls */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-purple-500" />
                <div>
                  <span className="font-medium text-sm">Smart Scheduling</span>
                  <p className="text-xs text-muted-foreground">AI optimizes your study schedule for maximum effectiveness</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={preferences.enableSmartScheduling} 
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, enableSmartScheduling: checked }))
                  }
                />
                <Button 
                  size="sm" 
                  onClick={optimizeSchedule}
                  disabled={optimizing || !preferences.enableSmartScheduling}
                >
                  {optimizing ? (
                    <>
                      <Brain className="h-3 w-3 mr-1 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      Optimize
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Study Sessions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Scheduled Sessions</h4>
                <Button size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Session
                </Button>
              </div>
              
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    session.completed 
                      ? 'bg-green-50 border-green-200' 
                      : new Date(session.scheduledTime) < new Date()
                        ? 'bg-red-50 border-red-200'
                        : 'bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        {session.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium">{session.subject}</h5>
                          {getPriorityIcon(session.priority)}
                          {session.aiRecommended && (
                            <Badge variant="outline" className="text-xs">
                              <Brain className="h-2 w-2 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{session.topic}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={getDifficultyColor(session.difficulty)}>
                            {session.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-2 w-2 mr-1" />
                            {session.duration}min
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(session.scheduledTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className={`text-xs ${getEffectivenessColor(session.estimatedEffectiveness)}`}>
                        {session.estimatedEffectiveness}% effective
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {!session.completed && (
                      <Button
                        size="sm"
                        onClick={() => markSessionCompleted(session.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Study Times</label>
                <div className="flex gap-2 flex-wrap">
                  {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00', '19:00', '20:00'].map((time) => (
                    <Button
                      key={time}
                      variant={preferences.preferredTimes.includes(time) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          preferredTimes: prev.preferredTimes.includes(time)
                            ? prev.preferredTimes.filter(t => t !== time)
                            : [...prev.preferredTimes, time]
                        }));
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Length (minutes)</label>
                  <input
                    type="number"
                    value={preferences.sessionLength}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      sessionLength: parseInt(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    min="15"
                    max="120"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Break Duration (minutes)</label>
                  <input
                    type="number"
                    value={preferences.breakDuration}
                    onChange={(e) => setPreferences(prev => ({ 
                      ...prev, 
                      breakDuration: parseInt(e.target.value) 
                    }))}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    min="5"
                    max="60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Sessions Per Day</label>
                <input
                  type="number"
                  value={preferences.maxSessionsPerDay}
                  onChange={(e) => setPreferences(prev => ({ 
                    ...prev, 
                    maxSessionsPerDay: parseInt(e.target.value) 
                  }))}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  min="1"
                  max="10"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Study Reminders</span>
                    <p className="text-xs text-muted-foreground">Get notified before study sessions</p>
                  </div>
                  <Switch 
                    checked={preferences.remindersEnabled}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, remindersEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Smart Scheduling</span>
                    <p className="text-xs text-muted-foreground">Let AI optimize your schedule</p>
                  </div>
                  <Switch 
                    checked={preferences.enableSmartScheduling}
                    onCheckedChange={(checked) => 
                      setPreferences(prev => ({ ...prev, enableSmartScheduling: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Completion Rate</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">87%</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Avg. Session</span>
                </div>
                <div className="text-2xl font-bold text-green-600">42min</div>
                <p className="text-xs text-muted-foreground">Optimal range</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Schedule Optimization Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Your focus is 23% higher during morning sessions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-purple-500 mt-0.5" />
                  <span>Chemistry sessions are most effective after 2 PM</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>45-minute sessions show optimal retention rates</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};