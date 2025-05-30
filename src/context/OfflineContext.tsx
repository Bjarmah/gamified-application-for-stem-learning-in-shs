
import React, { createContext, useContext, ReactNode } from 'react';
import { useOfflineLearning } from '@/hooks/use-offline-learning';

interface OfflineContextType {
  isOnline: boolean;
  offlineModules: any[];
  downloadModule: (module: any) => Promise<void>;
  removeModule: (moduleId: string) => Promise<void>;
  getStorageUsage: () => { used: number; total: number };
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const offlineData = useOfflineLearning();

  return (
    <OfflineContext.Provider value={offlineData}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
