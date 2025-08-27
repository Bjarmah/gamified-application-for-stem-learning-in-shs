import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { useRealtimeManager } from './use-realtime-manager';

type RoomMessage = Database['public']['Tables']['room_messages']['Row'] & { 
  profile?: { full_name?: string } 
};

type PresenceState = Record<string, any[]>;

type TypingUser = {
  user_id: string;
  full_name: string;
  typing_at: string;
};

export const useOptimizedRoomRealtime = (roomId: string) => {
  const { user } = useAuth();
  const { registerChannel, setChannel, unregisterChannel, updateActivity } = useRealtimeManager();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [channel, setChannelState] = useState<any>(null);

  // Throttled typing broadcast to reduce bandwidth
  const lastTypingBroadcast = useRef<number>(0);
  const typingBroadcastDelay = 1000; // 1 second throttle

  // Initialize optimized realtime channel
  useEffect(() => {
    if (!roomId || !user) return;

    const channelId = `room_${roomId}`;
    const config = registerChannel(channelId, 'room', 'high');
    
    if (!config) {
      console.warn('Could not register room channel - connection limit reached');
      return;
    }

    const roomChannel = supabase.channel(channelId, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Handle presence changes (online users) - optimized
    roomChannel
      .on('presence', { event: 'sync' }, () => {
        updateActivity();
        const newState = roomChannel.presenceState();
        const allUsers = Object.values(newState).flat();
        setOnlineUsers(allUsers);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        updateActivity();
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        updateActivity();
      });

    // Handle typing indicators - throttled
    roomChannel.on('broadcast', { event: 'typing' }, ({ payload }) => {
      updateActivity();
      const { user_id, full_name, typing } = payload;
      
      if (user_id === user.id) return;
      
      if (typing) {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.user_id !== user_id);
          return [...filtered, { user_id, full_name, typing_at: new Date().toISOString() }];
        });
      } else {
        setTypingUsers(prev => prev.filter(u => u.user_id !== user_id));
      }
    });

    // Handle new messages - optimized
    roomChannel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        updateActivity();
        const newMessage = payload.new as RoomMessage;
        
        // Batch profile fetching to avoid too many requests
        if (newMessage.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', newMessage.user_id)
            .maybeSingle(); // Use maybeSingle to avoid errors
          
          newMessage.profile = profile || undefined;
        }
        
        setMessages(prev => [...prev.slice(-49), newMessage]); // Keep only last 50 messages
      }
    );

    roomChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        updateActivity();
        // Track presence when subscribed
        await roomChannel.track({
          user_id: user.id,
          full_name: user.email || 'Anonymous',
          online_at: new Date().toISOString(),
        });
      }
    });

    setChannel(channelId, roomChannel);
    setChannelState(roomChannel);

    return () => {
      unregisterChannel(channelId);
    };
  }, [roomId, user, registerChannel, setChannel, unregisterChannel, updateActivity]);

  // Optimized typing cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTypingUsers(prev => 
        prev.filter(user => {
          const typingTime = new Date(user.typing_at);
          return now.getTime() - typingTime.getTime() < 3000; // Reduced to 3 seconds
        })
      );
    }, 2000); // Check every 2 seconds instead of 1

    return () => clearInterval(interval);
  }, []);

  // Throttled broadcast typing status
  const broadcastTyping = useCallback((typing: boolean) => {
    if (!channel || !user) return;
    
    const now = Date.now();
    if (now - lastTypingBroadcast.current < typingBroadcastDelay) return;
    
    lastTypingBroadcast.current = now;
    updateActivity();
    
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        full_name: user.email || 'Anonymous',
        typing
      }
    });
  }, [channel, user, updateActivity]);

  // Get list of online users (excluding current user)
  const getOnlineUsersList = useCallback(() => {
    return onlineUsers.filter((u: any) => u.user_id !== user?.id);
  }, [onlineUsers, user]);

  return {
    messages,
    setMessages,
    onlineUsers: getOnlineUsersList(),
    typingUsers: typingUsers.filter(u => u.user_id !== user?.id),
    broadcastTyping,
  };
};