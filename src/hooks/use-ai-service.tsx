import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AIServiceRequest {
  type: 'personalized_tutoring' | 'insights_generation' | 'coaching_session' | 'content_analysis';
  prompt: string;
  context?: {
    userAnalytics?: any;
    learningHistory?: any;
    currentModule?: string;
    weakAreas?: string[];
    preferences?: any;
  };
  model?: string;
}

interface AIServiceResponse {
  response: string;
  type: string;
  tokensUsed?: number;
  model?: string;
}

export const useAIService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const callAI = async (request: AIServiceRequest): Promise<AIServiceResponse | null> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use AI features.",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Calling AI service:', request.type);

      const { data, error: functionError } = await supabase.functions.invoke('ai-learning-assistant', {
        body: request,
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(functionError.message || 'AI service error');
      }

      if (data?.error) {
        console.error('AI service error:', data.error);
        throw new Error(data.error);
      }

      if (!data?.response) {
        throw new Error('No response received from AI service');
      }

      console.log('AI response received:', {
        type: data.type,
        responseLength: data.response.length,
        tokensUsed: data.tokensUsed
      });

      return data as AIServiceResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      
      toast({
        title: "AI Service Error",
        description: errorMessage,
        variant: "destructive",
      });

      console.error('AI service call failed:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generatePersonalizedTutoring = async (
    question: string, 
    context?: AIServiceRequest['context']
  ) => {
    return callAI({
      type: 'personalized_tutoring',
      prompt: question,
      context,
    });
  };

  const generateLearningInsights = async (
    userAnalytics: any,
    focusArea?: string
  ) => {
    const prompt = focusArea 
      ? `Generate detailed learning insights focused on: ${focusArea}`
      : 'Generate comprehensive learning insights and recommendations based on my learning data.';

    return callAI({
      type: 'insights_generation',
      prompt,
      context: {
        userAnalytics,
        currentModule: focusArea,
      },
    });
  };

  const generateCoachingAdvice = async (
    situation: string,
    context?: AIServiceRequest['context']
  ) => {
    return callAI({
      type: 'coaching_session',
      prompt: situation,
      context,
    });
  };

  const analyzeContent = async (
    content: string,
    analysisType?: string
  ) => {
    const prompt = analysisType 
      ? `Analyze the following content with focus on: ${analysisType}\n\nContent: ${content}`
      : `Analyze the following educational content:\n\nContent: ${content}`;

    return callAI({
      type: 'content_analysis',
      prompt,
    });
  };

  return {
    isLoading,
    error,
    callAI,
    generatePersonalizedTutoring,
    generateLearningInsights,
    generateCoachingAdvice,
    analyzeContent,
  };
};