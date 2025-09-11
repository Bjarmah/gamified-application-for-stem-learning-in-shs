import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Brain,
  Calendar,
  Zap,
  BarChart3
} from 'lucide-react';
import { useLearningInsights, PredictiveInsights } from '@/hooks/use-learning-insights';

interface PredictiveInsightsCardProps {
  className?: string;
}

export const PredictiveInsightsCard = ({ className }: PredictiveInsightsCardProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  
  const predictiveData = getLatestInsight('predictive_insights')?.insights as PredictiveInsights;
  
  const handleGeneratePredictive = () => {
    generateInsights('predictive_insights');
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Target className="h-4 w-4 text-green-500" />;
    }
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
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictiveData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Predictive Learning Analytics
          </CardTitle>
          <CardDescription>
            AI-powered performance predictions and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate predictive insights to forecast your learning trajectory
            </p>
            <Button onClick={handleGeneratePredictive} disabled={isGenerating}>
              <Brain className="h-4 w-4 mr-2" />
              Generate Predictions
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
          <Brain className="h-5 w-5 text-blue-500" />
          Predictive Analytics
        </CardTitle>
        <CardDescription>
          AI forecasts for your learning performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Predictions */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Next Week Performance Forecast
          </h4>
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Predicted Score</span>
              <span className="text-2xl font-bold text-blue-700">
                {predictiveData.predictions.nextWeekPerformance}%
              </span>
            </div>
            <Progress 
              value={predictiveData.predictions.nextWeekPerformance} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {predictiveData.trends.overall}
            </p>
          </div>
        </div>

        {/* Risk Assessment */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            {getRiskIcon(predictiveData.risks.level)}
            Risk Assessment
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={getRiskColor(predictiveData.risks.level)}>
                {predictiveData.risks.level.toUpperCase()} RISK
              </Badge>
              <span className="text-sm text-muted-foreground">
                for learning goals
              </span>
            </div>
            
            {predictiveData.risks.areas.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Areas of concern:</p>
                <div className="space-y-1">
                  {predictiveData.risks.areas.map((area, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      • {area}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subject Predictions */}
        {Object.keys(predictiveData.predictions.subjectScores).length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Subject Performance Forecast</h4>
            <div className="space-y-2">
              {Object.entries(predictiveData.predictions.subjectScores).map(([subject, score]) => (
                <div key={subject} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{subject}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={score} className="w-20 h-2" />
                    <span className="text-xs font-medium w-10">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Interventions */}
        {predictiveData.interventions.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Recommended Interventions
            </h4>
            <div className="space-y-2">
              {predictiveData.interventions.slice(0, 3).map((intervention, index) => (
                <div key={index} className="p-3 rounded-lg bg-green-50 border-l-4 border-green-400">
                  <p className="text-sm text-green-800">{intervention}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Predictions updated daily
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGeneratePredictive}
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