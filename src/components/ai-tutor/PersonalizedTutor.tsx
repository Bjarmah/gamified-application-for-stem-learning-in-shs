import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Brain, Send, MessageSquare, BookOpen, Target, 
  Zap, Clock, TrendingUp, Lightbulb, Bot, Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useAIService } from '@/hooks/use-ai-service';

interface Message {
  id: string;
  type: 'user' | 'tutor';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  resources?: { title: string; type: string; }[];
}

interface PersonalizedTutorProps {
  onStartChat?: (prompt: string) => void;
}

export const PersonalizedTutor: React.FC<PersonalizedTutorProps> = ({ onStartChat }) => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { generatePersonalizedTutoring, isLoading } = useAIService();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        type: 'tutor',
        content: `Hi! I'm your AI tutor. I've analyzed your learning progress and I'm here to help you succeed. Based on your recent activity, I can see you're making great progress! What would you like to work on today?`,
        timestamp: new Date(),
        suggestions: [
          "Help with weak areas",
          "Review recent topics",
          "Practice questions",
          "Study plan advice"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const generateTutorResponse = (userMessage: string): Message => {
    const responses = {
      weak: "I notice you've been struggling with some chemistry concepts. Let's focus on atomic structure - it's fundamental to understanding chemical bonding. Would you like me to create some practice questions?",
      review: "Based on your recent quiz performance, I recommend reviewing photosynthesis and cellular respiration. These topics are closely connected and understanding one helps with the other.",
      practice: "Great idea! I'll generate some adaptive questions based on your current level. Let's start with medium difficulty and adjust based on your performance.",
      study: "I've analyzed your learning patterns and created an optimized study schedule. You learn best in the evenings, so I've scheduled challenging topics then with review sessions in the morning.",
      default: "I understand you want to improve your learning. Based on your progress data, I recommend focusing on consistent practice and reviewing concepts where you scored below 70%. Would you like specific suggestions?"
    };

    let responseContent = responses.default;
    if (userMessage.toLowerCase().includes('weak')) responseContent = responses.weak;
    else if (userMessage.toLowerCase().includes('review')) responseContent = responses.review;
    else if (userMessage.toLowerCase().includes('practice')) responseContent = responses.practice;
    else if (userMessage.toLowerCase().includes('study') || userMessage.toLowerCase().includes('plan')) responseContent = responses.study;

    return {
      id: Date.now().toString(),
      type: 'tutor',
      content: responseContent,
      timestamp: new Date(),
      suggestions: ["Tell me more", "Create practice quiz", "Show study plan", "Different topic"],
      resources: [
        { title: "Interactive Chemistry Lab", type: "lab" },
        { title: "Practice Questions", type: "quiz" },
        { title: "Study Materials", type: "content" }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue('');
    setIsTyping(true);

    onStartChat?.(`${messageContent}`);

    try {
      const context = {
        userAnalytics: analytics,
        currentModule: 'STEM Learning',
        weakAreas: analytics?.progressTrend === 'decreasing' ? ['review previous topics'] : undefined,
      };

      const aiResponse = await generatePersonalizedTutoring(messageContent, context);
      
      if (aiResponse) {
        const tutorResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'tutor',
          content: aiResponse.response,
          timestamp: new Date(),
          suggestions: ["Tell me more", "Create practice quiz", "Show study plan", "Different topic"],
          resources: [
            { title: "Interactive Lab", type: "lab" },
            { title: "Practice Questions", type: "quiz" },
            { title: "Study Materials", type: "content" }
          ]
        };
        
        setMessages(prev => [...prev, tutorResponse]);
      } else {
        // Fallback response
        const fallbackResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'tutor',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackResponse]);
      }
    } catch (error) {
      console.error('AI tutor error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'tutor',
        content: "I'm experiencing some technical difficulties. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const quickActions = [
    { label: "Explain Concept", icon: Lightbulb, prompt: "Can you explain this concept in simple terms?" },
    { label: "Practice Quiz", icon: Target, prompt: "Create a practice quiz for me" },
    { label: "Study Plan", icon: Clock, prompt: "Help me create a study plan" },
    { label: "Weak Areas", icon: TrendingUp, prompt: "Show me my weak areas and how to improve" }
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Personal Tutor
        </CardTitle>
        <CardDescription>
          Get personalized help based on your learning progress and performance
        </CardDescription>
        {analytics && (
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Avg Score: {analytics.averageScore?.toFixed(0)}%
            </Badge>
            <Badge variant="outline" className="text-xs">
              {analytics.streak} day streak
            </Badge>
            <Badge variant="outline" className="text-xs">
              Level {Math.floor((analytics.totalXP || 0) / 1000) + 1}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="h-auto p-3 flex flex-col items-center gap-1"
              onClick={() => handleSuggestionClick(action.prompt)}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 border rounded-lg p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'tutor' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-xs"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {message.resources && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-muted-foreground">Recommended resources:</p>
                      {message.resources.map((resource, index) => (
                        <Badge key={index} variant="secondary" className="text-xs mr-1">
                          {resource.title}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about your studies..."
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading || isTyping}
            size="icon"
          >
            {isLoading || isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};