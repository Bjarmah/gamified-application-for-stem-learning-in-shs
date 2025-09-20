import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Lightbulb,
  Zap,
  BookOpen,
  BarChart3,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface LearningSession {
  id: string;
  subject: string;
  startTime: Date;
  duration: number; // minutes
  focusScore: number; // 0-100
  completedTasks: number;
  totalTasks: number;
  isActive: boolean;
}

interface CoachRecommendation {
  type: 'break' | 'switch_subject' | 'review' | 'continue' | 'deep_focus' | 'practice';
  urgency: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  action: string;
  icon: string;
  color: string;
  estimatedTime: number; // minutes
}

interface LearningMetrics {
  sessionStreak: number;
  avgFocusTime: number;
  preferredStudyTime: string;
  strongSubjects: string[];
  needsAttention: string[];
  todayStudyTime: number;
  weeklyGoal: number;
}

const RealTimeLearningCoach: React.FC = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [recommendations, setRecommendations] = useState<CoachRecommendation[]>([]);
  const [metrics, setMetrics] = useState<LearningMetrics | null>(null);
  const [isCoaching, setIsCoaching] = useState(true);
  const [sessionTimer, setSessionTimer] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize metrics and start coaching
    initializeMetrics();
    generateRecommendations();
    
    // Update timer every minute
    const interval = setInterval(() => {
      if (currentSession?.isActive) {
        setSessionTimer(prev => prev + 1);
        updateFocusScore();
        generateRecommendations();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const initializeMetrics = () => {
    // Simulate user learning metrics
    const mockMetrics: LearningMetrics = {
      sessionStreak: 3,
      avgFocusTime: 45,
      preferredStudyTime: '09:00-11:00',
      strongSubjects: ['Mathematics', 'Physics'],
      needsAttention: ['Chemistry', 'Biology'],
      todayStudyTime: 120, // minutes
      weeklyGoal: 600 // minutes
    };
    setMetrics(mockMetrics);
  };

  const startLearningSession = (subject: string) => {
    const newSession: LearningSession = {
      id: `session-${Date.now()}`,
      subject,
      startTime: new Date(),
      duration: 0,
      focusScore: 100,
      completedTasks: 0,
      totalTasks: 3,
      isActive: true
    };
    
    setCurrentSession(newSession);
    setSessionTimer(0);
    
    toast({
      title: "🎯 Session Started!",
      description: `Starting focused study session for ${subject}`
    });
  };

  const pauseSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: false,
        duration: sessionTimer
      });
      
      toast({
        title: "⏸️ Session Paused",
        description: "Take a break and come back when ready!"
      });
    }
  };

  const resumeSession = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        isActive: true
      });
      
      toast({
        title: "▶️ Session Resumed",
        description: "Welcome back! Let's continue learning."
      });
    }
  };

  const endSession = () => {
    if (currentSession) {
      const finalDuration = sessionTimer;
      
      // Update metrics
      if (metrics) {
        setMetrics({
          ...metrics,
          todayStudyTime: metrics.todayStudyTime + finalDuration
        });
      }
      
      setCurrentSession(null);
      setSessionTimer(0);
      
      toast({
        title: "🎉 Session Complete!",
        description: `Great work! You studied for ${finalDuration} minutes.`
      });
      
      generateRecommendations();
    }
  };

  const updateFocusScore = () => {
    if (currentSession) {
      // Simulate focus score decline over time (Pomodoro-like)
      let newScore = 100;
      if (sessionTimer > 25) newScore = Math.max(70, 100 - (sessionTimer - 25) * 2);
      if (sessionTimer > 45) newScore = Math.max(40, 100 - (sessionTimer - 25) * 3);
      
      setCurrentSession({
        ...currentSession,
        focusScore: newScore,
        duration: sessionTimer
      });
    }
  };

  const generateRecommendations = () => {
    if (!metrics) return;

    const newRecommendations: CoachRecommendation[] = [];
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    // Session-based recommendations
    if (currentSession?.isActive) {
      if (sessionTimer >= 45) {
        newRecommendations.push({
          type: 'break',
          urgency: 'high',
          title: 'Take a Break! 🧘‍♀️',
          description: 'You\'ve been studying for 45+ minutes. A 10-minute break will refresh your mind.',
          action: 'Take 10-min break',
          icon: '☕',
          color: 'text-red-600 bg-red-50 border-red-200',
          estimatedTime: 10
        });
      } else if (sessionTimer >= 25 && currentSession.focusScore < 70) {
        newRecommendations.push({
          type: 'review',
          urgency: 'medium',
          title: 'Quick Review 📝',
          description: 'Focus is declining. Review what you\'ve learned so far to reinforce understanding.',
          action: 'Review concepts',
          icon: '🔄',
          color: 'text-amber-600 bg-amber-50 border-amber-200',
          estimatedTime: 5
        });
      }
    } else {
      // No active session recommendations
      if (metrics.todayStudyTime < 60) {
        newRecommendations.push({
          type: 'continue',
          urgency: 'medium',
          title: 'Start Your Day Strong! 🌅',
          description: 'You haven\'t studied much today. A focused 25-minute session can make a big difference.',
          action: 'Start 25-min session',
          icon: '🚀',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          estimatedTime: 25
        });
      }
      
      // Time-based recommendations
      if (currentHour >= 9 && currentHour <= 11 && metrics.preferredStudyTime.includes('09:00')) {
        newRecommendations.push({
          type: 'deep_focus',
          urgency: 'high',
          title: 'Prime Study Time! ⚡',
          description: 'This is your optimal learning window. Perfect for tackling challenging topics.',
          action: 'Start deep work',
          icon: '🎯',
          color: 'text-green-600 bg-green-50 border-green-200',
          estimatedTime: 45
        });
      }
      
      // Subject-based recommendations
      if (metrics.needsAttention.length > 0) {
        newRecommendations.push({
          type: 'practice',
          urgency: 'medium',
          title: `Focus on ${metrics.needsAttention[0]} 📚`,
          description: 'This subject needs attention. Practice problems can help strengthen your understanding.',
          action: 'Practice problems',
          icon: '💪',
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          estimatedTime: 30
        });
      }
    }

    // Weekly goal recommendations
    const weeklyProgress = (metrics.todayStudyTime / (metrics.weeklyGoal / 7)) * 100;
    if (weeklyProgress < 50 && currentHour < 18) {
      newRecommendations.push({
        type: 'continue',
        urgency: 'low',
        title: 'Daily Goal Check 📊',
        description: `You're at ${Math.round(weeklyProgress)}% of your daily target. A short session helps maintain momentum.`,
        action: 'Quick session',
        icon: '📈',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        estimatedTime: 20
      });
    }

    setRecommendations(newRecommendations.slice(0, 3)); // Show top 3 recommendations
  };

  const executeRecommendation = (rec: CoachRecommendation) => {
    switch (rec.type) {
      case 'break':
        pauseSession();
        break;
      case 'continue':
      case 'deep_focus':
      case 'practice':
        if (metrics?.needsAttention[0]) {
          startLearningSession(metrics.needsAttention[0]);
        }
        break;
      case 'review':
        if (currentSession) {
          setCurrentSession({
            ...currentSession,
            focusScore: Math.min(100, currentSession.focusScore + 20)
          });
        }
        break;
    }
    
    toast({
      title: "Action taken! 👍",
      description: `Following recommendation: ${rec.action}`
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!user || !metrics) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Real-Time Learning Coach
            {currentSession?.isActive && (
              <Badge variant="default" className="bg-green-500 animate-pulse">
                Live
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCoaching(!isCoaching)}
          >
            <Settings className="h-4 w-4 mr-1" />
            {isCoaching ? 'Disable' : 'Enable'}
          </Button>
        </div>
        <CardDescription>
          AI-powered real-time guidance to optimize your learning sessions
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="session" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="session">Active Session</TabsTrigger>
            <TabsTrigger value="recommendations">Coach Tips</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="session" className="space-y-4 mt-4">
            {currentSession ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Active Session Display */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{currentSession.subject} Session</h3>
                      <p className="text-sm text-muted-foreground">
                        Started at {currentSession.startTime.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {currentSession.isActive ? (
                        <Button size="sm" variant="outline" onClick={pauseSession}>
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={resumeSession}>
                          <Play className="h-3 w-3 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button size="sm" variant="default" onClick={endSession}>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        End
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatTime(sessionTimer)}
                      </div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {currentSession.focusScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Focus Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {currentSession.completedTasks}/{currentSession.totalTasks}
                      </div>
                      <div className="text-xs text-muted-foreground">Tasks</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Focus Level</span>
                      <span>{currentSession.focusScore}%</span>
                    </div>
                    <Progress value={currentSession.focusScore} className="h-2" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No Active Session</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start a focused learning session to get real-time coaching
                </p>
                <div className="flex gap-2 justify-center">
                  {metrics.needsAttention.slice(0, 2).map((subject) => (
                    <Button
                      key={subject}
                      variant="outline"
                      size="sm"
                      onClick={() => startLearningSession(subject)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-3 mt-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>All good! Continue with your current study approach.</p>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${rec.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{rec.icon}</span>
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {rec.urgency} priority
                        </Badge>
                      </div>
                      <p className="text-sm opacity-90 mb-3">{rec.description}</p>
                      <div className="text-xs text-muted-foreground mb-3">
                        Estimated time: {rec.estimatedTime} minutes
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeRecommendation(rec)}
                        className="text-xs"
                      >
                        {rec.action} <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-lg font-bold">{formatTime(metrics.todayStudyTime)}</div>
                  <div className="text-xs text-muted-foreground">Today</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Target className="h-6 w-6 mx-auto mb-1 text-green-500" />
                  <div className="text-lg font-bold">{metrics.sessionStreak}</div>
                  <div className="text-xs text-muted-foreground">Session Streak</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Weekly Progress</span>
                  <span>{formatTime(metrics.todayStudyTime)} / {formatTime(metrics.weeklyGoal / 7)}</span>
                </div>
                <Progress value={(metrics.todayStudyTime / (metrics.weeklyGoal / 7)) * 100} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Focus Areas</h4>
                <div className="flex gap-2 flex-wrap">
                  {metrics.needsAttention.map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RealTimeLearningCoach;