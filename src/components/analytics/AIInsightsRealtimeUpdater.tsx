import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Brain, Wifi, WifiOff } from 'lucide-react';

interface AIInsightsRealtimeUpdaterProps {
  className?: string;
  showConnectionStatus?: boolean;
}

export const AIInsightsRealtimeUpdater = ({ 
  className, 
  showConnectionStatus = true 
}: AIInsightsRealtimeUpdaterProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = React.useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  useEffect(() => {
    if (!user?.id) return;

    setConnectionStatus('connecting');

    // Set up real-time subscription for learning insights updates
    const insightsChannel = supabase
      .channel(`learning-insights-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'learning_insights',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time insights update:', payload);
          
          // Invalidate relevant queries to refetch data
          queryClient.invalidateQueries({ 
            queryKey: ['learning-insights', user.id] 
          });
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "🧠 New AI Insights Available",
              description: "Your learning analysis has been updated with fresh insights.",
              duration: 5000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Insights channel status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
      });

    // Set up subscription for analytics data changes
    const analyticsChannel = supabase
      .channel(`user-analytics-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_attempts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time quiz attempt update:', payload);
          
          // Invalidate analytics queries
          queryClient.invalidateQueries({ 
            queryKey: ['analytics-data', user.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['learning-time-patterns', user.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['knowledge-gaps', user.id] 
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time progress update:', payload);
          
          // Invalidate analytics queries
          queryClient.invalidateQueries({ 
            queryKey: ['analytics-data', user.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['learning-time-patterns', user.id] 
          });
        }
      )
      .subscribe();

    // Set up subscription for gamification updates
    const gamificationChannel = supabase
      .channel(`user-gamification-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_gamification',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time gamification update:', payload);
          
          // Invalidate analytics queries
          queryClient.invalidateQueries({ 
            queryKey: ['analytics-data', user.id] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insightsChannel);
      supabase.removeChannel(analyticsChannel);
      supabase.removeChannel(gamificationChannel);
      setConnectionStatus('disconnected');
    };
  }, [user?.id, queryClient, toast]);

  if (!showConnectionStatus) {
    return null;
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'default';
      case 'connecting': return 'secondary';
      case 'disconnected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-3 w-3" />;
      case 'connecting': return <Brain className="h-3 w-3 animate-pulse" />;
      case 'disconnected': return <WifiOff className="h-3 w-3" />;
      default: return <Brain className="h-3 w-3" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'AI Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className={className}>
      <Badge variant={getStatusColor()} className="flex items-center gap-1 text-xs">
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
    </div>
  );
};