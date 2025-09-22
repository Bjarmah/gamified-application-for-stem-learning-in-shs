import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Brain, 
  Target,
  TrendingUp,
  Zap,
  Sun,
  Moon,
  Coffee,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format, addHours, startOfDay } from 'date-fns';

interface StudySession {
  time: string;
  subject: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  effectiveness: number;
  type: 'Review' | 'New Content' | 'Practice';
}

interface OptimalTimeSlot {
  hour: number;
  label: string;
  effectiveness: number;
  recommended: boolean;
  reason: string;
}

export const StudyScheduleOptimizer: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [showOptimized, setShowOptimized] = useState(false);

  const currentSchedule: StudySession[] = [
    {
      time: '09:00',
      subject: 'Mathematics',
      duration: 60,
      difficulty: 'Hard',
      effectiveness: 85,
      type: 'New Content'
    },
    {
      time: '14:00',
      subject: 'Chemistry',
      duration: 45,
      difficulty: 'Medium',
      effectiveness: 70,
      type: 'Practice'
    },
    {
      time: '19:00',
      subject: 'Physics',
      duration: 30,
      difficulty: 'Easy',
      effectiveness: 60,
      type: 'Review'
    }
  ];

  const optimalTimeSlots: OptimalTimeSlot[] = [
    {
      hour: 9,
      label: '9:00 AM',
      effectiveness: 95,
      recommended: true,
      reason: 'Peak cognitive performance'
    },
    {
      hour: 11,
      label: '11:00 AM',
      effectiveness: 88,
      recommended: true,
      reason: 'High focus, good retention'
    },
    {
      hour: 14,
      label: '2:00 PM',
      effectiveness: 75,
      recommended: false,
      reason: 'Post-lunch dip period'
    },
    {
      hour: 16,
      label: '4:00 PM',
      effectiveness: 82,
      recommended: true,
      reason: 'Second peak period'
    },
    {
      hour: 19,
      label: '7:00 PM',
      effectiveness: 65,
      recommended: false,
      reason: 'Declining alertness'
    }
  ];

  const studyInsights = {
    averageEffectiveness: 72,
    optimalDuration: 45,
    bestSubjectTime: 'Mathematics in morning',
    improvementPotential: '+23% efficiency'
  };

  const getTimeIcon = (hour: number) => {
    if (hour < 12) return Sun;
    if (hour < 17) return Coffee;
    return Moon;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Study Schedule Optimizer
        </CardTitle>
        <CardDescription>
          AI-powered schedule optimization based on your learning patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Schedule Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['today', 'tomorrow', 'week'].map((period) => (
              <Button
                key={period}
                variant={selectedDay === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDay(period as any)}
                className="capitalize"
              >
                {period}
              </Button>
            ))}
          </div>
          <Button
            variant={showOptimized ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setShowOptimized(!showOptimized)}
          >
            <Zap className="h-4 w-4 mr-1" />
            {showOptimized ? 'Current' : 'Optimize'}
          </Button>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Avg Effectiveness</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {studyInsights.averageEffectiveness}%
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Improvement</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {studyInsights.improvementPotential}
            </div>
          </div>
        </div>

        {/* Schedule View */}
        {!showOptimized ? (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Current Schedule
            </h4>
            {currentSchedule.map((session, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-mono w-16">{session.time}</div>
                <div className="flex-1">
                  <div className="font-medium">{session.subject}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {session.duration}min
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(session.difficulty)}`}>
                      {session.difficulty}
                    </Badge>
                    <span>{session.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{session.effectiveness}%</div>
                  <Progress value={session.effectiveness} className="w-12 h-1.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Optimized Schedule
            </h4>
            {optimalTimeSlots.map((slot, index) => {
              const TimeIcon = getTimeIcon(slot.hour);
              return (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                  slot.recommended 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <TimeIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-mono w-16">{slot.label}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {slot.recommended ? 'Recommended' : 'Not Optimal'}
                      </span>
                      {slot.recommended ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{slot.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{slot.effectiveness}%</div>
                    <Progress value={slot.effectiveness} className="w-12 h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            AI Recommendations
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <span>Schedule difficult subjects during peak hours (9-11 AM)</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <span>Keep sessions to 45-60 minutes for optimal retention</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              <span>Use afternoon slots for practice and review</span>
            </div>
          </div>
        </div>

        <Button className="w-full" disabled={!showOptimized}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Apply Optimized Schedule
        </Button>
      </CardContent>
    </Card>
  );
};