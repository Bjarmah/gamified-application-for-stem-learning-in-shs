import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FormattedText } from '@/components/ui/formatted-text';
import { useAIService } from '@/hooks/use-ai-service';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';
import { Brain, Send, Lightbulb, TrendingUp, Target, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StudyRecommendation {
  type: 'weak_area' | 'review' | 'advance' | 'practice';
  subject: string;
  topic: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export const SmartStudyAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const { generatePersonalizedTutoring, isLoading } = useAIService();
  const { performance, loading: analyticsLoading } = useLearningAnalytics();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await generatePersonalizedTutoring(input, {
      userAnalytics: performance,
    });

    if (response) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  const generateRecommendations = async () => {
    if (!performance) return;

    // Generate smart recommendations based on user performance
    const newRecommendations: StudyRecommendation[] = [];

    // Analyze weak areas from performance data
    Object.entries(performance).forEach(([subject, data]: [string, any]) => {
      if (data.weakAreas && data.weakAreas.length > 0) {
        data.weakAreas.forEach((area: string) => {
          newRecommendations.push({
            type: 'weak_area',
            subject: subject,
            topic: area,
            reason: 'Performance below 60% - needs focused practice',
            priority: 'high',
          });
        });
      }

      // Recommend review for moderate performance
      if (data.averageScore >= 60 && data.averageScore < 80) {
        newRecommendations.push({
          type: 'review',
          subject: subject,
          topic: 'Recent topics',
          reason: 'Solidify understanding to reach mastery',
          priority: 'medium',
        });
      }

      // Recommend advancement for high performance
      if (data.averageScore >= 80) {
        newRecommendations.push({
          type: 'advance',
          subject: subject,
          topic: 'Advanced concepts',
          reason: 'Ready for more challenging material',
          priority: 'medium',
        });
      }
    });

    setRecommendations(newRecommendations);
  };

  React.useEffect(() => {
    if (performance) {
      generateRecommendations();
    }
  }, [performance]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weak_area': return Target;
      case 'review': return TrendingUp;
      case 'advance': return Sparkles;
      case 'practice': return Lightbulb;
      default: return Brain;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* AI Chat Interface */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Study Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                  <p className="text-lg font-medium mb-2">How can I help you study?</p>
                  <p className="text-sm">
                    Ask me questions about your subjects, request explanations, or get study tips!
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <FormattedText content={message.content} className="text-sm" />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Textarea
              placeholder="Ask me anything about your studies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[60px]"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[460px]">
            <div className="space-y-3">
              {recommendations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Complete some quizzes to get personalized recommendations!</p>
                </div>
              ) : (
                recommendations.map((rec, index) => {
                  const Icon = getTypeIcon(rec.type);
                  return (
                    <Card key={index} className="border">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <p className="font-medium text-sm">{rec.topic}</p>
                          </div>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          Start Practice
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
