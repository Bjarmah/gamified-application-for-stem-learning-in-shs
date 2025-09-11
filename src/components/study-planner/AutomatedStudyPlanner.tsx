import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  Brain,
  Target,
  CheckSquare,
  Zap,
  TrendingUp,
  BookOpen,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  type: 'review' | 'practice' | 'new_learning';
  estimatedDifficulty: number; // 1-5 scale
  aiReasoning: string;
}

interface DailyPlan {
  date: string;
  totalStudyTime: number;
  sessions: StudySession[];
  focusAreas: string[];
  energyLevel: 'high' | 'medium' | 'low';
}

interface AutomatedStudyPlannerProps {
  className?: string;
}

export const AutomatedStudyPlanner = ({ className }: AutomatedStudyPlannerProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  const { toast } = useToast();
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState<DailyPlan[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;
  const gapsData = getLatestInsight('knowledge_gaps')?.insights;

  useEffect(() => {
    if (comprehensiveData && patternsData && gapsData) {
      generateWeeklyPlan();
    }
  }, [comprehensiveData, patternsData, gapsData]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && currentSession) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, currentSession]);

  const generateWeeklyPlan = () => {
    if (!comprehensiveData || !patternsData || !gapsData) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plan: DailyPlan[] = [];

    days.forEach((day, index) => {
      const dailyPlan = generateDailyPlan(day, index);
      plan.push(dailyPlan);
    });

    setWeeklyPlan(plan);
  };

  const generateDailyPlan = (day: string, dayIndex: number): DailyPlan => {
    const isWeekend = dayIndex >= 5;
    const baseStudyTime = isWeekend ? 90 : 60; // minutes
    
    // Use AI insights to create personalized sessions
    const sessions: StudySession[] = [];
    let totalTime = 0;

    // Add knowledge gap sessions (high priority)
    if (gapsData?.criticalGaps) {
      gapsData.criticalGaps.slice(0, 2).forEach((gap, index) => {
        const duration = 25; // Pomodoro-style sessions
        sessions.push({
          id: `gap-${dayIndex}-${index}`,
          subject: gap.subject,
          topic: gap.topic,
          duration,
          priority: 'high',
          type: 'practice',
          estimatedDifficulty: 4,
          aiReasoning: `Critical gap identified with ${gap.score}% mastery. Focused practice needed.`
        });
        totalTime += duration;
      });
    }

    // Add comprehensive plan sessions
    if (comprehensiveData?.studyPlan?.daily && totalTime < baseStudyTime) {
      comprehensiveData.studyPlan.daily.slice(0, 2).forEach((task, index) => {
        const duration = Math.min(20, baseStudyTime - totalTime);
        if (duration > 10) {
          sessions.push({
            id: `daily-${dayIndex}-${index}`,
            subject: 'General',
            topic: task,
            duration,
            priority: 'medium',
            type: 'new_learning',
            estimatedDifficulty: 3,
            aiReasoning: 'Part of your personalized daily study plan.'
          });
          totalTime += duration;
        }
      });
    }

    // Add review sessions to fill remaining time
    if (totalTime < baseStudyTime && comprehensiveData?.strengths) {
      const remainingTime = baseStudyTime - totalTime;
      sessions.push({
        id: `review-${dayIndex}`,
        subject: 'Review',
        topic: `Review ${comprehensiveData.strengths[0]}`,
        duration: remainingTime,
        priority: 'low',
        type: 'review',
        estimatedDifficulty: 2,
        aiReasoning: 'Reinforcement of your strong areas to maintain proficiency.'
      });
      totalTime += remainingTime;
    }

    return {
      date: day,
      totalStudyTime: totalTime,
      sessions,
      focusAreas: gapsData?.criticalGaps?.map(gap => gap.subject).slice(0, 3) || [],
      energyLevel: patternsData?.productivity?.bestDays?.includes(day) ? 'high' : 'medium'
    };
  };

  const startSession = (session: StudySession) => {
    setCurrentSession(session);
    setSessionTimer(0);
    setIsSessionActive(true);
    
    toast({
      title: "🎯 Study Session Started!",
      description: `Starting ${session.duration}-minute session: ${session.topic}`,
      duration: 3000,
    });
  };

  const pauseSession = () => {
    setIsSessionActive(false);
    toast({
      title: "⏸️ Session Paused",
      description: "Take a break! Resume when you're ready.",
      duration: 2000,
    });
  };

  const resumeSession = () => {
    setIsSessionActive(true);
    toast({
      title: "▶️ Session Resumed",
      description: "Back to focused learning!",
      duration: 2000,
    });
  };

  const completeSession = () => {
    if (!currentSession) return;
    
    setIsSessionActive(false);
    toast({
      title: "🎉 Session Complete!",
      description: `Great job completing ${currentSession.topic}! Keep up the momentum.`,
      duration: 4000,
    });
    
    setCurrentSession(null);
    setSessionTimer(0);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
    }
  };

  const getTypeIcon = (type: 'review' | 'practice' | 'new_learning') => {
    switch (type) {
      case 'review': return <RotateCcw className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
      case 'new_learning': return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!comprehensiveData && !patternsData && !gapsData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Automated Study Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate AI insights first to create your personalized study plan
            </p>
            <Button onClick={() => generateInsights('comprehensive_insights')}>
              <Brain className="h-4 w-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Session Timer */}
      {currentSession && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  {getTypeIcon(currentSession.type)}
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">{currentSession.topic}</h4>
                  <p className="text-sm text-blue-700">{currentSession.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">
                    {formatTime(sessionTimer)}
                  </div>
                  <div className="text-xs text-blue-600">
                    / {currentSession.duration}:00
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isSessionActive ? (
                    <Button size="sm" variant="outline" onClick={pauseSession}>
                      <Pause className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={resumeSession}>
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="sm" onClick={completeSession}>
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <Progress 
                value={(sessionTimer / (currentSession.duration * 60)) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            AI-Generated Weekly Study Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
            <TabsList className="grid w-full grid-cols-7 mb-6">
              {weeklyPlan.map((day, index) => (
                <TabsTrigger key={index} value={index.toString()} className="text-xs">
                  {day.date.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {weeklyPlan.map((day, dayIndex) => (
              <TabsContent key={dayIndex} value={dayIndex.toString()}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{day.date}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {day.totalStudyTime} min
                      </Badge>
                      <Badge variant={day.energyLevel === 'high' ? 'default' : 'secondary'}>
                        <Zap className="h-3 w-3 mr-1" />
                        {day.energyLevel} energy
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {day.sessions.map((session, sessionIndex) => (
                      <div key={session.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-1 bg-gray-100 rounded">
                              {getTypeIcon(session.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{session.topic}</h4>
                              <p className="text-sm text-muted-foreground">{session.subject}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(session.priority)}>
                              {session.priority}
                            </Badge>
                            <span className="text-sm font-medium">{session.duration}m</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">
                          {session.aiReasoning}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Difficulty:</span>
                            <Progress value={session.estimatedDifficulty * 20} className="w-16 h-1" />
                            <span className="text-xs">{session.estimatedDifficulty}/5</span>
                          </div>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startSession(session)}
                            disabled={!!currentSession}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Today's Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {day.focusAreas.map((area, index) => (
                        <Badge key={index} variant="outline">
                          <Target className="h-3 w-3 mr-1" />
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};