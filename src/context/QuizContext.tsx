import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Module completion threshold - user needs 70% to complete a module
const MODULE_COMPLETION_THRESHOLD = 70;

interface QuizContextType {
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
  quizTitle?: string;
  setQuizTitle: (title: string | undefined) => void;
  currentModuleId?: string;
  setCurrentModuleId: (moduleId: string | undefined) => void;
  markModuleCompleted: (moduleId: string, score: number, updateGamification?: () => Promise<void>) => Promise<void>;
  isModuleCompleted: (moduleId: string) => Promise<boolean>;
  isScoreSufficientForCompletion: (score: number) => boolean;
  MODULE_COMPLETION_THRESHOLD: number;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizTitle, setQuizTitle] = useState<string | undefined>();
  const [currentModuleId, setCurrentModuleId] = useState<string | undefined>();

  const markModuleCompleted = async (moduleId: string, score: number, updateGamification?: () => Promise<void>) => {
    try {
      // Get the current user from the auth context
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No user found when trying to mark module as completed');
        return;
      }

      // Check if module is already completed
      const isCompleted = await isModuleCompleted(moduleId);
      if (isCompleted) {
        console.log(`Module ${moduleId} is already completed for user ${user.id}`);
        return;
      }

      // Update user progress to mark module as completed
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          completed: true,
          score: score,
          last_accessed: new Date().toISOString(),
        });

      if (error) {
        console.error('Error updating user progress:', error);
        throw error;
      }

      // Update gamification data if the function is provided
      if (updateGamification) {
        await updateGamification();
      }

      console.log(`Module ${moduleId} marked as completed for user ${user.id} with score ${score}%`);
    } catch (error) {
      console.error('Error in markModuleCompleted:', error);
      throw error;
    }
  };

  const isModuleCompleted = async (moduleId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .eq('completed', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking module completion status:', error);
        return false;
      }

      return !!data?.completed;
    } catch (error) {
      console.error('Error in isModuleCompleted:', error);
      return false;
    }
  };

  const isScoreSufficientForCompletion = (score: number): boolean => {
    return score >= MODULE_COMPLETION_THRESHOLD;
  };

  const value = {
    isQuizActive,
    setIsQuizActive,
    quizTitle,
    setQuizTitle,
    currentModuleId,
    setCurrentModuleId,
    markModuleCompleted,
    isModuleCompleted,
    isScoreSufficientForCompletion,
    MODULE_COMPLETION_THRESHOLD,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};