import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Trophy, 
  Target,
  Clock,
  Flame,
  CheckCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressData {
  subject: string;
  progress: number;
  weeklyGoal: number;
  streak: number;
  completedToday: number;
  totalToday: number;
  trend: 'up' | 'down' | 'stable';
}

export const MobileProgressTracker: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const progressData: ProgressData[] = [
    {
      subject: 'Mathematics',
      progress: 85,
      weeklyGoal: 80,
      streak: 12,
      completedToday: 3,
      totalToday: 4,
      trend: 'up'
    },
    {
      subject: 'Chemistry',
      progress: 72,
      weeklyGoal: 75,
      streak: 8,
      completedToday: 2,
      totalToday: 3,
      trend: 'stable'
    },
    {
      subject: 'Physics',
      progress: 68,
      weeklyGoal: 70,
      streak: 5,
      completedToday: 1,
      totalToday: 2,
      trend: 'down'
    }
  ];

  const overallStats = {
    totalStreak: 15,
    weeklyProgress: 78,
    monthlyGoal: 85,
    totalStudyTime: '24.5h'
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' }
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Overall Stats */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Streak</span>
              </div>
              <div className="text-2xl font-bold text-primary">{overallStats.totalStreak}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Study Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{overallStats.totalStudyTime}</div>
              <div className="text-xs text-muted-foreground">this week</div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Weekly Progress</span>
              <span className="text-sm text-muted-foreground">{overallStats.weeklyProgress}%</span>
            </div>
            <Progress value={overallStats.weeklyProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Period Selector */}
      <div className="flex bg-muted rounded-lg p-1">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => setSelectedPeriod(period.id as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              selectedPeriod === period.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Subject Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Subject Progress</h3>
          <Badge variant="secondary" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {selectedPeriod}
          </Badge>
        </div>

        {progressData.map((subject, index) => (
          <Card key={subject.subject} className="overflow-hidden">
            <CardContent className="p-0">
              <button
                onClick={() => setExpandedSubject(
                  expandedSubject === subject.subject ? null : subject.subject
                )}
                className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{subject.subject}</span>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {subject.progress}%
                    </span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedSubject === subject.subject ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={subject.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Goal: {subject.weeklyGoal}%</span>
                    <span>{subject.completedToday}/{subject.totalToday} today</span>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedSubject === subject.subject && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t bg-muted/30"
                  >
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 bg-background rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="text-xs">Streak</span>
                          </div>
                          <div className="font-bold text-orange-600">{subject.streak}</div>
                        </div>
                        <div className="text-center p-2 bg-background rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Trophy className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">Goal</span>
                          </div>
                          <div className="font-bold text-yellow-600">{subject.weeklyGoal}%</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Target className="h-3 w-3 mr-1" />
                          Practice
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              🏆
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Math Wizard</div>
              <div className="text-xs text-muted-foreground">Completed 10 algebra quizzes</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              ⚡
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Speed Learner</div>
              <div className="text-xs text-muted-foreground">Completed quiz in under 5 minutes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};