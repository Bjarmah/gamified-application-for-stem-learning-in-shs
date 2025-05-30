
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WifiOff, Download, HardDrive } from 'lucide-react';
import { useOfflineLearning } from '@/hooks/use-offline-learning';

const OfflineBanner = () => {
  const { isOnline, offlineModules, getStorageUsage } = useOfflineLearning();
  const { used, total } = getStorageUsage();

  if (isOnline) return null;

  return (
    <Alert className="border-stemOrange bg-stemOrange/10">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <span>You're currently offline</span>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <HardDrive className="h-3 w-3" />
            <span>{used} of {total} modules downloaded</span>
          </div>
        </div>
        {offlineModules.length > 0 && (
          <Button variant="outline" size="sm">
            <Download className="h-3 w-3 mr-1" />
            View Offline Content
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default OfflineBanner;
