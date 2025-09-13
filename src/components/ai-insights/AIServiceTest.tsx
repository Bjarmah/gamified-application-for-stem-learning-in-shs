import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, Send, Zap, Clock, TestTube, Loader2
} from 'lucide-react';
import { useAIService } from '@/hooks/use-ai-service';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';

interface AIServiceTestProps {
  className?: string;
}

export const AIServiceTest: React.FC<AIServiceTestProps> = ({ 
  className = "" 
}) => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { 
    generatePersonalizedTutoring, 
    generateLearningInsights, 
    generateCoachingAdvice, 
    analyzeContent,
    isLoading 
  } = useAIService();
  
  const [testType, setTestType] = useState<'tutoring' | 'insights' | 'coaching' | 'content'>('tutoring');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  const testPrompts = {
    tutoring: "Explain photosynthesis in simple terms for a high school student",
    insights: "Analyze my learning progress and provide recommendations",
    coaching: "I'm having trouble staying motivated to study. Can you help?",
    content: "The mitochondria is the powerhouse of the cell. It produces ATP through cellular respiration."
  };

  const handleTest = async () => {
    if (!prompt.trim()) return;

    const startTime = Date.now();
    setResponse('');
    setLastRequestTime(null);

    try {
      let result;
      
      switch (testType) {
        case 'tutoring':
          result = await generatePersonalizedTutoring(prompt, {
            userAnalytics: analytics,
            currentModule: 'Test Module'
          });
          break;
        case 'insights':
          result = await generateLearningInsights(analytics, prompt);
          break;
        case 'coaching':
          result = await generateCoachingAdvice(prompt, {
            userAnalytics: analytics
          });
          break;
        case 'content':
          result = await analyzeContent(prompt, 'educational analysis');
          break;
      }

      if (result) {
        setResponse(result.response);
        setLastRequestTime(Date.now() - startTime);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLastRequestTime(Date.now() - startTime);
    }
  };

  const handleQuickTest = (type: typeof testType) => {
    setTestType(type);
    setPrompt(testPrompts[type]);
  };

  return (
    <Card className={`${className} border-primary/20`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-primary" />
          AI Service Test Console
          <Badge variant="outline" className="ml-auto">
            {user ? 'Authenticated' : 'Not Authenticated'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Test Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant={testType === 'tutoring' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleQuickTest('tutoring')}
            className="text-xs"
          >
            <Brain className="h-3 w-3 mr-1" />
            Tutoring
          </Button>
          <Button
            variant={testType === 'insights' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleQuickTest('insights')}
            className="text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            Insights
          </Button>
          <Button
            variant={testType === 'coaching' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleQuickTest('coaching')}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Coaching
          </Button>
          <Button
            variant={testType === 'content' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleQuickTest('content')}
            className="text-xs"
          >
            Content
          </Button>
        </div>

        {/* Test Configuration */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Type:</label>
          <Select value={testType} onValueChange={(value: any) => setTestType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutoring">Personalized Tutoring</SelectItem>
              <SelectItem value="insights">Learning Insights</SelectItem>
              <SelectItem value="coaching">Coaching Advice</SelectItem>
              <SelectItem value="content">Content Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Prompt:</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your test prompt here..."
            className="min-h-[80px]"
            disabled={isLoading}
          />
        </div>

        {/* Test Button */}
        <Button 
          onClick={handleTest}
          disabled={!prompt.trim() || isLoading || !user}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Testing AI Service...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Test AI Service
            </>
          )}
        </Button>

        {/* Response Display */}
        {(response || isLoading) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">AI Response:</label>
              {lastRequestTime && (
                <Badge variant="secondary" className="text-xs">
                  {lastRequestTime}ms
                </Badge>
              )}
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border min-h-[120px]">
              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is processing your request...</span>
                </div>
              ) : (
                <pre className="text-sm whitespace-pre-wrap text-foreground">
                  {response || 'No response yet. Click "Test AI Service" to get started.'}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Status Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• OpenAI API: Connected</p>
          <p>• Model: GPT-5 Mini (optimized for educational content)</p>
          <p>• User Context: {analytics ? 'Available' : 'Limited'}</p>
          {analytics && (
            <p>• Analytics: Score {analytics.averageScore?.toFixed(0)}%, Streak {analytics.streak} days</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};