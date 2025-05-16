
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { initNetworkListeners, initPeriodicSync } from '@/utils/syncService';
import { useToast } from '@/hooks/use-toast';

interface OfflineContextType {
  isOnline: boolean;
  isInitialized: boolean;
  lastSyncTime: Date | null;
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  isInitialized: false,
  lastSyncTime: null
});

export const useOfflineContext = () => useContext(OfflineContext);

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize network listeners
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're back online",
        description: "Your learning data will now sync with the server.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "You can continue learning. Data will sync when you're back online.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize sync services
    initNetworkListeners();
    initPeriodicSync(30); // Sync every 30 minutes

    setIsInitialized(true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const value = {
    isOnline,
    isInitialized,
    lastSyncTime
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

