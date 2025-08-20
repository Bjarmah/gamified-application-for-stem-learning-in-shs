import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  TrendingUp, TrendingDown, Minus, Clock, Trophy, 
  BookOpen, Target, Flame, Zap, Award 
} from 'lucide-react';
import { useUserAnalytics, UserAnalytics } from '@/hooks/use-analytics';
import { Skeleton } from '@/components/ui/skeleton';

interface UserAnalyticsCardProps {
  userId: string;
  className?: string;
}

const UserAnalyticsCard: React.FC<UserAnalyticsCardProps> = ({ userId, className = "" }) => {
  const { data: analytics, isLoading } = useUserAnalytics(userId);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-[200px]">
          <div className="text-center text-muted-foreground">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <p>No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: UserAnalytics['progressTrend']) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTrendColor = (trend: UserAnalytics['progressTrend']) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600 bg-green-50';
      case 'decreasing':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const daysSinceLastActivity = Math.floor(
    (Date.now() - analytics.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {analytics.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{analytics.userName}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <span>Level {analytics.level}</span>
                <Badge variant="outline" className="text-xs">
                  {analytics.totalXP} XP
                </Badge>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getTrendIcon(analytics.progressTrend)}
            <Badge className={getTrendColor(analytics.progressTrend)}>
              {analytics.progressTrend}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{analytics.modulesCompleted}</p>
              <p className="text-xs text-muted-foreground">Modules</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Trophy className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{analytics.quizzesCompleted}</p>
              <p className="text-xs text-muted-foreground">Quizzes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <Flame className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{analytics.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{formatTime(analytics.timeSpent)}</p>
              <p className="text-xs text-muted-foreground">Study Time</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Score</span>
            <span className="text-sm text-muted-foreground">{analytics.averageScore.toFixed(1)}%</span>
          </div>
          <Progress value={analytics.averageScore} className="h-2" />
        </div>

        {/* Subject Progress */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Subject Progress</h4>
          {analytics.subjectProgress.slice(0, 3).map((subject) => (
            <div key={subject.subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{subject.subject}</span>
                <span className="text-xs text-muted-foreground">
                  {subject.completed}/{subject.total} ({subject.avgScore.toFixed(0)}%)
                </span>
              </div>
              <Progress 
                value={(subject.completed / subject.total) * 100} 
                className="h-1.5" 
              />
            </div>
          ))}
          {analytics.subjectProgress.length > 3 && (
            <p className="text-xs text-muted-foreground">
              +{analytics.subjectProgress.length - 3} more subjects
            </p>
          )}
        </div>

        {/* Last Activity */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last active</span>
            <span>
              {daysSinceLastActivity === 0 
                ? 'Today' 
                : daysSinceLastActivity === 1 
                  ? 'Yesterday' 
                  : `${daysSinceLastActivity} days ago`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAnalyticsCard;