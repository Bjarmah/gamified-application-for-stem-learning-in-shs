import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AIModule {
  id: string;
  title: string;
  description: string;
  content: any;
  subject_id: string;
  difficulty_level: string;
  estimated_duration: number;
  generated_at: string;
  is_active: boolean;
  educator_approved: boolean;
  usage_count: number;
  rating: number;
}

interface GenerateContentParams {
  topic: string;
  subject_id: string;
  difficulty?: string;
  context?: any;
}

export const useAIModules = (subjectId: string | undefined) => {
  return useQuery({
    queryKey: ['ai-modules', subjectId],
    queryFn: async (): Promise<AIModule[]> => {
      if (!subjectId) return [];

      const { data, error } = await supabase
        .from('ai_generated_modules' as any)
        .select('*')
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching AI modules:', error);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        content: item.content,
        subject_id: item.subject_id,
        difficulty_level: item.difficulty_level,
        estimated_duration: item.estimated_duration,
        generated_at: item.created_at,
        is_active: item.is_active,
        educator_approved: item.educator_approved,
        usage_count: item.usage_count || 0,
        rating: item.rating || 0
      }));
    },
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useGenerateAIContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (params: GenerateContentParams) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    setIsGenerating(true);

    try {
      // Get user analytics for difficulty determination
      const { data: analyticsData } = await supabase
        .rpc('get_user_analytics_data', { target_user_id: user.id });

      // Determine difficulty based on subject performance
      let difficulty = params.difficulty;
      if (!difficulty) {
        const { data: determinedDifficulty } = await supabase
          .rpc('determine_content_difficulty' as any, { 
            target_user_id: user.id, 
            subject_name: params.topic 
          });
        difficulty = (determinedDifficulty as string) || 'intermediate';
      }

      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          topic: params.topic,
          subject_id: params.subject_id,
          user_id: user.id,
          difficulty,
          context: {
            userAnalytics: analyticsData,
            ...params.context
          }
        }
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to generate content');
      }

      if (!data.success) {
        throw new Error(data.error || 'Content generation failed');
      }

      // Invalidate and refetch AI modules
      queryClient.invalidateQueries({ queryKey: ['ai-modules', params.subject_id] });

      toast({
        title: "Content Generated!",
        description: `New module "${data.module.title}" has been created.`,
      });

      return data.module;

    } catch (error) {
      console.error('Content generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    isGenerating
  };
};

export const useAIModule = (moduleId: string | undefined) => {
  return useQuery({
    queryKey: ['ai-module', moduleId],
    queryFn: async (): Promise<AIModule | null> => {
      if (!moduleId) return null;

      try {
        const { data, error } = await supabase
          .from('ai_generated_modules' as any)
          .select('*')
          .eq('id', moduleId)
          .eq('is_active', true)
          .maybeSingle();

        if (error) {
          console.error('Error fetching AI module:', error);
          return null;
        }

        if (!data) return null;

        // Type guard to ensure data has expected properties
        if (typeof data === 'object' && data && 'id' in data && 'title' in data) {
          return {
            id: (data as any).id,
            title: (data as any).title,
            description: (data as any).description || '',
            content: (data as any).content,
            subject_id: (data as any).subject_id,
            difficulty_level: (data as any).difficulty_level,
            estimated_duration: (data as any).estimated_duration,
            generated_at: (data as any).created_at,
            is_active: (data as any).is_active,
            educator_approved: (data as any).educator_approved,
            usage_count: (data as any).usage_count || 0,
            rating: (data as any).rating || 0
          };
        }
        
        return null;
      } catch (error) {
        console.error('Error in useAIModule:', error);
        return null;
      }
    },
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useUpdateModuleRating = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ moduleId, rating }: { moduleId: string; rating: number }) => {
      const { error } = await supabase
        .from('ai_generated_modules' as any)
        .update({ rating })
        .eq('id', moduleId);

      if (error) throw error;
    },
    onSuccess: (_, { moduleId }) => {
      queryClient.invalidateQueries({ queryKey: ['ai-module', moduleId] });
      toast({
        title: "Rating Updated",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Could not update rating. Please try again.",
        variant: "destructive",
      });
    }
  });
};