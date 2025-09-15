import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import AIChatbot from './AIChatbot';
import { useQuizContext } from '@/context/QuizContext';

interface FloatingAIChatbotProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
}

const FloatingAIChatbot: React.FC<FloatingAIChatbotProps> = ({
    position = 'bottom-right',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isQuizActive } = useQuizContext();

  // Don't render anything if a quiz is active
  if (isQuizActive) {
    return null;
  }

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4', 
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (isOpen) {
    return (
      <AIChatbot
        position={position}
        className={className}
        showMinimizeButton={true}
        initialMinimized={false}
      />
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      <Button
        onClick={() => setIsOpen(true)}
        className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 animate-pulse"
        size="icon"
        title="AI Learning Assistant"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    </div>
  );
};

export default FloatingAIChatbot;
