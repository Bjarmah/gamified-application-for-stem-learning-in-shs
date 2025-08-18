import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import AIChatbot from './AIChatbot';

interface FloatingAIChatbotProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
}

const FloatingAIChatbot: React.FC<FloatingAIChatbotProps> = ({
    position = 'bottom-right',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (isOpen) {
        return (
            <AIChatbot
                position={position}
                className={className}
                showMinimizeButton={false}
                initialMinimized={false}
            />
        );
    }

    return (
        <div className={`fixed ${position === 'bottom-left' ? 'bottom-4 left-4' : position === 'top-right' ? 'top-4 right-4' : position === 'top-left' ? 'top-4 left-4' : 'bottom-4 right-4'} z-50 ${className}`}>
            <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full bg-stemPurple hover:bg-stemPurple-dark text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                size="icon"
            >
                <MessageCircle className="h-7 w-7" />
            </Button>
        </div>
    );
};

export default FloatingAIChatbot;
