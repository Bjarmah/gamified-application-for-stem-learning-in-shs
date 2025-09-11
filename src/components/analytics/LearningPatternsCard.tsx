import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  Calendar,
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { useLearningInsights, LearningPatternInsights } from '@/hooks/use-learning-insights';

interface LearningPatternsCardProps {
  className?: string;
}

export const LearningPatternsCard = ({ className }: LearningPatternsCardProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  
  const patternsData = getLatestInsight('learning_patterns')?.insights as LearningPatternInsights;
  
  const handleGeneratePatterns = () => {
    generateInsights('learning_patterns');
  };

  const getConsistencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConsistencyBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (isGenerating) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patternsData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Learning Patterns Analysis
          </CardTitle>
          <CardDescription>
            AI-powered analysis of your study habits and optimal learning times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Discover your optimal study times and learning patterns
            </p>
            <Button onClick={handleGeneratePatterns} disabled={isGenerating}>
              <Brain className="h-4 w-4 mr-2" />
              Analyze Patterns
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          Learning Patterns Analysis
        </CardTitle>
        <CardDescription>
          Personalized insights into your study habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Peak Learning Times */}
        {patternsData.peakTimes && patternsData.peakTimes.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Optimal Study Times
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {patternsData.peakTimes.map((time, index) => (
                <div key={index} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Learning Consistency */}
        {patternsData.consistency && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Learning Consistency
            </h4>
            <div className="p-4 rounded-lg border bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Consistency Score</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${getConsistencyColor(patternsData.consistency.score)}`}>
                    {patternsData.consistency.score}%
                  </span>
                  <Badge variant={getConsistencyBadge(patternsData.consistency.score)}>
                    {patternsData.consistency.score >= 80 ? 'Excellent' : 
                     patternsData.consistency.score >= 60 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {patternsData.consistency.analysis}
              </p>
            </div>
          </div>
        )}

        {/* Productivity Insights */}
        {patternsData.productivity && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              Productivity Patterns
            </h4>
            <div className="space-y-3">
              {patternsData.productivity.bestDays && patternsData.productivity.bestDays.length > 0 && (
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <h5 className="font-medium text-orange-900 mb-2">Best Learning Days</h5>
                  <div className="flex flex-wrap gap-2">
                    {patternsData.productivity.bestDays.map((day, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                        {day}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-900">Average Session Length</span>
                  <span className="text-lg font-bold text-purple-700">
                    {patternsData.productivity.avgSessionLength} min
                  </span>
                </div>
              </div>
              
              {patternsData.productivity.analysis && (
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-gray-50">
                  {patternsData.productivity.analysis}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {patternsData.recommendations && patternsData.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              Personalized Recommendations
            </h4>
            <div className="space-y-2">
              {patternsData.recommendations.slice(0, 4).map((recommendation, index) => (
                <div key={index} className="p-3 rounded-lg bg-indigo-50 border-l-4 border-indigo-400">
                  <p className="text-sm text-indigo-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Based on your recent study sessions
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGeneratePatterns}
            disabled={isGenerating}
          >
            <Brain className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};