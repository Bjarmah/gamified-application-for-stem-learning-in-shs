
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

type UserProgress = Tables<'user_progress'>;
type UserProgressInsert = TablesInsert<'user_progress'>;

export const useUserProgress = (moduleId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-progress', user?.id, moduleId],
    queryFn: async (): Promise<UserProgress[]> => {
      if (!user) return [];
      
      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (progress: Omit<UserProgressInsert, 'user_id'>) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          ...progress,
          user_id: user.id,
          last_accessed: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      toast({
        title: "Progress saved",
        description: "Your learning progress has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
