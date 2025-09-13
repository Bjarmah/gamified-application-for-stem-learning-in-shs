import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface AIContentMetrics {
  totalAIModules: number;
  completedAIModules: number;
  averageRating: number;
  totalTimeSpentOnAI: number;
  favoriteAITopics: string[];
  recentGenerations: number;
  difficultyBreakdown: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
}

export const useAIContentMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-content-metrics', user?.id],
    queryFn: async (): Promise<AIContentMetrics> => {
      if (!user) {
        return {
          totalAIModules: 0,
          completedAIModules: 0,
          averageRating: 0,
          totalTimeSpentOnAI: 0,
          favoriteAITopics: [],
          recentGenerations: 0,
          difficultyBreakdown: { beginner: 0, intermediate: 0, advanced: 0 }
        };
      }

      try {
        // Get all AI modules created for this user
        const { data: aiModules, error: modulesError } = await supabase
          .from('ai_generated_modules' as any)
          .select('*')
          .or(`target_user_id.eq.${user.id},target_user_id.is.null`)
          .eq('is_active', true);

        if (modulesError) {
          console.error('Error fetching AI modules:', modulesError);
        }

        // Get user progress on AI modules
        const aiModuleIds = (aiModules || []).map((m: any) => m?.id).filter(Boolean);
        const { data: aiProgress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('module_id', aiModuleIds);

        if (progressError) {
          console.error('Error fetching AI progress:', progressError);
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { data: recentGenerations, error: generationsError } = await supabase
          .from('content_generation_requests' as any)
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', oneWeekAgo.toISOString());

        if (generationsError) {
          console.error('Error fetching generations:', generationsError);
        }

        const modules = (aiModules || []).filter((m: any) => m && typeof m === 'object' && m.id);
        const progress = aiProgress || [];
        const generations = recentGenerations || [];

        // Calculate metrics
        const completedModules = progress.filter(p => p.completed).length;
        const ratings = modules.filter((m: any) => m.rating && m.rating > 0).map((m: any) => m.rating);
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
          : 0;

        // Calculate difficulty breakdown
        const difficultyBreakdown = modules.reduce((acc: any, module: any) => {
          const level = module.difficulty_level || 'intermediate';
          acc[level] = (acc[level] || 0) + 1;
          return acc;
        }, { beginner: 0, intermediate: 0, advanced: 0 });

        // Extract favorite topics from generation requests
        const topicCounts = generations.reduce((acc: Record<string, number>, gen: any) => {
          if (gen.topic) {
            acc[gen.topic] = (acc[gen.topic] || 0) + 1;
          }
          return acc;
        }, {});

        const favoriteAITopics = Object.entries(topicCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([topic]) => topic);

        // Calculate total time spent (rough estimate based on module durations)
        const totalTimeSpentOnAI = progress.reduce((total, p) => {
          const module = modules.find((m: any) => m && typeof m === 'object' && m.id === p.module_id);
          if (!module || typeof module !== 'object') {
            return total + (p.time_spent || 1800); // 30 mins default
          }
          
          const duration = (module as any).estimated_duration || 30;
          return total + (p.time_spent || (duration * 60));
        }, 0);

        return {
          totalAIModules: modules.length,
          completedAIModules: completedModules,
          averageRating: Number(averageRating.toFixed(1)),
          totalTimeSpentOnAI,
          favoriteAITopics,
          recentGenerations: generations.length,
          difficultyBreakdown
        };

      } catch (error) {
        console.error('Error fetching AI content metrics:', error);
        return {
          totalAIModules: 0,
          completedAIModules: 0,
          averageRating: 0,
          totalTimeSpentOnAI: 0,
          favoriteAITopics: [],
          recentGenerations: 0,
          difficultyBreakdown: { beginner: 0, intermediate: 0, advanced: 0 }
        };
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useAIGenerationHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-generation-history', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('content_generation_requests' as any)
        .select(`
          *,
          ai_generated_modules!generated_module_id(
            id,
            title,
            rating,
            usage_count
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching generation history:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};