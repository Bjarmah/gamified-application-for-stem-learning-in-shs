import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Brain,
  TrendingUp,
  Clock,
  Target,
  AlertTriangle,
  Lightbulb,
  Calendar,
  BarChart3,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  useLearningInsights,
  useAnalyticsData,
  useLearningTimePatterns,
  useKnowledgeGaps,
  type LearningPatternInsights,
  type PredictiveInsights,
  type KnowledgeGapInsights,
  type ComprehensiveInsights
} from '@/hooks/use-learning-insights';

interface LearningInsightsCardProps {
  userId?: string;
  className?: string;
}

export const LearningInsightsCard = ({ userId, className }: LearningInsightsCardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    cachedInsights, 
    isGenerating, 
    generateInsights, 
    getLatestInsight 
  } = useLearningInsights(userId);
  
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalyticsData(userId);
  const { data: timePatterns, isLoading: patternsLoading } = useLearningTimePatterns(userId);
  const { data: knowledgeGaps, isLoading: gapsLoading } = useKnowledgeGaps(userId);

  const handleGenerateInsights = async (type: string) => {
    await generateInsights(type);
  };

  const patternInsights = getLatestInsight('learning_patterns')?.insights as LearningPatternInsights;
  const predictiveInsights = getLatestInsight('predictive_performance')?.insights as PredictiveInsights;
  const gapInsights = getLatestInsight('knowledge_gaps')?.insights as KnowledgeGapInsights;
  const comprehensiveInsights = getLatestInsight('comprehensive_insights')?.insights as ComprehensiveInsights;

  if (analyticsLoading || patternsLoading || gapsLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Learning Insights
            </CardTitle>
            <CardDescription>
              Personalized analytics and recommendations powered by AI
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateInsights('comprehensive_insights')}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate Insights
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="gaps">Knowledge</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {comprehensiveInsights ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Score</span>
                        <Badge variant="secondary">
                          {comprehensiveInsights.summary?.level || 'N/A'}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {comprehensiveInsights.summary?.overallScore || 0}%
                      </div>
                      <Progress 
                        value={comprehensiveInsights.summary?.overallScore || 0} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Strengths</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {comprehensiveInsights.strengths?.length || 0} identified
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Active Goals</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(comprehensiveInsights.goals?.shortTerm?.length || 0) + 
                         (comprehensiveInsights.goals?.longTerm?.length || 0)} goals
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Key Recommendations
                      </h4>
                      <div className="space-y-2">
                        {comprehensiveInsights.studyPlan?.daily?.slice(0, 3).map((item, index) => (
                          <div key={index} className="p-3 rounded-lg bg-muted/50 text-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Generate comprehensive insights to see your learning overview
                  </p>
                  <Button 
                    onClick={() => handleGenerateInsights('comprehensive_insights')}
                    disabled={isGenerating}
                  >
                    Generate Comprehensive Insights
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="patterns">
            <div className="space-y-6">
              {patternInsights ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Peak Learning Times
                      </h4>
                      <div className="space-y-2">
                        {patternInsights.peakTimes?.map((time, index) => (
                          <Badge key={index} variant="secondary">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-500" />
                        Consistency Score
                      </h4>
                      <div className="text-2xl font-bold mb-2">
                        {patternInsights.consistency?.score || 0}/10
                      </div>
                      <Progress 
                        value={(patternInsights.consistency?.score || 0) * 10} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Productivity Analysis</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {patternInsights.productivity?.analysis}
                      </p>
                      <div className="flex gap-2">
                        {patternInsights.productivity?.bestDays?.map((day, index) => (
                          <Badge key={index} variant="outline">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <div className="space-y-2">
                        {patternInsights.recommendations?.map((rec, index) => (
                          <div key={index} className="p-3 rounded-lg bg-muted/50 text-sm">
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Analyze your learning patterns to optimize study times
                  </p>
                  <Button 
                    onClick={() => handleGenerateInsights('learning_patterns')}
                    disabled={isGenerating}
                  >
                    Analyze Learning Patterns
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="prediction">
            <div className="space-y-6">
              {predictiveInsights ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Performance Trend
                      </h4>
                      <Badge 
                        variant={predictiveInsights.trends?.overall === 'improving' ? 'default' : 'secondary'}
                      >
                        {predictiveInsights.trends?.overall}
                      </Badge>
                    </div>
                    
                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        Risk Level
                      </h4>
                      <Badge 
                        variant={
                          predictiveInsights.risks?.level === 'high' ? 'destructive' :
                          predictiveInsights.risks?.level === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {predictiveInsights.risks?.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Next Week Prediction</h4>
                      <div className="text-2xl font-bold mb-2">
                        {predictiveInsights.predictions?.nextWeekPerformance || 0}%
                      </div>
                      <Progress 
                        value={predictiveInsights.predictions?.nextWeekPerformance || 0} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Interventions Recommended</h4>
                      <div className="space-y-2">
                        {predictiveInsights.interventions?.map((intervention, index) => (
                          <div key={index} className="p-3 rounded-lg bg-muted/50 text-sm">
                            {intervention}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Get AI predictions about your learning performance
                  </p>
                  <Button 
                    onClick={() => handleGenerateInsights('predictive_performance')}
                    disabled={isGenerating}
                  >
                    Generate Performance Predictions
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gaps">
            <div className="space-y-6">
              {gapInsights ? (
                <>
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Critical Knowledge Gaps
                    </h4>
                    <div className="space-y-3">
                      {gapInsights.criticalGaps?.slice(0, 5).map((gap, index) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{gap.topic}</span>
                            <Badge 
                              variant={
                                gap.severity === 'high' ? 'destructive' :
                                gap.severity === 'medium' ? 'secondary' : 'outline'
                              }
                            >
                              {gap.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {gap.subject}
                          </div>
                          <Progress value={gap.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      Recommended Learning Path
                    </h4>
                    <div className="space-y-2">
                      {gapInsights.learningPath?.slice(0, 4).map((step, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{step.topic}</div>
                            <div className="text-xs text-muted-foreground">
                              {step.subject} • {step.estimatedTime}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Identify knowledge gaps and get targeted practice recommendations
                  </p>
                  <Button 
                    onClick={() => handleGenerateInsights('knowledge_gaps')}
                    disabled={isGenerating}
                  >
                    Analyze Knowledge Gaps
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};