
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Trophy, Calendar, Target } from 'lucide-react';

interface ProgressChartProps {
  weeklyActivity: { day: string; hours: number }[];
  subjectProgress: { subject: string; completion: number; color: string }[];
  currentStreak: number;
  weeklyGoal: number;
  weeklyCompleted: number;
}

const ProgressChart = ({ 
  weeklyActivity, 
  subjectProgress, 
  currentStreak, 
  weeklyGoal, 
  weeklyCompleted 
}: ProgressChartProps) => {
  const goalPercentage = Math.min((weeklyCompleted / weeklyGoal) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Weekly Activity */}
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-stemPurple" />
            Weekly Activity
          </CardTitle>
          <CardDescription>Study hours this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <XAxis dataKey="day" />
              <YAxis />
              <Bar dataKey="hours" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Progress */}
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-stemGreen" />
            Subject Progress
          </CardTitle>
          <CardDescription>Completion by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectProgress.map((subject) => (
              <div key={subject.subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{subject.subject}</span>
                  <span>{subject.completion}%</span>
                </div>
                <Progress 
                  value={subject.completion} 
                  className="h-2" 
                  style={{ '--progress-background': subject.color } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-stemOrange" />
            Learning Streak
          </CardTitle>
          <CardDescription>Keep it going!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-stemOrange mb-2">{currentStreak}</div>
            <div className="text-sm text-muted-foreground">days in a row</div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goal */}
      <Card className="card-stem">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-stemPurple" />
            Weekly Goal
          </CardTitle>
          <CardDescription>Study sessions completed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={goalPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{weeklyCompleted} completed</span>
              <span>{weeklyGoal} goal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressChart;
