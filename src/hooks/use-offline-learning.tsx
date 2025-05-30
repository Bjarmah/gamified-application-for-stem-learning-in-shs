
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
}

export function useOfflineLearning() {
  const [offlineModules, setOfflineModules] = useState<OfflineModule[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online! 🌐",
        description: "Your progress will be synced automatically.",
      });
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

  const getStorageUsage = () => {
    return {
      used: offlineModules.length,
      total: 50 // Mock limit
    };
  };

  return {
    offlineModules,
    isOnline,
    downloadModule,
    removeModule,
    getStorageUsage
  };
}

// Add the missing useAdaptiveLearning hook
export function useAdaptiveLearning() {
  const getRecommendations = async (completedModules: string[], preferences: string[]) => {
    // Mock implementation for adaptive learning recommendations
    const mockModules = [
      {
        id: "mod1",
        title: "Introduction to Physics",
        description: "Learn the basics of physics including waves and motion",
        subject: "Physics",
        difficulty: "Beginner",
        type: "module",
        keywords: ["waves", "motion", "physics", "mechanics"]
      },
      {
        id: "mod2",
        title: "Algebra Fundamentals", 
        description: "Master algebra concepts",
        subject: "Mathematics",
        difficulty: "Intermediate",
        type: "module",
        keywords: ["algebra", "equations", "mathematics"]
      }
    ];
    
    const mockQuizzes = [
      {
        id: "quiz1",
        title: "Physics Quiz",
        description: "Test your knowledge about waves and particles",
        subject: "Physics", 
        difficulty: "Beginner",
        type: "quiz",
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
