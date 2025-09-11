import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Lightbulb, TrendingUp, Target } from 'lucide-react';

interface InsightNotification {
  id: string;
  user_id: string;
  analysis_type: string;
  insights: any;
  generated_at: string;
}

export const useAIInsightsNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    // Set up real-time subscription for new insights
    const channel = supabase
      .channel('ai-insights-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'learning_insights',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const insight = payload.new as InsightNotification;
          showInsightNotification(insight);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const showInsightNotification = (insight: InsightNotification) => {
    const getNotificationContent = (analysisType: string) => {
      switch (analysisType) {
        case 'comprehensive_insights':
          return {
            title: "🧠 New Learning Report Ready!",
            description: "Your comprehensive learning analysis has been generated with personalized recommendations.",
            icon: Brain
          };
        case 'learning_patterns':
          return {
            title: "⏰ Study Patterns Analyzed!",
            description: "Discover your optimal learning times and productivity patterns.",
            icon: Lightbulb
          };
        case 'predictive_insights':
          return {
            title: "🔮 Performance Predictions Updated!",
            description: "See your predicted performance and risk assessment for upcoming challenges.",
            icon: TrendingUp
          };
        case 'knowledge_gaps':
          return {
            title: "🎯 Knowledge Gaps Identified!",
            description: "Get targeted recommendations to strengthen weak areas in your learning.",
            icon: Target
          };
        default:
          return {
            title: "✨ AI Insights Ready!",
            description: "New personalized learning insights have been generated for you.",
            icon: Brain
          };
      }
    };

    const content = getNotificationContent(insight.analysis_type);

    toast({
      title: content.title,
      description: content.description,
      duration: 8000,
      action: (
        <div className="flex items-center gap-2">
          <content.icon className="h-4 w-4" />
          <span className="text-xs">View Analytics</span>
        </div>
      )
    });
  };

  const triggerTestNotification = () => {
    toast({
      title: "🧠 AI Insights Test",
      description: "This is a test notification for AI insights generation.",
      duration: 5000,
    });
  };

  return {
    triggerTestNotification
  };
};

// Hook for listening to insight generation progress
export const useInsightGenerationStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const showGenerationProgress = (analysisType: string) => {
    toast({
      title: "🤖 Generating AI Insights...",
      description: `Analyzing your ${analysisType.replace('_', ' ')} data. This may take a few moments.`,
      duration: 3000,
    });
  };

  const showGenerationComplete = (analysisType: string) => {
    toast({
      title: "✅ Analysis Complete!",
      description: `Your ${analysisType.replace('_', ' ')} insights are now ready to view.`,
      duration: 5000,
    });
  };

  const showGenerationError = (error: string) => {
    toast({
      title: "❌ Generation Failed",
      description: error || "Failed to generate insights. Please try again.",
      variant: "destructive",
      duration: 6000,
    });
  };

  return {
    showGenerationProgress,
    showGenerationComplete,
    showGenerationError
  };
};