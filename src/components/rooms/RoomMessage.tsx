
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";

export interface MessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    isTeacher?: boolean;
  };
  timestamp: Date;
  isCurrentUser?: boolean;
}

const RoomMessage = ({
  content,
  sender,
  timestamp,
  isCurrentUser = false
}: MessageProps) => {
  return (
    <div className={cn(
      "flex mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1 mr-2">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>{sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[70%]",
        isCurrentUser ? "order-1" : "order-2"
      )}>
        {!isCurrentUser && (
          <div className="flex items-center mb-1">
            <span className="text-sm font-semibold">{sender.name}</span>
            {sender.isTeacher && (
              <span className="ml-2 text-xs bg-stemPurple text-white px-2 py-0.5 rounded-full">Teacher</span>
            )}
          </div>
        )}
        
        <div className={cn(
          "rounded-lg px-4 py-2",
          isCurrentUser 
            ? "bg-stemPurple text-white rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}>
          <p className="text-sm">{content}</p>
        </div>
        
        <div className={cn(
          "text-xs text-muted-foreground mt-1",
          isCurrentUser ? "text-right" : "text-left"
        )}>
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </div>
      </div>
      
      {isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1 ml-2">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>{sender.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default RoomMessage;
