
import {
  getSyncQueue,
  updateSyncQueueItem,
  removeSyncQueueItem,
  setLastSyncTime,
  getLastSyncTime
} from './offlineStorage';
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';

type UserProgressInsert = TablesInsert<'user_progress'>;
type QuizAttemptInsert = TablesInsert<'quiz_attempts'>;

// Sync configuration
const SYNC_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 5000,
  batchSize: 10,
  syncIntervalMs: 15 * 60 * 1000, // 15 minutes
  maxQueueAge: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

// Sync status tracking
let isSyncing = false;
let syncInterval: NodeJS.Timeout | null = null;

// Check if we're online
const isOnline = (): boolean => {
  return navigator.onLine;
};

// Enhanced error handling with exponential backoff
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = SYNC_CONFIG.maxRetries,
  baseDelay: number = SYNC_CONFIG.retryDelayMs
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Register event listeners for online/offline events
export const initNetworkListeners = (): void => {
  window.addEventListener('online', () => {
    console.log('Network: Back online, triggering sync...');
    triggerSync();
  });

  window.addEventListener('offline', () => {
    console.log('Network: Going offline, data will be queued for sync');
  });

  // Handle visibility change for background sync
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isOnline()) {
      console.log('App: Became visible, checking for sync...');
      triggerSync();
    }
  });
};

// Trigger sync with debouncing
const triggerSync = (() => {
  let syncTimeout: NodeJS.Timeout | null = null;

  return () => {
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(() => {
      syncData();
    }, 1000); // Debounce for 1 second
  };
})();

// Process the sync queue with Supabase
export const syncData = async (): Promise<void> => {
  if (isSyncing) {
    console.log('Sync: Already syncing, skipping...');
    return;
  }

  if (!isOnline()) {
    console.log('Sync: Skipping sync - offline');
    return;
  }

  isSyncing = true;

  try {
    const queue = await getSyncQueue();

    // Clean up old items
    const now = Date.now();
    const validQueue = queue.filter(item =>
      (now - item.timestamp) < SYNC_CONFIG.maxQueueAge
    );

    if (validQueue.length !== queue.length) {
      console.log(`Sync: Cleaned up ${queue.length - validQueue.length} old items`);
      // Remove old items from queue
      for (const item of queue) {
        if ((now - item.timestamp) >= SYNC_CONFIG.maxQueueAge) {
          await removeSyncQueueItem(item.id);
        }
      }
    }

    if (validQueue.length === 0) {
      console.log('Sync: No items to sync');
      await setLastSyncTime();
      return;
    }

    console.log(`Sync: Processing ${validQueue.length} items`);

    // Process items in batches
    const batches = [];
    for (let i = 0; i < validQueue.length; i += SYNC_CONFIG.batchSize) {
      batches.push(validQueue.slice(i, i + SYNC_CONFIG.batchSize));
    }

    let successCount = 0;
    let failureCount = 0;

    for (const batch of batches) {
      const batchPromises = batch.map(async (item) => {
        if (item.syncStatus === 'processing') return;

        // Mark as processing
        await updateSyncQueueItem(item.id, { syncStatus: 'processing' });

        try {
          let success = false;

          switch (item.type) {
            case 'moduleProgress':
              success = await retryWithBackoff(() => syncModuleProgress(item.data));
              break;
            case 'quizAttempt':
              success = await retryWithBackoff(() => syncQuizAttempt(item.data));
              break;
            default:
              throw new Error(`Unknown sync item type: ${item.type}`);
          }

          if (success) {
            // Remove from queue on success
            await removeSyncQueueItem(item.id);
            successCount++;
            console.log(`Sync: Successfully synced item ${item.id}`);
          } else {
            throw new Error('Sync operation failed');
          }

        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          failureCount++;

          // Mark as failed and increment retry count
          const newRetryCount = (item.retryCount || 0) + 1;
          await updateSyncQueueItem(item.id, {
            syncStatus: newRetryCount >= SYNC_CONFIG.maxRetries ? 'failed' : 'pending',
            retryCount: newRetryCount
          });
        }
      });

      // Wait for batch to complete
      await Promise.allSettled(batchPromises);
    }

    console.log(`Sync: Completed. Success: ${successCount}, Failures: ${failureCount}`);
    await setLastSyncTime();

  } catch (error) {
    console.error('Sync: Critical error during sync:', error);
  } finally {
    isSyncing = false;
  }
};

// Sync module progress to Supabase
const syncModuleProgress = async (data: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: data.user_id,
        module_id: data.module_id,
        score: data.score || 0,
        completed: data.completed || false,
        time_spent: data.time_spent || 0,
        last_accessed: data.last_accessed || new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id'
      });

    if (error) {
      console.error('Supabase sync error (module progress):', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error syncing module progress:', error);
    return false;
  }
};

