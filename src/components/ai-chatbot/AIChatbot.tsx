import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface AIChatbotProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
    showMinimizeButton?: boolean;
    initialMinimized?: boolean;
}

const AIChatbot: React.FC<AIChatbotProps> = ({
    position = 'bottom-right',
    className = '',
    showMinimizeButton = true,
    initialMinimized = false
}) => {
    const [isMinimized, setIsMinimized] = useState(initialMinimized);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load Elfsight platform script
        const script = document.createElement('script');
        script.src = 'https://elfsightcdn.com/platform.js';
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.head.appendChild(script);

        return () => {
            // Cleanup script on unmount
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

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
                            <MessageCircle className="h-5 w-5" />
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

                    {/* Chatbot Container */}
                    <div className="h-full">
                        {isLoaded ? (
                            <div
                                className="elfsight-app-2d149f6b-dfa2-4a11-a48b-7df5673f0fd1 h-full"
                                data-elfsight-app-lazy
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-50">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stemPurple mx-auto mb-2"></div>
                                    <p className="text-sm text-gray-500">Loading AI Assistant...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AIChatbot;
