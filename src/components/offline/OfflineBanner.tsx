
import React from 'react';
import { useOfflineContext } from '@/context/OfflineContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineBanner = () => {
  const { isOnline } = useOfflineContext();

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="mb-4 bg-yellow-50 border-yellow-200 text-yellow-800">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>You are offline</AlertTitle>
      <AlertDescription>
        You can continue learning with offline content. Your progress will sync when you're back online.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineBanner;

