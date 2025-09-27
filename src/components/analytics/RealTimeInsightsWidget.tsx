import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  Lightbulb,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RealTimeInsightsWidgetProps {
  className?: string;
  compact?: boolean;
}

export const RealTimeInsightsWidget: React.FC<RealTimeInsightsWidgetProps> = ({
  className = "",
  compact = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { 
    cachedInsights, 
    isGenerating, 
    generateInsights,
    getLatestInsight
  } = useLearningInsights(user?.id);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        generateInsights('comprehensive');
        setLastUpdate(new Date());
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [generateInsights, user?.id]);

  const handleManualRefresh = async () => {
    if (!user?.id) return;
    
    try {
      await generateInsights('comprehensive');
      setLastUpdate(new Date());
      toast({
        title: "Insights Updated",
        description: "Your learning insights have been refreshed.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not refresh insights. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isGenerating) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary animate-pulse" />
            Real-time Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestInsight = getLatestInsight('comprehensive');
  const insights = latestInsight?.insights;

  const focusAreas = insights?.focus_areas || [];
  const strengths = insights?.strengths || [];
  const recommendations = insights?.recommendations || [];
  const studyPlan = insights?.study_plan || [];

  const completedTasks = studyPlan.filter((task: any) => task.completed).length;
  const totalTasks = studyPlan.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className={`${className} bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/50`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            Real-time Insights
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isGenerating}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Updated {lastUpdate.toLocaleTimeString()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Today's Progress */}
        {totalTasks > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Today's Plan
              </span>
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <Progress value={completionRate} className="h-1.5" />
          </div>
        )}

        {/* Quick Insights */}
        <div className="space-y-3">
          {/* Strengths */}
          {strengths.length > 0 && !compact && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400">
                <CheckCircle className="h-3 w-3" />
                Strengths
              </div>
              <div className="text-xs text-muted-foreground">
                {strengths[0]}
              </div>
            </div>
          )}

          {/* Focus Areas */}
          {focusAreas.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium text-orange-700 dark:text-orange-400">
                <Target className="h-3 w-3" />
                Focus Area
              </div>
              <div className="text-xs text-muted-foreground">
                {focusAreas[0]}
              </div>
            </div>
          )}

          {/* Quick Recommendation */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm font-medium text-purple-700 dark:text-purple-400">
                <Lightbulb className="h-3 w-3" />
                Tip
              </div>
              <div className="text-xs text-muted-foreground">
                {recommendations[0]?.action || recommendations[0]}
              </div>
            </div>
          )}
        </div>

        {/* Motivation Badge */}
        {completionRate >= 80 && (
          <div className="flex items-center justify-center">
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 text-xs"
            >
              🚀 Great Progress Today!
            </Badge>
          </div>
        )}

        {/* No insights message */}
        {!latestInsight && (
          <div className="text-center text-sm text-muted-foreground py-4">
            <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <div>Start learning to get</div>
            <div>personalized insights!</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeInsightsWidget;