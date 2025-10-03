import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/hooks/use-gamification';
import { useAIService } from '@/hooks/use-ai-service';
import { useLearningAnalytics } from '@/hooks/use-learning-analytics';
import { Brain, Trophy, Target, TrendingUp, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export const MobileStudyHub: React.FC = () => {
  const { gamificationData, loading: gamificationLoading } = useGamification();
  const { generatePersonalizedTutoring, isLoading: aiLoading } = useAIService();
  const { performance } = useLearningAnalytics();
  const [messages, setMessages] = React.useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = React.useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await generatePersonalizedTutoring(input);
    if (response) {
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Level {gamificationData?.current_level || 1}</span>
            <Badge variant="secondary">{gamificationData?.total_xp || 0} XP</Badge>
          </div>
          <Progress value={((gamificationData?.total_xp || 0) % 100)} className="h-2" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-xl font-bold">{gamificationData?.current_streak || 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-xl font-bold">
                {performance && performance.length > 0 
                  ? Math.round(performance.reduce((sum, p) => sum + p.averageScore, 0) / performance.length)
                  : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Study Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea className="h-[200px] w-full rounded border p-3">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                Ask me anything about your studies!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-muted mr-8'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={aiLoading}
            />
            <Button size="icon" onClick={handleSend} disabled={aiLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Study Plan
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            Practice Quiz
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Trophy className="h-4 w-4 mr-2" />
            View Achievements
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
