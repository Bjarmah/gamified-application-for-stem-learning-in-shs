import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';  
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  BarChart3
} from 'lucide-react';
import { useLearningInsights, useAnalyticsData } from '@/hooks/use-learning-insights';
import { useAuth } from '@/context/AuthContext';

interface AIInsightsPreviewProps {
  className?: string;
}

export const AIInsightsPreview = ({ className }: AIInsightsPreviewProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cachedInsights, 
    isGenerating, 
    generateInsights,
    getLatestInsight 
  } = useLearningInsights();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsData();

  const comprehensiveInsights = getLatestInsight('comprehensive_insights')?.insights;
  const patternInsights = getLatestInsight('learning_patterns')?.insights;
  
  const hasAnyInsights = cachedInsights.length > 0;
  const lastGenerated = cachedInsights[0]?.generatedAt;

  const handleViewFullAnalytics = () => {
    navigate('/analytics');
  };

  const handleGenerateQuickInsights = async () => {
    await generateInsights('comprehensive_insights');
  };

  if (analyticsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Learning Insights
            </CardTitle>
            <CardDescription>
              Personalized recommendations powered by AI
            </CardDescription>
          </div>
          {hasAnyInsights && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Updated
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {hasAnyInsights ? (
          <div className="space-y-4">
            {/* Quick insights preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {comprehensiveInsights?.summary && (
                <div className="p-3 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Overall Score</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {comprehensiveInsights.summary.overallScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {comprehensiveInsights.summary.level}
                  </div>
                </div>
              )}

              {patternInsights?.peakTimes && (
                <div className="p-3 rounded-lg border bg-gradient-to-r from-green-50 to-teal-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Peak Time</span>
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    {patternInsights.peakTimes[0]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Optimal study time
                  </div>
                </div>
              )}
            </div>

            {/* Latest recommendations */}
            {comprehensiveInsights?.studyPlan?.daily && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Today's Recommendations</h4>
                <div className="space-y-2">
                  {comprehensiveInsights.studyPlan.daily.slice(0, 2).map((rec, index) => (
                    <div key={index} className="p-2 rounded bg-muted/50 text-xs">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                {lastGenerated && `Last updated ${new Date(lastGenerated).toLocaleDateString()}`}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewFullAnalytics}
                className="text-xs"
              >
                View All Insights
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-3">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-medium text-sm mb-2">Unlock AI Insights</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Get personalized learning recommendations and performance predictions
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                size="sm" 
                onClick={handleGenerateQuickInsights}
                disabled={isGenerating}
                className="text-xs"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Generate Insights
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewFullAnalytics}
                className="text-xs"
              >
                View Analytics
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};