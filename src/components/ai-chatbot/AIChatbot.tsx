import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Minimize2, Send, Bot, User } from 'lucide-react';

interface AIChatbotProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
    showMinimizeButton?: boolean;
    initialMinimized?: boolean;
}

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

const AIChatbot: React.FC<AIChatbotProps> = ({
    position = 'bottom-right',
    className = '',
    showMinimizeButton = true,
    initialMinimized = false
}) => {
    const [isMinimized, setIsMinimized] = useState(initialMinimized);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your AI Learning Assistant. How can I help you with your STEM studies today?",
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const getPositionClasses = () => {
        switch (position) {
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            default:
                return 'bottom-4 right-4';
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: generateAIResponse(inputText.trim()),
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000);
    };

    const generateAIResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes('help') || input.includes('assist')) {
            return "I'm here to help! I can assist with STEM subjects like Biology, Chemistry, Physics, and Mathematics. What specific topic would you like to learn about?";
        }

        if (input.includes('biology') || input.includes('bio')) {
            return "Biology is fascinating! I can help you understand topics like cell structure, photosynthesis, human body systems, and more. What specific biology concept would you like to explore?";
        }

        if (input.includes('chemistry') || input.includes('chem')) {
            return "Chemistry is all about matter and its changes! I can help with atomic structure, chemical bonding, acids and bases, and more. What chemistry topic interests you?";
        }

        if (input.includes('physics') || input.includes('phys')) {
            return "Physics explains how the universe works! I can help with motion, forces, energy, waves, and more. What physics concept would you like to understand?";
        }

        if (input.includes('math') || input.includes('mathematics')) {
            return "Mathematics is the language of science! I can help with algebra, geometry, calculus, and more. What math topic would you like to work on?";
        }

        if (input.includes('quiz') || input.includes('test')) {
            return "Great idea! Taking quizzes is an excellent way to test your knowledge. You can find quizzes in the Quiz section or create your own. Would you like me to explain any specific concepts first?";
        }

        if (input.includes('module') || input.includes('lesson')) {
            return "Modules are organized learning units that break down complex topics into manageable pieces. Each module includes content, examples, and often a quiz. Which subject's modules would you like to explore?";
        }

        return "That's an interesting question! I'm here to help you learn. Could you tell me more about what you'd like to understand, or ask about a specific STEM topic?";
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isMinimized) {
        return (
            <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
                <Button
                    onClick={() => setIsMinimized(false)}
                    className="h-12 w-12 rounded-full bg-stemPurple hover:bg-stemPurple-dark text-white shadow-lg"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            </div>
        );
    }

    return (
        <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
            <Card className="w-80 h-96 shadow-2xl border-0 bg-white">
                <CardContent className="p-0 h-full relative">
                    {/* Header */}
                    <div className="bg-stemPurple text-white p-3 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <span className="font-semibold">AI Learning Assistant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {showMinimizeButton && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsMinimized(true)}
                                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMinimized(true)}
                                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 h-64 overflow-y-auto p-3 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${message.isUser
                                        ? 'bg-stemPurple text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {message.isUser ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                    </div>
                                    <div className={`px-3 py-2 rounded-lg ${message.isUser
                                        ? 'bg-stemPurple text-white'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        <p className="text-sm">{message.text}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                                        <Bot className="h-3 w-3" />
                                    </div>
                                    <div className="px-3 py-2 rounded-lg bg-gray-100">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="border-t p-3">
                        <div className="flex gap-2">
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about STEM..."
                                className="flex-1 text-sm"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim() || isTyping}
                                size="sm"
                                className="bg-stemPurple hover:bg-stemPurple-dark text-white"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AIChatbot;
