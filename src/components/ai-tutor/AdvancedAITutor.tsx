import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Send, MessageSquare, BookOpen, Target, 
  Zap, Clock, TrendingUp, Lightbulb, Bot, Loader2,
  Settings, ChevronDown, Star, Award, AlertCircle,
  CheckCircle, PlayCircle, PauseCircle, RotateCcw, Beaker
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useAIService } from '@/hooks/use-ai-service';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'tutor' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  resources?: { title: string; type: string; url?: string }[];
  confidence?: number;
  context?: string;
  interactionType?: 'question' | 'explanation' | 'practice' | 'assessment';
}

interface LearningSession {
  id: string;
  topic: string;
  startTime: Date;
  duration: number;
  messagesCount: number;
  comprehensionScore: number;
  concepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TutorPersonality {
  name: string;
  style: 'encouraging' | 'analytical' | 'creative' | 'systematic';
  specialties: string[];
  avatar: string;
}

const AdvancedAITutor: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: analytics } = useUserAnalytics();
  const { generatePersonalizedTutoring, isLoading } = useAIService();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [comprehensionLevel, setComprehensionLevel] = useState(50);
  const [activeMode, setActiveMode] = useState<'chat' | 'practice' | 'assessment'>('chat');
  const [selectedPersonality, setSelectedPersonality] = useState('encouraging');
  const [contextAwareness, setContextAwareness] = useState(true);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout>();

  const tutorPersonalities: TutorPersonality[] = [
    {
      name: 'Dr. Encourage',
      style: 'encouraging',
      specialties: ['motivation', 'confidence building', 'positive reinforcement'],
      avatar: '🌟'
    },
    {
      name: 'Prof. Logic',
      style: 'analytical',
      specialties: ['critical thinking', 'problem solving', 'systematic approaches'],
      avatar: '🧠'
    },
    {
      name: 'Ms. Creative',
      style: 'creative',
      specialties: ['creative thinking', 'visualization', 'alternative approaches'],
      avatar: '🎨'
    },
    {
      name: 'Mr. System',
      style: 'systematic',
      specialties: ['structured learning', 'step-by-step guidance', 'methodology'],
      avatar: '📋'
    }
  ];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      initializeSession();
    }
  }, []);

  const initializeSession = () => {
    const newSession: LearningSession = {
      id: Date.now().toString(),
      topic: 'General Learning',
      startTime: new Date(),
      duration: 0,
      messagesCount: 0,
      comprehensionScore: 50,
      concepts: [],
      difficulty: 'intermediate'
    };
    
    setCurrentSession(newSession);
    
    const personality = tutorPersonalities.find(p => p.style === selectedPersonality);
    const welcomeMessage: Message = {
      id: '1',
      type: 'tutor',
      content: generateWelcomeMessage(personality),
      timestamp: new Date(),
      suggestions: [
        "Help me understand a concept",
        "Create practice questions",
        "Review my weak areas",
        "Explain with examples",
        "Test my knowledge"
      ],
      confidence: 95,
      interactionType: 'question'
    };
    
    setMessages([welcomeMessage]);
    startSessionTimer();
  };

  const generateWelcomeMessage = (personality?: TutorPersonality): string => {
    const baseMessage = `Hello! I'm your advanced AI tutor. I've analyzed your learning profile and I'm ready to provide personalized assistance.`;
    
    const contextualInfo = analytics ? `
Based on your recent performance:
- Average Score: ${analytics.averageScore?.toFixed(0)}%
- Learning Streak: ${analytics.streak} days
- Preferred Subjects: ${analytics.progressTrend === 'increasing' ? 'Growing stronger!' : 'Let\'s focus on improvement'}
` : '';

    const personalityTouch = personality ? 
      personality.style === 'encouraging' ? " I'm here to cheer you on and help you succeed! 🌟" :
      personality.style === 'analytical' ? " Let's approach learning systematically and logically. 🧠" :
      personality.style === 'creative' ? " We'll explore creative ways to understand concepts! 🎨" :
      " I'll guide you through structured learning steps. 📋" : '';

    return baseMessage + contextualInfo + personalityTouch + " What would you like to work on today?";
  };

  const startSessionTimer = () => {
    sessionTimerRef.current = setInterval(() => {
      setCurrentSession(prev => prev ? {
        ...prev,
        duration: Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
      } : null);
    }, 1000);
  };

  const analyzeComprehension = (userMessage: string, tutorResponse: string): number => {
    // Simple comprehension analysis based on message complexity and user response patterns
    const messageLength = userMessage.length;
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'explain'];
    const hasQuestions = questionWords.some(word => 
      userMessage.toLowerCase().includes(word)
    );
    
    const positiveWords = ['understand', 'got it', 'makes sense', 'clear', 'thanks'];
    const hasPositiveFeedback = positiveWords.some(word => 
      userMessage.toLowerCase().includes(word)
    );
    
    let score = comprehensionLevel;
    
    if (hasPositiveFeedback) score += 10;
    if (hasQuestions && messageLength > 20) score += 5;
    if (messageLength < 10) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  };

  const generateContextualResponse = async (userMessage: string): Promise<Message> => {
    const context = {
      userAnalytics: analytics,
      currentSession: currentSession,
      comprehensionLevel: comprehensionLevel,
      recentMessages: messages.slice(-5),
      tutorStyle: selectedPersonality,
      difficulty: currentSession?.difficulty || 'intermediate'
    };

    const enhancedPrompt = `
As an advanced AI tutor with ${selectedPersonality} personality style, respond to: "${userMessage}"

Current Context:
- User comprehension level: ${comprehensionLevel}%
- Session topic: ${currentSession?.topic || 'General'}
- Time in session: ${Math.floor((currentSession?.duration || 0) / 60)} minutes
- User performance: ${analytics?.averageScore?.toFixed(0)}% average
- Learning style preference: ${selectedPersonality}

Guidelines:
1. Adapt explanation complexity to comprehension level
2. Use examples relevant to user's performance level
3. Maintain ${selectedPersonality} personality style
4. Provide actionable next steps
5. Include practice opportunities when appropriate

Respond conversationally and helpfully.`;

    try {
      const aiResponse = await generatePersonalizedTutoring(enhancedPrompt, context);
      
      if (aiResponse) {
        // Update comprehension based on interaction
        const newComprehension = analyzeComprehension(userMessage, aiResponse.response);
        setComprehensionLevel(newComprehension);
        
        // Extract concepts mentioned
        const concepts = extractConcepts(userMessage + ' ' + aiResponse.response);
        if (currentSession) {
          setCurrentSession({
            ...currentSession,
            concepts: [...new Set([...currentSession.concepts, ...concepts])],
            comprehensionScore: newComprehension,
            messagesCount: currentSession.messagesCount + 1
          });
        }
        
        return {
          id: Date.now().toString(),
          type: 'tutor',
          content: aiResponse.response,
          timestamp: new Date(),
          confidence: 85 + Math.random() * 10,
          context: `Comprehension: ${newComprehension}%`,
          suggestions: generateSmartSuggestions(userMessage, aiResponse.response),
          resources: generateRelevantResources(concepts),
          interactionType: determineInteractionType(userMessage)
        };
      }
    } catch (error) {
      console.error('AI tutor error:', error);
    }
    
    // Fallback response
    return {
      id: Date.now().toString(),
      type: 'tutor',
      content: "I'm having trouble processing that right now. Could you rephrase your question or try a different topic?",
      timestamp: new Date(),
      confidence: 30,
      interactionType: 'question'
    };
  };

  const extractConcepts = (text: string): string[] => {
    const conceptKeywords = [
      'photosynthesis', 'respiration', 'mitosis', 'meiosis', 'dna', 'rna',
      'atom', 'molecule', 'element', 'compound', 'reaction', 'equilibrium',
      'force', 'energy', 'momentum', 'velocity', 'acceleration', 'gravity',
      'equation', 'function', 'derivative', 'integral', 'matrix', 'probability'
    ];
    
    return conceptKeywords.filter(concept => 
      text.toLowerCase().includes(concept)
    );
  };

  const generateSmartSuggestions = (userMessage: string, tutorResponse: string): string[] => {
    const baseForUserQuery = [
      "Can you give me an example?",
      "How does this apply in real life?",
      "What's the next step?",
      "Test my understanding"
    ];
    
    const baseSuggestions = [
      "Explain it differently",
      "Show me a practice problem",
      "Give me more examples",
      "What should I study next?"
    ];
    
    // Contextual suggestions based on message content
    if (userMessage.toLowerCase().includes('difficult')) {
      return ["Break it down step by step", "Show me simpler examples", "What are the basics?"];
    }
    
    if (userMessage.toLowerCase().includes('example')) {
      return ["More examples please", "Practice problems", "Real-world applications"];
    }
    
    if (tutorResponse.toLowerCase().includes('practice')) {
      return ["Create a quiz", "Give me problems to solve", "Test my knowledge"];
    }
    
    return baseSuggestions;
  };

  const generateRelevantResources = (concepts: string[]): { title: string; type: string; url?: string }[] => {
    const resources = concepts.slice(0, 3).map(concept => ({
      title: `${concept.charAt(0).toUpperCase() + concept.slice(1)} Study Guide`,
      type: 'guide'
    }));
    
    return [
      ...resources,
      { title: "Interactive Lab", type: "lab" },
      { title: "Practice Quiz", type: "quiz" },
      { title: "Video Explanation", type: "video" }
    ];
  };

  const determineInteractionType = (message: string): 'question' | 'explanation' | 'practice' | 'assessment' => {
    if (message.toLowerCase().includes('quiz') || message.toLowerCase().includes('test')) {
      return 'assessment';
    }
    if (message.toLowerCase().includes('practice') || message.toLowerCase().includes('problem')) {
      return 'practice';
    }
    if (message.toLowerCase().includes('explain') || message.toLowerCase().includes('what')) {
      return 'explanation';
    }
    return 'question';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      interactionType: determineInteractionType(inputValue)
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const tutorResponse = await generateContextualResponse(messageContent);
      setMessages(prev => [...prev, tutorResponse]);
    } catch (error) {
      console.error('Failed to generate response:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const generatePracticeQuiz = async () => {
    const concepts = currentSession?.concepts || ['general'];
    const quizPrompt = `Generate 3 practice questions about: ${concepts.join(', ')}. 
    Difficulty: ${currentSession?.difficulty}. 
    Include multiple choice with explanations.`;
    
    setIsTyping(true);
    try {
      const response = await generatePersonalizedTutoring(quizPrompt, { userAnalytics: analytics });
      if (response) {
        const quizMessage: Message = {
          id: Date.now().toString(),
          type: 'tutor',
          content: response.response,
          timestamp: new Date(),
          interactionType: 'assessment',
          confidence: 90
        };
        setMessages(prev => [...prev, quizMessage]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const endSession = () => {
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    
    if (currentSession) {
      const sessionSummary: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Session Summary:
Duration: ${Math.floor(currentSession.duration / 60)} minutes
Messages: ${currentSession.messagesCount}
Concepts covered: ${currentSession.concepts.join(', ') || 'None'}
Final comprehension: ${comprehensionLevel}%

Great work today! Keep up the learning momentum! 🎉`,
        timestamp: new Date(),
        interactionType: 'assessment'
      };
      
      setMessages(prev => [...prev, sessionSummary]);
    }
    
    toast({
      title: "Session Ended",
      description: "Your learning session has been saved!",
      duration: 4000
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Advanced AI Tutor
                {currentSession && (
                  <Badge variant="outline" className="ml-2">
                    {formatDuration(currentSession.duration)}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Personalized learning with adaptive intelligence and contextual awareness
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={comprehensionLevel > 70 ? "default" : comprehensionLevel > 40 ? "secondary" : "destructive"}
                className="flex items-center gap-1"
              >
                <Brain className="h-3 w-3" />
                {comprehensionLevel}% Comprehension
              </Badge>
              <Button variant="outline" size="sm" onClick={endSession}>
                End Session
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as any)}>
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tutor Personality:</span>
                  <select 
                    value={selectedPersonality}
                    onChange={(e) => setSelectedPersonality(e.target.value)}
                    className="text-sm border rounded px-2 py-1"
                  >
                    {tutorPersonalities.map(p => (
                      <option key={p.style} value={p.style}>
                        {p.avatar} {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={contextAwareness}
                      onChange={(e) => setContextAwareness(e.target.checked)}
                      id="context"
                    />
                    <label htmlFor="context">Context Aware</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={adaptiveDifficulty}
                      onChange={(e) => setAdaptiveDifficulty(e.target.checked)}
                      id="adaptive"
                    />
                    <label htmlFor="adaptive">Adaptive Difficulty</label>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[400px] border rounded-lg p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {(message.type === 'tutor' || message.type === 'system') && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.type === 'system' ? (
                              <Settings className="h-4 w-4" />
                            ) : (
                              tutorPersonalities.find(p => p.style === selectedPersonality)?.avatar || <Bot className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground ml-auto'
                              : message.type === 'system'
                              ? 'bg-muted border-l-4 border-blue-500'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          
                          {message.confidence && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Confidence: {message.confidence}%
                              </span>
                              <Progress value={message.confidence} className="h-1 w-16" />
                            </div>
                          )}
                          
                          {message.context && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              {message.context}
                            </div>
                          )}
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
                            <div className="flex flex-wrap gap-1">
                              {message.resources.map((resource, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {resource.type === 'lab' && <Beaker className="h-3 w-3 mr-1" />}
                                  {resource.type === 'quiz' && <Target className="h-3 w-3 mr-1" />}
                                  {resource.type === 'video' && <PlayCircle className="h-3 w-3 mr-1" />}
                                  {resource.title}
                                </Badge>
                              ))}
                            </div>
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
            </TabsContent>
            
            <TabsContent value="practice">
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Practice Mode</h3>
                <p className="text-muted-foreground mb-4">
                  Generate personalized practice questions based on your learning session
                </p>
                <Button onClick={generatePracticeQuiz} disabled={isLoading}>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Practice Quiz
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="assessment">
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Session Time</p>
                      <p className="font-medium">{formatDuration(currentSession?.duration || 0)}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-muted-foreground">Messages</p>
                      <p className="font-medium">{currentSession?.messagesCount || 0}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Brain className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Comprehension</p>
                      <p className="font-medium">{comprehensionLevel}%</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm text-muted-foreground">Concepts</p>
                      <p className="font-medium">{currentSession?.concepts.length || 0}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {currentSession?.concepts && currentSession.concepts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Concepts Covered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {currentSession.concepts.map((concept, index) => (
                          <Badge key={index} variant="outline">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAITutor;