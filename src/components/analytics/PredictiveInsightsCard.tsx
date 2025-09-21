import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Calendar,
  Award
} from 'lucide-react';

export const PredictiveInsightsCard: React.FC = () => {
  const predictions = {
    weeklyGoalProgress: 85,
    riskAreas: ['Chemical Bonding', 'Calculus'],
    upcomingMilestones: [
      { name: 'Mathematics Level 5', progress: 78, daysLeft: 3 },
      { name: 'Chemistry Expert', progress: 45, daysLeft: 12 }
    ],
    recommendations: [
      'Schedule 2 extra chemistry sessions this week',
      'Review algebraic fundamentals',
      'Take practice quiz on molecular structure'
    ]
  };

  return (
    <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Predictive Insights
        </CardTitle>
        <CardDescription>
          AI predictions based on your learning patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weekly Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Weekly Goal</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {predictions.weeklyGoalProgress}%
            </span>
          </div>
          <Progress value={predictions.weeklyGoalProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            On track to exceed weekly target by 15%
          </p>
        </div>

        {/* Risk Areas */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Areas at Risk</span>
          </div>
          <div className="flex gap-2">
            {predictions.riskAreas.map((area, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Upcoming Milestones</span>
          </div>
          <div className="space-y-3">
            {predictions.upcomingMilestones.map((milestone, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{milestone.name}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {milestone.daysLeft}d
                  </div>
                </div>
                <Progress value={milestone.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Smart Recommendations</span>
          </div>
          <div className="space-y-1">
            {predictions.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                {rec}
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Action Plan
        </Button>
      </CardContent>
    </Card>
  );
};