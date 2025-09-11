import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Brain,
  Lightbulb,
  Target,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useNavigate } from 'react-router-dom';

interface QuickInsightsWidgetProps {
  className?: string;
}

export const QuickInsightsWidget = ({ className }: QuickInsightsWidgetProps) => {
  const navigate = useNavigate();
  const [showFullInsights, setShowFullInsights] = useState(false);
  const { 
    cachedInsights, 
    isGenerating, 
    generateInsights,
    getLatestInsight 
  } = useLearningInsights();

  const comprehensiveInsights = getLatestInsight('comprehensive_insights')?.insights;
  const patternInsights = getLatestInsight('learning_patterns')?.insights;
  
  const hasRecentInsights = cachedInsights.some(insight => 
    new Date(insight.generated_at).getTime() > Date.now() - (24 * 60 * 60 * 1000) // 24 hours
  );

  const handleGenerateInsights = async () => {
    await generateInsights('comprehensive_insights');
    setShowFullInsights(true);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'study_schedule': return Calendar;
      case 'performance': return TrendingUp;
      case 'focus_areas': return Target;
      default: return Lightbulb;
    }
  };

  const quickInsights = [
    {
      type: 'study_schedule',
      title: 'Optimal Study Time',
      value: patternInsights?.peakTimes?.[0] || 'Not analyzed',
      description: 'Best time for focused learning'
    },
    {
      type: 'performance', 
      title: 'Performance Trend',
      value: comprehensiveInsights?.summary?.progress || 'Stable',
      description: 'Recent learning trajectory'
    },
    {
      type: 'focus_areas',
      title: 'Priority Areas',
      value: comprehensiveInsights?.improvements?.length || 0,
      description: 'Areas needing attention'
    }
  ];

  if (isGenerating) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Generating AI Insights...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
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
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Quick AI Insights
            </CardTitle>
            <CardDescription>
              Smart recommendations for your learning
            </CardDescription>
          </div>
          {hasRecentInsights && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Fresh
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {cachedInsights.length > 0 ? (
          <div className="space-y-4">
            {/* Quick insight cards */}
            <div className="grid grid-cols-1 gap-3">
              {quickInsights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                    <div className="flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {insight.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {insight.description}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {insight.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key recommendation */}
            {comprehensiveInsights?.studyPlan?.daily?.[0] && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-blue-900 mb-1">
                      Today's Priority
                    </div>
                    <div className="text-xs text-blue-700">
                      {comprehensiveInsights.studyPlan.daily[0]}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/analytics')}
              className="w-full text-xs"
            >
              View Full Analytics Dashboard
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="font-medium text-sm mb-2">Get AI-Powered Insights</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Discover personalized learning recommendations
            </p>
            <Button 
              size="sm" 
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="text-xs"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};