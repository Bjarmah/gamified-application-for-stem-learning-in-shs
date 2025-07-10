
import { get, set, del, clear } from 'idb-keyval';

// Types for our stored content
export interface StoredModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  content: string; // HTML/markdown content
  lastUpdated: number; // timestamp
  version: number;
}

export interface StoredQuiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctOption: number;
    explanation?: string;
  }>;
  lastUpdated: number; // timestamp
  version: number;
}

export interface UserProgress {
  moduleProgress: Record<string, {
    lastAccessed: number;
    completed: boolean;
    timeSpent: number; // seconds
    visitCount: number;
  }>;
  quizAttempts: Record<string, Array<{
    timestamp: number;
    score: number;
    timeSpent: number; // seconds
    answersCorrect: number;
    totalQuestions: number;
    questionsData: Array<{
      questionId: string;
      correct: boolean;
      timeSpent: number; // seconds
    }>;
  }>>;
}

// Storage keys
const MODULES_STORE = 'offlineModules';
const QUIZZES_STORE = 'offlineQuizzes';
const USER_PROGRESS = 'userProgress';
const SYNC_QUEUE = 'syncQueue';
const LAST_SYNC = 'lastSync';

// Module operations
export const getStoredModules = async (): Promise<StoredModule[]> => {
  try {
    const modules = await get(MODULES_STORE) || [];
    return modules;
  } catch (error) {
    console.error('Failed to get stored modules:', error);
    return [];
  }
};

export const getModuleById = async (id: string): Promise<StoredModule | null> => {
  try {
    const modules = await getStoredModules();
    return modules.find(module => module.id === id) || null;
  } catch (error) {
    console.error(`Failed to get module ${id}:`, error);
    return null;
  }
};

export const storeModule = async (module: StoredModule): Promise<void> => {
  try {
    const modules = await getStoredModules();
    const existingIndex = modules.findIndex(m => m.id === module.id);
    
    if (existingIndex !== -1) {
      modules[existingIndex] = module;
    } else {
      modules.push(module);
    }
    
    await set(MODULES_STORE, modules);
    
  } catch (error) {
    console.error(`Failed to store module ${module.id}:`, error);
    throw error;
  }
};

// Quiz operations
export const getStoredQuizzes = async (): Promise<StoredQuiz[]> => {
  try {
    const quizzes = await get(QUIZZES_STORE) || [];
    return quizzes;
  } catch (error) {
    console.error('Failed to get stored quizzes:', error);
    return [];
  }
};

export const getQuizById = async (id: string): Promise<StoredQuiz | null> => {
  try {
    const quizzes = await getStoredQuizzes();
    return quizzes.find(quiz => quiz.id === id) || null;
  } catch (error) {
    console.error(`Failed to get quiz ${id}:`, error);
    return null;
  }
};

export const storeQuiz = async (quiz: StoredQuiz): Promise<void> => {
  try {
    const quizzes = await getStoredQuizzes();
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
    
    if (existingIndex !== -1) {
      quizzes[existingIndex] = quiz;
    } else {
      quizzes.push(quiz);
    }
    
    await set(QUIZZES_STORE, quizzes);
    
  } catch (error) {
    console.error(`Failed to store quiz ${quiz.id}:`, error);
    throw error;
  }
};

// User progress operations
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const progress = await get(USER_PROGRESS) || {
      moduleProgress: {},
      quizAttempts: {}
    };
    return progress;
  } catch (error) {
    console.error('Failed to get user progress:', error);
    return {
      moduleProgress: {},
      quizAttempts: {}
    };
  }
};

export const updateModuleProgress = async (
  moduleId: string, 
  data: { completed?: boolean; timeSpent?: number }
): Promise<void> => {
  try {
    const progress = await getUserProgress();
    
    if (!progress.moduleProgress[moduleId]) {
      progress.moduleProgress[moduleId] = {
        lastAccessed: Date.now(),
        completed: false,
        timeSpent: 0,
        visitCount: 1
      };
    } else {
      progress.moduleProgress[moduleId].lastAccessed = Date.now();
      progress.moduleProgress[moduleId].visitCount += 1;
    }
    
    if (data.completed !== undefined) {
      progress.moduleProgress[moduleId].completed = data.completed;
    }
    
    if (data.timeSpent !== undefined) {
      progress.moduleProgress[moduleId].timeSpent += data.timeSpent;
    }
    
    await set(USER_PROGRESS, progress);
    
    // Add to sync queue
    addToSyncQueue({
      type: 'moduleProgress',
      moduleId,
      data: progress.moduleProgress[moduleId]
    });
    
  } catch (error) {
    console.error(`Failed to update module progress for ${moduleId}:`, error);
  }
};

export const storeQuizAttempt = async (
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
): Promise<void> => {
  try {
    const progress = await getUserProgress();
    
    if (!progress.quizAttempts[quizId]) {
      progress.quizAttempts[quizId] = [];
    }
    
    const attempt = {
      timestamp: Date.now(),
      ...attemptData
    };
    
    progress.quizAttempts[quizId].push(attempt);
    await set(USER_PROGRESS, progress);
    
    // Add to sync queue
    addToSyncQueue({
      type: 'quizAttempt',
      quizId,
      data: attempt
    });
    
  } catch (error) {
    console.error(`Failed to store quiz attempt for ${quizId}:`, error);
  }
};

// Sync queue for background syncing
interface SyncQueueItem {
  id: string;
  timestamp: number;
  type: 'moduleProgress' | 'quizAttempt';
  moduleId?: string;
  quizId?: string;
  data: any;
  syncStatus: 'pending' | 'processing' | 'failed';
  retryCount: number;
}

export const getSyncQueue = async (): Promise<SyncQueueItem[]> => {
  try {
    return await get(SYNC_QUEUE) || [];
  } catch (error) {
    console.error('Failed to get sync queue:', error);
    return [];
  }
};

export const addToSyncQueue = async (item: Partial<SyncQueueItem>): Promise<void> => {
  try {
    const queue = await getSyncQueue();
    const newItem: SyncQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      syncStatus: 'pending',
      retryCount: 0,
      ...item
    } as SyncQueueItem;
    
    queue.push(newItem);
    await set(SYNC_QUEUE, queue);
  } catch (error) {
    console.error('Failed to add item to sync queue:', error);
  }
};

export const updateSyncQueueItem = async (id: string, updates: Partial<SyncQueueItem>): Promise<void> => {
  try {
    const queue = await getSyncQueue();
    const index = queue.findIndex(item => item.id === id);
    
    if (index !== -1) {
      queue[index] = { ...queue[index], ...updates };
      await set(SYNC_QUEUE, queue);
    }
  } catch (error) {
    console.error(`Failed to update sync queue item ${id}:`, error);
  }
};

export const removeSyncQueueItem = async (id: string): Promise<void> => {
  try {
    const queue = await getSyncQueue();
    const updatedQueue = queue.filter(item => item.id !== id);
    await set(SYNC_QUEUE, updatedQueue);
  } catch (error) {
    console.error(`Failed to remove sync queue item ${id}:`, error);
  }
};

// Network status helpers
export const setLastSyncTime = async (): Promise<void> => {
  await set(LAST_SYNC, Date.now());
};

export const getLastSyncTime = async (): Promise<number> => {
  return await get(LAST_SYNC) || 0;
};

// Clear storage (for logout or testing)
export const clearOfflineStorage = async (): Promise<void> => {
  try {
    await clear();
    
  } catch (error) {
    console.error('Failed to clear offline storage:', error);
  }
};

