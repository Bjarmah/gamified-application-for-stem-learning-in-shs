import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MobileAIInsightsProps {
  className?: string;
}

export const MobileAIInsights = ({ className }: MobileAIInsightsProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights(user?.id);

  const comprehensiveInsight = getLatestInsight('comprehensive_insights');
  const predictiveInsight = getLatestInsight('predictive_insights');
  const learningPatterns = getLatestInsight('learning_patterns');

  const handleGenerateInsights = async () => {
    await generateInsights('comprehensive_insights');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  if (!comprehensiveInsight && !isGenerating) {
    return (
      <Card className={`${className} border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Learning Insights</h3>
              <p className="text-xs text-muted-foreground">Get personalized recommendations</p>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateInsights}
            className="w-full h-8 text-xs"
            size="sm"
          >
            <Zap className="h-3 w-3 mr-1" />
            Generate My Insights
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card className={`${className} border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Analyzing Your Learning...</h3>
              <p className="text-xs text-muted-foreground">This may take a moment</p>
            </div>
          </div>
          <div className="w-full bg-secondary/20 rounded-full h-1">
            <div className="bg-primary h-1 rounded-full animate-pulse w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = comprehensiveInsight?.insights;
  const predictions = predictiveInsight?.insights;
  const patterns = learningPatterns?.insights;

  return (
    <Card 
      className={`${className} border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={handleViewAnalytics}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI Insights
          </div>
          <Badge variant="secondary" className="text-xs">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-3">
        {/* Performance Overview */}
        {insights?.overall_performance && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium">Performance</span>
            </div>
            <span className="text-xs font-semibold text-primary">
              {Math.round(insights.overall_performance)}%
            </span>
          </div>
        )}

        {/* Prediction Score */}
        {predictions?.predicted_performance && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium">Predicted</span>
            </div>
            <span className="text-xs font-semibold text-blue-600">
              {Math.round(predictions.predicted_performance)}%
            </span>
          </div>
        )}

        {/* Best Learning Time */}
        {patterns?.best_learning_times?.[0] && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-orange-500" />
              <span className="text-xs font-medium">Best Time</span>
            </div>
            <span className="text-xs font-semibold text-orange-600">
              {patterns.best_learning_times[0]}
            </span>
          </div>
        )}

        {/* Key Strength */}
        {insights?.strengths?.[0] && (
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs">
            <span className="font-medium text-green-700 dark:text-green-400">Strength: </span>
            <span className="text-green-600 dark:text-green-300">{insights.strengths[0]}</span>
          </div>
        )}

        {/* Quick Action */}
        <div className="pt-1">
          <div className="text-xs text-muted-foreground mb-1">Next Action:</div>
          <div className="text-xs font-medium text-primary">
            {insights?.recommended_actions?.[0] || "Continue your learning journey"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};