
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export interface RoomProps {
  id: string;
  name: string;
  description: string;
  subject: string;
  topic?: string;
  participantCount: number;
  isActive: boolean;
  teacherLed?: boolean;
  imageUrl?: string;
  hasJoined?: boolean;
  onJoin?: (id: string) => void;
}

const RoomCard = ({
  id,
  name,
  description,
  subject,
  topic,
  participantCount,
  isActive,
  teacherLed = false,
  imageUrl,
  hasJoined = false,
  onJoin
}: RoomProps) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                <Link to={`/rooms/${id}`} className="hover:underline">
                  {name}
                </Link>
              </CardTitle>
              <div className="flex items-center text-xs text-muted-foreground">
                <Users size={12} className="mr-1" />
                <span>{participantCount} participants</span>
              </div>
            </div>
          </div>
          <div>
            {isActive ? (
              <Badge variant="default" className="bg-green-500">Active</Badge>
            ) : (
              <Badge variant="outline">Inactive</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex flex-wrap gap-2">
          <Badge variant="secondary">{subject}</Badge>
          {topic && <Badge variant="outline">{topic}</Badge>}
          {teacherLed && <Badge variant="secondary" className="bg-stemPurple text-white">Teacher-led</Badge>}
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        {hasJoined ? (
          <Button variant="default" size="sm" className="w-full">
            <MessageSquare className="mr-2 h-4 w-4" />
            Enter Room
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="w-full"
            onClick={() => onJoin && onJoin(id)}
          >
            Join Room
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
