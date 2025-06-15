
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Module = Tables<'modules'>;

export const useModules = (subjectId?: string) => {
  return useQuery({
    queryKey: ['modules', subjectId],
    queryFn: async (): Promise<Module[]> => {
      console.log('Fetching modules for subject:', subjectId);
      let query = supabase
        .from('modules')
        .select('*')
        .order('order_index');
      
      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching modules:', error);
        throw error;
      }
      
      console.log('Fetched modules:', data);
      return data || [];
    },
    enabled: !!subjectId,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const useModule = (id: string) => {
  return useQuery({
    queryKey: ['module', id],
    queryFn: async (): Promise<Module> => {
      console.log('Fetching module:', id);
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching module:', error);
        throw error;
      }
      
      console.log('Fetched module:', data);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
