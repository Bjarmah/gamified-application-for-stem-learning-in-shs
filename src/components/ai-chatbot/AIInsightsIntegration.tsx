import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, MessageSquare, TrendingUp, Target, 
  Clock, Zap, RefreshCw, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useAIService } from '@/hooks/use-ai-service';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useToast } from '@/hooks/use-toast';

interface AIInsightsIntegrationProps {
  className?: string;
  onChatRequest?: (message: string) => void;
}

export const AIInsightsIntegration: React.FC<AIInsightsIntegrationProps> = ({
  className = "",
  onChatRequest
}) => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { generateLearningInsights, generatePersonalizedTutoring, isLoading } = useAIService();
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights(user?.id);
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('chat');
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([]);
  const [quickInsights, setQuickInsights] = useState<any>(null);

  // Generate chat suggestions based on user performance
  useEffect(() => {
    if (analytics) {
      const suggestions = [];
      
      if (analytics.averageScore < 70) {
        suggestions.push("How can I improve my quiz scores?");
      }
      
      if (analytics.streak > 0) {
        suggestions.push(`How can I maintain my ${analytics.streak}-day streak?`);
      }
      
      suggestions.push("What should I study next?");
      suggestions.push("Create a study plan for me");
      
      setChatSuggestions(suggestions.slice(0, 4));
    }
  }, [analytics]);

  // Generate quick insights
  const handleGenerateQuickInsights = async () => {
    if (!analytics) return;

    try {
      const response = await generateLearningInsights(analytics, 'quick insights summary');
      
      if (response?.response) {
        setQuickInsights({
          score: analytics.averageScore || 0,
          trend: analytics.progressTrend || 'stable',
          recommendations: response.response.split('\n').slice(0, 3),
          nextAction: analytics.averageScore < 70 ? 'Focus on weak areas' : 'Continue current pace'
        });
        
        toast({
          title: "Insights Generated",
          description: "Your personalized learning insights are ready!",
        });
      }
    } catch (error) {
      console.error('Error generating quick insights:', error);
    }
  };

  const handleChatSuggestion = async (suggestion: string) => {
    if (onChatRequest) {
      onChatRequest(suggestion);
    } else {
      // Generate response directly
      try {
        const response = await generatePersonalizedTutoring(suggestion, {
          userAnalytics: analytics,
          currentModule: 'insights_integration'
        });
        
        if (response?.response) {
          toast({
            title: "AI Response Ready",
            description: "Check your AI tutor for the personalized response!",
          });
        }
      } catch (error) {
        console.error('Error handling chat suggestion:', error);
      }
    }
  };

  return (
    <Card className={`${className} border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            AI Learning Assistant
          </div>
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <Zap className="h-2 w-2" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-3">
                Ask me anything or try these suggestions:
              </p>
              
              <div className="space-y-2">
                {chatSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between text-xs h-8"
                    onClick={() => handleChatSuggestion(suggestion)}
                    disabled={isLoading}
                  >
                    <span className="truncate">{suggestion}</span>
                    <ChevronRight className="h-3 w-3 ml-2 flex-shrink-0" />
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="mt-4">
            <div className="space-y-4">
              {quickInsights ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="text-lg font-bold text-primary">
                        {quickInsights.score.toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Performance</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg text-center">
                      <div className="text-sm font-bold text-primary capitalize">
                        {quickInsights.trend}
                      </div>
                      <div className="text-xs text-muted-foreground">Trend</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Next Steps:</h4>
                    <div className="p-3 bg-muted/20 rounded-lg text-xs">
                      {quickInsights.nextAction}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground mb-3">
                    Generate personalized insights about your learning
                  </p>
                  <Button 
                    size="sm" 
                    onClick={handleGenerateQuickInsights}
                    disabled={isLoading || isGenerating}
                    className="text-xs"
                  >
                    {isLoading || isGenerating ? (
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Brain className="h-3 w-3 mr-1" />
                    )}
                    Generate Insights
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Daily Goal</span>
                  <Badge variant="outline" className="text-xs">Today</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Complete 1 quiz with 80%+ score
                </div>
              </div>

              <div className="p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Weekly Goal</span>
                  <Badge variant="outline" className="text-xs">This Week</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Maintain {analytics?.streak || 0}+ day study streak
                </div>
              </div>

              <Button 
                size="sm" 
                className="w-full text-xs"
                onClick={() => handleChatSuggestion("Help me set personalized learning goals")}
              >
                <Target className="h-3 w-3 mr-1" />
                Set Custom Goals
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};