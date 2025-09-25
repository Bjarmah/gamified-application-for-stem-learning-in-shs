import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LearningMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface InsightRecommendation {
  type: 'focus' | 'practice' | 'review' | 'advance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeEstimate: string;
  subject: string;
}

interface CognitivePatterns {
  peakHours: Array<{
    time: string;
    efficiency: number;
    type: string;
  }>;
  learningStyle: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  attentionSpan: {
    current: number;
    optimal: number;
    trend: string;
  };
}

export const useAdvancedInsights = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch learning insights from the database
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['advanced-insights'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('learning_insights')
        .select('*')
        .eq('user_id', user.id)
        .eq('analysis_type', 'advanced')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
  });

  // Generate new insights
  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Call AI service to generate insights
      const { data, error } = await supabase.functions.invoke('generate-learning-insights', {
        body: { userId: user.id, analysisType: 'advanced' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advanced-insights'] });
      toast({
        title: "Insights Updated",
        description: "Your learning insights have been refreshed with the latest data.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mock data when no insights are available
  const mockLearningMetrics: LearningMetric[] = [
    {
      label: 'Learning Velocity',
      value: 78,
      change: 12,
      trend: 'up',
      color: 'bg-primary'
    },
    {
      label: 'Knowledge Retention',
      value: 85,
      change: 5,
      trend: 'up',
      color: 'bg-green-500'
    },
    {
      label: 'Focus Score',
      value: 72,
      change: -3,
      trend: 'down',
      color: 'bg-yellow-500'
    },
    {
      label: 'Concept Mastery',
      value: 91,
      change: 8,
      trend: 'up',
      color: 'bg-blue-500'
    }
  ];

  const mockRecommendations: InsightRecommendation[] = [
    {
      type: 'focus',
      title: 'Optimize Chemistry Study Time',
      description: 'Your performance peaks at 3-5 PM for chemistry concepts',
      impact: 'high',
      timeEstimate: '30 min sessions',
      subject: 'Chemistry'
    },
    {
      type: 'practice',
      title: 'Strengthen Math Problem Solving',
      description: 'Focus on algebraic equations - 23% improvement potential',
      impact: 'high',
      timeEstimate: '45 min daily',
      subject: 'Mathematics'
    },
    {
      type: 'review',
      title: 'Revisit Physics Fundamentals',
      description: 'Motion concepts need reinforcement before advanced topics',
      impact: 'medium',
      timeEstimate: '20 min review',
      subject: 'Physics'
    },
    {
      type: 'advance',
      title: 'Ready for Advanced Biology',
      description: 'Cellular biology mastery achieved - proceed to systems level',
      impact: 'medium',
      timeEstimate: '60 min modules',
      subject: 'Biology'
    }
  ];

  const mockCognitivePatterns: CognitivePatterns = {
    peakHours: [
      { time: '9-11 AM', efficiency: 95, type: 'Problem Solving' },
      { time: '2-4 PM', efficiency: 88, type: 'Concept Learning' },
      { time: '7-8 PM', efficiency: 76, type: 'Review & Practice' }
    ],
    learningStyle: {
      visual: 45,
      auditory: 25,
      kinesthetic: 30
    },
    attentionSpan: {
      current: 35,
      optimal: 45,
      trend: 'improving'
    }
  };

  const insightsData = insights?.insights && typeof insights.insights === 'object' ? insights.insights as any : {};
  const learningMetrics = insightsData?.metrics || mockLearningMetrics;
  const recommendations = insightsData?.recommendations || mockRecommendations;
  const cognitivePatterns = insightsData?.patterns || mockCognitivePatterns;

  return {
    insights,
    learningMetrics,
    recommendations,
    cognitivePatterns,
    isLoading,
    error,
    generateInsights: generateInsightsMutation.mutate,
    isGenerating: generateInsightsMutation.isPending,
  };
};

export const useOptimizationRecommendations = () => {
  const [optimizations, setOptimizations] = useState([
    {
      type: 'schedule',
      title: 'Optimize Study Schedule',
      description: 'Implement spaced repetition during peak hours for 24% improvement',
      action: 'Generate Schedule',
      impact: '24% improvement',
      timeSaved: '15 min daily',
      efficiency: '3.2x faster'
    }
  ]);

  const applyOptimization = (type: string) => {
    // Implementation for applying optimization
    console.log('Applying optimization:', type);
  };

  return {
    optimizations,
    applyOptimization,
  };
};