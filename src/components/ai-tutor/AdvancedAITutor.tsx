import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Target,
  Zap,
  BookOpen,
  Clock,
  Sparkles,
  Send,
  Mic,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AITutorMessage {
  id: string;
  type: 'user' | 'tutor';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export const AdvancedAITutor: React.FC = () => {
  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      id: '1',
      type: 'tutor',
      content: "Hi! I'm your AI tutor. I can help you with any subject, explain complex concepts, and create personalized learning plans. What would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [learningProgress, setLearningProgress] = useState(0);

  const tutorCapabilities = [
    { icon: MessageSquare, label: 'Interactive Q&A', color: 'text-blue-500' },
    { icon: Lightbulb, label: 'Concept Explanation', color: 'text-yellow-500' },
    { icon: Target, label: 'Personalized Plans', color: 'text-green-500' },
    { icon: BookOpen, label: 'Study Materials', color: 'text-purple-500' }
  ];

  const quickPrompts = [
    "Explain photosynthesis step by step",
    "Help me solve quadratic equations",
    "What is quantum mechanics?",
    "Create a study plan for chemistry"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: AITutorMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const tutorResponse: AITutorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'tutor',
        content: `Great question! Let me help you understand that concept. Based on your learning history, I recommend starting with the fundamentals and building up complexity gradually.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, tutorResponse]);
      setIsTyping(false);
      setLearningProgress(prev => Math.min(prev + 10, 100));
    }, 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="space-y-6">
      {/* AI Tutor Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Advanced AI Tutor
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Beta
            </Badge>
          </CardTitle>
          <CardDescription>
            Your personal AI learning companion with advanced reasoning capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {tutorCapabilities.map((capability, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-white/50 rounded-lg">
                <capability.icon className={`h-4 w-4 ${capability.color}`} />
                <span className="text-xs font-medium">{capability.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress */}
      {currentTopic && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Topic: {currentTopic}</span>
              <span className="text-xs text-muted-foreground">{learningProgress}% Complete</span>
            </div>
            <Progress value={learningProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat with AI Tutor</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.slice(0, 2).map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickPrompt(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your studies..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Mic className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};