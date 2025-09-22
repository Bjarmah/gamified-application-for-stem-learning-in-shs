import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  Brain, 
  Lightbulb, 
  BookOpen,
  MessageCircle,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Mic,
  MicOff
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string;
  suggestions?: string[];
  resources?: {
    title: string;
    url: string;
    type: 'module' | 'quiz' | 'video' | 'article';
  }[];
}

interface LearningContext {
  currentSubject?: string;
  currentTopic?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  recentPerformance?: number;
  strugglingAreas?: string[];
}

export const AILearningAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: "Hi! I'm your AI Learning Assistant. I can help you understand complex concepts, solve problems, create study plans, and provide personalized explanations. What would you like to learn about today?",
      timestamp: new Date(),
      suggestions: [
        "Explain chemical bonding",
        "Help with calculus integration",
        "Create a study plan for physics",
        "Practice math word problems"
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [learningContext, setLearningContext] = useState<LearningContext>({});

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, learningContext);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string, context: LearningContext): ChatMessage => {
    const input = userInput.toLowerCase();
    
    // Subject detection
    let detectedSubject = '';
    if (input.includes('math') || input.includes('calculus') || input.includes('algebra')) {
      detectedSubject = 'Mathematics';
    } else if (input.includes('chemistry') || input.includes('chemical') || input.includes('reaction')) {
      detectedSubject = 'Chemistry';
    } else if (input.includes('physics') || input.includes('force') || input.includes('motion')) {
      detectedSubject = 'Physics';
    } else if (input.includes('biology') || input.includes('cell') || input.includes('organism')) {
      detectedSubject = 'Biology';
    }

    // Update context
    if (detectedSubject) {
      setLearningContext(prev => ({ ...prev, currentSubject: detectedSubject }));
    }

    let response = '';
    let suggestions: string[] = [];
    let resources: ChatMessage['resources'] = [];

    // Chemistry responses
    if (input.includes('chemical bonding') || input.includes('bonds')) {
      response = `Chemical bonding is how atoms connect to form molecules! There are three main types:

🔗 **Ionic Bonds**: Electrons transfer from metal to non-metal (like Na+ and Cl- forming salt)
🔗 **Covalent Bonds**: Atoms share electrons (like H2O water molecules)  
🔗 **Metallic Bonds**: Electrons flow freely in a "sea" around metal atoms

Think of it like different ways people can hold hands - some grip tight (ionic), some share the grip (covalent), and some have a group hug (metallic)!

Would you like me to explain any specific type in more detail?`;

      suggestions = [
        "Explain ionic bonding with examples",
        "How do covalent bonds work?",
        "What determines bond strength?",
        "Practice bonding problems"
      ];

      resources = [
        { title: "Chemical Bonding Module", url: "/modules/chemical-bonding", type: "module" },
        { title: "Bonding Practice Quiz", url: "/quiz/bonding", type: "quiz" }
      ];
    }

    // Math responses
    else if (input.includes('calculus') || input.includes('integration')) {
      response = `Integration in calculus is like "anti-differentiation" - we're finding the area under a curve! 

📐 **Basic Concept**: If differentiation finds the slope, integration finds the area
📐 **Power Rule**: ∫x^n dx = x^(n+1)/(n+1) + C
📐 **Common Functions**: 
   - ∫sin(x) dx = -cos(x) + C
   - ∫e^x dx = e^x + C
   - ∫1/x dx = ln|x| + C

🎯 **Techniques**:
1. Substitution (u-substitution)
2. Integration by parts
3. Partial fractions

Think of integration as "collecting" all the tiny pieces under a curve to find the total!`;

      suggestions = [
        "Show me u-substitution",
        "Practice integration by parts",
        "Explain definite vs indefinite integrals",
        "Real-world integration examples"
      ];

      resources = [
        { title: "Calculus Integration Module", url: "/modules/integration", type: "module" },
        { title: "Integration Practice Problems", url: "/practice/integration", type: "quiz" }
      ];
    }

    // Physics responses
    else if (input.includes('physics') || input.includes('motion') || input.includes('force')) {
      response = `Physics is all about understanding how things move and interact! Let's break it down:

⚡ **Newton's Laws**:
1. **Inertia**: Objects at rest stay at rest, moving objects keep moving
2. **F = ma**: Force equals mass times acceleration 
3. **Action-Reaction**: Every action has an equal and opposite reaction

🚀 **Key Concepts**:
- **Velocity**: Speed with direction
- **Acceleration**: Change in velocity over time
- **Momentum**: Mass × velocity (conserved in collisions)

Think of physics as the "rules of the game" that everything in the universe follows!`;

      suggestions = [
        "Explain Newton's second law",
        "Help with projectile motion",
        "What is momentum conservation?",
        "Practice force problems"
      ];

      resources = [
        { title: "Physics Mechanics Module", url: "/modules/mechanics", type: "module" },
        { title: "Motion Simulator", url: "/lab/motion", type: "video" }
      ];
    }

    // Study plan responses
    else if (input.includes('study plan') || input.includes('schedule')) {
      response = `I'd love to help you create an effective study plan! Here's a personalized approach:

📅 **Smart Study Strategy**:
1. **25-minute focused sessions** (Pomodoro technique)
2. **5-minute breaks** between sessions  
3. **Mix difficult and easy topics** to maintain motivation
4. **Review yesterday's material** before learning new concepts

🎯 **Based on your performance**:
- Focus on weaker areas during peak energy times
- Use spaced repetition for long-term retention
- Include practice problems, not just reading

What subject would you like to focus on first? I can create a specific weekly plan!`;

      suggestions = [
        "Create a chemistry study plan",
        "Help me schedule math practice",
        "What's the best time to study?",
        "How long should study sessions be?"
      ];
    }

    // Generic helpful response
    else {
      response = `I'm here to help with any learning challenge! I can:

🧠 **Explain Concepts**: Break down complex topics into simple, understandable parts
📚 **Create Study Plans**: Personalized schedules based on your goals and performance
🔍 **Solve Problems**: Step-by-step solutions with clear explanations
🎯 **Practice Support**: Generate practice questions and provide feedback

What specific topic or subject can I help you with today?`;

      suggestions = [
        "Explain a difficult concept",
        "Create a study schedule",
        "Help me solve a problem", 
        "Generate practice questions"
      ];
    }

    return {
      id: `ai-${Date.now()}`,
      type: 'assistant',
      content: response,
      timestamp: new Date(),
      context: detectedSubject,
      suggestions,
      resources
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would integrate with speech recognition
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          AI Learning Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Your personal AI tutor for instant help and explanations
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Learning Context Display */}
        {learningContext.currentSubject && (
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Brain className="h-4 w-4 text-purple-500" />
            <span className="text-sm">Currently helping with: <strong>{learningContext.currentSubject}</strong></span>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                } p-3 rounded-lg`}>
                  <div className="flex items-start gap-2 mb-2">
                    {message.type === 'assistant' && (
                      <Bot className="h-4 w-4 text-blue-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs opacity-70">
                        <Clock className="h-3 w-3" />
                        {message.timestamp.toLocaleTimeString()}
                        {message.context && (
                          <Badge variant="outline" className="text-xs">
                            {message.context}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  {message.resources && message.resources.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium">📚 Helpful Resources:</p>
                      {message.resources.map((resource, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs h-7"
                        >
                          {resource.type === 'module' && <BookOpen className="h-3 w-3 mr-1" />}
                          {resource.type === 'quiz' && <Target className="h-3 w-3 mr-1" />}
                          {resource.type === 'video' && <TrendingUp className="h-3 w-3 mr-1" />}
                          {resource.title}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium">💡 Try asking:</p>
                      <div className="grid gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="justify-start text-xs h-6 font-normal"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <Lightbulb className="h-3 w-3 mr-1" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your studies..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isTyping}
              className="pr-12"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={toggleListening}
            >
              {isListening ? (
                <Mic className="h-3 w-3 text-red-500" />
              ) : (
                <MicOff className="h-3 w-3" />
              )}
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { icon: BookOpen, label: "Explain Concept", query: "Can you explain " },
            { icon: Target, label: "Solve Problem", query: "Help me solve this problem: " },
            { icon: TrendingUp, label: "Study Plan", query: "Create a study plan for " },
            { icon: AlertCircle, label: "Get Help", query: "I'm struggling with " }
          ].map(({ icon: Icon, label, query }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 whitespace-nowrap"
              onClick={() => setInputMessage(query)}
            >
              <Icon className="h-3 w-3" />
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};