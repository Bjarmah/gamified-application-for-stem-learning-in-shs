import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, Target, Brain, Sparkles } from 'lucide-react';

const PersonalizedDashboard = () => {
  const { performance, recommendations, loading } = useLearningAnalytics();
  const { 
    cachedInsights, 
    getLatestInsight,
    generateInsights,
    isGenerating 
  } = useLearningInsights();

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

  const comprehensiveInsights = getLatestInsight('comprehensive_insights')?.insights;
  const hasAIInsights = cachedInsights.length > 0;

  return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      {hasAIInsights && comprehensiveInsights && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Learning Insights
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700 mb-1">
                  {comprehensiveInsights.summary?.overallScore || 0}%
                </div>
                <p className="text-sm text-purple-600">
                  {comprehensiveInsights.summary?.level || 'Getting Started'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {comprehensiveInsights.summary?.progress || 'Keep learning!'}
                </p>
              </CardContent>
            </Card>

            {comprehensiveInsights.strengths?.length > 0 && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {comprehensiveInsights.strengths.slice(0, 2).map((strength, index) => (
                      <p key={index} className="text-sm text-green-700">
                        • {strength}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {comprehensiveInsights.improvements?.length > 0 && (
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {comprehensiveInsights.improvements.slice(0, 2).map((improvement, index) => (
                      <p key={index} className="text-sm text-orange-700">
                        • {improvement}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

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

      {/* AI Study Plan */}
      {hasAIInsights && comprehensiveInsights?.studyPlan?.daily && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            AI Study Plan for Today
          </h3>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {comprehensiveInsights.studyPlan.daily.slice(0, 3).map((task, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-blue-800 flex-1">{task}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Traditional Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Additional Recommendations</h3>
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

      {/* Generate AI Insights CTA */}
      {!hasAIInsights && !isGenerating && (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Unlock AI-Powered Learning Insights</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized study plans, performance predictions, and smart recommendations
              </p>
              <Button 
                onClick={() => generateInsights('comprehensive_insights')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedDashboard;