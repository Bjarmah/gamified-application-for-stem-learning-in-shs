
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Download, HardDrive, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useOfflineLearning } from '@/hooks/use-offline-learning';

const OfflineBanner = () => {
  const { isOnline, offlineModules, syncStatus, getStorageUsage, syncOfflineProgress } = useOfflineLearning();
  const { used, total } = getStorageUsage();

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'idle':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getSyncText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync failed';
      case 'idle':
        return 'Synced';
      default:
        return '';
    }
  };

  if (isOnline && syncStatus === 'idle') return null;

  return (
    <Alert className={`border-stemOrange bg-stemOrange/10 ${!isOnline ? 'border-yellow-500 bg-yellow-50' : ''}`}>
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <span>
            {!isOnline ? "You're currently offline" : "Online"}
          </span>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <HardDrive className="h-3 w-3" />
            <span>{used} of {total} modules downloaded</span>
          </div>
          {isOnline && syncStatus !== 'idle' && (
            <Badge variant="outline" className="flex items-center gap-1">
              {getSyncIcon()}
              <span className="text-xs">{getSyncText()}</span>
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {offlineModules.length > 0 && (
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              View Offline Content
            </Button>
          )}
          {isOnline && syncStatus === 'error' && (
            <Button variant="outline" size="sm" onClick={syncOfflineProgress}>
              Retry Sync
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default OfflineBanner;
