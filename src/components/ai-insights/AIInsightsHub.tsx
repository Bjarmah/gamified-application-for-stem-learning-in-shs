import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Target, TrendingUp, Clock, Zap, 
  BookOpen, MessageSquare, Bell, Settings
} from 'lucide-react';
import { PersonalizedTutor } from '@/components/ai-tutor/PersonalizedTutor';
import { AIRealtimeCoach } from '@/components/ai-tutor/AIRealtimeCoach';
import { SmartNotificationSystem } from '@/components/notifications/SmartNotificationSystem';
import { MobileAIInsights } from '@/components/mobile/MobileAIInsights';
import { AINotificationCenter } from './AINotificationCenter';
import { useAuth } from '@/context/AuthContext';
import { useUserAnalytics } from '@/hooks/use-analytics';
import { useLearningInsights } from '@/hooks/use-learning-insights';
import { useAIService } from '@/hooks/use-ai-service';
import { useToast } from '@/hooks/use-toast';

interface AIInsightsHubProps {
  className?: string;
  compact?: boolean;
}

export const AIInsightsHub: React.FC<AIInsightsHubProps> = ({ 
  className = "",
  compact = false 
}) => {
  const { user } = useAuth();
  const { data: analytics } = useUserAnalytics();
  const { toast } = useToast();
  const { getLatestInsight, generateInsights, isGenerating } = useLearningInsights(user?.id);
  const { generateLearningInsights, isLoading: aiLoading } = useAIService();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [aiActivity, setAiActivity] = useState({
    totalInsights: 0,
    activeSessions: 0,
    unreadNotifications: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    // Update AI activity metrics
    const updateActivity = () => {
      const insights = [
        getLatestInsight('comprehensive_insights'),
        getLatestInsight('predictive_insights'),
        getLatestInsight('learning_patterns')
      ].filter(Boolean);

      setAiActivity(prev => ({
        ...prev,
        totalInsights: insights.length,
        lastUpdate: new Date()
      }));
    };

    updateActivity();
    const interval = setInterval(updateActivity, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [getLatestInsight]);

  const handleGenerateComprehensiveInsights = async () => {
    try {
      const aiResponse = await generateLearningInsights(analytics, 'comprehensive analysis');
      
      if (aiResponse) {
        toast({
          title: "AI Analysis Complete",
          description: "Your personalized learning insights are ready!",
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate insights. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  if (compact) {
    return (
      <Card className={`${className} border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Learning Hub
            </div>
            <Badge variant="secondary" className="text-xs">
              {aiActivity.totalInsights} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <MobileAIInsights />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Learning Intelligence Hub
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI Powered
            </Badge>
            {isGenerating || aiLoading && (
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Analyzing
              </Badge>
            )}
          </div>
        </CardTitle>
        
        {/* AI Activity Summary */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-primary">{aiActivity.totalInsights}</p>
            <p className="text-xs text-muted-foreground">Insights</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-primary">{analytics?.streak || 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-primary">
              {analytics?.averageScore?.toFixed(0) || 0}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-primary capitalize">
              {analytics?.progressTrend || 'stable'}
            </p>
            <p className="text-xs text-muted-foreground">Trend</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">AI Tutor</span>
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="hidden sm:inline">Coach</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MobileAIInsights />
              <AINotificationCenter />
            </div>
          </TabsContent>

          <TabsContent value="tutor" className="mt-6">
            <PersonalizedTutor onStartChat={(prompt) => {
              toast({
                title: "AI Tutor Activated",
                description: `Starting conversation: "${prompt.substring(0, 50)}..."`,
                duration: 3000,
              });
            }} />
          </TabsContent>

          <TabsContent value="coach" className="mt-6">
            <AIRealtimeCoach />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <SmartNotificationSystem />
          </TabsContent>
        </Tabs>

        {/* Last Update Indicator */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Last AI update: {aiActivity.lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};