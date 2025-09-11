import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Brain,
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  Lightbulb,
  CheckCircle2,
  Star,
  Zap,
  BookOpen
} from 'lucide-react';
import { useLearningInsights, ComprehensiveInsights } from '@/hooks/use-learning-insights';

interface ComprehensiveInsightsCardProps {
  className?: string;
}

export const ComprehensiveInsightsCard = ({ className }: ComprehensiveInsightsCardProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  
  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights as ComprehensiveInsights;
  
  const handleGenerateComprehensive = () => {
    generateInsights('comprehensive_insights');
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced': return 'text-purple-600';
      case 'intermediate': return 'text-blue-600';
      case 'beginner': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced': return 'default';
      case 'intermediate': return 'secondary';
      case 'beginner': return 'outline';
      default: return 'outline';
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
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!comprehensiveData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-gradient-primary" />
            Comprehensive Learning Report
          </CardTitle>
          <CardDescription>
            Complete AI-powered analysis of your learning journey and personalized guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Generate a comprehensive analysis of your learning progress and get personalized recommendations
            </p>
            <Button onClick={handleGenerateComprehensive} disabled={isGenerating}>
              <Brain className="h-4 w-4 mr-2" />
              Generate Full Report
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
          <Brain className="h-5 w-5 text-gradient-primary" />
          Comprehensive Learning Report
        </CardTitle>
        <CardDescription>
          Your complete learning analysis and personalized roadmap
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Summary */}
        {comprehensiveData.summary && (
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Learning Performance Summary
            </h4>
            <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-700 mb-1">
                    {comprehensiveData.summary.overallScore}%
                  </div>
                  <Progress value={comprehensiveData.summary.overallScore} className="h-2 mb-2" />
                  <p className="text-xs text-yellow-600">Overall Score</p>
                </div>
                <div className="text-center">
                  <Badge variant={getLevelBadge(comprehensiveData.summary.level)} className="mb-2">
                    {comprehensiveData.summary.level}
                  </Badge>
                  <p className="text-xs text-muted-foreground">Current Level</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-orange-700 mb-1">
                    {comprehensiveData.summary.progress}
                  </div>
                  <p className="text-xs text-muted-foreground">Progress Status</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          {comprehensiveData.strengths && comprehensiveData.strengths.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-green-500" />
                Your Strengths
              </h4>
              <div className="space-y-2">
                {comprehensiveData.strengths.slice(0, 3).map((strength, index) => (
                  <div key={index} className="p-3 rounded-lg bg-green-50 border-l-4 border-green-400">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-green-800">{strength}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Areas for Improvement */}
          {comprehensiveData.improvements && comprehensiveData.improvements.length > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                Growth Opportunities
              </h4>
              <div className="space-y-2">
                {comprehensiveData.improvements.slice(0, 3).map((improvement, index) => (
                  <div key={index} className="p-3 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-orange-800">{improvement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Study Plan */}
        {comprehensiveData.studyPlan && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Personalized Study Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comprehensiveData.studyPlan.daily && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Daily Focus</h5>
                  <div className="space-y-1">
                    {comprehensiveData.studyPlan.daily.slice(0, 2).map((item, index) => (
                      <p key={index} className="text-xs text-blue-700">• {item}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {comprehensiveData.studyPlan.weekly && (
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <h5 className="font-medium text-purple-900 mb-2">Weekly Goals</h5>
                  <div className="space-y-1">
                    {comprehensiveData.studyPlan.weekly.slice(0, 2).map((item, index) => (
                      <p key={index} className="text-xs text-purple-700">• {item}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {comprehensiveData.studyPlan.monthly && (
                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                  <h5 className="font-medium text-indigo-900 mb-2">Monthly Targets</h5>
                  <div className="space-y-1">
                    {comprehensiveData.studyPlan.monthly.slice(0, 2).map((item, index) => (
                      <p key={index} className="text-xs text-indigo-700">• {item}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Goals & Motivation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goals */}
          {comprehensiveData.goals && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-red-500" />
                Recommended Goals
              </h4>
              <div className="space-y-3">
                {comprehensiveData.goals.shortTerm && (
                  <div>
                    <h5 className="text-sm font-medium text-red-900 mb-1">Short-term (1-4 weeks)</h5>
                    {comprehensiveData.goals.shortTerm.slice(0, 2).map((goal, index) => (
                      <p key={index} className="text-xs text-red-700 mb-1">→ {goal}</p>
                    ))}
                  </div>
                )}
                {comprehensiveData.goals.longTerm && (
                  <div>
                    <h5 className="text-sm font-medium text-red-900 mb-1">Long-term (1-3 months)</h5>
                    {comprehensiveData.goals.longTerm.slice(0, 2).map((goal, index) => (
                      <p key={index} className="text-xs text-red-700 mb-1">→ {goal}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Motivation Strategies */}
          {comprehensiveData.motivation && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Motivation Boosters
              </h4>
              <div className="space-y-3">
                {comprehensiveData.motivation.strategies && (
                  <div>
                    <h5 className="text-sm font-medium text-yellow-900 mb-1">Strategies</h5>
                    {comprehensiveData.motivation.strategies.slice(0, 2).map((strategy, index) => (
                      <p key={index} className="text-xs text-yellow-700 mb-1">⚡ {strategy}</p>
                    ))}
                  </div>
                )}
                {comprehensiveData.motivation.rewards && (
                  <div>
                    <h5 className="text-sm font-medium text-yellow-900 mb-1">Rewards</h5>
                    {comprehensiveData.motivation.rewards.slice(0, 2).map((reward, index) => (
                      <p key={index} className="text-xs text-yellow-700 mb-1">🎁 {reward}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Comprehensive analysis updated weekly
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleGenerateComprehensive}
            disabled={isGenerating}
          >
            <Brain className="h-3 w-3 mr-1" />
            Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};