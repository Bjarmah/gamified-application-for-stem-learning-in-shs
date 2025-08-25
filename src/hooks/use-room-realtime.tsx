import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';

type RoomMessage = Database['public']['Tables']['room_messages']['Row'] & { 
  profile?: { full_name?: string } 
};

type PresenceState = Record<string, any[]>;

type TypingUser = {
  user_id: string;
  full_name: string;
  typing_at: string;
};

export const useRoomRealtime = (roomId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [channel, setChannel] = useState<any>(null);

  // Initialize realtime channel
  useEffect(() => {
    if (!roomId || !user) return;

    console.log(`Setting up realtime for room: ${roomId}`);
    
    const roomChannel = supabase.channel(`room_${roomId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Handle presence changes (online users)
    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = roomChannel.presenceState();
        console.log('Presence sync:', newState);
        const allUsers = Object.values(newState).flat();
        setOnlineUsers(allUsers);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      });

    // Handle typing indicators
    roomChannel.on('broadcast', { event: 'typing' }, ({ payload }) => {
      console.log('Typing event:', payload);
      const { user_id, full_name, typing } = payload;
      
      if (user_id === user.id) return; // Ignore own typing events
      
      if (typing) {
        setTypingUsers(prev => {
          const filtered = prev.filter(u => u.user_id !== user_id);
          return [...filtered, { user_id, full_name, typing_at: new Date().toISOString() }];
        });
      } else {
        setTypingUsers(prev => prev.filter(u => u.user_id !== user_id));
      }
    });

    // Handle new messages
    roomChannel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${roomId}`
      },
      async (payload) => {
        console.log('New message:', payload);
        const newMessage = payload.new as RoomMessage;
        
        // Get user profile for the message
        if (newMessage.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', newMessage.user_id)
            .single();
          
          newMessage.profile = profile || undefined;
        }
        
        setMessages(prev => [...prev, newMessage]);
      }
    );

    roomChannel.subscribe(async (status) => {
      console.log('Channel status:', status);
      if (status === 'SUBSCRIBED') {
        // Track presence when subscribed
        await roomChannel.track({
          user_id: user.id,
          full_name: user.email || 'Anonymous',
          online_at: new Date().toISOString(),
        });
      }
    });

    setChannel(roomChannel);

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up realtime channel');
      roomChannel.unsubscribe();
    };
  }, [roomId, user]);

  // Clean up typing indicators that are too old
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTypingUsers(prev => 
        prev.filter(user => {
          const typingTime = new Date(user.typing_at);
          return now.getTime() - typingTime.getTime() < 5000; // Remove after 5 seconds
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Broadcast typing status
  const broadcastTyping = useCallback((typing: boolean) => {
    if (!channel || !user) return;
    
    console.log('Broadcasting typing:', typing);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        full_name: user.email || 'Anonymous',
        typing
      }
    });
  }, [channel, user]);

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