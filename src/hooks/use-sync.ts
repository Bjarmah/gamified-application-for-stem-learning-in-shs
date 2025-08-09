import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    initNetworkListeners,
    initPeriodicSync,
    stopPeriodicSync,
    manualSync,
    getSyncStatus,
    clearFailedItems,
    retryFailedItems,
    forceSync
} from '@/utils/syncService';

export interface SyncStatus {
    pendingItems: number;
    failedItems: number;
    processingItems: number;
    totalItems: number;
    isOnline: boolean;
    isSyncing: boolean;
    lastSyncTime: number;
    successRate: number;
    healthStatus: 'healthy' | 'warning' | 'critical';
    lastSyncAge: number;
}

export const useSync = () => {
    const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const { toast } = useToast();

    // Initialize sync system
    const initializeSync = useCallback(() => {
        if (isInitialized) return;

        try {
            initNetworkListeners();
            initPeriodicSync();
            setIsInitialized(true);
            console.log('Sync: System initialized');
        } catch (error) {
            console.error('Failed to initialize sync:', error);
            toast({
                title: "Sync Error",
                description: "Failed to initialize offline sync",
                variant: "destructive"
            });
        }
    }, [isInitialized, toast]);

    // Update sync status
    const updateSyncStatus = useCallback(async () => {
        try {
            const status = await getSyncStatus();
            setSyncStatus(status);
        } catch (error) {
            console.error('Failed to get sync status:', error);
        }
    }, []);

    // Manual sync with user feedback
    const performManualSync = useCallback(async () => {
        try {
            const result = await manualSync();

            if (result.success) {
                toast({
                    title: "Sync Successful",
                    description: result.message,
                });
            } else {
                toast({
                    title: "Sync Failed",
                    description: result.message,
                    variant: "destructive"
                });
            }

            await updateSyncStatus();
            return result;
        } catch (error) {
            console.error('Manual sync failed:', error);
            toast({
                title: "Sync Error",
                description: "An unexpected error occurred during sync",
                variant: "destructive"
            });
            throw error;
        }
    }, [toast, updateSyncStatus]);

    // Clear failed items
    const clearFailed = useCallback(async () => {
        try {
            const clearedCount = await clearFailedItems();
            await updateSyncStatus();

            if (clearedCount > 0) {
                toast({
                    title: "Cleared Failed Items",
                    description: `Removed ${clearedCount} failed sync items`,
                });
            }

            return clearedCount;
        } catch (error) {
            console.error('Failed to clear failed items:', error);
            toast({
                title: "Error",
                description: "Failed to clear failed items",
                variant: "destructive"
            });
            throw error;
        }
    }, [toast, updateSyncStatus]);

    // Retry failed items
    const retryFailed = useCallback(async () => {
        try {
            const retryCount = await retryFailedItems();
            await updateSyncStatus();

            if (retryCount > 0) {
                toast({
                    title: "Retrying Failed Items",
                    description: `Queued ${retryCount} items for retry`,
                });

                // Trigger sync after retrying
                setTimeout(() => {
                    performManualSync();
                }, 1000);
            }

            return retryCount;
        } catch (error) {
            console.error('Failed to retry failed items:', error);
            toast({
                title: "Error",
                description: "Failed to retry failed items",
                variant: "destructive"
            });
            throw error;
        }
    }, [toast, updateSyncStatus, performManualSync]);

    // Force sync
    const performForceSync = useCallback(async () => {
        try {
            await forceSync();
            await updateSyncStatus();

            toast({
                title: "Force Sync Complete",
                description: "Forced sync operation completed",
            });
        } catch (error) {
            console.error('Force sync failed:', error);
            toast({
                title: "Force Sync Error",
                description: "Failed to perform force sync",
                variant: "destructive"
            });
            throw error;
        }
    }, [toast, updateSyncStatus]);

    // Initialize on mount
    useEffect(() => {
        initializeSync();

        // Set up status polling
        const statusInterval = setInterval(updateSyncStatus, 5000);

        // Initial status update
        updateSyncStatus();

        return () => {
            clearInterval(statusInterval);
            stopPeriodicSync();
        };
    }, [initializeSync, updateSyncStatus]);

    // Auto-sync when coming back online
    useEffect(() => {
        if (syncStatus?.isOnline && !syncStatus.isSyncing && syncStatus.pendingItems > 0) {
            const timeout = setTimeout(() => {
                performManualSync();
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [syncStatus?.isOnline, syncStatus?.isSyncing, syncStatus?.pendingItems, performManualSync]);

    return {
        syncStatus,
        isInitialized,
        performManualSync,
        clearFailed,
        retryFailed,
        performForceSync,
        updateSyncStatus
    };
};
