import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users } from 'lucide-react';

interface OnlineUser {
  user_id: string;
  full_name: string;
  presence_ref: string;
  online_at: string;
}

interface RealtimePresenceProps {
  roomId?: string;
  context?: string;
}

export const RealtimePresence: React.FC<RealtimePresenceProps> = ({ roomId, context = 'global' }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const channelName = roomId ? `presence:room:${roomId}` : `presence:${context}`;
    
    const presenceChannel = supabase.channel(channelName, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat() as OnlineUser[];
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single();

          await presenceChannel.track({
            user_id: user.id,
            full_name: profile?.full_name || 'Anonymous',
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [user, roomId, context]);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Badge variant="secondary" className="text-xs">
            {onlineUsers.length}
          </Badge>
        </div>
        
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((onlineUser) => (
            <Tooltip key={onlineUser.user_id}>
              <TooltipTrigger>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    {onlineUser.full_name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{onlineUser.full_name}</p>
                <p className="text-xs text-muted-foreground">Online now</p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          {onlineUsers.length > 5 && (
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs">
                    +{onlineUsers.length - 5}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{onlineUsers.length - 5} more online</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};
