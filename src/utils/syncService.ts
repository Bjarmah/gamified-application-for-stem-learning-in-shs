
import {
  getSyncQueue,
  updateSyncQueueItem,
  removeSyncQueueItem,
  setLastSyncTime
} from './offlineStorage';
import { supabase } from '@/integrations/supabase/client';
import { TablesInsert } from '@/integrations/supabase/types';

type UserProgressInsert = TablesInsert<'user_progress'>;
type QuizAttemptInsert = TablesInsert<'quiz_attempts'>;

// Check if we're online
const isOnline = (): boolean => {
  return navigator.onLine;
};

// Register event listeners for online/offline events
export const initNetworkListeners = (): void => {
  window.addEventListener('online', () => {
    console.log('Network: Back online, syncing data...');
    syncData();
  });

  window.addEventListener('offline', () => {
    console.log('Network: Going offline, data will be queued for sync');
  });
};

// Process the sync queue with Supabase
export const syncData = async (): Promise<void> => {
  if (!isOnline()) {
    console.log('Sync: Skipping sync - offline');
    return;
  }

  const queue = await getSyncQueue();

  if (queue.length === 0) {
    console.log('Sync: No items to sync');
    await setLastSyncTime();
    return;
  }

  console.log(`Sync: Processing ${queue.length} items`);

  // Process each item in the queue
  for (const item of queue) {
    if (item.syncStatus === 'processing') continue;

    // Mark as processing
    await updateSyncQueueItem(item.id, { syncStatus: 'processing' });

    try {
      let success = false;

      switch (item.type) {
        case 'moduleProgress':
          success = await syncModuleProgress(item.data);
          break;
        case 'quizAttempt':
          success = await syncQuizAttempt(item.data);
          break;
        default:
          throw new Error(`Unknown sync item type: ${item.type}`);
      }

      if (success) {
        // Remove from queue on success
        await removeSyncQueueItem(item.id);
        console.log(`Sync: Successfully synced item ${item.id}`);
      } else {
        throw new Error('Sync operation failed');
      }

    } catch (error) {
      console.error(`Failed to sync item ${item.id}:`, error);

      // Mark as failed and increment retry count
      await updateSyncQueueItem(item.id, {
        syncStatus: 'failed',
        retryCount: (item.retryCount || 0) + 1
      });
    }
  }

  await setLastSyncTime();
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

// Initialize periodic sync
export const initPeriodicSync = (intervalMinutes: number = 15): void => {
  // Try an initial sync when app starts
  setTimeout(() => {
    if (isOnline()) {
      syncData();
    }
  }, 5000); // Wait 5 seconds after app load

  // Set up periodic sync
  setInterval(() => {
    if (isOnline()) {
      syncData();
    }
  }, intervalMinutes * 60 * 1000);
};

// Manual sync trigger for user-initiated sync
export const manualSync = async (): Promise<{
  success: boolean;
  syncedItems: number;
  message: string;
}> => {
  if (!isOnline()) {
    return {
      success: false,
      syncedItems: 0,
      message: 'Cannot sync while offline'
    };
  }

  const queueBefore = await getSyncQueue();
  const itemCount = queueBefore.length;

  if (itemCount === 0) {
    return {
      success: true,
      syncedItems: 0,
      message: 'Nothing to sync'
    };
  }

  await syncData();

  const queueAfter = await getSyncQueue();
  const syncedItems = itemCount - queueAfter.length;

  return {
    success: syncedItems > 0,
    syncedItems,
    message: syncedItems > 0
      ? `Successfully synced ${syncedItems} items`
      : 'Sync completed but no items were processed'
  };
};

// Get sync status
export const getSyncStatus = async () => {
  const queue = await getSyncQueue();
  const pendingItems = queue.filter(item => item.syncStatus === 'pending').length;
  const failedItems = queue.filter(item => item.syncStatus === 'failed').length;

  return {
    pendingItems,
    failedItems,
    totalItems: queue.length,
    isOnline: isOnline()
  };
};

