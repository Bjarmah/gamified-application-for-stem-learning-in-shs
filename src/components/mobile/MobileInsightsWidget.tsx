import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useNavigate } from 'react-router-dom';

interface MobileInsightsWidgetProps {
  className?: string;
}

export const MobileInsightsWidget = ({ className }: MobileInsightsWidgetProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  const navigate = useNavigate();

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const predictiveData = getLatestInsight('predictive_insights')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;

  const hasInsights = comprehensiveData || predictiveData || patternsData;

  const handleNavigateToAnalytics = () => {
    navigate('/analytics');
  };

  const handleGenerateInsights = () => {
    generateInsights('comprehensive_insights');
  };

  if (!hasInsights) {
    return (
      <Card 
        className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
        onClick={handleGenerateInsights}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">AI Learning Insights</h3>
                <p className="text-xs text-muted-foreground">
                  {isGenerating ? 'Generating insights...' : 'Tap to generate'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleNavigateToAnalytics}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-sm">AI Insights</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            {comprehensiveData?.summary && (
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {comprehensiveData.summary.overallScore}%
                </div>
                <div className="text-xs text-blue-700">Performance</div>
              </div>
            )}

            {predictiveData?.predictions && (
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {predictiveData.predictions.nextWeekPerformance}%
                </div>
                <div className="text-xs text-purple-700">Predicted</div>
              </div>
            )}
          </div>

          {/* Key Insights */}
          <div className="space-y-2">
            {comprehensiveData?.strengths && comprehensiveData.strengths.length > 0 && (
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground truncate">
                  {comprehensiveData.strengths[0]}
                </span>
              </div>
            )}

            {patternsData?.peakTimes && patternsData.peakTimes.length > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-muted-foreground">
                  Best time: {patternsData.peakTimes[0]}
                </span>
              </div>
            )}

            {predictiveData?.trends && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-muted-foreground truncate">
                  {predictiveData.trends.overall}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-xs">
              AI Powered
            </Badge>
            {patternsData?.consistency && (
              <div className="flex items-center gap-1">
                <Progress 
                  value={patternsData.consistency.score} 
                  className="w-12 h-1"
                />
                <span className="text-xs text-muted-foreground">
                  {patternsData.consistency.score}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};