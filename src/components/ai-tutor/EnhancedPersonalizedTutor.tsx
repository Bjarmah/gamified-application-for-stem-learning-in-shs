import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Bot, 
  User, 
  Brain,
  MessageSquare,
  Lightbulb,
  BookOpen,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Star,
  Mic,
  Image,
  FileText,
  Volume2,
  Pause,
  Play
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface TutorMessage {
  id: string;
  type: 'user' | 'tutor';
  content: string;
  timestamp: Date;
  metadata?: {
    subject?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    concepts?: string[];
    hasAudio?: boolean;
    hasVisual?: boolean;
  };
}

interface LearningContext {
  currentSubject: string;
  recentTopics: string[];
  difficultyLevel: number;
  learningGoals: string[];
  weakAreas: string[];
  strongAreas: string[];
}

export const EnhancedPersonalizedTutor: React.FC = () => {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: '1',
      type: 'tutor',
      content: 'Hi! I\'m your AI Learning Companion. I\'ve analyzed your recent progress and I\'m ready to help you master chemistry concepts. What would you like to explore today?',
      timestamp: new Date(),
      metadata: {
        subject: 'Chemistry',
        concepts: ['introduction']
      }
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'practice' | 'explain' | 'quiz'>('chat');
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const learningContext: LearningContext = {
    currentSubject: 'Chemistry',
    recentTopics: ['Atomic Structure', 'Chemical Bonding', 'Acids and Bases'],
    difficultyLevel: 7,
    learningGoals: ['Master stoichiometry', 'Understand molecular geometry'],
    weakAreas: ['Balancing equations', 'Molarity calculations'],
    strongAreas: ['Periodic trends', 'Lewis structures']
  };

  const quickActions = [
    { label: 'Explain this concept', icon: <Lightbulb className="h-4 w-4" />, type: 'explain' },
    { label: 'Practice problems', icon: <Target className="h-4 w-4" />, type: 'practice' },
    { label: 'Quick quiz', icon: <Zap className="h-4 w-4" />, type: 'quiz' },
    { label: 'Study guide', icon: <BookOpen className="h-4 w-4" />, type: 'guide' }
  ];

  const suggestedQuestions = [
    'How do I balance chemical equations?',
    'Explain molecular polarity',
    'What are the types of chemical bonds?',
    'Help me with stoichiometry problems'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: TutorMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const tutorResponse: TutorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'tutor',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        metadata: {
          subject: learningContext.currentSubject,
          concepts: extractConcepts(inputValue),
          hasAudio: true,
          hasVisual: shouldIncludeVisual(inputValue)
        }
      };

      setMessages(prev => [...prev, tutorResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      `Great question about ${learningContext.currentSubject}! Let me break this down for you step by step. Based on your learning history, I'll focus on the concepts you're working to improve.`,
      `I can see you're working on understanding this concept. Let me explain it in a way that builds on what you already know about ${learningContext.recentTopics[0]}.`,
      `Perfect! This is exactly the kind of question that will help you master your weak areas. Let me provide a detailed explanation with some practice examples.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const extractConcepts = (input: string): string[] => {
    const concepts = ['chemical bonds', 'stoichiometry', 'molarity', 'atomic structure'];
    return concepts.filter(concept => input.toLowerCase().includes(concept));
  };

  const shouldIncludeVisual = (input: string): boolean => {
    const visualKeywords = ['structure', 'diagram', 'shape', 'geometry', 'model'];
    return visualKeywords.some(keyword => input.toLowerCase().includes(keyword));
  };

  const handleQuickAction = (type: string) => {
    setActiveMode(type as any);
    const actionMessages = {
      explain: 'I\'d like you to explain a concept in detail',
      practice: 'Give me some practice problems to work on',
      quiz: 'Create a quick quiz to test my understanding',
      guide: 'Help me create a study guide for this topic'
    };
    
    setInputValue(actionMessages[type as keyof typeof actionMessages] || '');
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const playAudio = (messageId: string) => {
    setIsPlayingAudio(isPlayingAudio === messageId ? null : messageId);
    // Audio playback implementation would go here
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="bg-primary/10">
              <AvatarFallback className="bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                AI Learning Companion
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Enhanced
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Personalized for {learningContext.currentSubject} • Level {learningContext.difficultyLevel}/10
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              Online
            </Badge>
          </div>
        </div>

        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="explain">Explain</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className={`${message.type === 'user' ? 'bg-primary' : 'bg-primary/10'}`}>
                  <AvatarFallback className={`${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.metadata?.concepts && message.metadata.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {message.metadata.concepts.map((concept, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'tutor' && message.metadata && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      {message.metadata.hasAudio && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() => playAudio(message.id)}
                        >
                          {isPlayingAudio === message.id ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                      {message.metadata.hasVisual && (
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Image className="h-3 w-3" />
                        </Button>
                      )}
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="bg-primary/10">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {messages.length === 1 && (
          <div className="px-4 py-3 border-t bg-muted/30">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuickAction(action.type)}
                    className="text-xs"
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Suggested questions:</p>
                <div className="space-y-1">
                  {suggestedQuestions.slice(0, 2).map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs text-muted-foreground h-auto p-2"
                      onClick={() => setInputValue(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask about ${learningContext.currentSubject}...`}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleVoiceInput}
                  className={`h-6 w-6 p-0 ${isListening ? 'text-red-500' : 'text-muted-foreground'}`}
                >
                  <Mic className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-muted-foreground">
                  <FileText className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Response time: ~2s</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span>Accuracy: 94%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPersonalizedTutor;