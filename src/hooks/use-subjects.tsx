import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Subject {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

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
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching subject:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Subject not found');
      }
      
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};