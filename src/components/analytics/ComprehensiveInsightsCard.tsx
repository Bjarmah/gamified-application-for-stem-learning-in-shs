import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Target,
  TrendingUp,
  Calendar,
  BookOpen,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';

interface ComprehensiveInsightsCardProps {
  className?: string;
}

export const ComprehensiveInsightsCard = ({ className }: ComprehensiveInsightsCardProps) => {
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const gapsData = getLatestInsight('knowledge_gaps')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;
  const predictiveData = getLatestInsight('predictive_insights')?.insights;

  const handleGenerateAllInsights = async () => {
    const types = ['comprehensive_insights', 'knowledge_gaps', 'learning_patterns', 'predictive_insights'];
    
    for (const type of types) {
      await generateInsights(type);
    }
  };

  if (!comprehensiveData && !gapsData && !patternsData && !predictiveData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Learning Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Unlock AI-Powered Learning Insights</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get personalized analysis of your learning patterns, knowledge gaps, and growth opportunities
            </p>
            <Button 
              onClick={handleGenerateAllInsights}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isGenerating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Generating Insights...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Learning Insights
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateAllInsights}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Zap className="h-3 w-3 animate-pulse" />
            ) : (
              <BarChart3 className="h-3 w-3" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gaps">Gaps</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="predictions">Future</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            {comprehensiveData && (
              <div className="space-y-4">
                {/* Overall Progress */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Learning Progress</span>
                    <Badge variant="secondary">{comprehensiveData.summary?.level || 'Analyzing'}</Badge>
                  </div>
                  <Progress 
                    value={comprehensiveData.summary?.overallScore || 0} 
                    className="h-2 mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {comprehensiveData.summary?.progress || 'Building comprehensive learning profile...'}
                  </p>
                </div>

                {/* Strengths */}
                {comprehensiveData.strengths && comprehensiveData.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Your Strengths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {comprehensiveData.strengths.slice(0, 3).map((strength: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvement Areas */}
                {comprehensiveData.improvements && comprehensiveData.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      Focus Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {comprehensiveData.improvements.slice(0, 3).map((area: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Lightbulb className="h-3 w-3 mr-1 text-orange-500" />
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="gaps" className="space-y-4 mt-4">
            {gapsData && (
              <div className="space-y-4">
                {gapsData.criticalGaps && gapsData.criticalGaps.length > 0 ? (
                  <>
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Knowledge Gaps
                    </h4>
                    {gapsData.criticalGaps.slice(0, 3).map((gap: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{gap.topic}</span>
                          <Badge 
                            variant={gap.severity === 'high' ? 'destructive' : gap.severity === 'medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {gap.severity} priority
                          </Badge>
                        </div>
                        <Progress value={gap.score} className="h-1 mb-2" />
                        <p className="text-xs text-muted-foreground">
                          Current mastery: {gap.score}% • Subject: {gap.subject}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="text-sm text-muted-foreground">
                      No critical knowledge gaps detected. Great work!
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-4 mt-4">
            {patternsData && (
              <div className="space-y-4">
                {/* Peak Learning Times */}
                {patternsData.peakTimes && (
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Optimal Study Times
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {patternsData.peakTimes.map((time: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consistency Score */}
                {patternsData.consistency && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Learning Consistency</span>
                      <span className="text-lg font-bold">{patternsData.consistency.score}%</span>
                    </div>
                    <Progress value={patternsData.consistency.score} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {patternsData.consistency.analysis}
                    </p>
                  </div>
                )}

                {/* Productivity Insights */}
                {patternsData.productivity && (
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Productivity Insights
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div>Best days: {patternsData.productivity.bestDays?.join(', ')}</div>
                      <div>Avg session: {patternsData.productivity.avgSessionLength} min</div>
                      <p className="text-muted-foreground">{patternsData.productivity.analysis}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-4 mt-4">
            {predictiveData && (
              <div className="space-y-4">
                {/* Performance Predictions */}
                {predictiveData.predictions && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Predictions
                    </h4>
                    
                    {predictiveData.predictions.nextWeekPerformance && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Next Week Performance</span>
                          <span className="text-sm font-bold">
                            {predictiveData.predictions.nextWeekPerformance}%
                          </span>
                        </div>
                        <Progress 
                          value={predictiveData.predictions.nextWeekPerformance} 
                          className="h-1"
                        />
                      </div>
                    )}

                    {predictiveData.predictions.subjectScores && (
                      <div className="space-y-2">
                        {Object.entries(predictiveData.predictions.subjectScores).slice(0, 3).map(([subject, score]: [string, any]) => (
                          <div key={subject} className="flex items-center justify-between text-xs">
                            <span>{subject}</span>
                            <span className="font-medium">{score}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Risk Assessment */}
                {predictiveData.risks && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Risk Level</span>
                      <Badge 
                        variant={
                          predictiveData.risks.level === 'high' ? 'destructive' :
                          predictiveData.risks.level === 'medium' ? 'secondary' : 'outline'
                        }
                      >
                        {predictiveData.risks.level}
                      </Badge>
                    </div>
                    
                    {predictiveData.risks.areas && predictiveData.risks.areas.length > 0 && (
                      <div className="space-y-1">
                        {predictiveData.risks.areas.slice(0, 2).map((area: string, index: number) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {area}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Interventions */}
                {predictiveData.interventions && predictiveData.interventions.length > 0 && (
                  <div className="p-3 border rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Recommended Actions
                    </h4>
                    <div className="space-y-1">
                      {predictiveData.interventions.slice(0, 2).map((intervention: string, index: number) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          {intervention}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};