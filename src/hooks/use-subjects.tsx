
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Subject = Tables<'subjects'>;

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async (): Promise<Subject[]> => {
      
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching subjects:', error);
        throw error;
      }
      
      
      return data || [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: ['subject', id],
    queryFn: async (): Promise<Subject> => {
      
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching subject:', error);
        throw error;
      }
      
      
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
