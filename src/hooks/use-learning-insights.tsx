import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LearningInsight {
  id: string;
  user_id: string;
  analysis_type: string;
  insights: any;
  generated_at: string;
  created_at: string;
}

export interface LearningPatternInsights {
  peakTimes: string[];
  consistency: {
    score: number;
    analysis: string;
  };
  productivity: {
    bestDays: string[];
    avgSessionLength: number;
    analysis: string;
  };
  recommendations: string[];
}

export interface PredictiveInsights {
  trends: {
    overall: string;
    subjects: Record<string, string>;
  };
  risks: {
    level: 'low' | 'medium' | 'high';
    areas: string[];
    recommendations: string[];
  };
  predictions: {
    nextWeekPerformance: number;
    subjectScores: Record<string, number>;
  };
  interventions: string[];
}

export interface KnowledgeGapInsights {
  criticalGaps: {
    subject: string;
    topic: string;
    severity: 'low' | 'medium' | 'high';
    score: number;
  }[];
  learningPath: {
    step: number;
    subject: string;
    topic: string;
    estimatedTime: string;
  }[];
  practiceStrategies: Record<string, string[]>;
  prerequisites: Record<string, string[]>;
}

export interface ComprehensiveInsights {
  summary: {
    overallScore: number;
    level: string;
    progress: string;
  };
  strengths: string[];
  improvements: string[];
  studyPlan: {
    daily: string[];
    weekly: string[];
    monthly: string[];
  };
  goals: {
    shortTerm: string[];
    longTerm: string[];
  };
  motivation: {
    strategies: string[];
    rewards: string[];
  };
}

export const useLearningInsights = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const targetUserId = userId || user?.id;

  // Fetch cached insights from database
  const { data: cachedInsights, refetch } = useQuery({
    queryKey: ['learning-insights', targetUserId],
    queryFn: async (): Promise<LearningInsight[]> => {
      if (!targetUserId) return [];
      
      // Using any to bypass type checking for the new table
      const { data, error } = await (supabase as any)
        .from('learning_insights')
        .select('*')
        .eq('user_id', targetUserId)
        .order('generated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const generateInsights = useCallback(async (analysisType: string) => {
    if (!targetUserId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);
    
    // Show generation progress notification
    toast({
      title: "🤖 Generating AI Insights...",
      description: `Analyzing your ${analysisType.replace('_', ' ')} data. This may take a few moments.`,
      duration: 3000,
    });
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-learning-insights', {
        body: {
          userId: targetUserId,
          analysisType
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate insights');
      }

      // Refetch cached insights to get the new ones
      await refetch();

      toast({
        title: "✅ Analysis Complete!",
        description: "Your learning insights have been updated with AI analysis.",
        duration: 5000,
      });

      return data.insights;
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        title: "❌ Error generating insights",
        description: error.message || "Failed to generate learning insights",
        variant: "destructive",
        duration: 6000,
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [targetUserId, toast, refetch]);

  const getLatestInsight = useCallback((analysisType: string): LearningInsight | null => {
    if (!cachedInsights) return null;
    
    return cachedInsights.find(insight => insight.analysis_type === analysisType) || null;
  }, [cachedInsights]);

  return {
    cachedInsights: cachedInsights || [],
    isGenerating,
    generateInsights,
    getLatestInsight,
    refetch
  };
};

// Hook for analytics data
export const useAnalyticsData = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['analytics-data', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      // Using any to bypass type checking for the new RPC function
      const { data, error } = await (supabase as any).rpc('get_user_analytics_data', { 
        target_user_id: targetUserId 
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// Hook for learning time patterns
export const useLearningTimePatterns = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['learning-time-patterns', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      // Using any to bypass type checking for the new RPC function
      const { data, error } = await (supabase as any).rpc('get_learning_time_patterns', { 
        target_user_id: targetUserId 
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Hook for knowledge gaps
export const useKnowledgeGaps = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['knowledge-gaps', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      // Using any to bypass type checking for the new RPC function
      const { data, error } = await (supabase as any).rpc('get_knowledge_gaps', { 
        target_user_id: targetUserId 
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};