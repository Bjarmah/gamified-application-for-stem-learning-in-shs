import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, Target, Brain, 
  Calendar, Clock, Award, AlertCircle, Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useAIService } from '@/hooks/use-ai-service';
import { useToast } from '@/hooks/use-toast';

interface AIAnalyticsIntegrationProps {
  className?: string;
}

interface AIAnalysis {
  performanceAnalysis: string;
  strengthsAndWeaknesses: string;
  studyRecommendations: string;
  nextSteps: string;
  predictiveInsights: string;
}

export const AIAnalyticsIntegration: React.FC<AIAnalyticsIntegrationProps> = ({
  className = ""
}) => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { generateLearningInsights, isLoading } = useAIService();
  const { toast } = useToast();
  
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisType, setAnalysisType] = useState<'performance' | 'recommendations' | 'predictions'>('performance');

  const generateComprehensiveAnalysis = async () => {
    if (!analytics) {
      toast({
        title: "No Data Available",
        description: "Complete some quizzes to enable AI analysis.",
        variant: "destructive",
      });
      return;
    }

    try {
      const analysisPrompt = `Provide a comprehensive learning analytics report for this STEM student:

Performance Data:
- Average Score: ${analytics.averageScore?.toFixed(1)}%
- Current Streak: ${analytics.streak} days
- Total XP: ${analytics.totalXP || 0}
- Progress Trend: ${analytics.progressTrend}
- Quizzes Completed: ${analytics.quizzesCompleted || 0}

Please provide analysis in these specific areas:
1. Performance Analysis: Overall academic performance assessment
2. Strengths and Weaknesses: Key areas of strength and improvement needed
3. Study Recommendations: Specific, actionable study strategies
4. Next Steps: Immediate actions for improvement
5. Predictive Insights: What to expect based on current trends

Format each section clearly with practical, specific advice.`;

      const result = await generateLearningInsights(analytics, analysisPrompt);
      
      if (result) {
        // Parse the AI response into structured sections
        const sections = result.response.split(/\d+\.\s*(?:Performance Analysis|Strengths and Weaknesses|Study Recommendations|Next Steps|Predictive Insights):/i);
        
        setAiAnalysis({
          performanceAnalysis: sections[1]?.trim() || "Performance analysis in progress...",
          strengthsAndWeaknesses: sections[2]?.trim() || "Analyzing strengths and weaknesses...",
          studyRecommendations: sections[3]?.trim() || "Generating personalized recommendations...",
          nextSteps: sections[4]?.trim() || "Identifying next steps...",
          predictiveInsights: sections[5]?.trim() || "Creating predictive insights..."
        });

        toast({
          title: "AI Analysis Complete",
          description: "Your comprehensive learning report is ready!",
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`${className} border-primary/20`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            AI-Powered Analytics
          </div>
          <Button
            onClick={generateComprehensiveAnalysis}
            disabled={isLoading || !analytics}
            size="sm"
            className="h-8"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-3 w-3 mr-1" />
                Generate Report
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Stats Overview */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className={`text-lg font-bold ${getPerformanceColor(analytics.averageScore || 0)}`}>
                {analytics.averageScore?.toFixed(0) || 0}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className={`text-lg font-bold ${getStreakColor(analytics.streak || 0)}`}>
                {analytics.streak || 0}
              </div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary">
                {analytics.quizzesCompleted || 0}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold text-primary capitalize">
                {analytics.progressTrend || 'stable'}
              </div>
              <div className="text-xs text-muted-foreground">Trend</div>
            </div>
          </div>
        )}

        {/* AI Analysis Tabs */}
        {aiAnalysis && (
          <Tabs value={analysisType} onValueChange={(value: any) => setAnalysisType(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="predictions" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Predictions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Performance Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {aiAnalysis.performanceAnalysis}
                  </p>
                </div>
                
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Strengths & Areas for Improvement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {aiAnalysis.strengthsAndWeaknesses}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4 mt-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Personalized Study Recommendations
                </h4>
                <p className="text-sm text-muted-foreground">
                  {aiAnalysis.studyRecommendations}
                </p>
              </div>
              
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Immediate Next Steps
                </h4>
                <p className="text-sm text-muted-foreground">
                  {aiAnalysis.nextSteps}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4 mt-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Predictive Learning Insights
                </h4>
                <p className="text-sm text-muted-foreground">
                  {aiAnalysis.predictiveInsights}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!aiAnalysis && !isLoading && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">AI Analytics Ready</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate a comprehensive AI-powered analysis of your learning progress, 
              strengths, and personalized recommendations.
            </p>
            {!analytics && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                Complete some quizzes to enable AI analysis
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};