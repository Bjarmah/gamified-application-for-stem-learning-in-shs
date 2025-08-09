import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Wifi,
    WifiOff,
    Clock,
    Trash2
} from 'lucide-react';
import { useSync } from '@/hooks/use-sync';
import { formatDistanceToNow } from 'date-fns';

export const SyncStatus: React.FC = () => {
    const {
        syncStatus,
        performManualSync,
        clearFailed,
        retryFailed,
        performForceSync
    } = useSync();

    if (!syncStatus) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Sync Status
                    </CardTitle>
                    <CardDescription>Loading sync information...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const getHealthIcon = () => {
        switch (syncStatus.healthStatus) {
            case 'healthy':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'critical':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <CheckCircle className="h-4 w-4 text-green-500" />;
        }
    };

    const getHealthColor = () => {
        switch (syncStatus.healthStatus) {
            case 'healthy':
                return 'bg-green-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'critical':
                return 'bg-red-500';
            default:
                return 'bg-green-500';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {syncStatus.isSyncing ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                            getHealthIcon()
                        )}
                        Sync Status
                    </div>
                    <div className="flex items-center gap-2">
                        {syncStatus.isOnline ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <Badge variant={syncStatus.isOnline ? "default" : "destructive"}>
                            {syncStatus.isOnline ? "Online" : "Offline"}
                        </Badge>
                    </div>
                </CardTitle>
                <CardDescription>
                    {syncStatus.isSyncing
                        ? "Syncing data..."
                        : `Last sync: ${formatDistanceToNow(syncStatus.lastSyncTime)} ago`
                    }
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Sync Progress</span>
                        <span>{syncStatus.successRate}%</span>
                    </div>
                    <Progress value={syncStatus.successRate} className="h-2" />
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                        </div>
                        <div className="text-2xl font-bold">{syncStatus.pendingItems}</div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3" />
                            <span>Failed</span>
                        </div>
                        <div className="text-2xl font-bold text-red-500">{syncStatus.failedItems}</div>
                    </div>
                </div>

                {/* Health Status */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getHealthColor()}`} />
                    <span className="text-sm capitalize">
                        {syncStatus.healthStatus} ({syncStatus.totalItems} total items)
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        onClick={performManualSync}
                        disabled={syncStatus.isSyncing || !syncStatus.isOnline}
                    >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                    </Button>

                    {syncStatus.failedItems > 0 && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={retryFailed}
                                disabled={syncStatus.isSyncing}
                            >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Retry Failed
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                onClick={clearFailed}
                                disabled={syncStatus.isSyncing}
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Clear Failed
                            </Button>
                        </>
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={performForceSync}
                        disabled={syncStatus.isSyncing}
                    >
                        Force Sync
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
