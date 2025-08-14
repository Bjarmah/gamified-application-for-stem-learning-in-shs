
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getAllSubjects, getContentStats } from '@/content';

interface Subject {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

// Local subject definitions that match the database structure
const localSubjects: Subject[] = [
  {
    id: 'biology',
    name: 'Biology',
    description: 'Explore living organisms, their structure, function, and interactions with the environment.',
    color: 'bg-green-500'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Study matter, its properties, composition, and the changes it undergoes.',
    color: 'bg-blue-500'
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Understand the fundamental laws that govern the universe and energy.',
    color: 'bg-purple-500'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Master mathematical concepts, problem-solving, and logical thinking.',
    color: 'bg-orange-500'
  },
  {
    id: 'ict',
    name: 'Elective ICT',
    description: 'Learn information and communication technology skills.',
    color: 'bg-cyan-500'
  }
];

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async (): Promise<Subject[]> => {
      try {
        // Try to get subjects from database first
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .order('name');
        
        if (error) {
          console.warn('Database fetch failed, using local subjects:', error);
          return localSubjects;
        }
        
        // If database has subjects, use them
        if (data && data.length > 0) {
          return data;
        }
        
        // Fallback to local subjects
        return localSubjects;
      } catch (error) {
        console.warn('Error fetching subjects, using local fallback:', error);
        return localSubjects;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useSubject = (id: string) => {
  return useQuery({
    queryKey: ['subject', id],
    queryFn: async (): Promise<Subject> => {
      try {
        // Try database first
        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.warn('Database fetch failed, using local subject:', error);
          const localSubject = localSubjects.find(s => s.id === id);
          if (localSubject) return localSubject;
          throw new Error('Subject not found');
        }
        
        return data;
      } catch (error) {
        console.warn('Error fetching subject, using local fallback:', error);
        const localSubject = localSubjects.find(s => s.id === id);
        if (localSubject) return localSubject;
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
