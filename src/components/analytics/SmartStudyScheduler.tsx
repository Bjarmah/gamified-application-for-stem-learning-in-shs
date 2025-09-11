import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Brain,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useLearningInsights, useLearningTimePatterns, useAnalyticsData } from '@/hooks/use-learning-insights';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';

interface SmartStudySchedulerProps {
  userId?: string;
  className?: string;
}

export const SmartStudyScheduler = ({ userId, className }: SmartStudySchedulerProps) => {
  const [selectedView, setSelectedView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [scheduleGenerated, setScheduleGenerated] = useState(false);
  
  const { 
    generateInsights, 
    getLatestInsight, 
    isGenerating 
  } = useLearningInsights(userId);
  
  const { data: timePatterns, isLoading: patternsLoading } = useLearningTimePatterns(userId);
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsData(userId);

  const patternInsights = getLatestInsight('learning_patterns')?.insights;
  const comprehensiveInsights = getLatestInsight('comprehensive_insights')?.insights;

  const generateSmartSchedule = async () => {
    await generateInsights('learning_patterns');
    await generateInsights('comprehensive_insights');
    setScheduleGenerated(true);
  };

  const getOptimalStudyTimes = () => {
    if (!patternInsights?.peakTimes) return [];
    return patternInsights.peakTimes.slice(0, 3);
  };

  const getStudyPlan = (period: 'daily' | 'weekly' | 'monthly') => {
    if (!comprehensiveInsights?.studyPlan) return [];
    return comprehensiveInsights.studyPlan[period] || [];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const generateWeeklySchedule = () => {
    const weekStart = startOfWeek(new Date());
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const optimalTimes = getOptimalStudyTimes();
    const dailyPlan = getStudyPlan('daily');

    return weekDays.map((day, index) => ({
      date: day,
      dayName: format(day, 'EEEE'),
      sessions: optimalTimes.map((time, timeIndex) => ({
        time,
        subject: dailyPlan[timeIndex % dailyPlan.length] || 'Study Session',
        duration: patternInsights?.productivity?.avgSessionLength || 45,
        difficulty: ['high', 'medium', 'low'][timeIndex % 3],
        completed: false
      }))
    }));
  };

  if (patternsLoading || analyticsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Smart Study Scheduler
            </CardTitle>
            <CardDescription>
              AI-optimized study schedule based on your learning patterns
            </CardDescription>
          </div>
          {!scheduleGenerated && (
            <Button 
              onClick={generateSmartSchedule}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Schedule'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!scheduleGenerated ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Generate your personalized study schedule based on your learning patterns
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
              <div className="p-4 rounded-lg border">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="font-medium">Peak Times</div>
                <div className="text-muted-foreground">Optimal study hours</div>
              </div>
              <div className="p-4 rounded-lg border">
                <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="font-medium">Subject Focus</div>
                <div className="text-muted-foreground">Priority subjects</div>
              </div>
              <div className="p-4 rounded-lg border">
                <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <div className="font-medium">Energy Levels</div>
                <div className="text-muted-foreground">Difficulty matching</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Peak Times</span>
                </div>
                <div className="text-lg font-bold">
                  {getOptimalStudyTimes().length}
                </div>
                <div className="text-xs text-muted-foreground">
                  identified
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Daily Goals</span>
                </div>
                <div className="text-lg font-bold">
                  {getStudyPlan('daily').length}
                </div>
                <div className="text-xs text-muted-foreground">
                  activities
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Consistency</span>
                </div>
                <div className="text-lg font-bold">
                  {patternInsights?.consistency?.score || 0}/10
                </div>
                <div className="text-xs text-muted-foreground">
                  score
                </div>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Avg Session</span>
                </div>
                <div className="text-lg font-bold">
                  {patternInsights?.productivity?.avgSessionLength || 45}m
                </div>
                <div className="text-xs text-muted-foreground">
                  duration
                </div>
              </div>
            </div>

            {/* Schedule Views */}
            <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>

              <TabsContent value="daily">
                <div className="space-y-4">
                  <h4 className="font-medium">Today's Optimized Schedule</h4>
                  {getOptimalStudyTimes().map((time, index) => {
                    const dailyPlan = getStudyPlan('daily');
                    const subject = dailyPlan[index % dailyPlan.length] || 'Study Session';
                    const duration = patternInsights?.productivity?.avgSessionLength || 45;
                    
                    return (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">{time}</span>
                            <Badge variant="outline">{duration}m</Badge>
                          </div>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {subject}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="weekly">
                <div className="space-y-4">
                  <h4 className="font-medium">This Week's Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generateWeeklySchedule().map((day, dayIndex) => (
                      <div key={dayIndex} className="p-4 rounded-lg border">
                        <div className="font-medium mb-3">
                          {day.dayName}
                          <div className="text-xs text-muted-foreground">
                            {format(day.date, 'MMM d')}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {day.sessions.slice(0, 2).map((session, sessionIndex) => (
                            <div key={sessionIndex} className="text-sm p-2 rounded bg-muted/50">
                              <div className="flex items-center justify-between">
                                <span>{session.time}</span>
                                <Badge 
                                  variant="outline" 
                                  className={getDifficultyColor(session.difficulty)}
                                >
                                  {session.difficulty}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {session.subject}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="monthly">
                <div className="space-y-4">
                  <h4 className="font-medium">Monthly Learning Goals</h4>
                  <div className="space-y-3">
                    {getStudyPlan('monthly').map((goal, index) => (
                      <div key={index} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{goal}</div>
                          <Badge variant="secondary">
                            Week {Math.floor(index / 7) + 1}
                          </Badge>
                        </div>
                        <Progress value={Math.random() * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Recommendations */}
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                AI Recommendations
              </h4>
              <div className="space-y-2">
                {patternInsights?.recommendations?.slice(0, 3).map((rec, index) => (
                  <div key={index} className="text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};