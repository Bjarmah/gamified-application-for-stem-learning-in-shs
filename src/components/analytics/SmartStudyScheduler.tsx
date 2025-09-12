import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  Brain,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Bell,
  BookOpen,
  Star
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, startOfWeek, isToday, isTomorrow } from 'date-fns';

interface ScheduleItem {
  id: string;
  time: string;
  duration: number;
  subject: string;
  topic: string;
  type: 'review' | 'new_material' | 'practice' | 'assessment';
  priority: 'high' | 'medium' | 'low';
  aiOptimized: boolean;
  estimatedDifficulty: number;
  prerequisitesMet: boolean;
}

interface SmartStudySchedulerProps {
  className?: string;
}

export const SmartStudyScheduler = ({ className }: SmartStudySchedulerProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today, 1 = tomorrow, etc.

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const gapsData = getLatestInsight('knowledge_gaps')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;
  const predictiveData = getLatestInsight('predictive_insights')?.insights;

  useEffect(() => {
    if (patternsData && gapsData && comprehensiveData) {
      generateOptimalSchedule();
    }
  }, [patternsData, gapsData, comprehensiveData, selectedDay]);

  const generateOptimalSchedule = () => {
    const scheduleItems: ScheduleItem[] = [];
    const targetDate = addDays(new Date(), selectedDay);

    // Use learning patterns to determine optimal study times
    const peakTimes = patternsData?.peakTimes || ['09:00 AM', '02:00 PM', '07:00 PM'];
    const avgSessionLength = patternsData?.productivity?.avgSessionLength || 30;

    // Priority 1: Address critical knowledge gaps
    if (gapsData?.criticalGaps && gapsData.criticalGaps.length > 0) {
      gapsData.criticalGaps.slice(0, 2).forEach((gap: any, index: number) => {
        if (index < peakTimes.length) {
          scheduleItems.push({
            id: `gap-${gap.subject}-${gap.topic}`,
            time: peakTimes[index],
            duration: Math.max(avgSessionLength, 25),
            subject: gap.subject,
            topic: gap.topic,
            type: gap.severity === 'high' ? 'review' : 'practice',
            priority: gap.severity as 'high' | 'medium' | 'low',
            aiOptimized: true,
            estimatedDifficulty: 100 - gap.score,
            prerequisitesMet: true
          });
        }
      });
    }

    // Priority 2: Strengthen weak areas from comprehensive analysis
    if (comprehensiveData?.improvements && comprehensiveData.improvements.length > 0) {
      comprehensiveData.improvements.slice(0, 2).forEach((improvement: string, index: number) => {
        const timeSlot = peakTimes[scheduleItems.length % peakTimes.length];
        scheduleItems.push({
          id: `improvement-${improvement}`,
          time: timeSlot,
          duration: avgSessionLength,
          subject: 'Multi-subject',
          topic: improvement,
          type: 'new_material',
          priority: 'medium',
          aiOptimized: true,
          estimatedDifficulty: 60,
          prerequisitesMet: true
        });
      });
    }

    // Priority 3: Reinforce strengths for confidence building
    if (comprehensiveData?.strengths && comprehensiveData.strengths.length > 0) {
      const strength = comprehensiveData.strengths[0];
      scheduleItems.push({
        id: `strength-${strength}`,
        time: peakTimes[(scheduleItems.length) % peakTimes.length],
        duration: Math.min(avgSessionLength, 20),
        subject: 'Strengths',
        topic: strength,
        type: 'review',
        priority: 'low',
        aiOptimized: true,
        estimatedDifficulty: 30,
        prerequisitesMet: true
      });
    }

    // Priority 4: Follow personalized study plan
    if (comprehensiveData?.studyPlan?.daily && comprehensiveData.studyPlan.daily.length > 0) {
      comprehensiveData.studyPlan.daily.forEach((goal: string, index: number) => {
        if (scheduleItems.length < 5) { // Limit total items
          scheduleItems.push({
            id: `daily-${goal}`,
            time: peakTimes[(scheduleItems.length) % peakTimes.length],
            duration: 20,
            subject: 'Study Plan',
            topic: goal,
            type: 'practice',
            priority: 'medium',
            aiOptimized: true,
            estimatedDifficulty: 50,
            prerequisitesMet: true
          });
        }
      });
    }

    // Sort by priority and time
    scheduleItems.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setSchedule(scheduleItems);
  };

  const getDayName = (dayOffset: number) => {
    const date = addDays(new Date(), dayOffset);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE');
  };

  const getDateString = (dayOffset: number) => {
    return format(addDays(new Date(), dayOffset), 'MMM dd');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return <TrendingUp className="h-4 w-4" />;
      case 'new_material': return <BookOpen className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
      case 'assessment': return <CheckCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const totalStudyTime = schedule.reduce((total, item) => total + item.duration, 0);
  const highPriorityItems = schedule.filter(item => item.priority === 'high').length;

  if (!patternsData && !gapsData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Smart Study Scheduler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate AI insights to create your personalized study schedule
            </p>
            <Button onClick={() => generateInsights('learning_patterns')}>
              <Brain className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Smart Study Scheduler
          </div>
          <Badge variant="default" className="bg-blue-500">
            <Zap className="h-3 w-3 mr-1" />
            AI Optimized
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => (
            <Button
              key={dayOffset}
              variant={selectedDay === dayOffset ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDay(dayOffset)}
              className="flex-shrink-0"
            >
              <div className="text-center">
                <div className="font-medium">{getDayName(dayOffset)}</div>
                <div className="text-xs opacity-75">{getDateString(dayOffset)}</div>
              </div>
            </Button>
          ))}
        </div>

        {schedule.length > 0 && (
          <>
            {/* Study Overview */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Daily Study Plan</span>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{totalStudyTime} min total</span>
                  <span>{schedule.length} sessions</span>
                </div>
              </div>
              
              {highPriorityItems > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    {highPriorityItems} high-priority session{highPriorityItems > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div className="text-xs text-blue-700">
                Schedule optimized based on your learning patterns and current gaps
              </div>
            </div>

            {/* Study Sessions */}
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-sm ${getPriorityColor(item.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <Clock className="h-4 w-4 mb-1" />
                        <span className="text-xs font-medium">{item.time}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(item.type)}
                          <span className="font-medium">{item.topic}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.subject} • {item.duration} minutes
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.aiOptimized && (
                        <Badge variant="outline" className="text-xs">
                          <Brain className="h-3 w-3 mr-1" />
                          AI
                        </Badge>
                      )}
                      
                      <Badge
                        variant={item.priority === 'high' ? 'destructive' : 
                                item.priority === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Estimated Difficulty</span>
                      <span className="font-medium">{item.estimatedDifficulty}%</span>
                    </div>
                    <Progress 
                      value={item.estimatedDifficulty} 
                      className="h-1"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs capitalize font-medium">
                      {item.type.replace('_', ' ')}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {item.prerequisitesMet ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                      <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                        Start Session
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Smart Recommendations */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                AI Study Tips for {getDayName(selectedDay)}
              </h4>
              
              <div className="space-y-2">
                {patternsData?.recommendations?.slice(0, 2).map((tip: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
                
                <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Brain className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Based on your patterns, you're most productive during {patternsData?.peakTimes?.[0] || '9:00 AM'}. 
                    Schedule your most challenging topics during this time.
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Set Reminders
              </Button>
              <Button variant="outline" className="flex-1" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Export Schedule
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};