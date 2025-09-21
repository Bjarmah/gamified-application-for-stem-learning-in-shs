import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Clock, 
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useNavigate } from 'react-router-dom';

export const LearningInsightsCard: React.FC = () => {
  const navigate = useNavigate();
  const { isGenerating } = useLearningInsights();

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const mockInsights = {
    learningVelocity: 85,
    focusAreas: ['Mathematics', 'Chemistry'],
    studyTime: '2.5 hours',
    improvements: [
      'Focus on algebraic concepts',
      'Practice chemical bonding',
      'Review cell biology'
    ]
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Learning Insights
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your learning patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Learning Velocity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Learning Velocity
            </span>
            <span className="text-sm text-muted-foreground">
              {mockInsights.learningVelocity}%
            </span>
          </div>
          <Progress value={mockInsights.learningVelocity} className="h-2" />
        </div>

        {/* Focus Areas */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Target className="h-4 w-4" />
            <span className="text-sm font-medium">Focus Areas</span>
          </div>
          <div className="flex gap-2">
            {mockInsights.focusAreas.map((area, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Daily Study Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Today's Study Time</span>
          </div>
          <span className="text-sm font-semibold text-primary">
            {mockInsights.studyTime}
          </span>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">AI Recommendations</span>
          </div>
          <div className="space-y-1">
            {mockInsights.improvements.slice(0, 2).map((improvement, index) => (
              <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                <div className="w-1 h-1 bg-primary rounded-full" />
                {improvement}
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate('/analytics')}
        >
          View Detailed Analytics
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};