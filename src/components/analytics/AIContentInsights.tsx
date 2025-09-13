import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Zap, Target, Star, Clock } from "lucide-react";
import { useAIContentMetrics } from "@/hooks/use-ai-analytics";
import { useNavigate } from "react-router-dom";

export const AIContentInsights: React.FC = () => {
  const { data: metrics, isLoading } = useAIContentMetrics();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-5 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || metrics.totalAIModules === 0) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Learning Insights
            <Badge variant="secondary" className="text-xs">New</Badge>
          </CardTitle>
          <CardDescription>
            Generate AI content to unlock personalized learning insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Brain className="h-12 w-12 mx-auto text-primary/60 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Start creating AI modules to see your learning patterns and get personalized insights.
            </p>
            <Button 
              size="sm"
              onClick={() => navigate('/subjects')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Generate First Module
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completionRate = (metrics.completedAIModules / metrics.totalAIModules) * 100;
  const hasHighRating = metrics.averageRating >= 4;
  const isActiveUser = metrics.recentGenerations > 0;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Learning Insights
              {isActiveUser && (
                <Badge variant="secondary" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Your AI-powered learning performance and patterns
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/analytics')}
          >
            View Details
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-background/50 rounded-lg border">
            <div className="text-2xl font-bold text-primary mb-1">
              {metrics.totalAIModules}
            </div>
            <p className="text-xs text-muted-foreground">AI Modules</p>
          </div>
          <div className="text-center p-3 bg-background/50 rounded-lg border">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {completionRate.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          {/* Completion Insight */}
          <div className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
            <Target className="h-4 w-4 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">
                {completionRate >= 80 ? 'Excellent Progress!' : 
                 completionRate >= 60 ? 'Good Progress' : 
                 'Keep Going!'}
              </p>
              <p className="text-xs text-muted-foreground">
                You've completed {metrics.completedAIModules} of {metrics.totalAIModules} AI modules
              </p>
            </div>
          </div>

          {/* Quality Insight */}
          {metrics.averageRating > 0 && (
            <div className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
              <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {hasHighRating ? 'High Quality Content' : 'Quality Feedback'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Average rating: {metrics.averageRating}/5 stars
                </p>
              </div>
            </div>
          )}

          {/* Activity Insight */}
          {metrics.recentGenerations > 0 && (
            <div className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Active Learner</p>
                <p className="text-xs text-muted-foreground">
                  Generated {metrics.recentGenerations} modules this week
                </p>
              </div>
            </div>
          )}

          {/* Top Topic */}
          {metrics.favoriteAITopics.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-background/30 rounded-lg">
              <Brain className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium">Favorite Topic</p>
                <p className="text-xs text-muted-foreground">
                  Most requested: {metrics.favoriteAITopics[0]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => navigate('/subjects')}
            className="flex-1"
          >
            Generate More
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate('/analytics')}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Full Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};