import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AIModuleProgress {
  id: string;
  user_id: string;
  ai_module_id: string;
  progress_percentage: number;
  completed: boolean;
  time_spent: number;
  last_accessed: string;
  rating_given?: number;
}

export const useAIModuleProgress = (aiModuleId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-module-progress', user?.id, aiModuleId],
    queryFn: async (): Promise<AIModuleProgress | null> => {
      if (!user || !aiModuleId) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', aiModuleId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching AI module progress:', error);
        return null;
      }

      if (!data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        ai_module_id: data.module_id,
        progress_percentage: data.score || 0,
        completed: data.completed || false,
        time_spent: data.time_spent || 0,
        last_accessed: data.last_accessed || new Date().toISOString(),
        rating_given: undefined // This would come from a separate rating table
      };
    },
    enabled: !!user && !!aiModuleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useUpdateAIModuleProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      aiModuleId,
      progressPercentage,
      completed = false,
      timeSpent = 0
    }: {
      aiModuleId: string;
      progressPercentage: number;
      completed?: boolean;
      timeSpent?: number;
    }) => {
      if (!user) throw new Error('User must be authenticated');

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: aiModuleId,
          score: progressPercentage,
          completed,
          time_spent: timeSpent,
          last_accessed: new Date().toISOString()
        });

      if (error) throw error;

      // Award XP for AI module completion
      if (completed) {
        await supabase.rpc('award_xp', {
          user_uuid: user.id,
          xp_amount: 150, // Higher XP for AI modules
          xp_reason: 'AI Module Completion',
          ref_id: aiModuleId,
          ref_type: 'ai_module'
        });
      }
    },
    onSuccess: (_, { aiModuleId }) => {
      queryClient.invalidateQueries({ queryKey: ['ai-module-progress', user?.id, aiModuleId] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      
      toast({
        title: "Progress Updated",
        description: "Your learning progress has been saved.",
      });
    },
    onError: (error) => {
      console.error('Failed to update progress:', error);
      toast({
        title: "Update Failed",
        description: "Could not save progress. Please try again.",
        variant: "destructive",
      });
    }
  });
};