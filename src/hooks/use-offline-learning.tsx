
import { useState, useEffect, useCallback } from 'react';
import { 
  getStoredModules,
  getModuleById,
  storeModule,
  getStoredQuizzes,
  getQuizById,
  storeQuiz,
  updateModuleProgress,
  storeQuizAttempt,
  StoredModule,
  StoredQuiz
} from '@/utils/offlineStorage';
import { generateLearningProfile, getRecommendedModules, getRecommendedQuizzes } from '@/utils/adaptiveLearning';
import { manualSync } from '@/utils/syncService';

// Hook for working with offline modules
export const useOfflineModules = (subjectId?: string) => {
  const [modules, setModules] = useState<StoredModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadModules = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedModules = await getStoredModules();
      
      // Filter by subject if provided
      const filteredModules = subjectId 
        ? storedModules.filter(m => m.subject === subjectId) 
        : storedModules;
        
      setModules(filteredModules);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load modules'));
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  const saveModule = async (module: StoredModule) => {
    try {
      await storeModule(module);
      await loadModules(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to save module ${module.id}`));
      return false;
    }
  };

  const getModule = async (moduleId: string) => {
    try {
      return await getModuleById(moduleId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get module ${moduleId}`));
      return null;
    }
  };

  const markModuleProgress = async (
    moduleId: string, 
    data: { completed?: boolean; timeSpent?: number }
  ) => {
    try {
      await updateModuleProgress(moduleId, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update module progress for ${moduleId}`));
      return false;
    }
  };

  return {
    modules,
    isLoading,
    error,
    saveModule,
    getModule,
    markModuleProgress,
    refresh: loadModules
  };
};

// Hook for working with offline quizzes
export const useOfflineQuizzes = (subjectId?: string) => {
  const [quizzes, setQuizzes] = useState<StoredQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadQuizzes = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedQuizzes = await getStoredQuizzes();
      
      // Filter by subject if provided
      const filteredQuizzes = subjectId 
        ? storedQuizzes.filter(q => q.subject === subjectId) 
        : storedQuizzes;
        
      setQuizzes(filteredQuizzes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load quizzes'));
    } finally {
      setIsLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const saveQuiz = async (quiz: StoredQuiz) => {
    try {
      await storeQuiz(quiz);
      await loadQuizzes(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to save quiz ${quiz.id}`));
      return false;
    }
  };

  const getQuiz = async (quizId: string) => {
    try {
      return await getQuizById(quizId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get quiz ${quizId}`));
      return null;
    }
  };

  const recordQuizAttempt = async (
    quizId: string,
    attemptData: {
      score: number;
      timeSpent: number;
      answersCorrect: number;
      totalQuestions: number;
      questionsData: Array<{
        questionId: string;
        correct: boolean;
        timeSpent: number;
      }>;
    }
  ) => {
    try {
      await storeQuizAttempt(quizId, attemptData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to store quiz attempt for ${quizId}`));
      return false;
    }
  };

  return {
    quizzes,
    isLoading,
    error,
    saveQuiz,
    getQuiz,
    recordQuizAttempt,
    refresh: loadQuizzes
  };
};

// Hook for the adaptive learning features
export const useAdaptiveLearning = () => {
  const [learningProfile, setLearningProfile] = useState<Awaited<ReturnType<typeof generateLearningProfile>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await generateLearningProfile();
      setLearningProfile(profile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate learning profile'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const getRecommendations = async (allModules: any[], allQuizzes: any[]) => {
    try {
      const recommendedModules = await getRecommendedModules(allModules);
      const recommendedQuizzes = await getRecommendedQuizzes(allQuizzes);
      
      return {
        modules: recommendedModules,
        quizzes: recommendedQuizzes
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get recommendations'));
      return { modules: [], quizzes: [] };
    }
  };

  return {
    learningProfile,
    isLoading,
    error,
    getRecommendations,
    refreshProfile: loadProfile
  };
};

// Hook for sync management
export const useSyncManager = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: boolean;
    syncedItems: number;
    message: string;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const triggerSync = async () => {
    try {
      setIsSyncing(true);
      const result = await manualSync();
      setLastSyncResult(result);
      return result;
    } catch (err) {
      const syncError = err instanceof Error ? err : new Error('Failed to sync data');
      setError(syncError);
      return {
        success: false,
        syncedItems: 0,
        message: syncError.message
      };
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    lastSyncResult,
    error,
    triggerSync
  };
};

