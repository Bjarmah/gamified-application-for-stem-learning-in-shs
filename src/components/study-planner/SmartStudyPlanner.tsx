import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePredictiveAnalytics } from '@/hooks/use-predictive-analytics';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';
import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

interface StudySession {
  id: string;
  subject: string;
  topic: string;
  duration: number;
  priority: 'high' | 'medium' | 'low';
  scheduledFor: Date;
  type: 'review' | 'practice' | 'learning';
  reasoning: string;
}

export const SmartStudyPlanner: React.FC = () => {
  const { predictions, trendAnalysis, learningVelocity } = usePredictiveAnalytics();
  const { performance } = useLearningAnalytics();
  const [selectedDay, setSelectedDay] = useState(0);

  const generateWeeklyPlan = (): StudySession[] => {
    const sessions: StudySession[] = [];
    const weekStart = startOfWeek(new Date());

    // Generate sessions based on predictions
    predictions.forEach((prediction, index) => {
      // High priority for struggling subjects
      sessions.push({
        id: `session-${index}-1`,
        subject: prediction.subjectId,
        topic: 'Review and practice',
        duration: 45,
        priority: 'high',
        scheduledFor: addDays(weekStart, (index % 7)),
        type: 'review',
        reasoning: 'Recommended based on your recent performance'
      });

      // Add practice sessions for all subjects
      sessions.push({
        id: `session-${index}-2`,
        subject: prediction.subjectId,
        topic: 'Practice problems',
        duration: 30,
        priority: 'medium',
        scheduledFor: addDays(weekStart, ((index + 3) % 7)),
        type: 'practice',
        reasoning: 'Regular practice to maintain skills'
      });
    });

    return sessions.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  };

  const weeklyPlan = generateWeeklyPlan();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(new Date()), i);
    return {
      date,
      name: format(date, 'EEE'),
      sessions: weeklyPlan.filter(s => 
        format(s.scheduledFor, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    };
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'review': return <AlertCircle className="h-4 w-4" />;
      case 'practice': return <CheckCircle className="h-4 w-4" />;
      case 'learning': return <Brain className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Smart Weekly Study Plan
          </CardTitle>
          <CardDescription>
            AI-generated study schedule based on your learning patterns and performance predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performance Trend */}
          {trendAnalysis && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Learning Trend</span>
                <Badge variant={trendAnalysis.direction === 'improving' ? 'default' : 'secondary'}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {trendAnalysis.direction}
                </Badge>
              </div>
              <Progress value={trendAnalysis.projectedScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Projected performance: {Math.round(trendAnalysis.projectedScore)}%
              </p>
            </div>
          )}

          {/* Weekly Calendar */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedDay === index
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-xs font-medium">{day.name}</div>
                <div className="text-lg font-bold">{format(day.date, 'd')}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {day.sessions.length} sessions
                </div>
              </button>
            ))}
          </div>

          {/* Selected Day Sessions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              {format(weekDays[selectedDay].date, 'EEEE, MMMM d')}
            </h3>
            
            {weekDays[selectedDay].sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No sessions scheduled for this day</p>
              </div>
            ) : (
              weekDays[selectedDay].sessions.map((session) => (
                <Card key={session.id} className="border-l-4" style={{
                  borderLeftColor: session.priority === 'high' ? 'hsl(var(--destructive))' : 
                                  session.priority === 'medium' ? 'hsl(var(--primary))' : 
                                  'hsl(var(--muted-foreground))'
                }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(session.type)}
                          <h4 className="font-semibold">{session.subject}</h4>
                          <Badge variant={getPriorityColor(session.priority)}>
                            {session.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{session.topic}</p>
                        <p className="text-xs text-muted-foreground italic">{session.reasoning}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {session.duration}min
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Start Session
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Study Time Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {weeklyPlan.reduce((sum, s) => sum + s.duration, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {weeklyPlan.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-xs text-muted-foreground">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {new Set(weeklyPlan.map(s => s.subject)).size}
              </div>
              <div className="text-xs text-muted-foreground">Subjects</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
