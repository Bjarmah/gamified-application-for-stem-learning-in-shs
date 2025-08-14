
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  biologyModules, 
  chemistryModules, 
  physicsModules, 
  mathematicsModules, 
  ictModules,
  getModulesBySubject 
} from '@/content';

interface Module {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  estimatedTime: number;
  xpReward: number;
  achievement: string;
  achievementDescription: string;
  content: any;
  gamification: any;
  ghanaContext: any;
  prerequisites: string[];
  nextModule: string | null;
  tags: string[];
}

// Map subject IDs to their local modules
const subjectModulesMap: Record<string, Module[]> = {
  'biology': biologyModules,
  'chemistry': chemistryModules,
  'physics': physicsModules,
  'mathematics': mathematicsModules,
  'ict': ictModules,
};

export const useModules = (subjectId: string | undefined) => {
  return useQuery({
    queryKey: ['modules', subjectId],
    queryFn: async (): Promise<Module[]> => {
      if (!subjectId) return [];

      try {
        // First try to get modules from local content
        const localModules = subjectModulesMap[subjectId];
        if (localModules && localModules.length > 0) {
          console.log(`Using local modules for ${subjectId}:`, localModules.length);
          return localModules;
        }

        // Fallback to database if local content not available
        console.warn(`No local modules found for ${subjectId}, trying database...`);
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .eq('subject_id', subjectId)
          .order('created_at');

        if (error) {
          console.error('Database fetch failed:', error);
          return [];
        }

        // Convert database modules to match local structure
        return (data || []).map(dbModule => ({
          id: dbModule.id,
          title: dbModule.title,
          description: dbModule.description || '',
          subject: dbModule.subject_id,
          level: dbModule.level || 'Intermediate',
          estimatedTime: dbModule.estimated_time || 60,
          xpReward: dbModule.xp_reward || 100,
          achievement: dbModule.achievement || 'Module Completion',
          achievementDescription: dbModule.achievement_description || 'Complete this module',
          content: dbModule.content || {},
          gamification: dbModule.gamification || {},
          ghanaContext: dbModule.ghana_context || {},
          prerequisites: dbModule.prerequisites || [],
          nextModule: dbModule.next_module || null,
          tags: dbModule.tags || []
        }));
      } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
      }
    },
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useModule = (moduleId: string | undefined) => {
  return useQuery({
    queryKey: ['module', moduleId],
    queryFn: async (): Promise<Module | null> => {
      if (!moduleId) return null;

      try {
        // First try to find in local content
        const allLocalModules = [
          ...biologyModules,
          ...chemistryModules,
          ...physicsModules,
          ...mathematicsModules,
          ...ictModules
        ];
        
        const localModule = allLocalModules.find(m => m.id === moduleId);
        if (localModule) {
          console.log(`Found local module: ${localModule.title}`);
          return localModule;
        }

        // Fallback to database
        console.warn(`Module ${moduleId} not found locally, trying database...`);
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .single();

        if (error) {
          console.error('Database fetch failed:', error);
          return null;
        }

        // Convert database module to match local structure
        return {
          id: data.id,
          title: data.title,
          description: data.description || '',
          subject: data.subject_id,
          level: data.level || 'Intermediate',
          estimatedTime: data.estimated_time || 60,
          xpReward: data.xp_reward || 100,
          achievement: data.achievement || 'Module Completion',
          achievementDescription: data.achievement_description || 'Complete this module',
          content: data.content || {},
          gamification: data.gamification || {},
          ghanaContext: data.ghana_context || {},
          prerequisites: data.prerequisites || [],
          nextModule: data.next_module || null,
          tags: data.tags || []
        };
      } catch (error) {
        console.error('Error fetching module:', error);
        return null;
      }
    },
    enabled: !!moduleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};
