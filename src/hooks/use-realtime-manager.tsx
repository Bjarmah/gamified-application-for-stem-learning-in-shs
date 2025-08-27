import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type ChannelConfig = {
  id: string;
  type: 'room' | 'notifications' | 'quiz';
  priority: 'high' | 'medium' | 'low';
  lastActivity: number;
  channel?: any;
};

// Centralized realtime connection manager for optimizing concurrent connections
export const useRealtimeManager = () => {
  const { user } = useAuth();
  const channelsRef = useRef<Map<string, ChannelConfig>>(new Map());
  const maxConnections = 15; // Conservative limit to avoid hitting Supabase limits
  const inactivityTimeout = 5 * 60 * 1000; // 5 minutes
  const cleanupIntervalRef = useRef<NodeJS.Timeout>();

  // Track user activity
  const updateActivity = useCallback(() => {
    const now = Date.now();
    channelsRef.current.forEach((config, id) => {
      if (config.channel) {
        config.lastActivity = now;
      }
    });
  }, []);

  // Activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [updateActivity]);

  // Cleanup inactive channels
  const cleanupInactiveChannels = useCallback(() => {
    const now = Date.now();
    const activeChannels = channelsRef.current.size;

    channelsRef.current.forEach((config, id) => {
      const isInactive = now - config.lastActivity > inactivityTimeout;
      const shouldCleanup = isInactive && activeChannels > maxConnections * 0.8;

      if (shouldCleanup && config.priority === 'low') {
        console.log(`Cleaning up inactive channel: ${id}`);
        if (config.channel) {
          supabase.removeChannel(config.channel);
        }
        channelsRef.current.delete(id);
      }
    });
  }, [maxConnections, inactivityTimeout]);

  // Periodic cleanup
  useEffect(() => {
    cleanupIntervalRef.current = setInterval(cleanupInactiveChannels, 30000); // Every 30 seconds

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, [cleanupInactiveChannels]);

  // Register channel
  const registerChannel = useCallback((
    id: string,
    type: 'room' | 'notifications' | 'quiz',
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    if (!user) return null;

    // Check if we're at connection limit
    const activeChannels = Array.from(channelsRef.current.values()).filter(c => c.channel).length;
    
    if (activeChannels >= maxConnections) {
      // Try to cleanup low priority channels first
      const lowPriorityChannels = Array.from(channelsRef.current.entries())
        .filter(([_, config]) => config.priority === 'low' && config.channel);
      
      if (lowPriorityChannels.length > 0) {
        const [cleanupId, cleanupConfig] = lowPriorityChannels[0];
        console.log(`Cleaning up low priority channel for new connection: ${cleanupId}`);
        supabase.removeChannel(cleanupConfig.channel);
        channelsRef.current.delete(cleanupId);
      } else {
        console.warn(`Connection limit reached (${maxConnections}), cannot create new channel: ${id}`);
        return null;
      }
    }

    const config: ChannelConfig = {
      id,
      type,
      priority,
      lastActivity: Date.now(),
    };

    channelsRef.current.set(id, config);
    return config;
  }, [user, maxConnections]);

  // Set channel for config
  const setChannel = useCallback((id: string, channel: any) => {
    const config = channelsRef.current.get(id);
    if (config) {
      config.channel = channel;
      config.lastActivity = Date.now();
    }
  }, []);

  // Unregister channel
  const unregisterChannel = useCallback((id: string) => {
    const config = channelsRef.current.get(id);
    if (config?.channel) {
      supabase.removeChannel(config.channel);
    }
    channelsRef.current.delete(id);
  }, []);

  // Get connection stats
  const getConnectionStats = useCallback(() => {
    const channels = Array.from(channelsRef.current.values());
    const activeChannels = channels.filter(c => c.channel).length;
    const byType = channels.reduce((acc, config) => {
      acc[config.type] = (acc[config.type] || 0) + (config.channel ? 1 : 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      active: activeChannels,
      total: channels.length,
      limit: maxConnections,
      utilization: Math.round((activeChannels / maxConnections) * 100),
      byType
    };
  }, [maxConnections]);

  // Cleanup all channels on unmount
  useEffect(() => {
    return () => {
      channelsRef.current.forEach((config) => {
        if (config.channel) {
          supabase.removeChannel(config.channel);
        }
      });
      channelsRef.current.clear();
    };
  }, []);

  return {
    registerChannel,
    setChannel,
    unregisterChannel,
    updateActivity,
    getConnectionStats
  };
};