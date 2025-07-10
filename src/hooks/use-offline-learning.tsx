
import { useState, useEffect } from 'react';
import { get, set, del, keys } from 'idb-keyval';
import { useToast } from "@/hooks/use-toast";

interface OfflineModule {
  id: string;
  title: string;
  content: string;
  subject: string;
  downloadedAt: string;
  lastAccessed?: string;
  gameData?: any; // Store game-specific data
}

interface OfflineProgress {
  moduleId: string;
  score: number;
  completed: boolean;
  timeSpent: number;
  lastUpdated: string;
  synced: boolean;
}

export function useOfflineLearning() {
  const [offlineModules, setOfflineModules] = useState<OfflineModule[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online! 🌐",
        description: "Syncing your progress...",
      });
      syncOfflineProgress();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline 📱",
        description: "You can still access downloaded content.",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadOfflineModules();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineModules = async () => {
    try {
      const moduleKeys = await keys();
      const modules: OfflineModule[] = [];
      
      for (const key of moduleKeys) {
        if (typeof key === 'string' && key.startsWith('module_')) {
          const module = await get(key);
          if (module) modules.push(module);
        }
      }
      
      setOfflineModules(modules);
    } catch (error) {
      console.error('Failed to load offline modules:', error);
    }
  };

  const downloadModule = async (module: Omit<OfflineModule, 'downloadedAt'>) => {
    try {
      const offlineModule: OfflineModule = {
        ...module,
        downloadedAt: new Date().toISOString()
      };
      
      await set(`module_${module.id}`, offlineModule);
      setOfflineModules(prev => [...prev, offlineModule]);
      
      toast({
        title: "Module downloaded! 📥",
        description: `${module.title} is now available offline.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Unable to download module for offline use.",
        variant: "destructive"
      });
    }
  };

  const removeModule = async (moduleId: string) => {
    try {
      await del(`module_${moduleId}`);
      setOfflineModules(prev => prev.filter(m => m.id !== moduleId));
      
      toast({
        title: "Module removed",
        description: "Module has been removed from offline storage.",
      });
    } catch (error) {
      console.error('Failed to remove module:', error);
    }
  };

  const saveOfflineProgress = async (moduleId: string, progressData: Omit<OfflineProgress, 'moduleId' | 'lastUpdated' | 'synced'>) => {
    try {
      const progress: OfflineProgress = {
        moduleId,
        ...progressData,
        lastUpdated: new Date().toISOString(),
        synced: false
      };
      
      await set(`progress_${moduleId}`, progress);
      
      
      // Try to sync immediately if online
      if (navigator.onLine) {
        syncOfflineProgress();
      }
    } catch (error) {
      console.error('Failed to save offline progress:', error);
    }
  };

  const syncOfflineProgress = async () => {
    if (!navigator.onLine) return;
    
    setSyncStatus('syncing');
    
    try {
      const progressKeys = await keys();
      const unsyncedProgress = [];
      
      for (const key of progressKeys) {
        if (typeof key === 'string' && key.startsWith('progress_')) {
          const progress = await get(key);
          if (progress && !progress.synced) {
            unsyncedProgress.push(progress);
          }
        }
      }
      
      // Sync each unsynced progress entry
      for (const progress of unsyncedProgress) {
        try {
          // This would normally sync to your backend
          // For now, just mark as synced
          await set(`progress_${progress.moduleId}`, {
            ...progress,
            synced: true
          });
          
        } catch (error) {
          console.error('Failed to sync progress for module:', progress.moduleId, error);
        }
      }
      
      setSyncStatus('idle');
      
      if (unsyncedProgress.length > 0) {
        toast({
          title: "Progress synced! ✅",
          description: `${unsyncedProgress.length} items synced successfully.`,
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      toast({
        title: "Sync failed",
        description: "Failed to sync offline progress. Will retry later.",
        variant: "destructive"
      });
    }
  };

  const getStorageUsage = () => {
    return {
      used: offlineModules.length,
      total: 50 // Mock limit
    };
  };

  const clearOfflineData = async () => {
    try {
      const allKeys = await keys();
      const keysToDelete = allKeys.filter(key => 
        typeof key === 'string' && (key.startsWith('module_') || key.startsWith('progress_'))
      );
      
      for (const key of keysToDelete) {
        await del(key);
      }
      
      setOfflineModules([]);
      toast({
        title: "Offline data cleared",
        description: "All offline content has been removed.",
      });
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  };

  return {
    offlineModules,
    isOnline,
    syncStatus,
    downloadModule,
    removeModule,
    saveOfflineProgress,
    syncOfflineProgress,
    clearOfflineData,
    getStorageUsage
  };
}

// Base interface for all content items
interface BaseContentItem {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  type: string;
  duration: string;
  keywords: string[];
}

// Module-specific interface
interface ModuleItem extends BaseContentItem {
  type: "module";
  isCompleted: boolean;
  hasQuiz: boolean;
}

// Quiz-specific interface
interface QuizItem extends BaseContentItem {
  type: "quiz";
  questions: { id: string; text: string; }[];
}

// Union type for all content
type ContentItem = ModuleItem | QuizItem;

export function useAdaptiveLearning() {
  const getRecommendations = async (completedModules: string[], preferences: string[]) => {
    // Mock implementation for adaptive learning recommendations with consistent data structure
    const mockModules: ModuleItem[] = [
      {
        id: "mod1",
        title: "Introduction to Physics",
        description: "Learn the basics of physics including waves and motion",
        subject: "Physics",
        difficulty: "Beginner",
        type: "module",
        duration: "30 minutes",
        isCompleted: false,
        hasQuiz: true,
        keywords: ["waves", "motion", "physics", "mechanics"]
      },
      {
        id: "mod2",
        title: "Algebra Fundamentals", 
        description: "Master algebra concepts",
        subject: "Mathematics",
        difficulty: "Intermediate",
        type: "module",
        duration: "45 minutes",
        isCompleted: false,
        hasQuiz: true,
        keywords: ["algebra", "equations", "mathematics"]
      }
    ];
    
    const mockQuizzes: QuizItem[] = [
      {
        id: "quiz1",
        title: "Physics Quiz",
        description: "Test your knowledge about waves and particles",
        subject: "Physics", 
        difficulty: "Beginner",
        type: "quiz",
        duration: "15 minutes",
        questions: [
          { id: "q1", text: "What is the speed of light?" },
          { id: "q2", text: "Define frequency in wave physics" }
        ],
        keywords: ["waves", "particles", "physics", "test"]
      }
    ];
    
    return {
      modules: mockModules,
      quizzes: mockQuizzes
    };
  };

  return {
    getRecommendations
  };
}
