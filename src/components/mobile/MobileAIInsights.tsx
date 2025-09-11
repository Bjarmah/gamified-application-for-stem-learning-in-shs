import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  Target,
  Clock,
  Zap,
  ChevronRight,
  Sparkles,
  Activity
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { MobileCard } from './MobileCard';

interface MobileAIInsightsProps {
  className?: string;
}

export const MobileAIInsights = ({ className }: MobileAIInsightsProps) => {
  const { cachedInsights, generateInsights, isGenerating, getLatestInsight } = useLearningInsights();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;
  const predictiveData = getLatestInsight('predictive_insights')?.insights;
  const gapsData = getLatestInsight('knowledge_gaps')?.insights;

  const hasAnyInsights = comprehensiveData || patternsData || predictiveData || gapsData;

  const handleGenerateInsight = (type: string) => {
    generateInsights(type);
  };

  if (!hasAnyInsights) {
    return (
      <MobileCard className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-500" />
            AI Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Get personalized insights powered by AI
            </p>
            <Button 
              onClick={() => handleGenerateInsight('comprehensive_insights')}
              disabled={isGenerating}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isGenerating ? 'Analyzing...' : 'Generate AI Insights'}
            </Button>
          </div>
        </CardContent>
      </MobileCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        {comprehensiveData?.summary && (
          <MobileCard className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {comprehensiveData.summary.overallScore}%
              </div>
              <div className="text-xs text-muted-foreground">Overall Score</div>
              <Progress value={comprehensiveData.summary.overallScore} className="h-1 mt-2" />
            </div>
          </MobileCard>
        )}

        {predictiveData?.predictions && (
          <MobileCard className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {predictiveData.predictions.nextWeekPerformance}%
              </div>
              <div className="text-xs text-muted-foreground">Predicted Score</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">Trending Up</span>
              </div>
            </div>
          </MobileCard>
        )}
      </div>

      {/* Tabbed Insights */}
      <MobileCard>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="patterns" className="text-xs">Patterns</TabsTrigger>
            <TabsTrigger value="gaps" className="text-xs">Gaps</TabsTrigger>
            <TabsTrigger value="plan" className="text-xs">Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            {comprehensiveData && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Your Strengths
                  </h4>
                  <div className="space-y-2">
                    {comprehensiveData.strengths?.slice(0, 2).map((strength, index) => (
                      <div key={index} className="p-2 rounded-lg bg-green-50 border-l-4 border-green-400">
                        <p className="text-xs text-green-800">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    Growth Areas
                  </h4>
                  <div className="space-y-2">
                    {comprehensiveData.improvements?.slice(0, 2).map((improvement, index) => (
                      <div key={index} className="p-2 rounded-lg bg-orange-50 border-l-4 border-orange-400">
                        <p className="text-xs text-orange-800">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="patterns" className="mt-4">
            {patternsData && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Best Study Times
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {patternsData.peakTimes?.slice(0, 4).map((time, index) => (
                      <div key={index} className="p-2 rounded-lg bg-blue-50 text-center">
                        <span className="text-xs font-medium text-blue-900">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {patternsData.consistency && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Consistency Score</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={patternsData.consistency.score} className="flex-1 h-2" />
                      <span className="text-sm font-bold">{patternsData.consistency.score}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {patternsData.consistency.analysis}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="gaps" className="mt-4">
            {gapsData && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    Priority Areas
                  </h4>
                  <div className="space-y-2">
                    {gapsData.criticalGaps?.slice(0, 3).map((gap, index) => (
                      <div key={index} className="p-2 rounded-lg bg-red-50 border-l-4 border-red-400">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-red-900">{gap.subject}</p>
                            <p className="text-xs text-red-700">{gap.topic}</p>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {gap.score}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="plan" className="mt-4">
            {comprehensiveData?.studyPlan && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    Daily Focus
                  </h4>
                  <div className="space-y-1">
                    {comprehensiveData.studyPlan.daily?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Weekly Goals</h4>
                  <div className="space-y-1">
                    {comprehensiveData.studyPlan.weekly?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateInsight('comprehensive_insights')}
            disabled={isGenerating}
            className="w-full"
          >
            <Brain className="h-3 w-3 mr-2" />
            {isGenerating ? 'Updating...' : 'Refresh Insights'}
          </Button>
        </div>
      </MobileCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleGenerateInsight('learning_patterns')}
          disabled={isGenerating}
          className="h-auto py-3 flex-col gap-1"
        >
          <Clock className="h-4 w-4" />
          <span className="text-xs">Study Patterns</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleGenerateInsight('predictive_insights')}
          disabled={isGenerating}
          className="h-auto py-3 flex-col gap-1"
        >
          <Zap className="h-4 w-4" />
          <span className="text-xs">Predictions</span>
        </Button>
      </div>
    </div>
  );
};