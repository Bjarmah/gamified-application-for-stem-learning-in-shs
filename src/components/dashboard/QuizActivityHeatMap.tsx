import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Trophy, TrendingUp } from 'lucide-react';
import { useQuizActivityData } from '@/hooks/use-quiz-activity';

interface ActivityDay {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // GitHub-style intensity levels
}

interface QuizActivityHeatMapProps {
  userId?: string;
  className?: string;
}

export const QuizActivityHeatMap: React.FC<QuizActivityHeatMapProps> = ({
  userId,
  className = ""
}) => {
  const { activityData, loading, stats } = useQuizActivityData(userId);
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);

  const getActivityLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const getActivityColor = (level: 0 | 1 | 2 | 3 | 4): string => {
    const colors = {
      0: 'bg-muted hover:bg-muted/80',
      1: 'bg-green-200 hover:bg-green-300 dark:bg-green-900 dark:hover:bg-green-800',
      2: 'bg-green-400 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600',
      3: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400',
      4: 'bg-green-800 hover:bg-green-900 dark:bg-green-300 dark:hover:bg-green-200'
    };
    return colors[level];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getWeekNumber = (date: Date): number => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quiz Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid grid-cols-53 gap-1">
              {[...Array(371)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-muted rounded-sm" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create a grid of weeks and days
  const weeks: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];
  
  activityData.forEach((day, index) => {
    if (index > 0 && day.date.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Quiz Activity
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              {stats.totalQuizzes} quizzes completed
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {stats.currentStreak} day streak
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Month labels */}
            <div className="flex justify-between text-xs text-muted-foreground">
              {months.map((month, i) => (
                <span key={month} className="text-center">
                  {month}
                </span>
              ))}
            </div>

            {/* Heat map grid */}
            <div className="overflow-x-auto">
              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-2">
                  {days.map((day, i) => (
                    <div key={day} className="h-3 flex items-center justify-end text-xs text-muted-foreground w-8">
                      {i % 2 === 1 ? day : ''}
                    </div>
                  ))}
                </div>

                {/* Activity squares */}
                <div className="flex gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const day = week.find(d => d.date.getDay() === dayIndex);
                        if (!day) {
                          return <div key={dayIndex} className="w-3 h-3" />;
                        }

                        const level = getActivityLevel(day.count);
                        return (
                          <Tooltip key={dayIndex}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${getActivityColor(level)}`}
                                onMouseEnter={() => setHoveredDay(day)}
                                onMouseLeave={() => setHoveredDay(null)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <div className="font-semibold">
                                  {day.count} {day.count === 1 ? 'quiz' : 'quizzes'}
                                </div>
                                <div className="text-muted-foreground">
                                  {formatDate(day.date)}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(level as 0 | 1 | 2 | 3 | 4)}`}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
              
              {stats.longestStreak > 0 && (
                <div className="text-xs text-muted-foreground">
                  Longest streak: {stats.longestStreak} days
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};