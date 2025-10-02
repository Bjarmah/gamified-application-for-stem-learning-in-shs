import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartStudyAssistant } from '@/components/ai-tutor/SmartStudyAssistant';
import { AdvancedGamification } from '@/components/gamification/AdvancedGamification';
import { Brain, Trophy, Target } from 'lucide-react';

const StudyHub: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Study Hub</h1>
        <p className="text-muted-foreground">
          Your personalized learning companion powered by AI
        </p>
      </div>

      <Tabs defaultValue="assistant" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assistant">
            <Brain className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="gamification">
            <Trophy className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="mt-6">
          <SmartStudyAssistant />
        </TabsContent>

        <TabsContent value="gamification" className="mt-6">
          <AdvancedGamification />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyHub;
