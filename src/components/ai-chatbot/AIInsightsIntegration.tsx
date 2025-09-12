import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, MessageSquare, Lightbulb, TrendingUp, Loader2 } from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIInsightsIntegrationProps {
  className?: string;
  onInsightGenerated?: (insight: any) => void;
}

export const AIInsightsIntegration = ({ 
  className, 
  onInsightGenerated 
}: AIInsightsIntegrationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getLatestInsight } = useLearningInsights(user?.id);
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  const comprehensiveInsight = getLatestInsight('comprehensive_insights');
  const predictiveInsight = getLatestInsight('predictive_insights');
  const learningPatterns = getLatestInsight('learning_patterns');

  const handleAskAI = async () => {
    if (!query.trim() || !user?.id) return;

    setIsProcessing(true);
    setChatResponse(null);

    try {
      // Prepare context from existing insights
      const context = {
        comprehensive: comprehensiveInsight?.insights,
        predictive: predictiveInsight?.insights,
        patterns: learningPatterns?.insights,
        userQuery: query
      };

      // Call AI function with context
      const { data, error } = await supabase.functions.invoke('ai-insights-chat', {
        body: {
          userId: user.id,
          context,
          query: query.trim()
        }
      });

      if (error) throw error;

      setChatResponse(data.response);
      
      // If the AI generated new insights, trigger callback
      if (data.newInsights && onInsightGenerated) {
        onInsightGenerated(data.newInsights);
      }

      toast({
        title: "AI Response Generated",
        description: "Your personalized learning advice is ready.",
      });

    } catch (error) {
      console.error('AI chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestedQuestions = [
    "How can I improve my weakest subjects?",
    "What's the best study schedule for me?",
    "Why am I struggling with certain topics?",
    "What are my learning strengths?",
    "How can I maintain my study momentum?"
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-primary" />
          AI Learning Coach
          <Badge variant="secondary" className="text-xs">
            Powered by Insights
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Insights Summary */}
        {comprehensiveInsight && (
          <div className="bg-primary/5 p-3 rounded-lg space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Latest Insights
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Performance:</span>
                <span className="ml-1 font-semibold">
                  {Math.round(comprehensiveInsight.insights?.overall_performance || 0)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Predicted:</span>
                <span className="ml-1 font-semibold">
                  {Math.round(predictiveInsight?.insights?.predicted_performance || 0)}%
                </span>
              </div>
            </div>
            {comprehensiveInsight.insights?.key_insights && (
              <p className="text-xs text-muted-foreground">
                {comprehensiveInsight.insights.key_insights}
              </p>
            )}
          </div>
        )}

        {/* Chat Input */}
        <div className="space-y-3">
          <Textarea
            placeholder="Ask your AI learning coach anything about your progress, study habits, or recommendations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          
          <Button 
            onClick={handleAskAI}
            disabled={!query.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask AI Coach
              </>
            )}
          </Button>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Suggested Questions
          </h5>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setQuery(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Response */}
        {chatResponse && (
          <div className="bg-secondary/20 p-3 rounded-lg">
            <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Coach Response
            </h5>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {chatResponse}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};