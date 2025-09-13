
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useAIModules, useGenerateAIContent } from './use-ai-modules';
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
  'Elective ICT': ictModules,
};

export const useModules = (subjectId: string | undefined) => {
  const { user } = useAuth();
  const { data: aiModules, isLoading: aiLoading } = useAIModules(subjectId);
  const { generateContent } = useGenerateAIContent();

  return useQuery({
    queryKey: ['modules', subjectId, user?.id],
    queryFn: async (): Promise<Module[]> => {
      if (!subjectId) return [];

      try {
        // First, get AI-generated modules (primary source)
        const { data: aiGeneratedModules, error: aiError } = await supabase
          .from('ai_generated_modules' as any)
          .select('*')
          .eq('subject_id', subjectId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (aiError) {
          console.error('Error fetching AI modules:', aiError);
        }

        const aiModulesList = (aiGeneratedModules || []).map((aiModule: any) => ({
          id: aiModule.id,
          title: aiModule.title,
          description: aiModule.description || '',
          subject: aiModule.subject_id,
          level: aiModule.difficulty_level || 'intermediate',
          estimatedTime: aiModule.estimated_duration || 30,
          xpReward: 150, // Higher XP for AI-generated content
          achievement: 'AI Module Master',
          achievementDescription: 'Complete AI-generated learning module',
          content: typeof aiModule.content === 'string' ? JSON.parse(aiModule.content) : aiModule.content,
          gamification: { isAIGenerated: true, rating: aiModule.rating },
          ghanaContext: { curriculum: 'Ghana SHS STEM' },
          prerequisites: aiModule.prerequisites || [],
          nextModule: null,
          tags: ['ai-generated', aiModule.difficulty_level]
        }));

        // Also get traditional database modules as fallback
        const { data: dbModules, error: dbError } = await supabase
          .from('modules')
          .select('*')
          .eq('subject_id', subjectId)
          .order('created_at');

        if (dbError) {
          console.error('Database fetch failed:', dbError);
        }

        const dbModulesList = (dbModules || []).map(dbModule => ({
          id: dbModule.id,
          title: dbModule.title,
          description: dbModule.description || '',
          subject: dbModule.subject_id,
          level: dbModule.difficulty_level || 'beginner',
          estimatedTime: dbModule.estimated_duration || 60,
          xpReward: 100,
          achievement: 'Module Completion',
          achievementDescription: 'Complete this module',
          content: dbModule.content || {},
          gamification: { isAIGenerated: false },
          ghanaContext: {},
          prerequisites: [],
          nextModule: null,
          tags: []
        }));

        // Combine AI modules with traditional modules, prioritizing AI
        const allModules = [...aiModulesList, ...dbModulesList];
        
        console.log(`Loaded ${aiModulesList.length} AI modules and ${dbModulesList.length} traditional modules for ${subjectId}`);
        
        return allModules;

      } catch (error) {
        console.error('Error fetching modules:', error);
        return [];
      }
    },
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 2, // 2 minutes (shorter for dynamic content)
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useModule = (moduleId: string | undefined) => {
  return useQuery({
    queryKey: ['module', moduleId],
    queryFn: async (): Promise<Module | null> => {
      if (!moduleId) return null;

      try {
        // First try AI-generated modules
        const { data: aiModule, error: aiError } = await supabase
          .from('ai_generated_modules' as any)
          .select('*')
          .eq('id', moduleId)
          .eq('is_active', true)
          .maybeSingle();

        const aiModuleData = aiModule as Record<string, any>;
        if (!aiError && aiModuleData && 'id' in aiModuleData && 'title' in aiModuleData) {
          console.log(`Found AI module: ${aiModuleData.title}`);
          return {
            id: aiModuleData.id,
            title: aiModuleData.title,
            description: aiModuleData.description || '',
            subject: aiModuleData.subject_id,
            level: aiModuleData.difficulty_level || 'intermediate',
            estimatedTime: aiModuleData.estimated_duration || 30,
            xpReward: 150,
            achievement: 'AI Module Master',
            achievementDescription: 'Complete AI-generated learning module',
            content: typeof aiModuleData.content === 'string' ? JSON.parse(aiModuleData.content) : aiModuleData.content,
            gamification: { isAIGenerated: true, rating: aiModuleData.rating },
            ghanaContext: { curriculum: 'Ghana SHS STEM' },
            prerequisites: aiModuleData.prerequisites || [],
            nextModule: null,
            tags: ['ai-generated', aiModuleData.difficulty_level]
          };
        }

        // Try local content
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

        // Fallback to traditional database
        const { data, error } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .maybeSingle();

        if (error || !data) {
          console.error('Module not found:', error);
          return null;
        }

        return {
          id: data.id,
          title: data.title,
          description: data.description || '',
          subject: data.subject_id,
          level: data.difficulty_level || 'beginner',
          estimatedTime: data.estimated_duration || 60,
          xpReward: 100,
          achievement: 'Module Completion',
          achievementDescription: 'Complete this module',
          content: data.content || {},
          gamification: { isAIGenerated: false },
          ghanaContext: {},
          prerequisites: [],
          nextModule: null,
          tags: []
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
