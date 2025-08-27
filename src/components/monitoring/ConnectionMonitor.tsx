import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useRealtimeManager } from '@/hooks/use-realtime-manager';

export const ConnectionMonitor = () => {
  const { getConnectionStats } = useRealtimeManager();
  const [stats, setStats] = useState({
    active: 0,
    total: 0,
    limit: 15,
    utilization: 0,
    byType: {} as Record<string, number>
  });

  useEffect(() => {
    const updateStats = () => {
      setStats(getConnectionStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [getConnectionStats]);

  const getStatusColor = () => {
    if (stats.utilization >= 90) return 'destructive';
    if (stats.utilization >= 70) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (stats.utilization >= 90) return <AlertTriangle className="h-4 w-4" />;
    if (stats.utilization >= 70) return <WifiOff className="h-4 w-4" />;
    return <Wifi className="h-4 w-4" />;
  };

  // Only show in development or for admins
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        <span className="text-sm font-medium">Realtime Connections</span>
      </div>
      
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <Badge variant={getStatusColor()}>
          {stats.active}/{stats.limit} ({stats.utilization}%)
        </Badge>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <div>Active: {stats.active}</div>
        <div>Total Registered: {stats.total}</div>
        <div className="space-y-1">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="flex justify-between">
              <span className="capitalize">{type}:</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {stats.utilization >= 70 && (
        <div className="text-xs text-amber-600 dark:text-amber-400">
          High connection usage detected. Consider optimizing realtime subscriptions.
        </div>
      )}
    </Card>
  );
};