import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Star, 
  Clock, 
  Zap,
  Target,
  BookOpen,
  Award
} from "lucide-react";
import { useAIContentMetrics } from "@/hooks/use-ai-analytics";

export const AIContentAnalytics: React.FC = () => {
  const { data: metrics, isLoading } = useAIContentMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const completionRate = metrics.totalAIModules > 0 
    ? (metrics.completedAIModules / metrics.totalAIModules) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total AI Modules */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-1">
              {metrics.totalAIModules}
            </div>
            <p className="text-xs text-muted-foreground">
              Generated for you
            </p>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {completionRate.toFixed(0)}%
            </div>
            <Progress value={completionRate} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {metrics.completedAIModules} of {metrics.totalAIModules} completed
            </p>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-600" />
              Avg Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {metrics.averageRating > 0 ? metrics.averageRating : '—'}
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= metrics.averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Content quality score
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {metrics.recentGenerations}
            </div>
            <p className="text-xs text-muted-foreground">
              Modules generated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Learning Difficulty Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of AI modules by difficulty level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(metrics.difficultyBreakdown).map(([level, count]) => {
              const percentage = metrics.totalAIModules > 0 
                ? (count / metrics.totalAIModules) * 100 
                : 0;
              
              const colors = {
                beginner: 'bg-green-500',
                intermediate: 'bg-yellow-500', 
                advanced: 'bg-red-500'
              };

              return (
                <div key={level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{level}</span>
                    <Badge variant="outline" className="text-xs">
                      {count} modules
                    </Badge>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {percentage.toFixed(1)}% of total AI modules
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Favorite Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Most Requested Topics
            </CardTitle>
            <CardDescription>
              Your favorite subjects for AI content generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.favoriteAITopics.length > 0 ? (
              <div className="space-y-3">
                {metrics.favoriteAITopics.map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{topic}</span>
                    </div>
                    {index === 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Award className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No AI content generated yet</p>
                <p className="text-xs">Start creating modules to see your preferences</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Study Time */}
      {metrics.totalTimeSpentOnAI > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              AI Learning Time
            </CardTitle>
            <CardDescription>
              Total time spent on AI-generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {Math.round(metrics.totalTimeSpentOnAI / 60)} minutes
            </div>
            <p className="text-sm text-muted-foreground">
              Across {metrics.completedAIModules} completed AI modules
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};