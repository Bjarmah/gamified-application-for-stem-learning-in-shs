
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MessageSquare, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoomCardProps {
  id: string;
  name: string;
  description: string;
  subject: string;
  memberCount: number;
  maxMembers: number;
  isActive: boolean;
  createdBy: string;
  lastActivity: string;
  participants: Array<{ initials: string; name: string }>;
}

const RoomCard = ({
  id,
  name,
  description,
  subject,
  memberCount,
  maxMembers,
  isActive,
  createdBy,
  lastActivity,
  participants
}: RoomCardProps) => {
  const navigate = useNavigate();

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Physics': 'bg-stemPurple/20 text-stemPurple',
      'Chemistry': 'bg-stemGreen/20 text-stemGreen-dark',
      'Mathematics': 'bg-stemYellow/20 text-stemYellow-dark',
      'Biology': 'bg-stemOrange/20 text-stemOrange-dark'
    };
    return colors[subject] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="card-stem overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getSubjectColor(subject)}>
                <BookOpen className="h-3 w-3 mr-1" />
                {subject}
              </Badge>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            {memberCount}/{maxMembers}
          </div>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Created by {createdBy}</span>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {lastActivity}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Recent participants:</span>
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((participant, index) => (
              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs">{participant.initials}</AvatarFallback>
              </Avatar>
            ))}
            {participants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+{participants.length - 3}</span>
              </div>
            )}
          </div>
        </div>

        <Button 
          className="btn-stem w-full"
          onClick={() => navigate(`/rooms/${id}`)}
          disabled={memberCount >= maxMembers}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          {memberCount >= maxMembers ? "Room Full" : "Join Room"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
