import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedLearningInsights from '@/components/ai-insights/AdvancedLearningInsights';
import { SmartStudyPlanner } from '@/components/study-planner/SmartStudyPlanner';
import { Brain, Calendar, TrendingUp } from 'lucide-react';

const Insights: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Learning Insights</h1>
        <p className="text-muted-foreground">
          AI-powered analysis of your learning patterns and personalized study plans
        </p>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insights">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance Insights
          </TabsTrigger>
          <TabsTrigger value="planner">
            <Calendar className="h-4 w-4 mr-2" />
            Study Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          <AdvancedLearningInsights />
        </TabsContent>

        <TabsContent value="planner" className="mt-6">
          <SmartStudyPlanner />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Insights;
