import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useLearningInsights } from '@/hooks/use-learning-insights';

interface AIInsightsIntegrationProps {
  onAskAI: (prompt: string) => void;
  className?: string;
}

export const AIInsightsIntegration = ({ onAskAI, className }: AIInsightsIntegrationProps) => {
  const { getLatestInsight } = useLearningInsights();

  const comprehensiveData = getLatestInsight('comprehensive_insights')?.insights;
  const gapsData = getLatestInsight('knowledge_gaps')?.insights;
  const patternsData = getLatestInsight('learning_patterns')?.insights;

  const generateInsightPrompts = () => {
    const prompts = [];

    if (comprehensiveData?.improvements) {
      prompts.push({
        title: "Help with Growth Areas",
        prompt: `I need help improving in these areas: ${comprehensiveData.improvements.slice(0, 2).join(', ')}. Can you provide specific strategies and resources?`,
        icon: <TrendingUp className="h-4 w-4" />,
        color: "text-orange-500"
      });
    }

    if (gapsData?.criticalGaps) {
      const topGap = gapsData.criticalGaps[0];
      if (topGap) {
        prompts.push({
          title: `Study Help: ${topGap.subject}`,
          prompt: `I'm struggling with ${topGap.topic} in ${topGap.subject}. My current understanding is at ${topGap.score}%. Can you explain this concept and provide practice questions?`,
          icon: <BookOpen className="h-4 w-4" />,
          color: "text-red-500"
        });
      }
    }

    if (patternsData?.recommendations) {
      prompts.push({
        title: "Study Schedule Help",
        prompt: `Based on my learning patterns, I got these recommendations: "${patternsData.recommendations[0]}". Can you help me create a detailed study schedule?`,
        icon: <Brain className="h-4 w-4" />,
        color: "text-blue-500"
      });
    }

    if (comprehensiveData?.studyPlan) {
      prompts.push({
        title: "Today's Focus",
        prompt: `My AI study plan suggests I focus on: ${comprehensiveData.studyPlan.daily?.slice(0, 2).join(', ')}. Can you break this down into specific learning activities?`,
        icon: <Lightbulb className="h-4 w-4" />,
        color: "text-purple-500"
      });
    }

    return prompts;
  };

  const insightPrompts = generateInsightPrompts();

  if (insightPrompts.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          Ask AI About Your Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground mb-4">
          Get personalized help based on your learning analysis
        </p>
        
        {insightPrompts.map((prompt, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={prompt.color}>{prompt.icon}</span>
              <span className="text-sm font-medium">{prompt.title}</span>
              <Badge variant="outline" className="text-xs">AI Suggested</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAskAI(prompt.prompt)}
              className="w-full text-left justify-start h-auto p-3"
            >
              <div className="text-xs text-muted-foreground line-clamp-2">
                "{prompt.prompt.slice(0, 100)}..."
              </div>
            </Button>
          </div>
        ))}

        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAskAI("Can you analyze my overall learning progress and provide personalized recommendations?")}
            className="w-full"
          >
            <Brain className="h-4 w-4 mr-2" />
            Ask for General Learning Advice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};