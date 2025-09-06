import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { get, set, del, keys } from 'idb-keyval';

interface PendingAction {
  id: string;
  type: 'quiz_attempt' | 'user_progress' | 'gamification_update';
  data: any;
  timestamp: number;
  retryCount: number;
}

interface OfflineSyncState {
  isOnline: boolean;
  pendingActions: PendingAction[];
  isSyncing: boolean;
  lastSyncTime: Date | null;
}

export const useOfflineSync = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OfflineSyncState>({
    isOnline: navigator.onLine,
    pendingActions: [],
    isSyncing: false,
    lastSyncTime: null
  });

  // Load pending actions from IndexedDB
  const loadPendingActions = useCallback(async () => {
    if (!user) return;
    
    try {
      const pending = await get(`pending_actions_${user.id}`) || [];
      setState(prev => ({ ...prev, pendingActions: pending }));
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }, [user]);

  // Save pending actions to IndexedDB
  const savePendingActions = useCallback(async (actions: PendingAction[]) => {
    if (!user) return;
    
    try {
      await set(`pending_actions_${user.id}`, actions);
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }, [user]);

  // Add action to pending queue
  const addPendingAction = useCallback(async (
    type: PendingAction['type'],
    data: any
  ) => {
    const action: PendingAction = {
      id: `${type}_${Date.now()}_${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    const newActions = [...state.pendingActions, action];
    setState(prev => ({ ...prev, pendingActions: newActions }));
    await savePendingActions(newActions);

    // Try to sync immediately if online
    if (state.isOnline) {
      syncPendingActions();
    }
  }, [state.pendingActions, state.isOnline, savePendingActions]);

  // Sync pending actions with server
  const syncPendingActions = useCallback(async () => {
    if (!user || !state.isOnline || state.isSyncing || state.pendingActions.length === 0) {
      return;
    }

    setState(prev => ({ ...prev, isSyncing: true }));

    const successfulActions: string[] = [];
    const failedActions: PendingAction[] = [];

    for (const action of state.pendingActions) {
      try {
        let success = false;

        switch (action.type) {
          case 'quiz_attempt':
            const { error: quizError } = await supabase
              .from('quiz_attempts')
              .insert(action.data);
            success = !quizError;
            break;

          case 'user_progress':
            const { error: progressError } = await supabase
              .from('user_progress')
              .upsert(action.data);
            success = !progressError;
            break;

          case 'gamification_update':
            const { error: gamificationError } = await supabase
              .from('user_gamification')
              .upsert(action.data);
            success = !gamificationError;
            break;
        }

        if (success) {
          successfulActions.push(action.id);
        } else {
          failedActions.push({
            ...action,
            retryCount: action.retryCount + 1
          });
        }
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        failedActions.push({
          ...action,
          retryCount: action.retryCount + 1
        });
      }
    }

    // Remove failed actions that have exceeded retry limit
    const remainingActions = failedActions.filter(action => action.retryCount < 3);
    
    setState(prev => ({
      ...prev,
      pendingActions: remainingActions,
      isSyncing: false,
      lastSyncTime: new Date()
    }));

    await savePendingActions(remainingActions);

    console.log(`Sync completed: ${successfulActions.length} successful, ${remainingActions.length} remaining`);
  }, [user, state.isOnline, state.isSyncing, state.pendingActions, savePendingActions]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      syncPendingActions();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingActions]);

  // Load pending actions on mount
  useEffect(() => {
    loadPendingActions();
  }, [loadPendingActions]);

  // Listen for service worker sync events
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_PENDING_DATA') {
        syncPendingActions();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [syncPendingActions]);

  // Store data offline
  const storeOfflineData = useCallback(async (key: string, data: any) => {
    try {
      await set(`offline_${user?.id}_${key}`, data);
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }, [user]);

  // Retrieve offline data
  const getOfflineData = useCallback(async (key: string) => {
    try {
      return await get(`offline_${user?.id}_${key}`);
    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
      return null;
    }
  }, [user]);

  // Clear offline data
  const clearOfflineData = useCallback(async (key: string) => {
    try {
      await del(`offline_${user?.id}_${key}`);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }, [user]);

  return {
    ...state,
    addPendingAction,
    syncPendingActions,
    storeOfflineData,
    getOfflineData,
    clearOfflineData
  };
};