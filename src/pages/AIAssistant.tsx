import React from 'react';
import { EnhancedAIChatbot } from '@/components/ai-chatbot/EnhancedAIChatbot';
import { AINotificationCenter } from '@/components/notifications/AINotificationCenter';

const AIAssistant: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">
          Your personal AI-powered learning companion
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-[600px]">
            <EnhancedAIChatbot context="general" />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <AINotificationCenter />
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