// Sync quiz attempt to Supabase
const syncQuizAttempt = async (data: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: data.user_id,
        quiz_id: data.quiz_id,
        answers: data.answers,
        score: data.score,
        correct_answers: data.correct_answers,
        total_questions: data.total_questions,
        time_spent: data.time_spent,
        completed_at: data.completed_at || new Date().toISOString()
      });

    if (error) {
      console.error('Supabase sync error (quiz attempt):', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error syncing quiz attempt:', error);
    return false;
  }
};

// Initialize periodic sync with enhanced background sync
export const initPeriodicSync = (intervalMinutes: number = 15): void => {
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  // Try an initial sync when app starts
  setTimeout(async () => {
    if (isOnline()) {
      const lastSync = await getLastSyncTime();
      const now = Date.now();

      // Only sync if it's been more than 5 minutes since last sync
      if (now - lastSync > 5 * 60 * 1000) {
        console.log('Sync: Initial sync on app start');
        syncData();
      }
    }
  }, 5000); // Wait 5 seconds after app load

  // Set up periodic sync
  syncInterval = setInterval(() => {
    if (isOnline() && !document.hidden) {
      console.log('Sync: Periodic background sync');
      syncData();
    }
  }, intervalMinutes * 60 * 1000);

  // Set up service worker for background sync (if available)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      // Register for background sync if available
      if ('sync' in registration) {
        (registration as any).sync.register('background-sync').catch((error: any) => {
          console.log('Background sync registration failed:', error);
        });
      }
    });
  }
};

// Stop periodic sync
export const stopPeriodicSync = (): void => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
};

// Manual sync trigger for user-initiated sync
export const manualSync = async (): Promise<{
  success: boolean;
  syncedItems: number;
  message: string;
  details?: {
    pendingItems: number;
    failedItems: number;
    lastSyncTime: number;
  };
}> => {
  if (!isOnline()) {
    return {
      success: false,
      syncedItems: 0,
      message: 'Cannot sync while offline'
    };
  }

  if (isSyncing) {
    return {
      success: false,
      syncedItems: 0,
      message: 'Sync already in progress'
    };
  }

  const queueBefore = await getSyncQueue();
  const itemCount = queueBefore.length;
  const lastSyncTime = await getLastSyncTime();

  if (itemCount === 0) {
    return {
      success: true,
      syncedItems: 0,
      message: 'Nothing to sync',
      details: {
        pendingItems: 0,
        failedItems: 0,
        lastSyncTime
      }
    };
  }

  const pendingItems = queueBefore.filter(item => item.syncStatus === 'pending').length;
  const failedItems = queueBefore.filter(item => item.syncStatus === 'failed').length;

  await syncData();

  const queueAfter = await getSyncQueue();
  const syncedItems = itemCount - queueAfter.length;

  return {
    success: syncedItems > 0,
    syncedItems,
    message: syncedItems > 0
      ? `Successfully synced ${syncedItems} items`
      : 'Sync completed but no items were processed',
    details: {
      pendingItems,
      failedItems,
      lastSyncTime
    }
  };
};

// Get sync status with enhanced details
export const getSyncStatus = async () => {
  const queue = await getSyncQueue();
  const pendingItems = queue.filter(item => item.syncStatus === 'pending').length;
  const failedItems = queue.filter(item => item.syncStatus === 'failed').length;
  const processingItems = queue.filter(item => item.syncStatus === 'processing').length;
  const lastSyncTime = await getLastSyncTime();

  // Calculate sync health
  const totalItems = queue.length;
  const successRate = totalItems > 0 ? ((totalItems - failedItems) / totalItems) * 100 : 100;

  let healthStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
  if (failedItems > 0 && failedItems >= totalItems * 0.5) {
    healthStatus = 'critical';
  } else if (failedItems > 0 || pendingItems > 10) {
    healthStatus = 'warning';
  }

  return {
    pendingItems,
    failedItems,
    processingItems,
    totalItems,
    isOnline: isOnline(),
    isSyncing,
    lastSyncTime,
    successRate: Math.round(successRate),
    healthStatus,
    lastSyncAge: Date.now() - lastSyncTime
  };
};

// Utility functions for sync management
export const clearFailedItems = async (): Promise<number> => {
  const queue = await getSyncQueue();
  const failedItems = queue.filter(item => item.syncStatus === 'failed');

  for (const item of failedItems) {
    await removeSyncQueueItem(item.id);
  }

  return failedItems.length;
};

export const retryFailedItems = async (): Promise<number> => {
  const queue = await getSyncQueue();
  const failedItems = queue.filter(item => item.syncStatus === 'failed');

  for (const item of failedItems) {
    await updateSyncQueueItem(item.id, {
      syncStatus: 'pending',
      retryCount: 0
    });
  }

  return failedItems.length;
};

export const forceSync = async (): Promise<void> => {
  // Force sync even if already syncing
  const originalIsSyncing = isSyncing;
  isSyncing = false;
  await syncData();
  isSyncing = originalIsSyncing;
};

