import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Target } from 'lucide-react';

const PersonalizedDashboard = () => {
  const { performance, recommendations, loading } = useLearningAnalytics();

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 dark:text-green-400';
      case 'declining':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRecommendationIcon = (type: 'review' | 'practice' | 'advance') => {
    switch (type) {
      case 'review':
        return <AlertCircle className="h-4 w-4" />;
      case 'practice':
        return <Target className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Learning Performance</h3>
        {performance.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete some quizzes to see your performance analytics</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {performance.map((perf) => (
              <Card key={perf.subject} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{perf.subject}</CardTitle>
                    {getTrendIcon(perf.improvementTrend)}
                  </div>
                  <CardDescription className={getTrendColor(perf.improvementTrend)}>
                    {perf.improvementTrend === 'improving' && 'Improving'}
                    {perf.improvementTrend === 'declining' && 'Needs attention'}
                    {perf.improvementTrend === 'stable' && 'Stable performance'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Score</span>
                      <span className="font-medium">{perf.averageScore.toFixed(1)}%</span>
                    </div>
                    <Progress value={perf.averageScore} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>{perf.totalQuizzes} quizzes completed</p>
                  </div>

                  {perf.weakAreas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                        Areas to improve:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {perf.weakAreas.slice(0, 2).map((area) => (
                          <Badge key={area} variant="destructive" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {perf.weakAreas.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{perf.weakAreas.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {perf.strongAreas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                        Strong areas:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {perf.strongAreas.slice(0, 2).map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {perf.strongAreas.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{perf.strongAreas.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.slice(0, 4).map((rec) => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {getRecommendationIcon(rec.type)}
                    <CardTitle className="text-base capitalize">{rec.type}</CardTitle>
                    <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <CardDescription>{rec.subject} - {rec.module}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{rec.reason}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    {rec.type === 'review' && 'Review Content'}
                    {rec.type === 'practice' && 'Start Practice'}
                    {rec.type === 'advance' && 'Explore Advanced'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedDashboard;